# AGENTFORGE — PRODUCT DESIGN SYSTEM & UI SPECIFICATION

**Document Version:** 2.0.0  
**Status:** Approved Architectural Blueprint  
**Target Platform:** Web (Desktop, Tablet, Mobile)  
**Product Identity:** Autonomous Multi-Agent AI Engineering Platform  

---

## 1. Product Positioning & Design Philosophy

### 1.1 Product Positioning
AgentForge is an enterprise-grade autonomous AI orchestration environment. It is engineered for software developers, AI engineers, and technical creators who require deep multi-agent collaboration—where specialized agents (Planner, Researcher, Coder, Reviewer) execute cyclical reasoning loops rather than one-shot chatbot replies.

### 1.2 Design Philosophy: Editorial-Meets-Engineering
AgentForge rejects the generic, homogenized "AI wrapper" aesthetics of 2023–2024 (oversaturated purple gradients, blurry glowing balls, low-contrast glassy floating cards). 

Instead, AgentForge embraces a **precise, high-density, architectural aesthetic**:
- **Obsidian & Graphite Surfaces:** Deep, layered near-black tones (`#090A0F`, `#0E1017`, `#141721`) that eliminate eye strain during multi-hour technical work.
- **Electric Lime / Titanium Accents:** A crisp, high-visibility neon lime (`#A3E635` / `#84CC16`) and sharp cyan/titanium highlights (`#38BDF8`) that signal active compiler status, execution flow, and agent handoffs.
- **Information Density & Structured Typography:** Fine-grained, hairline borders (`1px solid rgba(255, 255, 255, 0.08)`), monospace code precision, and crisp hierarchy.
- **Artifact-First Workflow:** Code and documents are not trapped in conversational bubbles; they live in dedicated, interactive workspaces with live browser preview and Monaco code inspection.

---

## 2. Target Users & UX Principles

### 2.1 Target Personas
1. **Full-Stack & Systems Engineers:** Want immediate terminal/code visibility, multi-file generation, syntax highlighting, and reproducible outputs without conversational fluff.
2. **AI & Prompt Engineers:** Need to inspect the LangGraph orchestration loop—viewing how the Planner passed context to the Researcher, how the Coder drafted files, and what criteria the Reviewer verified.
3. **Product Founders & Builders:** Rapidly turn plain-English specifications into working React applications, downloadable styled PDFs, and executive slide decks.

### 2.2 Core UX Principles
- **Predictable & Transparent:** Never disguise an agent's failure or invent imaginary telemetry. Every token stream, credit deduction, and agent transition is directly reported.
- **Zero Friction Transition:** Visitors can thoroughly explore the public product, documentation, agent capabilities, and pricing before authenticating. Once logged in, the transition directly into an active workspace is instantaneous.
- **Persistent Context:** The active conversation, current Monaco artifact, selected agent mode, and credit balance remain visible and reactive across all interactions.
- **Graceful Fallbacks:** If external cloud infrastructure (AWS S3, Qdrant) is unconfigured or in offline mode, the UI seamlessly reflects in-memory operations without crashing.

---

## 3. Brand Identity

- **Logomark:** Monogram **AF** rendered inside a chamfered obsidian badge with a hairline neon lime border and ambient backdrop blur.
- **Tone of Voice:** Authoritative, direct, technical, and precise. No condescending cheerfulness or generic robot metaphors.
- **Brand Tagline:** *"Orchestrate Autonomous AI Agent Teams from Concept to Production Code."*

---

## 4. Visual Direction & Style Guidelines

### 4.1 Strict Cliché Prohibitions
- **NO** generic purple-to-pink gradient backgrounds.
- **NO** decorative floating blurred spheres or floating geometric shapes.
- **NO** oversized pill buttons with multi-color neon borders.
- **NO** low-contrast gray text on dark backgrounds (minimum 4.5:1 contrast ratio maintained throughout).
- **NO** fake testimonials, fake user counters, or fabricated enterprise partner logos.

### 4.2 Engineering Visual Details
- Hairline structural dividers: `rgba(255, 255, 255, 0.07)`.
- Status indicators: Precision dot pips with subtle 1s pulses.
- Code display: Monaco Editor with dark syntax theme, line numbers, and file tree tabs.
- Card radius: `12px` (subtle, structured), avoiding bubbly `32px` curves.

---

## 5. Color System & Design Tokens

### 5.1 Palette Tokens

