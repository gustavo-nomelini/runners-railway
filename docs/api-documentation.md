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

## Autenticação e Autorização

A API utiliza autenticação baseada em JWT (JSON Web Tokens):

1. O usuário faz login com email e senha
2. A API valida as credenciais e emite um token JWT
3. O cliente deve incluir o token em requisições subsequentes no cabeçalho Authorization:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. Os Guards verificam a validade do token antes de permitir acesso a rotas protegidas

### Proteção de Rotas

Rotas protegidas utilizam o `JwtAuthGuard` para verificar a autenticação:

```typescript
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Patch(':id')
update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
  return this.usuarioService.update(+id, updateUsuarioDto);
}
```

## Validação de Dados

A API implementa validação de dados usando:

- **class-validator**: Para validar propriedades dos DTOs
- **class-transformer**: Para transformação de tipos
- **ValidationPipe**: Para aplicar validações globalmente

Exemplo de DTO com validação:

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

  @ApiProperty()
  @IsString()
  @MinLength(8)
  senha: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fotoPerfilUrl?: string;

  // Outras propriedades...
}
```

## Segurança

### Hash de Senhas

Todas as senhas são processadas com bcrypt antes de serem armazenadas no banco de dados:

```typescript
// Durante a criação do usuário
const hashedPassword = await bcrypt.hash(createUsuarioDto.senha, 10);

// Durante a autenticação
const isPasswordValid = await bcrypt.compare(password, user.senhaHash);
```

### Segurança de Dados

- Senhas nunca são retornadas nas respostas da API
- Validação para prevenir injeção de SQL via Prisma
- Transformação de dados para remoção de campos sensíveis

## Documentação Swagger

A API inclui documentação interativa Swagger acessível em:

```
http://localhost:3001/api
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

## Como Testar a API

### Requisitos

- Node.js v14 ou superior
- PostgreSQL
- npm ou yarn

### Instalação e Execução

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente (.env)
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"
JWT_SECRET="sua_chave_secreta_para_jwt"

# Executar migrações do Prisma
npx prisma migrate dev

# Iniciar servidor de desenvolvimento
npm run start:dev
```

### Testando com Insomnia/Postman

Para testar a API, importe a coleção de endpoints em um cliente REST como Insomnia ou Postman:

1. Crie um novo usuário com POST `/api/v1/usuarios`
2. Faça login com POST `/api/v1/auth/login`
3. Use o token JWT retornado no header `Authorization: Bearer {token}` para acessar endpoints protegidos

## Sistema de Logging Aprimorado

O sistema de logging foi aprimorado para fornecer melhor visibilidade e rastreamento das operações da API:

### Características do Logger Personalizado

- **Timestamps Coloridos**: Cada log começa com um timestamp em roxo em uma nova linha
- **Níveis de Log Coloridos**:
  - `[INFO]` - Verde para operações normais
  - `[ERROR]` - Vermelho em negrito para erros
  - `[WARN]` - Amarelo para avisos
  - `[DEBUG]` - Azul para informações de debug
  - `[VERBOSE]` - Magenta para logs detalhados

### Middleware de Logging

O middleware de logging registra informações detalhadas sobre cada requisição HTTP:

```typescript
// Exemplo de saída do log de requisição
[2024-03-14T10:30:45.123Z] // Timestamp em roxo
GET /api/v1/usuarios/1 200 532b - 45ms - Mozilla/5.0... 192.168.1.1
```

- Método HTTP colorido (GET: azul, POST: verde, etc.)
- Path da requisição em negrito
- Status code colorido baseado na resposta
- Tamanho da resposta em bytes
- Tempo de resposta colorido baseado na performance
- User Agent e IP do cliente

### Tratamento de Exceções

O filtro de exceções global foi aprimorado para fornecer logs mais detalhados:

```typescript
// Exemplo de saída de log de erro
[2024-03-14T10:31:00.456Z] // Timestamp em roxo
[ERROR] [HttpException] POST /api/v1/auth/login - Status: 401 - Credenciais inválidas
```

## Autenticação e Autorização

### Sistema de Autenticação JWT

O sistema de autenticação foi aprimorado com as seguintes características:

#### Validação de Usuário

```typescript
interface UserResponse {
  id: number;
  nome: string;
  email: string;
  nivelPermissao: number;
  fotoPerfilUrl?: string;
  ativo: boolean;
}

interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    nome: string;
    email: string;
    nivelPermissao: number;
    fotoPerfilUrl?: string;
  };
}
```

#### Estratégia JWT

- Validação automática de tokens
- Verificação de usuário ativo
- Atualização automática de última atividade
- Logging detalhado de tentativas de autenticação

```typescript
// Exemplo de configuração JWT
{
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  }
}
```

### Controle de Acesso Baseado em Níveis

O sistema implementa controle de acesso baseado em níveis de permissão:

```typescript
@Roles(NivelPermissao.ADMIN)
@Get('usuarios')
async listarUsuarios() {
  // Apenas usuários com nível ADMIN podem acessar
}
```

### Logs de Segurança

O sistema mantém logs detalhados de eventos de segurança:

- Tentativas de login (sucesso/falha)
- Validação de tokens JWT
- Alterações de permissões
- Acessos não autorizados

```typescript
// Exemplo de log de segurança
[2024-03-14T10:32:15.789Z] [WARN] [AuthService] Tentativa de login falhou para o email: usuario@example.com
[2024-03-14T10:32:16.123Z] [INFO] [AuthService] Usuário autenticado com sucesso: usuario@example.com
```

## Configuração do Logger

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

### Níveis de Log Disponíveis

- **log()**: Informações gerais
- **error()**: Erros e exceções
- **warn()**: Avisos e situações potencialmente problemáticas
- **debug()**: Informações úteis para debugging
- **verbose()**: Logs detalhados para rastreamento
