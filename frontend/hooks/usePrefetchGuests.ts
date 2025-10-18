import { useQueryClient } from '@tanstack/react-query';
import { guestsApi } from '../api/guests';
import { queryKeys } from '../lib/query-client';
import type { FilterGuestDto } from '../api/types';

/**
 * Hook to prefetch guests data
 * Useful for preloading data before user navigates or hovers
 *
 * @example
 * const { prefetchPage, prefetchGuestById } = usePrefetchGuests();
 *
 * // Prefetch next page
 * prefetchPage({ page: currentPage + 1, limit: 10 });
 *
 * // Prefetch guest details on hover
 * <tr onMouseEnter={() => prefetchGuestById(guest.id)}>
 */
export function usePrefetchGuests() {
  const queryClient = useQueryClient();

  /**
   * Prefetch a specific page of guests
   * Useful for pagination - prefetch next/prev pages
   */
  const prefetchPage = async (filters?: FilterGuestDto) => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.guests.list(filters || {}),
      queryFn: () => guestsApi.getAll(filters),
      // Only prefetch if data is older than 2 minutes
      staleTime: 2 * 60 * 1000,
    });
  };

  /**
   * Prefetch a single guest by ID
   * Useful for hovering over table rows
   */
  const prefetchGuestById = async (id: number) => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.guests.detail(id),
      queryFn: () => guestsApi.getById(id),
      // Only prefetch if data is older than 5 minutes
      staleTime: 5 * 60 * 1000,
    });
  };

  /**
   * Prefetch guest stats
   * Useful for background updates
   */
  const prefetchStats = async () => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.guests.stats(),
      queryFn: () => guestsApi.getStats(),
      // Only prefetch if data is older than 1 minute
      staleTime: 1 * 60 * 1000,
    });
  };

  return {
    prefetchPage,
    prefetchGuestById,
    prefetchStats,
  };
}
