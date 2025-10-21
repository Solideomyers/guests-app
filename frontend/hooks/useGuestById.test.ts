import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useGuestById } from './useGuestById';
import { guestsApi } from '../api/guests';
import { createQueryWrapper } from '../test/test-utils';

// Mock the API
vi.mock('../api/guests', () => ({
  guestsApi: {
    getById: vi.fn(),
  },
}));

describe('useGuestById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch guest by id successfully', async () => {
    const mockGuest = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      address: '123 Main St',
      state: 'NY',
      city: 'New York',
      church: 'Central Church',
      status: 'CONFIRMED',
      notes: 'VIP guest',
      isPastor: false,
      registrationDate: '2025-01-01',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
      deletedAt: null,
    };

    vi.mocked(guestsApi.getById).mockResolvedValue(mockGuest);

    const { result } = renderHook(() => useGuestById(1), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockGuest);
    expect(guestsApi.getById).toHaveBeenCalledWith(1);
  });

  it('should handle error when guest not found', async () => {
    const mockError = new Error('Guest not found');
    vi.mocked(guestsApi.getById).mockRejectedValue(mockError);

    const { result } = renderHook(() => useGuestById(999), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
    expect(result.current.data).toBeUndefined();
  });

  it('should not fetch when id is undefined', () => {
    const { result } = renderHook(() => useGuestById(undefined), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(guestsApi.getById).not.toHaveBeenCalled();
  });

  it('should not fetch when id is null', () => {
    const { result } = renderHook(() => useGuestById(null), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(guestsApi.getById).not.toHaveBeenCalled();
  });

  it('should fetch pastor guest', async () => {
    const mockGuest = {
      id: 2,
      firstName: 'Pastor',
      lastName: 'John',
      phone: '+9876543210',
      address: '',
      state: '',
      city: '',
      church: 'Main Church',
      status: 'CONFIRMED',
      notes: '',
      isPastor: true,
      registrationDate: '2025-01-01',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
      deletedAt: null,
    };

    vi.mocked(guestsApi.getById).mockResolvedValue(mockGuest);

    const { result } = renderHook(() => useGuestById(2), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.isPastor).toBe(true);
  });

  it('should handle different statuses', async () => {
    const mockGuest = {
      id: 3,
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+1111111111',
      address: '',
      state: '',
      city: '',
      church: '',
      status: 'DECLINED',
      notes: '',
      isPastor: false,
      registrationDate: '2025-01-01',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
      deletedAt: null,
    };

    vi.mocked(guestsApi.getById).mockResolvedValue(mockGuest);

    const { result } = renderHook(() => useGuestById(3), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.status).toBe('DECLINED');
  });

  it('should have correct loading states', async () => {
    const mockGuest = {
      id: 4,
      firstName: 'Test',
      lastName: 'User',
      phone: '+2222222222',
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

    vi.mocked(guestsApi.getById).mockResolvedValue(mockGuest);

    const { result } = renderHook(() => useGuestById(4), {
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

  it('should refetch when id changes', async () => {
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

    vi.mocked(guestsApi.getById).mockImplementation((id) => {
      if (id === 1) return Promise.resolve(mockGuest1);
      if (id === 2) return Promise.resolve(mockGuest2);
      return Promise.reject(new Error('Guest not found'));
    });

    const { result, rerender } = renderHook(({ id }) => useGuestById(id), {
      wrapper: createQueryWrapper(),
      initialProps: { id: 1 },
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.id).toBe(1);

    rerender({ id: 2 });

    await waitFor(() => {
      expect(result.current.data?.id).toBe(2);
    });

    expect(guestsApi.getById).toHaveBeenCalledWith(1);
    expect(guestsApi.getById).toHaveBeenCalledWith(2);
  });
});
