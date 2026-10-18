-- Journey Tracker v1.3 private family message board.
-- Run in a NEW dedicated Supabase project's SQL editor as the project owner.
-- DENY BY DEFAULT. Only manually approved member UUIDs may read or send.
create table if not exists public.family_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 60),
  approved_at timestamptz not null default now()
);
create table if not exists public.family_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.family_members(user_id),
  body text not null check (char_length(body) between 1 and 1000),
  created_at timestamptz not null default now()
);
create index if not exists family_messages_recent on public.family_messages(created_at desc);
alter table public.family_members enable row level security;
alter table public.family_messages enable row level security;
revoke all on public.family_members from anon, authenticated;
revoke all on public.family_messages from anon, authenticated;
grant select on public.family_members to authenticated;
grant select, insert on public.family_messages to authenticated;
-- All family members see only the permitted membership list and shared board.
-- Keep privileged membership lookup outside the exposed public API schema.
-- RLS policies call it internally. Don't expose private schema via PostgREST.
create schema if not exists private;
create or replace function private.is_family_member() returns boolean
 language sql stable security definer set search_path = '' as $$
 select exists (select 1 from public.family_members m where m.user_id = (select auth.uid()));
$$;
revoke all on function private.is_family_member() from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.is_family_member() to authenticated;
drop policy if exists "members read members" on public.family_members;
create policy "approved members read roster" on public.family_members for select to authenticated
using ((select private.is_family_member()));
create policy "approved members read messages" on public.family_messages for select to authenticated
using ((select private.is_family_member()));
create policy "approved members send as self" on public.family_messages for insert to authenticated
with check ((select private.is_family_member()) and user_id=(select auth.uid()));
-- No policies for UPDATE, DELETE, or membership INSERT by authenticated users.
-- INVITE FLOW (MANUAL): disable public sign-ups in Auth settings; invite a member
-- through Supabase Auth dashboard, then manually approve by looking up their UUID:
-- insert into public.family_members(user_id, display_name)
-- select id,'Family member display name' from auth.users where email='MEMBER_EMAIL';
-- Confirm row exists before sending a link. Never put emails or UUIDs in the public repo.
-- Configure Supabase Auth redirect URLs to this app's messages.html URL.
-- Use Auth dashboard for invitations and revocation, and remove member rows to revoke board access.
