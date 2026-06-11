import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { NewsModule } from './news/news.module';
import { NoticesModule } from './notices/notices.module';
import { EventsModule } from './events/events.module';
import { MassSchedulesModule } from './mass-schedules/mass-schedules.module';
import { SacramentosModule } from './sacramentos/sacramentos.module';
import { HorariosInfoModule } from './horarios-info/horarios-info.module';
import { ConfessionSchedulesModule } from './confession-schedules/confession-schedules.module';
import { ContactMessagesModule } from './contact-messages/contact-messages.module';
import { RealtimeModule } from './realtime/realtime.module';
import { CleanupModule } from './cleanup/cleanup.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // ── Rate limiting global ─────────────────────────────────────────────────
    // Padrão: 100 req / 60s por IP. Sobrescrito por @Throttle() nas rotas.
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl:   config.get<number>('THROTTLE_TTL',   60_000),
            limit: config.get<number>('THROTTLE_LIMIT', 100),
          },
        ],
      }),
    }),

    HealthModule,
    RealtimeModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    NewsModule,
    NoticesModule,
    EventsModule,
    MassSchedulesModule,
    SacramentosModule,
    HorariosInfoModule,
    ConfessionSchedulesModule,
    ContactMessagesModule,
    CleanupModule,
  ],
  providers: [
    // ThrottlerGuard avaliado antes do JWT (ordem de registro)
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    // Fail-closed: todas as rotas exigem JWT exceto as marcadas com @Public()
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
