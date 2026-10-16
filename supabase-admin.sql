-- Radar — rôle Admin (à exécuter une fois dans Supabase → SQL Editor → Run)
-- Un admin voit et peut modifier les fiches de toute l'équipe.
-- Seul l'admin principal (owner) peut nommer ou retirer des admins.

create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text,
  nom        text,
  updated_at timestamptz default now()
);

create table if not exists public.admins (
  user_id  uuid primary key references auth.users(id) on delete cascade,
  role     text not null default 'admin' check (role in ('owner','admin')),
  added_at timestamptz default now()
);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as
$$ select exists (select 1 from public.admins where user_id = auth.uid()) $$;

create or replace function public.is_owner() returns boolean
language sql stable security definer set search_path = public as
$$ select exists (select 1 from public.admins where user_id = auth.uid() and role = 'owner') $$;

alter table public.profiles enable row level security;
alter table public.admins   enable row level security;

drop policy if exists "profil lecture"  on public.profiles;
drop policy if exists "profil creation" on public.profiles;
drop policy if exists "profil maj"      on public.profiles;
create policy "profil lecture"  on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profil creation" on public.profiles for insert with check (id = auth.uid());
create policy "profil maj"      on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "admins lecture"   on public.admins;
drop policy if exists "admins ajout"     on public.admins;
drop policy if exists "admins retrait"   on public.admins;
create policy "admins lecture" on public.admins for select using (user_id = auth.uid() or public.is_admin());
create policy "admins ajout"   on public.admins for insert with check (public.is_owner() and role = 'admin');
create policy "admins retrait" on public.admins for delete using (public.is_owner() and role = 'admin');

-- Fiches : chacun les siennes, les admins toutes
drop policy if exists "lecture de mes fiches"      on public.prospects;
drop policy if exists "creation de mes fiches"     on public.prospects;
drop policy if exists "modification de mes fiches" on public.prospects;
drop policy if exists "suppression de mes fiches"  on public.prospects;
create policy "lecture de mes fiches" on public.prospects
  for select using (owner = auth.uid() or public.is_admin());
create policy "creation de mes fiches" on public.prospects
  for insert with check (owner = auth.uid() or public.is_admin());
create policy "modification de mes fiches" on public.prospects
  for update using (owner = auth.uid() or public.is_admin()) with check (owner = auth.uid() or public.is_admin());
create policy "suppression de mes fiches" on public.prospects
  for delete using (owner = auth.uid() or public.is_admin());

-- Profils des comptes déjà créés
insert into public.profiles (id, email)
  select id, email from auth.users on conflict (id) do nothing;

-- Admin principal : Elouan
insert into public.admins (user_id, role)
  select id, 'owner' from auth.users where lower(email) = 'elaze@data-links.fr'
  on conflict (user_id) do update set role = 'owner';
