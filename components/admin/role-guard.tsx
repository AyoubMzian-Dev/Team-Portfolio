"use client"

import { usePermissions } from "@/hooks/use-permissions"
import { Permission } from "@/lib/permissions"
import { theme } from "@/lib/theme-config"
import { AlertTriangle } from "lucide-react"

interface RoleGuardProps {
  permission?: Permission
  role?: "ADMIN" | "MEMBER" | "VIEWER"
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function RoleGuard({ 
  permission, 
  role, 
  children, 
  fallback 
}: RoleGuardProps) {
  const { checkPermission, role: userRole } = usePermissions()
  
  // Check by permission
  if (permission && !checkPermission(permission)) {
    return fallback || <AccessDenied />
  }
  
  // Check by role
  if (role && userRole !== role) {
    return fallback || <AccessDenied />
  }
  
  return <>{children}</>
}

function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center p-8 glass-card">
      <AlertTriangle 
        className="h-16 w-16 mb-4" 
        style={{ color: theme.colors.textMuted }} 
      />
      <h3 
        className="text-lg font-semibold mb-2"
        style={{ color: theme.colors.text }}
      >
        Access Denied
      </h3>
      <p 
        className="text-sm text-center"
        style={{ color: theme.colors.textMuted }}
      >
        You don't have permission to access this resource.
      </p>
    </div>
  )
}
