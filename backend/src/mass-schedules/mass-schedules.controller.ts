import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { MassSchedulesService } from './mass-schedules.service';
import { CreateMassScheduleDto } from './dto/create-mass-schedule.dto';
import { UpdateMassScheduleDto } from './dto/update-mass-schedule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('mass-schedules')
export class MassSchedulesController {
  constructor(private massSchedulesService: MassSchedulesService) {}

  @Get()
  findAll() { return this.massSchedulesService.findAll(); }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateMassScheduleDto) { return this.massSchedulesService.create(dto); }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMassScheduleDto) {
    return this.massSchedulesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) { return this.massSchedulesService.remove(id); }
}
