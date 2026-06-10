import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ConfessionSchedulesService } from './confession-schedules.service';
import { CreateConfessionScheduleDto } from './dto/create-confession-schedule.dto';
import { UpdateConfessionScheduleDto } from './dto/update-confession-schedule.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Confession Schedules')
@Controller('confession-schedules')
export class ConfessionSchedulesController {
  constructor(private service: ConfessionSchedulesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar horários de confissão' })
  findAll() { return this.service.findAll(); }

  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Criar horário de confissão (admin)' })
  create(@Body() dto: CreateConfessionScheduleDto) { return this.service.create(dto); }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Editar horário de confissão (admin)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateConfessionScheduleDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Excluir horário de confissão (admin)' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
