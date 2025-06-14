import Link from "next/link"
import { ArrowRight, Code2, Zap, Users, Rocket, Smartphone, Search, Palette, Server, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import TechBadge from "@/components/tech-badge"
import ProjectCard from "@/components/project-card"
import { sql } from "@/lib/db"
import { theme } from "@/lib/theme-config"

async function getFeaturedProjects() {
  const projects = await sql`
    SELECT * FROM projects 
    WHERE featured = true 
    ORDER BY created_at DESC 
    LIMIT 3
  `
  return projects
}

export default async function HomePage() {
  const featuredProjects = await getFeaturedProjects()

  const techStack = ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL", "Vercel"]

  const features = [
    {
      icon: Code2,
      title: "Modern Development",
      description: "Using cutting-edge technologies and best practices to build scalable applications.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance and lightning-fast load times for exceptional user experience.",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Experienced team working together to deliver high-quality solutions.",
    },
    {
      icon: Rocket,
      title: "Rapid Deployment",
      description: "Efficient development process with continuous integration and deployment.",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0" style={{ 
          background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary}, ${theme.colors.primary})` 
        }}>
          <div 
            className="absolute inset-0" 
            style={{ 
              background: `radial-gradient(circle at 50% 50%, ${theme.colors.accent}1A, transparent 50%)` 
            }} 
          />
          <div 
            className="absolute inset-0" 
            style={{ 
              background: `radial-gradient(circle at 80% 20%, ${theme.colors.accentCyan}1A, transparent 50%)` 
            }} 
          />
          <div 
            className="absolute inset-0" 
            style={{ 
              background: `radial-gradient(circle at 20% 80%, ${theme.colors.accentTeal}1A, transparent 50%)` 
            }} 
          />
        </div>

        <div className="relative font-Desplay z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span style={{ color: theme.colors.text }}>We Build</span>
              <br />
              <span className=" text-gradient">Amazing Web Apps</span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto" style={{ color: theme.colors.textMuted }}>
              A passionate team of developers creating modern, scalable, and beautiful web applications using
              cutting-edge technologies.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/projects">
                <Button
                  size="lg"
                  className="font-semibold px-8 py-3 glow-effect"
                  style={{
                    backgroundColor: theme.colors.accent,
                    color: theme.colors.primary,
                  }}
                >
                  View Our Work
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-3"
                  style={{
                    borderColor: theme.colors.accent,
                    color: theme.colors.accent,
                  }}
                >
                  Get In Touch
                </Button>
              </Link>
            </div>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-3 justify-center">
              {techStack.map((tech) => (
                <TechBadge key={tech} tech={tech} variant="accent" />
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div 
            className="w-6 h-10 border-2 rounded-full flex justify-center"
            style={{ borderColor: theme.colors.accent }}
          >
            <div 
              className="w-1 h-3 rounded-full mt-2 animate-pulse"
              style={{ backgroundColor: theme.colors.accent }}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">Why Choose Us</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: theme.colors.textMuted }}>
              We combine technical expertise with creative vision to deliver exceptional web solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: `${theme.colors.accent}33` }}
                >
                  <feature.icon className="h-6 w-6" style={{ color: theme.colors.accent }} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: theme.colors.text }}>
                  {feature.title}
                </h3>
                <p className="text-sm" style={{ color: theme.colors.textMuted }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">Featured Projects</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: theme.colors.textMuted }}>
              Showcasing our latest and greatest work that demonstrates our expertise and creativity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project.id || index} {...project} />
            ))}
          </div>

          <div className="text-center">
            <Link href="/projects">
              <Button
                variant="outline"
                size="lg"
                style={{
                  borderColor: theme.colors.accent,
                  color: theme.colors.accent,
                }}
              >
                View All Projects
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">What We Do</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: theme.colors.textMuted }}>
              From concept to deployment, we provide comprehensive web development services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: Code2,
                title: "Frontend Development",
                description: "Modern, responsive interfaces with React, Next.js, and cutting-edge CSS frameworks.",
                color: theme.colors.accent,
              },
              {
                icon: Server,
                title: "Backend Development",
                description: "Robust APIs, databases, and server-side solutions built for scale.",
                color: theme.colors.accentTeal,
              },
              {
                icon: Palette,
                title: "UI/UX Design",
                description: "Beautiful, intuitive designs that enhance user experience and engagement.",
                color: theme.colors.accentCyan,
              },
              {
                icon: Smartphone,
                title: "Mobile Development",
                description: "Cross-platform mobile apps that work seamlessly across all devices.",
                color: theme.colors.accent,
              },
              {
                icon: Search,
                title: "SEO Optimization",
                description: "Improve search rankings and drive organic traffic to your website.",
                color: theme.colors.accentTeal,
              },
              {
                icon: Zap,
                title: "Performance",
                description: "Lightning-fast websites with exceptional user experiences.",
                color: theme.colors.accentCyan,
              },
            ].map((service, index) => (
              <div key={index} className="glass-card p-6 group hover:scale-105 transition-all duration-300">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: `${service.color}33` }}
                >
                  <service.icon className="h-6 w-6" style={{ color: service.color }} />
                </div>
                <h3 
                  className="text-lg font-semibold mb-2 transition-colors"
                  style={{ color: theme.colors.text }}
                >
                  {service.title}
                </h3>
                <p className="text-sm" style={{ color: theme.colors.textMuted }}>
                  {service.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/services">
              <Button
                variant="outline"
                size="lg"
                style={{
                  borderColor: theme.colors.accent,
                  color: theme.colors.accent,
                }}
              >
                View All Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: "50+", label: "Projects Completed" },
                { number: "25+", label: "Happy Clients" },
                { number: "4", label: "Team Members" },
                { number: "99%", label: "Client Satisfaction" },
              ].map((stat, index) => (
                <div key={index} className="group">
                  <div className="text-3xl md:text-4xl font-bold text-gradient mb-2 group-hover:scale-110 transition-transform">
                    {stat.number}
                  </div>
                  <div className="text-sm" style={{ color: theme.colors.textMuted }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-12 text-center relative overflow-hidden">
            {/* Background Effects */}
            <div 
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to right, ${theme.colors.accent}1A, ${theme.colors.accentTeal}1A, ${theme.colors.accentCyan}1A)`
              }}
            />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-6">Ready to Start Your Project?</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: theme.colors.textMuted }}>
                Let's discuss how we can help bring your vision to life. Get in touch with our team today.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link href="/contact">
                  <Button
                    size="lg"
                    className="font-semibold px-8 py-3 glow-effect"
                    style={{
                      backgroundColor: theme.colors.accent,
                      color: theme.colors.primary,
                    }}
                  >
                    <Mail className="mr-2 h-5 w-5" />
                    Get In Touch
                  </Button>
                </Link>
                <a href="mailto:ayoubmziandeveloper@gmail.com">
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-3"
                    style={{
                      borderColor: theme.colors.accent,
                      color: theme.colors.accent,
                    }}
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    Call Us Now
                  </Button>
                </a>
              </div>

              <div className="flex justify-center space-x-6" style={{ color: theme.colors.textMuted }}>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">ayoubmziandeveloper@gmail.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">+212 773473782</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
