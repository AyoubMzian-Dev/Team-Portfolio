import { sql } from "./lib/db";

async function setupDatabase() {
  try {
    console.log("🔄 Setting up database tables...");
    
    // Check if tables already exist
    const existingTables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('roles', 'members', 'member_projects')
    `;
    
    if (existingTables.length > 0) {
      console.log("📋 Tables already exist:", existingTables.map(t => t.table_name));
      return;
    }
    
    console.log("🔧 Creating roles table...");
    await sql`
      CREATE TABLE IF NOT EXISTS roles (
          id SERIAL PRIMARY KEY,
          name VARCHAR(50) UNIQUE NOT NULL,
          display_name VARCHAR(100) NOT NULL,
          description TEXT,
          permissions JSONB DEFAULT '[]'::jsonb,
          color VARCHAR(20) DEFAULT 'gray',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    console.log("🔧 Creating members table...");
    await sql`
      CREATE TABLE IF NOT EXISTS members (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          role_id INTEGER REFERENCES roles(id) ON DELETE SET NULL,
          status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
          avatar_url TEXT,
          title VARCHAR(100),
          department VARCHAR(100),
          bio TEXT,
          skills JSONB DEFAULT '[]'::jsonb,
          links JSONB DEFAULT '{}'::jsonb,
          join_date DATE DEFAULT CURRENT_DATE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    console.log("🔧 Creating member_projects table...");
    await sql`
      CREATE TABLE IF NOT EXISTS member_projects (
          id SERIAL PRIMARY KEY,
          member_id INTEGER REFERENCES members(id) ON DELETE CASCADE,
          project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
          role VARCHAR(50),
          assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(member_id, project_id)
      )
    `;

    console.log("🔧 Creating indexes...");
    await sql`CREATE INDEX IF NOT EXISTS idx_members_email ON members(email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_members_role_id ON members(role_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_members_status ON members(status)`;

    console.log("🔧 Creating update trigger function...");
    await sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql'
    `;

    await sql`
      CREATE TRIGGER update_roles_updated_at 
          BEFORE UPDATE ON roles 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `;

    await sql`
      CREATE TRIGGER update_members_updated_at 
          BEFORE UPDATE ON members 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `;

    console.log("🔧 Inserting default roles...");
    await sql`
      INSERT INTO roles (name, display_name, description, permissions, color) VALUES
          ('ADMIN', 'Administrator', 'Full system access with all permissions', 
           '["CREATE", "READ", "UPDATE", "DELETE", "MANAGE_USERS", "MANAGE_ROLES"]'::jsonb, 'red'),
          ('MEMBER', 'Team Member', 'Standard access with project management capabilities', 
           '["CREATE", "READ", "UPDATE"]'::jsonb, 'blue'),
          ('VIEWER', 'Viewer', 'Read-only access to view content', 
           '["READ"]'::jsonb, 'gray')
      ON CONFLICT (name) DO NOTHING
    `;

    console.log("✅ Database setup completed successfully!");
    
    // Verify setup
    const finalTables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('roles', 'members', 'member_projects')
      ORDER BY table_name
    `;
    
    const rolesCount = await sql`SELECT COUNT(*) as count FROM roles`;
    
    console.log("📋 Created tables:", finalTables.map(t => t.table_name));
    console.log("📋 Default roles created:", rolesCount[0].count);
    
  } catch (error) {
    console.error("❌ Database setup failed:", error);
    throw error;
  }
}

// Export for use in pages or API routes
export { setupDatabase };

// Run if called directly
if (require.main === module) {
  setupDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
