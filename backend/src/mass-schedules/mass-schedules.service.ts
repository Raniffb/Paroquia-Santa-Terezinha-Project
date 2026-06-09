import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMassScheduleDto } from './dto/create-mass-schedule.dto';
import { UpdateMassScheduleDto } from './dto/update-mass-schedule.dto';

const DAY_ORDER = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];

@Injectable()
export class MassSchedulesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const items = await this.prisma.massSchedule.findMany();
    return items.sort((a, b) => {
      const ai = DAY_ORDER.indexOf(a.day);
      const bi = DAY_ORDER.indexOf(b.day);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
  }

  async findOne(id: number) {
    const item = await this.prisma.massSchedule.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`Horário #${id} não encontrado`);
    return item;
  }

  create(dto: CreateMassScheduleDto) {
    return this.prisma.massSchedule.create({ data: dto });
  }

  async update(id: number, dto: UpdateMassScheduleDto) {
    await this.findOne(id);
    return this.prisma.massSchedule.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.massSchedule.delete({ where: { id } });
  }
}
