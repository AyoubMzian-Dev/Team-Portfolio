"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { Project, getProjects } from '@/lib/actions/projects'

interface UseProjectsSyncOptions {
  initialProjects: Project[]
  pollInterval?: number // in milliseconds
  enablePolling?: boolean
}

export function useProjectsSync({ 
  initialProjects, 
  pollInterval = 30000, // 30 seconds default
  enablePolling = true 
}: UseProjectsSyncOptions) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const pollTimeoutRef = useRef<NodeJS.Timeout>()

  // Manual refresh function
  const refreshProjects = useCallback(async () => {
    console.log('🔄 Refreshing projects data...')
    setIsRefreshing(true)
    
    try {
      const freshProjects = await getProjects()
      setProjects(freshProjects)
      setLastUpdated(new Date())
      console.log(`✅ Projects refreshed: ${freshProjects.length} projects loaded`)
    } catch (error) {
      console.error('❌ Failed to refresh projects:', error)
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  // Polling mechanism
  useEffect(() => {
    if (!enablePolling) return

    const startPolling = () => {
      pollTimeoutRef.current = setTimeout(async () => {
        await refreshProjects()
        startPolling() // Restart polling
      }, pollInterval)
    }

    startPolling()

    return () => {
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current)
      }
    }
  }, [refreshProjects, pollInterval, enablePolling])

  // Project CRUD operations with optimistic updates
  const addProject = useCallback((newProject: Project) => {
    console.log('➕ Adding project optimistically:', newProject.title)
    setProjects(prev => [newProject, ...prev])
    setLastUpdated(new Date())
  }, [])

  const updateProject = useCallback((updatedProject: Project) => {
    console.log('✏️ Updating project optimistically:', updatedProject.title)
    setProjects(prev => 
      prev.map(p => p.id === updatedProject.id ? updatedProject : p)
    )
    setLastUpdated(new Date())
  }, [])

  const removeProject = useCallback((projectId: number) => {
    console.log('🗑️ Removing project optimistically:', projectId)
    setProjects(prev => prev.filter(p => p.id !== projectId))
    setLastUpdated(new Date())
  }, [])

  const toggleProjectFeatured = useCallback((projectId: number) => {
    console.log('⭐ Toggling project featured status:', projectId)
    setProjects(prev => 
      prev.map(p => 
        p.id === projectId ? { ...p, featured: !p.featured } : p
      )
    )
    setLastUpdated(new Date())
  }, [])

  // Force refresh with optimistic update fallback
  const forceRefreshAfterMutation = useCallback(async () => {
    console.log('🚀 Force refreshing after mutation...')
    // Small delay to ensure database has been updated
    setTimeout(async () => {
      await refreshProjects()
    }, 500)
  }, [refreshProjects])

  return {
    projects,
    isRefreshing,
    lastUpdated,
    refreshProjects,
    forceRefreshAfterMutation,
    // Optimistic update methods
    addProject,
    updateProject,
    removeProject,
    toggleProjectFeatured,
  }
}
