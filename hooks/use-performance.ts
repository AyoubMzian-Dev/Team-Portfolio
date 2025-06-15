"use client"

import { useEffect, useRef, useState, useCallback } from 'react'

interface PerformanceMetrics {
  renderTime: number
  memoryUsage?: number
  rerenderCount: number
  lastRenderTimestamp: number
}

export function usePerformanceMonitor(componentName: string) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    rerenderCount: 0,
    lastRenderTimestamp: 0
  })
  
  const renderStartTime = useRef<number>(0)
  const renderCountRef = useRef<number>(0)
  const isFirstRender = useRef<boolean>(true)

  // Only update render count - no state changes to prevent re-renders
  renderCountRef.current += 1
  renderStartTime.current = performance.now()

  // Use a debounced effect to prevent infinite loops
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    // Debounce the metrics update to prevent infinite loops
    const timeoutId = setTimeout(() => {
      const renderEndTime = performance.now()
      const renderTime = renderEndTime - renderStartTime.current
      
      setMetrics(prev => ({
        ...prev,
        renderTime,
        rerenderCount: renderCountRef.current,
        lastRenderTimestamp: renderEndTime,
        memoryUsage: (performance as any).memory?.usedJSHeapSize
      }))

      // Log performance metrics in development (throttled)
      if (process.env.NODE_ENV === 'development' && renderCountRef.current % 10 === 0) {
        console.log(`🚀 Performance [${componentName}]:`, {
          renderTime: `${renderTime.toFixed(2)}ms`,
          rerenderCount: renderCountRef.current,
          memoryUsage: (performance as any).memory?.usedJSHeapSize 
            ? `${((performance as any).memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`
            : 'N/A'
        })
      }
    }, 100) // 100ms debounce

    return () => clearTimeout(timeoutId)
  }, [componentName]) // Only depend on componentName

  return metrics
}

export function useRenderCounter(componentName: string) {
  const renderCount = useRef(0)
  renderCount.current += 1
  
  // Only log every 50 renders to avoid spam
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && renderCount.current % 50 === 0) {
      console.log(`🔄 Component [${componentName}] rendered ${renderCount.current} times`)
    }
  }, [componentName])
  
  return renderCount.current
}
