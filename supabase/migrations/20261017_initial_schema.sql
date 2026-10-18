-- Profiles table
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  starting_balance numeric not null default 0,
  risk_per_trade_percent numeric not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trades table
create table trades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pair text not null,
  direction text not null check (direction in ('long', 'short')),
  entry_price numeric not null,
  exit_price numeric,
  stop_loss numeric,
  take_profit numeric,
  position_size numeric not null,
  leverage numeric not null default 1,
  fees numeric not null default 0,
  pnl numeric,
  risk_amount numeric,
  rr_planned numeric,
  setup text,
  followed_plan boolean,
  mistakes text[],
  notes text,
  trade_date timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table profiles enable row level security;
alter table trades enable row level security;

-- Grants (required since "Automatically expose new tables" was disabled)
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.trades to authenticated;

-- Profiles policies
create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can delete their own profile"
  on profiles for delete
  using (auth.uid() = id);

-- Trades policies
create policy "Users can view their own trades"
  on trades for select
  using (auth.uid() = user_id);

create policy "Users can insert their own trades"
  on trades for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own trades"
  on trades for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own trades"
  on trades for delete
  using (auth.uid() = user_id);