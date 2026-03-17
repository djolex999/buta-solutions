# Buta Solutions

Software agency website — built with Next.js 14, Express, MongoDB, and Tailwind CSS.

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
# Edit .env with your MongoDB URI and Resend API key
```

### Environment Variables (backend/.env)

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `RESEND_API_KEY` | Resend API key for email notifications |
| `RESEND_FROM_EMAIL` | Sender email address |
| `PORT` | Server port (default: 5000) |
| `CORS_ORIGIN` | Frontend URL (default: http://localhost:3000) |

### Seed the Database

```bash
npm run seed
```

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
| GET | `/api/health` | Health check |

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

The site will be available at `http://localhost:3000`.

## Deployment

- **Frontend**: Deploy to Vercel — connect the `frontend/` directory
- **Backend**: Deploy to Railway — connect the `backend/` directory
- Update `NEXT_PUBLIC_API_URL` to point to the deployed backend
- Update `CORS_ORIGIN` to point to the deployed frontend

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Express, TypeScript, Mongoose, Resend
- **Database**: MongoDB
