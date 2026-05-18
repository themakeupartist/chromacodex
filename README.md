# ChromaCodex

ChromaCodex is a web-first color intelligence project for artists. The first release is a readable, searchable paint database that helps artists compare paints across brands, mediums, product lines, and pigment codes.

## Project goals

- Turn the workbook into a proper database-backed web product
- Keep paint identity, pigment identity, and paint behavior separate
- Make the browsing experience easier to read than spreadsheet-like reference sites
- Create a strong foundation for later tools like palette suggestions and paint mixing

## Current scope

This repository currently includes:

- A manual Next.js scaffold in `src/`
- Curated starter data derived from the workbook
- A Supabase/Postgres schema in `supabase/schema.sql`
- A seed script outline in `supabase/seed.sql`
- A workbook import scaffold in `scripts/import-workbook.mjs`
- Reference docs in `docs/`

## Local development

1. Install dependencies:

```bash
npm install
```

2. Start the app:

```bash
npm run dev
```

3. Open `http://localhost:3000`

## Suggested next milestones

1. Install dependencies and run the site locally
2. Create the GitHub repository and add the remote
3. Stand up Supabase and apply the schema
4. Expand the workbook import into a full normalized loader
5. Replace the curated static data with database queries

## Source workbook

The current source workbook lives at:

- `./ChromaCodex-Database-v15.xlsx`

It is being used as the source blueprint for data modeling and import logic, not as the long-term application datastore.
