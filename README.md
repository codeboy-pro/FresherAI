# 🚀 FresherAI — Multi-Agent AI Interview Platform

<p align="center">
  <b>Practice Smarter. Interview Better. Get Hired Faster.</b>
</p>

<p align="center">
  An AI-powered interview preparation platform designed to help freshers build confidence, improve their resumes, and prepare for real-world technical interviews.
</p>

---

## 🌟 About the Project

**FresherAI** is a MERN-stack, multi-agent AI interview platform currently under active development. It aims to help students and freshers prepare for interviews through specialized AI agents that analyze resumes, conduct mock interviews, evaluate responses, and provide structured feedback.

The platform follows a **microservices-based architecture**, keeping different responsibilities isolated so that individual services can evolve independently.

## ✨ Current Progress

The project foundation currently includes:

### 🔐 Authentication & User Management

- [x] API Gateway with request forwarding to independent backend services.
- [x] Dedicated Authentication Service built with Express.js.
- [x] Firebase Admin SDK integration for Google/Firebase ID token verification.
- [x] MongoDB + Mongoose user persistence, including Firebase UID, profile information, interview-coin balance, and timestamps.
- [x] Authentication APIs: `POST /login` and `GET /logout`.
- [x] Redis-backed sessions with a seven-day expiry.
- [x] Docker Compose configuration for running Redis locally.
- [x] Gateway middleware for CORS, cookies, request logging, and protected `/api/me`.
- [x] Firebase client-side Google sign-in integrated with the authentication API.
- [x] Client-side protected routes and authentication-based redirects.

### 🎨 Frontend & Dashboard

- [x] React + Vite + Tailwind CSS landing page.
- [x] Animated AI agent cards and feature sections.
- [x] Dashboard preview and responsive UI.
- [x] Responsive dashboard shell with expandable desktop navigation and mobile sidebar drawer.
- [x] User profile details and interview-coin balance display.
- [x] Logout interface.

### 📄 AI Resume Scorer

- [x] Dedicated Resume Service for PDF uploads and AI-powered resume analysis.
- [x] PDF text extraction and processing.
- [x] Groq + LangChain-powered resume analysis agent.
- [x] MongoDB storage and Redis caching for resume analysis.
- [x] Protected Resume Scorer page at `/scorer`.
- [x] PDF selection, file-size feedback, loading states, and authenticated uploads.
- [x] Structured JSON-based AI resume analysis with safe parsing and field normalization.
- [x] Nested education, project, and experience data storage.
- [x] ATS analysis results dashboard.
- [x] Resume re-upload functionality while preserving the previous successful result until replacement analysis completes.

### 📝 AI Resume Builder

- [x] Protected Resume Builder route at `/resume`.
- [x] Form-data foundation for personal information, professional summary, skills, experience, projects, and education.
- [x] Redux Toolkit integration for sharing resume-analysis state.
- [x] Six-step resume-building workflow.
- [x] Progress navigation and responsive ATS-style resume preview.
- [x] Print-to-PDF functionality.
- [x] Interview-coin deduction for resume downloads through the Auth Service.

### 🤖 AI Interview Service

- [x] Interview Service with authenticated API Gateway routing.
- [x] MongoDB interview schema with question, answer, feedback, progress, and report fields.
- [x] Groq + LangChain integration with LangGraph orchestration.
- [x] Dedicated prompt templates for:
  - HR interviews
  - Technical interviews
  - Answer evaluation and feedback
  - Interview summaries
- [x] Interview start endpoint that generates and persists questions.
- [x] Answer submission endpoint with per-answer feedback and progress tracking.
- [x] Automatic final summary, score, strengths, weaknesses, and recommendations after the last answer.
- [x] Authenticated interview retrieval by interview ID.
- [x] Protected React routes for interview setup, interview room, and report pages.
- [x] Interview setup UI for role, HR/technical type, and optional resume-based personalization.
- [x] Interview-room UI with an AI avatar, webcam toggle, browser speech-recognition support, countdown timer, written-answer area, and Monaco code editor.

