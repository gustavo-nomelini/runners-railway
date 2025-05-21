# Documentação da API Runners

## Visão Geral

A API Runners é uma aplicação backend construída com NestJS, Prisma ORM e PostgreSQL para gerenciar eventos esportivos, registros de usuários, interações sociais e resultados de corridas.

## Tecnologias Utilizadas

- **NestJS**: Framework Node.js progressivo para construção de aplicações server-side eficientes
- **Prisma ORM**: ORM de próxima geração para TypeScript e Node.js
- **PostgreSQL**: Sistema de banco de dados relacional avançado
- **JWT**: JSON Web Tokens para autenticação
- **bcrypt**: Para hash seguro de senhas
- **Swagger**: Para documentação interativa da API

## Arquitetura

A aplicação segue uma arquitetura modular baseada em princípios SOLID e Clean Architecture:

- **Módulos**: Organizam a aplicação em unidades de domínio coesas
- **Controllers**: Gerenciam as rotas HTTP e requisições
- **Services**: Contêm a lógica de negócio
- **DTOs**: Validam os dados de entrada/saída
- **Entities**: Representam as entidades do domínio
- **Guards**: Protegem rotas com autenticação

## Estrutura de Pastas

```
src/
├── core/                  # Componentes fundamentais (auth, guards, etc.)
│   ├── auth/              # Autenticação e autorização
│   ├── guards/            # Guards de segurança
│   └── middlewares/       # Middlewares globais
├── modules/               # Módulos de domínio
│   └── usuarios/          # Módulo de usuários
│       ├── dtos/          # DTOs específicos
│       ├── entities/      # Entidades específicas
│       ├── usuario.controller.ts
│       ├── usuario.service.ts
│       └── usuario.module.ts
├── shared/                # Componentes compartilhados
│   ├── constants/         # Constantes globais
│   └── validators/        # Validadores compartilhados
├── prisma/                # Configuração do Prisma
│   ├── schema.prisma      # Esquema do banco de dados
│   └── prisma.service.ts  # Serviço Prisma
└── main.ts                # Ponto de entrada da aplicação
```

## Módulos Implementados

### Módulo de Usuários

Fornece funcionalidades para gerenciamento de usuários, incluindo registro, autenticação e manutenção de perfis.

#### Entidade Usuario

```typescript
// Modelo Prisma
model Usuario {
  id              Int       @id @default(autoincrement()) @map("usuario_id")
  nome            String    @db.VarChar(100)
  email           String    @unique @db.VarChar(255)
  senhaHash       String    @map("senha_hash") @db.VarChar(255)
  fotoPerfilUrl   String?   @map("foto_perfil_url") @db.VarChar(512)
  biografia       String?   @db.Text
  dataRegistro    DateTime  @default(now()) @map("data_registro") @db.Timestamptz
  ultimaAtividade DateTime? @map("ultima_atividade") @db.Timestamptz
  ativo           Boolean   @default(true)
  nivelPermissao  Int       @default(0) @map("nivel_permissao")
  cidade          String?   @db.VarChar(100)
  estado          String?   @db.VarChar(50)
  pais            String?   @db.VarChar(50)
  dataNascimento  DateTime? @map("data_nascimento") @db.Date
  genero          String?   @db.VarChar(30)
  preferencias    Json?     @db.JsonB

  // Relações com outras entidades
  // ...
}
```

## Endpoints da API

### Autenticação

#### Registro de Usuário

- **Endpoint**: `POST /api/v1/usuarios`
- **Descrição**: Registra um novo usuário no sistema
- **Body**:
  ```json
  {
    "nome": "Usuário Teste",
    "email": "usuario@example.com",
    "senha": "senha12345",
    "fotoPerfilUrl": "https://exemplo.com/foto.jpg",
    "biografia": "Minha biografia",
    "cidade": "São Paulo",
    "estado": "SP",
    "pais": "Brasil"
  }
  ```
