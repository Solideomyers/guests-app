# Guía Completa: Formularios UI/UX de Alto Rendimiento

## Introducción

Los formularios son **el corazón de la conversión digital**. Un mal formulario destruye conversiones, frustra usuarios y quiebra funnels. Esta guía contiene 15 tips precisos y accionables para diseñar formularios que respeten al usuario y maximicen conversiones.

---

## PARTE 1: ARQUITECTURA Y LAYOUT

### Tip #1: Labels Siempre Visibles

#### ❌ Error Común
```
Usuario escribiendo → label desaparece → usuario no puede validar su entrada
```

#### ✅ Solución Correcta
- **Mantener labels SIEMPRE visibles**, incluso después de llenar el campo
- Los labels sirven como **referencia continua** durante y después de la entrada
- Permiten validación visual fácil
- Facilitan ediciones posteriores sin confusión

#### Implementación CSS
```css
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  position: static; /* NO usar position: absolute */
  opacity: 1;      /* SIEMPRE visible */
  pointer-events: auto;
}

.form-input:focus ~ .form-label {
  /* El label NO desaparece */
}

/* ❌ NUNCA HACER */
.form-input:not(:placeholder-shown) ~ .form-label {
  opacity: 0;  /* Label desaparece = UX MALA */
}
```

#### Componente React
```jsx
<div className="form-group">
  <label htmlFor="email" className="form-label">
    Email Address
  </label>
  <input 
    id="email"
    type="email"
    placeholder="name@example.com"
    className="form-input"
  />
</div>
```

---

### Tip #2: Evitar Layout en Z-Pattern (Grid Horizontal)

#### El Problema
```
┌─────────────┬─────────────┐
│ Campo 1     │ Campo 2     │  ← Usuario zigzaguea
├─────────────┼─────────────┤
│ Campo 3     │ Campo 4     │  ← No es flujo natural
└─────────────┴─────────────┘
```

**Resultado**: Confusión, escaneo ineficiente, tasa de abandono aumenta.

#### ✅ Solución: Layout Vertical (F-Pattern)

```
┌──────────────────────────┐
│ Campo 1                  │
│                          │
├──────────────────────────┤
│ Campo 2                  │
│                          │
├──────────────────────────┤
│ Campo 3                  │
│                          │
└──────────────────────────┘
```

**Beneficios**:
- Usuarios escanean verticalmente (patrón F natural)
- Flujo de lectura clara: arriba → abajo
- Menos confusión y mayor velocidad de completación
- Mejor accesibilidad

#### Implementación CSS
```css
.form-container {
  display: flex;
  flex-direction: column;
  gap: 24px; /* Espaciado generoso */
  max-width: 500px;
  margin: 0 auto;
}

/* ❌ NUNCA */
.form-container {
  display: grid;
  grid-template-columns: 1fr 1fr; /* Z-Pattern */
}
```

#### Excepción Permitida
Campos muy cortos (código postal + país) pueden estar lado a lado SI:
- Son lógicamente relacionados
- Total no excede 2 campos por fila
- Todos tienen similar longitud

```css
.form-row-compact {
  display: grid;
  grid-template-columns: 2fr 1fr; /* Zip + Country */
  gap: 16px;
}
```

---

### Tip #3: Labels ARRIBA de los Campos (No Izquierda)

#### Comparativa

| Posición | Ventajas | Desventajas |
|----------|----------|-------------|
| **Arriba (TOP)** | Máximo escaneo vertical, menos espacio horizontal, moderno | Usa más altura |
| **Izquierda (LEFT)** | Compacto verticalmente | Crea Z-Pattern, requiere ancho mínimo, menos moderno |

#### ✅ Recomendación: TOP Label

```css
.form-group--top {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group--top .form-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 4px;
}

.form-group--top .form-input {
  padding: 12px 16px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 14px;
}
```

#### Si DEBES usar LEFT Label (formulario muy simple < 2 campos)

```css
.form-group--left {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 16px;
  align-items: center;
}

.form-group--left .form-label {
  text-align: right; /* 🔑 CRUCIAL: Right-align para simetría */
  font-weight: 500;
  padding-right: 8px;
}
```

