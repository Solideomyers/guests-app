# 🧪 Fase 3.4 - Testing Suite Implementation

> **Fecha de Inicio:** 20 de Octubre, 2025  
> **Estimación:** 1 semana (5-7 días)  
> **Prioridad:** Alta  
> **Estado:** 🟡 En progreso

---

## 📋 Tabla de Contenidos

- [Objetivos](#-objetivos)
- [Estrategia de Testing](#-estrategia-de-testing)
- [Plan de Implementación](#-plan-de-implementación)
- [Configuración](#-configuración)
- [Estructura de Tests](#-estructura-de-tests)
- [Métricas de Éxito](#-métricas-de-éxito)

---

## 🎯 Objetivos

### Objetivos Principales
1. ✅ **Coverage > 70%** en Backend y Frontend
2. ✅ **Zero Regressions** - Prevenir bugs en producción
3. ✅ **CI/CD Ready** - Tests automatizados en pipeline
4. ✅ **Documentación viva** - Tests como especificación

### Alcance
- **Backend:** Unit tests + Integration tests + E2E tests
- **Frontend:** Component tests + Hook tests + Integration tests
- **API:** Contract testing entre Frontend ↔ Backend

---

## 🧪 Estrategia de Testing

### Testing Pyramid

```
        ┌─────────────────┐
        │   E2E Tests     │  10% - Flujos completos
        │   (Supertest)   │
        ├─────────────────┤
        │ Integration     │  30% - Módulos + DB
        │   Tests         │
        ├─────────────────┤
        │  Unit Tests     │  60% - Funciones aisladas
        └─────────────────┘
```

### Coverage Targets

| Capa | Objetivo | Prioridad |
|------|----------|-----------|
| **Backend Services** | > 80% | 🔴 Crítico |
| **Backend Controllers** | > 70% | 🔴 Crítico |
| **Frontend Components** | > 70% | 🟡 Alta |
| **Frontend Hooks** | > 80% | 🔴 Crítico |
| **API Integration** | 100% | 🔴 Crítico |

---

## 🚀 Plan de Implementación

### **Día 1-2: Backend Unit Tests** ⏱️ 16 horas

#### Setup Jest + Configuración
```bash
cd backend
npm install --save-dev @types/jest ts-jest @nestjs/testing
```

#### Tests a Implementar

##### **guests.service.spec.ts** (Alta prioridad)
```typescript
describe('GuestsService', () => {
  // CRUD Operations
  ✅ should create a guest with valid data
  ✅ should throw error with invalid data
  ✅ should find all guests with pagination
  ✅ should find one guest by id
  ✅ should update guest successfully
  ✅ should soft delete guest
  ✅ should not find deleted guests by default
  
  // Business Logic
  ✅ should calculate stats correctly
  ✅ should filter by status
  ✅ should filter by isPastor
  ✅ should search by name
  ✅ should search by church
  ✅ should search by city
  
  // Bulk Operations
  ✅ should bulk update multiple guests
  ✅ should bulk delete multiple guests
  ✅ should handle bulk operation errors
  
  // Edge Cases
  ✅ should handle empty database
  ✅ should handle duplicate phone numbers
  ✅ should trim whitespace in names
})
```

##### **cache.service.spec.ts** (Media prioridad)
```typescript
describe('CacheService', () => {
  ✅ should set and get cache value
  ✅ should return null for missing keys
  ✅ should invalidate cache
  ✅ should handle TTL expiration
  ✅ should invalidate pattern matching keys
})
```

##### **exports.service.spec.ts** (Media prioridad)
```typescript
describe('ExportsService', () => {
  ✅ should generate CSV correctly
  ✅ should generate PDF correctly
  ✅ should include all fields in export
  ✅ should filter exported data
  ✅ should handle empty datasets
})
```

#### Mocking Strategy
```typescript
// Mock Prisma Client
const mockPrismaService = {
  guest: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    aggregate: jest.fn(),
  },
  guestHistory: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
};

// Mock Redis Cache
const mockCacheService = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  reset: jest.fn(),
};
```

---

### **Día 2-3: Backend Integration Tests** ⏱️ 16 horas

#### Setup Database de Testing
```typescript
// test/setup.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_TEST, // DB separada para tests
    },
  },
});

beforeAll(async () => {
  await prisma.$executeRawUnsafe('DROP SCHEMA public CASCADE');
  await prisma.$executeRawUnsafe('CREATE SCHEMA public');
  // Run migrations
});

afterAll(async () => {
  await prisma.$disconnect();
});
```

#### Integration Tests

##### **guests.integration.spec.ts**
```typescript
describe('Guests Module Integration', () => {
  // Service + Prisma
  ✅ should create guest and store in DB
  ✅ should create history entry on update
  ✅ should soft delete without removing from DB
  ✅ should restore soft-deleted guest
  
  // Service + Cache
  ✅ should cache findAll results
  ✅ should invalidate cache on create
  ✅ should invalidate cache on update
  ✅ should invalidate cache on delete
  
  // Complex Queries
  ✅ should filter with multiple conditions
  ✅ should paginate correctly
  ✅ should sort by different fields
})
```

---

### **Día 3-4: Backend E2E Tests** ⏱️ 16 horas

#### Setup Supertest
```bash
npm install --save-dev supertest @types/supertest
```

#### E2E Tests

##### **guests.e2e-spec.ts**
```typescript
describe('Guests API (e2e)', () => {
  let app: INestApplication;
  
  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    
    app = moduleFixture.createNestApplication();
    await app.init();
  });
  
  // CRUD Endpoints
  ✅ GET /guests - should return paginated list
  ✅ GET /guests/:id - should return single guest
  ✅ POST /guests - should create guest
  ✅ PATCH /guests/:id - should update guest
  ✅ DELETE /guests/:id - should soft delete guest
  
  // Query Parameters
  ✅ GET /guests?search=... - should filter by search
  ✅ GET /guests?status=... - should filter by status
  ✅ GET /guests?isPastor=true - should filter pastors
  ✅ GET /guests?page=2&limit=10 - should paginate
  
  // Stats Endpoint
  ✅ GET /guests/stats - should return correct counts
  
  // Bulk Operations
  ✅ POST /guests/bulk-update - should update multiple
  ✅ POST /guests/bulk-delete - should delete multiple
  
  // Export Endpoints
  ✅ POST /export/csv - should return CSV file
  ✅ POST /export/pdf - should return PDF file
  
  // Error Handling
  ✅ should return 404 for non-existent guest
  ✅ should return 400 for invalid data
  ✅ should return 422 for validation errors
  
  // Rate Limiting
  ✅ should enforce rate limits
  
  afterAll(async () => {
    await app.close();
  });
})
```

---

### **Día 4-5: Frontend Component Tests** ⏱️ 16 hours

#### Setup Vitest + Testing Library
```bash
cd frontend
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

#### Configuración Vitest
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts',
      ],
    },
  },
});
```

#### Component Tests

##### **GuestTable.test.tsx**
```typescript
describe('GuestTable', () => {
  ✅ should render loading skeleton while fetching
  ✅ should render guests when loaded
  ✅ should display empty state when no guests
  ✅ should select individual guest on checkbox
  ✅ should select all guests on header checkbox
  ✅ should open edit modal on edit button
  ✅ should open delete dialog on delete button
  ✅ should show correct status badge colors
  ✅ should render avatar with initials
  ✅ should scroll horizontally on mobile
})
```

##### **AddGuestModal.test.tsx**
```typescript
describe('AddGuestModal', () => {
  ✅ should render form fields
  ✅ should validate required fields
  ✅ should show real-time validation errors
  ✅ should prevent submit with invalid data
  ✅ should show preview on valid submit
  ✅ should allow editing from preview
  ✅ should submit data on confirm
  ✅ should reset form on cancel
  ✅ should close modal on successful submit
  ✅ should show toast on success/error
})
```

##### **SearchBar.test.tsx**
```typescript
describe('SearchBar', () => {
  ✅ should render input with placeholder
  ✅ should debounce search input
  ✅ should call onSearch after debounce
  ✅ should clear search on X button
  ✅ should focus on Ctrl+F shortcut
})
```

##### **StatsCard.test.tsx**
```typescript
describe('StatsCard', () => {
  ✅ should render title and value
  ✅ should render icon
  ✅ should format large numbers
  ✅ should show loading skeleton
  ✅ should render correct theme colors
})
```

---

### **Día 5-6: Frontend Hook Tests** ⏱️ 16 horas

#### Hook Tests

##### **useGuests.test.ts**
```typescript
describe('useGuests', () => {
  ✅ should fetch guests on mount
  ✅ should refetch on filter change
  ✅ should cache results
  ✅ should handle pagination
  ✅ should handle search debounce
  ✅ should show error state on failure
  ✅ should retry on network error
})
```

##### **useCreateGuest.test.ts**
```typescript
describe('useCreateGuest', () => {
  ✅ should create guest optimistically
  ✅ should invalidate cache on success
  ✅ should rollback on error
  ✅ should show toast notification
  ✅ should handle validation errors
})
```

##### **useBulkOperations.test.ts**
```typescript
describe('useBulkOperations', () => {
  ✅ should update multiple guests
  ✅ should delete multiple guests
  ✅ should handle partial failures
  ✅ should invalidate cache after bulk ops
})
```

---

### **Día 6-7: Coverage Analysis + Fixes** ⏱️ 16 horas

#### Generar Reportes
```bash
# Backend
cd backend
npm run test:cov

# Frontend
cd frontend
npm run test:coverage
```

#### Análisis de Coverage
1. Identificar archivos con coverage < 70%
2. Agregar tests faltantes
3. Refactorizar código no testeable
4. Eliminar dead code

#### CI/CD Pipeline (GitHub Actions)
```yaml
# .github/workflows/tests.yml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies
        run: cd backend && npm ci
      - name: Run tests
        run: cd backend && npm run test:cov
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        
  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies
        run: cd frontend && npm ci
      - name: Run tests
        run: cd frontend && npm run test:coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## 📁 Estructura de Tests

### Backend
```
backend/
├── src/
│   └── guests/
│       ├── guests.service.spec.ts       # Unit tests
│       ├── guests.controller.spec.ts    # Unit tests
│       └── guests.integration.spec.ts   # Integration tests
├── test/
│   ├── setup.ts                         # Test utilities
│   ├── mocks/                           # Mock factories
│   │   ├── prisma.mock.ts
│   │   ├── cache.mock.ts
│   │   └── guest.factory.ts
│   ├── guests.e2e-spec.ts              # E2E tests
│   └── app.e2e-spec.ts                 # E2E tests
└── jest.config.js
```

### Frontend
```
frontend/
├── src/
│   ├── components/
│   │   ├── GuestTable.test.tsx
│   │   ├── AddGuestModal.test.tsx
│   │   ├── SearchBar.test.tsx
│   │   └── StatsCard.test.tsx
│   ├── hooks/
│   │   ├── useGuests.test.ts
│   │   ├── useCreateGuest.test.ts
│   │   └── useBulkOperations.test.ts
│   └── test/
│       ├── setup.ts                     # Test utilities
│       ├── mocks/                       # MSW handlers
│       │   ├── handlers.ts
│       │   └── server.ts
│       └── utils/
│           └── test-utils.tsx           # Custom render
└── vitest.config.ts
```

---

## 📊 Métricas de Éxito

### Coverage Goals

| Módulo | Statements | Branches | Functions | Lines |
|--------|-----------|----------|-----------|-------|
| **Backend/Services** | > 80% | > 75% | > 80% | > 80% |
| **Backend/Controllers** | > 70% | > 65% | > 70% | > 70% |
| **Frontend/Components** | > 70% | > 60% | > 70% | > 70% |
| **Frontend/Hooks** | > 80% | > 75% | > 80% | > 80% |
| **TOTAL BACKEND** | > 75% | > 70% | > 75% | > 75% |
| **TOTAL FRONTEND** | > 70% | > 65% | > 70% | > 70% |

### Performance Targets

| Métrica | Objetivo |
|---------|----------|
| **Test Suite Run Time** | < 2 minutos (Backend + Frontend) |
| **E2E Tests** | < 30 segundos |
| **Unit Tests** | < 10 segundos |
| **Coverage Report Generation** | < 5 segundos |

### Quality Gates

- ✅ All tests must pass
- ✅ No skipped tests in main branch
- ✅ No console errors/warnings during tests
- ✅ Coverage thresholds enforced in CI/CD
- ✅ Zero flaky tests (100% reproducible)

---

## 🔧 Herramientas y Librerías

### Backend Testing Stack
```json
{
  "jest": "^29.7.0",
  "@nestjs/testing": "^10.3.0",
  "supertest": "^6.3.4",
  "@types/supertest": "^6.0.2",
  "ts-jest": "^29.1.2"
}
```

### Frontend Testing Stack
```json
{
  "vitest": "^1.2.1",
  "@testing-library/react": "^14.1.2",
  "@testing-library/jest-dom": "^6.2.0",
  "@testing-library/user-event": "^14.5.2",
  "jsdom": "^23.2.0",
  "msw": "^2.0.11"
}
```

---

## 📝 Comandos de Testing

### Backend
```bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm run test:cov

# E2E only
npm run test:e2e

# Specific file
npm test -- guests.service.spec.ts

# Debug
npm test -- --detectOpenHandles --forceExit
```

### Frontend
```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# UI mode
npm run test:ui

# Specific file
npm run test -- GuestTable.test.tsx
```

---

## ✅ Checklist de Implementación

### Día 1-2: Backend Unit Tests
- [ ] Configurar Jest + @nestjs/testing
- [ ] Crear mocks de Prisma y Redis
- [ ] Implementar tests de GuestsService
- [ ] Implementar tests de CacheService
- [ ] Implementar tests de ExportsService
- [ ] Coverage > 80% en services

### Día 2-3: Backend Integration Tests
- [ ] Configurar DB de testing
- [ ] Tests de Service + Prisma
- [ ] Tests de Service + Cache
- [ ] Tests de queries complejas
- [ ] Validar transacciones DB

### Día 3-4: Backend E2E Tests
- [ ] Configurar Supertest
- [ ] Tests de CRUD endpoints
- [ ] Tests de filtros y búsqueda
- [ ] Tests de bulk operations
- [ ] Tests de exports
- [ ] Tests de error handling
- [ ] Tests de rate limiting

### Día 4-5: Frontend Component Tests
- [ ] Configurar Vitest + Testing Library
- [ ] Tests de GuestTable
- [ ] Tests de AddGuestModal
- [ ] Tests de SearchBar
- [ ] Tests de StatsCard
- [ ] Tests de otros componentes clave
- [ ] Coverage > 70% en components

### Día 5-6: Frontend Hook Tests
- [ ] Setup MSW para mocking API
- [ ] Tests de useGuests
- [ ] Tests de useCreateGuest
- [ ] Tests de useUpdateGuest
- [ ] Tests de useDeleteGuest
- [ ] Tests de useBulkOperations
- [ ] Coverage > 80% en hooks

### Día 6-7: Coverage + CI/CD
- [ ] Generar reportes de coverage
- [ ] Identificar gaps de coverage
- [ ] Agregar tests faltantes
- [ ] Configurar GitHub Actions
- [ ] Configurar Codecov
- [ ] Documentar proceso de testing
- [ ] Validar thresholds en CI

---

## 🎯 Próximos Pasos Después de Testing

Una vez completada esta fase:
1. ✅ Fase 4.2 - HTTPS Configuration (3 días)
2. ✅ Fase 4.4 - Deployment (1 semana)
3. ✅ Monitoring + Logging setup
4. ✅ Production launch 🚀

---

**Última actualización:** 20 de Octubre, 2025  
**Mantenido por:** @Solideomyers  
**Estado:** 🟡 En progreso
