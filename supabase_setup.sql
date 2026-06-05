
-- =============================================
-- CARDVERSE MINI GAMES - SUPABASE SETUP v2
-- Run this in your Supabase SQL Editor
-- =============================================

-- PROFILES (user accounts)
create table if not exists profiles (
  id uuid references auth.users primary key,
  username text unique,
  total_pts integer default 0,
  best_streak integer default 0,
  skin text default 'base',
  owned_skins text[] default array['base','green'],
  squad_id uuid,
  created_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "Users can read all profiles" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- SCORES (game history)
create table if not exists scores (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users,
  username text,
  streak integer default 0,
  pts integer default 0,
  sport text default 'all',
  created_at timestamptz default now()
);
alter table scores enable row level security;
create policy "Anyone can read scores" on scores for select using (true);
create policy "Users can insert own scores" on scores for insert with check (auth.uid() = user_id);

-- POP REPORT CARDS (admin managed)
create table if not exists pr_cards (
  id uuid default gen_random_uuid() primary key,
  player text not null,
  year integer,
  set_name text,
  grade text default 'PSA 10',
  pop integer default 0,
  sport text default 'basketball',
  status text default 'active',
  img text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table pr_cards enable row level security;
create policy "Anyone can read active cards" on pr_cards for select using (status = 'active' or status = 'featured');
create policy "Service role can manage cards" on pr_cards for all using (true);

-- DAILY GAMES (admin sets daily matchup)
create table if not exists daily_games (
  id uuid default gen_random_uuid() primary key,
  game_date date unique not null,
  game_type text default 'pop_report',
  card_a_id uuid references pr_cards,
  card_b_id uuid references pr_cards,
  auto_puzzle_id uuid,
  created_at timestamptz default now()
);
alter table daily_games enable row level security;
create policy "Anyone can read daily games" on daily_games for select using (true);
create policy "Service role can manage daily games" on daily_games for all using (true);

-- AUTOGRAPH PUZZLES (signtvre game)
create table if not exists autograph_puzzles (
  id uuid default gen_random_uuid() primary key,
  player_name text not null,
  sport text default 'basketball',
  autograph_img text,
  card_img text,
  game_date date,
  status text default 'active',
  created_at timestamptz default now()
);
alter table autograph_puzzles enable row level security;
create policy "Anyone can read active puzzles" on autograph_puzzles for select using (status = 'active');
create policy "Service role can manage puzzles" on autograph_puzzles for all using (true);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, username)
  values (new.id, new.raw_user_meta_data->>'username')
  on conflict do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ADMIN: Bypass RLS for pr_cards, daily_games, autograph_puzzles
-- (we'll use service role key in admin only)
