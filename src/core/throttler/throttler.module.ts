import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import {
  ThrottlerModule as NestThrottlerModule,
  ThrottlerGuard,
} from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule,
    NestThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProduction = config.get('NODE_ENV') === 'production';
        return {
          throttlers: [
            {
              name: 'short',
              ttl: 1000, // 1 segundo
              limit: isProduction ? 3 : 10, // 3 req/s em produção, 10 req/s em dev
            },
            {
              name: 'medium',
              ttl: 10000, // 10 segundos
              limit: isProduction ? 20 : 50, // 20 req/10s em produção, 50 req/10s em dev
            },
            {
              name: 'long',
              ttl: 60000, // 1 minuto
              limit: isProduction ? 100 : 300, // 100 req/min em produção, 300 req/min em dev
            },
          ],
          skipIf: (context) => {
            const request = context.switchToHttp().getRequest();
            return (
              request.url.includes('health') || request.url.includes('api-docs')
            );
          },
        };
      },
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [NestThrottlerModule],
})
export class ThrottlerModule {}
