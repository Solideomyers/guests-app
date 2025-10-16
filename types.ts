// FIX: Define Guest and AttendanceStatus types
export enum AttendanceStatus {
  PENDING = 'Pendiente',
  CONFIRMED = 'Confirmado',
  DECLINED = 'Rechazado',
}

export interface Guest {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  state: string;
  city: string;
  church: string;
  phone: string;
  registrationDate: string;
  notes: string;
  status: AttendanceStatus;
  isPastor: boolean;
}

export type SortableGuestKeys = 'firstName' | 'church' | 'city' | 'phone';

export interface SortConfig {
  key: SortableGuestKeys;
  direction: 'ascending' | 'descending';
}