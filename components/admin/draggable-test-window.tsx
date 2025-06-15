'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Minimize2, 
  Maximize2, 
  X,
  Activity,
  MemoryStick,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Monitor,
  Target,
  TrendingUp
} from 'lucide-react'

interface RenderCount {
  component: string
  count: number
  lastRender: number
}

interface TestLog {
  id: string
  timestamp: number
  level: 'info' | 'warn' | 'error' | 'success'
  message: string
  component?: string
  renderCount?: number
}

interface TestStatus {
  id: string
  name: string
  status: 'idle' | 'running' | 'passed' | 'failed'
  duration?: number
  logs: TestLog[]
}

export function DraggableTestWindow() {
  const [isMinimized, setIsMinimized] = useState(false)
  const [position, setPosition] = useState({ x: 20, y: 20 })
  const [size, setSize] = useState({ width: 600, height: 500 })
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [renderCounts, setRenderCounts] = useState<RenderCount[]>([])
  const [tests, setTests] = useState<TestStatus[]>([
    {
      id: 'render-count',
      name: 'Component Render Counter',
      status: 'idle',
      logs: []
    },
    {
      id: 'performance-monitor',
      name: 'Performance Monitor',
      status: 'idle',
      logs: []
    },
    {
      id: 'memory-usage',
      name: 'Memory Usage Test',
      status: 'idle',
      logs: []
    },
    {
      id: 'infinite-render-check',
      name: 'Infinite Render Detection',
      status: 'idle',
      logs: []
    }
  ])
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [activeTab, setActiveTab] = useState('tests')

  const windowRef = useRef<HTMLDivElement>(null)
  const renderCounterRef = useRef<number>(0)
  const monitorIntervalRef = useRef<NodeJS.Timeout>()

  // Mock render tracking (in a real app, this would hook into React DevTools)
  const trackRender = useCallback((componentName: string) => {
    const now = Date.now()
    setRenderCounts(prev => {
      const existing = prev.find(c => c.component === componentName)
      if (existing) {
        return prev.map(c => 
          c.component === componentName 
            ? { ...c, count: c.count + 1, lastRender: now }
            : c
        )
      } else {
        return [...prev, { component: componentName, count: 1, lastRender: now }]
      }
    })
    renderCounterRef.current++
  }, [])

  // Add test log
  const addLog = useCallback((testId: string, level: TestLog['level'], message: string, component?: string, renderCount?: number) => {
    setTests(prev => prev.map(test => 
      test.id === testId 
        ? {
            ...test,
            logs: [...test.logs, {
              id: Math.random().toString(36),
              timestamp: Date.now(),
              level,
              message,
              component,
              renderCount
            }]
          }
        : test
    ))
  }, [])

  // Start monitoring
  const startMonitoring = useCallback(() => {
    setIsMonitoring(true)
    
    // Simulate component renders for demo
    const simulateRenders = () => {
      const components = ['ProjectRow', 'ProjectsTable', 'SyncStatus', 'Dashboard', 'ProjectForm']
      const randomComponent = components[Math.floor(Math.random() * components.length)]
      trackRender(randomComponent)
      
      addLog('render-count', 'info', `${randomComponent} rendered`, randomComponent, renderCounterRef.current)
      
      // Check for excessive renders
      const renderCount = renderCounts.find(c => c.component === randomComponent)?.count || 0
      if (renderCount > 10) {
        addLog('infinite-render-check', 'warn', `Potential excessive renders detected in ${randomComponent}`, randomComponent, renderCount)
      }
    }

    monitorIntervalRef.current = setInterval(simulateRenders, 1000)
    addLog('performance-monitor', 'success', 'Performance monitoring started')
  }, [trackRender, addLog, renderCounts])

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false)
    if (monitorIntervalRef.current) {
      clearInterval(monitorIntervalRef.current)
    }
    addLog('performance-monitor', 'info', 'Performance monitoring stopped')
  }, [addLog])

  // Run individual test
  const runTest = useCallback(async (testId: string) => {
    setTests(prev => prev.map(test => 
      test.id === testId ? { ...test, status: 'running' } : test
    ))

    const startTime = Date.now()
    addLog(testId, 'info', `Starting test: ${testId}`)

    // Simulate test execution
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000))

    const duration = Date.now() - startTime
    const success = Math.random() > 0.3 // 70% success rate

    setTests(prev => prev.map(test => 
      test.id === testId 
        ? { 
            ...test, 
            status: success ? 'passed' : 'failed',
            duration 
          } 
        : test
    ))

    addLog(testId, success ? 'success' : 'error', 
      success 
        ? `Test passed in ${duration}ms` 
        : `Test failed after ${duration}ms - Check component optimization`
    )
  }, [addLog])

  // Clear logs
  const clearLogs = useCallback((testId: string) => {
    setTests(prev => prev.map(test => 
      test.id === testId ? { ...test, logs: [] } : test
    ))
  }, [])

  // Mouse event handlers for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as Element).closest('.drag-handle')) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      })
    }
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }, [isDragging, dragStart])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setIsResizing(false)
  }, [])

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp])

  // Cleanup
  useEffect(() => {
    return () => {
      if (monitorIntervalRef.current) {
        clearInterval(monitorIntervalRef.current)
      }
    }
  }, [])

  const getStatusIcon = (status: TestStatus['status']) => {
    switch (status) {
      case 'running': return <Clock className="h-4 w-4 animate-spin" />
      case 'passed': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <Target className="h-4 w-4 text-gray-500" />
    }
  }

  const getLogIcon = (level: TestLog['level']) => {
    switch (level) {
      case 'success': return <CheckCircle className="h-3 w-3 text-green-500" />
      case 'error': return <XCircle className="h-3 w-3 text-red-500" />
      case 'warn': return <AlertTriangle className="h-3 w-3 text-yellow-500" />
      default: return <Activity className="h-3 w-3 text-blue-500" />
    }
  }

  if (isMinimized) {
    return (
      <div
        className="fixed bg-card border rounded-lg shadow-lg p-2 cursor-pointer z-50"
        style={{ left: position.x, top: position.y }}
        onClick={() => setIsMinimized(false)}
      >
        <div className="flex items-center gap-2">
          <Monitor className="h-4 w-4" />
          <span className="text-sm font-medium">Performance Test Dashboard</span>
          {isMonitoring && (
            <Badge variant="outline" className="text-xs">
              <Activity className="h-3 w-3 mr-1" />
              Monitoring
            </Badge>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      ref={windowRef}
      className="fixed bg-card border rounded-lg shadow-2xl z-50 select-none"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        minWidth: 400,
        minHeight: 300
      }}
    >
      {/* Header */}
      <div
        className="drag-handle flex items-center justify-between p-3 border-b cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <Monitor className="h-5 w-5 text-primary" />
          <span className="font-semibold">Performance Test Dashboard</span>
          {isMonitoring && (
            <Badge variant="outline" className="text-xs">
              <Activity className="h-3 w-3 mr-1 animate-pulse" />
              Live
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(true)}
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 h-full overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tests">Tests</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="tests" className="flex-1 mt-4 space-y-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={isMonitoring ? stopMonitoring : startMonitoring}
              >
                {isMonitoring ? (
                  <>
                    <Pause className="h-4 w-4 mr-1" />
                    Stop All
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-1" />
                    Start All
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setRenderCounts([])
                  renderCounterRef.current = 0
                  setTests(prev => prev.map(test => ({ ...test, logs: [] })))
                }}
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </div>

            <ScrollArea className="h-[300px]">
              <div className="space-y-3">
                {tests.map((test) => (
                  <Card key={test.id} className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(test.status)}
                        <span className="font-medium">{test.name}</span>
                        {test.duration && (
                          <Badge variant="outline" className="text-xs">
                            {test.duration}ms
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => runTest(test.id)}
                          disabled={test.status === 'running'}
                        >
                          <Play className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => clearLogs(test.id)}
                        >
                          <Square className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    {test.logs.length > 0 && (
                      <ScrollArea className="h-20 w-full">
                        <div className="space-y-1">
                          {test.logs.slice(-5).map((log) => (
                            <div key={log.id} className="flex items-start gap-2 text-xs">
                              {getLogIcon(log.level)}
                              <span className="text-muted-foreground">
                                {new Date(log.timestamp).toLocaleTimeString()}
                              </span>
                              <span className="flex-1">{log.message}</span>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="monitoring" className="flex-1 mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Real-time Component Renders
                </h3>
                <Badge variant={isMonitoring ? 'default' : 'secondary'}>
                  {isMonitoring ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <ScrollArea className="h-[320px]">
                <div className="space-y-2">
                  {renderCounts.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      No renders tracked yet. Start monitoring to see data.
                    </div>
                  ) : (
                    renderCounts
                      .sort((a, b) => b.count - a.count)
                      .map((render) => (
                        <div key={render.component} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <div className="font-medium">{render.component}</div>
                            <div className="text-xs text-muted-foreground">
                              Last: {new Date(render.lastRender).toLocaleTimeString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">{render.count}</div>
                            <div className="text-xs text-muted-foreground">renders</div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="flex-1 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">Total Renders</span>
                </div>
                <div className="text-2xl font-bold">{renderCounterRef.current}</div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MemoryStick className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Components</span>
                </div>
                <div className="text-2xl font-bold">{renderCounts.length}</div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Tests Passed</span>
                </div>
                <div className="text-2xl font-bold">
                  {tests.filter(t => t.status === 'passed').length}
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="font-medium">Tests Failed</span>
                </div>
                <div className="text-2xl font-bold">
                  {tests.filter(t => t.status === 'failed').length}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Resize handle */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        onMouseDown={(e) => {
          e.preventDefault()
          setIsResizing(true)
          setDragStart({ x: e.clientX - size.width, y: e.clientY - size.height })
        }}
      >
        <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-muted-foreground/50" />
      </div>
    </div>
  )
}
