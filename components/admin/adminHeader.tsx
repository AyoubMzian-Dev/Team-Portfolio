

import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { theme } from "@/lib/theme-config"

interface AdminHeaderProps {
  isSidebarOpen: boolean
  setIsSidebarOpen: (open: boolean) => void
}

export default function AdminHeader({ isSidebarOpen, setIsSidebarOpen }: AdminHeaderProps) {
  return (
    <header 
      className="glass-card border-b rounded-none p-4"
      style={{ 
        background: theme.glassmorphism.background,
        borderColor: theme.colors.border 
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{ color: theme.colors.text }}
          >
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
          <h1 
            className="text-2xl font-bold"
            style={{ color: theme.colors.text }}
          >
            Content Management
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            style={{
              borderColor: theme.colors.accent,
              color: theme.colors.accent,
            }}
          >
            View Site
          </Button>
        </div>
      </div>
    </header>
  )
}