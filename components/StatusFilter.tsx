import React from 'react';
import { AttendanceStatus } from '../types';

interface StatusFilterProps {
  activeFilter: AttendanceStatus | 'All';
  onFilterChange: (status: AttendanceStatus | 'All') => void;
}

const filterOptions: (AttendanceStatus | 'All')[] = [
  'All',
  AttendanceStatus.PENDING,
  AttendanceStatus.CONFIRMED,
  AttendanceStatus.DECLINED,
];

const filterLabels: Record<AttendanceStatus | 'All', string> = {
  All: 'Todos',
  [AttendanceStatus.PENDING]: 'Pendientes',
  [AttendanceStatus.CONFIRMED]: 'Confirmados',
  [AttendanceStatus.DECLINED]: 'Rechazados',
};

const StatusFilter: React.FC<StatusFilterProps> = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="flex items-center border-b border-slate-200 mb-4">
      <nav className="-mb-px flex space-x-6" aria-label="Tabs">
        {filterOptions.map((status) => {
          const isActive = activeFilter === status;
          return (
            <button
              key={status}
              onClick={() => onFilterChange(status)}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              {filterLabels[status]}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default StatusFilter;