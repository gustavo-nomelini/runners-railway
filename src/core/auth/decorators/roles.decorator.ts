import { SetMetadata } from '@nestjs/common';

export enum NivelPermissao {
  USUARIO = 0,
  ORGANIZADOR = 1,
  ADMIN = 2,
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: NivelPermissao[]) =>
  SetMetadata(ROLES_KEY, roles);
