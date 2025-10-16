import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from './cache.service';

/**
 * Cache Interceptor
 * Automatically caches GET requests and returns cached responses when available
 */
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(private cacheService: CacheService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;

    // Only cache GET requests
    if (method !== 'GET') {
      return next.handle();
    }

    // Generate cache key from URL and query params
    const cacheKey = this.generateCacheKey(request);

    // Try to get from cache
    const cachedResponse = await this.cacheService.get(cacheKey);

    if (cachedResponse) {
      console.log(`🎯 Cache HIT: ${cacheKey}`);
      return of(cachedResponse);
    }

    console.log(`❌ Cache MISS: ${cacheKey}`);

    // If not in cache, execute the request and cache the response
    return next.handle().pipe(
      tap(async (response) => {
        // Only cache successful responses
        if (response) {
          await this.cacheService.set(cacheKey, response);
        }
      }),
    );
  }

  /**
   * Generate a unique cache key based on request URL and query parameters
   */
  private generateCacheKey(request: any): string {
    const url = request.url;
    const queryString = JSON.stringify(request.query);
    return `cache:${url}:${queryString}`;
  }
}
