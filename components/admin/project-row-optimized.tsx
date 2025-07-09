'use client'

import { memo } from 'react'
import { Project } from '@/lib/actions/projects'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Edit, Trash2, Star, ExternalLink, Github } from 'lucide-react'
import { useRenderTracker } from '@/hooks/use-render-tracker'

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
            <Badge key={tech} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
          {project.tech_stack.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{project.tech_stack.length - 3}
            </Badge>
          )}
        </div>
      </td>
      <td className="p-4">
        {project.status && (
          <Badge
            variant={
              project.status === "published"
                ? "default"
                : project.status === "draft"
                ? "secondary"
                : "destructive"
            }
          >
            {project.status}
          </Badge>
        )}
      </td>
      <td className="p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            console.log('⭐ Star button clicked for project:', project.id);
            onToggleFeatured(project.id);
          }}
          disabled={loading[project.id]}
          className="p-2"
        >
          <Star
            className={`h-4 w-4 ${
              project.featured
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            }`}
          />
        </Button>
      </td>
      <td className="p-4">
        <div className="flex space-x-1">
          {project.demo_url && (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="p-2"
            >
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
          {project.github_url && (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="p-2"
            >
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </td>
      <td className="p-4">
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(project)}
            className="p-2"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Project</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{project.title}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    console.log('🗑️ Delete button clicked for project:', project.id);
                    onDelete(project.id);
                  }}
                  disabled={loading[project.id]}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {loading[project.id] ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </td>
    </tr>
  )
})

ProjectRow.displayName = 'ProjectRow'

export { ProjectRow }
