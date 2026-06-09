import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NoticesService } from './notices.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Notices')
@Controller('notices')
export class NoticesController {
  constructor(private noticesService: NoticesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os avisos' })
  findAll() { return this.noticesService.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar aviso por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.noticesService.findOne(id); }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Criar aviso (admin)' })
  create(@Body() dto: CreateNoticeDto) { return this.noticesService.create(dto); }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Editar aviso (admin)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateNoticeDto) {
    return this.noticesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Excluir aviso (admin)' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.noticesService.remove(id); }
}
