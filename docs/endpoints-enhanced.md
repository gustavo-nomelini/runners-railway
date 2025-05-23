# Backend Runners API Documentation

This document provides details for all available API endpoints, including required and optional fields based on the database schema.

## Table of Contents

- [Permission Levels](#permission-levels)
- [Error Codes](#error-codes)
- [Authentication](#authentication)
- [Users](#users)
- [Events](#events)
- [Event Registration](#event-registration)
- [Photos](#photos)
- [Comments](#comments)
- [Race Results](#race-results)
- [Medals](#medals)
- [Followers](#followers)
- [Notifications](#notifications)
- [Statistics](#statistics)
- [Categories](#categories)

## Permission Levels

The system has the following permission levels:

- **Level 0 (USUARIO)**: Basic user

  - Can view events
  - Can register for events
  - Can manage their own profile
  - Can view their own registrations

- **Level 1 (ORGANIZADOR)**: Event organizer

  - All permissions from level 0
  - Can create events
  - Can manage their own events
  - Can view registrations for their events

- **Level 2 (ADMIN)**: System administrator
  - All permissions from levels 0 and 1
  - Can manage all users
  - Can manage all events
  - Can change permission levels
  - Can view all registrations

## Error Codes

All routes may return the following errors:

- **400 Bad Request**: Invalid or malformed data
- **401 Unauthorized**: Missing or invalid token
- **403 Forbidden**: No permission to access the resource
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

## Authentication

### Register

**POST** `/auth/register`

Create a new user account.

**Request Body**:

| Field           | Type   | Required | Description                                  |
| --------------- | ------ | -------- | -------------------------------------------- |
| nome            | string | ✅       | User's full name (max 100 chars)             |
| email           | string | ✅       | User's email (max 255 chars, must be unique) |
| senha           | string | ✅       | User's password (will be hashed)             |
| foto_perfil_url | string | ❌       | URL to profile photo                         |
| biografia       | string | ❌       | User biography                               |
| cidade          | string | ❌       | User's city (max 100 chars)                  |
| estado          | string | ❌       | User's state (max 50 chars)                  |
| pais            | string | ❌       | User's country (max 50 chars)                |
| data_nascimento | date   | ❌       | User's date of birth (YYYY-MM-DD)            |
| genero          | string | ❌       | User's gender (max 30 chars)                 |
| preferencias    | object | ❌       | User preferences (JSON object)               |
| nome_empresa    | string | ❌       | Company name                                 |
| cnpj            | string | ❌       | Company CNPJ                                 |
| site            | string | ❌       | Website URL                                  |

**Password Requirements**:

- Minimum 8 characters
- At least one lowercase letter
- At least one uppercase letter
- At least one number
- At least one special character (@$!%\*?&#)

**Response**: 201 Created

```json
{
  "usuario_id": 1,
  "nome": "João Silva",
  "email": "joao@example.com",
  "token": "jwt-token-here"
}
```

### Register Organizer

**POST** `/auth/register/organizer`

Create a new organizer account.

**Request Body**:

| Field           | Type   | Required | Description                                  |
| --------------- | ------ | -------- | -------------------------------------------- |
| nome            | string | ✅       | User's full name (max 100 chars)             |
| email           | string | ✅       | User's email (max 255 chars, must be unique) |
| senha           | string | ✅       | User's password (will be hashed)             |
| nome_empresa    | string | ✅       | Company name                                 |
| cnpj            | string | ✅       | Company CNPJ                                 |
| foto_perfil_url | string | ❌       | URL to profile photo                         |
| biografia       | string | ❌       | User biography                               |
| cidade          | string | ❌       | User's city (max 100 chars)                  |
| estado          | string | ❌       | User's state (max 50 chars)                  |
| pais            | string | ❌       | User's country (max 50 chars)                |
| site            | string | ❌       | Website URL                                  |

**CNPJ Format**:

- 14 numeric digits
- The API accepts both formatted (12.345.678/0001-90) and unformatted (12345678000190) versions
- Validation is done by regex that automatically removes dots, slashes, and hyphens

**Response**: 201 Created

```json
{
  "usuario_id": 1,
  "nome": "João Silva",
  "email": "joao@empresa.com",
  "nome_empresa": "Empresa de Eventos XYZ",
  "nivel_permissao": 1,
  "token": "jwt-token-here"
}
```

### Login

**POST** `/auth/login`

Log in to an existing account.

**Request Body**:

| Field | Type   | Required | Description     |
| ----- | ------ | -------- | --------------- |
| email | string | ✅       | User's email    |
| senha | string | ✅       | User's password |

**Response**: 200 OK

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "usuario_id": 1,
    "nome": "João Silva",
    "email": "joao@example.com",
    "nivel_permissao": 0,
    "foto_perfil_url": "https://example.com/foto.jpg"
  }
}
```

## Users

### Get User Profile

**GET** `/usuarios/:id`

Retrieve a user's profile information.

**Authentication**: Required

**Permissions**:

- USUARIO (0) can only view their own profile
- ADMIN (2) can view any profile

**Response**: 200 OK

```json
{
  "usuario_id": 1,
  "nome": "João Silva",
  "email": "joao@example.com",
  "foto_perfil_url": "https://example.com/photo.jpg",
  "biografia": "Corredor amador",
  "data_registro": "2025-05-15T14:06:05Z",
  "ultima_atividade": "2025-05-17T10:30:00Z",
  "cidade": "São Paulo",
  "estado": "SP",
  "pais": "Brasil",
  "data_nascimento": "1990-01-01",
  "genero": "Masculino",
  "nome_empresa": "Runners Inc",
  "site": "https://runners.example.com"
}
```

### List Users

**GET** `/usuarios`

List all users.

**Authentication**: Required

**Permissions**:

- ADMIN (2) only

**Query Parameters**:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Response**: 200 OK

```json
{
  "usuarios": [
    {
      "usuario_id": 1,
      "nome": "João Silva",
      "email": "joao@example.com",
      "foto_perfil_url": "https://example.com/photo.jpg",
      "data_registro": "2025-05-15T14:06:05Z",
      "nivel_permissao": 0
    }
  ],
  "total": 45,
  "pagina": 1,
  "total_paginas": 5
}
```

### Update User Profile

**PUT** `/usuarios/:id`

Update a user's profile information.

**Authentication**: Required (must be the same user or ADMIN)

**Permissions**:

- USUARIO (0) can only update their own profile
- ADMIN (2) can update any profile

**Request Body**:

| Field           | Type   | Required | Description                       |
| --------------- | ------ | -------- | --------------------------------- |
| nome            | string | ❌       | User's full name (max 100 chars)  |
| foto_perfil_url | string | ❌       | URL to profile photo              |
| biografia       | string | ❌       | User biography                    |
| cidade          | string | ❌       | User's city (max 100 chars)       |
| estado          | string | ❌       | User's state (max 50 chars)       |
| pais            | string | ❌       | User's country (max 50 chars)     |
| data_nascimento | date   | ❌       | User's date of birth (YYYY-MM-DD) |
| genero          | string | ❌       | User's gender (max 30 chars)      |
| preferencias    | object | ❌       | User preferences (JSON object)    |
| nome_empresa    | string | ❌       | Company name                      |
| cnpj            | string | ❌       | Company CNPJ                      |
| site            | string | ❌       | Website URL                       |

**Response**: 200 OK

```json
{
  "usuario_id": 1,
  "nome": "João Silva",
  "email": "joao@example.com",
  "foto_perfil_url": "https://example.com/new-photo.jpg",
  "biografia": "Corredor amador e entusiasta",
  "ultima_atividade": "2025-05-20T15:45:00Z"
}
```

### Delete User

**DELETE** `/usuarios/:id`

Delete a user account.

**Authentication**: Required

**Permissions**:

- USUARIO (0) can only delete their own account
- ADMIN (2) can delete any account

**Response**: 200 OK

```json
{
  "message": "Usuário removido com sucesso"
}
```

## Events

### Create Event

**POST** `/eventos`

Create a new running event.

**Authentication**: Required

**Permissions**:

- Minimum level: ORGANIZADOR (1)

**Request Body**:

| Field             | Type     | Required | Description                           |
| ----------------- | -------- | -------- | ------------------------------------- |
| nome              | string   | ✅       | Event name (max 255 chars)            |
| descricao         | string   | ❌       | Event description                     |
| localizacao       | string   | ❌       | Event location (address)              |
| coordenadas       | object   | ❌       | GPS coordinates (latitude, longitude) |
| data_inicio       | datetime | ✅       | Event start date and time             |
| data_fim          | datetime | ❌       | Event end date and time               |
| prazo_inscricao   | datetime | ❌       | Registration deadline                 |
| capacidade_maxima | integer  | ❌       | Maximum number of participants        |
| taxa_inscricao    | decimal  | ❌       | Registration fee                      |
| capa_url          | string   | ❌       | URL to event cover image              |
| modalidade        | string   | ❌       | Event type/mode (max 50 chars)        |
| site_oficial      | string   | ❌       | Official website URL                  |
| metadados         | object   | ❌       | Additional metadata (JSON object)     |
| categorias        | array    | ❌       | Array of category IDs for the event   |

**Response**: 201 Created

```json
{
  "evento_id": 1,
  "nome": "Maratona de São Paulo 2025",
  "data_inicio": "2025-06-15T07:00:00Z",
  "organizador_id": 1,
  "status": "Agendado"
}
```

### Get Event Details

**GET** `/eventos/:id`

Get detailed information about an event.

**Permissions**: Public (no authentication required)

**Response**: 200 OK

```json
{
  "evento_id": 1,
  "nome": "Maratona de São Paulo 2025",
  "descricao": "A maior maratona da América Latina",
  "localizacao": "Parque Ibirapuera, São Paulo",
  "coordenadas": { "lat": -23.588, "lng": -46.657 },
  "data_inicio": "2025-06-15T07:00:00Z",
  "data_fim": "2025-06-15T14:00:00Z",
  "prazo_inscricao": "2025-06-01T23:59:59Z",
  "organizador_id": 1,
  "status": "Agendado",
  "capacidade_maxima": 10000,
  "taxa_inscricao": 150.0,
  "capa_url": "https://example.com/eventos/maratona-sp.jpg",
  "modalidade": "Corrida de Rua",
  "site_oficial": "https://maratonasp.com",
  "data_criacao": "2025-01-15T10:00:00Z",
  "categorias": [
    {
      "categoria_id": 1,
      "nome": "Maratona",
      "distancia": 42.2
    },
    {
      "categoria_id": 2,
      "nome": "Meia Maratona",
      "distancia": 21.1
    }
  ],
  "totalInscritos": 150,
  "totalComentarios": 25,
  "totalFotos": 10
}
```

### List Events

**GET** `/eventos`

List all events with optional filtering.

**Permissions**: Public (no authentication required)

**Query Parameters**:

- `nome`: Filter by name (partial match)
- `localizacao`: Filter by location
- `dataInicioDe`: Filter by start date (from)
- `dataInicioAte`: Filter by start date (until)
- `status`: Filter by status (Agendado|Confirmado|Cancelado|Concluído)
- `modalidade`: Filter by event mode
- `categoriaId`: Filter by category
- `organizadorId`: Filter by organizer
- `inscricoesAbertas`: Filter by open registrations
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)

**Response**: 200 OK

```json
{
  "eventos": [
    {
      "evento_id": 1,
      "nome": "Maratona de São Paulo 2025",
      "data_inicio": "2025-06-15T07:00:00Z",
      "localizacao": "São Paulo, SP",
      "status": "Agendado",
      "modalidade": "Corrida",
      "organizador": {
        "usuario_id": 1,
        "nome": "Organizador",
        "foto_perfil_url": "https://example.com/foto.jpg"
      },
      "totalInscritos": 150
    }
  ],
  "pagina": 1,
  "total_paginas": 5,
  "total_eventos": 50
}
```

### Update Event

**PATCH** `/eventos/:id`

Update an event's information.

**Authentication**: Required

**Permissions**:

- ORGANIZADOR (1) can only update their own events
- ADMIN (2) can update any event

**Request Body**:

| Field             | Type     | Required | Description                           |
| ----------------- | -------- | -------- | ------------------------------------- |
| nome              | string   | ❌       | Event name (max 255 chars)            |
| descricao         | string   | ❌       | Event description                     |
| localizacao       | string   | ❌       | Event location (address)              |
| coordenadas       | object   | ❌       | GPS coordinates (latitude, longitude) |
| data_inicio       | datetime | ❌       | Event start date and time             |
| data_fim          | datetime | ❌       | Event end date and time               |
| prazo_inscricao   | datetime | ❌       | Registration deadline                 |
| capacidade_maxima | integer  | ❌       | Maximum number of participants        |
| taxa_inscricao    | decimal  | ❌       | Registration fee                      |
| capa_url          | string   | ❌       | URL to event cover image              |
| modalidade        | string   | ❌       | Event type/mode (max 50 chars)        |
| site_oficial      | string   | ❌       | Official website URL                  |
| status            | string   | ❌       | Event status                          |
| categorias        | array    | ❌       | Array of category IDs for the event   |

**Response**: 200 OK

```json
{
  "evento_id": 1,
  "nome": "Maratona de São Paulo 2025",
  "descricao": "A maior maratona da América Latina - Edição especial",
  "localizacao": "Parque Ibirapuera, São Paulo",
  "data_inicio": "2025-06-15T07:00:00Z",
  "status": "Confirmado"
}
```

### Delete Event

**DELETE** `/eventos/:id`

Delete an event.

**Authentication**: Required

**Permissions**:

- ORGANIZADOR (1) can only delete their own events
- ADMIN (2) can delete any event

**Response**: 200 OK

```json
{
  "message": "Evento com ID 1 foi removido com sucesso"
}
```

## Event Registration

### Register for Event

**POST** `/eventos/:id/inscricao`

Register a user for an event.

**Authentication**: Required

**Permissions**:

- Minimum level: USUARIO (0)

**Request Body**:

| Field                     | Type    | Required | Description                             |
| ------------------------- | ------- | -------- | --------------------------------------- |
| usuario_id                | integer | ✅       | User ID (from authentication)           |
| numero_atleta             | string  | ❌       | Athlete number                          |
| origem_inscricao          | string  | ❌       | Registration source (defaults to 'app') |
| comprovante_pagamento_url | string  | ❌       | Payment receipt URL                     |
| observacoes               | string  | ❌       | Notes                                   |

**Response**: 201 Created

```json
{
  "usuario_evento_id": 1,
  "usuario_id": 5,
  "evento_id": 1,
  "status": "Inscrito",
  "data_inscricao": "2025-05-20T14:30:00Z",
  "codigo_confirmacao": "ABC123XYZ"
}
```

### Get Event Registrations

**GET** `/eventos/:id/inscricoes`

Get list of registrations for an event.

**Authentication**: Required

**Permissions**:

- ORGANIZADOR (1) can only view registrations for their own events
- ADMIN (2) can view any event's registrations

**Query Parameters**:

- `status`: Filter by status (Inscrito|Confirmado|Em Análise|Cancelado|Não Compareceu)
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)

**Response**: 200 OK

```json
{
  "inscricoes": [
    {
      "usuario_evento_id": 1,
      "usuario_id": 5,
      "nome_usuario": "Maria Silva",
      "status": "Inscrito",
      "data_inscricao": "2025-05-20T14:30:00Z"
    }
  ],
  "total": 1,
  "evento_id": 1
}
```

### Get User's Event Registrations

**GET** `/usuarios/:id/inscricoes`

Get list of event registrations for a user.

**Authentication**: Required

**Permissions**:

- USUARIO (0) can only view their own registrations
- ADMIN (2) can view any user's registrations

**Query Parameters**:

- `status`: Filter by status
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)

**Response**: 200 OK

```json
{
  "inscricoes": [
    {
      "usuario_evento_id": 1,
      "evento_id": 1,
      "nome_evento": "Maratona de São Paulo 2025",
      "status": "Inscrito",
      "data_inscricao": "2025-05-20T14:30:00Z",
      "data_inicio": "2025-06-15T07:00:00Z",
      "localizacao": "Parque Ibirapuera, São Paulo"
    }
  ],
  "total": 1,
  "usuario_id": 5
}
```

### Update Registration Status

**PATCH** `/eventos/:eventId/inscricoes/:inscricaoId`

Update the status of an event registration.

**Authentication**: Required

**Permissions**:

- ORGANIZADOR (1) can only update registrations for their own events
- ADMIN (2) can update any registration

**Request Body**:

| Field       | Type   | Required | Description             |
| ----------- | ------ | -------- | ----------------------- |
| status      | string | ✅       | New registration status |
| observacoes | string | ❌       | Notes or observations   |

**Response**: 200 OK

```json
{
  "usuario_evento_id": 1,
  "usuario_id": 5,
  "evento_id": 1,
  "status": "Confirmado",
  "data_inscricao": "2025-05-20T14:30:00Z"
}
```

### Cancel Registration

**DELETE** `/eventos/:eventId/inscricoes/:inscricaoId`

Cancel a registration for an event.

**Authentication**: Required

**Permissions**:

- USUARIO (0) can only cancel their own registrations
- ORGANIZADOR (1) can cancel registrations for their events
- ADMIN (2) can cancel any registration

**Response**: 200 OK

```json
{
  "message": "Inscrição cancelada com sucesso"
}
```

## Photos

### Upload Event Photo

**POST** `/eventos/:id/fotos`

Upload a photo for an event.

**Authentication**: Required

**Request Body** (multipart/form-data):

| Field        | Type    | Required | Description                            |
| ------------ | ------- | -------- | -------------------------------------- |
| foto         | file    | ✅       | The image file                         |
| usuario_id   | integer | ✅       | User ID (from authentication)          |
| legenda      | string  | ❌       | Photo caption                          |
| coordenadas  | object  | ❌       | GPS location where photo was taken     |
| visibilidade | string  | ❌       | Visibility setting (default "publica") |
| metadados    | object  | ❌       | Photo metadata (JSON object)           |

**Response**: 201 Created

```json
{
  "foto_id": 1,
  "evento_id": 1,
  "usuario_id": 5,
  "foto_url": "https://example.com/fotos/evento1/123.jpg",
  "thumbnail_url": "https://example.com/fotos/evento1/123_thumb.jpg",
  "data_upload": "2025-06-15T12:30:00Z"
}
```

### Get Event Photos

**GET** `/eventos/:id/fotos`

Get photos for an event.

**Query Parameters**:

- `page`: Page number (default: 1)
- `limit`: Results per page (default: 20)
- `visibilidade`: Filter by visibility

**Response**: 200 OK

```json
{
  "fotos": [
    {
      "foto_id": 1,
      "evento_id": 1,
      "usuario_id": 5,
      "nome_usuario": "Maria Silva",
      "foto_url": "https://example.com/fotos/evento1/123.jpg",
      "thumbnail_url": "https://example.com/fotos/evento1/123_thumb.jpg",
      "legenda": "Momento da largada",
      "data_upload": "2025-06-15T12:30:00Z"
    }
  ],
  "total": 1
}
```

### Delete Photo

**DELETE** `/eventos/:eventId/fotos/:fotoId`

Delete a photo from an event.

**Authentication**: Required

**Permissions**:

- Photo owner can delete their own photos
- Event organizer can delete any photo from their event
- ADMIN (2) can delete any photo

**Response**: 200 OK

```json
{
  "message": "Foto removida com sucesso"
}
```

## Comments

### Add Event Comment

**POST** `/eventos/:id/comentarios`

Add a comment to an event.

**Authentication**: Required

**Request Body**:

| Field             | Type    | Required | Description                     |
| ----------------- | ------- | -------- | ------------------------------- |
| usuario_id        | integer | ✅       | User ID (from authentication)   |
| comentario_texto  | string  | ✅       | Comment text content            |
| comentario_pai_id | integer | ❌       | Parent comment ID (for replies) |

**Response**: 201 Created

```json
{
  "comentario_id": 1,
  "usuario_id": 5,
  "nome_usuario": "Maria Silva",
  "foto_perfil_url": "https://example.com/fotos/maria.jpg",
  "comentario_texto": "Evento incrível!",
  "data_comentario": "2025-06-16T09:15:00Z",
  "reacoes": { "curtidas": 0, "coracao": 0 }
}
```

### Get Event Comments

**GET** `/eventos/:id/comentarios`

Get comments for an event.

**Query Parameters**:

- `page`: Page number (default: 1)
- `limit`: Results per page (default: 20)

**Response**: 200 OK

```json
{
  "comentarios": [
    {
      "comentario_id": 1,
      "usuario_id": 5,
      "nome_usuario": "Maria Silva",
      "foto_perfil_url": "https://example.com/fotos/maria.jpg",
      "comentario_texto": "Evento incrível!",
      "data_comentario": "2025-06-16T09:15:00Z",
      "reacoes": { "curtidas": 2, "coracao": 1 },
      "respostas": []
    }
  ],
  "total": 1
}
```

### Add Comment Reaction

**POST** `/comentarios/:id/reacao`

Add a reaction to a comment.

**Authentication**: Required

**Request Body**:

| Field | Type   | Required | Description                     |
| ----- | ------ | -------- | ------------------------------- |
| tipo  | string | ✅       | Type of reaction                |
| valor | number | ✅       | Value to add (1) or remove (-1) |

**Response**: 200 OK

```json
{
  "comentario_id": 1,
  "reacoes": { "curtidas": 3, "coracao": 1 }
}
```

### Delete Comment

**DELETE** `/eventos/:eventId/comentarios/:comentarioId`

Delete a comment.

**Authentication**: Required

**Permissions**:

- Comment author can delete their own comment
- Event organizer can delete any comment on their event
- ADMIN (2) can delete any comment

**Response**: 200 OK

```json
{
  "message": "Comentário removido com sucesso"
}
```

## Race Results

### Submit Race Result

**POST** `/eventos/:id/resultados`

Submit a race result for a user.

**Authentication**: Required

**Request Body**:

| Field                | Type    | Required | Description               |
| -------------------- | ------- | -------- | ------------------------- |
| usuario_id           | integer | ✅       | User ID                   |
| tempo_liquido        | string  | ✅       | Net time (HH:MM:SS)       |
| tempo_bruto          | string  | ❌       | Gross time (HH:MM:SS)     |
| categoria_corrida    | string  | ❌       | Race category             |
| posicao_geral        | integer | ❌       | Overall position          |
| posicao_categoria    | integer | ❌       | Category position         |
| ritmo_medio          | string  | ❌       | Average pace (MIN:SEC/km) |
| velocidade_media     | decimal | ❌       | Average speed (km/h)      |
| distancia_percorrida | decimal | ❌       | Distance covered (km)     |
| chip_id              | string  | ❌       | Timing chip ID            |
| splits               | object  | ❌       | Split times (JSON object) |

**Response**: 201 Created

```json
{
  "resultado_id": 1,
  "usuario_id": 5,
  "evento_id": 1,
  "tempo_liquido": "03:45:22",
  "posicao_geral": 127
}
```

### Get Event Results

**GET** `/eventos/:id/resultados`

Get race results for an event.

**Permissions**: Public (no authentication required)

**Query Parameters**:

- `categoria`: Filter by category
- `validado`: Filter by validation status
- `page`: Page number
- `limit`: Results per page

**Response**: 200 OK

```json
{
  "resultados": [
    {
      "resultado_id": 1,
      "usuario_id": 5,
      "nome_usuario": "Maria Silva",
      "tempo_liquido": "03:45:22",
      "tempo_bruto": "03:46:10",
      "posicao_geral": 127,
      "posicao_categoria": 14,
      "categoria_corrida": "Feminino 30-39"
    }
  ],
  "total": 1
}
```

### Get User Results

**GET** `/usuarios/:id/resultados`

Get race results for a user.

**Query Parameters**:

- `page`: Page number
- `limit`: Results per page

**Response**: 200 OK

```json
{
  "resultados": [
    {
      "resultado_id": 1,
      "evento_id": 1,
      "nome_evento": "Maratona de São Paulo 2025",
      "tempo_liquido": "03:45:22",
      "posicao_geral": 127,
      "data_inicio": "2025-06-15T07:00:00Z"
    }
  ],
  "total": 1
}
```

### Validate Result

**PATCH** `/eventos/:eventId/resultados/:resultadoId/validar`

Validate a race result.

**Authentication**: Required

**Permissions**:

- ORGANIZADOR (1) can only validate results for their own events
- ADMIN (2) can validate any result

**Response**: 200 OK

```json
{
  "resultado_id": 1,
  "validado": true
}
```

### Delete Result

**DELETE** `/eventos/:eventId/resultados/:resultadoId`

Delete a race result.

**Authentication**: Required

**Permissions**:

- Result owner can delete their own result
- Event organizer can delete any result for their event
- ADMIN (2) can delete any result

**Response**: 200 OK

```json
{
  "message": "Resultado removido com sucesso"
}
```

## Medals

### Award Medal

**POST** `/usuarios/:id/medalhas`

Award a medal to a user.

**Authentication**: Required

**Permissions**:

- ADMIN (2) or event organizer for event-specific medals

**Request Body**:

| Field             | Type    | Required | Description                    |
| ----------------- | ------- | -------- | ------------------------------ |
| nome_medalha      | string  | ✅       | Medal name                     |
| descricao_medalha | string  | ❌       | Medal description              |
| evento_id         | integer | ❌       | Related event ID               |
| tipo_medalha      | string  | ✅       | Medal type                     |
| nivel_medalha     | integer | ❌       | Medal level (default 1)        |
| medalha_url       | string  | ❌       | Medal image URL                |
| pontos_xp         | integer | ❌       | XP points (default 0)          |
| exibir_perfil     | boolean | ❌       | Show on profile (default true) |
| requisitos_json   | object  | ❌       | Requirements (JSON object)     |

**Response**: 201 Created

```json
{
  "medalha_id": 1,
  "usuario_id": 5,
  "nome_medalha": "Finisher Maratona SP",
  "tipo_medalha": "finisher",
  "data_conquista": "2025-06-15T14:00:00Z"
}
```

### Get User Medals

**GET** `/usuarios/:id/medalhas`

Get medals for a user.

**Query Parameters**:

- `tipo`: Filter by medal type
- `evento_id`: Filter by event
- `page`: Page number
- `limit`: Results per page

**Response**: 200 OK

```json
{
  "medalhas": [
    {
      "medalha_id": 1,
      "nome_medalha": "Finisher Maratona SP",
      "descricao_medalha": "Completou a Maratona de São Paulo 2025",
      "data_conquista": "2025-06-15T14:00:00Z",
      "tipo_medalha": "finisher",
      "nivel_medalha": 1,
      "medalha_url": "https://example.com/medalhas/finisher-sp-2025.png",
      "evento": {
        "evento_id": 1,
        "nome": "Maratona de São Paulo 2025"
      }
    }
  ],
  "total": 1
}
```

### Delete Medal

**DELETE** `/usuarios/:userId/medalhas/:medalhaId`

Delete a medal from a user.

**Authentication**: Required

**Permissions**:

- ADMIN (2) only

**Response**: 200 OK

```json
{
  "message": "Medalha removida com sucesso"
}
```

## Followers

### Follow User

**POST** `/usuarios/:id/seguidores`

Follow another user.

**Authentication**: Required

**Request Body**:

| Field               | Type    | Required | Description                          |
| ------------------- | ------- | -------- | ------------------------------------ |
| seguidor_id         | integer | ✅       | ID of follower (from authentication) |
| notificacoes_ativas | boolean | ❌       | Enable notifications (default true)  |

**Response**: 201 Created

```json
{
  "usuario_id": 1,
  "seguidor_id": 5,
  "data_seguindo": "2025-05-21T11:45:00Z"
}
```

### Get User Followers

**GET** `/usuarios/:id/seguidores`

Get followers of a user.

**Query Parameters**:

- `page`: Page number
- `limit`: Results per page

**Response**: 200 OK

```json
{
  "seguidores": [
    {
      "usuario_id": 5,
      "nome": "Maria Silva",
      "foto_perfil_url": "https://example.com/fotos/maria.jpg",
      "data_seguindo": "2025-05-21T11:45:00Z"
    }
  ],
  "total": 1
}
```

### Get User Following

**GET** `/usuarios/:id/seguindo`

Get users being followed by a user.

**Query Parameters**:

- `page`: Page number
- `limit`: Results per page

**Response**: 200 OK

```json
{
  "seguindo": [
    {
      "usuario_id": 2,
      "nome": "Carlos Menezes",
      "foto_perfil_url": "https://example.com/fotos/carlos.jpg",
      "data_seguindo": "2025-05-18T09:30:00Z"
    }
  ],
  "total": 1
}
```

### Unfollow User

**DELETE** `/usuarios/:id/seguidores/:seguidorId`

Unfollow a user.

**Authentication**: Required

**Permissions**:

- Must be the follower specified in seguidorId

**Response**: 200 OK

```json
{
  "message": "Deixou de seguir o usuário com sucesso"
}
```

## Notifications

### Get User Notifications

**GET** `/usuarios/:id/notificacoes`

Get notifications for a user.

**Authentication**: Required (same user only)

**Query Parameters**:

- `lida`: Filter by read status (true/false)
- `page`: Page number
- `limit`: Results per page

**Response**: 200 OK

```json
{
  "notificacoes": [
    {
      "notificacao_id": 1,
      "tipo": "novo_seguidor",
      "titulo": "Novo seguidor",
      "mensagem": "Maria Silva começou a te seguir",
      "data_criacao": "2025-05-21T11:45:00Z",
      "lida": false,
      "acao_url": "/usuarios/5"
    }
  ],
  "total": 1,
  "nao_lidas": 1
}
```

### Mark Notification as Read

**PATCH** `/notificacoes/:id`

Mark a notification as read.

**Authentication**: Required (notification owner only)

**Request Body**:

| Field | Type    | Required | Description                 |
| ----- | ------- | -------- | --------------------------- |
| lida  | boolean | ✅       | Set to true to mark as read |

**Response**: 200 OK

```json
{
  "notificacao_id": 1,
  "lida": true
}
```

### Mark All Notifications as Read

**PATCH** `/usuarios/:id/notificacoes/ler-todas`

Mark all notifications for a user as read.

**Authentication**: Required (same user only)

**Response**: 200 OK

```json
{
  "message": "15 notificações marcadas como lidas"
}
```

## Statistics

### Get User Statistics

**GET** `/usuarios/:id/estatisticas`

Get running statistics for a user.

**Response**: 200 OK

```json
{
  "estatistica_id": 1,
  "usuario_id": 5,
  "total_corridas": 12,
  "total_distancia": 246.7,
  "melhor_tempo_5k": "00:23:15",
  "melhor_tempo_10k": "00:48:32",
  "melhor_tempo_21k": "01:52:44",
  "melhor_tempo_42k": "03:45:22",
  "nivel_corredor": 3,
  "pontos_xp": 1250,
  "ultimo_calculo": "2025-06-16T00:00:00Z",
  "streaks": {
    "atual": 3,
    "melhor": 8
  },
  "recordes": {
    "distancia_unica": 42.2,
    "distancia_semana": 67.5
  }
}
```

### Recalculate User Statistics

**POST** `/usuarios/:id/estatisticas/recalcular`

Force recalculation of user statistics.

**Authentication**: Required

**Permissions**:

- USUARIO (0) can recalculate their own statistics
- ADMIN (2) can recalculate any user's statistics

**Response**: 200 OK

```json
{
  "message": "Estatísticas recalculadas com sucesso",
  "estatistica_id": 1,
  "usuario_id": 5
}
```

## Categories

### Create Category

**POST** `/categorias`

Create a new race category.

**Authentication**: Required

**Permissions**:

- ADMIN (2) only

**Request Body**:

| Field     | Type    | Required | Description          |
| --------- | ------- | -------- | -------------------- |
| nome      | string  | ✅       | Category name        |
| descricao | string  | ❌       | Category description |
| distancia | decimal | ❌       | Distance in km       |
| icone_url | string  | ❌       | Icon URL             |

**Response**: 201 Created

```json
{
  "categoria_id": 3,
  "nome": "10K",
  "distancia": 10.0
}
```

### Get Categories

**GET** `/categorias`

Get list of all race categories.

**Permissions**: Public (no authentication required)

**Query Parameters**:

- `nome`: Filter by name (partial match)
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)

**Response**: 200 OK

```json
{
  "categorias": [
    {
      "categoria_id": 1,
      "nome": "Maratona",
      "descricao": "Prova de 42,195 km",
      "distancia": 42.2,
      "icone_url": "https://example.com/icons/marathon.png"
    },
    {
      "categoria_id": 2,
      "nome": "Meia Maratona",
      "descricao": "Prova de 21,0975 km",
      "distancia": 21.1,
      "icone_url": "https://example.com/icons/half-marathon.png"
    }
  ],
  "total": 5,
  "pagina": 1,
  "total_paginas": 1
}
```

### Add Category to Event

**POST** `/eventos/:id/categorias`

Add a category to an event.

**Authentication**: Required

**Permissions**:

- ORGANIZADOR (1) can only add categories to their own events
- ADMIN (2) can add categories to any event

**Request Body**:

| Field        | Type    | Required | Description |
| ------------ | ------- | -------- | ----------- |
| categoria_id | integer | ✅       | Category ID |

**Response**: 201 Created

```json
{
  "evento_id": 1,
  "categoria_id": 3,
  "message": "Categoria adicionada ao evento com sucesso"
}
```

### Remove Category from Event

**DELETE** `/eventos/:eventId/categorias/:categoriaId`

Remove a category from an event.

**Authentication**: Required

**Permissions**:

- ORGANIZADOR (1) can only remove categories from their own events
- ADMIN (2) can remove categories from any event

**Response**: 200 OK

```json
{
  "message": "Categoria removida do evento com sucesso"
}
```
