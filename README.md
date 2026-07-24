# 17TH BIRTHDAY

An interactive retro PC-game birthday invitation built with React, Vite, TypeScript, Vercel Functions, Neon PostgreSQL, bcrypt, signed HttpOnly sessions, and Spotify Embed.

## Local development

Requirements: Node.js 20+, npm, and a Neon resource connected to the Vercel project.

```bash
npm install
npx vercel link
npx vercel env pull .env.local --environment=development
npm run db:migrate
npm run db:seed
npm run db:check
npm run dev:full
```

`npm run dev:full` uses `vercel dev`, which serves Vite and the `/api` functions together. `npm run dev` and `npm run dev:client` start only Vite and are suitable only for client-side visual work. Keeping `dev` as Vite avoids recursive `vercel dev` invocation.

Production verification:

```bash
npm run build
npm run preview
```

## Environment variables

- `DATABASE_URL`: pooled Neon PostgreSQL URL, supplied by the connected Vercel Marketplace resource.
- `SESSION_SECRET`: cryptographically random string of at least 32 characters.
- `GUEST_SEED_DATA`: optional JSON seed override; not required for normal local setup.

Standalone database scripts load `.env.local` automatically. Meaningful variables already present in the shell take precedence. No database variable is exposed through Vite.

`.env.local` and related local environment files are ignored. Generate a session secret, if needed, with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Never commit the generated value.

## Database setup and migration

1. Connect Neon to this Vercel project for Development, Preview, and Production.
2. Pull Development variables into `.env.local`.
3. Run `npm run db:migrate`.
4. Run `npm run db:seed`.
5. Run `npm run db:check`.

The migration in [db/schema.sql](db/schema.sql) is safe to rerun. It creates `guests` and `quiz_results`, their foreign key, uniqueness and score constraints, leaderboard indexes, and a trigger that prevents READY from reverting to WAITING. `db:check` runs a harmless connectivity query and verifies both tables without printing credentials.

## Guest seeding

Normal local seeding reads `guest-seed.private.json`. This file contains plaintext invitation codes and is intentionally ignored by Git. `guest-seed.example.json` documents the format with dummy values.

```bash
npm run db:seed
```

The script:

1. Uses `GUEST_SEED_DATA` when that optional variable exists.
2. Otherwise reads `guest-seed.private.json`.
3. Requires exactly seven non-empty name/code entries.
4. bcrypt-hashes every code with cost 12.
5. inserts or updates only the hash.

The private file and environment override are never used by the browser or API runtime.

## Neon + Vercel setup

1. Run `npx vercel link` and confirm the linked project is `youareinvited`.
2. In Vercel, connect the Neon Marketplace resource to this project for Development, Preview, and Production.
3. Confirm `DATABASE_URL` is present and non-empty in all three scopes.
4. Add `SESSION_SECRET` to Development, Preview, and Production.
5. Pull local variables:

   ```bash
   npx vercel env pull .env.local --environment=development
   ```

6. Run migration, seed, and check commands shown above.

## Deployment

1. Import or link the repository in Vercel.
2. Keep the Vite output directory as `dist`.
3. Connect Neon and set `SESSION_SECRET`.
4. Apply migration and seed once.
5. Verify locally with `npm run dev:full`.
6. Deploy:

   ```bash
   npx vercel
   npx vercel --prod
   ```

7. Verify `/api/guests`, RSVP, `/api/me`, quiz submission, and `/api/leaderboard`.

## Project structure

```text
api/                 Vercel serverless endpoints
db/schema.sql        PostgreSQL schema
scripts/             env loader, migration, seed, and database check
server/              database, HTTP, session, and private quiz logic
src/components/      reusable game UI and Spotify player
src/hooks/           Web Audio sound system
src/lib/             client API helper
src/screens/         application screens
```

## RSVP and session security

`POST /api/rsvp` trims the name, performs a case-insensitive database lookup, compares the case-sensitive code with bcrypt, moves the guest to READY, and sets a signed HttpOnly SameSite=Lax cookie. Production cookies also use Secure. Authentication failures are generic.

The API never returns `code_hash`, plaintext codes, `DATABASE_URL`, or `SESSION_SECRET`.

## Quiz authentication and leaderboard

Question answers and official scoring remain in `server/quiz.ts`. Quiz endpoints require the signed session. The browser submits answer indexes, not a guest ID or claimed score. The server derives identity from the cookie and calculates the result. The leaderboard selects each guest's best score, with earliest achievement breaking ties.

## Modifying quiz questions

Edit `server/quiz.ts`. Keep the fixed question order, exactly four choices per question, and the zero-based `correct` index. If changing the question count, update server validation and displayed totals.

## Adding or removing guests

Update the ignored private seed file and rerun `npm run db:seed`. Display names must remain unique case-insensitively. Removing a guest requires a deliberate database operation and cascades quiz attempts. There is intentionally no public delete or READY-reset endpoint.

## Changing Spotify

Update the official `/embed/playlist/{playlist-id}` URL in `src/components/MusicPlayer.tsx`. Preserve the iframe permissions for encrypted-media playback.

## Troubleshooting

- **`DATABASE_URL is required`:** confirm Neon is connected to the same project and Development environment, then repull `.env.local`.
- **Downloaded `DATABASE_URL` is empty:** reconnect the Neon resource to that project/environment in Vercel; do not invent a URL.
- **Missing tables:** run `npm run db:migrate`, followed by `npm run db:check`.
- **Seed input error:** confirm ignored `guest-seed.private.json` exists and follows `guest-seed.example.json`.
- **RSVP fails for every guest:** verify exact Unicode names and case-sensitive codes were seeded.
- **Session is not retained:** use `npm run dev:full`, not client-only Vite.
- **Spotify does not play:** playback requires user interaction and may require Spotify login.
