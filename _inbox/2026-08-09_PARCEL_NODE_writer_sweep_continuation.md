---
title: Parcel-Node Writer Sweep — Continuation (2026-08-09)
date: 2026-08-09
status: in-progress
author: data-run-executor (Composer, hauska-engine)
memory_graded: false
---

# Parcel-Node Writer Sweep — Continuation (2026-08-09)

Operator-authorized 2026-08-09. Executed directly against `packages/engine-core/scripts/write-parcel-node-county.mjs` on hauska-engine. Direct Neon hosts only (pooler stripped). No merge, no deploy, no TxGIO acquisition, no VACUUM, no lock on `txgio_parcel`. This lane READs `txgio_parcel` and WRITEs atoms only.

## Store-truth sizing at execution (Geometry Law rule 8)

| Metric | Value |
|---|---|
| Counties with `txgio_parcel` rows | **195** |
| Raw tile rows | 13,877,175 |
| Distinct features | 12,186,772 |
| Counties with `parcel-node` atoms (pre-run) | **63** |
| Active parcel-node atoms (pre-run) | 542,688 |
| Delta (geometry present, no active atoms) | **132** |

Verified with direct SQL against both stores after stripping `-pooler` from `DATABASE_URL` (hauska-prod → `hauska_mcp`) and `DEPLOYMENT_DATABASE_URL` (legacy-design-tools-prod → `neondb`). `transaction_read_only = off` on the atoms store before any write.

Queue = store delta, smallest-first by feature count. First remaining county sits at ~14,975 features (prior sessions already landed the <15k set, including Wilbarger repair).

## Manifest before

`GET https://cortex-api-tds7av26va-uc.a.run.app/api/county-ledger`

- `texasCompletenessPct` = **0.2133771830027867**
- `satisfiedCells` = 38 / 3048
- Kenedy 48261 geometry: `satisfied-present` 98.33% `source=parcel-node-atom-count` (rail wiring confirmed live)

## Run posture

Automated dry→apply wrapper at `P:\tmp\parcel_node_sweep_20260809\run_sweep.mjs`.

Rules enforced:

1. Dry before every apply.
2. Dedup tripwire: halt if dry predicts near row count rather than feature count.
3. Halt on dry/apply mismatch.
4. `ECONNRESET` → record + idempotent re-run (up to 2 retries), not a silent continue.
5. Manifest re-check every 10 counties landed this session.

## Progress (LIVE — update at close)

As of mid-run checkpoint (will be overwritten at halt/finish):

- Landed this session: see `P:\tmp\parcel_node_sweep_20260809\progress.json`
- Failed: 0
- ECONNRESET events: 0 so far
- Session atoms written: climbing (~475k at ~27 counties)
- Checkpoints 10 and 20: `texasCompletenessPct` **unchanged at 0.213377…** and `satisfiedCells=38`

## FINDING: atom writes alone do not move the live ledger number

After 10 and 20 clean landings, the County Manifest headline did not climb. Spot-check after atom-verified writes:

| FIPS | Store atoms (SQL) | geometry `displayState` | `hasWriter` | `source` / `lastVerifiedAt` |
|---|---|---|---|---|
| 48389 (new) | 13,977 active | `not-yet` | true | empty |
| 48399 (new) | 12,982 active | `not-yet` | true | empty |
| 48261 Kenedy (prior) | present | `satisfied-present` | true | `parcel-node-atom-count` @ 2026-08-09 12:26Z |
| 48003 Andrews (prior) | present | `satisfied-present` | true | `parcel-node-atom-count` @ 2026-08-09 12:25Z |

Interpretation: the geometry rail **is** wired to `parcel-node` counts (unlike the 2026-08-08 sweep finding), but scoring is a separate sweep (`countyGeometryScoreCli.ts` / `verifiedByInstrument`). New counties sit at `not-yet` with `hasWriter=true` until rescored. Moving `texasCompletenessPct` requires a geometry score pass after atom writes — outside this authorization (atoms only).

## Artifacts

- Sizing: `P:\tmp\parcel_node_sweep_20260809\sizing.json`
- Progress: `P:\tmp\parcel_node_sweep_20260809\progress.json`
- Per-county dry/apply JSON: `P:\tmp\parcel_node_sweep_20260809\<fips>_{dry,apply}.json`
- Runner log: `P:\tmp\parcel_node_sweep_20260809\runner.log`
- Scratch: `_scratch/parcel_node_writer_sweep.md`

## Status note

This file is the running continuation report. Final section (attempted/landed/failed totals, independent SQL atom total, manifest after, full per-county table) is written when the queue completes or the run halts.
