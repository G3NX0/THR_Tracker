-- Add per-user THR goal table with RLS and ownership policies.

create extension if not exists pgcrypto;

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  target_amount numeric(14, 0) not null,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.goals
  alter column user_id set default auth.uid(),
  alter column user_id set not null,
  alter column target_amount set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'goals_target_amount_min_check'
      and conrelid = 'public.goals'::regclass
  ) then
    alter table public.goals
      add constraint goals_target_amount_min_check check (target_amount >= 1000);
  end if;
end $$;

create unique index if not exists idx_goals_user_unique on public.goals (user_id);

create or replace function public.assign_goal_user_id()
returns trigger
language plpgsql
as $$
begin
  if new.user_id is null then
    new.user_id := auth.uid();
  end if;

  if new.user_id is null then
    raise exception 'Authentication required to write goal data';
  end if;

  return new;
end;
$$;

drop trigger if exists set_goal_user_id on public.goals;
create trigger set_goal_user_id
before insert on public.goals
for each row execute function public.assign_goal_user_id();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_goals_updated_at on public.goals;
create trigger set_goals_updated_at
before update on public.goals
for each row execute function public.set_updated_at();

alter table public.goals enable row level security;
alter table public.goals force row level security;

drop policy if exists goals_select_own on public.goals;
drop policy if exists goals_insert_own on public.goals;
drop policy if exists goals_update_own on public.goals;
drop policy if exists goals_delete_own on public.goals;

create policy goals_select_own
  on public.goals
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy goals_insert_own
  on public.goals
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy goals_update_own
  on public.goals
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy goals_delete_own
  on public.goals
  for delete
  to authenticated
  using (auth.uid() = user_id);
