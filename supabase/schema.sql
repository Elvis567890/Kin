-- ============================================================================
-- AFRINODE Complete Database Schema, RLS Policies & Storage Bucket ('media')
-- Run this exact script in your Supabase SQL Editor.
-- ============================================================================

-- 1. Site Content Table
create table if not exists public.site_content (
  id bigint primary key default 1,
  hero_title text not null default 'Connect. Intelligent. Transform Africa.',
  hero_subtitle text not null default '',
  logo_url text not null default '',
  about_text text not null default '',
  updated_at timestamptz not null default now()
);

-- 2. Products Table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  icon_name text not null default 'Radio',
  image_url text not null default '',
  download_link text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 3. Navigation Links Table
create table if not exists public.nav_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  url text not null,
  "order" integer not null default 1,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security (RLS)
alter table public.site_content enable row level security;
alter table public.products enable row level security;
alter table public.nav_links enable row level security;

-- Public READ access for everyone (anon + authenticated)
drop policy if exists "Public read site_content" on public.site_content;
create policy "Public read site_content"
  on public.site_content for select
  using (true);

drop policy if exists "Public read products" on public.products;
create policy "Public read products"
  on public.products for select
  using (true);

drop policy if exists "Public read nav_links" on public.nav_links;
create policy "Public read nav_links"
  on public.nav_links for select
  using (true);

-- Authenticated WRITE access (INSERT, UPDATE, DELETE) only for logged-in admins
drop policy if exists "Authenticated write site_content" on public.site_content;
create policy "Authenticated write site_content"
  on public.site_content for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated write products" on public.products;
create policy "Authenticated write products"
  on public.products for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated write nav_links" on public.nav_links;
create policy "Authenticated write nav_links"
  on public.nav_links for all
  to authenticated
  using (true)
  with check (true);

-- Storage Bucket: 'media' (Publicly readable, Admin writable)
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "Public read media bucket" on storage.objects;
create policy "Public read media bucket"
  on storage.objects for select
  using (bucket_id = 'media');

drop policy if exists "Authenticated upload media bucket" on storage.objects;
create policy "Authenticated upload media bucket"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media');

drop policy if exists "Authenticated update media bucket" on storage.objects;
create policy "Authenticated update media bucket"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media')
  with check (bucket_id = 'media');

drop policy if exists "Authenticated delete media bucket" on storage.objects;
create policy "Authenticated delete media bucket"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media');

-- Optional Initial Seed Data
insert into public.site_content (id, hero_title, hero_subtitle, logo_url, about_text)
values (
  1,
  'Connect. Intelligent. Transform Africa.',
  'AFRINODE engineers mission-critical mobile broadcasting, sovereign edge networks, and applied intelligence systems built for Africa.',
  '',
  'African digital infrastructure requires software engineered from first principles—resilient over congested cellular links, low-overhead on mobile silicon, and compliant with regional institutional governance.'
)
on conflict (id) do nothing;
