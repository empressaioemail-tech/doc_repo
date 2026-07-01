---
date: 2026-07-01
agent: planner
repo: design-accelerator
session_type: execute
rolled_up: false
rolled_up_into: [48_cortex_reporting_function_dashboard_spec]
---

## What was done

Built the cortex-reporting configurable tile workspace (codex-reviewer-qa) from scratch, dispatching cc-agent-C across three successive PRs. The shell is now live in local dev with real data flowing.

PRs merged (legacy-design-tools):

- PR #203 / #206 — initial tile shell: TileDef registry, CortexShell with EngagementProvider/SpatialProvider/CodeProvider, GridCanvas CSS-grid layout, SpaceBar preset pills, ResizeHandle with window-level event listeners, TileWrapper with CSS variable fallbacks. Fixed two rendering bugs: LAYOUTS "/" separator stripped before applying as gridTemplateAreas; --surface-1/--border-subtle defined in index.css.
- PR #207 — reviewer BFF ownership fix: replaced `loadEngagementForSession()` with `loadReviewerBffEngagement()` (direct DB query, no owner filter) on GET /engagements/:id and POST reports/run. Added devSession bootstrap to codex-reviewer-qa. Deployed to cortex-api-00254-tad at 100% traffic.

Result: queue shows 31 real production rows; clicking a row loads engagement context into the Compliance Run tile, which shows real submissions and findings with IRC 2021 code citations and Accept/Edit/Reject controls. SpaceBar switches between Plan Review, Site Analysis, Property Intel, and Design Accelerator preset spaces.

Wrote spec doc at 48_cortex_reporting_function_dashboard_spec.md (supersedes 48_cortex_reporting_plan_review_spec) and dispatch at _dispatches/2026-07-01_cortex_reporting_tile_workspace_build.md.

Created self-contained project reference at _projects/cortex_workspace_qa/ (5 files).

## What was learned (changes to ground truth)

The plan-review BFF ownership mismatch is architectural, not a bug: the BFF inherits customer-facing session middleware from the shared api-server, which applies engagementOwnerWhere() scoping designed for customer contexts. The reviewer tool (like the hauska-map command center) must bypass this entirely. Fix is per-route: loadReviewerBffEngagement() skips the owner filter. The same reviewer posture applies to the Compliance Run and Letter tiles if they call L3 /api/engagements/* routes via api-client-react — that is the next dispatch.

devSession bootstrap in the frontend (audience: "internal" cookie) is what makes the engagement read work against the Cloud Run proxy in local dev without a .env.local. This is the same pattern plan-review used; it was missing from codex-reviewer-qa until PR #207.

LAYOUTS map uses grid-template shorthand syntax ("a b" / "c d") which is valid for the grid-template CSS property but not gridTemplateAreas. GridCanvas must strip the "/" separator before applying as gridTemplateAreas — done in PR #206.

portal-ui imports must use the /theme subpath in browser code, not the barrel. The barrel pulls engine-core/db/postgres into the client bundle via EngineHonestyChrome, crashing with "Buffer is not defined".

## Open items / next steps

In flight: cc-agent-C is running fixes for map tile URL (VITE_HAUSKA_MAP_URL not set), confidence NaN% display, and Save-space localStorage wiring. PR pending.

After that lands: Letter tile needs BFF route + tile implementation. Separate dispatch.

Hauska-map command center is 1 commit ahead of origin/main — push owed.

Full QA run (cortex workspace + hauska-map side by side) is the next session target after cc-agent-C's current PR merges and deploys.

## Skills triggered

None this session. No premortem required (no new ADR or architectural commitment). No new decisions requiring decision-log entries.
