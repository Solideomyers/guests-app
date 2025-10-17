import { useQuery } from '@tanstack/react-query';
import { guestsApi } from '../api/guests';
import { queryKeys } from '../lib/query-client';

/**
 * Hook to fetch a single guest by ID
 *
 * @param id - Guest ID
 * @param enabled - Whether the query should run (default: true when id exists)
 * @returns TanStack Query result with guest data
 *
 * @example
 * const { data: guest, isLoading } = useGuestById(123);
 */
export function useGuestById(id: number | undefined, enabled = true) {
  return useQuery({
    queryKey: queryKeys.guests.detail(id!),
    queryFn: () => guestsApi.getById(id!),
    enabled: enabled && !!id,
  });
}
