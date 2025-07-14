"use client"

import { useState } from "react"
// import { Button } from "@/components/ui/button"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Plus, Loader2, User, Sparkles, Link as LinkIcon, Star } from "lucide-react"
import { toast } from "sonner"
import { 
  createMember, 
  updateMember, 
  type Member as ServerMember, 
  type Role 
} from "@/lib/actions/team-members"

const SKILL_OPTIONS = [
  "React", "Vue.js", "Angular", "Next.js", "Nuxt.js", "Svelte",
  "TypeScript", "JavaScript", "Python", "Java", "C#", "PHP",
  "Node.js", "Express", "Fastify", "Django", "Flask", "Spring",
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "Firebase",
  "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Vercel",
  "HTML", "CSS", "Tailwind CSS", "SCSS", "Bootstrap",
  "Figma", "Adobe XD", "Sketch", "Photoshop", "Illustrator",
  "UI/UX Design", "Prototyping", "User Research", "Wireframing",
  "Project Management", "Agile", "Scrum", "DevOps", "Testing"
]

const ROLE_OPTIONS = [
  "Full-Stack Developer",
  "Frontend Developer", 
  "Backend Developer",
  "UI/UX Designer",
  "DevOps Engineer",
  "Project Manager",
  "Data Scientist",
  "Mobile Developer",
  "QA Engineer",
  "Product Manager"
]

