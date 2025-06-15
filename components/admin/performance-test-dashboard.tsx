'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DraggableTestWindow } from './draggable-test-window'
import { useRenderTracking, usePerformanceTest } from '@/hooks/use-render-tracker'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Activity,
  MemoryStick,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Monitor,
  Target,
  TrendingUp,
  Eye,
  EyeOff
} from 'lucide-react'

export function PerformanceTestDashboard() {
  const [showTestWindow, setShowTestWindow] = useState(false)
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
    runAllTests,
    clearResults
  } = usePerformanceTest()

  const metrics = getMetrics()

  const handleStartMonitoring = useCallback(() => {
    startTracking()
    setShowTestWindow(true)
  }, [startTracking])

  const handleStopMonitoring = useCallback(() => {
    stopTracking()
  }, [stopTracking])

  const handleReset = useCallback(() => {
    clearData()
    clearResults()
  }, [clearData, clearResults])

  const getTestStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Clock className="h-4 w-4 animate-spin text-blue-500" />
      case 'passed': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <Target className="h-4 w-4 text-gray-500" />
    }
  }

  const getSeverityColor = (count: number) => {
    if (count > 50) return 'text-red-500 bg-red-50'
    if (count > 20) return 'text-yellow-500 bg-yellow-50'
    if (count > 10) return 'text-orange-500 bg-orange-50'
    return 'text-green-500 bg-green-50'
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-primary" />
              Performance Testing Dashboard
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isTracking ? 'default' : 'secondary'}>
                {isTracking ? (
                  <>
                    <Activity className="h-3 w-3 mr-1 animate-pulse" />
                    Tracking Active
                  </>
                ) : (
                  'Tracking Inactive'
                )}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTestWindow(!showTestWindow)}
              >
                {showTestWindow ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-1" />
                    Hide Window
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-1" />
                    Show Window
                  </>
                )}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant={isTracking ? "destructive" : "default"}
              onClick={isTracking ? handleStopMonitoring : handleStartMonitoring}
            >
              {isTracking ? (
                <>
                  <Pause className="h-4 w-4 mr-1" />
                  Stop Tracking
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  Start Tracking
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset All Data
            </Button>
            <Button
              variant="outline"
              onClick={runAllTests}
              disabled={testResults.some(t => t.status === 'running')}
            >
              <Target className="h-4 w-4 mr-1" />
              Run All Tests
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Renders</p>
                <p className="text-2xl font-bold">{metrics.totalRenders}</p>
              </div>
              <Zap className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Components Tracked</p>
                <p className="text-2xl font-bold">{metrics.componentsTracked}</p>
              </div>
              <MemoryStick className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Render Time</p>
                <p className="text-2xl font-bold">{metrics.averageRenderTime.toFixed(1)}ms</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Issues Found</p>
                <p className="text-2xl font-bold">{metrics.excessiveRenderComponents.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="renders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="renders">Component Renders</TabsTrigger>
          <TabsTrigger value="tests">Test Results</TabsTrigger>
          <TabsTrigger value="analysis">Performance Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="renders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Component Render Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderData.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No render data available. Start tracking to see component renders.</p>
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {renderData
                      .sort((a, b) => b.renderCount - a.renderCount)
                      .map((component) => (
                        <div
                          key={component.componentName}
                          className={`p-4 rounded-lg border ${getSeverityColor(component.renderCount)}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{component.componentName}</h3>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="font-mono">
                                {component.renderCount} renders
                              </Badge>
                              {component.renderCount > 10 && (
                                <Badge variant="destructive">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Excessive
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Last Render:</span>
                              <div className="font-mono">
                                {new Date(component.lastRenderTime).toLocaleTimeString()}
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Avg Time:</span>
                              <div className="font-mono">
                                {component.averageRenderTime.toFixed(2)}ms
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          <div className="grid gap-4">
            {[
              { id: 'render-count', name: 'Render Count Test', action: runRenderCountTest },
              { id: 'memory-leak', name: 'Memory Leak Test', action: runMemoryLeakTest },
              { id: 'performance', name: 'Performance Test', action: runPerformanceTest }
            ].map((test) => {
              const result = testResults.find(r => r.name.includes(test.name.split(' ')[0]))
              return (
                <Card key={test.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {result ? getTestStatusIcon(result.status) : <Target className="h-4 w-4 text-gray-500" />}
                        <h3 className="font-semibold">{test.name}</h3>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => test.action()}
                        disabled={result?.status === 'running'}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Run Test
                      </Button>
                    </div>
                    {result && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={result.status === 'passed' ? 'default' : 'destructive'}>
                            {result.status}
                          </Badge>
                          {result.duration && (
                            <span className="text-sm text-muted-foreground">
                              Completed in {result.duration.toFixed(0)}ms
                            </span>
                          )}
                        </div>
                        {result.details && (
                          <p className="text-sm text-muted-foreground">{result.details}</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Slowest Component</h4>
                  <p className="text-muted-foreground">
                    {metrics.slowestComponent || 'No data available'}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Fastest Component</h4>
                  <p className="text-muted-foreground">
                    {metrics.fastestComponent || 'No data available'}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Performance Score</h4>
                  <div className="flex items-center gap-2">
                    {metrics.averageRenderTime < 16 ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-green-600">Excellent</span>
                      </>
                    ) : metrics.averageRenderTime < 32 ? (
                      <>
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <span className="text-yellow-600">Good</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span className="text-red-600">Needs Improvement</span>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.excessiveRenderComponents.length > 0 && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded">
                      <h4 className="font-medium text-red-800 mb-1">Excessive Renders Detected</h4>
                      <p className="text-sm text-red-600">
                        Consider optimizing: {metrics.excessiveRenderComponents.join(', ')}
                      </p>
                    </div>
                  )}
                  {metrics.averageRenderTime > 16 && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <h4 className="font-medium text-yellow-800 mb-1">Performance Warning</h4>
                      <p className="text-sm text-yellow-600">
                        Average render time exceeds 16ms (60fps target)
                      </p>
                    </div>
                  )}
                  {metrics.totalRenders === 0 && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                      <h4 className="font-medium text-blue-800 mb-1">Start Monitoring</h4>
                      <p className="text-sm text-blue-600">
                        Click "Start Tracking" to begin performance monitoring
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Draggable Test Window */}
      {showTestWindow && <DraggableTestWindow />}
    </div>
  )
}
