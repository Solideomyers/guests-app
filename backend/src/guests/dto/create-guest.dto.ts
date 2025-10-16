import { GuestStatus } from '@prisma/client';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateGuestDto {
  @IsString()
  @MinLength(1, { message: 'First name is required' })
  @MaxLength(100)
  firstName: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  lastName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  address?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  state?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  city?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  church?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsEnum(GuestStatus)
  @IsOptional()
  status?: GuestStatus;

  @IsBoolean()
  @IsOptional()
  isPastor?: boolean;
}
