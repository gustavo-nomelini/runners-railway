import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

export class UsuarioEventoNotFoundException extends NotFoundException {
  constructor(usuarioId: number, eventoId: number) {
    super(
      `Inscrição para usuário ${usuarioId} no evento ${eventoId} não encontrada`,
    );
  }
}

export class UsuarioEventoConflictException extends ConflictException {
  constructor(usuarioId: number, eventoId: number) {
    super(`Usuário ${usuarioId} já está inscrito no evento ${eventoId}`);
  }
}

export class EventoCapacidadeExcedidaException extends BadRequestException {
  constructor(eventoId: number) {
    super(`A capacidade máxima do evento ${eventoId} foi atingida`);
  }
}

export class EventoPrazoInscricaoEncerradoException extends BadRequestException {
  constructor(eventoId: number) {
    super(`O prazo de inscrição para o evento ${eventoId} já encerrou`);
  }
}

export class EventoCanceladoOuFinalizadoException extends BadRequestException {
  constructor(eventoId: number, status: string) {
    super(
      `Não é possível se inscrever no evento ${eventoId} com status "${status}"`,
    );
  }
}

export class OperacaoNaoAutorizadaException extends ForbiddenException {
  constructor() {
    super('Você não tem permissão para realizar esta operação');
  }
}
