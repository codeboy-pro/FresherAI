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
