-- =============================================
-- MWTL Studio — Supabase Schema
-- Run this in: Supabase Dashboard > SQL Editor
-- =============================================

-- Posts table
create table if not exists posts (
  id          bigint primary key generated always as identity,
  created_at  timestamptz default now(),
  date        date not null,
  description text,
  content_type text check (content_type in ('photo','carousel','reel')),
  theme       text,
  location    text,
  tone        text,
  image_url   text,
  variants    jsonb default '[]'::jsonb,
  hashtags    jsonb default '[]'::jsonb,
  alt_text    text
);

-- Competitors table
create table if not exists competitors (
  id          bigint primary key generated always as identity,
  created_at  timestamptz default now(),
  handle      text not null unique,
  report      jsonb not null
);

-- Chat history table (assistant memory)
create table if not exists chat_messages (
  id          bigint primary key generated always as identity,
  created_at  timestamptz default now(),
  role        text check (role in ('user','assistant')),
  content     text not null
);

-- Enable RLS (no auth = anon access allowed via policy)
alter table posts enable row level security;
alter table competitors enable row level security;
alter table chat_messages enable row level security;

-- Policies: anon key has full access (private app, no multi-user)
create policy "anon full access posts"        on posts        for all using (true) with check (true);
create policy "anon full access competitors"  on competitors  for all using (true) with check (true);
create policy "anon full access chat"         on chat_messages for all using (true) with check (true);
