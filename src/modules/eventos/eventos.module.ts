import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { CategoriasModule } from '../categorias/categorias.module';
import { EventoController } from './evento.controller';
import { EventoRepository } from './evento.repository';
import { EventoService } from './evento.service';

@Module({
  imports: [PrismaModule, CategoriasModule],
  controllers: [EventoController],
  providers: [EventoService, EventoRepository],
  exports: [EventoService, EventoRepository],
})
export class EventosModule {}
