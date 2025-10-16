# 🎯 Plan de Mejoras Integral - Event Guest Manager

> **Fecha de Creación:** 16 de Octubre, 2025  
> **Versión:** 1.0  
> **Estado:** 🔄 En Planificación

---

## 📑 Tabla de Contenidos

- [Resumen Ejecutivo](#-resumen-ejecutivo)
- [Análisis de Stack Tecnológico](#-análisis-de-stack-tecnológico)
- [Arquitectura Propuesta](#-arquitectura-propuesta)
- [Plan de Implementación](#-plan-de-implementación)
- [Seguimiento de Progreso](#-seguimiento-de-progreso)
- [Dependencias del Proyecto](#-dependencias-del-proyecto)

---

## 🎯 Resumen Ejecutivo

### Objetivo
Transformar la aplicación actual de gestión de invitados en una solución profesional, escalable y con persistencia de datos, manteniendo la simplicidad y usabilidad actual.

### Stack Tecnológico Final

#### Backend
- **Framework:** NestJS 10+
- **Base de Datos:** Neon PostgreSQL (Serverless)
- **ORM:** Prisma
- **Cache:** Redis
- **Validación:** class-validator + class-transformer

#### Frontend
- **Framework:** React 19 (mantener actual)
- **Build Tool:** Vite 6+
- **Estado Global:** Zustand
- **Data Fetching:** TanStack Query (React Query v5)
- **UI Components:** shadcn/ui + TailwindCSS
- **Notificaciones:** Sonner
- **Gráficos:** Recharts

### Tiempo Estimado
**3-4 semanas** (Migración completa)

---

## 🤔 Análisis de Stack Tecnológico

### ¿Por qué NO Astro.js?

#### Consideraciones Críticas
Astro está optimizado para contenido estático y SSR, pero este proyecto es una **aplicación altamente interactiva** con:
- ✗ Estado complejo en tiempo real
- ✗ Operaciones CRUD constantes
- ✗ Interacciones de usuario intensivas (selección múltiple, ordenamiento, filtros)
- ✗ Modales y componentes dinámicos

#### Problemas con Astro para este proyecto
1. **Astro es para contenido**, no apps dinámicas
2. Perderías React DevTools y ecosistema completo
3. Islands architecture complica estado compartido
4. Overhead de aprender nuevo framework sin beneficios reales

### ¿Por qué SÍ este Stack?

| Tecnología | Justificación |
|------------|---------------|
| **NestJS** | ✅ Robusto, escalable, TypeScript-first, modular |
| **Prisma** | ✅ ORM moderno, migraciones fáciles, type-safe |
| **Neon PostgreSQL** | ✅ Serverless, gratis tier generoso, backups automáticos |
| **Redis** | ✅ Cache ultra-rápido, reduce carga de DB |
| **Zustand** | ✅ Más simple que Redux, menos boilerplate |
| **TanStack Query** | ✅ Mejor cache/fetch library del ecosistema React |

---

## 🏗️ Arquitectura Propuesta

### Estructura Backend (NestJS)

```
backend/
├── src/
│   ├── guests/                      # Feature module principal
│   │   ├── guests.controller.ts     # API endpoints
│   │   ├── guests.service.ts        # Lógica de negocio
│   │   ├── guests.module.ts         # Module definition
│   │   ├── dto/                     # Data Transfer Objects
│   │   │   ├── create-guest.dto.ts
│   │   │   ├── update-guest.dto.ts
│   │   │   ├── filter-guest.dto.ts
│   │   │   └── bulk-operation.dto.ts
│   │   └── entities/
│   │       └── guest.entity.ts
│   │
│   ├── cache/                       # Cache module
│   │   ├── cache.service.ts
│   │   ├── cache.module.ts
│   │   └── cache.config.ts
│   │
│   ├── export/                      # Export module
│   │   ├── export.controller.ts
│   │   ├── export.service.ts
│   │   ├── export.module.ts
│   │   └── generators/
│   │       ├── csv.generator.ts
│   │       └── pdf.generator.ts
│   │
│   ├── prisma/                      # Prisma module
│   │   ├── prisma.service.ts
│   │   ├── prisma.module.ts
│   │   └── seeds/
│   │       └── guests.seed.ts
│   │
│   ├── common/                      # Shared utilities
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── interceptors/
│   │   │   ├── cache.interceptor.ts
│   │   │   └── logging.interceptor.ts
│   │   ├── decorators/
│   │   │   └── cache-key.decorator.ts
│   │   └── pipes/
│   │       └── validation.pipe.ts
│   │
│   └── main.ts                      # Bootstrap
│
├── prisma/
│   ├── schema.prisma               # Database schema
│   ├── migrations/                 # Auto-generated migrations
│   └── seed.ts                     # Seed entry point
│
├── test/                           # E2E tests
├── .env.example
├── .env
├── nest-cli.json
├── tsconfig.json
└── package.json
```

### Estructura Frontend (React Optimizado)

```
frontend/  (o mantener src/ en raíz)
├── src/
│   ├── features/                   # Feature-based architecture
│   │   ├── guests/
│   │   │   ├── api/
│   │   │   │   └── guestsApi.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useGuests.ts           # TanStack Query: useQuery
│   │   │   │   ├── useGuestMutations.ts   # TanStack Query: useMutation
│   │   │   │   ├── useGuestFilters.ts     # Filtros y búsqueda
│   │   │   │   └── useGuestSelection.ts   # Selección múltiple
│   │   │   ├── components/
│   │   │   │   ├── GuestTable/
│   │   │   │   │   ├── GuestTable.tsx
│   │   │   │   │   ├── GuestRow.tsx
│   │   │   │   │   └── GuestTableHeader.tsx
│   │   │   │   ├── GuestForm/
│   │   │   │   │   ├── GuestForm.tsx
│   │   │   │   │   └── GuestFormModal.tsx
│   │   │   │   ├── GuestStats/
│   │   │   │   │   ├── StatsCards.tsx
│   │   │   │   │   └── StatsCard.tsx
│   │   │   │   ├── GuestFilters/
│   │   │   │   │   ├── SearchBar.tsx
│   │   │   │   │   ├── StatusFilter.tsx
│   │   │   │   │   └── BulkActionsToolbar.tsx
│   │   │   │   └── GuestExport/
│   │   │   │       └── ExportButtons.tsx
│   │   │   └── store/
│   │   │       └── guestStore.ts          # Zustand store
│   │   │
│   │   └── export/
│   │       ├── api/
│   │       │   └── exportApi.ts
│   │       └── hooks/
│   │           └── useExport.ts
│   │
│   ├── shared/                     # Shared resources
│   │   ├── components/             # Reusable components (shadcn/ui)
│   │   │   ├── ui/                 # shadcn components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   └── ...
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── PageHeader.tsx
│   │   ├── hooks/
│   │   │   ├── useDebounce.ts
│   │   │   └── useLocalStorage.ts
│   │   ├── utils/
│   │   │   ├── formatters.ts
│   │   │   ├── validators.ts
│   │   │   └── constants.ts
│   │   └── types/
│   │       ├── guest.types.ts
│   │       └── api.types.ts
│   │
│   ├── lib/                        # Core libraries config
│   │   ├── api-client.ts           # Axios instance
│   │   ├── query-client.ts         # TanStack Query config
│   │   └── utils.ts                # shadcn utils
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── components.json                 # shadcn/ui config
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## 🗄️ Schema de Base de Datos (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Guest {
  id               Int              @id @default(autoincrement())
  firstName        String           @db.VarChar(100)
  lastName         String?          @db.VarChar(100)
  address          String?          @db.VarChar(255)
  state            String?          @db.VarChar(100)
  city             String?          @db.VarChar(100)
  church           String?          @db.VarChar(200)
  phone            String?          @db.VarChar(20)
  notes            String?          @db.Text
  status           GuestStatus      @default(PENDING)
  isPastor         Boolean          @default(false)
  registrationDate DateTime         @default(now())
  createdAt        DateTime         @default(now())
  updatedAt        DateTime         @updatedAt
  deletedAt        DateTime?        // Soft delete
  
  history          GuestHistory[]
  
  // Índices para optimizar queries
  @@index([status])
  @@index([church])
  @@index([city])
  @@index([isPastor])
  @@index([firstName, lastName])
  @@index([deletedAt])
  @@map("guests")
}

model GuestHistory {
  id        Int      @id @default(autoincrement())
  guestId   Int
  guest     Guest    @relation(fields: [guestId], references: [id], onDelete: Cascade)
  action    String   @db.VarChar(50)   // CREATE, UPDATE, DELETE, STATUS_CHANGE
  field     String?  @db.VarChar(50)   // Campo modificado
  oldValue  String?  @db.Text
  newValue  String?  @db.Text
  changedBy String?  @db.VarChar(100)  // Usuario que hizo el cambio (futuro)
  createdAt DateTime @default(now())
  
  @@index([guestId])
  @@index([createdAt])
  @@map("guest_history")
}

enum GuestStatus {
  PENDING
  CONFIRMED
  DECLINED
}
```

---

## 🔄 Flujo de Datos Optimizado

```
┌─────────────────────────────────────────────────┐
│                   React UI                      │
│  ┌──────────────┐        ┌──────────────┐      │
│  │   Zustand    │        │  TanStack    │      │
│  │ (UI State)   │        │   Query      │      │
│  │              │        │  (Data Cache)│      │
│  └──────────────┘        └──────┬───────┘      │
└────────────────────────────────┼────────────────┘
                                 │
                    HTTP Request │
                                 ↓
            ┌────────────────────────────────┐
            │       NestJS API Server        │
            │  ┌──────────────────────────┐  │
            │  │  Guards & Interceptors   │  │
            │  └────────────┬─────────────┘  │
            │               │                 │
            │  ┌────────────▼─────────────┐  │
            │  │   Business Logic Layer   │  │
            │  │      (Services)          │  │
            │  └────────────┬─────────────┘  │
            └───────────────┼─────────────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ↓                           ↓
    ┌─────────────────┐        ┌──────────────────┐
    │  Redis Cache    │        │  Prisma Client   │
    │  (5 min TTL)    │        │                  │
    │                 │        └────────┬─────────┘
    │  ├─ Hit: Return │                 │
    │  └─ Miss: DB    │                 ↓
    └─────────────────┘        ┌──────────────────┐
                               │ Neon PostgreSQL  │
                               │   (Database)     │
                               └──────────────────┘
```

### Estrategia de Cache

#### Redis (Backend)
- **TTL:** 5 minutos para listados
- **Keys Pattern:** `guests:list:{filters}`, `guests:stats`
- **Invalidación:** Al crear/actualizar/eliminar guest

#### TanStack Query (Frontend)
- **staleTime:** 3 minutos
- **cacheTime:** 5 minutos
- **refetchOnWindowFocus:** true (para datos frescos)
- **Optimistic Updates:** En mutaciones para UX instantánea

---

## 🚀 Plan de Implementación

### **Estrategia Recomendada: Migración Completa**

#### **FASE 1: Fundamentos Backend** ⏱️ Semana 1-2

##### 1.1 Setup Inicial Backend (2 días)
- [ ] Crear proyecto NestJS
  ```bash
  npx @nestjs/cli new backend
  cd backend
  ```
- [ ] Configurar Prisma + Neon DB
  ```bash
  npm install @prisma/client
  npm install -D prisma
  npx prisma init
  ```
- [ ] Setup variables de entorno (.env)
  ```env
  DATABASE_URL="postgresql://..."
  REDIS_URL="redis://..."
  PORT=3000
  CORS_ORIGIN="http://localhost:5173"
  ```
- [ ] Configurar Docker Compose (Redis local)

##### 1.2 Modelado de Datos (1 día)
- [ ] Definir schema Prisma completo
- [ ] Crear primera migración
  ```bash
  npx prisma migrate dev --name init
  ```
- [ ] Crear seed con rawData de constants.ts
  ```bash
  npx prisma db seed
  ```

##### 1.3 API REST - CRUD Básico (3 días)
- [ ] Módulo Guests (CRUD completo)
  - [ ] `GET /guests` - Listar con paginación
  - [ ] `GET /guests/:id` - Obtener uno
  - [ ] `POST /guests` - Crear
  - [ ] `PATCH /guests/:id` - Actualizar
  - [ ] `DELETE /guests/:id` - Eliminar (soft delete)
- [ ] DTOs y validación (class-validator)
- [ ] Exception filters personalizados
- [ ] Swagger documentation

##### 1.4 Features Avanzadas API (3 días)
- [ ] Búsqueda y filtros
  - [ ] `GET /guests?search=...&status=...&isPastor=...`
- [ ] Operaciones bulk
  - [ ] `POST /guests/bulk-update` - Actualizar múltiples
  - [ ] `POST /guests/bulk-delete` - Eliminar múltiples
- [ ] Estadísticas
  - [ ] `GET /guests/stats` - Contadores por estado
- [ ] Historial de cambios (audit log)

##### 1.5 Cache con Redis (2 días)
- [ ] Setup Redis module
- [ ] Cache interceptor global
- [ ] Invalidación de cache en mutaciones
- [ ] TTL strategies por endpoint

---

#### **FASE 2: Optimización Frontend** ⏱️ Semana 2-3

##### 2.1 Preparación y Setup (2 días)
- [ ] Instalar dependencias
  ```bash
  npm install zustand @tanstack/react-query axios
  npm install sonner recharts
  npx shadcn-ui@latest init
  ```
- [ ] Configurar TanStack Query
  ```typescript
  // src/lib/query-client.ts
  export const queryClient = new QueryClient({...})
  ```
- [ ] Configurar axios client
  ```typescript
  // src/lib/api-client.ts
  export const apiClient = axios.create({...})
  ```

##### 2.2 Reestructuración (3 días)
- [ ] Migrar a arquitectura feature-based
- [ ] Crear API services layer
  ```typescript
  // src/features/guests/api/guestsApi.ts
  export const guestsApi = {...}
  ```
- [ ] Separar tipos en archivos dedicados
- [ ] Crear error boundaries

##### 2.3 Estado Global con Zustand (2 días)
- [ ] Store de UI state
  ```typescript
  // Modal state, selection, filters
  interface UIStore {
    isModalOpen: boolean
    selectedGuests: Set<number>
    ...
  }
  ```
- [ ] Persist middleware (localStorage backup)
- [ ] Devtools integration

##### 2.4 Data Fetching con TanStack Query (3 días)
- [ ] Hooks de queries
  ```typescript
  // useGuests, useGuestById, useGuestStats
  ```
- [ ] Hooks de mutations
  ```typescript
  // useCreateGuest, useUpdateGuest, useDeleteGuest
  // useBulkUpdate, useBulkDelete
  ```
- [ ] Optimistic updates
- [ ] Error handling consistente
- [ ] Prefetching estratégico

##### 2.5 UI Components (shadcn/ui) (3 días)
- [ ] Migrar componentes a shadcn/ui
  - [ ] Button, Input, Select
  - [ ] Dialog (Modal)
  - [ ] Table
  - [ ] Badge (para status)
  - [ ] Checkbox
- [ ] Toast notifications (sonner)
- [ ] Loading skeletons
- [ ] Error states mejorados
- [ ] Empty states

---

#### **FASE 3: Features Avanzadas** ⏱️ Semana 3-4

##### 3.1 Exportaciones Mejoradas (3 días)
- [ ] Backend: Endpoints de export
  - [ ] `POST /export/csv`
  - [ ] `POST /export/pdf`
- [ ] Queue system con Bull (opcional)
- [ ] Templates personalizables
- [ ] Frontend: Integración con API

##### 3.2 Analytics y Visualización (2 días)
- [ ] Dashboard mejorado
- [ ] Gráficos con Recharts
  - [ ] Distribución por estado (Pie chart)
  - [ ] Registros por fecha (Line chart)
  - [ ] Distribución por iglesia (Bar chart)
- [ ] Reportes descargables

##### 3.3 Historial y Auditoría (2 días)
- [ ] Vista de historial por invitado
- [ ] Timeline de cambios
- [ ] Filtros de auditoría

##### 3.4 Testing (3 días)
- [ ] Backend: E2E tests (Jest + Supertest)
- [ ] Frontend: Unit tests (Vitest)
- [ ] Frontend: Component tests (Testing Library)
- [ ] Coverage > 70%

---

#### **FASE 4: Polish y Deploy** ⏱️ Semana 4

##### 4.1 Performance Optimization (2 días)
- [ ] Lazy loading de componentes
- [ ] Virtual scrolling para tablas largas
- [ ] Image optimization (si aplica)
- [ ] Bundle analysis y code splitting

##### 4.2 Security Hardening (1 día)
- [ ] CORS configuración
- [ ] Rate limiting
- [ ] Input sanitization
- [ ] SQL injection prevention (Prisma lo maneja)
- [ ] XSS prevention

##### 4.3 Documentation (1 día)
- [ ] README actualizado
- [ ] API documentation (Swagger)
- [ ] Frontend component documentation (Storybook opcional)
- [ ] Deployment guide

##### 4.4 Deployment (2 días)
- [ ] Backend: Deploy a Railway/Render/Fly.io
- [ ] Frontend: Deploy a Vercel/Netlify
- [ ] Redis: Redis Cloud (free tier)
- [ ] Database: Ya en Neon (configurado)
- [ ] Environment variables en producción
- [ ] Monitoring básico (logs)

---

## 📊 Seguimiento de Progreso

### Estado General del Proyecto

| Fase | Estado | Progreso | Fecha Inicio | Fecha Fin |
|------|--------|----------|--------------|-----------|
| **Fase 1: Backend** | � Completado | 100% | 2025-10-16 | 2025-10-16 |
| 1.1 Setup Backend | 🟢 Completado | 4/4 tareas | 2025-10-16 | 2025-10-16 |
| 1.2 Modelado DB | 🟢 Completado | 3/3 tareas | 2025-10-16 | 2025-10-16 |
| 1.3 API CRUD | 🟢 Completado | 5/5 tareas | 2025-10-16 | 2025-10-16 |
| 1.4 Features API | 🟢 Completado | 4/4 tareas | 2025-10-16 | 2025-10-16 |
| 1.5 Cache Redis | � Completado | 4/4 tareas | 2025-10-16 | 2025-10-16 |
| **Fase 2: Frontend** | 🔴 No iniciado | 0% | - | - |
| 2.1 Setup | 🔴 | 0/3 tareas | - | - |
| 2.2 Reestructuración | 🔴 | 0/4 tareas | - | - |
| 2.3 Zustand | 🔴 | 0/3 tareas | - | - |
| 2.4 TanStack Query | 🔴 | 0/5 tareas | - | - |
| 2.5 UI Components | 🔴 | 0/5 tareas | - | - |
| **Fase 3: Features** | 🔴 No iniciado | 0% | - | - |
| 3.1 Exportaciones | 🔴 | 0/4 tareas | - | - |
| 3.2 Analytics | 🔴 | 0/3 tareas | - | - |
| 3.3 Auditoría | 🔴 | 0/3 tareas | - | - |
| 3.4 Testing | 🔴 | 0/4 tareas | - | - |
| **Fase 4: Polish** | 🔴 No iniciado | 0% | - | - |
| 4.1 Performance | 🔴 | 0/4 tareas | - | - |
| 4.2 Security | 🔴 | 0/4 tareas | - | - |
| 4.3 Documentation | 🔴 | 0/4 tareas | - | - |
| 4.4 Deployment | 🔴 | 0/5 tareas | - | - |

**Leyenda de Estados:**
- 🔴 No iniciado
- 🟡 En progreso
- 🟢 Completado
- ⚠️ Bloqueado
- 🔵 En revisión

### Métricas de Calidad

| Métrica | Objetivo | Actual | Estado |
|---------|----------|--------|--------|
| Coverage Backend | > 70% | - | 🔴 |
| Coverage Frontend | > 70% | - | 🔴 |
| Performance (LCP) | < 2.5s | - | 🔴 |
| Bundle Size | < 300KB | - | 🔴 |
| API Response Time | < 200ms | - | 🔴 |

---

## 💰 Dependencias del Proyecto

### Backend (NestJS)

```json
{
  "name": "guests-app-backend",
  "version": "1.0.0",
  "dependencies": {
    "@nestjs/common": "^10.3.0",
    "@nestjs/core": "^10.3.0",
    "@nestjs/platform-express": "^10.3.0",
    "@nestjs/config": "^3.1.1",
    "@nestjs/swagger": "^7.1.17",
    "@nestjs/cache-manager": "^2.1.1",
    "@prisma/client": "^5.9.0",
    "cache-manager": "^5.4.0",
    "cache-manager-redis-yet": "^4.1.2",
    "redis": "^4.6.12",
    "class-validator": "^0.14.1",
    "class-transformer": "^0.5.1",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.3.0",
    "@nestjs/schematics": "^10.1.0",
    "@nestjs/testing": "^10.3.0",
    "@types/express": "^4.17.21",
    "@types/node": "^20.11.5",
    "@types/supertest": "^6.0.2",
    "@typescript-eslint/eslint-plugin": "^6.19.1",
    "@typescript-eslint/parser": "^6.19.1",
    "eslint": "^8.56.0",
    "jest": "^29.7.0",
    "prettier": "^3.2.4",
    "prisma": "^5.9.0",
    "supertest": "^6.3.4",
    "ts-jest": "^29.1.2",
    "ts-loader": "^9.5.1",
    "ts-node": "^10.9.2",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.3.3"
  }
}
```

### Frontend (React)

```json
{
  "name": "guests-app-frontend",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "zustand": "^4.5.0",
    "@tanstack/react-query": "^5.17.19",
    "@tanstack/react-query-devtools": "^5.17.19",
    "axios": "^1.6.5",
    "sonner": "^1.3.1",
    "recharts": "^2.10.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-slot": "^1.0.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "lucide-react": "^0.309.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.48",
    "@types/react-dom": "^18.2.18",
    "@types/node": "^20.11.5",
    "@vitejs/plugin-react": "^5.0.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0",
    "tailwindcss": "^3.4.1",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.33",
    "eslint": "^8.56.0",
    "vitest": "^1.2.1",
    "@testing-library/react": "^14.1.2",
    "@testing-library/jest-dom": "^6.2.0"
  }
}
```

---

## 🔧 Comandos Útiles

### Backend
```bash
# Desarrollo
npm run start:dev

# Prisma
npx prisma studio              # GUI para ver/editar DB
npx prisma migrate dev         # Crear migración
npx prisma db seed             # Ejecutar seeds
npx prisma generate            # Generar Prisma Client

# Testing
npm run test                   # Unit tests
npm run test:e2e               # E2E tests
npm run test:cov               # Coverage

# Build
npm run build
npm run start:prod
```

### Frontend
```bash
# Desarrollo
npm run dev

# shadcn/ui
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
# ... etc

# Build
npm run build
npm run preview

# Testing
npm run test
npm run test:ui
npm run test:coverage
```

---

## 📝 Notas y Consideraciones

### Decisiones Técnicas Importantes

1. **No usar Astro:** Por ser una app altamente dinámica, React es más apropiado
2. **Soft Deletes:** Implementar `deletedAt` en lugar de eliminar físicamente
3. **Optimistic Updates:** Mejorar UX con actualizaciones instantáneas
4. **Cache Strategy:** Redis backend + TanStack Query frontend para máxima eficiencia

### Riesgos Identificados

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Complejidad de migración | Media | Alto | Implementación incremental |
| Pérdida de datos en migración | Baja | Crítico | Backups antes de migrar |
| Overengineering | Media | Medio | Seguir YAGNI, implementar lo necesario |
| Curva de aprendizaje | Media | Medio | Documentación y pair programming |

### Próximos Pasos Inmediatos

1. ✅ Crear PLAN_IMPROVE.md (completado)
2. ⏳ Configurar Neon PostgreSQL
3. ⏳ Inicializar proyecto NestJS
4. ⏳ Definir schema Prisma
5. ⏳ Crear seed con rawData

---

## 📚 Referencias y Recursos

### Documentación Oficial
- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Neon PostgreSQL](https://neon.tech/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://docs.pmnd.rs/zustand)
- [shadcn/ui](https://ui.shadcn.com/)

### Tutoriales Recomendados
- NestJS + Prisma: [Tutorial oficial](https://docs.nestjs.com/recipes/prisma)
- TanStack Query Best Practices
- Zustand Patterns

---

## 🎉 Changelog

### Version 1.0 - 2025-10-16
- ✨ Plan inicial creado
- 📝 Definición completa de arquitectura
- 🗺️ Roadmap detallado de 4 semanas
- 📊 Sistema de seguimiento de progreso

---

**Última actualización:** 16 de Octubre, 2025  
**Mantenido por:** @Solideomyers  
**Estado del proyecto:** 🔄 En Planificación
