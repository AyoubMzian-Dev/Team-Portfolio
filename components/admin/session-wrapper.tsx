"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

interface SessionWrapperProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export default function SessionWrapper({ 
  children, 
  requireAuth = true 
}: SessionWrapperProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return // Still loading

    if (requireAuth && status === "unauthenticated") {
      router.push("/admin/auth/signin")
      return
    }

    setIsLoading(false)
  }, [session, status, router, requireAuth])

  // Show loading spinner while checking session
  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // If auth required but not authenticated, don't render children
  if (requireAuth && status === "unauthenticated") {
    return null
  }

  return <>{children}</>
}
