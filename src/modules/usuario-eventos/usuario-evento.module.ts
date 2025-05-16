import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UsuarioEventoController } from './usuario-evento.controller';
import { UsuarioEventoRepository } from './usuario-evento.repository';
import { UsuarioEventoService } from './usuario-evento.service';

@Module({
  controllers: [UsuarioEventoController],
  providers: [UsuarioEventoService, UsuarioEventoRepository, PrismaService],
  exports: [UsuarioEventoService],
})
export class UsuarioEventoModule {}
