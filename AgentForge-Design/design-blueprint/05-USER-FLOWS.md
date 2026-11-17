# User flows

## First session
1. Visitor lands on `/` and sees product explanation plus an interactive but clearly illustrative workflow example.
2. CTA opens `/login` (or modal if routing is not introduced).
3. Google popup starts; show “Connecting to Google…” and preserve popup failure/cancel messaging.
4. Successful `/api/auth/login` sets session cookie and returns user object.
5. Show workspace with current server-returned credits; optional 3-step local onboarding: choose task type, explain Auto vs Team, show composer.
6. User submits first task.

## New task
1. Click New task / Cmd+N.
2. Start with no selected conversation; show concise example prompts.
3. User writes prompt, optionally attaches one file and chooses mode.
4. On send, create conversation if needed; preserve the current API payload and conversation ID requirement.
5. Show pending state while request runs; don't invent agent stages.
6. Render final answer and any returned images/artifacts.

## Continue conversation
1. Select a conversation from sidebar.
2. Fetch `/api/chat/get-messages/:conversationId`.
3. Render ordered messages; show loading skeleton, empty state or retrieval error.
4. Composer retains local mode unless product explicitly chooses reset behavior; document selected mode state.

## Artifact inspection
1. When `artifacts` exists, open output inspector and select first artifact (current Redux contract is an array, UI currently reads first item).
2. Select a file tab.
3. Copy or download selected file.
4. If `index.html` exists, allow Preview; otherwise no preview tab.
5. Show read-only source label.

## Billing
1. Open Billing from nav / credit balance.
2. Show current plan and credits from user profile.
3. Compare Free / Starter / Pro using verified plan values.
4. Select paid plan → POST create-order → follow returned Stripe checkout URL/session.
5. On return, verify session; show success only when `paid === true`, otherwise neutral pending/error.

## Conversation deletion
1. User selects Delete from row menu.
2. Confirmation dialog names conversation and warns messages will also be deleted.
3. DELETE endpoint; on success remove row and select first remaining conversation or empty state.
4. On failure retain row and show error.

## Keyboard
- Cmd/Ctrl+K: command palette.
- Cmd/Ctrl+N: new task.
- Escape: close topmost overlay.
- Enter: send; Shift+Enter newline.
- Tab/Shift+Tab: predictable focus order.
