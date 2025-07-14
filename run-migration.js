const { sql } = require("./lib/db.ts");
const { readFileSync } = require("fs");
const { join } = require("path");

async function runMigration() {
  try {
    console.log("🔄 Running migration: 002_create_members_and_roles.sql");
    
    const migrationPath = join(process.cwd(), "database", "migrations", "002_create_members_and_roles.sql");
    const migrationSQL = readFileSync(migrationPath, "utf-8");
    
    // Split by semicolon to handle multiple statements
    const statements = migrationSQL
      .split(";")
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith("--"));
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`Executing: ${statement.substring(0, 100)}...`);
        await sql.unsafe(statement + ";");
      }
    }
    
    console.log("✅ Migration completed successfully!");
    
    // Verify tables were created
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('roles', 'members', 'member_projects')
      ORDER BY table_name
    `;
    
    console.log("📋 Created tables:", tables.map(t => t.table_name));
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
