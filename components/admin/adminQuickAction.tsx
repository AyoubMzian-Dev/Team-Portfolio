"use client"

import { BarChart3 } from "lucide-react"
import { theme } from "@/lib/theme-config"

interface QuickAction {
  label: string
  href: string
}

const quickActions: QuickAction[] = [
  { label: "Add New Project", href: "/admin/projects/new" },
  { label: "Add Team Member", href: "/admin/team/new" },
  { label: "Create Blog Post", href: "/admin/blog/new" },
  { label: "View Inquiries", href: "/admin/inquiries" },
]

export default function AdminQuickActions() {
  return (
    <div className="glass-card p-6">
      <h3 
        className="text-xl font-semibold mb-4"
        style={{ color: theme.colors.text }}
      >
        Quick Actions
      </h3>
      <div className="space-y-3">
        {quickActions.map((action, index) => (
          <a
            key={index}
            href={action.href}
            className="flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-white/5"
            style={{ borderLeft: `3px solid ${theme.colors.accent}` }}
          >
            <span style={{ color: theme.colors.text }}>{action.label}</span>
            <BarChart3 className="h-4 w-4" style={{ color: theme.colors.textMuted }} />
          </a>
        ))}
      </div>
    </div>
  )
}