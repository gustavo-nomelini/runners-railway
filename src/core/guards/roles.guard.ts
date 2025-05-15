import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { NivelPermissao } from '../enums/nivel-permissao.enum';

// Interface para tipagem do usuário
interface JwtUser {
  id: number;
  email: string;
  nivelPermissao: NivelPermissao;
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: NivelPermissao[]) =>
  SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<NivelPermissao[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Se não há roles definidos, permite o acesso
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtUser;

    // Certifica-se de que o usuário existe e tem nivelPermissao
    if (!user || user.nivelPermissao === undefined) {
      return false;
    }

    // Verifica se o nível de permissão do usuário é suficiente
    return requiredRoles.some((role) => user.nivelPermissao >= role);
  }
}
