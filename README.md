# substream.movie

Learn English by watching films and series with **dual subtitles**: click any word for a
translation, save it to your dictionary and review it later with spaced repetition.

## Features

- **Home** — featured title, continue watching, coming soon (with “Notify me”), top movies /
  series / actors, “New on site” feed (New / Popular + language filter), collections, quick links.
- **Catalog** (Movies / Series / Cartoons) — filters for language, CEFR level (A1–C2), genre,
  year range and country; sorting by popularity, date added, IMDb or audience rating; “Show more”.
  Filters live in the URL, so every view is shareable and back-button safe.
- **Title page** — poster, ratings, level, details, cast, seasons and episodes, add to list.
- **Player** — original + translation subtitles (toggle each), click-a-word lookup, replay the
  previous line, pause after each line, speed control, fullscreen, keyboard shortcuts, automatic
  watch-progress saving and resume.
- **Account** — profile and UI language, subscription status, lists, dictionary with review mode,
  title requests, FAQ.
- **Search** across titles and actors.
- UI in **Russian and English**, light/dark themes, mobile-first (no horizontal scroll at 360 px).

## Stack

| Layer           | Choice                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------ |
| Framework       | Next.js 16 (App Router) · React 19 · TypeScript (strict)                                   |
| Styling         | SCSS Modules + CSS custom properties (design tokens), Radix UI                             |
| State           | Redux Toolkit (client state) + RTK Query (server state)                                    |
| Forms           | React Hook Form + Zod (schemas shared by client and server)                                |
| Backend         | Route Handlers + Server Actions                                                            |
| Data            | PostgreSQL + Prisma 7 (`@prisma/adapter-pg`)                                               |
| Auth            | Auth.js v5 — email magic link (+ Google when configured)                                   |
| Tests / quality | Vitest + Testing Library, Playwright + axe, ESLint, Stylelint, Prettier, Husky, commitlint |

## Getting started

Requirements: Node.js ≥ 20.9, Docker (or any PostgreSQL 16).

```bash
npm install                          # also runs `prisma generate`
cp .env.example .env                 # then set AUTH_SECRET (openssl rand -base64 32)
docker compose up -d                 # local PostgreSQL
npm run db:migrate -- --name init    # first run creates prisma/migrations/…_init
npm run db:seed                      # placeholder catalog + demo user
npm run dev
```

- **Video:** put any `.mp4` at `public/media/sample.mp4` (git-ignored). The seed points every
  movie/episode to it. Sample subtitles in `public/media/subtitles/` are original lines written
  for this project.
- **Sign in:** without `EMAIL_SERVER`, the magic link is printed in the dev server console.
  Seeded user: `demo@substream.movie`.
- **Word translations:** a small built-in EN→RU glossary works offline. Set `TRANSLATE_API_URL`
  (LibreTranslate-compatible) for full coverage; users can always edit the translation.

## Scripts

| Script                            | What it does                              |
| --------------------------------- | ----------------------------------------- |
| `npm run dev` / `build` / `start` | Next.js                                   |
| `npm run check`                   | lint + stylelint + typecheck + unit tests |
| `npm test`                        | Unit tests (Vitest)                       |
| `npm run test:e2e`                | E2E + accessibility (Playwright + axe)    |
| `npm run db:migrate`              | Create/apply migrations                   |
| `npm run db:seed`                 | Seed placeholder data (idempotent)        |
| `npm run db:studio`               | Prisma Studio                             |

E2E tests build and start the app on port 3100 and need a seeded database. They sign in by
creating an Auth.js session for the demo user directly in the database
(`tests/e2e/global-setup.ts`).

## Architecture

```
src/
  app/          routes only: layouts, pages, loading/error states, route handlers
  features/     business features — catalog, player, subtitles, dictionary, watch-progress,
                lists, upcoming, requests, auth, profile
  components/   ui/ (design-system primitives), layout/ (header, footer, navigation)
  store/        makeStore (per request), base-api (RTK Query), typed hooks, provider
  lib/          db client, i18n, API helpers
  config/       zod-validated env, site config
  styles/       tokens + dark theme, abstracts (auto-injected into every module), base
```

Rules:

- A feature is imported only through its public API: `@/features/<name>` (client-safe) or
  `@/features/<name>/server` (server-only). Enforced by ESLint.
- Server data goes through RTK Query (client) or Server Components; slices hold client state only
  (player, subtitle settings — persisted to `localStorage`).
- Catalog filters are URL search params, parsed by one zod schema used by pages, API and client.
- Styles use tokens only (`var(--color-…)`), `@use`/`@forward`, mobile-first `respond-to()`.

### API

| Method       | Path                           | Purpose                                     |
| ------------ | ------------------------------ | ------------------------------------------- |
| GET          | `/api/titles`                  | Catalog page (filters + `page`, `pageSize`) |
| GET          | `/api/dictionary/lookup?word=` | Translate a word, check if saved            |
| GET/POST     | `/api/dictionary/words`        | List / save words (auth)                    |
| PATCH/DELETE | `/api/dictionary/words/:id`    | Update, review (`{ isRemembered }`), delete |
| PUT/POST     | `/api/watch-progress`          | Save position (POST for `sendBeacon`)       |
| GET          | `/api/health`                  | Health check                                |

### Keyboard shortcuts (player)

`Space`/`K` play · `←`/`→` ±5 s · `A` replay line · `S` original subtitles · `T` translation ·
`P` pause after each line · `F` fullscreen · `Esc` closes the word card.

## Content and design

All titles, people, descriptions and subtitles in the seed are invented placeholders. The UX
follows common patterns of language-learning video sites; the visual design, copy and code are
original. Use only video and subtitle files you have the rights to.

Commits follow [Conventional Commits](https://www.conventionalcommits.org/).