export function MemberForm({ member, roles = [], onSuccess, onClose }: {
  member?: ServerMember
  roles?: Role[]
  onSuccess?: () => void
  onClose?: () => void
}) {
  const isEditing = !!member

  const [formData, setFormData] = useState({
    name: member?.name || "",
    role: member?.title || "",
    bio: member?.bio || "",
    image_url: member?.avatar_url || "",
    skills: member?.skills || [],
    github_url: member?.links?.github || "",
    linkedin_url: member?.links?.linkedin || "",
    twitter_url: member?.links?.twitter || "",
    portfolio_url: member?.links?.portfolio || ""
  })

  const [newSkill, setNewSkill] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const submitData = new FormData()
      submitData.append("name", formData.name)
      submitData.append("role", formData.role)
      submitData.append("bio", formData.bio)
      submitData.append("image_url", formData.image_url)
      submitData.append("github_url", formData.github_url)
      submitData.append("linkedin_url", formData.linkedin_url)
      submitData.append("twitter_url", formData.twitter_url)
      submitData.append("portfolio_url", formData.portfolio_url)
      submitData.append("skills", JSON.stringify(formData.skills))

      const result = isEditing 
        ? await updateMember(member!.id, submitData)
        : await createMember(submitData)

      if (result.success) {
        toast.success(`Member ${isEditing ? "updated" : "created"} successfully`)
        onSuccess?.()
        onClose?.()
      } else {
        toast.error(result.error || "Failed to save member")
      }
    } catch (error) {
      console.error("Form submission error:", error)
      toast.error("Failed to save member")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 scroll-smooth" style={{ height: "75vh", overflowY: "auto" }}>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4 mb-12 opacity-0 animate-[slideInFromTop_0.8s_ease-out_0.1s_forwards]">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent drop-shadow-lg tracking-tight">
            {isEditing ? "Edit Team Member" : "Add New Team Member"}
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            {isEditing
              ? "Update member details and keep your team portfolio current."
              : "Add a new member to showcase your team’s talent and expertise."}
          </p>
          <div className="flex justify-center">
            <span className="inline-block w-32 h-1 rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 shadow-lg"></span>
          </div>
        </div>

        {/* Basic Info Card */}
        <Card className="form-glass-card glow-effect opacity-0 animate-[slideInFromLeft_0.8s_ease-out_0.2s_forwards]">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-blue-600 text-xl">
              <div className="p-2 bg-blue-600/20 rounded-lg backdrop-blur-sm">
                <User className="h-5 w-5" />
              </div>
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-sm font-semibold text-foreground">Name </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter full name"
                required
                className="input-glass h-12 text-base"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="role" className="text-sm font-semibold text-foreground">Role </Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => handleInputChange("role", value)}
              >
                <SelectTrigger className="input-glass h-12">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details Card */}
        <Card className="form-glass-card glow-effect opacity-0 animate-[slideInFromRight_0.8s_ease-out_0.3s_forwards]">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-emerald-600 text-xl">
              <div className="p-2 bg-emerald-600/20 rounded-lg backdrop-blur-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              Profile Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label htmlFor="bio" className="text-sm font-semibold text-foreground">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Tell us about this team member..."
                rows={4}
                className="input-glass text-base resize-none"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="image_url" className="text-sm font-semibold text-foreground">Profile Image URL</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => handleInputChange("image_url", e.target.value)}
                placeholder="https://example.com/profile.jpg"
                className="input-glass h-12 text-base"
              />
              {formData.image_url && (
                <div className="mt-3">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img 
                      src={formData.image_url} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-user.jpg"
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Skills Card */}
        <Card className="form-glass-card glow-effect opacity-0 animate-[slideInFromLeft_0.8s_ease-out_0.4s_forwards]">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-purple-600 text-xl">
              <div className="p-2 bg-purple-600/20 rounded-lg backdrop-blur-sm">
                <Star className="h-5 w-5" />
              </div>
              Skills & Expertise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex gap-3">
              <Select value={newSkill} onValueChange={setNewSkill}>
                <SelectTrigger className="input-glass h-12 flex-1">
                  <SelectValue placeholder="Add a skill" />
                </SelectTrigger>
                <SelectContent>
                  {SKILL_OPTIONS.filter(skill => !formData.skills.includes(skill)).map((skill) => (
                    <SelectItem key={skill} value={skill}>
                      {skill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <EnhancedButton 
                type="button" 
                variant="gradient"
                size="lg"
                icon={<Plus />}
                onClick={addSkill}
                disabled={!newSkill.trim()}
              >
                Add
              </EnhancedButton>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[2rem]">
              {formData.skills.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 italic">No skills added yet</p>
              ) : (
                formData.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="flex items-center gap-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1 hover:text-red-500 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Social Links Card */}
        <Card className="form-glass-card glow-effect opacity-0 animate-[slideInFromRight_0.8s_ease-out_0.5s_forwards]">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-orange-600 text-xl">
              <div className="p-2 bg-orange-600/20 rounded-lg backdrop-blur-sm">
                <LinkIcon className="h-5 w-5" />
              </div>
              Social & Portfolio Links
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-2">
              <Label htmlFor="github_url" className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                <span className="text-gray-800">⚫</span> GitHub URL
              </Label>
              <Input
                id="github_url"
                value={formData.github_url}
                onChange={(e) => handleInputChange("github_url", e.target.value)}
                placeholder="https://github.com/username"
                className="input-glass h-12 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin_url" className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                <span className="text-blue-600">💼</span> LinkedIn URL
              </Label>
              <Input
                id="linkedin_url"
                value={formData.linkedin_url}
                onChange={(e) => handleInputChange("linkedin_url", e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="input-glass h-12 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter_url" className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                <span className="text-blue-400">🐦</span> Twitter URL
              </Label>
              <Input
                id="twitter_url"
                value={formData.twitter_url}
                onChange={(e) => handleInputChange("twitter_url", e.target.value)}
                placeholder="https://twitter.com/username"
                className="input-glass h-12 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="portfolio_url" className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                <span className="text-green-600">🌐</span> Portfolio URL
              </Label>
              <Input
                id="portfolio_url"
                value={formData.portfolio_url}
                onChange={(e) => handleInputChange("portfolio_url", e.target.value)}
                placeholder="https://yourportfolio.com"
                className="input-glass h-12 text-base"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Actions */}
        <Card className="form-glass-card bg-blue-600/5 border-blue-600/20 opacity-0 animate-[slideInFromBottom_0.8s_ease-out_0.6s_forwards]">
          <CardContent className="pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="text-center sm:text-left">
                <p className="text-sm text-muted-foreground">
                  {isEditing ? "Save changes to update the member" : "Create member to add them to your team"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  All required fields must be completed before submitting
                </p>
              </div>
              <div className="flex gap-4">
                {onClose && (
                  <EnhancedButton 
                    type="button" 
                    variant="glass"
                    size="lg"
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </EnhancedButton>
                )}
                <EnhancedButton 
                  type="submit" 
                  variant="gradient"
                  size="lg"
                  icon={isEditing ? <Sparkles /> : <Plus />}
                  loading={isSubmitting}
                  glow="medium"
                  className="min-w-[160px]"
                  disabled={isSubmitting || !formData.name || !formData.role}
                >
                  {isEditing ? "Update Member" : "Create Member"}
                </EnhancedButton>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
