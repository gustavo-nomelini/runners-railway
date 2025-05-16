import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CustomLoggerService } from './core/logger/custom-logger.service';

async function bootstrap() {
  const logger = new CustomLoggerService('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    logger: logger,
  });

  app.useLogger(logger);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // CORS Configuration
  const allowedOrigins =
    process.env.NODE_ENV === 'production'
      ? [
          'https://cascavel-runners-teste.vercel.app',
          'https://runners-railway-production.up.railway.app',
        ]
      : [
          'http://localhost:3000',
          'https://cascavel-runners-teste.vercel.app',
          'https://runners-railway-production.up.railway.app',
        ];

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('API Runners')
    .setDescription(
      'API para gerenciamento de eventos esportivos e registro de usuários',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'JWT',
    )
    .addTag('Autenticação')
    .addTag('Usuários')
    .addTag('Eventos')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Prefixo global da API
  app.setGlobalPrefix('api/v1');

  // Porta baseada no ambiente (Railway define process.env.PORT)
  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');

  // Log do ambiente e da URL da documentação
  const isProduction = process.env.NODE_ENV === 'production';
  const baseUrl = isProduction
    ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN || 'localhost'}`
    : `http://localhost:${port}`;

  logger.log(`Aplicação iniciada - Rodando na porta ${port}`);
  logger.log(`Documentação Swagger disponível em: ${baseUrl}/api`);
}

bootstrap();
