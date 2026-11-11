-- Run once in Supabase: SQL Editor → New query → paste → Run.
-- Prices, listing links and lease status edited from /admin. A missing row or a
-- null column means "use the value built into src/data/apartments.ts".

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

-- Everyone (the public site) may read.
drop policy if exists "public read" on public.apartment_overrides;
create policy "public read" on public.apartment_overrides
  for select using (true);

-- Only the admin account may write. Keep the e-mail in sync with
-- site.supabase.adminEmail in src/data/site.ts.
drop policy if exists "admin insert" on public.apartment_overrides;
create policy "admin insert" on public.apartment_overrides
  for insert to authenticated
  with check (auth.jwt() ->> 'email' = 'msdapartments+koszalin@gmail.com');

drop policy if exists "admin update" on public.apartment_overrides;
create policy "admin update" on public.apartment_overrides
  for update to authenticated
  using (auth.jwt() ->> 'email' = 'msdapartments+koszalin@gmail.com')
  with check (auth.jwt() ->> 'email' = 'msdapartments+koszalin@gmail.com');
