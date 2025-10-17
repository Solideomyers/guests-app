# 🌱 Instrucciones para Poblar la Base de Datos

## Estado Actual

- ✅ Backend configurado con NestJS + Prisma + Neon PostgreSQL
- ✅ Seed actualizado con los 71 invitados completos
- ⚠️ Base de datos vacía - necesita ser poblada

## 📋 Pasos para Ejecutar el Seed

### 1. Verificar Conexión a la Base de Datos

Asegúrate de que el archivo `backend/.env` tiene la variable `DATABASE_URL` correcta:

```bash
DATABASE_URL='postgresql://neondb_owner:npg_cad8O5eVsjSK@ep-mute-tooth-ad7h2ejb-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
```

### 2. Navegar al Directorio del Backend

```bash
cd backend
```

### 3. Sincronizar el Schema con Neon PostgreSQL

Este comando creará las tablas en tu base de datos según el schema de Prisma:

```bash
npx prisma db push
```

**Salida esperada:**
```
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma
Datasource "db": PostgreSQL database "neondb"

🚀  Your database is now in sync with your Prisma schema. Done in 2.30s
```

### 4. Ejecutar el Seed

Este comando cargará los 71 invitados en la base de datos:

```bash
npm run seed
```

**Comando equivalente:**
```bash
npx prisma db seed
```

**Salida esperada:**
```
🌱 Starting seed...
🗑️  Clearing existing data...
📝 Creating guests...
✅ Seeded 71 guests successfully!
```

### 5. Verificar los Datos (Opcional)

Puedes abrir Prisma Studio para ver los datos cargados:

```bash
npx prisma studio
```

Esto abrirá una interfaz web en `http://localhost:5555` donde podrás ver todos los invitados.

## 🔍 Verificación de Funcionamiento

### A. Verificar desde Prisma Studio

1. Ejecutar `npx prisma studio`
2. Ir a `http://localhost:5555`
3. Hacer clic en el modelo `Guest`
4. Deberías ver 71 registros

### B. Verificar desde la API

1. Asegúrate de que el backend esté corriendo:
   ```bash
   npm run start:dev
   ```

2. Abre tu navegador o Postman y prueba:
   ```
   GET http://localhost:3000/api/v1/guests
   ```

3. Deberías recibir un JSON con los 71 invitados

### C. Verificar desde el Frontend

1. Inicia el frontend:
   ```bash
   cd ../frontend
   npm run dev
   ```

2. Abre `http://localhost:5173`
3. Deberías ver la tabla con los 71 invitados
4. Las estadísticas deberían mostrar contadores reales

## ⚠️ Problemas Comunes

### Error: "Can't reach database server"

**Solución:** Verifica que la URL de Neon PostgreSQL sea correcta en `.env`

### Error: "Schema is not in sync"

**Solución:** 
```bash
npx prisma migrate reset
npx prisma db push
npm run seed
```

### Error: "Seed script not found"

**Solución:** Verifica que el `package.json` tenga:
```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

### Los datos no aparecen en el frontend

**Solución:**
1. Verifica que el backend esté corriendo en el puerto 3000
2. Verifica que el frontend esté apuntando a `http://localhost:3000/api/v1`
3. Revisa la consola del navegador para errores de CORS o conexión

## 📊 Contenido del Seed

El seed carga **71 invitados** con la siguiente estructura:

- **Nombre:** Francisco, Devinica, Lemuel, etc.
- **Apellido:** Myers, De Myers, Soto, etc. (algunos vacíos)
- **Estado:** Bolívar (todos)
- **Ciudad:** Guayana (todos)
- **Iglesia:** Gracia Eterna (todos)
- **Status:** PENDING (por defecto)
- **isPastor:** false (por defecto)

## 🔄 Re-ejecutar el Seed

Si necesitas volver a cargar los datos (limpiando los existentes):

```bash
npm run seed
```

El script automáticamente:
1. Limpia la tabla `guest_history`
2. Limpia la tabla `guests`
3. Carga los 71 invitados nuevamente

## ✅ Resultado Esperado

Después de ejecutar correctamente el seed:

- ✅ 71 invitados en la base de datos Neon PostgreSQL
- ✅ Todos con status "PENDING"
- ✅ Todos con `isPastor: false`
- ✅ Campos: firstName, lastName, state, city, church poblados
- ✅ Campos opcionales: address, phone, notes vacíos
- ✅ Timestamps: createdAt, updatedAt, registrationDate automáticos

---

**Última actualización:** 17 de Octubre, 2025
