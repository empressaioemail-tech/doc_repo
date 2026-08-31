---
id: 2026-07-27_QA3_executor_close
title: QA3 executor close — Command Center majors + legibility
date: 2026-07-27
status: delivered
owner: build-agent
planner: qa
repo: hauska-map
related: [2026-07-27_QA3_command_center_majors]
---

# QA3 executor close — Command Center majors + legibility

Builder does **not** grade MET. Operator looks at preview before MET.

## Delivery

| Field | Value |
| --- | --- |
| Branch | `qa/cc-majors` |
| PR | https://github.com/empressaioemail-tech/hauska-map/pull/81 |
| SHA | `9e8ed30b10e6648b8d1213febb13a180bda2b081` |
| Base | `origin/main` @ `f386190` |
| Build | `pnpm -C apps/command-center build` clean |
| Tests | NodeGraph.smoke, SpineHealth.smoke, tileRegistry — 5/5 pass |
| Preview | https://cmdcenter-mgvgscb5u-empressaioemail-techs-projects.vercel.app |
| Inspect | https://vercel.com/empressaioemail-techs-projects/cmdcenter/CHGkPiCkYvkr3CVMCCM2uZup8iKz |

Production not shifted.

## What landed

1. **Chrome reclaim** — `StateLegend` collapsible drawer (default collapsed → 40px rail; expand to 296px). Preference in `localStorage` (`cc-state-legend-open`). Center column gets the width.
2. **Node walk un-buried** — `NodeInspect` + inspect input first; Central-TX tally and road rollup in `CollapsibleSection` below (default closed).
3. **Tokens unified** — `admin/tokens.css` is the single namespace (`--color-*`, `--type-*`, `--space-*`); added `--color-background-tertiary`; `--h-*` aliases map onto `--color-*`; LiveMapTile / ParcelTerrainTile / tileRegistry / ReportTile drop hex-fallback parallel palette; removed per-panel `@empressaio/design-tokens` imports (root `main.tsx` imports `tokens.css` only).
4. **Legibility** — type scale floor 11px; `WalkBreadcrumb` (`node › family › atom`); shared `Card` / `Button` / `AtomListRow` / `CollapsibleSection`; SpineHealth uses shared Button + `summarizeValue` (no raw JSON slice); NavRail comment fixed (Workspace included).

CC-A node walk and B1 Spine Health panel kept; layout/shell improved around them.

## Track-C flags (not built)

- CC "first-class / expanded map default" (register CC-6) still overlaps **held Track-C map-swap** — not done here.
- Map tile only inherits unified tokens; no map placement / default-panel swap.
- Residual hardcoded map overlay chip colors (`#7dd3fc`, severity reds/yellows) are map-chrome accents, not a second token palette; Track-C can decide whether those become tokens later.

## Deploy note

First attempt (`vercel deploy --cwd apps/command-center`) failed: cwd-only upload dropped workspace `@hauska/map-renderer`. Fixed by deploying from monorepo root against the `cmdcenter` project.

## Operator look (before MET)

1. Open preview → Node & Graph: inspect card above fold; expand tally below.
2. Confirm Legend collapsed by default; open/close; center width reclaimed.
3. Walk `48021:28286` → family → atom; breadcrumb shows full trail.
4. Spine Health: Refresh / Run probes still work; signal cells readable.
5. Site Analysis / LiveMapTile: no transparent tertiary backgrounds; tokens inherited.
