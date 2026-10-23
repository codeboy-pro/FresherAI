# FresherAI — Multi-Agent AI Interview Platform

FresherAI is a MERN-stack project in its initial backend setup phase. Its goal is to help freshers practise interviews with AI-powered agents and receive structured feedback. The project is being organised as independent services so features can grow without putting all backend responsibilities in one application.

## Current progress

The foundation built so far includes:

- An **API Gateway** that receives public requests and forwards `/api/auth` traffic to the authentication service.
- An independent **Auth Service** built with Express.
- **Firebase Admin** integration for verifying Google/Firebase ID tokens.
- **MongoDB + Mongoose** user persistence, including Firebase UID, profile data, interview-coin balance, and timestamps.
- A first draft of the Google authentication controller. Route registration and request middleware are the next steps.

Planned service folders are present for billing, interviews, resumes, and roadmaps; they are not implemented yet.

## Architecture

```text
Client
  │
  ▼
API Gateway :6000
  │  /api/auth
  ▼
Auth Service :6001 ──► Firebase Admin (verify ID token)
  │
  ▼
MongoDB (users)
```

Keeping the gateway separate gives clients one entry point and keeps authentication logic isolated. Additional services can later be connected through the gateway in the same way.

## Project structure

```text
backend/
├── gateway/                  # Public API entry point and request proxy
└── services/
    ├── auth/                 # Firebase verification and user management
    │   ├── configs/          # MongoDB and Firebase configuration
    │   ├── controllers/      # Authentication business logic
    │   └── models/           # Mongoose user schema
    ├── billing/              # Planned
    ├── interview/            # Planned
    ├── resume/               # Planned
    └── roadmap/              # Planned
```

## Run locally

### Prerequisites

- Node.js
- MongoDB connection string
- A Firebase service-account JSON file for the Auth Service

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
```

Place your Firebase Admin service-account file at:

```text
backend/services/auth/serviceAccountKey.json
```

Never commit `.env` files or the Firebase service-account key. They are excluded by `.gitignore`.

### 2. Install and start both services

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

### Current health checks

- `GET http://localhost:6000/` → API gateway response
- `GET http://localhost:6001/` → Auth service response

## Next implementation steps

1. Add JSON body parsing, cookie parsing, CORS, and an auth router.
2. Connect the Google authentication controller to an endpoint.
3. Validate Firebase-token input and improve error handling.
4. Build the frontend and interview workflow services.

## Tech used so far

Node.js, Express, MongoDB, Mongoose, Firebase Admin SDK, dotenv, nodemon, and `express-http-proxy`.
