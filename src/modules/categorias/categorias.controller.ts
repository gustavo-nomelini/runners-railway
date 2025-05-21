import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { NivelPermissao } from '../../core/enums/nivel-permissao.enum';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { Roles, RolesGuard } from '../../core/guards/roles.guard';
import {
  ThrottlePublic,
  ThrottleWrite,
} from '../../core/throttler/throttler.decorator';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dtos/create-categoria.dto';
import { FindCategoriasDto } from './dtos/find-categorias.dto';
import { UpdateCategoriaDto } from './dtos/update-categoria.dto';

@ApiTags('Categorias')
@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Post()
  @ThrottleWrite()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(NivelPermissao.ADMIN) // Apenas ADMIN pode criar categorias
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar uma nova categoria' })
  @ApiResponse({ status: 201, description: 'Categoria criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriasService.create(createCategoriaDto);
  }

  @Get()
  @ThrottlePublic()
  @ApiOperation({ summary: 'Listar todas as categorias com filtros' })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorias retornada com sucesso',
  })
  findAll(@Query() query: FindCategoriasDto) {
    return this.categoriasService.findAll(query);
  }

  @Get(':id')
  @ThrottlePublic()
  @ApiOperation({ summary: 'Buscar uma categoria pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da categoria' })
  @ApiResponse({ status: 200, description: 'Categoria encontrada' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasService.findOne(id);
  }

  @Patch(':id')
  @ThrottleWrite()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(NivelPermissao.ADMIN) // Apenas ADMIN pode atualizar categorias
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar uma categoria existente' })
  @ApiParam({ name: 'id', description: 'ID da categoria' })
  @ApiResponse({ status: 200, description: 'Categoria atualizada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoriaDto: UpdateCategoriaDto,
  ) {
    return this.categoriasService.update(id, updateCategoriaDto);
  }

  @Delete(':id')
  @ThrottleWrite()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(NivelPermissao.ADMIN) // Apenas ADMIN pode remover categorias
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover uma categoria' })
  @ApiParam({ name: 'id', description: 'ID da categoria' })
  @ApiResponse({ status: 200, description: 'Categoria removida com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasService.remove(id);
  }

  @Get('evento/:eventoId')
  @ThrottlePublic()
  @ApiOperation({ summary: 'Listar categorias de um evento específico' })
  @ApiParam({ name: 'eventoId', description: 'ID do evento' })
  @ApiResponse({ status: 200, description: 'Lista de categorias do evento' })
  findByEvento(@Param('eventoId', ParseIntPipe) eventoId: number) {
    return this.categoriasService.findCategoriasByEventoId(eventoId);
  }
}
