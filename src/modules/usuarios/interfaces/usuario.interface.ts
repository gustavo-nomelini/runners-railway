export interface UsuarioResponse {
  id: number;
  nome: string;
  email: string;
  fotoPerfilUrl?: string;
  biografia?: string;
  dataRegistro: Date;
  ultimaAtividade?: Date;
  cidade?: string;
  estado?: string;
  pais?: string;
}

export interface UsuarioWithAuthResponse extends UsuarioResponse {
  access_token: string;
}
