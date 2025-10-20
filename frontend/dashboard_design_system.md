# Sistema de Diseño: Dashboard Analytics Profesional

## 1. FILOSOFÍA DE DISEÑO

### Principios Fundamentales
- **Minimalismo Funcional**: Cada elemento tiene propósito. Sin decoraciones innecesarias.
- **Legibilidad Prioritaria**: Información jerárquica clara y escaneable en segundos.
- **Contraste Inteligente**: Uso de colores neutros (blanco, gris) con acentos suaves (azul, rosa).
- **Accesibilidad**: Alto contraste en textos, espaciado generoso, fuentes legibles.
- **Fluidez Visual**: Conexión lógica entre elementos, flujo natural de lectura.

### Objetivo UX
Permitir que usuarios ejecutivos comprendan métricas críticas sin sobrecarga cognitiva.

---

## 2. PALETA DE COLORES (Sistema OKLCH)

### Valores CSS Variables (Implementación Real)

```css
:root {
  /* LIGHT MODE */
  --background: oklch(1.0000 0 0);           /* Blanco puro */
  --foreground: oklch(0.2101 0.0318 264.6645); /* Negro azulado */
  --card: oklch(1.0000 0 0);                 /* Blanco puro */
  --card-foreground: oklch(0.2101 0.0318 264.6645);
  --primary: oklch(0.6716 0.1368 48.5130);   /* Amarillo/Dorado */
  --primary-foreground: oklch(1.0000 0 0);   /* Blanco */
  --secondary: oklch(0.5360 0.0398 196.0280); /* Azul */
  --secondary-foreground: oklch(1.0000 0 0);
  --muted: oklch(0.9670 0.0029 264.5419);    /* Gris muy claro */
  --muted-foreground: oklch(0.5510 0.0234 264.3637); /* Gris medio */
  --border: oklch(0.9276 0.0058 264.5313);   /* Gris bordes */
  --input: oklch(0.9276 0.0058 264.5313);
  --destructive: oklch(0.6368 0.2078 25.3313); /* Rojo */
  
  /* CHART COLORS */
  --chart-1: oklch(0.5940 0.0443 196.0233);  /* Azul oscuro */
  --chart-2: oklch(0.7214 0.1337 49.9802);   /* Amarillo dorado */
  --chart-3: oklch(0.8721 0.0864 68.5474);   /* Verde */
  --chart-4: oklch(0.6268 0 0);              /* Gris oscuro */
  --chart-5: oklch(0.6830 0 0);              /* Gris más oscuro */
}

.dark {
  /* DARK MODE */
  --background: oklch(0.1797 0.0043 308.1928); /* Muy oscuro azulado */
  --foreground: oklch(0.8109 0 0);           /* Casi blanco */
  --card: oklch(0.1822 0 0);                 /* Negro suave */
  --card-foreground: oklch(0.8109 0 0);
  --primary: oklch(0.7214 0.1337 49.9802);   /* Amarillo más claro */
  --primary-foreground: oklch(0.1797 0.0043 308.1928);
  --secondary: oklch(0.5940 0.0443 196.0233); /* Azul */
  --secondary-foreground: oklch(0.1797 0.0043 308.1928);
  --muted: oklch(0.2520 0 0);                /* Gris oscuro */
  --muted-foreground: oklch(0.6268 0 0);     /* Gris claro */
  --border: oklch(0.2520 0 0);
  --input: oklch(0.2520 0 0);
}
```

### Conversión a Variables Semánticas

```json
{
  "colores_luz": {
    "fondo": {
      "primario": "var(--background)",
      "secundario": "var(--muted)"
    },
    "texto": {
      "primario": "var(--foreground)",
      "secundario": "var(--muted-foreground)"
    },
    "acentos": {
      "primario": "var(--primary)",
      "secundario": "var(--secondary)",
      "destructivo": "var(--destructive)"
    },
    "bordes": "var(--border)",
    "graficos": {
      "1": "var(--chart-1)",
      "2": "var(--chart-2)",
      "3": "var(--chart-3)",
      "4": "var(--chart-4)",
      "5": "var(--chart-5)"
    }
  },
  "valores_oklch_explicados": {
    "formato": "oklch(L C H)",
    "L": "Luminancia (0-1): qué tan claro/oscuro",
    "C": "Croma (0-0.37): saturación del color",
    "H": "Hue (0-360): ángulo del color en rueda"
  }
}
```