| Token Name | Hex Code | Purpose / Usage |
| :--- | :--- | :--- |
| `--bg-base` | `#08090D` | Root application background |
| `--bg-surface-1` | `#0D0F15` | Navigation, sidebar, drawer backgrounds |
| `--bg-surface-2` | `#131620` | Cards, message bubbles, panels |
| `--bg-surface-3` | `#1A1E2C` | Hover states, active tabs, dropdowns |
| `--border-subtle` | `rgba(255, 255, 255, 0.06)` | Grid lines, table rows, card borders |
| `--border-active` | `rgba(255, 255, 255, 0.14)` | Hover borders, active inputs |
| `--border-accent` | `rgba(163, 230, 53, 0.35)` | Lime highlight focus rings & agent active states |
| `--text-primary` | `#F8FAFC` | Headings, active values, high-contrast labels |
| `--text-secondary` | `#94A3B8` | Body text, descriptions, inactive navigation |
| `--text-muted` | `#64748B` | Metadata, timestamps, shortcuts |
| `--accent-lime` | `#A3E635` | Primary brand accent, compile success, active agent |
| `--accent-lime-hover` | `#BEF264` | Primary hover state |
| `--accent-cyan` | `#38BDF8` | Research agent, streaming status, secondary links |
| `--status-error` | `#F87171` | Validation errors, payment failure, refund notice |
| `--status-warning` | `#FBBF24` | Reviewer revisions, credit low alert |
| `--status-success` | `#34D399` | Payment complete, code verified, tests passed |

---

## 6. Typography System

The interface pairs clean sans-serif typography for UI structure with a monospace font for code, agent logs, and numerical metrics.

- **UI Font Stack:** Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
- **Monospace Font Stack:** "JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo, Monaco, monospace

### Type Scale

| Scale | Font Size | Line Height | Tracking | Weight | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `display-1` | 56px (3.5rem) | 1.1 | -0.03em | 800 | Landing hero headline |
| `heading-1` | 32px (2.0rem) | 1.2 | -0.025em | 700 | Section titles, feature headers |
| `heading-2` | 22px (1.375rem)| 1.3 | -0.02em | 600 | Modal titles, drawer titles |
| `heading-3` | 16px (1.0rem) | 1.4 | -0.01em | 600 | Card titles, agent names |
| `body-base` | 14px (0.875rem)| 1.55| 0 | 400/500 | Chat messages, description prose |
| `body-sm` | 13px (0.8125rem)|1.5 | 0 | 400/500 | Sidebar items, form inputs |
| `caption` | 11px (0.6875rem)|1.4 | +0.02em | 500/600 | Badges, tags, timestamps |
| `mono-code`| 13px (0.8125rem)|1.6 | 0 | 400 | Monaco editor, JSON artifacts, logs |

---

## 7. Spacing & Grid System

- **Baseline Grid:** 4px grid. All margins, paddings, and heights align to multiples of 4:
  - `space-1`: 4px
  - `space-2`: 8px
  - `space-3`: 12px
  - `space-4`: 16px
  - `space-5`: 20px
  - `space-6`: 24px
  - `space-8`: 32px
  - `space-12`: 48px
  - `space-16`: 64px
- **Layout Containers:**
  - Public marketing: max-w-7xl (1280px), centered with `px-6` gutters.
  - Authenticated app: `100vw` by `100vh`, split-pane flexbox with zero document scrollbar.

---

## 8. Component Design System

### 8.1 Buttons
- **Primary:** Background `--accent-lime`, text `#090A0F`, font-weight 600, radius 8px, hover `--accent-lime-hover`.
- **Secondary:** Background `--bg-surface-2`, border `--border-subtle`, text `--text-primary`, hover `--bg-surface-3`.
- **Ghost:** Background transparent, text `--text-secondary`, hover `--text-primary`, hover background `rgba(255,255,255,0.04)`.
- **Danger:** Background `rgba(239, 68, 68, 0.1)`, text `#FCA5A5`, border `rgba(239, 68, 68, 0.2)`.

### 8.2 Input & Textareas
- Background `--bg-surface-1`, border `--border-subtle`, focus border `--border-accent`, text `--text-primary`, placeholder `--text-muted`.
- Focus ring: `0 0 0 2px rgba(163, 230, 53, 0.2)`.

### 8.3 Badges & Pills
- Monospace or semi-bold caption text, height 22px, padding `2px 8px`, rounded 6px or 9999px.
- Agent mode badge: subtle color matching domain (Team = Lime, Coding = Cyan, Search = Emerald, PDF/PPT = Amber).

### 8.4 Modals & Drawers
- Backdrop: `rgba(0, 0, 0, 0.75)` with `backdrop-blur-md`.
- Elevation: 1px hairline border, box shadow `0 24px 48px -12px rgba(0,0,0,0.85)`.

---

## 9. Public Website Sitemap & Page Specifications

### 9.1 Public View Architecture
The public website is rendered seamlessly within the single-page application when `!userData`:
1. **Sticky Topbar:**
   - Brand Logo & Version Chip (`v2.0`)
   - Navigation links:
     - Features (`#features`)
     - Agent Ecosystem (`#agents`)
     - Orchestration Loop (`#architecture`)
     - Pricing (`#pricing`)
     - FAQ (`#faq`)
   - Actions:
     - `Sign In` button (Ghost)
     - `Get Started Free` button (Lime Accent)
