import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class ResultadoCorrida {
  @ApiProperty({ description: 'ID único do resultado' })
  id: number;

  @ApiProperty({ description: 'ID do usuário associado ao resultado' })
  usuarioId: number;

  @ApiProperty({ description: 'ID do evento associado ao resultado' })
  eventoId: number;

  @ApiProperty({ description: 'Tempo líquido (formato HH:MM:SS)' })
  tempoLiquido: string;

  @ApiPropertyOptional({ description: 'Tempo bruto (formato HH:MM:SS)' })
  tempoBruto: string | null;

  @ApiPropertyOptional({ description: 'Posição geral na corrida' })
  posicaoGeral: number | null;

  @ApiPropertyOptional({ description: 'Posição na categoria' })
  posicaoCategoria: number | null;

  @ApiPropertyOptional({ description: 'Categoria do corredor no evento' })
  categoriaCorreida: string | null;

  @ApiPropertyOptional({ description: 'Ritmo médio por km (formato MM:SS)' })
  ritmoMedio: string | null;

  @ApiPropertyOptional({ description: 'Velocidade média em km/h' })
  velocidadeMedia: number | null; // This will be converted from Decimal

  @ApiPropertyOptional({ description: 'Distância percorrida em km' })
  distanciaPercorrida: number | null; // This will be converted from Decimal

  @ApiPropertyOptional({ description: 'Link para o certificado de conclusão' })
  linkCertificado: string | null;

  @ApiProperty({ description: 'Resultado validado pela organização' })
  validado: boolean;

  @ApiProperty({ description: 'Fonte dos dados (manual, app, chip, etc)' })
  fonteDados: string;

  @ApiPropertyOptional({ description: 'ID do chip de cronometragem' })
  chipId: string | null;

  @ApiPropertyOptional({
    description: 'Tempos parciais (splits) em formato JSON',
  })
  splits: Prisma.JsonValue;
}
