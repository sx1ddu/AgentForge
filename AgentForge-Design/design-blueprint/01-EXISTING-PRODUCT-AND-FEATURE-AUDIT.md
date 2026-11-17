# Existing product and feature audit

## Scope inspected
Repository archive `AgentForge-main.zip` (189 archive entries). Frontend source inspected under `frontend/src`: `App.jsx`, `pages/Home.jsx`, all components, UI components, feature API modules, Redux slices/store, Firebase/Axios setup, entrypoint and stylesheet. Backend route/controller/graph/config files inspected to ground the interface contracts. The archive includes backend services for gateway, auth, chat, agent and billing, plus shared infrastructure and tests.

## Frontend inventory
- App shell: `App.jsx`, `main.jsx`, `index.css`.
- Main state/page controller: `pages/Home.jsx`.
- Components: `LandingPage`, `Sidebar`, `Nav`, `ChatArea`, `ChatInput`, `MessageList`, `MessageBubble`, `LoadingAnimation`, `Artifact`, `BillingDrawer`.
- UI overlays: `CommandPalette`, `SettingsModal`.
- API modules: create/get/update/delete conversation, get messages, get current user, send message, create order, verify payment, logout.
- State: user, conversation, message slices; no persistence middleware in the configured store.

## Current application behavior (source-backed)
### Entry and auth
`App.jsx` calls `getCurrentUser()` at startup and dispatches returned user data. `Home.jsx` shows `LandingPage` when there is no user; login is a modal offering Firebase Google popup auth. It posts the Firebase ID token to `/api/auth/login`. There are no separate login/signup routes, email/password flow or onboarding sequence in the frontend.

### Authenticated shell
`Home.jsx` composes Sidebar + ChatArea + optional Artifact panel, BillingDrawer, SettingsModal and CommandPalette. Global shortcuts include Cmd/Ctrl+K, Cmd/Ctrl+N and Escape. Stripe return verification is handled from `session_id` in the URL.

### Conversations and messages
Sidebar loads conversation history. Backend supports create, list (max 100), rename, delete and message retrieval. Message list renders Markdown/GFM, syntax-highlighted code and image previews. Chat input supports prompt, one file, agent mode selection and browser speech recognition. Message request timeout is 180 seconds.

### Agent modes in the composer
The UI exposes Auto, Team, Coding, Search, PDF, PPT and Vision. The backend router additionally routes PDF attachments to PDF RAG and image attachments to image analysis when auto mode is used. The graph supports chat, search, coding, PDF, PPT, vision/image generation, PDF RAG, image analyzer and planner/researcher/collaborative coder/reviewer nodes.

### Collaborative execution
LangGraph graph edges are Planner → (Researcher optional) → Collaborative Coder → Reviewer → (Collaborative Coder if reviewer requests revision) → end. The current `/api/agent/chat` response returns final `answer`, `images` and `artifacts`; no per-node progress events are returned by this endpoint. The `/stream` controller invokes the full graph before sending answer text in 8-character chunks. Therefore the UI may show a pending state and later a **completed run summary**, but must not claim live per-agent execution telemetry.

### Artifacts
Artifact panel consumes `artifacts` from Redux. It displays the first artifact's `files`, file tabs, read-only Monaco editor, copy/download and a preview if `index.html` exists. Preview is assembled from `index.html`, `style.css` and `script.js` into a sandboxed iframe. No PDF/PPT preview implementation is evident in this component. Do not label Monaco as editable.

### Billing
Frontend billing drawer offers Free, Starter and Pro presentation. Backend plan config defines Free ($0, 100 credits, 30 days), Starter ($9.99, 500 credits, 30 days), Pro ($19.99, 1,500 credits, 30 days), currency USD. Backend supports create checkout and verify payment; Stripe webhook exists. No payment-history list API is exposed in inspected billing routes.

### Settings
Settings modal includes profile/account and appearance-oriented UI. There is no server-backed preference persistence API in the inspected route list. Treat theme/preferences as local frontend settings only if implemented; do not imply account-wide sync.

