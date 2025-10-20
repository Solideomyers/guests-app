import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private redisClient: Redis;
  private defaultTTL: number;

  constructor(private configService: ConfigService) {
    this.defaultTTL = this.configService.get<number>('CACHE_TTL', 300); // 5 minutes default
  }

  async onModuleInit() {
    const host = this.configService.get<string>('REDIS_HOST', 'localhost');
    const port = this.configService.get<number>('REDIS_PORT', 6379);
    const password = this.configService.get<string>('REDIS_PASSWORD');
    const db = this.configService.get<number>('REDIS_DB', 0);

    this.redisClient = new Redis({
      host,
      port,
      password: password || undefined,
      db,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
    });

    this.redisClient.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });

    this.redisClient.on('error', (err) => {
      console.error('❌ Redis connection error:', err.message);
    });
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redisClient.get(key);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Cache GET error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set value in cache with optional TTL
   */
  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      const ttlSeconds = ttl || this.defaultTTL;
      await this.redisClient.setex(key, ttlSeconds, serialized);
    } catch (error) {
      console.error(`Cache SET error for key ${key}:`, error);
    }
  }

  /**
   * Delete specific key from cache
   */
  async del(key: string): Promise<void> {
    try {
      await this.redisClient.del(key);
    } catch (error) {
      console.error(`Cache DEL error for key ${key}:`, error);
    }
  }

  /**
   * Delete all keys matching a pattern
   */
  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redisClient.keys(pattern);
      if (keys.length > 0) {
        await this.redisClient.del(...keys);
        console.log(
          `🗑️  Invalidated ${keys.length} cache keys matching: ${pattern}`,
        );
      }
    } catch (error) {
      console.error(`Cache invalidation error for pattern ${pattern}:`, error);
    }
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    try {
      await this.redisClient.flushdb();
      console.log('🗑️  All cache cleared');
    } catch (error) {
      console.error('Cache CLEAR error:', error);
    }
  }

  /**
   * Check if Redis is connected
   */
  isConnected(): boolean {
    return this.redisClient.status === 'ready';
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<any> {
    try {
      const info = await this.redisClient.info('stats');
      const keyspace = await this.redisClient.info('keyspace');
      return {
        status: this.redisClient.status,
        info,
        keyspace,
      };
    } catch (error) {
      console.error('Cache STATS error:', error);
      return null;
    }
  }
}
