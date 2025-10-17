# Reorganización del Proyecto - Frontend/Backend Separados

## 📁 Nueva Estructura

El proyecto ha sido reorganizado para tener una estructura más clara y mantenible:

```
guests-app/
├── frontend/              # Aplicación React
│   ├── api/
│   ├── lib/
│   ├── components/
│   ├── hooks/
│   ├── stores/
│   ├── utils/
│   ├── App.tsx
│   ├── index.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── backend/               # Aplicación NestJS
│   ├── src/
│   │   ├── guests/
│   │   ├── exports/
│   │   ├── cache/
│   │   └── prisma/
│   ├── prisma/
│   ├── package.json
│   └── tsconfig.json
│
├── package.json          # Root - scripts para ambos proyectos
├── README.md             # Documentación principal
└── PLAN_IMPROVE.md       # Plan de mejoras
```

## ✅ Cambios Realizados

### 1. Estructura de Archivos
- ✅ Creado directorio `frontend/`
- ✅ Movidos todos los archivos del frontend a `frontend/`
- ✅ Backend ya estaba en `backend/`
- ✅ Archivos de documentación permanecen en la raíz

### 2. Configuración Root
- ✅ Creado `package.json` en la raíz con scripts para ambos proyectos
- ✅ Configurado como workspace de npm
- ✅ Scripts para desarrollo y build integrados

### 3. Archivos Actualizados
- ✅ `.gitignore` - Rutas actualizadas
- ✅ `README.md` - Nueva estructura documentada
- ✅ `PLAN_IMPROVE.md` - Estructura actualizada

## 🚀 Scripts Disponibles

### Desarrollo
```bash
# Iniciar ambos servidores (frontend + backend)
npm run dev

# Solo frontend (http://localhost:5173)
npm run dev:frontend

# Solo backend (http://localhost:3000)
npm run dev:backend
```

### Build
```bash
# Build de ambos proyectos
npm run build

# Solo frontend
npm run build:frontend

# Solo backend
npm run build:backend
```

### Instalación
```bash
# Instalar dependencias de todos los proyectos
npm run install:all

# Limpiar node_modules y dist de todos
npm run clean
```

## 📦 Workspaces

El proyecto ahora usa **npm workspaces** para gestionar ambos proyectos:

```json
{
  "workspaces": [
    "frontend",
    "backend"
  ]
}
```

**Beneficios:**
- Gestión centralizada de dependencias compartidas
- Scripts unificados desde la raíz
- Mejor organización del código
- Facilita CI/CD y deployment

## 🔄 Migración

### Antes
```
guests-app/
├── components/
├── api/
├── lib/
├── App.tsx
├── backend/
└── ...
```

### Después
```
guests-app/
├── frontend/      # Todo el frontend aquí
├── backend/       # Backend sin cambios
└── package.json   # Root con scripts
```

## 🔧 Correcciones Aplicadas

Durante la reorganización inicial se creó por error un directorio `backend/frontend/` que contenía:
- `.env`
- `.env.example`
- `tsconfig.json`
- `package.json`
- `node_modules/`

**Corrección aplicada:**
- ✅ Movidos todos los archivos a `backend/` (ubicación correcta)
- ✅ Eliminado `backend/frontend/node_modules/`
- ✅ Eliminado el directorio `backend/frontend/`

## ✅ Verificación

Estructura final correcta:

```
guests-app/
├── frontend/          # Frontend React
│   ├── .env
│   ├── .env.example
│   ├── tsconfig.json
│   ├── package.json
│   └── ...
│
├── backend/           # Backend NestJS
│   ├── .env
│   ├── .env.example
│   ├── tsconfig.json
│   ├── package.json
│   └── ...
│
└── package.json       # Root workspace
```

## 🎯 Próximos Pasos

Con la estructura reorganizada, ahora podemos proceder con:

**Fase 2.2: Custom Hooks y Zustand**
- Crear hooks personalizados con TanStack Query
- Implementar Zustand stores
- Refactorizar componentes para usar la nueva arquitectura

## 📚 Documentación

- `README.md` - Documentación principal actualizada
- `frontend/README.md` - Arquitectura del frontend
- `backend/src/*/README.md` - Documentación de módulos

---

**Nota:** Esta reorganización prepara el proyecto para un deployment más sencillo y una mejor separación de responsabilidades.
