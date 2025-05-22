import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ResultadoCorridaController } from './resultado-corrida.controller';
import { ResultadoCorridaService } from './resultado-corrida.service';
import { UsuarioModule } from '../usuarios/usuario.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { EventosModule } from '../eventos/eventos.module';

@Module({
  imports: [
    PrismaModule,
    EventosModule,
    UsuarioModule,
  ],
  providers: [ResultadoCorridaService, PrismaService],
  controllers: [ResultadoCorridaController],
  exports: [ResultadoCorridaService],
})
export class ResultadoCorridaModule {}
