import { withServerRenderTracking } from '@/lib/server-render-tracker'

interface ServerHeaderProps {
  title: string
  subtitle?: string
  showBreadcrumb?: boolean
  currentPage?: string
}

function ServerHeader({ title, subtitle, showBreadcrumb, currentPage }: ServerHeaderProps) {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center space-x-4">
          {showBreadcrumb && (
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Home</span>
              <span>/</span>
              <span className="text-foreground">{currentPage}</span>
            </nav>
          )}
        </div>
        <div className="flex-1" />
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
    </header>
  )
}

export default withServerRenderTracking(ServerHeader, 'ServerHeader')
