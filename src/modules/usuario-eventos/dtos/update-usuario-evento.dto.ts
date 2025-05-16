import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { StatusInscricao } from './create-usuario-evento.dto';

export class UpdateUsuarioEventoDto {
  @ApiPropertyOptional({
    description: 'Status da inscrição',
    example: 'Cancelado',
    enum: StatusInscricao,
  })
  @IsEnum(StatusInscricao)
  @IsOptional()
  status?: StatusInscricao;

  @ApiPropertyOptional({
    description: 'Número do atleta',
    example: 'A1234',
  })
  @IsString()
  @IsOptional()
  numeroAtleta?: string;

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
