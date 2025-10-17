import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { guestsApi } from '../api/guests';
import { queryKeys } from '../lib/query-client';
import type { UpdateGuestDto, Guest } from '../api/types';

interface UpdateGuestParams {
  id: number;
  data: UpdateGuestDto;
}

/**
 * Hook to update a guest with optimistic updates
 *
 * @returns Mutation object with mutate, mutateAsync, isLoading, etc.
 *
 * @example
 * const updateGuest = useUpdateGuest();
 *
 * updateGuest.mutate(
 *   { id: 123, data: { status: 'CONFIRMED' } },
 *   {
 *     onSuccess: () => console.log('Guest updated!'),
 *   }
 * );
 */
export function useUpdateGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateGuestParams) => guestsApi.update(id, data),

    // Optimistic update
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.guests.detail(id),
      });
      await queryClient.cancelQueries({ queryKey: queryKeys.guests.lists() });

      // Snapshot previous values
      const previousGuest = queryClient.getQueryData(
        queryKeys.guests.detail(id)
      );
      const previousLists = queryClient.getQueriesData({
        queryKey: queryKeys.guests.lists(),
      });

      // Optimistically update detail
      queryClient.setQueryData<Guest>(queryKeys.guests.detail(id), (old) => {
        if (!old) return old;
        return { ...old, ...data, updatedAt: new Date().toISOString() };
      });

      // Optimistically update in lists
      queryClient.setQueriesData<any>(
        { queryKey: queryKeys.guests.lists() },
        (old) => {
          if (!old) return old;

          return {
            ...old,
            data: old.data.map((guest: Guest) =>
              guest.id === id
                ? { ...guest, ...data, updatedAt: new Date().toISOString() }
                : guest
            ),
          };
        }
      );

      return { previousGuest, previousLists };
    },

    // On success
    onSuccess: (updatedGuest) => {
      // Update the detail query with server response
      queryClient.setQueryData(
        queryKeys.guests.detail(updatedGuest.id),
        updatedGuest
      );

      // Invalidate lists to refetch with correct data
      queryClient.invalidateQueries({ queryKey: queryKeys.guests.lists() });

      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: queryKeys.guests.stats() });

      // Show success toast
      toast.success('Invitado actualizado exitosamente', {
        description: `${updatedGuest.firstName} ${updatedGuest.lastName}`,
      });
    },

    // On error, rollback
    onError: (error, { id }, context) => {
      // Rollback detail
      if (context?.previousGuest) {
        queryClient.setQueryData(
          queryKeys.guests.detail(id),
          context.previousGuest
        );
      }

      // Rollback lists
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      // Show error toast
      toast.error('Error al actualizar invitado', {
        description: error.message,
      });
    },

    // Always refetch after error or success
    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.guests.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.guests.lists() });
    },
  });
}
