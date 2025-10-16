# Guests API Module

Complete CRUD API for managing event guests.

## Endpoints

### Guest Management

#### Create Guest
```
POST /api/v1/guests
```
**Body:**
```json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "church": "Gracia Eterna",
  "city": "Guayana",
  "state": "Bolívar",
  "phone": "+58 412-1234567",
  "isPastor": false,
  "status": "PENDING"
}
```

#### Get All Guests (with pagination and filters)
```
GET /api/v1/guests?page=1&limit=20&search=juan&status=CONFIRMED&isPastor=true
```
**Query Parameters:**
- `search` - Search in firstName, lastName, church, city, phone
- `status` - Filter by status (PENDING, CONFIRMED, DECLINED)
- `isPastor` - Filter by pastor status (true/false)
- `church` - Filter by church name
- `city` - Filter by city
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `sortBy` - Field to sort by (default: createdAt)
- `sortOrder` - Sort order: asc/desc (default: desc)

**Response:**
```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

#### Get One Guest
```
GET /api/v1/guests/:id
```

#### Update Guest
```
PATCH /api/v1/guests/:id
```
**Body:** (all fields optional)
```json
{
  "firstName": "Juan Carlos",
  "status": "CONFIRMED"
}
```

#### Delete Guest (soft delete)
```
DELETE /api/v1/guests/:id
```

### Statistics

#### Get Stats
```
GET /api/v1/guests/stats
```
**Response:**
```json
{
  "total": 100,
  "confirmed": 45,
  "pending": 30,
  "declined": 5,
  "pastors": 20
}
```

### Bulk Operations

#### Bulk Update Status
```
POST /api/v1/guests/bulk/status
```
**Body:**
```json
{
  "ids": [1, 2, 3],
  "status": "CONFIRMED"
}
```

#### Bulk Update Pastor Status
```
POST /api/v1/guests/bulk/pastor
```
**Body:**
```json
{
  "ids": [1, 2, 3],
  "isPastor": true
}
```

#### Bulk Delete
```
POST /api/v1/guests/bulk/delete
```
**Body:**
```json
{
  "ids": [1, 2, 3]
}
```

## DTOs

### CreateGuestDto
- `firstName` (required): string, 1-100 chars
- `lastName` (optional): string, max 100 chars
- `address` (optional): string, max 255 chars
- `state` (optional): string, max 100 chars
- `city` (optional): string, max 100 chars
- `church` (optional): string, max 200 chars
- `phone` (optional): string, max 20 chars
- `notes` (optional): string
- `status` (optional): PENDING | CONFIRMED | DECLINED
- `isPastor` (optional): boolean

### UpdateGuestDto
All fields from CreateGuestDto, all optional

### FilterGuestDto
- `search` (optional): string
- `status` (optional): PENDING | CONFIRMED | DECLINED
- `isPastor` (optional): boolean
- `church` (optional): string
- `city` (optional): string
- `page` (optional): number (default: 1)
- `limit` (optional): number (default: 20)
- `sortBy` (optional): string (default: 'createdAt')
- `sortOrder` (optional): 'asc' | 'desc' (default: 'desc')

## Features

✅ CRUD completo
✅ Paginación
✅ Búsqueda multi-campo
✅ Filtros avanzados
✅ Operaciones bulk
✅ Soft delete
✅ Historial de cambios (audit log)
✅ Validación de duplicados
✅ Validación de datos con class-validator
✅ Estadísticas en tiempo real

## Error Handling

- 400 Bad Request - Datos inválidos o duplicados
- 404 Not Found - Guest no encontrado
- 500 Internal Server Error - Error del servidor
