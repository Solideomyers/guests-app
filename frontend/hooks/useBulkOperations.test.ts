import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import {
  useBulkUpdateStatus,
  useBulkUpdatePastor,
  useBulkDelete,
} from './useBulkOperations';
import { guestsApi } from '../api/guests';
import { createQueryWrapper } from '../test/test-utils';

// Mock dependencies
vi.mock('../api/guests', () => ({
  guestsApi: {
    bulkUpdateStatus: vi.fn(),
    bulkUpdatePastor: vi.fn(),
    bulkDelete: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useBulkUpdateStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update status for multiple guests', async () => {
    const data = {
      ids: [1, 2, 3],
      status: 'CONFIRMED' as const,
    };

    const response = {
      count: 3,
      ids: [1, 2, 3],
    };

    vi.mocked(guestsApi.bulkUpdateStatus).mockResolvedValue(response);

    const { result } = renderHook(() => useBulkUpdateStatus(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate(data);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(response);
    expect(guestsApi.bulkUpdateStatus).toHaveBeenCalledWith(data);
  });

  it('should handle error when bulk update fails', async () => {
    const data = {
      ids: [1, 2, 3],
      status: 'CONFIRMED' as const,
    };

    const mockError = new Error('Failed to update status');
    vi.mocked(guestsApi.bulkUpdateStatus).mockRejectedValue(mockError);

    const { result } = renderHook(() => useBulkUpdateStatus(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate(data);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
  });

  it('should update to PENDING status', async () => {
    const data = {
      ids: [1, 2],
      status: 'PENDING' as const,
    };

    const response = {
      count: 2,
      ids: [1, 2],
    };

    vi.mocked(guestsApi.bulkUpdateStatus).mockResolvedValue(response);

    const { result } = renderHook(() => useBulkUpdateStatus(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate(data);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.count).toBe(2);
  });

  it('should update to DECLINED status', async () => {
    const data = {
      ids: [5, 6, 7, 8],
      status: 'DECLINED' as const,
    };

    const response = {
      count: 4,
      ids: [5, 6, 7, 8],
    };

    vi.mocked(guestsApi.bulkUpdateStatus).mockResolvedValue(response);

    const { result } = renderHook(() => useBulkUpdateStatus(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate(data);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.count).toBe(4);
  });

  it('should handle single guest update', async () => {
    const data = {
      ids: [1],
      status: 'CONFIRMED' as const,
    };

    const response = {
      count: 1,
      ids: [1],
    };

    vi.mocked(guestsApi.bulkUpdateStatus).mockResolvedValue(response);

    const { result } = renderHook(() => useBulkUpdateStatus(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate(data);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.count).toBe(1);
  });

  it('should have correct loading states', async () => {
    const data = {
      ids: [1, 2],
      status: 'CONFIRMED' as const,
    };

    const response = {
      count: 2,
      ids: [1, 2],
    };

    vi.mocked(guestsApi.bulkUpdateStatus).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(response), 100);
        })
    );

    const { result } = renderHook(() => useBulkUpdateStatus(), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.isIdle).toBe(true);

    result.current.mutate(data);

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.isPending).toBe(false);
  });

  it('should reset mutation state', async () => {
    const data = {
      ids: [1, 2],
      status: 'CONFIRMED' as const,
    };

    const response = {
      count: 2,
      ids: [1, 2],
    };

    vi.mocked(guestsApi.bulkUpdateStatus).mockResolvedValue(response);

    const { result } = renderHook(() => useBulkUpdateStatus(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate(data);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    act(() => {
      result.current.reset();
    });

    await waitFor(() => {
      expect(result.current.isIdle).toBe(true);
    });

    expect(result.current.data).toBeUndefined();
  });
});

describe('useBulkUpdatePastor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should mark guests as pastors', async () => {
    const data = {
      ids: [1, 2, 3],
      isPastor: true,
    };

    const response = {
      count: 3,
      ids: [1, 2, 3],
    };

    vi.mocked(guestsApi.bulkUpdatePastor).mockResolvedValue(response);

    const { result } = renderHook(() => useBulkUpdatePastor(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate(data);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(response);
    expect(guestsApi.bulkUpdatePastor).toHaveBeenCalledWith(data);
  });

  it('should unmark guests as pastors', async () => {
    const data = {
      ids: [4, 5],
      isPastor: false,
    };

    const response = {
      count: 2,
      ids: [4, 5],
    };

    vi.mocked(guestsApi.bulkUpdatePastor).mockResolvedValue(response);

    const { result } = renderHook(() => useBulkUpdatePastor(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate(data);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.count).toBe(2);
  });

  it('should handle error when bulk update pastor fails', async () => {
    const data = {
      ids: [1, 2],
      isPastor: true,
    };

    const mockError = new Error('Failed to update pastor status');
    vi.mocked(guestsApi.bulkUpdatePastor).mockRejectedValue(mockError);

    const { result } = renderHook(() => useBulkUpdatePastor(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate(data);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
  });

  it('should handle single guest pastor update', async () => {
    const data = {
      ids: [1],
      isPastor: true,
    };

    const response = {
      count: 1,
      ids: [1],
    };

    vi.mocked(guestsApi.bulkUpdatePastor).mockResolvedValue(response);

    const { result } = renderHook(() => useBulkUpdatePastor(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate(data);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.count).toBe(1);
  });

  it('should have correct loading states', async () => {
    const data = {
      ids: [1, 2],
      isPastor: true,
    };

    const response = {
      count: 2,
      ids: [1, 2],
    };

    vi.mocked(guestsApi.bulkUpdatePastor).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(response), 100);
        })
    );

    const { result } = renderHook(() => useBulkUpdatePastor(), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.isIdle).toBe(true);

    result.current.mutate(data);

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.isPending).toBe(false);
  });

  it('should reset mutation state', async () => {
    const data = {
      ids: [1, 2],
      isPastor: true,
    };

    const response = {
      count: 2,
      ids: [1, 2],
    };

    vi.mocked(guestsApi.bulkUpdatePastor).mockResolvedValue(response);

    const { result } = renderHook(() => useBulkUpdatePastor(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate(data);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    act(() => {
      result.current.reset();
    });

    await waitFor(() => {
      expect(result.current.isIdle).toBe(true);
    });

    expect(result.current.data).toBeUndefined();
  });
});

describe('useBulkDelete', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should delete multiple guests', async () => {
    const data = {
      ids: [1, 2, 3, 4],
    };

    const response = {
      count: 4,
      ids: [1, 2, 3, 4],
    };

    vi.mocked(guestsApi.bulkDelete).mockResolvedValue(response);

    const { result } = renderHook(() => useBulkDelete(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate(data);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(response);
    expect(guestsApi.bulkDelete).toHaveBeenCalledWith(data);
  });

  it('should handle error when bulk delete fails', async () => {
    const data = {
      ids: [1, 2, 3],
    };

    const mockError = new Error('Failed to delete guests');
    vi.mocked(guestsApi.bulkDelete).mockRejectedValue(mockError);

    const { result } = renderHook(() => useBulkDelete(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate(data);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
  });

  it('should delete single guest', async () => {
    const data = {
      ids: [1],
    };

    const response = {
      count: 1,
      ids: [1],
    };

    vi.mocked(guestsApi.bulkDelete).mockResolvedValue(response);

    const { result } = renderHook(() => useBulkDelete(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate(data);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.count).toBe(1);
  });

  it('should delete many guests', async () => {
    const data = {
      ids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    };

    const response = {
      count: 10,
      ids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    };

    vi.mocked(guestsApi.bulkDelete).mockResolvedValue(response);

    const { result } = renderHook(() => useBulkDelete(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate(data);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.count).toBe(10);
  });

  it('should have correct loading states', async () => {
    const data = {
      ids: [1, 2, 3],
    };

    const response = {
      count: 3,
      ids: [1, 2, 3],
    };

    vi.mocked(guestsApi.bulkDelete).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(response), 100);
        })
    );

    const { result } = renderHook(() => useBulkDelete(), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.isIdle).toBe(true);

    result.current.mutate(data);

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.isPending).toBe(false);
  });

  it('should use mutateAsync', async () => {
    const data = {
      ids: [1, 2],
    };

    const response = {
      count: 2,
      ids: [1, 2],
    };

    vi.mocked(guestsApi.bulkDelete).mockResolvedValue(response);

    const { result } = renderHook(() => useBulkDelete(), {
      wrapper: createQueryWrapper(),
    });

    const promise = result.current.mutateAsync(data);

    await expect(promise).resolves.toEqual(response);
  });

  it('should handle partial failure gracefully', async () => {
    const data = {
      ids: [1, 2, 3],
    };

    // API returns fewer deleted items than requested
    const response = {
      count: 2,
      ids: [1, 2],
    };

    vi.mocked(guestsApi.bulkDelete).mockResolvedValue(response);

    const { result } = renderHook(() => useBulkDelete(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate(data);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.count).toBe(2);
  });

  it('should reset mutation state', async () => {
    const data = {
      ids: [1, 2],
    };

    const response = {
      count: 2,
      ids: [1, 2],
    };

    vi.mocked(guestsApi.bulkDelete).mockResolvedValue(response);

    const { result } = renderHook(() => useBulkDelete(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate(data);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    act(() => {
      result.current.reset();
    });

    await waitFor(() => {
      expect(result.current.isIdle).toBe(true);
    });

    expect(result.current.data).toBeUndefined();
  });
});
