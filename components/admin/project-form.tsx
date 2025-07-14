"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { createProject, updateProject, Project } from "@/lib/actions/projects"
import { Button } from "@/components/ui/button"
import { EnhancedButton } from "@/components/ui/enhanced-button"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { X, Plus, Image, Link, Github, ExternalLink, Star, Sparkles } from "lucide-react"
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
  
  // Refs for smooth scrolling to sections
  const formRef = useRef<HTMLFormElement>(null)
  const basicInfoRef = useRef<HTMLDivElement>(null)
  const settingsRef = useRef<HTMLDivElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)
  const techStackRef = useRef<HTMLDivElement>(null)

  const isEditing = !!project

  // Smooth scroll utility function with performance optimization
  const scrollToSection = useCallback((ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        ref.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        })
      })
      
      // Add highlight effect without blocking the main thread
      const timeoutId = setTimeout(() => {
        if (ref.current) {
          ref.current.style.transform = 'scale(1.02)'
          ref.current.style.transition = 'transform 0.3s ease'
          
          const resetTimeoutId = setTimeout(() => {
            if (ref.current) {
              ref.current.style.transform = ''
              ref.current.style.transition = ''
            }
          }, 800)
          
          return () => clearTimeout(resetTimeoutId)
        }
      }, 400)
      
      return () => clearTimeout(timeoutId)
    }
  }, [])

  // Auto-scroll to first error section
  const scrollToFirstError = useCallback(() => {
    if (errors.title || errors.description) {
      scrollToSection(basicInfoRef)
    } else if (errors.category) {
      scrollToSection(settingsRef)
    } else if (errors.demo_url || errors.github_url || errors.image_url) {
      scrollToSection(linksRef)
    } else if (errors.tech_stack) {
      scrollToSection(techStackRef)
    }
  }, [errors, scrollToSection])

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
    
    console.log("🚀 Form submission initiated")
    console.log("📝 Form data:", formData)
    console.log("🔄 Is editing:", isEditing)
    console.log("📄 Project ID:", project?.id)
    
    if (!validateForm()) {
      console.error("❌ Form validation failed")
      toast.error("Please fix the form errors before submitting")
      // Smooth scroll to first error
      setTimeout(() => scrollToFirstError(), 100)
      return
    }

    console.log("✅ Form validation passed")
    setIsSubmitting(true)

    try {
      let result: Project
      
      if (isEditing && project) {
        console.log("🔄 Updating existing project with ID:", project.id)
        // Update existing project
        result = await updateProject(project.id, formData)
        console.log("✅ Update successful:", result)
        toast.success("Project updated successfully! ✨")
      } else {
        console.log("🆕 Creating new project")
        // Create new project
        result = await createProject(formData)
        console.log("✅ Create successful:", result)
        toast.success("Project created successfully! 🎉")
      }

      // Clear form errors
      setErrors({})
      console.log("🧹 Form errors cleared")
      
      // Call success callback (this will close the dialog and update the parent)
      console.log("📞 Calling onSuccess callback")
      onSuccess?.(result)
      
    } catch (error) {
      console.error("❌ Form submission failed:", error)
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      console.error("📝 Error message:", errorMessage)
      
      if (errorMessage.includes("Validation error")) {
        toast.error(errorMessage)
        setErrors({ submit: errorMessage })
      } else {
        const genericMessage = isEditing ? "Failed to update project. Please try again." : "Failed to create project. Please try again."
        toast.error(genericMessage)
        setErrors({ submit: errorMessage })
      }
    } finally {
      setIsSubmitting(false)
      console.log("🏁 Form submission completed")
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

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      long_description: "",
      image_url: "",
      demo_url: "",
      github_url: "",
      tech_stack: [],
      category: "",
      status: "draft",
      featured: false,
    })
    setErrors({})
    setNewTech("")
  }

  const handleCancel = () => {
    if (!isEditing) {
      resetForm()
    }
    onCancel?.()
  }

  return (
    <div className="max-w-4xl mx-auto p-6 scroll-smooth">
      
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-3 mb-10 opacity-0 animate-[slideInFromTop_0.8s_ease-out_0.1s_forwards]">
          <h1 className="text-3xl font-bold text-gradient">
            {isEditing ? "Edit Project" : "Create New Project"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {isEditing ? "Update your project details and keep your portfolio current" : "Add a new project to showcase your skills and experience"}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-accent to-accent/60 mx-auto rounded-full"></div>
          
        </div>

        {/* Basic Information Card */}
        <Card ref={basicInfoRef} className="form-glass-card glow-effect opacity-0 animate-[slideInFromLeft_0.8s_ease-out_0.2s_forwards] transition-transform duration-300 hover:translate-y-[-2px] will-change-transform">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-accent text-xl">
              <div className="p-2 bg-accent/20 rounded-lg backdrop-blur-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              Project Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Title */}
            <div className="space-y-3">
              <Label htmlFor="title" className="text-sm font-semibold flex items-center gap-2 text-foreground">
                Title *
                <span className="text-xs text-muted-foreground font-normal">(Max 100 characters)</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter an engaging project title..."
                className={`input-glass h-12 text-base ${
                  errors.title ? "ring-2 ring-red-500 border-red-500/50" : ""
                }`}
                maxLength={100}
              />
              {errors.title && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <p className="text-sm text-red-400">{errors.title}</p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-3">
              <Label htmlFor="description" className="text-sm font-semibold flex items-center gap-2 text-foreground">
                Short Description *
                <span className="text-xs text-muted-foreground font-normal">(Max 500 characters)</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description for project cards and previews..."
                rows={4}
                className={`input-glass text-base resize-none ${
                  errors.description ? "ring-2 ring-red-500 border-red-500/50" : ""
                }`}
                maxLength={500}
              />
              <div className="flex justify-between items-center">
                {errors.description ? (
                  <div className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <p className="text-sm text-red-400">{errors.description}</p>
                  </div>
                ) : (
                  <span></span>
                )}
                <span className="text-xs text-muted-foreground bg-card/50 px-3 py-1 rounded-full backdrop-blur-sm">
                  {formData.description.length}/500
                </span>
              </div>
            </div>

            {/* Long Description */}
            <div className="space-y-3">
              <Label htmlFor="long_description" className="text-sm font-semibold text-foreground">
                Detailed Description
                <span className="text-xs text-muted-foreground ml-2 font-normal">(Optional)</span>
              </Label>
              <Textarea
                id="long_description"
                value={formData.long_description}
                onChange={(e) => setFormData(prev => ({ ...prev, long_description: e.target.value }))}
                placeholder="Comprehensive project description, features, challenges, and learnings..."
                rows={6}
                className="input-glass text-base resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Project Settings Card */}
        <Card ref={settingsRef} className="form-glass-card glow-effect opacity-0 animate-[slideInFromRight_0.8s_ease-out_0.3s_forwards] transition-transform duration-300 hover:translate-y-[-2px] will-change-transform">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-accent text-xl">
              <div className="p-2 bg-accent/20 rounded-lg backdrop-blur-sm">
                <Star className="h-5 w-5" />
              </div>
              Project Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Category */}
            <div className="space-y-3">
              <Label htmlFor="category" className="text-sm font-semibold text-foreground">
                Category *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className={`input-glass h-12 ${
                  errors.category ? "ring-2 ring-red-500 border-red-500/50" : ""
                }`}>
                  <SelectValue placeholder="Select project category" />
                </SelectTrigger>
                <SelectContent className="form-glass-card border-border/50">
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category} className="hover:bg-accent/10">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <p className="text-sm text-red-400">{errors.category}</p>
                </div>
              )}
            </div>

            {/* Status */}
            <div className="space-y-3">
              <Label htmlFor="status" className="text-sm font-semibold text-foreground">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
              >
                <SelectTrigger className="input-glass h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="form-glass-card border-border/50">
                  <SelectItem value="draft" className="hover:bg-accent/10">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>Draft</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="published" className="hover:bg-accent/10">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Published</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="archived" className="hover:bg-accent/10">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      <span>Archived</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Featured Project */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center space-x-4 p-6 form-glass-card bg-accent/5 rounded-xl border border-accent/20">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, featured: !!checked }))
                  }
                  className="h-5 w-5 border-accent data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                />
                <div className="space-y-2">
                  <Label htmlFor="featured" className="text-base font-semibold cursor-pointer flex items-center gap-2">
                    <Star className="h-4 w-4 text-accent" />
                    Featured Project
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Featured projects are highlighted on the homepage and appear first in listings
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* URLs Card */}
        <Card ref={linksRef} className="form-glass-card glow-effect opacity-0 animate-[slideInFromLeft_0.8s_ease-out_0.4s_forwards] transition-transform duration-300 hover:translate-y-[-2px] will-change-transform">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-accent text-xl">
              <div className="p-2 bg-accent/20 rounded-lg backdrop-blur-sm">
                <Link className="h-5 w-5" />
              </div>
              Project Links
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Demo URL */}
            <div className="space-y-3">
              <Label htmlFor="demo_url" className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <ExternalLink className="h-4 w-4 text-accent" />
                Live Demo URL
                <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
              </Label>
              <Input
                id="demo_url"
                type="url"
                value={formData.demo_url}
                onChange={(e) => setFormData(prev => ({ ...prev, demo_url: e.target.value }))}
                placeholder="https://your-project.vercel.app"
                className={`input-glass h-12 text-base ${
                  errors.demo_url ? "ring-2 ring-red-500 border-red-500/50" : ""
                }`}
              />
              {errors.demo_url && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <p className="text-sm text-red-400">{errors.demo_url}</p>
                </div>
              )}
            </div>

            {/* GitHub URL */}
            <div className="space-y-3">
              <Label htmlFor="github_url" className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <Github className="h-4 w-4 text-accent" />
                GitHub Repository
                <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
              </Label>
              <Input
                id="github_url"
                type="url"
                value={formData.github_url}
                onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                placeholder="https://github.com/username/repo"
                className={`input-glass h-12 text-base ${
                  errors.github_url ? "ring-2 ring-red-500 border-red-500/50" : ""
                }`}
              />
              {errors.github_url && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <p className="text-sm text-red-400">{errors.github_url}</p>
                </div>
              )}
            </div>

            {/* Image URL */}
            <div className="md:col-span-2 space-y-3">
              <Label htmlFor="image_url" className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <Image className="h-4 w-4 text-accent" />
                Project Image URL
                <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
              </Label>
              <Input
                id="image_url"
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                placeholder="https://images.unsplash.com/photo-..."
                className={`input-glass h-12 text-base ${
                  errors.image_url ? "ring-2 ring-red-500 border-red-500/50" : ""
                }`}
              />
              {errors.image_url && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <p className="text-sm text-red-400">{errors.image_url}</p>
                </div>
              )}
              
              {/* Image Preview */}
              {formData.image_url && (
                <div className="mt-6 p-6 form-glass-card bg-accent/5 rounded-xl border border-accent/20">
                  <p className="text-sm font-semibold mb-4 text-foreground">Image Preview:</p>
                  <div className="relative w-full max-w-md mx-auto">
                    <img
                      src={formData.image_url}
                      alt="Project preview"
                      className="w-full h-56 object-cover rounded-lg border border-border/50 shadow-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                      onLoad={(e) => {
                        e.currentTarget.style.display = 'block'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Technology Stack Card */}
        <Card ref={techStackRef} className="form-glass-card glow-effect opacity-0 animate-[slideInFromRight_0.8s_ease-out_0.5s_forwards] transition-transform duration-300 hover:translate-y-[-2px] will-change-transform">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-accent text-xl">
              <div className="p-2 bg-accent/20 rounded-lg backdrop-blur-sm">
                <Plus className="h-5 w-5" />
              </div>
              Technology Stack *
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Select and add the technologies used in this project
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Quick Add from Common Options */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-foreground">Quick Add Popular Technologies:</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {TECH_OPTIONS.filter(tech => !formData.tech_stack.includes(tech)).slice(0, 16).map((tech) => (
                  <Button
                    key={tech}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addTechFromSelect(tech)}
                    className="input-glass border-border/50 bg-card/30 hover:bg-accent/20 hover:border-accent/50 transition-all text-sm justify-start h-10"
                  >
                    <Plus className="h-3 w-3 mr-2" />
                    {tech}
                  </Button>
                ))}
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Custom Technology Input */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-foreground">Add Custom Technology:</Label>
              <div className="flex gap-3">
                <Input
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  placeholder="Enter technology name (e.g., React Native, FastAPI)"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechStack())}
                  className="input-glass h-12 text-base flex-1"
                />
                <EnhancedButton 
                  type="button" 
                  variant="gradient"
                  size="lg"
                  icon={<Plus />}
                  onClick={addTechStack}
                  disabled={!newTech.trim()}
                >
                  Add
                </EnhancedButton>
              </div>
            </div>

            {/* Selected Technologies Display */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-foreground">
                Selected Technologies ({formData.tech_stack.length}):
              </Label>
              {formData.tech_stack.length > 0 ? (
                <div className="flex flex-wrap gap-3 p-6 form-glass-card bg-accent/5 rounded-xl border border-accent/20">
                  {formData.tech_stack.map((tech, index) => (
                    <Badge 
                      key={`${tech}-${index}`} 
                      variant="secondary" 
                      className="tech-badge flex items-center gap-2 px-4 py-2 text-sm"
                    >
                      {tech}
                      <X
                        className="h-4 w-4 cursor-pointer hover:text-red-400 transition-colors ml-1"
                        onClick={() => removeTechStack(tech)}
                      />
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center form-glass-card bg-card/20 rounded-xl border-2 border-dashed border-border/50">
                  <Plus className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No technologies selected yet. Add at least one technology to continue.
                  </p>
                </div>
              )}
              
              {errors.tech_stack && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <p className="text-sm text-red-400">{errors.tech_stack}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit Actions */}
        <Card className="form-glass-card bg-accent/5 border-accent/20 opacity-0 animate-[slideInFromBottom_0.8s_ease-out_0.6s_forwards] transition-transform duration-300 hover:translate-y-[-2px] will-change-transform">
          <CardContent className="pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="text-center sm:text-left">
                <p className="text-sm text-muted-foreground">
                  {isEditing ? "Save changes to update the project" : "Create project to add it to your portfolio"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  All required fields must be completed before submitting
                </p>
              </div>
              
              <div className="flex gap-4">
                {onCancel && (
                  <EnhancedButton 
                    type="button" 
                    variant="glass"
                    size="lg"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </EnhancedButton>
                )}
                <EnhancedButton 
                  type="submit" 
                  variant="gradient"
                  size="lg"
                  icon={isEditing ? <Star /> : <Plus />}
                  loading={isSubmitting}
                  glow="medium"
                  className="min-w-[160px]"
                >
                  {isEditing ? "Update Project" : "Create Project"}
                </EnhancedButton>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
