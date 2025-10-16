import React from 'react';
import { AttendanceStatus } from '../types';

interface BulkActionsToolbarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onDelete: () => void;
  onChangeStatus: (status: AttendanceStatus) => void;
}

const BulkActionsToolbar: React.FC<BulkActionsToolbarProps> = ({
  selectedCount,
  onClearSelection,
  onDelete,
  onChangeStatus,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button onClick={onClearSelection} className="text-blue-600 hover:text-blue-800" aria-label="Clear selection">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
        <span className="text-sm font-medium text-blue-800">{selectedCount} seleccionado(s)</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-600 mr-2">Acciones:</span>
        <select
          onChange={(e) => {
            onChangeStatus(e.target.value as AttendanceStatus);
            e.target.value = "";
          }}
          className="px-3 py-1.5 text-sm border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          defaultValue=""
          aria-label="Change status for selected guests"
        >
          <option value="" disabled>Cambiar estado...</option>
          <option value={AttendanceStatus.CONFIRMED}>Confirmado</option>
          <option value={AttendanceStatus.PENDING}>Pendiente</option>
          <option value={AttendanceStatus.DECLINED}>Rechazado</option>
        </select>
        <button
          onClick={onDelete}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 bg-red-100 hover:bg-red-200 rounded-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
             <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
          <span>Eliminar</span>
        </button>
      </div>
    </div>
  );
};

export default BulkActionsToolbar;
