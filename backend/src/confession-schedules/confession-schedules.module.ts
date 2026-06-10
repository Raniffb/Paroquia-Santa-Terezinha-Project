import { Module } from '@nestjs/common';
import { ConfessionSchedulesService } from './confession-schedules.service';
import { ConfessionSchedulesController } from './confession-schedules.controller';

@Module({
  controllers: [ConfessionSchedulesController],
  providers: [ConfessionSchedulesService],
})
export class ConfessionSchedulesModule {}
