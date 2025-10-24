# Frontend - Event Guest Manager

## 📦 Latest Updates

### v1.1.2 - Combined Filters (October 23, 2025)
- **ActiveFiltersBadges** component for visual filter management
- **AdditionalFilters** enhanced with city filter dropdown
- Multi-criteria filtering (Pastor, Church, City) with AND logic
- Visual badges with individual filter removal

### v1.1.1 - Mobile UX Refinements (October 23, 2025)
- Responsive BulkActionsToolbar
- Theme toggle with tooltip
- DeleteConfirmDialog in GuestCard
- ScrollToTopButton mobile optimization
- Smooth theme transitions (0.3s ease)

### v1.1.0 - Mobile Improvements (October 23, 2025)
- **GuestCard** component for mobile-first view
- **ExportMenu** dropdown for unified exports
- **useMediaQuery** hook for responsive detection
- 3-mode theme system (light/dark/system)

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
│   ├── useGuests.ts       # Guests data fetching
│   ├── useCreateGuest.ts  # Create mutation
│   ├── useUpdateGuest.ts  # Update mutation
│   ├── useDeleteGuest.ts  # Delete mutation
│   ├── useBulkOperations.ts  # Bulk mutations
│   └── useMediaQuery.ts   # Responsive detection (v1.1.0)
├── stores/                 # Zustand stores
│   ├── uiStore.ts         # UI state management
│   └── index.ts           # Store exports
├── utils/                  # Utility functions
├── components/             # React components
│   ├── GuestTable.tsx     # Desktop table view
│   ├── GuestCard.tsx      # Mobile card view (v1.1.0)
│   ├── GuestRow.tsx       # Table row component
│   ├── ExportButtons.tsx  # Export actions
│   ├── ExportMenu.tsx     # Mobile export dropdown (v1.1.0)
│   ├── StatusFilter.tsx   # Status filtering
│   ├── AdditionalFilters.tsx  # Pastor/Church/City filters (v1.1.2)
│   ├── ActiveFiltersBadges.tsx  # Filter badges display (v1.1.2)
│   ├── BulkActionsToolbar.tsx  # Bulk operations UI
│   ├── DarkModeToggle.tsx # Theme switcher (v1.1.0)
│   ├── ScrollToTopButton.tsx  # Scroll to top (v1.1.1)
│   └── ui/                # shadcn/ui components
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
2. ✅ Hooks personalizados con useQuery implementados
3. ✅ Zustand stores configurados
4. ✅ Componentes refactorizados para nueva arquitectura
5. ✅ Optimistic updates implementados
6. ✅ Mobile-first components (v1.1.0)
7. ✅ UX refinements (v1.1.1)
8. ✅ Combined filters system (v1.1.2)

## 🆕 New Components (v1.1.0 - v1.1.2)

### GuestCard (v1.1.0)
Mobile-optimized card component for displaying guest information.
- Avatar with initials and themed colors
- Compact layout for small screens
- Status badge with select dropdown
- Pastor toggle button
- Edit and delete actions
- Integrated DeleteConfirmDialog (v1.1.1)

### ExportMenu (v1.1.0)
Dropdown menu component for export actions on mobile devices.
- CSV and PDF export options
- Click-outside-to-close behavior
- ARIA accessible
- Icon-based UI

### useMediaQuery Hook (v1.1.0)
Custom hook for responsive viewport detection.
- Window resize listener
- Debounced for performance
- Cleanup on unmount
- Used throughout app for conditional rendering

### ActiveFiltersBadges (v1.1.2)
Visual badges component showing all active filters.
- Badge for each active filter (search, status, pastor, church, city)
- Click X to remove individual filter
- "Limpiar todos" button for bulk reset
- Responsive flex-wrap layout
- Auto-hides when no filters active

### AdditionalFilters (v1.1.2)
Enhanced filter component with three dropdown selects.
- Pastor filter (all/pastors/non-pastors)
- Church filter (dynamically populated)
- City filter (dynamically populated)
- Extracts unique values from guest data
- Responsive: stacked on mobile, row on desktop

### DarkModeToggle (v1.1.0)
3-mode theme switcher with system preference support.
- Light/Dark/System modes
- Dropdown menu for selection
- Persisted in localStorage via uiStore
- Smooth transitions (v1.1.1)
- Tooltip with visual feedback (v1.1.1)

### ScrollToTopButton (v1.1.1)
Floating action button for quick page navigation.
- Appears after scrolling 300px
- 48x48px touch-friendly size
- Rounded design with shadow
- Smooth slide-up animation
- Mobile-optimized positioning (16px from edges)

## 📚 Documentación

- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Axios](https://axios-http.com/)
- [Sonner](https://sonner.emilkowal.ski/)
