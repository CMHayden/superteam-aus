-- Add fields from join application form that community_members doesn't already store
alter table community_members
  add column if not exists email text default '',
  add column if not exists experience text default '',
  add column if not exists looking_for text[] not null default '{}',
  add column if not exists github text default '',
  add column if not exists portfolio text default '',
  add column if not exists linkedin text default '',
  add column if not exists dribbble text default '',
  add column if not exists behance text default '',
  add column if not exists figma text default '',
  add column if not exists company_website text default '',
  add column if not exists pitch_deck text default '',
  add column if not exists youtube text default '',
  add column if not exists tiktok text default '',
  add column if not exists calendly text default '',
  add column if not exists notion text default '',
  add column if not exists organisation_website text default '',
  add column if not exists active boolean not null default true;

-- Name must be unique
alter table community_members
  add constraint community_members_name_unique unique (name);
