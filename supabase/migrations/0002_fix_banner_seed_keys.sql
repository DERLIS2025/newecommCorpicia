-- Migration: 0002_fix_banner_seed_keys.sql
-- Description: Add a stable unique key to banners for idempotent seeding

ALTER TABLE banners
ADD COLUMN seed_key text unique;

-- Optionally, we can make it NOT NULL later after we backfill,
-- but since this is a fresh setup, we can just leave it as is or backfill immediately.
