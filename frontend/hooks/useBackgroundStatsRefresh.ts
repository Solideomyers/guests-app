import { useEffect, useRef } from 'react';
import { usePrefetchGuests } from './usePrefetchGuests';

/**
 * Hook to prefetch stats periodically in the background
 * Keeps statistics fresh without user interaction
 * 
 * @param intervalMs - Interval in milliseconds (default: 2 minutes)
 * @param enabled - Whether background prefetching is enabled (default: true)
 * 
 * @example
 * // In App.tsx or any top-level component
 * useBackgroundStatsRefresh();
 * 
 * // Custom interval (5 minutes)
 * useBackgroundStatsRefresh(5 * 60 * 1000);
 * 
 * // Disable when not needed
 * useBackgroundStatsRefresh(undefined, false);
 */
export function useBackgroundStatsRefresh(
  intervalMs: number = 2 * 60 * 1000, // 2 minutes default
  enabled: boolean = true
) {
  const { prefetchStats } = usePrefetchGuests();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Initial prefetch after mount
    const initialTimeout = setTimeout(() => {
      prefetchStats();
    }, 10000); // Wait 10 seconds after mount

    // Set up periodic prefetching
    intervalRef.current = setInterval(() => {
      prefetchStats();
    }, intervalMs);

    // Cleanup on unmount or when dependencies change
    return () => {
      clearTimeout(initialTimeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [intervalMs, enabled, prefetchStats]);
}
