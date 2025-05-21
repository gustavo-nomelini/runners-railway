export interface CategoriaResponse {
  id: number;
  nome: string;
  descricao?: string;
  distancia?: number;
  iconeUrl?: string;
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
