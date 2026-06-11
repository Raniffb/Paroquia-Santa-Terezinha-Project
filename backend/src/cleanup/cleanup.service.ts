import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);

  constructor(private prisma: PrismaService) {}

  // Executa todo dia às 02:00 — remove itens cuja data passou há mais de 10 dias
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async removerItensAntigos(): Promise<void> {
    const corte = new Date();
    corte.setDate(corte.getDate() - 10);

    const [noticias, avisos, eventos] = await Promise.all([
      this.prisma.news.deleteMany({ where: { date: { lt: corte } } }),
      this.prisma.notice.deleteMany({ where: { date: { lt: corte } } }),
      this.prisma.event.deleteMany({ where: { date: { lt: corte } } }),
    ]);

    const total = noticias.count + avisos.count + eventos.count;
    if (total > 0) {
      this.logger.log(
        `Limpeza automática: ${noticias.count} notícia(s), ` +
        `${avisos.count} aviso(s), ${eventos.count} evento(s) removidos.`,
      );
    }
  }
}
