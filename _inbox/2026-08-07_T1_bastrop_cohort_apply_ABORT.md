---
id: 2026-08-07_bastrop_cohort_apply_abort_dry_apply_drift
title: Bastrop cohort apply ABORT — dry/apply verifyPass drift (2438 vs 1670)
date: 2026-08-08
status: active
owner: nick
related: [2026-08-07_envelope_saga_close_and_geometry_law, 2026-08-07_T1_cohort_repersist_PLANNER_STATUS]
---

# Bastrop cohort apply — ABORT (dry/apply gate failed)

## Verdict

**ABORT.** Apply leg **does not close** the Bastrop cohort re-persist. Exact-match gate failed:

| Leg | verifyPass | promoted | honestDeclines | engineSha |
|-----|----------:|---------:|---------------:|-----------|
| Dry-run | **2438** | 0 (field) | **0** | `a1989d0` |
| Apply | **1670** | **1670** | **3746** | `a1989d0` (same) |

**Delta:** −768 verifyPass. **dryRunApplyMatch: false.** Per runbook identical-SHA pair law, the pair is **VOID** — do not cite apply as cohort close.

## block13 regression

Post-apply mechanical block13: **7/7** (`_inbox/2026-08-07_T1_block13_post_bastrop_apply.json`). Substrate regression gate held; this does NOT override dry/apply parity.

## Store state after partial apply

- Store roster at apply start: **4003** promoted (unchanged count query).
- Apply wrote **1670** re-promotes + **3746** honest-decline overwrites under `--force-overwrite`.
- **New failure bucket on apply only:** `road-classification-mismatch` **471** (absent from dry-run failureBuckets).
- `no-road-adjacency` declines dropped dry **116** → apply **14** (symptom of mid-run store mutation or concurrent interference).

## Concurrent run (ops hazard)

A **second** `--city-cohort --force-overwrite --promote` process was started and killed ~3 min into the primary apply. Partial writes from the duplicate may have contributed to drift. **Standing rule for recovery:** exactly **one** heavy-scan writer on atoms Neon; kill-check before any re-run.

## Recovery procedure (planner — not auto-executed)

1. Confirm no stray `depth-warm-bastrop-batch` processes on operator machine / CI.
2. **Fresh store-truth roster query** — partial apply changed envelope/decline bodies; do not reuse 2438 target.
3. **Fresh dry-run** @ pinned `a1989d0` (or newer main if a fix lands), single process, `--city-cohort --force-overwrite --dry-run --limit=10000 --diagnose-failures`.
4. **Apply only** when dry-run completes cleanly and no concurrent slot holder exists; same SHA both legs.
5. If dry-run/apply drift reproduces on a **clean single-process pair**, **STOP** — file engine defect with evidence (apply-only `road-classification-mismatch` + honestDecline write path); fix lane separate from data re-run.

## Slot / Elgin

Heavy-scan slot **remains HELD**. Elgin cohort **not started** until Bastrop closes with valid dry/apply parity + full verification pack.

## Post-apply verification (partial — cohort NOT closed)

From [Bastrop cohort apply+verify](e7562f26-df5a-4086-948a-7f0d97452acf) — recorded for diagnosis; **does not override ABORT**.

| Instrument | Result | Artifact |
|------------|--------|----------|
| Twelve-parcel integration harness | **12/12** pass | vitest @ a1989d0 |
| block13 post | **7/7** | `_inbox/2026-08-07_T1_block13_post_bastrop_apply.json` |
| Plain-geometry sweep (1.6 ft) | **INVALID instrument** — prior sweep used block13 R32 cert-grade (`_build_plain_geom.mjs`), not saga method. **Corrected 2026-08-08:** saga-method sweep **12/12** (shared parcel projection frame fix) | `_inbox/2026-08-08_T1_plain_geometry_twelve_saga_method.json`; prior `_inbox/2026-08-07_T1_bastrop_plain_geometry_sweep.json` **VOID** |
| Warden v1.2 (partial) | **23 findings** (neighbor 4, servePath 10, crossStore 8, envelopeSanity 1); ledger POST **200** | `_inbox/2026-08-07_T1_bastrop_warden_post_apply.json` |
| Warden v1.3 `serveTruthEdgeLabels` | **NOT RUN** — `column "situs_addr" does not exist` on txgio query | `_inbox/2026-08-07_T1_bastrop_warden_post_apply_run.log` |
| Render pack | Post-apply SERVED only (`beforeApplyServed: null`) | `_inbox/2026-08-07_T1_bastrop_render_pack_sample.json` |
| Batch `--upsert-ledger` | **Not confirmed** in apply log | — |

Plain-geometry **instrument defect corrected** — store healthy on operator twelve (master + saga sweep agree). Warden findings reflect partial apply store state. Do not use warden/render as cohort-close grades until re-pair completes.

## Dry/apply accounting (master ruling #2, 2026-08-08)

Extended contract **HOLDS:** `2438 == 1670 + 768` (`computePassNotPersisted`). Not headline nondeterminism. Full breakdown: `_inbox/2026-08-08_T1_dry_apply_reconciliation.md`.

## Tooling open items (fix lane)

1. **WARDEN-SITUS-ADDR** — **CLEARED** — PR #277 merged @ `dba7a82` (2026-08-08). Re-run v1.3 warden with `--cert-artifact` on recovery verify pack.
2. **DRY-APPLY-PARITY-DRIFT** — apply-only `road-classification-mismatch` (471) + honestDecline writes; investigate write-path cross-talk vs dry-run.

## Artifacts

- `_inbox/2026-08-07_T1_bastrop_cohort_dryrun_summary.json`
- `_inbox/2026-08-07_T1_bastrop_cohort_apply_summary.json`
- `_inbox/2026-08-07_T1_bastrop_cohort_apply.log`
- `_inbox/2026-08-07_T1_bastrop_cohort_apply_run2.log` (killed duplicate)
- `_inbox/2026-08-07_T1_block13_post_bastrop_apply.json`
- `_inbox/2026-08-07_T1_bastrop_plain_geometry_sweep.json`
- `_inbox/2026-08-07_T1_bastrop_warden_post_apply.json`
- `_inbox/2026-08-07_T1_bastrop_render_pack_sample.json`
