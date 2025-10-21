import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useGuests } from './useGuests';
import { guestsApi } from '../api/guests';
import { createQueryWrapper } from '../test/test-utils';

// Mock the API
vi.mock('../api/guests', () => ({
  guestsApi: {
    getAll: vi.fn(),
  },
}));

describe('useGuests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch guests successfully', async () => {
    const mockData = {
      data: [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          phone: '+1234567890',
          status: 'CONFIRMED',
        },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          phone: '+0987654321',
          status: 'PENDING',
        },
      ],
      meta: {
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    };

    vi.mocked(guestsApi.getAll).mockResolvedValue(mockData);

    const { result } = renderHook(() => useGuests(), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.isLoading).toBe(false);
    expect(guestsApi.getAll).toHaveBeenCalledTimes(1);
  });

  it('should handle error when fetching fails', async () => {
    const mockError = new Error('Network error');
    vi.mocked(guestsApi.getAll).mockRejectedValue(mockError);

    const { result } = renderHook(() => useGuests(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
    expect(result.current.data).toBeUndefined();
  });

  it('should fetch guests with filters', async () => {
    const mockData = {
      data: [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          phone: '+1234567890',
          status: 'CONFIRMED',
        },
      ],
      meta: {
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    };

    vi.mocked(guestsApi.getAll).mockResolvedValue(mockData);

    const filters = {
      search: 'John',
      status: 'CONFIRMED' as const,
      page: 1,
      limit: 10,
    };

    const { result } = renderHook(() => useGuests(filters), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(guestsApi.getAll).toHaveBeenCalledWith(filters);
    expect(result.current.data).toEqual(mockData);
  });

  it('should fetch guests with isPastor filter', async () => {
    const mockData = {
      data: [
        {
          id: 1,
          firstName: 'Pastor',
          lastName: 'John',
          phone: '+1234567890',
          status: 'CONFIRMED',
          isPastor: true,
        },
      ],
      meta: {
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    };

    vi.mocked(guestsApi.getAll).mockResolvedValue(mockData);

    const { result } = renderHook(() => useGuests({ isPastor: true }), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(guestsApi.getAll).toHaveBeenCalledWith({ isPastor: true });
  });

  it('should fetch guests with church filter', async () => {
    const mockData = {
      data: [],
      meta: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      },
    };

    vi.mocked(guestsApi.getAll).mockResolvedValue(mockData);

    const { result } = renderHook(
      () => useGuests({ church: 'Central Church' }),
      {
        wrapper: createQueryWrapper(),
      }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(guestsApi.getAll).toHaveBeenCalledWith({ church: 'Central Church' });
  });

  it('should fetch guests with city filter', async () => {
    const mockData = {
      data: [],
      meta: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      },
    };

    vi.mocked(guestsApi.getAll).mockResolvedValue(mockData);

    const { result } = renderHook(() => useGuests({ city: 'New York' }), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(guestsApi.getAll).toHaveBeenCalledWith({ city: 'New York' });
  });

  it('should fetch guests with pagination', async () => {
    const mockData = {
      data: [],
      meta: {
        total: 50,
        page: 3,
        limit: 20,
        totalPages: 3,
      },
    };

    vi.mocked(guestsApi.getAll).mockResolvedValue(mockData);

    const { result } = renderHook(() => useGuests({ page: 3, limit: 20 }), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(guestsApi.getAll).toHaveBeenCalledWith({ page: 3, limit: 20 });
  });

  it('should fetch guests without filters', async () => {
    const mockData = {
      data: [],
      meta: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      },
    };

    vi.mocked(guestsApi.getAll).mockResolvedValue(mockData);

    const { result } = renderHook(() => useGuests(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(guestsApi.getAll).toHaveBeenCalledWith(undefined);
  });

  it('should preserve previous data while fetching', async () => {
    const mockData1 = {
      data: [{ id: 1, firstName: 'John', lastName: 'Doe' }],
      meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
    };

    const mockData2 = {
      data: [{ id: 2, firstName: 'Jane', lastName: 'Smith' }],
      meta: { total: 1, page: 2, limit: 10, totalPages: 2 },
    };

    vi.mocked(guestsApi.getAll)
      .mockResolvedValueOnce(mockData1)
      .mockResolvedValueOnce(mockData2);

    const { result, rerender } = renderHook(
      ({ filters }) => useGuests(filters),
      {
        wrapper: createQueryWrapper(),
        initialProps: { filters: { page: 1 } },
      }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData1);

    // Change filters to trigger new fetch
    rerender({ filters: { page: 2 } });

    // Previous data should still be available
    expect(result.current.data).toEqual(mockData1);

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData2);
    });
  });

  it('should handle empty result', async () => {
    const mockData = {
      data: [],
      meta: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      },
    };

    vi.mocked(guestsApi.getAll).mockResolvedValue(mockData);

    const { result } = renderHook(() => useGuests(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.data).toHaveLength(0);
    expect(result.current.data?.meta.total).toBe(0);
  });

  it('should have correct loading states', async () => {
    const mockData = {
      data: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
    };

    vi.mocked(guestsApi.getAll).mockResolvedValue(mockData);

    const { result } = renderHook(() => useGuests(), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isError).toBe(false);
  });

  it('should fetch guests with multiple filters combined', async () => {
    const mockData = {
      data: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
    };

    vi.mocked(guestsApi.getAll).mockResolvedValue(mockData);

    const filters = {
      search: 'John',
      status: 'CONFIRMED' as const,
      isPastor: true,
      church: 'Central',
      city: 'NYC',
    };

    const { result } = renderHook(() => useGuests(filters), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(guestsApi.getAll).toHaveBeenCalledWith(filters);
  });
});
