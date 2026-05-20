# DESIGN.md — Mashu Petfood

Design system reference for AI agents. Read this before generating any UI for this project.
Synthesized from 73 brand systems: Shopify, Nike, Apple, Airbnb, Starbucks, Stripe, Linear, Vercel, Framer, Ferrari, Spotify, Clay, Notion, Raycast, and more.

---

## 1. Brand Identity

**Project**: Mashu Petfood — e-commerce de alimentos naturales para mascotas + panel admin CRM.
**Personality**: Cálido, artesanal, premium accesible. Evoca tierra, naturaleza, confianza.
**Visual tone**: Photography-first. El producto y las mascotas son los protagonistas; la UI retrocede.
**Two-canvas rule** (Shopify pattern): Hero/marketing = dark + dramático. Grillas/transacciones = cream + suave.

---

## 2. Color Tokens

### Light Mode (Sitio público)

```css
--color-primary:        #E07B2B;  /* naranja — solo CTAs y estados activos */
--color-primary-hover:  #D46A1A;  /* 10% más oscuro en hover */
--color-primary-active: #C25910;  /* 15% más oscuro en active */
--color-primary-surface:#FFF5EA;  /* fondo suave para hover en nav/links */

--color-cream:          #FFF8F0;  /* canvas base */
--color-cream-1:        #FFFBF6;  /* elevación 1 — cards en reposo */
--color-cream-2:        #FFF5EA;  /* elevación 2 — cards en hover */
--color-cream-dark:     #E8D9C8;  /* elevación 3 — dividers, secciones */

--color-secondary:      #3B2A1A;  /* marrón medio — footer, sidebar admin */
--color-dark:           #1A1209;  /* marrón oscuro — texto primario, hero bg */

--color-text-primary:   #1A1209;  /* contraste 16:1 sobre cream */
--color-text-secondary: #6B5A4A;  /* metadatos, descripciones */
--color-text-muted:     #9D8C7C;  /* placeholders, hints, disabled */

--color-border:         #E8D9C8;  /* borde sutil en cards */
--color-border-strong:  #D4C4B4;  /* borde visible en inputs */

--color-success:        #2D7A3E;  /* verde — salud animal, stock ok */
--color-warning:        #D97A42;  /* naranja cálido — stock bajo */
--color-error:          #C74A42;  /* rojo — errores de formulario */
--color-info:           #4A7A9E;  /* azul — info nutricional, specs */
--color-accent:         #C74A42;  /* badge OFERTA */

--color-surface:        #FFFFFF;  /* cards blancas sobre canvas cream */
```

### Dark Mode (Admin panel únicamente)

```css
--admin-canvas:    #1A1209;  /* fondo base */
--admin-surface-1: #2A1F15;  /* cards, inputs */
--admin-surface-2: #3B2A1A;  /* sidebar, panels elevados */
--admin-surface-3: #4D3A2E;  /* modals, dropdowns */
--admin-border:    #4D3A2E;
--admin-text-1:    #FFFFFF;
--admin-text-2:    #B8A8A0;
--admin-text-3:    #8B7B6F;
--admin-accent:    #E07B2B;  /* naranja — solo acciones críticas */
```

### Reglas de uso de color (Nike/Spotify)
- `#E07B2B` aparece SOLO en: botón CTA primario, estado activo nav, badge, precio.
- Nunca usar naranja como decorativo o de fondo en secciones.
- En dark admin, el naranja es escaso — solo Save, Generar, Activar.
- Semantic colors: verde = salud/wellness, naranja-rojo = alerta, rojo = error destructivo.

---

## 3. Tipografía

### Stack

```css
--font-display: "Plus Jakarta Sans", "Inter Variable", system-ui, sans-serif;
--font-body:    "Inter Variable", -apple-system, system-ui, sans-serif;
--font-mono:    "Geist Mono", "JetBrains Mono", monospace; /* precios en admin */
```

### Escala (Linear + Apple)

| Token | Size | Weight | Line Height | Tracking | Uso |
|---|---|---|---|---|---|
| `display-xl` | 48px | 600 | 1.1 | 0 | Hero headline |
| `display-lg` | 36px | 600 | 1.15 | 0 | Titles de sección |
| `display-md` | 28px | 600 | 1.2 | 0 | Headings de página |
| `heading-xl` | 24px | 600 | 1.25 | 0 | Subtítulos |
| `heading-lg` | 20px | 600 | 1.3 | -0.01em | Títulos de card, modals |
| `heading-md` | 18px | 600 | 1.3 | -0.01em | Nombre de producto |
| `heading-sm` | 16px | 600 | 1.4 | -0.01em | Labels formulario |
| `body-lg`    | 16px | 400 | 1.6 | -0.01em | Descripción principal |
| `body`       | 14px | 400 | 1.6 | -0.01em | Cuerpo estándar |
| `body-sm`    | 13px | 400 | 1.5 | -0.01em | Secundario |
| `label`      | 12px | 500 | 1.4 | 0 | Tags, metadatos, ingredients |
| `label-sm`   | 11px | 500 | 1.3 | 0.05em | Admin hints, timestamps |
| `micro`      | 10px | 400 | 1.2 | 0.05em | Fine print |

