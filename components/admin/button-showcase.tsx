

import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Plus, 
  Download, 
  Save, 
  Trash2, 
  Heart, 
  Star, 
  Zap, 
  Rocket, 
  Crown, 
  Shield,
  ArrowRight,
  Sparkles
} from "lucide-react"

export function ButtonShowcase() {
  return (
    <div className="space-y-8 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gradient">Enhanced Button Components</h1>
        <p className="text-muted-foreground">Showcase of different button variants and styles</p>
      </div>

      {/* Primary Actions */}
      <Card className="form-glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-accent">
            <Rocket className="h-5 w-5" />
            Primary Action Buttons
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <EnhancedButton variant="gradient" size="lg" icon={<Plus />}>
            Add New Project
          </EnhancedButton>
          
          <EnhancedButton variant="gradient" size="lg" icon={<Save />} glow="medium">
            Save Changes
          </EnhancedButton>
          
          <EnhancedButton variant="luxury" size="lg" icon={<Crown />}>
            Premium Action
          </EnhancedButton>
          
          <EnhancedButton variant="cyber" size="lg" icon={<Zap />}>
            Cyber Tech
          </EnhancedButton>
          
          <EnhancedButton variant="neon" size="lg" icon={<Sparkles />}>
            Neon Glow
          </EnhancedButton>
          
          <EnhancedButton variant="solid" size="lg" rightIcon={<ArrowRight />}>
            Get Started
          </EnhancedButton>
        </CardContent>
      </Card>

      {/* Status Buttons */}
      <Card className="form-glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-accent">
            <Shield className="h-5 w-5" />
            Status & Action Buttons
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <EnhancedButton variant="success" icon={<Save />}>
            Save
          </EnhancedButton>
          
          <EnhancedButton variant="warning" icon={<Download />}>
            Download
          </EnhancedButton>
          
          <EnhancedButton variant="destructive" icon={<Trash2 />}>
            Delete
          </EnhancedButton>
          
          <EnhancedButton variant="ghost" icon={<Heart />}>
            Like
          </EnhancedButton>
        </CardContent>
      </Card>

      {/* Glass & Subtle Variants */}
      <Card className="form-glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-accent">
            <Star className="h-5 w-5" />
            Glass & Subtle Variants
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <EnhancedButton variant="glass" icon={<Plus />}>
            Glass Effect
          </EnhancedButton>
          
          <EnhancedButton variant="outline" icon={<Star />}>
            Outlined
          </EnhancedButton>
          
          <EnhancedButton variant="subtle" icon={<Heart />}>
            Subtle
          </EnhancedButton>
          
          <EnhancedButton variant="ghost" icon={<Sparkles />}>
            Ghost
          </EnhancedButton>
        </CardContent>
      </Card>

      {/* Size Variations */}
      <Card className="form-glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-accent">
            <Zap className="h-5 w-5" />
            Size Variations
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-4">
          <EnhancedButton variant="gradient" size="sm" icon={<Plus />}>
            Small
          </EnhancedButton>
          
          <EnhancedButton variant="gradient" size="default" icon={<Plus />}>
            Default
          </EnhancedButton>
          
          <EnhancedButton variant="gradient" size="lg" icon={<Plus />}>
            Large
          </EnhancedButton>
          
          <EnhancedButton variant="gradient" size="xl" icon={<Plus />}>
            Extra Large
          </EnhancedButton>
        </CardContent>
      </Card>

      {/* Icon Buttons */}
      <Card className="form-glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-accent">
            <Crown className="h-5 w-5" />
            Icon Buttons
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-4">
          <EnhancedButton variant="gradient" size="icon-sm">
            <Plus className="h-4 w-4" />
          </EnhancedButton>
          
          <EnhancedButton variant="glass" size="icon">
            <Save className="h-4 w-4" />
          </EnhancedButton>
          
          <EnhancedButton variant="neon" size="icon-lg">
            <Star className="h-5 w-5" />
          </EnhancedButton>
          
          <EnhancedButton variant="destructive" size="icon">
            <Trash2 className="h-4 w-4" />
          </EnhancedButton>
        </CardContent>
      </Card>

      {/* Loading States */}
      <Card className="form-glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-accent">
            <Sparkles className="h-5 w-5" />
            Loading States
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <EnhancedButton variant="gradient" loading>
            Creating Project
          </EnhancedButton>
          
          <EnhancedButton variant="glass" loading>
            Saving Changes
          </EnhancedButton>
          
          <EnhancedButton variant="destructive" loading>
            Deleting Item
          </EnhancedButton>
        </CardContent>
      </Card>

      {/* Animation & Glow Effects */}
      <Card className="form-glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-accent">
            <Zap className="h-5 w-5" />
            Special Effects
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <EnhancedButton variant="gradient" glow="soft" icon={<Star />}>
            Soft Glow
          </EnhancedButton>
          
          <EnhancedButton variant="neon" glow="medium" icon={<Zap />}>
            Medium Glow
          </EnhancedButton>
          
          <EnhancedButton variant="luxury" glow="strong" icon={<Crown />}>
            Strong Glow
          </EnhancedButton>
        </CardContent>
      </Card>
    </div>
  )
}
