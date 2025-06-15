'use client'

import { memo, lazy, Suspense } from 'react'
import { Project } from '@/lib/actions/projects'
import { Edit, Trash2, Star, ExternalLink, Github } from 'lucide-react'
import { useRenderTracker } from '@/hooks/use-render-tracker'

// Lazy load heavy components
const ProjectForm = lazy(() => import('./project-form').then(module => ({ default: module.ProjectForm })))
const AlertDialog = lazy(() => import('@/components/ui/alert-dialog').then(module => ({ 
  default: module.AlertDialog 
})))
const AlertDialogContent = lazy(() => import('@/components/ui/alert-dialog').then(module => ({ 
  default: module.AlertDialogContent 
})))

// Memoized project row component to prevent unnecessary re-renders
const ProjectRow = memo(({ 
  project, 
  onEdit, 
  onDelete, 
  onToggleFeatured, 
  loading 
}: {
  project: Project
  onEdit: (project: Project) => void
  onDelete: (id: number) => void
  onToggleFeatured: (id: number) => void
  loading: { [key: number]: boolean }
}) => {
  // Track renders for performance monitoring
  useRenderTracker('ProjectRow', { projectId: project.id })

  return (
    <tr key={project.id} className="border-b border-border/50">
      <td className="p-4">
        <div className="flex items-center space-x-3">
          {project.image_url && (
            <img
              src={project.image_url}
              alt={project.title}
              className="w-10 h-10 rounded object-cover"
              loading="lazy"
            />
          )}
          <div>
            <div className="font-medium">{project.title}</div>
            <div className="text-sm text-muted-foreground line-clamp-1">
              {project.description}
            </div>
          </div>
        </div>
      </td>
      <td className="p-4">
        <div className="flex flex-wrap gap-1">
          {project.tech_stack.slice(0, 3).map((tech) => (
            <span 
              key={tech} 
              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground"
            >
              {tech}
            </span>
          ))}
          {project.tech_stack.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs border border-border">
              +{project.tech_stack.length - 3}
            </span>
          )}
        </div>
      </td>
      <td className="p-4">
        {project.status && (
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
              project.status === "published"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : project.status === "draft"
                ? "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {project.status}
          </span>
        )}
      </td>
      <td className="p-4">
        <button
          onClick={() => onToggleFeatured(project.id)}
          disabled={loading[project.id]}
          className="p-2 hover:bg-accent rounded-md transition-colors disabled:opacity-50"
        >
          <Star
            className={`h-4 w-4 ${
              project.featured
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            }`}
          />
        </button>
      </td>
      <td className="p-4">
        <div className="flex space-x-1">
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-accent rounded-md transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-accent rounded-md transition-colors"
            >
              <Github className="h-4 w-4" />
            </a>
          )}
        </div>
      </td>
      <td className="p-4">
        <div className="flex space-x-1">
          <button
            onClick={() => onEdit(project)}
            className="p-2 hover:bg-accent rounded-md transition-colors"
          >
            <Edit className="h-4 w-4" />
          </button>
          
          <Suspense fallback={<div className="p-2 w-8 h-8 bg-muted animate-pulse rounded"></div>}>
            <AlertDialog>
              <button className="p-2 hover:bg-accent rounded-md transition-colors text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4" />
              </button>
              <AlertDialogContent>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Delete Project</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Are you sure you want to delete "{project.title}"? This action cannot be undone.
                  </p>
                  <div className="flex justify-end gap-2">
                    <button className="px-3 py-2 text-sm rounded-md border border-border hover:bg-accent">
                      Cancel
                    </button>
                    <button
                      onClick={() => onDelete(project.id)}
                      disabled={loading[project.id]}
                      className="px-3 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      {loading[project.id] ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </Suspense>
        </div>
      </td>
    </tr>
  )
})

ProjectRow.displayName = 'ProjectRow'

export { ProjectRow }
