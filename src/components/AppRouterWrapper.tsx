import React, { Suspense, lazy, useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Lazy load the Router component with error boundary
const AppRouter = lazy(() => 
  import('@/components/Router').catch(error => {
    console.error('Failed to load Router:', error);
    // Return a fallback component
    return {
      default: () => (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Application</h1>
            <p className="text-gray-600 mb-4">We encountered an error while loading the application.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    };
  })
);

export default function AppRouterWrapper() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-foreground/70 font-paragraph">Loading application...</p>
        </div>
      </div>
    }>
      <AppRouter />
    </Suspense>
  );
}
