# Landing page

**Purpose:** explain why multi-agent workflows matter and convert qualified visitors to Google sign-in.

**Layout:** warm near-black editorial canvas, 72 px navigation, 1200 px content width. Hero split 48/52: left headline and CTAs; right real product-shaped execution illustration with four numbered work-rail stages and final output pane. Use static/interactive prototype data explicitly labelled “Illustrative workflow”. No claims of live streaming or verified code.

**Copy direction:** “Give complex work a team.” Supporting line: “Research, code and create with specialist AI agents in one inspectable workspace.” Primary CTA “Start with Google”; secondary “Explore the workflow”.

**Sections:** nav; hero; interactive workflow strip; capability index (Research / Build / Documents / Visuals); agent roles; how a task moves; product workspace preview; pricing (values reconciled with backend: Free 100 credits, Starter $9.99 / 500, Pro $19.99 / 1,500, each 30 days); FAQ; CTA; footer.

**Interactions:** workflow steps update the highlighted explanatory stage, not fake runtime. CTA invokes existing Google auth. Pricing CTA opens auth for logged-out users.

**Responsive:** mobile hero stacks copy then cropped workflow preview; nav CTA remains visible; workflow becomes vertical numbered list.

**Existing dependencies:** `LandingPage.jsx`, `Home.jsx`, Firebase popup flow. Preserve `onOpenLogin` contract until routing is introduced.
