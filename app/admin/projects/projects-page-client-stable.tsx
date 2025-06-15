"use client"

import { useState, useTransition, memo, useCallback, useMemo } from 'react';
import { Project } from '@/lib/actions/projects';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Plus, FolderOpen, Sparkles, RefreshCw } from 'lucide-react';
import { ProjectForm } from '@/components/admin/project-form';
import { VirtualizedProjectsTable } from '@/components/admin/virtualized-projects-table';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ProjectsPageClientProps {
  initialProjects: Project[];
}

// Memoized header component with stable props
const ProjectsHeader = memo(({ 
  projectsCount, 
  featuredCount, 
  onAddNew, 
  onRefresh, 
  isRefreshing,
  lastUpdatedTime 
}: {
  projectsCount: number
  featuredCount: number
  onAddNew: () => void
  onRefresh: () => void
  isRefreshing: boolean
  lastUpdatedTime: string
}) => (
  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
    <div className="space-y-3">
      <h1 className="text-4xl font-bold text-gradient">Projects Management</h1>
      <p className="text-muted-foreground text-lg max-w-2xl">
        Create, edit, and manage your portfolio projects with our advanced management system
      </p>
      <div className="w-24 h-1 bg-gradient-to-r from-accent to-accent/60 rounded-full"></div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Last updated: {lastUpdatedTime}</span>
        {isRefreshing && (
          <>
            <span>•</span>
            <div className="flex items-center gap-1">
              <RefreshCw className="h-3 w-3 animate-spin" />
              <span>Refreshing...</span>
            </div>
          </>
        )}
      </div>
    </div>
    
    <div className="flex flex-col sm:flex-row gap-3">
      <EnhancedButton 
        variant="outline" 
        size="lg" 
        icon={<RefreshCw className={isRefreshing ? "animate-spin" : ""} />} 
        onClick={onRefresh}
        disabled={isRefreshing}
        className="shadow-lg"
      >
        {isRefreshing ? "Refreshing..." : "Refresh"}
      </EnhancedButton>
      
      <EnhancedButton 
        variant="gradient" 
        size="lg" 
        icon={<Plus />} 
        glow="medium"
        className="shadow-xl"
        onClick={onAddNew}
      >
        Add New Project
      </EnhancedButton>
    </div>
  </div>
))

ProjectsHeader.displayName = 'ProjectsHeader'

// Memoized quick actions component
const QuickActions = memo(() => (
  <div className="flex flex-wrap gap-4">
    <EnhancedButton variant="glass" size="default" icon={<Sparkles />}>
      Quick Template
    </EnhancedButton>
    <EnhancedButton variant="outline" size="default">
      Import Projects
    </EnhancedButton>
    <EnhancedButton variant="subtle" size="default">
      Export Data
    </EnhancedButton>
  </div>
))

QuickActions.displayName = 'QuickActions'

// Memoized stats component with stable calculations
const ProjectsStats = memo(({ 
  totalCount, 
  publishedCount, 
  featuredCount 
}: { 
  totalCount: number
  publishedCount: number
  featuredCount: number
}) => {
  if (totalCount === 0) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="form-glass-card">
        <CardContent className="p-6 text-center">
          <div className="text-2xl font-bold text-accent">{totalCount}</div>
          <div className="text-sm text-muted-foreground">Total Projects</div>
        </CardContent>
      </Card>
      <Card className="form-glass-card">
        <CardContent className="p-6 text-center">
          <div className="text-2xl font-bold text-green-500">{publishedCount}</div>
          <div className="text-sm text-muted-foreground">Published</div>
        </CardContent>
      </Card>
      <Card className="form-glass-card">
        <CardContent className="p-6 text-center">
          <div className="text-2xl font-bold text-yellow-500">{featuredCount}</div>
          <div className="text-sm text-muted-foreground">Featured</div>
        </CardContent>
      </Card>
    </div>
  )
})

ProjectsStats.displayName = 'ProjectsStats'

