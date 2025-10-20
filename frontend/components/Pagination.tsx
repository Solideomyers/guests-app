import React, { useEffect } from 'react';
import { usePrefetchGuests } from '../hooks';
import type { FilterGuestDto } from '../api/types';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  filters?: FilterGuestDto;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  filters,
}) => {
  const { prefetchPage } = usePrefetchGuests();

  // Prefetch adjacent pages for instant navigation
  useEffect(() => {
    // Prefetch next page if exists
    if (currentPage < totalPages) {
      prefetchPage({
        ...filters,
        page: currentPage + 1,
        limit: itemsPerPage,
      });
    }

    // Prefetch previous page if exists
    if (currentPage > 1) {
      prefetchPage({
        ...filters,
        page: currentPage - 1,
        limit: itemsPerPage,
      });
    }
  }, [currentPage, totalPages, itemsPerPage, filters, prefetchPage]);

  if (totalItems === 0) {
    return null;
  }

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <nav
      className='flex items-center justify-between border-t border-border bg-card px-4 py-3 sm:px-6 transition-colors'
      aria-label='Pagination'
    >
      <div className='hidden sm:block'>
        <p className='text-sm text-muted-foreground'>
          Mostrando{' '}
          <span className='font-bold text-foreground'>{startItem}</span> a{' '}
          <span className='font-bold text-foreground'>{endItem}</span> de{' '}
          <span className='font-bold text-foreground'>{totalItems}</span>{' '}
          resultados
        </p>
      </div>
      <div className='flex flex-1 justify-between sm:justify-end gap-3'>
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className='relative inline-flex items-center rounded-md bg-card px-3 py-2 text-sm font-semibold text-foreground ring-1 ring-inset ring-border hover:bg-accent focus-visible:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all'
        >
          Anterior
        </button>
        <button
          onClick={handleNext}
          disabled={currentPage >= totalPages}
          className='relative inline-flex items-center rounded-md bg-card px-3 py-2 text-sm font-semibold text-foreground ring-1 ring-inset ring-border hover:bg-accent focus-visible:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all'
        >
          Siguiente
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
