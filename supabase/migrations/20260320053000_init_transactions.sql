create extension if not exists pgcrypto;

do $$
begin
  create type public.transaction_type as enum ('masuk', 'keluar');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  type public.transaction_type not null,
  date date not null,
  name text not null,
  category text not null,
  amount numeric(14, 0) not null check (amount > 0),
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_transactions_date on public.transactions (date desc);
create index if not exists idx_transactions_type on public.transactions (type);
create index if not exists idx_transactions_category on public.transactions (category);
create index if not exists idx_transactions_user on public.transactions (user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_transactions_updated_at on public.transactions;
create trigger set_transactions_updated_at
before update on public.transactions
for each row execute function public.set_updated_at();

alter table public.transactions enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'transactions'
      and policyname = 'transactions_mvp_full_access'
  ) then
    create policy transactions_mvp_full_access
      on public.transactions
      for all
      to anon, authenticated
      using (true)
      with check (true);
  end if;
end $$;
