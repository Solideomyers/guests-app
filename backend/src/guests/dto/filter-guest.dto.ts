import { GuestStatus } from '@prisma/client';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsBoolean,
  IsInt,
  Min,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class FilterGuestDto {
  // Basic search (searches across multiple fields)
  @IsString()
  @IsOptional()
  search?: string;

  // Advanced search by specific fields
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  state?: string;

  // Filters
  @IsEnum(GuestStatus)
  @IsOptional()
  status?: GuestStatus;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isPastor?: boolean;

  @IsString()
  @IsOptional()
  church?: string;

  @IsString()
  @IsOptional()
  city?: string;

  // Sorting
  @IsString()
  @IsOptional()
  sortBy?: string = 'createdAt';

  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';

  // Pagination
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}
