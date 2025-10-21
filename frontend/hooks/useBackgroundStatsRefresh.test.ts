import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useBackgroundStatsRefresh } from './useBackgroundStatsRefresh';
import * as usePrefetchGuestsMod from './usePrefetchGuests';
import { createQueryWrapper } from '../test/test-utils';

// Mock usePrefetchGuests
vi.mock('./usePrefetchGuests', () => ({
  usePrefetchGuests: vi.fn(),
}));

describe('useBackgroundStatsRefresh', () => {
  let prefetchStatsMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    prefetchStatsMock = vi.fn();
    vi.mocked(usePrefetchGuestsMod.usePrefetchGuests).mockReturnValue({
      prefetchStats: prefetchStatsMock,
      prefetchPage: vi.fn(),
      prefetchGuestById: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should setup interval when enabled', () => {
    renderHook(() => useBackgroundStatsRefresh(), {
      wrapper: createQueryWrapper(),
    });

    expect(usePrefetchGuestsMod.usePrefetchGuests).toHaveBeenCalled();
  });

  it('should call prefetchStats after initial delay', () => {
    renderHook(() => useBackgroundStatsRefresh(), {
      wrapper: createQueryWrapper(),
    });

    expect(prefetchStatsMock).not.toHaveBeenCalled();

    // Fast forward 10 seconds (initial delay)
    vi.advanceTimersByTime(10000);

    expect(prefetchStatsMock).toHaveBeenCalledTimes(1);
  });

  it('should call prefetchStats periodically', () => {
    renderHook(() => useBackgroundStatsRefresh(60000), {
      // 1 minute interval
      wrapper: createQueryWrapper(),
    });

    // Initial delay (10 seconds)
    vi.advanceTimersByTime(10000);
    expect(prefetchStatsMock).toHaveBeenCalledTimes(1);

    // First interval (1 minute)
    vi.advanceTimersByTime(60000);
    expect(prefetchStatsMock).toHaveBeenCalledTimes(2);

    // Second interval (1 minute)
    vi.advanceTimersByTime(60000);
    expect(prefetchStatsMock).toHaveBeenCalledTimes(3);
  });

  it('should use default interval of 2 minutes', () => {
    renderHook(() => useBackgroundStatsRefresh(), {
      wrapper: createQueryWrapper(),
    });

    // Initial delay
    vi.advanceTimersByTime(10000);
    expect(prefetchStatsMock).toHaveBeenCalledTimes(1);

    // Default interval (2 minutes = 120000ms)
    vi.advanceTimersByTime(120000);
    expect(prefetchStatsMock).toHaveBeenCalledTimes(2);
  });

  it('should not call prefetchStats when disabled', () => {
    renderHook(() => useBackgroundStatsRefresh(undefined, false), {
      wrapper: createQueryWrapper(),
    });

    // Wait for initial delay and first interval
    vi.advanceTimersByTime(10000 + 120000);

    expect(prefetchStatsMock).not.toHaveBeenCalled();
  });

  it('should cleanup timers on unmount', () => {
    const { unmount } = renderHook(() => useBackgroundStatsRefresh(), {
      wrapper: createQueryWrapper(),
    });

    // Initial call
    vi.advanceTimersByTime(10000);
    expect(prefetchStatsMock).toHaveBeenCalledTimes(1);

    unmount();

    // Should not call after unmount
    vi.advanceTimersByTime(120000);
    expect(prefetchStatsMock).toHaveBeenCalledTimes(1);
  });

  it('should restart when interval changes', () => {
    const { rerender } = renderHook(
      ({ interval }) => useBackgroundStatsRefresh(interval),
      {
        wrapper: createQueryWrapper(),
        initialProps: { interval: 60000 }, // 1 minute
      }
    );

    // Initial delay
    vi.advanceTimersByTime(10000);
    expect(prefetchStatsMock).toHaveBeenCalledTimes(1);

    // First interval (1 minute)
    vi.advanceTimersByTime(60000);
    expect(prefetchStatsMock).toHaveBeenCalledTimes(2);

    // Change interval to 30 seconds
    rerender({ interval: 30000 });

    // Initial delay again
    vi.advanceTimersByTime(10000);
    expect(prefetchStatsMock).toHaveBeenCalledTimes(3);

    // New interval (30 seconds)
    vi.advanceTimersByTime(30000);
    expect(prefetchStatsMock).toHaveBeenCalledTimes(4);
  });

  it('should stop when disabled after being enabled', () => {
    const { rerender } = renderHook(
      ({ enabled }) => useBackgroundStatsRefresh(undefined, enabled),
      {
        wrapper: createQueryWrapper(),
        initialProps: { enabled: true },
      }
    );

    // Initial call
    vi.advanceTimersByTime(10000);
    expect(prefetchStatsMock).toHaveBeenCalledTimes(1);

    // Disable
    rerender({ enabled: false });

    // Should not call after disabling
    vi.advanceTimersByTime(120000);
    expect(prefetchStatsMock).toHaveBeenCalledTimes(1);
  });

  it('should start when enabled after being disabled', () => {
    const { rerender } = renderHook(
      ({ enabled }) => useBackgroundStatsRefresh(undefined, enabled),
      {
        wrapper: createQueryWrapper(),
        initialProps: { enabled: false },
      }
    );

    // Should not call while disabled
    vi.advanceTimersByTime(130000);
    expect(prefetchStatsMock).not.toHaveBeenCalled();

    // Enable
    rerender({ enabled: true });

    // Should start calling after enable
    vi.advanceTimersByTime(10000);
    expect(prefetchStatsMock).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(120000);
    expect(prefetchStatsMock).toHaveBeenCalledTimes(2);
  });
});
