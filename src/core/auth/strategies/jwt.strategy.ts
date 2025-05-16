import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../../prisma/prisma.service';
import { CustomLoggerService } from '../../logger/custom-logger.service';

interface JwtPayload {
  sub: number;
  email: string;
}

interface User {
  id: number;
  email: string;
  nivelPermissao: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly logger: CustomLoggerService,
  ) {
    const isProduction = configService.get('NODE_ENV') === 'production';

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
      ...(isProduction && {
        audience:
          configService.get('JWT_AUDIENCE') ||
          'https://runners-railway-production.up.railway.app',
        issuer: configService.get('JWT_ISSUER') || 'runners-api',
      }),
    });

    this.logger.setContext('JwtStrategy');
  }

  async validate(payload: JwtPayload): Promise<User> {
    this.logger.debug(`Validando token JWT para usuário ID: ${payload.sub}`);

    const user = await this.prisma.usuario.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        ativo: true,
        nivelPermissao: true,
      },
    });

    if (!user || !user.ativo) {
      this.logger.warn(
        `Token JWT inválido: usuário ${payload.sub} não encontrado ou inativo`,
      );
      throw new UnauthorizedException('Usuário não encontrado ou inativo');
    }

    // Atualizar a última atividade do usuário
    await this.prisma.usuario.update({
      where: { id: user.id },
      data: { ultimaAtividade: new Date() },
    });

    this.logger.debug(`Token JWT validado com sucesso para: ${user.email}`);

    return {
      id: user.id,
      email: user.email,
      nivelPermissao: user.nivelPermissao,
    };
  }
}
