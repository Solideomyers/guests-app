import React, { useState, useEffect, FormEvent } from 'react';
import { Guest } from '../types';
import { useUIStore } from '../stores';

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
    <div
      className='fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center'
      onClick={onClose}
    >
      <div
        className='bg-white rounded-xl shadow-xl w-full max-w-lg m-4'
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className='p-6 sm:p-8'>
            <div className='flex items-start gap-4'>
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
              <div>
                <h3 className='text-xl font-semibold text-slate-800'>
                  {guestToEdit ? 'Editar Invitado' : 'Añadir Nuevo Invitado'}
                </h3>
                <p className='text-sm text-slate-500 mt-1'>
                  Completa los detalles del invitado a continuación.
                </p>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5 mt-6 max-h-[60vh] overflow-y-auto pr-3'>
              <div>
                <label className='text-sm font-semibold text-slate-700 block mb-1.5'>
                  Nombre
                </label>
                <input
                  name='firstName'
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder='Ej: Juan'
                  className='p-2.5 h-11 border rounded-lg w-full bg-slate-50 border-slate-300 focus:ring-2 focus:ring-blue-500'
                  required
                />
              </div>
              <div>
                <label className='text-sm font-semibold text-slate-700 block mb-1.5'>
                  Apellido
                </label>
                <input
                  name='lastName'
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder='Ej: Pérez'
                  className='p-2.5 h-11 border rounded-lg w-full bg-slate-50 border-slate-300 focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <div className='md:col-span-2'>
                <label className='text-sm font-semibold text-slate-700 block mb-1.5'>
                  Iglesia
                </label>
                <input
                  name='church'
                  value={formData.church}
                  onChange={handleChange}
                  placeholder='Nombre de la iglesia'
                  className='p-2.5 h-11 border rounded-lg w-full bg-slate-50 border-slate-300 focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <div>
                <label className='text-sm font-semibold text-slate-700 block mb-1.5'>
                  Ciudad
                </label>
                <input
                  name='city'
                  value={formData.city}
                  onChange={handleChange}
                  placeholder='Ej: Santiago'
                  className='p-2.5 h-11 border rounded-lg w-full bg-slate-50 border-slate-300 focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <div>
                <label className='text-sm font-semibold text-slate-700 block mb-1.5'>
                  Teléfono
                </label>
                <input
                  name='phone'
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder='Ej: +1 809-123-4567'
                  className='p-2.5 h-11 border rounded-lg w-full bg-slate-50 border-slate-300 focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <div className='md:col-span-2'>
                <div className='flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3 mt-2'>
                  <input
                    type='checkbox'
                    name='isPastor'
                    id='isPastor'
                    checked={formData.isPastor}
                    onChange={handleChange}
                    className='h-4 w-4 rounded border-slate-400 text-blue-600 focus:ring-blue-500'
                  />
                  <div>
                    <label
                      htmlFor='isPastor'
                      className='text-sm font-semibold text-slate-800'
                    >
                      Es Pastor
                    </label>
                    <p className='text-xs text-slate-500'>
                      Marque esta casilla si el invitado es un pastor.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className='px-6 sm:px-8 pb-4'>
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

          <div className='bg-slate-50 px-6 py-4 flex justify-end gap-3 rounded-b-xl border-t'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-100 text-sm'
            >
              Cancelar
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 text-sm flex items-center gap-1.5'
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
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGuestModal;
