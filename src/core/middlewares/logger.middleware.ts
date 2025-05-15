import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import * as chalk from 'chalk';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';

    // Captura o timestamp de início da requisição
    const startTime = Date.now();

    // Após a resposta ser enviada
    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length') || 0;
      const responseTime = Date.now() - startTime;

      // Timestamp colorizado em roxo em uma linha separada
      const timestamp = chalk.hex('#8A2BE2')(`\n[${new Date().toISOString()}]`);

      // Colorização do status code com base no seu valor
      let statusColorized;
      if (statusCode < 300) {
        statusColorized = chalk.green(statusCode);
      } else if (statusCode < 400) {
        statusColorized = chalk.blue(statusCode);
      } else if (statusCode < 500) {
        statusColorized = chalk.yellow(statusCode);
      } else {
        statusColorized = chalk.red(statusCode);
      }

      // Métodos HTTP coloridos
      const methodColorized = this.colorizeMethod(method);

      // Tempo de resposta colorido com base na duração
      const responseTimeColorized = this.colorizeResponseTime(responseTime);

      const logFormat = `${timestamp} ${methodColorized} ${chalk.bold(originalUrl)} ${statusColorized} ${contentLength}b - ${responseTimeColorized} - ${ip}`;

      // Escolhe o nível de log com base no status code
      if (statusCode >= 500) {
        this.logger.error(logFormat);
      } else if (statusCode >= 400) {
        this.logger.warn(logFormat);
      } else {
        this.logger.log(logFormat);
      }
    });

    next();
  }

  private colorizeMethod(method: string): string {
    switch (method) {
      case 'GET':
        return chalk.blue(method);
      case 'POST':
        return chalk.green(method);
      case 'PUT':
        return chalk.yellow(method);
      case 'DELETE':
        return chalk.red(method);
      case 'PATCH':
        return chalk.cyan(method);
      default:
        return chalk.white(method);
    }
  }

  private colorizeResponseTime(responseTime: number): string {
    if (responseTime < 100) {
      return chalk.green(`${responseTime}ms`);
    }
    if (responseTime < 300) {
      return chalk.yellow(`${responseTime}ms`);
    }
    return chalk.red(`${responseTime}ms`);
  }
}
