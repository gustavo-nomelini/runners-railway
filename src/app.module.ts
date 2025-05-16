// app.module.ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './core/auth/auth.module';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';
import { LoggerModule } from './core/logger/logger.module';
import { LoggerMiddleware } from './core/middlewares/logger.middleware';
import { ThrottlerModule } from './core/throttler/throttler.module';
import { HealthModule } from './health/health.module';
import { EventoModule } from './modules/eventos/evento.module';
import { UsuarioEventoModule } from './modules/usuario-eventos/usuario-evento.module';
import { UsuarioModule } from './modules/usuarios/usuario.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule,
    PrismaModule,
    UsuarioModule,
    EventoModule,
    UsuarioEventoModule,
    AuthModule,
    LoggerModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
