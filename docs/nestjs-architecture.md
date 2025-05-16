# NestJS Backend Implementation Guide - Runners App

## Table of Contents

1. [Introduction](#introduction)
2. [Database Schema](#database-schema)
3. [NestJS Architecture Concepts](#nestjs-architecture-concepts)
   - [Module](#module-módulo)
   - [Controller](#controller-controlador)
   - [Service](#service-serviço)
   - [DTOs](#dtos-data-transfer-objects)
   - [Entity](#entity-entidade)
   - [Guard](#guard-guarda)
   - [Pipe](#pipe)
   - [Middleware](#middleware)
   - [Interceptor](#interceptor)
   - [Exception Filter](#exception-filter)
   - [Provider](#provider)
   - [Repository Pattern](#repository-pattern)
4. [Project Structure](#project-structure)
5. [Implementation Order](#implementation-order)
6. [Module Implementation Guide](#module-implementation-guide)
7. [Code Examples](#code-examples)
8. [Best Practices](#best-practices)
9. [Deployment and Scalability](#deployment-and-scalability)
10. [Conclusion](#conclusion)

## Introduction

This document serves as a comprehensive guide for implementing the **Runners** application backend using NestJS, Prisma ORM, and PostgreSQL. It combines architectural concepts, project structure recommendations, and practical implementation steps based on the defined database schema.

The Runners application is designed to manage sports events, user registrations, social interactions, and track race results for athletes. This guide will help you understand how to structure your NestJS application and implement the necessary features in a logical order.

## Database Schema

The database schema defines the following main entities and their relationships:

- **Usuario (User)**: Core user entity with authentication details, profile information
- **Evento (Event)**: Sports events with details, location, and capacity
- **UsuarioEvento (UserEvent)**: Registration of users for events
- **FotoEvento (EventPhoto)**: Photos uploaded for events
- **ComentarioEvento (EventComment)**: Comments on events
- **ResultadoCorrida (RaceResult)**: Race results for users in events
- **MedalhaUsuario (UserMedal)**: Medals awarded to users
- **ComentarioPerfil (ProfileComment)**: Comments on user profiles
- **Seguidor (Follower)**: User following relationships
- **Notificacao (Notification)**: User notifications
- **EstatisticaUsuario (UserStatistics)**: Aggregated user statistics
- **Categoria (Category)**: Event categories
- **EventoCategoria (EventCategory)**: Mapping between events and categories

## NestJS Architecture Concepts

### Module (Módulo)

A module is a code organizer that groups related components. Every NestJS application has at least one module, the `AppModule` (root module).

**Main characteristics:**

- Decorated with `@Module({})`
- Defines the organizational context for controllers, providers and other modules
- Facilitates the use of metadata to organize the application structure
- Enables code modularization and reuse

**Example:**

```typescript
@Module({
  imports: [DatabaseModule, UsuarioModule],
  controllers: [EventoController],
  providers: [EventoService],
  exports: [EventoService],
})
export class EventoModule {}
```

### Controller (Controlador)

Controllers are responsible for receiving HTTP requests and returning responses. They define the API Routes and Endpoints.

**Main characteristics:**

- Decorated with `@Controller('prefix')`
- Handles specific HTTP requests using decorators like @Get(), @Post()
- Delegates business logic to services
- Defines input/output data transformations

**Example:**

```typescript
@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get()
  findAll() {
    return this.usuarioService.findAll();
  }

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }
}
```

### Service (Serviço)

Services encapsulate business logic and complex operations. They are injected into controllers or other services.

**Main characteristics:**

- Decorated with `@Injectable()`
- Implements business logic
- Interacts with repositories/databases
- Provides methods that can be used by controllers or other services

**Example:**

```typescript
@Injectable()
export class UsuarioService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.usuario.findMany();
  }

  async create(data: CreateUsuarioDto) {
    return this.prisma.usuario.create({ data });
  }
}
```

### DTOs (Data Transfer Objects)

DTOs are objects that define how data will be transferred between application layers.

**Main characteristics:**

- Simple classes that define data structure
- Used for input validation with class-validator
- Improve API documentation with Swagger
- Promote clear interface contracts

**Example:**

```typescript
export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  senha: string;
}
```

### Entity (Entidade)

Entities represent domain objects and usually reflect database tables.

**Main characteristics:**

- Each entity instance is a row (record) in the table
- Entity properties are table columns
- Entities are used for data persistence and queries

**ORM: Prisma vs TypeORM**

- With Prisma, models are defined directly in the schema.prisma file

_Prisma example:_

```typescript
// user.service.ts
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany();
  }
}
```

### Guard (Guarda)

Guards determine whether a request should be processed by the route handler or not.

**Main characteristics:**

- Implements the `CanActivate` interface
- Returns a boolean determining whether the request continues or not
- Mainly used for authentication and authorization

**Example:**

```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}
```

### Pipe

Pipes are used for data transformation and validation.

**Main characteristics:**

- Transform input data
- Validate input data
- Throw exceptions when data is invalid
- Can be global, controller-scoped, or parameter-specific

**Example:**

```typescript
@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Valor deve ser um número');
    }
    return val;
  }
}
```

### Middleware

Middlewares are functions that have access to request and response objects.

**Main characteristics:**

- Executed before route handlers
- Can modify requests and responses
- Can end the request-response cycle
- Can call the `next()` function to pass to the next middleware

**Example:**

```typescript
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    console.log('Request...');
    next();
  }
}
```

### Interceptor

Interceptors are used to add extra functionality to route handlers.

**Main characteristics:**

- Can manipulate the response before it's sent
- Can manipulate the request before it reaches the handler
- Can be used for logging, data transformation, caching, etc.

**Example:**

```typescript
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(map((data) => ({ data, timestamp: new Date().toISOString() })));
  }
}
```

### Exception Filter

Exception filters handle exceptions thrown during request processing.

**Main characteristics:**

- Capture specific exceptions
- Format error responses
- Can help with error logging
- Improve error handling experience

**Example:**

```typescript
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
  }
}
```

### Provider

Providers are classes decorated with `@Injectable()` that can be injected into controllers and other providers.

**Main characteristics:**

- Can be services, repositories, factories, helpers, etc.
- Are the main mechanism for dependency injection
- Can have application, request, or transient scope
- Promote testable and decoupled code

```typescript
@Injectable()
export class ConfigService {
  private readonly envConfig: Record<string, string>;

  constructor() {
    this.envConfig = process.env;
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
```

### Repository Pattern

O padrão Repository adiciona uma camada de abstração entre o serviço e a fonte de dados (ORM Prisma). Ele encapsula a lógica de acesso a dados e fornece uma API consistente para o serviço.

**Principais características:**

- Isola a lógica de acesso a dados
- Facilita a substituição da fonte de dados (por exemplo, para testes)
- Melhora a testabilidade do código
- Centraliza operações CRUD e queries complexas

**Implementação com Prisma:**

```typescript
@Injectable()
export class EventoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    where: Prisma.EventoWhereInput,
    skip: number,
    take: number,
  ): Promise<Evento[]> {
    return this.prisma.evento.findMany({
      where,
      skip,
      take,
      include: {
        organizador: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    });
  }

  async findById(id: number): Promise<Evento | null> {
    return this.prisma.evento.findUnique({
      where: { id },
      include: {
        organizador: true,
        categorias: {
          include: {
            categoria: true,
          },
        },
      },
    });
  }

  async create(data: Prisma.EventoCreateInput): Promise<Evento> {
    return this.prisma.evento.create({
      data,
      include: {
        organizador: true,
      },
    });
  }
}
```

**Uso no Service:**

```typescript
@Injectable()
export class EventoService {
  constructor(private readonly eventoRepository: EventoRepository) {}

  async findAll(query: FindEventosDto): Promise<EventoPaginationResponse> {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    // Construir o objeto de filtro
    const where = this.buildWhereClause(query);

    // Obter dados do repositório
    const [eventos, total] = await Promise.all([
      this.eventoRepository.findAll(where, skip, limit),
      this.eventoRepository.count(where),
    ]);

    return {
      data: eventos,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
```

### Custom Exceptions

Exceções personalizadas melhoram a legibilidade do código e fornecem respostas de erro mais específicas e consistentes.

**Principais características:**

- Estendem as classes base de exceção do NestJS
- Fornecem mensagens de erro específicas do domínio
- Facilitam o tratamento de erros no nível do filtro de exceções
- Melhoram a documentação API com códigos de erro específicos

**Exemplo de implementação:**

```typescript
// eventos/exceptions/evento.exceptions.ts
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

export class EventoNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Evento com ID ${id} não encontrado`);
  }
}

export class EventoForbiddenException extends ForbiddenException {
  constructor() {
    super('Você não tem permissão para modificar este evento');
  }
}

export class EventoDateInvalidException extends BadRequestException {
  constructor() {
    super('A data de início do evento deve ser maior que a data atual');
  }
}
```

**Uso no Service:**

```typescript
@Injectable()
export class EventoService {
  async findOne(id: number): Promise<EventoDetailResponse> {
    const evento = await this.eventoRepository.findById(id);

    if (!evento) {
      throw new EventoNotFoundException(id);
    }

    return evento;
  }

  async update(
    id: number,
    userId: number,
    dto: UpdateEventoDto,
  ): Promise<EventoDetailResponse> {
    const evento = await this.eventoRepository.findById(id);

    if (!evento) {
      throw new EventoNotFoundException(id);
    }

    if (evento.organizadorId !== userId) {
      throw new EventoForbiddenException();
    }

    // Validação de data
    if (dto.dataInicio && new Date(dto.dataInicio) <= new Date()) {
      throw new EventoDateInvalidException();
    }

    return this.eventoRepository.update(id, dto);
  }
}
```

## Project Structure

The recommended project structure follows a domain-driven organization:

```
src/
├── app.module.ts           # Main application module
├── main.ts                 # Application entry point
├── core/                   # Global modules (auth, exceptions, logging, etc.)
│   ├── auth/               # Authentication and authorization
│   ├── filters/            # Global exception filters
│   ├── guards/             # Global security guards
│   └── middlewares/        # Global middlewares
├── shared/                 # Reusable resources (helpers, utils, common DTOs)
│   ├── dtos/               # Shared DTOs
│   ├── constants/          # Global constants
│   └── prisma/             # Prisma service and configurations
├── modules/                # Domain modules
│   ├── usuarios/           # User module
│   │   ├── usuario.module.ts
│   │   ├── usuario.controller.ts
│   │   ├── usuario.service.ts
│   │   ├── dtos/           # Module-specific DTOs
│   │   └── entities/       # Module-specific entities
│   ├── eventos/
│   ├── usuario-eventos/
│   ├── fotos-eventos/
│   ├── comentarios-eventos/
│   ├── resultados-corrida/
│   ├── medalhas/
│   ├── comentarios-perfil/
│   ├── seguidores/
│   ├── notificacoes/
│   ├── estatisticas/
│   └── categorias-eventos/
└── prisma/
    └── schema.prisma       # Database schema
```

## Implementation Order

### 1. Initial Setup

- [x] Create project with `nest new runners-api`
- [x] Configure Prisma (`@nestjs/prisma`) and generate `schema.prisma`
- [x] Create entities in Prisma based on SQL tables
- [x] Connect to PostgreSQL database (locally for Dev)
- [x] Connect to PostgreSQL database (AWS RDS for Prod)

### 2. User Module (`usuarios`)

- [x] User CRUD operations
- [x] Password hashing with `bcrypt`
- [x] JWT authentication (auth module)
- [x] Global filters and validated DTOs with `class-validator`

### 3. Event Module (`eventos`)

- [x] Create events, query by filters (status, location, etc.)
- [x] Use `POINT` for coordinates (see Prisma extensions with raw SQL)
- [x] Associate event with organizer

### 4. Event Registration Module (`usuario-eventos`)

- [x] Allow users to register for events
- [x] Check duplication rules (unique key)
- [x] Control status (`Registered`, `Canceled`, etc.)

### 5. Event Photos and Comments Module

- [ ] Image upload and URL
- [ ] Comment on events and reply to comments
- [ ] Reactions in JSONB

### 6. Race Results Module

- [ ] Register results by event
- [ ] Validate data and calculate positions
- [ ] Store time as `INTERVAL`

### 7. Medals Module

- [ ] Assignment logic based on business rules
- [ ] Optional connection with event
- [ ] Show in profile if `exibir_perfil = true`

### 8. Profile Comments and Social System

- [ ] Public/private comments on profiles
- [ ] Implement `followers` and `following`
- [ ] Avoid duplicate follow (composite PK)

### 9. Notifications and Statistics

- [ ] Create automatic notifications by trigger or service
- [ ] Aggregated statistics by user
- [ ] Automated calculation of streaks and records

## Module Implementation Guide

For each domain module, follow these steps:

1. **Create the module structure**:

   ```
   modules/
   └── [module-name]/
       ├── [module-name].module.ts
       ├── [module-name].controller.ts
       ├── [module-name].service.ts
       ├── dtos/
       │   ├── create-[entity].dto.ts
       │   └── update-[entity].dto.ts
       └── entities/
           └── [entity].entity.ts
   ```

2. **Define DTOs**:

   - Create DTOs for input validation and output transformation
   - Use class-validator decorators for validation

3. **Implement Service**:

   - Inject PrismaService
   - Implement CRUD operations
   - Add business logic

4. **Create Controller**:

   - Define routes and HTTP methods
   - Inject corresponding service
   - Use DTOs for request validation
   - Apply guards for authorization

5. **Register in Module**:
   - Import dependencies
   - Register controllers and providers
   - Export services if needed by other modules

## Code Examples

### App Module Configuration

```typescript
// app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsuarioModule,
    EventoModule,
    UsuarioEventoModule,
    FotosEventoModule,
    ComentariosEventoModule,
    ResultadosCorridaModule,
    MedalhasModule,
    ComentariosPerfilModule,
    SeguidoresModule,
    NotificacoesModule,
    EstatisticasModule,
    CategoriasEventosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
```

### Main Entry Point

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe configuration
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Sports Events API')
    .setDescription('API for managing sports events and social interactions')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // CORS configuration
  app.enableCors();

  // Global API prefix with versioning
  app.setGlobalPrefix('api/v1');

  await app.listen(3001); // Use different port from frontend
}
bootstrap();
```

### Example User Module Implementation

```typescript
// usuarios/usuario.module.ts
@Module({
  imports: [PrismaModule],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [UsuarioService],
})
export class UsuarioModule {}
```

```typescript
// usuarios/dtos/create-usuario.dto.ts
export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  senha: string;

  @IsOptional()
  @IsString()
  fotoPerfilUrl?: string;

  @IsOptional()
  @IsString()
  biografia?: string;

  @IsOptional()
  @IsString()
  cidade?: string;

  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsString()
  pais?: string;

  @IsOptional()
  @IsDateString()
  dataNascimento?: string;

  @IsOptional()
  @IsString()
  genero?: string;
}
```

```typescript
// usuarios/usuario.service.ts
@Injectable()
export class UsuarioService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        fotoPerfilUrl: true,
        biografia: true,
        dataRegistro: true,
        ultimaAtividade: true,
        cidade: true,
        estado: true,
        pais: true,
        // Exclude sensitive data like senhaHash
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        fotoPerfilUrl: true,
        biografia: true,
        dataRegistro: true,
        ultimaAtividade: true,
        cidade: true,
        estado: true,
        pais: true,
      },
    });
  }

  async create(data: CreateUsuarioDto) {
    const hashedPassword = await bcrypt.hash(data.senha, 10);

    return this.prisma.usuario.create({
      data: {
        ...data,
        senhaHash: hashedPassword,
      },
      select: {
        id: true,
        nome: true,
        email: true,
      },
    });
  }

  async update(id: number, data: UpdateUsuarioDto) {
    if (data.senha) {
      data.senhaHash = await bcrypt.hash(data.senha, 10);
      delete data.senha; // Remove plain text password
    }

    return this.prisma.usuario.update({
      where: { id },
      data,
      select: {
        id: true,
        nome: true,
        email: true,
        fotoPerfilUrl: true,
        biografia: true,
        ultimaAtividade: true,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.usuario.delete({
      where: { id },
    });
  }
}
```

```typescript
// usuarios/usuario.controller.ts
@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get()
  findAll() {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usuarioService.findOne(id);
  }

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @Request() req,
  ) {
    // Check if user is updating their own profile
    if (req.user.id !== id) {
      throw new UnauthorizedException('You can only update your own profile');
    }
    return this.usuarioService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    // Check if user is deleting their own account or is admin
    if (req.user.id !== id && req.user.nivelPermissao < 2) {
      throw new UnauthorizedException('Not authorized to delete this user');
    }
    return this.usuarioService.remove(id);
  }
}
```

## Best Practices

### Domain-Driven Organization

Organize modules by business domain (such as `usuarios`, `eventos`, etc.) rather than by file type (controllers, services).

### Single Responsibility Principle

Each file should have a single responsibility.
Avoid giant services with multiple responsibilities.

### Consistent Naming

Follow a consistent naming pattern:

- `*.module.ts` for modules
- `*.controller.ts` for controllers
- `*.service.ts` for services
- `*.dto.ts` for DTOs
- `*.entity.ts` for entities

### Unidirectional Dependencies

Maintain dependencies in one direction:

- Controllers depend on services
- Services may depend on other services or repositories
- Avoid dependency cycles

### Centralization of Cross-Cutting Concerns

Features that span multiple modules (such as authentication, logging) should be in the `core/` directory.

### Modularization

Divide the application into independent modules that can be developed, tested, and maintained separately.

### Data Validation

Always validate input data using class-validator decorators in DTOs.

### Error Handling

Use exception filters for consistent error responses across the application.

### Authentication and Authorization

Implement proper authentication with JWT and role-based authorization using guards.

### Dependency Injection

Leverage NestJS's dependency injection system for loosely coupled and testable components.

## Deployment and Scalability

- Deploy via Docker + PostgreSQL
- Use Prisma Migrate for schema versioning
- Implement monitoring with AWS logs and metrics
- Consider partitioning strategy for large tables:
  - comments, notifications, and results

## Conclusion

This architecture facilitates the modular, testable, and scalable development of the Runners backend NestJS application. The suggested order focuses on the main entities and the most critical relationships.

By following the NestJS principles and the structure outlined in this document, you can create a robust backend that can easily grow and adapt to new requirements. The clear separation of concerns and the modular approach will help maintain code quality as the application evolves.

Remember to follow the SOLID principles, clean architecture patterns, and test-driven development practices to ensure a maintainable codebase.

### Key Concepts to Remember

- **Modules** organize related components
- **Controllers** handle HTTP requests and define API endpoints
- **Services** contain business logic
- **DTOs** validate input and define data structures
- **Repositories** abstract database operations
- **Guards** handle authorization
- **Pipes** validate and transform input data
- **Filters** handle exceptions
- **Middleware** processes requests before handlers
- **Interceptors** add functionality before and after request processing

### Data Flow in a NestJS Application

The typical flow of a request in a NestJS application follows this path:

1. Client makes an HTTP request
2. Middleware processes the request (logger, cors, etc.)
3. Guards verify if the request can proceed (authentication)
4. Interceptors pre-process the request
5. Pipes validate and transform parameters
6. Controller receives the request and calls the appropriate service
7. Service executes business logic
8. Repository interacts with the database
9. Service processes the repository result
10. Controller formats the response
11. Interceptors post-process the response
12. Exception filters handle any errors
13. Response is sent to the client
