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
  cpf             String?   @db.VarChar(11) // CPF sem formatação - 11 dígitos
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
  cnpj            String?   @db.VarChar(14) // CNPJ sem formatação - 14 dígitos

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
    "senha": "Senha12345@!",
    "cpf": "123.456.789-00",
    "fotoPerfilUrl": "https://exemplo.com/foto.jpg",
    "biografia": "Minha biografia",
    "cidade": "São Paulo",
    "estado": "SP",
    "pais": "Brasil"
  }
  ```

- **Validações**:

  - **Senha**:
    - Mínimo de 8 caracteres
    - Deve conter pelo menos uma letra minúscula
    - Deve conter pelo menos uma letra maiúscula
    - Deve conter pelo menos um número
    - Deve conter pelo menos um caractere especial (@$!%\*?&#)
    - Regex utilizado: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/`
  - **CPF**:
    - 11 dígitos numéricos
    - Aceita formatos: "12345678900" ou "123.456.789-00"
    - A API automaticamente remove pontos e traços para validação e armazenamento
    - Regex utilizado: `/^(\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2})$/`

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

#### Registro de Organizador

- **Endpoint**: `POST /api/v1/usuarios/organizador`
- **Descrição**: Registra um novo organizador de eventos no sistema
- **Body**:

  ```json
  {
    "nome": "João Silva",
    "email": "joao@empresa.com",
    "senha": "Senha12345@!",
    "fotoPerfilUrl": "https://exemplo.com/foto.jpg",
    "biografia": "Organizador de eventos esportivos",
    "cidade": "São Paulo",
    "estado": "SP",
    "pais": "Brasil",
    "nomeEmpresa": "Empresa de Eventos XYZ",
    "cnpj": "12.345.678/0001-90",
    "site": "https://empresa.com"
  }
  ```

- **Validações**:

  - **Senha**: Mesmas regras do registro normal
  - **CNPJ**:
    - 14 dígitos numéricos
    - Aceita formatos: "12345678000190" ou "12.345.678/0001-90"
    - A API automaticamente remove pontos, barras e traços para validação e armazenamento
    - Regex utilizado: `/^(\d{14}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})$/`

- **Resposta (201 Created)**:
  ```json
  {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@empresa.com",
    "fotoPerfilUrl": "https://exemplo.com/foto.jpg",
    "biografia": "Organizador de eventos esportivos",
    "dataRegistro": "2025-05-08T22:00:00.000Z",
    "nivelPermissao": 1,
    "nomeEmpresa": "Empresa de Eventos XYZ",
    "cnpj": "12345678000190",
    "site": "https://empresa.com"
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
- **401 Unauthorized**: Token ausente ou inválido
- **403 Forbidden**: Acesso negado
- **404 Not Found**: Recurso não encontrado
- **500 Internal Server Error**: Erro inesperado no servidor

## Segurança

### Hash de Senhas

Todas as senhas são processadas com bcrypt antes de serem armazenadas no banco de dados:

```typescript
// Durante a criação do usuário
const hashedPassword = await bcrypt.hash(createUsuarioDto.senha, 10);

// Durante a autenticação
const isPasswordValid = await bcrypt.compare(password, user.senhaHash);
```

### Validação de Formato de Documentos

- **CPF**: A API aceita tanto o formato com pontuação (123.456.789-00) quanto sem (12345678900)

  - Transform: `value.replace(/[^\d]/g, '')` - Remove tudo que não for dígito
  - Armazenamento: Apenas os 11 dígitos numéricos

- **CNPJ**: A API aceita tanto o formato com pontuação (12.345.678/0001-90) quanto sem (12345678000190)
  - Transform: `value.replace(/[^\d]/g, '')` - Remove tudo que não for dígito
  - Armazenamento: Apenas os 14 dígitos numéricos

### Logs de Falhas de Validação

O sistema de logs foi aprimorado para registrar detalhadamente falhas em requisitos de senha:

```typescript
// Exemplo de log de falha na validação de senha
[2024-03-14T10:32:15.789Z] [ERROR] [ValidationPipe] Password validation failed: A senha deve conter pelo menos uma letra minúscula, uma maiúscula, um número e um caractere especial

