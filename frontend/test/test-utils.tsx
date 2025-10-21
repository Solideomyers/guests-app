import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

/**
 * Create a wrapper for testing hooks that use React Query
 * Each test gets a fresh QueryClient to avoid cache pollution
 */
export function createQueryWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Don't retry failed queries in tests
        gcTime: Infinity, // Keep cache forever in tests
        staleTime: 0, // Data is always stale in tests
      },
      mutations: {
        retry: false,
      },
    },
  });

  return function QueryWrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

/**
 * Wait for React Query to finish all pending operations
 */
export async function waitForQuery() {
  await new Promise((resolve) => setTimeout(resolve, 0));
}
