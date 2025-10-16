# Cache Module - Redis Implementation

## Descripción
Este módulo implementa un sistema de caché distribuido usando Redis para mejorar el rendimiento de la API, reduciendo la carga en la base de datos y mejorando los tiempos de respuesta.

## Arquitectura

### Componentes

1. **CacheService** - Servicio principal para operaciones de cache
2. **CacheInterceptor** - Interceptor que cachea automáticamente respuestas GET
3. **CacheConfig** - Configuración de TTL y patrones de claves

### Flujo de Datos

```
┌─────────────────────────────────────────────────┐
│              Request GET /api/v1/guests         │
└───────────────────┬─────────────────────────────┘
                    │
                    ↓
         ┌──────────────────────┐
         │  CacheInterceptor    │
         └──────────┬───────────┘
                    │
                    ↓
         ┌──────────────────────┐
         │   Generate Cache Key │
         │   cache:/api/.../... │
         └──────────┬───────────┘
                    │
            ┌───────┴────────┐
            │                │
            ↓                ↓
    ┌──────────────┐  ┌──────────────┐
    │  Cache HIT   │  │  Cache MISS  │
    │  Return data │  │  Execute DB  │
    └──────────────┘  └──────┬───────┘
                             │
                             ↓
                    ┌─────────────────┐
                    │  Store in Cache │
                    │  Return data    │
                    └─────────────────┘
```

## Características

### ✅ Cache Automático
- **GET requests** se cachean automáticamente
- **TTL por defecto:** 5 minutos (configurable)
- **Generación de claves:** Basada en URL + query params

### ✅ Invalidación Inteligente
- **CREATE** - Invalida lista de invitados
- **UPDATE** - Invalida lista y detalle del invitado
- **DELETE** - Invalida lista y detalle del invitado
- **Bulk Operations** - Invalida cache completo de guests

### ✅ Estrategias de TTL

| Tipo de Dato | TTL | Razón |
|--------------|-----|-------|
| Lista de invitados | 5 min | Alta frecuencia de cambios |
| Detalle de invitado | 10 min | Cambios menos frecuentes |
| Estadísticas | 3 min | Requiere datos actualizados |
| Historial | 5 min | Cambios moderados |

## Configuración

### Variables de Entorno

```env
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Cache Settings
CACHE_TTL=300           # Default TTL in seconds (5 minutes)
CACHE_MAX_ITEMS=100     # Not implemented yet
```

### Docker Compose

```yaml
version: '3.8'

services:
  redis:
    image: redis:7-alpine
    container_name: guests-redis
    ports:
      - '6379:6379'
    volumes:
      - redis-data:/data
    restart: unless-stopped

volumes:
  redis-data:
```

**Iniciar Redis:**
```bash
docker-compose up -d
```

## API del CacheService

### Métodos Disponibles

#### 1. `get<T>(key: string): Promise<T | null>`
Obtiene un valor del cache.

```typescript
const guests = await this.cacheService.get<Guest[]>('cache:/api/v1/guests');
```

#### 2. `set(key: string, value: any, ttl?: number): Promise<void>`
Guarda un valor en el cache con TTL opcional.

```typescript
await this.cacheService.set('cache:/api/v1/guests', guests, 300);
```

#### 3. `del(key: string): Promise<void>`
Elimina una clave específica del cache.

```typescript
await this.cacheService.del('cache:/api/v1/guests:123');
```

#### 4. `invalidatePattern(pattern: string): Promise<void>`
Invalida todas las claves que coincidan con un patrón.

```typescript
await this.cacheService.invalidatePattern('cache:/api/v1/guests*');
```

#### 5. `clear(): Promise<void>`
Limpia todo el cache (usar con precaución).

```typescript
await this.cacheService.clear();
```

#### 6. `isConnected(): boolean`
Verifica si Redis está conectado.

```typescript
const connected = this.cacheService.isConnected();
```

#### 7. `getStats(): Promise<any>`
Obtiene estadísticas de Redis.

```typescript
const stats = await this.cacheService.getStats();
```

## Uso en Controladores

### Aplicar Interceptor

```typescript
import { UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '../cache/cache.interceptor';

@Controller('guests')
@UseInterceptors(CacheInterceptor)  // ✅ Aplica cache a todos los GET
export class GuestsController {
  // ...
}
```

### Invalidar Cache en Servicios

```typescript
import { CacheService } from '../cache/cache.service';

@Injectable()
export class GuestsService {
  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
  ) {}

  async create(createGuestDto: CreateGuestDto) {
    const guest = await this.prisma.guest.create({
      data: createGuestDto,
    });

    // Invalidar cache después de modificar datos
    await this.cacheService.invalidatePattern('cache:/api/v1/guests*');

    return guest;
  }
}
```

