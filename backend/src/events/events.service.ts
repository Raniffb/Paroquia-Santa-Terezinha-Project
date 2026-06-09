import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    private prisma: PrismaService,
    private realtime: RealtimeGateway,
  ) {}

  findAll() {
    return this.prisma.event.findMany({ orderBy: { date: 'asc' } });
  }

  async findOne(id: number) {
    const item = await this.prisma.event.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`Evento #${id} não encontrado`);
    return item;
  }

  async create(dto: CreateEventDto) {
    const item = await this.prisma.event.create({
      data: { ...dto, date: new Date(dto.date) },
    });
    this.realtime.emit('events:changed');
    return item;
  }

  async update(id: number, dto: UpdateEventDto) {
    await this.findOne(id);
    const item = await this.prisma.event.update({
      where: { id },
      data: { ...dto, date: dto.date ? new Date(dto.date) : undefined },
    });
    this.realtime.emit('events:changed');
    return item;
  }

  async remove(id: number) {
    await this.findOne(id);
    const item = await this.prisma.event.delete({ where: { id } });
    this.realtime.emit('events:changed');
    return item;
  }
}
