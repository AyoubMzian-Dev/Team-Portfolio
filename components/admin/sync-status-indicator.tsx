

import { RefreshCw, Wifi, WifiOff, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface SyncStatusIndicatorProps {
  isRefreshing: boolean
  lastUpdated: Date
  isOnline?: boolean
}

export function SyncStatusIndicator({ 
  isRefreshing, 
  lastUpdated, 
  isOnline = true 
}: SyncStatusIndicatorProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit' 
    })
  }

  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 10) return 'just now'
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    return `${Math.floor(diffInSeconds / 3600)}h ago`
  }

  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground">
      {/* Connection Status */}
      <div className="flex items-center gap-1">
        {isOnline ? (
          <Wifi className="h-3 w-3 text-green-500" />
        ) : (
          <WifiOff className="h-3 w-3 text-red-500" />
        )}
        <span>{isOnline ? 'Online' : 'Offline'}</span>
      </div>

      {/* Sync Status */}
      <div className="flex items-center gap-1">
        {isRefreshing ? (
          <>
            <RefreshCw className="h-3 w-3 animate-spin text-blue-500" />
            <Badge variant="secondary" className="text-xs">
              Syncing...
            </Badge>
          </>
        ) : (
          <>
            <Clock className="h-3 w-3 text-green-500" />
            <span>Updated {getTimeAgo(lastUpdated)}</span>
          </>
        )}
      </div>

      {/* Last Update Time */}
      <div className="hidden sm:block text-xs text-muted-foreground/70">
        at {formatTime(lastUpdated)}
      </div>
    </div>
  )
}
