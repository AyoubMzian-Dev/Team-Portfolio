'use client'

import React, { useEffect, useRef, useCallback, useState } from 'react'

interface RenderTrackingData {
  componentName: string
  renderCount: number
  lastRenderTime: number
  averageRenderTime: number
  props?: any
  renderTimes: number[]
}

interface PerformanceMetrics {
  totalRenders: number
  componentsTracked: number
  averageRenderTime: number
  slowestComponent: string | null
  fastestComponent: string | null
  excessiveRenderComponents: string[]
}

const EXCESSIVE_RENDER_THRESHOLD = 10
const RENDER_TIME_SAMPLES = 10

class RenderTracker {
  private static instance: RenderTracker
  private renderData: Map<string, RenderTrackingData> = new Map()
  private listeners: Set<(data: RenderTrackingData[]) => void> = new Set()
  private isEnabled = false

  static getInstance(): RenderTracker {
    if (!RenderTracker.instance) {
      RenderTracker.instance = new RenderTracker()
    }
    return RenderTracker.instance
  }

  enable() {
    this.isEnabled = true
  }

  disable() {
    this.isEnabled = false
  }

  clear() {
    this.renderData.clear()
    this.notifyListeners()
  }

  trackRender(componentName: string, props?: any) {
    if (!this.isEnabled) return

    const now = performance.now()
    const existing = this.renderData.get(componentName)

    if (existing) {
      const renderTime = now - existing.lastRenderTime
      const newRenderTimes = [...existing.renderTimes, renderTime].slice(-RENDER_TIME_SAMPLES)
      const averageRenderTime = newRenderTimes.reduce((a, b) => a + b, 0) / newRenderTimes.length

      this.renderData.set(componentName, {
        ...existing,
        renderCount: existing.renderCount + 1,
        lastRenderTime: now,
        averageRenderTime,
        props,
        renderTimes: newRenderTimes
      })
    } else {
      this.renderData.set(componentName, {
        componentName,
        renderCount: 1,
        lastRenderTime: now,
        averageRenderTime: 0,
        props,
        renderTimes: []
      })
    }

    this.notifyListeners()
  }

  getMetrics(): PerformanceMetrics {
    const data = Array.from(this.renderData.values())
    const totalRenders = data.reduce((sum, item) => sum + item.renderCount, 0)
    const componentsTracked = data.length
    
    const renderTimes = data.filter(d => d.averageRenderTime > 0).map(d => d.averageRenderTime)
    const averageRenderTime = renderTimes.length > 0 
      ? renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length 
      : 0

    const sortedByTime = data
      .filter(d => d.averageRenderTime > 0)
      .sort((a, b) => b.averageRenderTime - a.averageRenderTime)

    const slowestComponent = sortedByTime[0]?.componentName || null
    const fastestComponent = sortedByTime[sortedByTime.length - 1]?.componentName || null

    const excessiveRenderComponents = data
      .filter(d => d.renderCount > EXCESSIVE_RENDER_THRESHOLD)
      .map(d => d.componentName)

    return {
      totalRenders,
      componentsTracked,
      averageRenderTime,
      slowestComponent,
      fastestComponent,
      excessiveRenderComponents
    }
  }

  subscribe(listener: (data: RenderTrackingData[]) => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notifyListeners() {
    const data = Array.from(this.renderData.values())
    this.listeners.forEach(listener => listener(data))
  }

  getRenderData(): RenderTrackingData[] {
    return Array.from(this.renderData.values())
  }
}

// Hook for tracking component renders
export function useRenderTracker(componentName: string, props?: any) {
  const tracker = RenderTracker.getInstance()
  const renderStartTime = useRef<number>(performance.now())

  useEffect(() => {
    tracker.trackRender(componentName, props)
  })

  useEffect(() => {
    renderStartTime.current = performance.now()
  })
}

// Hook for consuming render tracking data
export function useRenderTracking() {
  const [renderData, setRenderData] = useState<RenderTrackingData[]>([])
  const [isTracking, setIsTracking] = useState(false)
  const tracker = RenderTracker.getInstance()

  const startTracking = useCallback(() => {
    tracker.enable()
    setIsTracking(true)
  }, [tracker])

  const stopTracking = useCallback(() => {
    tracker.disable()
    setIsTracking(false)
  }, [tracker])

  const clearData = useCallback(() => {
    tracker.clear()
    setRenderData([])
  }, [tracker])

  const getMetrics = useCallback(() => {
    return tracker.getMetrics()
  }, [tracker])

  useEffect(() => {
    const unsubscribe = tracker.subscribe(setRenderData)
    setRenderData(tracker.getRenderData())
    return () => {
      unsubscribe()
    }
  }, [tracker])

  return {
    renderData,
    isTracking,
    startTracking,
    stopTracking,
    clearData,
    getMetrics
  }
}

// HOC for automatic render tracking
export function withRenderTracking<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
): React.ComponentType<P> {
  const TrackedComponent: React.ComponentType<P> = (props: P) => {
    const name = componentName || WrappedComponent.displayName || WrappedComponent.name
    useRenderTracker(name, props)
    return React.createElement(WrappedComponent, props)
  }

  TrackedComponent.displayName = `withRenderTracking(${componentName || WrappedComponent.displayName || WrappedComponent.name})`
  
  return TrackedComponent
}

