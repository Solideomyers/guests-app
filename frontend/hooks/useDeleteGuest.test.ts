import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useDeleteGuest } from './useDeleteGuest';
import { guestsApi } from '../api/guests';
import { createQueryWrapper } from '../test/test-utils';

// Mock dependencies
vi.mock('../api/guests', () => ({
  guestsApi: {
    delete: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useDeleteGuest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should delete guest successfully', async () => {
    const deletedGuest = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      address: '',
      state: '',
      city: '',
      church: '',
      notes: '',
      status: 'CONFIRMED',
      isPastor: false,
      registrationDate: '2025-01-01',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
      deletedAt: '2025-01-01T10:00:00Z',
    };

    vi.mocked(guestsApi.delete).mockResolvedValue(deletedGuest);

    const { result } = renderHook(() => useDeleteGuest(), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.isIdle).toBe(true);

    result.current.mutate(1);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(deletedGuest);
    expect(guestsApi.delete).toHaveBeenCalledWith(1);
  });

  it('should handle error when deletion fails', async () => {
    const mockError = new Error('Failed to delete guest');
    vi.mocked(guestsApi.delete).mockRejectedValue(mockError);

    const { result } = renderHook(() => useDeleteGuest(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate(1);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
  });

  it('should delete multiple guests sequentially', async () => {
    const deletedGuest1 = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      address: '',
      state: '',
      city: '',
      church: '',
      notes: '',
      status: 'CONFIRMED',
      isPastor: false,
      registrationDate: '2025-01-01',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
      deletedAt: '2025-01-01T10:00:00Z',
    };

    const deletedGuest2 = {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+9876543210',
      address: '',
      state: '',
      city: '',
      church: '',
      notes: '',
      status: 'PENDING',
      isPastor: false,
      registrationDate: '2025-01-01',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
      deletedAt: '2025-01-01T10:00:00Z',
    };

    vi.mocked(guestsApi.delete)
      .mockResolvedValueOnce(deletedGuest1)
      .mockResolvedValueOnce(deletedGuest2);

    const { result } = renderHook(() => useDeleteGuest(), {
      wrapper: createQueryWrapper(),
    });

    // Delete first guest
    result.current.mutate(1);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.id).toBe(1);

    // Reset and delete second guest
    act(() => {
      result.current.reset();
    });

    result.current.mutate(2);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.id).toBe(2);
    expect(guestsApi.delete).toHaveBeenCalledTimes(2);
  });

  it('should handle not found error', async () => {
    const mockError = new Error('Guest not found');
    vi.mocked(guestsApi.delete).mockRejectedValue(mockError);

    const { result } = renderHook(() => useDeleteGuest(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate(999);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe('Guest not found');
  });

  it('should have correct loading states', async () => {
    const deletedGuest = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      address: '',
      state: '',
      city: '',
      church: '',
      notes: '',
      status: 'CONFIRMED',
      isPastor: false,
      registrationDate: '2025-01-01',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
      deletedAt: '2025-01-01T10:00:00Z',
    };

    // Delay the resolution to capture pending state
    vi.mocked(guestsApi.delete).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(deletedGuest), 100);
        })
    );

    const { result } = renderHook(() => useDeleteGuest(), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.isIdle).toBe(true);
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);

    result.current.mutate(1);

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.isIdle).toBe(false);
    expect(result.current.isPending).toBe(false);
  });

  it('should use mutateAsync', async () => {
    const deletedGuest = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      address: '',
      state: '',
      city: '',
      church: '',
      notes: '',
      status: 'CONFIRMED',
      isPastor: false,
      registrationDate: '2025-01-01',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
      deletedAt: '2025-01-01T10:00:00Z',
    };

    vi.mocked(guestsApi.delete).mockResolvedValue(deletedGuest);

    const { result } = renderHook(() => useDeleteGuest(), {
      wrapper: createQueryWrapper(),
    });

    const promise = result.current.mutateAsync(1);

    await expect(promise).resolves.toEqual(deletedGuest);
  });

  it('should handle soft delete (deletedAt not null)', async () => {
    const deletedGuest = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      address: '',
      state: '',
      city: '',
      church: '',
      notes: '',
      status: 'CONFIRMED',
      isPastor: false,
      registrationDate: '2025-01-01',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
      deletedAt: '2025-01-01T10:00:00Z',
    };

    vi.mocked(guestsApi.delete).mockResolvedValue(deletedGuest);

    const { result } = renderHook(() => useDeleteGuest(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate(1);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.deletedAt).not.toBeNull();
    expect(result.current.data?.deletedAt).toBe('2025-01-01T10:00:00Z');
  });

  it('should reset mutation state', async () => {
    const deletedGuest = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      address: '',
      state: '',
      city: '',
      church: '',
      notes: '',
      status: 'CONFIRMED',
      isPastor: false,
      registrationDate: '2025-01-01',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
      deletedAt: '2025-01-01T10:00:00Z',
    };

    vi.mocked(guestsApi.delete).mockResolvedValue(deletedGuest);

    const { result } = renderHook(() => useDeleteGuest(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate(1);

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

  it('should handle permission error', async () => {
    const mockError = new Error('Unauthorized');
    vi.mocked(guestsApi.delete).mockRejectedValue(mockError);

    const { result } = renderHook(() => useDeleteGuest(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate(1);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe('Unauthorized');
  });
});
