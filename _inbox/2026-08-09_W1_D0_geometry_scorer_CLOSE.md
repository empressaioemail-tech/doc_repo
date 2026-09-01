---
id: 2026-08-09_W1_D0_geometry_scorer_CLOSE
title: W1 D0 — geometry scorer CLOSE (slot chain step 2)
date: 2026-08-09
status: closed
owner: D planner
program: OPS-14 W1
related: [_inbox/2026-08-09_W1_48021_parcel_node_CLOSE, _inbox/2026-08-09_W1_D0_slot_gate_status]
---

# W1 D0 geometry scorer CLOSE

Slot-chain step (2) after Bastrop 48021 parcel-node apply. Precondition satisfied: `_inbox/2026-08-09_W1_48021_parcel_node_CLOSE.md`.

## Commands

```powershell
$env:DATABASE_URL = <hauska_mcp direct host>
$env:DEPLOYMENT_DATABASE_URL = <neondb direct host>
cd P:\legacy-design-tools\artifacts\api-server
.\node_modules\.bin\tsx.cmd src\countyGeometryScoreCli.ts --all --dry-run
.\node_modules\.bin\tsx.cmd src\countyGeometryScoreCli.ts --all
```

Logs: `P:/tmp/w1_slot_chain/scorer_dry.log`, `P:/tmp/w1_slot_chain/scorer_apply.log`

## Scorer summary (dry-run == apply)

| Metric | Value |
|---|---|
| counties scored | 119 |
| satisfied-present | 88 |
| not-yet (below 95%) | 31 |
| skipped (no denominator) | 0 |
| ledger writes | 119 |
| duration | ~67s |

**Bastrop 48021:** atoms=62394, features=63357, coverage=98.48%, rail_state=satisfied-present.

## Ledger delta (live GET `/api/county-ledger`)

**Before** (`P:/tmp/w1_slot_chain/ledger_before_scorer_live.json`, 2026-08-09T22:07Z):

```json
{"satisfiedCells":38,"texasCompletenessPct":0.2133771830027867,"totalCounties":254}
```

**After** (`P:/tmp/w1_slot_chain/ledger_after_scorer.json`, 2026-08-09T22:12Z):

```json
{"satisfiedCells":89,"texasCompletenessPct":0.8970593856196157,"totalCounties":254}
```

**Delta:** satisfiedCells **+51**; texasCompletenessPct **+0.6837 pp** (0.213% → 0.897%).

48021 geometry facet after apply: `honestCoveragePct=98.48`, source=`parcel-node-atom-count`.

## Adversarial checkpoint 1 (pre-apply, dry-run vs pre-registered SQL)

Pre-registered three counties (independent atom/feature ratio from both stores):

| County | Atoms | Features | Expected coverage | Expected rail_state | Dry-run match |
|---|---:|---:|---:|---|---|
| 48261 Kenedy | 529 | 538 | 98.33% | satisfied-present | yes |
| 48021 Bastrop | 62394 | 63357 | 98.48% | satisfied-present | yes |
| 48253 Jones | 18236 | 27732 | 65.76% | not-yet | yes |

Below-threshold counties (31 total) all classified `not-yet`, never `satisfied-present`.

## Adversarial checkpoint 2 (post-apply)

SQL on `county_facet_coverage` facet=geometry (neondb, 2026-08-09T22:12Z):

```json
{
  "geometry_rail_state_counts": [
    { "rail_state": "not-yet", "n": 31 },
    { "rail_state": "satisfied-present", "n": 88 }
  ],
  "sample_counties": [
    { "county_fips": "48021", "honest_coverage_pct": "98.48", "rail_state": "satisfied-present", "source": "parcel-node-atom-count", "verified_by_instrument": "countyGeometryScoreCli.ts" },
    { "county_fips": "48253", "honest_coverage_pct": "65.76", "rail_state": "not-yet", "source": "parcel-node-atom-count", "verified_by_instrument": "countyGeometryScoreCli.ts" },
    { "county_fips": "48261", "honest_coverage_pct": "98.33", "rail_state": "satisfied-present", "source": "parcel-node-atom-count", "verified_by_instrument": "countyGeometryScoreCli.ts" }
  ]
}
```

Live ledger GET after apply matches SQL (48021 geometry 98.48%, satisfied-present).

## Verdict

Step 2 **CLOSED**. Atoms bulk slot now **HANDS OFF to H planner** for H6 throwaway apply window per `_dispatches/2026-08-09_W1_H6_slot_handoff.md`. D planner resumes slot on H6 close artifact.
