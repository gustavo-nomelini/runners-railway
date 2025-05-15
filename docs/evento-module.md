# Módulo de Eventos (Eventos Module)

O módulo de eventos implementa toda a lógica relacionada à gestão de eventos esportivos, incluindo criação, busca, atualização, exclusão e inscrição de participantes. Esta documentação detalha a arquitetura, componentes e fluxo de dados do módulo.

## Arquitetura

O módulo segue a arquitetura limpa (Clean Architecture) e princípios SOLID, conforme o padrão estabelecido para o projeto. A estrutura é organizada da seguinte forma:

```
src/modules/eventos/
├── evento.module.ts        # Definição do módulo NestJS
├── evento.controller.ts    # Controlador de rotas HTTP
├── evento.service.ts       # Serviço de lógica de negócios
├── evento.repository.ts    # Camada de acesso a dados
├── dtos/                   # Objetos de transferência de dados
│   ├── create-evento.dto.ts
│   ├── update-evento.dto.ts
│   ├── find-eventos.dto.ts
│   └── register-evento.dto.ts
├── interfaces/             # Definições de interfaces
│   ├── evento.interface.ts
│   ├── evento-service.interface.ts
│   └── event-registration.interface.ts
└── exceptions/             # Exceções customizadas
    └── evento.exceptions.ts
```

## Componentes Principais

### Controller (evento.controller.ts)

O controlador é responsável por receber requisições HTTP e retornar respostas apropriadas. Ele delega a lógica de negócios para o serviço.

Endpoints implementados:

- `POST /eventos` - Criação de evento
- `GET /eventos` - Listagem de eventos com filtros e paginação
- `GET /eventos/:id` - Busca de evento por ID
- `PATCH /eventos/:id` - Atualização de evento
- `DELETE /eventos/:id` - Exclusão de evento

### Service (evento.service.ts)

O serviço contém toda a lógica de negócios e regras para operações de eventos, funcionando como uma camada de abstração entre o controlador e o repositório.

Responsabilidades:

- Validação de dados
- Aplicação de regras de negócio
- Coordenação de operações complexas
- Transformação de dados entre DTOs e entidades

### Repository (evento.repository.ts)

O repositório encapsula as operações de acesso ao banco de dados através do Prisma ORM.

Operações implementadas:

- `create`: Criação de evento
- `findAll`: Busca paginada com filtros
- `findById`: Busca por ID
- `update`: Atualização de dados
- `delete`: Remoção de evento

## DTOs (Data Transfer Objects)

### CreateEventoDto

Objeto para criação de eventos com validação de dados:

- Nome do evento (obrigatório)
- Descrição
- Localização
- Coordenadas geográficas (formato JSON)
- Datas (início, fim, prazo de inscrição)
- Capacidade máxima
- Taxa de inscrição
- Modalidade
- IDs das categorias

### FindEventosDto

Parâmetros para filtrar eventos na busca:

- Nome
- Localização
- Período (data início)
- Status
- Modalidade
- Categoria
- Organizador
- Paginação (page, limit)

### UpdateEventoDto

Campos que podem ser atualizados em um evento existente.

### RegisterEventoDto

Objeto para inscrição em evento:

- ID do evento
- Número do atleta
- Status da inscrição (Inscrito, Confirmado, Cancelado, Pendente)
- Observações
- Origem da inscrição

## Interfaces

### EventoResponse / EventoDetailResponse

Interfaces que definem a estrutura de dados para resposta de eventos:

- Dados básicos do evento
- Informações do organizador
- Categorias associadas
- Estatísticas (total de inscritos, comentários, fotos)

### IEventoService

Interface de contrato para o serviço de eventos, define os métodos:

- `create`: Criação de evento
- `findAll`: Busca de eventos com paginação
- `findOne`: Busca de evento por ID
- `update`: Atualização de evento
- `remove`: Remoção de evento

### EventoRegistrationResponse

Interface que define a estrutura de dados para inscrições em eventos.

## Exceções Customizadas

O módulo implementa exceções específicas para melhorar o tratamento de erros:

- `EventoNotFoundException`: Quando um evento não é encontrado
- `EventoForbiddenException`: Quando um usuário não tem permissão para modificar o evento
- `CategoriaNotFoundException`: Quando uma categoria de evento não é encontrada
- `EventoDateInvalidException`: Quando a data do evento é inválida
- `EventoCapacityExceededException`: Quando a capacidade máxima do evento foi atingida

## Fluxo de Dados

1. **Criação de Evento**:

   - Controller recebe os dados via POST
   - Service valida os dados e aplica regras de negócio
   - Repository cria o evento no banco via Prisma
   - Retorna o evento criado

2. **Busca de Eventos**:

   - Controller recebe parâmetros de filtro
   - Service valida e formata os parâmetros
   - Repository busca os eventos no banco com filtros
   - Retorna lista paginada de eventos

3. **Atualização de Evento**:
   - Controller recebe ID e dados para atualização
   - Service verifica permissões e valida dados
   - Repository atualiza o evento no banco
   - Retorna o evento atualizado

## Controle de Permissões

A manipulação de eventos segue as regras de permissão:

- **Criação**: Requer nível de permissão de Organizador (Nível 1) ou superior
- **Atualização/Exclusão**:
  - Organizadores podem modificar apenas seus próprios eventos
  - Administradores podem modificar qualquer evento
- **Visualização**: Aberta para todos os usuários

## Transações

Para operações que exigem consistência entre múltiplas tabelas, como criação de evento com categorias, utilizamos transações do Prisma para garantir a integridade dos dados.
