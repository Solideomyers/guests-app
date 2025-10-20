import type {
  PersistedClient,
  Persister,
} from '@tanstack/react-query-persist-client';

/**
 * Create a localStorage persister for React Query cache
 *
 * This enables:
 * - Cache persistence across browser sessions
 * - Offline data access
 * - Faster initial page loads with cached data
 * - Reduced server requests
 */
export const localStoragePersister: Persister = {
  persistClient: async (client: PersistedClient) => {
    try {
      window.localStorage.setItem('guests-app-cache', JSON.stringify(client));
    } catch (error) {
      console.error('Failed to persist cache:', error);
    }
  },
  restoreClient: async () => {
    try {
      const cached = window.localStorage.getItem('guests-app-cache');
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error('Failed to restore cache:', error);
    }
    return undefined;
  },
  removeClient: async () => {
    try {
      window.localStorage.removeItem('guests-app-cache');
    } catch (error) {
      console.error('Failed to remove cache:', error);
    }
  },
};
