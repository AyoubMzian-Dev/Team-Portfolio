import TechIcon from "./tech-icons"

interface TechBadgeProps {
  tech: string
  variant?: "default" | "accent" | "teal" | "cyan"
  showIcon?: boolean
  size?: "sm" | "md" | "lg"
}

export default function TechBadge({ tech, variant = "default", showIcon = true, size = "md" }: TechBadgeProps) {
  const variants = {
    default: "bg-muted/50 text-muted-foreground border-muted hover:bg-muted/70",
    accent: "bg-accent/10 text-accent border-accent/20 hover:bg-accent/20",
    teal: "bg-accent-teal/10 text-accent-teal border-accent-teal/20 hover:bg-accent-teal/20",
    cyan: "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20 hover:bg-accent-cyan/20",
  }

  const sizes = {
    sm: "px-2 py-1 text-xs gap-1",
    md: "px-3 py-1.5 text-sm gap-2",
    lg: "px-4 py-2 text-base gap-2",
  }

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium border transition-all duration-300 hover:scale-105 ${variants[variant]} ${sizes[size]}`}
    >
      {showIcon && <TechIcon tech={tech} size={size === "lg" ? "md" : "sm"} />}
      {tech}
    </span>
  )
}
