import React from 'react';
import { Button } from '@/components/ui/button';
import { AttendanceStatus } from '../types';

interface BulkActionsToolbarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onDelete: () => void;
  onChangeStatus: (status: AttendanceStatus) => void;
  onSetPastorStatus: (isPastor: boolean) => void;
}

const BulkActionsToolbar: React.FC<BulkActionsToolbarProps> = ({
  selectedCount,
  onClearSelection,
  onDelete,
  onChangeStatus,
  onSetPastorStatus,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className='bg-accent/10 border border-accent rounded-lg p-3 sm:p-4 flex flex-col gap-3 sm:gap-4'>
      {/* Header: Selection count and clear button */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Button
            onClick={onClearSelection}
            variant='ghost'
            size='sm'
            className='h-8 w-8 p-0 text-accent-foreground hover:text-foreground'
            aria-label='Clear selection'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='w-4 h-4'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M6 18 18 6M6 6l12 12'
              />
            </svg>
          </Button>
          <span className='text-sm font-medium text-foreground'>
            {selectedCount} seleccionado(s)
          </span>
        </div>
        <span className='hidden sm:inline text-xs text-muted-foreground'>
          Acciones en lote
        </span>
      </div>

      {/* Actions: Stacked on mobile, horizontal on desktop */}
      <div className='flex flex-col gap-2 w-full'>
        <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full'>
          <select
            onChange={(e) => {
              onChangeStatus(e.target.value as AttendanceStatus);
              e.target.value = '';
            }}
            className='w-full sm:w-auto px-3 py-2 text-sm border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground'
            defaultValue=''
            aria-label='Change status for selected guests'
          >
            <option value='' disabled>
              Cambiar estado...
            </option>
            <option value={AttendanceStatus.CONFIRMED}>Confirmado</option>
            <option value={AttendanceStatus.PENDING}>Pendiente</option>
            <option value={AttendanceStatus.DECLINED}>Rechazado</option>
          </select>
        </div>

        <div className='flex flex-col sm:flex-row gap-2 w-full'>
          <div className='flex items-center gap-0 w-full sm:w-auto'>
            <Button
              onClick={() => onSetPastorStatus(true)}
              variant='outline'
              size='sm'
              className='flex-1 sm:flex-none rounded-r-none text-xs sm:text-sm'
            >
              <span className='hidden sm:inline'>Marcar Pastor</span>
              <span className='sm:hidden'>✓ Pastor</span>
            </Button>
            <Button
              onClick={() => onSetPastorStatus(false)}
              variant='outline'
              size='sm'
              className='flex-1 sm:flex-none rounded-l-none border-l text-xs sm:text-sm'
            >
              <span className='hidden sm:inline'>Quitar Pastor</span>
              <span className='sm:hidden'>✗ Pastor</span>
            </Button>
          </div>
          <Button
            onClick={onDelete}
            variant='destructive'
            size='sm'
            className='flex items-center justify-center gap-1.5 w-full sm:w-auto'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='w-4 h-4'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
              />
            </svg>
            <span>Eliminar</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsToolbar;
