import React from 'react';
import {
  Guest,
  AttendanceStatus,
  SortConfig,
  SortableGuestKeys,
} from '../types';
import GuestRow from './GuestRow';

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
}

const TableHeader: React.FC<{
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
    <th
      scope='col'
      className='px-2 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer'
      onClick={() => onSort(columnKey)}
    >
      {title} <span className='text-slate-400'>{sortIcon}</span>
    </th>
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
}) => {
  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full divide-y divide-slate-200'>
        <thead className='bg-slate-50'>
          <tr>
            <th scope='col' className='p-4'>
              <input
                type='checkbox'
                className='h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500'
                checked={isAllSelected}
                onChange={onSelectAll}
                aria-label='Select all guests on this page'
              />
            </th>
            <TableHeader
              onSort={onSort}
              sortConfig={sortConfig}
              columnKey='firstName'
              title='Nombre'
            />
            <TableHeader
              onSort={onSort}
              sortConfig={sortConfig}
              columnKey='church'
              title='Iglesia'
            />
            <TableHeader
              onSort={onSort}
              sortConfig={sortConfig}
              columnKey='city'
              title='Ciudad'
            />
            <TableHeader
              onSort={onSort}
              sortConfig={sortConfig}
              columnKey='phone'
              title='Teléfono'
            />
            <th
              scope='col'
              className='px-2 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'
            >
              Pastor
            </th>
            <th
              scope='col'
              className='px-2 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'
            >
              Estado
            </th>
            <th scope='col' className='relative px-2 sm:px-6 py-3'>
              <span className='sr-only'>Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-slate-200'>
          {guests.length > 0 ? (
            guests.map((guest) => (
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
            ))
          ) : (
            <tr>
              <td colSpan={8} className='px-6 py-16'>
                <div className='flex flex-col items-center justify-center text-center'>
                  <svg
                    className='w-16 h-16 text-slate-300 mb-4'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                    />
                  </svg>
                  <h3 className='text-lg font-medium text-slate-900 mb-2'>
                    No se encontraron invitados
                  </h3>
                  <p className='text-sm text-slate-500 max-w-sm'>
                    No hay invitados que coincidan con los filtros actuales.
                    Intenta ajustar tu búsqueda o agregar un nuevo invitado.
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GuestTable;
