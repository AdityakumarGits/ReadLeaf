# BookLeaf Portal — Approach Note

## What I prioritised
I prioritised the complete support-ticket lifecycle: authors can sign up or sign in, inspect their own book and royalty records, submit a query, and see the support team's replies. Admins can triage the shared queue, change AI-suggested category and priority, assign work, add private notes, draft a response, edit it, and send it. The provided 10-author / 18-book dataset is loaded through a repeatable seed script.

## Architecture
The React frontend is split into reusable components and page-level screens. The Express API follows an MVC-style layout with routes, controllers, Mongoose models, middleware, and an isolated AI service. JWT authentication and role checks are applied at the API boundary; an author can only read tickets connected to their author record. MongoDB stores users, authors/books, and support tickets.

## AI choices and trade-offs
Gemini is called from the backend only. Ticket classification asks for constrained JSON and validates the returned category and priority against allowed values. Draft prompts include the relevant ticket fields and a compact policy knowledge base, not the full ticket history. If the key is missing, Gemini fails, or the model response is invalid, the application uses a local classification rule or response template so the core workflow remains available. Admins can edit all AI suggestions before saving or sending.

## Trade-offs and next steps
Polling every eight seconds is easier to understand and operate than WebSockets, while still giving near-real-time updates for this assignment. Attachments are shown in the UI but not uploaded, as permitted by the brief. For production I would add request rate limiting, stronger deployment secrets, audit trails, pagination, email notifications, password reset, and a managed real-time event channel.
