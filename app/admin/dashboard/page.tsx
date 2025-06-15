
"use client"

import AdminDashboardWelcome from "@/components/admin/adminDashboardWelcom"
import AdminDashboardStats from "@/components/admin/adminDashboardStats"
import AdminRecentActivity from "@/components/admin/adminRecentActivity"
import AdminQuickAction from "@/components/admin/adminQuickAction"
import RoleGuard from "@/components/admin/role-guard"
import SessionDebug from "@/components/admin/session-debug"
import { Permission } from "@/lib/permissions"

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <AdminDashboardWelcome />

      {/* Stats Grid - All roles can see stats */}
      <RoleGuard permission={Permission.VIEW_DASHBOARD}>
        <AdminDashboardStats />
      </RoleGuard>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RoleGuard permission={Permission.VIEW_DASHBOARD}>
          <AdminRecentActivity />
        </RoleGuard>
        <AdminQuickAction />
      </div>

      {/* Debug Session (Development Only) */}
      <SessionDebug />
    </div>
  )
}
