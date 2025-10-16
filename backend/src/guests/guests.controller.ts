import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { GuestsService } from './guests.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { FilterGuestDto } from './dto/filter-guest.dto';
import {
  BulkUpdateStatusDto,
  BulkUpdatePastorDto,
  BulkDeleteDto,
} from './dto/bulk-operation.dto';

@Controller('guests')
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  /**
   * POST /api/v1/guests
   * Create a new guest
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createGuestDto: CreateGuestDto) {
    return this.guestsService.create(createGuestDto);
  }

  /**
   * GET /api/v1/guests
   * Get all guests with pagination and filters
   */
  @Get()
  findAll(@Query() filterDto: FilterGuestDto) {
    return this.guestsService.findAll(filterDto);
  }

  /**
   * GET /api/v1/guests/stats
   * Get statistics
   */
  @Get('stats')
  getStats() {
    return this.guestsService.getStats();
  }

  /**
   * GET /api/v1/guests/history
   * Get complete audit history with pagination
   */
  @Get('history')
  getHistory(
    @Query('page', ParseIntPipe) page?: number,
    @Query('limit', ParseIntPipe) limit?: number,
  ) {
    return this.guestsService.getHistory(page, limit);
  }

  /**
   * GET /api/v1/guests/:id
   * Get a single guest by ID
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.guestsService.findOne(id);
  }

  /**
   * GET /api/v1/guests/:id/history
   * Get audit history for a specific guest
   */
  @Get(':id/history')
  getGuestHistory(
    @Param('id', ParseIntPipe) id: number,
    @Query('page', ParseIntPipe) page?: number,
    @Query('limit', ParseIntPipe) limit?: number,
  ) {
    return this.guestsService.getGuestHistory(id, page, limit);
  }

  /**
   * PATCH /api/v1/guests/:id
   * Update a guest
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGuestDto: UpdateGuestDto,
  ) {
    return this.guestsService.update(id, updateGuestDto);
  }

  /**
   * DELETE /api/v1/guests/:id
   * Delete a guest (soft delete)
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.guestsService.remove(id);
  }

  /**
   * POST /api/v1/guests/bulk/status
   * Bulk update status
   */
  @Post('bulk/status')
  bulkUpdateStatus(@Body() bulkUpdateDto: BulkUpdateStatusDto) {
    return this.guestsService.bulkUpdateStatus(bulkUpdateDto);
  }

  /**
   * POST /api/v1/guests/bulk/pastor
   * Bulk update pastor status
   */
  @Post('bulk/pastor')
  bulkUpdatePastor(@Body() bulkUpdateDto: BulkUpdatePastorDto) {
    return this.guestsService.bulkUpdatePastor(bulkUpdateDto);
  }

  /**
   * POST /api/v1/guests/bulk/delete
   * Bulk delete guests
   */
  @Post('bulk/delete')
  @HttpCode(HttpStatus.OK)
  bulkDelete(@Body() bulkDeleteDto: BulkDeleteDto) {
    return this.guestsService.bulkDelete(bulkDeleteDto);
  }
}
