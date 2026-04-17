-- Join form: roles
create table if not exists join_form_roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text not null default '',
  icon_name text not null default 'rocket',
  display_order integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Join form: locations
create table if not exists join_form_locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location_group text not null default 'australia',
  display_order integer not null default 0,
  created_at timestamptz default now()
);

-- Join form: skills (linked to a role)
create table if not exists join_form_skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role_name text not null,
  display_order integer not null default 0,
  created_at timestamptz default now()
);

-- Join form: experience levels
create table if not exists join_form_experience_options (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text not null default '',
  badge text not null default '',
  badge_class text not null default '',
  display_order integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Join form: "looking for" options
create table if not exists join_form_looking_for (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  display_order integer not null default 0,
  created_at timestamptz default now()
);

-- Join form: submissions
create table if not exists join_applications (
  id uuid primary key default gen_random_uuid(),
  first_name text not null default '',
  last_name text not null default '',
  email text not null default '',
  location text not null default '',
  role text not null default '',
  experience text not null default '',
  looking_for text[] not null default '{}',
  looking_other text default '',
  skills text[] not null default '{}',
  twitter text default '',
  github text default '',
  portfolio text default '',
  linkedin text default '',
  dribbble text default '',
  behance text default '',
  figma text default '',
  company_website text default '',
  pitch_deck text default '',
  youtube text default '',
  tiktok text default '',
  calendly text default '',
  notion text default '',
  organisation_website text default '',
  is_read boolean not null default false,
  created_at timestamptz default now()
);

-- RLS
alter table join_form_roles enable row level security;
alter table join_form_locations enable row level security;
alter table join_form_skills enable row level security;
alter table join_form_experience_options enable row level security;
alter table join_form_looking_for enable row level security;
alter table join_applications enable row level security;

-- Public read for form config
create policy "Public read join_form_roles" on join_form_roles for select using (true);
create policy "Public read join_form_locations" on join_form_locations for select using (true);
create policy "Public read join_form_skills" on join_form_skills for select using (true);
create policy "Public read join_form_experience_options" on join_form_experience_options for select using (true);
create policy "Public read join_form_looking_for" on join_form_looking_for for select using (true);

-- Anyone can insert submissions (public form)
create policy "Public insert join_applications" on join_applications for insert with check (true);

-- Only authenticated can read/update/delete submissions
create policy "Auth read join_applications" on join_applications for select using (auth.role() = 'authenticated');
create policy "Auth update join_applications" on join_applications for update using (auth.role() = 'authenticated');
create policy "Auth delete join_applications" on join_applications for delete using (auth.role() = 'authenticated');

-- Auth write for form config tables
create policy "Auth write join_form_roles" on join_form_roles for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Auth write join_form_locations" on join_form_locations for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Auth write join_form_skills" on join_form_skills for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Auth write join_form_experience_options" on join_form_experience_options for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Auth write join_form_looking_for" on join_form_looking_for for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Updated_at triggers
create trigger join_form_roles_updated_at before update on join_form_roles for each row execute function set_updated_at();
create trigger join_form_experience_options_updated_at before update on join_form_experience_options for each row execute function set_updated_at();