## Patrones de Claves

### Formato
```
cache:<url>:<query-params-json>
```

### Ejemplos
```
cache:/api/v1/guests:{}
cache:/api/v1/guests:{"page":1,"limit":10}
cache:/api/v1/guests:{"status":"CONFIRMED"}
cache:/api/v1/guests/stats:{}
cache:/api/v1/guests/123:{}
```

## Monitoreo

### Logs del Sistema

#### Cache HIT (Éxito)
```
🎯 Cache HIT: cache:/api/v1/guests:{"page":1,"limit":10}
```

#### Cache MISS (Fallo)
```
❌ Cache MISS: cache:/api/v1/guests:{"page":1,"limit":10}
```

#### Invalidación
```
🗑️  Invalidated 5 cache keys matching: cache:/api/v1/guests*
```

#### Conexión
```
✅ Redis connected successfully
```

#### Error
```
❌ Redis connection error: ECONNREFUSED
```

### Verificar Estado con Redis CLI

```bash
# Conectar a Redis
docker exec -it guests-redis redis-cli

# Ver todas las claves
KEYS *

# Ver valor de una clave
GET "cache:/api/v1/guests:{}"

# Ver TTL de una clave
TTL "cache:/api/v1/guests:{}"

# Número total de claves
DBSIZE

# Limpiar toda la DB
FLUSHDB
```

## Rendimiento

### Mejoras Esperadas

| Métrica | Sin Cache | Con Cache | Mejora |
|---------|-----------|-----------|--------|
| Tiempo de respuesta (lista) | 200-500ms | 5-20ms | **90-95%** |
| Consultas a DB | 100% | 5-10% | **90-95%** |
| Throughput (req/s) | ~100 | ~1000+ | **10x** |

### Escenarios de Uso

#### ✅ Ideal para Cache
- Listados con paginación
- Estadísticas generales
- Detalles de invitados que no cambian frecuentemente
- Historial de auditoría

#### ⚠️ No usar Cache
- Exportaciones (datos en tiempo real)
- Operaciones de escritura (POST, PATCH, DELETE)
- Datos sensibles o personalizados por usuario

## Estrategias de Optimización

### 1. **Warming (Precalentamiento)**
```typescript
// Precalentar cache al iniciar
async onModuleInit() {
  const guests = await this.guestsService.findAll({ page: 1, limit: 10 });
  await this.cacheService.set('cache:/api/v1/guests:{"page":1,"limit":10}', guests);
}
```

### 2. **Cache Aside Pattern** (Implementado)
```
1. Check cache
2. If HIT → return
3. If MISS → query DB
4. Store in cache
5. Return data
```

### 3. **Write-Through Pattern** (Implementado)
```
1. Write to DB
2. Invalidate cache
3. Next read will refresh cache
```

## Troubleshooting

### Problema: Redis no conecta

**Solución:**
```bash
# Verificar que Redis esté corriendo
docker ps | grep redis

# Si no está corriendo
docker-compose up -d

# Ver logs
docker logs guests-redis
```

### Problema: Cache no se invalida

**Solución:**
```bash
# Limpiar cache manualmente
docker exec -it guests-redis redis-cli FLUSHDB

# Reiniciar backend
npm run start:dev
```

### Problema: Datos obsoletos en cache

**Solución:**
1. Reducir TTL en `.env`
2. Verificar que `invalidateGuestsCache()` se llame después de mutaciones
3. Limpiar cache manualmente si es necesario

## Testing

### Unit Tests

```typescript
describe('CacheService', () => {
  it('should get value from cache', async () => {
    await cacheService.set('test-key', { name: 'John' });
    const result = await cacheService.get('test-key');
    expect(result).toEqual({ name: 'John' });
  });

  it('should invalidate pattern', async () => {
    await cacheService.set('users:1', { id: 1 });
    await cacheService.set('users:2', { id: 2 });
    await cacheService.invalidatePattern('users:*');
    
    const result = await cacheService.get('users:1');
    expect(result).toBeNull();
  });
});
```

## Roadmap

### 🔄 Próximas Mejoras
- [ ] Rate limiting por IP
- [ ] Cache warming automático
- [ ] Métricas de hit/miss ratio
- [ ] Dashboard de monitoreo
- [ ] Compresión de valores grandes
- [ ] Soporte para múltiples DBs de Redis
- [ ] Cache por usuario (cuando se implemente autenticación)

---

## Recursos

- [Redis Documentation](https://redis.io/docs/)
- [ioredis GitHub](https://github.com/redis/ioredis)
- [NestJS Caching](https://docs.nestjs.com/techniques/caching)
