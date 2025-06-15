import { Project } from '@/lib/actions/projects';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FolderOpen, Sparkles, RefreshCw } from 'lucide-react';

interface ProjectsPageStaticProps {
  projects: Project[];
  isRefreshing: boolean;
  onManualRefresh: () => void;
  onAddProject: () => void;
  onSetIsCreating: (creating: boolean) => void;
  isCreating: boolean;
}

export function ProjectsPageStatic({
  projects,
  isRefreshing,
  onManualRefresh,
  onAddProject,
  onSetIsCreating,
  isCreating
}: ProjectsPageStaticProps) {
  const lastUpdated = new Date(); // In a real app, this would come from props

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
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Manual Refresh Button */}
          <EnhancedButton 
            variant="outline" 
            size="lg" 
            icon={<RefreshCw className={isRefreshing ? "animate-spin" : ""} />} 
            onClick={onManualRefresh}
            disabled={isRefreshing}
            className="shadow-lg"
          >
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </EnhancedButton>
          
          {/* Add New Project Button */}
          <EnhancedButton 
            variant="gradient" 
            size="lg" 
            icon={<Plus />} 
            glow="medium"
            className="shadow-xl"
            loading={isCreating}
            onClick={() => {
              onSetIsCreating(true);
              onAddProject();
            }}
          >
            Add New Project
          </EnhancedButton>
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

      {/* Projects Table Card Header */}
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
        
        {/* Empty State - Server Rendered */}
        {projects.length === 0 && (
          <CardContent>
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
                    onClick={() => {
                      onSetIsCreating(true);
                      onAddProject();
                    }}
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
          </CardContent>
        )}
      </Card>
    </div>
  );
}
