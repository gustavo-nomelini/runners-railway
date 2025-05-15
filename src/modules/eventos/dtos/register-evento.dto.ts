import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum InscricaoStatus {
  INSCRITO = 'Inscrito',
  CONFIRMADO = 'Confirmado',
  CANCELADO = 'Cancelado',
  PENDENTE = 'Pendente',
}

export class RegisterEventoDto {
  @ApiProperty({
    description: 'Identificador único do evento',
    type: 'number',
  })
  @IsNotEmpty()
  eventoId: number;

  @ApiPropertyOptional({
    description: 'Número do atleta (opcional)',
  })
  @IsString()
  @IsOptional()
  numeroAtleta?: string;

  @ApiPropertyOptional({
    description: 'Status da inscrição',
    enum: InscricaoStatus,
    default: InscricaoStatus.INSCRITO,
  })
  @IsEnum(InscricaoStatus)
  @IsOptional()
  status?: InscricaoStatus;

  @ApiPropertyOptional({
    description: 'Observações adicionais sobre a inscrição',
  })
  @IsString()
  @IsOptional()
  observacoes?: string;

  @ApiPropertyOptional({
    description: 'Origem da inscrição (app, site, presencial, etc)',
    default: 'app',
  })
  @IsString()
  @IsOptional()
  origemInscricao?: string;
}
