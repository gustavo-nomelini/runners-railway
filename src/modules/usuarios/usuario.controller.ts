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
  @ApiOperation({ summary: 'Criar um novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @Post('organizador')
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
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({ status: 200, description: 'Lista de usuários retornada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Permissão negada - Apenas administradores' })
  findAll() {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuarioService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)https://www.youtube.com/watch?v=2jEZa7oxd58&list=RD2jEZa7oxd58&start_radio=1
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.update(+id, updateUsuarioDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Delete(':id')
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

  @Post('login')
  @ApiOperation({ summary: 'Autenticar usuário' })
  @ApiResponse({ status: 200, description: 'Autenticação bem sucedida' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() loginDto: { email: string; password: string }) {
    // Buscar usuário pelo email com todas as propriedades (incluindo senhaHash)
    const user = await this.usuarioService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.senhaHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    // Gerar token JWT
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.nivelPermissao,
    };

    // Remover dados sensíveis para a resposta
    const { senhaHash, ...result } = user;

    return {
      access_token: this.jwtService.sign(payload),
      user: result,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(NivelPermissao.ADMIN)
  @ApiBearerAuth()
  @Patch(':id/permissao')
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
