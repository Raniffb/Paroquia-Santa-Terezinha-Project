import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';

@Injectable()
export class NoticesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.notice.findMany({ orderBy: { date: 'desc' } });
  }

  async findOne(id: number) {
    const item = await this.prisma.notice.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`Aviso #${id} não encontrado`);
    return item;
  }

  create(dto: CreateNoticeDto) {
    return this.prisma.notice.create({
      data: { ...dto, date: new Date(dto.date), priority: dto.priority ?? 'normal' },
    });
  }

  async update(id: number, dto: UpdateNoticeDto) {
    await this.findOne(id);
    return this.prisma.notice.update({
      where: { id },
      data: { ...dto, date: dto.date ? new Date(dto.date) : undefined },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.notice.delete({ where: { id } });
  }
}
