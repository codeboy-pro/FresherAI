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

## 2026-10-27 — Day 3: End-to-end login and protected user session

### What I built

I connected the Google login button to Firebase client authentication. After Google sign-in, the React app obtains a Firebase ID token and sends it to the API Gateway. The Auth Service verifies it, stores a Redis session, and the browser receives an HTTP-only session cookie. I also added `GET /api/me` at the gateway, which reads the session from Redis and lets the frontend restore the user after refresh. The dashboard route now redirects unauthenticated users to the home page.

### Why use both a Firebase token and a session cookie?

The Firebase ID token proves the user’s identity at login. After that, the app uses a short server-managed session ID in an HTTP-only cookie, so JavaScript cannot read the session value. Redis supplies quick session lookup and automatic expiry, while React uses `/api/me` to determine whether a user is logged in.

### How the protected-route flow works

1. `App.jsx` calls `/api/me` when the app starts.
2. The gateway checks the `session` cookie in `isAuth` middleware.
3. The middleware loads `session:<id>` from Redis and attaches the parsed user to `req.user`.
4. The controller returns the user; React allows `/dashboard` only when that user exists.
5. If no valid session exists, React redirects to `/`.

### Security and configuration work

- Fixed logout by accepting `req` and `res`, then deleting the Redis session and clearing the cookie.
- Corrected cookie options to `httpOnly` and `sameSite`; `secure` now turns on automatically in production.
- Added `.env.example` templates and moved frontend API/Firebase configuration and gateway CORS configuration out of source code.
- Confirmed that `.env` files and `serviceAccountKey.json` are ignored by Git. No private key, database connection string, or access token is tracked.

### Interview explanation

“I completed an end-to-end authentication flow: Firebase handles Google identity, the backend verifies the token, Redis manages the server-side session, and an HTTP-only cookie identifies the browser. I protected the dashboard by checking the current session through a gateway endpoint, and I separated environment-specific configuration from source code so secrets are not pushed to GitHub.”

### Next learning / implementation

Add a logout button, test session expiry and invalid tokens, then introduce request validation, rate limiting, and the real interview workflow.
