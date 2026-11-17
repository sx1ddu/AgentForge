# Component library

## Shell
- `AppShell`: owns navigation, content slot and responsive state.
- `PrimaryRail`: 56 px, brand, Workspace, Agents, Billing; bottom Settings/Profile.
- `ConversationSidebar`: New task, search input, recents grouped by Today / Previous 7 days / Older (groups only when dates exist); row actions rename/delete.
- `WorkspaceHeader`: breadcrumb/title, current mode context, command palette trigger, credit balance.
- `OutputInspector`: conditional panel; tabs only for real available views.

## Task and conversation
- `TaskComposer`: prompt textarea, attach-one-file control, mode dropdown, voice input affordance only when browser supports it, send.
- `ModePicker`: Auto, Team, Coding, Search, PDF, PPT, Image generation. PDF/image upload auto-routing should be explained in helper text, not shown as selectable modes unless backend accepts explicit IDs.
- `MessageGroup`: role, timestamp if returned, content, actions.
- `AssistantMarkdown`: GFM, syntax-highlighted code, copy code action.
- `AttachmentPreview`: file name/type/size, remove before send; image preview if supported.
- `PendingResponse`: neutral progress indicator and “Working on your request”; no fabricated stage timeline.
- `ResponseError`: concise failure message and retry action only if retry can safely re-submit.

## Agent and workflow
- `AgentCatalogRow`: agent name, role, best-for, input/output, rate label.
- `WorkflowSummary`: stage spine rendered after a known workflow result; label as “Workflow structure” or “Completed run” according to evidence.
- `AgentStage`: name, description and state only if state supplied. No inferred running/complete status.
- `RunResult`: final answer and artifacts.

## Artifacts
- `ArtifactInspector`: title, file count, Code / Preview (only if HTML preview supported), Copy, Download.
- `FileTabs`: selected file and filename.
- `ReadOnlyCodeViewer`: Monaco `readOnly: true`; use label “View source”.
- `HtmlPreview`: sandboxed preview for HTML/CSS/JS composition currently implemented.
- `DownloadArtifact`: file download; for formats not previewable, offer download/open only when a real URL or file payload exists.

## Commerce and settings
- `CreditBalance`: exact value from `userData.credits`; no fallback “50” when unauthenticated.
- `PlanComparison`: plan details sourced from billing config; clearly show USD and 30-day validity.
- `CheckoutState`: redirecting / returned / verified / failed; use actual verification response.
- `SettingsDialog`: profile, appearance (local only), shortcuts, logout. Avoid nonfunctional account/security controls.

## Shared states
Every interactive component defines default, hover, focus-visible, pressed, disabled, loading, success and error behavior as applicable. Use semantic HTML and keyboard access. Avoid hover-only disclosure for critical actions.
