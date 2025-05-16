import { UsuarioEvento } from '@prisma/client';

export interface UsuarioEventoWithRelations extends UsuarioEvento {
  usuario: {
    id: number;
    nome: string;
    email: string;
    fotoPerfilUrl: string | null;
  };
  evento: {
    id: number;
    nome: string;
    dataInicio: Date;
    localizacao: string | null;
    capaUrl: string | null;
    status: string;
    organizadorId: number;
  };
}
