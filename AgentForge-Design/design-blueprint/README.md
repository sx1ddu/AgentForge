# AgentForge Design Blueprint

This directory is a separate design deliverable. Production frontend and backend source files were not modified.

## Start here
1. `00-VISION-AND-DESIGN-DIRECTION.md`
2. `01-EXISTING-PRODUCT-AND-FEATURE-AUDIT.md`
3. `03-DESIGN-SYSTEM.md`
4. `02-INFORMATION-ARCHITECTURE.md`
5. `visual-references/index.html`
6. `17-IMPLEMENTATION-HANDOFF.md`

## Important truthfulness constraints
- No true per-agent live progress in the current agent chat response.
- Monaco code view is read-only.
- HTML preview only when the returned artifact has `index.html`.
- Google sign-in is the only implemented auth entry.
- Projects, analytics, activity history, knowledge-source management and payment history are not implemented in the current API surface.
- Credit/plan mismatch and conversation rename call mismatch are called out in the audit.

## Prototype
Open `visual-references/index.html` in a browser. It is a self-contained concept prototype, not production code.
