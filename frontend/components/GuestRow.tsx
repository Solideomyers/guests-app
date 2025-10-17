import React from 'react';
import { Guest, AttendanceStatus } from '../types';

interface GuestRowProps {
  guest: Guest;
  onUpdateStatus: (id: number, status: AttendanceStatus) => void;
  onTogglePastorStatus: (id: number, isPastor: boolean) => void;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

const statusClasses: Record<AttendanceStatus, string> = {
  [AttendanceStatus.CONFIRMED]: 'bg-green-100 text-green-800',
  [AttendanceStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [AttendanceStatus.DECLINED]: 'bg-red-100 text-red-800',
};

const GuestRow: React.FC<GuestRowProps> = ({
  guest,
  onUpdateStatus,
  onTogglePastorStatus,
  isSelected,
  onSelect,
  onDelete,
  onEdit,
}) => {
  return (
    <tr className={isSelected ? 'bg-blue-50' : 'hover:bg-slate-50'}>
      <td className="p-4">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          checked={isSelected}
          onChange={onSelect}
          aria-label={`Select guest ${guest.firstName}`}
        />
      </td>
      <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-slate-900">{`${guest.firstName} ${guest.lastName}`}</div>
        <div className="text-sm text-slate-500">{guest.phone || 'Sin teléfono'}</div>
      </td>
      <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-500">{guest.church}</td>
      <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-500">{guest.city}</td>
      <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-500">{guest.phone}</td>
      <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          checked={guest.isPastor}
          onChange={(e) => onTogglePastorStatus(guest.id, e.target.checked)}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Mark ${guest.firstName} as pastor`}
        />
      </td>
      <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
        <select
          value={guest.status}
          onChange={(e) => onUpdateStatus(guest.id, e.target.value as AttendanceStatus)}
          className={`w-32 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 border-transparent ${statusClasses[guest.status]}`}
          onClick={(e) => e.stopPropagation()}
        >
          <option value={AttendanceStatus.PENDING}>Pendiente</option>
          <option value={AttendanceStatus.CONFIRMED}>Confirmado</option>
          <option value={AttendanceStatus.DECLINED}>Rechazado</option>
        </select>
      </td>
      <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button onClick={onEdit} className="text-blue-600 hover:text-blue-900 p-1" aria-label={`Edit ${guest.firstName}`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
        </button>
        <button onClick={onDelete} className="text-red-600 hover:text-red-900 ml-2 p-1" aria-label={`Delete ${guest.firstName}`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
        </button>
      </td>
    </tr>
  );
};

export default GuestRow;
