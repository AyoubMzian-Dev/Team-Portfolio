"use client"

import { useState, useTransition, memo, useCallback, useMemo } from 'react';
import { Project } from '@/lib/actions/projects';
import { usePerformanceMonitor } from '@/hooks/use-performance';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Plus, FolderOpen, Sparkles, RefreshCw } from 'lucide-react';
import { ProjectForm } from '@/components/admin/project-form';
import { VirtualizedProjectsTable } from '@/components/admin/virtualized-projects-table';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ProjectsPageClientOptimizedProps {
  initialProjects: Project[];
}

// Memoized header component
const ProjectsHeader = memo(({ 
  projectsCount, 
  featuredCount, 
  onAddNew, 
  onRefresh, 
  isRefreshing,
  lastUpdated 
}: {
  projectsCount: number
  featuredCount: number
  onAddNew: () => void
  onRefresh: () => void
  isRefreshing: boolean
  lastUpdated: Date
}) => (
  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
    <div className="space-y-3">
      <h1 className="text-4xl font-bold text-gradient">Projects Management</h1>
      <p className="text-muted-foreground text-lg max-w-2xl">
        Create, edit, and manage your portfolio projects with our advanced management system
      </p>
      <div className="w-24 h-1 bg-gradient-to-r from-accent to-accent/60 rounded-full"></div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
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

// Memoized stats component
const ProjectsStats = memo(({ projects }: { projects: Project[] }) => {
  const stats = useMemo(() => ({
    total: projects.length,
    published: projects.filter(p => p.status === 'published').length,
    featured: projects.filter(p => p.featured).length
  }), [projects])

  if (projects.length === 0) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="form-glass-card">
        <CardContent className="p-6 text-center">
          <div className="text-2xl font-bold text-accent">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total Projects</div>
        </CardContent>
      </Card>
      <Card className="form-glass-card">
        <CardContent className="p-6 text-center">
          <div className="text-2xl font-bold text-green-500">{stats.published}</div>
          <div className="text-sm text-muted-foreground">Published</div>
        </CardContent>
      </Card>
      <Card className="form-glass-card">
        <CardContent className="p-6 text-center">
          <div className="text-2xl font-bold text-yellow-500">{stats.featured}</div>
          <div className="text-sm text-muted-foreground">Featured</div>
        </CardContent>
      </Card>
    </div>
  )
})

ProjectsStats.displayName = 'ProjectsStats'

export function ProjectsPageClientOptimized({ initialProjects }: ProjectsPageClientOptimizedProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  
  // Performance monitoring (fixed to prevent infinite loops)
  const metrics = usePerformanceMonitor('ProjectsPageClientOptimized');
  
  // Memoized computed values
  const featuredCount = useMemo(() => 
    projects.filter(p => p.featured).length, 
    [projects]
  );

  // Optimized handlers with useCallback to prevent re-renders
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

  return (
    <div className="space-y-8 p-6">
      {/* Performance metrics in development only - throttled to prevent infinite loops */}
      {process.env.NODE_ENV === 'development' && metrics.rerenderCount % 50 === 0 && (
        <div className="text-xs text-muted-foreground bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded border">
          🔧 Dev Metrics: Render time: {metrics.renderTime.toFixed(2)}ms | 
          Re-renders: {metrics.rerenderCount} |
          Memory: {metrics.memoryUsage ? `${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB` : 'N/A'}
        </div>
      )}

      {/* Header Section */}
      <ProjectsHeader
        projectsCount={projects.length}
        featuredCount={featuredCount}
        onAddNew={() => setShowAddDialog(true)}
        onRefresh={handleManualRefresh}
        isRefreshing={isPending}
        lastUpdated={lastUpdated}
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
            All Projects ({projects.length})
            {featuredCount > 0 && (
              <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                {featuredCount} Featured
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
                    onClick={() => setShowAddDialog(true)}
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
      <ProjectsStats projects={projects} />

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
