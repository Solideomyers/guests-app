import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { queryClient } from './lib/query-client';
import { AttendanceStatus, Guest as FrontendGuest } from './types';
import { GuestStatus, type Guest as BackendGuest } from './api/types';
import * as guestsApi from './api/guests';
import Header from './components/Header';
import StatsCard from './components/StatsCard';
import SearchBar from './components/SearchBar';
import StatusFilter from './components/StatusFilter';
import GuestTable from './components/GuestTable';
import Pagination from './components/Pagination';
import AddGuestModal from './components/AddGuestModal';
import ExportButtons from './components/ExportButtons';
import ScrollToTopButton from './components/ScrollToTopButton';
import BulkActionsToolbar from './components/BulkActionsToolbar';
import {
  useGuests,
  useGuestStats,
  useCreateGuest,
  useUpdateGuest,
  useDeleteGuest,
  useBulkUpdateStatus,
  useBulkUpdatePastor,
  useBulkDelete,
} from './hooks';
import { useUIStore } from './stores';

/**
 * Map AttendanceStatus (frontend spanish labels) to GuestStatus (backend enum)
 */
const mapToGuestStatus = (status: AttendanceStatus): GuestStatus => {
  switch (status) {
    case AttendanceStatus.PENDING:
      return GuestStatus.PENDING;
    case AttendanceStatus.CONFIRMED:
      return GuestStatus.CONFIRMED;
    case AttendanceStatus.DECLINED:
      return GuestStatus.DECLINED;
    default:
      return GuestStatus.PENDING;
  }
};

/**
 * Map backend GuestStatus to frontend AttendanceStatus
 */
const mapToAttendanceStatus = (status: GuestStatus): AttendanceStatus => {
  switch (status) {
    case GuestStatus.PENDING:
      return AttendanceStatus.PENDING;
    case GuestStatus.CONFIRMED:
      return AttendanceStatus.CONFIRMED;
    case GuestStatus.DECLINED:
      return AttendanceStatus.DECLINED;
    default:
      return AttendanceStatus.PENDING;
  }
};

/**
 * Map frontend AttendanceStatus | 'All' to backend GuestStatus | 'ALL'
 */
const mapStatusFilterToBackend = (
  status: AttendanceStatus | 'All'
): GuestStatus | 'ALL' => {
  if (status === 'All') return 'ALL';
  return mapToGuestStatus(status);
};

/**
 * Map backend GuestStatus | 'ALL' to frontend AttendanceStatus | 'All'
 */
const mapStatusFilterToFrontend = (
  status: GuestStatus | 'ALL'
): AttendanceStatus | 'All' => {
  if (status === 'ALL') return 'All';
  return mapToAttendanceStatus(status);
};

/**
 * Adapt backend Guest to frontend Guest
 * Converts API response to format expected by UI components
 */
