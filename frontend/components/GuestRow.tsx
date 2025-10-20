import React, { useState } from 'react';
import { Guest, AttendanceStatus } from '../types';
import { usePrefetchGuests } from '../hooks';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';

interface GuestRowProps {
  guest: Guest;
  onUpdateStatus: (id: number, status: AttendanceStatus) => void;
  onTogglePastorStatus: (id: number, isPastor: boolean) => void;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

// Status configuration for badges

const statusVariants: Record<
  AttendanceStatus,
  'default' | 'secondary' | 'destructive'
> = {
  [AttendanceStatus.CONFIRMED]: 'default',
  [AttendanceStatus.PENDING]: 'secondary',
  [AttendanceStatus.DECLINED]: 'destructive',
};

const statusLabels: Record<AttendanceStatus, string> = {
  [AttendanceStatus.CONFIRMED]: 'Confirmado',
  [AttendanceStatus.PENDING]: 'Pendiente',
  [AttendanceStatus.DECLINED]: 'Rechazado',
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
  const { prefetchGuestById } = usePrefetchGuests();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Prefetch guest details on hover for faster edit modal
  const handleMouseEnter = () => {
    prefetchGuestById(guest.id);
  };

  // Handle delete click - show confirmation dialog (UX Principle #2)
  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  // Handle confirmed delete
  const handleConfirmDelete = () => {
    setShowDeleteDialog(false);
    onDelete();
  };

  return (
    <>
      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        guestName={`${guest.firstName} ${guest.lastName}`}
        onConfirm={handleConfirmDelete}
      />
      <tr
        className={isSelected ? 'bg-blue-50' : 'hover:bg-muted/50'}
        onMouseEnter={handleMouseEnter}
      >
        <td className='p-4'>
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
            aria-label={`Select guest ${guest.firstName}`}
          />
        </td>
        <td className='px-2 sm:px-6 py-4 whitespace-nowrap'>
          <div className='text-sm font-medium text-foreground'>{`${guest.firstName} ${guest.lastName}`}</div>
          <div className='text-sm text-muted-foreground'>
            {guest.phone || 'Sin teléfono'}
          </div>
        </td>
        <td className='px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-muted-foreground'>
          {guest.church}
        </td>
        <td className='px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-muted-foreground'>
          {guest.city}
        </td>
        <td className='px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-muted-foreground'>
          {guest.phone}
        </td>
        <td className='px-2 sm:px-6 py-4 whitespace-nowrap'>
          <Checkbox
            checked={guest.isPastor}
            onCheckedChange={(checked) =>
              onTogglePastorStatus(guest.id, checked === true)
            }
            onClick={(e) => e.stopPropagation()}
            aria-label={`Mark ${guest.firstName} as pastor`}
          />
        </td>
        <td className='px-2 sm:px-6 py-4 whitespace-nowrap'>
          <div className='flex items-center gap-2'>
            <Badge variant={statusVariants[guest.status]}>
              {statusLabels[guest.status]}
            </Badge>
            <Select
              value={guest.status}
              onValueChange={(value) =>
                onUpdateStatus(guest.id, value as AttendanceStatus)
              }
            >
              <SelectTrigger className='w-8 h-8 p-0 border-none'>
                <span className='sr-only'>Cambiar estado</span>
                <svg
                  className='w-4 h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 9l-7 7-7-7'
                  />
                </svg>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={AttendanceStatus.PENDING}>
                  Pendiente
                </SelectItem>
                <SelectItem value={AttendanceStatus.CONFIRMED}>
                  Confirmado
                </SelectItem>
                <SelectItem value={AttendanceStatus.DECLINED}>
                  Rechazado
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </td>
        <td className='px-2 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
          <Button
            onClick={onEdit}
            variant='ghost'
            size='icon'
            className='h-8 w-8'
            aria-label={`Edit ${guest.firstName}`}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='w-5 h-5'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10'
              />
            </svg>
          </Button>
          <Button
            onClick={handleDeleteClick}
            variant='ghost'
            size='icon'
            className='h-8 w-8 text-destructive hover:text-destructive'
            aria-label={`Delete ${guest.firstName}`}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='w-5 h-5'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
              />
            </svg>
          </Button>
        </td>
      </tr>
    </>
  );
};

export default GuestRow;
