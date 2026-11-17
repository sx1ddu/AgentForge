# AgentForge — Production-Grade Multi-Agent AI Platform

[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com)
[![LangGraph](https://img.shields.io/badge/LangGraph-1.x-1C3C3C)](https://langchain-ai.github.io/langgraph/)
[![MongoDB](https://img.shields.io/badge/MongoDB-9.x-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white)](https://redis.io)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-DD2C00?logo=firebase&logoColor=white)](https://firebase.google.com)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?logo=stripe&logoColor=white)](https://stripe.com)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://www.docker.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

**AgentForge** is an enterprise-ready, full-stack multi-agent AI platform built with a microservices backend (Node.js, Express 5, LangGraph, MongoDB, Redis) and a high-performance frontend (React 19, Vite, Tailwind CSS v4, Monaco Editor).

It features collaborative multi-agent execution loops (Planner → Researcher → Coder → Reviewer), real-time Server-Sent Events (SSE) token streaming, zero-trust internal microservice authorization, atomic credit ledgers, and automated database index migrations.

---

## Architecture Overview

```
                      ┌──────────────────────────────────────────────────┐
                      │            FRONTEND (React 19 + Vite)            │
                      │       Redux Toolkit · Tailwind · Monaco Editor   │
                      └─────────────────────┬────────────────────────────┘
                                            │ HTTPS / SSE (cookies)
                                            ▼
                      ┌──────────────────────────────────────────────────┐
                      │              API GATEWAY  (port 8000)            │
                      │  CORS · Cookie-Parser · Zero-Trust Proxy Guard   │
                      └───┬──────────┬──────────┬──────────┬─────────────┘
                          │          │          │          │
                ┌─────────▼──┐ ┌─────▼────┐ ┌──▼───────┐ ┌▼────────────┐
                │  AUTH SVC  │ │ CHAT SVC │ │AGENT SVC │ │ BILLING SVC │
                │ port 8001  │ │ port 8002│ │port 8003 │ │ port 8004   │
                │ Firebase   │ │Mongoose  │ │LangGraph │ │ Stripe      │
                │ Sessions   │ │ Convos & │ │Team Loop │ │ Checkout +  │
                │ Atomic $inc│ │ Messages │ │& Agents  │ │ Webhook     │
                └─────┬──────┘ └────┬─────┘ └────┬─────┘ └──────┬──────┘
                      │             │             │              │
                      ▼             ▼             ▼              ▼
               ┌────────────┐ ┌──────────┐ ┌──────────────┐ ┌──────────┐
               │   REDIS    │ │ MONGODB  │ │LLM PROVIDERS │ │  STRIPE  │
               │ Sessions + │ │ Atlas /  │ │ Groq·Gemini  │ │ Webhooks │
               │ Msg Cache  │ │ Primary  │ │ OpenRouter   │ │ (Raw)    │
               └────────────┘ └──────────┘ └──────────────┘ └──────────┘
```

### Key Architectural Safeguards

1. **Zero-Trust Microservice Network (`TASK-01`):** All sensitive inter-service routes (`/api/auth/update-plan`, `/api/auth/deduct-credits`) require the cryptographic `x-internal-service-key`. The Gateway explicitly blocks public internet access to these routes and strips client-injected headers in `proxyWithHeader.js`.
2. **Atomic Credit Transactions (`TASK-09`):** Credit deductions are evaluated and executed atomically using MongoDB `$gte` conditional updates (`findOneAndUpdate({ _id, credits: { $gte: cost } }, { $inc: { credits: -cost } })`), eliminating race conditions and negative balances.
3. **IDOR Prevention (`TASK-02`):** Every conversation and message query across the Chat service is strictly scoped by `userId` in addition to resource `_id`.
4. **Stripe Webhook Integrity (`TASK-06`):** The Gateway proxies `/api/billing/webhook` before JSON parsing middleware with `parseReqBody: false`, preserving raw cryptographically verifiable payloads.

---

## Feature Matrix

- **Collaborative Multi-Agent Workflows:** Autonomous team graph featuring:
  - **Planner Agent:** Breaks user prompts into actionable work breakdowns.
  - **Researcher Agent:** Gathers context and formulates technical strategies.
  - **Collaborative Coder Agent:** Produces production-quality multi-file implementations.
  - **Reviewer Agent:** Validates code output, enforces linting/security requirements, and triggers iterative revisions.
- **Specialized Single Agents:** Direct mode for Chat, Coding, Web Search (Tavily), PDF Generation, PPT Generation, Vision / Image Generation (Pollinations AI), and PDF RAG with automatic Qdrant vector cleanup.
- **Real-Time Token Streaming (SSE):** Support for Server-Sent Events via `/api/agent/stream` delivering immediate chunked responses with heartbeats.
- **Monaco Editor & Live Preview:** Artifact panel rendering syntax-highlighted multi-file codebases with one-click sandbox preview and file export.
- **Credit Billing with Stripe:** Standardized USD pricing ($9.99 for 500 credits, $19.99 for 1500 credits) with automated credit sync on webhook completion.
- **Resilient Fallbacks:** In-memory vector search and in-memory S3 file buffers ensure complete offline functionality when external cloud services (Qdrant, AWS S3) are unconfigured.

---

## Quick Start (Local Development)

### Prerequisites

- [Docker](https://www.docker.com/) & Docker Compose
- [Node.js 20+](https://nodejs.org/) (for local script execution & testing)
- [npm](https://www.npmjs.com/)

### 1. Clone & Configure Environment

```bash
# Clone the repository
git clone https://github.com/your-org/AgentForge.git
cd AgentForge

# Copy environment templates
cp backend/.env.example backend/.env
cp backend/gateway/.env.example backend/gateway/.env
cp backend/services/auth/.env.example backend/services/auth/.env
cp backend/services/chat/.env.example backend/services/chat/.env
cp backend/services/billing/.env.example backend/services/billing/.env
cp backend/services/agent/.env.example backend/services/agent/.env
cp frontend/.env.example frontend/.env
```

Ensure `INTERNAL_SERVICE_KEY` matches across all backend service `.env` files.

### 2. Launch with Docker Compose

Run the entire microservices stack (MongoDB, Redis, Gateway, Auth, Chat, Billing, Agent):

```bash
docker compose -f backend/docker-compose.yml up -d --build
```

### 3. Initialize Database Indexes

Run the database indexing migration script:

```bash
node backend/shared/db/initDb.js
```

### 4. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

The web application is now running at `http://localhost:5173`.

---

## Service Ports

| Service | Port | Description |
| :--- | :--- | :--- |
| **Frontend** | `5173` | React 19 / Vite UI |
| **API Gateway** | `8000` | Reverse proxy and session verification |
| **Auth Service** | `8001` | Google Firebase Auth & atomic credit ledger |
| **Chat Service** | `8002` | Conversations and message persistence |
| **Agent Service** | `8003` | LangGraph multi-agent orchestration & SSE |
| **Billing Service** | `8004` | Stripe checkout orders & webhooks |
| **MongoDB** | `27017` | Persistent database |
| **Redis** | `6379` | Session cache & short-term conversational memory |

---

## Testing & Quality Assurance

### Run Backend Unit & Integration Tests

Execute all 22 tests across 5 test suites using the Node.js native test runner:

```bash
node --test backend/tests/*.test.js
```

### Run Frontend Linting & Production Build

```bash
cd frontend

# Verify 0 lint errors
npm run lint

# Verify production Vite build
npm run build
```

---

## Production Deployment

### Docker Multi-Stage Builds

All microservice Dockerfiles follow production best practices:
- Multi-stage builds (`node:20-alpine`) for minimal container images.
- Execution under unprivileged `node` user (non-root execution).
- Production dependency pruning (`npm prune --production`).
- Integrated `/healthz` endpoints with Docker healthchecks.

### Environment Checklist for Production

- [ ] Set `NODE_ENV=production` across all services.
- [ ] Configure high-entropy random string for `INTERNAL_SERVICE_KEY`.
- [ ] Set `COOKIE_SECURE=true` and `SAME_SITE=None` (or `Lax`) behind HTTPS.
- [ ] Configure `MONGODB_URI` pointing to a clustered replica set (e.g. MongoDB Atlas).
- [ ] Configure `REDIS_URL` pointing to high-availability Redis (e.g. AWS ElastiCache).
- [ ] Supply live Stripe keys (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`).
- [ ] Supply production LLM API keys (`GROQ_API_KEY`, `GEMINI_API_KEY`).
