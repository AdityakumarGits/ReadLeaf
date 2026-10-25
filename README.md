# BookLeaf Author Support & Communication Portal

A full-stack web application for managing author support requests,
viewing author/book information, and assisting the operations team with
AI-powered ticket classification and reply drafting.

## Features

### Author Portal

-   Email/password authentication.
-   View an author's book catalogue and key book information.
-   Submit support tickets for a specific book or a
    general/account-level query.
-   View submitted tickets and their current status.

### Admin Portal

-   Operations dashboard with author and support-ticket summaries.
-   View and filter the support ticket queue.
-   Review ticket category and priority.
-   Generate an AI-assisted reply draft and edit it before sending.
-   Manage ticket status and respond to author queries.

### AI Assistance

-   Google Gemini API is used for ticket classification and reply
    drafting.
-   Prompts use the supplied BookLeaf knowledge base for royalty, ISBN,
    printing, distribution, production stages, and communication tone.
-   If Gemini is unavailable, the application can use fallback
    classification or reply text. A fallback response does not mean
    Gemini succeeded.

## Technology Stack

-   **Frontend:** React, Vite, JavaScript, Tailwind CSS
-   **Backend:** Node.js, Express
-   **Database:** MongoDB with Mongoose
-   **Authentication:** JWT-based authentication and role-based access
-   **AI:** Google Gemini API using `@google/generative-ai`

## Project Structure

``` text
project-root/
├── client/                  # React frontend
├── server/                  # Express backend
│   ├── controllers/          # Request/business logic
│   ├── models/               # Mongoose models
│   ├── routes/               # API route definitions
│   ├── middleware/           # Authentication/authorization
│   ├── config/               # Configuration
│   ├── scripts/              # Seed scripts, if configured
│   ├── server.js             # Backend entry point
│   └── .env.example          # Example environment variables
└── README.md
```

Your actual folder structure may differ. Align this section with the
files in your repository before submission.

## Prerequisites

