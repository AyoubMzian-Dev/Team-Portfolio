"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { theme } from "@/lib/theme-config"
import AdminSidebar from "@/components/admin/adminSidebar"
import AdminHeader from "@/components/admin/adminHeader"
import SessionWrapper from "@/components/admin/session-wrapper"

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()

  // If we're on an auth page, render without the admin layout and session check
  if (pathname.startsWith("/admin/auth")) {
    return <>{children}</>
  }

  return (
    <SessionWrapper requireAuth={true}>
      <div 
        className="min-h-screen flex"
        style={{ 
          background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})` 
        }}
      >
        {/* Sidebar */}
        <AdminSidebar 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen} 
        />

        {/* Mobile overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:ml-0">
          {/* Header */}
          <AdminHeader 
            isSidebarOpen={isSidebarOpen} 
            setIsSidebarOpen={setIsSidebarOpen} 
          />

          {/* Page Content */}
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SessionWrapper>
  )
}
