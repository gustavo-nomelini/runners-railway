import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CategoriaPaginationResponse,
  CategoriaResponse,
} from './interfaces/categoria.interface';

@Injectable()
export class CategoriaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.CategoriaCreateInput): Promise<CategoriaResponse> {
    return this.prisma.categoria.create({
      data,
    });
  }

  async findAll(
    where: Prisma.CategoriaWhereInput,
    skip: number,
    take: number,
    page: number,
    limit: number,
  ): Promise<CategoriaPaginationResponse> {
    const total = await this.prisma.categoria.count({ where });

    const data = await this.prisma.categoria.findMany({
      where,
      skip,
      take,
      orderBy: {
        nome: 'asc',
      },
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: number): Promise<CategoriaResponse | null> {
    return this.prisma.categoria.findUnique({
      where: { id },
    });
  }

  async findByIds(ids: number[]): Promise<CategoriaResponse[]> {
    return this.prisma.categoria.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async update(
    id: number,
    data: Prisma.CategoriaUpdateInput,
  ): Promise<CategoriaResponse> {
    return this.prisma.categoria.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<CategoriaResponse> {
    return this.prisma.categoria.delete({
      where: { id },
    });
  }

  async findByEventoId(eventoId: number): Promise<CategoriaResponse[]> {
    const categorias = await this.prisma.eventoCategoria.findMany({
      where: {
        eventoId,
      },
      include: {
        categoria: true,
      },
    });

    return categorias.map((ec) => ec.categoria);
  }
}
