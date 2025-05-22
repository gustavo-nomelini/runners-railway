export interface EventoCategoriaResponse {
  eventoId: number;
  categoriaId: number;
  evento?: {
    id: number;
    nome: string;
    dataInicio: Date;
    modalidade?: string;
    capaUrl?: string;
    status: string;
  };
  categoria?: {
    id: number;
    nome: string;
    descricao?: string;
    distancia?: number;
    iconeUrl?: string;
  };
}

export interface EventoCategoriaPaginationResponse {
  data: EventoCategoriaResponse[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
