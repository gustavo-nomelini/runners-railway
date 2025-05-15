import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';
import * as chalk from 'chalk';

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLoggerService extends ConsoleLogger {
  log(message: any, ...optionalParams: any[]) {
    const formattedMessage = this.formatMessage('info', message);
    super.log(formattedMessage, ...optionalParams);
  }

  error(message: any, stack?: string, ...optionalParams: any[]) {
    const formattedMessage = this.formatMessage('error', message);
    super.error(formattedMessage, stack, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    const formattedMessage = this.formatMessage('warn', message);
    super.warn(formattedMessage, ...optionalParams);
  }

  debug(message: any, ...optionalParams: any[]) {
    const formattedMessage = this.formatMessage('debug', message);
    super.debug(formattedMessage, ...optionalParams);
  }

  verbose(message: any, ...optionalParams: any[]) {
    const formattedMessage = this.formatMessage('verbose', message);
    super.verbose(formattedMessage, ...optionalParams);
  }

  formatMessage(level: string, message: any): string {
    // Timestamp em roxo em uma nova linha
    const timestamp = chalk.hex('#8A2BE2')(`\n[${new Date().toISOString()}]`);

    // Nível de log colorido
    const levelFormatted = this.formatLevel(level);

    // Nome do contexto
    const context = this.context ? chalk.cyan(`[${this.context}]`) : '';

    // Mensagem original (pode ser manipulada se necessário)
    const originalMessage =
      typeof message === 'string' ? message : JSON.stringify(message);

    return `${timestamp} ${levelFormatted} ${context} ${originalMessage}`;
  }

  private formatLevel(level: string): string {
    switch (level) {
      case 'info':
        return chalk.green('[INFO]');
      case 'error':
        return chalk.red.bold('[ERROR]');
      case 'warn':
        return chalk.yellow('[WARN]');
      case 'debug':
        return chalk.blue('[DEBUG]');
      case 'verbose':
        return chalk.magenta('[VERBOSE]');
      default:
        return chalk.gray(`[${level.toUpperCase()}]`);
    }
  }
}
