import Image from "next/image"
import { Github, Linkedin, Twitter } from "lucide-react"
import TechBadge from "./tech-badge"

interface TeamMemberCardProps {
  name: string
  role: string
  bio: string
  image_url: string
  github_url?: string
  linkedin_url?: string
  twitter_url?: string
  skills: string[]
}

export default function TeamMemberCard({
  name,
  role,
  bio,
  image_url,
  github_url,
  linkedin_url,
  twitter_url,
  skills,
}: TeamMemberCardProps) {
  return (
    <div className="glass-card p-6 group hover:scale-105 transition-all duration-300">
      <div className="text-center mb-4">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <Image
            src={image_url || "/placeholder.svg"}
            alt={name}
            fill
            className="rounded-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <h3 className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors">{name}</h3>
        <p className="text-accent font-medium">{role}</p>
      </div>

      <p className="text-muted-foreground text-sm mb-4 text-center">{bio}</p>

      <div className="flex flex-wrap gap-1 justify-center mb-4">
        {skills.slice(0, 4).map((skill) => (
          <TechBadge key={skill} tech={skill} variant="default" />
        ))}
      </div>

      <div className="flex justify-center space-x-3">
        {github_url && (
          <a
            href={github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-accent transition-colors"
          >
            <Github className="h-5 w-5" />
          </a>
        )}
        {linkedin_url && (
          <a
            href={linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-accent transition-colors"
          >
            <Linkedin className="h-5 w-5" />
          </a>
        )}
        {twitter_url && (
          <a
            href={twitter_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-accent transition-colors"
          >
            <Twitter className="h-5 w-5" />
          </a>
        )}
      </div>
    </div>
  )
}
