'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useRenderTracking, usePerformanceTest } from '@/hooks/use-render-tracker'
import { getServerRenderLogs, clearServerRenderLogs } from '@/lib/actions/server-render-logs'
import type { ServerRenderLog } from '@/lib/server-render-tracker'
import { 
  Activity,
  MemoryStick,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Monitor,
  X,
  Minimize2,
  Maximize2,
  Play,
  Pause,
  RotateCcw,
  Target,
  TrendingUp,
  Server,
  Smartphone,
  RefreshCw,
  Settings,
  Move,
  Maximize,
  Minimize
} from 'lucide-react'

interface EnhancedDraggableTestWindowProps {
  isOpen: boolean
  onClose: () => void
  onMinimize: () => void
  isMinimized: boolean
}

interface ServerRenderData {
  logs: ServerRenderLog[]
  stats: {
    totalRenders: number
    averageRenderTime: number
    componentStats: Record<string, { count: number, totalTime: number }>
    slowestComponent?: string
    mostRenderedComponent?: string
  }
  timestamp: string
}

export function EnhancedDraggableTestWindow({ 
  isOpen, 
  onClose, 
  onMinimize, 
  isMinimized 
}: EnhancedDraggableTestWindowProps) {
  // Dragging and resizing state
  const [position, setPosition] = useState({ x: 100, y: 100 })
  const [size, setSize] = useState({ width: 800, height: 600 })
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  
  // Performance tracking state
  const [currentPage, setCurrentPage] = useState('')
  const [serverRenderData, setServerRenderData] = useState<ServerRenderData | null>(null)
  const [isLoadingServerData, setIsLoadingServerData] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [activeTab, setActiveTab] = useState('client-renders')

  // Client-side tracking
  const { 
    renderData, 
    isTracking, 
    startTracking, 
    stopTracking, 
    clearData, 
    getMetrics 
  } = useRenderTracking()
  
  const {
    testResults,
    runRenderCountTest,
    runMemoryLeakTest,
    runPerformanceTest,
    clearResults
  } = usePerformanceTest()

  const windowRef = useRef<HTMLDivElement>(null)

  // Track current page
  useEffect(() => {
    setCurrentPage(window.location.pathname)
    
    const handleRouteChange = () => {
      setCurrentPage(window.location.pathname)
    }
    
    window.addEventListener('popstate', handleRouteChange)
    
    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState
    
    history.pushState = function(...args) {
      originalPushState.apply(history, args)
      handleRouteChange()
    }
    
    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args)
      handleRouteChange()
    }
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange)
      history.pushState = originalPushState
      history.replaceState = originalReplaceState
    }
  }, [])

  // Fetch server render data
  const fetchServerRenderData = useCallback(async () => {
    setIsLoadingServerData(true)
    try {
      const result = await getServerRenderLogs()
      if (result.success && result.data) {
        setServerRenderData(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch server render data:', error)
    } finally {
      setIsLoadingServerData(false)
    }
  }, [])

  // Auto-refresh server data
  useEffect(() => {
    if (autoRefresh && isOpen && !isMinimized) {
      fetchServerRenderData()
      const interval = setInterval(fetchServerRenderData, 5000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh, isOpen, isMinimized, fetchServerRenderData])

  // Dragging functionality
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
    // Set cursor for entire body during drag
    document.body.style.cursor = 'grabbing'
  }, [position])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    e.preventDefault()
    if (isDragging) {
      const newX = Math.max(0, Math.min(window.innerWidth - size.width, e.clientX - dragOffset.x))
      const newY = Math.max(0, Math.min(window.innerHeight - size.height, e.clientY - dragOffset.y))
      
      setPosition({ x: newX, y: newY })
    } else if (isResizing) {
      const deltaX = e.clientX - resizeStart.x
      const deltaY = e.clientY - resizeStart.y
      
      const newWidth = Math.max(350, resizeStart.width + deltaX)
      const newHeight = Math.max(280, resizeStart.height + deltaY)
      
      setSize({ width: newWidth, height: newHeight })
    }
  }, [isDragging, isResizing, dragOffset, resizeStart, size])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setIsResizing(false)
    // Remove any body cursor styles
    document.body.style.cursor = ''
  }, [])

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    })
  }, [size])

  // Event listeners
  useEffect(() => {
    if (isDragging || isResizing) {
      const options = { passive: false }
      document.addEventListener('mousemove', handleMouseMove, options)
      document.addEventListener('mouseup', handleMouseUp, options)
      
      // Prevent text selection during drag
      document.body.style.userSelect = 'none'
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.userSelect = ''
      }
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp])

  // Clear server logs
  const handleClearServerLogs = async () => {
    await clearServerRenderLogs()
    setServerRenderData(null)
    fetchServerRenderData()
  }

  const metrics = getMetrics()

  const getPageName = (path: string) => {
    if (path === '/') return 'Home'
    return path.split('/').filter(Boolean).map(segment => 
      segment.charAt(0).toUpperCase() + segment.slice(1)
    ).join(' > ')
  }

  const getSeverityColor = (count: number) => {
    if (count > 50) return 'text-red-500 bg-red-50 border-red-200'
    if (count > 20) return 'text-yellow-500 bg-yellow-50 border-yellow-200'
    if (count > 10) return 'text-orange-500 bg-orange-50 border-orange-200'
    return 'text-green-500 bg-green-50 border-green-200'
  }

  const getTestStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Clock className="h-3 w-3 animate-spin text-blue-500" />
      case 'passed': return <CheckCircle className="h-3 w-3 text-green-500" />
      case 'failed': return <XCircle className="h-3 w-3 text-red-500" />
      default: return <Target className="h-3 w-3 text-gray-500" />
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      <div 
        ref={windowRef}
        className={`absolute pointer-events-auto ${
          isDragging ? 'transition-none' : 'transition-all duration-200 ease-in-out'
        } ${
          isMinimized 
            ? 'w-80 h-12' 
            : ''
        }`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          width: isMinimized ? 320 : size.width,
          height: isMinimized ? 48 : size.height,
          minWidth: isMinimized ? 320 : 350,
          minHeight: isMinimized ? 48 : 280
        }}
      >
        <Card className="h-full shadow-2xl border-2 border-primary/20 bg-background/80 backdrop-blur-xl backdrop-saturate-150 select-none">
          {/* Header */}
          <CardHeader className="pb-2">
            <CardTitle 
              className={`flex items-center justify-between text-sm drag-handle select-none ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
              onMouseDown={handleMouseDown}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Move className="h-4 w-4 text-primary flex-shrink-0" />
                <Monitor className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="truncate">Enhanced Performance Monitor</span>
                {isTracking && (
                  <Badge variant="outline" className="text-xs flex-shrink-0">
                    <Activity className="h-2 w-2 mr-1 animate-pulse" />
                    <span className="hidden sm:inline">Live</span>
                  </Badge>
                )}
                {autoRefresh && (
                  <Badge variant="outline" className="text-xs flex-shrink-0">
                    <RefreshCw className="h-2 w-2 mr-1 animate-spin" />
                    <span className="hidden sm:inline">Auto</span>
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className="h-6 w-6 p-0"
                  title="Toggle auto-refresh"
                >
                  <Settings className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onMinimize}
                  className="h-6 w-6 p-0"
                >
                  {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </CardTitle>
            {!isMinimized && (
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Page: {getPageName(currentPage)}</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Smartphone className="h-3 w-3" />
                    <span>{metrics.totalRenders} client</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Server className="h-3 w-3" />
                    <span>{serverRenderData?.stats.totalRenders || 0} server</span>
                  </div>
                </div>
              </div>
            )}
          </CardHeader>

          {/* Minimized View */}
          {isMinimized ? (
            <CardContent className="pt-0">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3 text-yellow-500" />
                    <span>{metrics.totalRenders}c</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Server className="h-3 w-3 text-blue-500" />
                    <span>{serverRenderData?.stats.totalRenders || 0}s</span>
                  </div>
                  {(metrics.excessiveRenderComponents.length > 0 || (serverRenderData?.stats.averageRenderTime || 0) > 16) && (
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                      <span>Issues</span>
                    </div>
                  )}
                </div>
                <Button
                  variant={isTracking ? "destructive" : "default"}
                  size="sm"
                  onClick={isTracking ? stopTracking : startTracking}
                  className="h-6 text-xs px-2"
                >
                  {isTracking ? <Pause className="h-2 w-2" /> : <Play className="h-2 w-2" />}
                </Button>
              </div>
            </CardContent>
          ) : (
            /* Full View */
            <CardContent className="pt-0 h-full overflow-hidden flex flex-col">
              {/* Quick Controls */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Button
                  variant={isTracking ? "destructive" : "default"}
                  size="sm"
                  onClick={isTracking ? stopTracking : startTracking}
                  className="text-xs h-7 flex-shrink-0"
                >
                  {isTracking ? (
                    <>
                      <Pause className="h-3 w-3 mr-1" />
                      <span className="hidden sm:inline">Stop Client</span>
                      <span className="sm:hidden">Stop</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3 mr-1" />
                      <span className="hidden sm:inline">Start Client</span>
                      <span className="sm:hidden">Start</span>
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchServerRenderData}
                  disabled={isLoadingServerData}
                  className="text-xs h-7 flex-shrink-0"
                >
                  {isLoadingServerData ? (
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  ) : (
                    <Server className="h-3 w-3 mr-1" />
                  )}
                  <span className="hidden sm:inline">Refresh Server</span>
                  <span className="sm:hidden">Refresh</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    clearData()
                    clearResults()
                    handleClearServerLogs()
                  }}
                  className="text-xs h-7 flex-shrink-0"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">Reset All</span>
                  <span className="sm:hidden">Reset</span>
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
                <div className="bg-muted/50 rounded p-2 text-center min-w-0">
                  <div className="text-sm lg:text-lg font-bold text-blue-600 truncate">{metrics.totalRenders}</div>
                  <div className="text-xs text-muted-foreground truncate">Client</div>
                </div>
                <div className="bg-muted/50 rounded p-2 text-center min-w-0">
                  <div className="text-sm lg:text-lg font-bold text-green-600 truncate">{serverRenderData?.stats.totalRenders || 0}</div>
                  <div className="text-xs text-muted-foreground truncate">Server</div>
                </div>
                <div className="bg-muted/50 rounded p-2 text-center min-w-0">
                  <div className="text-sm lg:text-lg font-bold text-purple-600 truncate">{metrics.componentsTracked}</div>
                  <div className="text-xs text-muted-foreground truncate">Components</div>
                </div>
                <div className="bg-muted/50 rounded p-2 text-center min-w-0">
                  <div className="text-sm lg:text-lg font-bold text-orange-600 truncate">
                    {Math.max(metrics.averageRenderTime, serverRenderData?.stats.averageRenderTime || 0).toFixed(1)}ms
                  </div>
                  <div className="text-xs text-muted-foreground truncate">Avg Time</div>
                </div>
              </div>

              {/* Content Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-3 text-xs">
                  <TabsTrigger value="client-renders" className="text-xs">
                    <Smartphone className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="hidden sm:inline">Client</span>
                    <span className="sm:hidden">C</span>
                  </TabsTrigger>
                  <TabsTrigger value="server-renders" className="text-xs">
                    <Server className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="hidden sm:inline">Server</span>
                    <span className="sm:hidden">S</span>
                  </TabsTrigger>
                  <TabsTrigger value="tests" className="text-xs">
                    <Target className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="hidden sm:inline">Tests</span>
                    <span className="sm:hidden">T</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="client-renders" className="flex-1 mt-2">
                  <ScrollArea className="h-[400px]">
                    {renderData.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground text-xs">
                        <Smartphone className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No client renders tracked. Start monitoring to see data.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {renderData
                          .sort((a, b) => b.renderCount - a.renderCount)
                          .map((component) => (
                            <div
                              key={component.componentName}
                              className={`p-2 lg:p-3 rounded border text-xs ${getSeverityColor(component.renderCount)}`}
                            >
                              <div className="flex items-center justify-between mb-1 min-w-0">
                                <span className="font-medium truncate mr-2">{component.componentName}</span>
                                <Badge variant="outline" className="text-xs flex-shrink-0">
                                  {component.renderCount}
                                  <span className="hidden sm:inline ml-1">renders</span>
                                </Badge>
                              </div>
                              <div className="flex justify-between text-xs opacity-75 min-w-0">
                                <span className="truncate mr-2">{new Date(component.lastRenderTime).toLocaleTimeString()}</span>
                                <span className="flex-shrink-0">{component.averageRenderTime.toFixed(1)}ms</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="server-renders" className="flex-1 mt-2">
                  <ScrollArea className="h-[400px]">
                    {!serverRenderData || serverRenderData.logs.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground text-xs">
                        <Server className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No server renders tracked. Refresh to fetch SSR data.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {serverRenderData.logs
                          .sort((a, b) => b.renderOrder - a.renderOrder)
                          .map((log) => (
                            <div
                              key={log.id}
                              className="p-2 lg:p-3 rounded border bg-blue-50 border-blue-200 text-xs"
                            >
                              <div className="flex items-center justify-between mb-1 min-w-0">
                                <span className="font-medium truncate mr-2">{log.componentName}</span>
                                <div className="flex items-center gap-1 lg:gap-2 flex-shrink-0">
                                  <Badge variant="outline" className="text-xs bg-blue-100">
                                    {log.renderType}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground hidden sm:inline">
                                    #{log.renderOrder}
                                  </span>
                                </div>
                              </div>
                              <div className="flex justify-between text-xs opacity-75 min-w-0">
                                <span className="truncate mr-2">{log.route}</span>
                                <span className="flex-shrink-0">{log.renderTime.toFixed(2)}ms</span>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1 flex justify-between min-w-0">
                                <span className="truncate mr-2">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                {log.renderDepth > 0 && (
                                  <span className="flex-shrink-0 hidden sm:inline">D:{log.renderDepth}</span>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="tests" className="flex-1 mt-2">
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => runRenderCountTest()}
                        className="text-xs h-8"
                      >
                        <Target className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span>Renders</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => runMemoryLeakTest()}
                        className="text-xs h-8"
                      >
                        <MemoryStick className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span>Memory</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => runPerformanceTest()}
                        className="text-xs h-8"
                      >
                        <Zap className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span>Performance</span>
                      </Button>
                    </div>

                    <ScrollArea className="h-[350px]">
                      <div className="space-y-2">
                        {testResults.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground text-xs">
                            <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No tests run yet. Click a test button above.</p>
                          </div>
                        ) : (
                          testResults.map((result, index) => (
                            <div key={index} className="p-2 lg:p-3 border rounded text-xs">
                              <div className="flex items-center justify-between mb-1 min-w-0">
                                <div className="flex items-center gap-2 min-w-0">
                                  {getTestStatusIcon(result.status)}
                                  <span className="font-medium truncate">{result.name}</span>
                                </div>
                                {result.duration && (
                                  <span className="text-muted-foreground flex-shrink-0">{result.duration.toFixed(0)}ms</span>
                                )}
                              </div>
                              {result.details && (
                                <p className="text-muted-foreground break-words">{result.details}</p>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          )}

          {/* Resize Handle */}
          {!isMinimized && (
            <div
              className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize hover:bg-primary/20 rounded-tl-md"
              onMouseDown={handleResizeStart}
            >
              <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-muted-foreground/50" />
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
