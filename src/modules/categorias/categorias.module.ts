import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { CategoriaRepository } from './categoria.repository';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';

@Module({
  imports: [PrismaModule],
  controllers: [CategoriasController],
  providers: [CategoriasService, CategoriaRepository],
  exports: [CategoriasService, CategoriaRepository],
})
export class CategoriasModule {}
