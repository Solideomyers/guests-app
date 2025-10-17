# Best Practices Applied

## Frontend API Client Configuration

### ❌ Anti-Pattern: Cache-Busting Timestamps
**Previous implementation (removed):**
```typescript
// DON'T: Add timestamps to every request
config.params._t = Date.now();
```

**Why this is bad:**
- Defeats HTTP caching mechanisms
- Increases server load unnecessarily
- Pollutes query parameters
- Modern browsers handle caching correctly with proper Cache-Control headers

### ✅ Best Practice: Rely on HTTP Cache Headers
**Current implementation:**
```typescript
// Let browsers and servers handle caching naturally
// No artificial cache-busting needed
```

**Benefits:**
- Respects HTTP standards (RFC 7234)
- Server controls caching via Cache-Control headers
- Reduces unnecessary API calls
- Cleaner URLs and logs

---

## Backend Validation Configuration

### ✅ Best Practice: Strict DTO Validation
**Configuration:**
```typescript
new ValidationPipe({
  whitelist: true,           // Strip properties not in DTO
  forbidNonWhitelisted: true, // Reject requests with unknown properties
  transform: true,            // Auto-transform to DTO types
  transformOptions: {
    enableImplicitConversion: true,
  },
})
```

**Benefits:**
- **Security**: Prevents injection of unexpected fields
- **Data Integrity**: Only validated data reaches the service layer
- **API Contract**: Enforces strict API contracts
- **Type Safety**: Automatic type conversion and validation

---

## Cache Strategy

### Backend Cache Configuration
**Using Redis with TTL-based invalidation:**
```typescript
// Cache interceptor with 5-minute TTL
@UseInterceptors(CacheInterceptor)
```

**Cache invalidation triggers:**
- POST /guests (create) → Invalidate list + stats
- PATCH /guests/:id (update) → Invalidate detail + list + stats
- DELETE /guests/:id (delete) → Invalidate detail + list + stats
- Bulk operations → Invalidate list + stats

### Frontend Cache Configuration
**Using TanStack Query:**
```typescript
{
  staleTime: 60000,        // Consider data fresh for 1 minute
  gcTime: 300000,          // Keep in cache for 5 minutes
  refetchOnWindowFocus: true,  // Refresh when user returns
}
```

---

## Why These Choices Matter

### 1. **No Timestamp Parameters**
Modern HTTP caching is sophisticated. Adding `_t` parameters:
- Bypasses browser cache (defeats the purpose of caching)
- Increases backend load
- Makes debugging harder
- Violates REST principles

Instead, use:
- `Cache-Control: no-cache` for critical data
- `Cache-Control: max-age=60` for cacheable data
- ETags for conditional requests

### 2. **Strict Validation**
Setting `forbidNonWhitelisted: false` might seem convenient but:
- Opens security vulnerabilities (mass assignment attacks)
- Hides bugs (typos in property names go unnoticed)
- Breaks API contracts silently
- Makes refactoring dangerous

### 3. **Layered Caching Strategy**
```
Browser Cache (60s) → TanStack Query Cache (5min) → Redis Cache (5min) → Database
```

Each layer serves a purpose:
- **Browser**: Instant UI, no network
- **TanStack Query**: Optimistic updates, background refetch
- **Redis**: Reduce DB load, fast response
- **Database**: Source of truth

---

## Testing Cache Behavior

### Verify Cache Headers
```bash
# Check response headers
curl -I http://localhost:3000/api/v1/guests

# Should include:
Cache-Control: no-cache, no-store, must-revalidate
```

### Monitor Cache Performance
```bash
# Backend logs show cache hits/misses
✅ Cache HIT: ...
❌ Cache MISS: ...
```

### TanStack Query DevTools
```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// In development, view cache state
<ReactQueryDevtools initialIsOpen={false} />
```

---

## References

- [HTTP Caching - MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
- [NestJS Validation](https://docs.nestjs.com/techniques/validation)
- [TanStack Query Caching](https://tanstack.com/query/latest/docs/react/guides/caching)
- [REST API Best Practices](https://restfulapi.net/http-methods/)

---

## Migration Notes

### Changes Made (2025-10-17)
1. ✅ Removed `_t` timestamp from API client interceptor
2. ✅ Restored `forbidNonWhitelisted: true` in validation pipe
3. ✅ Documented caching strategy
4. ✅ Following HTTP standards for cache control

### Before
```typescript
// ❌ Anti-pattern
config.params = { _t: Date.now() };
forbidNonWhitelisted: false;
```

### After
```typescript
// ✅ Best practice
// Let HTTP caching work naturally
forbidNonWhitelisted: true;
```

