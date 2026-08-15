---
id: 2026-07-26_FIX2_place_type_residual_promote
title: Dispatch — FIX 2 re-run place-type promote + residual reclassify
status: closed-failed
date: 2026-07-26
applies_to: [hauska-engine]
planner: depth-engine planning agent
depends_on: [FIX1.1 merged d34ed4fd]
---

# FIX 2 — recover residual place-type depth

## Baseline (do not invent)

Before any promote, paste live SELECT:

```
depth_warm_promoted = 2345
place_type = 3657
depth_ratio_place_type = 64.12%
residual = 1312 (110 no-road / 807 geometry-empty / 395 would-promote)
```

## Required

1. Pull `main` at/after `d34ed4fd` (FIX 1.1). No code change required unless promote script is broken.
2. Env: `DATABASE_URL` + `TXGIO_DATABASE_URL`=`CORTEX_DATABASE_URL` from `hauska-prod-497015` + `PROPERTY_ATOM_PATH=1`.
3. Re-run place-type cohort promote (same flags as R4.4):
   `pnpm --filter @hauska-engine/engine-core depth-warm-bastrop-batch -- --place-type-cohort --city-cohort --promote --limit=4000`
   (adjust offset if already-warmed parcels dominate; goal is the 395 would-promote + any geometry-empty recovered by FIX 1 geometry path — note FIX 1.1 is site-plan path; warm inset was already correct, so expect ≈+395 not +807).
4. Paste after tally: depth_warm, place-type ratio, cost JSON summary.
5. Reclassify remaining residual (read-only warm path, no second promote): no-road / geometry-empty / would-promote. Split geometry-empty sample into honest-irregular vs still-broken if any.
6. File check-in under `_inbox/2026-07-26_FIX2_place_type_residual_promote_checkin.md` with before/after and residual table.

## Hard rules

- No inventing PDD / not_specified setback feet.
- No county fan-out. Central-TX stays HELD.
- Do not deploy Cloud Run unless promote requires it (batch is local → Neon).
- Cite this dispatch + baseline numbers in any PR (code only if a real bug blocks promote).
