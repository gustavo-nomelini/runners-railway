import {
  BadRequestException,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import rateLimit from 'express-rate-limit';
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

  // Apply rate limiting - Proteção contra sobrecarga de requisições
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    limit: isProduction ? 100 : 1000, // Limite mais rigoroso em produção
    standardHeaders: 'draft-7', // RFC 6585
    legacyHeaders: false,
    message:
      'Muitas requisições desta origem, por favor, tente novamente mais tarde',
    skip: (request) =>
      request.url.includes('health') || request.url.includes('api-docs'), // Não limita rotas de health check e documentação
  });
  app.use(limiter);

  app.useLogger(logger);

  // Aplica o ValidationPipe globalmente com a transformação habilitada
  // e a remoção de propriedades não validadas
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true, // Remove propriedades não validadas/decoradas
  //     transform: true, // Transforma os dados recebidos para o tipo correto
  //     forbidNonWhitelisted: true,
  //     transformOptions: {
  //       enableImplicitConversion: true,
  //     },
  //     exceptionFactory: (errors) => {
  //       // Factory para customizar como as exceções de validação são formatadas e retornadas
  //       const formattedErrors = errors.reduce((acc, error) => {
  //         // Tratamento especial para validação de senhas
  //         if (error.property === 'senha' || error.property === 'password') {
  //           const constraints = error.constraints || {};

  //           // Cria uma estrutura detalhada para erros de senha
  //           acc[error.property] = {
  //             // Lista de mensagens de erro para todas as restrições violadas
  //             messages: Object.values(constraints),

  //             // Mapeia os tipos específicos de falhas para melhor análise no frontend
  //             constraints: Object.keys(constraints).map((key) => {
  //               // Extract specific requirement failures for better logging
  //               if (key.includes('matches')) return 'format'; // Falha no formato/padrão regex
  //               if (key.includes('minLength')) return 'minLength'; // Falha no tamanho mínimo
  //               if (key.includes('maxLength')) return 'maxLength'; // Falha no tamanho máximo
  //               if (key.includes('isStrongPassword')) return 'strength'; // Falha na robustez da senha
  //               return key; // Outros tipos de falhas
  //             }),
  //             failed: true, // Indicador explícito de falha na validação
  //           };

  //           // Registra detalhadamente as falhas de validação da senha no log do sistema
  //           // Isso facilita a auditoria e monitoramento de tentativas de cadastro
  //           logger.error(
  //             `Password validation failed: ${Object.values(constraints).join(', ')}`,
  //             'ValidationPipe',
  //           );
  //         } else {
  //           // Tratamento padrão para outros campos com formato simplificado
  //           acc[error.property] = Object.values(error.constraints || {});
  //         }
  //         return acc;
  //       }, {});

  //       // Retorna uma exceção de BadRequest com estrutura padronizada
  //       // Isso garante uma resposta consistente para o cliente
  //       return new BadRequestException({
  //         message: 'Validation failed',
  //         errors: formattedErrors,
  //         statusCode: HttpStatus.BAD_REQUEST,
  //       });
  //     },
  //   }),
  // );


  // implementação simplificada do ValidationPipe
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
        'http://localhost:3000',
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
