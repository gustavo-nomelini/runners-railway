import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

const userSelect = {
  id: true,
  nome: true,
  email: true,
  fotoPerfilUrl: true,
  biografia: true,
  dataRegistro: true,
  ultimaAtividade: true,
  cidade: true,
  estado: true,
  pais: true,
  nivelPermissao: true,
};

@Injectable()
export class UsuarioRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.usuario.findUnique({
      where: { email },
    });
  }

  async findById(id: number) {
    return this.prisma.usuario.findUnique({
      where: { id },
      select: userSelect,
    });
  }

  async findAll() {
    return this.prisma.usuario.findMany({
      select: userSelect,
    });
  }

  async create(data: Prisma.UsuarioCreateInput) {
    return this.prisma.usuario.create({
      data,
      select: userSelect,
    });
  }

  async update(id: number, data: Prisma.UsuarioUpdateInput) {
    return this.prisma.usuario.update({
      where: { id },
      data,
      select: userSelect,
    });
  }

  async delete(id: number) {
    return this.prisma.usuario.delete({
      where: { id },
    });
  }

  async atualizarEventosDoOrganizador(
    organizadorId: number,
    novoOrganizadorId: number,
  ): Promise<void> {
    await this.prisma.evento.updateMany({
      where: { organizadorId: organizadorId },
      data: { organizadorId: novoOrganizadorId },
    });
  }
}
