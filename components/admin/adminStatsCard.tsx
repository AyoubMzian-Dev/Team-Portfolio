

import { LucideIcon } from "lucide-react"
import { theme } from "@/lib/theme-config"

interface AdminStatsCardProps {
  title: string
  value: string
  change: string
  icon: LucideIcon
  color: string
}

export default function AdminStatsCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color 
}: AdminStatsCardProps) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}33` }}
        >
          <Icon className="h-6 w-6" style={{ color }} />
        </div>
      </div>
      <h3 
        className="text-2xl font-bold mb-1"
        style={{ color: theme.colors.text }}
      >
        {value}
      </h3>
      <p 
        className="text-sm font-medium mb-1"
        style={{ color: theme.colors.textMuted }}
      >
        {title}
      </p>
      <p 
        className="text-xs"
        style={{ color }}
      >
        {change}
      </p>
    </div>
  )
}