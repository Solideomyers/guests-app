import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { FilterGuestDto } from './dto/filter-guest.dto';
import {
  BulkUpdateStatusDto,
  BulkUpdatePastorDto,
  BulkDeleteDto,
} from './dto/bulk-operation.dto';
import { GuestStatus, Prisma } from '@prisma/client';

@Injectable()
export class GuestsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new guest
   */
  async create(createGuestDto: CreateGuestDto) {
    // Check for duplicates
    const existing = await this.prisma.guest.findFirst({
      where: {
        firstName: createGuestDto.firstName,
        lastName: createGuestDto.lastName || '',
        deletedAt: null,
      },
    });

    if (existing) {
      throw new BadRequestException('A guest with this name already exists');
    }

    const guest = await this.prisma.guest.create({
      data: {
        ...createGuestDto,
        status: createGuestDto.status || GuestStatus.PENDING,
        isPastor: createGuestDto.isPastor || false,
      },
    });

    // Create history entry
    await this.createHistoryEntry(guest.id, 'CREATE', null, null, null);

    return guest;
  }

  /**
   * Find all guests with pagination and filters
   */
  async findAll(filterDto: FilterGuestDto) {
    const {
      search,
      firstName,
      lastName,
      phone,
      address,
      state,
      status,
      isPastor,
      church,
      city,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filterDto;

    const skip = (page - 1) * limit;

    // Build advanced where clause
    const where: Prisma.GuestWhereInput = {
      deletedAt: null,
      ...(status && { status }),
      ...(isPastor !== undefined && { isPastor }),
      ...(church && { church: { contains: church, mode: 'insensitive' } }),
      ...(city && { city: { contains: city, mode: 'insensitive' } }),
      ...(state && { state: { contains: state, mode: 'insensitive' } }),
    };

    // Advanced search by specific fields
    if (firstName) {
      where.firstName = { contains: firstName, mode: 'insensitive' };
    }
    if (lastName) {
      where.lastName = { contains: lastName, mode: 'insensitive' };
    }
    if (phone) {
      where.phone = { contains: phone, mode: 'insensitive' };
    }
    if (address) {
      where.address = { contains: address, mode: 'insensitive' };
    }

    // Basic search across multiple fields (only if no specific field search)
    if (search && !firstName && !lastName && !phone && !address) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { church: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { state: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Validate sortBy field to prevent SQL injection
    const validSortFields = [
      'id',
      'firstName',
      'lastName',
      'church',
      'city',
      'state',
      'status',
      'isPastor',
      'createdAt',
      'updatedAt',
    ];
    const safeSortBy = validSortFields.includes(sortBy) ? sortBy : 'createdAt';

    // Execute queries in parallel
    const [guests, total] = await Promise.all([
      this.prisma.guest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [safeSortBy]: sortOrder },
      }),
      this.prisma.guest.count({ where }),
    ]);

    return {
      data: guests,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find one guest by ID
   */
  async findOne(id: number) {
    const guest = await this.prisma.guest.findFirst({
      where: { id, deletedAt: null },
      include: {
        history: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!guest) {
      throw new NotFoundException(`Guest with ID ${id} not found`);
    }

    return guest;
  }

  /**
   * Update a guest
   */
  async update(id: number, updateGuestDto: UpdateGuestDto) {
    const guest = await this.findOne(id);

    // Track changes for history
    const changes: Array<{
      field: string;
      oldValue: string;
      newValue: string;
    }> = [];

    Object.keys(updateGuestDto).forEach((key) => {
      const oldValue = guest[key];
      const newValue = updateGuestDto[key];
      if (oldValue !== newValue) {
        changes.push({
          field: key,
          oldValue: String(oldValue),
          newValue: String(newValue),
        });
      }
    });

    const updated = await this.prisma.guest.update({
      where: { id },
      data: updateGuestDto,
    });

    // Create history entries for each change
    for (const change of changes) {
      await this.createHistoryEntry(
        id,
        'UPDATE',
        change.field,
        change.oldValue,
        change.newValue,
      );
    }

    return updated;
  }

  /**
   * Soft delete a guest
   */
  async remove(id: number) {
    await this.findOne(id);

    const deleted = await this.prisma.guest.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await this.createHistoryEntry(id, 'DELETE', null, null, null);

    return { message: 'Guest deleted successfully', id: deleted.id };
  }

  /**
   * Get statistics
   */
  async getStats() {
    const [total, confirmed, pending, declined, pastors] = await Promise.all([
      this.prisma.guest.count({ where: { deletedAt: null } }),
      this.prisma.guest.count({
        where: { status: GuestStatus.CONFIRMED, deletedAt: null },
      }),
      this.prisma.guest.count({
        where: { status: GuestStatus.PENDING, deletedAt: null },
      }),
      this.prisma.guest.count({
        where: { status: GuestStatus.DECLINED, deletedAt: null },
      }),
      this.prisma.guest.count({
        where: { isPastor: true, deletedAt: null },
      }),
    ]);

    return {
      total,
      confirmed,
      pending,
      declined,
      pastors,
    };
  }

  /**
   * Bulk update status
   */
  async bulkUpdateStatus(bulkUpdateDto: BulkUpdateStatusDto) {
    const { ids, status } = bulkUpdateDto;

    const updated = await this.prisma.guest.updateMany({
      where: {
        id: { in: ids },
        deletedAt: null,
      },
      data: { status },
    });

    // Create history entries
    for (const id of ids) {
      await this.createHistoryEntry(
        id,
        'STATUS_CHANGE',
        'status',
        null,
        status,
      );
    }

    return {
      message: `${updated.count} guests updated successfully`,
      count: updated.count,
    };
  }

  /**
   * Bulk update pastor status
   */
  async bulkUpdatePastor(bulkUpdateDto: BulkUpdatePastorDto) {
    const { ids, isPastor } = bulkUpdateDto;

    const updated = await this.prisma.guest.updateMany({
      where: {
        id: { in: ids },
        deletedAt: null,
      },
      data: { isPastor },
    });

    return {
      message: `${updated.count} guests updated successfully`,
      count: updated.count,
    };
  }

  /**
   * Bulk delete guests
   */
  async bulkDelete(bulkDeleteDto: BulkDeleteDto) {
    const { ids } = bulkDeleteDto;

    const deleted = await this.prisma.guest.updateMany({
      where: {
        id: { in: ids },
        deletedAt: null,
      },
      data: { deletedAt: new Date() },
    });

    // Create history entries
    for (const id of ids) {
      await this.createHistoryEntry(id, 'DELETE', null, null, null);
    }

    return {
      message: `${deleted.count} guests deleted successfully`,
      count: deleted.count,
    };
  }

  /**
   * Helper: Create history entry
   */
  private async createHistoryEntry(
    guestId: number,
    action: string,
    field: string | null,
    oldValue: string | null,
    newValue: string | null,
  ) {
    return this.prisma.guestHistory.create({
      data: {
        guestId,
        action,
        field,
        oldValue,
        newValue,
      },
    });
  }

  /**
   * Get complete audit history with pagination
   */
  async getHistory(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const [history, total] = await Promise.all([
      this.prisma.guestHistory.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          guest: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      this.prisma.guestHistory.count(),
    ]);

    return {
      data: history,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get audit history for a specific guest
   */
  async getGuestHistory(guestId: number, page: number = 1, limit: number = 50) {
    // Verify guest exists
    await this.findOne(guestId);

    const skip = (page - 1) * limit;

    const [history, total] = await Promise.all([
      this.prisma.guestHistory.findMany({
        where: { guestId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.guestHistory.count({ where: { guestId } }),
    ]);

    return {
      data: history,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
