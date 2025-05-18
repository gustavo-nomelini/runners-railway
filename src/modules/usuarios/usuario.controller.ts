import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { NivelPermissao } from '../../core/enums/nivel-permissao.enum';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { Roles, RolesGuard } from '../../core/guards/roles.guard';
import {
  ThrottleAuth,
  ThrottleDefault,
  ThrottlePublic,
  ThrottleStrict,
} from '../../core/throttler/throttler.decorator';
import { CreateOrganizadorDto } from './dtos/create-organizador.dto';
import { CreateUsuarioDto } from './dtos/create-usuario.dto';
import { UpdateUsuarioDto } from './dtos/update-usuario.dto';
import { UsuarioService } from './usuario.service';

@ApiTags('usuarios')
@Controller('usuarios')
export class UsuarioController {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  @ThrottleDefault()
  @ApiOperation({ summary: 'Criar um novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @Post('organizador')
  @ThrottleDefault()
  @ApiOperation({ summary: 'Criar um novo organizador de eventos' })
  @ApiResponse({ status: 201, description: 'Organizador criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  createOrganizador(@Body() createOrganizadorDto: CreateOrganizadorDto) {
    return this.usuarioService.createOrganizador(createOrganizadorDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(NivelPermissao.ADMIN)
  @ApiBearerAuth()
  @Get()
  @ThrottlePublic()
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({
    status: 403,
    description: 'Permissão negada - Apenas administradores',
  })
  findAll() {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  @ThrottlePublic()
  findOne(@Param('id') id: string) {
    return this.usuarioService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ThrottleAuth()
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.update(+id, updateUsuarioDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ThrottleAuth()
  @ApiOperation({ summary: 'Remover usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário removido com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Permissão negada' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    // Verifica se o usuário é admin ou está tentando remover seu próprio perfil
    if (
      req.user.nivelPermissao !== NivelPermissao.ADMIN &&
      req.user.id !== id
    ) {
      throw new ForbiddenException(
        'Você não tem permissão para remover este usuário',
      );
    }
    return this.usuarioService.remove(id);
  }

  // Rota de login foi movida para o AuthController
  // Os usuários devem usar o endpoint /auth/login em vez de /usuarios/login

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(NivelPermissao.ADMIN)
  @ApiBearerAuth()
  @Patch(':id/permissao')
  @ThrottleAuth()
  @ApiOperation({ summary: 'Atualizar nível de permissão de um usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Nível de permissão atualizado com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Permissão negada' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  updatePermissao(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: { nivelPermissao: NivelPermissao },
  ) {
    return this.usuarioService.atualizarNivelPermissao(id, data.nivelPermissao);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('perfil')
  @ThrottleAuth()
  @ApiOperation({ summary: 'Obter perfil do usuário atual' })
  @ApiResponse({ status: 200, description: 'Perfil do usuário' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async getPerfil(@Request() req) {
    const usuario = await this.usuarioService.findOne(req.user.id);
    const nivelPermissao = req.user.nivelPermissao;

    let roleName = 'Usuário';
    if (nivelPermissao === NivelPermissao.ORGANIZADOR) {
      roleName = 'Organizador';
    } else if (nivelPermissao === NivelPermissao.ADMIN) {
      roleName = 'Administrador';
    }

    return {
      ...usuario,
      nivelPermissao,
      roleName,
    };
  }
}
