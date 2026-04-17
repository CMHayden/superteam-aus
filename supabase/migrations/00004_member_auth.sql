-- Link community members to Supabase auth users so members can log in
alter table community_members
  add column if not exists auth_user_id uuid unique references auth.users(id) on delete set null;

-- Members can read their own row
create policy "Members read own profile"
  on community_members for select
  using (auth.uid() = auth_user_id);

-- Members can update their own row (limited columns enforced at API level)
create policy "Members update own profile"
  on community_members for update
  using (auth.uid() = auth_user_id)
  with check (auth.uid() = auth_user_id);

-- Mark approved submissions
alter table join_applications
  add column if not exists approved boolean not null default false;
