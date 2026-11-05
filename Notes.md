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

## 2026-11-03 — Day 5: Resume Scorer upload flow and reliable AI output

### What I built

I added the protected `/scorer` page and connected it to the Resume Service. A user can select a PDF resume, see its name and size, remove it if needed, and submit it with `FormData`. The page shows an analysis loading state while the backend processes the document.

I also improved the resume-analysis backend. The gateway proxy now uses the correct request-options hook to pass the authenticated `x-user-id` header. The LLM is instructed to return JSON with object arrays for education, projects, and experience. The service removes Markdown code fences if present, extracts the JSON object, parses it, and normalizes fields before MongoDB storage.

### Why normalize LLM output?

AI output can vary even with a detailed prompt. Normalization converts missing values, strings, and arrays into the data shapes expected by the Mongoose schema. This prevents a malformed response from breaking persistence and gives the frontend predictable fields to render.

### How the upload flow works

1. The protected `/scorer` route renders the upload page for an authenticated user.
2. The browser sends the selected PDF as `multipart/form-data` under the `resume` field.
3. The gateway validates the session and forwards the request with the server-derived user ID.
4. The Resume Service extracts PDF text, calls the Groq/LangChain agent, parses and normalizes the JSON response, then saves it in MongoDB and Redis.
5. The frontend receives the processed resume data; the next UI step is to display the analysis report.

### Key concepts I learned

- `FormData` sends files without manually setting the multipart boundary.
- A proxy decorator can inject trusted server-side identity headers into downstream service requests.
- Prompt constraints and JSON response format reduce LLM output variability.
- Nested Mongoose schemas model structured data such as education, projects, and work experience more clearly than string arrays.
- Defensive parsing should remove Markdown fences, locate the JSON object, and fail with a clear error when output is invalid.

### Interview explanation

“I built the Resume Scorer upload flow and made the AI pipeline more reliable. The browser uploads a PDF through an authenticated gateway, the backend extracts text and requests structured ATS feedback from an LLM, then normalizes that response into nested MongoDB schemas and caches it in Redis. This makes the result safer and easier for the frontend to display.”

### Next learning / implementation

Build the analysis-result screen for ATS score, strengths, missing skills, and recommendations; then add schema validation and end-to-end tests for invalid files and malformed AI responses.

## 2026-11-03 — Day 6: Resume analysis report and re-upload workflow

### What I built

I completed the Resume Scorer result experience. After the backend returns an analysis, the page renders an ATS-style report instead of leaving the user on the upload screen. It presents the overall score along with the structured resume information returned by the service, including strengths, skill gaps, and recommendations.

I also added a re-upload flow. Selecting **Re-upload Resume** now switches the page back to the PDF upload view while preserving the existing analysis in application state. When the new PDF has finished processing, the Redux resume state is replaced with the new result and the report view returns automatically.

### Why keep the current result while re-uploading?

The stored result is useful until a replacement analysis is ready. A separate `isReuploading` UI flag decides which screen to show, so the user can upload a new file without immediately deleting their last successful analysis. This also keeps the transition predictable if the new upload fails.

### How the result and re-upload flow works

1. On application load, the client requests any saved resume analysis and stores it in Redux.
2. If an analysis exists, the scorer displays the report view.
3. Selecting **Re-upload Resume** sets the re-upload state and opens the existing drag-and-drop PDF upload interface.
4. The new PDF is sent through the authenticated gateway to the Resume Service.
5. On success, the client stores the returned analysis in Redux, clears the re-upload state, and renders the updated report.

### Key concepts I learned

- Redux keeps the latest saved resume analysis available across the app.
- Local component state is appropriate for a temporary UI mode such as re-uploading.
- Separating persisted data from view state avoids erasing a valid result merely to show a different screen.
- Replacing the analysis only after a successful response gives the user a safer retry path.

### Interview explanation

“I completed the resume-analysis user journey by rendering the structured ATS report and adding a re-upload mode. The result is stored centrally in Redux, while a local UI flag controls whether the report or upload interface is displayed. A new successful upload atomically replaces the old analysis, so users can retry without losing their previous result.”

### Next learning / implementation

Align the frontend API URL with the gateway, add formal validation and automated tests for malformed AI responses, and test the re-upload path with invalid files and failed requests.

## 2026-11-05 — Day 7: Resume Builder foundation and shared resume state

### What I built

I added a protected `/resume` route and started the Resume Builder. Its form data model covers six resume sections: personal information, professional summary, skills, experience, projects, and education. The repeatable sections support adding, editing, and removing multiple entries.

I also introduced Redux Toolkit for shared resume-analysis state. When an authenticated user opens the app, the client requests any saved analysis and stores it in the Redux store. The Resume Scorer reads and replaces this shared state after successful analysis or re-upload.

### Why use Redux here?

The resume analysis is useful in more than one screen. Keeping it in Redux gives the application one source of truth instead of passing resume data through many component props or refetching it whenever a route changes. Local `useState` still handles temporary form and UI values.

### How the current state flow works

1. After session restoration, `App.jsx` calls the saved-resume API for the authenticated user.
2. The response is stored with the `setResume` Redux action.
3. The Resume Scorer selects that data from the store to render the existing report.
4. A successful new upload dispatches `setResume` again, replacing the old analysis.
5. The Resume Builder keeps its in-progress form data locally until persistence is added.

### Key concepts I learned

- A Redux **slice** groups state, reducer logic, and generated actions in one file.
- `Provider` makes the Redux store available to the React application.
- `useDispatch` sends actions; `useSelector` reads store state inside components.
- Reusable input, textarea, and entry-card components reduce repeated form code.
- Array updates with `map`, `filter`, and spread syntax support editable lists without mutating React state.

### Current builder status

The data structure and section components are ready, but the page currently opens the education section and does not yet include multi-step navigation, validation, save/load, preview, or PDF export.

### Interview explanation

“I started a structured Resume Builder and introduced Redux for shared resume data. Redux keeps the latest AI analysis available across routes, while local state manages an in-progress builder form. The form uses reusable components and immutable array updates so users can add and edit multiple education, project, and experience records cleanly.”

### Next learning / implementation

Add step navigation and validation, connect the builder to persistent storage, create a live resume preview, and generate a downloadable PDF.
