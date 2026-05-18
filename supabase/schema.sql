create table if not exists public.sources (
  id text primary key,
  name text not null,
  source_type text not null,
  source_url text,
  reliability_role text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.brands (
  id text primary key,
  name text not null unique,
  slug text not null unique,
  manufacturer text,
  synonyms text[] not null default '{}',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.mediums (
  id text primary key,
  name text not null unique,
  slug text not null unique,
  parent_category text,
  core_behavior_notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.product_lines (
  id text primary key,
  brand_id text not null references public.brands(id),
  medium_id text not null references public.mediums(id),
  name text not null,
  slug text not null unique,
  formulation_family text,
  product_line_type text,
  viscosity text,
  finish text,
  open_time_profile text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.pigments (
  id text primary key,
  code text not null unique,
  slug text not null unique,
  pigment_full_name text,
  ci_name text,
  organic_or_inorganic text,
  pigment_origin text,
  color_family text,
  status text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.paints (
  id text primary key,
  brand_id text not null references public.brands(id),
  medium_id text not null references public.mediums(id),
  product_line_id text not null references public.product_lines(id),
  source_id text references public.sources(id),
  name text not null,
  slug text not null,
  canonical_key text not null unique,
  color_family text,
  pigment_count integer,
  single_pigment boolean,
  verification_status text not null default 'Needs Review',
  notes text,
  created_at timestamptz not null default now()
);

create unique index if not exists paints_product_line_slug_idx
  on public.paints (product_line_id, slug);

create table if not exists public.paint_pigments (
  id bigserial primary key,
  paint_id text not null references public.paints(id) on delete cascade,
  pigment_id text not null references public.pigments(id),
  pigment_code text not null,
  pigment_sequence integer,
  relationship_type text,
  verification_status text not null default 'Needs Review',
  notes text
);

create unique index if not exists paint_pigments_unique_link_idx
  on public.paint_pigments (paint_id, pigment_id, pigment_sequence);

create table if not exists public.paint_behavior (
  id bigserial primary key,
  paint_id text not null unique references public.paints(id) on delete cascade,
  transparency text,
  opacity_code text,
  permanence text,
  granulation text,
  staining text,
  temperature text,
  finish text,
  viscosity text,
  open_time_profile text,
  behavior_source text,
  verification_status text not null default 'Needs Review',
  notes text
);

create table if not exists public.measurements (
  id bigserial primary key,
  paint_id text not null references public.paints(id) on delete cascade,
  source_id text references public.sources(id),
  measurement_type text not null,
  density numeric,
  rgb_red integer,
  rgb_green integer,
  rgb_blue integer,
  rgb_combined text,
  swatch text,
  measurement_method text,
  source_url text,
  notes text
);

create index if not exists paints_brand_idx on public.paints (brand_id);
create index if not exists paints_medium_idx on public.paints (medium_id);
create index if not exists paints_product_line_idx on public.paints (product_line_id);
create index if not exists pigments_code_idx on public.pigments (code);
