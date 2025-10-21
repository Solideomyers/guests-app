import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useUpdateGuest } from './useUpdateGuest';
import { guestsApi } from '../api/guests';
import { createQueryWrapper } from '../test/test-utils';

// Mock dependencies
vi.mock('../api/guests', () => ({
  guestsApi: {
    update: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useUpdateGuest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update guest successfully', async () => {
    const updateData = {
      status: 'CONFIRMED' as const,
    };

    const updatedGuest = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      address: '',
      state: '',
      city: '',
      church: '',
      notes: '',
      isPastor: false,
      status: 'CONFIRMED',
      registrationDate: '2025-01-01',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01T10:00:00Z',
      deletedAt: null,
    };

    vi.mocked(guestsApi.update).mockResolvedValue(updatedGuest);

    const { result } = renderHook(() => useUpdateGuest(), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.isIdle).toBe(true);

    result.current.mutate({ id: 1, data: updateData });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(updatedGuest);
    expect(guestsApi.update).toHaveBeenCalledWith(1, updateData);
  });

  it('should handle error when update fails', async () => {
    const updateData = {
      status: 'CONFIRMED' as const,
    };

    const mockError = new Error('Failed to update guest');
    vi.mocked(guestsApi.update).mockRejectedValue(mockError);

    const { result } = renderHook(() => useUpdateGuest(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate({ id: 1, data: updateData });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
  });

  it('should update guest with all fields', async () => {
    const updateData = {
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+9876543210',
      address: '456 Oak St',
      state: 'CA',
      city: 'Los Angeles',
      church: 'West Church',
      notes: 'Updated notes',
      status: 'CONFIRMED' as const,
      isPastor: true,
    };

    const updatedGuest = {
      id: 1,
      ...updateData,
      registrationDate: '2025-01-01',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01T10:00:00Z',
      deletedAt: null,
    };

    vi.mocked(guestsApi.update).mockResolvedValue(updatedGuest);

    const { result } = renderHook(() => useUpdateGuest(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate({ id: 1, data: updateData });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(guestsApi.update).toHaveBeenCalledWith(1, updateData);
    expect(result.current.data).toEqual(updatedGuest);
  });

  it('should update guest with partial data', async () => {
    const updateData = {
      notes: 'Updated notes only',
    };

    const updatedGuest = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      address: '',
      state: '',
      city: '',
      church: '',
      notes: 'Updated notes only',
      status: 'PENDING',
      isPastor: false,
      registrationDate: '2025-01-01',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01T10:00:00Z',
      deletedAt: null,
    };

    vi.mocked(guestsApi.update).mockResolvedValue(updatedGuest);

    const { result } = renderHook(() => useUpdateGuest(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate({ id: 1, data: updateData });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.notes).toBe('Updated notes only');
  });

  it('should update status', async () => {
    const updateData = {
      status: 'DECLINED' as const,
    };

    const updatedGuest = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      address: '',
      state: '',
      city: '',
      church: '',
      notes: '',
      status: 'DECLINED',
      isPastor: false,
      registrationDate: '2025-01-01',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01T10:00:00Z',
      deletedAt: null,
    };

    vi.mocked(guestsApi.update).mockResolvedValue(updatedGuest);

    const { result } = renderHook(() => useUpdateGuest(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate({ id: 1, data: updateData });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.status).toBe('DECLINED');
  });

  it('should update isPastor flag', async () => {
    const updateData = {
      isPastor: true,
    };

    const updatedGuest = {
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
      isPastor: true,
      registrationDate: '2025-01-01',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01T10:00:00Z',
      deletedAt: null,
    };

    vi.mocked(guestsApi.update).mockResolvedValue(updatedGuest);

    const { result } = renderHook(() => useUpdateGuest(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate({ id: 1, data: updateData });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.isPastor).toBe(true);
  });

  it('should have correct loading states', async () => {
    const updateData = {
      status: 'CONFIRMED' as const,
    };

    const updatedGuest = {
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
      updatedAt: '2025-01-01T10:00:00Z',
      deletedAt: null,
    };

    // Delay the resolution to capture pending state
    vi.mocked(guestsApi.update).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(updatedGuest), 100);
        })
    );

    const { result } = renderHook(() => useUpdateGuest(), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.isIdle).toBe(true);
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);

    result.current.mutate({ id: 1, data: updateData });

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
    const updateData = {
      status: 'CONFIRMED' as const,
    };

    const updatedGuest = {
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
      updatedAt: '2025-01-01T10:00:00Z',
      deletedAt: null,
    };

    vi.mocked(guestsApi.update).mockResolvedValue(updatedGuest);

    const { result } = renderHook(() => useUpdateGuest(), {
      wrapper: createQueryWrapper(),
    });

    const promise = result.current.mutateAsync({ id: 1, data: updateData });

    await expect(promise).resolves.toEqual(updatedGuest);
  });

  it('should handle validation errors', async () => {
    const updateData = {
      phone: 'invalid',
    };

    const mockError = new Error('Validation failed');
    vi.mocked(guestsApi.update).mockRejectedValue(mockError);

    const { result } = renderHook(() => useUpdateGuest(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate({ id: 1, data: updateData });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe('Validation failed');
  });

  it('should reset mutation state', async () => {
    const updateData = {
      status: 'CONFIRMED' as const,
    };

    const updatedGuest = {
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
      updatedAt: '2025-01-01T10:00:00Z',
      deletedAt: null,
    };

    vi.mocked(guestsApi.update).mockResolvedValue(updatedGuest);

    const { result } = renderHook(() => useUpdateGuest(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate({ id: 1, data: updateData });

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
