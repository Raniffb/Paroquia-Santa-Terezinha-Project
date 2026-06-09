import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as notícias' })
  @ApiOkResponse({ description: 'Lista de notícias ordenada por data' })
  findAll() { return this.newsService.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar notícia por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.newsService.findOne(id); }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Criar notícia (admin)' })
  @ApiCreatedResponse({ description: 'Notícia criada com sucesso' })
  create(@Body() dto: CreateNewsDto) { return this.newsService.create(dto); }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Editar notícia (admin)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateNewsDto) {
    return this.newsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Excluir notícia (admin)' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.newsService.remove(id); }
}
