---
id: 2026-07-30_BDC_CLOSE12_BUCKET2_rewarm
title: BDC downtown drill — Bucket 2 re-warm/promote
date: 2026-07-30
owner: planner
repo: hauska-engine
wdll: 2026-07-30_BASTROP_DOWNTOWN_DRILL_WDLL
items: [7]
status: dispatched
depends_on: [2026-07-30_BDC_CLOSE12_BUCKET3_geometry_gate_scrub]
---

# Bucket 2 — re-warm 5 parcels

## Standing decisions

(paste standard block — same as Bucket 3 dispatch)

## Parcels

| prop_id | node_id | class | action |
|---|---|---|---|
| 34065 | 48021:34065 | STALE | `--force-repromote` |
| 34881 | 48021:34881 | STALE | `--force-repromote` |
| 34769 | 48021:34769 | GC rear=0 | promote fix + re-warm |
| 34785 | 48021:34785 | DECLINED | after Bucket 3 scrub |
| 39282 | 48021:39282 | DECLINED | after Bucket 3 scrub |

## Command

```powershell
$env:PROPERTY_ATOM_PATH='1'
$env:BOUNDARY_PRIMITIVE_PERSIST='1'
$env:NODE_OPTIONS='--use-system-ca'
pnpm --filter @hauska-engine/engine-core run boundary-primitive-bastrop-downtown-scrub
pnpm --filter @hauska-engine/engine-core run depth-warm-bastrop-downtown-drill -- --promote
```

## Acceptance

All 5 serve current L23 numbers on PE facets after deploy + traffic shift.
