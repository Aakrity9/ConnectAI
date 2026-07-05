# **Connect AI - Project Todo List**

This document outlines the step-by-step, atomic, and sequentially ordered tasks required to implement Connect AI from scratch, following the PRD, Design, and Tech Stack specifications. 

Each task is designed to be **atomic** (one developer can work on it in isolation) and **sequential** (each task has a strict prerequisite, ensuring zero overlapping dependencies).

---

## **Phase 1: Environment & Project Initialization**

### **1. Database & Cache Infrastructure Setup**
- **Task ID:** `TODO-1.1`
- **Description:** Provision a serverless PostgreSQL instance on Neon (or a local instance) and a Redis instance (local or hosted). Install the `pgvector` extension in the PostgreSQL instance.
- **Dependencies:** None.
- **Definition of Done (DoD):** Successful connection check to PostgreSQL and Redis using a database client. `CREATE EXTENSION IF NOT EXISTS vector;` runs successfully.

### **2. NestJS Backend Initialization**
- **Task ID:** `TODO-1.2`
- **Description:** Initialize a new NestJS application using TypeScript. Configure the project structure, path aliases, environment variables configuration (`@nestjs/config`), and basic error filters.
- **Dependencies:** `TODO-1.1`
- **Definition of Done (DoD):** NestJS project compiles successfully and starts locally. Running `npm run start:dev` returns no errors and a test HTTP endpoint (e.g. `/health`) responds with 200 OK.

### **3. FastAPI AI Service Initialization**
- **Task ID:** `TODO-1.3`
- **Description:** Set up a Python virtual environment, initialize a FastAPI project, and configure Uvicorn. Include a configuration management setup (e.g., Pydantic settings) and logging.
- **Dependencies:** `TODO-1.2`
- **Definition of Done (DoD):** FastAPI server starts on local port (e.g., `8000`), and `/docs` (Swagger UI) is accessible.

### **4. Next.js Frontend Initialization**
- **Task ID:** `TODO-1.4`
- **Description:** Initialize a Next.js 16 project with React 19, TypeScript, and the App Router. Set up basic directory structure (`/src/app`, `/src/components`, `/src/lib`, `/src/hooks`).
- **Dependencies:** `TODO-1.3`
- **Definition of Done (DoD):** Next.js app builds and runs successfully on port `3000` via `npm run dev`.

---

## **Phase 2: Database Schema & ORM Setup**

### **5. Prisma ORM Integration in NestJS**
- **Task ID:** `TODO-2.1`
- **Description:** Install Prisma CLI and Client packages in the NestJS backend. Initialize Prisma, and link it to the PostgreSQL database.
- **Dependencies:** `TODO-1.4`
- **Definition of Done (DoD):** Prisma client initializes successfully; running `npx prisma db pull` or `npx prisma generate` runs without database connection issues.

### **6. User and Profile Schema Modeling**
- **Task ID:** `TODO-2.2`
- **Description:** Define database models for `User` and `Profile` in the Prisma schema. The `Profile` schema must include fields for skills, interests, startup interest, career goals, availability, and vectors for embeddings (mapping to the `Unsupported("vector")` type for pgvector).
- **Dependencies:** `TODO-2.1`
- **Definition of Done (DoD):** Prisma schema compiles successfully with command `npx prisma generate`.

### **7. Connection, Chat, and Group Schema Modeling**
- **Task ID:** `TODO-2.3`
- **Description:** Define models for `ConnectionRequest` (status: pending, accepted, declined), `Message` (sender, receiver, content, timestamp), and `Group` (networking circles).
- **Dependencies:** `TODO-2.2`
- **Definition of Done (DoD):** Prisma schema compilation is verified with `npx prisma generate`, showing all relations mapped correctly.

### **8. Database Migration and Seeding**
- **Task ID:** `TODO-2.4`
- **Description:** Generate and run the first Prisma migration (`npx prisma migrate dev`) to create all tables in the PostgreSQL database. Create a basic seed script containing mock data for testing.
- **Dependencies:** `TODO-2.3`
- **Definition of Done (DoD):** Tables are successfully created in Neon/local database. Running `npx prisma db seed` populates target tables with mock records.

---

