import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';

@Injectable()
export class NoticesService {
  constructor(
    private prisma: PrismaService,
    private realtime: RealtimeGateway,
  ) {}

  findAll() {
    return this.prisma.notice.findMany({ orderBy: { date: 'desc' } });
  }

  async findOne(id: number) {
    const item = await this.prisma.notice.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`Aviso #${id} não encontrado`);
    return item;
  }

  async create(dto: CreateNoticeDto) {
    const item = await this.prisma.notice.create({
      data: { ...dto, date: new Date(dto.date), priority: dto.priority ?? 'normal' },
    });
    this.realtime.emit('notices:changed');
    return item;
  }

  async update(id: number, dto: UpdateNoticeDto) {
    await this.findOne(id);
    const item = await this.prisma.notice.update({
      where: { id },
      data: { ...dto, date: dto.date ? new Date(dto.date) : undefined },
    });
    this.realtime.emit('notices:changed');
    return item;
  }

  async remove(id: number) {
    await this.findOne(id);
    const item = await this.prisma.notice.delete({ where: { id } });
    this.realtime.emit('notices:changed');
    return item;
  }
}
