# Additional pages — product prioritization

| Proposal | Decision | Why | Backend work |
|---|---|---|---|
| Agent Library | Build in first redesign | Static catalog improves discoverability of existing agent modes | None if catalog is frontend metadata |
| Workflow Observatory | Defer | Current API returns final answer only; no run history or node events | Run model, IDs, stage events, persistence, query APIs |
| Projects Workspace | Defer | No project entity or relationship in models/routes | Project CRUD, conversation/artifact associations |
| Usage Analytics | Defer | No usage event aggregation or analytics endpoint | Usage ledger/events and aggregate APIs |
| Knowledge Center | Defer | PDF RAG upload exists but no source library CRUD/index lifecycle UI | Source model, upload/list/delete/reindex APIs |
| Documentation/Help | Add lightweight public docs only if content exists | Useful onboarding; no docs system found | Static docs only |
| Activity History | Defer | No activity event model/API | Event model and query endpoints |

The first release should ship the Agent Library, billing page and settings route. Do not ship empty shells for deferred concepts.
