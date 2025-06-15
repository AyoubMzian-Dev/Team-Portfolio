"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SessionDebug() {
  const { data: session, status } = useSession()

  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null

  return (
    <Card className="mt-4 border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-sm text-yellow-800">🔧 Session Debug (Development Only)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-xs">
          <div><strong>Status:</strong> {status}</div>
          <div><strong>User ID:</strong> {session?.user?.id || 'N/A'}</div>
          <div><strong>Email:</strong> {session?.user?.email || 'N/A'}</div>
          <div><strong>Role:</strong> {session?.user?.role || 'N/A'}</div>
          <div><strong>Name:</strong> {session?.user?.name || 'N/A'}</div>
          <details className="mt-2">
            <summary className="cursor-pointer font-medium text-yellow-700">Full Session Data</summary>
            <pre className="mt-2 text-xs overflow-auto bg-white p-2 rounded border max-h-40">
              {JSON.stringify(session, null, 2)}
            </pre>
          </details>
        </div>
      </CardContent>
    </Card>
  )
}
