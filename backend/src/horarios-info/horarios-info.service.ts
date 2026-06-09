import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHorariosInfoDto } from './dto/create-horarios-info.dto';
import { UpdateHorariosInfoDto } from './dto/update-horarios-info.dto';

@Injectable()
export class HorariosInfoService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.horariosInfo.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  async findOne(id: number) {
    const item = await this.prisma.horariosInfo.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`Informação #${id} não encontrada`);
    return item;
  }

  create(dto: CreateHorariosInfoDto) {
    return this.prisma.horariosInfo.create({ data: dto });
  }

  async update(id: number, dto: UpdateHorariosInfoDto) {
    await this.findOne(id);
    return this.prisma.horariosInfo.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.horariosInfo.delete({ where: { id } });
  }
}
