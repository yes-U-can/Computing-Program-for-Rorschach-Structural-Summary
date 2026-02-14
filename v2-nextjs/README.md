# Computing Program for Rorschach Structural Summary (v2-nextjs)

Next.js-based web application for Exner structural summary scoring, documentation browsing, and AI-assisted interpretation.

## Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- NextAuth (Google OAuth)
- Prisma + PostgreSQL

## Main Features

- Scoring input UI (desktop table + mobile card flow)
- Structural summary calculation and result views
- AI chat support using user-provided API keys
- Documentation pages with static subpages (`/docs/...`)
- Privacy policy index and subpages (`/privacy/...`)
- CSV export, print-friendly result output

## Local Development

```bash
npm install
npm run dev
```

## Quality Checks

```bash
npx eslint app components hooks i18n lib --max-warnings=0
npm run build
```

## Deployment

- Source branch: `main`
- Deploy target: Vercel Production
- If Vercel shows an old commit, trigger a new production deployment from the latest `main` commit.

## Repository Layout

```text
app/            Next.js routes and API handlers
components/     UI and feature components
hooks/          Client hooks
i18n/           Translation config and locale JSON
lib/            Core logic and utilities
prisma/         Prisma schema and config
types/          Shared TypeScript types
```

## Security Notes

- Do not commit secrets (`.env`, API keys, private notes).
- Keep private operational notes outside tracked files.
