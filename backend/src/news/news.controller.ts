import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar todas as notícias' })
  @ApiOkResponse({ description: 'Lista de notícias ordenada por data' })
  findAll() { return this.newsService.findAll(); }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Buscar notícia por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.newsService.findOne(id); }

  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Criar notícia (admin)' })
  @ApiCreatedResponse({ description: 'Notícia criada com sucesso' })
  create(@Body() dto: CreateNewsDto) { return this.newsService.create(dto); }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Editar notícia (admin)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateNewsDto) {
    return this.newsService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Excluir notícia (admin)' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.newsService.remove(id); }
}
