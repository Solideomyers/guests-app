# Frontend Hooks & State Management

## 📚 Custom Hooks con TanStack Query

Todos los hooks están ubicados en `frontend/hooks/` y utilizan TanStack Query para data fetching con optimistic updates.

### 🔍 Query Hooks (Lectura de Datos)

#### `useGuests(filters?)`
Obtiene la lista paginada y filtrada de invitados.

```typescript
import { useGuests } from './hooks';

function GuestList() {
  const { data, isLoading, error } = useGuests({ 
    search: 'John',
    status: 'CONFIRMED',
    page: 1,
    limit: 10
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data.data.map(guest => (
        <li key={guest.id}>{guest.firstName} {guest.lastName}</li>
      ))}
    </ul>
  );
}
```

**Características:**
- ✅ Cache automático (3 minutos stale time)
- ✅ Mantiene datos previos durante refetch (mejor UX)
- ✅ Refetch automático al cambiar filtros

---

#### `useGuestById(id, enabled?)`
Obtiene un invitado específico por ID.

```typescript
import { useGuestById } from './hooks';

function GuestDetail({ id }: { id: number }) {
  const { data: guest, isLoading } = useGuestById(id);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2>{guest.firstName} {guest.lastName}</h2>
      <p>Estado: {guest.status}</p>
    </div>
  );
}
```

**Características:**
- ✅ Query deshabilitada si no hay ID
- ✅ Cache por ID individual
- ✅ Automáticamente actualizada por mutations

---

#### `useGuestStats()`
Obtiene estadísticas de invitados.

```typescript
import { useGuestStats } from './hooks';

function StatsCards() {
  const { data: stats } = useGuestStats();

  return (
    <div>
      <StatsCard label="Total" value={stats.total} />
      <StatsCard label="Confirmados" value={stats.confirmed} />
      <StatsCard label="Pendientes" value={stats.pending} />
    </div>
  );
}
```

**Características:**
- ✅ Stale time reducido (1 minuto) - datos más frescos
- ✅ Invalidado automáticamente por mutations

---

### ✏️ Mutation Hooks (Escritura de Datos)

#### `useCreateGuest()`
Crea un nuevo invitado con optimistic update.

```typescript
import { useCreateGuest } from './hooks';

function AddGuestForm() {
  const createGuest = useCreateGuest();

  const handleSubmit = (data) => {
    createGuest.mutate(data, {
      onSuccess: () => {
        console.log('Invitado creado!');
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={createGuest.isPending}>
        {createGuest.isPending ? 'Creando...' : 'Crear'}
      </button>
    </form>
  );
}
```

**Características:**
- ✅ **Optimistic Update**: UI se actualiza inmediatamente
- ✅ **Rollback automático** en caso de error
- ✅ Toast notifications automáticas
- ✅ Invalida cache de listas y estadísticas

---

#### `useUpdateGuest()`
Actualiza un invitado con optimistic update.

```typescript
import { useUpdateGuest } from './hooks';

function EditGuestForm({ guestId }: { guestId: number }) {
  const updateGuest = useUpdateGuest();

  const handleStatusChange = (newStatus) => {
    updateGuest.mutate({
      id: guestId,
      data: { status: newStatus }
    });
  };

  return (
    <select onChange={(e) => handleStatusChange(e.target.value)}>
      <option value="PENDING">Pendiente</option>
      <option value="CONFIRMED">Confirmado</option>
      <option value="DECLINED">Declinado</option>
    </select>
  );
}
```

**Características:**
- ✅ Actualiza tanto el detalle como las listas
- ✅ Optimistic update en ambos
- ✅ Rollback si falla
- ✅ Toast notifications

---

#### `useDeleteGuest()`
Elimina un invitado (soft delete) con optimistic update.

