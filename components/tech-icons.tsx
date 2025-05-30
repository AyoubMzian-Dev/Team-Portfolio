import { Code2, Database, Globe, Palette, Server, Layers, Cloud } from "lucide-react"

interface TechIconProps {
  tech: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function TechIcon({ tech, size = "md", className = "" }: TechIconProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  const iconClass = `${sizeClasses[size]} ${className}`

  // Simplified tech icons using Lucide icons for now
  const getTechIcon = (techName: string) => {
    const lowerTech = techName.toLowerCase()

    if (
      lowerTech.includes("next") ||
      lowerTech.includes("react") ||
      lowerTech.includes("javascript") ||
      lowerTech.includes("typescript")
    ) {
      return <Code2 className={iconClass} />
    }
    if (lowerTech.includes("tailwind") || lowerTech.includes("css") || lowerTech.includes("figma")) {
      return <Palette className={iconClass} />
    }
    if (lowerTech.includes("node") || lowerTech.includes("express")) {
      return <Server className={iconClass} />
    }
    if (lowerTech.includes("postgres") || lowerTech.includes("mongo") || lowerTech.includes("database")) {
      return <Database className={iconClass} />
    }
    if (lowerTech.includes("vercel") || lowerTech.includes("aws") || lowerTech.includes("cloud")) {
      return <Cloud className={iconClass} />
    }
    if (lowerTech.includes("docker") || lowerTech.includes("kubernetes")) {
      return <Layers className={iconClass} />
    }
    if (lowerTech.includes("api") || lowerTech.includes("rest") || lowerTech.includes("graphql")) {
      return <Globe className={iconClass} />
    }

    return <Code2 className={iconClass} />
  }

  return getTechIcon(tech)
}
