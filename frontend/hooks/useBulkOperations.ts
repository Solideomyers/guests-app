import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { guestsApi } from '../api/guests';
import { queryKeys } from '../lib/query-client';
import type {
  BulkUpdateStatusDto,
  BulkUpdatePastorDto,
  BulkDeleteDto,
} from '../api/types';

/**
 * Hook for bulk status update with optimistic updates
 */
export function useBulkUpdateStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkUpdateStatusDto) => guestsApi.bulkUpdateStatus(data),

    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.guests.lists() });

      const previousLists = queryClient.getQueriesData({
        queryKey: queryKeys.guests.lists(),
      });

      // Optimistically update status
      queryClient.setQueriesData<any>(
        { queryKey: queryKeys.guests.lists() },
        (old) => {
          if (!old) return old;

          return {
            ...old,
            data: old.data.map((guest: any) =>
              data.ids.includes(guest.id)
                ? { ...guest, status: data.status }
                : guest
            ),
          };
        }
      );

      return { previousLists };
    },

    onSuccess: (_response, data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.guests.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.guests.stats() });

      toast.success('Estado actualizado', {
        description: `${data.ids.length} invitado(s) actualizado(s) a ${data.status}`,
      });
    },

    onError: (error, _data, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      toast.error('Error al actualizar estado', {
        description: error.message,
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.guests.lists() });
    },
  });
}

/**
 * Hook for bulk pastor status update with optimistic updates
 */
export function useBulkUpdatePastor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkUpdatePastorDto) => guestsApi.bulkUpdatePastor(data),

    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.guests.lists() });

      const previousLists = queryClient.getQueriesData({
        queryKey: queryKeys.guests.lists(),
      });

      // Optimistically update isPastor
      queryClient.setQueriesData<any>(
        { queryKey: queryKeys.guests.lists() },
        (old) => {
          if (!old) return old;

          return {
            ...old,
            data: old.data.map((guest: any) =>
              data.ids.includes(guest.id)
                ? { ...guest, isPastor: data.isPastor }
                : guest
            ),
          };
        }
      );

      return { previousLists };
    },

    onSuccess: (_response, data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.guests.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.guests.stats() });

      toast.success('Estatus de pastor actualizado', {
        description: `${data.ids.length} invitado(s) marcado(s) como ${data.isPastor ? 'pastor' : 'no pastor'}`,
      });
    },

    onError: (error, _data, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      toast.error('Error al actualizar estatus de pastor', {
        description: error.message,
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.guests.lists() });
    },
  });
}

/**
 * Hook for bulk delete with optimistic updates
 */
export function useBulkDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkDeleteDto) => guestsApi.bulkDelete(data),

    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.guests.lists() });

      const previousLists = queryClient.getQueriesData({
        queryKey: queryKeys.guests.lists(),
      });

      // Optimistically remove guests
      queryClient.setQueriesData<any>(
        { queryKey: queryKeys.guests.lists() },
        (old) => {
          if (!old) return old;

          return {
            ...old,
            data: old.data.filter((guest: any) => !data.ids.includes(guest.id)),
            meta: {
              ...old.meta,
              total: old.meta.total - data.ids.length,
            },
          };
        }
      );

      return { previousLists };
    },

    onSuccess: (_response, data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.guests.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.guests.stats() });

      toast.success('Invitados eliminados', {
        description: `${data.ids.length} invitado(s) eliminado(s) exitosamente`,
      });
    },

    onError: (error, _data, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      toast.error('Error al eliminar invitados', {
        description: error.message,
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.guests.lists() });
    },
  });
}
