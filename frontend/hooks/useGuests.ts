import { useQuery } from '@tanstack/react-query';
import { guestsApi } from '../api/guests';
import { queryKeys } from '../lib/query-client';
import type { FilterGuestDto } from '../api/types';

/**
 * Hook to fetch paginated and filtered list of guests
 *
 * @param filters - Optional filters (search, status, isPastor, etc.)
 * @returns TanStack Query result with guests data
 *
 * @example
 * const { data, isLoading, error } = useGuests({ search: 'John', status: 'CONFIRMED' });
 */
export function useGuests(filters?: FilterGuestDto) {
  return useQuery({
    queryKey: queryKeys.guests.list(filters || {}),
    queryFn: () => guestsApi.getAll(filters),
    // Keep previous data while fetching new data (better UX)
    placeholderData: (previousData) => previousData,
  });
}
