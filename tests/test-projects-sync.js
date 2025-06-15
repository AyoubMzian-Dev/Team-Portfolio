/**
 * Test script to verify the projects sync functionality
 * This tests the useProjectsSync hook and table refresh behavior
 */

const { createProject } = require('../lib/actions/projects');

async function testProjectsSync() {
  console.log('🧪 Testing Projects Sync Functionality...\n');
  
  const testProject = {
    title: 'Sync Test Project',
    description: 'Testing automatic table refresh functionality',
    long_description: 'This project is created to test whether the table refreshes automatically after project creation.',
    tech_stack: ['React', 'Next.js', 'TypeScript', 'Testing'],
    category: 'Web Application',
    status: 'draft',
    featured: false,
    image_url: '',
    demo_url: '',
    github_url: ''
  };

  try {
    console.log('📝 Creating test project...');
    const newProject = await createProject(testProject);
    console.log('✅ Test project created successfully!');
    console.log(`   - ID: ${newProject.id}`);
    console.log(`   - Title: ${newProject.title}`);
    console.log(`   - Tech Stack: ${newProject.tech_stack.join(', ')}`);
    console.log(`   - Created At: ${newProject.created_at}`);
    
    console.log('\n🔍 Verification:');
    console.log('   1. Check if the project appears in the admin table immediately');
    console.log('   2. Verify the project count updates automatically');
    console.log('   3. Confirm no page refresh is needed');
    console.log('   4. Check if the refresh button shows the latest data');
    console.log('   5. Verify polling mechanism updates data after 30 seconds');
    
    console.log('\n🚀 Visit http://localhost:3001/admin/projects to test the UI');
    console.log('💡 The new project should appear automatically without refreshing the page!');
    
    return newProject;
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    throw error;
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testProjectsSync()
    .then(() => {
      console.log('\n✅ Test completed! Check the admin interface.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Test failed:', error);
      process.exit(1);
    });
}

module.exports = { testProjectsSync };
