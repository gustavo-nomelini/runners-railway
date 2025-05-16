import { Injectable } from '@nestjs/common';
import { NivelPermissao } from '../../core/enums/nivel-permissao.enum';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUsuarioEventoDto } from './dtos/create-usuario-evento.dto';
import { FindUsuarioEventosDto } from './dtos/find-usuario-eventos.dto';
import { UpdateUsuarioEventoDto } from './dtos/update-usuario-evento.dto';
import { UsuarioEventoPaginationResponse } from './dtos/usuarios-evento-pagination.dto';
import {
  EventoCanceladoOuFinalizadoException,
  EventoCapacidadeExcedidaException,
  EventoPrazoInscricaoEncerradoException,
  OperacaoNaoAutorizadaException,
  UsuarioEventoConflictException,
  UsuarioEventoNotFoundException,
} from './exceptions/usuario-evento.exceptions';
import { UsuarioEventoWithRelations } from './interfaces/usuario-evento.interface';
import { UsuarioEventoRepository } from './usuario-evento.repository';

@Injectable()
export class UsuarioEventoService {
  constructor(
    private readonly usuarioEventoRepository: UsuarioEventoRepository,
    private readonly prisma: PrismaService,
  ) {}

  async registrarUsuarioEmEvento(
    usuarioId: number,
    createDto: CreateUsuarioEventoDto,
  ): Promise<UsuarioEventoWithRelations> {
    const { eventoId } = createDto;

    // Verificar se o usuário já está registrado neste evento
    const registroExistente = await this.usuarioEventoRepository.findByIds(
      usuarioId,
      eventoId,
    );

    if (registroExistente) {
      throw new UsuarioEventoConflictException(usuarioId, eventoId);
    }

    // Obter informações do evento
    const evento = await this.prisma.evento.findUnique({
      where: { id: eventoId },
      select: {
        id: true,
        status: true,
        capacidadeMaxima: true,
        prazoInscricao: true,
        _count: {
          select: { inscricoes: true },
        },
      },
    });

    if (!evento) {
      throw new EventoCanceladoOuFinalizadoException(
        eventoId,
        'não encontrado',
      );
    }

    // Verificar status do evento
    if (evento.status !== 'Agendado' && evento.status !== 'Aberto') {
      throw new EventoCanceladoOuFinalizadoException(eventoId, evento.status);
    }

    // Verificar prazo de inscrição
    if (evento.prazoInscricao && new Date(evento.prazoInscricao) < new Date()) {
      throw new EventoPrazoInscricaoEncerradoException(eventoId);
    }

    // Verificar capacidade máxima
    if (
      evento.capacidadeMaxima &&
      evento._count.inscricoes >= evento.capacidadeMaxima
    ) {
      throw new EventoCapacidadeExcedidaException(eventoId);
    }

    // Criar registro
    return this.usuarioEventoRepository.create(usuarioId, createDto);
  }

  async atualizarInscricao(
    usuarioId: number,
    eventoId: number,
    updateDto: UpdateUsuarioEventoDto,
    userNivelPermissao: NivelPermissao,
    userRequestId: number,
  ): Promise<UsuarioEventoWithRelations> {
    const inscricao = await this.usuarioEventoRepository.findByIds(
      usuarioId,
      eventoId,
    );

    if (!inscricao) {
      throw new UsuarioEventoNotFoundException(usuarioId, eventoId);
    }

    // Verificar permissões:
    // 1. O usuário só pode atualizar sua própria inscrição
    // 2. Organizadores podem atualizar inscrições de seus próprios eventos
    // 3. Admins podem atualizar qualquer inscrição
    const isAdmin = userNivelPermissao >= NivelPermissao.ADMIN;
    const isOrganizador =
      userNivelPermissao >= NivelPermissao.ORGANIZADOR &&
      inscricao.evento.organizadorId === userRequestId;
    const isSelfUpdate = userRequestId === usuarioId;

    if (!isAdmin && !isOrganizador && !isSelfUpdate) {
      throw new OperacaoNaoAutorizadaException();
    }

    // Usuários normais só podem cancelar suas inscrições, não alterar outros campos
    if (isSelfUpdate && !isAdmin && !isOrganizador) {
      if (updateDto.status !== 'Cancelado') {
        throw new OperacaoNaoAutorizadaException();
      }

      // Usuário comum só pode cancelar, não pode mudar outros campos
      return this.usuarioEventoRepository.update(usuarioId, eventoId, {
        status: updateDto.status,
      });
    }

    // Admins e organizadores podem fazer qualquer alteração
    return this.usuarioEventoRepository.update(usuarioId, eventoId, updateDto);
  }

  async deletarInscricao(
    usuarioId: number,
    eventoId: number,
    userNivelPermissao: NivelPermissao,
    userRequestId: number,
  ): Promise<void> {
    const inscricao = await this.usuarioEventoRepository.findByIds(
      usuarioId,
      eventoId,
    );

    if (!inscricao) {
      throw new UsuarioEventoNotFoundException(usuarioId, eventoId);
    }

    // Verificar permissões:
    // 1. O usuário só pode deletar sua própria inscrição
    // 2. Organizadores podem deletar inscrições de seus próprios eventos
    // 3. Admins podem deletar qualquer inscrição
    const isAdmin = userNivelPermissao >= NivelPermissao.ADMIN;
    const isOrganizador =
      userNivelPermissao >= NivelPermissao.ORGANIZADOR &&
      inscricao.evento.organizadorId === userRequestId;
    const isSelfDelete = userRequestId === usuarioId;

    if (!isAdmin && !isOrganizador && !isSelfDelete) {
      throw new OperacaoNaoAutorizadaException();
    }

    await this.usuarioEventoRepository.delete(usuarioId, eventoId);
  }

  async buscarInscricao(
    usuarioId: number,
    eventoId: number,
  ): Promise<UsuarioEventoWithRelations> {
    const inscricao = await this.usuarioEventoRepository.findByIds(
      usuarioId,
      eventoId,
    );

    if (!inscricao) {
      throw new UsuarioEventoNotFoundException(usuarioId, eventoId);
    }

    return inscricao;
  }

  async listarInscricoes(
    query: FindUsuarioEventosDto,
  ): Promise<UsuarioEventoPaginationResponse<UsuarioEventoWithRelations>> {
    const { page = 1, limit = 10, ...filters } = query;
    const skip = (page - 1) * limit;

    const where = this.montarFiltros(filters);

    const [inscricoes, total] = await Promise.all([
      this.usuarioEventoRepository.findAll({
        skip,
        take: limit,
        where,
        orderBy: { dataInscricao: 'desc' },
      }),
      this.usuarioEventoRepository.count(where),
    ]);

    return {
      data: inscricoes,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private montarFiltros(filters: Partial<FindUsuarioEventosDto>) {
    const where: any = {};

    if (filters.usuarioId) {
      where.usuarioId = filters.usuarioId;
    }

    if (filters.eventoId) {
      where.eventoId = filters.eventoId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    return where;
  }
}