## **Phase 3: Authentication & User Management**

### **9. Clerk Authentication Setup (Frontend)**
- **Task ID:** `TODO-3.1`
- **Description:** Install Clerk Next.js SDK, configure environment variables, and implement Clerk `<ClerkProvider>` and middleware to protect routes. Create login/register layout pages.
- **Dependencies:** `TODO-2.4`
- **Definition of Done (DoD):** User can log in/sign up using Google or password; protected frontend pages redirect unauthenticated users back to login.

### **10. Clerk Integration & JWT Verification (Backend)**
- **Task ID:** `TODO-3.2`
- **Description:** Implement a NestJS Auth Guard that extracts the Clerk JWT from request headers and verifies it using the Clerk SDK / public keys to authenticate incoming requests.
- **Dependencies:** `TODO-3.1`
- **Definition of Done (DoD):** Secured NestJS endpoints block requests without a valid Clerk JWT and return `401 Unauthorized`. Valid JWT requests pass user context to the request object.

### **11. User Synchronizer Webhook**
- **Task ID:** `TODO-3.3`
- **Description:** Create a webhook endpoint in NestJS (using Clerk Webhooks) to synchronize user creation, update, and deletion events from Clerk to the local PostgreSQL database via Prisma.
- **Dependencies:** `TODO-3.2`
- **Definition of Done (DoD):** A new sign-up on Clerk automatically triggers a webhook that inserts a corresponding `User` record into the local PostgreSQL database.

### **12. Profile REST API (NestJS)**
- **Task ID:** `TODO-3.4`
- **Description:** Build CRUD API endpoints in NestJS to retrieve and update the authenticated user's profile details.
- **Dependencies:** `TODO-3.3`
- **Definition of Done (DoD):** POST / GET / PUT requests on `/api/profile` correctly fetch and update user attributes in PostgreSQL.

---

## **Phase 4: AI Service (FastAPI) & Matchmaking Engine**

### **13. Profile Embedding Generation (FastAPI)**
- **Task ID:** `TODO-4.1`
- **Description:** In FastAPI, configure the OpenAI API SDK. Write a utility function that concatenates profile fields (skills, goals, interests) into a semantic profile description and returns its 1536-dimensional vector embedding.
- **Dependencies:** `TODO-3.4`
- **Definition of Done (DoD):** API endpoint `/embeddings` in FastAPI accepts profile JSON, sends formatting to OpenAI, and returns the vector array.

