import SectionHeading from "@/components/section-heading"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check, Code2, Server, Palette, Smartphone, Search, Zap } from "lucide-react"
import Link from "next/link"

// Define the pricing plans data structure
const pricingPlans = [
  {
    name: "Basic",
    price: "$99",
    description: "Perfect for small businesses and startups",
    features: [
      "Responsive Website Design",
      "Basic SEO Optimization",
      "Contact Form Integration",
      "Social Media Integration",
      "Basic Analytics Setup",
      "1 Month Free Support"
    ],
    icon: Code2,
    color: "accent"
  },
  {
    name: "Professional",
    price: "$499",
    description: "Ideal for growing businesses",
    features: [
      "Everything in Basic",
      "Custom Web Application",
      "Advanced SEO Optimization",
      "E-commerce Integration",
      "Content Management System",
      "3 Months Free Support",
      "Performance Optimization"
    ],
    icon: Server,
    color: "green"
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large-scale projects and enterprises",
    features: [
      "Everything in Professional",
      "Custom Enterprise Solutions",
      "Advanced Security Features",
      "Scalable Infrastructure",
      "24/7 Priority Support",
      "Dedicated Project Manager",
      "Custom Integrations",
      "Performance Monitoring"
    ],
    icon: Zap,
    color: "purple"
  }
]

// Define the service packages data structure
const servicePackages = [
  {
    title: "Frontend Development",
    description: "Modern, responsive interfaces with React, Next.js, and cutting-edge CSS frameworks.",
    icon: Code2,
    color: "accent"
  },
  {
    title: "Backend Development",
    description: "Robust APIs, databases, and server-side solutions built for scale.",
    icon: Server,
    color: "green"
  },
  {
    title: "UI/UX Design",
    description: "Beautiful, intuitive designs that enhance user experience and engagement.",
    icon: Palette,
    color: "purple"
  },
  {
    title: "Mobile Development",
    description: "Cross-platform mobile apps that work seamlessly across all devices.",
    icon: Smartphone,
    color: "accent"
  },
  {
    title: "SEO Optimization",
    description: "Improve search rankings and drive organic traffic to your website.",
    icon: Search,
    color: "green"
  },
  {
    title: "Performance Optimization",
    description: "Lightning-fast websites with exceptional user experiences.",
    icon: Zap,
    color: "purple"
  }
]

export default function OffersPage() {
  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Our Offers"
            subtitle="Choose the perfect plan for your business needs"
            centered
          />
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className="glass-card p-8 group hover:scale-105 transition-all duration-300">
                <div className={`w-12 h-12 bg-${plan.color}/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-${plan.color}/30 transition-colors`}>
                  <plan.icon className={`h-6 w-6 text-${plan.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-gradient mb-4">{plan.price}</div>
                <p className="text-muted-foreground mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-foreground text-sm">
                      <Check className="h-4 w-4 text-accent mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-accent text-accent hover:bg-accent hover:text-primary"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Packages Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Service Packages"
            subtitle="Comprehensive solutions tailored to your needs"
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {servicePackages.map((service, index) => (
              <div key={index} className="glass-card p-6 group hover:scale-105 transition-all duration-300">
                <div className={`w-12 h-12 bg-${service.color}/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-${service.color}/30 transition-colors`}>
                  <service.icon className={`h-6 w-6 text-${service.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-accent-green/10 to-accent-purple/10" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-6">Ready to Get Started?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Contact us today to discuss your project requirements and get a custom quote.
              </p>
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-primary font-semibold px-8 py-3 glow-effect"
                >
                  Contact Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
