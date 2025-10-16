import { GuestStatus } from '@prisma/client';
import { IsEnum, IsArray, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class BulkUpdateStatusDto {
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  ids: number[];

  @IsEnum(GuestStatus)
  status: GuestStatus;
}

export class BulkUpdatePastorDto {
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  ids: number[];

  @IsEnum([true, false])
  isPastor: boolean;
}

export class BulkDeleteDto {
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  ids: number[];
}
