# Integração Frontend-Backend

Este documento descreve como configurar e integrar o frontend Next.js (cascavel-runners) com o backend NestJS.

## Configuração CORS

Para permitir requisições do frontend, o backend está configurado para aceitar solicitações de origens específicas. O CORS (Cross-Origin Resource Sharing) está configurado no arquivo `main.ts`.

### Verificar/Atualizar configuração CORS

```typescript
// src/main.ts
const app = await NestFactory.create(AppModule);

// Configuração CORS para permitir requisições do frontend
app.enableCors({
  origin: ['http://localhost:3000', 'https://seu-dominio-frontend.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
});

// Definir o prefixo da API
app.setGlobalPrefix('api/v1');
```

## Autenticação e Usuários

### Endpoints Principais

| Método | Endpoint                       | Descrição                      | Payload (exemplo)                                         |
| ------ | ------------------------------ | ------------------------------ | --------------------------------------------------------- |
| POST   | `/api/v1/auth/login`           | Autenticação de usuários       | `{ "email": "email@example.com", "senha": "senha12345" }` |
| POST   | `/api/v1/usuarios`             | Criar usuário padrão (runner)  | Ver documentação abaixo                                   |
| POST   | `/api/v1/usuarios/organizador` | Criar usuário organizador      | Ver documentação abaixo                                   |
| GET    | `/api/v1/usuarios/perfil`      | Obter perfil do usuário logado | Requer token JWT no cabeçalho Authorization               |

### Exemplo de Request Body para Criação de Usuário Runner

```json
{
  "nome": "Nome Completo",
  "email": "usuario@example.com",
  "senha": "senha12345",
  "fotoPerfilUrl": "https://exemplo.com/foto.jpg",
  "biografia": "Biografia do usuário",
  "cidade": "Cascavel",
  "estado": "PR",
  "pais": "Brasil",
  "dataNascimento": "1990-01-01",
  "genero": "Masculino"
}
```

### Exemplo de Request Body para Criação de Organizador

```json
{
  "nome": "Nome do Organizador",
  "email": "organizador@example.com",
  "senha": "senha12345",
  "fotoPerfilUrl": "https://exemplo.com/foto.jpg",
  "biografia": "Organizador de eventos esportivos",
  "cidade": "Cascavel",
  "estado": "PR",
  "pais": "Brasil",
  "nomeEmpresa": "Empresa de Eventos XYZ",
  "cnpj": "12345678901234",
  "site": "https://empresa.com"
}
```

### Autenticação com JWT

O backend utiliza autenticação JWT. Quando um usuário faz login, o servidor retorna um token que deve ser incluído em cada requisição subsequente que necessite de autenticação.

#### Exemplo de Resposta de Login:

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

#### Usando o Token no Frontend:

```typescript
// Exemplo de requisição autenticada no frontend
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:3001/api/v1/usuarios/perfil', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});
```

## Níveis de Permissão

Existem três níveis de permissão no sistema:

1. **Nível 0 (USUARIO)**: Usuário básico

   - Pode visualizar eventos
   - Pode se inscrever em eventos
   - Pode gerenciar seu próprio perfil

2. **Nível 1 (ORGANIZADOR)**: Organizador de eventos

   - Todas as permissões do nível 0
   - Pode criar e gerenciar eventos
   - Pode ver inscritos em seus eventos

3. **Nível 2 (ADMIN)**: Administrador do sistema
   - Acesso total ao sistema

## Resolução de Problemas Comuns

### CORS Issues

Se o frontend estiver enfrentando problemas de CORS, verifique:

1. A origem correta está na lista de origens permitidas no backend
2. A URL da API no frontend está corretamente formatada
3. O método HTTP usado está na lista de métodos permitidos

### Problemas de Autenticação

Se ocorrerem problemas de autenticação:

1. Verifique se o token JWT está sendo armazenado corretamente
2. Confirme que o token está sendo enviado no cabeçalho de autorização
3. Verifique se o token não expirou (padrão: 1 hora)

### URLs e Configuração de Ambiente

- Certifique-se de que o arquivo `.env.local` no frontend tem a URL correta do backend
- O formato da URL deve incluir o prefixo da API: `http://localhost:3001/api/v1/`
- Verifique se a barra (/) no final da URL está presente ou ausente conforme necessário
