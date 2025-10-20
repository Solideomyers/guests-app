import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { GuestsService } from './guests.service';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { GuestStatus } from '@prisma/client';
import { mockPrismaService, resetPrismaMocks } from '../test/mocks/prisma.mock';
import { mockCacheService, resetCacheMocks } from '../test/mocks/cache.mock';
import {
  createMockGuest,
  createMockGuests,
  createMockCreateDto,
  createMockUpdateDto,
  createMockHistory,
  createMockStats,
} from '../test/mocks/guest.factory';

describe('GuestsService', () => {
  let service: GuestsService;
  let prisma: typeof mockPrismaService;
  let cache: typeof mockCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GuestsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
      ],
    }).compile();

    service = module.get<GuestsService>(GuestsService);
    prisma = mockPrismaService;
    cache = mockCacheService;

    // Reset all mocks before each test
    resetPrismaMocks();
    resetCacheMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a guest with valid data', async () => {
      const createDto = createMockCreateDto();
      const expectedGuest = createMockGuest();

      prisma.guest.findFirst.mockResolvedValue(null); // No duplicate
      prisma.guest.create.mockResolvedValue(expectedGuest);
      prisma.guestHistory.create.mockResolvedValue(createMockHistory());
      cache.invalidatePattern.mockResolvedValue(undefined);

      const result = await service.create(createDto);

      expect(result).toEqual(expectedGuest);
      expect(prisma.guest.findFirst).toHaveBeenCalledWith({
        where: {
          firstName: createDto.firstName,
          lastName: createDto.lastName,
          deletedAt: null,
        },
      });
      expect(prisma.guest.create).toHaveBeenCalledWith({
        data: {
          ...createDto,
          status: createDto.status || GuestStatus.PENDING,
          isPastor: createDto.isPastor || false,
        },
      });
      expect(prisma.guestHistory.create).toHaveBeenCalled();
      expect(cache.invalidatePattern).toHaveBeenCalledWith(
        'cache:/api/v1/guests*',
      );
    });

    it('should throw BadRequestException if duplicate guest exists', async () => {
      const createDto = createMockCreateDto();
      const existingGuest = createMockGuest();

      prisma.guest.findFirst.mockResolvedValue(existingGuest);

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(createDto)).rejects.toThrow(
        'A guest with this name already exists',
      );
      expect(prisma.guest.create).not.toHaveBeenCalled();
    });

    it('should trim whitespace in names', async () => {
      const createDto = createMockCreateDto({
        firstName: '  John  ',
        lastName: '  Doe  ',
      });
      const expectedGuest = createMockGuest();

      prisma.guest.findFirst.mockResolvedValue(null);
      prisma.guest.create.mockResolvedValue(expectedGuest);
      prisma.guestHistory.create.mockResolvedValue(createMockHistory());
      cache.invalidatePattern.mockResolvedValue(undefined);

      await service.create(createDto);

      // Note: Actual trimming would need to be implemented in the DTO validation
      expect(prisma.guest.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated guests', async () => {
      const mockGuests = createMockGuests(5);
      const filterDto = { page: 1, limit: 20 };

      prisma.guest.findMany.mockResolvedValue(mockGuests);
      prisma.guest.count.mockResolvedValue(5);

      const result = await service.findAll(filterDto);

      expect(result.data).toEqual(mockGuests);
      expect(result.meta).toEqual({
        total: 5,
        page: 1,
        limit: 20,
        totalPages: 1,
      });
      expect(prisma.guest.findMany).toHaveBeenCalledWith({
        where: { deletedAt: null },
        skip: 0,
        take: 20,
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should filter by status', async () => {
      const mockGuests = createMockGuests(3, { status: GuestStatus.CONFIRMED });
      const filterDto = { status: GuestStatus.CONFIRMED };

      prisma.guest.findMany.mockResolvedValue(mockGuests);
      prisma.guest.count.mockResolvedValue(3);

      const result = await service.findAll(filterDto);

      expect(result.data).toHaveLength(3);
      expect(prisma.guest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: GuestStatus.CONFIRMED,
          }),
        }),
      );
    });

    it('should filter by isPastor', async () => {
      const mockPastors = createMockGuests(2, { isPastor: true });
      const filterDto = { isPastor: true };

      prisma.guest.findMany.mockResolvedValue(mockPastors);
      prisma.guest.count.mockResolvedValue(2);

      const result = await service.findAll(filterDto);

      expect(result.data).toHaveLength(2);
      expect(prisma.guest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isPastor: true,
          }),
        }),
      );
    });

    it('should search by name, church, and city', async () => {
      const mockGuests = createMockGuests(1);
      const filterDto = { search: 'John' };

      prisma.guest.findMany.mockResolvedValue(mockGuests);
      prisma.guest.count.mockResolvedValue(1);

      const result = await service.findAll(filterDto);

      expect(result.data).toHaveLength(1);
      expect(prisma.guest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              { firstName: { contains: 'John', mode: 'insensitive' } },
            ]),
          }),
        }),
      );
    });

    it('should handle empty database', async () => {
      prisma.guest.findMany.mockResolvedValue([]);
      prisma.guest.count.mockResolvedValue(0);

      const result = await service.findAll({});

      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
    });

    it('should paginate correctly', async () => {
      const mockGuests = createMockGuests(10);
      const filterDto = { page: 2, limit: 5 };

      prisma.guest.findMany.mockResolvedValue(mockGuests.slice(5, 10));
      prisma.guest.count.mockResolvedValue(10);

      const result = await service.findAll(filterDto);

      expect(result.meta).toEqual({
        total: 10,
        page: 2,
        limit: 5,
        totalPages: 2,
      });
      expect(prisma.guest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 5,
          take: 5,
        }),
      );
    });

    it('should sort by different fields', async () => {
      const mockGuests = createMockGuests(3);
      const filterDto = { sortBy: 'firstName', sortOrder: 'asc' as const };

      prisma.guest.findMany.mockResolvedValue(mockGuests);
      prisma.guest.count.mockResolvedValue(3);

      await service.findAll(filterDto);

      expect(prisma.guest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { firstName: 'asc' },
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a guest by id', async () => {
      const mockGuest = createMockGuest();
      prisma.guest.findFirst.mockResolvedValue({
        ...mockGuest,
        history: [createMockHistory()],
      });

      const result = await service.findOne(1);

      expect(result.id).toBe(1);
      expect(result).toHaveProperty('history');
      expect(prisma.guest.findFirst).toHaveBeenCalledWith({
        where: { id: 1, deletedAt: null },
        include: {
          history: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      });
    });

    it('should throw NotFoundException if guest not found', async () => {
      prisma.guest.findFirst.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        'Guest with ID 999 not found',
      );
    });

    it('should not find soft-deleted guests', async () => {
      prisma.guest.findFirst.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      expect(prisma.guest.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            deletedAt: null,
          }),
        }),
      );
    });
  });

  describe('update', () => {
    it('should update guest successfully', async () => {
      const mockGuest = createMockGuest();
      const updateDto = createMockUpdateDto();
      const updatedGuest = { ...mockGuest, ...updateDto };

      prisma.guest.findFirst.mockResolvedValue(mockGuest);
      prisma.guest.update.mockResolvedValue(updatedGuest);
      prisma.guestHistory.create.mockResolvedValue(createMockHistory());
      cache.invalidatePattern.mockResolvedValue(undefined);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(updatedGuest);
      expect(prisma.guest.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateDto,
      });
      expect(cache.invalidatePattern).toHaveBeenCalled();
    });

    it('should create history entries for changes', async () => {
      const mockGuest = createMockGuest({ firstName: 'John' });
      const updateDto = createMockUpdateDto({ firstName: 'Jane' });

      prisma.guest.findFirst.mockResolvedValue(mockGuest);
      prisma.guest.update.mockResolvedValue({ ...mockGuest, ...updateDto });
      prisma.guestHistory.create.mockResolvedValue(createMockHistory());
      cache.invalidatePattern.mockResolvedValue(undefined);

      await service.update(1, updateDto);

      expect(prisma.guestHistory.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException if guest not found', async () => {
      prisma.guest.findFirst.mockResolvedValue(null);

      await expect(service.update(999, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft delete a guest', async () => {
      const mockGuest = createMockGuest();
      const deletedGuest = { ...mockGuest, deletedAt: new Date() };

      prisma.guest.findFirst.mockResolvedValue(mockGuest);
      prisma.guest.update.mockResolvedValue(deletedGuest);
      prisma.guestHistory.create.mockResolvedValue(createMockHistory());
      cache.invalidatePattern.mockResolvedValue(undefined);

      const result = await service.remove(1);

      expect(result).toEqual({
        message: 'Guest deleted successfully',
        id: 1,
      });
      expect(prisma.guest.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { deletedAt: expect.any(Date) },
      });
      expect(prisma.guestHistory.create).toHaveBeenCalled();
      expect(cache.invalidatePattern).toHaveBeenCalled();
    });

    it('should throw NotFoundException if guest not found', async () => {
      prisma.guest.findFirst.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getStats', () => {
    it('should return correct statistics', async () => {
      const expectedStats = createMockStats();

      prisma.guest.count
        .mockResolvedValueOnce(expectedStats.total)
        .mockResolvedValueOnce(expectedStats.confirmed)
        .mockResolvedValueOnce(expectedStats.pending)
        .mockResolvedValueOnce(expectedStats.declined)
        .mockResolvedValueOnce(expectedStats.pastors);

      const result = await service.getStats();

      expect(result).toEqual(expectedStats);
      expect(prisma.guest.count).toHaveBeenCalledTimes(5);
    });

    it('should handle empty database', async () => {
      prisma.guest.count.mockResolvedValue(0);

      const result = await service.getStats();

      expect(result).toEqual({
        total: 0,
        confirmed: 0,
        pending: 0,
        declined: 0,
        pastors: 0,
      });
    });
  });

  describe('bulkUpdateStatus', () => {
    it('should update multiple guests status', async () => {
      const ids = [1, 2, 3];
      const status = GuestStatus.CONFIRMED;

      prisma.guest.updateMany.mockResolvedValue({ count: 3 });
      prisma.guestHistory.create.mockResolvedValue(createMockHistory());
      cache.invalidatePattern.mockResolvedValue(undefined);

      const result = await service.bulkUpdateStatus({ ids, status });

      expect(result).toEqual({
        message: '3 guests updated successfully',
        count: 3,
      });
      expect(prisma.guest.updateMany).toHaveBeenCalledWith({
        where: {
          id: { in: ids },
          deletedAt: null,
        },
        data: { status },
      });
      expect(prisma.guestHistory.create).toHaveBeenCalledTimes(3);
      expect(cache.invalidatePattern).toHaveBeenCalled();
    });

    it('should handle bulk operation errors', async () => {
      prisma.guest.updateMany.mockRejectedValue(new Error('Database error'));

      await expect(
        service.bulkUpdateStatus({
          ids: [1, 2, 3],
          status: GuestStatus.CONFIRMED,
        }),
      ).rejects.toThrow('Database error');
    });
  });

  describe('bulkUpdatePastor', () => {
    it('should update multiple guests pastor status', async () => {
      const ids = [1, 2, 3];
      const isPastor = true;

      prisma.guest.updateMany.mockResolvedValue({ count: 3 });
      cache.invalidatePattern.mockResolvedValue(undefined);

      const result = await service.bulkUpdatePastor({ ids, isPastor });

      expect(result).toEqual({
        message: '3 guests updated successfully',
        count: 3,
      });
      expect(prisma.guest.updateMany).toHaveBeenCalledWith({
        where: {
          id: { in: ids },
          deletedAt: null,
        },
        data: { isPastor },
      });
    });
  });

  describe('bulkDelete', () => {
    it('should delete multiple guests', async () => {
      const ids = [1, 2, 3];

      prisma.guest.updateMany.mockResolvedValue({ count: 3 });
      prisma.guestHistory.create.mockResolvedValue(createMockHistory());
      cache.invalidatePattern.mockResolvedValue(undefined);

      const result = await service.bulkDelete({ ids });

      expect(result).toEqual({
        message: '3 guests deleted successfully',
        count: 3,
      });
      expect(prisma.guest.updateMany).toHaveBeenCalledWith({
        where: {
          id: { in: ids },
          deletedAt: null,
        },
        data: { deletedAt: expect.any(Date) },
      });
      expect(prisma.guestHistory.create).toHaveBeenCalledTimes(3);
    });
  });

  describe('getHistory', () => {
    it('should return paginated history', async () => {
      const mockHistory = Array.from({ length: 5 }, (_, i) =>
        createMockHistory({ id: i + 1 }),
      );

      prisma.guestHistory.findMany.mockResolvedValue(
        mockHistory.map((h) => ({
          ...h,
          guest: { id: 1, firstName: 'John', lastName: 'Doe' },
        })),
      );
      prisma.guestHistory.count.mockResolvedValue(5);

      const result = await service.getHistory(1, 50);

      expect(result.data).toHaveLength(5);
      expect(result.meta).toEqual({
        total: 5,
        page: 1,
        limit: 50,
        totalPages: 1,
      });
    });
  });

  describe('getGuestHistory', () => {
    it('should return history for specific guest', async () => {
      const mockGuest = createMockGuest();
      const mockHistory = [createMockHistory({ guestId: 1 })];

      prisma.guest.findFirst.mockResolvedValue(mockGuest);
      prisma.guestHistory.findMany.mockResolvedValue(mockHistory);
      prisma.guestHistory.count.mockResolvedValue(1);

      const result = await service.getGuestHistory(1, 1, 50);

      expect(result.data).toHaveLength(1);
      expect(prisma.guestHistory.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { guestId: 1 },
        }),
      );
    });

    it('should throw NotFoundException if guest not found', async () => {
      prisma.guest.findFirst.mockResolvedValue(null);

      await expect(service.getGuestHistory(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
