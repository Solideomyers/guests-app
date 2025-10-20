import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Guest } from '../types';
import { useUIStore } from '../stores';
import { guestFormSchema, type GuestFormData } from '../lib/validations';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import GuestAvatar from './GuestAvatar';

/**
 * AddGuestModal Component
 * Uses Zustand store directly for modal state - no prop drilling needed
 * Still receives onSave and guestToEdit as props since these are data operations
 */

interface AddGuestModalProps {
  onSave: (guest: Omit<Guest, 'registrationDate' | 'status'>) => boolean | void;
  guestToEdit: Guest | null;
}

const AddGuestModal: React.FC<AddGuestModalProps> = ({
  onSave,
  guestToEdit,
}) => {
  const isAddModalOpen = useUIStore((state) => state.isAddModalOpen);
  const isEditModalOpen = useUIStore((state) => state.isEditModalOpen);
  const closeAddModal = useUIStore((state) => state.closeAddModal);
  const closeEditModal = useUIStore((state) => state.closeEditModal);

  const isOpen = isAddModalOpen || isEditModalOpen;
  const onClose = guestToEdit ? closeEditModal : closeAddModal;

  // Preview state - true when showing preview, false when showing form
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<GuestFormData | null>(null);

  // React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<GuestFormData>({
    resolver: zodResolver(guestFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      address: '',
      state: '',
      city: '',
      church: '',
      phone: '',
      notes: '',
      isPastor: false,
    },
  });

  const isPastor = watch('isPastor');

  // Reset form when modal opens/closes or when editing
  useEffect(() => {
    if (isOpen) {
      setShowPreview(false);
      setPreviewData(null);
      if (guestToEdit) {
        reset({
          firstName: guestToEdit.firstName,
          lastName: guestToEdit.lastName,
          address: guestToEdit.address,
          state: guestToEdit.state,
          city: guestToEdit.city,
          church: guestToEdit.church,
          phone: guestToEdit.phone,
          notes: guestToEdit.notes,
          isPastor: guestToEdit.isPastor,
        });
      } else {
        reset({
          firstName: '',
          lastName: '',
          address: '',
          state: '',
          city: '',
          church: '',
          phone: '',
          notes: '',
          isPastor: false,
        });
      }
    }
  }, [isOpen, guestToEdit, reset]);

  // Handle form submission - show preview first for new guests
  const onFormSubmit = (data: GuestFormData) => {
    // If editing, save directly without preview
    if (guestToEdit) {
      const result = onSave({ ...data, id: guestToEdit.id });
      if (result !== false) {
        reset();
      }
    } else {
      // For new guests, show preview
      setPreviewData(data);
      setShowPreview(true);
    }
  };

  // Handle final confirmation from preview
  const onConfirmSave = () => {
    if (previewData) {
      const result = onSave({ ...previewData, id: guestToEdit?.id });
      if (result !== false) {
        reset();
        setShowPreview(false);
        setPreviewData(null);
      }
    }
  };

  // Go back to edit form
  const onBackToEdit = () => {
    setShowPreview(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='sm:max-w-[600px] max-h-[95vh] md:max-h-[90vh] overflow-hidden max-sm:w-full max-sm:h-full max-sm:max-w-full max-sm:rounded-none'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-3 text-foreground text-xl font-bold'>
            {guestToEdit ? (
              <GuestAvatar
                firstName={guestToEdit.firstName}
                lastName={guestToEdit.lastName}
                size='lg'
              />
            ) : (
              <div className='bg-primary/10 p-2 rounded-full'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-6 h-6 text-primary'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766Z'
                  />
                </svg>
              </div>
            )}
            {guestToEdit ? 'Editar Invitado' : 'Añadir Nuevo Invitado'}
          </DialogTitle>
          <DialogDescription className='text-muted-foreground'>
            Completa los detalles del invitado a continuación. Los campos
            marcados con * son obligatorios.
          </DialogDescription>
        </DialogHeader>

        {showPreview && previewData ? (
          // PREVIEW MODE - Show confirmation with all data
          <div className='space-y-6'>
            <div className='bg-muted/50 border-2 border-primary/20 rounded-lg p-6 space-y-6'>
              {/* Avatar and Name */}
              <div className='flex items-center gap-4 pb-4 border-b border-border'>
                <GuestAvatar
                  firstName={previewData.firstName}
                  lastName={previewData.lastName}
                  size='xl'
                />
                <div>
                  <h3 className='text-2xl font-bold text-foreground'>
                    {previewData.firstName} {previewData.lastName}
                  </h3>
                  {previewData.isPastor && (
                    <Badge
                      variant='secondary'
                      className='mt-2 bg-secondary/20 text-secondary border-secondary'
                    >
                      Pastor
                    </Badge>
                  )}
                </div>
              </div>

              {/* Data Grid */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Church Info */}
                <div className='space-y-1'>
                  <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
                    Iglesia
                  </p>
                  <p className='text-base font-medium text-foreground'>
                    {previewData.church}
                  </p>
                </div>

                {/* Phone */}
                <div className='space-y-1'>
                  <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
                    Teléfono
                  </p>
                  <p className='text-base font-medium text-foreground'>
                    {previewData.phone}
                  </p>
                </div>

                {/* City */}
                <div className='space-y-1'>
                  <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
                    Ciudad
                  </p>
                  <p className='text-base font-medium text-foreground'>
                    {previewData.city}
                  </p>
                </div>

                {/* State */}
                {previewData.state && (
                  <div className='space-y-1'>
                    <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
                      Estado/Provincia
                    </p>
                    <p className='text-base font-medium text-foreground'>
                      {previewData.state}
                    </p>
                  </div>
                )}

                {/* Address */}
                {previewData.address && (
                  <div className='space-y-1 md:col-span-2'>
                    <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
                      Dirección
                    </p>
                    <p className='text-base font-medium text-foreground'>
                      {previewData.address}
                    </p>
                  </div>
                )}

                {/* Notes */}
                {previewData.notes && (
                  <div className='space-y-1 md:col-span-2'>
                    <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
                      Notas
                    </p>
                    <p className='text-base font-medium text-foreground'>
                      {previewData.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Confirmation Message */}
            <div className='bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-5 h-5 text-primary mt-0.5 flex-shrink-0'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z'
                />
              </svg>
              <div className='flex-1'>
                <p className='text-sm font-semibold text-foreground'>
                  Por favor revisa la información
                </p>
                <p className='text-xs text-muted-foreground mt-1'>
                  Verifica que todos los datos sean correctos antes de guardar
                  el invitado.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <DialogFooter className='gap-2'>
              <Button
                type='button'
                onClick={onBackToEdit}
                variant='outline'
                className='font-medium'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-4 h-4 mr-2'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18'
                  />
                </svg>
                Editar
              </Button>
              <Button
                type='button'
                onClick={onConfirmSave}
                disabled={isSubmitting}
                className='flex items-center gap-2 font-semibold bg-primary text-primary-foreground hover:bg-primary/90'
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
                    d='M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                  />
                </svg>
                Confirmar y Guardar
              </Button>
            </DialogFooter>
          </div>
        ) : (
          // FORM MODE - Regular form input
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5 mt-2 max-h-[50vh] overflow-y-auto px-1'>
              {/* Grupo: Información Personal (requerida) */}
              <div className='space-y-2'>
                <Label
                  htmlFor='firstName'
                  className='text-foreground font-semibold'
                >
                  Nombre <span className='text-destructive'>*</span>
                </Label>
                <Input
                  id='firstName'
                  {...register('firstName')}
                  placeholder='Ej: Juan'
                  className={errors.firstName ? 'border-destructive' : ''}
                />
                {errors.firstName && (
                  <p className='text-xs text-destructive animate-fade-in'>
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className='space-y-2'>
                <Label
                  htmlFor='lastName'
                  className='text-foreground font-semibold'
                >
                  Apellido <span className='text-destructive'>*</span>
                </Label>
                <Input
                  id='lastName'
                  {...register('lastName')}
                  placeholder='Ej: Pérez'
                  className={errors.lastName ? 'border-destructive' : ''}
                />
                {errors.lastName && (
                  <p className='text-xs text-destructive animate-fade-in'>
                    {errors.lastName.message}
                  </p>
                )}
              </div>
              {/* Grupo: Información de Iglesia */}
              <div className='md:col-span-2 space-y-2 mt-2'>
                <Label
                  htmlFor='church'
                  className='text-foreground font-semibold'
                >
                  Iglesia <span className='text-destructive'>*</span>
                </Label>
                <Input
                  id='church'
                  {...register('church')}
                  placeholder='Nombre de la iglesia'
                  className={errors.church ? 'border-destructive' : ''}
                />
                {errors.church && (
                  <p className='text-xs text-destructive animate-fade-in'>
                    {errors.church.message}
                  </p>
                )}
              </div>
              {/* Grupo: Ubicación */}
              <div className='md:col-span-2 space-y-2'>
                <Label htmlFor='address' className='text-foreground/80'>
                  Dirección
                </Label>
                <Input
                  id='address'
                  {...register('address')}
                  placeholder='Ej: Calle Principal #123'
                  className={errors.address ? 'border-destructive' : ''}
                />
                {errors.address && (
                  <p className='text-xs text-destructive animate-fade-in'>
                    {errors.address.message}
                  </p>
                )}
              </div>
              {/* Grupo: Información de Contacto */}
              <div className='space-y-2'>
                <Label htmlFor='state' className='text-foreground/80'>
                  Estado / Provincia
                </Label>
                <Input
                  id='state'
                  {...register('state')}
                  placeholder='Ej: Maracay'
                  className={errors.state ? 'border-destructive' : ''}
                />
                {errors.state && (
                  <p className='text-xs text-destructive animate-fade-in'>
                    {errors.state.message}
                  </p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='city' className='text-foreground font-semibold'>
                  Ciudad <span className='text-destructive'>*</span>
                </Label>
                <Input
                  id='city'
                  {...register('city')}
                  placeholder='Ej: Santiago'
                  className={errors.city ? 'border-destructive' : ''}
                />
                {errors.city && (
                  <p className='text-xs text-destructive animate-fade-in'>
                    {errors.city.message}
                  </p>
                )}
              </div>
              <div className='space-y-2'>
                <Label
                  htmlFor='phone'
                  className='text-foreground font-semibold'
                >
                  Teléfono <span className='text-destructive'>*</span>
                </Label>
                <Input
                  id='phone'
                  {...register('phone')}
                  placeholder='Ej: +1 809-123-4567'
                  type='tel'
                  className={errors.phone ? 'border-destructive' : ''}
                />
                {errors.phone && (
                  <p className='text-xs text-destructive animate-fade-in'>
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div className='md:col-span-2 space-y-2'>
                <Label htmlFor='notes' className='text-foreground/80'>
                  Notas (opcional)
                </Label>
                <Input
                  id='notes'
                  {...register('notes')}
                  placeholder='Información adicional'
                  className={errors.notes ? 'border-destructive' : ''}
                />
                {errors.notes && (
                  <p className='text-xs text-destructive animate-fade-in'>
                    {errors.notes.message}
                  </p>
                )}
              </div>{' '}
              {/* Grupo: Estado de Pastor */}
              <div className='md:col-span-2 mt-2'>
                <div className='flex items-start gap-4 bg-primary/5 border-2 border-primary/20 rounded-lg p-4 hover:border-primary/40 transition-colors'>
                  <Checkbox
                    id='isPastor'
                    checked={isPastor}
                    onCheckedChange={(checked) =>
                      setValue('isPastor', checked === true)
                    }
                    className='mt-1 h-5 w-5'
                  />
                  <div className='flex-1'>
                    <Label
                      htmlFor='isPastor'
                      className='text-base font-bold cursor-pointer text-foreground flex items-center gap-2'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={2}
                        stroke='currentColor'
                        className='w-5 h-5 text-primary'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
                        />
                      </svg>
                      Es Pastor
                    </Label>
                    <p className='text-sm text-muted-foreground mt-1'>
                      Marque esta casilla si el invitado tiene el rol de pastor
                      en su iglesia.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {Object.keys(errors).length > 0 && (
              <div className='mt-4'>
                <div className='bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg flex items-center gap-3 animate-fade-in'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-5 h-5 flex-shrink-0'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z'
                    />
                  </svg>
                  <span className='text-sm font-medium'>
                    Por favor corrige los errores en el formulario
                  </span>
                </div>
              </div>
            )}

            <DialogFooter className='mt-6 gap-2'>
              <Button
                type='button'
                onClick={onClose}
                variant='outline'
                className='font-medium'
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type='submit'
                disabled={isSubmitting}
                className='flex items-center gap-1.5 font-semibold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50'
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
                    d='M12 4.5v15m7.5-7.5h-15'
                  />
                </svg>
                {isSubmitting
                  ? 'Guardando...'
                  : guestToEdit
                    ? 'Guardar Cambios'
                    : 'Continuar'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddGuestModal;
