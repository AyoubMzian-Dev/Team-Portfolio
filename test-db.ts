import { sql } from "./lib/db";

async function testDatabase() {
  try {
    console.log("🔍 Testing database connection...");
    
    // Check if we can connect
    const result = await sql`SELECT NOW() as current_time`;
    console.log("✅ Database connected at:", result[0].current_time);
    
    // Check existing tables
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    console.log("📋 Existing tables:", tables.map(t => t.table_name));
    
    // Check if our new tables exist
    const memberTables = tables.filter(t => 
      ['roles', 'members', 'member_projects'].includes(t.table_name)
    );
    
    if (memberTables.length === 0) {
      console.log("⚠️  Member management tables don't exist yet. Running migration...");
      
      // Read and execute migration
      const migrationSQL = `
        -- Create roles table
        CREATE TABLE IF NOT EXISTS roles (
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) UNIQUE NOT NULL,
            display_name VARCHAR(100) NOT NULL,
            description TEXT,
            permissions JSONB DEFAULT '[]'::jsonb,
            color VARCHAR(20) DEFAULT 'gray',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create members table
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
        );

        -- Create member_projects junction table
        CREATE TABLE IF NOT EXISTS member_projects (
            id SERIAL PRIMARY KEY,
            member_id INTEGER REFERENCES members(id) ON DELETE CASCADE,
            project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
            role VARCHAR(50),
            assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(member_id, project_id)
        );

        -- Insert default roles
        INSERT INTO roles (name, display_name, description, permissions, color) VALUES
            ('ADMIN', 'Administrator', 'Full system access with all permissions', 
             '["CREATE", "READ", "UPDATE", "DELETE", "MANAGE_USERS", "MANAGE_ROLES"]'::jsonb, 'red'),
            ('MEMBER', 'Team Member', 'Standard access with project management capabilities', 
             '["CREATE", "READ", "UPDATE"]'::jsonb, 'blue'),
            ('VIEWER', 'Viewer', 'Read-only access to view content', 
             '["READ"]'::jsonb, 'gray')
        ON CONFLICT (name) DO NOTHING;
      `;
      
      await sql.unsafe(migrationSQL);
      console.log("✅ Migration completed!");
      
    } else {
      console.log("✅ Member management tables already exist:", memberTables.map(t => t.table_name));
    }
    
    // Check roles
    const roles = await sql`SELECT * FROM roles ORDER BY created_at`;
    console.log("👥 Available roles:", roles.map(r => r.name));
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Database test failed:", error);
    process.exit(1);
  }
}

testDatabase();
