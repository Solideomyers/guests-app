import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { guestsApi } from '../api/guests';
import { queryKeys } from '../lib/query-client';
import type { CreateGuestDto, Guest } from '../api/types';

/**
 * Hook to create a new guest with optimistic updates
 *
 * @returns Mutation object with mutate, mutateAsync, isLoading, etc.
 *
 * @example
 * const createGuest = useCreateGuest();
 *
 * createGuest.mutate(
 *   { firstName: 'John', lastName: 'Doe', ... },
 *   {
 *     onSuccess: () => console.log('Guest created!'),
 *     onError: (error) => console.error(error),
 *   }
 * );
 */
export function useCreateGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGuestDto) => guestsApi.create(data),

    // Optimistic update: Update UI immediately before server responds
    onMutate: async (newGuest) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.guests.lists() });

      // Snapshot the previous value
      const previousGuests = queryClient.getQueriesData({
        queryKey: queryKeys.guests.lists(),
      });

      // Optimistically update to the new value
      queryClient.setQueriesData<any>(
        { queryKey: queryKeys.guests.lists() },
        (old) => {
          if (!old) return old;

          // Create temporary guest with optimistic data
          const optimisticGuest: Guest = {
            id: Date.now(), // Temporary ID
            firstName: newGuest.firstName,
            lastName: newGuest.lastName || '',
            address: newGuest.address || '',
            state: newGuest.state || '',
            city: newGuest.city || '',
            church: newGuest.church || '',
            phone: newGuest.phone || '',
            notes: newGuest.notes || '',
            status: newGuest.status || 'PENDING',
            isPastor: newGuest.isPastor || false,
            registrationDate: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            deletedAt: null,
          };

          return {
            ...old,
            data: [optimisticGuest, ...old.data],
            meta: {
              ...old.meta,
              total: old.meta.total + 1,
            },
          };
        }
      );

      return { previousGuests };
    },

    // On success, invalidate and refetch
    onSuccess: (newGuest) => {
      // Invalidate all guest list queries
      queryClient.invalidateQueries({ queryKey: queryKeys.guests.lists() });

      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: queryKeys.guests.stats() });

      // Show success toast
      toast.success('Invitado creado exitosamente', {
        description: `${newGuest.firstName} ${newGuest.lastName}`,
      });
    },

    // On error, rollback optimistic update
    onError: (error, _newGuest, context) => {
      // Rollback to previous state
      if (context?.previousGuests) {
        context.previousGuests.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      // Show error toast
      toast.error('Error al crear invitado', {
        description: error.message,
      });
    },

    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.guests.lists() });
    },
  });
}
