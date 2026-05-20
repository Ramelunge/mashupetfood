---
name: mashu-petfood-web
description: Use when building any part of Mashu Petfood — landing page, admin panel, CRM, catálogo, novedades, mantenimiento, carrito WhatsApp, or any component/page of this project.
license: MIT
metadata:
  author: Roberto Amelunge
  version: "2.0.0"
  domain: fullstack
  triggers: landing, catálogo, CRM, admin, leads, pedidos, hero, carrito, WhatsApp, mantenimiento, novedades, mashu, petfood
  role: specialist
  scope: implementation
  output-format: code
  stack: Next.js 14 App Router, Tailwind CSS, Supabase, Zustand, Vercel
  related-skills: git-workflow, preflight-checklist, seo-audit, agent-browser
---

# Mashu Petfood — Web + Admin CRM

Especialista en el proyecto Mashu Petfood. Produce Next.js 14 (App Router), Tailwind CSS y Supabase — tipado, mobile-first, listo para Vercel.

## Secciones del Proyecto

### Landing Pública `app/(site)/`
```
NAV          → logo + links + badge contador carrito
HERO         → 4 slides rotativos parametrizables desde admin (título, imagen, CTA)
STATS        → números animados (IntersectionObserver) — desde tabla `stats`
DESTACADOS   → productos con `destacado=true` — card + "Agregar a cotización"
CATÁLOGO     → grid filtrable por URL params (?cat= &q= &orden=)
¿POR QUÉ?   → 4 pilares de valor Mashu
MARCAS       → logos desde tabla `marcas`
NOVEDADES    → últimos 3 posts publicados
NEWSLETTER   → form → tabla `suscriptores`
CONTACTO     → form → tabla `leads` + CTA WhatsApp
FOOTER       → redes, horarios, link "Admin" pequeño/discreto
WHATSAPP BTN → flotante, siempre visible, número desde `config`
```

### Admin Panel `app/(admin)/` — solo con auth Supabase
```
DASHBOARD    → métricas: leads hoy, pedidos pendientes, ventas mes
CONTENIDO    → Hero (slides CRUD), Stats, Marcas, Config global
CATÁLOGO     → Productos CRUD, Categorías, Variantes, Stock
NOVEDADES    → Posts CRUD, publicar/despublicar
MANTENIMIENTO→ Toggle on/off + mensaje custom → middleware lo aplica
CRM > LEADS  → tabla filtrable, cambio de estado, notas, convertir a cliente
CRM > CLIENTES → base con historial de pedidos
CRM > PEDIDOS → pipeline: pendiente→confirmado→entregado→cancelado
VENTAS       → totales por período, top productos, canal origen
```

## Core Workflow

1. **¿Pública o admin?** → rutas `(site)` vs `(admin)` — nunca mezclar
2. **Leer datos**: Server Components con `supabase/server.ts` — Client Component solo si hay interactividad (carrito, filtros, forms)
3. **Contenido dinámico**: siempre desde Supabase — nunca hardcodear textos que el admin deba poder cambiar
4. **Imágenes**: siempre `<Image>` de Next.js — subir a Supabase Storage
5. **WhatsApp número**: leer de `config` table — nunca hardcodear
6. **Mantenimiento**: `middleware.ts` lee `config.mantenimiento_activo` y redirige si es true

## Constraints

### MUST DO
- Variables de Tailwind en `tailwind.config.ts` para colores de marca
- Tipos generados de Supabase — regenerar con `npx supabase gen types`
- Middleware protege TODO bajo `/admin/*` — redirige a `/admin/login`
- Carrito en Zustand persistido en localStorage
- Form contacto y newsletter como Server Actions → Supabase insert
- RLS habilitado en todas las tablas (ver CLAUDE.md)
- Mobile-first: 375, 768, 1024, 1280, 1440px
- `alt` descriptivo en todas las imágenes

### MUST NOT DO
- Credenciales en código — solo `.env.local`
- `SUPABASE_SERVICE_ROLE_KEY` en cliente — solo server-side
- `"use client"` innecesario — Server Components por defecto
- Texto hardcodeado que debería ser parametrizable (WhatsApp, horarios, hero)
- Colores fuera de la paleta Mashu

## Carrito de Cotización

```ts
// store/cart.ts (Zustand)
interface CartItem { id: string; nombre: string; variante?: string; cantidad: number; precio?: number }
interface CartStore {
  items: CartItem[]
  add: (item: CartItem) => void
  remove: (id: string) => void
  clear: () => void
  buildWhatsAppLink: (config: { numero: string; mensaje: string }) => string
}
```

El panel `QuoteCart.tsx` es un drawer lateral que se abre desde el nav. Al presionar "Cotizar por WhatsApp" llama `buildWhatsAppLink()` y abre `wa.me` en nueva pestaña.

## Modo Mantenimiento

`middleware.ts` hace un fetch a Supabase para leer `config` donde `key = 'mantenimiento_activo'`. Si `value = 'true'`, redirige a `/mantenimiento` — excepto rutas `/admin/*`. La página de mantenimiento muestra el mensaje de `config` donde `key = 'mantenimiento_mensaje'`.

## Output Format

- Componentes públicos → `components/site/NombreComponente.tsx`
- Componentes admin → `components/admin/NombreComponente.tsx`
- Páginas → dentro de su route group correspondiente
- SQL → `supabase/migrations/YYYYMMDDHHMMSS_descripcion.sql`
- Variables de entorno nuevas → documentar en `.env.example`
