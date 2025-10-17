/**
 * Guest Status Enum
 */
export enum GuestStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  DECLINED = 'DECLINED',
}

/**
 * Guest Interface
 */
export interface Guest {
  id: number;
  firstName: string;
  lastName: string | null;
  address: string | null;
  state: string | null;
  city: string | null;
  church: string | null;
  phone: string | null;
  notes: string | null;
  status: GuestStatus;
  isPastor: boolean;
  registrationDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

/**
 * Create Guest DTO
 */
export interface CreateGuestDto {
  firstName: string;
  lastName?: string;
  address?: string;
  state?: string;
  city?: string;
  church?: string;
  phone?: string;
  notes?: string;
  status?: GuestStatus;
  isPastor?: boolean;
  registrationDate?: Date;
}

/**
 * Update Guest DTO
 */
export interface UpdateGuestDto extends Partial<CreateGuestDto> {}

/**
 * Filter Guest DTO
 */
export interface FilterGuestDto {
  search?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  state?: string;
  city?: string;
  church?: string;
  status?: GuestStatus;
  isPastor?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

/**
 * Paginated Response
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Guest Statistics
 */
export interface GuestStats {
  total: number;
  confirmed: number;
  pending: number;
  declined: number;
  pastors: number;
}

/**
 * Guest History Entry
 */
export interface GuestHistoryEntry {
  id: number;
  guestId: number;
  action: string;
  field: string | null;
  oldValue: string | null;
  newValue: string | null;
  changedBy: string | null;
  createdAt: Date;
  guest?: {
    id: number;
    firstName: string;
    lastName: string | null;
  };
}

/**
 * Bulk Update Status DTO
 */
export interface BulkUpdateStatusDto {
  ids: number[];
  status: GuestStatus;
}

/**
 * Bulk Update Pastor DTO
 */
export interface BulkUpdatePastorDto {
  ids: number[];
  isPastor: boolean;
}

/**
 * Bulk Delete DTO
 */
export interface BulkDeleteDto {
  ids: number[];
}

/**
 * API Response with message
 */
export interface ApiResponse {
  message: string;
  count?: number;
  id?: number;
}
