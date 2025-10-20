# 🎨 Fase 2.5: Migración a shadcn/ui - Plan Detallado

> **Inicio:** 17 de Octubre, 2025  
> **Estado:** 🟡 En Progreso  
> **Objetivo:** Mejorar UI/UX con componentes profesionales y accesibles

---

## 📋 Índice

1. [Visión General](#visión-general)
2. [Componentes a Migrar](#componentes-a-migrar)
3. [Orden de Implementación](#orden-de-implementación)
4. [Breaking Changes](#breaking-changes)
5. [Timeline Estimado](#timeline-estimado)

---

## 🎯 Visión General

### ¿Por qué shadcn/ui?

shadcn/ui NO es una librería de componentes tradicional. Es una **colección de componentes copiables** construidos con:

- ✅ **Radix UI** - Primitivos accesibles y sin estilos
- ✅ **Tailwind CSS** - Styling utility-first
- ✅ **class-variance-authority (CVA)** - Variantes de componentes
- ✅ **TypeScript** - Type-safe por defecto

### Beneficios Clave

| Beneficio | Descripción |
|-----------|-------------|
| **Accesibilidad** | ARIA labels, keyboard navigation, screen readers |
| **Customización** | Código en tu proyecto, modifica lo que quieras |
| **No vendor lock-in** | No dependes de una librería externa |
| **Diseño consistente** | Variables CSS para tema unificado |
| **Dark mode ready** | Soporte nativo para tema oscuro |
| **Animaciones** | Transiciones suaves con tailwindcss-animate |

---

## 🧩 Componentes a Migrar

### Prioridad Alta (Críticos)

#### 1. **Button** 🔘
**Archivos afectados:**
- `AddGuestModal.tsx` - Botones de "Cancelar" y "Agregar"
- `ExportButtons.tsx` - Botones de CSV y PDF
- `BulkActionsToolbar.tsx` - Botón de "Eliminar seleccionados"
- `QueryErrorDisplay.tsx` - Botón de "Reintentar"
- `ScrollToTopButton.tsx` - Botón flotante

**Variantes necesarias:**
```typescript
- variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
- size: "default" | "sm" | "lg" | "icon"
```

**Ejemplo de uso:**
```tsx
// Antes
<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
  Agregar Invitado
</button>

// Después
<Button variant="default" size="default">
  Agregar Invitado
</Button>
```

---

#### 2. **Input** ⌨️
**Archivos afectados:**
- `SearchBar.tsx` - Input de búsqueda
- `AddGuestModal.tsx` - Form inputs (name, email, phone, company)

**Props adicionales:**
```typescript
- type: "text" | "email" | "tel" | "password" | etc.
- disabled: boolean
- error?: string
```

**Ejemplo de uso:**
```tsx
// Antes
<input
  type="text"
  className="border rounded px-3 py-2"
  placeholder="Buscar invitado..."
/>

// Después
<Input
  type="text"
  placeholder="Buscar invitado..."
  className="max-w-sm"
/>
```

---

#### 3. **Select** 📋
**Archivos afectados:**
- `StatusFilter.tsx` - Dropdown de status
- `GuestRow.tsx` - Inline select para cambiar status
- `AddGuestModal.tsx` - Select de status en form

**Estructura shadcn/ui:**
```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Seleccionar..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="pending">Pendiente</SelectItem>
    <SelectItem value="confirmed">Confirmado</SelectItem>
    <SelectItem value="cancelled">Cancelado</SelectItem>
  </SelectContent>
</Select>
```

---

#### 4. **Dialog** (Modal) 💬
**Archivos afectados:**
- `AddGuestModal.tsx` - Modal principal

**Estructura shadcn/ui:**
```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Agregar Nuevo Invitado</DialogTitle>
      <DialogDescription>
        Completa los datos del invitado
      </DialogDescription>
    </DialogHeader>
    {/* Form content */}
    <DialogFooter>
      <Button variant="outline" onClick={onClose}>Cancelar</Button>
      <Button type="submit">Agregar</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### Prioridad Media

#### 5. **Table** 📊
**Archivos afectados:**
- `GuestTable.tsx` - Tabla principal de invitados

**Estructura shadcn/ui:**
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Nombre</TableHead>
      <TableHead>Email</TableHead>
      {/* ... */}
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
      {/* ... */}
    </TableRow>
  </TableBody>
</Table>
```

---

#### 6. **Badge** 🏷️
**Archivos afectados:**
- `GuestRow.tsx` - Status badges

**Variantes necesarias:**
```typescript
- variant: "default" | "secondary" | "destructive" | "outline"
```

**Ejemplo de uso:**
```tsx
// Status badges
<Badge variant={status === 'confirmed' ? 'default' : 'secondary'}>
  {status}
</Badge>
```

---

### Prioridad Baja (Opcionales)

#### 7. **Card** 🃏
**Archivos afectados:**
- `StatsCard.tsx` - Tarjetas de estadísticas (opcional, actualizar diseño)

#### 8. **Skeleton** 💀
**Archivos afectados:**
- `GuestTableSkeleton.tsx` - Reemplazar con shadcn/ui Skeleton
- `StatsCardSkeleton.tsx` - Reemplazar con shadcn/ui Skeleton

#### 9. **Checkbox** ☑️
**Archivos afectados:**
- `GuestRow.tsx` - Checkboxes para selección múltiple
- `BulkActionsToolbar.tsx` - Select all checkbox

---

## 🔄 Orden de Implementación

### Fase 1: Setup y Configuración (30 min)
1. ✅ Ejecutar `npx shadcn@latest init`
2. ✅ Configurar `components.json`
3. ✅ Actualizar `tailwind.config.ts`
4. ✅ Agregar variables CSS en `index.css`
5. ✅ Instalar componente Button de prueba

### Fase 2: Componentes Básicos (1-2 horas)
1. Instalar y migrar **Button** (todos los archivos)
2. Instalar y migrar **Input** (SearchBar + AddGuestModal)
3. Verificar funcionalidad

### Fase 3: Componentes Complejos (2-3 horas)
1. Instalar y migrar **Select** (StatusFilter + GuestRow)
2. Instalar y migrar **Dialog** (AddGuestModal)
3. Instalar y migrar **Badge** (GuestRow)

### Fase 4: Tabla y Skeletons (1-2 horas)
1. Instalar y migrar **Table** (GuestTable)
2. Instalar y migrar **Skeleton** (ambos skeletons)
3. Verificar responsive design

### Fase 5: Componentes Opcionales (1 hora)
1. Instalar **Checkbox** (bulk actions)
2. Instalar **Card** (StatsCard - opcional)
3. Ajustes finales de diseño

---

## ⚠️ Breaking Changes

### Cambios en Props

#### Button
```tsx
// ANTES
<button
  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
  onClick={handleClick}
  disabled={isLoading}
>
  Click me
</button>

// DESPUÉS
<Button
  variant="default"
  size="default"
  onClick={handleClick}
  disabled={isLoading}
>
  Click me
</Button>
```

#### Select
```tsx
// ANTES
<select
  value={value}
  onChange={(e) => onChange(e.target.value)}
  className="border rounded px-3 py-2"
>
  <option value="all">Todos</option>
  <option value="confirmed">Confirmados</option>
</select>

// DESPUÉS
<Select value={value} onValueChange={onChange}>
  <SelectTrigger>
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">Todos</SelectItem>
    <SelectItem value="confirmed">Confirmados</SelectItem>
  </SelectContent>
</Select>
```

### Cambios en Imports

```tsx
// ANTES
// No imports, componentes HTML nativos

// DESPUÉS
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
```

---

## ⏱️ Timeline Estimado

| Fase | Duración | Componentes |
|------|----------|-------------|
| **Setup** | 30 min | Configuración inicial |
| **Fase 2** | 1-2 h | Button, Input |
| **Fase 3** | 2-3 h | Select, Dialog, Badge |
| **Fase 4** | 1-2 h | Table, Skeleton |
| **Fase 5** | 1 h | Checkbox, Card (opcional) |
| **Testing** | 1 h | Verificación completa |
| **TOTAL** | **6-9 horas** | Migración completa |

---

## 📝 Checklist de Verificación

### Durante la Migración
- [ ] Cada componente mantiene su funcionalidad original
- [ ] No hay TypeScript errors
- [ ] Diseño responsive (mobile, tablet, desktop)
- [ ] Accesibilidad (keyboard navigation, ARIA)
- [ ] Estados (hover, focus, active, disabled)

### Testing Post-Migración
- [ ] Búsqueda funciona correctamente
- [ ] Filtros de status funcionan
- [ ] Modal de agregar/editar funciona
- [ ] Bulk actions funcionan
- [ ] Exportaciones funcionan
- [ ] Navegación entre páginas funciona
- [ ] Skeletons se muestran correctamente
- [ ] Errores se manejan correctamente

---

## 🎨 Tema y Customización

### Variables CSS (generadas automáticamente)
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  /* ... más variables */
}
```

### Customización de Colores
Podemos ajustar el tema en `tailwind.config.ts` después de la instalación.

---

## 🚀 Próximos Pasos Inmediatos

1. **Ejecutar setup de shadcn/ui**
2. **Instalar Button component**
3. **Migrar primer archivo (ExportButtons.tsx)**
4. **Verificar que funciona**
5. **Continuar con resto de componentes**

---

**¿Listo para comenzar?** 🎉