### Estrategia de Contraste
- **Fondo Base**: Blanco puro (#FFFFFF) o gris ultra claro (#F5F5F5)
- **Acentos Duales**: Azul + Rosa crean profundidad sin ser agresivos
- **Sidebar Oscuro**: Negro para anclar visualmente, contraste máximo
- **Cards**: Bordes sutiles en gris claro para definición sin peso

---

## 3. ANATOMÍA DEL LAYOUT

### Estructura General (Grid)
```
┌─────────────────────────────────────────────────────────┐
│ SIDEBAR (80px) │           CONTENIDO PRINCIPAL          │
│   Negro        │     Ancho flexible, max 1400px        │
├────────────────┼─────────────────────────────────────────┤
│  • Home        │ [Settings] [+ Create new scenario]     │
│  • Share       │                                         │
│  • Org         │ [TAB NAVIGATION]                        │
│  • Link        │ ──────────────────────────────────     │
│  • Globe       │                                         │
│  • More        │ ┌────────────┐  ┌─────────────┐        │
│                │ │ CARD 1     │  │ CARD 2      │        │
│                │ │ 780/1,000  │  │ 163/512 MB  │        │
│                │ └────────────┘  └─────────────┘        │
│                │                                         │
│                │ ┌────────────────────────────────┐     │
│                │ │ GRÁFICO ESTADÍSTICAS           │     │
│                │ │ (Timeline + Barras Duales)     │     │
│                │ └────────────────────────────────┘     │
│                │                                         │
│                │ ┌─────────────────────────────────┐    │
│                │ │ UPGRADE CARD (Negro + Botón)    │    │
│                │ └─────────────────────────────────┘    │
│                │                                         │
│                │ ┌──────────────────────────────────┐   │
│                │ │ RECOMMENDED (4 items grid)       │   │
│                │ └──────────────────────────────────┘   │
└────────────────┴─────────────────────────────────────────┘
```

### Sidebar (80px ancho)
- Iconografía monocromática blanca
- Fondo: #1A1A1A
- Padding: 16px
- Espaciado entre iconos: 24px
- Avatar usuario en base

### Área de Contenido
- Padding: 40px lateral, 32px superior
- Max-width: ~1400px
- Fondo: Blanco con sutiles bordes grises

---

## 4. COMPONENTES CLAVE

### 4.1 Tarjetas Métricas (KPI Cards)

```json
{
  "estructura": {
    "tipo": "card_metrica",
    "dimensiones": {
      "ancho": "calc(50% - 12px) o flexible",
      "alto": "auto",
      "padding": "24px"
    },
    "border": {
      "tipo": "sutile",
      "color": "#E0E0E0",
      "radius": "12px",
      "shadow": "0 1px 3px rgba(0,0,0,0.08)"
    },
    "contenido": {
      "label_size": "12px",
      "label_weight": "500",
      "label_color": "#666666",
      "numero_size": "56px",
      "numero_weight": "bold",
      "numero_color": "#000000",
      "barra_visual": {
        "tipo": "progress_suave",
        "altura": "6px",
        "radio": "3px",
        "fondo": "#E8E8E8",
        "relleno_color": "#A8C5E8 o #E8C8D8",
        "items": 5,
        "separacion": "4px"
      },
      "badge_uso": {
        "bg": "#1A1A1A",
        "color_texto": "#FFFFFF",
        "padding": "4px 8px",
        "border_radius": "4px",
        "font_size": "11px",
        "posicion": "esquina_superior_derecha"
      }
    }
  }
}
```

**Técnica de UI**: Las barras visuales usan solo 5-6 elementos para no abrumar. Los elementos grises vacíos sugieren potencial sin ser negativos.

### 4.2 Tarjeta Upgrade (CTA)

```json
{
  "tipo": "upgrade_card",
  "bg_color": "#1A1A1A",
  "padding": "32px",
  "border_radius": "16px",
  "contenido": {
    "titulo": {
      "size": "18px",
      "weight": "bold",
      "color": "#FFFFFF",
      "max_width": "220px"
    },
    "subtitulo": {
      "size": "13px",
      "weight": "400",
      "color": "#CCCCCC",
      "margin_top": "8px"
    },
    "boton": {
      "label": "Upgrade",
      "bg": "#FFFFFF",
      "color": "#1A1A1A",
      "padding": "12px 32px",
      "border_radius": "24px",
      "font_weight": "600",
      "cursor": "pointer",
      "hover": {
        "opacity": "0.9",
        "transform": "scale(1.02)"
      }
    },
    "icono_decorativo": {
      "posicion": "esquina_superior_derecha",
      "tipo": "gradiente_colorido",
      "opacity": "0.3"
    }
  }
}
```

**Técnica de Contraste**: Fondo oscuro intenso crea urgencia. Botón blanco puro es fácilmente clickeable.

### 4.3 Gráfico Estadísticas (Timeline Bars)

```json
{
  "grafico": {
    "tipo": "stacked_bar_chart",
    "altura": "280px",
    "padding": "24px",
    "eje_y": {
      "escala": "0.0 a 1.0",
      "ticks": 5,
      "color": "#999999",
      "font_size": "12px"
    },
    "barras": {
      "segmento_superior": {
        "color": "#E8C8D8",
        "label": "Variables/Conceptos"
      },
      "segmento_inferior": {
        "color": "#A8C5E8",
        "label": "Base Operations"
      },
      "ancho": "32px",
      "separacion": "16px",
      "border_radius": "8px 8px 0 0"
    },
    "eje_x": {
      "fechas": ["27 Jun", "28 Jun", "29 Jun", "30 Jun", "1 Jul", "2 Jul", "3 Jul", "4 Jul"],
      "labels": true,
      "color": "#666666",
      "font_size": "12px"
    },
    "percentages": {
      "posicion": "sobre_barras",
      "bg_dark": "#1A1A1A",
      "color": "#FFFFFF",
      "padding": "4px 8px",
      "border_radius": "4px",
      "font_size": "12px",
      "visible": "solo_en_picos"
    }
  }
}
```

**Técnica UX**: Solo muestra porcentajes en valores picos (87%, 37%). Reduce ruido visual.

### 4.4 Navegación Tabs

```json
{
  "tabs": {
    "layout": "horizontal",
    "gap": "24px",
    "padding": "0 24px",
    "items": [
      {
        "label": "Organization",
        "estado": "activo",
        "bg": "#1A1A1A",
        "color": "#FFFFFF",
        "border_radius": "20px",
        "padding": "8px 16px"
      },
      {
        "label": "Teams",
        "estado": "inactivo",
        "bg": "transparent",
        "color": "#666666",
        "border_bottom": "2px solid transparent"
      }
    ],
    "border_bottom": {
      "color": "#E0E0E0",
      "peso": "1px",
      "margin_top": "16px"
    }
  }
}
```

### 4.5 Recomendados Grid (2x2)

```json
{
  "grid_recomendados": {
    "layout": "grid",
    "columnas": 2,
    "gap": "24px",
    "items_por_fila": 2,
    "items": [
      {
        "icono": "📱",
        "titulo": "Community",
        "tipo": "card_simple"
      },
      {
        "icono": "🎓",
        "titulo": "Academy",
        "tipo": "card_simple"
      },
      {
        "icono": "📖",
        "titulo": "Help center",
        "tipo": "card_simple"
      },
      {
        "icono": "🤝",
        "titulo": "Partner directory",
        "tipo": "card_simple"
      }
    ],
    "card_style": {
      "padding": "20px",
      "border": "1px solid #E0E0E0",
      "border_radius": "8px",
      "background": "#FAFAFA",
      "hover": {
        "shadow": "0 4px 12px rgba(0,0,0,0.08)",
        "transform": "translateY(-2px)"
      }
    }
  }
}
```

---

## 4.6 Sistema de Variables CSS Disponibles

```css
/* IMPLEMENTACIÓN DIRECTA EN COMPONENTES */

/* Colores */
background-color: var(--background);
color: var(--foreground);
border: 1px solid var(--border);
background-color: var(--primary);
color: var(--primary-foreground);

/* Bordes y Radios */
border-radius: var(--radius-lg);
border-radius: var(--radius-sm);
border-radius: var(--radius-md);
border-radius: var(--radius-xl);

/* Sombras */
box-shadow: var(--shadow-sm);
box-shadow: var(--shadow-lg);

/* Tipografía */
font-family: var(--font-sans);
font-family: var(--font-mono);
letter-spacing: var(--tracking-normal);
letter-spacing: var(--tracking-wide);

/* Temas */
.dark { /* Aplica automáticamente variables dark mode */
  --background: oklch(0.1797 0.0043 308.1928);
  /* ... el resto de variables oscuras */
}
```

---

## 5. TÉCNICAS DE UI/UX

### 5.1 Jerarquía Visual
1. **Números grandes (56px)**: Información crítica
2. **Labels pequeños (12px)**: Contexto
3. **Badges (11px)**: Información secundaria
4. **Texto neutro (13-14px)**: Contenido normal

### 5.2 Espaciado y Border Radius

```json
{
  "espaciado": {
    "sistema": "0.25rem (4px base)",
    "padding_cards": "24px (6 × 4px)",
    "margin_elementos": "16px (4 × 4px)",
    "gap_grillas": "24px (6 × 4px)"
  },
  "border_radius": {
    "sm": "calc(0.75rem - 4px)",
    "md": "calc(0.75rem - 2px)",
    "lg": "0.75rem",
    "xl": "calc(0.75rem + 4px)"
  },
  "sombras_css": {
    "shadow-2xs": "0px 1px 4px 0px hsl(0 0% 0% / 0.03)",
    "shadow-xs": "0px 1px 4px 0px hsl(0 0% 0% / 0.03)",
    "shadow-sm": "0px 1px 4px 0px hsl(0 0% 0% / 0.05), 0px 1px 2px -1px hsl(0 0% 0% / 0.05)",
    "shadow": "0px 1px 4px 0px hsl(0 0% 0% / 0.05), 0px 1px 2px -1px hsl(0 0% 0% / 0.05)",
    "shadow-md": "0px 1px 4px 0px hsl(0 0% 0% / 0.05), 0px 2px 4px -1px hsl(0 0% 0% / 0.05)",
    "shadow-lg": "0px 1px 4px 0px hsl(0 0% 0% / 0.05), 0px 4px 6px -1px hsl(0 0% 0% / 0.05)",
    "shadow-xl": "0px 1px 4px 0px hsl(0 0% 0% / 0.05), 0px 8px 10px -1px hsl(0 0% 0% / 0.05)",
    "shadow-2xl": "0px 1px 4px 0px hsl(0 0% 0% / 0.13)"
  }
}
```

**Nota**: Las sombras usan rgba con porcentaje de opacidad. Muy sutiles (3-13%) para mantener elegancia.

### 5.3 Tipografía

```json
{
  "fuentes": {
    "sans": {
      "familia": "Geist Mono, ui-monospace, monospace",
      "variable": "var(--font-sans)"
    },
    "mono": {
      "familia": "JetBrains Mono, monospace",
      "variable": "var(--font-mono)"
    },
    "serif": {
      "familia": "serif",
      "variable": "var(--font-serif)"
    }
  },
  "estilos": {
    "titulos_grandes": {
      "size": "56px",
      "weight": "700",
      "line_height": "1.2",
      "tracking": "var(--tracking-normal)"
    },
    "titulos_seccion": {
      "size": "18px",
      "weight": "600",
      "line_height": "1.4",
      "tracking": "var(--tracking-normal)"
    },
    "body": {
      "size": "14px",
      "weight": "400",
      "line_height": "1.6",
      "tracking": "var(--tracking-normal)"
    },
    "labels": {
      "size": "12px",
      "weight": "500",
      "line_height": "1.4",
      "color": "var(--muted-foreground)",
      "tracking": "var(--tracking-wide)"
    }
  }
}

### 5.4 Transiciones
- Hover buttons: `transition: all 0.2s ease`
- Cards: `transition: shadow 0.3s, transform 0.3s`
- Color changes: `transition: color 0.2s`

### 5.5 Responsive Design
- Desktop: Layout full (1400px max)
- Tablet: Cards apiladas, sidebar collapsible
- Mobile: Sidebar como drawer, layout vertical

---

## 6. TÉCNICAS DE CONTRASTE

### 6.1 Contraste de Luz
| Elemento | Luz | Oscuridad |
|----------|-----|----------|
| Fondo base | Blanco #FFF | Gris #F5F5F5 |
| Sidebar | Negro #1A1A1A | (ancla visual) |
| Texto primario | Negro #333 | Gris #666 |
| Upgrade card | Negro #1A1A1A | Botón blanco |

**WCAG AA**: Relación de contraste mínima 4.5:1 para texto

### 6.2 Contraste de Color
- **Azul + Rosa**: Complementarios suaves, nunca dominan
- **Monocromático + 2 colores**: Evita sobrecarga cromática
- **Neutralidad dominante**: 80% gris/blanco, 20% color

### 6.3 Contraste de Peso Visual
- **Cards KPI**: Peso ligero, abiertos, respiran
- **Upgrade**: Peso máximo, compacto, llama atención
- **Gráfico**: Peso medio, balanceado

### 6.4 Contraste de Tamaño
```
Números grandes (56px) vs Labels pequeños (12px)
= Diferencia 4.6x que fuerza atención
```

### 6.5 Contraste de Espacio Negativo
- Cards respiran con padding generoso
- Sidebar vacío define espacio
- Márgenes crean "aire" entre secciones

---

## 7. COMPONENTES ADICIONALES

### Headers con CTA
```json
{
  "header": {
    "layout": "flex",
    "justify": "space-between",
    "align": "center",
    "margin_bottom": "32px",
    "titulo": "My Organization",
    "botones": [
      {
        "tipo": "outline",
        "icono": "⚙️",
        "label": "Settings"
      },
      {
        "tipo": "primary",
        "icono": "+",
        "label": "Create a new scenario"
      }
    ]
  }
}
```

### Dropdown/Select Style
```json
{
  "select": {
    "border": "1px solid #D0D0D0",
    "border_radius": "6px",
    "padding": "8px 12px",
    "bg": "#FFFFFF",
    "color": "#333333",
    "font_size": "14px"
  }
}
```

---

## 8. GUÍA DE IMPLEMENTACIÓN PARA IA

### Checklist de Replicación
- [ ] Sidebar 80px, fondo negro, iconos blancos
- [ ] Contenido principal: fondo blanco, padding 40px
- [ ] Paleta: 3 tonos (blanco, gris, negro) + 2 acentos (azul, rosa)
- [ ] Tipografía: Sans-serif moderno, pesos 400/500/600/700
- [ ] Espaciado: Múltiplos de 8px
- [ ] Cards: Border sutile gris, shadow ligera, border-radius 12px
- [ ] KPI numbers: 56px bold
- [ ] Gráfico: Barras stacked, solo 5-6 elementos, porcentajes en picos
- [ ] Upgrade: Fondo negro, botón blanco, urgencia visual
- [ ] Transiciones: 0.2-0.3s ease

### Proporciones Clave
- Sidebar: 80px
- Contenido: Flexible, max 1400px
- Card KPI: ~50% ancho (con gap)
- Gráfico: 100% ancho, 280px alto
- Recomendados: Grid 2x2

---

## 9. EJEMPLOS CSS IMPLEMENTABLES

### Componente: Card KPI

```css
.kpi-card {
  background-color: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-sm);
  color: var(--card-foreground);
}

