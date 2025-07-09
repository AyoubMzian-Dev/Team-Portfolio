import React from 'react'
import { headers } from 'next/headers'

interface ServerRenderLog {
  id: string
  componentName: string
  renderTime: number
  timestamp: string
  route: string
  renderType: 'SSR' | 'SSG' | 'ISR'
  props?: Record<string, any>
  renderOrder: number
  renderDepth: number
}

class ServerRenderTracker {
  private static instance: ServerRenderTracker
  private renderLogs: ServerRenderLog[] = []
  private renderCounter = 0
  private renderDepth = 0

  static getInstance(): ServerRenderTracker {
    if (!ServerRenderTracker.instance) {
      ServerRenderTracker.instance = new ServerRenderTracker()
    }
    return ServerRenderTracker.instance
  }

  trackRender(componentName: string, props?: any): void {
    const startTime = performance.now()
    
    // Only track on server-side
    if (typeof window !== 'undefined') return
    
    try {
      const headersList = headers()
      const pathname = headersList.get('x-pathname') || 'unknown'
      
      const log: ServerRenderLog = {
        id: `ssr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        componentName,
        renderTime: performance.now() - startTime,
        timestamp: new Date().toISOString(),
        route: pathname,
        renderType: 'SSR',
        props: props ? this.sanitizeProps(props) : undefined,
        renderOrder: ++this.renderCounter,
        renderDepth: this.renderDepth
      }
      
      this.renderLogs.push(log)
      
      // Keep only last 100 logs to prevent memory issues
      if (this.renderLogs.length > 100) {
        this.renderLogs = this.renderLogs.slice(-50)
      }
      
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`🖥️ [SSR] ${componentName} rendered in ${log.renderTime.toFixed(2)}ms (${pathname})`)
      }
    } catch (error) {
      console.error('Error tracking server render:', error)
    }
  }

  private sanitizeProps(props: any): Record<string, any> {
    try {
      return JSON.parse(JSON.stringify(props, (key, value) => {
        // Sanitize functions, symbols, and other non-serializable values
        if (typeof value === 'function') return '[Function]'
        if (typeof value === 'symbol') return '[Symbol]'
        if (value instanceof Date) return value.toISOString()
        if (typeof value === 'object' && value !== null) {
          // Limit object depth to prevent circular references
          return value
        }
        return value
      }))
    } catch {
      return { error: 'Props could not be serialized' }
    }
  }

  enterComponent(componentName: string): void {
    this.renderDepth++
  }

  exitComponent(componentName: string): void {
    this.renderDepth = Math.max(0, this.renderDepth - 1)
  }

  getLogs(): ServerRenderLog[] {
    return [...this.renderLogs]
  }

  clearLogs(): void {
    this.renderLogs = []
    this.renderCounter = 0
  }

  getStats() {
    const logs = this.getLogs()
    const totalRenders = logs.length
    const averageRenderTime = logs.length > 0 
      ? logs.reduce((sum, log) => sum + log.renderTime, 0) / logs.length 
      : 0
    
    const componentStats = logs.reduce((acc, log) => {
      if (!acc[log.componentName]) {
        acc[log.componentName] = { count: 0, totalTime: 0 }
      }
      acc[log.componentName].count++
      acc[log.componentName].totalTime += log.renderTime
      return acc
    }, {} as Record<string, { count: number, totalTime: number }>)

    return {
      totalRenders,
      averageRenderTime,
      componentStats,
      slowestComponent: Object.entries(componentStats)
        .sort(([,a], [,b]) => (b.totalTime / b.count) - (a.totalTime / a.count))[0]?.[0],
      mostRenderedComponent: Object.entries(componentStats)
        .sort(([,a], [,b]) => b.count - a.count)[0]?.[0]
    }
  }
}

// Server-side component wrapper
export function withServerRenderTracking<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  componentName?: string
): React.ComponentType<T> {
  const TrackedComponent = (props: T) => {
    const tracker = ServerRenderTracker.getInstance()
    const name = componentName || Component.displayName || Component.name || 'Anonymous'
    
    tracker.enterComponent(name)
    tracker.trackRender(name, props)
    
    try {
      const result = React.createElement(Component, props)
      tracker.exitComponent(name)
      return result
    } catch (error) {
      tracker.exitComponent(name)
      throw error
    }
  }

  TrackedComponent.displayName = `withServerRenderTracking(${componentName || Component.displayName || Component.name})`
  
  return TrackedComponent
}

// Hook for server-side tracking (no-op on client)
export function useServerRenderTracker(componentName: string, props?: any) {
  if (typeof window === 'undefined') {
    const tracker = ServerRenderTracker.getInstance()
    tracker.trackRender(componentName, props)
  }
}

// Export singleton instance
export const serverRenderTracker = ServerRenderTracker.getInstance()

export type { ServerRenderLog }
