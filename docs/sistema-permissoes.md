# Sistema de Permissões

A aplicação de backend de corredores utiliza um sistema de permissões baseado em níveis que permite controlar o acesso a diferentes funcionalidades do sistema. Este documento explica como o sistema de permissões está implementado e como utilizá-lo.

## Níveis de Permissão

O sistema possui três níveis de permissão definidos no enum `NivelPermissao`:

| Nível | Nome        | Descrição                                                    |
| ----- | ----------- | ------------------------------------------------------------ |
| 0     | USUARIO     | Usuário básico que pode visualizar eventos e se inscrever    |
| 1     | ORGANIZADOR | Pode criar e gerenciar seus próprios eventos                 |
| 2     | ADMIN       | Acesso total ao sistema, incluindo gerenciamento de usuários |

## Armazenamento de Permissões

Os níveis de permissão são armazenados na tabela `usuarios` no campo `nivel_permissao`:

```prisma
model Usuario {
  // outros campos...
  nivelPermissao  Int       @default(0) @map("nivel_permissao")
  // outros campos...
}
```

Por padrão, novos usuários recebem o nível 0 (USUARIO).

## Verificação de Permissões

### 1. Em Controllers

Para proteger rotas baseadas em níveis de permissão, use os guards `JwtAuthGuard` e `RolesGuard` em conjunto com o decorador `@Roles`:

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(NivelPermissao.ORGANIZADOR) // Requer nível 1 ou superior
@Post('/eventos')
criarEvento(@Body() createEventoDto: CreateEventoDto, @Request() req) {
  // ...
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(NivelPermissao.ADMIN) // Requer nível 2
@Patch('/usuarios/:id/permissao')
atualizarPermissao(@Param('id') id: number, @Body() data) {
  // ...
}
```

### 2. Em Services

Nos serviços, você pode verificar as permissões manualmente, tipicamente ao atualizar ou remover recursos que pertencem a um usuário específico:

```typescript
async atualizar(id: number, userId: number, nivelPermissao: number, updateDto) {
  // Verifica se o recurso existe
  const recurso = await this.findById(id);

  // Verifica permissões:
  // 1. O usuário é administrador (nível 2) OU
  // 2. O usuário é o proprietário do recurso
  const isAdmin = nivelPermissao >= NivelPermissao.ADMIN;
  const isOwner = recurso.proprietarioId === userId;

  if (!isAdmin && !isOwner) {
    throw new ForbiddenException('Você não tem permissão para esta operação');
  }

  // Continua com a operação...
}
```

## Como Gerenciar Permissões

### Promover Usuário

Apenas administradores (nível 2) podem alterar o nível de permissão de outros usuários:

```http
PATCH /api/v1/usuarios/:id/permissao
```

**Body**:

```json
{
  "nivelPermissao": 1
}
```

### Verificar Seu Próprio Nível

Qualquer usuário autenticado pode verificar seu próprio nível de permissão:

```http
GET /api/v1/usuarios/perfil
```

A resposta incluirá o campo `nivelPermissao` (número) e `roleName` (string descritiva).

## Fluxo de Autenticação e Permissões

1. O usuário faz login e recebe um token JWT que inclui seu nível de permissão
2. O frontend pode usar esse nível para mostrar/esconder recursos na interface
3. Nas requisições subsequentes, o token é enviado e o `JwtAuthGuard` extrai o nível de permissão
4. O `RolesGuard` verifica se o nível extraído é suficiente para a operação solicitada

## Implementação Técnica

### 1. Definição do Enum

```typescript
// src/core/enums/nivel-permissao.enum.ts
export enum NivelPermissao {
  USUARIO = 0,
  ORGANIZADOR = 1,
  ADMIN = 2,
}
```

### 2. Guarda de Roles

```typescript
// src/core/guards/roles.guard.ts
// Interface para tipagem do usuário
interface JwtUser {
  id: number;
  email: string;
  nivelPermissao: NivelPermissao;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<NivelPermissao[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Se não há roles definidos, permite o acesso
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Obtém o usuário da requisição com tipagem segura
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtUser;

    // Certifica-se de que o usuário existe e tem nivelPermissao
    if (!user || user.nivelPermissao === undefined) {
      return false;
    }

    // Verifica se o usuário tem o nível mínimo necessário
    return requiredRoles.some((role) => user.nivelPermissao >= role);
  }
}
```

### 3. Decorador de Roles

```typescript
// src/core/guards/roles.guard.ts
export const ROLES_KEY = 'roles';
export const Roles = (...roles: NivelPermissao[]) =>
  SetMetadata(ROLES_KEY, roles);
```

## Melhores Práticas

1. Use sempre o enum `NivelPermissao` ao invés de valores literais para melhor legibilidade
2. Implemente verificações de permissão tanto no frontend quanto no backend
3. Verifique a propriedade em recursos que possam pertencer a diferentes usuários
4. Documente claramente quais operações exigem quais níveis de permissão
5. Use o método `>=` para verificar níveis mínimos (ex: se requer nível 1, níveis 1 e 2 devem passar)
