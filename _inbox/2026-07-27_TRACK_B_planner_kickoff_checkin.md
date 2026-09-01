---
id: 2026-07-27_TRACK_B_planner_kickoff_checkin
title: Planner kickoff check-in — Track B customer-UI quality
status: active
date: 2026-07-27
planner: Track B customer-UI planner
related: [2026-07-27_TRACK_B_customer_ui_quality_WDLL, 2026-07-27_TRACK_B_STATUS, _scratch/customer-ui-track-b]
---

# Track B planner kickoff check-in

Date: 2026-07-27T12:50Z (approx). Planner owns plan / fan / live verify / M0. No build code by planner. CTX HELD. Depth base held (S2-F closed honest).

## Artifacts filed

| Artifact | Path |
|---|---|
| WDLL (approved this session) | `_inbox/2026-07-27_TRACK_B_customer_ui_quality_WDLL.md` |
| STATUS | `_inbox/2026-07-27_TRACK_B_STATUS.md` |
| Scratch | `_scratch/customer-ui-track-b.md` |
| B1 dispatch | `_dispatches/2026-07-27_TRACK_B1_road_centerline_edges_render.md` |
| B2 dispatch | `_dispatches/2026-07-27_TRACK_B2_site_plan_design_pass.md` |
| B3 dispatch | `_dispatches/2026-07-27_TRACK_B3_map_pdf_vocab_reconciliation.md` |
| BEFORE facets | `_inbox/2026-07-27_TRACK_B_BEFORE_34785_facets.json` |

Builders fanned in parallel: [B1 road render](501d5579-a8d1-4ff9-8dcd-6fa34c372a34), [B2 design pass](ba178a18-5e07-4ef5-adb6-27215530ce17), [B3 vocab](59de7f76-95d3-420a-acf6-7e6ddf593c3a).

## BEFORE — live customer surface (planner)

### Facets API (backend healthy)

All four gold parcels HTTP 200, `readPath=atom-chain-warm`, `X-PE-Cold-Derive=skipped`, envelope `status=ok`, `depthWarmPromoted=true`, zoning P-5, front 15′:

| parcel | snapshotAt | envelope |
|---|---|---|
| 48021:34785 | 2026-07-26T17:43:49.044Z | ok + geojson Polygon depth-warm |
| 48021:33512 | 2026-07-25T22:52:11.361Z | ok + geojson |
| 48021:47728 | (same wave) | ok + geojson |
| 48021:47595 | 2026-07-26T00:02:43.644Z | ok + geojson |

engine-api `/health` 200: `service=engine-api`, `startedAt=2026-07-26T19:18:55.090Z`.

### PE inspect card (app-correct — THIS is the QA bar)

Live URL: `https://property-explorer-xi.vercel.app/?parcelNodeId=48021%3A34785`

Settled inspect text (CDP `document.body.innerText`, 2026-07-27):

```
Parcel 34785
Zoning
P-5
Setbacks
F 15′ · S not specified · R not specified (build-to-line governs)
Buildable
build-to-line · buildable % pending
…
Setbacks are on file (F 15′ · S not specified · R not specified (build-to-line governs)); buildable % pending (P-5).
```

**B3 BEFORE finding:** facets carry warm envelope geojson + setbacks, but card still says **buildable % pending**. Transient load flash also showed "Setbacks and buildable area not verified here yet (zoning not verified here)" before settling — loading vocabulary still lies briefly. FIX-1 geometry root is not enough; display vocabulary still diverges from warm truth.

### Map road render (B1 BEFORE)

Screenshot of gold parcel: parcels + zoning colors + hydrology draw; street **names** appear as basemap labels (Chestnut / Main / Austin). No road-node centerline or ROW edges as a first-class PE overlay. Matches program status: road DATA exists, RENDER missing.

### Site-plan PDF (B2 BEFORE)

Anonymous GET `/api/pe-site-plan-export` → **405** (method). Paid export path requires auth refresh — planner will regenerate after B2 PR + deploy. Pre-existing STATUS/samples: STREET layer empty honest-absence (pre-road-node composer). Design still crude per 75o samples.

## Unit board (kickoff)

| Unit | Status | Planner verify |
|---|---|---|
| B1 | BUILDING | PENDING after PR — gold site plan + PE map must DRAW fronting road |
| B2 | BUILDING | PENDING after PR — gold PDF professional read |
| B3 | BUILDING | PENDING after PR — trio map+inspect+PDF agree |
| M0 | — | promote only verified render/UX lessons |

## Gates (unchanged)

- Road renders on site-plan AND map for gold parcels
- Site plan reads professional
- Map/PDF/inspect agree on setbacks/buildable
- Negative: empty STREET box; crude PDF; surface disagreement; survey-grade fabrication on GIS tags

## Next

1. Adversarial review each builder close against live PE/PDF (never trust report).
2. Merge only on planner go + green CI + pasted customer-surface evidence.
3. Flush scratch; promote mechanical guards where lessons earn it.
