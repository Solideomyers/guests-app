import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useCreateGuest } from './useCreateGuest';
import { guestsApi } from '../api/guests';
import { createQueryWrapper } from '../test/test-utils';

// Mock dependencies
vi.mock('../api/guests', () => ({
  guestsApi: {
    create: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useCreateGuest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create guest successfully', async () => {
    const newGuestData = {
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      status: 'CONFIRMED' as const,
    };

    const createdGuest = {
      id: 1,
      ...newGuestData,
      address: '',
      state: '',
      city: '',
      church: '',
      notes: '',
      isPastor: false,
      registrationDate: '2025-01-01',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
      deletedAt: null,
    };

    vi.mocked(guestsApi.create).mockResolvedValue(createdGuest);

    const { result } = renderHook(() => useCreateGuest(), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.isIdle).toBe(true);

    result.current.mutate(newGuestData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(createdGuest);
    expect(guestsApi.create).toHaveBeenCalledWith(newGuestData);
  });

  it('should handle error when creation fails', async () => {
    const newGuestData = {
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      status: 'CONFIRMED' as const,
    };

    const mockError = new Error('Failed to create guest');
    vi.mocked(guestsApi.create).mockRejectedValue(mockError);

    const { result } = renderHook(() => useCreateGuest(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate(newGuestData);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
  });

  it('should create guest with all fields', async () => {
    const newGuestData = {
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      status: 'CONFIRMED' as const,
      address: '123 Main St',
      state: 'NY',
      city: 'New York',
      church: 'Central Church',
      notes: 'VIP guest',
      isPastor: true,
    };

    const createdGuest = {
      id: 1,
      ...newGuestData,
      registrationDate: '2025-01-01',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
      deletedAt: null,
    };

    vi.mocked(guestsApi.create).mockResolvedValue(createdGuest);

    const { result } = renderHook(() => useCreateGuest(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate(newGuestData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(guestsApi.create).toHaveBeenCalledWith(newGuestData);
    expect(result.current.data).toEqual(createdGuest);
  });

  it('should create guest with minimal data', async () => {
    const newGuestData = {
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
    };

    const createdGuest = {
      id: 1,
      ...newGuestData,
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
      deletedAt: null,
    };

    vi.mocked(guestsApi.create).mockResolvedValue(createdGuest);

    const { result } = renderHook(() => useCreateGuest(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate(newGuestData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.status).toBe('PENDING');
  });

  it('should create pastor guest', async () => {
    const newGuestData = {
      firstName: 'Pastor',
      lastName: 'John',
      phone: '+1234567890',
      isPastor: true,
      status: 'CONFIRMED' as const,
    };

    const createdGuest = {
      id: 1,
      ...newGuestData,
      address: '',
      state: '',
      city: '',
      church: '',
      notes: '',
      registrationDate: '2025-01-01',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
      deletedAt: null,
    };

    vi.mocked(guestsApi.create).mockResolvedValue(createdGuest);

    const { result } = renderHook(() => useCreateGuest(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate(newGuestData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.isPastor).toBe(true);
  });

  it('should have correct loading states', async () => {
    const newGuestData = {
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
    };

    const createdGuest = {
      id: 1,
      ...newGuestData,
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
      deletedAt: null,
    };

    // Delay the resolution to capture pending state
    vi.mocked(guestsApi.create).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(createdGuest), 100);
        })
    );

    const { result } = renderHook(() => useCreateGuest(), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.isIdle).toBe(true);
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);

    result.current.mutate(newGuestData);

    // Wait for pending state
    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    // Wait for success
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.isIdle).toBe(false);
    expect(result.current.isPending).toBe(false);
  });

  it('should use mutateAsync', async () => {
    const newGuestData = {
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
    };

    const createdGuest = {
      id: 1,
      ...newGuestData,
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
      deletedAt: null,
    };

    vi.mocked(guestsApi.create).mockResolvedValue(createdGuest);

    const { result } = renderHook(() => useCreateGuest(), {
      wrapper: createQueryWrapper(),
    });

    const promise = result.current.mutateAsync(newGuestData);

    await expect(promise).resolves.toEqual(createdGuest);
  });

  it('should handle validation errors', async () => {
    const newGuestData = {
      firstName: '',
      lastName: 'Doe',
      phone: 'invalid',
    };

    const mockError = new Error('Validation failed');
    vi.mocked(guestsApi.create).mockRejectedValue(mockError);

    const { result } = renderHook(() => useCreateGuest(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate(newGuestData);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe('Validation failed');
  });

  it('should handle duplicate phone error', async () => {
    const newGuestData = {
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
    };

    const mockError = new Error('Guest with this phone already exists');
    vi.mocked(guestsApi.create).mockRejectedValue(mockError);

    const { result } = renderHook(() => useCreateGuest(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate(newGuestData);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toContain('already exists');
  });

  it('should reset mutation state', async () => {
    const newGuestData = {
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
    };

    const createdGuest = {
      id: 1,
      ...newGuestData,
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
      deletedAt: null,
    };

    vi.mocked(guestsApi.create).mockResolvedValue(createdGuest);

    const { result } = renderHook(() => useCreateGuest(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate(newGuestData);

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
