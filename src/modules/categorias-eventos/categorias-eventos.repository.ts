import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  EventoCategoriaPaginationResponse,
  EventoCategoriaResponse,
} from './interfaces/categorias-eventos.interface';

@Injectable()
export class CategoriasEventosRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Mapeia os dados retornados do Prisma para o formato de resposta da API
   */
  private mapToEventoCategoriaResponse(data: any): EventoCategoriaResponse {
    return {
      eventoId: data.eventoId,
      categoriaId: data.categoriaId,
      evento: data.evento
        ? {
            id: data.evento.id,
            nome: data.evento.nome,
            dataInicio: data.evento.dataInicio,
            modalidade: data.evento.modalidade,
            capaUrl: data.evento.capaUrl,
            status: data.evento.status,
          }
        : undefined,
      categoria: data.categoria
        ? {
            id: data.categoria.id,
            nome: data.categoria.nome,
            descricao: data.categoria.descricao,
            distancia: data.categoria.distancia,
            iconeUrl: data.categoria.iconeUrl,
          }
        : undefined,
    };
  }

  /**
   * Criar uma nova relação evento-categoria
   */
  async create(
    data: Prisma.EventoCategoriaCreateInput,
  ): Promise<EventoCategoriaResponse> {
    const result = await this.prisma.eventoCategoria.create({
      data,
      include: {
        evento: true,
        categoria: true,
      },
    });

    return this.mapToEventoCategoriaResponse(result);
  }

  /**
   * Criar múltiplas relações evento-categoria de uma vez
   */
  async createMany(
    data: Prisma.EventoCategoriaCreateManyInput[],
  ): Promise<number> {
    const result = await this.prisma.eventoCategoria.createMany({
      data,
      skipDuplicates: true,
    });

    return result.count;
  }

  /**
   * Buscar todas as relações evento-categoria com filtros
   */
  async findAll(
    where: Prisma.EventoCategoriaWhereInput,
    skip: number,
    take: number,
    page: number,
    limit: number,
  ): Promise<EventoCategoriaPaginationResponse> {
    const total = await this.prisma.eventoCategoria.count({ where });

    const data = await this.prisma.eventoCategoria.findMany({
      where,
      skip,
      take,
      include: {
        evento: true,
        categoria: true,
      },
    });

    return {
      data: data.map((item) => this.mapToEventoCategoriaResponse(item)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Verificar se uma relação evento-categoria existe
   */
  async exists(eventoId: number, categoriaId: number): Promise<boolean> {
    const count = await this.prisma.eventoCategoria.count({
      where: {
        eventoId,
        categoriaId,
      },
    });

    return count > 0;
  }

  /**
   * Buscar todas as categorias de um evento
   */
  async findCategoriasByEventoId(
    eventoId: number,
  ): Promise<EventoCategoriaResponse[]> {
    const results = await this.prisma.eventoCategoria.findMany({
      where: {
        eventoId,
      },
      include: {
        categoria: true,
      },
    });

    return results.map((item) => this.mapToEventoCategoriaResponse(item));
  }

  /**
   * Buscar todos os eventos de uma categoria
   */
  async findEventosByCategoriaId(
    categoriaId: number,
  ): Promise<EventoCategoriaResponse[]> {
    const results = await this.prisma.eventoCategoria.findMany({
      where: {
        categoriaId,
      },
      include: {
        evento: true,
      },
    });

    return results.map((item) => this.mapToEventoCategoriaResponse(item));
  }

  /**
   * Remover uma relação evento-categoria
   */
  async delete(
    eventoId: number,
    categoriaId: number,
  ): Promise<EventoCategoriaResponse> {
    const result = await this.prisma.eventoCategoria.delete({
      where: {
        eventoId_categoriaId: {
          eventoId,
          categoriaId,
        },
      },
      include: {
        evento: true,
        categoria: true,
      },
    });

    return this.mapToEventoCategoriaResponse(result);
  }

  /**
   * Remover todas as categorias de um evento
   */
  async deleteAllFromEvento(eventoId: number): Promise<number> {
    const result = await this.prisma.eventoCategoria.deleteMany({
      where: {
        eventoId,
      },
    });

    return result.count;
  }

  /**
   * Remover todos os eventos de uma categoria
   */
  async deleteAllFromCategoria(categoriaId: number): Promise<number> {
    const result = await this.prisma.eventoCategoria.deleteMany({
      where: {
        categoriaId,
      },
    });

    return result.count;
  }
}
