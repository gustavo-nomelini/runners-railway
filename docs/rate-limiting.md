# Rate Limiting Implementation

## Overview

This document describes the rate limiting implementation in our NestJS application, which provides protection against DoS attacks and API abuse through multiple layers of rate limiting.

## Implementation Details

### 1. Global Rate Limiting

The application implements a global rate limiting system using `@nestjs/throttler` with three different tiers:

#### Rate Limit Tiers

- **Short-term (1 second)**

  - Production: 3 requests/second
  - Development: 10 requests/second

- **Medium-term (10 seconds)**

  - Production: 20 requests/10 seconds
  - Development: 50 requests/10 seconds

- **Long-term (1 minute)**
  - Production: 100 requests/minute
  - Development: 300 requests/minute

### 2. Granular Throttling Decorators

The application provides several decorators for fine-grained control over rate limiting:

#### Available Decorators

1. **SkipThrottle**

   - Completely bypasses rate limiting
   - Use for internal endpoints or routes that should not be rate-limited

2. **ThrottleAuth**

   - For sensitive actions (login, registration, password changes)
   - Limits to 3 attempts per second
   - Prevents brute force attacks

3. **ThrottleDefault**

   - Standard protection for most endpoints
   - 10 requests per 5 seconds
   - Balanced for normal usage with moderate protection

4. **ThrottleStrict**

   - Extra restrictive protection
   - 2 requests per second
   - Use for critical endpoints needing extra spam/abuse protection

5. **ThrottleWrite**

   - For write operations (POST, PUT, DELETE)
   - 5 requests per 10 seconds
   - Prevents abuse while allowing normal usage

6. **ThrottleRead**

   - For read operations (GET)
   - 50 requests per 10 seconds
   - Allows higher volume for read operations

7. **ThrottlePublic**
   - For public endpoints without authentication
   - 30 requests per minute
   - More permissive but still provides DoS protection

### 3. Excluded Routes

The following routes are automatically excluded from rate limiting:

- Health check endpoints (`/health`)
- API documentation endpoints (`/api-docs`)

## Usage Examples

### Basic Usage

```typescript
@Controller('auth')
export class AuthController {
  @Post('login')
  @ThrottleAuth()
  async login() {
    // Login logic
  }
}
```

### Skipping Rate Limiting

```typescript
@Controller('internal')
export class InternalController {
  @Get('status')
  @SkipThrottle()
  async getStatus() {
    // Internal status check
  }
}
```

### Public Endpoint

```typescript
@Controller('public')
export class PublicController {
  @Get('info')
  @ThrottlePublic()
  async getPublicInfo() {
    // Public information
  }
}
```

## Environment-Specific Behavior

The rate limiting system automatically adjusts its limits based on the environment:

- Production: Stricter limits for better security
- Development: More permissive limits for easier testing and development

## Best Practices

1. Use `ThrottleAuth` for all authentication-related endpoints
2. Apply `ThrottleStrict` to endpoints handling sensitive data
3. Use `ThrottleWrite` for all write operations
4. Apply `ThrottleRead` to GET endpoints
5. Use `ThrottlePublic` for public-facing endpoints
6. Only use `SkipThrottle` for internal endpoints that must bypass rate limiting

## Implementation Status

### Applied Throttling Decorators

#### AppController

- `GET /` - `@ThrottlePublic()`

#### UsuarioController

- `POST /` - `@ThrottleDefault()`
- `POST /organizador` - `@ThrottleDefault()`
- `GET /` - `@ThrottlePublic()`
- `GET /:id` - `@ThrottlePublic()`
- `PATCH /:id` - `@ThrottleAuth()`
- `GET /perfil` - `@ThrottleAuth()`

#### UsuarioEventoController

- `POST /` - `@ThrottleWrite()`
- `GET /` - `@ThrottleRead()`
- `GET /minhas-inscricoes` - `@ThrottleRead()`
- `GET /evento/:eventoId/usuario/:usuarioId` - `@ThrottleRead()`
- `GET /minha-inscricao/:eventoId` - `@ThrottleRead()`
- `PATCH /evento/:eventoId/usuario/:usuarioId` - `@ThrottleWrite()`
- `PATCH /minha-inscricao/:eventoId` - `@ThrottleWrite()`
- `DELETE /evento/:eventoId/usuario/:usuarioId` - `@ThrottleWrite()`
- `DELETE /minha-inscricao/:eventoId` - `@ThrottleWrite()`

#### EventoController

- `POST /` - `@ThrottleWrite()`
- `GET /` - `@ThrottlePublic()`
- `GET /:id` - `@ThrottlePublic()`
- `PATCH /:id` - `@ThrottleWrite()`
- `DELETE /:id` - `@ThrottleWrite()`

#### AuthController

- `POST /login` - `@ThrottleStrict()`

#### HealthController

- `GET /health` - Excluded via `skipIf()` configuration in ThrottlerModule
