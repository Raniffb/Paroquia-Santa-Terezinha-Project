import { Module } from '@nestjs/common';
import { MassSchedulesService } from './mass-schedules.service';
import { MassSchedulesController } from './mass-schedules.controller';

@Module({
  controllers: [MassSchedulesController],
  providers: [MassSchedulesService],
})
export class MassSchedulesModule {}
