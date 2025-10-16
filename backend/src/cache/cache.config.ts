/**
 * Cache Configuration Constants
 */

export const CACHE_CONFIG = {
  // TTL (Time To Live) in seconds
  TTL: {
    GUESTS_LIST: 300, // 5 minutes
    GUEST_DETAIL: 600, // 10 minutes
    STATS: 180, // 3 minutes
    HISTORY: 300, // 5 minutes
  },

  // Cache key prefixes
  KEYS: {
    GUESTS_LIST: 'guests:list',
    GUEST_DETAIL: 'guests:detail',
    STATS: 'guests:stats',
    HISTORY: 'guests:history',
  },
} as const;
