// lib/permissions.ts
export enum Permission {
  // Admin permissions
  MANAGE_USERS = "manage_users",
  MANAGE_SETTINGS = "manage_settings",
  MANAGE_INQUIRIES = "manage_inquiries",
  
  // Member permissions
  MANAGE_PROJECTS = "manage_projects",
  MANAGE_BLOG = "manage_blog",
  MANAGE_TEAM = "manage_team",
  
  // Viewer permissions
  VIEW_DASHBOARD = "view_dashboard",
  VIEW_PROJECTS = "view_projects",
  VIEW_BLOG = "view_blog",
  VIEW_TEAM = "view_team",
  VIEW_INQUIRIES = "view_inquiries",
}

export const rolePermissions = {
  ADMIN: [
    // Full access - all permissions
    Permission.MANAGE_USERS,
    Permission.MANAGE_SETTINGS,
    Permission.MANAGE_INQUIRIES,
    Permission.MANAGE_PROJECTS,
    Permission.MANAGE_BLOG,
    Permission.MANAGE_TEAM,
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_PROJECTS,
    Permission.VIEW_BLOG,
    Permission.VIEW_TEAM,
    Permission.VIEW_INQUIRIES,
  ],
  MEMBER: [
    // Project management and blog access
    Permission.MANAGE_PROJECTS,
    Permission.MANAGE_BLOG,
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_PROJECTS,
    Permission.VIEW_BLOG,
    Permission.VIEW_TEAM,
    Permission.VIEW_INQUIRIES,
  ],
  VIEWER: [
    // Read-only access
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_PROJECTS,
    Permission.VIEW_BLOG,
    Permission.VIEW_TEAM,
    Permission.VIEW_INQUIRIES,
  ],
}

export function hasPermission(role: string, permission: Permission): boolean {
  return rolePermissions[role as keyof typeof rolePermissions]?.includes(permission) || false
}

export function canManage(role: string, resource: string): boolean {
  const managePermissions = {
    projects: Permission.MANAGE_PROJECTS,
    blog: Permission.MANAGE_BLOG,
    team: Permission.MANAGE_TEAM,
    users: Permission.MANAGE_USERS,
    settings: Permission.MANAGE_SETTINGS,
    inquiries: Permission.MANAGE_INQUIRIES,
  }
  
  const permission = managePermissions[resource as keyof typeof managePermissions]
  return permission ? hasPermission(role, permission) : false
}
