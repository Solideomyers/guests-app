# Frontend - Nueva Arquitectura

## 📁 Estructura de Carpetas

```
.
├── api/                    # API Services
│   ├── guests.ts          # Guests API endpoints
│   └── types.ts           # TypeScript interfaces
├── lib/                    # Library configurations
│   ├── query-client.ts    # TanStack Query setup
│   └── api-client.ts      # Axios configuration
├── hooks/                  # Custom React hooks
├── stores/                 # Zustand stores
├── utils/                  # Utility functions
├── components/             # React components
├── App.tsx                 # Main application
└── index.tsx               # Entry point
```

## 🛠️ Tecnologías

### Gestión de Estado
- **Zustand**: Estado global simple y performante
- **TanStack Query**: Cache y sincronización de datos del servidor

### Data Fetching
- **Axios**: Cliente HTTP con interceptors

### UI/UX
- **Sonner**: Notificaciones toast elegantes
- **TailwindCSS**: Estilos utility-first

## 🚀 Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

### TanStack Query

Configuración optimizada para aplicaciones real-time:

- **staleTime**: 3 minutos
- **gcTime**: 5 minutos
- **refetchOnWindowFocus**: true
- **retry**: 1 intento

### API Client

Cliente axios pre-configurado con:

- Base URL desde variables de entorno
- Timeout: 30 segundos
- Interceptors para logging y manejo de errores
- Transformación automática de respuestas

## 📝 Uso

### Llamadas a la API

```typescript
import { guestsApi } from './api/guests';

// Obtener todos los invitados
const guests = await guestsApi.getAll({ page: 1, limit: 20 });

// Crear invitado
const newGuest = await guestsApi.create({
  firstName: 'Juan',
  lastName: 'Pérez',
  church: 'Iglesia Central',
});

// Actualizar invitado
await guestsApi.update(1, { status: GuestStatus.CONFIRMED });

// Exportar a CSV
const csvBlob = await guestsApi.exportCsv({ status: 'CONFIRMED' });
```

### Query Keys

Sistema centralizado de query keys:

```typescript
import { queryKeys } from './lib/query-client';

// Lista de invitados
queryKeys.guests.lists();

// Lista con filtros
queryKeys.guests.list({ page: 1, status: 'CONFIRMED' });

// Detalle de invitado
queryKeys.guests.detail(1);

// Estadísticas
queryKeys.guests.stats();
```

## 🔄 Flujo de Datos

```
Componente UI
    ↓
TanStack Query Hook (useQuery/useMutation)
    ↓
API Service (guestsApi)
    ↓
Axios Client (apiClient)
    ↓
Backend REST API
    ↓
Redis Cache / PostgreSQL
```

## 🎯 Próximos Pasos

1. ✅ Configuración base completada
2. 🔄 Crear hooks personalizados con useQuery
3. 🔄 Implementar Zustand stores
4. 🔄 Refactorizar componentes para usar nueva arquitectura
5. 🔄 Implementar optimistic updates

## 📚 Documentación

- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Axios](https://axios-http.com/)
- [Sonner](https://sonner.emilkowal.ski/)
