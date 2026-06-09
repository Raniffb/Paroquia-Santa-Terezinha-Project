import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SacramentosService } from './sacramentos.service';
import { CreateSacramentoDto } from './dto/create-sacramento.dto';
import { UpdateSacramentoDto } from './dto/update-sacramento.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Sacramentos')
@Controller('sacramentos')
export class SacramentosController {
  constructor(private sacramentosService: SacramentosService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar sacramentos' })
  findAll() { return this.sacramentosService.findAll(); }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Buscar sacramento por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.sacramentosService.findOne(id); }

  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Criar sacramento (admin)' })
  create(@Body() dto: CreateSacramentoDto) { return this.sacramentosService.create(dto); }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Editar sacramento (admin)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSacramentoDto) {
    return this.sacramentosService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Excluir sacramento (admin)' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.sacramentosService.remove(id); }
}
