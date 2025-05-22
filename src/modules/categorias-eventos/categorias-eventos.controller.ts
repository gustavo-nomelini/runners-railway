import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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
import { CategoriasEventosService } from './categorias-eventos.service';
import {
  AddCategoriaToEventoDto,
  AddEventoToCategoriaDto,
  CreateEventoCategoriaDto,
} from './dtos/create-evento-categoria.dto';
import { FindEventosCategoriasDto } from './dtos/find-eventos-categorias.dto';

@ApiTags('Categorias-Eventos')
@Controller('categorias-eventos')
export class CategoriasEventosController {
  constructor(
    private readonly categoriasEventosService: CategoriasEventosService,
  ) {}

  @Post()
  @ThrottleWrite()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(NivelPermissao.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar múltiplas relações evento-categoria' })
  @ApiResponse({ status: 201, description: 'Relações criadas com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async createMany(@Body() createDto: CreateEventoCategoriaDto) {
    return this.categoriasEventosService.createMany(createDto);
  }

  @Post('eventos/:eventoId/categorias')
  @ThrottleWrite()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(NivelPermissao.ORGANIZADOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Adicionar categorias a um evento' })
  @ApiParam({ name: 'eventoId', description: 'ID do evento' })
  @ApiResponse({
    status: 201,
    description: 'Categorias adicionadas com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Evento ou categoria não encontrada',
  })
  async addCategoriasToEvento(
    @Param('eventoId', ParseIntPipe) eventoId: number,
    @Body() dto: AddCategoriaToEventoDto,
  ) {
    return this.categoriasEventosService.addCategoriasToEvento(eventoId, dto);
  }

  @Post('categorias/:categoriaId/eventos')
  @ThrottleWrite()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(NivelPermissao.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Adicionar eventos a uma categoria' })
  @ApiParam({ name: 'categoriaId', description: 'ID da categoria' })
  @ApiResponse({ status: 201, description: 'Eventos adicionados com sucesso' })
  @ApiResponse({
    status: 404,
    description: 'Categoria ou evento não encontrado',
  })
  async addEventosToCategoria(
    @Param('categoriaId', ParseIntPipe) categoriaId: number,
    @Body() dto: AddEventoToCategoriaDto,
  ) {
    return this.categoriasEventosService.addEventosToCategoria(
      categoriaId,
      dto,
    );
  }

  @Get()
  @ThrottlePublic()
  @ApiOperation({ summary: 'Listar relações entre eventos e categorias' })
  @ApiResponse({
    status: 200,
    description: 'Lista de relações retornada com sucesso',
  })
  async findAll(@Query() query: FindEventosCategoriasDto) {
    return this.categoriasEventosService.findAll(query);
  }

  @Get('eventos/:eventoId/categorias')
  @ThrottlePublic()
  @ApiOperation({ summary: 'Listar categorias de um evento' })
  @ApiParam({ name: 'eventoId', description: 'ID do evento' })
  @ApiResponse({ status: 200, description: 'Lista de categorias do evento' })
  @ApiResponse({ status: 404, description: 'Evento não encontrado' })
  async findCategoriasByEventoId(
    @Param('eventoId', ParseIntPipe) eventoId: number,
  ) {
    return this.categoriasEventosService.findCategoriasByEventoId(eventoId);
  }

  @Get('categorias/:categoriaId/eventos')
  @ThrottlePublic()
  @ApiOperation({ summary: 'Listar eventos de uma categoria' })
  @ApiParam({ name: 'categoriaId', description: 'ID da categoria' })
  @ApiResponse({ status: 200, description: 'Lista de eventos da categoria' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  async findEventosByCategoriaId(
    @Param('categoriaId', ParseIntPipe) categoriaId: number,
  ) {
    return this.categoriasEventosService.findEventosByCategoriaId(categoriaId);
  }

  @Delete('eventos/:eventoId/categorias/:categoriaId')
  @ThrottleWrite()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(NivelPermissao.ORGANIZADOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover uma categoria de um evento' })
  @ApiParam({ name: 'eventoId', description: 'ID do evento' })
  @ApiParam({ name: 'categoriaId', description: 'ID da categoria' })
  @ApiResponse({
    status: 200,
    description: 'Categoria removida do evento com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Evento ou categoria não encontrada',
  })
  async removeFromEvento(
    @Param('eventoId', ParseIntPipe) eventoId: number,
    @Param('categoriaId', ParseIntPipe) categoriaId: number,
  ) {
    return this.categoriasEventosService.removeFromEvento(
      eventoId,
      categoriaId,
    );
  }

  @Delete('eventos/:eventoId/categorias')
  @ThrottleWrite()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(NivelPermissao.ORGANIZADOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover todas as categorias de um evento' })
  @ApiParam({ name: 'eventoId', description: 'ID do evento' })
  @ApiResponse({
    status: 200,
    description: 'Categorias removidas do evento com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Evento não encontrado' })
  async removeAllFromEvento(@Param('eventoId', ParseIntPipe) eventoId: number) {
    return this.categoriasEventosService.removeAllFromEvento(eventoId);
  }

  @Delete('categorias/:categoriaId/eventos')
  @ThrottleWrite()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(NivelPermissao.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover todos os eventos de uma categoria' })
  @ApiParam({ name: 'categoriaId', description: 'ID da categoria' })
  @ApiResponse({
    status: 200,
    description: 'Eventos removidos da categoria com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  async removeAllFromCategoria(
    @Param('categoriaId', ParseIntPipe) categoriaId: number,
  ) {
    return this.categoriasEventosService.removeAllFromCategoria(categoriaId);
  }
}
