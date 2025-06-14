"use client"

import { theme } from "@/lib/theme-config"

export default function AdminDashboardWelcome() {
  return (
    <div className="glass-card p-8">
      <h2 
        className="text-3xl font-bold mb-2"
        style={{ color: theme.colors.text }}
      >
        Welcome back, Admin! 👋
      </h2>
      <p style={{ color: theme.colors.textMuted }}>
        Here's what's happening with your portfolio website today.
      </p>
    </div>
  )
}