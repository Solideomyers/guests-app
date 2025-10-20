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
          <DialogTitle className='flex items-center gap-3 text-gray-900'>
            <div className='bg-blue-100 p-2 rounded-full'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-6 h-6 text-blue-600'
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
          <DialogDescription>
            Completa los detalles del invitado a continuación.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5 mt-2 max-h-[50vh] overflow-y-auto px-1'>
            <div className='space-y-2'>
              <Label htmlFor='firstName' className='text-gray-700 font-medium'>
                Nombre *
              </Label>
              <Input
                id='firstName'
                name='firstName'
                value={formData.firstName}
                onChange={handleChange}
                placeholder='Ej: Juan'
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='lastName' className='text-gray-700 font-medium'>
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
            <div className='md:col-span-2 space-y-2'>
              <Label htmlFor='church' className='text-gray-700 font-medium'>
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
            <div className='space-y-2'>
              <Label htmlFor='city' className='text-gray-700 font-medium'>
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
              <Label htmlFor='phone' className='text-gray-700 font-medium'>
                Teléfono
              </Label>
              <Input
                id='phone'
                name='phone'
                value={formData.phone}
                onChange={handleChange}
                placeholder='Ej: +1 809-123-4567'
              />
            </div>
            <div className='md:col-span-2'>
              <div className='flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3 mt-2'>
                <Checkbox
                  id='isPastor'
                  checked={formData.isPastor}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      isPastor: checked === true,
                    }))
                  }
                />
                <div className='flex-1'>
                  <Label
                    htmlFor='isPastor'
                    className='text-sm font-semibold cursor-pointer text-gray-900'
                  >
                    Es Pastor
                  </Label>
                  <p className='text-xs text-gray-600'>
                    Marque esta casilla si el invitado es un pastor.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className='mt-4'>
              <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3'>
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
                    d='M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z'
                  />
                </svg>
                <span className='text-sm'>{error}</span>
              </div>
            </div>
          )}

          <DialogFooter className='mt-6'>
            <Button
              type='button'
              onClick={onClose}
              variant='outline'
              className='bg-white hover:bg-gray-50'
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              className='flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white'
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
