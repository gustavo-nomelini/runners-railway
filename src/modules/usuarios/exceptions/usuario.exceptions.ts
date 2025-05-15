import { ConflictException, NotFoundException } from '@nestjs/common';

export class UsuarioNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Usuário com ID ${id} não encontrado`);
  }
}

export class EmailAlreadyExistsException extends ConflictException {
  constructor() {
    super('Email já cadastrado');
  }
}

export class InvalidCredentialsException extends NotFoundException {
  constructor() {
    super('Email ou senha inválidos');
  }
}
