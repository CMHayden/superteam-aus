-- Stats section
create table if not exists stats (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value integer not null,
  suffix text default '',
  duration_ms integer default 1600,
  display_order integer not null default 0,
  hidden_on_mobile boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Partners section
create table if not exists partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text not null,
  description text default '',
  benefits text default '',
  link text default '',
  display_order integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- What We Do cards
create table if not exists what_we_do_cards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  icon_name text not null,
  bullets text[] not null default '{}',
  display_order integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Testimonials
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  quote text not null,
  image_url text default '',
  display_order integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tweets
create table if not exists tweets (
  id uuid primary key default gen_random_uuid(),
  tweet_id text not null unique,
  display_order integer not null default 0,
  created_at timestamptz default now()
);

-- Carousel images (event slideshow)
create table if not exists carousel_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  alt_text text default '',
  display_order integer not null default 0,
  created_at timestamptz default now()
);

-- Community members (meet the aussies)
create table if not exists community_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title text not null,
  role text default '',
  location text default '',
  avatar_url text default '',
  bio text default '',
  skills text[] not null default '{}',
  contributions text[] not null default '{}',
  twitter_url text default '',
  profile_link text default '',
  show_on_carousel boolean default true,
  display_order integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- FAQs
create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  display_order integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Social links (footer + global)
create table if not exists social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  url text not null,
  display_order integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Site config (key-value for global settings)
create table if not exists site_config (
  key text primary key,
  value text not null,
  updated_at timestamptz default now()
);

-- Enable Row Level Security on all tables
alter table stats enable row level security;
alter table partners enable row level security;
alter table what_we_do_cards enable row level security;
alter table testimonials enable row level security;
alter table tweets enable row level security;
alter table carousel_images enable row level security;
alter table community_members enable row level security;
alter table faqs enable row level security;
alter table social_links enable row level security;
alter table site_config enable row level security;

-- Public read policies (anyone can read for the public site)
create policy "Public read stats" on stats for select using (true);
create policy "Public read partners" on partners for select using (true);
create policy "Public read what_we_do_cards" on what_we_do_cards for select using (true);
create policy "Public read testimonials" on testimonials for select using (true);
create policy "Public read tweets" on tweets for select using (true);
create policy "Public read carousel_images" on carousel_images for select using (true);
create policy "Public read community_members" on community_members for select using (true);
create policy "Public read faqs" on faqs for select using (true);
create policy "Public read social_links" on social_links for select using (true);
create policy "Public read site_config" on site_config for select using (true);

-- Authenticated user write policies (admin)
create policy "Auth write stats" on stats for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Auth write partners" on partners for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Auth write what_we_do_cards" on what_we_do_cards for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Auth write testimonials" on testimonials for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Auth write tweets" on tweets for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Auth write carousel_images" on carousel_images for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Auth write community_members" on community_members for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Auth write faqs" on faqs for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Auth write social_links" on social_links for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Auth write site_config" on site_config for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Storage bucket for CMS uploads (partners logos, testimonial images, carousel images, etc.)
insert into storage.buckets (id, name, public) values ('cms', 'cms', true)
on conflict do nothing;

create policy "Public read cms bucket" on storage.objects for select using (bucket_id = 'cms');
create policy "Auth upload cms bucket" on storage.objects for insert with check (bucket_id = 'cms' and auth.role() = 'authenticated');
create policy "Auth update cms bucket" on storage.objects for update using (bucket_id = 'cms' and auth.role() = 'authenticated');
create policy "Auth delete cms bucket" on storage.objects for delete using (bucket_id = 'cms' and auth.role() = 'authenticated');

-- updated_at trigger function
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Attach updated_at triggers
create trigger stats_updated_at before update on stats for each row execute function set_updated_at();
create trigger partners_updated_at before update on partners for each row execute function set_updated_at();
create trigger what_we_do_cards_updated_at before update on what_we_do_cards for each row execute function set_updated_at();
create trigger testimonials_updated_at before update on testimonials for each row execute function set_updated_at();
create trigger community_members_updated_at before update on community_members for each row execute function set_updated_at();
create trigger faqs_updated_at before update on faqs for each row execute function set_updated_at();
create trigger social_links_updated_at before update on social_links for each row execute function set_updated_at();
create trigger site_config_updated_at before update on site_config for each row execute function set_updated_at();
