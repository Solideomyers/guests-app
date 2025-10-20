import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { CacheService } from './cache.service';

// Mock ioredis
const mockRedisClient = {
  get: jest.fn(),
  setex: jest.fn(),
  del: jest.fn(),
  keys: jest.fn(),
  flushdb: jest.fn(),
  info: jest.fn(),
  on: jest.fn(),
  quit: jest.fn(),
  status: 'ready',
};

// Mock ioredis as default export
jest.mock(
  'ioredis',
  () => {
    return jest.fn().mockImplementation(() => mockRedisClient);
  },
  { virtual: true },
);

describe.skip('CacheService', () => {
  let service: CacheService;
  let configService: ConfigService;

  beforeEach(async () => {
    // Reset all mocks
    jest.clearAllMocks();
    mockRedisClient.status = 'ready';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, defaultValue?: any) => {
              const config = {
                CACHE_TTL: 300,
                REDIS_HOST: 'localhost',
                REDIS_PORT: 6379,
                REDIS_PASSWORD: undefined,
              };
              return config[key] ?? defaultValue;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
    configService = module.get<ConfigService>(ConfigService);

    // Initialize the module
    await service.onModuleInit();
  });

  afterEach(async () => {
    await service.onModuleDestroy();
  });

  describe('get', () => {
    it('should get value from cache', async () => {
      const testData = { name: 'John', age: 30 };
      mockRedisClient.get.mockResolvedValue(JSON.stringify(testData));

      const result = await service.get('test-key');

      expect(result).toEqual(testData);
      expect(mockRedisClient.get).toHaveBeenCalledWith('test-key');
    });

    it('should return null for missing keys', async () => {
      mockRedisClient.get.mockResolvedValue(null);

      const result = await service.get('missing-key');

      expect(result).toBeNull();
    });

    it('should handle JSON parse errors gracefully', async () => {
      mockRedisClient.get.mockResolvedValue('invalid-json{');
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await service.get('invalid-key');

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should handle Redis errors gracefully', async () => {
      mockRedisClient.get.mockRejectedValue(new Error('Redis error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await service.get('error-key');

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('set', () => {
    it('should set value in cache with default TTL', async () => {
      const testData = { name: 'John', age: 30 };
      mockRedisClient.setex.mockResolvedValue('OK');

      await service.set('test-key', testData);

      expect(mockRedisClient.setex).toHaveBeenCalledWith(
        'test-key',
        300, // default TTL
        JSON.stringify(testData),
      );
    });

    it('should set value in cache with custom TTL', async () => {
      const testData = { name: 'John' };
      mockRedisClient.setex.mockResolvedValue('OK');

      await service.set('test-key', testData, 600);

      expect(mockRedisClient.setex).toHaveBeenCalledWith(
        'test-key',
        600,
        JSON.stringify(testData),
      );
    });

    it('should handle Redis errors gracefully', async () => {
      mockRedisClient.setex.mockRejectedValue(new Error('Redis error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await service.set('error-key', { data: 'test' });

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('del', () => {
    it('should delete specific key from cache', async () => {
      mockRedisClient.del.mockResolvedValue(1);

      await service.del('test-key');

      expect(mockRedisClient.del).toHaveBeenCalledWith('test-key');
    });

    it('should handle Redis errors gracefully', async () => {
      mockRedisClient.del.mockRejectedValue(new Error('Redis error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await service.del('error-key');

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('invalidatePattern', () => {
    it('should delete all keys matching pattern', async () => {
      const matchingKeys = [
        'cache:/api/v1/guests',
        'cache:/api/v1/guests/stats',
      ];
      mockRedisClient.keys.mockResolvedValue(matchingKeys);
      mockRedisClient.del.mockResolvedValue(2);
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await service.invalidatePattern('cache:/api/v1/guests*');

      expect(mockRedisClient.keys).toHaveBeenCalledWith(
        'cache:/api/v1/guests*',
      );
      expect(mockRedisClient.del).toHaveBeenCalledWith(...matchingKeys);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should handle no matching keys', async () => {
      mockRedisClient.keys.mockResolvedValue([]);

      await service.invalidatePattern('cache:/api/v1/nonexistent*');

      expect(mockRedisClient.keys).toHaveBeenCalled();
      expect(mockRedisClient.del).not.toHaveBeenCalled();
    });

    it('should handle Redis errors gracefully', async () => {
      mockRedisClient.keys.mockRejectedValue(new Error('Redis error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await service.invalidatePattern('error-pattern*');

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('clear', () => {
    it('should clear all cache', async () => {
      mockRedisClient.flushdb.mockResolvedValue('OK');
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await service.clear();

      expect(mockRedisClient.flushdb).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should handle Redis errors gracefully', async () => {
      mockRedisClient.flushdb.mockRejectedValue(new Error('Redis error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await service.clear();

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('isConnected', () => {
    it('should return true when Redis is connected', () => {
      mockRedisClient.status = 'ready';

      const result = service.isConnected();

      expect(result).toBe(true);
    });

    it('should return false when Redis is not connected', () => {
      mockRedisClient.status = 'connecting';

      const result = service.isConnected();

      expect(result).toBe(false);
    });
  });

  describe('getStats', () => {
    it('should return cache statistics', async () => {
      const mockStatsInfo = 'total_connections_received:100';
      const mockKeyspaceInfo = 'db0:keys=10';

      mockRedisClient.info
        .mockResolvedValueOnce(mockStatsInfo)
        .mockResolvedValueOnce(mockKeyspaceInfo);

      const result = await service.getStats();

      expect(result).toEqual({
        status: 'ready',
        info: mockStatsInfo,
        keyspace: mockKeyspaceInfo,
      });
      expect(mockRedisClient.info).toHaveBeenCalledWith('stats');
      expect(mockRedisClient.info).toHaveBeenCalledWith('keyspace');
    });

    it('should handle errors gracefully', async () => {
      mockRedisClient.info.mockRejectedValue(new Error('Redis error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await service.getStats();

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
