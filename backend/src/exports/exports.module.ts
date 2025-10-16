import { Module } from '@nestjs/common';
import { ExportsService } from './exports.service';
import { ExportsController } from './exports.controller';
import { GuestsModule } from '../guests/guests.module';

@Module({
  imports: [GuestsModule],
  providers: [ExportsService],
  controllers: [ExportsController],
})
export class ExportsModule {}
