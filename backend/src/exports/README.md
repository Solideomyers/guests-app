# Exports Module - API Documentation

## Descripción
Este módulo proporciona funcionalidad para exportar la lista de invitados a formatos CSV y PDF.

## Endpoints

### 1. Exportar a CSV
Exporta los invitados en formato CSV con codificación UTF-8.

**Endpoint:** `POST /api/v1/exports/csv`

**Body (opcional):**
```json
{
  "search": "string (opcional - búsqueda por nombre, teléfono, dirección, etc.)",
  "firstName": "string (opcional)",
  "lastName": "string (opcional)",
  "phone": "string (opcional)",
  "address": "string (opcional)",
  "state": "string (opcional)",
  "city": "string (opcional)",
  "church": "string (opcional)",
  "status": "PENDING|CONFIRMED|DECLINED (opcional)",
  "isPastor": "boolean (opcional)"
}
```

**Response:**
- **Content-Type:** `text/csv; charset=utf-8`
- **Content-Disposition:** `attachment; filename="invitados_YYYY-MM-DD.csv"`
- **Body:** Archivo CSV descargable

**Columnas del CSV:**
1. ID
2. Nombre
3. Apellido
4. Dirección
5. Estado
6. Ciudad
7. Iglesia
8. Teléfono
9. Estado
10. Pastor
11. Notas
12. Fecha Creación

**Características:**
- ✅ Escapado automático de caracteres especiales (comas, comillas, saltos de línea)
- ✅ Soporte para filtros avanzados (usa los mismos filtros que GET /guests)
- ✅ Sin límite de paginación (exporta todos los registros que coincidan con los filtros)

**Ejemplo de uso:**

```bash
# Exportar todos los invitados
curl -X POST http://localhost:3000/api/v1/exports/csv \
  -H "Content-Type: application/json" \
  -d '{}' \
  --output invitados.csv

# Exportar solo pastores confirmados
curl -X POST http://localhost:3000/api/v1/exports/csv \
  -H "Content-Type: application/json" \
  -d '{
    "isPastor": true,
    "status": "CONFIRMED"
  }' \
  --output pastores_confirmados.csv

# Exportar invitados de un estado específico
curl -X POST http://localhost:3000/api/v1/exports/csv \
  -H "Content-Type: application/json" \
  -d '{
    "state": "California"
  }' \
  --output invitados_california.csv
```

---

### 2. Exportar a PDF
Exporta los invitados en formato PDF con diseño profesional en orientación horizontal.

**Endpoint:** `POST /api/v1/exports/pdf`

**Body (opcional):**
```json
{
  "search": "string (opcional - búsqueda por nombre, teléfono, dirección, etc.)",
  "firstName": "string (opcional)",
  "lastName": "string (opcional)",
  "phone": "string (opcional)",
  "address": "string (opcional)",
  "state": "string (opcional)",
  "city": "string (opcional)",
  "church": "string (opcional)",
  "status": "PENDING|CONFIRMED|DECLINED (opcional)",
  "isPastor": "boolean (opcional)"
}
```

**Response:**
- **Content-Type:** `application/pdf`
- **Content-Disposition:** `attachment; filename="invitados_YYYY-MM-DD.pdf"`
- **Body:** Archivo PDF descargable

**Diseño del PDF:**
- ✅ Formato: A4 horizontal (landscape)
- ✅ Título: "Lista de Invitados"
- ✅ Fecha de generación
- ✅ Tabla con 6 columnas:
  1. Nombre (nombre + apellido)
  2. Iglesia
  3. Ciudad
  4. Teléfono
  5. Estado
  6. Pastor (Sí/No)
- ✅ Paginación automática
- ✅ Número de página en el pie

**Características:**
- ✅ Soporte para filtros avanzados (usa los mismos filtros que GET /guests)
- ✅ Paginación automática cuando hay muchos registros
- ✅ Diseño profesional y legible
- ✅ Sin límite de registros (exporta todo lo que coincida con los filtros)

**Ejemplo de uso:**

```bash
# Exportar todos los invitados
curl -X POST http://localhost:3000/api/v1/exports/pdf \
  -H "Content-Type: application/json" \
  -d '{}' \
  --output invitados.pdf

# Exportar solo invitados pendientes
curl -X POST http://localhost:3000/api/v1/exports/pdf \
  -H "Content-Type: application/json" \
  -d '{
    "status": "PENDING"
  }' \
  --output invitados_pendientes.pdf

# Exportar invitados de una ciudad específica
curl -X POST http://localhost:3000/api/v1/exports/pdf \
  -H "Content-Type: application/json" \
  -d '{
    "city": "Los Angeles"
  }' \
  --output invitados_los_angeles.pdf
```

---

## Integración con Frontend

### React Query Example

```typescript
// src/api/exports.ts
import { FilterGuestDto } from './types';

export const exportToCSV = async (filters: FilterGuestDto) => {
  const response = await fetch('http://localhost:3000/api/v1/exports/csv', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(filters),
  });

  if (!response.ok) {
    throw new Error('Error al exportar CSV');
  }

  // Create blob and trigger download
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `invitados_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export const exportToPDF = async (filters: FilterGuestDto) => {
  const response = await fetch('http://localhost:3000/api/v1/exports/pdf', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(filters),
  });

  if (!response.ok) {
    throw new Error('Error al exportar PDF');
  }

  // Create blob and trigger download
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `invitados_${new Date().toISOString().split('T')[0]}.pdf`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
```

### React Component Example

```tsx
import { useState } from 'react';
import { exportToCSV, exportToPDF } from './api/exports';
import { FilterGuestDto } from './api/types';

export const ExportButtons = ({ filters }: { filters: FilterGuestDto }) => {
  const [loading, setLoading] = useState(false);

  const handleExportCSV = async () => {
    setLoading(true);
    try {
      await exportToCSV(filters);
      alert('CSV exportado exitosamente');
    } catch (error) {
      alert('Error al exportar CSV');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    setLoading(true);
    try {
      await exportToPDF(filters);
      alert('PDF exportado exitosamente');
    } catch (error) {
      alert('Error al exportar PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleExportCSV}
        disabled={loading}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
      >
        Exportar CSV
      </button>
      <button
        onClick={handleExportPDF}
        disabled={loading}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
      >
        Exportar PDF
      </button>
    </div>
  );
};
```

---

## Manejo de Errores

Ambos endpoints retornan errores en el siguiente formato:

```json
{
  "statusCode": 400,
  "message": "Error al generar CSV: <detalles del error>",
  "error": "Bad Request"
}
```

**Códigos de estado:**
- `200 OK` - Exportación exitosa (con archivo adjunto)
- `400 Bad Request` - Error en la generación del archivo o filtros inválidos
- `500 Internal Server Error` - Error interno del servidor

---

## Rendimiento

- ⚡ **CSV:** Muy rápido (< 1 segundo para 1000 registros)
- ⚡ **PDF:** Moderado (2-5 segundos para 1000 registros)

**Notas:**
- No hay límite de paginación en las exportaciones (se exportan todos los registros)
- Los filtros se procesan antes de la exportación para reducir el tamaño del dataset
- Recomendado: filtrar primero, exportar después para mejor rendimiento

---

## Tecnologías Utilizadas

- **csv-writer:** Generación de CSV con escapado automático
- **pdfkit:** Generación de PDF con diseño profesional
- **NestJS:** Framework backend
- **Prisma:** ORM para consultas a la base de datos