#### Componente HTML
```html
<!-- ✅ CORRECTO: TOP LABEL -->
<div class="form-group--top">
  <label for="password">Password</label>
  <input id="password" type="password" />
</div>

<!-- ⚠️ SOLO SI NECESARIO: LEFT LABEL -->
<div class="form-group--left">
  <label for="code" style="text-align: right;">Code:</label>
  <input id="code" type="text" />
</div>
```

---

### Tip #4: Agrupar Campos Relacionados en Sub-secciones

#### Problema de Formularios Largos
Formularios > 5-7 campos desaniman completación. Tasa de abandono sube exponencialmente.

#### Solución: Segmentación Visual

```
┌─────────────────────────────────────┐
│  📋 INFORMACIÓN PERSONAL             │
├─────────────────────────────────────┤
│ [Nombre]                            │
│ [Email]                             │
│ [Teléfono]                          │
│                                     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  🏠 DIRECCIÓN                       │
├─────────────────────────────────────┤
│ [Calle]                             │
│ [Ciudad] [Código Postal]            │
│                                     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  💳 INFORMACIÓN DE PAGO             │
├─────────────────────────────────────┤
│ [Número Tarjeta]                    │
│ [Exp] [CVV]                         │
│ [Cardholder Name]                   │
│                                     │
└─────────────────────────────────────┘
```

#### Implementación CSS
```css
.form-section {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
  margin-bottom: 24px;
}

.form-section__title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--border);
}

.form-section__title::before {
  content: ''; /* Icono */
  width: 24px;
  height: 24px;
}

.form-section__fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
```

#### Ventaja Extra: Save por Sección
```css
.form-section__footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
  display: flex;
  gap: 8px;
}

.btn-save-section {
  padding: 10px 16px;
  background: var(--primary);
  color: var(--primary-foreground);
  border: none;
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
}
```

#### React Component
```jsx
<div className="form-section">
  <h3 className="form-section__title">
    <span>💳</span> Información de Pago
  </h3>
  <div className="form-section__fields">
    <input type="text" placeholder="Nombre en tarjeta" />
    <input type="text" placeholder="Número de tarjeta" />
  </div>
  <div className="form-section__footer">
    <button className="btn-save-section">Guardar</button>
  </div>
</div>
```

---

## PARTE 2: POSICIONAMIENTO Y FLUJO

### Tip #5: Botón CTA Cerca del Final del Formulario

#### User Flow Esperado
```
1. Escanear campos
2. Llenar campos (uno por uno)
3. Buscar botón de envío
4. Hacer clic en botón
```

#### ✅ Respeta el Flow Natural
- Coloca el botón **inmediatamente después del último campo**
- No lo dupliques en la parte superior
- Aplica **Fitts's Law**: minimiza distancia a target

#### ❌ Errores Comunes
```
--- Botón Submit en TOP (confuso, 1er instinto es llenar form)
[Nombre]
[Email]
[Teléfono]
--- Botón Submit AQUÍ (OK, pero tardío si es long form)
```

#### Implementación CSS
```css
.form-wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
  justify-content: flex-end;
}

.btn-submit {
  padding: 12px 32px;
  background: var(--primary);
  color: var(--primary-foreground);
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  min-width: 120px;
}
```

#### Fitts's Law en Acción
```
Tamaño grande + Ubicación predecible = Menor tiempo de adquisición
```

---

### Tip #6: Espaciado Generoso (White Space)

#### El Poder del Espacio en Blanco

| Espaciado | Percepción | Resultado |
|-----------|-----------|-----------|
| **Muy Denso** | Abrumador, claustrofóbico | Abandono ↑ |
| **Balanceado** | Profesional, respirable | Conversión ↑ |
| **Excesivo** | Desorganizado, vacío | Confusión |

#### Implementación de Espaciado Jerarquizado
```css
/* ENTRE CAMPOS (dentro de sección) */
.form-group {
  margin-bottom: 16px; /* 2 × 8px */
}

/* ENTRE SECCIONES */
.form-section {
  margin-bottom: 32px; /* 4 × 8px */
}

/* ENTRE SECCIÓN Y BOTÓN */
.form-actions {
  margin-top: 32px;
}

/* PADDING INTERNO DE CARDS */
.form-section {
  padding: 24px; /* 3 × 8px */
}

/* DENTRO DE INPUT */
.form-input {
  padding: 12px 16px; /* 1.5 × 8px vertical, 2 × 8px horizontal */
}
```

