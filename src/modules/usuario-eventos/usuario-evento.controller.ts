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
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { NivelPermissao } from '../../core/enums/nivel-permissao.enum';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { Roles, RolesGuard } from '../../core/guards/roles.guard';
import { CreateUsuarioEventoDto } from './dtos/create-usuario-evento.dto';
import { FindUsuarioEventosDto } from './dtos/find-usuario-eventos.dto';
import { UpdateUsuarioEventoDto } from './dtos/update-usuario-evento.dto';
import { UsuarioEventoService } from './usuario-evento.service';

@ApiTags('Inscrições em Eventos')
@Controller('evento-inscricoes')
export class UsuarioEventoController {
  constructor(private readonly usuarioEventoService: UsuarioEventoService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Registrar usuário em um evento' })
  @ApiResponse({
    status: 201,
    description: 'Usuário registrado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou evento não disponível',
  })
  @ApiResponse({
    status: 409,
    description: 'Usuário já registrado neste evento',
  })
  registrarEmEvento(
    @Body() createUsuarioEventoDto: CreateUsuarioEventoDto,
    @Request() req,
  ) {
    return this.usuarioEventoService.registrarUsuarioEmEvento(
      req.user.id,
      createUsuarioEventoDto,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(NivelPermissao.ORGANIZADOR)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar inscrições em eventos (requer ORGANIZADOR)',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'eventoId', required: false, type: Number })
  @ApiQuery({ name: 'usuarioId', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false })
  @ApiResponse({
    status: 200,
    description: 'Lista de inscrições com paginação',
  })
  listarInscricoes(@Query() query: FindUsuarioEventosDto) {
    return this.usuarioEventoService.listarInscricoes(query);
  }

  @Get('minhas-inscricoes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar inscrições do usuário autenticado' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'eventoId', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false })
  @ApiResponse({
    status: 200,
    description: 'Lista de inscrições do usuário com paginação',
  })
  minhasInscricoes(@Query() query: FindUsuarioEventosDto, @Request() req) {
    const usuarioId = req.user.id;
    return this.usuarioEventoService.listarInscricoes({
      ...query,
      usuarioId,
    });
  }

  @Get('evento/:eventoId/usuario/:usuarioId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(NivelPermissao.ORGANIZADOR)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obter detalhes de uma inscrição específica (requer ORGANIZADOR)',
  })
  @ApiParam({ name: 'eventoId', type: Number })
  @ApiParam({ name: 'usuarioId', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Detalhes da inscrição',
  })
  @ApiResponse({ status: 404, description: 'Inscrição não encontrada' })
  buscarInscricao(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Param('eventoId', ParseIntPipe) eventoId: number,
  ) {
    return this.usuarioEventoService.buscarInscricao(usuarioId, eventoId);
  }

  @Get('minha-inscricao/:eventoId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obter detalhes da inscrição do usuário autenticado em um evento',
  })
  @ApiParam({ name: 'eventoId', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Detalhes da inscrição',
  })
  @ApiResponse({ status: 404, description: 'Inscrição não encontrada' })
  minhaInscricao(
    @Param('eventoId', ParseIntPipe) eventoId: number,
    @Request() req,
  ) {
    return this.usuarioEventoService.buscarInscricao(req.user.id, eventoId);
  }

  @Patch('evento/:eventoId/usuario/:usuarioId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(NivelPermissao.USUARIO)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Atualizar inscrição (usuário comum só pode cancelar própria inscrição)',
  })
  @ApiParam({ name: 'eventoId', type: Number })
  @ApiParam({ name: 'usuarioId', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Inscrição atualizada com sucesso',
  })
  @ApiResponse({ status: 403, description: 'Operação não autorizada' })
  @ApiResponse({ status: 404, description: 'Inscrição não encontrada' })
  atualizarInscricao(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Param('eventoId', ParseIntPipe) eventoId: number,
    @Body() updateUsuarioEventoDto: UpdateUsuarioEventoDto,
    @Request() req,
  ) {
    return this.usuarioEventoService.atualizarInscricao(
      usuarioId,
      eventoId,
      updateUsuarioEventoDto,
      req.user.nivelPermissao,
      req.user.id,
    );
  }

  @Patch('minha-inscricao/:eventoId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Atualizar inscrição do usuário autenticado (usuário comum só pode cancelar)',
  })
  @ApiParam({ name: 'eventoId', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Inscrição atualizada com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Inscrição não encontrada' })
  atualizarMinhaInscricao(
    @Param('eventoId', ParseIntPipe) eventoId: number,
    @Body() updateUsuarioEventoDto: UpdateUsuarioEventoDto,
    @Request() req,
  ) {
    return this.usuarioEventoService.atualizarInscricao(
      req.user.id,
      eventoId,
      updateUsuarioEventoDto,
      req.user.nivelPermissao,
      req.user.id,
    );
  }

  @Delete('evento/:eventoId/usuario/:usuarioId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(NivelPermissao.USUARIO)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Excluir inscrição (usuário comum só pode excluir própria inscrição)',
  })
  @ApiParam({ name: 'eventoId', type: Number })
  @ApiParam({ name: 'usuarioId', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Inscrição removida com sucesso',
  })
  @ApiResponse({ status: 403, description: 'Operação não autorizada' })
  @ApiResponse({ status: 404, description: 'Inscrição não encontrada' })
  removerInscricao(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Param('eventoId', ParseIntPipe) eventoId: number,
    @Request() req,
  ) {
    return this.usuarioEventoService.deletarInscricao(
      usuarioId,
      eventoId,
      req.user.nivelPermissao,
      req.user.id,
    );
  }

  @Delete('minha-inscricao/:eventoId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Excluir inscrição do usuário autenticado' })
  @ApiParam({ name: 'eventoId', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Inscrição removida com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Inscrição não encontrada' })
  removerMinhaInscricao(
    @Param('eventoId', ParseIntPipe) eventoId: number,
    @Request() req,
  ) {
    return this.usuarioEventoService.deletarInscricao(
      req.user.id,
      eventoId,
      req.user.nivelPermissao,
      req.user.id,
    );
  }
}
