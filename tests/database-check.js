const { neon } = require('@neondatabase/serverless');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!DATABASE_URL) {
  console.error('❌ No database URL found in environment variables');
  console.log('Available env vars:', Object.keys(process.env).filter(key => key.includes('DATABASE') || key.includes('POSTGRES')));
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function checkAndFixDatabase() {
  try {
    console.log('🔍 Checking current projects table structure...');
    console.log('📡 Using database:', DATABASE_URL.substring(0, 30) + '...');
    
    // Check current table structure
    const columns = await sql`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'projects' 
      ORDER BY ordinal_position
    `;
    
    console.log('📋 Current table structure:');
    columns.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
    // Check if required columns exist
    const hasCategory = columns.some(col => col.column_name === 'category');
    const hasUpdatedAt = columns.some(col => col.column_name === 'updated_at');
    
    if (!hasCategory || !hasUpdatedAt) {
      console.log('❌ Some required columns missing, adding them...');
      
      // Add missing columns
      if (!hasCategory) {
        await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS category VARCHAR(50)`;
        console.log('✅ Added category column');
      }
      
      await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS long_description TEXT`;
      console.log('✅ Added long_description column');
      
      await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'draft'`;
      console.log('✅ Added status column');
      
      if (!hasUpdatedAt) {
        await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()`;
        console.log('✅ Added updated_at column');
        
        // Update existing records to have updated_at value
        await sql`UPDATE projects SET updated_at = COALESCE(created_at, NOW()) WHERE updated_at IS NULL`;
        console.log('✅ Updated existing records with updated_at values');
      }
      
      // Create indexes
      try {
        await sql`CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at)`;
        console.log('✅ Created indexes');
      } catch (indexError) {
        console.log('⚠️ Some indexes may already exist:', indexError.message);
      }
      
      // Update existing projects
      await sql`UPDATE projects SET status = 'draft' WHERE status IS NULL`;
      console.log('✅ Updated existing projects with draft status');
      
      console.log('✅ Database migration completed successfully!');
    } else {
      console.log('✅ All required columns already exist');
    }
    
    // Check final structure
    const finalColumns = await sql`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'projects' 
      ORDER BY ordinal_position
    `;
    
    console.log('📋 Final table structure:');
    finalColumns.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
  } catch (error) {
    console.error('❌ Database migration failed:', error);
  }
}

checkAndFixDatabase();