#### Regla del Sistema 8px
```
Base = 8px
Espaciados: 8, 16, 24, 32, 40...
Nunca valores raros como 11px, 13px, 27px
```

#### Visualización
```
┌────────────────────────────────┐
│ [16px]                         │
│ ┌──────────────────────────┐   │
│ │ Nombre                   │   │ 24px padding
│ │ [Input 16px padding]     │   │
│ └──────────────────────────┘   │
│ [16px]                         │
│ ┌──────────────────────────┐   │
│ │ Email                    │   │
│ │ [Input]                  │   │
│ └──────────────────────────┘   │
│                                │
└────────────────────────────────┘
  32px gap entre secciones
```

---

## PARTE 3: INFORMACIÓN Y VALIDACIÓN

### Tip #7: Indicar Solo lo NECESARIO (Regla de Contrarios)

#### Principio Core: Omitir Ruido

```
Regla: Si 3 de 4 campos son REQUERIDOS
      → Solo marca el 1 OPCIONAL con "Optional"
```

```
Regla: Si 3 de 4 campos son OPCIONALES
      → Solo marca los REQUERIDOS con "*" o "Required"
```

#### Implementación CSS/HTML

```html
<!-- Escenario 1: Mayoría requerida -->
<div class="form-group">
  <label for="name">
    Full Name
    <span class="required-indicator">*</span>
  </label>
  <input id="name" type="text" required />
</div>

<div class="form-group">
  <label for="nickname">
    Nickname
    <span class="optional-badge">Optional</span>
  </label>
  <input id="nickname" type="text" />
</div>

<!-- Escenario 2: Mayoría opcional -->
<div class="form-group">
  <label for="company">
    Company Name
  </label>
  <input id="company" type="text" />
</div>

<div class="form-group">
  <label for="tax_id">
    Tax ID
    <span class="required-indicator">*</span>
  </label>
  <input id="tax_id" type="text" required />
</div>
```

#### CSS para Indicadores
```css
.required-indicator {
  color: var(--destructive);
  font-weight: 700;
  margin-left: 4px;
}

.optional-badge {
  display: inline-block;
  background: var(--muted);
  color: var(--muted-foreground);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: 500;
  margin-left: 8px;
}
```

---

### Tip #8: Mensajes de Error Específicos y Útiles

#### ❌ Errores Genéricos (Inútiles)
```
"Invalid input"
"Error"
"Please fix"
"Validation failed"
```

#### ✅ Errores Específicos (Útiles)
```
"Email must be a valid format (example@domain.com)"
"Password must be 8+ characters with at least 1 uppercase"
"Phone number must be 10 digits"
"This email is already registered"
"Username already taken. Try: john_doe_123"
```

#### Componente Error Message
```css
.form-group--error {
  position: relative;
}

.form-input--error {
  border-color: var(--destructive);
  background-color: hsla(0, 100%, 50%, 0.03);
}

.form-error-message {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--destructive);
  margin-top: 6px;
  font-weight: 500;
}

.form-error-message::before {
  content: '⚠️';
  font-size: 14px;
}
```

#### React Error Handler
```jsx
const [errors, setErrors] = useState({});

const handleEmailChange = (e) => {
  const email = e.target.value;
  
  if (!email.includes('@')) {
    setErrors(prev => ({
      ...prev,
      email: 'Email must include @ symbol'
    }));
  } else if (!email.includes('.')) {
    setErrors(prev => ({
      ...prev,
      email: 'Email must include domain (example@domain.com)'
    }));
  } else {
    setErrors(prev => ({ ...prev, email: null }));
  }
};

return (
  <div className={`form-group ${errors.email ? 'form-group--error' : ''}`}>
    <label htmlFor="email">Email</label>
    <input
      id="email"
      type="email"
      onChange={handleEmailChange}
      className={errors.email ? 'form-input--error' : ''}
    />
    {errors.email && (
      <div className="form-error-message">
        {errors.email}
      </div>
    )}
  </div>
);
```

