import { Module } from '@nestjs/common';
import { HorariosInfoService } from './horarios-info.service';
import { HorariosInfoController } from './horarios-info.controller';

@Module({
  controllers: [HorariosInfoController],
  providers: [HorariosInfoService],
})
export class HorariosInfoModule {}
