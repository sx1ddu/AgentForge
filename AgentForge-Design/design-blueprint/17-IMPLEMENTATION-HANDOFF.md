# Implementation handoff

## Non-negotiable integration constraints
- Keep all existing backend APIs and payloads unchanged in the UI redesign.
- Login remains Firebase Google popup → ID token → POST `/api/auth/login`.
- Conversation IDs are required for agent requests.
- Chat request supports JSON or multipart with `prompt`, `conversationId`, `agent`, optional `file`.
- Response shape: `{ answer, images, artifacts }`.
- Preserve conversation CRUD contracts and Stripe checkout/verification.
- Do not introduce claims of real-time per-agent events, saved projects, analytics, payment history, custom agents, editable code or PDF/PPT inline preview without backend/product work.

## Existing file mapping
| Existing file | Action | Responsibility |
|---|---|---|
| `App.jsx` | Refactor | route-aware shell and session bootstrap; resolve `/api/me` contract mismatch with backend owner |
| `pages/Home.jsx` | Replace composition | public/workspace route entry, overlays and checkout return |
| `components/LandingPage.jsx` | Replace | public marketing page and illustrative workflow |
| `components/Sidebar.jsx` | Replace | primary navigation + conversation list |
| `components/Nav.jsx` | Replace | workspace header / context controls |
| `components/ChatArea.jsx` | Replace | task canvas and message region |
| `components/ChatInput.jsx` | Replace | composer, mode picker, upload, voice |
| `components/MessageList.jsx` | Redesign | empty state, messages, pending state |
| `components/MessageBubble.jsx` | Redesign | markdown, code, images and actions |
| `components/LoadingAnimation.jsx` | Replace | honest indeterminate pending state |
| `components/Artifact.jsx` | Redesign | read-only artifact inspector and HTML preview |
| `components/BillingDrawer.jsx` | Replace with route/page | plans and checkout states |
| `components/ui/CommandPalette.jsx` | Redesign | keyboard command launcher; only real actions |
| `components/ui/SettingsModal.jsx` | Replace with route/page | profile, local appearance, shortcuts, logout |
| `features/*` | Preserve contracts; fix call-site mismatches separately | API calls |
| `redux/*` | Preserve state shape or migration plan | user/conversation/message state |
| `utils/axios.js`, `utils/firebase.js` | Preserve | credentials and Firebase |
| `index.css` | Replace tokens/base styles | theme and design system |

## New frontend components
`AppShell`, `PrimaryRail`, `ConversationSidebar`, `WorkspaceHeader`, `AgentLibraryPage`, `TaskComposer`, `ModePicker`, `AttachmentChip`, `WorkflowSummary`, `AgentStage`, `OutputInspector`, `ReadOnlyCodeViewer`, `PlanComparison`, `OnboardingTour`, `ToastProvider`, `ConfirmDialog`.

## Known integration defects to resolve outside visual-only scope
1. `getCurrentUser` GET `/api/me` helper does not pass userId; gateway protected `/api/me` controller and auth service `/me` have different semantics. Verify intended route before implementing session restore.
2. Rename call in `ChatInput` passes two args, helper expects payload object `{id,title}`.
3. Current frontend defaults to 50 credits while auth controller and Free plan config initialize 100.
4. “Vision Analysis” label is misleading: explicit `vision` invokes image generation; image analysis is attachment auto-route.
5. `/stream` is post-execution chunking, not live model streaming.
6. Agent request timeout 180 s frontend vs gateway timeout 300 s; pending UI must support long-running work.

## Implementation sequence
1. Create token layer and typography; verify dark/light contrast.
2. Add route structure without changing API services.
3. Build shell and responsive navigation.
4. Rebuild landing and Google auth screens.
5. Rebuild conversation canvas/composer/messages.
6. Add truthful pending + workflow summary.
7. Rebuild artifact inspector.
8. Add static Agent Library.
9. Rebuild billing and settings.
10. Add local onboarding and command palette.
11. Run build, lint, keyboard, mobile, empty/error/loading and checkout-return tests.

## Acceptance criteria
- All existing flows remain reachable and API-compatible.
- No fake buttons or unimplemented route destinations.
- No false live execution claims.
- Code viewer remains read-only; preview only when HTML input exists.
- Credit numbers and plans match backend source.
- Every loading, empty, error, success and disabled state is designed.
- All screens usable at 375, 768, 1024, 1280 and 1440 px.
- Keyboard-only completion of login, new task, send, conversation select, artifact copy/download, billing navigation and settings.
- No backend source changes in UI implementation PR unless separately authorized.
