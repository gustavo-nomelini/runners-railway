import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { CategoriasModule } from '../categorias/categorias.module';
import { EventoModule } from '../eventos/evento.module';
import { CategoriasEventosController } from './categorias-eventos.controller';
import { CategoriasEventosRepository } from './categorias-eventos.repository';
import { CategoriasEventosService } from './categorias-eventos.service';

@Module({
  imports: [PrismaModule, CategoriasModule, EventoModule],
  controllers: [CategoriasEventosController],
  providers: [CategoriasEventosService, CategoriasEventosRepository],
  exports: [CategoriasEventosService, CategoriasEventosRepository],
})
export class CategoriasEventosModule {}
