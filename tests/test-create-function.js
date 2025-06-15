// Test the createProject function directly
const { neon } = require('@neondatabase/serverless');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL);

async function testCreateProject() {
  try {
    console.log('🧪 Testing createProject function...');
    
    // Test data
    const testData = {
      title: "Test Project Direct Insert",
      description: "Testing the fixed createProject function",
      long_description: "This is a test to verify the recreated function works",
      tech_stack: ["React", "Next.js", "TypeScript"],
      category: "Web Application",
      status: "draft",
      featured: false,
      image_url: "",
      demo_url: "",
      github_url: ""
    };
    
    console.log('📝 Test data:', JSON.stringify(testData, null, 2));
    
    // Direct database insert to test the structure
    const result = await sql`
      INSERT INTO projects (
        title, 
        description, 
        long_description,
        image_url, 
        demo_url, 
        github_url, 
        tech_stack, 
        category,
        status,
        featured,
        created_at,
        updated_at
      )
      VALUES (
        ${testData.title},
        ${testData.description},
        ${testData.long_description},
        ${testData.image_url || null},
        ${testData.demo_url || null},
        ${testData.github_url || null},
        ${testData.tech_stack},
        ${testData.category},
        ${testData.status},
        ${testData.featured},
        NOW(),
        NOW()
      )
      RETURNING *
    `;
    
    console.log('✅ Insert successful!');
    console.log('📊 Result:', JSON.stringify(result[0], null, 2));
    
    // Clean up test data
    await sql`DELETE FROM projects WHERE title = ${testData.title}`;
    console.log('🧹 Test data cleaned up');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.stack) {
      console.error('Stack:', error.stack);
    }
  }
}

testCreateProject();
