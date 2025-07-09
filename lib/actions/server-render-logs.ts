'use server'

import { serverRenderTracker } from '@/lib/server-render-tracker'

export async function getServerRenderLogs() {
  try {
    const logs = serverRenderTracker.getLogs()
    const stats = serverRenderTracker.getStats()
    
    return {
      success: true,
      data: {
        logs,
        stats,
        timestamp: new Date().toISOString()
      }
    }
  } catch (error) {
    console.error('Error fetching server render logs:', error)
    return {
      success: false,
      error: 'Failed to fetch server render logs',
      data: null
    }
  }
}

export async function clearServerRenderLogs() {
  try {
    serverRenderTracker.clearLogs()
    return {
      success: true,
      message: 'Server render logs cleared'
    }
  } catch (error) {
    console.error('Error clearing server render logs:', error)
    return {
      success: false,
      error: 'Failed to clear server render logs'
    }
  }
}
