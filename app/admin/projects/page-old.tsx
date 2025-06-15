"use client"

import { Suspense, useState } from 'react';
import { getProjects, Project } from '@/lib/actions/projects';
import { useProjectsSync } from '@/hooks/use-projects-sync';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Plus, FolderOpen, Sparkles, RefreshCw } from 'lucide-react';
import { ProjectsTable } from '@/components/admin/projects-table';
import { ProjectForm } from '@/components/admin/project-form';
import { SyncStatusIndicator } from '@/components/admin/sync-status-indicator';
import { toast } from 'sonner';

interface ProjectsListProps {
  initialProjects: Project[];
}

function ProjectsList({ initialProjects }: ProjectsListProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Use the new projects sync hook
  const {
    projects,
    isRefreshing,
    lastUpdated,
    refreshProjects,
    forceRefreshAfterMutation,
    addProject,
    updateProject,
    removeProject,
    toggleProjectFeatured,
  } = useProjectsSync({ 
    initialProjects,
    pollInterval: 30000, // Poll every 30 seconds
    enablePolling: true 
  });

  const handleAddSuccess = async (newProject: Project) => {
    console.log("🎉 Project created successfully, updating UI...");
    
    // Optimistic update first
    addProject(newProject);
    setShowAddDialog(false);
    setIsCreating(false);
    toast.success("Project created successfully! 🎉");
    
    // Force refresh to ensure data consistency
    await forceRefreshAfterMutation();
  };

  const handleUpdateProject = async (updatedProject: Project) => {
    console.log("✨ Project updated successfully, updating UI...");
    
    // Optimistic update first
    updateProject(updatedProject);
    toast.success("Project updated successfully! ✨");
    
    // Force refresh to ensure data consistency
    await forceRefreshAfterMutation();
  };

  const handleDeleteProject = async (projectId: number) => {
    console.log("🗑️ Project deleted successfully, updating UI...");
    
    // Optimistic update first
    removeProject(projectId);
    toast.success("Project deleted successfully!");
    
    // Force refresh to ensure data consistency
    await forceRefreshAfterMutation();
  };

  const handleToggleFeatured = async (projectId: number) => {
    console.log("⭐ Project featured status toggled, updating UI...");
    
    // Optimistic update first
    toggleProjectFeatured(projectId);
    
    // Force refresh to ensure data consistency
    await forceRefreshAfterMutation();
  };

  const handleDialogOpenChange = (open: boolean) => {
    setShowAddDialog(open);
    if (!open) {
      setIsCreating(false);
    }
  };

  const handleManualRefresh = async () => {
    await refreshProjects();
    toast.success("Projects refreshed!");
  };

  return (
      <div className="space-y-8 p-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-gradient">Projects Management</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Create, edit, and manage your portfolio projects with our advanced management system
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-accent to-accent/60 rounded-full"></div>
          <SyncStatusIndicator 
            isRefreshing={isRefreshing}
            lastUpdated={lastUpdated}
            isOnline={true}
          />
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Manual Refresh Button */}
          <EnhancedButton 
            variant="outline" 
            size="lg" 
            icon={<RefreshCw className={isRefreshing ? "animate-spin" : ""} />} 
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="shadow-lg"
          >
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </EnhancedButton>
          
          {/* Add New Project Button */}
          <Dialog open={showAddDialog} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
              <EnhancedButton 
                variant="gradient" 
                size="lg" 
                icon={<Plus />} 
                glow="medium"
                className="shadow-xl"
                loading={isCreating}
                onClick={() => setIsCreating(true)}
              >
                Add New Project
              </EnhancedButton>
            </DialogTrigger>
            <DialogContent className="form-glass-card max-w-5xl max-h-[90vh] overflow-y-auto border-accent/20">
              <ProjectForm 
                onSuccess={handleAddSuccess}
                onCancel={() => handleDialogOpenChange(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Actions Bar */}
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

      {/* Projects Table Card */}
      <Card className="form-glass-card glow-effect">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-accent text-xl">
            <div className="p-2 bg-accent/20 rounded-lg backdrop-blur-sm">
              <FolderOpen className="h-5 w-5" />
            </div>
            All Projects ({projects.length})
            {projects.filter(p => p.featured).length > 0 && (
              <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                {projects.filter(p => p.featured).length} Featured
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
                      onClick={() => handleDialogOpenChange(true)}
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
            <ProjectsTable 
              projects={projects} 
              onUpdate={handleUpdateProject}
              onDelete={handleDeleteProject}
              onToggleFeatured={handleToggleFeatured}
            />
          )}
        </CardContent>
      </Card>

      {/* Stats Summary */}
      {projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="form-glass-card">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-accent">{projects.length}</div>
              <div className="text-sm text-muted-foreground">Total Projects</div>
            </CardContent>
          </Card>
          <Card className="form-glass-card">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-500">{projects.filter(p => p.status === 'published').length}</div>
              <div className="text-sm text-muted-foreground">Published</div>
            </CardContent>
          </Card>
          <Card className="form-glass-card">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-yellow-500">{projects.filter(p => p.featured).length}</div>
              <div className="text-sm text-muted-foreground">Featured</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

async function ProjectsPageWrapper() {
  const projects = await getProjects();
  return <ProjectsList initialProjects={projects} />;
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    }>
      <ProjectsPageWrapper />
    </Suspense>
  );
}
