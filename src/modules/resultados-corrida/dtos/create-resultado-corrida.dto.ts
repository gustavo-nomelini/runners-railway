import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDecimal,
  IsInt,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateResultadoCorridaDto {
  @ApiProperty({ description: 'ID do evento associado ao resultado' })
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  eventoId: number;

  @ApiPropertyOptional({ description: 'Posição geral na corrida' })
  @IsInt()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  posicaoGeral?: number;

  @ApiPropertyOptional({ description: 'Posição na categoria' })
  @IsInt()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  posicaoCategoria?: number;

  @ApiProperty({ description: 'Tempo líquido (formato HH:MM:SS)' })
  @IsString()
  @IsNotEmpty()
  tempoLiquido: string;

  @ApiPropertyOptional({ description: 'Tempo bruto (formato HH:MM:SS)' })
  @IsString()
  @IsOptional()
  tempoBruto?: string;

  @ApiPropertyOptional({ description: 'Categoria do corredor no evento' })
  @IsString()
  @IsOptional()
  categoriaCorreida?: string;

  @ApiPropertyOptional({ description: 'Ritmo médio por km (formato MM:SS)' })
  @IsString()
  @IsOptional()
  ritmoMedio?: string;

  @ApiPropertyOptional({ description: 'Velocidade média em km/h' })
  @IsDecimal({ decimal_digits: '0,2' })
  @IsOptional()
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  velocidadeMedia?: number;

  @ApiPropertyOptional({ description: 'Distância percorrida em km' })
  @IsDecimal({ decimal_digits: '0,2' })
  @IsOptional()
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  distanciaPercorrida?: number;

  @ApiPropertyOptional({ description: 'Link para o certificado de conclusão' })
  @IsString()
  @IsOptional()
  linkCertificado?: string;

  @ApiPropertyOptional({
    description: 'Resultado validado pela organização',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  validado?: boolean;

  @ApiPropertyOptional({
    description: 'Fonte dos dados (manual, app, chip, etc)',
    default: 'manual',
    enum: ['manual', 'app', 'chip', 'oficial', 'importado'],
  })
  @IsString()
  @IsOptional()
  fonteDados?: string;

  @ApiPropertyOptional({ description: 'ID do chip de cronometragem' })
  @IsString()
  @IsOptional()
  chipId?: string;

  @ApiPropertyOptional({
    description: 'Tempos parciais (splits) em formato JSON',
    example: { '5k': '00:25:30', '10k': '00:51:15', '15k': '01:18:45' },
  })
  @IsJSON()
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value : JSON.stringify(value),
  )
  splits?: string;
}
