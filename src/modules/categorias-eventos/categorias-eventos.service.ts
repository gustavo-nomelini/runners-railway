import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CategoriaRepository } from '../categorias/categoria.repository';
import { EventoRepository } from '../eventos/evento.repository';
import { CategoriasEventosRepository } from './categorias-eventos.repository';
import {
  AddCategoriaToEventoDto,
  AddEventoToCategoriaDto,
  CreateEventoCategoriaDto,
} from './dtos/create-evento-categoria.dto';
import { FindEventosCategoriasDto } from './dtos/find-eventos-categorias.dto';

@Injectable()
export class CategoriasEventosService {
  constructor(
    private readonly categoriasEventosRepository: CategoriasEventosRepository,
    private readonly eventoRepository: EventoRepository,
    private readonly categoriaRepository: CategoriaRepository,
  ) {}

  /**
   * Criar múltiplas relações evento-categoria
   */
  async createMany(createDto: CreateEventoCategoriaDto) {
    // Validar se os eventos e categorias existem
    const eventosIds = [
      ...new Set(createDto.items.map((item) => item.eventoId)),
    ];
    const categoriasIds = [
      ...new Set(createDto.items.map((item) => item.categoriaId)),
    ];

    // Verificar eventos
    for (const eventoId of eventosIds) {
      const evento = await this.eventoRepository.findById(eventoId);
      if (!evento) {
        throw new NotFoundException(`Evento com ID ${eventoId} não encontrado`);
      }
    }

    // Verificar categorias
    for (const categoriaId of categoriasIds) {
      const categoria = await this.categoriaRepository.findById(categoriaId);
      if (!categoria) {
        throw new NotFoundException(
          `Categoria com ID ${categoriaId} não encontrada`,
        );
      }
    }

    // Criar as relações
    const count = await this.categoriasEventosRepository.createMany(
      createDto.items as Prisma.EventoCategoriaCreateManyInput[],
    );

    return {
      message: `${count} relações evento-categoria criadas com sucesso`,
    };
  }

  /**
   * Adicionar uma ou mais categorias a um evento
   */
  async addCategoriasToEvento(eventoId: number, dto: AddCategoriaToEventoDto) {
    // Verificar se o evento existe
    const evento = await this.eventoRepository.findById(eventoId);
    if (!evento) {
      throw new NotFoundException(`Evento com ID ${eventoId} não encontrado`);
    }

    // Verificar se as categorias existem
    for (const categoriaId of dto.categoriaIds) {
      const categoria = await this.categoriaRepository.findById(categoriaId);
      if (!categoria) {
        throw new NotFoundException(
          `Categoria com ID ${categoriaId} não encontrada`,
        );
      }
    }

    // Criar as relações
    const count = await this.categoriasEventosRepository.createMany(
      dto.categoriaIds.map((categoriaId) => ({
        eventoId,
        categoriaId,
      })),
    );

    return {
      message: `${count} categorias adicionadas ao evento ${evento.nome}`,
      eventoId,
      categoriasAdicionadas: count,
    };
  }

  /**
   * Adicionar um ou mais eventos a uma categoria
   */
  async addEventosToCategoria(
    categoriaId: number,
    dto: AddEventoToCategoriaDto,
  ) {
    // Verificar se a categoria existe
    const categoria = await this.categoriaRepository.findById(categoriaId);
    if (!categoria) {
      throw new NotFoundException(
        `Categoria com ID ${categoriaId} não encontrada`,
      );
    }

    // Verificar se os eventos existem
    for (const eventoId of dto.eventoIds) {
      const evento = await this.eventoRepository.findById(eventoId);
      if (!evento) {
        throw new NotFoundException(`Evento com ID ${eventoId} não encontrado`);
      }
    }

    // Criar as relações
    const count = await this.categoriasEventosRepository.createMany(
      dto.eventoIds.map((eventoId) => ({
        eventoId,
        categoriaId,
      })),
    );

    return {
      message: `${count} eventos adicionados à categoria ${categoria.nome}`,
      categoriaId,
      eventosAdicionados: count,
    };
  }

