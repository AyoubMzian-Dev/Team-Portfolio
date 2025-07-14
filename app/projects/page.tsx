import SectionHeading from "@/components/section-heading"
import ProjectCard from "@/components/project-card"
import { sql } from "@/lib/db"
export const revalidate = 3600;

async function getProjects() {
  const projects = await sql`
    SELECT * FROM projects 
    ORDER BY featured DESC, created_at DESC
  `
  return projects
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="min-h-screen px-12 pt-20">
      {/* Hero Section */}
      <section className=" w-full sm:py-12 lg:py-20">
        <div className="max-w-7xl mx-auto  sm:px-6 lg:px-8">
          <SectionHeading
            title="Our Projects"
            subtitle="Explore our portfolio of innovative web applications and digital solutions"
            centered
          />
        </div>
      </section>

      {/* Projects Grid */}
      <section className="sm:py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>

          {projects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No projects found.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
