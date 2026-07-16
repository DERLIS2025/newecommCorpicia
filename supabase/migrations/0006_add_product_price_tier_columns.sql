-- ==========================================
-- SPRINT 4: PRICING TIERS EXTENSION
-- ==========================================

ALTER TABLE public.product_price_tiers
ADD COLUMN IF NOT EXISTS max_quantity integer,
ADD COLUMN IF NOT EXISTS is_promo boolean NOT NULL DEFAULT false;

ALTER TABLE public.product_price_tiers
DROP CONSTRAINT IF EXISTS max_quantity_check;

ALTER TABLE public.product_price_tiers
ADD CONSTRAINT max_quantity_check
CHECK (
  max_quantity IS NULL
  OR max_quantity >= min_quantity
);