const adaptBackendGuest = (backendGuest: BackendGuest): FrontendGuest => {
  return {
    id: backendGuest.id,
    firstName: backendGuest.firstName,
    lastName: backendGuest.lastName || '',
    address: backendGuest.address || '',
    state: backendGuest.state || '',
    city: backendGuest.city || '',
    church: backendGuest.church || '',
    phone: backendGuest.phone || '',
    notes: backendGuest.notes || '',
    status: mapToAttendanceStatus(backendGuest.status),
    isPastor: backendGuest.isPastor,
    registrationDate: backendGuest.registrationDate
      ? new Date(backendGuest.registrationDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
  };
};

// Since jsPDF is from a script tag, declare it on the window object
declare global {
  interface Window {
    jspdf: any;
  }
}

/**
 * Main App Component - Refactored
 * Uses TanStack Query hooks for data fetching and mutations
 * Uses Zustand store for UI state management
 * Connected to real backend API
 */
function AppContent() {
  // ========================================
  // UI State from Zustand Store
  // ========================================
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    pageSize,
    selectedGuestIds,
    toggleGuestSelection,
    selectAllGuests,
    clearSelection,
    isAddModalOpen,
    openAddModal,
    closeAddModal,
    isEditModalOpen,
    editingGuestId,
    openEditModal,
    closeEditModal,
    sortBy,
    sortOrder,
    setSorting,
  } = useUIStore();

  // ========================================
  // Data Fetching with TanStack Query
  // ========================================
  const {
    data: guestsData,
    isLoading: isLoadingGuests,
    error: guestsError,
  } = useGuests({
    page: currentPage,
    limit: pageSize,
    search: searchQuery,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
    sortBy,
    sortOrder: sortOrder,
  });

  const {
    data: stats,
    isLoading: isLoadingStats,
    error: statsError,
  } = useGuestStats();

  // Debug logging in development
  if (import.meta.env.DEV) {
    console.log('🔍 App State:', {
      isLoadingGuests,
      isLoadingStats,
      guestsError,
      statsError,
      guestsDataLength: guestsData?.data?.length,
      stats,
    });
  }

  // ========================================
  // Mutations
  // ========================================
  const createGuest = useCreateGuest();
  const updateGuest = useUpdateGuest();
  const deleteGuest = useDeleteGuest();
  const bulkUpdateStatus = useBulkUpdateStatus();
  const bulkUpdatePastor = useBulkUpdatePastor();
  const bulkDelete = useBulkDelete();

  // ========================================
  // Derived Data
  // ========================================
  // Adapt backend guests to frontend format
  const guests: FrontendGuest[] = guestsData?.data.map(adaptBackendGuest) || [];
  const totalPages = guestsData?.meta.totalPages || 1;
  const isAllSelected =
    guests.length > 0 && guests.every((g) => selectedGuestIds.has(g.id));

  // Guest being edited (for modal)
  const guestToEdit = editingGuestId
    ? guests.find((g) => g.id === editingGuestId) || null
    : null;

  // ========================================
  // Event Handlers
  // ========================================
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (status: AttendanceStatus | 'All') => {
    const backendStatus = mapStatusFilterToBackend(status);
    setStatusFilter(backendStatus);
  };

  const handleSort = (key: string) => {
    const newOrder = sortBy === key && sortOrder === 'asc' ? 'desc' : 'asc';
    setSorting(key, newOrder);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // ========================================
  // CRUD Operations
  // ========================================
  const handleSaveGuest = (
    guestData: Omit<FrontendGuest, 'registrationDate' | 'status'>
  ) => {
    // Convert empty strings to null for backend compatibility
    const sanitizedData = {
      firstName: guestData.firstName,
      lastName: guestData.lastName || null,
      address: guestData.address || null,
      state: guestData.state || null,
      city: guestData.city || null,
      church: guestData.church || null,
      phone: guestData.phone || null,
      notes: guestData.notes || null,
      isPastor: guestData.isPastor,
    };

    if ('id' in guestData && guestData.id) {
      // Update existing guest
      updateGuest.mutate(
        { id: guestData.id, data: sanitizedData },
        {
          onSuccess: () => {
            closeEditModal();
          },
        }
      );
    } else {
      // Create new guest
      createGuest.mutate(sanitizedData, {
        onSuccess: () => {
          closeAddModal();
        },
      });
    }
    return true;
  };

  const handleDeleteGuest = (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este invitado?')) {
      deleteGuest.mutate(id);
    }
  };

  const handleEditGuest = (guest: FrontendGuest) => {
    openEditModal(guest.id);
  };

  const handleUpdateGuestStatus = (id: number, status: AttendanceStatus) => {
    const backendStatus = mapToGuestStatus(status);
    updateGuest.mutate({ id, data: { status: backendStatus } });
  };

  const handleTogglePastorStatus = (id: number, isPastor: boolean) => {
    updateGuest.mutate({ id, data: { isPastor } });
  };

  // ========================================
  // Selection Handlers
  // ========================================
  const handleSelectGuest = (id: number) => {
    toggleGuestSelection(id);
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      clearSelection();
    } else {
      selectAllGuests(guests.map((g) => g.id));
    }
  };

  // ========================================
  // Bulk Operations
  // ========================================
  const handleBulkStatusUpdate = (status: AttendanceStatus) => {
    const ids = Array.from(selectedGuestIds);
    const backendStatus = mapToGuestStatus(status);
    bulkUpdateStatus.mutate(
      { ids, status: backendStatus },
      {
        onSuccess: () => {
          clearSelection();
        },
      }
    );
  };

  const handleBulkPastorUpdate = (isPastor: boolean) => {
    const ids = Array.from(selectedGuestIds);
    bulkUpdatePastor.mutate(
      { ids, isPastor },
      {
        onSuccess: () => {
          clearSelection();
        },
      }
    );
  };

  const handleBulkDelete = () => {
    if (
      window.confirm(
        `¿Estás seguro de que deseas eliminar ${selectedGuestIds.size} invitado(s)?`
      )
    ) {
      const ids = Array.from(selectedGuestIds);
      bulkDelete.mutate(
        { ids },
        {
          onSuccess: () => {
            clearSelection();
          },
        }
      );
    }
  };

  // ========================================
  // Export Functions (fetch ALL guests, not just current page)
  // ========================================
  const handleExportCSV = async () => {
    try {
      // Fetch all guests for export (limit=1000 to get all)
      const allGuestsData = await guestsApi.guestsApi.getAll({
        page: 1,
        limit: 1000,
        search: searchQuery,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
      });

      const allGuests = allGuestsData.data.map(adaptBackendGuest);

      const headers = [
        'ID',
        'Nombre',
        'Apellido',
        'Iglesia',
        'Ciudad',
        'Teléfono',
        'Estatus',
        'Es Pastor',
      ];
      const rows = allGuests.map((guest) =>
        [
          guest.id,
          guest.firstName,
          guest.lastName,
          guest.church,
          guest.city,
          guest.phone,
          guest.status,
          guest.isPastor ? 'Sí' : 'No',
        ].join(',')
      );
      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [headers.join(','), ...rows].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'lista_de_invitados.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Error al exportar CSV. Por favor intenta de nuevo.');
    }
  };

  const handleExportPDF = async () => {
    try {
      // Fetch all guests for export
      const allGuestsData = await guestsApi.guestsApi.getAll({
        page: 1,
        limit: 1000,
        search: searchQuery,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
      });

      const allGuests = allGuestsData.data.map(adaptBackendGuest);

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF() as any;

      doc.setFontSize(20);
      doc.text('Resumen de Invitados', 14, 22);

      const currentStats = {
        total: stats?.total || 0,
        pastors: stats?.pastors || 0,
        confirmed: stats?.confirmed || 0,
        pending: stats?.pending || 0,
        declined: stats?.declined || 0,
      };
      const cardData = [
        { title: 'Total', value: currentStats.total, color: [229, 231, 235] },
        {
          title: 'Pastores',
          value: currentStats.pastors,
          color: [233, 213, 255],
        },
        {
          title: 'Confirmados',
          value: currentStats.confirmed,
          color: [220, 252, 231],
        },
        {
          title: 'Pendientes',
          value: currentStats.pending,
          color: [254, 249, 195],
        },
        {
          title: 'Rechazados',
          value: currentStats.declined,
          color: [254, 226, 226],
        },
      ];

      let startX = 14;
      cardData.forEach((card) => {
        doc.setFillColor(...card.color);
        doc.roundedRect(startX, 30, 35, 20, 3, 3, 'F');
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(card.title, startX + 5, 38);
        doc.setFontSize(16);
        doc.setTextColor(0);
        doc.text(card.value.toString(), startX + 5, 46);
        startX += 40;
      });

      const tableColumn = [
        'Nombre Completo',
        'Iglesia',
        'Ciudad',
        'Teléfono',
        'Estatus',
        'Pastor',
      ];
      const tableRows = allGuests.map((guest) => [
        `${guest.firstName} ${guest.lastName}`,
        guest.church,
        guest.city,
        guest.phone || 'N/A',
        guest.status,
        guest.isPastor ? 'Sí' : 'No',
      ]);

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 60,
        theme: 'grid',
        headStyles: { fillColor: [22, 163, 74] },
      });

      doc.save('lista_de_invitados.pdf');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error al exportar PDF. Por favor intenta de nuevo.');
    }
  };

  // ========================================
  // Loading State
  // ========================================
  if (isLoadingGuests || isLoadingStats) {
    return (
      <div className='min-h-screen bg-slate-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
          <p className='mt-4 text-slate-600'>Cargando invitados...</p>
        </div>
      </div>
    );
  }

  // ========================================
  // Error State
  // ========================================
  if (guestsError || statsError) {
    return (
      <div className='min-h-screen bg-slate-50 flex items-center justify-center'>
        <div className='text-center max-w-md p-8 bg-white rounded-lg shadow-lg'>
          <div className='text-red-600 text-6xl mb-4'>⚠️</div>
          <h2 className='text-2xl font-bold text-slate-800 mb-2'>
            Error al cargar datos
          </h2>
          <p className='text-slate-600 mb-4'>
            {guestsError?.message || statsError?.message || 'Error desconocido'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // ========================================
  // Render
  // ========================================
  return (
    <div className='bg-slate-50 min-h-screen font-sans'>
      <Toaster position='top-right' richColors />
      <Header />
      <main className='container mx-auto p-4 sm:p-6 lg:p-8'>
        {/* Stats Cards */}
        <div className='flex justify-center mb-8'>
          <section className='inline-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-max mx-auto'>
            <StatsCard
              title='Total Invitados'
              value={stats?.total || 0}
              colorClass='bg-blue-100 text-blue-600'
            />
            <StatsCard
              title='Pastores'
              value={stats?.pastors || 0}
              colorClass='bg-purple-100 text-purple-600'
            />
            <StatsCard
              title='Confirmados'
              value={stats?.confirmed || 0}
              colorClass='bg-green-100 text-green-600'
            />
            <StatsCard
              title='Pendientes'
              value={stats?.pending || 0}
              colorClass='bg-yellow-100 text-yellow-600'
            />
            <StatsCard
              title='Rechazados'
              value={stats?.declined || 0}
              colorClass='bg-red-100 text-red-600'
            />
          </section>
        </div>

        {/* Main Content */}
        <div className='bg-white rounded-lg shadow-md overflow-hidden'>
          <div className='p-4 md:p-6 space-y-4'>
            {/* Bulk Actions or Regular Controls */}
            {selectedGuestIds.size > 0 ? (
              <BulkActionsToolbar
                selectedCount={selectedGuestIds.size}
                onClearSelection={clearSelection}
                onDelete={handleBulkDelete}
                onChangeStatus={handleBulkStatusUpdate}
                onSetPastorStatus={handleBulkPastorUpdate}
              />
            ) : (
              <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                <SearchBar value={searchQuery} onChange={handleSearchChange} />
                <div className='flex flex-col sm:flex-row items-center gap-2'>
                  <ExportButtons
                    onExportCSV={handleExportCSV}
                    onExportPDF={handleExportPDF}
                  />
                  <button
                    onClick={openAddModal}
                    className='flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='w-5 h-5'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M12 4.5v15m7.5-7.5h-15'
                      />
                    </svg>
                    <span>Añadir Invitado</span>
                  </button>
                </div>
              </div>
            )}

            {/* Status Filter */}
            <StatusFilter
              activeFilter={mapStatusFilterToFrontend(statusFilter)}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Guest Table */}
          <GuestTable
            guests={guests}
            onSort={handleSort}
            sortConfig={{
              key: sortBy,
              direction: sortOrder === 'asc' ? 'ascending' : 'descending',
            }}
            onUpdateStatus={handleUpdateGuestStatus}
            onTogglePastorStatus={handleTogglePastorStatus}
            onSelectGuest={handleSelectGuest}
            selectedGuests={selectedGuestIds}
            onSelectAll={handleSelectAll}
            isAllSelected={isAllSelected}
            onDeleteGuest={handleDeleteGuest}
            onEditGuest={handleEditGuest}
          />

          {/* Pagination */}
          {totalPages > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={guestsData?.meta.total || 0}
              itemsPerPage={pageSize}
            />
          )}
        </div>
      </main>

      {/* Add/Edit Modal */}
      <AddGuestModal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={isEditModalOpen ? closeEditModal : closeAddModal}
        onSave={handleSaveGuest}
        guestToEdit={guestToEdit}
      />

      <ScrollToTopButton />
    </div>
  );
}

/**
 * App Component with QueryClientProvider wrapper
 */
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
};

export default App;
