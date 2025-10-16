import React, { useState, useEffect } from 'react';
import { Guest } from '../types';

interface AddGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGuest: (newGuest: Omit<Guest, 'id' | 'registrationDate' | 'status'>) => boolean;
}

const AddGuestModal: React.FC<AddGuestModalProps> = ({ isOpen, onClose, onAddGuest }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [church, setChurch] = useState('');
  const [city, setCity] = useState('Guayana');
  const [state, setState] = useState('Bolívar');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isPastor, setIsPastor] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      // Reset form on close
      setTimeout(() => {
        setFirstName('');
        setLastName('');
        setChurch('');
        setCity('Guayana');
        setState('Bolívar');
        setPhone('');
        setAddress('');
        setNotes('');
        setIsPastor(false);
        setError('');
      }, 200); // Delay to allow closing animation
    }
  }, [isOpen]);
  
  // Clear error when user starts typing
  useEffect(() => {
    if (error) {
      setError('');
    }
  }, [firstName, lastName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setError('El campo de nombre es obligatorio.');
      return;
    }
    
    const success = onAddGuest({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      church: church.trim(),
      city: city.trim(),
      state: state.trim(),
      phone: phone.trim(),
      address: address.trim(),
      notes: notes.trim(),
      isPastor,
    });

    if (success) {
      onClose();
    } else {
      setError('Este invitado ya existe en la lista.');
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" aria-modal="true" role="dialog">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg m-4 transform transition-all animate-fade-in-up">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3.375 19.5h17.25a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H3.375a2.25 2.25 0 0 0-2.25 2.25v10.5a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Añadir Nuevo Invitado</h2>
                    <p className="text-sm text-slate-500">Completa los detalles para registrar al invitado.</p>
                </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-800 p-1 rounded-full transition-colors" aria-label="Cerrar modal">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-sm text-red-800 rounded-lg p-3 flex items-center gap-2" role="alert">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                    <span>{error}</span>
                </div>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                {/* First Name */}
                <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold text-slate-800 mb-1.5">Nombre *</label>
                    <input id="firstName" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2.5" required />
                </div>
                {/* Last Name */}
                <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold text-slate-800 mb-1.5">Apellido</label>
                    <input id="lastName" type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2.5" />
                </div>
                {/* Church */}
                <div>
                    <label htmlFor="church" className="block text-sm font-semibold text-slate-800 mb-1.5">Iglesia</label>
                    <input id="church" type="text" value={church} onChange={e => setChurch(e.target.value)} className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2.5" />
                </div>
                {/* Phone */}
                <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-slate-800 mb-1.5">Teléfono</label>
                    <input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2.5" />
                </div>
                {/* City */}
                <div>
                    <label htmlFor="city" className="block text-sm font-semibold text-slate-800 mb-1.5">Ciudad</label>
                    <input id="city" type="text" value={city} onChange={e => setCity(e.target.value)} className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2.5" />
                </div>
                {/* State */}
                <div>
                    <label htmlFor="state" className="block text-sm font-semibold text-slate-800 mb-1.5">Estado</label>
                    <input id="state" type="text" value={state} onChange={e => setState(e.target.value)} className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2.5" />
                </div>
            </div>
            
            {/* Is Pastor Checkbox */}
            <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                    <input id="isPastor" type="checkbox" checked={isPastor} onChange={e => setIsPastor(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                </div>
                <div className="ml-3 text-sm leading-6">
                    <label htmlFor="isPastor" className="font-medium text-slate-900">Marcar como Pastor</label>
                    <p className="text-slate-500">Identifica a este invitado como un líder espiritual.</p>
                </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-slate-200 flex justify-end gap-3">
                <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                    Cancelar
                </button>
                <button type="submit" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                    </svg>
                    <span>Añadir Invitado</span>
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AddGuestModal;