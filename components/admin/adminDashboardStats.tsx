

import { BarChart3, Users, FolderOpen, Mail, Eye } from "lucide-react"
import { theme } from "@/lib/theme-config"
import AdminStatsCard from "./adminStatsCard"

const stats = [
  {
    title: "Total Projects",
    value: "24",
    change: "+3 this month",
    icon: FolderOpen,
    color: theme.colors.accent,
  },
  {
    title: "Team Members",
    value: "8",
    change: "+1 this month",
    icon: Users,
    color: theme.colors.accentTeal,
  },
  {
    title: "New Inquiries",
    value: "12",
    change: "+5 this week",
    icon: Mail,
    color: theme.colors.accentCyan,
  },
  {
    title: "Site Views",
    value: "2.4k",
    change: "+12% this month",
    icon: Eye,
    color: theme.colors.accent,
  },
]

export default function AdminDashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <AdminStatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  )
}