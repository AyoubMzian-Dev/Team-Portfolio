import { PerformanceTestDashboard } from '@/components/admin/performance-test-dashboard'

export default function PerformanceTestPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Performance Testing</h1>
        <p className="text-muted-foreground">
          Monitor component renders, run performance tests, and analyze your application's performance in real-time.
        </p>
      </div>
      
      <PerformanceTestDashboard />
    </div>
  )
}