---

## PARTE 4: ELEMENTOS Y CAMPOS

### Tip #9: Elegir el Elemento UI Correcto

#### Dropdown vs Radio Buttons

| Elemento | Cuándo Usar | Ventajas | Desventajas |
|----------|-----------|----------|-------------|
| **Radio Buttons** | ≤ 3 opciones | Todas visibles, rápida decisión | Ocupa espacio |
| **Dropdown** | > 3 opciones | Compacto, oculta opciones | Requiere click extra |

#### Regla de Oro
```
< 3 opciones → Radio Buttons
3+ opciones → Dropdown (pero prueba si 3 opciones es mejor)
```

#### Implementación HTML/CSS

```html
<!-- ✅ CORRECTO: 2 opciones = Radio -->
<div class="form-group">
  <label class="form-label">Delivery Type</label>
  <div class="radio-group">
    <div class="radio-item">
      <input type="radio" id="fast" name="delivery" value="fast" />
      <label for="fast" class="radio-label">Fast (2 days)</label>
    </div>
    <div class="radio-item">
      <input type="radio" id="standard" name="delivery" value="standard" />
      <label for="standard" class="radio-label">Standard (5 days)</label>
    </div>
  </div>
</div>

<!-- ✅ CORRECTO: 8 opciones = Dropdown -->
<div class="form-group">
  <label htmlFor="country" class="form-label">Country</label>
  <select id="country" class="form-select">
    <option value="">Select a country...</option>
    <option value="usa">United States</option>
    <option value="uk">United Kingdom</option>
    <!-- ... más opciones ... -->
  </select>
</div>
```

#### CSS para Radio Buttons
```css
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.radio-item input[type="radio"] {
  cursor: pointer;
  width: 20px;
  height: 20px;
  accent-color: var(--primary);
}

.radio-label {
  cursor: pointer;
  font-size: 14px;
  font-weight: 400;
  color: var(--foreground);
}
```

#### CSS para Dropdown
```css
.form-select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--background);
  color: var(--foreground);
  font-size: 14px;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml...");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 40px;
}

.form-select:hover {
  border-color: var(--primary);
}

.form-select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px hsla(var(--primary-h), 100%, 50%, 0.1);
}
```

---

### Tip #10: Placeholder Ejemplos, No Genéricos

#### ❌ Placeholders Pobres
```
"Enter your email" → ¿Qué formato esperas?
"Name" → ¿Nombre y Apellido juntos?
"Date" → ¿DD/MM/YYYY o MM/DD/YYYY?
"Phone" → ¿Con código de país?
```

#### ✅ Placeholders Ejemplares
```
"john.doe@gmail.com"
"Jane Smith"
"25/12/1990"
"+1 (555) 123-4567"
```

#### Implementación
```html
<input 
  type="email" 
  placeholder="john.doe@gmail.com"
  aria-label="Email address"
/>

<input 
  type="text" 
  placeholder="Jane Smith"
  aria-label="Full name"
/>

<input 
  type="date" 
  placeholder="DD/MM/YYYY"
  aria-label="Date of birth"
/>

<input 
  type="tel" 
  placeholder="+1 (555) 123-4567"
  aria-label="Phone number"
/>
```

#### CSS Styling
```css
.form-input::placeholder {
  color: var(--muted-foreground);
  opacity: 0.6;
  font-style: italic;
  font-size: 13px;
}

.form-input:focus::placeholder {
  opacity: 1; /* Más visible con focus */
}
```

---

### Tip #11: Un Único CTA Principal

#### ❌ Problema: Múltiples CTAs
```
┌──────────────────────────────┐
│ [Submit] [Save] [Later] [Send]│  ← Confusión
└──────────────────────────────┘
```

Usuario no sabe qué hacer primero. Decisión paraliza.

#### ✅ Solución: 1 Primary + Secondary

```
┌────────────────────────────────────┐
│        [SUBMIT PRIMARY]             │ ← Destacado
│ [Save for Later] [Cancel]           │ ← Secundarios (menos prominentes)
└────────────────────────────────────┘
```

