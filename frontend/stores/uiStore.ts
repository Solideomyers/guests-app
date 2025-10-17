import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GuestStatus } from '../api/types';

/**
 * UI State Store with Zustand
 * Manages all UI-related state (filters, search, pagination, selection, modals)
 */

interface UIState {
  // ============================================
  // FILTERS & SEARCH
  // ============================================
  searchQuery: string;
  statusFilter: GuestStatus | 'ALL';
  isPastorFilter: boolean | null;
  cityFilter: string;
  churchFilter: string;

  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: GuestStatus | 'ALL') => void;
  setIsPastorFilter: (isPastor: boolean | null) => void;
  setCityFilter: (city: string) => void;
  setChurchFilter: (church: string) => void;
  clearFilters: () => void;

  // ============================================
  // PAGINATION
  // ============================================
  currentPage: number;
  pageSize: number;

  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  resetPagination: () => void;

  // ============================================
  // SELECTION
  // ============================================
  selectedGuestIds: Set<number>;

  toggleGuestSelection: (id: number) => void;
  selectAllGuests: (ids: number[]) => void;
  clearSelection: () => void;
  isGuestSelected: (id: number) => boolean;
  getSelectedCount: () => number;

  // ============================================
  // MODALS
  // ============================================
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  editingGuestId: number | null;
  isDeleteConfirmOpen: boolean;
  deletingGuestId: number | null;
  isBulkActionModalOpen: boolean;

  openAddModal: () => void;
  closeAddModal: () => void;
  openEditModal: (id: number) => void;
  closeEditModal: () => void;
  openDeleteConfirm: (id: number) => void;
  closeDeleteConfirm: () => void;
  openBulkActionModal: () => void;
  closeBulkActionModal: () => void;

  // ============================================
  // VIEW PREFERENCES
  // ============================================
  viewMode: 'table' | 'grid';
  sortBy: string;
  sortOrder: 'asc' | 'desc';

  setViewMode: (mode: 'table' | 'grid') => void;
  setSorting: (by: string, order: 'asc' | 'desc') => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // ============================================
      // INITIAL STATE - FILTERS & SEARCH
      // ============================================
      searchQuery: '',
      statusFilter: 'ALL',
      isPastorFilter: null,
      cityFilter: '',
      churchFilter: '',

      setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
      setStatusFilter: (status) =>
        set({ statusFilter: status, currentPage: 1 }),
      setIsPastorFilter: (isPastor) =>
        set({ isPastorFilter: isPastor, currentPage: 1 }),
      setCityFilter: (city) => set({ cityFilter: city, currentPage: 1 }),
      setChurchFilter: (church) =>
        set({ churchFilter: church, currentPage: 1 }),
      clearFilters: () =>
        set({
          searchQuery: '',
          statusFilter: 'ALL',
          isPastorFilter: null,
          cityFilter: '',
          churchFilter: '',
          currentPage: 1,
        }),

      // ============================================
      // INITIAL STATE - PAGINATION
      // ============================================
      currentPage: 1,
      pageSize: 10,

      setCurrentPage: (page) => set({ currentPage: page }),
      setPageSize: (size) => set({ pageSize: size, currentPage: 1 }),
      resetPagination: () => set({ currentPage: 1 }),

      // ============================================
      // INITIAL STATE - SELECTION
      // ============================================
      selectedGuestIds: new Set<number>(),

      toggleGuestSelection: (id) =>
        set((state) => {
          const newSelection = new Set(state.selectedGuestIds);
          if (newSelection.has(id)) {
            newSelection.delete(id);
          } else {
            newSelection.add(id);
          }
          return { selectedGuestIds: newSelection };
        }),

      selectAllGuests: (ids) => set({ selectedGuestIds: new Set(ids) }),

      clearSelection: () => set({ selectedGuestIds: new Set() }),

      isGuestSelected: (id) => get().selectedGuestIds.has(id),

      getSelectedCount: () => get().selectedGuestIds.size,

      // ============================================
      // INITIAL STATE - MODALS
      // ============================================
      isAddModalOpen: false,
      isEditModalOpen: false,
      editingGuestId: null,
      isDeleteConfirmOpen: false,
      deletingGuestId: null,
      isBulkActionModalOpen: false,

      openAddModal: () => set({ isAddModalOpen: true }),
      closeAddModal: () => set({ isAddModalOpen: false }),

      openEditModal: (id) => set({ isEditModalOpen: true, editingGuestId: id }),
      closeEditModal: () =>
        set({ isEditModalOpen: false, editingGuestId: null }),

      openDeleteConfirm: (id) =>
        set({ isDeleteConfirmOpen: true, deletingGuestId: id }),
      closeDeleteConfirm: () =>
        set({ isDeleteConfirmOpen: false, deletingGuestId: null }),

      openBulkActionModal: () => set({ isBulkActionModalOpen: true }),
      closeBulkActionModal: () => set({ isBulkActionModalOpen: false }),

      // ============================================
      // INITIAL STATE - VIEW PREFERENCES
      // ============================================
      viewMode: 'table',
      sortBy: 'createdAt',
      sortOrder: 'desc',

      setViewMode: (mode) => set({ viewMode: mode }),
      setSorting: (by, order) => set({ sortBy: by, sortOrder: order }),
    }),
    {
      name: 'guest-ui-store', // LocalStorage key
      // Only persist these fields
      partialize: (state) => ({
        viewMode: state.viewMode,
        pageSize: state.pageSize,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
      }),
    }
  )
);
