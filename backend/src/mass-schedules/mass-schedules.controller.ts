import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MassSchedulesService } from './mass-schedules.service';
import { CreateMassScheduleDto } from './dto/create-mass-schedule.dto';
import { UpdateMassScheduleDto } from './dto/update-mass-schedule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Mass Schedules')
@Controller('mass-schedules')
export class MassSchedulesController {
  constructor(private massSchedulesService: MassSchedulesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os horários de missa' })
  findAll() { return this.massSchedulesService.findAll(); }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Criar horário de missa (admin)' })
  create(@Body() dto: CreateMassScheduleDto) { return this.massSchedulesService.create(dto); }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Editar horário de missa (admin)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMassScheduleDto) {
    return this.massSchedulesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Excluir horário de missa (admin)' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.massSchedulesService.remove(id); }
}
