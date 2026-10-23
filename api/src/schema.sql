-- Base44 car showroom schema (PostgreSQL). Idempotent: safe to run on every boot.

CREATE TABLE IF NOT EXISTS staff (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'sales' CHECK (role IN ('admin', 'sales')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vehicles (
  id SERIAL PRIMARY KEY,
  public_code TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  trim TEXT,
  year_value INT,
  year_calendar TEXT CHECK (year_calendar IN ('jalali', 'gregorian')),
  mileage_km INT,
  body_type TEXT,
  fuel_type TEXT,
  transmission TEXT,
  exterior_color TEXT,
  interior_color TEXT,
  engine_cc INT,
  drivetrain TEXT,
  city TEXT,
  public_viewing_location TEXT,
  price_toman BIGINT,
  price_mode TEXT NOT NULL DEFAULT 'fixed' CHECK (price_mode IN ('fixed', 'on_request')),
  price_confirmed_at TIMESTAMPTZ,
  description TEXT,
  verified_options JSONB NOT NULL DEFAULT '[]',
  disclosed_defects JSONB NOT NULL DEFAULT '[]',
  cover_media_url TEXT,
  search_text TEXT NOT NULL DEFAULT '',
  featured BOOLEAN NOT NULL DEFAULT false,
  is_demo BOOLEAN NOT NULL DEFAULT true,
  lifecycle_status TEXT NOT NULL DEFAULT 'available' CHECK (lifecycle_status IN ('available', 'reserved', 'sold', 'withdrawn')),
  publication_status TEXT NOT NULL DEFAULT 'draft' CHECK (publication_status IN ('draft', 'pending_review', 'published', 'archived')),
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS vehicles_public_idx ON vehicles (publication_status, lifecycle_status);
CREATE INDEX IF NOT EXISTS vehicles_brand_idx ON vehicles (brand, model);

CREATE TABLE IF NOT EXISTS vehicle_private (
  vehicle_id INT PRIMARY KEY REFERENCES vehicles(id) ON DELETE CASCADE,
  collaboration_type TEXT,
  owner_name TEXT,
  owner_phone TEXT,
  purchase_price BIGINT,
  commission BIGINT,
  internal_note TEXT,
  private_file_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vehicle_media (
  id SERIAL PRIMARY KEY,
  vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'image',
  usage TEXT NOT NULL DEFAULT 'gallery',
  alt_fa TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'draft')),
  approval_status TEXT NOT NULL DEFAULT 'approved',
  license_note TEXT,
  is_demo BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS inspection_reports (
  id SERIAL PRIMARY KEY,
  vehicle_id INT UNIQUE REFERENCES vehicles(id) ON DELETE CASCADE,
  inspected_at DATE,
  inspector_display_name TEXT,
  summary TEXT,
  body_parts JSONB NOT NULL DEFAULT '{}',
  chassis TEXT,
  mechanical TEXT,
  equipment TEXT,
  tires TEXT,
  documents TEXT,
  approval_status TEXT NOT NULL DEFAULT 'draft',
  is_public BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  public_code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  vehicle_id INT REFERENCES vehicles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  preferred_date DATE,
  preferred_slot TEXT,
  payload JSONB NOT NULL DEFAULT '{}',
  idempotency_key TEXT UNIQUE,
  assigned_to INT REFERENCES staff(id) ON DELETE SET NULL,
  is_demo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS leads_assigned_idx ON leads (assigned_to);

CREATE TABLE IF NOT EXISTS lead_files (
  id SERIAL PRIMARY KEY,
  lead_id INT REFERENCES leads(id) ON DELETE CASCADE,
  stored_name TEXT NOT NULL,
  original_name TEXT,
  mime TEXT,
  size BIGINT,
  status TEXT NOT NULL DEFAULT 'quarantined',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  body_md TEXT,
  cover_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  is_demo BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS settings (
  id INT PRIMARY KEY DEFAULT 1,
  data JSONB NOT NULL DEFAULT '{}',
  mode TEXT NOT NULL DEFAULT 'demo' CHECK (mode IN ('demo', 'live')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  staff_id INT,
  action TEXT,
  entity TEXT,
  entity_id TEXT,
  meta JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
