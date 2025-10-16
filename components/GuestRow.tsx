

import React from 'react';
import { Guest, AttendanceStatus } from '../types';

interface GuestRowProps {
  guest: Guest;
  onUpdateStatus: (id: number, newStatus: AttendanceStatus) => void;
  onDeleteGuest: (id: number) => void;
  onTogglePastorStatus: (id: number, isPastor: boolean) => void;
  isSelected: boolean;
  onSelectGuest: (id: number, checked: boolean) => void;
}

const statusColorClasses: Record<AttendanceStatus, { bg: string; text: string; ring: string }> = {
  [AttendanceStatus.CONFIRMED]: { bg: 'bg-green-100', text: 'text-green-800', ring: 'focus:ring-green-500' },
  [AttendanceStatus.PENDING]: { bg: 'bg-yellow-100', text: 'text-yellow-800', ring: 'focus:ring-yellow-500' },
  [AttendanceStatus.DECLINED]: { bg: 'bg-red-100', text: 'text-red-800', ring: 'focus:ring-red-500' },
};

const StatusBadge: React.FC<{ status: AttendanceStatus }> = ({ status }) => {
    const { bg, text } = statusColorClasses[status];
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
            {status}
        </span>
    );
};

const GuestRow: React.FC<GuestRowProps> = ({ guest, onUpdateStatus, onDeleteGuest, onTogglePastorStatus, isSelected, onSelectGuest }) => {
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdateStatus(guest.id, e.target.value as AttendanceStatus);
  };

  const { bg, ring } = statusColorClasses[guest.status];

  return (
    <tr className={`transition-colors duration-200 ${isSelected ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelectGuest(guest.id, e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          aria-label={`Seleccionar a ${guest.firstName}`}
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-slate-900">{`${guest.firstName} ${guest.lastName}`}</div>
        <div className="text-sm text-slate-500">{guest.state}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
        {guest.church}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
        {guest.city}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
        {guest.phone || '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={guest.isPastor}
          onChange={(e) => onTogglePastorStatus(guest.id, e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          aria-label={`Marcar como pastor a ${guest.firstName}`}
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
         <StatusBadge status={guest.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <select
          value={guest.status}
          onChange={handleStatusChange}
          className={`w-36 rounded-md border-0 py-1.5 pl-3 pr-8 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 ${ring} ${bg} transition-all duration-200 cursor-pointer`}
        >
          <option value={AttendanceStatus.PENDING}>Pendiente</option>
          <option value={AttendanceStatus.CONFIRMED}>Confirmado</option>
          <option value={AttendanceStatus.DECLINED}>Rechazado</option>
        </select>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => onDeleteGuest(guest.id)}
          className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-md p-1 transition-colors duration-200"
          aria-label={`Eliminar a ${guest.firstName} ${guest.lastName}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.067-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </button>
      </td>
    </tr>
  );
};

export default GuestRow;