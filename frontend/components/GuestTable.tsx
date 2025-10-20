import React from 'react';
import {
  Guest,
  AttendanceStatus,
  SortConfig,
  SortableGuestKeys,
} from '../types';
import GuestRow from './GuestRow';
import { EmptyState } from './EmptyState';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

interface GuestTableProps {
  guests: Guest[];
  onSort: (key: SortableGuestKeys) => void;
  sortConfig: SortConfig;
  onUpdateStatus: (id: number, status: AttendanceStatus) => void;
  onTogglePastorStatus: (id: number, isPastor: boolean) => void;
  onSelectGuest: (id: number) => void;
  selectedGuests: Set<number>;
  onSelectAll: () => void;
  isAllSelected: boolean;
  onDeleteGuest: (id: number) => void;
  onEditGuest: (guest: Guest) => void;
  onAddGuest: () => void;
}

const SortableTableHead: React.FC<{
  onSort: (key: SortableGuestKeys) => void;
  sortConfig: SortConfig;
  columnKey: SortableGuestKeys;
  title: string;
}> = ({ onSort, sortConfig, columnKey, title }) => {
  const isSorted = sortConfig.key === columnKey;
  const sortIcon = isSorted
    ? sortConfig.direction === 'ascending'
      ? '▲'
      : '▼'
    : '';

  return (
    <TableHead
      className='cursor-pointer select-none'
      onClick={() => onSort(columnKey)}
    >
      {title} <span className='text-muted-foreground ml-1'>{sortIcon}</span>
    </TableHead>
  );
};

const GuestTable: React.FC<GuestTableProps> = ({
  guests,
  onSort,
  sortConfig,
  onUpdateStatus,
  onTogglePastorStatus,
  onSelectGuest,
  selectedGuests,
  onSelectAll,
  isAllSelected,
  onDeleteGuest,
  onEditGuest,
  onAddGuest,
}) => {
  // UX Principio #3: Mostrar EmptyState cuando no hay invitados
  // NOTA: Validación separada de filtros vs sin datos
  const hasNoGuests = guests.length === 0;

  // Si no hay invitados en absoluto, mostrar EmptyState
  if (hasNoGuests) {
    return <EmptyState onAddGuest={onAddGuest} />;
  }

  return (
    <div className='rounded-md border border-border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-12'>
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={onSelectAll}
                aria-label='Select all guests on this page'
              />
            </TableHead>
            <SortableTableHead
              onSort={onSort}
              sortConfig={sortConfig}
              columnKey='firstName'
              title='Nombre'
            />
            <SortableTableHead
              onSort={onSort}
              sortConfig={sortConfig}
              columnKey='church'
              title='Iglesia'
            />
            <SortableTableHead
              onSort={onSort}
              sortConfig={sortConfig}
              columnKey='city'
              title='Ciudad'
            />
            <SortableTableHead
              onSort={onSort}
              sortConfig={sortConfig}
              columnKey='phone'
              title='Teléfono'
            />
            <TableHead>Pastor</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className='w-24'>
              <span className='sr-only'>Acciones</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guests.map((guest) => (
            <GuestRow
              key={guest.id}
              guest={guest}
              onUpdateStatus={onUpdateStatus}
              onTogglePastorStatus={onTogglePastorStatus}
              isSelected={selectedGuests.has(guest.id)}
              onSelect={() => onSelectGuest(guest.id)}
              onDelete={() => onDeleteGuest(guest.id)}
              onEdit={() => onEditGuest(guest)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default GuestTable;
