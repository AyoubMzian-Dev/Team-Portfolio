// Simple test to check database connection and basic operations
const { sql } = require('@/lib/db')

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...')
    
    // Test basic connection
    const result = await sql`SELECT NOW() as current_time`
    console.log('✅ Database connected successfully at:', result[0].current_time)
    
    // Test table structure
    const columns = await sql`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'projects' 
      ORDER BY ordinal_position
    `
    
    console.log('📋 Projects table structure:')
    columns.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`)
    })
    
    // Test current project count
    const projectCount = await sql`SELECT COUNT(*) as count FROM projects`
    console.log('📊 Current project count:', projectCount[0].count)
    
    console.log('🎉 Database test completed successfully!')
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message)
    if (error.stack) {
      console.error('Stack trace:', error.stack)
    }
  }
}

testDatabase()
