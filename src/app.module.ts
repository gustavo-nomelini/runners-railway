// app.module.ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './core/auth/auth.module';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';
import { LoggerModule } from './core/logger/logger.module';
import { LoggerMiddleware } from './core/middlewares/logger.middleware';
import { HealthModule } from './health/health.module';
import { CategoriasModule } from './modules/categorias/categorias.module';
import { EventoModule } from './modules/eventos/evento.module';
import { EventosModule } from './modules/eventos/eventos.module';
import { ResultadoCorridaModule } from './modules/resultados-corrida/resultado-corrida.module';
import { UsuarioEventoModule } from './modules/usuario-eventos/usuario-evento.module';
import { UsuarioModule } from './modules/usuarios/usuario.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),
    PrismaModule,
    UsuarioModule,
    EventoModule,
    UsuarioEventoModule,
    AuthModule,
    LoggerModule,
    HealthModule,
    ResultadoCorridaModule,
    CategoriasModule,
    EventosModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
