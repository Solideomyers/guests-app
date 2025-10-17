import { useQuery } from '@tanstack/react-query';
import { guestsApi } from '../api/guests';
import { queryKeys } from '../lib/query-client';

/**
 * Hook to fetch guest statistics
 *
 * @returns TanStack Query result with stats data
 *
 * @example
 * const { data: stats, isLoading } = useGuestStats();
 * // stats.total, stats.confirmed, stats.pending, stats.declined, stats.pastors
 */
export function useGuestStats() {
  return useQuery({
    queryKey: queryKeys.guests.stats(),
    queryFn: () => guestsApi.getStats(),
    // Stats change frequently, refetch more often
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}
