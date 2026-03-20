-- Align transactions security model with Supabase Auth ownership.

create extension if not exists pgcrypto;

alter table public.transactions
  alter column amount type numeric(14, 0),
  alter column amount set not null,
  alter column user_id set default auth.uid();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'transactions_amount_min_check'
      and conrelid = 'public.transactions'::regclass
  ) then
    alter table public.transactions
      add constraint transactions_amount_min_check check (amount >= 1000);
  end if;
end $$;

create or replace function public.assign_transaction_user_id()
returns trigger
language plpgsql
as $$
begin
  if new.user_id is null then
    new.user_id := auth.uid();
  end if;

  if new.user_id is null then
    raise exception 'Authentication required to write transaction data';
  end if;

  return new;
end;
$$;

drop trigger if exists set_transaction_user_id on public.transactions;
create trigger set_transaction_user_id
before insert on public.transactions
for each row execute function public.assign_transaction_user_id();

alter table public.transactions enable row level security;
alter table public.transactions force row level security;

drop policy if exists transactions_mvp_full_access on public.transactions;
drop policy if exists transactions_select_own on public.transactions;
drop policy if exists transactions_insert_own on public.transactions;
drop policy if exists transactions_update_own on public.transactions;
drop policy if exists transactions_delete_own on public.transactions;

create policy transactions_select_own
  on public.transactions
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy transactions_insert_own
  on public.transactions
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy transactions_update_own
  on public.transactions
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy transactions_delete_own
  on public.transactions
  for delete
  to authenticated
  using (auth.uid() = user_id);
