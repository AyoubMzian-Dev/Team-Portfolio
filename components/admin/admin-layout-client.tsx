"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { theme } from "@/lib/theme-config"
import AdminSidebar from "@/components/admin/adminSidebar"
import AdminHeader from "@/components/admin/adminHeader"

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Don't redirect if we're already on an auth page
    if (pathname.startsWith("/admin/auth")) {
      return
    }

    if (status === "loading") return // Still loading

    if (status === "unauthenticated") {
      router.push("/admin/auth/signin")
      return
    }
  }, [status, router, pathname])

  // If we're on an auth page, render without the admin layout
  if (pathname.startsWith("/admin/auth")) {
    return <>{children}</>
  }

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})` }}
      >
        <div className="glass-card p-8">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: theme.colors.accent }}></div>
            <p style={{ color: theme.colors.text }}>Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated (redirect is handled in useEffect)
  if (status === "unauthenticated") {
    return null
  }

  return (
    <div 
      className="min-h-screen flex"
      style={{ background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})` }}
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
  )
}