```typescript
import { useDeleteGuest } from './hooks';

function DeleteButton({ guestId }: { guestId: number }) {
  const deleteGuest = useDeleteGuest();

  const handleDelete = () => {
    if (confirm('¿Estás seguro?')) {
      deleteGuest.mutate(guestId);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={deleteGuest.isPending}
    >
      Eliminar
    </button>
  );
}
```

**Características:**
- ✅ Remueve el invitado de la UI inmediatamente
- ✅ Rollback si falla
- ✅ Actualiza contadores automáticamente

---

#### Bulk Operations

##### `useBulkUpdateStatus()`
Actualiza el estado de múltiples invitados.

```typescript
import { useBulkUpdateStatus } from './hooks';

function BulkStatusUpdate({ selectedIds }: { selectedIds: number[] }) {
  const bulkUpdateStatus = useBulkUpdateStatus();

  const confirmAll = () => {
    bulkUpdateStatus.mutate({
      ids: selectedIds,
      status: 'CONFIRMED'
    });
  };

  return (
    <button onClick={confirmAll}>
      Confirmar {selectedIds.length} invitados
    </button>
  );
}
```

---

##### `useBulkUpdatePastor()`
Marca/desmarca múltiples invitados como pastores.

```typescript
import { useBulkUpdatePastor } from './hooks';

function MarkAsPastors({ selectedIds }: { selectedIds: number[] }) {
  const bulkUpdatePastor = useBulkUpdatePastor();

  const markAsPastors = () => {
    bulkUpdatePastor.mutate({
      ids: selectedIds,
      isPastor: true
    });
  };

  return <button onClick={markAsPastors}>Marcar como pastores</button>;
}
```

---

##### `useBulkDelete()`
Elimina múltiples invitados.

```typescript
import { useBulkDelete } from './hooks';

function BulkDeleteButton({ selectedIds }: { selectedIds: number[] }) {
  const bulkDelete = useBulkDelete();

  const deleteAll = () => {
    if (confirm(`¿Eliminar ${selectedIds.length} invitados?`)) {
      bulkDelete.mutate({ ids: selectedIds });
    }
  };

  return <button onClick={deleteAll}>Eliminar seleccionados</button>;
}
```

---

## 🗄️ Zustand Store (UI State)

El store de Zustand maneja **todo el estado de la UI** (no los datos, eso es TanStack Query).

### Uso del Store

```typescript
import { useUIStore } from './stores';

function MyComponent() {
  // Seleccionar estado específico (re-render solo cuando cambia)
  const searchQuery = useUIStore((state) => state.searchQuery);
  const setSearchQuery = useUIStore((state) => state.setSearchQuery);

  // O usar múltiples valores
  const { statusFilter, setStatusFilter, clearFilters } = useUIStore();

  return (
    <div>
      <input 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)} 
      />
      <button onClick={clearFilters}>Limpiar filtros</button>
    </div>
  );
}
```

---

### 📋 Estado Disponible

#### 🔍 Filtros y Búsqueda

```typescript
const {
  searchQuery,        // string: texto de búsqueda
  statusFilter,       // GuestStatus | 'ALL'
  isPastorFilter,     // boolean | null
  cityFilter,         // string
  churchFilter,       // string
  
  setSearchQuery,     // (query: string) => void
  setStatusFilter,    // (status) => void
  setIsPastorFilter,  // (isPastor) => void
  setCityFilter,      // (city) => void
  setChurchFilter,    // (church) => void
  clearFilters,       // () => void - resetea todos
} = useUIStore();
```

**Nota:** Cambiar cualquier filtro resetea automáticamente `currentPage` a 1.

---

#### 📄 Paginación

```typescript
const {
  currentPage,    // number: página actual (1-indexed)
  pageSize,       // number: items por página (default: 10)
  
  setCurrentPage, // (page: number) => void
  setPageSize,    // (size: number) => void - resetea a página 1
  resetPagination, // () => void
} = useUIStore();
```

---

#### ✅ Selección Múltiple

