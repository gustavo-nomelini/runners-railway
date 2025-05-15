import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

export class EventoNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Evento com ID ${id} não encontrado`);
  }
}

export class EventoForbiddenException extends ForbiddenException {
  constructor() {
    super('Você não tem permissão para modificar este evento');
  }
}

export class CategoriaNotFoundException extends NotFoundException {
  constructor(categoriaId: number) {
    super(`Categoria com ID ${categoriaId} não encontrada`);
  }
}

export class EventoDateInvalidException extends BadRequestException {
  constructor() {
    super('A data de início do evento deve ser maior que a data atual');
  }
}

export class EventoCapacityExceededException extends ConflictException {
  constructor() {
    super('A capacidade máxima deste evento já foi atingida');
  }
}