2. **Hero Section:**
   - Pre-title: *"⚡ LANGGRAPH-POWERED MULTI-AGENT RUNTIME"*
   - Title: *"Orchestrate Autonomous AI Agent Teams."*
   - Subtitle: *"Deploy collaborative agent workflows that plan, research, write full-stack code, and synthesize publication-ready documents with real-time streaming."*
   - Direct CTA to open Google Authentication modal.
3. **Interactive Workspace Demo:**
   - Real interactive simulated multi-agent handoff showing Planner -> Researcher -> Coder -> Reviewer with sample React code.
4. **Agent Ecosystem Grid (6 Specialized Domains):**
   - Collaborative Team Agent
   - Full-Stack Coding Agent
   - Live Web Search (Tavily)
   - PDF Document Synthesis (PDFKit)
   - Presentation Deck Generation (PPTX)
   - Vision Analysis & PDF Vector RAG (Qdrant)
5. **Architectural Specification & Security:**
   - Zero-trust internal service key enforcement.
   - Atomic credit ledger balance checking.
   - Idempotent Stripe webhook synchronization.
6. **Transparent Pricing Grid:**
   - Free Tier ($0 / 50 welcome credits)
   - Starter Tier ($9.99 / 500 compute credits)
   - Pro Tier ($19.99 / 1,500 compute credits)
7. **Interactive FAQ & Technical Details**
8. **Engineering Footer:** Copyright, GitHub links, and technical specifications.

---

## 10. Authenticated Application Architecture

When `userData` is authenticated via Firebase and Gateway session:
1. **Workspace Shell:**
   - Three-column responsive grid:
     - **Column 1: Workspace Sidebar (Collapsible)**
       - New Chat button (Shortcut: `Ctrl+N` / `Cmd+N`)
       - Conversation list with title, message count, active highlight, and inline delete button
       - Credit usage gauge & quick upgrade CTA
       - User profile row with plan badge, email, and sign-out button
     - **Column 2: Central Chat & Multi-Agent Workspace**
       - Navigation header with conversation title, agent status pill, and token count
       - Message thread with user speech bubbles and agent cards
       - Agent handoff visualization card (Planner -> Researcher -> Coder -> Reviewer)
       - Composer area with Agent selector pills (`Team`, `Coding`, `Search`, `PDF`, `PPT`, `Vision`), multi-line input, image/file attachment, and submit button
     - **Column 3: Artifact & Live Execution Sandbox (Collapsible)**
       - Code editor tabs for multi-file projects (`App.jsx`, `index.html`, `styles.css`)
       - Embedded Monaco Editor with dark syntax theme
       - Live browser preview toggle (Iframe sandbox)
       - Action toolbar: Copy Code, Download File, Fullscreen toggle, Close panel
2. **Auxiliary Modals & Drawers:**
   - **Billing Drawer:** Stripe checkout session trigger with plan selector and credit breakdown.
   - **Command Palette (`Cmd+K` / `Ctrl+K`):** Quick jump to conversations, switch active agent, new chat, or sign out.
   - **Settings & Profile Modal:** View user details, plan expiration, API provider connectivity, and keyboard shortcut cheatsheet.

---

## 11. Preserved Backend Integration Contracts

The frontend design system preserves every backend endpoint and expected contract:
- `POST /api/auth/login`: `{ token }` (Firebase Google ID token)
- `POST /api/auth/logout`: Clears HTTP-only session cookie
- `GET /api/me`: Returns `{ _id, name, email, avatar, plan, credits, totalCredits, planExpiresAt }`
- `GET /api/chat/get-conversations`: Returns user conversation array
- `POST /api/chat/create-conversation`: `{ title }`
- `GET /api/chat/get-messages/:id`: Returns message history array
- `POST /api/chat/update-conversation`: `{ conversationId, title }`
- `DELETE /api/chat/delete-conversation/:id`: Deletes conversation
- `POST /api/agent/chat`: `{ prompt, conversationId, agent, file }` (Sync response with `{ answer, images, artifacts }`)
- `POST /api/agent/stream`: `{ prompt, conversationId, agent }` (Server-Sent Events)
- `POST /api/billing/create-order`: `{ plan }` (Returns `{ url }` for Stripe Checkout)
- `GET /api/billing/verify-payment`: `?session_id=...` (Verifies Stripe transaction)

---

## 12. Quality & Acceptance Criteria

1. **Zero Backend Changes:** Verified strictly read-only.
2. **Code Cleanliness:** `npm run lint` must pass with 0 errors and 0 warnings.
3. **Build Stability:** `npm run build` must succeed with production bundle in `dist/`.
4. **Complete Responsiveness:** Clean layout across mobile (375px), tablet (768px), desktop (1280px), and wide monitors (1920px).
5. **No Fake Controls:** Every clickable button either executes a verified action or provides genuine, honest feedback.
