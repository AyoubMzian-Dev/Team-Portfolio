import { Suspense } from 'react';
import { getProjects } from '@/lib/actions/projects';
import { ProjectsPageClient } from './projects-page-client';
import { Card } from '@/components/ui/card';

// Server-side loading component
function ProjectsPageSkeleton() {
  return (
    <div className="space-y-8 p-6">
      {/* Header Skeleton */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-3">
          <div className="h-10 w-80 bg-muted animate-pulse rounded-lg"></div>
          <div className="h-6 w-96 bg-muted animate-pulse rounded-lg"></div>
          <div className="w-24 h-1 bg-gradient-to-r from-accent to-accent/60 rounded-full"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-32 bg-muted animate-pulse rounded-lg"></div>
          <div className="h-10 w-40 bg-muted animate-pulse rounded-lg"></div>
        </div>
      </div>

      {/* Quick Actions Skeleton */}
      <div className="flex flex-wrap gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 w-32 bg-muted animate-pulse rounded-lg"></div>
        ))}
      </div>

      {/* Table Skeleton */}
      <Card className="form-glass-card">
        <div className="p-6">
          <div className="h-8 w-48 bg-muted animate-pulse rounded-lg mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-muted animate-pulse rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 bg-muted animate-pulse rounded"></div>
                  <div className="h-3 w-32 bg-muted animate-pulse rounded"></div>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-6 w-16 bg-muted animate-pulse rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

// Server component that fetches data
async function ProjectsPageServer() {
  // Fetch projects on the server - this runs at build time or request time
  const initialProjects = await getProjects();
  
  return <ProjectsPageClient initialProjects={initialProjects} />;
}

// Main page component (server-side by default)
export default function ProjectsPage() {
  return (
    <Suspense fallback={<ProjectsPageSkeleton />}>
      <ProjectsPageServer />
    </Suspense>
  );
}
