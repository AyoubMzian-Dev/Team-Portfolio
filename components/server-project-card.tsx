import { withServerRenderTracking } from '@/lib/server-render-tracker'

interface ServerProjectCardProps {
  id: number
  title: string
  description: string
  image_url: string
  demo_url?: string
  github_url?: string
  tech_stack: string[]
  featured: boolean
}

function ServerProjectCard({
  id,
  title,
  description,
  image_url,
  demo_url,
  github_url,
  tech_stack,
  featured,
}: ServerProjectCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-card p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex flex-col space-y-4">
        {/* Project Image */}
        <div className="aspect-video relative overflow-hidden rounded-md">
          <img
            src={image_url}
            alt={title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
          />
          {featured && (
            <div className="absolute top-2 right-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Project Content */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {description}
          </p>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1">
          {tech_stack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground"
            >
              {tech}
            </span>
          ))}
          {tech_stack.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
              +{tech_stack.length - 3} more
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {demo_url && (
            <a
              href={demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3"
            >
              View Demo
            </a>
          )}
          {github_url && (
            <a
              href={github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// Export wrapped component with server render tracking
export default withServerRenderTracking(ServerProjectCard, 'ServerProjectCard')
