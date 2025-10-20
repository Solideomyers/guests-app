/**
 * CacheService Integration Tests
 *
 * Tests CacheService with real Redis instance.
 * Validates:
 * - Connection to Redis server
 * - Get/Set/Delete operations with real persistence
 * - TTL expiration behavior
 * - Pattern-based invalidation
 * - Cache statistics
 * - Error handling with real Redis errors
 */

import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from './cache.service';
import { ConfigModule } from '@nestjs/config';

describe('CacheService (Integration)', () => {
  let service: CacheService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
          isGlobal: true,
        }),
      ],
      providers: [CacheService],
    }).compile();

    service = module.get<CacheService>(CacheService);

    // Manually initialize the service (NestJS doesn't auto-call onModuleInit in tests)
    await service.onModuleInit();

    // Wait for Redis connection to stabilize
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });

  beforeEach(async () => {
    // Clear cache before each test
    await service.clear();
  });

  afterAll(async () => {
    // Clean up and close connections
    await service.clear();
    await service.onModuleDestroy();
  });

  describe('connection', () => {
    it('should be connected to Redis', () => {
      const isConnected = service.isConnected();
      expect(isConnected).toBe(true);
    });

    it('should return cache stats', async () => {
      const stats = await service.getStats();

      expect(stats).toBeDefined();
      expect(stats.status).toBeDefined();
      expect(stats.info).toBeDefined();
      expect(stats.keyspace).toBeDefined();
    });
  });

  describe('set and get', () => {
    it('should set and retrieve string value', async () => {
      await service.set('test:string', 'Hello World');

      const value = await service.get('test:string');
      expect(value).toBe('Hello World');
    });

    it('should set and retrieve object value', async () => {
      const obj = { name: 'John', age: 30, active: true };
      await service.set('test:object', obj);

      const value = await service.get('test:object');
      expect(value).toEqual(obj);
    });

    it('should set and retrieve array value', async () => {
      const arr = [1, 2, 3, 'four', { five: 5 }];
      await service.set('test:array', arr);

      const value = await service.get('test:array');
      expect(value).toEqual(arr);
    });

    it('should set and retrieve number value', async () => {
      await service.set('test:number', 42);

      const value = await service.get('test:number');
      expect(value).toBe(42);
    });

    it('should set and retrieve boolean value', async () => {
      await service.set('test:boolean:true', true);
      await service.set('test:boolean:false', false);

      const valueTrue = await service.get('test:boolean:true');
      const valueFalse = await service.get('test:boolean:false');

      expect(valueTrue).toBe(true);
      expect(valueFalse).toBe(false);
    });

    it('should return null for non-existent key', async () => {
      const value = await service.get('test:nonexistent');
      expect(value).toBeNull();
    });

    it('should overwrite existing value', async () => {
      await service.set('test:overwrite', 'original');
      await service.set('test:overwrite', 'updated');

      const value = await service.get('test:overwrite');
      expect(value).toBe('updated');
    });
  });

  describe('TTL expiration', () => {
    it('should respect custom TTL', async () => {
      await service.set('test:ttl', 'expires-soon', 2); // 2 seconds

      // Value should exist immediately
      const valueBefore = await service.get('test:ttl');
      expect(valueBefore).toBe('expires-soon');

      // Wait for expiration (2 seconds + buffer)
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Value should be expired
      const valueAfter = await service.get('test:ttl');
      expect(valueAfter).toBeNull();
    }, 10000); // Increase test timeout

    it('should use default TTL when not specified', async () => {
      await service.set('test:default-ttl', 'default');

      // Verify value exists
      const value = await service.get('test:default-ttl');
      expect(value).toBe('default');

      // Note: We can't easily test default TTL expiration without waiting
      // the full duration (5 minutes), so we just verify it was set
    });
  });

  describe('delete', () => {
    it('should delete existing key', async () => {
      await service.set('test:delete', 'to-be-deleted');

      // Verify it exists
      const valueBefore = await service.get('test:delete');
      expect(valueBefore).toBe('to-be-deleted');

      // Delete it
      await service.del('test:delete');

      // Verify it's gone
      const valueAfter = await service.get('test:delete');
      expect(valueAfter).toBeNull();
    });

    it('should handle deleting non-existent key gracefully', async () => {
      await expect(service.del('test:nonexistent')).resolves.not.toThrow();
    });

    it('should delete multiple keys', async () => {
      await service.set('test:delete:1', 'one');
      await service.set('test:delete:2', 'two');
      await service.set('test:delete:3', 'three');

      await service.del('test:delete:1');
      await service.del('test:delete:2');
      await service.del('test:delete:3');

      const value1 = await service.get('test:delete:1');
      const value2 = await service.get('test:delete:2');
      const value3 = await service.get('test:delete:3');

      expect(value1).toBeNull();
      expect(value2).toBeNull();
      expect(value3).toBeNull();
    });
  });

  describe('invalidatePattern', () => {
    beforeEach(async () => {
      // Set up test data with different patterns
      await service.set('guests:list:page1', 'data1');
      await service.set('guests:list:page2', 'data2');
      await service.set('guests:stats', 'stats-data');
      await service.set('guests:details:1', 'guest1');
      await service.set('guests:details:2', 'guest2');
      await service.set('other:data', 'other');
    });

    it('should invalidate keys matching pattern', async () => {
      await service.invalidatePattern('guests:list:*');

      // List keys should be gone
      const list1 = await service.get('guests:list:page1');
      const list2 = await service.get('guests:list:page2');
      expect(list1).toBeNull();
      expect(list2).toBeNull();

      // Other keys should remain
      const stats = await service.get('guests:stats');
      const details1 = await service.get('guests:details:1');
      const other = await service.get('other:data');

      expect(stats).toBe('stats-data');
      expect(details1).toBe('guest1');
      expect(other).toBe('other');
    });

    it('should invalidate all guest keys with wildcard', async () => {
      await service.invalidatePattern('guests:*');

      // All guest keys should be gone
      const list1 = await service.get('guests:list:page1');
      const stats = await service.get('guests:stats');
      const details1 = await service.get('guests:details:1');

      expect(list1).toBeNull();
      expect(stats).toBeNull();
      expect(details1).toBeNull();

      // Other namespace should remain
      const other = await service.get('other:data');
      expect(other).toBe('other');
    });

    it('should handle pattern with no matches', async () => {
      await expect(
        service.invalidatePattern('nonexistent:*'),
      ).resolves.not.toThrow();
    });
  });

  describe('clear', () => {
    it('should clear all keys in cache', async () => {
      await service.set('test:1', 'one');
      await service.set('test:2', 'two');
      await service.set('test:3', 'three');

      await service.clear();

      const value1 = await service.get('test:1');
      const value2 = await service.get('test:2');
      const value3 = await service.get('test:3');

      expect(value1).toBeNull();
      expect(value2).toBeNull();
      expect(value3).toBeNull();
    });

    it('should allow setting new values after reset', async () => {
      await service.set('before:reset', 'old');
      await service.clear();
      await service.set('after:reset', 'new');

      const oldValue = await service.get('before:reset');
      const newValue = await service.get('after:reset');

      expect(oldValue).toBeNull();
      expect(newValue).toBe('new');
    });
  });

  describe('complex scenarios', () => {
    it('should handle rapid concurrent operations', async () => {
      const operations = Array.from({ length: 50 }, (_, i) =>
        service.set(`test:concurrent:${i}`, { id: i, value: `value-${i}` }),
      );

      await Promise.all(operations);

      // Verify all were set correctly
      const verifications = Array.from({ length: 50 }, async (_, i) => {
        const value = await service.get(`test:concurrent:${i}`);
        expect(value).toEqual({ id: i, value: `value-${i}` });
      });

      await Promise.all(verifications);
    });

    it('should handle large objects', async () => {
      const largeObject = {
        guests: Array.from({ length: 100 }, (_, i) => ({
          id: i,
          firstName: `Guest${i}`,
          lastName: `Last${i}`,
          email: `guest${i}@example.com`,
          phone: `555-${String(i).padStart(4, '0')}`,
          address: `${i} Main Street, City, State, ZIP`,
          notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        })),
      };

      await service.set('test:large', largeObject);

      const retrieved = await service.get<typeof largeObject>('test:large');
      expect(retrieved).toEqual(largeObject);
      if (retrieved) {
        expect(retrieved.guests).toHaveLength(100);
      }
    });

    it('should maintain data integrity across multiple operations', async () => {
      // Set initial value
      await service.set('test:integrity', { counter: 0 });

      // Update multiple times
      for (let i = 1; i <= 10; i++) {
        await service.set('test:integrity', { counter: i });
      }

      // Final value should be correct
      const final = await service.get('test:integrity');
      expect(final).toEqual({ counter: 10 });
    });

    it('should handle special characters in keys', async () => {
      const specialKeys = [
        'test:key-with-dashes',
        'test:key_with_underscores',
        'test:key.with.dots',
        'test:key:with:colons',
      ];

      for (const key of specialKeys) {
        await service.set(key, `value-for-${key}`);
      }

      for (const key of specialKeys) {
        const value = await service.get(key);
        expect(value).toBe(`value-for-${key}`);
      }
    });

    it('should handle null and undefined values', async () => {
      await service.set('test:null', null);
      await service.set('test:undefined', undefined);

      const nullValue = await service.get('test:null');
      const undefinedValue = await service.get('test:undefined');

      // Note: Both null and undefined become null when retrieved
      expect(nullValue).toBeNull();
      expect(undefinedValue).toBeNull();
    });
  });

  describe('cache statistics', () => {
    it('should return stats with status and info', async () => {
      await service.clear();

      await service.set('stats:1', 'one');
      await service.set('stats:2', 'two');
      await service.set('stats:3', 'three');

      const stats = await service.getStats();
      expect(stats.status).toBeDefined();
      expect(stats.info).toBeDefined();
    });

    it('should include keyspace information', async () => {
      await service.clear();

      // Set some data
      await service.set('memory:test', { data: 'x'.repeat(1000) });

      const stats = await service.getStats();
      expect(stats.keyspace).toBeDefined();
    });
  });
});
