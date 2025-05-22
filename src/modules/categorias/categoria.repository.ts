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

  // Helper method to convert Prisma Categoria to CategoriaResponse
  private mapToCategoriaResponse(categoria: any): CategoriaResponse {
    return {
      id: categoria.id,
      nome: categoria.nome,
      descricao: categoria.descricao,
      distancia: categoria.distancia,
      iconeUrl: categoria.iconeUrl,
    };
  }

  async create(data: Prisma.CategoriaCreateInput): Promise<CategoriaResponse> {
    const categoria = await this.prisma.categoria.create({
      data,
    });

    return this.mapToCategoriaResponse(categoria);
  }

  async findAll(
    where: Prisma.CategoriaWhereInput,
    skip: number,
    take: number,
    page: number,
    limit: number,
  ): Promise<CategoriaPaginationResponse> {
    const total = await this.prisma.categoria.count({ where });

    const categorias = await this.prisma.categoria.findMany({
      where,
      skip,
      take,
      orderBy: {
        nome: 'asc',
      },
    });

    return {
      data: categorias.map((categoria) =>
        this.mapToCategoriaResponse(categoria),
      ),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: number): Promise<CategoriaResponse | null> {
    const categoria = await this.prisma.categoria.findUnique({
      where: { id },
    });

    return categoria ? this.mapToCategoriaResponse(categoria) : null;
  }

  async findByIds(ids: number[]): Promise<CategoriaResponse[]> {
    const categorias = await this.prisma.categoria.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return categorias.map((categoria) =>
      this.mapToCategoriaResponse(categoria),
    );
  }

  async update(
    id: number,
    data: Prisma.CategoriaUpdateInput,
  ): Promise<CategoriaResponse> {
    const categoria = await this.prisma.categoria.update({
      where: { id },
      data,
    });

    return this.mapToCategoriaResponse(categoria);
  }

  async delete(id: number): Promise<CategoriaResponse> {
    const categoria = await this.prisma.categoria.delete({
      where: { id },
    });

    return this.mapToCategoriaResponse(categoria);
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

    return categorias.map((ec) => this.mapToCategoriaResponse(ec.categoria));
  }
}
