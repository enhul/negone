import React, { Suspense, lazy, useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Lazy load the Router component with error boundary
const AppRouter = lazy(() => 
  import('@/components/Router').catch(error => {
    console.error('Failed to load Router:', error);
    // Return a fallback component
    return {
      default: () => (
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="text-center px-4">
            <h1 className="text-2xl font-bold text-destructive mb-4 font-heading">Error Loading Application</h1>
            <p className="text-foreground/70 mb-6 font-paragraph">We encountered an error while loading the application.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors font-paragraph font-semibold"
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
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Global error handler for uncaught errors
    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      setError(event.error);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      setError(new Error(String(event.reason)));
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (!isClient) {
    return null;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center px-4 max-w-md">
          <h1 className="text-2xl font-bold text-destructive mb-4 font-heading">Application Error</h1>
          <p className="text-foreground/70 mb-4 font-paragraph">{error.message}</p>
          <button 
            onClick={() => {
              setError(null);
              window.location.reload();
            }}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors font-paragraph font-semibold"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
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
