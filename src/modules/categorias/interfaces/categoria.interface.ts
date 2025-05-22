import { Decimal } from '@prisma/client/runtime/library';

export interface CategoriaResponse {
  id: number;
  nome: string;
  descricao?: string | null;
  distancia?: Decimal | number | null;
  iconeUrl?: string | null;
}

export interface CategoriaPaginationResponse {
  data: CategoriaResponse[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
