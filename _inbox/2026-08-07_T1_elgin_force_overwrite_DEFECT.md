---
id: T1_elgin_force_overwrite_DEFECT
title: Elgin cohort re-persist BLOCKED — depth-warm-elgin-batch lacks --force-overwrite
date: 2026-08-07
status: open
owner: nick
severity: blocker
related: [2026-08-07_envelope_saga_close_and_geometry_law, 2026-08-06_T1_cohort_repersist_roster_checkpoint, factory_onboarding_runbook]
---

# Defect: Elgin re-persist cannot run — `--force-overwrite` not implemented

## Summary

Cohort re-persist mission (operator greenlit 2026-08-07) requires re-persisting **~1,977** Elgin promoted envelopes through the corrected pipeline at engine `a1989d0`. **`depth-warm-elgin-batch.mjs` does not parse or honor `--force-overwrite`.** Already-promoted parcels are skipped (`already-promoted` decline bucket). The runbook documents the flag; prior T1 artifacts claimed "force-overwrite" but apply logs prove 1,886 skips.

## Evidence

1. **Script source** @ `a1989d0`: `parseArgs` accepts only `--limit`, `--offset`, `--parcel`, `--promote`, `--dry-run`, `--city-cohort`. No `force-overwrite` branch; unknown tokens silently ignored.

2. **Live probe** (2026-08-07):  
   `depth-warm-elgin-batch --dry-run --limit=1 --parcel=48021:31299 --force-overwrite`  
   → completed with no unknown-flag error; flag had no effect.

3. **Prior apply** `_inbox/2026-08-06_T1_elgin_apply_1256277.log`:  
   `already-promoted: 1886`, `promoted: 91` — only net-new parcels written, not cohort re-persist.

4. **Parity reference**: `depth-warm-bastrop-batch.mjs` implements full `--force-overwrite` path (R28 ring recompute, boundary-edge persist, write-then-verify, honest-decline buckets, PARCEL-RING-SOURCE-DIVERGENCE reporting).

## Store-truth sizing (unchanged)

| Cohort | Store count |
|--------|------------:|
| Bastrop city (non-Elgin) | 2,026 |
| Elgin | 1,977 |
| FIPS 48021 total | 4,003 |

Artifact: `_inbox/2026-08-07_T1_cohort_repersist_roster_store.json`

## Required fix (fix lane — planner does NOT touch engine per mission rules)

Port Bastrop's `--force-overwrite` / `forceRepromote` / boundary-edge persist / write-then-verify / divergence-report path into `depth-warm-elgin-batch.mjs` (operate-not-rebuild: reuse same helpers, no parallel machinery). CI conclusion-string gate + block13 7/7 + twelve-parcel integration harness.

## Planner disposition

- **Bastrop cohort:** proceeding (dry-run → apply) on `depth-warm-bastrop-batch --city-cohort --force-overwrite`.
- **Elgin cohort:** **STOPPED** until this defect clears. Heavy-scan slot **NOT released** (both cohorts required for release).
- **Operator ruling requested:** greenlight fix-lane PR for Elgin force-overwrite parity (estimated: mechanical port from bastrop batch, single script + tests).
