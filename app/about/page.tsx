import SectionHeading from "@/components/section-heading"
import TeamMemberCard from "@/components/team-member-card"
import TechBadge from "@/components/tech-badge"
import { sql } from "@/lib/db"

async function getTeamMembers() {
  const members = await sql`
    SELECT * FROM team_members 
    ORDER BY id
  `
  return members
}

export default async function AboutPage() {
  const teamMembers = await getTeamMembers()

  const companyValues = [
    {
      title: "Innovation",
      description: "We stay ahead of the curve by embracing new technologies and methodologies.",
    },
    {
      title: "Quality",
      description: "Every line of code is crafted with precision and attention to detail.",
    },
    {
      title: "Collaboration",
      description: "We believe in the power of teamwork and open communication.",
    },
    {
      title: "Growth",
      description: "Continuous learning and improvement drive our success.",
    },
  ]

  const techStack = [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Python",
    "PostgreSQL",
    "MongoDB",
    "AWS",
    "Docker",
    "Kubernetes",
    "Tailwind CSS",
    "Figma",
  ]

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-6">About Our Team</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're a passionate group of developers, designers, and innovators dedicated to creating exceptional web
              experiences that make a difference.
            </p>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Meet the Team" subtitle="The talented individuals behind our success" centered />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <TeamMemberCard key={member.id} {...member} />
            ))}
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Our Values" subtitle="The principles that guide everything we do" centered />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyValues.map((value, index) => (
              <div key={index} className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300">
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-accent transition-colors">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Our Tech Stack"
            subtitle="The technologies we use to build amazing applications"
            centered
          />

          <div className="flex flex-wrap gap-4 justify-center">
            {techStack.map((tech, index) => (
              <TechBadge
                key={tech}
                tech={tech}
                variant={index % 3 === 0 ? "accent" : index % 3 === 1 ? "green" : "purple"}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              To empower businesses and individuals with cutting-edge web technologies that drive growth, enhance user
              experiences, and create lasting digital impact. We believe in the transformative power of well-crafted
              code and thoughtful design.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
