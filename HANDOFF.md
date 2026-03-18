# HANDOFF.md

## Overview
Buta Solutions agency site: Next.js 14 frontend (Vercel) + Express backend (Render) + MongoDB Atlas. Single-page public site with scroll sections, plus a protected `/admin` dashboard for CRUD on services/projects and lead management. Auth is JWT via localStorage — no cookies. See `CLAUDE.md` for full architecture.

Key dirs: `frontend/app/admin/`, `frontend/hooks/useAdminAuth.ts`, `frontend/lib/auth.ts`, `backend/src/controllers/`, `backend/src/middleware/authMiddleware.ts`.

---

## Status

**Done:**
- Full public landing page (Hero, About, WhatWeDo, ServiceDrawer, Projects, Contact, Footer)
- Express API with all CRUD endpoints; seed script populates 6 services, 6 projects, 1 admin
- Admin dashboard: login, dashboard stats, projects/services/leads CRUD
- Auth migrated from httpOnly cookies → localStorage + Bearer token (cross-origin fix)
- CORS configured; deployed to Vercel + Render

**In-progress:** Nothing actively in-flight.

**Blocked:** [UNKNOWN — verify Render deployment is stable after latest CORS + auth changes]

---

## Decisions

- **localStorage + Bearer over httpOnly cookies** — httpOnly cookies failed cross-origin between Vercel and Render regardless of `sameSite: none`. Switched this session; no plans to revert.
- **`middleware.ts` is a passthrough** — Next.js Edge runtime can't read localStorage, so route protection moved entirely client-side via `useAdminAuth`. The file exists only to satisfy Next.js matcher config.
- **Admin layout guards login page separately** — `app/admin/layout.tsx` skips the sidebar and auth check when `pathname === '/admin/login'` to avoid redirect loops.
- **`CORS_ORIGIN=*` is now safe** — since we no longer send credentials via cookies, wildcard origin works for the public API. Verify the env var on Render matches what's needed.

---

## Next Steps

1. **Verify Render redeploy** — confirm backend is live and `GET /api/health` returns 200 after the auth + CORS changes.
2. **Test admin login end-to-end** on production (Vercel → Render) using `admin@butasolutions.com` / `Admin1234!`.
3. **Cloudinary image uploads** — `Project.image` is currently a plain URL string. The spec called for Cloudinary but it was never wired up. Add upload in `app/admin/projects/page.tsx` modal.
4. **Dashboard page auth** — `app/admin/page.tsx` is a server component fetching public endpoints. If leads ever become auth-protected on the backend, this page will need to become a client component using `getAuthHeaders()`.
5. **Change admin password** — seeded credential (`Admin1234!`) is in `CLAUDE.md` and the seed script. Add a change-password route or update the seed before going live publicly.

---

## Gotchas

- **`npm run seed` wipes everything** — running it against production drops all services, projects, and leads. The admin is re-checked with `findOne` and skipped if exists, but all other data is deleted.
- **`app/admin/page.tsx` is a server component** — it cannot use `getAuthHeaders()` or `localStorage`. It fetches public endpoints only. Don't add protected fetches here without converting to `"use client"`.
- **`Project.services` is always populated** — queries always call `.populate('services')`. Frontend type is `services: Service[]`, never `ObjectId[]`. Don't send raw IDs from the frontend — send `_id` strings, the backend resolves them.
- **No test suite exists** — zero tests anywhere in the repo.
- **`cookie-parser` is still installed** in the backend but no longer used. Can be removed.
