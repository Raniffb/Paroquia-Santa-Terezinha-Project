import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { CreateConfessionScheduleDto } from './dto/create-confession-schedule.dto';
import { UpdateConfessionScheduleDto } from './dto/update-confession-schedule.dto';

const DAY_ORDER = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];

@Injectable()
export class ConfessionSchedulesService {
  constructor(
    private prisma: PrismaService,
    private realtime: RealtimeGateway,
  ) {}

  async findAll() {
    const items = await this.prisma.confessionSchedule.findMany();
    return items.sort((a, b) => {
      const ai = DAY_ORDER.indexOf(a.day);
      const bi = DAY_ORDER.indexOf(b.day);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
  }

  async findOne(id: number) {
    const item = await this.prisma.confessionSchedule.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`Confissão #${id} não encontrada`);
    return item;
  }

  async create(dto: CreateConfessionScheduleDto) {
    const item = await this.prisma.confessionSchedule.create({ data: dto });
    this.realtime.emit('schedules:changed');
    return item;
  }

  async update(id: number, dto: UpdateConfessionScheduleDto) {
    await this.findOne(id);
    const item = await this.prisma.confessionSchedule.update({ where: { id }, data: dto });
    this.realtime.emit('schedules:changed');
    return item;
  }

  async remove(id: number) {
    await this.findOne(id);
    const item = await this.prisma.confessionSchedule.delete({ where: { id } });
    this.realtime.emit('schedules:changed');
    return item;
  }
}
