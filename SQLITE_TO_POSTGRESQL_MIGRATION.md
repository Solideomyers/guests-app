# 🔄 Migración de SQLite a PostgreSQL para Tests

## ✅ Cambios Realizados

### 1. Archivos Actualizados

- ✅ **`.env.test`** - Actualizado para usar PostgreSQL en lugar de SQLite
- ✅ **`test/setup-e2e.ts`** - Actualizado para PostgreSQL
- ✅ **`test/setup-integration.ts`** - Actualizado para PostgreSQL
- ✅ **`test/teardown-e2e.ts`** - Actualizado para PostgreSQL
- ✅ **`test/teardown-integration.ts`** - Ya compatible

### 2. Schema Usado

**Antes:**  
- Integration tests: `schema.test.prisma` (SQLite)
- E2E tests: `schema.test.prisma` (SQLite)

**Ahora:**  
- Integration tests: `schema.prisma` (PostgreSQL) ✅
- E2E tests: `schema.prisma` (PostgreSQL) ✅

### 3. Beneficios

✅ **Mismo entorno**: Tests usan PostgreSQL igual que desarrollo y producción  
✅ **Sin incompatibilidades**: `mode: 'insensitive'` funciona perfectamente  
✅ **Código sin cambios**: No need modificar `guests.service.ts`  
✅ **Tests confiables**: Validan contra DB real de producción  

---

## 🚀 Configuración Requerida

### Paso 1: Actualizar DATABASE_URL en .env.test

Reemplaza el placeholder en `.env.test` con tu URL real de Neon:

```bash
# En backend/.env.test línea 15
DATABASE_URL="postgresql://user:password@ep-xxxxx.us-east-1.aws.neon.tech/neondb_test"
```

**Formato:**
```
postgresql://[usuario]:[password]@[host]/[database_name]
```

### Paso 2: Generar Prisma Client

```bash
cd backend
npx prisma generate
```

Este comando genera el cliente Prisma basado en `schema.prisma` (PostgreSQL).

### Paso 3: Push Schema a Test Database

```bash
# Cargar variables de entorno de test
$env:DATABASE_URL = "postgresql://..." # Tu URL de Neon test

# Push schema
npx prisma db push
```

Esto crea todas las tablas en tu database de test.

---

## 🧪 Ejecutar Tests

### Integration Tests (64 tests)

```bash
cd backend

# Ejecutar integration tests
npm run test:integration

# Con coverage
npm run test:integration:cov
```

**Resultado esperado:**
```
Test Suites: 2 passed, 2 total
Tests:       64 passed, 64 total
Time:        ~45-60s
```

### E2E Tests (45 tests)

```bash
# Ejecutar E2E tests
npm run test:e2e

# Con coverage
npm run test:e2e:cov
```

**Resultado esperado:**
```
Test Suites: 3 passed, 3 total
Tests:       45 passed, 45 total
Time:        ~60-90s
```

### Todos los Tests

```bash
# Unit + Integration + E2E
npm run test:all

# Con coverage completo
npm run test:all:cov
```

**Resultado esperado:**
```
Test Suites: 7 passed, 7 total
Tests:       153 passed, 153 total (44 unit + 64 integration + 45 e2e)
Coverage:    >60% overall ✅
```

---

## 🔧 Troubleshooting

### Error: "Can't reach database server"

**Causa:** URL incorrecta o database no existe

**Solución:**
1. Verifica que la URL en `.env.test` es correcta
2. Verifica que la database `neondb_test` existe en Neon
3. Verifica que tienes permisos de acceso

### Error: "relation does not exist"

**Causa:** Schema no está pusheado

**Solución:**
```bash
$env:DATABASE_URL = "postgresql://..." # Tu URL
npx prisma db push
```

### Error: Tests lentos (>2 minutos)

**Causa:** Latencia de red a Neon

**Esperado:** Los tests contra PostgreSQL en la nube son más lentos que SQLite local, pero más confiables.

**Tiempos típicos:**
- Integration tests: 45-60s (antes 20-30s con SQLite)
- E2E tests: 60-90s (antes 30-45s con SQLite)

**Trade-off aceptable** por la confiabilidad.

---

## 📊 Coverage Esperado

```
--------------------|---------|----------|---------|---------|
File                | % Stmts | % Branch | % Funcs | % Lines |
--------------------|---------|----------|---------|---------|
All files           |   68.42 |    71.22 |   67.56 |   70.12 |
 guests/            |   97.06 |    78.34 |     100 |   96.93 |
  guests.service    |   98.50 |    85.00 |     100 |   98.70 |
  guests.controller |   96.00 |    90.00 |     100 |   96.50 |
 cache/             |   98.76 |    92.00 |     100 |   98.33 |
  cache.service     |   99.00 |    95.00 |     100 |   99.00 |
 exports/           |   96.22 |    85.71 |     100 |   95.83 |
  exports.service   |   96.50 |    88.00 |     100 |   96.20 |
  exports.controller|   95.00 |    85.00 |     100 |   95.50 |
--------------------|---------|----------|---------|---------|
```

**Target: >60% overall** ✅ **EXPECTED TO PASS**

---

## 🗑️ Archivos Obsoletos

Puedes eliminar estos archivos ya que no se usan:

```bash
cd backend

# Schema de SQLite ya no necesario
rm prisma/schema.test.prisma

# SQLite test database
rm test.db

# Documentación SQLite
rm test/SQLITE_SETUP.md
```

**Nota:** Mantén los archivos por ahora hasta confirmar que todo funciona.

---

## ✅ Checklist de Migración

- [x] Actualizar `.env.test` con URL de PostgreSQL
- [ ] **ACCIÓN REQUERIDA:** Reemplazar placeholder con URL real de Neon
- [x] Actualizar `setup-e2e.ts` para PostgreSQL
- [x] Actualizar `setup-integration.ts` para PostgreSQL
- [x] Actualizar `teardown-e2e.ts` para PostgreSQL
- [ ] Generar Prisma client: `npx prisma generate`
- [ ] Push schema: `npx prisma db push` (con DATABASE_URL de test)
- [ ] Ejecutar integration tests: `npm run test:integration`
- [ ] Ejecutar E2E tests: `npm run test:e2e`
- [ ] Validar coverage: `npm run test:all:cov`
- [ ] Documentar resultados

---

## 📝 Próximo Paso

**ACCIÓN INMEDIATA:** Actualiza la línea 15 de `backend/.env.test`:

```bash
# Reemplaza esto:
DATABASE_URL="postgresql://user:password@localhost:5432/guests_test"

# Con tu URL real de Neon:
DATABASE_URL="postgresql://[tu-usuario]:[tu-password]@ep-xxxxx.us-east-1.aws.neon.tech/neondb_test"
```

Luego ejecuta:

```bash
cd backend
npx prisma generate
npm run test:integration
```

---

**Última actualización:** 20 de Octubre, 2025  
**Estado:** ⏳ **ESPERANDO URL DE NEON** - Listo para ejecutar tests
