---
title: Scope — write-road-node-county.mjs (roads rail county writer)
date: 2026-08-11
status: scope-only
owner: planner
related:
  [
    _inbox/2026-08-11_P2-5_road_node_registration_close.json,
    90_runbooks/factory_1_statewide_fabric.md,
    _decisions/2026-08-11_texas_flush_launch_gate_amendment.md,
  ]
---

# Scope: `write-road-node-county.mjs`

**Status:** SCOPE ONLY — no implementation in C1 residue dispatch.

P2.5 merged `road-node` registration (PR #309) but manifest still reads **`no-writer ×254`** because `deriveHasWriter` requires `packages/engine-core/scripts/write-*-county.mjs` and `railEngineBinding.ts` has no `engineWriterScript` for roads.

## 1. County writer role

Mirror `write-parcel-node-county.mjs`: standardized county CLI that reads store truth, dry-runs a full atom plan, applies with write-then-verify, and emits JSON artifacts the sweep runner can drive via `--cli-script=write-road-node-county`.

Flow per county FIPS:

1. Load boundary from `tx_county_boundary` (LDT Neon).
2. Extract highways from pinned Geofabrik Texas PBF via `extract_highways.py`.
3. Plan `road-node` atoms (`{countyFips}:road:{osmWayId}`).
4. Reconcile PBF-sourced orphans (adapter-scoped; never retire protected warm-path rows).
5. Apply via supersede-aware `writeRoadAtomsBatch`.
6. Verify by `atom_did` PK lookup.
7. Retire PBF orphans after upserts.

## 2. Inputs and atom shape

| Read | Store / path |
|---|---|
| County boundary | `tx_county_boundary` on `CORTEX_DATABASE_URL` |
| OSM ways | Geofabrik `texas-latest.osm.pbf` (MD5-pinned) |
| Prior road atoms | `atoms` WHERE `entity_type='road-node'` AND `body->>'countyFips'=$county` |

Write: `entity_type='road-node'`, PK `did:hauska:road-node:{roadNodeId}`. Shape per `RoadNodeAtomInstance` / `emitRoadNode`. Not parcel-keyed; excluded from `PropertyAtomInstance`.

## 3. Dry / apply / verify contract

- **Dry (default):** full plan; `atomsBuilt` must predict apply `atomsWritten`/`verified`.
- **Apply:** requires `ROAD_NODE_COUNTY_PATH=1`, `PROPERTY_ATOM_PATH=1`, `ROAD_PBF_APPLY=1`, direct (non-pooler) substrate URL.
- **Supersede:** incoming PBF must skip rows with adapters in `ROAD_ADAPTERS_PROTECTED_FROM_PBF` (Overpass, Elgin, county roadway, surveyed-2016, Caldwell CAD).
- **Verify:** PK `SELECT body FROM atoms WHERE atom_did IN (...)`; new `verifyStoredRoadNodeAtom` required.
- **H6 gate:** apply must produce `ingest_report.json` on product path before statewide slot run.

## 4. PR #293 salvage dependencies (before apply)

Recommendation: **`salvage_specific_commits`** — do not merge #293 wholesale.

| Blocker | Why |
|---|---|
| Collinear epsilon (H2) | Multi-county boundary ways coin-flip without `geometry-epsilon.ts` |
| Supersede contract (H5) | Main `writeRoadAtomsBatch` silent upsert clobbers 7249+ protected Bastrop rows |
| pg-storage `tokenize` import | CI TS2304 on #293 branch |
| H6 throwaway apply | No product `ingest_report.json` yet |
| Taxonomy filter | `proposed`/`construction` ways must not mint pavement atoms |

Sequence: salvage fixes → H6 apply → legacy synthetic band migration → land county writer + binding → operator apply.

## 5. Legacy synthetic ID migration

Live Bastrop rows use positive 800M/900M synthetic bands. ~1.53M real OSM ids occupy 700M–999M statewide. County writer dry-run must fail-closed on collision candidates until migration plan executes for affected counties (starting 48021).

## 6. What clears manifest `no-writer ×254`

| Step | Repo | Change |
|---|---|---|
| 1 | hauska-engine | Add `write-road-node-county.mjs` + `src/road-node/*` module |
| 2 | hauska-engine | `package.json` script entry |
| 3 | legacy-design-tools | `railEngineBinding.ts` → `engineWriterScript: "write-road-node-county.mjs"` |
| 4 | legacy-design-tools | Refresh `enginePropertyTypesSnapshot.ts` to 15 types |

Manifest probes **file existence**, not atom counts. Cells move `no-writer` → `not-yet`; satisfied coverage is separate warm/scorer work.

## 7. Out of scope (this dispatch)

- Implementation, #293 wholesale merge, H6 apply, legacy band migration execution
- Statewide 254-county sweep / bulk slot apply
- Per-source warm ingests (Overpass, county roadway, surveyed-2016, CAD centerlines)
- Customer-done grading on deployed surfaces
