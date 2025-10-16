import { Injectable } from '@nestjs/common';
import { createObjectCsvWriter } from 'csv-writer';
import * as PDFDocument from 'pdfkit';
import { Guest } from '@prisma/client';

@Injectable()
export class ExportsService {
  /**
   * Export guests to CSV
   */
  async exportToCSV(guests: Guest[]): Promise<string> {
    // Convert data to CSV format manually
    const header = 'ID,Nombre,Apellido,Dirección,Estado,Ciudad,Iglesia,Teléfono,Estado,Pastor,Notas,Fecha Creación\n';
    const rows = guests.map(guest => {
      return [
        guest.id,
        this.escapeCSV(guest.firstName),
        this.escapeCSV(guest.lastName || ''),
        this.escapeCSV(guest.address || ''),
        this.escapeCSV(guest.state || ''),
        this.escapeCSV(guest.city || ''),
        this.escapeCSV(guest.church || ''),
        this.escapeCSV(guest.phone || ''),
        guest.status,
        guest.isPastor ? 'Sí' : 'No',
        this.escapeCSV(guest.notes || ''),
        guest.createdAt.toISOString().split('T')[0],
      ].join(',');
    }).join('\n');

    return header + rows;
  }

  /**
   * Export guests to PDF
   */
  async exportToPDF(guests: Guest[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });

      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // Title
      doc.fontSize(18).text('Lista de Invitados', { align: 'center' });
      doc.moveDown();
      doc.fontSize(10).text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, { align: 'center' });
      doc.moveDown(2);

      // Table headers
      doc.fontSize(9).font('Helvetica-Bold');
      const startY = doc.y;
      const colWidth = 80;
      let x = 50;

      const headers = ['Nombre', 'Iglesia', 'Ciudad', 'Teléfono', 'Estado', 'Pastor'];
      headers.forEach((header, i) => {
        doc.text(header, x + (i * colWidth), startY, { width: colWidth, align: 'left' });
      });

      doc.moveDown();
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.5);

      // Table rows
      doc.font('Helvetica').fontSize(8);
      guests.forEach((guest) => {
        const y = doc.y;

        // Check if we need a new page
        if (y > 500) {
          doc.addPage();
          doc.fontSize(8);
        }

        x = 50;
        const rowData = [
          `${guest.firstName} ${guest.lastName || ''}`,
          guest.church || '',
          guest.city || '',
          guest.phone || '',
          guest.status,
          guest.isPastor ? 'Sí' : 'No',
        ];

        rowData.forEach((data, i) => {
          doc.text(data, x + (i * colWidth), doc.y, { 
            width: colWidth - 5, 
            align: 'left',
            continued: i < rowData.length - 1 
          });
        });

        doc.text(''); // End the line
        doc.moveDown(0.3);
      });

      // Footer
      const pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);
        doc.fontSize(8).text(
          `Página ${i + 1} de ${pages.count}`,
          50,
          doc.page.height - 50,
          { align: 'center' }
        );
      }

      doc.end();
    });
  }

  /**
   * Helper: Escape CSV special characters
   */
  private escapeCSV(value: string): string {
    if (!value) return '';
    
    // If value contains comma, quotes, or newlines, wrap in quotes
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      // Escape quotes by doubling them
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
}