#### Implementación CSS
```css
.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;
}

/* PRIMARY BUTTON */
.btn-primary {
  padding: 12px 32px;
  background: var(--primary);
  color: var(--primary-foreground);
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  min-width: 120px;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  opacity: 0.9;
  box-shadow: var(--shadow-lg);
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
}

/* SECONDARY BUTTON */
.btn-secondary {
  padding: 12px 24px;
  background: transparent;
  color: var(--muted-foreground);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: var(--muted);
  color: var(--foreground);
}

/* TERTIARY BUTTON */
.btn-tertiary {
  padding: 12px 24px;
  background: transparent;
  color: var(--muted-foreground);
  border: none;
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
}

.btn-tertiary:hover {
  color: var(--foreground);
}
```

#### React Component
```jsx
<div className="form-actions">
  <button className="btn-primary">
    Create Account
  </button>
  <button className="btn-secondary">
    Save for Later
  </button>
  <button className="btn-tertiary">
    Cancel
  </button>
</div>
```

---

## PARTE 5: COPYWRITING Y SEMÁNTICA

### Tip #12: Botones con Verbos Accionables

#### ❌ Genéricos (Malos)
```
"Submit"
"Send"
"Next"
"Go"
"OK"
```

#### ✅ Accionables (Buenos)
```
"Create Account" ← Específico, claro
"Subscribe Now" ← Urgencia + acción
"Continue to Checkout" ← Claro próximo paso
"Save Changes" ← Qué sucederá
"Download Report" ← Resultado específico
"Join Community" ← Beneficio
"Get Access" ← Resultado
```

#### Patrones de Copywriting
```
[Verbo Accionable] + [Objeto/Beneficio] + [Énfasis Opcional]

Ejemplos:
- "Create Your Account" (objeto + posesión)
- "Save Changes" (objeto simple)
- "Subscribe for Updates" (razón)
- "Download PDF Now" (tipo + urgencia)
- "Get 50% Off" (beneficio cuantificado)
```

#### Implementación
```html
<!-- Login Form -->
<button type="submit" class="btn-primary">
  Sign In to Your Account
</button>

<!-- Registration Form -->
<button type="submit" class="btn-primary">
  Create Account
</button>

<!-- Newsletter -->
<button type="submit" class="btn-primary">
  Subscribe Now
</button>

<!-- Checkout -->
<button type="submit" class="btn-primary">
  Complete Purchase
</button>

<!-- Feedback Form -->
<button type="submit" class="btn-primary">
  Send Feedback
</button>
```

---

### Tip #13: Tipos de Input Específicos (No Abuso de Text)

#### Problema
```html
<!-- ❌ MALO: Todo es text -->
<input type="text" placeholder="user@example.com" />
<input type="text" placeholder="1990-05-15" />
<input type="text" placeholder="+1 555 1234" />
```

#### Solución: Usar Tipos Semánticos
```html
<!-- ✅ CORRECTO -->
<input type="email" placeholder="user@example.com" />
<input type="date" placeholder="1990-05-15" />
<input type="tel" placeholder="+1 555 1234" />
<input type="number" min="0" max="150" />
<input type="password" />
<input type="url" placeholder="https://example.com" />
<input type="time" />
<input type="color" />
```

#### Ventajas del Tipo Correcto
| Type | Beneficio |
|------|-----------|
| `email` | Validación automática, teclado móvil especial |
| `date` | Datepicker nativo, formato correcto |
| `tel` | Teclado numérico en móvil |
| `number` | Spinners +/-, validación numérica |
| `password` | Ocultamiento de caracteres |
| `url` | Validación de URL, teclado móvil con .com |
| `time` | Time picker nativo |
| `color` | Color picker nativo |

