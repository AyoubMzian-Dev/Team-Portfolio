"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  FolderOpen, 
  Users, 
  FileText, 
  Mail, 
  Settings, 
  LogOut,
  Eye
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { theme } from "@/lib/theme-config"
import { usePermissions } from "@/hooks/use-permissions"
import { Permission } from "@/lib/permissions"
import { useSession, signOut } from "next-auth/react"

const adminNavItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    permission: Permission.VIEW_DASHBOARD,
  },
  {
    label: "Projects",
    href: "/admin/projects",
    icon: FolderOpen,
    permission: Permission.VIEW_PROJECTS,
  },
  {
    label: "Team Members",
    href: "/admin/members",
    icon: Users,
    permission: Permission.VIEW_TEAM,
  },
  {
    label: "Blog Posts",
    href: "/admin/blog-editor",
    icon: FileText,
    permission: Permission.VIEW_BLOG,
  },
  {
    label: "Inquiries",
    href: "/admin/inquiries",
    icon: Mail,
    permission: Permission.VIEW_INQUIRIES,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
    permission: Permission.MANAGE_SETTINGS,
  },
]

interface AdminSidebarProps {
  isSidebarOpen: boolean
  setIsSidebarOpen: (open: boolean) => void
}

export default function AdminSidebar({ isSidebarOpen, setIsSidebarOpen }: AdminSidebarProps) {
  const pathname = usePathname()
  const { checkPermission } = usePermissions()

  return (
    <aside 
      className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <div 
        className="flex flex-col h-full glass-card border-r-0 rounded-none"
        style={{ 
          background: theme.glassmorphism.background,
          borderRight: `1px solid ${theme.colors.border}`
        }}
      >
        {/* Logo */}
        <div className="p-6 border-b" style={{ borderColor: theme.colors.border }}>
          <Link href="/admin" className="flex items-center space-x-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${theme.colors.accent}33` }}
            >
              <LayoutDashboard className="h-5 w-5" style={{ color: theme.colors.accent }} />
            </div>
            <span 
              className="text-xl font-bold"
              style={{ color: theme.colors.text }}
            >
              Admin Panel
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {adminNavItems.map((item) => {
            // Check if user has permission to see this nav item
            if (!checkPermission(item.permission)) {
              return null
            }
            
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                  hover:bg-white/5 group
                  ${isActive ? 'bg-white/10' : ''}
                `}
                style={{
                  backgroundColor: isActive ? `${theme.colors.accent}1A` : undefined,
                }}
                onClick={() => setIsSidebarOpen(false)}
              >
                <item.icon 
                  className="h-5 w-5 transition-colors" 
                  style={{ 
                    color: isActive ? theme.colors.accent : theme.colors.textMuted 
                  }} 
                />
                <span 
                  className="font-medium transition-colors"
                  style={{ 
                    color: isActive ? theme.colors.accent : theme.colors.text 
                  }}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <AdminUserSection />
      </div>
    </aside>
  )
}

function AdminUserSection() {
  const { data: session } = useSession()
  const { role } = usePermissions()
  
  const getRoleBadgeColor = (userRole: string) => {
    switch (userRole) {
      case "ADMIN": return theme.colors.accent
      case "MEMBER": return theme.colors.accentTeal
      case "VIEWER": return theme.colors.accentCyan
      default: return theme.colors.textMuted
    }
  }
  
  return (
    <div className="p-4 border-t" style={{ borderColor: theme.colors.border }}>
      <div className="flex items-center space-x-3 mb-4">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${theme.colors.accent}33` }}
        >
          {session?.user?.image ? (
            <img 
              src={session.user.image} 
              alt="Profile" 
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <span style={{ color: theme.colors.accent }} className="font-semibold">
              {session?.user?.name?.[0]?.toUpperCase() || "U"}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p style={{ color: theme.colors.text }} className="font-medium truncate">
            {session?.user?.name || "User"}
          </p>
          <p style={{ color: theme.colors.textMuted }} className="text-xs truncate">
            {session?.user?.email}
          </p>
          {role && (
            <div className="flex items-center mt-1">
              <span 
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                style={{ 
                  backgroundColor: `${getRoleBadgeColor(role)}20`,
                  color: getRoleBadgeColor(role)
                }}
              >
                <Eye className="h-3 w-3 mr-1" />
                {role}
              </span>
            </div>
          )}
        </div>
      </div>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => signOut({ callbackUrl: "/" })}
        style={{
          borderColor: theme.colors.border,
          color: theme.colors.textMuted,
        }}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Sign Out
      </Button>
    </div>
  )
}