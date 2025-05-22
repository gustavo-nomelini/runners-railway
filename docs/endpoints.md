# API Endpoints Documentation

## Níveis de Permissão

O sistema possui os seguintes níveis de permissão:

- **Nível 0 (USUARIO)**: Usuário básico

  - Pode visualizar eventos
  - Pode se inscrever em eventos
  - Pode gerenciar seu próprio perfil
  - Pode ver suas próprias inscrições

- **Nível 1 (ORGANIZADOR)**: Organizador de eventos

  - Todas as permissões do nível 0
  - Pode criar eventos
  - Pode gerenciar seus próprios eventos
  - Pode ver inscritos em seus eventos

- **Nível 2 (ADMIN)**: Administrador do sistema
  - Todas as permissões dos níveis 0 e 1
  - Pode gerenciar todos os usuários
  - Pode gerenciar todos os eventos
  - Pode alterar níveis de permissão
  - Pode ver todas as inscrições

## Códigos de Erro

Todas as rotas podem retornar os seguintes erros:

- **400 Bad Request**: Dados inválidos ou mal formatados
- **401 Unauthorized**: Token ausente ou inválido
- **403 Forbidden**: Sem permissão para acessar o recurso
- **404 Not Found**: Recurso não encontrado
- **500 Internal Server Error**: Erro interno do servidor


## Autenticação e Usuários

### Registro de Usuário Normal

```http
POST /api/v1/usuarios
```

**Permissões**: Público (não requer autenticação)

**Body**

```json
{
  "nome": "Usuário Teste",
  "email": "usuario@example.com",
  "senha": "senha12345",
  "fotoPerfilUrl": "https://exemplo.com/foto.jpg",
  "biografia": "Minha biografia",
  "cidade": "São Paulo",
  "estado": "SP",
  "pais": "Brasil",
  "dataNascimento": "1990-01-01",
  "genero": "Masculino"
}
```

**Resposta (201 Created)**

```json
{
  "id": 1,
  "nome": "Usuário Teste",
  "email": "usuario@example.com",
  "fotoPerfilUrl": "https://exemplo.com/foto.jpg",
  "biografia": "Minha biografia",
  "dataRegistro": "2024-03-14T10:30:00.000Z",
  "cidade": "São Paulo",
  "estado": "SP",
  "pais": "Brasil",
  "nivelPermissao": 0
}
```

### Registro de Organizador de Eventos

```http
POST /api/v1/usuarios/organizador
```

**Permissões**: Público (não requer autenticação)

**Body**

```json
{
  "nome": "João Silva",
  "email": "joao@empresa.com",
  "senha": "senha12345",
  "fotoPerfilUrl": "https://exemplo.com/foto.jpg",
  "biografia": "Organizador de eventos esportivos",
  "cidade": "São Paulo",
  "estado": "SP",
  "pais": "Brasil",
  "nomeEmpresa": "Empresa de Eventos XYZ",
  "cnpj": "12345678901234",
  "site": "https://empresa.com"
}
```

**Resposta (201 Created)**

```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@empresa.com",
  "fotoPerfilUrl": "https://exemplo.com/foto.jpg",
  "biografia": "Organizador de eventos esportivos",
  "dataRegistro": "2024-03-14T10:30:00.000Z",
  "cidade": "São Paulo",
  "estado": "SP",
  "pais": "Brasil",
  "nivelPermissao": 1,
  "nomeEmpresa": "Empresa de Eventos XYZ",
  "cnpj": "12345678901234",
  "site": "https://empresa.com"
}
```

**Notas:**

- O endpoint de organizador requer campos adicionais obrigatórios: `nomeEmpresa` e `cnpj`
- O campo `site` é opcional
- Organizadores são criados automaticamente com `nivelPermissao: 1`, permitindo criar e gerenciar eventos
- Usuários normais são criados com `nivelPermissao: 0`

### Login

```http
POST /api/v1/auth/login
```

**Permissões**: Público (não requer autenticação)

**Body**

```json
{
  "email": "usuario@example.com",
  "senha": "senha12345"
}
```

