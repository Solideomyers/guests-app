import React from 'react';
import { AttendanceStatus } from '../types';
import { GuestStatus } from '../api/types';
import { useUIStore } from '../stores';

/**
 * StatusFilter Component
 * Uses Zustand store directly - no prop drilling needed
 * Handles type conversion between frontend (AttendanceStatus) and backend (GuestStatus)
 */

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

// Map backend GuestStatus to frontend AttendanceStatus
const mapToAttendanceStatus = (
  status: GuestStatus | 'ALL'
): AttendanceStatus | 'All' => {
  if (status === 'ALL') return 'All';
  switch (status) {
    case GuestStatus.PENDING:
      return AttendanceStatus.PENDING;
    case GuestStatus.CONFIRMED:
      return AttendanceStatus.CONFIRMED;
    case GuestStatus.DECLINED:
      return AttendanceStatus.DECLINED;
    default:
      return AttendanceStatus.PENDING;
  }
};

// Map frontend AttendanceStatus to backend GuestStatus
const mapToGuestStatus = (
  status: AttendanceStatus | 'All'
): GuestStatus | 'ALL' => {
  if (status === 'All') return 'ALL';
  switch (status) {
    case AttendanceStatus.PENDING:
      return GuestStatus.PENDING;
    case AttendanceStatus.CONFIRMED:
      return GuestStatus.CONFIRMED;
    case AttendanceStatus.DECLINED:
      return GuestStatus.DECLINED;
    default:
      return 'ALL';
  }
};

const StatusFilter: React.FC = () => {
  const statusFilter = useUIStore((state) => state.statusFilter);
  const setStatusFilter = useUIStore((state) => state.setStatusFilter);

  const activeFilter = mapToAttendanceStatus(statusFilter);

  const handleFilterChange = (status: AttendanceStatus | 'All') => {
    const backendStatus = mapToGuestStatus(status);
    setStatusFilter(backendStatus);
  };

  return (
    <div className='flex items-center border-b border-border mb-4'>
      <nav className='-mb-px flex space-x-6' aria-label='Tabs'>
        {filterOptions.map((status) => {
          const isActive = activeFilter === status;
          return (
            <button
              key={status}
              onClick={() => handleFilterChange(status)}
              className={`whitespace-nowrap py-3 px-1 border-b-2 text-sm transition-colors duration-200
                ${
                  isActive
                    ? 'border-primary text-primary font-bold'
                    : 'border-transparent text-muted-foreground/70 font-medium hover:text-foreground hover:border-border'
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
