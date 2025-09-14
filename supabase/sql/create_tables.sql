-- Run this in Supabase SQL editor
-- Enable extension
create extension if not exists "pgcrypto";

-- wallets table
create table if not exists public.wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  balance numeric(36,6) default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- index for quick lookup
create unique index if not exists idx_wallets_user_id on public.wallets(user_id);
