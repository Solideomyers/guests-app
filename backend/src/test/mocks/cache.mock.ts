/**
 * Mock Cache Service for Testing
 * Provides jest.fn() mocks for cache operations
 */

export const mockCacheService = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  reset: jest.fn(),
  invalidatePattern: jest.fn(),
};

/**
 * Reset all cache mocks between tests
 */
export const resetCacheMocks = () => {
  Object.values(mockCacheService).forEach((fn) => {
    if (typeof fn === 'function' && 'mockReset' in fn) {
      fn.mockReset();
    }
  });
};
