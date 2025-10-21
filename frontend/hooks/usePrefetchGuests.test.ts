import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePrefetchGuests } from './usePrefetchGuests';
import { guestsApi } from '../api/guests';
import { createQueryWrapper } from '../test/test-utils';

// Mock the API
vi.mock('../api/guests', () => ({
  guestsApi: {
    getAll: vi.fn(),
    getById: vi.fn(),
    getStats: vi.fn(),
  },
}));

describe('usePrefetchGuests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should prefetch page successfully', async () => {
    const mockData = {
      data: [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          phone: '+1234567890',
          address: '',
          state: '',
          city: '',
          church: '',
          status: 'CONFIRMED',
          notes: '',
          isPastor: false,
          registrationDate: '2025-01-01',
          createdAt: '2025-01-01',
          updatedAt: '2025-01-01',
          deletedAt: null,
        },
      ],
      meta: { page: 2, limit: 10, total: 1, totalPages: 1 },
    };

    vi.mocked(guestsApi.getAll).mockResolvedValue(mockData);

    const { result } = renderHook(() => usePrefetchGuests(), {
      wrapper: createQueryWrapper(),
    });

    await result.current.prefetchPage({ page: 2, limit: 10 });

    expect(guestsApi.getAll).toHaveBeenCalledWith({ page: 2, limit: 10 });
  });

  it('should prefetch page with filters', async () => {
    const mockData = {
      data: [],
      meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
    };

    vi.mocked(guestsApi.getAll).mockResolvedValue(mockData);

    const { result } = renderHook(() => usePrefetchGuests(), {
      wrapper: createQueryWrapper(),
    });

    await result.current.prefetchPage({
      page: 1,
      limit: 10,
      status: 'CONFIRMED',
      search: 'John',
    });

    expect(guestsApi.getAll).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      status: 'CONFIRMED',
      search: 'John',
    });
  });

  it('should prefetch page without filters', async () => {
    const mockData = {
      data: [],
      meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
    };

    vi.mocked(guestsApi.getAll).mockResolvedValue(mockData);

    const { result } = renderHook(() => usePrefetchGuests(), {
      wrapper: createQueryWrapper(),
    });

    await result.current.prefetchPage();

    expect(guestsApi.getAll).toHaveBeenCalledWith(undefined);
  });

  it('should prefetch guest by id successfully', async () => {
    const mockGuest = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      address: '',
      state: '',
      city: '',
      church: '',
      status: 'CONFIRMED',
      notes: '',
      isPastor: false,
      registrationDate: '2025-01-01',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
      deletedAt: null,
    };

    vi.mocked(guestsApi.getById).mockResolvedValue(mockGuest);

    const { result } = renderHook(() => usePrefetchGuests(), {
      wrapper: createQueryWrapper(),
    });

    await result.current.prefetchGuestById(1);

    expect(guestsApi.getById).toHaveBeenCalledWith(1);
  });

  it('should prefetch multiple guests by id', async () => {
    const mockGuest1 = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      address: '',
      state: '',
      city: '',
      church: '',
      status: 'CONFIRMED',
      notes: '',
      isPastor: false,
      registrationDate: '2025-01-01',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
      deletedAt: null,
    };

    const mockGuest2 = {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+9876543210',
      address: '',
      state: '',
      city: '',
      church: '',
      status: 'PENDING',
      notes: '',
      isPastor: false,
      registrationDate: '2025-01-01',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
      deletedAt: null,
    };

    vi.mocked(guestsApi.getById)
      .mockResolvedValueOnce(mockGuest1)
      .mockResolvedValueOnce(mockGuest2);

    const { result } = renderHook(() => usePrefetchGuests(), {
      wrapper: createQueryWrapper(),
    });

    await result.current.prefetchGuestById(1);
    await result.current.prefetchGuestById(2);

    expect(guestsApi.getById).toHaveBeenCalledTimes(2);
    expect(guestsApi.getById).toHaveBeenCalledWith(1);
    expect(guestsApi.getById).toHaveBeenCalledWith(2);
  });

  it('should prefetch stats successfully', async () => {
    const mockStats = {
      total: 100,
      confirmed: 60,
      pending: 30,
      declined: 10,
      pastors: 25,
    };

    vi.mocked(guestsApi.getStats).mockResolvedValue(mockStats);

    const { result } = renderHook(() => usePrefetchGuests(), {
      wrapper: createQueryWrapper(),
    });

    await result.current.prefetchStats();

    expect(guestsApi.getStats).toHaveBeenCalled();
  });

  it('should handle errors in prefetch gracefully', async () => {
    vi.mocked(guestsApi.getAll).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => usePrefetchGuests(), {
      wrapper: createQueryWrapper(),
    });

    // Prefetch should not throw, just fail silently
    await expect(result.current.prefetchPage()).resolves.not.toThrow();
  });

  it('should return all prefetch functions', () => {
    const { result } = renderHook(() => usePrefetchGuests(), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.prefetchPage).toBeDefined();
    expect(result.current.prefetchGuestById).toBeDefined();
    expect(result.current.prefetchStats).toBeDefined();
    expect(typeof result.current.prefetchPage).toBe('function');
    expect(typeof result.current.prefetchGuestById).toBe('function');
    expect(typeof result.current.prefetchStats).toBe('function');
  });

  it('should prefetch adjacent pages for pagination', async () => {
    const mockData = {
      data: [],
      meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
    };

    vi.mocked(guestsApi.getAll).mockResolvedValue(mockData);

    const { result } = renderHook(() => usePrefetchGuests(), {
      wrapper: createQueryWrapper(),
    });

    const currentPage = 5;

    // Prefetch previous and next pages
    await result.current.prefetchPage({ page: currentPage - 1, limit: 10 });
    await result.current.prefetchPage({ page: currentPage + 1, limit: 10 });

    expect(guestsApi.getAll).toHaveBeenCalledTimes(2);
    expect(guestsApi.getAll).toHaveBeenCalledWith({ page: 4, limit: 10 });
    expect(guestsApi.getAll).toHaveBeenCalledWith({ page: 6, limit: 10 });
  });
});
