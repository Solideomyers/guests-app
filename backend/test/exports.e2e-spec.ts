import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { GuestStatus } from '@prisma/client';

describe('Exports API (E2E)', () => {
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

  describe('POST /exports/csv', () => {
    beforeEach(async () => {
      // Create test guests for export
      await prisma.guest.createMany({
        data: [
          {
            firstName: 'Alice',
            lastName: 'Anderson',
            phone: '+1111111111',

            church: 'Central Church',
            city: 'New York',
            isPastor: true,
            status: GuestStatus.CONFIRMED,
          },
          {
            firstName: 'Bob',
            lastName: 'Brown',
            phone: '+2222222222',

            church: 'East Church',
            city: 'Boston',
            isPastor: false,
            status: GuestStatus.PENDING,
          },
          {
            firstName: 'Charlie',
            lastName: 'Clark',
            phone: '+3333333333',

            church: 'West Church',
            city: 'Seattle',
            isPastor: false,
            status: GuestStatus.DECLINED,
          },
        ],
      });
    });

    it('should export all guests to CSV', async () => {
      const response = await request(app.getHttpServer())
        .post('/exports/csv')
        .send({}) // No filters = all guests
        .expect(200);

      // Verify headers
      expect(response.headers['content-type']).toContain('text/csv');
      expect(response.headers['content-disposition']).toContain('attachment');
      expect(response.headers['content-disposition']).toContain('.csv');

      // Verify CSV content
      const csvContent = response.text;
      expect(csvContent).toContain('Nombre'); // Header in Spanish
      expect(csvContent).toContain('Alice');
      expect(csvContent).toContain('Bob');
      expect(csvContent).toContain('Charlie');
      expect(csvContent).toContain('Central Church');
      expect(csvContent).toContain('East Church');
      expect(csvContent).toContain('West Church');

      // Verify CSV structure (4 lines: 1 header + 3 data rows)
      const lines = csvContent.trim().split('\n');
      expect(lines.length).toBeGreaterThanOrEqual(4);
    });

    it('should export filtered guests to CSV (status=CONFIRMED)', async () => {
      const response = await request(app.getHttpServer())
        .post('/exports/csv')
        .send({ status: GuestStatus.CONFIRMED })
        .expect(200);

      const csvContent = response.text;
      expect(csvContent).toContain('Alice'); // Confirmed
      expect(csvContent).not.toContain('Bob'); // Pending
      expect(csvContent).not.toContain('Charlie'); // Declined
    });

    it('should export filtered guests to CSV (isPastor=true)', async () => {
      const response = await request(app.getHttpServer())
        .post('/exports/csv')
        .send({ isPastor: true })
        .expect(200);

      const csvContent = response.text;
      expect(csvContent).toContain('Alice'); // Pastor
      expect(csvContent).not.toContain('Bob'); // Not pastor
      expect(csvContent).not.toContain('Charlie'); // Not pastor
    });

    it('should export filtered guests to CSV (church filter)', async () => {
      const response = await request(app.getHttpServer())
        .post('/exports/csv')
        .send({ church: 'Central Church' })
        .expect(200);

      const csvContent = response.text;
      expect(csvContent).toContain('Alice');
      expect(csvContent).not.toContain('Bob');
      expect(csvContent).not.toContain('Charlie');
    });

    it('should export empty CSV when no guests match filters', async () => {
      const response = await request(app.getHttpServer())
        .post('/exports/csv')
        .send({ church: 'NonExistent Church' })
        .expect(200);

      const csvContent = response.text;
      // Should only have header, no data rows
      const lines = csvContent.trim().split('\n');
      expect(lines.length).toBe(1); // Only header
      expect(csvContent).toContain('Nombre'); // Header in Spanish
    });

    it('should handle special characters in CSV', async () => {
      // Create guest with special characters
      await prisma.guest.create({
        data: {
          firstName: 'José',
          lastName: 'García',
          phone: '+4444444444',

          church: 'Iglesia "La Esperanza"',
          city: 'San José',
          status: GuestStatus.CONFIRMED,
        },
      });

      const response = await request(app.getHttpServer())
        .post('/exports/csv')
        .send({})
        .expect(200);

      const csvContent = response.text;
      expect(csvContent).toContain('José');
      expect(csvContent).toContain('García');
      expect(csvContent).toContain('Esperanza'); // Quotes should be handled
    });

    it('should include correct filename with timestamp', async () => {
      const response = await request(app.getHttpServer())
        .post('/exports/csv')
        .send({})
        .expect(200);

      const disposition = response.headers['content-disposition'];
      expect(disposition).toMatch(/invitados_\d{4}-\d{2}-\d{2}\.csv/);
    });
  });

  describe('POST /exports/pdf', () => {
    beforeEach(async () => {
      // Create test guests for PDF export
      await prisma.guest.createMany({
        data: [
          {
            firstName: 'David',
            lastName: 'Davis',
            phone: '+5555555555',

            church: 'North Church',
            city: 'Chicago',
            isPastor: true,
            status: GuestStatus.CONFIRMED,
          },
          {
            firstName: 'Eve',
            lastName: 'Evans',
            phone: '+6666666666',

            church: 'South Church',
            city: 'Miami',
            isPastor: false,
            status: GuestStatus.PENDING,
          },
        ],
      });
    });

    it('should export all guests to PDF', async () => {
      const response = await request(app.getHttpServer())
        .post('/exports/pdf')
        .send({}) // No filters = all guests
        .expect(200);

      // Verify headers
      expect(response.headers['content-type']).toContain('application/pdf');
      expect(response.headers['content-disposition']).toContain('attachment');
      expect(response.headers['content-disposition']).toContain('.pdf');

      // Verify PDF magic number (starts with %PDF)
      const pdfBuffer = response.body;
      const pdfHeader = Buffer.from(pdfBuffer).toString('ascii', 0, 4);
      expect(pdfHeader).toBe('%PDF');

      // Verify content length
      expect(response.headers['content-length']).toBeTruthy();
      const contentLength = parseInt(response.headers['content-length'], 10);
      expect(contentLength).toBeGreaterThan(0);
    });

    it('should export filtered guests to PDF (status=CONFIRMED)', async () => {
      const response = await request(app.getHttpServer())
        .post('/exports/pdf')
        .send({ status: GuestStatus.CONFIRMED })
        .expect(200);

      // Should generate valid PDF
      const pdfHeader = Buffer.from(response.body).toString('ascii', 0, 4);
      expect(pdfHeader).toBe('%PDF');
    });

    it('should export filtered guests to PDF (isPastor=true)', async () => {
      const response = await request(app.getHttpServer())
        .post('/exports/pdf')
        .send({ isPastor: true })
        .expect(200);

      // Should generate valid PDF
      const pdfHeader = Buffer.from(response.body).toString('ascii', 0, 4);
      expect(pdfHeader).toBe('%PDF');
    });

    it('should export filtered guests to PDF (church filter)', async () => {
      const response = await request(app.getHttpServer())
        .post('/exports/pdf')
        .send({ church: 'North Church' })
        .expect(200);

      // Should generate valid PDF
      const pdfHeader = Buffer.from(response.body).toString('ascii', 0, 4);
      expect(pdfHeader).toBe('%PDF');
    });

    it('should export empty PDF when no guests match filters', async () => {
      const response = await request(app.getHttpServer())
        .post('/exports/pdf')
        .send({ city: 'NonExistent City' })
        .expect(200);

      // Should still generate valid PDF (with header, no data)
      const pdfHeader = Buffer.from(response.body).toString('ascii', 0, 4);
      expect(pdfHeader).toBe('%PDF');
    });

    it('should handle special characters in PDF', async () => {
      // Create guest with special characters
      await prisma.guest.create({
        data: {
          firstName: 'María',
          lastName: 'Rodríguez',
          phone: '+7777777777',

          church: 'Iglesia Católica',
          city: 'México',
          status: GuestStatus.CONFIRMED,
        },
      });

      const response = await request(app.getHttpServer())
        .post('/exports/pdf')
        .send({})
        .expect(200);

      // Should generate valid PDF
      const pdfHeader = Buffer.from(response.body).toString('ascii', 0, 4);
      expect(pdfHeader).toBe('%PDF');
    });

    it('should include correct filename with timestamp', async () => {
      const response = await request(app.getHttpServer())
        .post('/exports/pdf')
        .send({})
        .expect(200);

      const disposition = response.headers['content-disposition'];
      expect(disposition).toMatch(/invitados_\d{4}-\d{2}-\d{2}\.pdf/);
    });

    it('should generate larger PDF for more guests', async () => {
      // Create many guests
      const manyGuests = Array.from({ length: 20 }, (_, i) => ({
        firstName: `Guest${i}`,
        lastName: `Test${i}`,
        phone: `+${i.toString().padStart(10, '0')}`,
        status: GuestStatus.CONFIRMED,
      }));

      await prisma.guest.createMany({ data: manyGuests });

      const response = await request(app.getHttpServer())
        .post('/exports/pdf')
        .send({})
        .expect(200);

      // Should generate valid PDF
      const pdfHeader = Buffer.from(response.body).toString('ascii', 0, 4);
      expect(pdfHeader).toBe('%PDF');

      // Should be larger than empty PDF
      const contentLength = parseInt(response.headers['content-length'], 10);
      expect(contentLength).toBeGreaterThan(1000); // Reasonable size for 22 guests
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid filter parameters in CSV export', async () => {
      // ValidationPipe with forbidNonWhitelisted rejects unknown properties
      await request(app.getHttpServer())
        .post('/exports/csv')
        .send({ invalidField: 'test' })
        .expect(400); // Expecting 400 because forbidNonWhitelisted is true
    });

    it('should handle invalid filter parameters in PDF export', async () => {
      // ValidationPipe with forbidNonWhitelisted rejects unknown properties
      await request(app.getHttpServer())
        .post('/exports/pdf')
        .send({ invalidField: 'test' })
        .expect(400); // Expecting 400 because forbidNonWhitelisted is true
    });
  });
});
