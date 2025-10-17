import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { guestsApi } from '../api/guests';
import { queryKeys } from '../lib/query-client';
import type { Guest } from '../api/types';

/**
 * Hook to delete a guest (soft delete) with optimistic updates
 *
 * @returns Mutation object with mutate, mutateAsync, isLoading, etc.
 *
 * @example
 * const deleteGuest = useDeleteGuest();
 *
 * deleteGuest.mutate(123, {
 *   onSuccess: () => console.log('Guest deleted!'),
 * });
 */
export function useDeleteGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => guestsApi.delete(id),

    // Optimistic update: Remove guest from UI immediately
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.guests.lists() });

      // Snapshot previous values
      const previousLists = queryClient.getQueriesData({
        queryKey: queryKeys.guests.lists(),
      });

      // Get the guest name for toast before removal
      let deletedGuestName = '';
      queryClient.setQueriesData<any>(
        { queryKey: queryKeys.guests.lists() },
        (old) => {
          if (!old) return old;

          const guest = old.data.find((g: Guest) => g.id === id);
          if (guest) {
            deletedGuestName = `${guest.firstName} ${guest.lastName}`;
          }

          return {
            ...old,
            data: old.data.filter((guest: Guest) => guest.id !== id),
            meta: {
              ...old.meta,
              total: old.meta.total - 1,
            },
          };
        }
      );

      return { previousLists, deletedGuestName };
    },

    // On success
    onSuccess: (_data, _id, context) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: queryKeys.guests.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.guests.stats() });

      // Show success toast
      toast.success('Invitado eliminado exitosamente', {
        description: context?.deletedGuestName || 'Eliminado',
      });
    },

    // On error, rollback
    onError: (error, _id, context) => {
      // Rollback lists
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      // Show error toast
      toast.error('Error al eliminar invitado', {
        description: error.message,
      });
    },

    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.guests.lists() });
    },
  });
}
