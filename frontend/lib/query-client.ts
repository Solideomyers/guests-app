import { QueryClient } from '@tanstack/react-query';

/**
 * Configure TanStack Query Client
 * Optimized for real-time data with smart caching
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time before data is considered stale - increased to 10 minutes
      staleTime: 10 * 60 * 1000, // 10 minutes

      // Time before unused data is garbage collected - increased to 30 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)

      // Refetch data when window regains focus - only if stale
      refetchOnWindowFocus: 'always',

      // Refetch data when reconnecting to the internet
      refetchOnReconnect: true,

      // Don't refetch on mount if data is fresh
      refetchOnMount: false,

      // Retry failed requests - increased retries
      retry: 2,

      // Retry delay
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Network mode - use cached data if offline
      networkMode: 'offlineFirst',
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,

      // Network mode for mutations
      networkMode: 'online',
    },
  },
});

/**
 * Query Keys Factory
 * Centralized query keys for better cache management
 */
export const queryKeys = {
  guests: {
    all: ['guests'] as const,
    lists: () => [...queryKeys.guests.all, 'list'] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.guests.lists(), filters] as const,
    details: () => [...queryKeys.guests.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.guests.details(), id] as const,
    stats: () => [...queryKeys.guests.all, 'stats'] as const,
    history: () => [...queryKeys.guests.all, 'history'] as const,
    guestHistory: (id: number) => [...queryKeys.guests.history(), id] as const,
  },
} as const;
