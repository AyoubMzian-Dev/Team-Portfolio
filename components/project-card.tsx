import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import TechBadge from "./tech-badge"

interface ProjectCardProps {
  id: number
  title: string
  description: string
  image_url: string
  demo_url?: string
  github_url?: string
  tech_stack: string[]
  featured: boolean
}

export default function ProjectCard({
  id,
  title,
  description,
  image_url,
  demo_url,
  github_url,
  tech_stack,
  featured,
}: ProjectCardProps) {
  return (
    <div
      className={`glass-card p-6 group hover:scale-105 transition-all duration-300 ${featured ? "glow-effect" : ""}`}
    >
      <div className="relative overflow-hidden rounded-lg mb-4">
        <Image
          src={image_url || "/placeholder.svg"}
          alt={title}
          width={500}
          height={300}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {featured && (
          <div className="absolute top-2 right-2 bg-accent text-primary px-2 py-1 rounded-full text-xs font-medium">
            Featured
          </div>
        )}
      </div>

      <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-accent transition-colors">{title}</h3>

      <p className="text-muted-foreground mb-4 line-clamp-2">{description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {tech_stack.slice(0, 3).map((tech) => (
          <TechBadge key={tech} tech={tech} variant="accent" />
        ))}
        {tech_stack.length > 3 && <span className="text-xs text-muted-foreground">+{tech_stack.length - 3} more</span>}
      </div>

      <div className="flex items-center justify-between">
        <Link href={`/projects/${id}`}>
          <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent hover:text-primary">
            View Details
          </Button>
        </Link>

        <div className="flex space-x-2">
          {demo_url && (
            <a
              href={demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-accent transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          {github_url && (
            <a
              href={github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-accent transition-colors"
            >
              <Github className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
