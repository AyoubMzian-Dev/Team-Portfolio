import { Code, Palette, Server, Smartphone, Search, Zap } from "lucide-react"
import SectionHeading from "@/components/section-heading"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ServicesPage() {
  const services = [
    {
      icon: Code,
      title: "Frontend Development",
      description: "Modern, responsive user interfaces built with React, Next.js, and cutting-edge CSS frameworks.",
      features: ["React & Next.js", "Responsive Design", "Performance Optimization", "Accessibility"],
      color: "accent",
    },
    {
      icon: Server,
      title: "Backend Development",
      description: "Robust server-side solutions with APIs, databases, and cloud infrastructure.",
      features: ["RESTful APIs", "Database Design", "Cloud Deployment", "Security"],
      color: "green",
    },
    {
      icon: Palette,
      title: "UI/UX Design",
      description: "Beautiful, intuitive designs that enhance user experience and drive engagement.",
      features: ["User Research", "Wireframing", "Prototyping", "Design Systems"],
      color: "purple",
    },
    {
      icon: Smartphone,
      title: "Mobile Development",
      description: "Cross-platform mobile applications that work seamlessly across all devices.",
      features: ["React Native", "Progressive Web Apps", "Native Performance", "App Store Deployment"],
      color: "accent",
    },
    {
      icon: Search,
      title: "SEO Optimization",
      description: "Improve your search engine rankings and drive organic traffic to your website.",
      features: ["Technical SEO", "Content Optimization", "Performance Audits", "Analytics"],
      color: "green",
    },
    {
      icon: Zap,
      title: "Performance Optimization",
      description: "Lightning-fast websites that provide exceptional user experiences.",
      features: ["Core Web Vitals", "Code Splitting", "Image Optimization", "Caching Strategies"],
      color: "purple",
    },
  ]

  const process = [
    {
      step: "01",
      title: "Discovery",
      description: "We start by understanding your business goals, target audience, and project requirements.",
    },
    {
      step: "02",
      title: "Planning",
      description: "We create a detailed project roadmap with timelines, milestones, and deliverables.",
    },
    {
      step: "03",
      title: "Design",
      description: "Our designers create beautiful, user-centered designs that align with your brand.",
    },
    {
      step: "04",
      title: "Development",
      description: "We build your application using modern technologies and best practices.",
    },
    {
      step: "05",
      title: "Testing",
      description: "Rigorous testing ensures your application works flawlessly across all devices.",
    },
    {
      step: "06",
      title: "Launch",
      description: "We deploy your application and provide ongoing support and maintenance.",
    },
  ]

  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Our Services"
            subtitle="Comprehensive web development solutions tailored to your business needs"
            centered
          />
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="glass-card p-8 group hover:scale-105 transition-all duration-300">
                <div
                  className={`w-12 h-12 bg-${service.color}/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-${service.color}/30 transition-colors`}
                >
                  <service.icon className={`h-6 w-6 text-${service.color}`} />
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-accent transition-colors">
                  {service.title}
                </h3>

                <p className="text-muted-foreground mb-6">{service.description}</p>

                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                      <div className={`w-1.5 h-1.5 bg-${service.color} rounded-full mr-3`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Our Process" subtitle="How we bring your ideas to life" centered />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {process.map((step, index) => (
              <div key={index} className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300">
                <div className="text-4xl font-bold text-accent mb-4 group-hover:text-accent-green transition-colors">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-6">Ready to Start Your Project?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let's discuss how we can help bring your vision to life with our expertise and passion for web
              development.
            </p>
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-primary font-semibold px-8 py-3 glow-effect"
              >
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
