"use client"

import { useState } from "react"
import { Project } from "@/lib/actions/projects"
import { deleteProject, toggleProjectFeatured } from "@/lib/actions/projects"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProjectForm } from "./project-form"
import { Edit, Trash2, Star, ExternalLink, Github } from "lucide-react"
import { toast } from "sonner"

interface ProjectsTableOptimizedProps {
  projects: Project[]
  onUpdate?: (project: Project) => void
  onDelete?: (projectId: number) => void
  onToggleFeatured?: (projectId: number) => void
}

export function ProjectsTableOptimized({ 
  projects, 
  onUpdate, 
  onDelete, 
  onToggleFeatured 
}: ProjectsTableOptimizedProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({})

  const handleToggleFeatured = async (projectId: number) => {
    setLoading(prev => ({ ...prev, [projectId]: true }))
    try {
      if (onToggleFeatured) {
        await onToggleFeatured(projectId)
      } else {
        await toggleProjectFeatured(projectId)
      }
      
      toast.success("Project featured status updated")
    } catch (error) {
      toast.error("Failed to update project")
    } finally {
      setLoading(prev => ({ ...prev, [projectId]: false }))
    }
  }

  const handleDelete = async (projectId: number) => {
    setLoading(prev => ({ ...prev, [projectId]: true }))
    try {
      if (onDelete) {
        await onDelete(projectId)
      } else {
        await deleteProject(projectId)
      }
      
      toast.success("Project deleted successfully")
    } catch (error) {
      toast.error("Failed to delete project")
    } finally {
      setLoading(prev => ({ ...prev, [projectId]: false }))
    }
  }

  const handleEdit = (project: Project) => {
    setSelectedProject(project)
    setIsEditDialogOpen(true)
  }

  const handleEditSuccess = (updatedProject: Project) => {
    if (onUpdate) {
      onUpdate(updatedProject)
    }
    
    setIsEditDialogOpen(false)
    setSelectedProject(null)
  }

  // Don't render anything if no projects
  if (projects.length === 0) {
    return null;
  }

  return (
    <>
      <CardContent>
        <div className="rounded-md mt-4 border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Technology</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Links</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleFeatured(project.id)}
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
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(project)}
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
                              onClick={() => handleDelete(project.id)}
                              disabled={loading[project.id]}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              {loading[project.id] ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Edit Dialog - Only rendered when needed */}
      {isEditDialogOpen && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="form-glass-card max-w-5xl max-h-[90vh] overflow-y-auto border-accent/20">
            <DialogHeader className="pb-6">
              <DialogTitle className="text-2xl font-bold text-gradient flex items-center gap-3">
                <div className="p-2 bg-accent/20 rounded-lg backdrop-blur-sm">
                  <Edit className="h-5 w-5" />
                </div>
                Edit Project
              </DialogTitle>
            </DialogHeader>
            {selectedProject && (
              <ProjectForm
                project={selectedProject}
                onSuccess={handleEditSuccess}
                onCancel={() => {
                  setIsEditDialogOpen(false)
                  setSelectedProject(null)
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
