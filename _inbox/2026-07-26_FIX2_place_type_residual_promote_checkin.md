---
id: 2026-07-26_FIX2_place_type_residual_promote_checkin
title: Check-in — FIX 2 place-type residual promote (0 new; reclassify)
status: check-in
date: 2026-07-26
executor: FIX2 depth-warm
cites:
  - _dispatches/2026-07-26_FIX2_place_type_residual_promote.md
  - 27c WDLL 7
---

# FIX 2 place-type residual promote check-in

## Repo / HEAD

| Item | Value |
|------|--------|
| Repo | hauska-engine |
| Branch at run | `pr-134-fix11` (worktree; `main` checked out elsewhere) |
| HEAD | `be223a9` (contains `d34ed4fd` FIX 1.1 / PR #134) |
| Code PR | **None** (promote-only) |

Env: `DATABASE_URL` + `TXGIO_DATABASE_URL` from `CORTEX_DATABASE_URL` (`hauska-prod-497015`), `PROPERTY_ATOM_PATH=1`.

## BEFORE promote (live tally 2026-07-26T13:00:00Z)

`tally-bastrop-depth.mjs` + dispatch baseline:

```
 depth_warm_promoted | zoning_place_type | depth_ratio_place_type_pct
---------------------+-------------------+----------------------------
                2345 |              3657 |                      64.1236
```

Verbatim SQL (48021, `depthWarmPromotion = depth-warm-promoted-v1`):

```sql
SELECT count(*)::int AS depth_warm_promoted
FROM atoms
WHERE entity_type = 'buildable-envelope'
  AND body->>'parcelNodeId' LIKE '48021:%'
  AND body->>'depthWarmPromotion' = 'depth-warm-promoted-v1';
-- 2345

SELECT count(*)::int AS zoning_place_type
FROM atoms
WHERE entity_type = 'zoning-fact'
  AND body->>'parcelNodeId' LIKE '48021:%'
  AND NOT (body ? 'absence')
  AND coalesce(body->>'district', '') <> ''
  AND split_part(body->>'district', ' ', 1) = ANY(ARRAY['P-1','P-2','P-3','P-4','P-5']);
-- 3657
```

## Promote run

Command (R4.4 parity flags, `offset=0`):

```text
pnpm --filter @hauska-engine/engine-core depth-warm-bastrop-batch --
  --place-type-cohort --city-cohort --promote --limit=4000
```

Wall: **8,617,490 ms** (~2.4 h). Log: `hauska-engine/packages/engine-core/fix2-promote-log.txt`. Cost JSON: `fix2-promote-cost.json`.

Stdout summary (verbatim outcomes):

```json
{
  "roadsLoaded": 3617,
  "cohort": { "processed": 3654, "placeTypeZoningDenominator": 3657 },
  "outcomes": {
    "promoted": 0,
    "verifyPass": 0,
    "verifyFail": 902,
    "declines": {
      "already-promoted": 2345,
      "no-road-adjacency": 407,
      "no-geometry": 0
    }
  },
  "cost": {
    "wallMsTotal": 8617490,
    "extrapolatedJurisdictionUsd": 0.0958,
    "extrapolatedWallHours": 4.89,
    "flaggedOverCostGate": false
  }
}
```

Note: R4.4 full pass used `--offset=50` and promoted **2308** in that slice; this FIX2 pass used default `offset=0` but still iterated all **3654** city place-type zoning rows (`2345` fast-skipped as already-promoted).

## AFTER promote (live tally 2026-07-26T15:26:00Z)

```
 depth_warm_promoted | zoning_place_type | depth_ratio_place_type_pct
---------------------+-------------------+----------------------------
                2345 |              3657 |                      64.1236
```

**+~395 landed?** **No.** `promoted=0`; depth_warm unchanged.

## Residual reclassify (unwarmed place-type, n=1312)

Read-only warm path outcomes from this promote pass on parcels not already depth-warm (no second promote attempted beyond the single batch):

| Bucket | Count (FIX2 pass) | Prior recon (2026-07-26 finding) |
|--------|------------------:|-----------------------------------:|
| no-road-adjacency | 407 | 110 |
| verifyFail-geometry-empty | 902 | 807 |
| would-promote (verifyPass, not yet marked) | **0** | **395** |
| **Total unwarmed** | **1312** | **1312** |

Arithmetic on FIX2 pass: `3654 processed − 2345 already-promoted = 1309` warmed/declined; `407 + 902 = 1309` (3 place-type rows outside city bbox vs 3657 county denominator).

Geometry-empty sample (from `sampleOutcomes`, all `inset ring is null` / empty warm):

- `48021:103387`, `48021:104127`, `48021:105054`, `48021:108569`, `48021:109905`, …

Spot check: `48021:34785` (1009 Chestnut, planner “depth-warm succeeds” specimen) **verifyFail** on this batch dry-run with live txgio (`inset ring is null`). Fixture parity tests still pass locally (FIX 1.1 WGS84 path).

## Blockers / follow-ups

1. **Zero recovery** despite recon **395 would-promote** — full cohort re-pass with `warmThenVerify` yielded **0** `verifyPass`; tally flat at 2345.
2. **Bucket drift vs recon** — same residual size (1312) but no `would-promote` bucket on this pass (more `no-road-adjacency` and `verifyFail`).
3. **Roads loaded 3617** (post-`isFrontEligibleRoad` filter) vs **4894** road-node atoms in tally; expected filter, but adjacency failures rose vs recon.
4. No Cloud Run deploy; no county fan-out; no PDD feet invented.

## WDLL / dispatch

Dispatch FIX2 **not met** on primary acceptance (+~395 depth-warm promotes). Evidence filed for planner adversarial re-grade.
