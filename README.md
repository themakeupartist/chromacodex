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
- A local app data layer in `src/data/chromacodex.ts` backed by generated workbook JSON
- A Supabase/Postgres schema in `supabase/schema.sql`
- A generated Supabase seed file in `supabase/seed.sql`
- A workbook import pipeline in `scripts/import-workbook.mjs` that emits summary, normalized JSON, and seed SQL
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
4. Apply the generated schema and seed to Supabase/Postgres
5. Replace the local JSON-backed helpers with database queries

## Source workbook

The current source workbook lives at:

- `./ChromaCodex-Database-v15.xlsx`

It is being used as the source blueprint for data modeling and import logic, not as the long-term application datastore.

## Current repo reality

Workbook-backed right now:

- The Next.js browse and detail pages read from `src/data/chromacodex.ts`
- `src/data/chromacodex.ts` reads `src/data/generated/workbook-normalized.json`
- `scripts/import-workbook.mjs` generates workbook summary JSON, normalized JSON, and `supabase/seed.sql`
- `supabase/seed.sql` is now generated from the normalized workbook export instead of being a tiny manual starter seed

Still scaffolded or transitional:

- The app is still reading local generated JSON rather than querying Supabase directly
- `supabase/schema.sql` models the target relational structure, but no runtime database client is wired into the app yet
- Static reference content in `src/app/reference/page.tsx` is still hand-authored copy
- Duplicate canonical paint keys and incomplete pigment records are detected during import and currently handled during seeding rather than fully resolved in-source
