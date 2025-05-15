# API Endpoints Documentation

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
- 403 Forbidden: Tentativa de excluir perfil de outro usuário sem permissão de ADMIN
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
