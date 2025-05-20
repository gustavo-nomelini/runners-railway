import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateResultadoCorridaDto } from './dtos/create-resultado-corrida.dto';
import { UpdateResultadoCorridaDto } from './dtos/update-resultado-corrida.dto';
import { ResultadoCorrida } from './entities/resultado-corrida.entity';

@Injectable()
export class ResultadoCorridaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: number,
    createDto: CreateResultadoCorridaDto,
  ): Promise<ResultadoCorrida> {
    // Verificar se o evento existe
    const evento = await this.prisma.evento.findUnique({
      where: { id: createDto.eventoId },
    });

    if (!evento) {
      throw new NotFoundException(
        `Evento com ID ${createDto.eventoId} não encontrado`,
      );
    }

    // Verificar se o usuário já tem resultado para este evento
    const existingResult = await this.prisma.resultadoCorrida.findUnique({
      where: {
        usuarioId_eventoId: {
          usuarioId: userId,
          eventoId: createDto.eventoId,
        },
      },
    });

    if (existingResult) {
      throw new ConflictException(
        'Você já possui um resultado registrado para este evento',
      );
    }

    // Preparar os dados para criação
    const data = {
      usuarioId: userId,
      eventoId: createDto.eventoId,
      posicaoGeral: createDto.posicaoGeral,
      posicaoCategoria: createDto.posicaoCategoria,
      tempoLiquido: createDto.tempoLiquido,
      tempoBruto: createDto.tempoBruto,
      categoriaCorreida: createDto.categoriaCorreida,
      ritmoMedio: createDto.ritmoMedio,
      velocidadeMedia: createDto.velocidadeMedia,
      distanciaPercorrida: createDto.distanciaPercorrida,
      linkCertificado: createDto.linkCertificado,
      validado: createDto.validado || false,
      fonteDados: createDto.fonteDados || 'manual',
      chipId: createDto.chipId,
      splits: createDto.splits ? JSON.parse(createDto.splits) : null,
    };

    // Criar o resultado
    return this.prisma.resultadoCorrida.create({ data });
  }

  async findAll(filters?: {
    eventoId?: number;
    usuarioId?: number;
    validado?: boolean;
  }): Promise<ResultadoCorrida[]> {
    const where = {};

    if (filters) {
      if (filters.eventoId !== undefined) {
        where['eventoId'] = filters.eventoId;
      }
      if (filters.usuarioId !== undefined) {
        where['usuarioId'] = filters.usuarioId;
      }
      if (filters.validado !== undefined) {
        where['validado'] = filters.validado;
      }
    }

    return this.prisma.resultadoCorrida.findMany({
      where,
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            cidade: true,
            estado: true,
            fotoPerfilUrl: true,
          },
        },
        evento: {
          select: {
            id: true,
            nome: true,
            dataInicio: true,
            localizacao: true,
            modalidade: true,
          },
        },
      },
    });
  }

  async findOne(id: number): Promise<ResultadoCorrida> {
    const resultado = await this.prisma.resultadoCorrida.findUnique({
      where: { id },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            cidade: true,
            estado: true,
            fotoPerfilUrl: true,
          },
        },
        evento: {
          select: {
            id: true,
            nome: true,
            dataInicio: true,
            localizacao: true,
            modalidade: true,
          },
        },
      },
    });

    if (!resultado) {
      throw new NotFoundException(`Resultado com ID ${id} não encontrado`);
    }

    return resultado;
  }

  async update(
    id: number,
    userId: number,
    updateDto: UpdateResultadoCorridaDto,
    isAdmin = false,
  ): Promise<ResultadoCorrida> {
    // Verificar se o resultado existe
    const existingResult = await this.prisma.resultadoCorrida.findUnique({
      where: { id },
      include: {
        evento: {
          select: {
            organizadorId: true,
          },
        },
      },
    });

    if (!existingResult) {
      throw new NotFoundException(`Resultado com ID ${id} não encontrado`);
    }

    // Verificar permissões (usuário proprietário ou organizador do evento ou admin)
    const isOwner = existingResult.usuarioId === userId;
    const isOrganizer = existingResult.evento.organizadorId === userId;

    if (!isOwner && !isOrganizer && !isAdmin) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar este resultado',
      );
    }

    // Preparar os dados para atualização
    const data: any = {};

    if (updateDto.posicaoGeral !== undefined)
      data.posicaoGeral = updateDto.posicaoGeral;
    if (updateDto.posicaoCategoria !== undefined)
      data.posicaoCategoria = updateDto.posicaoCategoria;
    if (updateDto.tempoLiquido !== undefined)
      data.tempoLiquido = updateDto.tempoLiquido;
    if (updateDto.tempoBruto !== undefined)
      data.tempoBruto = updateDto.tempoBruto;
    if (updateDto.categoriaCorreida !== undefined)
      data.categoriaCorreida = updateDto.categoriaCorreida;
    if (updateDto.ritmoMedio !== undefined)
      data.ritmoMedio = updateDto.ritmoMedio;
    if (updateDto.velocidadeMedia !== undefined)
      data.velocidadeMedia = updateDto.velocidadeMedia;
    if (updateDto.distanciaPercorrida !== undefined)
      data.distanciaPercorrida = updateDto.distanciaPercorrida;
    if (updateDto.linkCertificado !== undefined)
      data.linkCertificado = updateDto.linkCertificado;
    if (updateDto.validado !== undefined && (isOrganizer || isAdmin))
      data.validado = updateDto.validado;
    if (updateDto.fonteDados !== undefined)
      data.fonteDados = updateDto.fonteDados;
    if (updateDto.chipId !== undefined) data.chipId = updateDto.chipId;
    if (updateDto.splits !== undefined)
      data.splits = JSON.parse(updateDto.splits);

    // Atualizar o resultado
    return this.prisma.resultadoCorrida.update({
      where: { id },
      data,
    });
  }

  async remove(id: number, userId: number, isAdmin = false): Promise<void> {
    // Verificar se o resultado existe
    const existingResult = await this.prisma.resultadoCorrida.findUnique({
      where: { id },
      include: {
        evento: {
          select: {
            organizadorId: true,
          },
        },
      },
    });

    if (!existingResult) {
      throw new NotFoundException(`Resultado com ID ${id} não encontrado`);
    }

    // Verificar permissões (usuário proprietário ou organizador do evento ou admin)
    const isOwner = existingResult.usuarioId === userId;
    const isOrganizer = existingResult.evento.organizadorId === userId;

    if (!isOwner && !isOrganizer && !isAdmin) {
      throw new ForbiddenException(
        'Você não tem permissão para remover este resultado',
      );
    }

    // Remover o resultado
    await this.prisma.resultadoCorrida.delete({
      where: { id },
    });
  }

  async validateMultipleResults(
    eventoId: number,
    userId: number,
    resultadosIds: number[],
  ): Promise<number> {
    // Verificar se o usuário é organizador do evento
    const evento = await this.prisma.evento.findUnique({
      where: { id: eventoId },
    });

    if (!evento || evento.organizadorId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para validar resultados deste evento',
      );
    }

    // Validar resultados
    const validatedResults = await this.prisma.resultadoCorrida.updateMany({
      where: {
        id: { in: resultadosIds },
        eventoId,
      },
      data: {
        validado: true,
      },
    });

    return validatedResults.count;
  }

  async getEventoResultados(eventoId: number): Promise<ResultadoCorrida[]> {
    const evento = await this.prisma.evento.findUnique({
      where: { id: eventoId },
    });

    if (!evento) {
      throw new NotFoundException(`Evento com ID ${eventoId} não encontrado`);
    }

    return this.prisma.resultadoCorrida.findMany({
      where: { eventoId },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            cidade: true,
            estado: true,
            fotoPerfilUrl: true,
          },
        },
      },
      orderBy: [{ posicaoGeral: 'asc' }, { tempoLiquido: 'asc' }],
    });
  }

  async getUserResultados(userId: number): Promise<ResultadoCorrida[]> {
    return this.prisma.resultadoCorrida.findMany({
      where: { usuarioId: userId },
      include: {
        evento: {
          select: {
            id: true,
            nome: true,
            dataInicio: true,
            localizacao: true,
            modalidade: true,
            capaUrl: true,
          },
        },
      },
      orderBy: { evento: { dataInicio: 'desc' } },
    });
  }
}
