-- supabase/migrations/0006_admin_trusted_devices.sql

CREATE TABLE public.admin_trusted_devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  device_token_hash text not null,
  pin_hash text not null,
  name text null,
  failed_attempts integer not null default 0 check (failed_attempts >= 0),
  locked_until timestamptz null,
  last_used_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  revoked_at timestamptz null,
  unique(user_id, device_token_hash)
);

CREATE INDEX admin_trusted_devices_user_id_idx ON public.admin_trusted_devices(user_id);
CREATE INDEX admin_trusted_devices_token_hash_idx ON public.admin_trusted_devices(device_token_hash);
CREATE INDEX admin_trusted_devices_revoked_at_idx ON public.admin_trusted_devices(revoked_at);

-- Activar RLS pero no proporcionar ninguna política, 
-- lo que significa que el acceso desde el cliente (anon/authenticated) queda completamente denegado.
-- Todas las operaciones se realizarán desde el backend mediante el SUPABASE_SERVICE_ROLE_KEY.
ALTER TABLE public.admin_trusted_devices ENABLE ROW LEVEL SECURITY;
