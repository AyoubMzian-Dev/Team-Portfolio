interface SectionHeadingProps {
  title: string
  subtitle?: string
  centered?: boolean
}

export default function SectionHeading({ title, subtitle, centered = false }: SectionHeadingProps) {
  return (
    <div className={`mb-12 ${centered ? "text-center" : ""}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">{title}</h2>
      {subtitle && <p className="text-lg text-muted-foreground max-w-2xl">{subtitle}</p>}
    </div>
  )
}