.kpi-card__title {
  font-size: 12px;
  font-weight: 500;
  color: var(--muted-foreground);
  letter-spacing: var(--tracking-wide);
  margin-bottom: 16px;
}

.kpi-card__number {
  font-size: 56px;
  font-weight: 700;
  color: var(--foreground);
  line-height: 1.2;
  margin-bottom: 12px;
}

.kpi-card__bar {
  display: flex;
  gap: 4px;
}

.kpi-card__segment {
  height: 6px;
  border-radius: var(--radius-sm);
  background-color: var(--chart-2);
  flex: 1;
}

.kpi-card__segment.empty {
  background-color: var(--muted);
}

.kpi-card__badge {
  background-color: var(--foreground);
  color: var(--background);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: 600;
  margin-top: 12px;
  display: inline-block;
}
```

### Componente: Button CTA (Upgrade)

```css
.btn-primary {
  background-color: var(--primary);
  color: var(--primary-foreground);
  padding: 12px 32px;
  border-radius: var(--radius-xl);
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}

.btn-primary:active {
  transform: translateY(0);
}

.upgrade-card {
  background-color: var(--foreground);
  color: var(--background);
  padding: 32px;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
}

.upgrade-card__title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.upgrade-card__subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 24px;
}
```

### Componente: Chart (Gráfico de Barras)

```css
.chart-container {
  padding: 24px;
  background-color: var(--card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  height: 280px;
}

.chart-bar {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: flex-end;
  gap: 0;
}

.chart-segment {
  border-radius: var(--radius-md) var(--radius-md) 0 0;
}

.chart-segment.primary {
  background-color: var(--chart-2);
}

.chart-segment.secondary {
  background-color: var(--chart-1);
}

.chart-label {
  font-size: 12px;
  color: var(--muted-foreground);
  text-align: center;
  margin-top: 8px;
}

.chart-percentage {
  background-color: var(--foreground);
  color: var(--background);
  font-size: 12px;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  margin-bottom: 4px;
  text-align: center;
}
```

---

## 10. ANTIPATRONES A EVITAR

❌ Usar muchos colores vibrantes simultáneamente
❌ Textos pequeños sin suficiente contraste
❌ Espaciado inconsistente
❌ Shadow excesivas (máx shadow-lg)
❌ Bordes gruesos (max 1px)
❌ Tipografía con múltiples pesos sin lógica
❌ Animaciones lentas o jarring (usar 0.2-0.3s)
❌ Cards sin definición clara de bordes
❌ Hardcodear colores en lugar de usar var(--color)
❌ Olvidar soporte dark mode con .dark class

---

## 11. QUICK START PARA IA

### Pasos para Replicar:

1. **Copiar Variables CSS**
```css
:root { /* Variables luz */ }
.dark { /* Variables oscuro */ }
```

2. **Estructura HTML Base**
```html
<div class="dashboard">
  <aside class="sidebar"></aside>
  <main class="content">
    <div class="kpi-card"></div>
    <div class="chart-container"></div>
  </main>
</div>
```

3. **Aplicar Estilos**
- Usar `var(--nombre-variable)` en lugar de valores hardcodeados
- Respetar espaciado múltiplos de 4px
- Máximo shadow-lg, mínimo shadow-sm
- Border radius: lg para cards, sm/md para elementos internos
- Tipografía: sans para UI, mono para código

4. **Testing**
- Verificar contraste con herramientas WCAG
- Probar light y dark mode
- Revisar responsive (mobile, tablet, desktop)

---

**Versión**: 2.0 (Con Variables CSS OKLCH)
**Última actualización**: Octubre 2025
**Propósito**: Referencia para replicación de dashboards profesionales con sistema de design tokens
**Basado en**: Sistema de variables CSS moderno con soporte dark mode automático