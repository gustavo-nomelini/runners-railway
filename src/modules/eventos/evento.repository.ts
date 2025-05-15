import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  EventoDetailResponse,
  EventoPaginationResponse,
} from './interfaces/evento.interface';

@Injectable()
export class EventoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.EventoCreateInput): Promise<EventoDetailResponse> {
    return this.prisma.evento.create({
      data,
      include: {
        organizador: {
          select: {
            id: true,
            nome: true,
            email: true,
            fotoPerfilUrl: true,
          },
        },
        categorias: {
          include: {
            categoria: true,
          },
        },
      },
    }) as unknown as EventoDetailResponse;
  }

  async findAll(
    where: Prisma.EventoWhereInput,
    skip: number,
    take: number,
    page: number,
    limit: number,
  ): Promise<EventoPaginationResponse> {
    const include: Prisma.EventoInclude = {
      categorias: {
        include: {
          categoria: true,
        },
      },
      organizador: {
        select: {
          id: true,
          nome: true,
          fotoPerfilUrl: true,
        },
      },
      _count: {
        select: {
          inscricoes: true,
        },
      },
    };

    const total = await this.prisma.evento.count({ where });
    const data = await this.prisma.evento.findMany({
      where,
      include,
      skip,
      take,
      orderBy: {
        dataInicio: 'asc',
      },
    });

    // Transformar os dados para corresponder à interface de resposta
    const eventos = data.map((evento) => ({
      ...evento,
      totalInscritos: evento._count.inscricoes,
      _count: undefined,
    }));

    return {
      data: eventos as unknown as EventoDetailResponse[],
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: number): Promise<EventoDetailResponse | null> {
    return this.prisma.evento.findUnique({
      where: { id },
      include: {
        organizador: {
          select: {
            id: true,
            nome: true,
            email: true,
            fotoPerfilUrl: true,
          },
        },
        categorias: {
          include: {
            categoria: true,
          },
        },
        _count: {
          select: {
            inscricoes: true,
            comentarios: true,
            fotos: true,
          },
        },
      },
    }) as unknown as EventoDetailResponse;
  }

  async update(
    id: number,
    data: Prisma.EventoUpdateInput,
  ): Promise<EventoDetailResponse> {
    return this.prisma.evento.update({
      where: { id },
      data,
      include: {
        organizador: {
          select: {
            id: true,
            nome: true,
            email: true,
            fotoPerfilUrl: true,
          },
        },
        categorias: {
          include: {
            categoria: true,
          },
        },
      },
    }) as unknown as EventoDetailResponse;
  }

  async delete(id: number): Promise<EventoDetailResponse> {
    return this.prisma.evento.delete({
      where: { id },
      include: {
        organizador: {
          select: {
            id: true,
            nome: true,
            email: true,
            fotoPerfilUrl: true,
          },
        },
      },
    }) as unknown as EventoDetailResponse;
  }
}
