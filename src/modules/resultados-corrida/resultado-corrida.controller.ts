import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
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
import {
  NivelPermissao,
  Roles,
} from '../../core/auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/auth/guards/roles.guard';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateResultadoCorridaDto } from './dtos/create-resultado-corrida.dto';
import { UpdateResultadoCorridaDto } from './dtos/update-resultado-corrida.dto';
import { ResultadoCorridaService } from './resultado-corrida.service';

@ApiTags('Resultados de Corridas')
@Controller('api/v1/resultados-corrida')
export class ResultadoCorridaController {
  constructor(
    private readonly resultadoCorridaService: ResultadoCorridaService,
    private readonly prisma: PrismaService, // Add PrismaService injection
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Registrar um novo resultado de corrida' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Resultado registrado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos fornecidos',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Já existe um resultado para este usuário e evento',
  })
  async create(@Request() req, @Body() createDto: CreateResultadoCorridaDto) {
    const userId = req.user.id;
    return this.resultadoCorridaService.create(userId, createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar resultados de corridas' })
  @ApiQuery({ name: 'eventoId', required: false, type: Number })
  @ApiQuery({ name: 'usuarioId', required: false, type: Number })
  @ApiQuery({ name: 'validado', required: false, type: Boolean })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de resultados retornada com sucesso',
  })
  async findAll(
    @Query('eventoId') eventoId?: number,
    @Query('usuarioId') usuarioId?: number,
    @Query('validado') validado?: boolean,
  ) {
    return this.resultadoCorridaService.findAll({
      eventoId: eventoId ? +eventoId : undefined,
      usuarioId: usuarioId ? +usuarioId : undefined,
      validado: validado !== undefined ? validado === true : undefined,
    });
  }

  @Get('evento/:eventoId')
  @ApiOperation({ summary: 'Listar resultados de um evento específico' })
  @ApiParam({ name: 'eventoId', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de resultados do evento retornada com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Evento não encontrado',
  })
  async getEventoResultados(@Param('eventoId') eventoId: number) {
    return this.resultadoCorridaService.getEventoResultados(+eventoId);
  }

  @Get('usuario/meus-resultados')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar resultados do usuário autenticado' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de resultados do usuário retornada com sucesso',
  })
  async getMeusResultados(@Request() req) {
    const userId = req.user.id;
    return this.resultadoCorridaService.getUserResultados(userId);
  }

  @Get('usuario/:usuarioId')
  @ApiOperation({ summary: 'Listar resultados de um usuário específico' })
  @ApiParam({ name: 'usuarioId', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de resultados do usuário retornada com sucesso',
  })
  async getUserResultados(@Param('usuarioId') usuarioId: number) {
    return this.resultadoCorridaService.getUserResultados(+usuarioId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter um resultado específico' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Resultado retornado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Resultado não encontrado',
  })
  async findOne(@Param('id') id: number) {
    return this.resultadoCorridaService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar um resultado de corrida' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Resultado atualizado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Resultado não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Sem permissão para atualizar este resultado',
  })
  async update(
    @Request() req,
    @Param('id') id: number,
    @Body() updateDto: UpdateResultadoCorridaDto,
  ) {
    const userId = req.user.id;
    const isAdmin = req.user.nivelPermissao >= 10; // Assumindo que nível 10+ são admins
    return this.resultadoCorridaService.update(+id, userId, updateDto, isAdmin);
  }

  @Post('validar-resultados')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validar múltiplos resultados de um evento' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Resultados validados com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Sem permissão para validar resultados deste evento',
  })
  async validateResults(
    @Request() req,
    @Body() data: { eventoId: number; resultadosIds: number[] },
  ) {
    const userId = req.user.id;
    const count = await this.resultadoCorridaService.validateMultipleResults(
      data.eventoId,
      userId,
      data.resultadosIds,
    );
    return { message: `${count} resultados validados com sucesso` };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover um resultado de corrida' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Resultado removido com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Resultado não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Sem permissão para remover este resultado',
  })
  async remove(@Request() req, @Param('id') id: number) {
    const userId = req.user.id;
    const isAdmin = req.user.nivelPermissao >= 10; // Assumindo que nível 10+ são admins
    await this.resultadoCorridaService.remove(+id, userId, isAdmin);
    return { message: 'Resultado removido com sucesso' };
  }

  @Delete('evento/:eventoId/bulk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(NivelPermissao.ADMIN)
  async deleteAllEventResults(
    @Param('eventoId') eventoId: string,
  ): Promise<{ message: string }> {
    const { count } = await this.prisma.resultadoCorrida.deleteMany({
      where: { eventoId: Number(eventoId) },
    });

    return {
      message: `${count} resultados removidos com sucesso`,
    };
  }
}
