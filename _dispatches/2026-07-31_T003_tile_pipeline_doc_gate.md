---
id: 2026-07-31_T003_tile_pipeline_doc_gate
title: Dispatch — T-003 locate tile build pipeline (GATE)
status: closed
date: 2026-07-31
applies_to: doc_repo
wdll: _inbox/2026-07-31_txgio_terrain_additive_3d_viz_WDLL.md
wdll_items: [1]
---

# T-003 — tile build pipeline gate — CLOSED

## STANDING DECISIONS (paste into every sub-dispatch)

- Cotality EXTINGUISHED — re-route, never rotate credential.
- Deploys planner-owned — agent deploys and fixes failed deploys; never escalate deploy to operator.
- No privileged data — TxGIO is public/free; uniform public-record only.
- CTX / national HELD until Bastrop QA-done + operator go.
- Code-done ≠ customer-done — grade is live probe on deployed surface, not merged PR.
- Stage explicit paths — shared clone per repo; standing decisions travel in dispatches.

## Finding

The parcel PMTiles pipeline is **not** in hauska-map or hauska-engine. It lives in **legacy-design-tools**:

| | |
|--|--|
| CLI | `artifacts/api-server/src/parcelsPmtilesBakeCli.ts` |
| Run | `pnpm --filter @workspace/api-server parcels-pmtiles-bake` |
| Docs | `artifacts/api-server/README-parcels-pmtiles-bake.md` |
| Upload | Manual `gcloud storage cp` → `gs://hauska-map-tiles` (D4 runbook) |
| Trigger | Manual/offline; no CI |
| Who runs | Planner default; any agent with DB read + tippecanoe/docker |

Terrain-RGB requires a **sibling Python/GDAL bake** in the same repo — same bucket, separate encode step. Spec in canonical doc.

## Deliverable

- `40j_hauska_map_tile_build_pipeline.md` — canonical T-003 record + terrain extension design

## Unblocks

T-008, T-009, T-010 dispatches.
