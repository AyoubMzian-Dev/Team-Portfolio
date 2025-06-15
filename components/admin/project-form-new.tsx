"use client"

import { useState, useEffect } from "react"
import { createProject, updateProject, Project } from "@/lib/actions/projects"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { toast } from "sonner"

interface ProjectFormProps {
  project?: Project
  onSuccess?: (project: Project) => void
  onCancel?: () => void
}

const TECH_OPTIONS = [
  "React", "Next.js", "TypeScript", "JavaScript", "Node.js", "Express",
  "Python", "Django", "Flask", "PostgreSQL", "MySQL", "MongoDB",
  "Tailwind CSS", "CSS", "HTML", "Vue.js", "Angular", "Svelte",
  "GraphQL", "REST API", "Docker", "AWS", "Vercel", "Netlify",
  "Git", "GitHub", "Firebase", "Supabase", "Prisma", "Drizzle"
]

const CATEGORIES = [
  "Web Application",
  "Mobile App", 
  "Desktop App",
  "API/Backend",
  "Library/Package",
  "Tool/Utility",
  "Game",
  "Other"
]

export function ProjectForm({ project, onSuccess, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: project?.title || "",
    description: project?.description || "",
    long_description: project?.long_description || "",
    image_url: project?.image_url || "",
    demo_url: project?.demo_url || "",
    github_url: project?.github_url || "",
    category: project?.category || "",
    status: project?.status || "draft",
    featured: project?.featured || false,
    tech_stack: project?.tech_stack || [],
  })
  
  const [newTech, setNewTech] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const isEditing = !!project

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be 100 characters or less"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    } else if (formData.description.length > 500) {
      newErrors.description = "Description must be 500 characters or less"
    }

    if (!formData.category) {
      newErrors.category = "Category is required"
    }

    if (formData.tech_stack.length === 0) {
      newErrors.tech_stack = "At least one technology is required"
    }

    if (formData.demo_url && !isValidUrl(formData.demo_url)) {
      newErrors.demo_url = "Must be a valid URL"
    }

    if (formData.github_url && !isValidUrl(formData.github_url)) {
      newErrors.github_url = "Must be a valid URL"
    }

    if (formData.image_url && !isValidUrl(formData.image_url)) {
      newErrors.image_url = "Must be a valid URL"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error("Please fix the form errors")
      return
    }

    setIsSubmitting(true)

    try {
      let result: Project
      
      if (isEditing) {
        result = await updateProject(project.id, formData)
        toast.success("Project updated successfully")
      } else {
        result = await createProject(formData)
        toast.success("Project created successfully")
      }

      onSuccess?.(result)
    } catch (error) {
      console.error("Form submission error:", error)
      toast.error(isEditing ? "Failed to update project" : "Failed to create project")
    } finally {
      setIsSubmitting(false)
    }
  }

  const addTechStack = () => {
    if (newTech.trim() && !formData.tech_stack.includes(newTech.trim())) {
      setFormData(prev => ({
        ...prev,
        tech_stack: [...prev.tech_stack, newTech.trim()]
      }))
      setNewTech("")
      // Clear tech_stack error if it exists
      if (errors.tech_stack) {
        setErrors(prev => ({ ...prev, tech_stack: "" }))
      }
    }
  }

  const removeTechStack = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      tech_stack: prev.tech_stack.filter(t => t !== tech)
    }))
  }

  const addTechFromSelect = (tech: string) => {
    if (!formData.tech_stack.includes(tech)) {
      setFormData(prev => ({
        ...prev,
        tech_stack: [...prev.tech_stack, tech]
      }))
      // Clear tech_stack error if it exists
      if (errors.tech_stack) {
        setErrors(prev => ({ ...prev, tech_stack: "" }))
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter project title"
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <Label htmlFor="description">Short Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Brief description for project cards"
            rows={3}
            className={errors.description ? "border-red-500" : ""}
          />
          {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
        </div>

        {/* Long Description */}
        <div className="md:col-span-2">
          <Label htmlFor="long_description">Detailed Description</Label>
          <Textarea
            id="long_description"
            value={formData.long_description}
            onChange={(e) => setFormData(prev => ({ ...prev, long_description: e.target.value }))}
            placeholder="Detailed project description (optional)"
            rows={4}
          />
        </div>

        {/* Category and Status */}
        <div>
          <Label htmlFor="category">Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger className={errors.category ? "border-red-500" : ""}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* URLs */}
        <div>
          <Label htmlFor="demo_url">Demo URL</Label>
          <Input
            id="demo_url"
            type="url"
            value={formData.demo_url}
            onChange={(e) => setFormData(prev => ({ ...prev, demo_url: e.target.value }))}
            placeholder="https://example.com"
            className={errors.demo_url ? "border-red-500" : ""}
          />
          {errors.demo_url && <p className="text-sm text-red-500 mt-1">{errors.demo_url}</p>}
        </div>

        <div>
          <Label htmlFor="github_url">GitHub URL</Label>
          <Input
            id="github_url"
            type="url"
            value={formData.github_url}
            onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
            placeholder="https://github.com/username/repo"
            className={errors.github_url ? "border-red-500" : ""}
          />
          {errors.github_url && <p className="text-sm text-red-500 mt-1">{errors.github_url}</p>}
        </div>

        {/* Image URL */}
        <div className="md:col-span-2">
          <Label htmlFor="image_url">Image URL</Label>
          <Input
            id="image_url"
            type="url"
            value={formData.image_url}
            onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
            placeholder="https://example.com/image.jpg"
            className={errors.image_url ? "border-red-500" : ""}
          />
          {errors.image_url && <p className="text-sm text-red-500 mt-1">{errors.image_url}</p>}
          {formData.image_url && (
            <div className="mt-2">
              <img
                src={formData.image_url}
                alt="Preview"
                className="w-32 h-32 object-cover rounded border"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Technology Stack */}
      <div>
        <Label>Technology Stack *</Label>
        <div className="space-y-3">
          {/* Quick Add from Common Options */}
          <div>
            <Label className="text-sm text-muted-foreground">Quick Add:</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {TECH_OPTIONS.filter(tech => !formData.tech_stack.includes(tech)).slice(0, 10).map((tech) => (
                <Button
                  key={tech}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addTechFromSelect(tech)}
                  className="text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {tech}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Add */}
          <div className="flex gap-2">
            <Input
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
              placeholder="Add custom technology"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechStack())}
            />
            <Button type="button" onClick={addTechStack}>
              Add
            </Button>
          </div>

          {/* Selected Technologies */}
          <div className="flex flex-wrap gap-2">
            {formData.tech_stack.map((tech) => (
              <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                {tech}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-red-500"
                  onClick={() => removeTechStack(tech)}
                />
              </Badge>
            ))}
          </div>
          {errors.tech_stack && <p className="text-sm text-red-500">{errors.tech_stack}</p>}
        </div>
      </div>

      {/* Featured */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="featured"
          checked={formData.featured}
          onCheckedChange={(checked) => 
            setFormData(prev => ({ ...prev, featured: !!checked }))
          }
        />
        <Label htmlFor="featured">Featured Project</Label>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting 
            ? (isEditing ? "Updating..." : "Creating...") 
            : (isEditing ? "Update Project" : "Create Project")
          }
        </Button>
      </div>
    </form>
  )
}
