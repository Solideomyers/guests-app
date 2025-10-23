import { Guest, AttendanceStatus } from '../types';
import { Edit2, Trash2, Phone, MapPin, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import GuestAvatar from './GuestAvatar';
import { cn } from '../lib/utils';
import { useState } from 'react';

// Status configuration
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

interface GuestCardProps {
  guest: Guest;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onEdit: (guest: Guest) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: Guest['status']) => void;
  onTogglePastorStatus: (id: number, isPastor: boolean) => void;
}

export function GuestCard({
  guest,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onStatusChange,
  onTogglePastorStatus,
}: GuestCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const initials =
    `${guest.firstName.charAt(0)}${guest.lastName.charAt(0)}`.toUpperCase();

  const handleDelete = () => {
    onDelete(guest.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <div
        className={cn(
          'relative rounded-lg border bg-card p-4 transition-all hover:shadow-md',
          isSelected && 'border-primary ring-2 ring-primary ring-offset-2'
        )}
      >
        {/* Checkbox de selección */}
        <input
          type='checkbox'
          checked={isSelected}
          onChange={() => onSelect(guest.id)}
          className='absolute left-4 top-4 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary'
          aria-label={`Select ${guest.firstName} ${guest.lastName}`}
        />

        {/* Header con avatar y nombre */}
        <div className='ml-6 flex items-start justify-between'>
          <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary'>
              {initials}
            </div>
            <div>
              <h3 className='font-semibold text-foreground'>
                {guest.firstName} {guest.lastName}
              </h3>
              <div className='mt-1 flex items-center gap-1 text-sm text-muted-foreground'>
                <Phone className='h-3 w-3' />
                <span>{guest.phone}</span>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className='flex gap-2'>
            <button
              onClick={() => onEdit(guest)}
              className='rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
              aria-label={`Edit ${guest.firstName}`}
            >
              <Edit2 className='h-4 w-4' />
            </button>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className='rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive'
              aria-label={`Delete ${guest.firstName}`}
            >
              <Trash2 className='h-4 w-4' />
            </button>
          </div>
        </div>

        {/* Detalles del invitado */}
        <div className='ml-6 mt-4 space-y-2'>
          {guest.church && (
            <div className='flex items-center gap-2 text-sm'>
              <Building2 className='h-4 w-4 text-muted-foreground' />
              <span className='text-foreground'>{guest.church}</span>
            </div>
          )}

          {guest.city && (
            <div className='flex items-center gap-2 text-sm'>
              <MapPin className='h-4 w-4 text-muted-foreground' />
              <span className='text-foreground'>{guest.city}</span>
            </div>
          )}

          {/* Estado y Pastor */}
          <div className='flex items-center justify-between pt-2'>
            <div className='flex items-center gap-2'>
              <Badge variant={statusVariants[guest.status] as any}>
                {statusLabels[guest.status]}
              </Badge>
              <Select
                value={guest.status}
                onValueChange={(value) =>
                  onStatusChange(guest.id, value as AttendanceStatus)
                }
              >
                <SelectTrigger className='h-8 w-auto px-2 border-border bg-background hover:bg-accent'>
                  <span className='sr-only'>Cambiar estado</span>
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

            <button
              onClick={() => onTogglePastorStatus(guest.id, !guest.isPastor)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                guest.isPastor
                  ? 'bg-primary/10 text-primary'
                  : 'bg-muted text-muted-foreground'
              )}
              aria-label={
                guest.isPastor ? 'Remove pastor status' : 'Mark as pastor'
              }
            >
              Pastor
            </button>
          </div>
        </div>
      </div>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        guestName={`${guest.firstName} ${guest.lastName}`}
        onConfirm={handleDelete}
      />
    </>
  );
}
