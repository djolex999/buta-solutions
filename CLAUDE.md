# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Layout

Monorepo with two independent apps — no shared packages:

```
buta-solutions/
├── backend/    # Express + TypeScript API (deploy to Render/Railway)
└── frontend/   # Next.js 14 App Router (deploy to Vercel)
```

All commands must be run from within their respective directory.

## Commands

### Backend (`cd backend`)
```bash
npm run dev      # nodemon (ts-node, hot reload)
npm run build    # tsc → dist/
npm start        # node dist/index.js (production)
npm run seed     # wipe DB and re-seed services, projects, admin
npx tsc --noEmit # type check without emitting
```

### Frontend (`cd frontend`)
```bash
npm run dev      # next dev (localhost:3000)
npm run build    # next build (also runs type check + lint)
npm run lint     # eslint via next lint
```

## Architecture

### Backend

Single Express app (`src/index.ts`) with CORS first, then helmet, then routes.

**Auth flow:** JWT-only, no cookies. Login returns `{ success, token, admin }` in the response body. All protected routes read `Authorization: Bearer <token>` via `authMiddleware.ts`. The single admin user is seeded — there is no registration route.

**Route protection pattern:**
- Public (no auth): `GET /api/services`, `GET /api/projects`, `GET /api/leads`, `POST /api/leads`
- Protected (auth required): all `POST/PUT/DELETE` on services and projects, `DELETE/PATCH` on leads, `GET /api/auth/me`

**Mongoose models** live in `src/models/`. Projects embed `services` as an array of ObjectId refs that are always `.populate('services')` in queries — the frontend receives fully populated service objects, not raw IDs.

**Seed script** (`src/seed/seed.ts`) wipes all collections before re-seeding. Re-running it is safe — the admin check uses `findOne` and skips if already exists.

### Frontend

Next.js 14 App Router. Public landing page is a server component (`app/page.tsx`) that fetches from the backend at render time with `{ next: { revalidate: 60 } }` and passes data as props to client components.

**Auth flow:** After login, the JWT is stored in `localStorage`. `lib/auth.ts` exports `getToken()`, `getAuthHeaders()`, `login()`, `logout()`, and `getMe()`. Every admin page fetch call adds `...getAuthHeaders()` to request headers. `hooks/useAdminAuth.ts` is a client hook that calls `getMe()` on mount and redirects to `/admin/login` if the token is missing or invalid.

**Admin layout** (`app/admin/layout.tsx`) renders the sidebar for all admin routes except `/admin/login`, which gets a plain wrapper. The layout calls `useAdminAuth()` and shows a blank screen while checking auth (prevents flash of protected content).

**`middleware.ts`** is a passthrough — it exists only for Next.js Edge config. Route protection is entirely client-side via `useAdminAuth`.

**Type alignment:** The frontend `Service` and `Project` interfaces in `lib/api.ts` use `_id` (not `id`) to match Mongoose's raw JSON output. Projects include `services: Service[]` as a populated array.

## Environment Variables

**Backend** (`.env`):
- `MONGODB_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — sign/verify JWTs (generate with `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)
- `RESEND_API_KEY` / `RESEND_FROM_EMAIL` — email notifications on lead submission (failures are non-blocking)
- `PORT` — defaults to 5000
- `CORS_ORIGIN` — must exactly match frontend origin (e.g. `https://yourapp.vercel.app`)

**Frontend** (`.env.local`):
- `NEXT_PUBLIC_API_URL` — backend base URL, no trailing slash

## Key Design Decisions

- **No cookies anywhere** — switched from httpOnly cookies to localStorage+Bearer to solve cross-origin issues between Vercel and Render.
- **CORS_ORIGIN must not use a wildcard (`*`) when the frontend makes credentialed requests** — but since we moved to Bearer tokens, `*` now works for CORS if needed.
- **Seed resets data** — `npm run seed` in backend clears services, projects, and leads before inserting. Do not run against production unless intentional.
- **Admin credentials:** `admin@butasolutions.com` / `Admin1234!` (seeded, change in production).
