/**
 * GuestsService Integration Tests
 *
 * Tests GuestsService with real Prisma + PostgreSQL database.
 * Validates:
 * - CRUD operations with actual database persistence
 * - Complex queries (filters, pagination, search, sorting)
 * - Transaction handling
 * - Foreign key relationships (Guest → GuestHistory)
 * - Business logic with real data
 */

import { Test, TestingModule } from '@nestjs/testing';
import { GuestsService } from './guests.service';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { GuestStatus } from '@prisma/client';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('GuestsService (Integration)', () => {
  let service: GuestsService;
  let prisma: PrismaService;
  let cache: CacheService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GuestsService,
        PrismaService,
        {
          provide: CacheService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
            invalidatePattern: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GuestsService>(GuestsService);
    prisma = module.get<PrismaService>(PrismaService);
    cache = module.get<CacheService>(CacheService);
  });

  beforeEach(async () => {
    // Clean database before each test (handled by setup-integration.ts)
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('create', () => {
    it('should create guest in database and persist data', async () => {
      const createDto: CreateGuestDto = {
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
        city: 'Miami',
        state: 'Florida',
        church: 'First Baptist',
        status: GuestStatus.CONFIRMED,
        isPastor: false,
      };

      const created = await service.create(createDto);

      // Verify guest was created
      expect(created).toBeDefined();
      expect(created.id).toBeDefined();
      expect(created.firstName).toBe('John');
      expect(created.lastName).toBe('Doe');

      // Verify it's actually in the database
      const fromDb = await prisma.guest.findUnique({
        where: { id: created.id },
      });

      expect(fromDb).toBeDefined();
      expect(fromDb.firstName).toBe('John');
      expect(fromDb.status).toBe(GuestStatus.CONFIRMED);

      // Verify history was created
      const history = await prisma.guestHistory.findMany({
        where: { guestId: created.id },
      });

      expect(history).toHaveLength(1);
      expect(history[0].action).toBe('CREATE');
    });

    it('should reject duplicate guests (same name + phone)', async () => {
      const createDto: CreateGuestDto = {
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '5555555555',
        city: 'Orlando',
        state: 'Florida',
      };

      // Create first guest
      await service.create(createDto);

      // Try to create duplicate
      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should normalize whitespace in names', async () => {
      const createDto: CreateGuestDto = {
        firstName: '  John  ',
        lastName: '  Doe  ',
        city: '  Miami  ',
      };

      const created = await service.create(createDto);

      expect(created.firstName).toBe('John');
      expect(created.lastName).toBe('Doe');
      expect(created.city).toBe('Miami');
    });
  });

  describe('findAll with complex queries', () => {
    beforeEach(async () => {
      // Seed test data
      await prisma.guest.createMany({
        data: [
          {
            firstName: 'Alice',
            lastName: 'Johnson',
            city: 'Miami',
            state: 'Florida',
            church: 'First Baptist',
            status: GuestStatus.CONFIRMED,
            isPastor: true,
            phone: '1111111111',
          },
          {
            firstName: 'Bob',
            lastName: 'Williams',
            city: 'Tampa',
            state: 'Florida',
            church: 'Second Baptist',
            status: GuestStatus.PENDING,
            isPastor: false,
            phone: '2222222222',
          },
          {
            firstName: 'Charlie',
            lastName: 'Brown',
            city: 'Orlando',
            state: 'Florida',
            church: 'First Baptist',
            status: GuestStatus.CONFIRMED,
            isPastor: false,
            phone: '3333333333',
          },
          {
            firstName: 'David',
            lastName: 'Miller',
            city: 'Jacksonville',
            state: 'Florida',
            church: 'Third Baptist',
            status: GuestStatus.DECLINED,
            isPastor: true,
            phone: '4444444444',
          },
          {
            firstName: 'Eve',
            lastName: 'Davis',
            city: 'Miami',
            state: 'Florida',
            church: 'First Baptist',
            status: GuestStatus.CONFIRMED,
            isPastor: false,
            phone: '5555555555',
          },
        ],
      });
    });

    it('should filter by status', async () => {
      const result = await service.findAll({
        page: 1,
        limit: 10,
        status: GuestStatus.CONFIRMED,
      });

      expect(result.data).toHaveLength(3);
      expect(result.data.every((g) => g.status === GuestStatus.CONFIRMED)).toBe(
        true,
      );
      expect(result.meta.total).toBe(3);
    });

    it('should filter by isPastor', async () => {
      const result = await service.findAll({
        page: 1,
        limit: 10,
        isPastor: true,
      });

      expect(result.data).toHaveLength(2);
      expect(result.data.every((g) => g.isPastor === true)).toBe(true);
      expect(result.meta.total).toBe(2);
    });

    it('should filter by church', async () => {
      const result = await service.findAll({
        page: 1,
        limit: 10,
        church: 'First Baptist',
      });

      expect(result.data).toHaveLength(3);
      expect(result.data.every((g) => g.church === 'First Baptist')).toBe(true);
    });

    it('should filter by city', async () => {
      const result = await service.findAll({
        page: 1,
        limit: 10,
        city: 'Miami',
      });

      expect(result.data).toHaveLength(2);
      expect(result.data.every((g) => g.city === 'Miami')).toBe(true);
    });

    it('should search by name (case-insensitive)', async () => {
      const result = await service.findAll({
        page: 1,
        limit: 10,
        search: 'alice',
      });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].firstName).toBe('Alice');
    });

    it('should search by partial name', async () => {
      const result = await service.findAll({
        page: 1,
        limit: 10,
        search: 'ill', // Should match "Williams" and "Miller"
      });

      expect(result.data.length).toBeGreaterThanOrEqual(2);
    });

    it('should combine multiple filters', async () => {
      const result = await service.findAll({
        page: 1,
        limit: 10,
        status: GuestStatus.CONFIRMED,
        city: 'Miami',
        isPastor: false,
      });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].firstName).toBe('Eve');
    });

    it('should paginate correctly', async () => {
      const page1 = await service.findAll({
        page: 1,
        limit: 2,
      });

      expect(page1.data).toHaveLength(2);
      expect(page1.meta.page).toBe(1);
      expect(page1.meta.limit).toBe(2);
      expect(page1.meta.total).toBe(5);
      expect(page1.meta.totalPages).toBe(3);

      const page2 = await service.findAll({
        page: 2,
        limit: 2,
      });

      expect(page2.data).toHaveLength(2);
      expect(page2.meta.page).toBe(2);

      // Ensure different data on different pages
      expect(page1.data[0].id).not.toBe(page2.data[0].id);
    });

    it('should sort by firstName ASC', async () => {
      const result = await service.findAll({
        page: 1,
        limit: 10,
        sortBy: 'firstName',
        sortOrder: 'asc',
      });

      expect(result.data[0].firstName).toBe('Alice');
      expect(result.data[1].firstName).toBe('Bob');
      expect(result.data[2].firstName).toBe('Charlie');
    });

    it('should sort by firstName DESC', async () => {
      const result = await service.findAll({
        page: 1,
        limit: 10,
        sortBy: 'firstName',
        sortOrder: 'desc',
      });

      expect(result.data[0].firstName).toBe('Eve');
      expect(result.data[1].firstName).toBe('David');
      expect(result.data[2].firstName).toBe('Charlie');
    });

    it('should return empty array when no matches', async () => {
      const result = await service.findAll({
        page: 1,
        limit: 10,
        search: 'NonExistentName',
      });

      expect(result.data).toHaveLength(0);
      expect(result.meta.total).toBe(0);
    });
  });

  describe('findOne', () => {
    it('should retrieve guest with all relationships', async () => {
      const created = await prisma.guest.create({
        data: {
          firstName: 'Test',
          lastName: 'User',
          phone: '9999999999',
          status: GuestStatus.CONFIRMED,
        },
      });

      // Add some history
      await prisma.guestHistory.create({
        data: {
          guestId: created.id,
          action: 'CREATE',
          newValue: 'Created guest',
        },
      });

      const found = await service.findOne(created.id);

      expect(found).toBeDefined();
      expect(found.id).toBe(created.id);
      expect(found.firstName).toBe('Test');
    });

    it('should throw NotFoundException for non-existent guest', async () => {
      await expect(service.findOne(99999)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for soft-deleted guest', async () => {
      const created = await prisma.guest.create({
        data: {
          firstName: 'Deleted',
          lastName: 'User',
          phone: '8888888888',
          deletedAt: new Date(),
        },
      });

      await expect(service.findOne(created.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update guest and create history entry', async () => {
      const created = await prisma.guest.create({
        data: {
          firstName: 'Original',
          lastName: 'Name',
          phone: '7777777777',
          status: GuestStatus.PENDING,
        },
      });

      const updateDto: UpdateGuestDto = {
        firstName: 'Updated',
        status: GuestStatus.CONFIRMED,
      };

      const updated = await service.update(created.id, updateDto);

      expect(updated.firstName).toBe('Updated');
      expect(updated.status).toBe(GuestStatus.CONFIRMED);
      expect(updated.lastName).toBe('Name'); // Unchanged

      // Verify history was created for each field change
      const history = await prisma.guestHistory.findMany({
        where: { guestId: created.id },
        orderBy: { createdAt: 'asc' },
      });

      expect(history.length).toBeGreaterThanOrEqual(2);

      const firstNameHistory = history.find((h) => h.field === 'firstName');
      expect(firstNameHistory).toBeDefined();
      expect(firstNameHistory.oldValue).toBe('Original');
      expect(firstNameHistory.newValue).toBe('Updated');

      const statusHistory = history.find((h) => h.field === 'status');
      expect(statusHistory).toBeDefined();
      expect(statusHistory.oldValue).toBe(GuestStatus.PENDING);
      expect(statusHistory.newValue).toBe(GuestStatus.CONFIRMED);
    });

    it('should normalize whitespace on update', async () => {
      const created = await prisma.guest.create({
        data: {
          firstName: 'Test',
          phone: '6666666666',
        },
      });

      const updateDto: UpdateGuestDto = {
        firstName: '  Updated  ',
        city: '  New City  ',
      };

      const updated = await service.update(created.id, updateDto);

      expect(updated.firstName).toBe('Updated');
      expect(updated.city).toBe('New City');
    });

    it('should throw NotFoundException for non-existent guest', async () => {
      const updateDto: UpdateGuestDto = {
        firstName: 'Test',
      };

      await expect(service.update(99999, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove (soft delete)', () => {
    it('should soft delete guest and not physically remove', async () => {
      const created = await prisma.guest.create({
        data: {
          firstName: 'ToDelete',
          phone: '5555555555',
        },
      });

      await service.remove(created.id);

      // Guest should still exist in DB
      const fromDb = await prisma.guest.findUnique({
        where: { id: created.id },
      });

      expect(fromDb).toBeDefined();
      expect(fromDb.deletedAt).toBeDefined();
      expect(fromDb.deletedAt).toBeInstanceOf(Date);

      // But should not be returned by findAll
      const allGuests = await service.findAll({ page: 1, limit: 10 });
      expect(allGuests.data.find((g) => g.id === created.id)).toBeUndefined();
    });

    it('should throw NotFoundException for non-existent guest', async () => {
      await expect(service.remove(99999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getStats', () => {
    beforeEach(async () => {
      await prisma.guest.createMany({
        data: [
          {
            firstName: 'A',
            phone: '1111111111',
            status: GuestStatus.CONFIRMED,
            isPastor: true,
          },
          {
            firstName: 'B',
            phone: '2222222222',
            status: GuestStatus.CONFIRMED,
            isPastor: false,
          },
          {
            firstName: 'C',
            phone: '3333333333',
            status: GuestStatus.PENDING,
            isPastor: true,
          },
          {
            firstName: 'D',
            phone: '4444444444',
            status: GuestStatus.DECLINED,
            isPastor: false,
          },
        ],
      });
    });

    it('should calculate correct statistics', async () => {
      const stats = await service.getStats();

      expect(stats.total).toBe(4);
      expect(stats.confirmed).toBe(2);
      expect(stats.pending).toBe(1);
      expect(stats.declined).toBe(1);
      expect(stats.pastors).toBe(2);
    });
  });

  describe('bulk operations', () => {
    let guestIds: number[];

    beforeEach(async () => {
      const guests = await prisma.guest.createMany({
        data: [
          {
            firstName: 'Bulk1',
            phone: '1111111111',
            status: GuestStatus.PENDING,
          },
          {
            firstName: 'Bulk2',
            phone: '2222222222',
            status: GuestStatus.PENDING,
          },
          {
            firstName: 'Bulk3',
            phone: '3333333333',
            status: GuestStatus.PENDING,
          },
        ],
      });

      const created = await prisma.guest.findMany({
        where: { firstName: { startsWith: 'Bulk' } },
      });

      guestIds = created.map((g) => g.id);
    });

    it('should bulk update status', async () => {
      const result = await service.bulkUpdateStatus({
        ids: guestIds,
        status: GuestStatus.CONFIRMED,
      });

      expect(result.count).toBe(3);

      const updated = await prisma.guest.findMany({
        where: { id: { in: guestIds } },
      });

      expect(updated.every((g) => g.status === GuestStatus.CONFIRMED)).toBe(
        true,
      );
    });

    it('should bulk update pastor status', async () => {
      const result = await service.bulkUpdatePastor({
        ids: guestIds,
        isPastor: true,
      });

      expect(result.count).toBe(3);

      const updated = await prisma.guest.findMany({
        where: { id: { in: guestIds } },
      });

      expect(updated.every((g) => g.isPastor === true)).toBe(true);
    });

    it('should bulk delete guests', async () => {
      const result = await service.bulkDelete({ ids: guestIds });

      expect(result.count).toBe(3);

      const remaining = await prisma.guest.findMany({
        where: { id: { in: guestIds }, deletedAt: null },
      });

      expect(remaining).toHaveLength(0);
    });
  });

  describe('history operations', () => {
    it('should retrieve paginated history', async () => {
      // Create multiple guests with history
      for (let i = 0; i < 15; i++) {
        const guest = await prisma.guest.create({
          data: {
            firstName: `Guest${i}`,
            phone: `${i}${i}${i}${i}${i}${i}${i}${i}${i}${i}`,
          },
        });

        await prisma.guestHistory.create({
          data: {
            guestId: guest.id,
            action: 'CREATE',
            newValue: 'Created',
          },
        });
      }

      const page1 = await service.getHistory(1, 10);

      expect(page1.data).toHaveLength(10);
      expect(page1.meta.total).toBe(15);
      expect(page1.meta.totalPages).toBe(2);

      const page2 = await service.getHistory(2, 10);

      expect(page2.data).toHaveLength(5);
      expect(page2.meta.page).toBe(2);
    });

    it('should retrieve guest-specific history', async () => {
      const guest = await prisma.guest.create({
        data: {
          firstName: 'History',
          phone: '0000000000',
          status: GuestStatus.PENDING,
        },
      });

      // Update multiple times
      await service.update(guest.id, { status: GuestStatus.CONFIRMED });
      await service.update(guest.id, { firstName: 'Updated' });
      await service.update(guest.id, { status: GuestStatus.DECLINED });

      const history = await service.getGuestHistory(guest.id, 1, 10);

      expect(history.data.length).toBeGreaterThanOrEqual(3);
      expect(history.data.every((h) => h.guestId === guest.id)).toBe(true);
    });

    it('should throw NotFoundException for history of non-existent guest', async () => {
      await expect(service.getGuestHistory(99999, 1, 10)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
