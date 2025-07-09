import ServerProjectCard from '@/components/server-project-card'
import ServerHeader from '@/components/server-header'
import ServerLayoutWrapper from '@/components/server-layout-wrapper'

// Mock project data
const mockProjects = [
  {
    id: 1,
    title: "E-commerce Platform",
    description: "A full-stack e-commerce solution with payment processing and inventory management",
    image_url: "/placeholder.jpg",
    demo_url: "https://demo.example.com",
    github_url: "https://github.com/example/ecommerce",
    tech_stack: ["Next.js", "TypeScript", "PostgreSQL", "Stripe"],
    featured: true
  },
  {
    id: 2,
    title: "Task Management App",
    description: "Collaborative task management with real-time updates and team collaboration",
    image_url: "/placeholder.jpg",
    demo_url: "https://tasks.example.com",
    github_url: "https://github.com/example/tasks",
    tech_stack: ["React", "Node.js", "MongoDB", "Socket.io"],
    featured: false
  },
  {
    id: 3,
    title: "Analytics Dashboard",
    description: "Business intelligence dashboard with data visualization and reporting",
    image_url: "/placeholder.jpg",
    demo_url: "https://analytics.example.com",
    github_url: "https://github.com/example/analytics",
    tech_stack: ["Vue.js", "D3.js", "Python", "Redis"],
    featured: true
  }
]

export default function ServerRenderTestPage() {
  return (
    <ServerLayoutWrapper page="server-render-test">
      <div className="space-y-8">
        <ServerHeader 
          title="Server Render Test" 
          subtitle="Testing server-side component tracking"
          showBreadcrumb={true}
          currentPage="Server Test"
        />
        
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Server-Side Rendered Projects</h2>
            <p className="text-muted-foreground mb-6">
              These components are rendered on the server and tracked in the performance monitor.
              Open the performance monitor to see server-side render logs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProjects.map((project) => (
              <ServerProjectCard key={project.id} {...project} />
            ))}
          </div>
          
          <div className="mt-12 p-6 border rounded-lg bg-muted/50">
            <h3 className="text-lg font-semibold mb-3">How to Test Server Render Tracking</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Open the floating performance monitor (bottom-right corner)</li>
              <li>Click on the "Server" tab in the performance window</li>
              <li>Refresh this page to see new server render logs</li>
              <li>Navigate between pages to see different server components</li>
              <li>Compare server vs client render performance</li>
            </ol>
          </div>
        </div>
      </div>
    </ServerLayoutWrapper>
  )
}
