import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoriaRepository } from './categoria.repository';
import { CreateCategoriaDto } from './dtos/create-categoria.dto';
import { FindCategoriasDto } from './dtos/find-categorias.dto';
import { UpdateCategoriaDto } from './dtos/update-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(private readonly categoriaRepository: CategoriaRepository) {}

  /**
   * Criar uma nova categoria
   */
  async create(createCategoriaDto: CreateCategoriaDto) {
    return this.categoriaRepository.create(createCategoriaDto);
  }

  /**
   * Encontrar todas as categorias com paginação e filtros
   */
  async findAll(query: FindCategoriasDto) {
    const { nome, limit = 10, page = 1 } = query;

    const skip = (page - 1) * limit;

    // Constrói o where baseado nos filtros fornecidos
    const where: any = {};

    if (nome) {
      where.nome = { contains: nome, mode: 'insensitive' };
    }

    return this.categoriaRepository.findAll(where, skip, limit, page, limit);
  }

  /**
   * Encontrar uma categoria pelo ID
   */
  async findOne(id: number) {
    const categoria = await this.categoriaRepository.findById(id);

    if (!categoria) {
      throw new NotFoundException(`Categoria com ID ${id} não encontrada`);
    }

    return categoria;
  }

  /**
   * Verificar se múltiplas categorias existem
   */
  async validateCategoriaIds(categoriaIds: number[]) {
    if (!categoriaIds || categoriaIds.length === 0) {
      return [];
    }

    const categorias = await this.categoriaRepository.findByIds(categoriaIds);

    if (categorias.length !== categoriaIds.length) {
      const encontradosIds = categorias.map((c) => c.id);
      const naoEncontradosIds = categoriaIds.filter(
        (id) => !encontradosIds.includes(id),
      );

      throw new BadRequestException(
        `As seguintes categorias não foram encontradas: ${naoEncontradosIds.join(', ')}`,
      );
    }

    return categorias;
  }

  /**
   * Atualizar uma categoria existente
   */
  async update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    // Verifica se a categoria existe
    await this.findOne(id);

    // Atualiza a categoria
    return this.categoriaRepository.update(id, updateCategoriaDto);
  }

  /**
   * Remover uma categoria
   */
  async remove(id: number) {
    // Verifica se a categoria existe
    await this.findOne(id);

    // Remove a categoria
    await this.categoriaRepository.delete(id);

    return { message: `Categoria com ID ${id} foi removida com sucesso` };
  }

  /**
   * Encontrar categorias de um evento
   */
  async findCategoriasByEventoId(eventoId: number) {
    return this.categoriaRepository.findByEventoId(eventoId);
  }
}
