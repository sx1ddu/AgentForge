# Information architecture

## Navigation model
The product has two contexts: **Public** and **Workspace**. In the current implementation they are conditionally rendered in one root page; the proposed route names below are frontend route architecture, not existing routes.

### Public
- `/` — product landing page.
- `/login` — Google sign-in entry (existing auth capability).
- `/signup` — intentionally not a separate email signup; redirect to `/login` or present “Create account with Google” using the existing Firebase flow.

### Authenticated workspace (proposed client routes)
- `/app` — new task / workspace home.
- `/app/c/:conversationId` — conversation.
- `/app/agents` — agent library (static catalog of supported modes).
- `/app/billing` — credit balance and plans.
- `/app/settings` — profile, appearance and shortcuts.
- `/app/artifact/:artifactId` — do not implement until artifact identity/routing is defined; current artifact payload is message-scoped and first-artifact based.

## Primary desktop shell
1. Left rail (56 px): brand mark, primary destinations, bottom account/settings.
2. Context sidebar (248 px): workspace label, new task, conversation search/list, recent history. Collapsible to icon rail.
3. Main canvas: top command bar (56 px), conversation/task body, composer anchored at bottom.
4. Optional right output inspector (400–440 px): appears only when artifacts exist or user opens it; can collapse.

## Mobile shell
- Top bar with menu + context title.
- Main canvas is single column.
- Navigation becomes a full-height drawer.
- Artifact inspector becomes a full-screen sheet with Code/Preview tabs.
- Composer remains pinned above safe-area inset.

## Primary user journey
Landing → Google sign-in → workspace → describe task → optionally choose mode / attach one file → send → pending state → final response → inspect artifact / copy / download → continue conversation.

## Secondary journeys
- Conversation management: create, select, rename, delete.
- Agent discovery: browse catalog → select a mode in composer.
- Billing: inspect current balance → compare plan → Stripe checkout → return and verify.
- Settings: profile and local appearance / shortcuts.

## Information hierarchy
The current task and response are primary. Agent mode and attachment are composer context. Credit balance is visible but secondary. Conversation history is persistent navigation. Artifact is a first-class output, not a decorative panel.
