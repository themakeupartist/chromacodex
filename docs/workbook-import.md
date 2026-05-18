# Workbook import strategy

## Current source

- `ChromaCodex-Database-v15.xlsx`

## Goal

Move from workbook-managed relational logic to database-managed relational data while preserving:

- canonical IDs
- brand normalization
- medium and product-line separation
- many-to-many paint/pigment links
- measurement and behavior records
- source and verification metadata

## Import phases

### Phase 1
- Read workbook XML directly from the `.xlsx` zip container
- Extract only the data-bearing tabs
- Ignore dashboard, query, and formula helper tabs
- Produce normalized JSON snapshots for inspection

### Phase 2
- Load or upsert sources
- Load brands and mediums
- Load product lines
- Load pigments
- Load paints
- Load paint-to-pigment relationships
- Load behavior and measurement rows

Current repo status:

- normalized workbook export is implemented
- local app reads the generated workbook JSON
- generated seed SQL is implemented for Supabase/Postgres refreshes

### Phase 3
- Add integrity checks
- flag incomplete pigment codes
- detect canonical-key duplicates
- detect missing foreign-key targets
- compare row counts with workbook sheets

## Important import decisions

- Workbook IDs should be preserved where possible during early migration
- Unknown values stay null
- Suspicious values should receive `Needs Review`
- Query sheets should never be treated as authoritative source tables

## Current scaffold status

The repository includes a starter import script at `scripts/import-workbook.mjs`. It currently:

- opens the workbook as a zip file
- reads workbook metadata and shared strings
- extracts row values from selected source tabs
- writes a summary JSON file to `src/data/generated/`
- writes a normalized workbook export to `src/data/generated/workbook-normalized.json`
- writes generated seed SQL to `supabase/seed.sql`
- derives paint pigment counts and single-pigment flags from the join table
- emits integrity checks for duplicate canonical keys, suspicious pigment codes, and missing foreign-key targets

## Seed generation notes

The generated `supabase/seed.sql` currently performs a full refresh of the normalized tables instead of row-by-row upserts.

That choice is deliberate for now because:

- `paint_behavior`, `measurements`, and `paint_pigments` do not yet preserve workbook IDs in the database schema
- `measurements` does not yet have a natural unique constraint suitable for clean upserts
- the workbook currently contains duplicate `canonical_key` paint rows that must be resolved before a pure upsert path is trustworthy

During seed generation:

- records with broken foreign-key references would fail the generation step
- duplicate paint canonical keys are reduced to one seedable paint row per key so the current schema can load successfully
- the skipped duplicate paint IDs are documented in the generated SQL comments

The next implementation step after this is to wire the Next.js app to query Supabase directly instead of reading the local generated JSON snapshot.
