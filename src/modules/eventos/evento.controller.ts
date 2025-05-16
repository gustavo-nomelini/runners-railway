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
import { CreateEventoDto } from './dtos/create-evento.dto';
import { FindEventosDto } from './dtos/find-eventos.dto';
import { UpdateEventoDto } from './dtos/update-evento.dto';
import { EventoService } from './evento.service';

@ApiTags('Eventos')
@Controller('eventos')
export class EventoController {
  constructor(private readonly eventoService: EventoService) {}

  @Post()
  @ThrottleWrite()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(NivelPermissao.ORGANIZADOR) // Nível mínimo para criar eventos (organizador)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar um novo evento' })
  @ApiResponse({ status: 201, description: 'Evento criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  create(@Request() req, @Body() createEventoDto: CreateEventoDto) {
    return this.eventoService.create(req.user.id, createEventoDto);
  }

  @Get()
  @ThrottlePublic()
  @ApiOperation({ summary: 'Listar todos os eventos com filtros' })
  @ApiResponse({
    status: 200,
    description: 'Lista de eventos retornada com sucesso',
  })
  findAll(@Query() query: FindEventosDto) {
    return this.eventoService.findAll(query);
  }

  @Get(':id')
  @ThrottlePublic()
  @ApiOperation({ summary: 'Buscar um evento pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do evento' })
  @ApiResponse({ status: 200, description: 'Evento encontrado' })
  @ApiResponse({ status: 404, description: 'Evento não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventoService.findOne(id);
  }

  @Patch(':id')
  @ThrottleWrite()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar um evento existente' })
  @ApiParam({ name: 'id', description: 'ID do evento' })
  @ApiResponse({ status: 200, description: 'Evento atualizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Permissão negada' })
  @ApiResponse({ status: 404, description: 'Evento não encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventoDto: UpdateEventoDto,
    @Request() req,
  ) {
    return this.eventoService.update(
      id,
      req.user.id,
      req.user.nivelPermissao,
      updateEventoDto,
    );
  }

  @Delete(':id')
  @ThrottleWrite()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover um evento' })
  @ApiParam({ name: 'id', description: 'ID do evento' })
  @ApiResponse({ status: 200, description: 'Evento removido com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Permissão negada' })
  @ApiResponse({ status: 404, description: 'Evento não encontrado' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.eventoService.remove(id, req.user.id, req.user.nivelPermissao);
  }
}
