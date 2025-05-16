import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { CustomLoggerService } from './core/logger/custom-logger.service';

async function bootstrap() {
  const logger = new CustomLoggerService('Bootstrap');
  const isProduction = process.env.NODE_ENV === 'production';

  const app = await NestFactory.create(AppModule, {
    logger: logger,
  });

  // Apply Helmet middleware for security headers
  app.use(helmet());

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

  // CORS Configuration with more secure settings for production
  const allowedOrigins = isProduction
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
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Swagger Configuration - only enable in non-production or when explicitly allowed
  if (!isProduction || process.env.ENABLE_SWAGGER === 'true') {
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
    logger.log(
      `Documentação Swagger disponível em: ${getBaseUrl(isProduction)}/api`,
    );
  }

  // Prefixo global da API
  app.setGlobalPrefix('api/v1');

  // Porta baseada no ambiente (Railway define process.env.PORT)
  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');

  logger.log(`Aplicação iniciada - Rodando na porta ${port}`);
  logger.log(`Ambiente: ${isProduction ? 'Produção' : 'Desenvolvimento'}`);
}

// Helper function to get base URL
function getBaseUrl(isProduction: boolean): string {
  const port = process.env.PORT || 3001;
  return isProduction
    ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN || 'api.example.com'}`
    : `http://localhost:${port}`;
}

bootstrap();
