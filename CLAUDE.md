# CLAUDE.md

## Project

Buta Solutions — CMS for digital agency: manage services, projects, and leads. Admin dashboard with JWT auth, public landing page with contact form.

## Stack

- **Frontend**: Next.js 14 App Router + TypeScript → Vercel
- **Backend**: Express + TypeScript + MongoDB/Mongoose → Render
- **Auth**: JWT (Bearer token, localStorage)

## Commands

```bash
# Backend (cd backend)
npm run dev      # nodemon (ts-node, hot reload)
npm run build    # tsc → dist/
npm start        # node dist/index.js
npm run seed     # wipe DB, re-seed services/projects/admin
npx tsc --noEmit # type check

# Frontend (cd frontend)
npm run dev      # next dev (localhost:3000)
npm run build    # next build + type check + lint
npm run lint     # eslint via next lint
```

## Architecture

### Backend

Single Express app (`src/index.ts`): CORS → helmet → routes.

**Auth**: JWT-only, no cookies. Login returns `{ success, token, admin }` in body. Protected routes read `Authorization: Bearer <token>` via `authMiddleware.ts`. Single admin user (seeded, no registration).

**Route protection**:

- Public: `GET /api/services`, `GET /api/projects`, `GET /api/leads`, `POST /api/leads`
- Protected: all `POST/PUT/DELETE` on services/projects, `DELETE/PATCH` on leads, `GET /api/auth/me`

**Data model**: Mongoose in `src/models/`. Projects embed `services` as array of ObjectId refs, always `.populate('services')` — frontend receives fully populated service objects.

**Seed script** (`src/seed/seed.ts`): wipes collections, re-seeds. Safe to run repeatedly; admin check uses `findOne` and skips if exists.

### Frontend

Next.js 14 App Router. Public landing page is server component (`app/page.tsx`) fetching from backend at render time with `{ next: { revalidate: 60 } }`, passing data as props to client components.

**Auth**: JWT stored in `localStorage`. `lib/auth.ts` exports `getToken()`, `getAuthHeaders()`, `login()`, `logout()`, `getMe()`. Admin page fetches add `...getAuthHeaders()` to headers. `hooks/useAdminAuth.ts` (client hook) calls `getMe()` on mount, redirects to `/admin/login` if missing/invalid.

**Admin layout** (`app/admin/layout.tsx`): renders sidebar for all admin routes except `/admin/login`. Calls `useAdminAuth()`, shows blank screen during auth check (prevents flash).

**Type alignment**: Frontend `Service` and `Project` in `lib/api.ts` use `_id` (Mongoose raw JSON). Projects include `services: Service[]` (populated array).

**Middleware** (`middleware.ts`): passthrough for Next.js Edge config. Route protection is entirely client-side via `useAdminAuth()`.

## Environment Variables

**Backend** (`.env`):

```
MONGODB_URI          # MongoDB Atlas connection string
JWT_SECRET           # Generate: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
RESEND_API_KEY       # Email (optional, non-blocking failures)
RESEND_FROM_EMAIL    # Email sender
PORT                 # Defaults to 5000
CORS_ORIGIN          # Must exactly match frontend origin (e.g., https://yourapp.vercel.app)
```

**Frontend** (`.env.local`):

```
NEXT_PUBLIC_API_URL  # Backend base URL, no trailing slash
```

## Key Design Decisions

- **No cookies**: localStorage + Bearer tokens solve cross-origin issues (Vercel ↔ Render).
- **CORS_ORIGIN**: no wildcard when making credentialed requests; Bearer tokens allow `*` if needed.
- **Seed destructive**: `npm run seed` clears all collections before inserting. Don't run on production unless intentional.
- **Admin credentials**: `admin@butasolutions.com` / `Admin1234!` (seeded; change in production).
- **Monorepo**: two independent apps, no shared packages. All commands run from respective directory.

## Git Workflow

- Push to remote after every meaningful commit — each Claude session is independent
- Run `git status` and `git diff` before committing
- Never force push; resolve conflicts normally
- No local-only work — assume it can be lost between sessions
