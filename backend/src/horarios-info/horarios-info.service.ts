import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { CreateHorariosInfoDto } from './dto/create-horarios-info.dto';
import { UpdateHorariosInfoDto } from './dto/update-horarios-info.dto';

@Injectable()
export class HorariosInfoService {
  constructor(
    private prisma: PrismaService,
    private realtime: RealtimeGateway,
  ) {}

  findAll() {
    return this.prisma.horariosInfo.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  async findOne(id: number) {
    const item = await this.prisma.horariosInfo.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`Informação #${id} não encontrada`);
    return item;
  }

  async create(dto: CreateHorariosInfoDto) {
    const item = await this.prisma.horariosInfo.create({ data: dto });
    this.realtime.emit('schedules:changed');
    return item;
  }

  async update(id: number, dto: UpdateHorariosInfoDto) {
    await this.findOne(id);
    const item = await this.prisma.horariosInfo.update({ where: { id }, data: dto });
    this.realtime.emit('schedules:changed');
    return item;
  }

  async remove(id: number) {
    await this.findOne(id);
    const item = await this.prisma.horariosInfo.delete({ where: { id } });
    this.realtime.emit('schedules:changed');
    return item;
  }
}
