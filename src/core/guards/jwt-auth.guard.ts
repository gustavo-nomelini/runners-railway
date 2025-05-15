import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // Personaliza as mensagens de erro com base no tipo de erro
    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException(
        'Token JWT expirado. Faça login novamente.',
      );
    }

    if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException('Token JWT inválido.');
    }

    if (err || !user) {
      throw new UnauthorizedException('Acesso não autorizado.');
    }

    return user;
  }
}