#### Implementación Completa
```html
<form class="form-container">
  <!-- Email con validación automática -->
  <div class="form-group">
    <label for="email">Email Address</label>
    <input 
      id="email"
      type="email" 
      placeholder="you@example.com"
      required
    />
  </div>

  <!-- Date con datepicker -->
  <div class="form-group">
    <label for="birthday">Date of Birth</label>
    <input 
      id="birthday"
      type="date" 
      min="1900-01-01"
      max="2023-01-01"
      required
    />
  </div>

  <!-- Tel con formato -->
  <div class="form-group">
    <label for="phone">Phone</label>
    <input 
      id="phone"
      type="tel" 
      pattern="[0-9+\-\s()]*"
      placeholder="+1 (555) 123-4567"
    />
  </div>

  <!-- Number con rangos -->
  <div class="form-group">
    <label for="age">Age</label>
    <input 
      id="age"
      type="number" 
      min="0"
      max="120"
      placeholder="18"
    />
  </div>

  <!-- URL con validación -->
  <div class="form-group">
    <label for="website">Website</label>
    <input 
      id="website"
      type="url" 
      placeholder="https://example.com"
    />
  </div>
</form>
```

---

## PARTE 6: RESTRICCIONES Y LÍMITES

### Tip #14: Comunicar Limitaciones ANTES

#### Problema: Descubrir Límites Después
```
Usuario escribe 500 caracteres...
Error: "Maximum 140 characters"
Usuario frustrado, abandona formulario.
```

#### ✅ Solución: Informar Límites Previos

```
"Bio (max 140 characters)"
"Password must be 8+ characters"
"Phone: 10 digits"
```

#### Implementación CSS/HTML

```html
<!-- Con texto informativo -->
<div class="form-group">
  <label for="bio">
    Bio
    <span class="field-hint">(max 140 characters)</span>
  </label>
  <textarea 
    id="bio"
    maxlength="140"
    placeholder="Tell us about yourself..."
  ></textarea>
  <div class="field-counter">
    <span id="char-count">0</span> / 140
  </div>
</div>

<!-- Con requerimientos -->
<div class="form-group">
  <label for="password">
    Password
    <span class="field-hint">(8+ chars, 1 uppercase, 1 number)</span>
  </label>
  <input 
    id="password"
    type="password"
    minlength="8"
    pattern="^(?=.*[A-Z])(?=.*\d).{8,}$"
  />
  <div class="requirements-checklist" id="pwd-requirements">
    <div class="requirement">
      <span class="requirement-icon">✗</span>
      At least 8 characters
    </div>
    <div class="requirement">
      <span class="requirement-icon">✗</span>
      One uppercase letter
    </div>
    <div class="requirement">
      <span class="requirement-icon">✗</span>
      One number
    </div>
  </div>
</div>

<!-- Con rango de números -->
<div class="form-group">
  <label for="quantity">
    Quantity
    <span class="field-hint">(1-999)</span>
  </label>
  <input 
    id="quantity"
    type="number" 
    min="1"
    max="999"
    value="1"
  />
</div>

<!-- Con formato específico -->
<div class="form-group">
  <label for="card">
    Card Number
    <span class="field-hint">(16 digits, no spaces)</span>
  </label>
  <input 
    id="card"
    type="text"
    placeholder="0000 0000 0000 0000"
    pattern="[0-9\s]{16,}"
    inputmode="numeric"
  />
</div>
```

#### CSS para Indicadores

```css
.field-hint {
  display: inline-block;
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
  margin-left: 6px;
}

.field-counter {
  display: flex;
  justify-content: flex-end;
  font-size: 12px;
  color: var(--muted-foreground);
  margin-top: 6px;
}

.field-counter.warning {
  color: var(--destructive);
}

/* Checklist de Requerimientos */
.requirements-checklist {
  margin-top: 12px;
  padding: 12px;
  background: var(--muted);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.requirement {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--muted-foreground);
}

.requirement-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: transparent;
  color: var(--destructive);
  font-size: 12px;
}

.requirement.met .requirement-icon {
  background: var(--primary);
  color: var(--primary-foreground);
  content: '✓';
}
```

#### React - Validador en Tiempo Real

