import ContactForm from "@/components/contact-form"
import SectionHeading from "@/components/section-heading"
import { Mail, Phone, MapPin, Github, Linkedin, Twitter } from "lucide-react"

export default function ContactPage() {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "web.empire.dev@gmail.com",
      href: "web.empire.dev@gmail.com",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+212 773473782",
      href: "tel: 0773473782",
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Tanger, Morocco",
      href: "#",
    },
  ]

  const socialLinks = [
    { icon: Github, href: "https://github.com/devteam", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com/company/webempire", label: "LinkedIn" },
    { icon: Twitter, href: "https://twitter.com/webempire", label: "Twitter" },
  ]

  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Get In Touch"
            subtitle="Ready to start your next project? We'd love to hear from you."
            centered
          />
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="glass-card p-8">
              <h3 className="text-2xl font-semibold text-foreground mb-6">Send us a message</h3>
              <ContactForm />
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="glass-card p-8">
                <h3 className="text-2xl font-semibold text-foreground mb-6">Contact Information</h3>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                        <info.icon className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{info.title}</p>
                        <a href={info.href} className="text-foreground hover:text-accent transition-colors">
                          {info.value}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-8">
                <h3 className="text-2xl font-semibold text-foreground mb-6">Follow Us</h3>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center text-accent hover:bg-accent hover:text-primary transition-colors"
                      aria-label={social.label}
                    >
                      <social.icon className="h-6 w-6" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="glass-card p-8">
                <h3 className="text-2xl font-semibold text-foreground mb-4">Office Hours</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