> 🚧 **Note:** The setup page can start an interview and the interview-room UI is available. Connecting answer submission, feedback display, completion navigation, and the final report page is still in progress.

---

## 🏗️ System Architecture

FresherAI follows a microservices-based architecture where the API Gateway acts as the single entry point for frontend requests.

```text
                    🌐 React Client :5173
                            |
                            | Firebase Google Sign-in
                            | ID Token
                            ▼
                    🚪 API Gateway :6000
                            |
             ┌──────────────┼─────────────────┐
             |              |                 |
             ▼              ▼                 ▼
       🔐 Auth Service  📄 Resume Service  🤖 Interview Service
          :6001            :8003              :6003
             |              |                 |
       ┌─────┴─────┐   ┌────┴────┐        ┌───┴────┐
       |           |   |         |        |        |
       ▼           ▼   ▼         ▼        ▼        ▼
    Firebase   MongoDB MongoDB  Redis   MongoDB  Groq AI
     Admin     Users   Resume   Cache   Records  /LangChain
       |                |
       ▼                ▼
    Verify       PDF Extraction
    ID Token          |
                      ▼
                 Groq/LangChain
                 Resume Agent
```

### 🔍 Architecture Highlights

- **API Gateway:** Centralized entry point for routing and authentication middleware.
- **Auth Service:** Handles Firebase token verification, user management, and Redis-backed sessions.
- **Resume Service:** Handles PDF extraction, AI-powered resume analysis, and result storage.
- **Interview Service:** Foundation for AI-generated interview questions, feedback, and summaries.
- **MongoDB:** Persistent storage for user profiles, resume analyses, and interview records.
- **Redis:** Session management and resume-analysis caching.
- **Groq + LangChain:** Powers LLM-based resume analysis and interview-related AI capabilities.

The independent service architecture makes it easier to introduce new features without putting every responsibility into a single backend application.

---

## 📁 Project Structure

```text
FresherAI/
│
├── backend/
│   │
│   ├── gateway/                 # Public API Gateway
│   │
│   ├── shared/
│   │   └── redis/               # Shared Redis client
│   │
│   ├── docker-compose.yml       # Local Redis configuration
│   │
│   └── services/
│       │
│       ├── auth/                # Authentication Service
│       │   ├── configs/         # MongoDB & Firebase configuration
│       │   ├── controllers/     # Authentication logic
│       │   └── models/          # User schema
│       │
│       ├── resume/              # Resume Analysis Service
│       │   ├── agents/          # AI resume analysis agent
│       │   ├── controllers/     # Upload & retrieval logic
│       │   ├── middleware/      # PDF upload validation
│       │   └── models/          # Resume analysis schema
│       │
│       ├── interview/           # AI Interview Service
│       │   ├── agents/          # Question, feedback & summary agents
│       │   ├── graph/           # LangGraph workflow and state
│       │   ├── prompts/         # HR, technical, feedback & summary
│       │   ├── controllers/     # Interview workflow handlers
│       │   ├── routes/          # Interview API routes
│       │   └── models/          # Interview schema
│       │
│       ├── billing/             # Planned
│       └── roadmap/             # Planned
│
└── frontend/
    │
    ├── src/
    │   ├── pages/               # Home & Dashboard pages
    │   ├── components/          # Reusable UI components
    │   ├── apis/                # Gateway API integration
    │   ├── redux/               # Redux Toolkit state management
    │   └── utils/                # Axios & Firebase configuration
    │
    └── package.json
```

---

## ⚙️ Getting Started

Follow these steps to run FresherAI locally.

### 📌 Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Docker Desktop](https://www.docker.com/) or Docker Engine
- Firebase project with Admin SDK service-account credentials
- Groq API key

### 1️⃣ Clone the Repository

```bash
git clone <your-repository-url>
cd FresherAI
```

