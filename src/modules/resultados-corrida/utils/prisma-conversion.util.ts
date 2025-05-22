import { ResultadoCorrida } from '../entities/resultado-corrida.entity';

/**
 * Converts Decimal values to numbers in a Prisma ResultadoCorrida record
 */
export function convertPrismaResultadoCorrida(data: any): ResultadoCorrida {
  // Perform a safe conversion to ensure all required properties exist
  const converted: ResultadoCorrida = {
    id: data.id,
    usuarioId: data.usuarioId,
    eventoId: data.eventoId,
    tempoLiquido: data.tempoLiquido,
    tempoBruto: data.tempoBruto,
    posicaoGeral: data.posicaoGeral,
    posicaoCategoria: data.posicaoCategoria,
    categoriaCorreida: data.categoriaCorreida,
    ritmoMedio: data.ritmoMedio,
    velocidadeMedia:
      data.velocidadeMedia !== null ? Number(data.velocidadeMedia) : null,
    distanciaPercorrida:
      data.distanciaPercorrida !== null
        ? Number(data.distanciaPercorrida)
        : null,
    linkCertificado: data.linkCertificado,
    validado: data.validado,
    fonteDados: data.fonteDados,
    chipId: data.chipId,
    splits: data.splits,
  };

  // Include any additional properties that might be from includes
  if (data.usuario) {
    (converted as any).usuario = data.usuario;
  }

  if (data.evento) {
    (converted as any).evento = data.evento;
  }

  return converted;
}

/**
 * Converts Decimal values to numbers in an array of Prisma ResultadoCorrida records
 */
export function convertPrismaResultadoCorridaArray(
  data: any[],
): ResultadoCorrida[] {
  return data.map((item) => convertPrismaResultadoCorrida(item));
}