```jsx
const PasswordValidator = () => {
  const [password, setPassword] = useState('');
  
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*]/.test(password)
  };
  
  const allMet = Object.values(requirements).every(val => val);

  return (
    <div className="form-group">
      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={allMet ? 'form-input--valid' : ''}
      />
      
      <div className="requirements-checklist">
        <div className={`requirement ${requirements.length ? 'met' : ''}`}>
          <span className="requirement-icon">
            {requirements.length ? '✓' : '✗'}
          </span>
          At least 8 characters
        </div>
        <div className={`requirement ${requirements.uppercase ? 'met' : ''}`}>
          <span className="requirement-icon">
            {requirements.uppercase ? '✓' : '✗'}
          </span>
          One uppercase letter
        </div>
        <div className={`requirement ${requirements.number ? 'met' : ''}`}>
          <span className="requirement-icon">
            {requirements.number ? '✓' : '✗'}
          </span>
          One number
        </div>
        <div className={`requirement ${requirements.special ? 'met' : ''}`}>
          <span className="requirement-icon">
            {requirements.special ? '✓' : '✗'}
          </span>
          One special character
        </div>
      </div>
    </div>
  );
};
```

---

### Tip #15: Validación Inline en Tiempo Real

#### Niveles de Validación

```
1. ONCHANGE     → Mientras el usuario escribe (suave)
2. ONBLUR       → Cuando el usuario sale del campo (medio)
3. ONSUBMIT     → Al intentar enviar (crítico)
```

#### Implementación Completa

```jsx
const FormWithValidation = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirm: ''
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // 1. VALIDACIÓN onChange (suave)
  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) return 'Invalid email format';
    return '';
  };

  const validatePassword = (pwd) => {
    if (!pwd) return 'Password is required';
    if (pwd.length < 8) return 'Must be 8+ characters';
    if (!/[A-Z]/.test(pwd)) return 'Need 1 uppercase letter';
    if (!/\d/.test(pwd)) return 'Need 1 number';
    return '';
  };

  const validateConfirm = (confirm, password) => {
    if (!confirm) return 'Confirm password is required';
    if (confirm !== password) return 'Passwords do not match';
    return '';
  };

  // 2. Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validar en tiempo real si el campo fue tocado
    if (touched[name]) {
      const newErrors = { ...errors };
      
      if (name === 'email') {
        newErrors.email = validateEmail(value);
      } else if (name === 'password') {
        newErrors.password = validatePassword(value);
        // Revalidar confirmación si existe
        if (formData.confirm) {
          newErrors.confirm = validateConfirm(formData.confirm, value);
        }
      } else if (name === 'confirm') {
        newErrors.confirm = validateConfirm(value, formData.password);
      }
      
      setErrors(newErrors);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validar al salir del campo
    const newErrors = { ...errors };
    
    if (name === 'email') {
      newErrors.email = validateEmail(formData.email);
    } else if (name === 'password') {
      newErrors.password = validatePassword(formData.password);
    } else if (name === 'confirm') {
      newErrors.confirm = validateConfirm(formData.confirm, formData.password);
    }
    
    setErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 3. Validar todo al enviar
    const newErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirm: validateConfirm(formData.confirm, formData.password)
    };
    
    setErrors(newErrors);
    setTouched({ email: true, password: true, confirm: true });
    
    // Si no hay errores, enviar
    if (Object.values(newErrors).every(err => !err)) {
      console.log('Form valid, submitting...', formData);
      // Enviar a servidor
    }
  };

  const renderField = (name, type, label, placeholder) => {
    const hasError = errors[name] && touched[name];
    
    return (
      <div className={`form-group ${hasError ? 'form-group--error' : ''}`}>
        <label htmlFor={name} className="form-label">
          {label}
          {name !== 'confirm' && <span className="required-indicator">*</span>}
        </label>
        <input
          id={name}
          type={type}
          name={name}
          value={formData[name]}
          placeholder={placeholder}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`form-input ${hasError ? 'form-input--error' : ''}`}
        />
        {hasError && (
          <div className="form-error-message">
            {errors[name]}
          </div>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      {renderField('email', 'email', 'Email', 'user@example.com')}
      {renderField('password', 'password', 'Password', '••••••••')}
      {renderField('confirm', 'password', 'Confirm Password', '••••••••')}
      
      <div className="form-actions">
        <button type="submit" className="btn-primary">
          Create Account
        </button>
      </div>
    </form>
  );
};
```

---

