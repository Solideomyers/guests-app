import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { ExportsService } from './exports.service';
import { GuestsService } from '../guests/guests.service';
import { FilterGuestDto } from '../guests/dto/filter-guest.dto';

@Controller('exports')
export class ExportsController {
  constructor(
    private readonly exportsService: ExportsService,
    private readonly guestsService: GuestsService,
  ) {}

  /**
   * Export guests to CSV
   * POST /api/v1/exports/csv
   * Body: FilterGuestDto (optional filters)
   */
  @Post('csv')
  @HttpCode(HttpStatus.OK)
  async exportCSV(
    @Body() filterDto: FilterGuestDto,
    @Res() res: Response,
  ): Promise<void> {
    try {
      // Get all guests matching the filters (no pagination for export)
      const result = await this.guestsService.findAll({
        ...filterDto,
        page: 1,
        limit: 100000, // Get all records
      });

      // Generate CSV
      const csv = await this.exportsService.exportToCSV(result.data);

      // Set headers for file download
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `invitados_${timestamp}.csv`;

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}"`,
      );
      res.setHeader('Content-Length', Buffer.byteLength(csv, 'utf-8'));

      // Send CSV
      res.send(csv);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new BadRequestException('Error al generar CSV: ' + errorMessage);
    }
  }

  /**
   * Export guests to PDF
   * POST /api/v1/exports/pdf
   * Body: FilterGuestDto (optional filters)
   */
  @Post('pdf')
  @HttpCode(HttpStatus.OK)
  async exportPDF(
    @Body() filterDto: FilterGuestDto,
    @Res() res: Response,
  ): Promise<void> {
    try {
      // Get all guests matching the filters (no pagination for export)
      const result = await this.guestsService.findAll({
        ...filterDto,
        page: 1,
        limit: 100000, // Get all records
      });

      // Generate PDF
      const pdfBuffer = await this.exportsService.exportToPDF(result.data);

      // Set headers for file download
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `invitados_${timestamp}.pdf`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}"`,
      );
      res.setHeader('Content-Length', pdfBuffer.length);

      // Send PDF
      res.send(pdfBuffer);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new BadRequestException('Error al generar PDF: ' + errorMessage);
    }
  }
}
