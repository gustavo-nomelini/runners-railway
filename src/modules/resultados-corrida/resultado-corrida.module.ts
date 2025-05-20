import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ResultadoCorridaController } from './resultado-corrida.controller';
import { ResultadoCorridaService } from './resultado-corrida.service';

@Module({
  providers: [ResultadoCorridaService, PrismaService],
  controllers: [ResultadoCorridaController],
  exports: [ResultadoCorridaService],
})
export class ResultadoCorridaModule {}
