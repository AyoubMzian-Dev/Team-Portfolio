'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useRenderTracking, usePerformanceTest } from '@/hooks/use-render-tracker'
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
  TrendingUp
} from 'lucide-react'

interface GlobalTestPopupProps {
  isOpen: boolean
  onClose: () => void
  onMinimize: () => void
  isMinimized: boolean
}

export function GlobalTestPopup({ isOpen, onClose, onMinimize, isMinimized }: GlobalTestPopupProps) {
  const [currentPage, setCurrentPage] = useState('')
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

  // Track current page
  useEffect(() => {
    setCurrentPage(window.location.pathname)
    
    const handleRouteChange = () => {
      setCurrentPage(window.location.pathname)
    }
    
    window.addEventListener('popstate', handleRouteChange)
    
    // For Next.js router changes (if needed)
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
        className={`absolute transition-all duration-300 ease-in-out pointer-events-auto ${
          isMinimized 
            ? 'bottom-20 right-4 w-80 h-12' 
            : 'bottom-4 right-4 w-96 h-[600px]'
        }`}
      >
        <Card className="h-full shadow-2xl border-2 border-primary/20 bg-background/95 backdrop-blur-sm">
          {/* Header */}
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4 text-primary" />
                <span>Performance Monitor</span>
                {isTracking && (
                  <Badge variant="outline" className="text-xs">
                    <Activity className="h-2 w-2 mr-1 animate-pulse" />
                    Live
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1">
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
                <div className="flex items-center gap-1">
                  <span>{metrics.totalRenders} renders</span>
                  <span>•</span>
                  <span>{metrics.componentsTracked} components</span>
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
                    <span>{metrics.totalRenders}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MemoryStick className="h-3 w-3 text-blue-500" />
                    <span>{metrics.componentsTracked}</span>
                  </div>
                  {metrics.excessiveRenderComponents.length > 0 && (
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                      <span>{metrics.excessiveRenderComponents.length}</span>
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
              <div className="flex items-center gap-1 mb-3">
                <Button
                  variant={isTracking ? "destructive" : "default"}
                  size="sm"
                  onClick={isTracking ? stopTracking : startTracking}
                  className="text-xs h-7"
                >
                  {isTracking ? (
                    <>
                      <Pause className="h-3 w-3 mr-1" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3 mr-1" />
                      Start
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    clearData()
                    clearResults()
                  }}
                  className="text-xs h-7"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Reset
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-muted/50 rounded p-2 text-center">
                  <div className="text-lg font-bold">{metrics.totalRenders}</div>
                  <div className="text-xs text-muted-foreground">Renders</div>
                </div>
                <div className="bg-muted/50 rounded p-2 text-center">
                  <div className="text-lg font-bold">{metrics.componentsTracked}</div>
                  <div className="text-xs text-muted-foreground">Components</div>
                </div>
                <div className="bg-muted/50 rounded p-2 text-center">
                  <div className="text-lg font-bold">{metrics.averageRenderTime.toFixed(1)}ms</div>
                  <div className="text-xs text-muted-foreground">Avg Time</div>
                </div>
              </div>

              {/* Content Tabs */}
              <Tabs defaultValue="renders" className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-2 text-xs">
                  <TabsTrigger value="renders" className="text-xs">Components</TabsTrigger>
                  <TabsTrigger value="tests" className="text-xs">Tests</TabsTrigger>
                </TabsList>

                <TabsContent value="renders" className="flex-1 mt-2">
                  <ScrollArea className="h-[380px]">
                    {renderData.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground text-xs">
                        <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No data. Start tracking to monitor components.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {renderData
                          .sort((a, b) => b.renderCount - a.renderCount)
                          .slice(0, 20) // Show top 20 components
                          .map((component) => (
                            <div
                              key={component.componentName}
                              className={`p-2 rounded border text-xs ${getSeverityColor(component.renderCount)}`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium truncate">{component.componentName}</span>
                                <Badge variant="outline" className="text-xs h-4">
                                  {component.renderCount}
                                </Badge>
                              </div>
                              <div className="flex justify-between text-xs opacity-75">
                                <span>{new Date(component.lastRenderTime).toLocaleTimeString()}</span>
                                <span>{component.averageRenderTime.toFixed(1)}ms</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="tests" className="flex-1 mt-2">
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => runRenderCountTest()}
                        className="text-xs h-7"
                      >
                        <Target className="h-2 w-2 mr-1" />
                        Renders
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => runMemoryLeakTest()}
                        className="text-xs h-7"
                      >
                        <MemoryStick className="h-2 w-2 mr-1" />
                        Memory
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => runPerformanceTest()}
                        className="text-xs h-7"
                      >
                        <Zap className="h-2 w-2 mr-1" />
                        Perf
                      </Button>
                    </div>

                    <ScrollArea className="h-[340px]">
                      <div className="space-y-2">
                        {testResults.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground text-xs">
                            <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No tests run yet. Click a test button above.</p>
                          </div>
                        ) : (
                          testResults.map((result, index) => (
                            <div key={index} className="p-2 border rounded text-xs">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-1">
                                  {getTestStatusIcon(result.status)}
                                  <span className="font-medium truncate">{result.name}</span>
                                </div>
                                {result.duration && (
                                  <span className="text-muted-foreground">{result.duration.toFixed(0)}ms</span>
                                )}
                              </div>
                              {result.details && (
                                <p className="text-muted-foreground truncate">{result.details}</p>
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
        </Card>
      </div>
    </div>
  )
}
