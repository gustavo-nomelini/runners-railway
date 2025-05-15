export interface EventoRegistrationResponse {
  id: number;
  usuarioId: number;
  eventoId: number;
  dataInscricao: Date;
  status: string;
  numeroAtleta?: string;
  codigoConfirmacao?: string;
  origemInscricao: string;
  comprovantePagamentoUrl?: string;
  observacoes?: string;
}

export interface EventoRegistrationDetailResponse
  extends EventoRegistrationResponse {
  evento: {
    id: number;
    nome: string;
    descricao?: string;
    dataInicio: Date;
    dataFim?: Date;
    localizacao?: string;
    capaUrl?: string;
    modalidade?: string;
  };
  usuario: {
    id: number;
    nome: string;
    email: string;
    fotoPerfilUrl?: string;
  };
}