### **14. Vector Synchronization API (NestJS to FastAPI)**
- **Task ID:** `TODO-4.2`
- **Description:** In NestJS, implement a service that calls the FastAPI embedding endpoint when a user profile is updated, then stores the resulting vector in the `Profile` database table using raw Prisma queries (since Prisma doesn't natively serialize pgvector vectors).
- **Dependencies:** `TODO-4.1`
- **Definition of Done (DoD):** Updating a user's profile automatically saves the corresponding vector embedding into PostgreSQL `profile` table under the vector column.

### **15. Vector Search Query (Prisma Raw)**
- **Task ID:** `TODO-4.3`
- **Description:** Implement a repository method in NestJS that executes a raw SQL query on PostgreSQL to perform cosine distance similarity search (using the `<=>` operator) to find top compatibility matches.
- **Dependencies:** `TODO-4.2`
- **Definition of Done (DoD):** Given a target profile embedding vector, the query successfully returns a list of candidate user profiles sorted by similarity score.

### **16. AI Match Explanation Generator (FastAPI)**
- **Task ID:** `TODO-4.4`
- **Description:** Build an LLM-based prompt in FastAPI that takes two profiles, analyzes their overlapping details (e.g., both build AI startups, solo attendees, common hobbies), and generates a user-friendly, transparent 1-2 sentence match explanation.
- **Dependencies:** `TODO-4.3`
- **Definition of Done (DoD):** Endpoint `/explain-match` in FastAPI returns a matching rationale given two profile objects.

### **17. AI Icebreaker Generator (FastAPI)**
- **Task ID:** `TODO-4.5`
- **Description:** Implement an endpoint in FastAPI that uses an LLM (OpenAI/Anthropic) to generate 3 personalized conversation starters based on the mutual interests/skills of two matching profiles.
- **Dependencies:** `TODO-4.4`
- **Definition of Done (DoD):** Endpoint `/generate-icebreakers` in FastAPI successfully outputs a list of 3 interactive questions/icebreakers for two users.

### **18. Matchmaking REST API (NestJS)**
- **Task ID:** `TODO-4.6`
- **Description:** Create the NestJS API endpoint `/api/matches` that performs similarity search, requests rationales and icebreakers from the FastAPI microservice, and returns a formatted JSON array of compatibility matches.
- **Dependencies:** `TODO-4.5`
- **Definition of Done (DoD):** GET `/api/matches` returns a list of compatible profiles, including the match percentage, reasons for match, and icebreaker prompts.

---

## **Phase 5: Connections & Real-time Chat**

### **19. Connection Requests Engine**
- **Task ID:** `TODO-5.1`
- **Description:** Build REST endpoints in NestJS to manage connection requests: send, accept, decline, and list pending/connected users.
- **Dependencies:** `TODO-4.6`
- **Definition of Done (DoD):** Database state for `ConnectionRequest` transitions correctly (e.g., from `PENDING` to `ACCEPTED`), updating the profile relationships.

### **20. Socket.IO WebSocket Server (NestJS)**
- **Task ID:** `TODO-5.2`
- **Description:** Configure a WebSocket gateway using Socket.IO inside NestJS. Secure the gateway using Clerk authentication verification.
- **Dependencies:** `TODO-5.1`
- **Definition of Done (DoD):** WebSocket clients can establish connections by passing valid Auth headers; backend successfully maps socket IDs to authenticated user IDs.

### **21. Chat Message Storage & Retrieval REST API**
- **Task ID:** `TODO-5.3`
- **Description:** Build REST endpoints in NestJS to fetch chat conversations history between two authenticated users, with pagination support.
- **Dependencies:** `TODO-5.2`
- **Definition of Done (DoD):** GET `/api/chat/:userId` returns a chronological list of messages exchanged between the active user and the contact.

### **22. Real-Time Chat WebSocket Integration**
- **Task ID:** `TODO-5.4`
- **Description:** Implement WebSocket event handlers on the backend for sending messages (`sendMessage`), receiving typing notifications (`typing`), and notifying users of new connections. Save messages to PostgreSQL asynchronously.
- **Dependencies:** `TODO-5.3`
- **Definition of Done (DoD):** Sending a message via the websocket correctly updates the database and broadcasts the message to the recipient instantly if they are online.

---

## **Phase 6: Frontend Design System & Shell**

### **23. Visual Foundations & Tailwind CSS v4 Configuration**
- **Task ID:** `TODO-6.1`
- **Description:** Configure typography (Poppins font), colors (Primary: `#6D5CFF`, Secondary: `#FF8FA3`, Accent: `#FFD166`, Gradients), and responsive breakpoints in Next.js using Tailwind CSS v4 styling rules.
- **Dependencies:** `TODO-5.4`
- **Definition of Done (DoD):** All custom style tokens are successfully integrated and usable across standard Tailwind class styles.

### **24. UI Core Integration (shadcn/ui)**
- **Task ID:** `TODO-6.2`
- **Description:** Install and configure `lucide-react` for modern icons and initialize `shadcn/ui` components (Button, Dialog, Sheet, Tabs, Input, Card). Custom-style shadcn themes to match the brand personality.
- **Dependencies:** `TODO-6.1`
- **Definition of Done (DoD):** A test page imports shadcn buttons and cards successfully rendering with custom rounded corners and styling rules.

### **25. Global Layout & Theme Background**
- **Task ID:** `TODO-6.3`
- **Description:** Create the core app layout shell featuring a floating, transparent glassmorphic navigation bar and the full-screen background gradient (Lavender to Lilac to Peach).
- **Dependencies:** `TODO-6.2`
- **Definition of Done (DoD):** Layout wraps all views. Background gradient displays correctly without banding across multiple responsive screens.

### **26. Animation Shell & Motion Config**
- **Task ID:** `TODO-6.4`
- **Description:** Set up Framer Motion and GSAP configurations within the frontend. Create utility transition wrappers for screen transitions, hover feedback, and fade-in animations.
- **Dependencies:** `TODO-6.3`
- **Definition of Done (DoD):** Interactive elements display smooth hover states and entry motions (e.g. cards floating).

---

## **Phase 7: Frontend Page Development**

### **27. Hero / Landing Page Development**
- **Task ID:** `TODO-7.1`
- **Description:** Build the landing page featuring the hero headline, supporting text, CTA triggers (Sign In / Register), and vector illustrations with floating card animations and node connections powered by GSAP/Framer Motion.
- **Dependencies:** `TODO-6.4`
- **Definition of Done (DoD):** Landing page loads fast, displays marketing sections, and executes scroll storytelling/parallax animations.

### **28. Profile Onboarding Wizard**
- **Task ID:** `TODO-7.2`
- **Description:** Implement a multi-step user registration/onboarding wizard form to capture user profile information (Name, Photo, College, Company, Skills tags, Hobbies, Availability, Career goals).
- **Dependencies:** `TODO-7.1`
- **Definition of Done (DoD):** Completing the wizard calls `PUT /api/profile` to update user details and redirects the user to the match feed.

### **29. Match Recommendations Feed**
- **Task ID:** `TODO-7.3`
- **Description:** Develop the core feed UI displaying matched attendee cards. Each card displays: Avatar, match percentage (dynamic HSL color border), matching description tag, AI-powered "Why you matched" summary, and action buttons (Connect / Message).
- **Dependencies:** `TODO-7.2`
- **Definition of Done (DoD):** The dashboard renders match suggestions from the backend. Clicking "Why you matched" reveals the AI explanation in a modal.

### **30. Digital Business Card & QR Exchange**
- **Task ID:** `TODO-7.4`
- **Description:** Develop the profile page component showing the user's digital business card with custom QR code generator (using the user's connection profile link). Implement a QR scanner view for mobile devices.
- **Dependencies:** `TODO-7.3`
- **Definition of Done (DoD):** Generating the profile displays the dynamic QR code; scanning the link successfully redirects a logged-in user to the matching user connection view.

