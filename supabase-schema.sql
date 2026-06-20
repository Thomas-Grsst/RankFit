-- ============================================================
--  RankFit — Schéma de base de données Supabase
--  À coller dans : Supabase > SQL Editor > New query > Run
-- ============================================================

-- ----------- Table des profils -----------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  pseudo      text not null default 'Anonyme',
  sex         text check (sex in ('M','F')) default 'M',
  weight      numeric,
  height      numeric,
  updated_at  timestamptz default now()
);

-- ----------- Table des performances -----------
create table if not exists public.performances (
  -- FK vers profiles (et non auth.users) pour que le classement
  -- puisse récupérer le pseudo via la jointure profiles(pseudo).
  user_id     uuid references public.profiles (id) on delete cascade,
  exercise_id text not null,
  value       numeric not null,
  score       int not null,
  updated_at  timestamptz default now(),
  primary key (user_id, exercise_id)
);

create index if not exists performances_exercise_idx
  on public.performances (exercise_id, score desc);

-- ============================================================
--  Sécurité (Row Level Security)
-- ============================================================
alter table public.profiles      enable row level security;
alter table public.performances  enable row level security;

-- --- PROFILS ---
-- Tout le monde peut LIRE les profils (pour afficher les pseudos au classement).
drop policy if exists "profiles_read_all" on public.profiles;
create policy "profiles_read_all"
  on public.profiles for select using (true);

-- Chacun ne peut écrire QUE son propre profil.
drop policy if exists "profiles_write_own" on public.profiles;
create policy "profiles_write_own"
  on public.profiles for insert with check (auth.uid() = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update using (auth.uid() = id);

-- --- PERFORMANCES ---
-- Lecture publique (nécessaire pour le classement).
drop policy if exists "perfs_read_all" on public.performances;
create policy "perfs_read_all"
  on public.performances for select using (true);

-- Écriture limitée à ses propres lignes.
drop policy if exists "perfs_insert_own" on public.performances;
create policy "perfs_insert_own"
  on public.performances for insert with check (auth.uid() = user_id);
drop policy if exists "perfs_update_own" on public.performances;
create policy "perfs_update_own"
  on public.performances for update using (auth.uid() = user_id);
drop policy if exists "perfs_delete_own" on public.performances;
create policy "perfs_delete_own"
  on public.performances for delete using (auth.uid() = user_id);

-- ============================================================
--  Création automatique du profil à l'inscription
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, pseudo)
  values (new.id, coalesce(new.raw_user_meta_data->>'pseudo', split_part(new.email,'@',1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
--  TÂCHES QUOTIDIENNES (habitudes)
-- ============================================================
create table if not exists public.habits (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles (id) on delete cascade,
  name        text not null,
  created_at  timestamptz default now()
);

create table if not exists public.habit_logs (
  user_id   uuid references public.profiles (id) on delete cascade,
  habit_id  uuid references public.habits (id) on delete cascade,
  day       date not null,
  primary key (habit_id, day)
);

alter table public.habits      enable row level security;
alter table public.habit_logs  enable row level security;

-- Chacun ne voit et ne gère QUE ses propres tâches.
drop policy if exists "habits_own" on public.habits;
create policy "habits_own" on public.habits
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "habit_logs_own" on public.habit_logs;
create policy "habit_logs_own" on public.habit_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
