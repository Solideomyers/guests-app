// FIX: Implement the GuestTable component
import React, { useEffect, useRef } from 'react';
import { Guest, AttendanceStatus, SortConfig, SortableGuestKeys } from '../types';
import GuestRow from './GuestRow';

interface GuestTableProps {
  guests: Guest[];
  onUpdateStatus: (id: number, newStatus: AttendanceStatus) => void;
  onDeleteGuest: (id: number) => void;
  onTogglePastorStatus: (id: number, isPastor: boolean) => void;
  requestSort: (key: SortableGuestKeys) => void;
  sortConfig: SortConfig | null;
  selectedGuestIds: number[];
  onSelectGuest: (id: number, checked: boolean) => void;
  onSelectAllOnPage: (checked: boolean) => void;
}

const SortableHeader: React.FC<{
  columnKey: SortableGuestKeys;
  title: string;
  requestSort: (key: SortableGuestKeys) => void;
  sortConfig: SortConfig | null;
}> = ({ columnKey, title, requestSort, sortConfig }) => {
  const isSorted = sortConfig?.key === columnKey;
  const directionIcon = sortConfig?.direction === 'ascending' ? '▲' : '▼';

  return (
    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
      <button onClick={() => requestSort(columnKey)} className="flex items-center gap-2 focus:outline-none">
        <span>{title}</span>
        {isSorted && <span className="text-slate-700">{directionIcon}</span>}
      </button>
    </th>
  );
};


const GuestTable: React.FC<GuestTableProps> = ({
  guests,
  onUpdateStatus,
  onDeleteGuest,
  onTogglePastorStatus,
  requestSort,
  sortConfig,
  selectedGuestIds,
  onSelectGuest,
  onSelectAllOnPage,
}) => {
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

  const guestsOnPageIds = guests.map(g => g.id);
  const numSelectedOnPage = guestsOnPageIds.filter(id => selectedGuestIds.includes(id)).length;
  
  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      selectAllCheckboxRef.current.checked = numSelectedOnPage === guestsOnPageIds.length && guestsOnPageIds.length > 0;
      selectAllCheckboxRef.current.indeterminate = numSelectedOnPage > 0 && numSelectedOnPage < guestsOnPageIds.length;
    }
  }, [numSelectedOnPage, guestsOnPageIds.length]);
  
  return (
    <div className="overflow-x-auto">
      <div className="align-middle inline-block min-w-full">
        <div className="overflow-hidden border-b border-slate-200">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left">
                  <input
                    ref={selectAllCheckboxRef}
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    onChange={(e) => onSelectAllOnPage(e.target.checked)}
                    aria-label="Seleccionar todos los invitados en esta página"
                  />
                </th>
                <SortableHeader columnKey="firstName" title="Nombre Completo" requestSort={requestSort} sortConfig={sortConfig} />
                <SortableHeader columnKey="church" title="Iglesia" requestSort={requestSort} sortConfig={sortConfig} />
                <SortableHeader columnKey="city" title="Ciudad" requestSort={requestSort} sortConfig={sortConfig} />
                <SortableHeader columnKey="phone" title="Teléfono" requestSort={requestSort} sortConfig={sortConfig} />
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Pastor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Estatus
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Cambiar Estatus
                </th>
                 <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {guests.length > 0 ? (
                guests.map((guest) => (
                  <GuestRow 
                    key={guest.id} 
                    guest={guest} 
                    onUpdateStatus={onUpdateStatus} 
                    onDeleteGuest={onDeleteGuest}
                    onTogglePastorStatus={onTogglePastorStatus}
                    isSelected={selectedGuestIds.includes(guest.id)}
                    onSelectGuest={onSelectGuest}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center text-sm text-slate-500">
                    No hay invitados que coincidan con la búsqueda o filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GuestTable;