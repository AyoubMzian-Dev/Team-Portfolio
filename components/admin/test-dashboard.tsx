import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Clock,
  MemoryStick,
  Zap,
  Activity
} from 'lucide-react'
import { TEST_SUITES, ComponentTestResult, TestSuite, ComponentTest } from '@/lib/test-utils'

interface TestDashboardProps {
  selectedSuiteId?: string
  results?: ComponentTestResult[]
}

type TestType = 'render' | 'performance' | 'memory' | 'interaction'

export function TestDashboard({ selectedSuiteId, results = [] }: TestDashboardProps) {
  const selectedSuite = selectedSuiteId ? TEST_SUITES.find(s => s.id === selectedSuiteId) : null

  return (
    <div className="space-y-6">
      {/* Test Suites Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {TEST_SUITES.map((suite) => (
          <TestSuiteCard key={suite.id} suite={suite} />
        ))}
      </div>

      {/* Selected Suite Details */}
      {selectedSuite && (
        <Card className="border-2 border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-accent" />
              {selectedSuite.name}
              <SuiteStatusBadge status={selectedSuite.status} />
            </CardTitle>
            <p className="text-muted-foreground">{selectedSuite.description}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedSuite.tests.map((test) => (
                <TestItemCard key={test.id} test={test} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Test Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((result) => (
                <TestResultCard key={result.id} result={result} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function TestSuiteCard({ suite }: { suite: TestSuite }) {
  const enabledTests = suite.tests.filter(t => t.enabled).length
  const totalTests = suite.tests.length

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{suite.name}</CardTitle>
          <SuiteStatusBadge status={suite.status} />
        </div>
        <p className="text-sm text-muted-foreground">{suite.description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Enabled Tests:</span>
            <span className="font-medium">{enabledTests}/{totalTests}</span>
          </div>
          
          <div className="flex gap-2">
            <TestTypeIcon type="render" count={suite.tests.filter(t => t.testType === 'render').length} />
            <TestTypeIcon type="performance" count={suite.tests.filter(t => t.testType === 'performance').length} />
            <TestTypeIcon type="memory" count={suite.tests.filter(t => t.testType === 'memory').length} />
            <TestTypeIcon type="interaction" count={suite.tests.filter(t => t.testType === 'interaction').length} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TestItemCard({ test }: { test: ComponentTest }) {
  return (
    <div className="border rounded-lg p-4 bg-card/50">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium">{test.name}</h4>
        <div className="flex items-center gap-2">
          <TestTypeBadge type={test.testType} />
          <Badge variant={test.enabled ? "default" : "secondary"}>
            {test.enabled ? "Enabled" : "Disabled"}
          </Badge>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{test.description}</p>
      
      <div className="flex gap-4 text-xs text-muted-foreground">
        <span>Component: <code className="text-accent">{test.component}</code></span>
        {test.maxRenderTime && (
          <span>Max Render: <code>{test.maxRenderTime}ms</code></span>
        )}
        {test.expectedRenderCount && (
          <span>Expected Renders: <code>{test.expectedRenderCount}</code></span>
        )}
      </div>
    </div>
  )
}

function TestResultCard({ result }: { result: ComponentTestResult }) {
  const statusIcon = {
    success: <CheckCircle className="h-4 w-4 text-green-500" />,
    warning: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
    error: <XCircle className="h-4 w-4 text-red-500" />
  }

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {statusIcon[result.status]}
          <h4 className="font-medium">{result.componentName}</h4>
          <Badge variant="outline">{result.status}</Badge>
        </div>
        <span className="text-sm text-muted-foreground">
          {result.timestamp.toLocaleTimeString()}
        </span>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Render Time:</span>
          <div className="font-medium">{result.lastRenderTime.toFixed(2)}ms</div>
        </div>
        <div>
          <span className="text-muted-foreground">Render Count:</span>
          <div className="font-medium">{result.renderCount}</div>
        </div>
        <div>
          <span className="text-muted-foreground">Avg Time:</span>
          <div className="font-medium">{result.averageRenderTime.toFixed(2)}ms</div>
        </div>
        <div>
          <span className="text-muted-foreground">Memory:</span>
          <div className="font-medium">
            {result.memoryUsage ? `${result.memoryUsage.toFixed(1)}MB` : 'N/A'}
          </div>
        </div>
      </div>

      {result.errors.length > 0 && (
        <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded">
          <div className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">Errors:</div>
          {result.errors.map((error, index) => (
            <div key={index} className="text-xs text-red-600 dark:text-red-300">{error}</div>
          ))}
        </div>
      )}
    </div>
  )
}

function SuiteStatusBadge({ status }: { status: TestSuite['status'] }) {
  const variants = {
    idle: { variant: 'secondary' as const, text: 'Idle' },
    running: { variant: 'default' as const, text: 'Running' },
    completed: { variant: 'default' as const, text: 'Completed' },
    failed: { variant: 'destructive' as const, text: 'Failed' }
  }

  const config = variants[status]
  return <Badge variant={config.variant}>{config.text}</Badge>
}

function TestTypeBadge({ type }: { type: TestType }) {
  const variants: Record<TestType, { color: string; text: string }> = {
    render: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', text: 'Render' },
    performance: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', text: 'Performance' },
    memory: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', text: 'Memory' },
    interaction: { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200', text: 'Interaction' }
  }

  const config = variants[type] || variants.render
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.text}
    </span>
  )
}

function TestTypeIcon({ type, count }: { type: TestType, count: number }) {
  const icons: Record<TestType, React.ReactElement> = {
    render: <Zap className="h-3 w-3" />,
    performance: <Clock className="h-3 w-3" />,
    memory: <MemoryStick className="h-3 w-3" />,
    interaction: <Activity className="h-3 w-3" />
  }

  if (count === 0) return null

  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      {icons[type]}
      <span>{count}</span>
    </div>
  )
}
