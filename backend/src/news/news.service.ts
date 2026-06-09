import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.news.findMany({ orderBy: { date: 'desc' } });
  }

  async findOne(id: number) {
    const item = await this.prisma.news.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`Notícia #${id} não encontrada`);
    return item;
  }

  create(dto: CreateNewsDto) {
    return this.prisma.news.create({
      data: { ...dto, date: new Date(dto.date) },
    });
  }

  async update(id: number, dto: UpdateNewsDto) {
    await this.findOne(id);
    return this.prisma.news.update({
      where: { id },
      data: { ...dto, date: dto.date ? new Date(dto.date) : undefined },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.news.delete({ where: { id } });
  }
}
