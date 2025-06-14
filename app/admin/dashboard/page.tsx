"use client"

import AdminDashboardWelcome from "@/components/admin/adminDashboardWelcom"
import AdminDashboardStats from "@/components/admin/adminDashboardStats"
import AdminRecentActivity from "@/components/admin/adminRecentActivity"
import AdminQuickAction from "@/components/admin/adminQuickAction"

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <AdminDashboardWelcome />

      {/* Stats Grid */}
      <AdminDashboardStats />

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminRecentActivity />
        <AdminQuickAction />
      </div>
    </div>
  )
}
