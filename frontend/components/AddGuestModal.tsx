import React, { useState, useEffect, FormEvent } from 'react';
import { Guest } from '../types';
import { useUIStore } from '../stores';
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

/**
 * AddGuestModal Component
 * Uses Zustand store directly for modal state - no prop drilling needed
 * Still receives onSave and guestToEdit as props since these are data operations
 */

interface AddGuestModalProps {
  onSave: (guest: Omit<Guest, 'registrationDate' | 'status'>) => boolean | void;
  guestToEdit: Guest | null;
}

const initialFormData: Omit<Guest, 'id' | 'registrationDate' | 'status'> = {
  firstName: '',
  lastName: '',
  address: '',
  state: '',
  city: '',
  church: '',
  phone: '',
  notes: '',
  isPastor: false,
};

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
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (guestToEdit) {
        setFormData(guestToEdit);
      } else {
        setFormData(initialFormData);
      }
      setError(null);
    }
  }, [isOpen, guestToEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error && (name === 'firstName' || name === 'lastName')) {
      setError(null);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim()) {
      setError('El nombre es un campo obligatorio.');
      return;
    }
    const result = onSave({ ...formData, id: guestToEdit?.id });
    if (result === false) {
      setError('Este invitado ya existe en la lista.');
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-hidden'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-3 text-foreground text-xl font-bold'>
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
            {guestToEdit ? 'Editar Invitado' : 'Añadir Nuevo Invitado'}
          </DialogTitle>
          <DialogDescription className='text-muted-foreground'>
            Completa los detalles del invitado a continuación. Los campos
            marcados con * son obligatorios.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
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
                name='firstName'
                value={formData.firstName}
                onChange={handleChange}
                placeholder='Ej: Juan'
                required
                className='border-input'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='lastName' className='text-foreground/80'>
                Apellido
              </Label>
              <Input
                id='lastName'
                name='lastName'
                value={formData.lastName}
                onChange={handleChange}
                placeholder='Ej: Pérez'
              />
            </div>
            {/* Grupo: Información de Iglesia */}
            <div className='md:col-span-2 space-y-2 mt-2'>
              <Label htmlFor='church' className='text-foreground/80'>
                Iglesia
              </Label>
              <Input
                id='church'
                name='church'
                value={formData.church}
                onChange={handleChange}
                placeholder='Nombre de la iglesia'
              />
            </div>
            {/* Grupo: Ubicación */}
            <div className='md:col-span-2 space-y-2'>
              <Label htmlFor='address' className='text-foreground/80'>
                Dirección
              </Label>
              <Input
                id='address'
                name='address'
                value={formData.address}
                onChange={handleChange}
                placeholder='Ej: Calle Principal #123'
              />
            </div>
            {/* Grupo: Información de Contacto */}
            <div className='space-y-2'>
              <Label htmlFor='state' className='text-foreground/80'>
                Estado / Provincia
              </Label>
              <Input
                id='state'
                name='state'
                value={formData.state}
                onChange={handleChange}
                placeholder='Ej: Maracay'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='city' className='text-foreground/80'>
                Ciudad
              </Label>
              <Input
                id='city'
                name='city'
                value={formData.city}
                onChange={handleChange}
                placeholder='Ej: Santiago'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='phone' className='text-foreground/80'>
                Teléfono
              </Label>
              <Input
                id='phone'
                name='phone'
                value={formData.phone}
                onChange={handleChange}
                placeholder='Ej: +1 809-123-4567'
                type='tel'
              />
            </div>
            <div className='md:col-span-2 space-y-2'>
              <Label htmlFor='notes' className='text-foreground/80'>
                Notas (opcional)
              </Label>
              <Input
                id='notes'
                name='notes'
                value={formData.notes}
                onChange={handleChange}
                placeholder='Información adicional'
              />
            </div>{' '}
            {/* Grupo: Estado de Pastor */}
            <div className='md:col-span-2 mt-2'>
              <div className='flex items-start gap-4 bg-primary/5 border-2 border-primary/20 rounded-lg p-4 hover:border-primary/40 transition-colors'>
                <Checkbox
                  id='isPastor'
                  checked={formData.isPastor}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      isPastor: checked === true,
                    }))
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
                    Marque esta casilla si el invitado tiene el rol de pastor en
                    su iglesia.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {error && (
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
                <span className='text-sm font-medium'>{error}</span>
              </div>
            </div>
          )}

          <DialogFooter className='mt-6 gap-2'>
            <Button
              type='button'
              onClick={onClose}
              variant='outline'
              className='font-medium'
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              className='flex items-center gap-1.5 font-semibold bg-primary text-primary-foreground hover:bg-primary/90'
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
              {guestToEdit ? 'Guardar Cambios' : 'Añadir Invitado'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddGuestModal;