### **31. Chat and Connections Panel**
- **Task ID:** `TODO-7.5`
- **Description:** Build the real-time messaging interface containing the contact list (accepted connections), chat viewport, interactive input, and active conversation starters (AI-generated icebreakers).
- **Dependencies:** `TODO-7.4`
- **Definition of Done (DoD):** Real-time text sending/receiving functional on client; typing statuses and icebreakers are active on screen.

---

## **Phase 8: Optimization, Caching & Background Jobs**

### **32. BullMQ Service Setup (NestJS)**
- **Task ID:** `TODO-8.1`
- **Description:** Install BullMQ and integrate it with NestJS. Define a matching calculation queue to handle heavy calculation tasks in the background.
- **Dependencies:** `TODO-7.5`
- **Definition of Done (DoD):** BullMQ workers and queues register successfully on app startup, pointing to Redis.

### **33. Asynchronous Match Calculation**
- **Task ID:** `TODO-8.2`
- **Description:** Move match calculations and vector generation to run in background jobs. When a profile updates, add a job to the queue; when computed, cache recommendations in Redis.
- **Dependencies:** `TODO-8.1`
- **Definition of Done (DoD):** Profile updates finish immediately. Vector generation/matchmaking jobs are queued, processed in background, and results cached in Redis.

---

## **Phase 9: Monitoring & Deployment**

### **34. Continuous Integration / Build Validation**
- **Task ID:** `TODO-9.1`
- **Description:** Configure lint rules and TypeScript compiler validations. Write scripts to validate frontend and backend compilation.
- **Dependencies:** `TODO-8.2`
- **Definition of Done (DoD):** Running `npm run build` completes on frontend, backend, and FastAPI server without compile errors.

### **35. Host Setup & Production Deployment**
- **Task ID:** `TODO-9.2`
- **Description:** Deploy Next.js to Vercel. Deploy NestJS and FastAPI services to Railway/Fly.io. Configure Neon production database branch.
- **Dependencies:** `TODO-9.1`
- **Definition of Done (DoD):** Connect AI is live on production domains. Users can log in, construct profiles, see recommendations, and chat in real-time.
