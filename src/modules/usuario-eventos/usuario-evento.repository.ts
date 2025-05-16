import { Injectable } from '@nestjs/common';
import { Prisma, UsuarioEvento } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUsuarioEventoDto } from './dtos/create-usuario-evento.dto';
import { UpdateUsuarioEventoDto } from './dtos/update-usuario-evento.dto';
import { UsuarioEventoWithRelations } from './types/usuario-evento.types';

@Injectable()
export class UsuarioEventoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    usuarioId: number,
    data: CreateUsuarioEventoDto,
  ): Promise<UsuarioEventoWithRelations> {
    return this.prisma.usuarioEvento.create({
      data: {
        usuarioId,
        eventoId: data.eventoId,
        status: data.status || 'Inscrito',
        numeroAtleta: data.numeroAtleta,
        origemInscricao: data.origemInscricao || 'app',
        comprovantePagamentoUrl: data.comprovantePagamentoUrl,
        observacoes: data.observacoes,
      },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            fotoPerfilUrl: true,
          },
        },
        evento: {
          select: {
            id: true,
            nome: true,
            dataInicio: true,
            localizacao: true,
            capaUrl: true,
            status: true,
            organizadorId: true,
          },
        },
      },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.UsuarioEventoWhereInput;
    orderBy?: Prisma.UsuarioEventoOrderByWithRelationInput;
  }): Promise<UsuarioEventoWithRelations[]> {
    const { skip, take, where, orderBy } = params;
    return this.prisma.usuarioEvento.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            fotoPerfilUrl: true,
          },
        },
        evento: {
          select: {
            id: true,
            nome: true,
            dataInicio: true,
            localizacao: true,
            capaUrl: true,
            status: true,
            organizadorId: true,
          },
        },
      },
    });
  }

  async findByIds(
    usuarioId: number,
    eventoId: number,
  ): Promise<UsuarioEventoWithRelations | null> {
    return this.prisma.usuarioEvento.findUnique({
      where: {
        usuarioId_eventoId: {
          usuarioId,
          eventoId,
        },
      },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            fotoPerfilUrl: true,
          },
        },
        evento: {
          select: {
            id: true,
            nome: true,
            dataInicio: true,
            localizacao: true,
            capaUrl: true,
            status: true,
            organizadorId: true,
          },
        },
      },
    });
  }

  async update(
    usuarioId: number,
    eventoId: number,
    data: UpdateUsuarioEventoDto,
  ): Promise<UsuarioEventoWithRelations> {
    return this.prisma.usuarioEvento.update({
      where: {
        usuarioId_eventoId: {
          usuarioId,
          eventoId,
        },
      },
      data,
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            fotoPerfilUrl: true,
          },
        },
        evento: {
          select: {
            id: true,
            nome: true,
            dataInicio: true,
            localizacao: true,
            capaUrl: true,
            status: true,
            organizadorId: true,
          },
        },
      },
    });
  }

  async delete(usuarioId: number, eventoId: number): Promise<UsuarioEvento> {
    return this.prisma.usuarioEvento.delete({
      where: {
        usuarioId_eventoId: {
          usuarioId,
          eventoId,
        },
      },
    });
  }

  async count(where: Prisma.UsuarioEventoWhereInput): Promise<number> {
    return this.prisma.usuarioEvento.count({ where });
  }
}
