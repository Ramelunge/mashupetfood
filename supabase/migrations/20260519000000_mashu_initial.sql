-- =============================================
-- MASHU PETFOOD — Schema inicial completo
-- Ejecutar en: Supabase > SQL Editor > New query
-- =============================================

-- CONFIGURACIÓN GLOBAL
CREATE TABLE IF NOT EXISTS config (
  key         TEXT PRIMARY KEY,
  value       TEXT,
  descripcion TEXT
);

INSERT INTO config (key, value, descripcion) VALUES
  ('whatsapp_numero',          '549XXXXXXXXXX',                           'Número sin + ni espacios'),
  ('whatsapp_mensaje_default', 'Hola Mashu! Quiero cotizar los siguientes productos:', ''),
  ('mantenimiento_activo',     'false',                                   'true o false'),
  ('mantenimiento_mensaje',    'Estamos actualizando el sitio. ¡Volvemos pronto!', ''),
  ('horario',                  'Lun-Vie 9:00-18:00 | Sáb 9:00-13:00',   ''),
  ('email_contacto',           'hola@mashu.com.ar',                       ''),
  ('instagram',                '',                                        ''),
  ('facebook',                 '',                                        '')
ON CONFLICT (key) DO NOTHING;

-- HERO SLIDER
CREATE TABLE IF NOT EXISTS hero_slides (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo      TEXT NOT NULL,
  subtitulo   TEXT,
  cta_texto   TEXT,
  cta_url     TEXT,
  imagen_url  TEXT,
  orden       INT DEFAULT 0,
  activo      BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

INSERT INTO hero_slides (titulo, subtitulo, cta_texto, cta_url, orden) VALUES
  ('El alimento que tu mascota se merece', 'Recetas naturales, ingredientes premium y el cuidado que solo Mashu puede dar.', 'Ver catálogo', '/catalogo', 0),
  ('Nutrición sin compromisos', 'Fórmulas desarrolladas por especialistas. Porque tu mascota lo vale.', 'Conocer más', '/catalogo', 1),
  ('Cotizá en segundos por WhatsApp', 'Armá tu lista, mandala por WhatsApp y te respondemos en menos de 24 horas.', 'Contactar', '/contacto', 2)
ON CONFLICT DO NOTHING;

-- STATS
CREATE TABLE IF NOT EXISTS stats (
  id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  etiqueta TEXT NOT NULL,
  valor    INT NOT NULL,
  sufijo   TEXT DEFAULT '+',
  orden    INT DEFAULT 0
);

INSERT INTO stats (etiqueta, valor, sufijo, orden) VALUES
  ('Productos disponibles', 50,   '+', 0),
  ('Clientes satisfechos',  200,  '+', 1),
  ('Años de experiencia',   5,    '+', 2),
  ('Razas atendidas',       30,   '+', 3)
ON CONFLICT DO NOTHING;

-- MARCAS
CREATE TABLE IF NOT EXISTS marcas (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre    TEXT NOT NULL,
  logo_url  TEXT,
  url       TEXT,
  orden     INT DEFAULT 0,
  activo    BOOLEAN DEFAULT true
);

-- CATEGORÍAS
CREATE TABLE IF NOT EXISTS categorias (
  id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  slug   TEXT UNIQUE NOT NULL,
  icono  TEXT,
  orden  INT DEFAULT 0
);

INSERT INTO categorias (nombre, slug, icono, orden) VALUES
  ('Alimento seco',     'alimento-seco',     '🦴', 0),
  ('Alimento húmedo',   'alimento-humedo',   '🥩', 1),
  ('Snacks y premios',  'snacks',            '⭐', 2),
  ('Suplementos',       'suplementos',       '💊', 3)
ON CONFLICT (slug) DO NOTHING;

-- PRODUCTOS
CREATE TABLE IF NOT EXISTS productos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre          TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  descripcion     TEXT,
  precio          DECIMAL(10,2),
  precio_anterior DECIMAL(10,2),
  categoria_id    UUID REFERENCES categorias(id),
  imagen_url      TEXT,
  imagenes_extra  TEXT[],
  destacado       BOOLEAN DEFAULT false,
  activo          BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- VARIANTES
CREATE TABLE IF NOT EXISTS variantes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
  nombre      TEXT NOT NULL,
  stock       INT DEFAULT 0,
  precio_extra DECIMAL(10,2) DEFAULT 0
);