## API contract map
| Frontend action | Method / path | Request | Response/use |
|---|---|---|---|
| Current user | GET `/api/me` | no query added in current helper | helper expects user object; gateway route is protected |
| Login | POST `/api/auth/login` | `{ token }` | user object; session cookie set by auth service |
| Logout | POST `/api/auth/logout` | none | `{ success, message }` |
| Create conversation | POST `/api/chat/create-conversation` | `{ title }` | conversation document |
| List conversations | GET `/api/chat/get-conversations` | none | array, max 100 |
| Rename | POST `/api/chat/update-conversation` | `{ id, title }` | updated conversation |
| Delete | DELETE `/api/chat/delete-conversation/:id` | path id | `{ success, message }` |
| Get messages | GET `/api/chat/get-messages/:conversationId` | path id | ordered message array |
| Agent request | POST `/api/agent/chat` | JSON or multipart: `prompt`, `conversationId`, `agent`, optional `file` | `{ answer, images, artifacts }` |
| Create checkout | POST `/api/billing/create-order` | `{ plan }` | checkout/session data (confirm exact fields in billing controller) |
| Verify payment | GET `/api/billing/verify-payment?session_id=...` | query | `{ paid, ... }` as consumed by frontend |

## Important mismatches / risks to preserve in handoff
1. Current auth helper calls GET `/api/me` without a query, while the auth service's `me` controller expects `userId`; gateway also has its own protected `/api/me` handler. Resolve only with backend owner; UI should represent session restoration as a pending state, not assume it works.
2. New account creation in auth controller initializes 100 credits, while landing and several UI defaults display 50. Billing config Free plan also says 100. Use actual authenticated `userData.credits` and avoid hardcoded welcome-credit claims until product policy is reconciled.
3. `ChatInput` calls `updateConversation(conversation._id, newTitle)` although helper accepts one payload object and backend expects `{id,title}`. Handoff must flag this integration defect; don't alter API in design phase.
4. Chat input exposes `Vision` with label “Vision Analysis”, but explicit `vision` maps to image generation. Image analysis is attachment auto-routing (`imageAnalyzer`). UI labels must separate image generation from image analysis semantics.
5. `selectedAgent` is component-local and defaults to Auto; no persisted selected mode.
6. Redux store is in-memory; don't promise conversation/message state persistence beyond backend retrieval.
7. `/stream` is not true token streaming from model execution and does not report per-agent stages.
8. Artifact panel uses only `artifacts[0]`; editor is read-only; HTML preview is only supported for recognized HTML/CSS/JS files.
9. Billing UI hardcodes amounts/credits; use backend plan config as the source of truth during implementation or reconcile UI values.
10. Landing page includes an imported/defined `CryptoTracker` segment and makes claims (live streaming, verified artifact, credit rates) that need reconciliation with actual behavior before copy is shipped.
11. Settings UI contains local presentation controls; no preference persistence endpoint is exposed.
12. The current source has no router, projects model, workflow-run history API, knowledge-source manager, analytics API, or payment history endpoint.

## Product capability classification
| Capability | Classification | Design treatment |
|---|---|---|
| Landing page | Existing UI | Rebuild completely |
| Google login | Existing backend + UI | Dedicated route-style screen, same Firebase flow |
| Email/password signup | Not present | Do not design as active functionality |
| Onboarding | Frontend-only proposal | Optional short local walkthrough; no backend writes |
| Conversation CRUD | Existing | Redesign, preserve contracts |
| Agent selection | Existing frontend/backend | Improve labels and explanation |
| Auto routing | Existing backend | Explain that routing is automatic; selected agent optional |
| Team orchestration | Existing graph | Display final known workflow stages, not fabricated live status |
| Code artifact view | Existing | Read-only code inspection + copy/download/HTML preview |
| PDF/PPT preview | Backend generation may exist; frontend viewer absent | Design as download/open artifact only until formats/URLs are confirmed |
| Billing/checkout | Existing | Redesign around actual plans and Stripe checkout |
| Theme preference | Frontend-only enhancement | Local persistence optional; no server sync claim |
| Agent library | Frontend-only discovery page | Catalog existing agents; no new API required if static metadata |
| Workflow Observatory | New backend required for historical runs | Phase-2 concept; no fake history |
| Projects | New backend required | Defer |
| Usage analytics | New backend required | Defer; show balance only |
| Knowledge Center | New backend required for source management | Defer; current PDF RAG upload is not a source library |
| Activity history | New backend required | Defer |
