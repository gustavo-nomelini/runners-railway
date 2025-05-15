import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class FindEventosDto {
  @ApiPropertyOptional({ description: 'Buscar por nome do evento' })
  @IsString()
  @IsOptional()
  nome?: string;

  @ApiPropertyOptional({ description: 'Buscar por localização' })
  @IsString()
  @IsOptional()
  localizacao?: string;

  @ApiPropertyOptional({ description: 'Data mínima de início do evento' })
  @IsDateString()
  @IsOptional()
  dataInicioDe?: string;

  @ApiPropertyOptional({ description: 'Data máxima de início do evento' })
  @IsDateString()
  @IsOptional()
  dataInicioAte?: string;

  @ApiPropertyOptional({
    description:
      'Status do evento (Agendado, Confirmado, Cancelado, Concluído)',
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ description: 'Modalidade do evento' })
  @IsString()
  @IsOptional()
  modalidade?: string;

  @ApiPropertyOptional({ description: 'ID da categoria do evento' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  categoriaId?: number;

  @ApiPropertyOptional({ description: 'ID do organizador' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  organizadorId?: number;

  @ApiPropertyOptional({
    description: 'Número de registros por página',
    default: 10,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Página a ser retornada', default: 1 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Exibir apenas eventos com inscrições ainda abertas',
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  inscricoesAbertas?: boolean;
}
