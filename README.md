# substream.movie

Learn English by watching films and series with dual subtitles.

## Stack

Next.js (App Router) · React · TypeScript (strict) · SCSS Modules · Redux Toolkit + RTK Query ·
Zod · Vitest + Testing Library · ESLint · Stylelint · Prettier · Husky + lint-staged + commitlint.

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Scripts

| Script                | What it does                      |
| --------------------- | --------------------------------- |
| `npm run dev`         | Start the dev server              |
| `npm run build`       | Production build                  |
| `npm run lint`        | ESLint (zero warnings allowed)    |
| `npm run lint:styles` | Stylelint for `*.scss`            |
| `npm run typecheck`   | `tsc --noEmit`                    |
| `npm test`            | Unit tests (Vitest)               |
| `npm run check`       | lint + styles + typecheck + tests |

## Architecture

- `src/app` — routes and composition only.
- `src/features/<name>` — business features. Import a feature only via its `index.ts`
  (enforced by ESLint `no-restricted-imports`).
- `src/store` — `makeStore()` (one store per request), `base-api.ts` (RTK Query; features use
  `injectEndpoints`), typed hooks in `hooks.ts`, `StoreProvider`.
- `src/styles` — tokens, abstracts (auto-injected into every SCSS module via `sassOptions.additionalData`),
  base styles and themes.

Commits follow [Conventional Commits](https://www.conventionalcommits.org/).