### Reglas de tipografía (Notion + Apple)
- **Sentence case en CTAs** — "Agregar al carrito", no "AGREGAR AL CARRITO".
- **No tracking negativo agresivo** — máximo -0.01em en body. Evitar Apple's -0.028em.
- **Tabular figures en precios** — `font-variant-numeric: tabular-nums` en todos los números de precio/cantidad (patrón Stripe).
- **No pesos < 400** en display. Mínimo 600 para headlines. Calidez = peso visible.
- **Monospace en admin** — precios, cantidades, fechas en tablas usan Geist Mono con tnum.

---

## 4. Espaciado

### Base 8px (Starbucks/Ferrari)

```
4px  — micro gaps, icon padding
8px  — between inline elements
12px — tight compound elements
16px — default padding dentro de cards
20px — gap entre cards en grid
24px — padding generoso, gap entre secciones menores
32px — padding de modals, secciones features
48px — ritmo vertical entre secciones (regla Linear)
64px — separación de secciones grandes
80px — hero padding top/bottom
```

### Layout

- **Desktop**: 12 cols, 24px gutter, container max 1280px, padding 24px
- **Tablet**: 6 cols, 20px gutter, padding 20px
- **Mobile**: 4 cols, 16px gutter, padding 12px

### Product Grid
- Desktop >1024px: 4 columnas, 24px gutter
- Tablet 768–1024px: 3 columnas, 20px gutter
- Mobile <768px: 2 columnas, 16px gutter

### Touch targets
- Botones: mínimo 44px alto en móvil
- CTAs en móvil: width 100%

---

## 5. Border Radius

```
xs:   4px  — chips compactos, badges pequeños
sm:   6px  — badges, tags de categoría
base: 8px  — BOTONES (cálido, no pill) + inputs
md:   12px — product cards, containers medianos
lg:   16px — feature cards, panels grandes
xl:   20px — contenedores destacados
pill: 9999px — SOLO toggle switches (semántica)
circle: 50% — avatares
```

**Regla crítica**: Botones = 8px siempre. Nunca pill para botones (eso es SaaS clínico).
8px = artesanal, cálido, hecho a mano. Patrón Notion, opuesto a Shopify pills.

---

## 6. Elevación y Sombras

### Light mode — Surface Ladder (patrón Linear)
No usar shadows en light mode. Elevación = cambio de color de superficie.

```
Reposo:  background #FFFBF6 (cream-1)
Hover:   background #FFF5EA (cream-2) — señal de interactividad
Focus:   border naranja + inset shadow cálido
Modal:   shadow-lg únicamente
```

### Shadow tokens (dark mode / modals)
```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px rgba(0,0,0,0.08);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.12);
--shadow-xl: 0 20px 25px rgba(0,0,0,0.15);
--shadow-card: 0 2px 8px rgba(58,42,26,0.08); /* cálido marrón */
--shadow-input-focus: inset 0 0 0 2px #FFF5EA; /* Stripe focus pattern */
```

---

## 7. Componentes

### Botón Primario
```
bg: #E07B2B → hover #D46A1A → active scale(0.98)
text: #FFFFFF, 14px, weight 600, sentence case
padding: 12px 24px, radius: 8px
transition: background 100ms ease-out + scale 50ms
sin shadow en reposo
```

### Botón Secundario
```
bg: #F0E8DC → hover #E8D9C8
text: #1A1209, border: 1px solid #D4C4B4
mismos padding/radius
```

### Product Card (imagen-first, patrón Nike/Airbnb)
```
bg: #ffffff, border: 1px solid #E8D9C8, radius: 12px
imagen: full-bleed, aspect-ratio 4:3, objectFit: contain + padding 1rem
hover: bg #FFF5EA (NO scale, NO shadow lift)
imagen en hover: scale(1.05) dentro del contenedor
title: 18px/600/#1A1209
precio: 16px/600/#E07B2B (tabular-nums)
descripción: 14px/400/#6B5A4A
```

### Input
```
bg: #FFFFFF, border: 1.5px solid #D4C4B4, radius: 8px
padding: 12px 16px, font: 14px/400/#1A1209
placeholder: #9D8C7C
focus: border #E07B2B + inset shadow warm (NO blue glow)
error: border #C74A42 + shake animation
```

### Badge / Chip
```
bg: #E8D9C8, text: #1A1209, 12px/500, padding: 6px 12px, radius: 6px
activo: bg #E07B2B, text #FFFFFF
```

### Admin: Fila de tabla
```
bg: alternado #FFFFFF / #FFFBF6
border-bottom: 1px #E8D9C8
padding: 16px, font: 14px
hover: bg #FFF5EA
números: Geist Mono, tabular-nums, right-aligned
selected: left-border 3px #E07B2B
```

### Admin: Nav Item
```
bg activo: #4D3A2E, text activo: #FFFFFF/600
bg hover: #3B2A1A surface-2
text inactivo: #B8A8A0/400
indicador activo: left-border 3px #E07B2B
icon: 20px, gap 12px
```

