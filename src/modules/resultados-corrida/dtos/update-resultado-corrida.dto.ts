import { PartialType } from '@nestjs/swagger';
import { CreateResultadoCorridaDto } from './create-resultado-corrida.dto';

export class UpdateResultadoCorridaDto extends PartialType(
  CreateResultadoCorridaDto,
) {}