## ANEXO: CHECKLIST DE IMPLEMENTACIÓN

### ✅ Arquitectura y Layout
- [ ] Labels siempre visibles (nunca en placeholder)
- [ ] Layout vertical (no grid Z-pattern)
- [ ] Labels ARRIBA de inputs
- [ ] Si labels izquierda: right-aligned
- [ ] Campos relacionados agrupados en secciones
- [ ] Cada sección con borde y padding
- [ ] Opción de Save por sección

### ✅ Espaciado y Visual
- [ ] Espaciado 8px: gap 16px entre campos, 32px entre secciones
- [ ] Padding 24px en cards
- [ ] Padding 12px en inputs
- [ ] Border-radius consistente (lg en cards, md en inputs)
- [ ] Sombra máximo shadow-lg
- [ ] Alto contraste texto/fondo (WCAG AA+)

### ✅ Flujo y CTA
- [ ] Botón submit al final del formulario
- [ ] Un solo CTA principal (color primario)
- [ ] Botones secundarios menos prominentes
- [ ] Aplicar Fitts's Law (target fácil de clickear)
- [ ] Transiciones suave 0.2-0.3s

### ✅ Información y Validación
- [ ] Indicadores: solo marcar lo necesario (regla opuesta)
- [ ] Errores específicos y útiles
- [ ] Mostrar límites ANTES (maxlength, min/max)
- [ ] Contador de caracteres si aplica
- [ ] Validación onChange, onBlur y onSubmit

### ✅ Elementos y Campos
- [ ] ≤3 opciones: Radio buttons
- [ ] >3 opciones: Dropdown
- [ ] Placeholders: ejemplos reales, no genéricos
- [ ] Input types específicos: email, date, tel, number, etc.
- [ ] Verbos accionables en botones
- [ ] Aria-labels en inputs críticos

### ✅ Mobile y Accesibilidad
- [ ] Tamaño mínimo botones: 44x44px
- [ ] Inputs responsive (100% width en mobile)
- [ ] Labels legibles sin zoom
- [ ] Contraste 4.5:1 texto normal, 3:1 texto grande
- [ ] Navegación por Tab funcional
- [ ] Focus ring visible

---

## RESUMEN: LOS 15 TIPS EN UNA LÍNEA

| # | Tip | Regla |
|---|-----|-------|
| 1 | Labels Visibles | Siempre visible, incluso post-llenado |
| 2 | No Z-Pattern | Layout vertical, no grid horizontal |
| 3 | Labels Arriba | TOP label > LEFT label (excepto 1-2 campos) |
| 4 | Agrupar Campos | Sub-secciones con 5-7 campos máximo |
| 5 | CTA al Final | Near end, aplicar Fitts's Law |
| 6 | White Space | Gap 16px campos, 32px secciones |
| 7 | Solo Necesario | Marcar solo lo contrario (mayoría) |
| 8 | Errores Específicos | No "Error" genérico, detalles de qué/cómo |
| 9 | UI Correcto | ≤3 ops: radio, >3 ops: dropdown |
| 10 | Placeholders Reales | Ejemplos no genéricos |
| 11 | 1 CTA Principal | Uno primario, secundarios menos visibles |
| 12 | Verbos Accionables | "Create", "Subscribe", no "Submit" |
| 13 | Input Types Correctos | email, date, tel, number, password, etc. |
| 14 | Comunicar Límites | Max/min ANTES en label o hint |
| 15 | Validación Inline | onChange (suave), onBlur (medio), onSubmit (crítico) |

---

## RECURSOS Y REFERENCIAS

**Principios Mencionados**:
- [Fitts's Law](https://lawsofux.com/fittss-law/) - Tiempo de adquisición de target
- [F-Pattern](https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/) - Patrón natural de lectura
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/) - Estándares de accesibilidad

**Herramientas de Testing**:
- WebAIM Contrast Checker (WCAG)
- Lighthouse (accesibilidad)
- FormDebug (validación)

---

**Versión**: 1.0
**Basado en**: 15 UI Tips for Better Forms - UIDesign.Tips
**Propósito**: Guía técnica precisa para desarrolladores y diseñadores
**Último Update**: Octubre 2025