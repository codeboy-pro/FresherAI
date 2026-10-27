# FresherAI — Multi-Agent AI Interview Platform

FresherAI is a MERN-stack project in its early full-stack phase. Its goal is to help freshers practise interviews with AI-powered agents and receive structured feedback. The project uses independent backend services so features can grow without putting all responsibilities in one application.

## Current progress

The foundation built so far includes:

- An **API Gateway** that receives public requests and forwards `/api/auth` traffic to the authentication service.
- An independent **Auth Service** built with Express.
- **Firebase Admin** integration for verifying Google/Firebase ID tokens.
- **MongoDB + Mongoose** user persistence, including Firebase UID, profile data, interview-coin balance, and timestamps.
- An Auth Service router with `POST /login` and `GET /logout`, plus JSON-body and cookie-parsing middleware.
- **Redis-backed sessions** with a seven-day expiry, and Docker Compose to run Redis locally.
- A **React + Vite + Tailwind CSS** frontend with a home page, animated login modal, and a placeholder dashboard route.

The frontend sign-in button is currently UI-only; Firebase client sign-in and the API request are not connected yet. Billing, interview, resume, and roadmap services are planned but not implemented.

## Architecture

```text
React client :5173
  │  Firebase ID token (planned integration)
  ▼
API Gateway :6000
  │  /api/auth
  ▼
Auth Service :6001 ──► Firebase Admin (verify token)
  │                         │
  ├─────────────────────────┴──► MongoDB (users)
  └────────────────────────────► Redis (sessions)
```

Keeping the gateway separate gives clients one entry point and keeps authentication logic isolated. Additional services can later be connected through the gateway in the same way.

## Project structure

```text
backend/
├── gateway/                  # Public API entry point and request proxy
├── shared/redis/              # Shared Redis client
├── docker-compose.yml         # Local Redis container
└── services/
    ├── auth/                 # Firebase verification and user management
    │   ├── configs/          # MongoDB and Firebase configuration
    │   ├── controllers/      # Authentication business logic
    │   └── models/           # Mongoose user schema
    ├── billing/              # Planned
    ├── interview/            # Planned
    ├── resume/               # Planned
    └── roadmap/              # Planned
frontend/
├── src/pages/                # Home and dashboard routes
└── src/components/           # Login modal
```

## Run locally

### Prerequisites

- Node.js
- MongoDB connection string
- A Firebase service-account JSON file for the Auth Service
- Docker Desktop or Docker Engine (to run Redis)

### 1. Configure environment variables

Create `backend/gateway/.env`:

```env
PORT=6000
AUTH_SERVICE_URL=http://localhost:6001
```

Create `backend/services/auth/.env`:

```env
PORT=6001
MONGODB_URI=your_mongodb_connection_string
REDIS_URL=redis://localhost:6379
```

Place your Firebase Admin service-account file at:

```text
backend/services/auth/serviceAccountKey.json
```

Never commit `.env` files or the Firebase service-account key. They are excluded by `.gitignore`.

### 2. Start Redis

```bash
cd backend
docker compose up -d
```

### 3. Install and start the backend services

```bash
cd backend/services/auth
npm install
npm run dev
```

In a second terminal:

```bash
cd backend/gateway
npm install
npm run dev
```

### 4. Start the frontend

In a third terminal:

```bash
cd frontend
npm install
npm run dev
```

### Current health checks

- `GET http://localhost:6000/` → API gateway response
- `GET http://localhost:6001/` → Auth service response
- `GET http://localhost:5173/` → FresherAI home page

## Current authentication API

| Public endpoint | Method | Current purpose |
| --- | --- | --- |
| `/api/auth/login` | `POST` | Verifies a Firebase ID token, creates/fetches a user, and stores a Redis session. |
| `/api/auth/logout` | `GET` | Intended to delete the Redis session and clear the session cookie. |

For login, send a JSON body such as `{ "token": "firebase_id_token" }`. The frontend integration is still pending.

## Known work in progress

- The logout controller needs its `req` and `res` parameters added before the endpoint can work.
- Cookie option names need correcting to `httpOnly` and `sameSite`; secure cookies should be enabled in production.
- Add input validation and more specific authentication error responses.
- Configure frontend Firebase sign-in, then call the gateway login endpoint with the returned ID token.

## Next implementation steps

1. Complete the Firebase sign-in flow between the frontend and Auth Service.
2. Fix and test logout, cookie security, validation, and error handling.
3. Build the dashboard and interview workflow services.
4. Add automated tests and production configuration.

## Tech used so far

React, Vite, Tailwind CSS, Motion, React Router, Node.js, Express, MongoDB, Mongoose, Redis, Docker Compose, Firebase Admin SDK, dotenv, nodemon, and `express-http-proxy`.
