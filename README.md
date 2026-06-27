# Alshamy Alaswad Salon for Gents

Production-ready multilingual luxury salon platform built with Next.js 15, TypeScript, Tailwind CSS, Prisma, Auth.js, next-intl, React Hook Form, Zod, TanStack Query, UploadThing, Resend, Google Maps, WhatsApp links, and Vercel deployment defaults.

## Quick Start

```bash
cp .env.example .env
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Open `http://localhost:3000/en`.

## Production Checklist

- Configure PostgreSQL in `DATABASE_URL`.
- Set `AUTH_SECRET`, OAuth credentials, Resend, Google Maps, UploadThing, WhatsApp, and optional Stripe keys.
- Run `npm run typecheck`, `npm run lint`, `npm run test`, and `npm run build`.
- Deploy to Vercel with the environment variables from `.env.example`.

## Architecture

- `app`: App Router routes, metadata, SEO files, localized pages, APIs.
- `components`: Reusable UI, layout, marketing sections, forms, dashboards.
- `features`: Domain-specific feature modules.
- `lib`: Auth, database, validation, utilities, integrations.
- `prisma`: Complete relational schema and seed data.
- `messages`: English and Arabic translations.
- `tests` and `e2e`: Vitest and Playwright coverage.
