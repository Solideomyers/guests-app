/**
 * Guest Factory for Testing
 * Provides factory functions to create test data
 */

import { GuestStatus } from '@prisma/client';
import { CreateGuestDto } from '../../guests/dto/create-guest.dto';
import { UpdateGuestDto } from '../../guests/dto/update-guest.dto';

/**
 * Create a mock guest object
 */
export const createMockGuest = (overrides = {}) => ({
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  address: '123 Main St',
  state: 'California',
  city: 'Los Angeles',
  church: 'First Baptist Church',
  phone: '555-1234',
  notes: 'Test notes',
  status: GuestStatus.PENDING,
  isPastor: false,
  registrationDate: new Date('2025-01-01'),
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
  deletedAt: null,
  ...overrides,
});

/**
 * Create multiple mock guests
 */
export const createMockGuests = (count: number, overrides = {}) => {
  return Array.from({ length: count }, (_, i) =>
    createMockGuest({
      id: i + 1,
      firstName: `Guest${i + 1}`,
      lastName: `Lastname${i + 1}`,
      ...overrides,
    }),
  );
};

/**
 * Create a mock CreateGuestDto
 */
export const createMockCreateDto = (
  overrides: Partial<CreateGuestDto> = {},
): CreateGuestDto => ({
  firstName: 'John',
  lastName: 'Doe',
  address: '123 Main St',
  state: 'California',
  city: 'Los Angeles',
  church: 'First Baptist Church',
  phone: '555-1234',
  notes: 'Test notes',
  status: GuestStatus.PENDING,
  isPastor: false,
  ...overrides,
});

/**
 * Create a mock UpdateGuestDto
 */
export const createMockUpdateDto = (
  overrides: Partial<UpdateGuestDto> = {},
): UpdateGuestDto => ({
  firstName: 'Jane',
  status: GuestStatus.CONFIRMED,
  ...overrides,
});

/**
 * Create a mock guest history entry
 */
export const createMockHistory = (overrides = {}) => ({
  id: 1,
  guestId: 1,
  action: 'CREATE',
  field: null,
  oldValue: null,
  newValue: null,
  changedBy: null,
  createdAt: new Date('2025-01-01'),
  ...overrides,
});

/**
 * Create mock stats
 */
export const createMockStats = (overrides = {}) => ({
  total: 100,
  confirmed: 50,
  pending: 30,
  declined: 20,
  pastors: 10,
  ...overrides,
});

/**
 * Create paginated response
 */
export const createPaginatedResponse = <T>(data: T[], meta = {}) => ({
  data,
  meta: {
    total: data.length,
    page: 1,
    limit: 20,
    totalPages: 1,
    ...meta,
  },
});
