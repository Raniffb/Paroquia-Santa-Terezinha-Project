import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ContactMessagesService } from './contact-messages.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Contact Messages')
@Controller('contact-messages')
export class ContactMessagesController {
  constructor(private service: ContactMessagesService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Enviar mensagem de contato' })
  create(@Body() dto: CreateContactMessageDto) { return this.service.create(dto); }

  @Get()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Listar mensagens de contato (admin)' })
  findAll() { return this.service.findAll(); }

  @Patch(':id/read')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Marcar mensagem como lida (admin)' })
  markRead(@Param('id', ParseIntPipe) id: number) { return this.service.markRead(id); }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Excluir mensagem (admin)' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