export function ProjectsPageClientStable({ initialProjects }: ProjectsPageClientProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  
  // Stable computed values that only change when projects change
  const stats = useMemo(() => ({
    total: projects.length,
    published: projects.filter(p => p.status === 'published').length,
    featured: projects.filter(p => p.featured).length
  }), [projects]);
  
  // Stable time string that only updates when lastUpdated changes
  const lastUpdatedTime = useMemo(() => 
    lastUpdated.toLocaleTimeString(), 
    [lastUpdated]
  );

  // Stable handlers with proper dependencies
  const handleAddSuccess = useCallback((newProject: Project) => {
    console.log("🎉 Project created successfully, updating UI...");
    
    setProjects(prev => [newProject, ...prev]);
    setLastUpdated(new Date());
    setShowAddDialog(false);
    toast.success("Project created successfully! 🎉");
    
    startTransition(() => {
      router.refresh();
    });
  }, [router]);

  const handleUpdateProject = useCallback((updatedProject: Project) => {
    console.log("✨ Project updated successfully, updating UI...");
    
    setProjects(prev => 
      prev.map(p => p.id === updatedProject.id ? updatedProject : p)
    );
    setLastUpdated(new Date());
    toast.success("Project updated successfully! ✨");
    
    startTransition(() => {
      router.refresh();
    });
  }, [router]);

  const handleDeleteProject = useCallback((projectId: number) => {
    console.log("🗑️ Project deleted successfully, updating UI...");
    
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setLastUpdated(new Date());
    toast.success("Project deleted successfully!");
    
    startTransition(() => {
      router.refresh();
    });
  }, [router]);

  const handleToggleFeatured = useCallback((projectId: number) => {
    console.log("⭐ Project featured status toggled, updating UI...");
    
    setProjects(prev => 
      prev.map(p => 
        p.id === projectId ? { ...p, featured: !p.featured } : p
      )
    );
    setLastUpdated(new Date());
    
    startTransition(() => {
      router.refresh();
    });
  }, [router]);

  const handleManualRefresh = useCallback(() => {
    setLastUpdated(new Date());
    startTransition(() => {
      router.refresh();
      toast.success("Projects refreshed!");
    });
  }, [router]);

  const handleDialogOpenChange = useCallback((open: boolean) => {
    setShowAddDialog(open);
  }, []);

  const handleAddNew = useCallback(() => {
    setShowAddDialog(true);
  }, []);

  return (
    <div className="space-y-8 p-6">
      {/* Header Section */}
      <ProjectsHeader
        projectsCount={stats.total}
        featuredCount={stats.featured}
        onAddNew={handleAddNew}
        onRefresh={handleManualRefresh}
        isRefreshing={isPending}
        lastUpdatedTime={lastUpdatedTime}
      />

      {/* Quick Actions Bar */}
      <QuickActions />

      {/* Projects Table Card */}
      <Card className="form-glass-card glow-effect">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-accent text-xl">
            <div className="p-2 bg-accent/20 rounded-lg backdrop-blur-sm">
              <FolderOpen className="h-5 w-5" />
            </div>
            All Projects ({stats.total})
            {stats.featured > 0 && (
              <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                {stats.featured} Featured
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-16">
              <div className="p-8 form-glass-card bg-card/20 rounded-xl border-2 border-dashed border-border/50 max-w-md mx-auto">
                <FolderOpen className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-3 text-gradient">No Projects Yet</h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Start building your portfolio by creating your first project. Showcase your skills and experience to potential clients.
                </p>
                <div className="space-y-4">
                  <EnhancedButton 
                    variant="gradient"
                    size="lg"
                    icon={<Plus />}
                    glow="medium"
                    onClick={handleAddNew}
                  >
                    Create First Project
                  </EnhancedButton>
                  <div className="flex gap-2 justify-center">
                    <EnhancedButton variant="glass" size="sm">
                      Use Template
                    </EnhancedButton>
                    <EnhancedButton variant="outline" size="sm">
                      Import Existing
                    </EnhancedButton>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <VirtualizedProjectsTable 
              projects={projects} 
              onUpdate={handleUpdateProject}
              onDelete={handleDeleteProject}
              onToggleFeatured={handleToggleFeatured}
            />
          )}
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <ProjectsStats 
        totalCount={stats.total}
        publishedCount={stats.published}
        featuredCount={stats.featured}
      />

      {/* Add Project Dialog */}
      <Dialog open={showAddDialog} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="form-glass-card max-w-5xl max-h-[90vh] overflow-y-auto border-accent/20">
          <ProjectForm 
            onSuccess={handleAddSuccess}
            onCancel={() => setShowAddDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
