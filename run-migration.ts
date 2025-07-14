import { sql } from "./lib/db";
import { readFileSync } from "fs";
import { join } from "path";

async function runMigration() {
  try {
    console.log("🔄 Running migration: 002_create_members_and_roles.sql");
    
    const migrationPath = join(process.cwd(), "database", "migrations", "002_create_members_and_roles.sql");
    const migrationSQL = readFileSync(migrationPath, "utf-8");
    
    // Execute the full migration
    await sql.unsafe(migrationSQL);
    
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
