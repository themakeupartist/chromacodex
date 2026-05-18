# ChromaCodex schema notes

This project starts from the workbook's relational direction and turns it into a database-friendly structure that will work in Postgres and Supabase.

## Core tables

### `sources`
- One record per data source
- Stores source type, URL, role, and trust notes

### `brands`
- Canonical manufacturer or brand identity
- Prevents duplicate spellings and synonym drift

### `mediums`
- High-level medium categories such as oil, acrylic, gouache, and watercolor
- Keeps shared behavior concepts grouped cleanly

### `product_lines`
- Brand-specific line or formulation family
- Example: a professional acrylic line versus a student acrylic line

### `paints`
- One record per specific paint entry inside a product line
- Stores canonical key, display name, source relationship, and verification state

### `pigments`
- One record per pigment code
- Supports pigment metadata and future enrichment from pigment-specific references

### `paint_pigments`
- Join table for many-to-many relationships between paints and pigments
- Keeps pigment order and relationship type

### `paint_behavior`
- Per-paint behavioral data such as opacity, permanence, staining, finish, and open time
- Useful because behavior often changes across lines even when names overlap

### `measurements`
- Measured or quoted values such as RGB, density, spectral data, or swatches
- Tracks method and source per measurement

## Design rules

- Keep identifiers stable and separate from display labels
- Normalize brands, mediums, and product lines before paint import
- Use nullable fields for unknown values instead of fake defaults
- Keep source traceability on every importable fact
- Treat workbook query sheets as temporary analysis tools, not as application architecture

## Immediate next schema additions

- `media_assets` for swatches, scans, or chart images
- `product_line_attributes` for line-level finish, flow, and rheology
- `reference_terms` for educational content managed from the database
- `verification_events` for tracking review history over time
