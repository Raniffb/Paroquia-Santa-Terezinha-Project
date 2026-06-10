import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { CreateSacramentoDto } from './dto/create-sacramento.dto';
import { UpdateSacramentoDto } from './dto/update-sacramento.dto';

@Injectable()
export class SacramentosService {
  constructor(
    private prisma: PrismaService,
    private realtime: RealtimeGateway,
  ) {}

  findAll() {
    return this.prisma.sacramento.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  async findOne(id: number) {
    const item = await this.prisma.sacramento.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`Sacramento #${id} não encontrado`);
    return item;
  }

  async create(dto: CreateSacramentoDto) {
    const item = await this.prisma.sacramento.create({ data: dto });
    this.realtime.emit('schedules:changed');
    return item;
  }

  async update(id: number, dto: UpdateSacramentoDto) {
    await this.findOne(id);
    const item = await this.prisma.sacramento.update({ where: { id }, data: dto });
    this.realtime.emit('schedules:changed');
    return item;
  }

  async remove(id: number) {
    await this.findOne(id);
    const item = await this.prisma.sacramento.delete({ where: { id } });
    this.realtime.emit('schedules:changed');
    return item;
  }
}
