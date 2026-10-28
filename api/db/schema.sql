-- AliLand schema. Applied idempotently on every API boot by db/migrate.js.
-- Every row in this database is synthetic portfolio demo data.

create table if not exists users (
  id serial primary key,
  email text unique not null,
  password_hash text not null,
  display_name text not null default 'AliLand Admin',
  role text not null default 'viewer' check (role in ('admin', 'editor', 'viewer')),
  created_at timestamptz not null default now()
);

create table if not exists sessions (
  id text primary key,
  user_id int not null references users(id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists vehicles (
  id serial primary key,
  slug text unique not null,
  make_fa text not null,
  make_en text not null,
  model_fa text not null,
  model_en text not null,
  trim_fa text,
  trim_en text,
  make_slug text not null,
  category text not null check (category in ('domestic', 'imported', 'assembled')),
  body_style text not null check (body_style in ('sedan', 'hatchback', 'suv', 'crossover')),
  year_gregorian int not null,
  year_shamsi int not null,
  engine_fa text,
  engine_en text,
  fuel text not null check (fuel in ('petrol', 'hybrid', 'electric', 'diesel')),
  transmission text not null check (transmission in ('manual', 'automatic', 'cvt', 'dct')),
  mileage_km int not null default 0,
  color_fa text,
  color_en text,
  color_hex text,
  interior_fa text,
  interior_en text,
  condition text not null default 'used' check (condition in ('new', 'used')),
  body_condition text default 'excellent',
  price_demo bigint,
  price_band text check (price_band in ('economy', 'mid', 'premium', 'luxury')),
  available boolean not null default true,
  status text not null default 'published' check (status in ('published', 'draft')),
  featured boolean not null default false,
  specs jsonb not null default '{}'::jsonb,
  features jsonb not null default '[]'::jsonb,
  gallery jsonb not null default '[]'::jsonb,
  note_fa text,
  note_en text,
  tone text default '#121722',
  accent text default '#415CF0',
  sort_weight int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists vehicles_filter_idx on vehicles (category, status, price_demo);
create index if not exists vehicles_body_idx on vehicles (body_style);

create table if not exists articles (
  id serial primary key,
  slug text unique not null,
  title_fa text not null,
  title_en text not null,
  excerpt_fa text,
  excerpt_en text,
  body_fa text,
  body_en text,
  category text not null default 'buying',
  cover_tone text default '#121722',
  read_minutes int default 5,
  status text not null default 'published' check (status in ('published', 'draft')),
  featured boolean not null default false,
  published_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists services (
  id serial primary key,
  slug text unique not null,
  number text,
  title_fa text not null,
  title_en text not null,
  kicker_fa text,
  kicker_en text,
  intro_fa text,
  intro_en text,
  problem_fa text,
  problem_en text,
  value_fa text,
  value_en text,
  steps jsonb not null default '[]'::jsonb,
  faq jsonb not null default '[]'::jsonb,
  tone text default 'ivory',
  cta_href text default '/contact',
  status text not null default 'published' check (status in ('published', 'draft')),
  sort_weight int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists faqs (
  id serial primary key,
  question_fa text not null,
  question_en text not null,
  answer_fa text not null,
  answer_en text not null,
  "group" text not null default 'general',
  status text not null default 'published' check (status in ('published', 'draft')),
  sort_weight int not null default 0
);

create table if not exists site_sections (
  id serial primary key,
  key text unique not null,
  label text not null,
  title_fa text,
  title_en text,
  subtitle_fa text,
  subtitle_en text,
  cta_label_fa text,
  cta_label_en text,
  cta_href text,
  visible boolean not null default true,
  sort_weight int not null default 0
);

create table if not exists site_settings (
  id serial primary key,
  key text unique not null,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists media_assets (
  id serial primary key,
  name text not null,
  description text,
  url text not null,
  kind text not null default 'image',
  attribution text,
  created_at timestamptz not null default now()
);

-- Synthetic portfolio examples ONLY. No public submission is stored by default.
create table if not exists partner_applications (
  id serial primary key,
  applicant_type text not null,
  name text not null,
  company text,
  city text,
  specialization text,
  experience text,
  service_area text,
  partnership_model text,
  description text,
  portfolio_url text,
  contact_method text,
  notes text,
  synthetic boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists inquiries (
  id serial primary key,
  kind text not null default 'contact',
  name text not null,
  contact text,
  message text,
  vehicle_slug text,
  synthetic boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists activity_log (
  id serial primary key,
  actor text not null,
  action text not null,
  entity text not null,
  detail text,
  created_at timestamptz not null default now()
);
