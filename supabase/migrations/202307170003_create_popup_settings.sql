-- Migration: Create popup settings table and RLS
-- File: supabase/migrations/202307170003_create_popup_settings.sql

create table public.popup_settings (
  id uuid default gen_random_uuid() primary key,
  enabled boolean not null default false,
  image_url text,
  title text,
  description text,
  button_text text,
  button_url text,
  show_after_seconds integer default 5,
  frequency_days integer default 30,
  start_at timestamp with time zone,
  end_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.popup_settings enable row level security;

create policy "Allow read for public" on public.popup_settings
  for select using (true);

create policy "Allow admin write" on public.popup_settings
  for all using (auth.role() = 'admin');

-- indexes
create index on public.popup_settings (enabled);
