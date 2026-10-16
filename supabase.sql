-- Radar — base de données (à coller une seule fois dans Supabase → SQL Editor → Run)
-- Chaque commercial ne voit et ne modifie QUE ses propres fiches.

create table if not exists public.prospects (
  id          text primary key,
  owner       uuid not null default auth.uid() references auth.users(id) on delete cascade,
  data        jsonb not null,
  updated_at  timestamptz not null default now(),
  deleted     boolean not null default false
);

create index if not exists prospects_owner_updated on public.prospects (owner, updated_at);

alter table public.prospects enable row level security;

drop policy if exists "lecture de mes fiches" on public.prospects;
drop policy if exists "creation de mes fiches" on public.prospects;
drop policy if exists "modification de mes fiches" on public.prospects;
drop policy if exists "suppression de mes fiches" on public.prospects;

create policy "lecture de mes fiches" on public.prospects
  for select using (owner = auth.uid());
create policy "creation de mes fiches" on public.prospects
  for insert with check (owner = auth.uid());
create policy "modification de mes fiches" on public.prospects
  for update using (owner = auth.uid()) with check (owner = auth.uid());
create policy "suppression de mes fiches" on public.prospects
  for delete using (owner = auth.uid());

-- Mise à jour en direct entre le PC et le téléphone
do $$ begin
  alter publication supabase_realtime add table public.prospects;
exception when duplicate_object then null; end $$;
