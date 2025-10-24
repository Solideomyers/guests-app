import React from 'react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useUIStore } from '../stores';
import { GuestStatus } from '../api/types';

/**
 * ActiveFiltersBadges Component
 * Displays active filters as removable badges
 * Allows users to see and clear individual filters
 */

const ActiveFiltersBadges: React.FC = () => {
  const {
    statusFilter,
    setStatusFilter,
    isPastorFilter,
    setIsPastorFilter,
    churchFilter,
    setChurchFilter,
    cityFilter,
    setCityFilter,
    searchQuery,
    setSearchQuery,
  } = useUIStore();

  // Calculate active filters
  const hasStatusFilter = statusFilter !== 'ALL';
  const hasPastorFilter = isPastorFilter !== null;
  const hasChurchFilter = churchFilter !== '';
  const hasCityFilter = cityFilter !== '';
  const hasSearchQuery = searchQuery !== '';

  const hasAnyFilter =
    hasStatusFilter ||
    hasPastorFilter ||
    hasChurchFilter ||
    hasCityFilter ||
    hasSearchQuery;

  if (!hasAnyFilter) return null;

  const getStatusLabel = (status: GuestStatus | 'ALL') => {
    switch (status) {
      case GuestStatus.CONFIRMED:
        return 'Confirmados';
      case GuestStatus.PENDING:
        return 'Pendientes';
      case GuestStatus.DECLINED:
        return 'Rechazados';
      default:
        return 'Todos';
    }
  };

  const clearAllFilters = () => {
    setStatusFilter('ALL');
    setIsPastorFilter(null);
    setChurchFilter('');
    setCityFilter('');
    setSearchQuery('');
  };

  return (
    <div className='flex flex-wrap items-center gap-2 mb-4 p-3 bg-muted/50 rounded-lg border border-border'>
      <span className='text-sm font-medium text-muted-foreground'>
        Filtros activos:
      </span>

      {hasSearchQuery && (
        <Badge
          variant='secondary'
          className='gap-1 pr-1 cursor-pointer hover:bg-secondary/80'
          onClick={() => setSearchQuery('')}
        >
          Búsqueda: "{searchQuery}"
          <X className='h-3 w-3' />
        </Badge>
      )}

      {hasStatusFilter && (
        <Badge
          variant='secondary'
          className='gap-1 pr-1 cursor-pointer hover:bg-secondary/80'
          onClick={() => setStatusFilter('ALL')}
        >
          Estado: {getStatusLabel(statusFilter)}
          <X className='h-3 w-3' />
        </Badge>
      )}

      {hasPastorFilter && (
        <Badge
          variant='secondary'
          className='gap-1 pr-1 cursor-pointer hover:bg-secondary/80'
          onClick={() => setIsPastorFilter(null)}
        >
          {isPastorFilter ? 'Solo Pastores' : 'No Pastores'}
          <X className='h-3 w-3' />
        </Badge>
      )}

      {hasChurchFilter && (
        <Badge
          variant='secondary'
          className='gap-1 pr-1 cursor-pointer hover:bg-secondary/80'
          onClick={() => setChurchFilter('')}
        >
          Iglesia: {churchFilter}
          <X className='h-3 w-3' />
        </Badge>
      )}

      {hasCityFilter && (
        <Badge
          variant='secondary'
          className='gap-1 pr-1 cursor-pointer hover:bg-secondary/80'
          onClick={() => setCityFilter('')}
        >
          Ciudad: {cityFilter}
          <X className='h-3 w-3' />
        </Badge>
      )}

      <button
        onClick={clearAllFilters}
        className='ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2'
      >
        Limpiar todos
      </button>
    </div>
  );
};

export default ActiveFiltersBadges;
