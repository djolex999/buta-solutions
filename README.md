# Buta Solutions

Software agency website with a protected admin dashboard — built with Next.js 14, Express, MongoDB, and Tailwind CSS.

Public site: single page with Hero, About, What We Do (service drawer), Projects and Contact sections. Contact form submissions are stored as leads and trigger an email via Resend. The `/admin` area handles services, projects and leads.

## Project Structure

```
buta-solutions/
├── frontend/          # Next.js 14 (App Router) + TypeScript + Tailwind + Framer Motion
├── backend/           # Express + TypeScript + MongoDB + Mongoose
└── README.md
```

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI, Resend API key and JWT secret
```

### Environment Variables (backend/.env)

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `RESEND_API_KEY` | Resend API key for email notifications |
| `RESEND_FROM_EMAIL` | Sender email address |
| `PORT` | Server port (default: 5000) |
| `CORS_ORIGIN` | Frontend URL (e.g. http://localhost:3000); passed to the CORS middleware as the allowed origin |
| `JWT_SECRET` | Secret used to sign admin JWTs |

### Seed the Database

```bash
npm run seed
```

Seeds 6 services, 6 projects and one admin account (see `backend/src/seed/seed.ts`; change the admin password before going public). The seed deletes existing services, projects and leads, so never run it against production data.

### Run Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services` | List all services |
| GET | `/api/services/:slug` | Get service with related projects |
| GET | `/api/projects` | List all projects (optional `?service=` filter) |
| GET | `/api/projects/:id` | Get single project |
| POST | `/api/leads` | Submit contact form |
| POST | `/api/auth/login` | Admin login, returns a JWT |
| GET | `/api/health` | Health check |

Admin endpoints require `Authorization: Bearer <token>`: `GET /api/auth/me`, create/update/delete for `/api/services` and `/api/projects`, `GET /api/leads/stats`, `DELETE /api/leads/:id`, `PATCH /api/leads/:id/status`.

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local if backend is not on localhost:5000
```

### Environment Variables (frontend/.env.local)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL (default: http://localhost:5000) |

### Run Development Server

```bash
npm run dev
```

The site will be available at `http://localhost:3000`. The admin dashboard is at `/admin` (login at `/admin/login`). Auth is a JWT stored in localStorage and sent as a Bearer token; route protection is client-side (`useAdminAuth`).

## Deployment

- **Frontend**: Deploy to Vercel — connect the `frontend/` directory
- **Backend**: Deploy to Render — connect the `backend/` directory (`npm run build`, then `npm start`), with MongoDB Atlas as the database
- Update `NEXT_PUBLIC_API_URL` to point to the deployed backend
- Set `JWT_SECRET`, `MONGODB_URI`, and the Resend variables on the backend
- Update `CORS_ORIGIN` to point to the deployed frontend

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Express, TypeScript, Mongoose, JWT, Resend, express-validator, helmet
- **Database**: MongoDB
