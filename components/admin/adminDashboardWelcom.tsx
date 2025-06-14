"use client"

import { theme } from "@/lib/theme-config"
import { useSession } from "next-auth/react"
import { usePermissions } from "@/hooks/use-permissions"

export default function AdminDashboardWelcome() {
  const { data: session } = useSession()
  const { role, isAdmin, isMember, isViewer } = usePermissions()
  
  const getRoleDescription = () => {
    if (isAdmin) return "You have full access to all system features and settings."
    if (isMember) return "You can manage projects and blog posts."
    if (isViewer) return "You have read-only access to view content and data."
    return "Welcome to the admin portal."
  }
  
  const getRoleColor = () => {
    if (isAdmin) return theme.colors.accent
    if (isMember) return theme.colors.accentTeal
    if (isViewer) return theme.colors.accentCyan
    return theme.colors.text
  }

  return (
    <div className="glass-card p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 
            className="text-3xl font-bold mb-2"
            style={{ color: theme.colors.text }}
          >
            Welcome back, {session?.user?.name || "User"}! 👋
          </h2>
          <p style={{ color: theme.colors.textMuted }}>
            {getRoleDescription()}
          </p>
        </div>
        {role && (
          <div 
            className="px-4 py-2 rounded-full border-2"
            style={{ 
              borderColor: getRoleColor(),
              backgroundColor: `${getRoleColor()}1A`
            }}
          >
            <span 
              className="text-sm font-semibold"
              style={{ color: getRoleColor() }}
            >
              {role} ACCESS
            </span>
          </div>
        )}
      </div>
    </div>
  )
}