# Agent library

**Classification:** frontend-only catalog page over existing supported agent modes. It is not an agent marketplace and has no install/custom-agent backend.

**Information architecture:** compact page heading; category tabs (General, Research, Engineering, Documents, Visuals); vertical rows rather than repetitive cards. Each row shows name, purpose, best-fit example, expected output and documented credit rate where known.

**Catalog:** Auto Router (dynamic selection; cost depends on selected route), Team (orchestrator; 15 credits in auth cost map), Coding (10), Search (5), PDF generation (10), Presentation (10), Image generation (10), PDF RAG (10, attachment auto-route), Image Analyzer (5, image attachment auto-route), Chat (1). Explicit UI modes are currently Auto, Team, Coding, Search, PDF, PPT, Vision. Note explicit `vision` maps to image generation; do not call it image analysis.

**Interaction:** “Use this mode” sets composer mode and returns to workspace. PDF RAG/Image Analyzer are explanatory auto-routing entries unless explicit route behavior is confirmed. Show credit rates as backend auth-controller constants, with note that actual charge is server-side.
