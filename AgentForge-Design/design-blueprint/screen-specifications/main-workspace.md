# Main workspace

**Purpose:** primary task creation, conversation and output surface.

**Desktop:** 56 px primary rail + 248 px conversation sidebar + flexible conversation canvas + optional 420 px artifact inspector. 56 px top header. Main response width 860 px. Composer pinned bottom within canvas, max 860 px.

**Header:** current conversation title or “New task”; mode context; Cmd/Ctrl+K; credit balance. Avoid fake project switcher because Projects do not exist.

**Sidebar:** New task, search (client-side filtering of loaded max 100 conversations), recents, row menu rename/delete, account footer. Do not show folder/project grouping.

**Canvas:** empty state with starter prompts; conversation messages; pending state; response errors. Keep message body readable at 14–15 px with code blocks as distinct surfaces.

**Inspector:** only present when artifact exists or user opens it; read-only source, preview when index.html exists, copy/download. At no artifacts, don't render an empty permanent third column.

**Mobile:** drawer navigation, single canvas, artifact full-screen sheet. Composer anchored with safe-area padding.

**State/API:** conversation list GET, messages GET, create POST, rename POST `{id,title}`, delete DELETE path; agent POST JSON/multipart. Preserve current Redux slices or migrate deliberately without changing backend.
