-- 202307170001_create_announcement_settings.sql
-- Create table for top‑bar announcement settings
CREATE TABLE public.announcement_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  is_active boolean NOT NULL DEFAULT false,
  speed_ms integer NOT NULL DEFAULT 5000,
  bg_color text NOT NULL DEFAULT '#FF0000',
  text_color text NOT NULL DEFAULT '#FFFFFF',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable row‑level security
ALTER TABLE public.announcement_settings ENABLE ROW LEVEL SECURITY;

-- SELECT: only active rows are readable publicly
CREATE POLICY select_active ON public.announcement_settings
  FOR SELECT USING (is_active = true);

-- INSERT/UPDATE/DELETE: only admin role
CREATE POLICY admin_write ON public.announcement_settings
  FOR ALL USING (auth.role() = 'admin');
