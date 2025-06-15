'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useRenderTracking } from '@/hooks/use-render-tracker'

export function AutoPerformanceTracker() {
  const pathname = usePathname()
  const { startTracking, isTracking } = useRenderTracking()

  useEffect(() => {
    // Auto-start tracking on admin pages or pages likely to have performance issues
    const shouldAutoTrack = pathname && (
      pathname.startsWith('/admin') ||
      pathname.includes('/projects') ||
      pathname === '/' // Home page might have many components
    )

    if (shouldAutoTrack && !isTracking) {
      // Small delay to let page components mount first
      const timer = setTimeout(() => {
        startTracking()
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [pathname, startTracking, isTracking])

  return null // This component doesn't render anything
}

export default AutoPerformanceTracker
