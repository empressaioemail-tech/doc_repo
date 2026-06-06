---
date: 2026-05-28
agent: planner
repo: doc_repo
type: finding
topic: brokerage_v1_memory_rollup
related: [75_hauska_brokerage_workflow_plan, 75a_hauska_brief_extension, 77_place_graph_strategy, _sessions/2026-05-26_brokerage_extension_api_dispatch_claude_code, _inbox/2026-05-26_legacy-design-tools_cc-agent-C_brokerage_brief_api]
---

# Brokerage v1 memory rollup (last 3-5 days)

## 1) Claims

- **C1. Thin client and thick server pattern was chosen for brokerage brief generation.**  
  Source chat date: **2026-05-26** (`_sessions/2026-05-26_brokerage_extension_api_dispatch_claude_code.md`).  
  Evidence: Session "Decisions" states extension remains MCP-capable for dev, while production intelligence moves to `/api/brokerage/v1/*` on `cortex-api` with Grok.

- **C2. Brokerage backend API scope was delivered with three v1 endpoints and persistence.**  
  Source chat date: **2026-05-26** (`_inbox/2026-05-26_legacy-design-tools_cc-agent-C_brokerage_brief_api.md`).  
  Evidence: Close report lists implemented routes `POST /brief`, `POST /brief/summarize`, `POST /research/chat`, plus migration `0026_brokerage_brief_runs.sql`.

- **C3. Property Brief extension canonical doc records backend merge status and deployment gap.**  
  Source chat date: **2026-05-28** (`75a_hauska_brief_extension.md`).  
  Evidence: Product surface table marks brokerage API as "Merged PR #128" and gates list says deploy + migration + extension endpoint wiring are still pending operator actions.

- **C4. Sharing and viral graph instrumentation is captured as consent-gated API behavior, not yet a proven live metric loop.**  
  Source chat date: **2026-05-28** (`75a_hauska_brief_extension.md`).  
  Evidence: API contracts include `POST /api/brokerage/v1/gtm/consent`, `POST /api/brokerage/v1/gtm/events`, and note share/graph events require `graphOptIn: true`; operator addendum requests admin graph view.

- **C5. Atomization start for brokerage was captured as a post-v1 requirement at workspace package level.**  
  Source chat date: **2026-05-28** (`75a_hauska_brief_extension.md`).  
  Evidence: Operator addendum specifies "Atomization start" and proposes package shapes `property-workspace`, `brief-run`, `workspace-attachment`, `workspace-share-edge`.

- **C6. Paywall and metering behavior was explicitly captured in product requirements, but remains requirement-level (not confirmed shipped).**  
  Source chat date: **2026-05-28** (`75a_hauska_brief_extension.md`).  
  Evidence: Addendum states quota behavior ("block new research generation only"), wallet-style top-up in `$5` increments, and owner/collaborator read access intent during billing lockout.

- **C7. Brokerage lane is now framed as a GTM view on a broader place graph with metered reasoning walks.**  
  Source chat date: **2026-05-27** (`77_place_graph_strategy.md`).  
  Evidence: Purpose and positioning sections define agent queries as metered reasoning over place-node layers; brokerage is listed as one segment/taste/landing-pad lane.

## 2) Decisions proposed or made

- **Made (2026-05-26):** Thin client / thick server for brokerage brief generation (extension does orchestration, `cortex-api` does Grok reasoning and persistence).
- **Made (2026-05-26):** Research chat is in Phase 0 backend scope, not deferred.
- **Proposed/captured (2026-05-28):** Post-v1 sequence: property workspace history, attachments, sharing, atomization start, paywall/metering UX, admin share graph view.
- **Made at strategy level (2026-05-27):** Brokerage wedge is a GTM lane on top of place graph strategy, not the substrate strategy itself.

## 3) Open questions / unresolved conflicts

- Is `@hauska/atom-contract` brokerage-related shape for `property-workspace` and `workspace-share-edge` scheduled in a named dispatch, or still requirement text only?
- Is wallet-style top-up (`$5` increments) a UX-only requirement, or tied to a concrete billing rail and ledger design in backend scope?
- Are consent/event endpoints already deployed and emitting auditable metrics, or defined in docs only?  
  **Assumption:** docs reflect intended API contract, not necessarily production telemetry availability.
- How does brokerage metering map to canonical tier docs (`08_tiered_access_model.md`, `29_mcp_surface_tier_model.md`) without creating a conflicting paywall policy?
- Should "admin graph view" be canonicalized under brokerage docs or under a broader growth/analytics doc (to avoid product-silo duplication)?

## 4) Suggested canonical doc patches (exact file paths + sections)

- `p:/doc_repo/75a_hauska_brief_extension.md`  
  **Section:** `## Gates` and `## Operator capture addendum (2026-05-28)`  
  Patch: split each requirement into `status: shipped|in-progress|queued` with explicit owner and target sprint.

- `p:/doc_repo/75_hauska_brokerage_workflow_plan.md`  
  **Section:** `## Product definition` and `## Unified pilot — "Hauska for [Brokerage]"`  
  Patch: add a v1.0 vs v1.1 table that isolates shipped backend (`/api/brokerage/v1/*`) from queued workspace-sharing/paywall graph features.

- `p:/doc_repo/14_pricing_framework.md`  
  **Section:** substrate/payment implementation status subsection  
  Patch: add brokerage-specific note for microfunding/top-up behavior and "read access retained, new compute blocked" gating policy.

- `p:/doc_repo/29_mcp_surface_tier_model.md`  
  **Section:** product tier enforcement semantics  
  Patch: clarify brokerage paywall behavior relative to Layer 2 metering so endpoint-level quota policy is canonical.

- `p:/doc_repo/77_place_graph_strategy.md`  
  **Section:** `## Segment -> taste -> landing pad` and `## Graph maturity milestones`  
  Patch: add explicit dependency row linking brokerage sharing graph metrics to place graph maturity (if this remains strategic, not just product telemetry).

## 5) Confidence per claim

- **C1:** High
- **C2:** High
- **C3:** High
- **C4:** Medium
- **C5:** Medium
- **C6:** Medium
- **C7:** High

