---
id: 2026-07-26_PRE2_adjacency_at_scale_checkin
title: Check-in — STAGE 2 / PRE-2 full-county parcel adjacency scale (HOLDS)
status: check-in
date: 2026-07-26
planner: depth-engine planning agent
read_only: true
governs: 27f AMENDMENT 1 / Stage 2 precondition
related:
  - _inbox/2026-07-26_guard_vs_interior_and_boundary_primitive.md
  - 27f_bastrop_through_v2_program.md
  - _scratch/depth-engine-27c.md
---

# PRE-2 — Adjacency at scale (gate for Stage 2 primitive)

**Verdict: HOLDS.** App-side bbox + jsonb PIP (one Neon load + in-memory cell grid) finishes the full Bastrop parcel geometry set in ~27s wall / ~15s adjacency compute. PostGIS is **not** a precondition for the boundary primitive. Central-TX stays **HELD**. No primitive build started.

## 1. Full-county run (pasted)

Live Neon `txgio_parcel` (cortex / hauska-prod `CORTEX_DATABASE_URL` path). Timestamp `2026-07-27T02:54:58.005Z`.

```
method:
  one Neon SELECT of jsonb geometry + bbox columns;
  in-memory ~1km cell grid;
  per-edge outward 3m probe;
  bbox pad filter;
  pointInOrOnPolygon on candidate rings

infra (live):
  geometry column = jsonb (udt jsonb)
  extensions installed = plpgsql, vector
  PostGIS installed = NO
  ST_MakePoint = fail ("function st_makepoint(integer, integer) does not exist")
  ST_GeomFromGeoJSON = fail ("function st_geomfromgeojson(unknown) does not exist")
  postgis available (not installed) = 3.5.0 per pg_available_extensions
  indexes = btree (county_fips,tile_key,feature_index), (county_fips,prop_id), situs_norm
  NO spatial / GiST index on geometry

load:
  rowsFromDb / parcelsProcessed = 74729
  parseFail = 0
  projectFail = 0
  loadWallMs = 3032

adjacency:
  parcelsProcessed = 74729
  edgesTotal = 713390
  edgesWithNeighbor = 457761
  edgesNoNeighbor = 255629
  avgCandidatesPerEdge = 5.167
  maxCandidatesPerEdge = 47
  gridBuildMs = 12
  adjWallMs = 15181
  wallMsTotal = 27306
  failureCount = 0
  failures = []

approxCost:
  neonCuHoursBallpark ≈ 0.00021
  neonUsdBallpark ≈ $0.00 (one SELECT; compute local)
```

Denominator note: prior scratch “62,257” is the zoning-facts headline, not the full TxGIO geometry set. Live `txgio_parcel` for `county_fips='48021'` with geometry = **74,729**. Scale check ran the full geometry universe.

Raw artifact: `_inbox/2026-07-26_PRE2_adjacency_scale_raw.clean.json`. Repro script (read-only): `hauska-engine/packages/engine-core/_diag_adjacency_scale.ts`.

## 2. Cost curve / scale verdict

| Path | Shape | Bastrop (74.7k) | Travis ~380k (est.) | Bexar ~700k (est.) |
|------|-------|-----------------|---------------------|--------------------|
| **Chosen: load once + cell grid + PIP** | near-linear in n at fixed local density | adj **15.2s** / total **27.3s** | adj ~**1.3 min** | adj ~**2.4 min** |
| Naive full scan of all bboxes per edge (sample 200 → extrapolate) | O(n²)-ish | ~**38 min** | ~**16 h** | ~**55 h** |

**Holds for Bastrop.** Survives Travis/Bexar-scale **if** the primitive build uses the same one-load + local spatial index (cell/grid/R-tree) pattern — not per-edge SQL bbox scans against Neon.

What would blow up: unindexed per-edge Neon queries (or a nested loop over all parcels per edge without a grid). That is the road-ingest bbox-stall shape. Do not use it.

## 3. Infra fix — not required as Stage 2 precondition

Because the app-side method holds, **PostGIS is optional later**, not a gate.

If we later want DB-side `ST_DWithin`:

| Item | Live fact |
|------|-----------|
| Can this Neon take PostGIS? | **Yes** — `pg_available_extensions` lists `postgis` **3.5.0** (installed_version null) |
| Migration shape | `CREATE EXTENSION IF NOT EXISTS postgis;` then typed column e.g. `geom geometry(MultiPolygon,4326)` populated from jsonb via `ST_SetSRID(ST_GeomFromGeoJSON(geometry::text),4326)`, GiST index, backfill job |
| Effort | Small migration + one-time backfill of ~75k Bastrop rows (county fan-out later); verify consumers still read jsonb or dual-read |
| Cost | Extension itself free on Neon; storage + backfill CU small at county scale |
| When | Only if we need SQL-side spatial joins at query time or multi-tenant serving without loading rings into the app |

**Chosen adjacency method for Stage 2:** app-side one-load + cell grid + outward probe + bbox + PIP on jsonb rings. Persist results into the boundary primitive; do not depend on PostGIS for the build.

## 4. Named-parcel correctness spot-check

Full-county run produced the **same edge→neighbor map** as the guard-vs-interior diagnostic (edge indices in source GeoJSON order):

| Parcel | Expected | Full-county result | Match |
|--------|----------|--------------------|-------|
| **28286** | edge1→32341; edge2→35671 (mixed road+parcel); edge3 no parcel neighbor | `0:null, 1:32341, 2:35671, 3:null` | **YES** |
| **34785** | edges 0/1 → 34801/34769; edge2 unmapped; (diag also noted edge3→34777) | `0:34801, 1:34769, 2:null, 3:34777` | **YES** |
| **33512** | neighbors on 1/2; edges 0/5 unmapped | `0:null, 1:48754, 2:33596, 3:33603, 4:33617, 5:null` | **YES** (0/5 unmapped; neighbors present on 1/2+) |

Scale did not break correctness on the named fixtures.

## Gate

| Gate | Status |
|------|--------|
| Full-county adjacency measured | **MET** |
| Method acceptable at Bastrop | **MET** |
| Survives Travis/Bexar with same method | **MET** (linear grid path; avoid naive O(n²)) |
| PostGIS precondition before primitive | **NOT REQUIRED** |
| Primitive build | **STILL BLOCKED on operator Stage 2 dispatch** (this only clears AMENDMENT 1) |
| Central-TX | **HELD** |
