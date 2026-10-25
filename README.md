# BookLeaf Author Support & Communication Portal

A beginner-friendly full-stack assignment project using **React + Vite + Tailwind CSS**, **Node.js + Express**, **MongoDB + Mongoose**, and **Google Gemini API**.

## Features
- Author signup and login; sample authors can sign in and see their own books.
- Author dashboard with book details, royalty summaries, ticket creation, and ticket history.
- Admin dashboard with queue filters, priority/category overrides, assignment, status updates, internal notes, and AI-drafted replies.
- Gemini-powered ticket classification, priority suggestions, and response drafts. The app still works without a Gemini key by using a clear local fallback.
- Ticket updates refresh automatically every 8 seconds.
- REST API, JWT auth, role checks, validation, seed data, and responsive UI.

## Requirements
- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection string
- Google Gemini API key (optional; needed for live AI responses)

## Setup
### 1. Backend
```bash
cd server
cp .env.example .env
npm install
```
Set `MONGO_URI`, `JWT_SECRET`, and optionally `GEMINI_API_KEY` in `server/.env`.

Seed the supplied sample dataset:
```bash
npm run seed
```
Start the API:
```bash
npm run dev
```
API runs at `http://localhost:5000`; health check: `http://localhost:5000/api/health`.

### 2. Frontend
In a second terminal:
```bash
cd client
npm install
npm run dev
```
Open the URL printed by Vite (usually `http://localhost:5173`).

## Demo credentials
The seed script creates these local demo accounts:
- **Admin:** `admin@bookleaf.com` / `Admin@123`
- **Author:** `priya.sharma@email.com` / `Author@123`
- **Author:** `rohit.kapoor@email.com` / `Author@123`

These are development-only credentials. Change them before deploying publicly.

## Gemini configuration
Create a Gemini API key in Google AI Studio and set it as `GEMINI_API_KEY` in `server/.env`. The key is only read by the backend and is never sent to the React app. Set `GEMINI_MODEL` to a model available to your key if needed (default: `gemini-2.5-flash`).

AI calls are limited to the new ticket's subject and description plus a compact BookLeaf policy context. The app does not send the complete ticket history on each call. If Gemini is unavailable or no key is configured, ticket creation still succeeds and admins can manually classify and write replies.

## API overview
All endpoints are prefixed with `/api`.

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/auth/signup` | Public | Create an author account |
| POST | `/auth/login` | Public | Login |
| GET | `/auth/me` | Logged in | Current user |
| GET | `/books/mine` | Author | Own books |
| GET | `/tickets/mine` | Author | Own tickets |
| POST | `/tickets` | Author | Create a ticket |
| GET | `/tickets` | Admin | Search/filter ticket queue |
| GET | `/tickets/:id` | Author owner/Admin | Ticket details |
| PATCH | `/tickets/:id` | Admin | Update status, category, priority, assignee, internal note |
| POST | `/tickets/:id/reply` | Admin | Send response to author |
| POST | `/tickets/:id/draft` | Admin | Generate Gemini draft |
| GET | `/admin/stats` | Admin | Queue statistics |
| GET | `/health` | Public | API health check |

## Project structure
```text
BookLeaf-Author-Support-Portal/
├── client/
│   └── src/
│       ├── components/       # reusable UI components
│       ├── context/          # authentication state
│       ├── pages/            # page-level screens
│       ├── services/         # API helper
│       ├── App.jsx
│       └── index.css
└── server/
    ├── config/               # MongoDB connection
    ├── controllers/          # request handling
    ├── middleware/           # auth and error handling
    ├── models/               # Mongoose schemas
    ├── routes/               # REST endpoints
    ├── services/              # Gemini + fallback logic
    ├── data/                  # provided sample dataset
    └── scripts/seed.js
```

## Notes / limitations
- File attachment is a UI-only field, matching the assignment's optional upload requirement.
- Ticket updates use polling rather than WebSockets to keep the project simple.
- For production, use stronger secrets, rate limiting, email verification/password reset, audit logs, pagination, and private deployment seed credentials.
- The provided JSON includes 10 authors and 18 books; the seed script imports those exact records. Sample demo passwords are added locally because the dataset contains no passwords.


alpha308080_db_user