# Integration Tests con SQLite

## ¿Por qué SQLite para Integration Tests?

### Ventajas
✅ **Velocidad:** 10-50x más rápido que PostgreSQL en red  
✅ **Sin configuración:** No requiere servidor externo  
✅ **Aislamiento:** Database file local, fácil de limpiar  
✅ **CI/CD friendly:** Funciona sin configuración en GitHub Actions  
✅ **Idéntico comportamiento:** Mismo Prisma ORM, mismas queries  

### Diferencias con PostgreSQL
⚠️ **Tipos de datos:** SQLite es menos estricto (no hay VarChar, Text es String)  
⚠️ **Case sensitivity:** SQLite LIKE es case-insensitive por defecto  
⚠️ **Funciones:** Algunas funciones de PostgreSQL no existen en SQLite  

### Setup

1. **Schema separado:** `prisma/schema.test.prisma`
   - Provider: `sqlite` en lugar de `postgresql`
   - Sin tipos específicos de PostgreSQL (`@db.VarChar`, `@db.Text`)

2. **DATABASE_URL:** `file:./test.db`
   - Archivo local en `backend/test.db`
   - Creado automáticamente
   - Limpiado antes de cada test

3. **Comandos:**
   ```bash
   # Generar client con schema de test
   npx prisma generate --schema=./prisma/schema.test.prisma
   
   # Push schema a SQLite
   npx prisma db push --schema=./prisma/schema.test.prisma
   
   # Run integration tests
   npm run test:integration
   ```

## Transición a PostgreSQL en Producción

Los integration tests usan SQLite, pero la aplicación en producción usa PostgreSQL.  
Esto es **perfectamente válido** porque:

1. **Prisma abstrae las diferencias** - Mismo código, diferente DB
2. **E2E tests usarán PostgreSQL** - Para validar production environment
3. **Unit + Integration dan confianza** - La lógica es independiente del DB

### Validación Production

Para validar contra PostgreSQL real:
```bash
# Crear .env.test.postgresql
DATABASE_URL="postgresql://..."

# Run con schema PostgreSQL
npm run test:integration -- --testPathPattern=guests.integration
```

## Comandos Útiles

```bash
# Ver database SQLite
sqlite3 backend/test.db
.tables
.schema guests
SELECT * FROM guests;

# Eliminar database
rm backend/test.db

# Regenerar schema
npx prisma generate --schema=./prisma/schema.test.prisma
npx prisma db push --schema=./prisma/schema.test.prisma --force-reset
```
