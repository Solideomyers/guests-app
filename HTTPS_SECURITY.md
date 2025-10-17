# 🔒 Configuración de Seguridad HTTPS

> **Fecha de Creación:** 17 de Octubre, 2025  
> **Prioridad:** 🔴 CRÍTICA para Producción  
> **Estado:** 📋 Planificado

---

## 🎯 Resumen Ejecutivo

Durante el desarrollo local, las exportaciones de PDF generan la siguiente advertencia en la consola del navegador:

```
The file at 'blob:http://10.147.1.122:3001/e67dea06-7837-4fca-a1fa-d75cbe0b08f8' 
was loaded over an insecure connection. This file should be served over HTTPS.
```

### ¿Qué significa?

- El navegador detecta que la aplicación usa `http://` (conexión no cifrada) en lugar de `https://` (conexión cifrada)
- Los blobs (Binary Large Objects) son datos temporales en memoria creados para descargas
- Es una **advertencia de seguridad del navegador**, no un error funcional

### ¿Es un problema?

| Entorno | ¿Es problema? | Acción Requerida |
|---------|---------------|------------------|
| **Desarrollo Local** | ❌ NO | Ignorar la advertencia - es cosmética |
| **Producción** | ✅ SÍ | **OBLIGATORIO** configurar HTTPS |

---

## 🚫 Por qué NO configurar HTTPS en Desarrollo Local

### Razones Técnicas

1. **Complejidad Innecesaria**
   - Requiere generar certificados SSL autofirmados
   - Los navegadores mostrarán advertencias de "certificado no confiable"
   - Agrega pasos extra al setup del proyecto

2. **Sin Beneficios Reales**
   - Los datos no se exponen a internet
   - Estás en tu red local privada (10.147.1.122)
   - No hay riesgo de intercepción de datos

3. **Overhead de Desarrollo**
   - Certificados expiran y deben renovarse
   - Problemas con diferentes navegadores
   - Complejidad adicional en troubleshooting

### Lo Que SÍ Importa en Desarrollo

```typescript
✅ La funcionalidad funciona perfectamente
✅ Los PDFs se generan correctamente con todos los invitados
✅ Las exportaciones se descargan sin problemas
✅ Los datos están seguros en tu red local
```

---

## ✅ Configuración HTTPS para Producción

### Fase 4.2: Security Hardening (Deployment)

Cuando despliegues la aplicación a internet, **DEBES** implementar HTTPS. Aquí está el plan:

#### 1. Backend (NestJS)

##### Opción A: Certificado en el Servidor (Manual)

