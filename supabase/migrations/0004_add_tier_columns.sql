-- ==========================================
-- SPRINT 4: PRICING TIERS EXTENSION
-- ==========================================

-- Agregar columnas necesarias para administrar correctamente las escalas de precios
ALTER TABLE product_price_tiers
ADD COLUMN IF NOT EXISTS max_quantity integer,
ADD COLUMN IF NOT EXISTS is_promo boolean not null default false;

-- Agregar restricción para asegurar coherencia en los rangos
ALTER TABLE product_price_tiers
ADD CONSTRAINT max_quantity_check CHECK (max_quantity IS NULL OR max_quantity >= min_quantity);
