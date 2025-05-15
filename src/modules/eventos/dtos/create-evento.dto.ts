import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsDecimal,
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateEventoDto {
  @ApiProperty({ description: 'Nome do evento' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiPropertyOptional({ description: 'Descrição detalhada do evento' })
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiPropertyOptional({ description: 'Local do evento' })
  @IsString()
  @IsOptional()
  localizacao?: string;

  @ApiPropertyOptional({
    description: 'Coordenadas geográficas em formato JSON',
    example: { lat: -23.5505, lng: -46.6333 },
  })
  @IsJSON()
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value : JSON.stringify(value),
  )
  coordenadas?: string;

  @ApiProperty({ description: 'Data e hora de início do evento' })
  @IsDateString()
  dataInicio: string;

  @ApiPropertyOptional({ description: 'Data e hora de término do evento' })
  @IsDateString()
  @IsOptional()
  dataFim?: string;

  @ApiPropertyOptional({ description: 'Prazo para inscrição no evento' })
  @IsDateString()
  @IsOptional()
  prazoInscricao?: string;

  @ApiProperty({
    description: 'Status do evento',
    default: 'Agendado',
    enum: ['Agendado', 'Confirmado', 'Cancelado', 'Concluído'],
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ description: 'Capacidade máxima de participantes' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  capacidadeMaxima?: number;

  @ApiPropertyOptional({ description: 'Taxa de inscrição' })
  @IsDecimal({ decimal_digits: '0,2' })
  @IsOptional()
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  taxaInscricao?: number;

  @ApiPropertyOptional({ description: 'URL da imagem de capa do evento' })
  @IsString()
  @IsOptional()
  capaUrl?: string;

  @ApiPropertyOptional({
    description: 'Modalidade do evento (corrida, ciclismo, etc)',
  })
  @IsString()
  @IsOptional()
  modalidade?: string;

  @ApiPropertyOptional({ description: 'Site oficial do evento' })
  @IsString()
  @IsOptional()
  siteOficial?: string;

  @ApiPropertyOptional({ description: 'Metadados adicionais em formato JSON' })
  @IsJSON()
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value : JSON.stringify(value),
  )
  metadados?: string;

  @ApiPropertyOptional({ description: 'IDs das categorias do evento' })
  @IsNumber({}, { each: true })
  @IsOptional()
  @Type(() => Number)
  categoriaIds?: number[];
}
