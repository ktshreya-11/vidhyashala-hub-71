
-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  study_seconds integer not null default 0,
  exam_mode boolean not null default false,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name) values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)));
  return new;
end; $$;

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- Drafts
create table public.drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null default '',
  version integer not null default 1,
  created_at timestamptz not null default now()
);
alter table public.drafts enable row level security;
create policy "drafts_all_own" on public.drafts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Solutions (public read)
create table public.solutions (
  question_key text primary key,
  question text not null,
  answer text not null
);
alter table public.solutions enable row level security;
create policy "solutions_public_read" on public.solutions for select using (true);

insert into public.solutions (question_key, question, answer) values
  ('q1', 'What is 2 + 2?', '4'),
  ('q2', 'Capital of France?', 'paris'),
  ('q3', 'Time complexity of binary search?', 'o(log n)'),
  ('q4', 'HTML stands for?', 'hypertext markup language');

-- Group rooms
create table public.group_rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  shared_text text not null default '',
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
alter table public.group_rooms enable row level security;
create policy "rooms_public_read" on public.group_rooms for select using (true);
create policy "rooms_auth_update" on public.group_rooms for update using (auth.uid() is not null);
create policy "rooms_auth_insert" on public.group_rooms for insert with check (auth.uid() is not null);

insert into public.group_rooms (name) values ('Study Hub'),('DSA Warriors'),('Web Dev Crew');

alter publication supabase_realtime add table public.group_rooms;