### 2️⃣ Configure Environment Variables

Create the following environment files.

**📂 `backend/gateway/.env`**

```env
PORT=6000

AUTH_SERVICE_URL=http://localhost:6001
RESUME_SERVICE_URL=http://localhost:8003
INTERVIEW_SERVICE_URL=http://localhost:6003
```

**📂 `backend/services/auth/.env`**

```env
PORT=6001

MONGODB_URI=your_mongodb_connection_string
REDIS_URL=redis://localhost:6379
```

**📂 `backend/services/resume/.env`**

```env
PORT=8003

MONGODB_URI=your_mongodb_connection_string
REDIS_URL=redis://localhost:6379

GROQ_API_KEY=your_groq_api_key
```

**📂 `backend/services/interview/.env`**

```env
PORT=6003

MONGODB_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
```

**🔥 Firebase Admin Configuration**

Place your Firebase Admin service-account JSON file at:

```text
backend/services/auth/serviceAccountKey.json
```

> 🔒 **Security:** Never commit `.env` files or Firebase service-account credentials. Make sure they are excluded through `.gitignore`.

### 3️⃣ Start Redis

Open a terminal:

```bash
cd backend
docker compose up -d
```

### 4️⃣ Start the Authentication Service

```bash
cd backend/services/auth

npm install
npm run dev
```

### 5️⃣ Start the API Gateway

Open another terminal:

```bash
cd backend/gateway

npm install
npm run dev
```

### 6️⃣ Start the Frontend

Open another terminal:

```bash
cd frontend

npm install
npm run dev
```

### 7️⃣ Start the Resume Service

When working on resume analysis:

```bash
cd backend/services/resume

npm install
npm run dev
```

### 8️⃣ Start the Interview Service

When working on interview features:

```bash
cd backend/services/interview

npm install
npm run dev
```

---

## 🌐 Application URLs

| Service           | URL                   | Port   |
| ----------------- | --------------------- | ------ |
| Frontend          | http://localhost:5173 | `5173` |
| API Gateway       | http://localhost:6000 | `6000` |
| Auth Service      | http://localhost:6001 | `6001` |
| Resume Service    | http://localhost:8003 | `8003` |
| Interview Service | http://localhost:6003 | `6003` |

### ❤️ Current Health Checks

| Endpoint                     | Description           |
| ---------------------------- | --------------------- |
| `GET /` on port `6000`       | API Gateway response  |
| `GET /` on port `6001`       | Auth Service response |
| `GET http://localhost:5173/` | FresherAI home page   |

---

## 🔌 Current API Endpoints

The following endpoints are currently part of the implemented API.

| Endpoint                 | Method | Description                                                                 |
| ------------------------ | ------ | --------------------------------------------------------------------------- |
| `/api/auth/login`        | `POST` | Verifies Firebase ID token, creates/fetches user, and stores Redis session. |
| `/api/auth/logout`       | `GET`  | Intended to delete Redis session and clear session cookie.                  |
| `/api/me`                | `GET`  | Returns user information from a valid Redis-backed session.                 |
| `/api/resume/upload`     | `POST` | Authenticated PDF upload and AI resume analysis.                            |
| `/api/resume/get-resume` | `GET`  | Retrieves resume analysis, preferring Redis cache before MongoDB.           |
| `/api/auth/user-coins`   | `POST` | Deducts interview coins for actions such as resume downloads.               |
| `/api/interview/start`   | `POST` | Generates questions and creates an authenticated interview session.         |
| `/api/interview/submit`  | `POST` | Saves an answer, evaluates it, and advances the interview.                  |
| `/api/interview/:id`     | `GET`  | Retrieves an authenticated user’s interview and current report data.        |

### 📤 Authentication Flow

1. The frontend authenticates the user through Firebase Google Sign-in.
2. Firebase generates an ID token.
3. The client sends the token to `/api/auth/login`.
4. The API Gateway forwards the request to the Auth Service.
5. Firebase Admin verifies the ID token.
6. The Auth Service creates or retrieves the user from MongoDB.
7. A Redis-backed session is created and the session cookie is returned.

