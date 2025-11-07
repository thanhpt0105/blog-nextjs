'use client';

import { createContext, useContext, useState, useEffect, ReactNode, Suspense, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Box, LinearProgress, Fade } from '@mui/material';

interface PageLoadingContextType {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

const PageLoadingContext = createContext<PageLoadingContextType>({
  isLoading: false,
  startLoading: () => {},
  stopLoading: () => {},
});

export const usePageLoading = () => useContext(PageLoadingContext);

interface PageLoadingProviderProps {
  children: ReactNode;
}

// Component that uses useSearchParams - needs Suspense
function RouteChangeDetector({ 
  onRouteChange 
}: { 
  onRouteChange: () => void 
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    onRouteChange();
  }, [pathname, searchParams, onRouteChange]);

  return null;
}

export default function PageLoadingProvider({ children }: PageLoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showContent, setShowContent] = useState(true);

  const handleRouteChange = useCallback(() => {
    // Start loading on route change
    setIsLoading(true);
    setShowContent(false);

    // Simulate minimum loading time for smooth transition
    setTimeout(() => {
      setIsLoading(false);
      setShowContent(true);
    }, 300); // 300ms minimum for smooth animation
  }, []);

  const startLoading = () => {
    setIsLoading(true);
    setShowContent(false);
  };

  const stopLoading = () => {
    setIsLoading(false);
    setShowContent(true);
  };

  return (
    <PageLoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {/* Route change detector wrapped in Suspense */}
      <Suspense fallback={null}>
        <RouteChangeDetector onRouteChange={handleRouteChange} />
      </Suspense>

      {/* Top Loading Bar */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          height: 3,
        }}
      >
        {isLoading && (
          <LinearProgress
            sx={{
              height: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: 'primary.main',
              },
            }}
          />
        )}
      </Box>

      {/* Content with fade transition */}
      <Fade in={showContent} timeout={300}>
        <Box sx={{ minHeight: '100vh' }}>
          {children}
        </Box>
      </Fade>

      {/* Overlay during loading */}
      {isLoading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
            zIndex: 9998,
            pointerEvents: 'none',
          }}
        />
      )}
    </PageLoadingContext.Provider>
  );
}
