# ConnectAI Recommended Tech Stack (2026)

#  

| Layer | Recommended Technology | Why it's the Best Choice |
| ----- | ----- | ----- |
| Frontend | React 19 \+ Next.js 16 \+ TypeScript | Best performance, SEO, App Router, server components, huge ecosystem |
| UI | Tailwind CSS v4 \+ shadcn/ui | Beautiful, customizable, production-ready components |
| Animation | Framer Motion \+ GSAP | Smooth networking animations and premium landing page interactions |
| Icons | Lucide Icons | Lightweight, consistent, modern |
| State Management | Zustand \+ TanStack Query | Simpler than Redux, excellent server-state management |
| Backend | NestJS (TypeScript) | Structured architecture, scalable, ideal for APIs and WebSockets |
| AI Services | Python (FastAPI) | Best ecosystem for AI, embeddings, NLP, and recommendation models |
| Authentication | Clerk | Excellent developer experience with social logins and organizations |
| Database | PostgreSQL \+ pgvector | Relational data plus semantic vector search in one database |
| ORM | Prisma | Type-safe, productive, and works seamlessly with PostgreSQL |
| Cache | Redis | Session storage, caching, queues, and fast recommendations |
| Real-Time | Socket.IO | Reliable real-time chat, notifications, and presence |
| Object Storage | Cloudflare R2 | Low-cost storage for profile photos and files |
| Search | PostgreSQL Full Text \+ pgvector | Enough for MVP without introducing Elasticsearch |
| Queue | BullMQ \+ Redis | Background jobs like AI matching and notifications |
| AI Model Access | OpenAI \+ Anthropic (pluggable) | High-quality reasoning and conversation generation |
| Embeddings | OpenAI Embeddings or open-source alternatives | Semantic similarity for matchmaking |
| Deployment (Frontend) | Vercel | Best deployment experience for Next.js |
| Deployment (Backend) | Railway or Fly.io | Fast deployment and good developer experience |
| Database Hosting | Neon | Serverless PostgreSQL with branching and autoscaling |
| Monitoring | Sentry \+ Better Stack | Error tracking, logs, uptime monitoring |
| Analytics | PostHog | Product analytics, funnels, feature flags |
| CI/CD | GitHub Actions | Automated testing and deployments  |

# **Frontend**

## **Framework**

### **✅ Next.js 16 \+ React 19 \+ TypeScript**

**Why?**

Your landing page includes:

* large animated illustrations  
* parallax scrolling  
* AI-powered dashboards  
* profile pages  
* organizer dashboard  
* chat  
* authentication

Next.js gives you:

* Server-side rendering  
* Fast loading  
* SEO for marketing pages  
* App Router  
* Streaming  
* Server Actions  
* Great developer experience

---

## **Styling**

### **Tailwind CSS v4**

Your website uses:

* soft gradients  
* rounded cards  
* glassmorphism  
* pastel colors  
* responsive layouts

Tailwind makes all of this much faster to build and maintain.

---

## **UI Components**

### **shadcn/ui**

This provides production-quality components such as:

* Dialogs  
* Sheets  
* Dropdowns  
* Tabs  
* Toasts  
* Command palettes  
* Forms  
* Cards

You can customize every component to match your pastel ConnectAI aesthetic.

---

## **Animations**

Your design relies heavily on movement:

* People walking  
* Nodes connecting  
* Floating cards  
* Scroll storytelling  
* Human network formation

Use:

* **Framer Motion** for UI transitions and micro-interactions  
* **GSAP** for advanced scroll animations and hero storytelling

---

# **Backend**

## **NestJS**

Why not Express?

NestJS offers:

* dependency injection  
* modular architecture  
* WebSocket support  
* authentication guards  
* scalable code organization  
* excellent TypeScript support

As ConnectAI grows, this structure becomes invaluable.

---

# **AI Layer**

Instead of embedding AI directly into the backend:

Frontend  
     │  
     ▼  
 NestJS API  
     │  
     ├────────► PostgreSQL  
     │  
     ├────────► Redis  
     │  
     ▼  
 FastAPI AI Service

The AI service handles:

* Profile understanding  
* Match scoring  
* Embeddings  
* Icebreakers  
* Group generation  
* Networking health scores

Python is the natural choice because of its AI ecosystem.

---

# **Authentication**

## **Clerk**

Features include:

* Google login  
* GitHub login  
* LinkedIn login  
* Email/password  
* Magic links  
* Multi-factor authentication  
* Session management

For an event networking app, reducing sign-up friction is crucial.

---

# **Database**

## **PostgreSQL \+ pgvector**

You need to store:

* users  
* profiles  
* skills  
* interests  
* events  
* chats  
* groups  
* organizer analytics

Relational data fits PostgreSQL well.

For AI matching:

Store vector embeddings directly in PostgreSQL using `pgvector`, avoiding a separate vector database for the MVP.

---

# **ORM**

## **Prisma**

Benefits:

* Type-safe queries  
* Easy migrations  
* Excellent TypeScript integration  
* Great developer productivity

---

# **Redis**

Redis supports:

* caching AI matches  
* session storage  
* rate limiting  
* online presence  
* notification queues  
* background processing

---

# **Real-Time Communication**

## **Socket.IO**

Supports:

* chat  
* typing indicators  
* online/offline status  
* live notifications  
* live organizer dashboard  
* instant connection requests

---

# **AI Stack**

## **Large Language Model**

Use a provider-agnostic approach so you can switch models later.

Use LLMs for:

* icebreaker generation  
* profile summaries  
* match explanations  
* networking tips  
* organizer insights

---

## **Embeddings**

Convert profiles into embeddings containing information like:

* skills  
* interests  
* goals  
* startup ideas  
* preferred roles

This enables semantic similarity instead of keyword matching.

---

# **Deployment**

## **Frontend**

**Vercel**

Reasons:

* built for Next.js  
* edge functions  
* automatic previews  
* CDN  
* excellent performance

---

## **Backend**

**Railway** (easy) or **Fly.io** (more control)

Either works well for NestJS and FastAPI services.

---

## **Database**

**Neon**

Advantages:

* managed PostgreSQL  
* autoscaling  
* branching  
* excellent integration with modern frameworks

---

# **Analytics**

## **PostHog**

Track:

* profile completion  
* match acceptance  
* messages sent  
* connections created  
* group joins  
* AI usage  
* retention

These align directly with the KPIs defined in your PRD.

---

# **Monitoring**

Use:

* **Sentry** for application errors  
* **Better Stack** for logs and uptime

This helps quickly diagnose issues during live events.

---

# **Recommended Architecture**

                    Users  
                      │  
                      ▼  
          Next.js Frontend (React)  
                      │  
       ┌──────────────┴──────────────┐  
       ▼                             ▼  
   Clerk Auth                  Socket.IO  
       │                             │  
       └──────────────┬──────────────┘  
                      ▼  
                NestJS Backend  
        ┌─────────┼──────────┐  
        ▼         ▼          ▼  
 PostgreSQL   Redis     FastAPI AI  
 (pgvector)             Service  
        │                  │  
        └──────────┬───────┘  
                   ▼  
          LLM \+ Embeddings

