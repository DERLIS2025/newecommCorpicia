-- ==========================================
-- SPRINT 4: ANALYTICS COMMERCIAL METRICS (PHASE 2)
-- ==========================================
-- Migración para expandir el tracking interno de comportamiento de usuarios
-- con métricas de engagement y geolocalización básica (sin IP).

DO $$
BEGIN
  -- Intentamos agregar las columnas una por una (IF NOT EXISTS se maneja directo en la sintaxis de ALTER TABLE para Postgres 9.6+)
  ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS engagement_seconds integer;
  ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS country text;
  ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS region text;
  ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS city text;
  ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS button_location text;
EXCEPTION
  WHEN duplicate_column THEN RAISE NOTICE 'Las columnas ya existen.';
END $$;

-- Índices recomendados
CREATE INDEX IF NOT EXISTS idx_analytics_events_city
ON analytics_events(city);

CREATE INDEX IF NOT EXISTS idx_analytics_events_source
ON analytics_events(utm_source, utm_medium);
