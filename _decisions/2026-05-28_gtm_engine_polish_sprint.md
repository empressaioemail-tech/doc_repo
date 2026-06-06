---
id: 2026-05-28_gtm_engine_polish_sprint
title: Decision — GTM engine polish sprint (full scope)
date: 2026-05-28
status: active
related: [76b_gtm_engine_polish_sprint, 16_commercialization_roadmap, 76a_operator_autonomous_loops, 50_hauska_mcp_server, 77_place_graph_strategy, _decisions/2026-05-21_hauska_commercialization_sprint]
owner: nick
---

# Decision — GTM engine polish sprint

## Status

**Active, 2026-05-28.** Operator authorized full-scope GTM engine polish (not a partial discoverability slice). Executes via [`76b_gtm_engine_polish_sprint.md`](../76b_gtm_engine_polish_sprint.md) and three lane dispatches.

## Context

Portfolio runs two GTM funnels: human Property Brief wedge (extension) and agent-builder Hauska MCP substrate. Observation (`gtm_events`) today covers extension/API only. Agent discoverability work (registries, machine-readable site files, coverage honesty) was discussed but not filed as an executable sprint. Commercialization step 5 (GTM motion) and decision C (channel plan) remain open in [`16_commercialization_roadmap.md`](../16_commercialization_roadmap.md).

## Decision

Run **GTM engine polish sprint** — four parallel tracks:

1. **Discoverability** (cc-agent-M): `hauska.dev/mcp`, `llms.txt`, registry packages, tool audit, example agent, place + workspace read MCP tools.
2. **Product API + observation** (cc-agent-C): place resolve/dossier HTTP routes, MCP `gtm_events`, error taxonomy, coverage page host, extension MCP upsell event.
3. **Governance** (planner): public capability matrix, launch channel plan scaffold, steward digest + scoreboard updates.
4. **Operator** (Nick): DNS, directory submissions, decision C session.

**Ratified parameters (operator 2026-05-28):**

- Sprint name: GTM engine polish.
- Scope: **full** per [`76b_gtm_engine_polish_sprint.md`](../76b_gtm_engine_polish_sprint.md) exit criteria E1–E12.
- Canonical docs URL: `https://hauska.dev/mcp`.
- Public claim until G3 verified: Texas building code MCP + property workspace read API.
- Decision C: one-page launch channel plan in same week as docs flip (`gtm_launch_channel_plan_v1.yaml`).

**Explicit non-decisions:**

- No second MCP server for Regrid or federal APIs.
- No Tier 1+ automated outbound (email/PH publish) in this sprint.
- No paid signup / Circle wire-up (Wave 2 commercialization).

## Alternatives considered

| Alternative | Why not |
|-------------|---------|
| Docs-only slice without MCP tools | Leaves “full stack reachable” story unproven for agents |
| Separate Regrid MCP | Fragments discovery; violates v1 one-server architecture |
| Merge into Brokerage V1 only | Agent substrate GTM is Hauska-spine; different buyer and metrics |
| Wait for `place_dossier` G3 before any GTM | Delays registry listings and first external caller signal |

## Premortem (structural commitments)

| Commitment | Result |
|------------|--------|
| Sell reasoning, not data | Green if dossier/MCP return citations + confidence, not raw Regrid |
| Partnership-first | Green — operational city data stays Path A; Regrid is national baseline per scoping clarifier |
| Cost per jurisdiction | Green — observation only; no new ingest batch |
| MCP-first / dual interface | Green — read MCP tools + extension upsell link |

**Yellow resolved:** Public marketing must use capability matrix, not engineering optimism.

## Reversal criteria

Revert or narrow sprint if:

1. Dispatch A dossier path cannot achieve 0 Regrid on repeat by sprint mid-point — drop `get_place_dossier` from E9, keep catalog MCP GTM only.
2. `hauska.dev` DNS cannot point at docs host within 14 days — fall back to `mcp.hauska.dev/docs` as canonical until redirect works.
3. Lane A weekly moat outcomes miss two consecutive weeks — pause Lane B (this sprint) per [`79_competitive_execution_system.md`](../79_competitive_execution_system.md).

## Owner

Nick — operator gates N1–N5; merge/deploy authority unchanged except cc-agent autonomy per commercialization sprint for repo-scoped deploys.