-- POSTS / NOVEDADES
CREATE TABLE IF NOT EXISTS posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo      TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  resumen     TEXT,
  contenido   TEXT,
  imagen_url  TEXT,
  publicado   BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- CRM: LEADS
CREATE TABLE IF NOT EXISTS leads (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre      TEXT NOT NULL,
  email       TEXT,
  telefono    TEXT,
  mascota     TEXT,
  mensaje     TEXT,
  estado      TEXT DEFAULT 'nuevo',   -- nuevo | contactado | convertido | descartado
  fuente      TEXT DEFAULT 'web',     -- web | whatsapp | instagram | referido
  notas       TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- CRM: CLIENTES
CREATE TABLE IF NOT EXISTS clientes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre      TEXT NOT NULL,
  email       TEXT,
  telefono    TEXT,
  mascota     TEXT,
  notas       TEXT,
  lead_id     UUID REFERENCES leads(id),
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- CRM: PEDIDOS
CREATE TABLE IF NOT EXISTS pedidos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id      UUID REFERENCES clientes(id),
  cliente_nombre  TEXT,
  productos_json  JSONB,
  estado          TEXT DEFAULT 'pendiente',  -- pendiente | confirmado | entregado | cancelado
  total           DECIMAL(10,2),
  canal           TEXT DEFAULT 'whatsapp',   -- whatsapp | web | instagram | telefono
  notas           TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- NEWSLETTER
CREATE TABLE IF NOT EXISTS suscriptores (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT UNIQUE NOT NULL,
  activo     BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE config         ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides    ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats          ENABLE ROW LEVEL SECURITY;
ALTER TABLE marcas         ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias     ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos      ENABLE ROW LEVEL SECURITY;
ALTER TABLE variantes      ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts          ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads          ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos        ENABLE ROW LEVEL SECURITY;
ALTER TABLE suscriptores   ENABLE ROW LEVEL SECURITY;

-- Tablas públicas (lectura sin auth)
CREATE POLICY "config_read"      ON config      FOR SELECT USING (true);
CREATE POLICY "hero_read"        ON hero_slides FOR SELECT USING (activo = true);
CREATE POLICY "stats_read"       ON stats       FOR SELECT USING (true);
CREATE POLICY "marcas_read"      ON marcas      FOR SELECT USING (activo = true);
CREATE POLICY "categorias_read"  ON categorias  FOR SELECT USING (true);
CREATE POLICY "productos_read"   ON productos   FOR SELECT USING (activo = true);
CREATE POLICY "variantes_read"   ON variantes   FOR SELECT USING (true);
CREATE POLICY "posts_read"       ON posts       FOR SELECT USING (publicado = true);

-- Admin (solo auth)
CREATE POLICY "config_admin"      ON config      FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "hero_admin"        ON hero_slides FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "stats_admin"       ON stats       FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "marcas_admin"      ON marcas      FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "categorias_admin"  ON categorias  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "productos_admin"   ON productos   FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "variantes_admin"   ON variantes   FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "posts_admin"       ON posts       FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "leads_admin"       ON leads       FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "clientes_admin"    ON clientes    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "pedidos_admin"     ON pedidos     FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "suscriptores_admin" ON suscriptores FOR ALL USING (auth.role() = 'authenticated');

-- Insert público (sin auth) — formularios
CREATE POLICY "leads_insert"        ON leads        FOR INSERT WITH CHECK (true);
CREATE POLICY "suscriptores_insert" ON suscriptores FOR INSERT WITH CHECK (true);
