-- ==========================================
-- SPRINT 4: ANALYTICS TRACKING
-- ==========================================
-- Migración para el tracking interno de comportamiento de usuarios.

CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  visitor_id text NOT NULL,
  session_id text NOT NULL,

  event_name text NOT NULL,
  page_path text NOT NULL,

  entity_type text,
  entity_id text,

  device_type text,
  screen_width integer,
  browser text,
  operating_system text,

  landing_page text,
  referrer text,

  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,

  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,

  created_at timestamptz NOT NULL DEFAULT now()
);

-- Índices para optimizar las consultas del Dashboard Comercial
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at
ON analytics_events(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name
ON analytics_events(event_name);

CREATE INDEX IF NOT EXISTS idx_analytics_events_session
ON analytics_events(session_id);

CREATE INDEX IF NOT EXISTS idx_analytics_events_visitor
ON analytics_events(visitor_id);

CREATE INDEX IF NOT EXISTS idx_analytics_events_page_path
ON analytics_events(page_path);

CREATE INDEX IF NOT EXISTS idx_analytics_events_entity
ON analytics_events(entity_type, entity_id);

-- Habilitar RLS pero mantenerlo restrictivo.
-- El cliente nunca insertará directamente usando API de Supabase, lo hará vía el endpoint interno de Next.js (con service_role o admin).
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- No agregamos políticas públicas de INSERT ni SELECT para maximizar seguridad.
