import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import * as chalk from 'chalk';
import { Response } from 'express';
import { CustomLoggerService } from '../logger/custom-logger.service';

export class HttpExceptionResponse {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  timestamp: string;

  @ApiProperty()
  path: string;

  @ApiProperty()
  message: string;

  @ApiProperty({ required: false })
  error?: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: CustomLoggerService) {
    this.logger.setContext('HttpException');
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Obtem a resposta do erro ou cria uma mensagem padrão
    const errorResponse = exception.getResponse() as any;
    const message =
      errorResponse?.message || exception.message || 'Erro interno do servidor';

    // Método e path da requisição
    const requestInfo = `${request.method} ${request.url}`;

    // Mensagem formatada para logging
    const logMessage = `Status ${status} - ${requestInfo} - ${
      typeof message === 'string' ? message : JSON.stringify(message)
    }`;

    // Log do erro com o logger personalizado
    this.logger.error(logMessage, exception.stack);

    const responseBody: HttpExceptionResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message:
        typeof message === 'string' ? message : 'Erro interno do servidor',
      error: status >= 500 ? 'Internal Server Error' : exception.name,
    };

    response.status(status).json(responseBody);
  }

  private colorizeStatus(status: number): string {
    if (status < 300) {
      return chalk.green(`${status}`);
    }
    if (status < 400) {
      return chalk.blue(`${status}`);
    }
    if (status < 500) {
      return chalk.yellow(`${status}`);
    }
    return chalk.red.bold(`${status}`);
  }
}
