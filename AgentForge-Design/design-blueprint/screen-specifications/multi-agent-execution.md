# Collaborative multi-agent workflow

**Truthful design:** backend graph structure is known, but `/api/agent/chat` returns only final `answer`, `images`, `artifacts`. There is no event payload for each node. Thus the interface must not show per-agent live running/completed badges during the request.

**During request:** show “Team workflow requested” with an indeterminate progress indicator and a short description: “The task is being planned and processed. The detailed run becomes available when the response returns.” Do not animate a fake progress bar.

**After completion:** render a “Workflow structure” summary: Planner → Researcher (conditional) → Collaborative Coder → Reviewer → (revision loop if requested). Mark stages as “workflow path” not completed unless response includes stage data. If there is no actual trace in payload, never assert that Researcher ran or that Reviewer approved. Show final output and artifacts.

**Future enhancement (backend required):** durable run ID, stage events, per-node status, timestamps, logs, retry metadata, token/cost telemetry. Only after that can Workflow Observatory be live.
