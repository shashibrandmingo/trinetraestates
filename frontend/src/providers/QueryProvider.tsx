'use client';

import { useState, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Keep data fresh in cache for 5 minutes (prevents refetching when switching tabs)
            staleTime: 5 * 60 * 1000,
            // Keep unused data in memory cache for 15 minutes
            gcTime: 15 * 60 * 1000,
            // Disable window focus refetching to prevent layout shifts
            refetchOnWindowFocus: false,
            // Retry once on network failure
            retry: 1,
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
