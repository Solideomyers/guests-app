import React, { useState, useEffect, FormEvent } from 'react';
import { Guest } from '../types';

interface AddGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (guest: Omit<Guest, 'registrationDate' | 'status'>) => void;
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


const AddGuestModal: React.FC<AddGuestModalProps> = ({ isOpen, onClose, onSave, guestToEdit }) => {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (isOpen && guestToEdit) {
      setFormData(guestToEdit);
    } else {
      setFormData(initialFormData);
    }
  }, [isOpen, guestToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim()) {
        alert('El nombre es obligatorio.');
        return;
    }
    onSave({ ...formData, id: guestToEdit?.id });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-16" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">
              {guestToEdit ? 'Editar Invitado' : 'Añadir Nuevo Invitado'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
              <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Nombre" className="p-2 border rounded w-full" required />
              <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Apellido" className="p-2 border rounded w-full" />
              <input name="church" value={formData.church} onChange={handleChange} placeholder="Iglesia" className="p-2 border rounded w-full" />
              <input name="city" value={formData.city} onChange={handleChange} placeholder="Ciudad" className="p-2 border rounded w-full" />
              <input name="state" value={formData.state} onChange={handleChange} placeholder="Estado" className="p-2 border rounded w-full" />
              <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Teléfono" className="p-2 border rounded w-full" />
              <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Notas" className="p-2 border rounded md:col-span-2 h-24 w-full" />
            </div>
          </div>
          <div className="bg-slate-50 px-6 py-3 flex justify-end gap-3 rounded-b-lg border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-white border rounded hover:bg-slate-50">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              {guestToEdit ? 'Guardar Cambios' : 'Guardar Invitado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGuestModal;
