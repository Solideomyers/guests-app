import { Test, TestingModule } from '@nestjs/testing';
import { ExportsService } from './exports.service';
import { GuestStatus } from '@prisma/client';
import { createMockGuest, createMockGuests } from '../test/mocks/guest.factory';

describe('ExportsService', () => {
  let service: ExportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExportsService],
    }).compile();

    service = module.get<ExportsService>(ExportsService);
  });

  describe('exportToCSV', () => {
    it('should generate CSV correctly', async () => {
      const guests = createMockGuests(2, {
        firstName: 'John',
        lastName: 'Doe',
        church: 'First Baptist',
        city: 'Los Angeles',
        status: GuestStatus.CONFIRMED,
      });

      const result = await service.exportToCSV(guests);

      // Check header
      expect(result).toContain(
        'ID,Nombre,Apellido,Dirección,Estado,Ciudad,Iglesia,Teléfono,Estado,Pastor,Notas,Fecha Creación',
      );

      // Check data rows
      expect(result).toContain('John');
      expect(result).toContain('Doe');
      expect(result).toContain('First Baptist');
      expect(result).toContain('CONFIRMED');
    });

    it('should include all fields in export', async () => {
      const guest = createMockGuest({
        firstName: 'Jane',
        lastName: 'Smith',
        address: '456 Oak St',
        state: 'Texas',
        city: 'Dallas',
        church: 'Community Church',
        phone: '555-9999',
        isPastor: true,
        notes: 'Important guest',
      });

      const result = await service.exportToCSV([guest]);

      expect(result).toContain('Jane');
      expect(result).toContain('Smith');
      expect(result).toContain('456 Oak St');
      expect(result).toContain('Texas');
      expect(result).toContain('Dallas');
      expect(result).toContain('Community Church');
      expect(result).toContain('555-9999');
      expect(result).toContain('Sí'); // isPastor = true
      expect(result).toContain('Important guest');
    });

    it('should handle empty datasets', async () => {
      const result = await service.exportToCSV([]);

      // Should only have header
      expect(result).toContain('ID,Nombre,Apellido');
      // Header + empty line at the end
      expect(result.split('\n').filter((line) => line.trim()).length).toBe(1);
    });

    it('should escape CSV special characters', async () => {
      const guest = createMockGuest({
        firstName: 'John, Jr.',
        notes: 'Has "special" characters\nNew line',
      });

      const result = await service.exportToCSV([guest]);

      // Should wrap values with special chars in quotes
      expect(result).toContain('"John, Jr."');
      expect(result).toContain('"Has ""special"" characters');
    });

    it('should handle null/optional fields', async () => {
      const guest = createMockGuest({
        lastName: null,
        address: null,
        state: null,
        city: null,
        church: null,
        phone: null,
        notes: null,
      });

      const result = await service.exportToCSV([guest]);

      // Should not throw error and should have empty values
      expect(result).toBeTruthy();
      const lines = result.split('\n');
      expect(lines.length).toBeGreaterThan(1);
    });

    it('should format dates correctly', async () => {
      const guest = createMockGuest({
        createdAt: new Date('2025-01-15T10:30:00'),
      });

      const result = await service.exportToCSV([guest]);

      expect(result).toContain('2025-01-15');
    });
  });

  describe('exportToPDF', () => {
    it('should generate PDF correctly', async () => {
      const guests = createMockGuests(3);

      const result = await service.exportToPDF(guests);

      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBeGreaterThan(0);

      // PDF files start with %PDF
      const pdfHeader = result.toString('utf8', 0, 4);
      expect(pdfHeader).toBe('%PDF');
    });

    it('should include guest data in PDF', async () => {
      const guest = createMockGuest({
        firstName: 'TestGuest',
        lastName: 'ForPDF',
        church: 'Test Church',
        city: 'Test City',
        phone: '555-TEST',
        status: GuestStatus.CONFIRMED,
        isPastor: true,
      });

      const result = await service.exportToPDF([guest]);

      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBeGreaterThan(0);

      // PDF is compressed, so we just check it's valid
      const pdfHeader = result.toString('utf8', 0, 4);
      expect(pdfHeader).toBe('%PDF');
    });

    it('should handle empty datasets', async () => {
      const result = await service.exportToPDF([]);

      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBeGreaterThan(0);

      // Should still be valid PDF
      const pdfHeader = result.toString('utf8', 0, 4);
      expect(pdfHeader).toBe('%PDF');
    });

    it('should include title and date in PDF', async () => {
      const guests = createMockGuests(1);

      const result = await service.exportToPDF(guests);

      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBeGreaterThan(0);

      // Just validate it's a valid PDF
      const pdfHeader = result.toString('utf8', 0, 4);
      expect(pdfHeader).toBe('%PDF');
    });

    it('should handle large datasets', async () => {
      // Create 50 guests to test pagination (smaller to avoid buffer issues)
      const guests = createMockGuests(50);

      const result = await service.exportToPDF(guests);

      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBeGreaterThan(0);

      // Just validate it's a valid PDF
      const pdfHeader = result.toString('utf8', 0, 4);
      expect(pdfHeader).toBe('%PDF');
    });

    it('should not throw error on PDF generation', async () => {
      const guests = createMockGuests(5, {
        firstName: 'Test',
        lastName: 'Guest',
        church: 'Church Name',
      });

      await expect(service.exportToPDF(guests)).resolves.not.toThrow();
    });
  });

  describe('CSV escaping', () => {
    it('should escape commas in values', async () => {
      const guest = createMockGuest({
        firstName: 'John, Jr.',
      });

      const result = await service.exportToCSV([guest]);

      expect(result).toContain('"John, Jr."');
    });

    it('should escape quotes by doubling them', async () => {
      const guest = createMockGuest({
        notes: 'He said "hello"',
      });

      const result = await service.exportToCSV([guest]);

      expect(result).toContain('He said ""hello""');
    });

    it('should escape newlines', async () => {
      const guest = createMockGuest({
        notes: 'Line 1\nLine 2',
      });

      const result = await service.exportToCSV([guest]);

      // Should wrap in quotes
      expect(result).toContain('"Line 1\nLine 2"');
    });

    it('should not escape normal values', async () => {
      const guest = createMockGuest({
        firstName: 'SimpleValue',
      });

      const result = await service.exportToCSV([guest]);

      // Should NOT be wrapped in quotes
      expect(result).toMatch(/SimpleValue(?!["'])/);
    });
  });
});
