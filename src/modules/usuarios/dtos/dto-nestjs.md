# Data Transfer Objects (DTOs) in NestJS

## What are DTOs?

Data Transfer Objects (DTOs) are objects that define how data will be sent over the network. They're used to encapsulate data and ensure consistency between client and server communications.

## Why use DTOs?

- **Type safety**: Ensures data shape is consistent
- **Validation**: When combined with libraries like class-validator
- **Documentation**: Self-documenting through TypeScript types and Swagger annotations
- **Code organization**: Separates data models from business logic

## Common DTO Patterns in NestJS

### Create DTOs

Create DTOs define all required fields needed to create a new resource:

```typescript
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

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

  // Other optional fields...
}
```

### Update DTOs

Update DTOs typically make all fields optional, since updates often only modify a subset of fields:

```typescript
import { PartialType } from '@nestjs/swagger';
import { CreateUsuarioDto } from './create-usuario.dto';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {}
```

This elegant pattern uses `PartialType()` from `@nestjs/swagger` to:

1. Inherit all properties from the Create DTO
2. Make all properties optional (adding `?` to each)
3. Maintain all validation rules and Swagger documentation

### Response DTOs

Sometimes you may want specific DTOs for responses that exclude sensitive data:

```typescript
import { OmitType } from '@nestjs/swagger';
import { CreateUsuarioDto } from './create-usuario.dto';

export class UsuarioResponseDto extends OmitType(CreateUsuarioDto, ['senha']) {}
```

## Advanced DTO Utilities

NestJS and @nestjs/swagger provide useful type utilities:

- **PartialType**: Makes all properties optional (for updates)
- **OmitType**: Removes specific properties from a DTO
- **PickType**: Creates a new type with only specified properties
- **IntersectionType**: Combines multiple DTOs

## Best Practices

1. **Keep DTOs in dedicated files** within module directories
2. **Use decorators for validation** (class-validator) and documentation (Swagger)
3. **Implement consistent naming conventions** (CreateEntityDto, UpdateEntityDto)
4. **Use type utilities** to avoid duplication
5. **Keep DTOs focused** on specific use cases

## Validation with DTOs

DTOs become powerful when combined with validation pipes:

```typescript
// In your controller
@Post()
async create(@Body() createUsuarioDto: CreateUsuarioDto) {
  return this.usuariosService.create(createUsuarioDto);
}
```

With global ValidationPipe configured (in main.ts):

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true, // Strip properties not in DTO
    transform: true, // Transform payloads to DTO instances
    forbidNonWhitelisted: true, // Throw error on unexpected properties
  }),
);
```
