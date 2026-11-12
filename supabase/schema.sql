-- Run once in Supabase: SQL Editor → New query → paste → Run.
-- Prices, listing links and lease status edited from /admin. A missing row or a
-- null column means "use the value built into src/data/apartments.ts".
-- availability_alerts holds e-mails of people who asked to be notified when a
-- flat (or any flat) becomes free; the Edge Function notify-available sends them.

create table if not exists public.apartment_overrides (
  slug          text primary key,
  price         numeric check (price is null or price >= 0),
  listing_url   text check (listing_url is null or listing_url ~* '^https?://'),
  status        text check (status in ('free', 'rented')),
  rented_until  date,
  updated_at    timestamptz not null default now()
);

create or replace function public.touch_apartment_overrides()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists apartment_overrides_touch on public.apartment_overrides;
create trigger apartment_overrides_touch
  before insert or update on public.apartment_overrides
  for each row execute function public.touch_apartment_overrides();

alter table public.apartment_overrides enable row level security;

grant select on public.apartment_overrides to anon, authenticated;
grant insert, update on public.apartment_overrides to authenticated;

drop policy if exists "public read" on public.apartment_overrides;
create policy "public read" on public.apartment_overrides
  for select using (true);

drop policy if exists "admin insert" on public.apartment_overrides;
create policy "admin insert" on public.apartment_overrides
  for insert to authenticated
  with check (auth.jwt() ->> 'email' = 'msdapartments+koszalin@gmail.com');

drop policy if exists "admin update" on public.apartment_overrides;
create policy "admin update" on public.apartment_overrides
  for update to authenticated
  using (auth.jwt() ->> 'email' = 'msdapartments+koszalin@gmail.com')
  with check (auth.jwt() ->> 'email' = 'msdapartments+koszalin@gmail.com');

-- ---------------------------------------------------------------------------
-- Waitlist: "notify me when this / any apartment is free"
-- ---------------------------------------------------------------------------

create table if not exists public.availability_alerts (
  id         uuid primary key default gen_random_uuid(),
  email      text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  -- null slug = notify about any Koszalin apartment that becomes free
  slug       text,
  locale     text not null default 'pl' check (locale in ('pl', 'en')),
  created_at timestamptz not null default now()
);

-- UNIQUE (email, slug) would allow several rows with slug IS NULL in Postgres.
create unique index if not exists availability_alerts_email_slug_uidx
  on public.availability_alerts (email, (coalesce(slug, '')));

alter table public.availability_alerts enable row level security;

grant insert on public.availability_alerts to anon, authenticated;
grant select, delete on public.availability_alerts to authenticated;

drop policy if exists "anyone can subscribe" on public.availability_alerts;
create policy "anyone can subscribe" on public.availability_alerts
  for insert
  with check (true);

drop policy if exists "admin read alerts" on public.availability_alerts;
create policy "admin read alerts" on public.availability_alerts
  for select to authenticated
  using (auth.jwt() ->> 'email' = 'msdapartments+koszalin@gmail.com');

drop policy if exists "admin delete alerts" on public.availability_alerts;
create policy "admin delete alerts" on public.availability_alerts
  for delete to authenticated
  using (auth.jwt() ->> 'email' = 'msdapartments+koszalin@gmail.com');
