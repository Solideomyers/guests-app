import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { GuestStatus } from '@prisma/client';

describe('Guests API (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply global validation pipe (same as main.ts)
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clean database before each test
    await prisma.guestHistory.deleteMany();
    await prisma.guest.deleteMany();
  });

  describe('POST /guests', () => {
    it('should create a new guest', async () => {
      const createDto = {
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        church: 'Central Church',
        city: 'New York',
        isPastor: false,
        status: GuestStatus.PENDING,
      };

      const response = await request(app.getHttpServer())
        .post('/guests')
        .send(createDto)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(Number),
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        church: 'Central Church',
        city: 'New York',
        isPastor: false,
        status: GuestStatus.PENDING,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        deletedAt: null,
      });

      // Verify in database
      const guest = await prisma.guest.findUnique({
        where: { id: response.body.id },
      });
      expect(guest).toBeTruthy();
      expect(guest?.firstName).toBe('John');
    });

    it('should return 409 on duplicate guest (same name + phone)', async () => {
      const createDto = {
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+9876543210',
        status: GuestStatus.PENDING,
      };

      // Create first guest
      await request(app.getHttpServer())
        .post('/guests')
        .send(createDto)
        .expect(201);

      // Try to create duplicate
      await request(app.getHttpServer())
        .post('/guests')
        .send(createDto)
        .expect(409);
    });

    it('should return 400 on invalid data', async () => {
      const invalidDto = {
        firstName: '', // Empty firstName
        phone: 'invalid', // Invalid phone format
      };

      await request(app.getHttpServer())
        .post('/guests')
        .send(invalidDto)
        .expect(400);
    });

    it('should normalize whitespace in names', async () => {
      const createDto = {
        firstName: '  John  ',
        lastName: '  Doe  ',
        phone: '+1111111111',
        status: GuestStatus.PENDING,
      };

      const response = await request(app.getHttpServer())
        .post('/guests')
        .send(createDto)
        .expect(201);

      expect(response.body.firstName).toBe('John');
      expect(response.body.lastName).toBe('Doe');
    });
  });

  describe('GET /guests', () => {
    beforeEach(async () => {
      // Create test guests
      await prisma.guest.createMany({
        data: [
          {
            firstName: 'Alice',
            lastName: 'Anderson',
            phone: '+1111111111',
            church: 'Church A',
            city: 'City A',
            isPastor: true,
            status: GuestStatus.CONFIRMED,
          },
          {
            firstName: 'Bob',
            lastName: 'Brown',
            phone: '+2222222222',
            church: 'Church B',
            city: 'City B',
            isPastor: false,
            status: GuestStatus.PENDING,
          },
          {
            firstName: 'Charlie',
            lastName: 'Clark',
            phone: '+3333333333',
            church: 'Church A',
            city: 'City A',
            isPastor: false,
            status: GuestStatus.DECLINED,
          },
        ],
      });
    });

    it('should return paginated guests', async () => {
      const response = await request(app.getHttpServer())
        .get('/guests')
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(response.body).toMatchObject({
        data: expect.any(Array),
        meta: {
          total: 3,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });
      expect(response.body.data).toHaveLength(3);
    });

    it('should filter by status', async () => {
      const response = await request(app.getHttpServer())
        .get('/guests')
        .query({ status: GuestStatus.CONFIRMED })
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].firstName).toBe('Alice');
    });

    it('should filter by isPastor', async () => {
      const response = await request(app.getHttpServer())
        .get('/guests')
        .query({ isPastor: true })
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].firstName).toBe('Alice');
    });

    it('should filter by church', async () => {
      const response = await request(app.getHttpServer())
        .get('/guests')
        .query({ church: 'Church A' })
        .expect(200);

      expect(response.body.data).toHaveLength(2);
    });

    it('should search by name (case-insensitive)', async () => {
      const response = await request(app.getHttpServer())
        .get('/guests')
        .query({ search: 'alice' })
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].firstName).toBe('Alice');
    });

    it('should combine multiple filters', async () => {
      const response = await request(app.getHttpServer())
        .get('/guests')
        .query({
          church: 'Church A',
          status: GuestStatus.CONFIRMED,
          isPastor: true,
        })
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].firstName).toBe('Alice');
    });

    it('should sort by firstName ASC', async () => {
      const response = await request(app.getHttpServer())
        .get('/guests')
        .query({ sortBy: 'firstName', sortOrder: 'asc' })
        .expect(200);

      const names = response.body.data.map((g: any) => g.firstName);
      expect(names).toEqual(['Alice', 'Bob', 'Charlie']);
    });

    it('should sort by firstName DESC', async () => {
      const response = await request(app.getHttpServer())
        .get('/guests')
        .query({ sortBy: 'firstName', sortOrder: 'desc' })
        .expect(200);

      const names = response.body.data.map((g: any) => g.firstName);
      expect(names).toEqual(['Charlie', 'Bob', 'Alice']);
    });

    it('should paginate correctly', async () => {
      const page1 = await request(app.getHttpServer())
        .get('/guests')
        .query({ page: 1, limit: 2 })
        .expect(200);

      expect(page1.body.data).toHaveLength(2);
      expect(page1.body.meta.totalPages).toBe(2);

      const page2 = await request(app.getHttpServer())
        .get('/guests')
        .query({ page: 2, limit: 2 })
        .expect(200);

      expect(page2.body.data).toHaveLength(1);
    });

    it('should not return soft-deleted guests', async () => {
      // Soft delete Alice
      const alice = await prisma.guest.findFirst({
        where: { firstName: 'Alice' },
      });
      await prisma.guest.update({
        where: { id: alice.id },
        data: { deletedAt: new Date() },
      });

      const response = await request(app.getHttpServer())
        .get('/guests')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(
        response.body.data.find((g: any) => g.firstName === 'Alice'),
      ).toBeUndefined();
    });
  });

  describe('GET /guests/stats', () => {
    beforeEach(async () => {
      await prisma.guest.createMany({
        data: [
          {
            firstName: 'User1',
            lastName: 'Test',
            phone: '+1111111111',
            isPastor: true,
            status: GuestStatus.CONFIRMED,
          },
          {
            firstName: 'User2',
            lastName: 'Test',
            phone: '+2222222222',
            isPastor: true,
            status: GuestStatus.CONFIRMED,
          },
          {
            firstName: 'User3',
            lastName: 'Test',
            phone: '+3333333333',
            isPastor: false,
            status: GuestStatus.PENDING,
          },
          {
            firstName: 'User4',
            lastName: 'Test',
            phone: '+4444444444',
            isPastor: false,
            status: GuestStatus.DECLINED,
          },
        ],
      });
    });

    it('should return correct statistics', async () => {
      const response = await request(app.getHttpServer())
        .get('/guests/stats')
        .expect(200);

      expect(response.body).toMatchObject({
        total: 4,
        confirmed: 2,
        pending: 1,
        declined: 1,
        pastors: 2,
      });
    });
  });

  describe('GET /guests/:id', () => {
    let guestId: number;

    beforeEach(async () => {
      const guest = await prisma.guest.create({
        data: {
          firstName: 'Test',
          lastName: 'User',
          phone: '+9999999999',
          status: GuestStatus.PENDING,
        },
      });
      guestId = guest.id;

      // Create history entry
      await prisma.guestHistory.create({
        data: {
          guestId: guest.id,
          action: 'CREATED',
          field: 'status',
          newValue: 'PENDING',
        },
      });
    });

    it('should return guest with relationships', async () => {
      const response = await request(app.getHttpServer())
        .get(`/guests/${guestId}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: guestId,
        firstName: 'Test',
        lastName: 'User',
        phone: '+9999999999',
        history: expect.any(Array),
      });
      expect(response.body.history).toHaveLength(1);
    });

    it('should return 404 for non-existent guest', async () => {
      await request(app.getHttpServer()).get('/guests/99999').expect(404);
    });

    it('should return 404 for soft-deleted guest', async () => {
      await prisma.guest.update({
        where: { id: guestId },
        data: { deletedAt: new Date() },
      });

      await request(app.getHttpServer()).get(`/guests/${guestId}`).expect(404);
    });
  });

  describe('PATCH /guests/:id', () => {
    let guestId: number;

    beforeEach(async () => {
      const guest = await prisma.guest.create({
        data: {
          firstName: 'Original',
          lastName: 'Name',
          phone: '+5555555555',
          status: GuestStatus.PENDING,
        },
      });
      guestId = guest.id;
    });

    it('should update guest successfully', async () => {
      const updateDto = {
        firstName: 'Updated',
        lastName: 'Name',
        status: GuestStatus.CONFIRMED,
      };

      const response = await request(app.getHttpServer())
        .patch(`/guests/${guestId}`)
        .send(updateDto)
        .expect(200);

      expect(response.body.firstName).toBe('Updated');
      expect(response.body.status).toBe(GuestStatus.CONFIRMED);

      // Verify history entry created
      const history = await prisma.guestHistory.findMany({
        where: { guestId },
      });
      expect(history.length).toBeGreaterThan(0);
    });

    it('should return 404 for non-existent guest', async () => {
      await request(app.getHttpServer())
        .patch('/guests/99999')
        .send({ firstName: 'Test' })
        .expect(404);
    });

    it('should normalize whitespace on update', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/guests/${guestId}`)
        .send({ firstName: '  Trimmed  ' })
        .expect(200);

      expect(response.body.firstName).toBe('Trimmed');
    });
  });

  describe('DELETE /guests/:id', () => {
    let guestId: number;

    beforeEach(async () => {
      const guest = await prisma.guest.create({
        data: {
          firstName: 'ToDelete',
          lastName: 'User',
          phone: '+6666666666',
          status: GuestStatus.PENDING,
        },
      });
      guestId = guest.id;
    });

    it('should soft delete guest', async () => {
      await request(app.getHttpServer())
        .delete(`/guests/${guestId}`)
        .expect(200);

      // Verify soft delete (deletedAt set)
      const guest = await prisma.guest.findUnique({
        where: { id: guestId },
      });
      expect(guest?.deletedAt).toBeTruthy();
    });

    it('should return 404 for non-existent guest', async () => {
      await request(app.getHttpServer()).delete('/guests/99999').expect(404);
    });
  });

  describe('POST /guests/bulk/status', () => {
    let guestIds: number[];

    beforeEach(async () => {
      const guests = await prisma.guest.createMany({
        data: [
          {
            firstName: 'Guest1',
            lastName: 'Test',
            phone: '+7777777771',
            status: GuestStatus.PENDING,
          },
          {
            firstName: 'Guest2',
            lastName: 'Test',
            phone: '+7777777772',
            status: GuestStatus.PENDING,
          },
          {
            firstName: 'Guest3',
            lastName: 'Test',
            phone: '+7777777773',
            status: GuestStatus.PENDING,
          },
        ],
      });

      const allGuests = await prisma.guest.findMany({
        where: { firstName: { startsWith: 'Guest' } },
        select: { id: true },
      });
      guestIds = allGuests.map((g) => g.id);
    });

    it('should bulk update status', async () => {
      const response = await request(app.getHttpServer())
        .post('/guests/bulk/status')
        .send({
          ids: guestIds,
          status: GuestStatus.CONFIRMED,
        })
        .expect(201);

      expect(response.body.count).toBe(3);

      // Verify updates
      const updated = await prisma.guest.findMany({
        where: { id: { in: guestIds } },
      });
      expect(updated.every((g) => g.status === GuestStatus.CONFIRMED)).toBe(
        true,
      );
    });
  });

  describe('POST /guests/bulk/pastor', () => {
    let guestIds: number[];

    beforeEach(async () => {
      const guests = await prisma.guest.createMany({
        data: [
          {
            firstName: 'Pastor1',
            lastName: 'Test',
            phone: '+8888888881',
            isPastor: false,
            status: GuestStatus.PENDING,
          },
          {
            firstName: 'Pastor2',
            lastName: 'Test',
            phone: '+8888888882',
            isPastor: false,
            status: GuestStatus.PENDING,
          },
        ],
      });

      const allGuests = await prisma.guest.findMany({
        where: { firstName: { startsWith: 'Pastor' } },
        select: { id: true },
      });
      guestIds = allGuests.map((g) => g.id);
    });

    it('should bulk update pastor status', async () => {
      const response = await request(app.getHttpServer())
        .post('/guests/bulk/pastor')
        .send({
          ids: guestIds,
          isPastor: true,
        })
        .expect(201);

      expect(response.body.count).toBe(2);

      // Verify updates
      const updated = await prisma.guest.findMany({
        where: { id: { in: guestIds } },
      });
      expect(updated.every((g) => g.isPastor === true)).toBe(true);
    });
  });

  describe('POST /guests/bulk/delete', () => {
    let guestIds: number[];

    beforeEach(async () => {
      const guests = await prisma.guest.createMany({
        data: [
          {
            firstName: 'Delete1',
            lastName: 'Test',
            phone: '+9999999991',
            status: GuestStatus.PENDING,
          },
          {
            firstName: 'Delete2',
            lastName: 'Test',
            phone: '+9999999992',
            status: GuestStatus.PENDING,
          },
        ],
      });

      const allGuests = await prisma.guest.findMany({
        where: { firstName: { startsWith: 'Delete' } },
        select: { id: true },
      });
      guestIds = allGuests.map((g) => g.id);
    });

    it('should bulk soft delete guests', async () => {
      const response = await request(app.getHttpServer())
        .post('/guests/bulk/delete')
        .send({ ids: guestIds })
        .expect(200);

      expect(response.body.count).toBe(2);

      // Verify soft deletes
      const deleted = await prisma.guest.findMany({
        where: { id: { in: guestIds } },
      });
      expect(deleted.every((g) => g.deletedAt !== null)).toBe(true);
    });
  });

  describe('GET /guests/history', () => {
    beforeEach(async () => {
      // Create guest and history entries
      const guest = await prisma.guest.create({
        data: {
          firstName: 'History',
          lastName: 'Test',
          phone: '+1010101010',
          status: GuestStatus.PENDING,
        },
      });

      await prisma.guestHistory.createMany({
        data: [
          {
            guestId: guest.id,
            action: 'CREATED',
            field: 'status',
            newValue: 'PENDING',
          },
          {
            guestId: guest.id,
            action: 'UPDATED',
            field: 'status',
            oldValue: 'PENDING',
            newValue: 'CONFIRMED',
          },
          {
            guestId: guest.id,
            action: 'UPDATED',
            field: 'isPastor',
            oldValue: 'false',
            newValue: 'true',
          },
        ],
      });
    });

    it('should return paginated history', async () => {
      const response = await request(app.getHttpServer())
        .get('/guests/history')
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(response.body).toMatchObject({
        data: expect.any(Array),
        meta: {
          total: 3,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });
      expect(response.body.data).toHaveLength(3);
    });

    it('should paginate history correctly', async () => {
      const page1 = await request(app.getHttpServer())
        .get('/guests/history')
        .query({ page: 1, limit: 2 })
        .expect(200);

      expect(page1.body.data).toHaveLength(2);
      expect(page1.body.meta.totalPages).toBe(2);
    });
  });

  describe('GET /guests/:id/history', () => {
    let guestId: number;

    beforeEach(async () => {
      const guest = await prisma.guest.create({
        data: {
          firstName: 'GuestHistory',
          lastName: 'Test',
          phone: '+2020202020',
          status: GuestStatus.PENDING,
        },
      });
      guestId = guest.id;

      await prisma.guestHistory.createMany({
        data: [
          {
            guestId: guest.id,
            action: 'CREATED',
            field: 'status',
            newValue: 'PENDING',
          },
          {
            guestId: guest.id,
            action: 'UPDATED',
            field: 'status',
            oldValue: 'PENDING',
            newValue: 'CONFIRMED',
          },
        ],
      });
    });

    it('should return guest-specific history', async () => {
      const response = await request(app.getHttpServer())
        .get(`/guests/${guestId}/history`)
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.every((h: any) => h.guestId === guestId)).toBe(
        true,
      );
    });

    it('should return 404 for non-existent guest', async () => {
      await request(app.getHttpServer())
        .get('/guests/99999/history')
        .query({ page: 1, limit: 10 })
        .expect(404);
    });
  });
});