```typescript
const {
  selectedGuestIds,      // Set<number>
  
  toggleGuestSelection,  // (id: number) => void
  selectAllGuests,       // (ids: number[]) => void
  clearSelection,        // () => void
  isGuestSelected,       // (id: number) => boolean
  getSelectedCount,      // () => number
} = useUIStore();

// Ejemplo de uso
function GuestCheckbox({ guestId }: { guestId: number }) {
  const isSelected = useUIStore((state) => state.isGuestSelected(guestId));
  const toggle = useUIStore((state) => state.toggleGuestSelection);

  return (
    <input 
      type="checkbox" 
      checked={isSelected} 
      onChange={() => toggle(guestId)} 
    />
  );
}
```

---

#### 🪟 Modales

```typescript
const {
  // Add Modal
  isAddModalOpen,
  openAddModal,
  closeAddModal,

  // Edit Modal
  isEditModalOpen,
  editingGuestId,      // number | null
  openEditModal,       // (id: number) => void
  closeEditModal,

  // Delete Confirmation
  isDeleteConfirmOpen,
  deletingGuestId,     // number | null
  openDeleteConfirm,   // (id: number) => void
  closeDeleteConfirm,

  // Bulk Actions Modal
  isBulkActionModalOpen,
  openBulkActionModal,
  closeBulkActionModal,
} = useUIStore();
```

---

#### 👁️ Preferencias de Vista

```typescript
const {
  viewMode,      // 'table' | 'grid'
  sortBy,        // string (nombre del campo)
  sortOrder,     // 'asc' | 'desc'
  
  setViewMode,   // (mode: 'table' | 'grid') => void
  setSorting,    // (by: string, order: 'asc' | 'desc') => void
} = useUIStore();
```

**Nota:** Estas preferencias se **persisten en LocalStorage** automáticamente.

---

## 🔄 Integración Hooks + Store

Ejemplo completo de cómo usar ambos juntos:

```typescript
import { useGuests } from './hooks';
import { useUIStore } from './stores';

function GuestListContainer() {
  // UI State (filtros, paginación)
  const {
    searchQuery,
    statusFilter,
    isPastorFilter,
    currentPage,
    pageSize,
  } = useUIStore();

  // Data fetching con los filtros del store
  const { data, isLoading } = useGuests({
    search: searchQuery,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
    isPastor: isPastorFilter,
    page: currentPage,
    limit: pageSize,
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <GuestTable guests={data.data} />
      <Pagination 
        total={data.meta.total} 
        current={currentPage}
        pageSize={pageSize}
      />
    </div>
  );
}
```

---

## ✨ Características Principales

### 🚀 Optimistic Updates

Todas las mutations (create, update, delete, bulk) implementan **optimistic updates**:

1. **UI se actualiza inmediatamente** (sin esperar respuesta del servidor)
2. **Mejor UX**: El usuario ve los cambios al instante
3. **Rollback automático** si el servidor retorna error
4. **Toast notifications** para feedback visual

### 🔄 Cache Invalidation

El cache se invalida automáticamente cuando es necesario:

- Crear invitado → Invalida listas y estadísticas
- Actualizar invitado → Invalida detalle, listas y estadísticas
- Eliminar invitado → Invalida listas y estadísticas
- Bulk operations → Invalida listas y estadísticas

### 💾 Persistencia

El Zustand store persiste automáticamente en LocalStorage:
- ✅ View mode (table/grid)
- ✅ Page size
- ✅ Sort preferences

Los filtros y selección **NO** se persisten (reset al recargar página).

---

## 🎯 Próximos Pasos

Ahora que tenemos hooks y store, el siguiente paso es **refactorizar los componentes** para usarlos:

1. Reemplazar `useState/useEffect` con `useGuests`
2. Usar `useUIStore` para filtros y paginación
3. Implementar selección múltiple con checkbox
4. Usar mutations para crear/editar/eliminar

---

## 📚 Referencias

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [Optimistic Updates Guide](https://tanstack.com/query/latest/docs/react/guides/optimistic-updates)
