import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUIStore } from './uiStore';
import type { GuestStatus } from '../api/types';

describe('uiStore', () => {
  beforeEach(() => {
    // Clear localStorage to prevent persistence between tests
    localStorage.clear();

    // Reset store to initial state before each test
    const { result } = renderHook(() => useUIStore());
    act(() => {
      result.current.clearFilters();
      result.current.clearSelection();
      result.current.closeAddModal();
      result.current.closeEditModal();
      result.current.closeDeleteConfirm();
      result.current.closeBulkActionModal();
      result.current.resetPagination();
      result.current.setPageSize(10); // Explicitly set default
      result.current.setViewMode('table');
      result.current.setSorting('createdAt', 'desc');
      result.current.setDarkMode(false);
    });
  });

  // ============================================
  // FILTERS & SEARCH TESTS
  // ============================================

  describe('Filters & Search', () => {
    it('should set search query', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setSearchQuery('John Doe');
      });

      expect(result.current.searchQuery).toBe('John Doe');
    });

    it('should reset currentPage when setting search query', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setCurrentPage(5);
        result.current.setSearchQuery('test');
      });

      expect(result.current.currentPage).toBe(1);
    });

    it('should set status filter', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setStatusFilter('CONFIRMED' as GuestStatus);
      });

      expect(result.current.statusFilter).toBe('CONFIRMED');
    });

    it('should set isPastor filter to true', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setIsPastorFilter(true);
      });

      expect(result.current.isPastorFilter).toBe(true);
    });

    it('should set isPastor filter to false', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setIsPastorFilter(false);
      });

      expect(result.current.isPastorFilter).toBe(false);
    });

    it('should set isPastor filter to null', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setIsPastorFilter(true);
        result.current.setIsPastorFilter(null);
      });

      expect(result.current.isPastorFilter).toBeNull();
    });

    it('should set city filter', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setCityFilter('New York');
      });

      expect(result.current.cityFilter).toBe('New York');
    });

    it('should set church filter', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setChurchFilter('Central Church');
      });

      expect(result.current.churchFilter).toBe('Central Church');
    });

    it('should clear all filters', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setSearchQuery('John');
        result.current.setStatusFilter('CONFIRMED' as GuestStatus);
        result.current.setIsPastorFilter(true);
        result.current.setCityFilter('NYC');
        result.current.setChurchFilter('Main Church');
        result.current.setCurrentPage(5);
      });

      act(() => {
        result.current.clearFilters();
      });

      expect(result.current.searchQuery).toBe('');
      expect(result.current.statusFilter).toBe('ALL');
      expect(result.current.isPastorFilter).toBeNull();
      expect(result.current.cityFilter).toBe('');
      expect(result.current.churchFilter).toBe('');
      expect(result.current.currentPage).toBe(1);
    });

    it('should reset page when changing filters', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setCurrentPage(5);
      });

      expect(result.current.currentPage).toBe(5);

      act(() => {
        result.current.setStatusFilter('CONFIRMED' as GuestStatus);
      });

      expect(result.current.currentPage).toBe(1);
    });
  });

  // ============================================
  // PAGINATION TESTS
  // ============================================

  describe('Pagination', () => {
    it('should set current page', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setCurrentPage(3);
      });

      expect(result.current.currentPage).toBe(3);
    });

    it('should set page size', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setPageSize(25);
      });

      expect(result.current.pageSize).toBe(25);
    });

    it('should reset page to 1 when changing page size', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setCurrentPage(5);
        result.current.setPageSize(50);
      });

      expect(result.current.currentPage).toBe(1);
      expect(result.current.pageSize).toBe(50);
    });

    it('should reset pagination', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setCurrentPage(10);
      });

      act(() => {
        result.current.resetPagination();
      });

      expect(result.current.currentPage).toBe(1);
    });

    it('should have default page size of 10', () => {
      const { result } = renderHook(() => useUIStore());

      expect(result.current.pageSize).toBe(10);
    });
  });

  // ============================================
  // SELECTION TESTS
  // ============================================

  describe('Selection', () => {
    it('should toggle guest selection on', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.toggleGuestSelection(1);
      });

      expect(result.current.isGuestSelected(1)).toBe(true);
      expect(result.current.getSelectedCount()).toBe(1);
    });

    it('should toggle guest selection off', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.toggleGuestSelection(1);
        result.current.toggleGuestSelection(1);
      });

      expect(result.current.isGuestSelected(1)).toBe(false);
      expect(result.current.getSelectedCount()).toBe(0);
    });

    it('should toggle multiple guests', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.toggleGuestSelection(1);
        result.current.toggleGuestSelection(2);
        result.current.toggleGuestSelection(3);
      });

      expect(result.current.getSelectedCount()).toBe(3);
      expect(result.current.isGuestSelected(1)).toBe(true);
      expect(result.current.isGuestSelected(2)).toBe(true);
      expect(result.current.isGuestSelected(3)).toBe(true);
    });

    it('should select all guests', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.selectAllGuests([1, 2, 3, 4, 5]);
      });

      expect(result.current.getSelectedCount()).toBe(5);
      expect(result.current.isGuestSelected(1)).toBe(true);
      expect(result.current.isGuestSelected(5)).toBe(true);
    });

    it('should clear selection', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.selectAllGuests([1, 2, 3]);
      });

      expect(result.current.getSelectedCount()).toBe(3);

      act(() => {
        result.current.clearSelection();
      });

      expect(result.current.getSelectedCount()).toBe(0);
      expect(result.current.isGuestSelected(1)).toBe(false);
    });

    it('should check if guest is selected', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.toggleGuestSelection(5);
      });

      expect(result.current.isGuestSelected(5)).toBe(true);
      expect(result.current.isGuestSelected(99)).toBe(false);
    });

    it('should get selected count', () => {
      const { result } = renderHook(() => useUIStore());

      expect(result.current.getSelectedCount()).toBe(0);

      act(() => {
        result.current.selectAllGuests([1, 2, 3, 4, 5, 6, 7]);
      });

      expect(result.current.getSelectedCount()).toBe(7);
    });

    it('should handle empty selection', () => {
      const { result } = renderHook(() => useUIStore());

      expect(result.current.selectedGuestIds.size).toBe(0);
      expect(result.current.getSelectedCount()).toBe(0);
    });
  });

  // ============================================
  // MODALS TESTS
  // ============================================

  describe('Modals', () => {
    it('should open and close add modal', () => {
      const { result } = renderHook(() => useUIStore());

      expect(result.current.isAddModalOpen).toBe(false);

      act(() => {
        result.current.openAddModal();
      });

      expect(result.current.isAddModalOpen).toBe(true);

      act(() => {
        result.current.closeAddModal();
      });

      expect(result.current.isAddModalOpen).toBe(false);
    });

    it('should open and close edit modal', () => {
      const { result } = renderHook(() => useUIStore());

      expect(result.current.isEditModalOpen).toBe(false);
      expect(result.current.editingGuestId).toBeNull();

      act(() => {
        result.current.openEditModal(123);
      });

      expect(result.current.isEditModalOpen).toBe(true);
      expect(result.current.editingGuestId).toBe(123);

      act(() => {
        result.current.closeEditModal();
      });

      expect(result.current.isEditModalOpen).toBe(false);
      expect(result.current.editingGuestId).toBeNull();
    });

    it('should open and close delete confirm dialog', () => {
      const { result } = renderHook(() => useUIStore());

      expect(result.current.isDeleteConfirmOpen).toBe(false);
      expect(result.current.deletingGuestId).toBeNull();

      act(() => {
        result.current.openDeleteConfirm(456);
      });

      expect(result.current.isDeleteConfirmOpen).toBe(true);
      expect(result.current.deletingGuestId).toBe(456);

      act(() => {
        result.current.closeDeleteConfirm();
      });

      expect(result.current.isDeleteConfirmOpen).toBe(false);
      expect(result.current.deletingGuestId).toBeNull();
    });

    it('should open and close bulk action modal', () => {
      const { result } = renderHook(() => useUIStore());

      expect(result.current.isBulkActionModalOpen).toBe(false);

      act(() => {
        result.current.openBulkActionModal();
      });

      expect(result.current.isBulkActionModalOpen).toBe(true);

      act(() => {
        result.current.closeBulkActionModal();
      });

      expect(result.current.isBulkActionModalOpen).toBe(false);
    });

    it('should handle multiple modals independently', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.openAddModal();
        result.current.openEditModal(1);
        result.current.openDeleteConfirm(2);
      });

      expect(result.current.isAddModalOpen).toBe(true);
      expect(result.current.isEditModalOpen).toBe(true);
      expect(result.current.isDeleteConfirmOpen).toBe(true);
    });
  });

  // ============================================
  // VIEW PREFERENCES TESTS
  // ============================================

  describe('View Preferences', () => {
    it('should set view mode to table', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setViewMode('table');
      });

      expect(result.current.viewMode).toBe('table');
    });

    it('should set view mode to grid', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setViewMode('grid');
      });

      expect(result.current.viewMode).toBe('grid');
    });

    it('should set sorting', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setSorting('firstName', 'asc');
      });

      expect(result.current.sortBy).toBe('firstName');
      expect(result.current.sortOrder).toBe('asc');
    });

    it('should toggle dark mode on', () => {
      const { result } = renderHook(() => useUIStore());

      expect(result.current.darkMode).toBe(false);

      act(() => {
        result.current.toggleDarkMode();
      });

      expect(result.current.darkMode).toBe(true);
    });

    it('should toggle dark mode off', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.toggleDarkMode();
        result.current.toggleDarkMode();
      });

      expect(result.current.darkMode).toBe(false);
    });

    it('should set dark mode explicitly', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setDarkMode(true);
      });

      expect(result.current.darkMode).toBe(true);

      act(() => {
        result.current.setDarkMode(false);
      });

      expect(result.current.darkMode).toBe(false);
    });

    it('should have default view preferences', () => {
      const { result } = renderHook(() => useUIStore());

      expect(result.current.viewMode).toBe('table');
      expect(result.current.sortBy).toBe('createdAt');
      expect(result.current.sortOrder).toBe('desc');
      expect(result.current.darkMode).toBe(false);
    });
  });

  // ============================================
  // INTEGRATION TESTS
  // ============================================

  describe('Integration', () => {
    it('should handle complex workflow', () => {
      const { result } = renderHook(() => useUIStore());

      // Set filters
      act(() => {
        result.current.setSearchQuery('John');
        result.current.setStatusFilter('CONFIRMED' as GuestStatus);
        result.current.setIsPastorFilter(true);
      });

      // Select guests
      act(() => {
        result.current.selectAllGuests([1, 2, 3]);
      });

      // Open modal
      act(() => {
        result.current.openBulkActionModal();
      });

      expect(result.current.searchQuery).toBe('John');
      expect(result.current.statusFilter).toBe('CONFIRMED');
      expect(result.current.getSelectedCount()).toBe(3);
      expect(result.current.isBulkActionModalOpen).toBe(true);

      // Clear everything
      act(() => {
        result.current.clearFilters();
        result.current.clearSelection();
        result.current.closeBulkActionModal();
      });

      expect(result.current.searchQuery).toBe('');
      expect(result.current.getSelectedCount()).toBe(0);
      expect(result.current.isBulkActionModalOpen).toBe(false);
    });

    it('should maintain state across multiple operations', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setSearchQuery('test');
        result.current.setCurrentPage(5);
        result.current.toggleGuestSelection(1);
        result.current.setViewMode('grid');
      });

      expect(result.current.searchQuery).toBe('test');
      expect(result.current.currentPage).toBe(5);
      expect(result.current.isGuestSelected(1)).toBe(true);
      expect(result.current.viewMode).toBe('grid');
    });
  });
});
