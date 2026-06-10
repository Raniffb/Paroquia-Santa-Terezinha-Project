import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';

@Injectable()
export class ContactMessagesService {
  constructor(
    private prisma: PrismaService,
    private realtime: RealtimeGateway,
  ) {}

  async create(dto: CreateContactMessageDto) {
    const msg = await this.prisma.contactMessage.create({ data: dto });
    this.realtime.emit('contact-messages:changed');
    return msg;
  }

  findAll() {
    return this.prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async markRead(id: number) {
    const msg = await this.prisma.contactMessage.findUnique({ where: { id } });
    if (!msg) throw new NotFoundException(`Mensagem #${id} não encontrada`);
    const updated = await this.prisma.contactMessage.update({ where: { id }, data: { read: true } });
    this.realtime.emit('contact-messages:changed');
    return updated;
  }

  async remove(id: number) {
    const msg = await this.prisma.contactMessage.findUnique({ where: { id } });
    if (!msg) throw new NotFoundException(`Mensagem #${id} não encontrada`);
    const deleted = await this.prisma.contactMessage.delete({ where: { id } });
    this.realtime.emit('contact-messages:changed');
    return deleted;
  }
}
