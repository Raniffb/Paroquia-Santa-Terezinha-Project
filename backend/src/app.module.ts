import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { NewsModule } from './news/news.module';
import { NoticesModule } from './notices/notices.module';
import { EventsModule } from './events/events.module';
import { MassSchedulesModule } from './mass-schedules/mass-schedules.module';
import { SacramentosModule } from './sacramentos/sacramentos.module';
import { HorariosInfoModule } from './horarios-info/horarios-info.module';
import { RealtimeModule } from './realtime/realtime.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
  ],
})
export class AppModule {}
