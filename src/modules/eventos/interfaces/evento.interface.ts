import { Decimal } from '@prisma/client/runtime/library';

export interface EventoResponse {
  id: number;
  nome: string;
  descricao?: string;
  localizacao?: string;
  coordenadas?: any;
  dataInicio: Date;
  dataFim?: Date;
  prazoInscricao?: Date;
  organizadorId: number;
  status: string;
  capacidadeMaxima?: number;
  taxaInscricao?: Decimal;
  capaUrl?: string;
  modalidade?: string;
  siteOficial?: string;
  dataCriacao: Date;
  metadados?: any;
}

export interface EventoDetailResponse extends EventoResponse {
  organizador?: {
    id: number;
    nome: string;
    email?: string;
    fotoPerfilUrl?: string;
  };
  categorias?: Array<{
    categoria: {
      id: number;
      nome: string;
      descricao?: string;
      distancia?: number;
      iconeUrl?: string;
    };
  }>;
  totalInscritos?: number;
  totalComentarios?: number;
  totalFotos?: number;
}

export interface EventoPaginationResponse {
  data: EventoDetailResponse[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