  /**
   * Buscar todas as relações evento-categoria com filtros
   */
  async findAll(query: FindEventosCategoriasDto) {
    const { eventoId, categoriaId, limit = 10, page = 1 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.EventoCategoriaWhereInput = {};

    if (eventoId) {
      where.eventoId = eventoId;
    }

    if (categoriaId) {
      where.categoriaId = categoriaId;
    }

    return this.categoriasEventosRepository.findAll(
      where,
      skip,
      limit,
      page,
      limit,
    );
  }

  /**
   * Buscar todas as categorias de um evento
   */
  async findCategoriasByEventoId(eventoId: number) {
    // Verificar se o evento existe
    const evento = await this.eventoRepository.findById(eventoId);
    if (!evento) {
      throw new NotFoundException(`Evento com ID ${eventoId} não encontrado`);
    }

    const categorias =
      await this.categoriasEventosRepository.findCategoriasByEventoId(eventoId);

    return categorias.map((item) => item.categoria);
  }

  /**
   * Buscar todos os eventos de uma categoria
   */
  async findEventosByCategoriaId(categoriaId: number) {
    // Verificar se a categoria existe
    const categoria = await this.categoriaRepository.findById(categoriaId);
    if (!categoria) {
      throw new NotFoundException(
        `Categoria com ID ${categoriaId} não encontrada`,
      );
    }

    const eventos =
      await this.categoriasEventosRepository.findEventosByCategoriaId(
        categoriaId,
      );

    return eventos.map((item) => item.evento);
  }

  /**
   * Remover uma categoria de um evento
   */
  async removeFromEvento(eventoId: number, categoriaId: number) {
    // Verificar se o evento existe
    const evento = await this.eventoRepository.findById(eventoId);
    if (!evento) {
      throw new NotFoundException(`Evento com ID ${eventoId} não encontrado`);
    }

    // Verificar se a categoria existe
    const categoria = await this.categoriaRepository.findById(categoriaId);
    if (!categoria) {
      throw new NotFoundException(
        `Categoria com ID ${categoriaId} não encontrada`,
      );
    }

    // Verificar se a relação existe
    const exists = await this.categoriasEventosRepository.exists(
      eventoId,
      categoriaId,
    );
    if (!exists) {
      throw new BadRequestException(
        `Categoria com ID ${categoriaId} não está associada ao evento com ID ${eventoId}`,
      );
    }

    await this.categoriasEventosRepository.delete(eventoId, categoriaId);

    return {
      message: `Categoria ${categoria.nome} removida do evento ${evento.nome}`,
      eventoId,
      categoriaId,
    };
  }

  /**
   * Remover todas as categorias de um evento
   */
  async removeAllFromEvento(eventoId: number) {
    // Verificar se o evento existe
    const evento = await this.eventoRepository.findById(eventoId);
    if (!evento) {
      throw new NotFoundException(`Evento com ID ${eventoId} não encontrado`);
    }

    const count =
      await this.categoriasEventosRepository.deleteAllFromEvento(eventoId);

    return {
      message: `${count} categorias removidas do evento ${evento.nome}`,
      eventoId,
      categoriasRemovidas: count,
    };
  }

  /**
   * Remover todos os eventos de uma categoria
   */
  async removeAllFromCategoria(categoriaId: number) {
    // Verificar se a categoria existe
    const categoria = await this.categoriaRepository.findById(categoriaId);
    if (!categoria) {
      throw new NotFoundException(
        `Categoria com ID ${categoriaId} não encontrada`,
      );
    }

    const count =
      await this.categoriasEventosRepository.deleteAllFromCategoria(
        categoriaId,
      );

    return {
      message: `${count} eventos removidos da categoria ${categoria.nome}`,
      categoriaId,
      eventosRemovidos: count,
    };
  }
}
