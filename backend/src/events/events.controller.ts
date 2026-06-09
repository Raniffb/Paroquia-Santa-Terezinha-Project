import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar todos os eventos' })
  findAll() { return this.eventsService.findAll(); }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Buscar evento por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.eventsService.findOne(id); }

  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Criar evento (admin)' })
  create(@Body() dto: CreateEventDto) { return this.eventsService.create(dto); }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Editar evento (admin)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEventDto) {
    return this.eventsService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Excluir evento (admin)' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.eventsService.remove(id); }
}
