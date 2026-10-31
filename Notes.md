# Learning Notes

## 2026-10-23 — Day 1: Backend foundation for FresherAI

### What I built

I started the backend for a multi-agent AI interview platform with two Express applications: an API Gateway on port `6000` and an Auth Service on port `6001`. The gateway forwards `/api/auth` requests to the Auth Service. I also added MongoDB user storage with Mongoose and began Firebase/Google sign-in verification.

### Why this structure?

- **API Gateway:** gives the frontend one public entry point. Later, interview, resume, roadmap, and billing services can be added behind it without changing the client’s base URL.
- **Separate Auth Service:** keeps identity and user-account logic isolated, making the backend easier to maintain and scale.
- **Firebase Admin:** the backend verifies the Firebase ID token itself, so it does not blindly trust a login claim from the frontend.
- **MongoDB user record:** Firebase proves who the user is; MongoDB stores app-specific data such as interview coins and timestamps.

### How the current auth flow is intended to work

1. The client signs in with Google/Firebase and receives an ID token.
2. The client sends that token to the Auth Service through the gateway.
3. Firebase Admin verifies the token and returns the decoded user identity.
4. The service finds the user by `firebaseUid`; if the user is new, it creates a MongoDB record.
5. The server creates a session ID and sends the user details back.

### Key code concepts I learned

- `dotenv` keeps configuration such as ports, service URLs, and database strings outside source code.
- `express-http-proxy` forwards a request from the gateway to another service.
- A Mongoose schema defines validation, defaults, uniqueness, and automatic `createdAt`/`updatedAt` fields.
- `crypto.randomUUID()` creates a unique session identifier.
- Secrets such as `.env` files and Firebase service-account keys must be protected with `.gitignore`.

### Interview explanation

“On day one, I created the backend base using a gateway and a dedicated authentication service. The gateway is responsible for routing, while the Auth Service verifies Firebase tokens and stores application-specific user data in MongoDB. This separation prepares the platform for future interview, resume, billing, and roadmap services.”

### Next learning / implementation

Connect the Google-auth controller to a route, add `express.json()`, CORS and cookie middleware, then test the full token-to-user flow.

## 2026-10-24 — Day 2: Auth flow, Redis sessions, and frontend start

### What I built

I connected the Auth Service to real Express routes: `POST /login` and `GET /logout`. I added `express.json()` so the service can read a token from a JSON request body and `cookie-parser` so it can read cookies. After Firebase token verification, the service now stores a seven-day user session in Redis. I also added Docker Compose for Redis and created the React frontend with a home page, login modal, and dashboard route.

### Why Redis for sessions?

MongoDB stores long-term user data, but Redis is better for temporary session data because it is in memory and supports automatic expiry with `EX`. The browser only keeps a session ID in a cookie; user details stay on the server in Redis. This is safer and makes logout simple: delete `session:<sessionId>` from Redis.

### How the current login flow works

1. A client will send a Firebase ID token to `POST /api/auth/login` through the gateway.
2. The Auth Service verifies it with Firebase Admin and creates or finds the MongoDB user.
3. A UUID session ID is generated and Redis stores the user’s essential data for seven days.
4. The server sends the session ID as a cookie and returns the user object.

The login screen and Google button are complete visually, but connecting Firebase client sign-in and the API call is the next task.

### Key concepts I learned

- `express.Router()` groups related endpoints and keeps `index.js` clean.
- `express.json()` parses JSON request bodies; without it, `req.body.token` is unavailable.
- `cookie-parser` reads incoming cookies through `req.cookies`.
- Docker Compose makes a local dependency like Redis repeatable with `docker compose up`.
- React Router maps URLs to page components, while `useState` controls whether the login modal is visible.

### Important issue I found

The current logout function is missing `req` and `res` parameters, so it will fail until it is changed to `async (req, res) => { ... }`. Cookie options should also use the exact names `httpOnly` and `sameSite`, with `secure: true` in production.

### Interview explanation

“I extended authentication from token verification to session management. Firebase confirms the user identity, MongoDB keeps permanent profile data, and Redis holds short-lived session data with automatic expiry. I also set up the React UI and Docker Compose so the frontend and local Redis service can be developed consistently.”

