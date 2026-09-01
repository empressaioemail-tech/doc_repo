---
id: 2026-08-06_T2_ws1_ws2_reopen_close_report
title: T2 WS1/WS2 reopen — operator QA failure response
date: 2026-08-06
status: active
owner: nick
related: [2026-08-05_T2_track_close_report, T2_polish_product_track, QUEUE_parked_work_index]
---

# T2 WS1/WS2 reopen close report (2026-08-06)

Master planner amended close sign-off after operator visual QA failed both items. This report is planner-verified live evidence for the fix pass.

## WS1 — DXF contour spikes (REOPEN → fix deployed)

### Root cause (named with evidence)

**`artifacts/dxf-worker/run.py` always emitted `close=True` on every CONTOUR polyline.** Bastrop Contour1Ft2017 paths are **open** ArcGIS LineStrings (`parsePaths` in `bastrop-contours.ts` → one open path per polyline, `closed: false`). Sealing an open contour draws a **last→first chord** across the parcel — the radiating spikes/tangle the operator saw in CAD on 109 Higgins. This is **distinct from and deeper than** the #257 text-offset fix (which addressed co-located DIMENSION/SETBACK labels only).

Prior insufficient test: #257 text-insert separation tests passed while geometry spikes remained because they never parsed polyline segment lengths or open/closed flags.

### Fix

| Change | Where |
|---|---|
| Open contours → `close=False`; closed rings → `close=True` | `run.py` `_polyline_should_close` + request `closed` flag |
| Bastrop 1-ft paths marked `closed: false` | `contour-source.ts` |
| DEM-derived rings `closed: true` | `emitters.ts` |
| BUILDABLE layer for offset ring; SETBACK text-only; distinct ACI colors | `run.py` SITE_PLAN_LAYERS |
| **SPIKE-DETECTOR** regression | `dxf-contour-spike.test.ts` — max segment ≤ 0.75× bbox diagonal; open stays open |

**PR:** [hauska-engine #263](https://github.com/empressaioemail-tech/hauska-engine/pull/263) merged `bf8d888`.

**Deploy:** `hauska-engine-api-00169-hiq` @100% tag `t2-contour-spike`, image `t2-contour-bf8d888`. Canary `/health` ok; traffic shifted.

### Before / after (entity-level, test fixture)

| Check | Before (#257 / 00165-buz) | After (#263 / 00169-hiq) |
|---|---|---|
| Open 100m ArcGIS-shaped path | `close=True` → ~100m chord spike | `close=False`, max segment ≈ path step size |
| BUILDABLE vs SETBACK | Offset ring on SETBACK layer | Offset on BUILDABLE; labels on SETBACK |
| Spike detector CI | N/A | 3/3 pass + full site-plan 244/244 |

**Operator follow-up:** Fresh site-plan export refresh on `48021:31362` (109 Higgins) in paid session → open DXF in CAD and confirm no cross-parcel chords.

## WS2 — Pedestrian dots (REOPEN → fix deployed)

### Root cause

v1 pass (`#60b4ff`, opacity max 0.75, dash `[0.5,2]`, width max 3.6) was sufficient for dark basemap QA but **insufficient contrast on aerial imagery** at Higgins St.

### Fix

| | v1 (failed QA) | v2 (this pass) |
|---|---|---|
| Color | `#60b4ff` | `#8fd0ff` |
| Dash (dots) | `[0.5, 2]` | `[0.8, 1.2]` |
| Width max @ z18 | 3.6 | 4.5 |
| Opacity max @ z18 | 0.75 | 0.9 |

**PR:** [hauska-map #154](https://github.com/empressaioemail-tech/hauska-map/pull/154) merged `586ef16`.

**Live:** https://property-explorer-xi.vercel.app — bundle `index-C1Sc6_H7.js` (deploy post-586ef16). Bundle grep: `#8fd0ff` present, `#60b4ff` absent.

**Operator follow-up:** Toggle `pedestrian-ways` on Higgins St with **aerial ON** and street-dim basemap; confirm dots readable.

## Master planner sign-off status

WS1 + WS2 fixes merged, deployed, and planner-verified at bundle/engine-revision level. **Operator visual re-QA owed** before flipping queue rows back to DONE.
