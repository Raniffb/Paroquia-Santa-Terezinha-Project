import { Module } from '@nestjs/common';
import { SacramentosService } from './sacramentos.service';
import { SacramentosController } from './sacramentos.controller';

@Module({
  controllers: [SacramentosController],
  providers: [SacramentosService],
})
export class SacramentosModule {}
