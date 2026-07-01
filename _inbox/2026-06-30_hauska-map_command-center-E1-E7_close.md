---
id: 2026-06-30_hauska-map_command-center-E1-E7_close
title: Command Center E1–E7 close — operator spine console
date: 2026-06-30
type: agent-close
agent: map-agent
repo: hauska-map
commit: 9552799
reports_to: doc_repo planner
related: [endstate_E_spine_console, calibrated_spine_roadmap_overview]
---

# Command Center E1–E7 — close report

All six surfaces shipped. E4 (calibration tracker) correctly left unwired per M1 gate. Branch is 1 commit ahead of origin/main.

## What shipped

| Wave | Surfaces | Notes |
|---|---|---|
| 1 | E6 | Already present — floating map FSM + three-pane rails; view state preserved across panel tabs |
| 2 | E1, E2, E3 | MCP inspector (product gates, schema, live call probe); atom browser (family/jurisdiction/accessPolicy filters + rail facets); layer registry with disable toggle → legend sync (25 layers) |
| 3 | E5, E7 | Run monitor (30s poll, honest empty states); parcel trace (family grouping, breadcrumb, xref follow, 100-hop BFS + visited-set cycle guard) |

## Live smoke at close

Dev server: http://localhost:5174/ (npm run dev; 5173 was busy)

| Surface | UI | Live data |
|---|---|---|
| E6 | PASS | Map loads (fixture mode) |
| E1 | PASS | MCP down → introspection unreachable; catalog expects 62 tools (6/5/6/45 by gate) |
| E2 | PASS | 0 atoms without MCP + key |
| E3 | PASS | 25 registry layers ↔ legend synced |
| E5 | PASS | No warming endpoint → all metrics no data (not fabricated zeros) |
| E7 | PASS | Parcel click works; trace needs retrieval-api + atoms |

## Reviewer checklist — all clear

- Map view state not reset on panel switch
- E1 call panel posts only to MCP admin /call (no SSRF)
- E2 never renders bare confidence scalars
- E3 legend from live LAYER_REGISTRY, not static list
- E7 visited Set prevents xref cycles

## To unlock live data

- Start hauska-mcp-server on 127.0.0.1:3000
- Set Hauska key in the top bar
- Optional: `?fixture=0&retrieval=http://127.0.0.1:8080` for live GIS + atom trace
- E5 needs a deployed warming run-state API (none found on cortex-api or MCP admin at close)

## Open items for follow-on

- Push branch to origin/main
- E5 warming run-state API does not exist yet; E5 will show honest empty until it is built
- E4 wired when M1 returns go
- Tool gate split (6/5/6/45) should be verified against the MCP server — the 45-tool map gate is unexpectedly high against the June 6 recon baseline of 11 public / 4 Codex / 31 reporting
