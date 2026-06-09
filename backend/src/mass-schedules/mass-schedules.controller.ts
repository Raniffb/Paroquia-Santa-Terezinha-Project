import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MassSchedulesService } from './mass-schedules.service';
import { CreateMassScheduleDto } from './dto/create-mass-schedule.dto';
import { UpdateMassScheduleDto } from './dto/update-mass-schedule.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Mass Schedules')
@Controller('mass-schedules')
export class MassSchedulesController {
  constructor(private massSchedulesService: MassSchedulesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar todos os horários de missa' })
  findAll() { return this.massSchedulesService.findAll(); }

  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Criar horário de missa (admin)' })
  create(@Body() dto: CreateMassScheduleDto) { return this.massSchedulesService.create(dto); }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Editar horário de missa (admin)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMassScheduleDto) {
    return this.massSchedulesService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Excluir horário de missa (admin)' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.massSchedulesService.remove(id); }
}