### Next learning / implementation

Connect the Google button to Firebase client authentication, send its ID token through the gateway, fix and test logout, and add protected dashboard access.

## 2026-10-27 — Day 3: Firebase login, session check, and protected dashboard

### What I built

I connected the Google login button to Firebase client authentication. After sign-in, the frontend gets a Firebase ID token and sends it to the Auth API. I added a gateway `GET /api/me` endpoint with `isAuth` middleware, so the app can read the Redis session and identify the current user. The React app now checks that endpoint on startup and protects the dashboard route.

### How the session check works

1. The React app starts and calls `/api/me`.
2. The gateway reads the `session` cookie with `cookie-parser`.
3. `isAuth` looks up `session:<id>` in Redis.
4. If the session exists, the middleware puts the user data in `req.user`.
5. React shows the dashboard; otherwise, React redirects the user to the home page.

### Frontend learning

- `signInWithPopup()` opens Google sign-in through Firebase.
- `getIdToken()` gives the frontend a token that the backend can verify.
- `useEffect()` restores the user session when the application loads.
- `Navigate` in React Router prevents unauthenticated users from opening `/dashboard` directly.
- I expanded the home page into a product landing page that explains the planned Resume, Interview, Feedback, and Roadmap agents.

### Important testing point

The Axios client currently points to port `8000`, but the API Gateway defaults to port `6000`. These values must match before the browser login/session requests can work. The current logout handler and cookie option names also need correction before production use.

### Interview explanation

“I connected Firebase Google sign-in to my backend authentication flow and added session-based route protection. Firebase provides the identity token, Redis keeps the session, the gateway validates that session, and React controls dashboard access based on the current user.”

### Next learning / implementation

Align the frontend API URL with the gateway, test login/logout/session expiry, then add validation, error messages, and dashboard features.

## 2026-11-01 — Day 4: Dashboard shell and AI Resume Scorer backend

### What I built

I built the first dashboard layout with a responsive sidebar, user profile details, interview-coin display, navigation items, and a logout action. I also created a separate Resume Service that accepts a resume PDF, extracts its text, asks an LLM to perform ATS-style analysis, stores the result in MongoDB, and caches it in Redis.

### Why a separate Resume Service?

Resume processing includes file upload, PDF parsing, AI analysis, database storage, and caching. Keeping it separate from authentication gives each service one responsibility and lets the gateway route authenticated resume requests safely.

### How the resume-analysis flow works

1. The user sends a PDF in `multipart/form-data` with the field name `resume`.
2. The API Gateway checks the Redis session with `isAuth` middleware.
3. `proxyWithHeaders` forwards the request to the Resume Service and adds the authenticated user ID as `x-user-id`.
4. Multer accepts PDF files up to 20 MB, and `pdf-parse` extracts their text.
5. The LangChain/Groq agent returns structured ATS feedback: score, skills, strengths, weaknesses, missing skills, suggested role, and recommendations.
6. The service creates or updates one MongoDB resume record per user, caches it in Redis, and deletes the temporary uploaded file.

### Key concepts I learned

- **Multer** handles `multipart/form-data` and file-size/type validation in Express.
- An **LLM agent** can be instructed to return a fixed JSON structure that maps directly to a Mongoose schema.
- **Upsert-style logic** keeps one current resume analysis for each user instead of creating duplicates.
- The gateway should derive the user ID from the authenticated session, rather than trusting an ID supplied by the browser.
- A responsive sidebar uses shared UI state for expanded desktop navigation and a separate mobile drawer.

### Important testing points

The Resume Scorer UI and its routes still need to be connected to the Resume Service. The LLM response should be validated before `JSON.parse()`, and the frontend API base URL must match the gateway port before browser requests work.

### Interview explanation

“I created an authenticated AI resume-analysis pipeline. The gateway validates the session and injects the user ID for the Resume Service. That service extracts text from an uploaded PDF, sends it to an LLM with a structured ATS prompt, stores the analysis in MongoDB, and caches it in Redis for faster retrieval.”

### Next learning / implementation

Build the Resume Scorer page, connect PDF upload and analysis results, add schema validation for the LLM output, and test the complete authenticated flow.