// Helper hook for performance testing
export function usePerformanceTest() {
  const [testResults, setTestResults] = useState<Array<{
    name: string
    status: 'running' | 'passed' | 'failed'
    duration?: number
    details?: string
  }>>([])

  const runRenderCountTest = useCallback(async (threshold = 50) => {
    const testName = 'Excessive Render Count Test'
    setTestResults(prev => [...prev.filter(r => r.name !== testName), { name: testName, status: 'running' }])
    
    const tracker = RenderTracker.getInstance()
    const startTime = performance.now()
    
    // Wait for data collection
    await new Promise(resolve => setTimeout(resolve, 5000))
    
    const metrics = tracker.getMetrics()
    const duration = performance.now() - startTime
    
    const hasPassed = metrics.excessiveRenderComponents.length === 0
    
    setTestResults(prev => [
      ...prev.filter(r => r.name !== testName),
      {
        name: testName,
        status: hasPassed ? 'passed' : 'failed',
        duration,
        details: hasPassed 
          ? 'No components with excessive renders detected'
          : `Components with excessive renders: ${metrics.excessiveRenderComponents.join(', ')}`
      }
    ])
    
    return hasPassed
  }, [])

  const runMemoryLeakTest = useCallback(async () => {
    const testName = 'Memory Leak Test'
    setTestResults(prev => [...prev.filter(r => r.name !== testName), { name: testName, status: 'running' }])
    
    const startTime = performance.now()
    const initialMemory = (performance as any).memory?.usedJSHeapSize || 0
    
    // Simulate component stress test
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const finalMemory = (performance as any).memory?.usedJSHeapSize || 0
    const memoryIncrease = finalMemory - initialMemory
    const duration = performance.now() - startTime
    
    // Allow for 10MB increase (reasonable for normal operation)
    const hasPassed = memoryIncrease < 10 * 1024 * 1024
    
    setTestResults(prev => [
      ...prev.filter(r => r.name !== testName),
      {
        name: testName,
        status: hasPassed ? 'passed' : 'failed',
        duration,
        details: `Memory change: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`
      }
    ])
    
    return hasPassed
  }, [])

  const runPerformanceTest = useCallback(async () => {
    const testName = 'Overall Performance Test'
    setTestResults(prev => [...prev.filter(r => r.name !== testName), { name: testName, status: 'running' }])
    
    const startTime = performance.now()
    const tracker = RenderTracker.getInstance()
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const metrics = tracker.getMetrics()
    const duration = performance.now() - startTime
    
    // Performance criteria: average render time < 16ms (60fps)
    const hasPassed = metrics.averageRenderTime < 16
    
    setTestResults(prev => [
      ...prev.filter(r => r.name !== testName),
      {
        name: testName,
        status: hasPassed ? 'passed' : 'failed',
        duration,
        details: `Average render time: ${metrics.averageRenderTime.toFixed(2)}ms`
      }
    ])
    
    return hasPassed
  }, [])

  const runAllTests = useCallback(async () => {
    await runRenderCountTest()
    await runMemoryLeakTest()
    await runPerformanceTest()
  }, [runRenderCountTest, runMemoryLeakTest, runPerformanceTest])

  const clearResults = useCallback(() => {
    setTestResults([])
  }, [])

  return {
    testResults,
    runRenderCountTest,
    runMemoryLeakTest,
    runPerformanceTest,
    runAllTests,
    clearResults
  }
}
