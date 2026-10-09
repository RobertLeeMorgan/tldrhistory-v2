# 🧠 TL;DR History

**TL;DR History** is a full-stack, GraphQL-driven web application for exploring world history through a social, infinite-scrolling timeline.

It blends **historical context**, **global visualisation**, and **modern social mechanics** into a single experience:
a masonry-style feed, a context-aware world map, and dynamic headlines that evolve as you scroll through centuries.

Instead of long essays, users explore **short, contextual summaries** that answer one question:

> *What else was happening in the world at the same time?*

🎯 **Live Demo:** [tldrhistory.xyz](https://tldrhistory.xyz/)

---

## 🌍 Overview

TL;DR History reimagines how history is explored — not as isolated narratives, but as **overlapping global timelines**.

Each post represents a *moment in time*: an event, civilization, person, or cultural movement.  
As users scroll through history:

- Content loads infinitely, like a social feed
- The visible **year range** is tracked via scroll position
- Global context updates automatically:
  - headlines
  - population estimates
  - influential events
  - geographic spread of civilizations

The goal isn’t exhaustive detail — it’s **context**.  
Who existed when? What overlapped? What was happening elsewhere?

---

## ✨ Core Features

### 📰 Timeline & Feed
- Infinite scrolling **masonry grid** (newspaper / Pinterest-style)
- Chronological posts spanning continents and centuries
- Smooth transitions as historical context changes
- Intersection Observer used to track visible time ranges and drive shared state

### 🗺️ Global Map & Stats Panel
- Interactive **SVG world map** visualising:
  - civilizations, empires, and cultures
  - early human migration paths
  - geographic expansion and overlap over time
  - using grouping, colour-coding, and scale
- Context-aware stats panel displaying:
  - estimated global population for the current era
  - most influential articles
  - historically active regions

> The map and stats are **entirely driven by timeline scroll context**, not manual user input.

### 🔍 Filtering & Discovery
- Filter by:
  - continent
  - subject (culture, politics, science, military, etc.)
  - theme groupings (e.g. *Ancient Egypt*, *Greece*, etc.)
  - post type
  - date ranges
- Sorting and full-text search
- All filters integrate directly with the GraphQL API and cache efficiently on the client

### 👤 Users & Social Functionality
- JWT-based authentication
- User profiles
- Like / unlike posts
- Create, edit, and delete owned posts
- Personal timelines of created and liked content

### 🤖 AI-Assisted Content Generation
- When content density is low for a given time period:
  - a **conditionally rendered AI prompt** is triggered
  - prompts are dynamically built from current filters and timeline context
- Generated content is:
  - validated with **Zod**
  - enriched using external APIs (e.g. Wikipedia for images and metadata)
- Enables **effectively infinite content generation** while maintaining structure and safety

---

## 🧱 Architecture & Tech Stack

### Frontend
- **React 19** + **Vite**
- **TypeScript**
- **Tailwind CSS** + **DaisyUI**
- **TanStack Query + Axios** for GraphQL data fetching and caching
- **Framer Motion** for animated context transitions
- **D3 + TopoJSON** for map visualisation
- **Intersection Observer** for timeline-driven shared state

### Backend
- **Node.js + Express**
- **Apollo Server (GraphQL)**
- **JWT authentication**
- **Prisma ORM** with strict TypeScript inference
- **Zod** for schema validation
- **OpenAI API** for AI-generated content
- **Node-cache + queueing** for rate-limited AI pipelines
- **Helmet, compression, CORS** for security and performance

### Database
- **PostgreSQL** (hosted on Render)
- Relational schema for:
  - users
  - posts
  - likes
  - groups
  - subjects
  - population
  - era headlines

---

## 🗂️ Project Structure
```bash
tldrhistory/
├── frontend/ # React + Vite client
│ └── src/
│ ├── components/
│ ├── hooks/
│ ├── routes/
│ ├── context/
│ └── util/
│
├── backend/ # Express + GraphQL API
│ ├── src/
│ │ ├── resolvers/
│ │ ├── schema/
│ │ ├── middleware/
│ │ ├── services/
│ │ └── util/
│ ├── prisma/
│ │ ├── schema.prisma
│ │ └── seed.ts
│ └── dist/
│
└── README.md
```

---

## ⚙️ Setup (Local Development)

### Prerequisites
- Node.js (18+ recommended)
- PostgreSQL
- OpenAI API key

---

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/tldrhistory.git
cd tldrhistory
```
2. Install dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
```
3. Environment variables
Create a .env file in /backend:
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/tldrhistory
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
```
4. Database setup
```bash
cd backend
npx prisma migrate dev
npx prisma generate
npx prisma db seed
```
5. Run the app

# backend
npm run dev

# frontend (separate terminal)
npm run dev

# ☁️ Deployment Notes
Build Frontend with npm run build

Add the Frontend /dist to Backend /public 

Backend and client can be deployed together

PostgreSQL hosted on Render

Designed with free-tier cold starts and rate limits in mind

## VPS staging deployment

The VPS path builds independent frontend and backend images from `frontend/Dockerfile` and `backend/Dockerfile`. The frontend serves React Router SSR and same-origin browser API calls; Caddy routes `/graphql`, `/api`, and `/health` to the backend. Render remains on the combined behavior unless `SERVE_FRONTEND=false` is explicitly set.

The protected-main workflow publishes immutable GHCR digests and calls the restricted VPS deployment command. It does not run database migrations. See [the staging deployment handoff](docs/vps-staging.md) for required runtime configuration, infrastructure onboarding, data sanitization, restore checks and outstanding access/DNS requirements.

---

## 👤 Author
Rob
Full-stack developer focused on GraphQL systems, TypeScript architecture, and context-driven UX.
