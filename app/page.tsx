import Link from "next/link"
import { ArrowRight, Code2, Zap, Users, Rocket, Smartphone, Search, Palette, Server, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import TechBadge from "@/components/tech-badge"
import ProjectCard from "@/components/project-card"
import { sql } from "@/lib/db"

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
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-primary">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,212,255,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,255,136,0.1),transparent_50%)]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-foreground">We Build</span>
              <br />
              <span className="text-gradient">Amazing Web Apps</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              A passionate team of developers creating modern, scalable, and beautiful web applications using
              cutting-edge technologies.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/projects">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-primary font-semibold px-8 py-3 glow-effect"
                >
                  View Our Work
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-accent text-accent hover:bg-accent hover:text-primary px-8 py-3"
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
          <div className="w-6 h-10 border-2 border-accent rounded-full flex justify-center">
            <div className="w-1 h-3 bg-accent rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">Why Choose Us</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We combine technical expertise with creative vision to deliver exceptional web solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/30 transition-colors">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
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
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Showcasing our latest and greatest work that demonstrates our expertise and creativity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>

          <div className="text-center">
            <Link href="/projects">
              <Button
                variant="outline"
                size="lg"
                className="border-accent text-accent hover:bg-accent hover:text-primary"
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
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From concept to deployment, we provide comprehensive web development services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: Code2,
                title: "Frontend Development",
                description: "Modern, responsive interfaces with React, Next.js, and cutting-edge CSS frameworks.",
                color: "accent",
              },
              {
                icon: Server,
                title: "Backend Development",
                description: "Robust APIs, databases, and server-side solutions built for scale.",
                color: "green",
              },
              {
                icon: Palette,
                title: "UI/UX Design",
                description: "Beautiful, intuitive designs that enhance user experience and engagement.",
                color: "purple",
              },
              {
                icon: Smartphone,
                title: "Mobile Development",
                description: "Cross-platform mobile apps that work seamlessly across all devices.",
                color: "accent",
              },
              {
                icon: Search,
                title: "SEO Optimization",
                description: "Improve search rankings and drive organic traffic to your website.",
                color: "green",
              },
              {
                icon: Zap,
                title: "Performance",
                description: "Lightning-fast websites with exceptional user experiences.",
                color: "purple",
              },
            ].map((service, index) => (
              <div key={index} className="glass-card p-6 group hover:scale-105 transition-all duration-300">
                <div
                  className={`w-12 h-12 bg-${service.color}/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-${service.color}/30 transition-colors`}
                >
                  <service.icon className={`h-6 w-6 text-${service.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm">{service.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/services">
              <Button
                variant="outline"
                size="lg"
                className="border-accent text-accent hover:bg-accent hover:text-primary"
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
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
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
            <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-accent-green/10 to-accent-purple/10" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-6">Ready to Start Your Project?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Let's discuss how we can help bring your vision to life. Get in touch with our team today.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link href="/contact">
                  <Button
                    size="lg"
                    className="bg-accent hover:bg-accent/90 text-primary font-semibold px-8 py-3 glow-effect"
                  >
                    <Mail className="mr-2 h-5 w-5" />
                    Get In Touch
                  </Button>
                </Link>
                <a href="mailto:hello@devteam.com">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-accent text-accent hover:bg-accent hover:text-primary px-8 py-3"
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    Call Us Now
                  </Button>
                </a>
              </div>

              <div className="flex justify-center space-x-6 text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">hello@devteam.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
