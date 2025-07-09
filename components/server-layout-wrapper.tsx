import { withServerRenderTracking } from '@/lib/server-render-tracker'

interface ServerLayoutWrapperProps {
  children: React.ReactNode
  page: string
}

function ServerLayoutWrapper({ children, page }: ServerLayoutWrapperProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col">
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default withServerRenderTracking(ServerLayoutWrapper, 'ServerLayoutWrapper')
