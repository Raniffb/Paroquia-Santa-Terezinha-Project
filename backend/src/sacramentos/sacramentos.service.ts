import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSacramentoDto } from './dto/create-sacramento.dto';
import { UpdateSacramentoDto } from './dto/update-sacramento.dto';

@Injectable()
export class SacramentosService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.sacramento.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  async findOne(id: number) {
    const item = await this.prisma.sacramento.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`Sacramento #${id} não encontrado`);
    return item;
  }

  create(dto: CreateSacramentoDto) {
    return this.prisma.sacramento.create({ data: dto });
  }

  async update(id: number, dto: UpdateSacramentoDto) {
    await this.findOne(id);
    return this.prisma.sacramento.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.sacramento.delete({ where: { id } });
  }
}