### Modal
```
bg: #FFFFFF (light) / #2A1F15 (admin dark)
radius: 12px, shadow: shadow-lg
padding: 32px, max-width: 600px
overlay: rgba(0,0,0,0.3)
animación: opacity 0→1 + translateY(20px)→0, 300ms ease-out-cubic
```

---

## 8. Animaciones

### Duraciones (Framer/Raycast)
```
instant: 0ms
fast:    100ms — hover, focus
base:    200ms — transitions estándar
slow:    300ms — modals, page transitions
slower:  500ms — stagger lists, carousel
```

### Easing
```css
--ease-friendly:  cubic-bezier(0.19, 1, 0.22, 1); /* default — ligeramente bouncy */
--ease-smooth:    cubic-bezier(0.4, 0, 0.2, 1);   /* profesional, standard */
--ease-out:       cubic-bezier(0.25, 0.46, 0.45, 0.94); /* suave */
```

### Keyframes esenciales
```css
@keyframes shake {
  0%,100% { transform: translateX(0); }
  25%      { transform: translateX(-4px); }
  75%      { transform: translateX(4px); }
}
@keyframes pulse-warm {
  0%,100% { opacity: 0.6; }
  50%     { opacity: 0.4; }
}
@keyframes fade-up {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes stagger-in {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}
```

### Reglas de animación
- **Preferir color shift sobre movimiento** (Airbnb/Linear): Hover = cambio de color, no float ni scale de cards.
- **Scale solo en imágenes y botones**: scale(1.05) en img hover, scale(0.98) en button active.
- **Stagger de listas**: 30ms offset por item, animación fade-up de 200ms.
- **Skeleton loading**: pulse-warm 1.5s infinite en placeholders.
- **Exit más rápido que enter**: enter 200ms, exit 150ms.

---

## 9. Responsive

```
Mobile:   < 640px
Tablet:   640–1024px
Desktop:  1024–1440px
Large:    > 1440px
```

### Escalado tipográfico
- Display: 36px mobile → 48px desktop
- Heading: 20px mobile → 24px desktop
- Body: 14px mobile → 16px desktop

### Sidebar admin
- Mobile: drawer (bottom sheet o overlay lateral)
- Tablet: colapsable a solo iconos
- Desktop: 256px fijo

---

## 10. Patrones únicos a aplicar en Mashu

### Two-Canvas System (Shopify)
- **Sección hero/marketing**: fondo `#1A1209`, fotos full-bleed, texto blanco, botón naranja.
- **Sección productos/transaccional**: fondo `#FFF8F0` o `#F0E6D4`, cards blancas, UI suave.
- Transición entre ambos: gradiente `#1A1209 → #FFF8F0` o banda geométrica.

### Photography-First (Nike/Airbnb)
- Imagen ocupa 60–80% del card.
- Fondo del contenedor de imagen: `#ffffff` (no compite con la foto).
- La UI nunca debe distraer de la fotografía del producto.

### Surface Ladder Over Shadows (Linear)
- En light mode: elevación = calor. Base cream → cream-1 → cream-2. Sin shadows.
- En dark admin: elevación = shadows-sm/md sutiles.

### Tabular Figures (Stripe)
- TODO elemento con precio/cantidad: `font-variant-numeric: tabular-nums`.
- En admin tables: Geist Mono + tnum para alineación perfecta.

### Seasonal Variation (Clay)
- Campaña navideña: cream → peach gradient (`#FFE8D4`)
- Categoría gatos: cream levemente más fría (`#F8F5F0`)
- Esto se implementa vía CSS custom property override por sección/ruta.

### Premium Card Hover (Ferrari/Lamborghini)
- En hover: imagen escala suavemente, card background sube un nivel en el surface ladder.
- Efecto 3D: Aceternity CardContainer ya instalado en `/components/ui/3d-card.tsx`.

---

## 11. Instrucciones para Agentes de IA

Al construir cualquier componente para este proyecto:

1. **Paleta**: Usar exactamente los tokens de color de la sección 2. Hardcodear HEX si el CSS var no está disponible.
2. **Botones**: Siempre 8px radius. Nunca pill. Sentence case.
3. **Cards e-commerce**: imagen-first, sin shadow en light mode, hover = surface shift.
4. **Admin panel**: dark mode por defecto (#1A1209 canvas, #3B2A1A sidebar).
5. **Precios**: siempre `font-variant-numeric: tabular-nums`.
6. **Animaciones**: preferir color shift sobre transform en hover de containers.
7. **Tipografía**: Plus Jakarta Sans (display) + Inter (body). Mínimo weight 400.
8. **Spacing**: múltiplos de 8px. Ritmo vertical 48px entre secciones.
9. **Breakpoints**: 640 / 1024 / 1440px.
10. **Two-canvas**: hero = dark dramático, productos = cream suave.

### Stack técnico
- Next.js 16.2.6 App Router, Server Components, Server Actions
- Tailwind CSS v4 (CSS-first via `@theme inline` en globals.css)
- Supabase (auth SSR + DB)
- Vercel deploy
- `lib/utils.ts` con `cn()` disponible
- Aceternity 3D Card en `/components/ui/3d-card.tsx`
