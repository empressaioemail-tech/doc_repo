---
id: 2026-07-27_CC_A_U3_planner_verify_checkin
title: CC-A U3 planner verify — merged; live production deploy PENDING
status: checkin
date: 2026-07-27
applies_to: hauska-map/apps/command-center
wdll: 2026-07-27_CC_A_legible_node_atom_flow_WDLL
wdll_items: [7, 8, 9, 10]
owner: nick
related: [2026-07-27_CC_A_U3_executor_close]
---

# CC-A U3 planner verify

Builder: [CC-A U3](6afc58ad-4a4d-428f-9e3f-6b68cd9c1b3c) close
`_inbox/2026-07-27_CC_A_U3_executor_close.md`. Planner does not accept
builder self-grade.

## Merge

| Item | Evidence |
|---|---|
| PR | https://github.com/empressaioemail-tech/hauska-map/pull/73 |
| CI | test / Test / Typecheck **SUCCESS** |
| Merged | 2026-07-27T13:09:16Z squash → main `8e1006d` |
| Code review | PASS — shared `packages/map-renderer/src/chrome`; probe → `/health`; Revenue Meter honest `platform_internal_required`; PE thin re-exports; F1c badges untouched |

## Live production (cmdcenter-blush) — NOT YET on `8e1006d`

Probed ~2026-07-27T13:12–13:15Z after merge:

- SPA asset `/assets/index-eWdGi6qE.js` still contains **"no interactive map"** (old Parcel Trace copy). Main source has the new "Site Analysis hosts the shared layered map" string — **bundle stale**.
- Site Analysis still MapLibre/OSM/**CARTO** + "Fixture layers" only — no LayersControl / MapTools chrome visible.
- Parcel Trace badge still **DEGRADED**; stale copy still rendered.
- BFF: `/health` **200**; `/healthz` + `/healthz/` still **404** (alias not in serving deployment yet).
- Metering still **403** (expected until platform_internal key).
- Vercel CLI redeploy blocked in this environment (TLS / npm dist-tags). GitHub Deployments API empty for this repo.

**Action owed:** Vercel production redeploy of command-center from main `8e1006d` (operator or auto-deploy when it catches up). Then planner re-walks.

## Grades (WDLL 7–10)

| Item | Grade | Evidence |
|---|---|---|
| 7 Map swap | **PARTIAL** | Code MERGED + CI green; live CC still old map shell |
| 8 Parcel Trace | **PARTIAL** | Probe/copy fixed on main; live badge still DEGRADED on stale bundle |
| 9 Revenue Meter | **PARTIAL** | Honest-degraded path reviewed in source; live panel not yet on new bundle (403 still correct posture) |
| 10 Negative done-line | **PARTIAL** | Shared chrome module on main; live fork still serving until deploy |

Re-grade to MET/honest-DEGRADED only after production serves `8e1006d` and planner clicks Site Analysis + Parcel Trace + Revenue Meter.

## U1 / U2 status

U1 PRs open (not graded here): hauska-map #74, hauska-engine #144. U2 still queued on U1 walkable close. CTX HELD.
