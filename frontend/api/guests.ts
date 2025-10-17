import { apiClient, handleApiError } from '../lib/api-client';
import type {
  Guest,
  CreateGuestDto,
  UpdateGuestDto,
  FilterGuestDto,
  PaginatedResponse,
  GuestStats,
  GuestHistoryEntry,
  BulkUpdateStatusDto,
  BulkUpdatePastorDto,
  BulkDeleteDto,
  ApiResponse,
} from './types';

/**
 * Guests API Service
 * All API calls related to guests management
 */
export const guestsApi = {
  /**
   * Get all guests with pagination and filters
   * GET /api/v1/guests
   */
  getAll: async (
    filters?: FilterGuestDto
  ): Promise<PaginatedResponse<Guest>> => {
    try {
      const response = await apiClient.get<PaginatedResponse<Guest>>(
        '/guests',
        {
          params: filters,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Get a single guest by ID
   * GET /api/v1/guests/:id
   */
  getById: async (id: number): Promise<Guest> => {
    try {
      const response = await apiClient.get<Guest>(`/guests/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Create a new guest
   * POST /api/v1/guests
   */
  create: async (data: CreateGuestDto): Promise<Guest> => {
    try {
      const response = await apiClient.post<Guest>('/guests', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Update a guest
   * PATCH /api/v1/guests/:id
   */
  update: async (id: number, data: UpdateGuestDto): Promise<Guest> => {
    try {
      const response = await apiClient.patch<Guest>(`/guests/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Delete a guest (soft delete)
   * DELETE /api/v1/guests/:id
   */
  delete: async (id: number): Promise<ApiResponse> => {
    try {
      const response = await apiClient.delete<ApiResponse>(`/guests/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Get guest statistics
   * GET /api/v1/guests/stats
   */
  getStats: async (): Promise<GuestStats> => {
    try {
      const response = await apiClient.get<GuestStats>('/guests/stats');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Get complete audit history
   * GET /api/v1/guests/history
   */
  getHistory: async (
    page: number = 1,
    limit: number = 50
  ): Promise<PaginatedResponse<GuestHistoryEntry>> => {
    try {
      const response = await apiClient.get<
        PaginatedResponse<GuestHistoryEntry>
      >('/guests/history', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Get audit history for a specific guest
   * GET /api/v1/guests/:id/history
   */
  getGuestHistory: async (
    id: number,
    page: number = 1,
    limit: number = 50
  ): Promise<PaginatedResponse<GuestHistoryEntry>> => {
    try {
      const response = await apiClient.get<
        PaginatedResponse<GuestHistoryEntry>
      >(`/guests/${id}/history`, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Bulk update guest status
   * POST /api/v1/guests/bulk/status
   */
  bulkUpdateStatus: async (data: BulkUpdateStatusDto): Promise<ApiResponse> => {
    try {
      const response = await apiClient.post<ApiResponse>(
        '/guests/bulk/status',
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Bulk update pastor status
   * POST /api/v1/guests/bulk/pastor
   */
  bulkUpdatePastor: async (data: BulkUpdatePastorDto): Promise<ApiResponse> => {
    try {
      const response = await apiClient.post<ApiResponse>(
        '/guests/bulk/pastor',
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Bulk delete guests
   * POST /api/v1/guests/bulk/delete
   */
  bulkDelete: async (data: BulkDeleteDto): Promise<ApiResponse> => {
    try {
      const response = await apiClient.post<ApiResponse>(
        '/guests/bulk/delete',
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Export guests to CSV
   * POST /api/v1/exports/csv
   */
  exportCsv: async (filters?: FilterGuestDto): Promise<Blob> => {
    try {
      const response = await apiClient.post<Blob>(
        '/exports/csv',
        filters || {},
        {
          responseType: 'blob',
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Export guests to PDF
   * POST /api/v1/exports/pdf
   */
  exportPdf: async (filters?: FilterGuestDto): Promise<Blob> => {
    try {
      const response = await apiClient.post<Blob>(
        '/exports/pdf',
        filters || {},
        {
          responseType: 'blob',
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};
