"use client"

import { BarChart3, Plus, Eye, Edit } from "lucide-react"
import { theme } from "@/lib/theme-config"
import { usePermissions } from "@/hooks/use-permissions"
import { Permission } from "@/lib/permissions"

interface QuickAction {
  label: string
  href: string
  permission: Permission
  icon: any
}

const quickActions: QuickAction[] = [
  { 
    label: "Add New Project", 
    href: "/admin/projects/new", 
    permission: Permission.MANAGE_PROJECTS,
    icon: Plus
  },
  { 
    label: "Add Team Member", 
    href: "/admin/members/new", 
    permission: Permission.MANAGE_TEAM,
    icon: Plus
  },
  { 
    label: "Create Blog Post", 
    href: "/admin/blog-editor/new", 
    permission: Permission.MANAGE_BLOG,
    icon: Edit
  },
  { 
    label: "View Inquiries", 
    href: "/admin/inquiries", 
    permission: Permission.VIEW_INQUIRIES,
    icon: Eye
  },
  { 
    label: "Manage Settings", 
    href: "/admin/settings", 
    permission: Permission.MANAGE_SETTINGS,
    icon: BarChart3
  },
]

export default function AdminQuickActions() {
  const { checkPermission } = usePermissions()
  
  const availableActions = quickActions.filter(action => 
    checkPermission(action.permission)
  )
  
  if (availableActions.length === 0) {
    return (
      <div className="glass-card p-6">
        <h3 
          className="text-xl font-semibold mb-4"
          style={{ color: theme.colors.text }}
        >
          Quick Actions
        </h3>
        <p style={{ color: theme.colors.textMuted }} className="text-sm">
          No actions available for your role.
        </p>
      </div>
    )
  }

  return (
    <div className="glass-card p-6">
      <h3 
        className="text-xl font-semibold mb-4"
        style={{ color: theme.colors.text }}
      >
        Quick Actions
      </h3>
      <div className="space-y-3">
        {availableActions.map((action, index) => (
          <a
            key={index}
            href={action.href}
            className="flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-white/5"
            style={{ borderLeft: `3px solid ${theme.colors.accent}` }}
          >
            <span style={{ color: theme.colors.text }}>{action.label}</span>
            <action.icon className="h-4 w-4" style={{ color: theme.colors.textMuted }} />
          </a>
        ))}
      </div>
    </div>
  )
}