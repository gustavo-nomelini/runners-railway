# Tratamento de Exceções na API

Este documento descreve as boas práticas de tratamento de exceções implementadas na API Runners, utilizando o framework NestJS.

## Visão Geral

Um tratamento de exceções bem implementado é essencial para:

- Fornecer respostas de erro consistentes e significativas
- Facilitar o debugging de problemas
- Melhorar a segurança da aplicação
- Proporcionar uma melhor experiência para os consumidores da API

## Tipos de Exceções

### Exceções Nativas do NestJS

NestJS fornece várias classes de exceção integradas que estendem a classe `HttpException`:

| Classe de Exceção               | Código HTTP | Descrição                                           |
| ------------------------------- | ----------- | --------------------------------------------------- |
| `BadRequestException`           | 400         | Requisição inválida (validação falhou)              |
| `UnauthorizedException`         | 401         | Usuário não autenticado                             |
| `ForbiddenException`            | 403         | Usuário sem permissão para acessar o recurso        |
| `NotFoundException`             | 404         | Recurso não encontrado                              |
| `ConflictException`             | 409         | Conflito com o estado atual do recurso              |
| `GoneException`                 | 410         | Recurso não está mais disponível                    |
| `PayloadTooLargeException`      | 413         | Payload muito grande                                |
| `UnsupportedMediaTypeException` | 415         | Tipo de mídia não suportado                         |
| `UnprocessableEntityException`  | 422         | Entidade não processável (semanticamente incorreta) |
| `InternalServerErrorException`  | 500         | Erro interno do servidor                            |
| `NotImplementedException`       | 501         | Funcionalidade não implementada                     |
| `BadGatewayException`           | 502         | Bad gateway                                         |
| `ServiceUnavailableException`   | 503         | Serviço indisponível                                |
| `GatewayTimeoutException`       | 504         | Timeout de gateway                                  |

### Exceções Personalizadas

A API implementa exceções personalizadas para fornecer mensagens de erro específicas do domínio.

#### Exceções Relacionadas a Eventos

```typescript
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

export class CategoriaNotFoundException extends NotFoundException {
  constructor(categoriaId: number) {
    super(`Categoria com ID ${categoriaId} não encontrada`);
  }
}

export class EventoDateInvalidException extends BadRequestException {
  constructor() {
    super('A data de início do evento deve ser maior que a data atual');
  }
}

export class EventoCapacityExceededException extends ConflictException {
  constructor() {
    super('A capacidade máxima deste evento já foi atingida');
  }
}
```

#### Exceções Relacionadas a Usuários

```typescript
export class UsuarioNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Usuário com ID ${id} não encontrado`);
  }
}

export class EmailAlreadyExistsException extends ConflictException {
  constructor() {
    super('Email já cadastrado');
  }
}

export class InvalidCredentialsException extends NotFoundException {
  constructor() {
    super('Email ou senha inválidos');
  }
}
```

## Estrutura de Resposta de Erro

Todas as exceções retornam uma estrutura de resposta padronizada:

```json
{
  "statusCode": 404,
  "message": "Evento com ID 123 não encontrado",
  "error": "Not Found",
  "timestamp": "2024-05-17T14:30:45.123Z",
  "path": "/api/v1/eventos/123"
}
```

## Filtro de Exceções Global

Um filtro de exceções global é implementado para capturar todas as exceções não tratadas e formatá-las de maneira consistente:

```typescript
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Erro interno do servidor';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        message = exceptionResponse['message'] || message;
        error = exceptionResponse['error'] || HttpStatus[status];
      } else {
        message = exceptionResponse;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

## Boas Práticas Implementadas

1. **Exceções específicas do domínio**: Criação de exceções customizadas para diferentes situações de negócio.

2. **Mensagens de erro claras**: Mensagens que explicam o problema e, quando possível, como resolvê-lo.

3. **Não exposição de detalhes sensíveis**: Em ambiente de produção, não são expostos stack traces ou detalhes de implementação.

4. **Tratamento de exceções do Prisma**: Mapeamento de erros do Prisma para exceções HTTP apropriadas.

   ```typescript
   try {
     return await this.prisma.evento.create({ data });
   } catch (error) {
     if (error instanceof Prisma.PrismaClientKnownRequestError) {
       if (error.code === 'P2002') {
         throw new ConflictException(
           'Já existe um evento com estas informações',
         );
       }
       if (error.code === 'P2003') {
         throw new BadRequestException(
           'Uma ou mais categorias não foram encontradas',
         );
       }
     }
     throw error;
   }
   ```

5. **Validação de dados**: Uso de class-validator para validação de DTOs, que gera BadRequestException automaticamente.

6. **Logging de exceções**: Registro de exceções não tratadas para monitoramento e debugging.

## Evolução e Manutenção

À medida que o sistema evolui, novas exceções podem ser adicionadas seguindo o padrão estabelecido:

1. Criar uma nova classe de exceção que estenda a classe base apropriada do NestJS
2. Implementar um construtor que forneça uma mensagem de erro clara
3. Documentar a nova exceção e seu uso
4. Utilizar a exceção nos serviços e controladores relevantes
