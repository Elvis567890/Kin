import { useState } from 'react';
import { Check, Copy, Database } from 'lucide-react';

const SCHEMA_SQL = `-- AFRINODE Supabase Schema, RLS Policies & 'media' Bucket
create table if not exists public.site_content (
  id bigint primary key default 1,
  hero_title text not null default 'Connect. Intelligent. Transform Africa.',
  hero_subtitle text not null default '',
  logo_url text not null default '',
  about_text text not null default '',
  updated_at timestamptz not null default now()
);

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

create table if not exists public.nav_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  url text not null,
  "order" integer not null default 1,
  created_at timestamptz not null default now()
);

alter table public.site_content enable row level security;
alter table public.products enable row level security;
alter table public.nav_links enable row level security;

create policy "Public read site_content" on public.site_content for select using (true);
create policy "Public read products" on public.products for select using (true);
create policy "Public read nav_links" on public.nav_links for select using (true);

create policy "Authenticated write site_content" on public.site_content for all to authenticated using (true) with check (true);
create policy "Authenticated write products" on public.products for all to authenticated using (true) with check (true);
create policy "Authenticated write nav_links" on public.nav_links for all to authenticated using (true) with check (true);

insert into storage.buckets (id, name, public) values ('media', 'media', true) on conflict (id) do nothing;

create policy "Public read media bucket" on storage.objects for select using (bucket_id = 'media');
create policy "Authenticated upload media bucket" on storage.objects for insert to authenticated with check (bucket_id = 'media');
create policy "Authenticated update media bucket" on storage.objects for update to authenticated using (bucket_id = 'media') with check (bucket_id = 'media');
create policy "Authenticated delete media bucket" on storage.objects for delete to authenticated using (bucket_id = 'media');`;

export function SqlSetupView() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SCHEMA_SQL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-[#F5F5F7]">
            Supabase SQL &amp; Storage Schema
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Run this exact script in your Supabase SQL Editor to create tables, RLS
            policies, and the <code className="font-mono text-[#D4AF37]">media</code>{' '}
            bucket.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex min-h-[40px] items-center gap-2 self-start bg-[#D4AF37] px-4 py-2 text-xs font-semibold text-[#050505] hover:bg-[#E5C558] cursor-pointer"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? 'SQL Copied' : 'Copy SQL'}</span>
        </button>
      </div>

      <div className="border border-[#1E3A5F]/70 bg-[#0A192F]">
        <div className="flex items-center gap-2 border-b border-[#1E3A5F] px-5 py-3 text-xs text-zinc-300">
          <Database className="h-4 w-4 text-[#D4AF37]" />
          <span className="font-mono">supabase/schema.sql</span>
        </div>
        <pre className="max-h-[480px] overflow-auto bg-[#050505] p-5 font-mono text-xs leading-relaxed text-zinc-300">
          {SCHEMA_SQL}
        </pre>
      </div>
    </div>
  );
}
