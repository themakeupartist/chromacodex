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

The next implementation step is to transform those extracted rows into typed normalized records that can be inserted into Postgres.
