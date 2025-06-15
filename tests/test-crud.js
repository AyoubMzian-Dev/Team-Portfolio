// Test script to verify CRUD operations
import { createProject, getProjects, updateProject, deleteProject } from '../lib/actions/projects.js'

console.log('🚀 Starting CRUD test...')

// Test data
const testProjectData = {
  title: "Test Project CRUD Fix",
  description: "Testing the fixed CRUD operations",
  long_description: "This is a test project to verify that our CRUD fixes are working properly.",
  tech_stack: ["React", "Next.js", "TypeScript"],
  category: "Web Application",
  status: "draft",
  featured: false,
  image_url: "",
  demo_url: "",
  github_url: ""
}

async function testCRUD() {
  try {
    console.log('📋 1. Testing CREATE operation...')
    const newProject = await createProject(testProjectData)
    console.log('✅ CREATE successful:', newProject.id, newProject.title)

    console.log('\n📋 2. Testing READ operation...')
    const projects = await getProjects()
    console.log('✅ READ successful: Found', projects.length, 'projects')

    console.log('\n📋 3. Testing UPDATE operation...')
    const updatedProject = await updateProject(newProject.id, {
      title: "Test Project CRUD Fix - UPDATED",
      status: "published"
    })
    console.log('✅ UPDATE successful:', updatedProject.title, 'Status:', updatedProject.status)

    console.log('\n📋 4. Testing DELETE operation...')
    await deleteProject(newProject.id)
    console.log('✅ DELETE successful')

    console.log('\n🎉 All CRUD operations completed successfully!')

  } catch (error) {
    console.error('❌ CRUD test failed:', error.message)
    if (error.stack) {
      console.error('Stack trace:', error.stack)
    }
  }
}

testCRUD()