-   Node.js (current LTS recommended)
-   npm
-   MongoDB locally or a MongoDB Atlas connection string
-   A Google Gemini API key from [Google AI
    Studio](https://aistudio.google.com/apikey)

## Local Setup

### 1. Clone the repository

``` bash
git clone <YOUR_PUBLIC_REPOSITORY_URL>
cd <YOUR_PROJECT_FOLDER>
```

Replace the placeholders with your repository URL and folder name.

### 2. Install frontend dependencies

``` bash
cd client
npm install
```

### 3. Install backend dependencies

Open a second terminal:

``` bash
cd server
npm install
```

### 4. Configure environment variables

Create `server/.env`:

``` env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.8-flash
```

Use a Gemini model ID that is available to your API key. If the
configured model is unavailable, change `GEMINI_MODEL` to a model listed
as available in Google AI Studio. Never put the Gemini API key in
frontend code or in a variable prefixed with `VITE_`.

### 5. Seed sample data

The assignment dataset contains **10 authors and 18 books**. Check
`server/package.json` for the exact seed command. If a `seed` script is
configured, run:

``` bash
npm run seed
```

Inspect the seed script before running it: it may delete and recreate
existing records. Back up any data you need to keep.

### 6. Start the backend

From `server/`:

``` bash
npm run dev
```

If there is no `dev` script, use the start command defined in
`server/package.json` (for example, `node server.js`).

The current development setup uses port `5000`.

### 7. Start the frontend

From `client/`:

``` bash
npm run dev
```

Open the local URL printed by Vite.

## Environment Variables

  -----------------------------------------------------------------------
  Variable                            Purpose
  ----------------------------------- -----------------------------------
  `PORT`                              Express server port; development
                                      uses `5000`

  `MONGO_URI`                         MongoDB connection string

  `JWT_SECRET`                        Secret used to sign/verify
                                      authentication tokens

  `GEMINI_API_KEY`                    Server-side Gemini API key

  `GEMINI_MODEL`                      Gemini model ID used for
                                      classification and reply drafting
  -----------------------------------------------------------------------

Keep real secrets only in environment variables. Commit an
`.env.example` with placeholders, never the real `.env`.

## API Documentation

The frontend communicates with the Express backend through REST
endpoints. Check the actual route paths and methods in `server/routes/`
and document them here or provide a Postman/OpenAPI collection.

For each endpoint, document the HTTP method, path, authentication/role
requirement, request fields, success response, and
validation/authentication errors. At minimum, cover:

-   Authentication: signup/login and token behavior
-   Authors and books: retrieving the authenticated author's own records
-   Tickets: create/list/view tickets, update status, and send responses
-   Admin operations: queue filters, category/priority overrides,
    assignment, and internal notes
-   AI assistance: classification and draft-generation requests,
    including fallback behavior

Do not publish guessed endpoint paths; copy the actual paths from the
implemented route files before submission.

## AI Integration Design

### Ticket classification

The classification prompt requests JSON containing a category and
priority. Allowed categories:

-   Royalty & Payments
-   ISBN & Metadata Issues
-   Printing & Quality
-   Distribution & Availability
-   Book Status & Production Updates
-   General Inquiry

Allowed priorities are `Critical`, `High`, `Medium`, and `Low`. The
application validates the model output and can use rule-based fallback
logic if the request fails.

### Reply drafting

The draft prompt includes the ticket category, priority, book, subject,
and description, along with BookLeaf policy information. It instructs
the model to be empathetic and professional, avoid inventing
account-specific facts, and provide a clear next step.

### Error handling

If a Gemini request fails, the application logs the failure and returns
a fallback result. During testing, verify the actual AI path as well as
fallback behavior. A successful fallback is not proof that Gemini
responded successfully.

### Cost and reliability considerations

-   Send only the ticket context and knowledge-base material required
    for the current operation.
-   Avoid sending unrelated ticket histories or author records.
-   Keep API calls on the server.
-   Validate AI output before using it.
-   Handle rate limits, network errors, invalid responses, and missing
    API configuration gracefully.

## Sample Data

The provided assignment dataset contains 10 authors and 18 books,
including publication status, ISBN, genre, sales, MRP, royalty
earned/paid/pending, print partner, and distribution platforms.

Check the database after seeding. If the dashboard shows more than 10
authors, verify whether admin or test accounts are included in the
count.

## Testing Checklist

-   [ ] Admin can log in using the configured demo account.
-   [ ] An author can register/log in and access only their own records.
-   [ ] Sample dataset is seeded: 10 dataset authors and 18 books.
-   [ ] Author book details include publication and royalty information.
-   [ ] Author can submit a support ticket and view its status.
-   [ ] Admin can see tickets across authors and filter the queue.
-   [ ] Admin can override category and priority.
-   [ ] AI classification returns a valid category and priority.
-   [ ] Gemini generates a reply draft when the API is available.
-   [ ] Admin can edit/send a response and the author can see it.
-   [ ] Ticket status, assignment, and internal notes work as required.
-   [ ] Missing/invalid tokens and unauthorized role access are
    rejected.
-   [ ] Validation errors are understandable.
-   [ ] Fallback behavior works when Gemini is unavailable.
-   [ ] Refreshing the page does not lose saved database records.
-   [ ] Production deployment uses environment variables and HTTPS.

## Deployment

Before deploying:

1.  Configure production `MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`,
    and `GEMINI_MODEL` in the hosting provider's environment settings.
2.  Ensure backend CORS allows the deployed frontend origin.
3.  Configure the frontend API base URL to point to the deployed
    backend.
4.  Seed the production database after inspecting the seed script and
    confirming the target database.
5.  Test author and admin workflows using the live URLs.
6.  Add safe demo credentials for evaluator access if appropriate. Never
    include real secrets.
7.  Confirm the repository does not contain `.env`, API keys, or
    database credentials.

## Known Limitations / Before Submission

-   Confirm the configured Gemini model is available to the API key and
    test classification and draft generation without relying on
    fallback.
-   Replace placeholder repository URL, project folder name, deployment
    URL, and credentials with accurate values.
-   Add the exact API route table from the implemented backend routes.
-   Verify whether ticket updates use polling, WebSockets, or
    Server-Sent Events and document the actual behavior.
-   Confirm internal notes are never returned to author-facing APIs.
-   Confirm the author count distinguishes seeded sample authors from
    admin and test accounts.

## Architecture Summary

The React client provides author-facing and admin-facing workflows. The
Express API handles authentication, authorization, ticket operations,
and Gemini calls. MongoDB stores application records. The Gemini API key
remains server-side, and fallback logic allows ticket workflows to
continue during AI service failures.

## Assignment Deliverables

-   [ ] Public source-code repository
-   [ ] Live demo URL
-   [ ] README with setup instructions and API documentation
-   [ ] Safe demo credentials for evaluator access
-   [ ] Brief approach write-up (maximum one page)