- **Resposta (201 Created)**:
  ```json
  {
    "id": 1,
    "nome": "Usuário Teste",
    "email": "usuario@example.com",
    "fotoPerfilUrl": "https://exemplo.com/foto.jpg",
    "biografia": "Minha biografia",
    "dataRegistro": "2025-05-08T22:00:00.000Z",
    "cidade": "São Paulo",
    "estado": "SP",
    "pais": "Brasil"
  }
  ```

#### Login

- **Endpoint**: `POST /api/v1/usuarios/login`
- **Descrição**: Autentica um usuário e emite um token JWT
- **Body**:
  ```json
  {
    "email": "usuario@example.com",
    "password": "senha12345"
  }
  ```
- **Resposta (200 OK)**:
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "nome": "Usuário Teste",
      "email": "usuario@example.com",
      "nivelPermissao": 0
      // outros dados do usuário
    }
  }
  ```

### Gerenciamento de Usuários

#### Obter todos os usuários

- **Endpoint**: `GET /api/v1/usuarios`
- **Descrição**: Retorna lista de todos os usuários
- **Resposta (200 OK)**:
  ```json
  [
    {
      "id": 1,
      "nome": "Usuário 1",
      "email": "usuario1@example.com",
      "fotoPerfilUrl": "https://exemplo.com/foto1.jpg",
      "biografia": "Biografia do usuário 1",
      "dataRegistro": "2025-05-07T22:00:00.000Z",
      "ultimaAtividade": "2025-05-08T22:00:00.000Z",
      "cidade": "São Paulo",
      "estado": "SP",
      "pais": "Brasil"
    }
    // mais usuários
  ]
  ```

#### Obter usuário por ID

- **Endpoint**: `GET /api/v1/usuarios/:id`
- **Descrição**: Retorna detalhes de um usuário específico
- **Resposta (200 OK)**:
  ```json
  {
    "id": 1,
    "nome": "Usuário 1",
    "email": "usuario1@example.com",
    "fotoPerfilUrl": "https://exemplo.com/foto1.jpg",
    "biografia": "Biografia do usuário 1",
    "dataRegistro": "2025-05-07T22:00:00.000Z",
    "ultimaAtividade": "2025-05-08T22:00:00.000Z",
    "cidade": "São Paulo",
    "estado": "SP",
    "pais": "Brasil"
  }
  ```

#### Atualizar usuário

- **Endpoint**: `PATCH /api/v1/usuarios/:id`
- **Descrição**: Atualiza informações de um usuário existente
- **Autenticação**: JWT Bearer Token necessário
- **Body** (campos opcionais):
  ```json
  {
    "nome": "Novo Nome",
    "biografia": "Nova biografia",
    "senha": "nova_senha123"
  }
  ```
- **Resposta (200 OK)**:
  ```json
  {
    "id": 1,
    "nome": "Novo Nome",
    "email": "usuario1@example.com",
    "fotoPerfilUrl": "https://exemplo.com/foto1.jpg",
    "biografia": "Nova biografia",
    "dataRegistro": "2025-05-07T22:00:00.000Z",
    "ultimaAtividade": "2025-05-08T22:10:00.000Z",
    "cidade": "São Paulo",
    "estado": "SP",
    "pais": "Brasil"
  }
  ```

#### Excluir usuário

- **Endpoint**: `DELETE /api/v1/usuarios/:id`
- **Descrição**: Remove um usuário do sistema
- **Autenticação**: JWT Bearer Token necessário
- **Resposta (200 OK)**:
  ```json
  {
    "message": "Usuário removido com sucesso"
  }
  ```

## Resultados de Corridas

O módulo de Resultados de Corridas permite aos usuários registrar e gerenciar seus resultados em eventos esportivos, com validação pelos organizadores.

### Entidade ResultadoCorrida

```typescript
// Modelo Prisma
model ResultadoCorrida {
  id                 Int      @id @default(autoincrement()) @map("resultado_id")
  usuarioId          Int      @map("usuario_id")
  eventoId           Int      @map("evento_id")
  posicaoGeral       Int?     @map("posicao_geral")
  posicaoCategoria   Int?     @map("posicao_categoria")
  tempoLiquido       String   @map("tempo_liquido") // Formato HH:MM:SS
  tempoBruto         String?  @map("tempo_bruto")   // Formato HH:MM:SS
  categoriaCorreida  String?  @map("categoria_corrida") @db.VarChar(100)
  ritmoMedio         String?  @map("ritmo_medio")   // Formato MM:SS/km
  velocidadeMedia    Decimal? @map("velocidade_media") @db.Decimal(5, 2)
  distanciaPercorrida Decimal? @map("distancia_percorrida") @db.Decimal(10, 2)
  linkCertificado    String?  @map("link_certificado") @db.VarChar(512)
  validado           Boolean  @default(false)
  fonteDados         String   @default("manual") @map("fonte_dados") @db.VarChar(50)
  chipId             String?  @map("chip_id") @db.VarChar(100)
  splits             Json?    @db.JsonB

  usuario Usuario @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  evento  Evento  @relation(fields: [eventoId], references: [id], onDelete: Cascade)
}
```

### Endpoints de Resultados de Corridas

#### Registrar um resultado de corrida

- **Endpoint**: `POST /api/v1/resultados-corrida`
- **Descrição**: Registra um novo resultado de corrida para o usuário autenticado
- **Autenticação**: JWT Bearer Token necessário
- **Body**:
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
- **Resposta (201 Created)**:
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

#### Listar resultados de corridas

- **Endpoint**: `GET /api/v1/resultados-corrida`
- **Descrição**: Lista resultados de corridas com filtros opcionais
- **Parâmetros Query**:
  - `eventoId` (opcional): Filtrar por ID do evento
  - `usuarioId` (opcional): Filtrar por ID do usuário
  - `validado` (opcional): Filtrar por status de validação (true/false)
- **Resposta (200 OK)**:
  ```json
  [
    {
      "id": 1,
      "usuarioId": 5,
      "eventoId": 1,
      "tempoLiquido": "01:45:30",
      "tempoBruto": "01:46:15",
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

#### Obter resultados de um evento específico

- **Endpoint**: `GET /api/v1/resultados-corrida/evento/:eventoId`
- **Descrição**: Retorna todos os resultados de um evento específico
- **Resposta (200 OK)**:
  ```json
  [
    {
      "id": 1,
      "usuarioId": 5,
      "eventoId": 1,
      "tempoLiquido": "01:45:30",
      "posicaoGeral": 120,
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

#### Obter meus resultados

- **Endpoint**: `GET /api/v1/resultados-corrida/usuario/meus-resultados`
- **Descrição**: Retorna todos os resultados do usuário autenticado
- **Autenticação**: JWT Bearer Token necessário
- **Resposta (200 OK)**:
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

#### Validar resultados (para organizadores)

- **Endpoint**: `POST /api/v1/resultados-corrida/validar-resultados`
- **Descrição**: Permite que organizadores validem múltiplos resultados de um evento
- **Autenticação**: JWT Bearer Token necessário (deve ser organizador do evento)
- **Body**:
  ```json
  {
    "eventoId": 1,
    "resultadosIds": [1, 2, 3, 4, 5]
  }
  ```
- **Resposta (200 OK)**:
  ```json
  {
    "message": "5 resultados validados com sucesso"
  }
  ```

#### Atualizar um resultado

- **Endpoint**: `PATCH /api/v1/resultados-corrida/:id`
- **Descrição**: Atualiza um resultado de corrida existente
- **Autenticação**: JWT Bearer Token necessário (deve ser proprietário do resultado, organizador do evento ou admin)
- **Parâmetros Path**:
  - `id`: ID do resultado a ser atualizado
- **Body** (campos opcionais):
  ```json
  {
    "tempoLiquido": "01:44:30",
    "posicaoGeral": 118,
    "posicaoCategoria": 14
  }
  ```
- **Resposta (200 OK)**:
  ```json
  {
    "id": 1,
    "usuarioId": 5,
    "eventoId": 1,
    "tempoLiquido": "01:44:30",
    "tempoBruto": "01:46:15",
    "posicaoGeral": 118,
    "posicaoCategoria": 14
    // outras propriedades
  }
  ```

#### Remover um resultado

- **Endpoint**: `DELETE /api/v1/resultados-corrida/:id`
- **Descrição**: Remove um resultado de corrida
- **Autenticação**: JWT Bearer Token necessário (deve ser proprietário do resultado, organizador do evento ou admin)
- **Parâmetros Path**:
  - `id`: ID do resultado a ser removido
- **Resposta (200 OK)**:
  ```json
  {
    "message": "Resultado removido com sucesso"
  }
  ```

## Módulo de Categorias

O módulo de Categorias gerencia as categorias disponíveis para eventos (tipos de corrida, distâncias, etc).

#### Entidade Categoria

```typescript
// Modelo Prisma
model Categoria {
  id          Int      @id @default(autoincrement()) @map("categoria_id")
  nome        String   @db.VarChar(100)
  descricao   String?  @db.Text
  distancia   Decimal? @db.Decimal(10, 2)
  iconeUrl    String?  @map("icone_url") @db.VarChar(512)

  eventos     EventoCategoria[]

  @@map("categorias")
}
```

### Módulo de Categorias-Eventos

O módulo de Categorias-Eventos gerencia as relações entre eventos e categorias, permitindo associar múltiplas categorias a um evento e múltiplos eventos a uma categoria.

#### Entidade EventoCategoria

```typescript
// Modelo Prisma
model EventoCategoria {
  eventoId    Int @map("evento_id")
  categoriaId Int @map("categoria_id")

  evento    Evento    @relation(fields: [eventoId], references: [id], onDelete: Cascade)
  categoria Categoria @relation(fields: [categoriaId], references: [id], onDelete: Cascade)

  @@id([eventoId, categoriaId])
  @@map("evento_categorias")
}
```

## Endpoints de Categorias-Eventos

### Criar Múltiplas Relações Evento-Categoria

- **Endpoint**: `POST /api/v1/categorias-eventos`
- **Descrição**: Cria múltiplas relações entre eventos e categorias
- **Autenticação**: JWT Bearer Token necessário (nível: ADMIN)
- **Body**:
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
- **Resposta (201 Created)**:
  ```json
  {
    "message": "3 relações evento-categoria criadas com sucesso"
  }
  ```

### Adicionar Categorias a um Evento

- **Endpoint**: `POST /api/v1/categorias-eventos/eventos/:eventoId/categorias`
- **Descrição**: Adiciona múltiplas categorias a um evento específico
- **Autenticação**: JWT Bearer Token necessário (nível: ORGANIZADOR ou superior)
- **Parâmetros Path**:
  - `eventoId`: ID do evento ao qual adicionar categorias
- **Body**:
  ```json
  {
    "categoriaIds": [1, 2, 3]
  }
  ```
- **Resposta (201 Created)**:
  ```json
  {
    "message": "3 categorias adicionadas ao evento Maratona de São Paulo",
    "eventoId": 1,
    "categoriasAdicionadas": 3
  }
  ```

### Adicionar Eventos a uma Categoria

- **Endpoint**: `POST /api/v1/categorias-eventos/categorias/:categoriaId/eventos`
- **Descrição**: Adiciona múltiplos eventos a uma categoria específica
- **Autenticação**: JWT Bearer Token necessário (nível: ADMIN)
- **Parâmetros Path**:
  - `categoriaId`: ID da categoria à qual adicionar eventos
- **Body**:
  ```json
  {
    "eventoIds": [1, 2, 3]
  }
  ```
- **Resposta (201 Created)**:
  ```json
  {
    "message": "3 eventos adicionados à categoria 42km",
    "categoriaId": 1,
    "eventosAdicionados": 3
  }
  ```

### Listar Relações Evento-Categoria

- **Endpoint**: `GET /api/v1/categorias-eventos`
- **Descrição**: Lista todas as relações entre eventos e categorias, com suporte a filtros
- **Permissões**: Público (não requer autenticação)
- **Parâmetros Query**:
  - `eventoId` (opcional): Filtrar por ID do evento
  - `categoriaId` (opcional): Filtrar por ID da categoria
  - `page` (opcional, default: 1): Página atual
  - `limit` (opcional, default: 10): Itens por página
- **Resposta (200 OK)**:
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

- **Endpoint**: `GET /api/v1/categorias-eventos/eventos/:eventoId/categorias`
- **Descrição**: Lista todas as categorias associadas a um evento específico
- **Permissões**: Público (não requer autenticação)
- **Parâmetros Path**:
  - `eventoId`: ID do evento
- **Resposta (200 OK)**:
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
      "descricao": "Meia-maratona",
      "distancia": 21.0975,
      "iconeUrl": "https://exemplo.com/icones/meia-maratona.png"
    }
  ]
  ```

### Listar Eventos de uma Categoria

- **Endpoint**: `GET /api/v1/categorias-eventos/categorias/:categoriaId/eventos`
- **Descrição**: Lista todos os eventos associados a uma categoria específica
- **Permissões**: Público (não requer autenticação)
- **Parâmetros Path**:
  - `categoriaId`: ID da categoria
- **Resposta (200 OK)**:
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

- **Endpoint**: `DELETE /api/v1/categorias-eventos/eventos/:eventoId/categorias/:categoriaId`
- **Descrição**: Remove a associação entre uma categoria específica e um evento
- **Autenticação**: JWT Bearer Token necessário (nível: ORGANIZADOR ou superior)
- **Parâmetros Path**:
  - `eventoId`: ID do evento
  - `categoriaId`: ID da categoria a ser removida do evento
- **Resposta (200 OK)**:
  ```json
  {
    "message": "Categoria 42km removida do evento Maratona de São Paulo",
    "eventoId": 1,
    "categoriaId": 1
  }
  ```

### Remover Todas as Categorias de um Evento

- **Endpoint**: `DELETE /api/v1/categorias-eventos/eventos/:eventoId/categorias`
- **Descrição**: Remove todas as categorias associadas a um evento específico
- **Autenticação**: JWT Bearer Token necessário (nível: ORGANIZADOR ou superior)
- **Parâmetros Path**:
  - `eventoId`: ID do evento
- **Resposta (200 OK)**:
  ```json
  {
    "message": "3 categorias removidas do evento Maratona de São Paulo",
    "eventoId": 1,
    "categoriasRemovidas": 3
  }
  ```

### Remover Todos os Eventos de uma Categoria

- **Endpoint**: `DELETE /api/v1/categorias-eventos/categorias/:categoriaId/eventos`
- **Descrição**: Remove todos os eventos associados a uma categoria específica
- **Autenticação**: JWT Bearer Token necessário (nível: ADMIN)
- **Parâmetros Path**:
  - `categoriaId`: ID da categoria
- **Resposta (200 OK)**:
  ```json
  {
    "message": "2 eventos removidos da categoria 42km",
    "categoriaId": 1,
    "eventosRemovidos": 2
  }
  ```

## Relacionamentos entre Módulos

O sistema implementa várias relações entre os módulos para proporcionar uma experiência integrada:

1. **Evento-Categoria**: Relacionamento muitos-para-muitos que associa categorias (como "42km", "21km") a eventos específicos
2. **Usuário-Evento**: Para inscrições e organizações de eventos
3. **Evento-ResultadoCorrida**: Para registrar resultados de corridas de usuários em eventos específicos

Essas relações permitem implementar funcionalidades como:

- Mostrar todas as corridas de maratona (42km) disponíveis
- Filtrar eventos por categorias específicas
- Permitir que organizadores gerenciem as categorias disponíveis em seus eventos
- Oferecer aos usuários a capacidade de encontrar eventos baseados em suas distâncias preferidas

## Códigos de Erro

Todas as rotas podem retornar os seguintes erros:

- **400 Bad Request**: Dados inválidos ou relação inexistente