// Exemplo de log de falha na validação de CPF/CNPJ
[2024-03-14T10:32:15.789Z] [ERROR] [ValidationPipe] Validation failed: CPF deve conter 11 dígitos numéricos, podendo incluir pontos e traço
```

## Validação de Dados

A API implementa validação de dados usando:

- **class-validator**: Para validar propriedades dos DTOs
- **class-transformer**: Para transformação de tipos
- **ValidationPipe**: Para aplicar validações globalmente

Exemplo de DTO com validação de senha e CPF:

```typescript
export class CreateUsuarioDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description:
      'Mínimo 8 caracteres, precisa conter pelo menos uma letra minúscula, uma letra maiúscula, um número e um caractere especial',
    example: 'Senha12345@!',
  })
  @IsString()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
    {
      message:
        'A senha deve conter pelo menos uma letra minúscula, uma maiúscula, um número e um caractere especial',
    },
  )
  senha: string;

  @ApiProperty({
    example: '123.456.789-00',
    description: 'CPF do usuário (com ou sem formatação)',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.replace(/[^\d]/g, ''))
  @Matches(/^(\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2})$/, {
    message:
      'CPF deve conter 11 dígitos numéricos, podendo incluir pontos e traço',
  })
  cpf?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fotoPerfilUrl?: string;

  // Outras propriedades...
}
```

### Exemplo de DTO para Organizador com Validação de CNPJ

```typescript
export class CreateOrganizadorDto extends CreateUsuarioDto {
  @ApiProperty({
    example: '12.345.678/0001-90',
    description: 'CNPJ da empresa (com ou sem formatação)',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.replace(/[^\d]/g, ''))
  @Matches(/^(\d{14}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})$/, {
    message:
      'CNPJ deve conter 14 dígitos numéricos, podendo incluir pontos, barra e traço',
  })
  cnpj: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nomeEmpresa: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  site?: string;
}
```

## Logger

O sistema implementa um logger personalizado para registrar eventos importantes, erros e informações de depuração.

### Níveis de Log Disponíveis

- **verbose()**: Logs detalhados para rastreamento
- **debug()**: Informações úteis para debugging
- **warn()**: Avisos e situações potencialmente problemáticas
- **error()**: Erros e exceções
- **log()**: Informações gerais

### Configuração do Logger

Para utilizar o logger personalizado em um serviço:

```typescript
@Injectable()
export class SeuServico {
  constructor(private readonly logger: CustomLoggerService) {
    this.logger.setContext('SeuServico');
  }

  async seuMetodo() {
    this.logger.log('Operação iniciada');
    // ... lógica do método
    this.logger.debug('Detalhes da operação');
  }
}
```

### Exemplo de Saída de Log

```plaintext
[2024-03-14T10:32:16.123Z] [INFO] [AuthService] Usuário autenticado com sucesso: usuario@example.com
[2024-03-14T10:32:15.789Z] [WARN] [AuthService] Tentativa de login falhou para o email: usuario@example.com
```

### Logs de Segurança

O sistema mantém logs detalhados de eventos de segurança:

- Acessos não autorizados
- Alterações de permissões
- Validação de tokens JWT
- Tentativas de login (sucesso/falha)

### Tratamento de Exceções

O filtro de exceções global foi aprimorado para fornecer logs mais detalhados:

```plaintext
[ERROR] [HttpException] POST /api/v1/auth/login - Status: 401 - Credenciais inválidas
[2024-03-14T10:31:00.456Z] // Timestamp em roxo
```

O middleware de logging registra informações detalhadas sobre cada requisição HTTP:

### Middleware de Logging

- **Níveis de Log Coloridos**:
  - **Timestamps Coloridos**: Cada log começa com um timestamp em roxo em uma nova linha
- **Características do Logger Personalizado**

O sistema de logging foi aprimorado para fornecer melhor visibilidade e rastreamento das operações da API:

- Informações de requisição (método, URL, headers, body)
- Informações de resposta (status, headers, body)
- Tempo de processamento da requisição
- Tratamento de erros com logs detalhados

## Como Testar a API

Para testar a API, importe a coleção de endpoints em um cliente REST como Insomnia ou Postman:

1. Crie um novo usuário com POST `/api/v1/usuarios`
2. Faça login com POST `/api/v1/usuarios/login`
3. Use o token JWT retornado no header `Authorization: Bearer {token}` para acessar endpoints protegidos

## Instalação e Execução

Requisitos:

- npm ou yarn
- PostgreSQL
- Node.js v14 ou superior

Passos:

1. Instale as dependências:

```bash
npm install
```

2. Configure as variáveis de ambiente (.env):

```plaintext
JWT_SECRET="sua_chave_secreta_para_jwt"
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"
```

3. Execute as migrações do Prisma:

```bash
npx prisma migrate dev
```

4. Inicie o servidor de desenvolvimento:

```bash
npm run start:dev
```

## Próximos Passos

Os seguintes recursos estão planejados para implementação futura:

1. Gerenciamento de eventos esportivos
2. Inscrições de usuários em eventos
3. Comentários e fotos de eventos
4. Resultados de corridas
5. Sistema de medalhas
6. Comentários de perfil e sistema social
7. Notificações e estatísticas de usuários

A API inclui documentação interativa Swagger acessível em: `http://localhost:3001/api`

### Segurança de Dados

- Transformação de dados para remoção de campos sensíveis
- Validação para prevenir injeção de SQL via Prisma
- Senhas nunca são retornadas nas respostas da API
