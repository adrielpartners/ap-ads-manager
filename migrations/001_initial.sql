CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'owner' CHECK (role IN ('owner', 'admin', 'client', 'viewer')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  primary_domain text NOT NULL,
  allowed_domains text[] NOT NULL DEFAULT '{}',
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE advertisers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  contact_name text,
  contact_email text,
  contact_phone text,
  notes text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE placements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  width integer NOT NULL CHECK (width > 0),
  height integer NOT NULL CHECK (height > 0),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (property_id, slug)
);

CREATE TABLE campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  advertiser_id uuid NOT NULL REFERENCES advertisers(id),
  property_id uuid NOT NULL REFERENCES properties(id),
  name text NOT NULL,
  start_date date,
  end_date date,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE ads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES campaigns(id),
  advertiser_id uuid NOT NULL REFERENCES advertisers(id),
  property_id uuid NOT NULL REFERENCES properties(id),
  name text NOT NULL,
  image_path text,
  image_url text,
  destination_url text NOT NULL,
  generated_click_url text,
  alt_text text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
  start_date date,
  end_date date,
  weight integer NOT NULL DEFAULT 1 CHECK (weight > 0),
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE ad_placement_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id uuid NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
  placement_id uuid NOT NULL REFERENCES placements(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (ad_id, placement_id)
);

CREATE TABLE ad_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id),
  placement_id uuid NOT NULL REFERENCES placements(id),
  advertiser_id uuid NOT NULL REFERENCES advertisers(id),
  campaign_id uuid NOT NULL REFERENCES campaigns(id),
  ad_id uuid NOT NULL REFERENCES ads(id),
  event_type text NOT NULL CHECK (event_type IN ('impression', 'click')),
  page_url text,
  referrer text,
  user_agent text,
  ip_hash text,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE daily_ad_stats (
  date date NOT NULL,
  property_id uuid NOT NULL REFERENCES properties(id),
  placement_id uuid NOT NULL REFERENCES placements(id),
  advertiser_id uuid NOT NULL REFERENCES advertisers(id),
  campaign_id uuid NOT NULL REFERENCES campaigns(id),
  ad_id uuid NOT NULL REFERENCES ads(id),
  impressions integer NOT NULL DEFAULT 0,
  clicks integer NOT NULL DEFAULT 0,
  ctr numeric(8, 6) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (date, property_id, placement_id, advertiser_id, campaign_id, ad_id)
);

CREATE INDEX properties_domain_idx ON properties (primary_domain);
CREATE INDEX properties_allowed_domains_idx ON properties USING gin (allowed_domains);
CREATE INDEX placements_property_slug_idx ON placements (property_id, slug);
CREATE INDEX campaigns_property_status_dates_idx ON campaigns (property_id, status, start_date, end_date);
CREATE INDEX ads_property_status_dates_idx ON ads (property_id, status, start_date, end_date);
CREATE INDEX assignments_placement_ad_idx ON ad_placement_assignments (placement_id, ad_id);
CREATE INDEX ad_events_date_property_ad_idx ON ad_events (occurred_at, property_id, ad_id);
CREATE INDEX daily_stats_date_property_idx ON daily_ad_stats (date, property_id);
