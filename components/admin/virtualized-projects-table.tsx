"use client"

import { useState, useCallback, useMemo, memo } from "react"
import { Project } from "@/lib/actions/projects"
import { ProjectRow } from "./project-row-optimized"
import { FixedSizeList as List } from 'react-window'

interface VirtualizedProjectsTableProps {
  projects: Project[]
  onUpdate?: (project: Project) => void
  onDelete?: (projectId: number) => void
  onToggleFeatured?: (projectId: number) => void
}

// Memoized table header
const TableHeader = memo(() => (
  <thead className="border-b border-border/50">
    <tr>
      <th className="text-left p-4 font-medium">Project</th>
      <th className="text-left p-4 font-medium">Technology</th>
      <th className="text-left p-4 font-medium">Status</th>
      <th className="text-left p-4 font-medium">Featured</th>
      <th className="text-left p-4 font-medium">Links</th>
      <th className="text-left p-4 font-medium">Actions</th>
    </tr>
  </thead>
))

TableHeader.displayName = 'TableHeader'

export const VirtualizedProjectsTable = memo(({
  projects,
  onUpdate,
  onDelete,
  onToggleFeatured
}: VirtualizedProjectsTableProps) => {
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({})

  // Memoized handlers to prevent re-renders
  const handleEdit = useCallback((project: Project) => {
    // Implementation for edit
    console.log('Editing project:', project.id)
  }, [])

  const handleDelete = useCallback(async (projectId: number) => {
    if (!onDelete) return
    
    setLoading(prev => ({ ...prev, [projectId]: true }))
    try {
      await onDelete(projectId)
    } finally {
      setLoading(prev => ({ ...prev, [projectId]: false }))
    }
  }, [onDelete])

  const handleToggleFeatured = useCallback(async (projectId: number) => {
    if (!onToggleFeatured) return
    
    setLoading(prev => ({ ...prev, [projectId]: true }))
    try {
      await onToggleFeatured(projectId)
    } finally {
      setLoading(prev => ({ ...prev, [projectId]: false }))
    }
  }, [onToggleFeatured])

  // Memoized row renderer for virtualization
  const Row = useMemo(() => memo(({ index, style }: { index: number, style: any }) => {
    const project = projects[index]
    if (!project) return null

    return (
      <div style={style}>
        <ProjectRow
          project={project}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleFeatured={handleToggleFeatured}
          loading={loading}
        />
      </div>
    )
  }), [projects, handleEdit, handleDelete, handleToggleFeatured, loading])

  // For small lists, use regular table. For large lists, use virtualization
  const shouldVirtualize = projects.length > 50

  if (projects.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-muted-foreground">
          No projects found. Create your first project to get started.
        </div>
      </div>
    )
  }

  if (!shouldVirtualize) {
    return (
      <div className="rounded-md border">
        <table className="w-full">
          <TableHeader />
          <tbody>
            {projects.map((project) => (
              <ProjectRow
                key={project.id}
                project={project}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleFeatured={handleToggleFeatured}
                loading={loading}
              />
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // Virtualized table for large datasets
  return (
    <div className="rounded-md border">
      <table className="w-full">
        <TableHeader />
      </table>
      <div className="relative">
        <List
          height={600} // Fixed height for viewport
          width="100%" // Full width
          itemCount={projects.length}
          itemSize={80} // Height of each row
          overscanCount={5} // Render extra rows for smooth scrolling
        >
          {Row}
        </List>
      </div>
    </div>
  )
})

VirtualizedProjectsTable.displayName = 'VirtualizedProjectsTable'