**Login request example:**

```json
{
  "token": "firebase_id_token"
}
```

### 📄 Resume Upload Flow

Send an authenticated `multipart/form-data` request to:

```text
POST /api/resume/upload
```

Use the following field name:

```text
resume
```

The API Gateway forwards the authenticated user ID to the Resume Service for PDF processing, AI analysis, and storage.

### 🤖 Interview Flow

Start an interview through the authenticated gateway:

```json
{
  "type": "technical",
  "role": "Frontend Developer",
  "useResume": false,
  "resume": {}
}
```

Submit each answer with the returned interview ID:

```json
{
  "interviewId": "mongodb_interview_id",
  "answer": "candidate answer"
}
```

The service returns the next question until the final answer. The final response includes the completed interview report generated by the summary agent.

---

## 🚧 Known Issues & Work in Progress

The following areas still need attention:

- [ ] Fix the logout controller by adding its missing `req` and `res` parameters.
- [ ] Correct cookie options to `httpOnly` and `sameSite`; enable secure cookies in production.
- [ ] Align the frontend Axios base URL (`http://localhost:8000`) with the API Gateway port (`6000`).
- [ ] Add input validation, user-friendly authentication errors, and API tests.
- [ ] Complete Roadmap Builder functionality.
- [ ] Test Resume Scorer with invalid PDFs, failed uploads, and replacement analyses.
- [ ] Add formal schema validation and automated tests for malformed LLM responses.
- [ ] Persist Resume Builder form data in the backend.
- [ ] Add request validation and automated tests for interview authorization and invalid payloads.
- [ ] Connect the React interview UI to the implemented start, submit, and retrieval endpoints.
- [ ] Add interrupted-interview recovery and resume-context integration.

---

## 🛣️ Upcoming Development Roadmap

The next development milestones are:

| Priority | Task                                                 | Status     |
| -------- | ---------------------------------------------------- | ---------- |
| 1        | Align frontend API URL and test authentication flows | 🔄 Pending |
| 2        | Add PDF extraction and AI response validation tests  | 🔄 Pending |
| 3        | Persist Resume Builder data in the backend           | 🔄 Pending |
| 4        | Add interview validation and automated tests         | 🔄 Pending |
| 5        | Develop AI-powered mock interview UI                 | 🔄 Pending |
| 6        | Build Roadmap Builder workflow                       | 🔄 Pending |
| 7        | Develop Billing Service                              | 📌 Planned |

---

## 🛠️ Tech Stack

### 🎨 Frontend

- React.js
- Vite
- Tailwind CSS
- Motion
- React Router
- Redux Toolkit
- React Redux
- Recharts
- react-to-print

### ⚙️ Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Redis
- Docker Compose
- Multer
- pdf-parse
- express-http-proxy

### 🤖 AI & Authentication

- Groq API
- LangChain
- Firebase Authentication
- Firebase Admin SDK

### 🔧 Development Tools

- Git & GitHub
- Axios
- dotenv
- nodemon

---

## 🎯 Project Vision

FresherAI aims to become a complete AI-powered interview preparation ecosystem where students can:

- 📄 Build professional, ATS-friendly resumes.
- 🎯 Analyze resumes and identify improvement areas.
- 🤖 Practise personalized HR and technical interviews.
- 🧠 Receive AI-powered answer evaluation.
- 📊 Track interview performance and progress.
- 🗺️ Follow personalized learning roadmaps.
- 💡 Improve confidence before real-world interviews.

---

## 👨‍💻 Development Status

**FresherAI is actively under development.**

The authentication foundation, resume analysis workflow, resume builder, and first end-to-end interview backend workflow are in place. More frontend interview features and production hardening are being developed incrementally.

<p align="center">
  <b>🚀 Building smarter interview preparation, one feature at a time!</b>
</p>
