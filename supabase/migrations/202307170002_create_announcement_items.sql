-- 202307170002_create_announcement_items.sql
-- Table for individual messages in the top‑bar announcement
CREATE TABLE public.announcement_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  settings_id uuid NOT NULL REFERENCES public.announcement_settings(id) ON DELETE CASCADE,
  order_index integer NOT NULL DEFAULT 0,
  message text NOT NULL,
  icon text,               -- Unicode emoji or icon name
  link_url text,
  button_text text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.announcement_items ENABLE ROW LEVEL SECURITY;

-- Only active rows are readable publicly
CREATE POLICY select_active ON public.announcement_items
  FOR SELECT USING (is_active = true);

-- Admin can write all rows
CREATE POLICY admin_write ON public.announcement_items
  FOR ALL USING (auth.role() = 'admin');
