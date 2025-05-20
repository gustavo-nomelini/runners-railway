import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResultadoCorrida {
  @ApiProperty({ description: 'ID único do resultado' })
  id: number;

  @ApiProperty({ description: 'ID do usuário associado ao resultado' })
  usuarioId: number;

  @ApiProperty({ description: 'ID do evento associado ao resultado' })
  eventoId: number;

  @ApiPropertyOptional({ description: 'Posição geral na corrida' })
  posicaoGeral?: number;

  @ApiPropertyOptional({ description: 'Posição na categoria' })
  posicaoCategoria?: number;

  @ApiProperty({ description: 'Tempo líquido (formato HH:MM:SS)' })
  tempoLiquido: string;

  @ApiPropertyOptional({ description: 'Tempo bruto (formato HH:MM:SS)' })
  tempoBruto?: string;

  @ApiPropertyOptional({ description: 'Categoria do corredor no evento' })
  categoriaCorreida?: string;

  @ApiPropertyOptional({ description: 'Ritmo médio por km (formato MM:SS)' })
  ritmoMedio?: string;

  @ApiPropertyOptional({ description: 'Velocidade média em km/h' })
  velocidadeMedia?: number;

  @ApiPropertyOptional({ description: 'Distância percorrida em km' })
  distanciaPercorrida?: number;

  @ApiPropertyOptional({ description: 'Link para o certificado de conclusão' })
  linkCertificado?: string;

  @ApiProperty({ description: 'Resultado validado pela organização' })
  validado: boolean;

  @ApiProperty({ description: 'Fonte dos dados (manual, app, chip, etc)' })
  fonteDados: string;

  @ApiPropertyOptional({ description: 'ID do chip de cronometragem' })
  chipId?: string;

  @ApiPropertyOptional({
    description: 'Tempos parciais (splits) em formato JSON',
  })
  splits?: Record<string, any>;
}