**Resposta (200 OK)**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nome": "Usuário Teste",
    "email": "usuario@example.com",
    "nivelPermissao": 1,
    "fotoPerfilUrl": "https://exemplo.com/foto.jpg"
  }
}
```

### Listar Usuários

```http
GET /api/v1/usuarios
```

**Permissões**:

- Requer JWT Token
- Nível mínimo: ADMIN (2)

**Headers**

```
Authorization: Bearer {token}
```

**Resposta (200 OK)**

```json
[
  {
    "id": 1,
    "nome": "Usuário 1",
    "email": "usuario1@example.com",
    "fotoPerfilUrl": "https://exemplo.com/foto1.jpg",
    "biografia": "Biografia do usuário 1",
    "dataRegistro": "2024-03-14T10:30:00.000Z",
    "ultimaAtividade": "2024-03-14T11:00:00.000Z",
    "cidade": "São Paulo",
    "estado": "SP",
    "pais": "Brasil"
  }
]
```

### Buscar Usuário por ID

```http
GET /api/v1/usuarios/:id
```

**Permissões**:

- Requer JWT Token
- Nível mínimo: USUARIO (0)

**Headers**

```
Authorization: Bearer {token}
```

**Resposta (200 OK)**

```json
{
  "id": 1,
  "nome": "Usuário 1",
  "email": "usuario1@example.com",
  "fotoPerfilUrl": "https://exemplo.com/foto1.jpg",
  "biografia": "Biografia do usuário 1",
  "dataRegistro": "2024-03-14T10:30:00.000Z",
  "ultimaAtividade": "2024-03-14T11:00:00.000Z",
  "cidade": "São Paulo",
  "estado": "SP",
  "pais": "Brasil"
}
```

### Atualizar Usuário

```http
PATCH /api/v1/usuarios/:id
```

**Permissões**:

- Requer JWT Token
- Nível mínimo: USUARIO (0)
- Usuário só pode atualizar seu próprio perfil, exceto ADMIN que pode atualizar qualquer perfil

**Headers**

```
Authorization: Bearer {token}
```

**Body** (campos opcionais)

```json
{
  "nome": "Novo Nome",
  "biografia": "Nova biografia",
  "senha": "nova_senha123"
}
```

**Resposta (200 OK)**

```json
{
  "id": 1,
  "nome": "Novo Nome",
  "email": "usuario1@example.com",
  "fotoPerfilUrl": "https://exemplo.com/foto1.jpg",
  "biografia": "Nova biografia",
  "dataRegistro": "2024-03-14T10:30:00.000Z",
  "ultimaAtividade": "2024-03-14T11:00:00.000Z"
}
```

### Excluir Usuário

```http
DELETE /api/v1/usuarios/:id
```

**Permissões**:

- Requer JWT Token
- Nível mínimo: USUARIO (0)
- Usuário só pode excluir seu próprio perfil, exceto ADMIN que pode excluir qualquer perfil

**Headers**

```
Authorization: Bearer {token}
```

**Resposta (200 OK)**

```json
{
  "message": "Usuário removido com sucesso"
}
```

**Códigos de Erro**:

- 401 Unauthorized: Token ausente ou inválido
- 403 Forbidden: Tentativa de excluir perfil de outro usuário com permissão de ADMIN
- 404 Not Found: Usuário não encontrado

## Eventos

### Criar Evento

```http
POST /api/v1/eventos
```

**Permissões**:

- Requer JWT Token
- Nível mínimo: ORGANIZADOR (1)

**Headers**

```
Authorization: Bearer {token}
```

**Body**

```json
{
  "nome": "Maratona de São Paulo",
  "descricao": "Tradicional maratona pelos principais pontos turísticos da cidade",
  "localizacao": "Parque do Ibirapuera, São Paulo - SP",
  "coordenadas": {
    "lat": -23.5505,
    "lng": -46.6333
  },
  "dataInicio": "2024-05-01T07:00:00Z",
  "dataFim": "2024-05-01T14:00:00Z",
  "prazoInscricao": "2024-04-15T23:59:59Z",
  "capacidadeMaxima": 1000,
  "taxaInscricao": 150.0,
  "modalidade": "Corrida",
  "capaUrl": "https://exemplo.com/capa-evento.jpg",
  "siteOficial": "https://maratonasp.com.br",
  "categoriaIds": [1, 2, 3]
}
```

**Resposta (201 Created)**

```json
{
  "id": 1,
  "nome": "Maratona de São Paulo",
  "descricao": "Tradicional maratona pelos principais pontos turísticos da cidade",
  "localizacao": "Parque do Ibirapuera, São Paulo - SP",
  "coordenadas": {
    "lat": -23.5505,
    "lng": -46.6333
  },
  "dataInicio": "2024-05-01T07:00:00Z",
  "dataFim": "2024-05-01T14:00:00Z",
  "prazoInscricao": "2024-04-15T23:59:59Z",
  "status": "Agendado",
  "capacidadeMaxima": 1000,
  "taxaInscricao": 150.0,
  "modalidade": "Corrida",
  "organizador": {
    "id": 1,
    "nome": "Organizador",
    "email": "organizador@example.com",
    "fotoPerfilUrl": "https://exemplo.com/foto.jpg"
  },
  "categorias": [
    {
      "id": 1,
      "nome": "42km",
      "descricao": "Maratona completa"
    }
    // ... outras categorias
  ]
}
```

### Listar Eventos

```http
GET /api/v1/eventos
```

**Permissões**: Público (não requer autenticação)

**Query Parameters**

```
nome?: string
localizacao?: string
dataInicioDe?: string (ISO 8601)
dataInicioAte?: string (ISO 8601)
status?: string (Agendado|Confirmado|Cancelado|Concluído)
modalidade?: string
categoriaId?: number
organizadorId?: number
inscricoesAbertas?: boolean
page?: number (default: 1)
limit?: number (default: 10)
```

**Resposta (200 OK)**

```json
{
  "data": [
    {
      "id": 1,
      "nome": "Maratona de São Paulo",
      "descricao": "Tradicional maratona pelos principais pontos turísticos da cidade",
      "localizacao": "Parque do Ibirapuera, São Paulo - SP",
      "dataInicio": "2024-05-01T07:00:00Z",
      "status": "Agendado",
      "modalidade": "Corrida",
      "organizador": {
        "id": 1,
        "nome": "Organizador",
        "fotoPerfilUrl": "https://exemplo.com/foto.jpg"
      },
      "totalInscritos": 150,
      "categorias": [
        {
          "categoria": {
            "id": 1,
            "nome": "42km"
          }
        }
      ]
    }
    // ... mais eventos
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### Buscar Evento por ID

```http
GET /api/v1/eventos/:id
```

**Permissões**: Público (não requer autenticação)

**Resposta (200 OK)**

```json
{
  "id": 1,
  "nome": "Maratona de São Paulo",
  "descricao": "Tradicional maratona pelos principais pontos turísticos da cidade",
  "localizacao": "Parque do Ibirapuera, São Paulo - SP",
  "coordenadas": {
    "lat": -23.5505,
    "lng": -46.6333
  },
  "dataInicio": "2024-05-01T07:00:00Z",
  "dataFim": "2024-05-01T14:00:00Z",
  "prazoInscricao": "2024-04-15T23:59:59Z",
  "status": "Agendado",
  "organizador": {
    "id": 1,
    "nome": "Organizador",
    "email": "organizador@example.com",
    "fotoPerfilUrl": "https://exemplo.com/foto.jpg"
  },
  "totalInscritos": 150,
  "totalComentarios": 25,
  "totalFotos": 10,
  "categorias": [
    {
      "categoria": {
        "id": 1,
        "nome": "42km",
        "descricao": "Maratona completa"
      }
    }
    // ... outras categorias
  ]
}
```

### Atualizar Evento

```http
PATCH /api/v1/eventos/:id
```

**Permissões**:

- Requer JWT Token
- Nível mínimo: ORGANIZADOR (1)
- Organizador só pode atualizar seus próprios eventos, exceto ADMIN que pode atualizar qualquer evento

**Headers**

```
Authorization: Bearer {token}
```

**Body** (campos opcionais)

```json
{
  "nome": "Maratona de São Paulo 2024",
  "descricao": "Nova descrição do evento",
  "capacidadeMaxima": 1500,
  "categoriaIds": [1, 2, 4]
}
```

**Resposta (200 OK)**

```json
{
  "id": 1,
  "nome": "Maratona de São Paulo 2024",
  "descricao": "Nova descrição do evento",
  "localizacao": "Parque do Ibirapuera, São Paulo - SP",
  "coordenadas": {
    "lat": -23.5505,
    "lng": -46.6333
  },
  "dataInicio": "2024-05-01T07:00:00Z",
  "dataFim": "2024-05-01T14:00:00Z",
  "prazoInscricao": "2024-04-15T23:59:59Z",
  "status": "Agendado",
  "capacidadeMaxima": 1500,
  "organizador": {
    "id": 1,
    "nome": "Organizador",
    "email": "organizador@example.com",
    "fotoPerfilUrl": "https://exemplo.com/foto.jpg"
  },
  "categorias": [
    {
      "categoria": {
        "id": 1,
        "nome": "42km"
      }
    }
    // ... outras categorias atualizadas
  ]
}
```

### Excluir Evento

```http
DELETE /api/v1/eventos/:id
```

**Permissões**:

- Requer JWT Token
- Nível mínimo: ORGANIZADOR (1)
- Organizador só pode excluir seus próprios eventos, exceto ADMIN que pode excluir qualquer evento

**Headers**

```
Authorization: Bearer {token}
```

**Resposta (200 OK)**

```json
{
  "message": "Evento com ID 1 foi removido com sucesso"
}
```

### Inscrição em Evento

```http
POST /api/v1/eventos/inscricao
```

**Permissões**:

- Requer JWT Token
- Nível mínimo: USUARIO (0)

**Headers**

```
Authorization: Bearer {token}
```

**Body**

```json
{
  "eventoId": 1,
  "numeroAtleta": "A12345",
  "status": "Inscrito",
  "observacoes": "Gostaria de participar da categoria 10km",
  "origemInscricao": "app"
}
```

**Resposta (201 Created)**

```json
{
  "id": 1,
  "usuarioId": 5,
  "eventoId": 1,
  "dataInscricao": "2024-05-17T10:30:00.000Z",
  "status": "Inscrito",
  "numeroAtleta": "A12345",
  "codigoConfirmacao": "CONF12345",
  "origemInscricao": "app",
  "observacoes": "Gostaria de participar da categoria 10km",
  "evento": {
    "id": 1,
    "nome": "Maratona de São Paulo",
    "dataInicio": "2024-05-01T07:00:00Z"
  }
}
```

### Listar Inscrições de um Usuário

```http
GET /api/v1/usuarios/:id/inscricoes
```

**Permissões**:

- Requer JWT Token
- Nível mínimo: USUARIO (0)
- Usuário só pode ver suas próprias inscrições, exceto ADMIN que pode ver todas

**Headers**

```
Authorization: Bearer {token}
```

**Query Parameters**

```
status?: string (Inscrito|Confirmado|Cancelado|Pendente)
page?: number (default: 1)
limit?: number (default: 10)
```

**Resposta (200 OK)**

```json
{
  "data": [
    {
      "id": 1,
      "usuarioId": 5,
      "eventoId": 1,
      "dataInscricao": "2024-05-17T10:30:00.000Z",
      "status": "Inscrito",
      "numeroAtleta": "A12345",
      "evento": {
        "id": 1,
        "nome": "Maratona de São Paulo",
        "descricao": "Tradicional maratona pelos principais pontos turísticos da cidade",
        "dataInicio": "2024-05-01T07:00:00Z",
        "localizacao": "Parque do Ibirapuera, São Paulo - SP",
        "capaUrl": "https://exemplo.com/capa-evento.jpg"
      }
    }
    // ... mais inscrições
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### Listar Inscritos em um Evento

```http
GET /api/v1/eventos/:id/inscricoes
```

**Permissões**:

- Requer JWT Token
- Nível mínimo: ORGANIZADOR (1)
- Organizador só pode ver inscritos dos seus próprios eventos, exceto ADMIN que pode ver todos

**Headers**

```
Authorization: Bearer {token}
```

**Query Parameters**

```
status?: string (Inscrito|Confirmado|Cancelado|Pendente)
page?: number (default: 1)
limit?: number (default: 10)
```

**Resposta (200 OK)**

```json
{
  "data": [
    {
      "id": 1,
      "usuarioId": 5,
      "eventoId": 1,
      "dataInscricao": "2024-05-17T10:30:00.000Z",
      "status": "Inscrito",
      "numeroAtleta": "A12345",
      "usuario": {
        "id": 5,
        "nome": "Participante",
        "email": "participante@example.com",
        "fotoPerfilUrl": "https://exemplo.com/foto-participante.jpg"
      }
    }
    // ... mais inscrições
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 10,
    "totalPages": 15
  }
}
```

### Cancelar Inscrição em Evento

```http
DELETE /api/v1/eventos/inscricao/:inscricaoId
```

**Permissões**:

- Requer JWT Token
- Nível mínimo: USUARIO (0)
- Usuário só pode cancelar suas próprias inscrições, exceto ADMIN que pode cancelar qualquer inscrição

**Headers**

```
Authorization: Bearer {token}
```

**Resposta (200 OK)**

```json
{
  "message": "Inscrição cancelada com sucesso"
}
```

## Inscrições em Eventos (UsuarioEvento)

### Registrar em Evento

```http
POST /api/v1/evento-inscricoes
```

**Permissões**:

- Requer JWT Token
- Nível mínimo: USUARIO (0)

**Headers**

```
Authorization: Bearer {token}
```

**Body**

```json
{
  "eventoId": 1,
  "numeroAtleta": "A1234",
  "status": "Inscrito",
  "origemInscricao": "app",
  "comprovantePagamentoUrl": "https://exemplo.com/comprovante.pdf",
  "observacoes": "Necessito de assistência especial"
}
```

**Resposta (201 Created)**

```json
{
  "id": 1,
  "usuarioId": 5,
  "eventoId": 1,
  "dataInscricao": "2024-03-14T10:30:00.000Z",
  "status": "Inscrito",
  "numeroAtleta": "A1234",
  "origemInscricao": "app",
  "comprovantePagamentoUrl": "https://exemplo.com/comprovante.pdf",
  "observacoes": "Necessito de assistência especial",
  "usuario": {
    "id": 5,
    "nome": "Participante",
    "email": "participante@example.com",
    "fotoPerfilUrl": "https://exemplo.com/foto.jpg"
  },
  "evento": {
    "id": 1,
    "nome": "Maratona de São Paulo",
    "dataInicio": "2024-05-01T07:00:00Z",
    "localizacao": "Parque do Ibirapuera, São Paulo - SP",
    "capaUrl": "https://exemplo.com/capa.jpg",
    "status": "Agendado"
  }
}
```

### Listar Inscrições (Organizador)

```http
GET /api/v1/evento-inscricoes
```

**Permissões**:

- Requer JWT Token
- Nível mínimo: ORGANIZADOR (1)

**Headers**

```
Authorization: Bearer {token}
```

**Query Parameters**

```
page?: number (default: 1)
limit?: number (default: 10)
eventoId?: number
usuarioId?: number
status?: string (Inscrito|Confirmado|Em Análise|Cancelado|Não Compareceu)
```

**Resposta (200 OK)**

```json
{
  "data": [
    {
      "id": 1,
      "usuarioId": 5,
      "eventoId": 1,
      "dataInscricao": "2024-03-14T10:30:00.000Z",
      "status": "Inscrito",
      "numeroAtleta": "A1234",
      "usuario": {
        "id": 5,
        "nome": "Participante",
        "email": "participante@example.com",
        "fotoPerfilUrl": "https://exemplo.com/foto.jpg"
      },
      "evento": {
        "id": 1,
        "nome": "Maratona de São Paulo",
        "dataInicio": "2024-05-01T07:00:00Z",
        "localizacao": "Parque do Ibirapuera, São Paulo - SP",
        "capaUrl": "https://exemplo.com/capa.jpg",
        "status": "Agendado"
      }
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### Listar Minhas Inscrições

```http
GET /api/v1/evento-inscricoes/minhas-inscricoes
```

**Permissões**:

- Requer JWT Token
- Nível mínimo: USUARIO (0)

**Headers**

```
Authorization: Bearer {token}
```

**Query Parameters**

```
page?: number (default: 1)
limit?: number (default: 10)
eventoId?: number
status?: string (Inscrito|Confirmado|Em Análise|Cancelado|Não Compareceu)
```

**Resposta (200 OK)**

```json
{
  "data": [
    {
      "id": 1,
      "usuarioId": 5,
      "eventoId": 1,
      "dataInscricao": "2024-03-14T10:30:00.000Z",
      "status": "Inscrito",
      "numeroAtleta": "A1234",
      "evento": {
        "id": 1,
        "nome": "Maratona de São Paulo",
        "dataInicio": "2024-05-01T07:00:00Z",
        "localizacao": "Parque do Ibirapuera, São Paulo - SP",
        "capaUrl": "https://exemplo.com/capa.jpg",
        "status": "Agendado"
      }
    }
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### Buscar Inscrição Específica (Organizador)

```http
GET /api/v1/evento-inscricoes/evento/:eventoId/usuario/:usuarioId
```

**Permissões**:

- Requer JWT Token
- Nível mínimo: ORGANIZADOR (1)

**Headers**

```
Authorization: Bearer {token}
```

**Resposta (200 OK)**

```json
{
  "id": 1,
  "usuarioId": 5,
  "eventoId": 1,
  "dataInscricao": "2024-03-14T10:30:00.000Z",
  "status": "Inscrito",
  "numeroAtleta": "A1234",
  "usuario": {
    "id": 5,
    "nome": "Participante",
    "email": "participante@example.com",
    "fotoPerfilUrl": "https://exemplo.com/foto.jpg"
  },
  "evento": {
    "id": 1,
    "nome": "Maratona de São Paulo",
    "dataInicio": "2024-05-01T07:00:00Z",
    "localizacao": "Parque do Ibirapuera, São Paulo - SP",
    "capaUrl": "https://exemplo.com/capa.jpg",
    "status": "Agendado"
  }
}
```

### Buscar Minha Inscrição em Evento

```http
GET /api/v1/evento-inscricoes/minha-inscricao/:eventoId
```

**Permissões**:

- Requer JWT Token
- Nível mínimo: USUARIO (0)

**Headers**

```
Authorization: Bearer {token}
```

**Resposta (200 OK)**

```json
{
  "id": 1,
  "usuarioId": 5,
  "eventoId": 1,
  "dataInscricao": "2024-03-14T10:30:00.000Z",
  "status": "Inscrito",
  "numeroAtleta": "A1234",
  "usuario": {
    "id": 5,
    "nome": "Participante",
    "email": "participante@example.com"
  },
  "evento": {
    "id": 1,
    "nome": "Maratona de São Paulo",
    "dataInicio": "2024-05-01T07:00:00Z"
  }
}
```

### Atualizar Inscrição

```http
PATCH /api/v1/evento-inscricoes/evento/:eventoId/usuario/:usuarioId
```

**Permissões**:

- Requer JWT Token
- Nível mínimo: USUARIO (0)
- Usuário comum só pode cancelar própria inscrição
- Organizadores podem atualizar inscrições de seus eventos
- Admins podem atualizar qualquer inscrição

**Headers**

```
Authorization: Bearer {token}
```

**Body**

```json
{
  "status": "Cancelado",
  "numeroAtleta": "A1234",
  "comprovantePagamentoUrl": "https://exemplo.com/comprovante.pdf",
  "observacoes": "Cancelamento por motivos pessoais"
}
```

**Resposta (200 OK)**

```json
{
  "id": 1,
  "usuarioId": 5,
  "eventoId": 1,
  "dataInscricao": "2024-03-14T10:30:00.000Z",
  "status": "Cancelado",
  "numeroAtleta": "A1234",
  "comprovantePagamentoUrl": "https://exemplo.com/comprovante.pdf",
  "observacoes": "Cancelamento por motivos pessoais",
  "usuario": {
    "id": 5,
    "nome": "Participante",
    "email": "participante@example.com"
  },
  "evento": {
    "id": 1,
    "nome": "Maratona de São Paulo",
    "dataInicio": "2024-05-01T07:00:00Z"
  }
}
```

### Atualizar Minha Inscrição

```http
PATCH /api/v1/evento-inscricoes/minha-inscricao/:eventoId
```

**Permissões**:

- Requer JWT Token
- Nível mínimo: USUARIO (0)
- Usuário comum só pode cancelar própria inscrição

**Headers**

```
Authorization: Bearer {token}
```

**Body**

```json
{
  "status": "Cancelado",
  "observacoes": "Cancelamento por motivos pessoais"
}
```

**Resposta (200 OK)**

```json
{
  "id": 1,
  "usuarioId": 5,
  "eventoId": 1,
  "dataInscricao": "2024-03-14T10:30:00.000Z",
  "status": "Cancelado",
  "observacoes": "Cancelamento por motivos pessoais",
  "usuario": {
    "id": 5,
    "nome": "Participante",
    "email": "participante@example.com"
  },
  "evento": {
    "id": 1,
    "nome": "Maratona de São Paulo",
    "dataInicio": "2024-05-01T07:00:00Z"
  }
}
```

### Excluir Inscrição

```http
DELETE /api/v1/evento-inscricoes/evento/:eventoId/usuario/:usuarioId
```

**Permissões**:

- Requer JWT Token
- Nível mínimo: USUARIO (0)
- Usuário comum só pode excluir própria inscrição
- Organizadores podem excluir inscrições de seus eventos
- Admins podem excluir qualquer inscrição

**Headers**

```
Authorization: Bearer {token}
```

**Resposta (200 OK)**

```json
{
  "message": "Inscrição removida com sucesso"
}
```

### Resultados de Corridas

### Registrar Resultado de Corrida

```http
POST /api/v1/resultados-corrida
```

**Permissões**:

- Requer JWT Token
- Nível mínimo: USUARIO (0)

**Headers**

```
Authorization: Bearer {token}
```

**Body**

```json
{
  "eventoId": 1,
  "tempoLiquido": "01:45:30",
  "tempoBruto": "01:46:15",
  "posicaoGeral": 120,
  "posicaoCategoria": 15,
  "categoriaCorreida": "M30-34",
  "ritmoMedio": "05:05",
  "velocidadeMedia": 11.8,
  "distanciaPercorrida": 21.1,
  "linkCertificado": "https://exemplo.com/certificado/123",
  "chipId": "ABC12345",
  "splits": {
    "5k": "00:25:30",
    "10k": "00:51:15",
    "15k": "01:18:45",
    "20k": "01:42:00"
  }
}
```

**Resposta (201 Created)**

```json
{
  "id": 1,
  "usuarioId": 5,
  "eventoId": 1,
  "tempoLiquido": "01:45:30",
  "tempoBruto": "01:46:15",
  "posicaoGeral": 120,
  "posicaoCategoria": 15,
  "categoriaCorreida": "M30-34",
  "ritmoMedio": "05:05",
  "velocidadeMedia": 11.8,
  "distanciaPercorrida": 21.1,
  "linkCertificado": "https://exemplo.com/certificado/123",
  "validado": false,
  "fonteDados": "manual",
  "chipId": "ABC12345",
  "splits": {
    "5k": "00:25:30",
    "10k": "00:51:15",
    "15k": "01:18:45",
    "20k": "01:42:00"
  }
}
```

**Códigos de Erro**:

- 400 Bad Request: Evento não encontrado
- 409 Conflict: Usuário já possui um resultado para este evento

### Listar Resultados de Corridas

```http
GET /api/v1/resultados-corrida
```

**Permissões**: Público (não requer autenticação)

**Query Parameters**

```
eventoId?: number
usuarioId?: number
validado?: boolean
```

**Resposta (200 OK)**

```json
[
  {
    "id": 1,
    "usuarioId": 5,
    "eventoId": 1,
    "tempoLiquido": "01:45:30",
    "posicaoGeral": 120,
    "posicaoCategoria": 15,
    "usuario": {
      "id": 5,
      "nome": "João Silva",
      "cidade": "São Paulo",
      "estado": "SP",
      "fotoPerfilUrl": "https://exemplo.com/foto.jpg"
    },
    "evento": {
      "id": 1,
      "nome": "Meia Maratona de São Paulo",
      "dataInicio": "2024-06-15T06:00:00.000Z",
      "localizacao": "São Paulo, SP"
    }
  }
  // mais resultados
]
```

### Listar Resultados de um Evento

```http
GET /api/v1/resultados-corrida/evento/:eventoId
```

**Permissões**: Público (não requer autenticação)

**Resposta (200 OK)**

```json
[
  {
    "id": 1,
    "usuarioId": 5,
    "eventoId": 1,
    "tempoLiquido": "01:45:30",
    "posicaoGeral": 120,
    "posicaoCategoria": 15,
    "categoriaCorreida": "M30-34",
    "usuario": {
      "id": 5,
      "nome": "João Silva",
      "cidade": "São Paulo",
      "estado": "SP"
    }
  }
  // mais resultados
]
```

**Códigos de Erro**:

- 404 Not Found: Evento não encontrado

### Listar Meus Resultados

```http
GET /api/v1/resultados-corrida/usuario/meus-resultados
```

**Permissões**:

- Requer JWT Token
- Nível mínimo: USUARIO (0)

**Headers**

```
Authorization: Bearer {token}
```

**Resposta (200 OK)**

```json
[
  {
    "id": 1,
    "eventoId": 1,
    "tempoLiquido": "01:45:30",
    "posicaoGeral": 120,
    "evento": {
      "id": 1,
      "nome": "Meia Maratona de São Paulo",
      "dataInicio": "2024-06-15T06:00:00.000Z",
      "localizacao": "São Paulo, SP",
      "modalidade": "Corrida de Rua",
      "capaUrl": "https://exemplo.com/capa.jpg"
    }
  }
  // mais resultados
]
```

### Listar Resultados de um Usuário

```http
GET /api/v1/resultados-corrida/usuario/:usuarioId
```

**Permissões**: Público (não requer autenticação)

**Resposta (200 OK)**

```json
[
  {
    "id": 1,
    "eventoId": 1,
    "tempoLiquido": "01:45:30",
    "posicaoGeral": 120,
    "evento": {
      "id": 1,
      "nome": "Meia Maratona de São Paulo",
      "dataInicio": "2024-06-15T06:00:00.000Z",
      "localizacao": "São Paulo, SP",
      "modalidade": "Corrida de Rua",
      "capaUrl": "https://exemplo.com/capa.jpg"
    }
  }
  // mais resultados
]
```

### Obter Resultado Específico

```http
GET /api/v1/resultados-corrida/:id
```

**Permissões**: Público (não requer autenticação)

**Resposta (200 OK)**

```json
{
  "id": 1,
  "usuarioId": 5,
  "eventoId": 1,
  "tempoLiquido": "01:45:30",
  "tempoBruto": "01:46:15",
  "posicaoGeral": 120,
  "posicaoCategoria": 15,
  "categoriaCorreida": "M30-34",
  "ritmoMedio": "05:05",
  "velocidadeMedia": 11.8,
  "distanciaPercorrida": 21.1,
  "linkCertificado": "https://exemplo.com/certificado/123",
  "validado": false,
  "fonteDados": "manual",
  "chipId": "ABC12345",
  "splits": {
    "5k": "00:25:30",
    "10k": "00:51:15",
    "15k": "01:18:45",
    "20k": "01:42:00"
  },
  "usuario": {
    "id": 5,
    "nome": "João Silva",
    "cidade": "São Paulo",
    "estado": "SP",
    "fotoPerfilUrl": "https://exemplo.com/foto.jpg"
  },
  "evento": {
    "id": 1,
    "nome": "Meia Maratona de São Paulo",
    "dataInicio": "2024-06-15T06:00:00.000Z",
    "localizacao": "São Paulo, SP",
    "modalidade": "Corrida de Rua"
  }
}
```

**Códigos de Erro**:

- 404 Not Found: Resultado não encontrado

### Atualizar Resultado

```http
PATCH /api/v1/resultados-corrida/:id
```

**Permissões**:

- Requer JWT Token
- Nível mínimo: USUARIO (0)
- Usuário só pode atualizar seu próprio resultado
- Organizador do evento pode atualizar qualquer resultado do evento
- Admin pode atualizar qualquer resultado

**Headers**

```
Authorization: Bearer {token}
```

**Body** (campos opcionais)

```json
{
  "tempoLiquido": "01:44:30",
  "posicaoGeral": 118,
  "posicaoCategoria": 14,
  "ritmoMedio": "05:00",
  "velocidadeMedia": 12.0,
  "linkCertificado": "https://exemplo.com/certificado/novo",
  "validado": true
}
```

**Resposta (200 OK)**

```json
{
  "id": 1,
  "usuarioId": 5,
  "eventoId": 1,
  "tempoLiquido": "01:44:30",
  "tempoBruto": "01:46:15",
  "posicaoGeral": 118,
  "posicaoCategoria": 14,
  "categoriaCorreida": "M30-34",
  "ritmoMedio": "05:00",
  "velocidadeMedia": 12.0,
  "distanciaPercorrida": 21.1,
  "linkCertificado": "https://exemplo.com/certificado/novo",
  "validado": true,
  "fonteDados": "manual",
  "chipId": "ABC12345",
  "splits": {
    "5k": "00:25:30",
    "10k": "00:51:15",
    "15k": "01:18:45",
    "20k": "01:42:00"
  }
}
```

**Códigos de Erro**:

- 403 Forbidden: Sem permissão para atualizar este resultado
- 404 Not Found: Resultado não encontrado

### Validar Múltiplos Resultados

```http
POST /api/v1/resultados-corrida/validar-resultados
```

**Permissões**:

- Requer JWT Token
- Nível mínimo: ORGANIZADOR (1)
- Deve ser o organizador do evento

**Headers**

```
Authorization: Bearer {token}
```

**Body**

```json
{
  "eventoId": 1,
  "resultadosIds": [1, 2, 3, 4, 5]
}
```

**Resposta (200 OK)**

```json
{
  "message": "5 resultados validados com sucesso"
}
```

**Códigos de Erro**:

- 403 Forbidden: Sem permissão para validar resultados deste evento

### Remover Resultado

```http
DELETE /api/v1/resultados-corrida/:id
```

**Permissões**:

- Requer JWT Token
- Nível mínimo: USUARIO (0)
- Usuário só pode remover seu próprio resultado
- Organizador do evento pode remover qualquer resultado do evento
- Admin pode remover qualquer resultado

**Headers**

```
Authorization: Bearer {token}
```

**Resposta (200 OK)**

```json
{
  "message": "Resultado removido com sucesso"
}
```

**Códigos de Erro**:

- 403 Forbidden: Sem permissão para remover este resultado
- 404 Not Found: Resultado não encontrado

### Remover Todos os Resultados de um Evento (Admin)

```http
DELETE /api/v1/resultados-corrida/evento/:eventoId/bulk
```

**Permissões**:

- Requer JWT Token
- Nível mínimo: ADMIN (2)

**Headers**

```
Authorization: Bearer {token}
```

**Resposta (200 OK)**

```json
{
  "message": "15 resultados removidos com sucesso"
}
```

## Categorias

### Criar Categoria

```http
POST /api/v1/categorias
```

**Permissões**:

- Requer JWT Token
- Nível mínimo: ADMIN (2)

**Headers**

```
Authorization: Bearer {token}
```

**Body**

```json
{
  "nome": "42km",
  "descricao": "Maratona completa",
  "distancia": 42.195,
  "iconeUrl": "https://exemplo.com/icones/maratona.png"
}
```

**Resposta (201 Created)**

```json
{
  "id": 1,
  "nome": "42km",
  "descricao": "Maratona completa",
  "distancia": 42.195,
  "iconeUrl": "https://exemplo.com/icones/maratona.png"
}
```

### Listar Categorias

```http
GET /api/v1/categorias
```

**Permissões**: Público (não requer autenticação)

**Query Parameters**

```
nome?: string (busca parcial)
page?: number (default: 1)
limit?: number (default: 10)
```

**Resposta (200 OK)**

```json
{
  "data": [
    {
      "id": 1,
      "nome": "42km",
      "descricao": "Maratona completa",
      "distancia": 42.195,
      "iconeUrl": "https://exemplo.com/icones/maratona.png"
    },
    {
      "id": 2,
      "nome": "21km",
      "descricao": "Meia-maratona",
      "distancia": 21.0975,
      "iconeUrl": "https://exemplo.com/icones/meia-maratona.png"
    }
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### Buscar Categoria por ID

```http
GET /api/v1/categorias/:id
```

**Permissões**: Público (não requer autenticação)

**Resposta (200 OK)**

```json
{
  "id": 1,
  "nome": "42km",
  "descricao": "Maratona completa",
  "distancia": 42.195,
  "iconeUrl": "https://exemplo.com/icones/maratona.png"
}
```

### Atualizar Categoria

```http
PATCH /api/v1/categorias/:id
```

**Permissões**:

- Requer JWT Token
- Nível mínimo: ADMIN (2)

**Headers**

```
Authorization: Bearer {token}
```

**Body** (campos opcionais)

```json
{
  "nome": "42.2km",
  "descricao": "Maratona oficial - distância olímpica",
  "iconeUrl": "https://exemplo.com/icones/maratona-novo.png"
}
```

**Resposta (200 OK)**

```json
{
  "id": 1,
  "nome": "42.2km",
  "descricao": "Maratona oficial - distância olímpica",
  "distancia": 42.195,
  "iconeUrl": "https://exemplo.com/icones/maratona-novo.png"
}
```

### Remover Categoria

```http
DELETE /api/v1/categorias/:id
```

**Permissões**:

- Requer JWT Token
- Nível mínimo: ADMIN (2)

**Headers**

```
Authorization: Bearer {token}
```

**Resposta (200 OK)**

```json
{
  "message": "Categoria com ID 1 foi removida com sucesso"
}
```

## Categorias-Eventos

### Criar Múltiplas Relações Evento-Categoria

```http
POST /api/v1/categorias-eventos
```

**Permissões**:

- Requer JWT Token
- Nível mínimo: ADMIN (2)

**Headers**

```
Authorization: Bearer {token}
```

**Body**

```json
{
  "items": [
    {
      "eventoId": 1,
      "categoriaId": 1
    },
    {
      "eventoId": 1,
      "categoriaId": 2
    },
    {
      "eventoId": 2,
      "categoriaId": 1
    }
  ]
}
```

**Resposta (201 Created)**

```json
{
  "message": "3 relações evento-categoria criadas com sucesso"
}
```

### Adicionar Categorias a um Evento

```http
POST /api/v1/categorias-eventos/eventos/:eventoId/categorias
```

**Permissões**:

- Requer JWT Token
- Nível mínimo: ORGANIZADOR (1)

**Headers**

```
Authorization: Bearer {token}
```

**Body**

```json
{
  "categoriaIds": [1, 2, 3]
}
```

**Resposta (201 Created)**

```json
{
  "message": "3 categorias adicionadas ao evento Maratona de São Paulo",
  "eventoId": 1,
  "categoriasAdicionadas": 3
}
```

### Adicionar Eventos a uma Categoria

```http
POST /api/v1/categorias-eventos/categorias/:categoriaId/eventos
```

**Permissões**:

- Requer JWT Token
- Nível mínimo: ADMIN (2)

**Headers**

```
Authorization: Bearer {token}
```

**Body**

```json
{
  "eventoIds": [1, 2, 3]
}
```

**Resposta (201 Created)**

```json
{
  "message": "3 eventos adicionados à categoria 42km",
  "categoriaId": 1,
  "eventosAdicionados": 3
}
```

### Listar Relações Evento-Categoria

```http
GET /api/v1/categorias-eventos
```

**Permissões**: Público (não requer autenticação)

**Query Parameters**

```
eventoId?: number
categoriaId?: number
page?: number (default: 1)
limit?: number (default: 10)
```

**Resposta (200 OK)**

```json
{
  "data": [
    {
      "eventoId": 1,
      "categoriaId": 1,
      "evento": {
        "id": 1,
        "nome": "Maratona de São Paulo",
        "dataInicio": "2024-05-01T07:00:00Z",
        "modalidade": "Corrida",
        "capaUrl": "https://exemplo.com/capa-evento.jpg",
        "status": "Agendado"
      },
      "categoria": {
        "id": 1,
        "nome": "42km",
        "descricao": "Maratona completa",
        "distancia": 42.195,
        "iconeUrl": "https://exemplo.com/icones/maratona.png"
      }
    }
    // ... mais relações
  ],
  "meta": {
    "total": 10,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### Listar Categorias de um Evento

```http
GET /api/v1/categorias-eventos/eventos/:eventoId/categorias
```

**Permissões**: Público (não requer autenticação)

**Resposta (200 OK)**

```json
[
  {
    "id": 1,
    "nome": "42km",
    "descricao": "Maratona completa",
    "distancia": 42.195,
    "iconeUrl": "https://exemplo.com/icones/maratona.png"
  },
  {
    "id": 2,
    "nome": "21km",
    "descricao": "Maratona de revezamento",
    "distancia": 21.0975,
    "iconeUrl": "https://exemplo.com/icones/maratona-revezamento.png"
  }
]
```

### Listar Eventos de uma Categoria

```http
GET /api/v1/categorias-eventos/categorias/:categoriaId/eventos
```

**Permissões**: Público (não requer autenticação)

**Resposta (200 OK)**

```json
[
  {
    "id": 1,
    "nome": "Maratona de São Paulo",
    "dataInicio": "2024-05-01T07:00:00Z",
    "modalidade": "Corrida",
    "capaUrl": "https://exemplo.com/capa-evento.jpg",
    "status": "Agendado"
  },
  {
    "id": 2,
    "nome": "Meia Maratona do Rio",
    "dataInicio": "2024-06-15T07:00:00Z",
    "modalidade": "Corrida",
    "capaUrl": "https://exemplo.com/capa-evento-rio.jpg",
    "status": "Agendado"
  }
]
```

### Remover uma Categoria de um Evento

```http
DELETE /api/v1/categorias-eventos/eventos/:eventoId/categorias/:categoriaId
```

**Permissões**:

- Requer JWT Token
- Nível mínimo: ORGANIZADOR (1)

**Headers**

```
Authorization: Bearer {token}
```

**Resposta (200 OK)**

```json
{
  "message": "Categoria 42km removida do evento Maratona de São Paulo",
  "eventoId": 1,
  "categoriaId": 1
}
```

### Remover Todas as Categorias de um Evento

```http
DELETE /api/v1/categorias-eventos/eventos/:eventoId/categorias
```

**Permissões**:

- Requer JWT Token
- Nível mínimo: ORGANIZADOR (1)

**Headers**

```
Authorization: Bearer {token}
```

**Resposta (200 OK)**

```json
{
  "message": "3 categorias removidas do evento Maratona de São Paulo",
  "eventoId": 1,
  "categoriasRemovidas": 3
}
```

### Remover Todos os Eventos de uma Categoria

```http
DELETE /api/v1/categorias-eventos/categorias/:categoriaId/eventos
```

**Permissões**:

- Requer JWT Token
- Nível mínimo: ADMIN (2)

**Headers**

```
Authorization: Bearer {token}
```

**Resposta (200 OK)**

```json
{
  "message": "2 eventos removidos da categoria 42km",
  "categoriaId": 1,
  "eventosRemovidos": 2
}
```

**Códigos de Erro**:

- 400 Bad Request: Dados inválidos ou relação inexistente
- 401 Unauthorized: Token ausente ou inválido
- 403 Forbidden: Não tem permissão para acessar esse recurso
- 404 Not Found: Categoria ou evento não encontrado
- 500 Internal Server Error: Erro interno do servidor
