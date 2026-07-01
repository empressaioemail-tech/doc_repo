---
id: cortex_workspace_qa/00_status
title: Cortex workspace + hauska-map QA — project status
status: active
last_updated: 2026-07-01
applies_to: design-accelerator
---

# Cortex workspace + hauska-map QA — project status

Self-contained reference for the QA sprint bringing the cortex-reporting tile workspace and hauska-map command center up and running side by side. Everything a fresh agent needs is in this folder.

## Project goal

Two internal tools running together in local dev for QA:

1. **Cortex workspace** (`localhost:19592/codex-reviewer-qa/`) — configurable tile workspace for all cortex-reporting functions (compliance run, hydrology, topography, property brief, map, letter, etc.). Plan Review is the primary preset for current QA.
2. **Hauska-map command center** (`localhost:<map-port>/command-center`) — the spatial layer; the Map tile in the cortex workspace embeds this as an iframe.

## What is working (as of 2026-07-01)

- Shell renders: SpaceBar, preset spaces (Plan Review, Site Analysis, Property Intel, Design Accelerator), tile grid, resize handles
- Queue tile: 31 real production engagements listed
- Engagement select: clicking a queue row loads engagement context into all connected tiles
- Compliance Run tile: real submission dropdown, findings with IRC 2021 code citations, Accept/Edit/Reject, Run review button
- Preset switching with undo banner
- Tile open/close, fullscreen toggle

## What is NOT working / in-flight

| Item | State | Notes |
|------|-------|-------|
| Map tile iframe | Broken image | VITE_HAUSKA_MAP_URL env var not set; cc-agent-C fixing now |
| Confidence display | NaN% | Raw value is null/undefined from API; cc-agent-C fixing now |
| Save this space button | Dead button | localStorage not wired; cc-agent-C fixing now |
| Letter tile | Stub only | "shell registered; full tile UI pending" — next dispatch |
| Hydrology tile | Degraded | pysheds not installed in Cloud Run worker — expected |
| Precedence Engine tile | Degraded | Production gate not activated — expected |
| Resize drag | Glitchy | Handle positioned at 50% but does not track actual cell boundary |
| L3 route scoping | Not started | Compliance Run / Letter via api-client-react still hit owner-scoped routes |

## In-flight PR (cc-agent-C)

Three fixes bundled: map tile URL, confidence NaN display, save-space localStorage. PR will target main. After merge, trigger cortex-api canary deploy (see `03_deploy.md`).

## Cloud Run revision

Current live revision: `cortex-api-00254-tad` at 100% traffic.
Project: `legacy-design-tools-prod`, region: `us-central1`.
Production URL: `https://cortex-api-tds7av26va-uc.a.run.app`

## Key PRs (merged)

- PR #203/#206 — tile shell (TileDef registry, GridCanvas, SpaceBar, CSS variable fixes)
- PR #207 — reviewer BFF ownership bypass + devSession bootstrap

## Canonical spec

Full tile registry, BFF routes, preset spaces, degraded engine fixes, acceptance criteria: [`doc_repo/48_cortex_reporting_function_dashboard_spec.md`](../../48_cortex_reporting_function_dashboard_spec.md)
