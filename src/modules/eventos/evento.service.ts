import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { NivelPermissao } from '../../core/enums/nivel-permissao.enum';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEventoDto } from './dtos/create-evento.dto';
import { FindEventosDto } from './dtos/find-eventos.dto';
import { UpdateEventoDto } from './dtos/update-evento.dto';

@Injectable()
export class EventoService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Criar um novo evento
   */
  async create(userId: number, createEventoDto: CreateEventoDto) {
    try {
      // Converte os dados JSON para o formato adequado
      const data: any = {
        ...createEventoDto,
        organizadorId: userId,
      };

      // Converte coordenadas para JSON se fornecido como string
      if (createEventoDto.coordenadas) {
        data.coordenadas = JSON.parse(createEventoDto.coordenadas);
      }

      // Converte metadados para JSON se fornecido como string
      if (createEventoDto.metadados) {
        data.metadados = JSON.parse(createEventoDto.metadados);
      }

      // Remove o campo categoriaIds para criar o evento principal
      const { categoriaIds, ...eventoData } = data;

      // Usa uma transação para garantir que tanto o evento quanto suas categorias sejam criados
      return await this.prisma.$transaction(async (tx) => {
        // Cria o evento
        const evento = await tx.evento.create({
          data: eventoData,
        });

        // Se categoriaIds foi fornecido, cria as relações com categorias
        if (categoriaIds && categoriaIds.length > 0) {
          await tx.eventoCategoria.createMany({
            data: categoriaIds.map((categoriaId) => ({
              eventoId: evento.id,
              categoriaId,
            })),
            skipDuplicates: true,
          });
        }

        // Retorna o evento criado com suas categorias
        return await tx.evento.findUnique({
          where: { id: evento.id },
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
        });
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new BadRequestException(
            'Uma ou mais categorias não foram encontradas',
          );
        }
      }
      throw error;
    }
  }

  /**
   * Encontrar todos os eventos com paginação e filtros
   */
  async findAll(query: FindEventosDto) {
    const {
      nome,
      localizacao,
      dataInicioDe,
      dataInicioAte,
      status,
      modalidade,
      categoriaId,
      organizadorId,
      limit = 10,
      page = 1,
      inscricoesAbertas,
    } = query;

    const skip = (page - 1) * limit;

    // Constrói o where baseado nos filtros fornecidos
    const where: Prisma.EventoWhereInput = {};

    if (nome) {
      where.nome = { contains: nome, mode: 'insensitive' };
    }

    if (localizacao) {
      where.localizacao = { contains: localizacao, mode: 'insensitive' };
    }

    if (dataInicioDe || dataInicioAte) {
      where.dataInicio = {};

      if (dataInicioDe) {
        where.dataInicio.gte = new Date(dataInicioDe);
      }

      if (dataInicioAte) {
        where.dataInicio.lte = new Date(dataInicioAte);
      }
    }

    if (status) {
      where.status = status;
    }

    if (modalidade) {
      where.modalidade = modalidade;
    }

    if (organizadorId) {
      where.organizadorId = organizadorId;
    }

    if (inscricoesAbertas) {
      const now = new Date();
      where.OR = [{ prazoInscricao: { gte: now } }, { prazoInscricao: null }];
      where.dataInicio = { gte: now };
      where.status = { not: 'Cancelado' };
    }

    // Se categoriaId foi fornecido, adiciona a condição para filtrar por categoria
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

    if (categoriaId) {
      where.categorias = {
        some: {
          categoriaId,
        },
      };
    }

    // Consulta para o total de registros
    const total = await this.prisma.evento.count({ where });

    // Consulta para os dados com paginação
    const data = await this.prisma.evento.findMany({
      where,
      include,
      skip,
      take: limit,
      orderBy: {
        dataInicio: 'asc',
      },
    });

    // Calcular estatísticas de inscrições (opcional)
    const eventos = data.map((evento) => ({
      ...evento,
      totalInscritos: evento._count.inscricoes,
      _count: undefined,
    }));

    return {
      data: eventos,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Encontrar um único evento pelo ID
   */
  async findOne(id: number) {
    const evento = await this.prisma.evento.findUnique({
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
    });

    if (!evento) {
      throw new NotFoundException(`Evento com ID ${id} não encontrado`);
    }

    return {
      ...evento,
      totalInscritos: evento._count.inscricoes,
      totalComentarios: evento._count.comentarios,
      totalFotos: evento._count.fotos,
      _count: undefined,
    };
  }

  /**
   * Atualizar um evento existente
   */
  async update(
    id: number,
    userId: number,
    userPermissionLevel: number,
    updateEventoDto: UpdateEventoDto,
  ) {
    // Verificar se o evento existe
    const evento = await this.prisma.evento.findUnique({
      where: { id },
      select: { organizadorId: true },
    });

    if (!evento) {
      throw new NotFoundException(`Evento com ID ${id} não encontrado`);
    }

    // Verificar permissão: apenas o organizador ou admin pode atualizar
    const isAdmin = userPermissionLevel >= NivelPermissao.ADMIN;
    const isOrganizador = evento.organizadorId === userId;

    if (!isAdmin && !isOrganizador) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar este evento',
      );
    }

    try {
      // Prepara os dados para atualização
      const data: any = { ...updateEventoDto };

      // Converte coordenadas para JSON se fornecido como string
      if (updateEventoDto.coordenadas) {
        data.coordenadas = JSON.parse(updateEventoDto.coordenadas);
      }

      // Converte metadados para JSON se fornecido como string
      if (updateEventoDto.metadados) {
        data.metadados = JSON.parse(updateEventoDto.metadados);
      }

      // Remove o campo categoriaIds para atualizar o evento principal
      const { categoriaIds, ...eventoData } = data;

      // Usa uma transação para garantir consistência na atualização
      return await this.prisma.$transaction(async (tx) => {
        // Atualiza o evento
        const eventoAtualizado = await tx.evento.update({
          where: { id },
          data: eventoData,
        });

        // Se categoriaIds foi fornecido, atualiza as relações com categorias
        if (categoriaIds && categoriaIds.length > 0) {
          // Remove categorias existentes
          await tx.eventoCategoria.deleteMany({
            where: { eventoId: id },
          });

          // Adiciona as novas categorias
          await tx.eventoCategoria.createMany({
            data: categoriaIds.map((categoriaId) => ({
              eventoId: id,
              categoriaId,
            })),
            skipDuplicates: true,
          });
        }

        // Retorna o evento atualizado com suas categorias
        return await tx.evento.findUnique({
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
          },
        });
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new BadRequestException(
            'Uma ou mais categorias não foram encontradas',
          );
        }
      }
      throw error;
    }
  }

  /**
   * Remover um evento
   */
  async remove(id: number, userId: number, userPermissionLevel: number) {
    // Verificar se o evento existe
    const evento = await this.prisma.evento.findUnique({
      where: { id },
      select: { organizadorId: true },
    });

    if (!evento) {
      throw new NotFoundException(`Evento com ID ${id} não encontrado`);
    }

    // Verificar permissão: apenas o organizador ou admin pode remover
    const isAdmin = userPermissionLevel >= NivelPermissao.ADMIN;
    const isOrganizador = evento.organizadorId === userId;

    if (!isAdmin && !isOrganizador) {
      throw new ForbiddenException(
        'Você não tem permissão para remover este evento',
      );
    }

    // Remove o evento (as relações serão removidas automaticamente devido aos constraints onDelete)
    await this.prisma.evento.delete({
      where: { id },
    });

    return { message: `Evento com ID ${id} foi removido com sucesso` };
  }
}
