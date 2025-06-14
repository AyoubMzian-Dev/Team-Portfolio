// hooks/use-permissions.ts
"use client"

import { useSession } from "next-auth/react"
import { Permission, hasPermission, canManage } from "@/lib/permissions"

export function usePermissions() {
  const { data: session } = useSession()
  
  const checkPermission = (permission: Permission): boolean => {
    if (!session?.user?.role) return false
    return hasPermission(session.user.role, permission)
  }
  
  const checkManagePermission = (resource: string): boolean => {
    if (!session?.user?.role) return false
    return canManage(session.user.role, resource)
  }
  
  const isAdmin = session?.user?.role === "ADMIN"
  const isMember = session?.user?.role === "MEMBER"
  const isViewer = session?.user?.role === "VIEWER"
  
  return { 
    checkPermission, 
    checkManagePermission,
    isAdmin,
    isMember,
    isViewer,
    role: session?.user?.role
  }
}
