import React, { useState } from 'react';
import { AttendanceStatus } from '../types';

interface BulkActionsToolbarProps {
  selectedCount: number;
  onDelete: () => void;
  onUpdateStatus: (status: AttendanceStatus) => void;
  onClearSelection: () => void;
  onMarkAsPastor: () => void;
  onUnmarkAsPastor: () => void;
}

const BulkActionsToolbar: React.FC<BulkActionsToolbarProps> = ({
  selectedCount,
  onDelete,
  onUpdateStatus,
  onClearSelection,
  onMarkAsPastor,
  onUnmarkAsPastor
}) => {
  const [status, setStatus] = useState<AttendanceStatus | ''>('');

  const handleApplyStatus = () => {
    if (status) {
      onUpdateStatus(status);
    } else {
      alert('Por favor, seleccione un estatus para aplicar.');
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
      <div className="flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-blue-800 bg-blue-100 px-3 py-1 rounded-full">
            {selectedCount} seleccionado(s)
          </span>
          <button
            onClick={onClearSelection}
            className="text-sm text-blue-600 hover:underline focus:outline-none"
          >
            Limpiar
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap justify-center">
        {/* Status Action */}
        <div className="flex items-center">
            <select
                aria-label="Cambiar estatus a"
                value={status}
                onChange={(e) => setStatus(e.target.value as AttendanceStatus)}
                className="h-9 rounded-l-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            >
                <option value="" disabled>Cambiar estatus...</option>
                <option value={AttendanceStatus.PENDING}>Pendiente</option>
                <option value={AttendanceStatus.CONFIRMED}>Confirmado</option>
                <option value={AttendanceStatus.DECLINED}>Rechazado</option>
            </select>
            <button
                onClick={handleApplyStatus}
                disabled={!status}
                className="h-9 px-3 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Aplicar
            </button>
        </div>

        {/* Pastor Actions */}
        <div className="flex items-center">
          <button 
            onClick={onMarkAsPastor}
            className="h-9 px-3 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-l-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Marcar Pastor
          </button>
          <button 
            onClick={onUnmarkAsPastor}
            className="h-9 px-3 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-r-md border-l-0 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Quitar Marca
          </button>
        </div>
        
        {/* Divider */}
        <div className="h-6 border-l border-blue-200 mx-1 hidden sm:block"></div>

        {/* Delete Action */}
        <button
          onClick={onDelete}
          className="flex items-center gap-2 h-9 px-3 text-sm font-medium text-red-700 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.067-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
          <span>Eliminar</span>
        </button>
      </div>
    </div>
  );
};

export default BulkActionsToolbar;
