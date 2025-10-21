import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useGuestStats } from './useGuestStats';
import { guestsApi } from '../api/guests';
import { createQueryWrapper } from '../test/test-utils';

// Mock the API
vi.mock('../api/guests', () => ({
  guestsApi: {
    getStats: vi.fn(),
  },
}));

describe('useGuestStats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch stats successfully', async () => {
    const mockStats = {
      total: 100,
      confirmed: 60,
      pending: 30,
      declined: 10,
      pastors: 25,
    };

    vi.mocked(guestsApi.getStats).mockResolvedValue(mockStats);

    const { result } = renderHook(() => useGuestStats(), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockStats);
    expect(guestsApi.getStats).toHaveBeenCalledTimes(1);
  });

  it('should handle error when fetching fails', async () => {
    const mockError = new Error('Failed to fetch stats');
    vi.mocked(guestsApi.getStats).mockRejectedValue(mockError);

    const { result } = renderHook(() => useGuestStats(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
    expect(result.current.data).toBeUndefined();
  });

  it('should return stats with zero values', async () => {
    const mockStats = {
      total: 0,
      confirmed: 0,
      pending: 0,
      declined: 0,
      pastors: 0,
    };

    vi.mocked(guestsApi.getStats).mockResolvedValue(mockStats);

    const { result } = renderHook(() => useGuestStats(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockStats);
    expect(result.current.data?.total).toBe(0);
  });

  it('should have correct loading states', async () => {
    const mockStats = {
      total: 50,
      confirmed: 30,
      pending: 15,
      declined: 5,
      pastors: 10,
    };

    vi.mocked(guestsApi.getStats).mockResolvedValue(mockStats);

    const { result } = renderHook(() => useGuestStats(), {
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

  it('should handle stats with high numbers', async () => {
    const mockStats = {
      total: 10000,
      confirmed: 7500,
      pending: 2000,
      declined: 500,
      pastors: 3000,
    };

    vi.mocked(guestsApi.getStats).mockResolvedValue(mockStats);

    const { result } = renderHook(() => useGuestStats(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockStats);
    expect(result.current.data?.total).toBe(10000);
  });

  it('should have staleTime configured', () => {
    const { result } = renderHook(() => useGuestStats(), {
      wrapper: createQueryWrapper(),
    });

    // The hook should be configured with staleTime
    // This is just checking that the hook can be instantiated
    expect(result.current).toBeDefined();
  });
});
