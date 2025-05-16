import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export enum StatusInscricao {
  INSCRITO = 'Inscrito',
  CONFIRMADO = 'Confirmado',
  EM_ANALISE = 'Em Análise',
  CANCELADO = 'Cancelado',
  NAO_COMPARECEU = 'Não Compareceu',
}

export class CreateUsuarioEventoDto {
  @ApiProperty({
    description: 'ID do evento para inscrição',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  eventoId: number;

  @ApiPropertyOptional({
    description: 'Número do atleta (opcional)',
    example: 'A1234',
  })
  @IsString()
  @IsOptional()
  numeroAtleta?: string;

  @ApiPropertyOptional({
    description: 'Status da inscrição',
    example: 'Inscrito',
    enum: StatusInscricao,
    default: StatusInscricao.INSCRITO,
  })
  @IsEnum(StatusInscricao)
  @IsOptional()
  status?: StatusInscricao = StatusInscricao.INSCRITO;

  @ApiPropertyOptional({
    description: 'Origem da inscrição',
    example: 'app',
    default: 'app',
  })
  @IsString()
  @IsOptional()
  origemInscricao?: string = 'app';

  @ApiPropertyOptional({
    description: 'URL do comprovante de pagamento',
    example: 'https://example.com/comprovante.pdf',
  })
  @IsString()
  @IsOptional()
  comprovantePagamentoUrl?: string;

  @ApiPropertyOptional({
    description: 'Observações sobre a inscrição',
    example: 'Necessito de assistência especial',
  })
  @IsString()
  @IsOptional()
  observacoes?: string;
}
