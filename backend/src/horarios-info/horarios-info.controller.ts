import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { HorariosInfoService } from './horarios-info.service';
import { CreateHorariosInfoDto } from './dto/create-horarios-info.dto';
import { UpdateHorariosInfoDto } from './dto/update-horarios-info.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('HorariosInfo')
@Controller('horarios-info')
export class HorariosInfoController {
  constructor(private horariosInfoService: HorariosInfoService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar informações de horários' })
  findAll() { return this.horariosInfoService.findAll(); }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Buscar informação por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.horariosInfoService.findOne(id); }

  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Criar informação (admin)' })
  create(@Body() dto: CreateHorariosInfoDto) { return this.horariosInfoService.create(dto); }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Editar informação (admin)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateHorariosInfoDto) {
    return this.horariosInfoService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Excluir informação (admin)' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.horariosInfoService.remove(id); }
}