```typescript
// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as https from 'https';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./secrets/private-key.pem'),
    cert: fs.readFileSync('./secrets/certificate.pem'),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });
  
  // Forzar HTTPS
  app.use((req, res, next) => {
    if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
      return res.redirect(301, `https://${req.hostname}${req.url}`);
    }
    next();
  });

  await app.listen(3000);
}
bootstrap();
```

##### Opción B: Reverse Proxy (Recomendado) ⭐

Usar un reverse proxy como **Nginx** o **Caddy** que maneje SSL:

```nginx
# nginx.conf
server {
    listen 80;
    server_name tu-dominio.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tu-dominio.com;

    ssl_certificate /etc/letsencrypt/live/tu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tu-dominio.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

##### Opción C: Plataforma de Deployment (Más Simple) 🚀

Si despliegas en **Vercel**, **Netlify**, **Railway**, **Render**, o **Fly.io**:

```bash
✅ HTTPS automático y gratuito
✅ Certificados SSL/TLS auto-renovables
✅ CDN global incluido
✅ Sin configuración manual necesaria
```

#### 2. Frontend (React + Vite)

##### En Producción

```typescript
// vite.config.ts - NO modificar para producción
// Las plataformas como Vercel manejan HTTPS automáticamente

export default defineConfig({
  server: {
    port: 3001,
    host: '0.0.0.0',
  },
  // ... resto de la config
});
```

##### Variables de Entorno

```bash
# .env.production
VITE_API_BASE_URL=https://api.tu-dominio.com/api/v1
```

#### 3. HSTS (HTTP Strict Transport Security)

Forzar que el navegador SIEMPRE use HTTPS:

```typescript
// backend/src/main.ts
app.use((req, res, next) => {
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );
  next();
});
```

#### 4. Content Security Policy

Agregar headers de seguridad adicionales:

```typescript
// backend/src/main.ts
import helmet from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:"],
        connectSrc: ["'self'", "https://api.tu-dominio.com"],
      },
    },
  }));
  
  // ... resto del código
}
```

---

## 📋 Checklist de Deployment HTTPS

### Pre-Deployment

- [ ] Verificar que la aplicación funciona correctamente en desarrollo
- [ ] Tener un dominio registrado (ej: `tu-dominio.com`)
- [ ] Decidir plataforma de hosting (Vercel/Netlify/Railway/Render)

### Durante Deployment

#### Frontend
- [ ] Configurar dominio personalizado en plataforma
- [ ] Esperar propagación DNS (24-48 horas)
- [ ] Verificar certificado SSL automático
- [ ] Actualizar `VITE_API_BASE_URL` con URL HTTPS del backend

#### Backend
- [ ] Desplegar backend en plataforma elegida
- [ ] Configurar certificado SSL (automático en Railway/Render)
- [ ] Configurar CORS para permitir dominio del frontend
- [ ] Agregar redirect HTTP → HTTPS
- [ ] Habilitar HSTS headers

### Post-Deployment

- [ ] Probar todas las funcionalidades en producción
- [ ] Verificar que NO aparezcan advertencias de conexión insegura
- [ ] Validar certificado SSL en SSLLabs: https://www.ssllabs.com/ssltest/
- [ ] Verificar que las exportaciones funcionen sin advertencias
- [ ] Monitorear logs por errores relacionados con HTTPS

---

## 🔍 Verificación de Seguridad

### Herramientas de Testing

1. **SSL Labs Test**
   - URL: https://www.ssllabs.com/ssltest/
   - Objetivo: Calificación A o A+

2. **SecurityHeaders.com**
   - URL: https://securityheaders.com/
   - Verificar headers de seguridad

3. **Browser DevTools**
   - Consola debe estar limpia (sin advertencias HTTPS)
   - Network tab: todos los requests con 🔒

### Comandos de Verificación

```bash
# Verificar certificado SSL
openssl s_client -connect tu-dominio.com:443 -servername tu-dominio.com

# Verificar redirección HTTP → HTTPS
curl -I http://tu-dominio.com

# Verificar headers HSTS
curl -I https://tu-dominio.com | grep -i strict
```

---

## 💡 Recomendaciones Finales

### Para Desarrollo (Actual)

```diff
+ Ignorar la advertencia del navegador
+ Continuar usando HTTP en localhost/red local
+ Documentar este comportamiento para el equipo
+ Agregar nota en README sobre advertencia esperada
```

### Para Producción (Futuro)

```diff
+ Usar plataforma con HTTPS automático (Vercel/Netlify/Railway)
+ Implementar HSTS y headers de seguridad
+ Configurar redirect automático HTTP → HTTPS
+ Validar con herramientas de testing SSL
+ Monitorear renovación automática de certificados
```

---

## 📚 Recursos Adicionales

### Documentación Oficial

- [Let's Encrypt (Certificados Gratuitos)](https://letsencrypt.org/)
- [NestJS HTTPS Configuration](https://docs.nestjs.com/faq/http-adapter#https)
- [Vite Build for Production](https://vitejs.dev/guide/build.html)
- [OWASP HSTS Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html)

### Tutoriales

- [How to Deploy NestJS to Railway with HTTPS](https://railway.app/docs)
- [Vercel Automatic HTTPS](https://vercel.com/docs/concepts/edge-network/encryption)
- [Nginx SSL Configuration Guide](https://nginx.org/en/docs/http/configuring_https_servers.html)

---

## 🎉 Resumen

| Aspecto | Desarrollo | Producción |
|---------|-----------|-----------|
| **Protocolo** | HTTP ✅ | HTTPS ⚠️ OBLIGATORIO |
| **Advertencia Navegador** | Normal ✅ | Inaceptable ❌ |
| **Certificado SSL** | No requerido | Requerido |
| **Configuración** | Ninguna | HSTS + Redirect |
| **Prioridad** | Baja | CRÍTICA 🔴 |

---

**Última actualización:** 17 de Octubre, 2025  
**Mantenido por:** @Solideomyers  
**Estado:** 📋 Planificado para Fase 4.2 (Deployment)
