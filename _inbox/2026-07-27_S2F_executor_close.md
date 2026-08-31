---
id: 2026-07-27_S2F_executor_close
title: Executor close — S2-F Bastrop County Roadway (defined-surface gate)
status: check-in
date: 2026-07-27
executor: depth-engine Cursor agent
governs: 27f Stage 2 Finisher
cites:
  - _dispatches/2026-07-27_S2F_bastrop_county_roadway_proxy_retire.md
  - _inbox/2026-07-27_S2F_BEFORE_baseline.json
related:
  - _inbox/2026-07-26_S2_stage2_planner_close_checkin.md
---

# S2-F executor close

Planner verifies live. Executor does not self-grade Stage 2 proxy retirement done.

## PR + SHA

| Item | Value |
|------|-------|
| PR | [#140](https://github.com/empressaioemail-tech/hauska-engine/pull/140) |
| Branch | `feat/s2f-bastrop-county-roadway` |
| SHA | `daf7bb0` |
| Base | `7540de2` (main, U1+U3) |

## F.1 — Adapter + ingest

| Metric | Value |
|--------|-------|
| ArcGIS features (live/fixture) | **11,351** |
| Ingested road-node atoms | **11,351** |
| Fetch method | PowerShell `fetch-bastrop-county-roadway-fixture.ps1` (19.3s); fixture gitignored (121 MB) |
| Ingest elapsed | 79,535 ms |

**Sample City-owned atom (defined surface — authoritative):**

```json
{
  "roadNodeId": "48021:road:800000071",
  "displayName": "KANI LN",
  "classification": "residential",
  "provenanceKind": "county-roadway-authoritative",
  "countyOwner": "City"
}
```

## F.2 — Gold cohort labeling (amended honesty rule)

**Rule applied:** `county-roadway-authoritative` only when surface is defined (not Undefined/empty). Undefined geometry rows → `county-roadway-undefined`, excluded from labeling pool. OSM remains best-available.

| Specimen | BEFORE (baseline) | AFTER (live probe @ 2026-07-27T11:38:58Z) | Flip? |
|----------|-------------------|-----------------------------------------------|-------|
| 48021:28286 | e2 front/residential osm-fallback; e3 side_corner/residential osm-fallback | **same** — osm-fallback | No (attach roadway Undefined) |
| 48021:34785 | e3 front/unclassified osm-fallback | **same** — osm-fallback | No |
| 48021:33512 | e3 rear/alley osm-fallback; e4 front/residential osm-fallback | **same** — osm-fallback | No |
| 48021:104985 | e8 front/residential osm-fallback | **same** — osm-fallback | **No — honest MET** (no defined gravel on attach) |

**104985 tell:** no flip. County attach for this parcel has Undefined surface in city limits; forcing authoritative would fabricate. OSM best-available retained per planner amendment.

## F.3 — Provenance split (substrate live)

| Kind | BEFORE | AFTER |
|------|--------|-------|
| county-roadway-authoritative | 0 | **5,431** |
| county-roadway-undefined | 0 | **5,920** |
| county-surveyed-2016 | 1,307 | **1,307** |
| approximate-assumed-per-class (OSM) | 4,894 | **4,894** |
| **total road_nodes** | **6,201** | **17,552** |

Roads loaded for labeling (warm pool): **11,632** (authoritative + surveyed + OSM; undefined excluded).

## F.4 — OSM fallback preserved

OSM count unchanged at 4,894. Undefined county rows do not displace OSM. No coverage drop.

## F.5 — Re-promote + gates

| Metric | BEFORE | AFTER |
|--------|--------|-------|
| depth_warm / place_type | 3642 / 3657 = **99.59%** | **3642 / 3657 = 99.59%** (unchanged) |
| vitest | — | **330 / 330 pass** (local) |
| CI | — | PR #140 **green** (typecheck + test pass @ `daf7bb0`) |

Gates not weakened: front-labeling, PATCH-A geometry, offset-consumes-primitive fixtures green in local run.

## F.6 — Data-population ceiling (schema ≠ data)

From fixture export (matches planner live query):

| Count | Value |
|-------|-------|
| all_features | 11,351 |
| owner = City | 2,371 |
| City + BASTROP muni (city limits) | 1,061 |
| City + BASTROP with **defined** surface (not Undefined) | **67** (Paved ≈ 65) |
| City + BASTROP with Undefined surface | **994** |

City street proxy retirement is **data-limited**, not adapter-limited. 67 defined city-limits segments can flip when attach hits; 994 remain OSM best-available.

## M0 scratch (Tier 2 — planner gates promotion)

```
LESSON (S2-F): Bastrop_County_Roadway schema covers city+county but city-limits City rows are
  994 Undefined vs 67 defined surface — never emit county-roadway-authoritative from Undefined;
  worse than OSM proxy.
LESSON (S2-F): county-roadway-undefined atoms stored for geometry audit but filtered from
  roadAtomToWarmSource — OSM wins labeling honestly.
GROUND-TRUTH (2026-07-27T11:38Z): post-ingest provenance 5431 auth / 5920 undef / 1307 surveyed /
  4894 OSM; gold 28286/34785/33512/104985 all osm-fallback unchanged.
GROUND-TRUTH (2026-07-27T12:06Z): depth_warm=3642/3657=99.59% held; road_nodes=17552.
DEAD-END: forcing 104985 gravel flip without defined county surface on attach — rejected per amendment.
OPEN: planner live verify PR #140 CI + spot-check defined-surface city flip on one of 67 segments.
OPEN: Central-TX HELD (operator).
```

## Negative done-line

- Did not merge (PR open for planner).
- Did not self-grade Stage 2 proxy retirement done.
- Did not Central-TX fan-out.
- Did not weaken guards.
- Did not fabricate authoritative from Undefined surface.
