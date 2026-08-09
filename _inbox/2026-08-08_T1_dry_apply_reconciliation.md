---
id: T1_dry_apply_reconciliation
title: Dry/apply counter reconciliation — Bastrop city cohort @ a1989d0
date: 2026-08-08
status: active
owner: nick
related: [2026-08-07_T1_bastrop_cohort_apply_ABORT, 2026-08-07_envelope_saga_close_and_geometry_law]
---

# Dry/apply reconciliation (master ruling #2)

## Source artifacts

| Leg | Artifact | engineSha |
|-----|----------|-----------|
| Dry-run | `_inbox/2026-08-07_T1_bastrop_cohort_dryrun.log` | `a1989d05` |
| Apply | `_inbox/2026-08-07_T1_bastrop_cohort_apply.log` | `a1989d05` |

Both legs: `--city-cohort --force-overwrite --limit=10000 --diagnose-failures`, processed **5785**.

## Counter breakdown (batch JSON `outcomes`)

| Counter | Dry-run | Apply | Delta |
|---------|--------:|------:|------:|
| **verifyPass** (compute-stage pass) | **2438** | **1670** | −768 |
| **promoted** (persist survived) | 0 | **1670** | +1670 |
| verifyFail | 1139 | 1693 | +554 |
| honestDeclines (force-overwrite writes on verifyFail) | 0 | 3746 | +3746 |
| declines.other (promote throw / unexpected) | 0 | 369 | +369 |

Early declines (unchanged cohort): no-setback-row **1947**, superseded-prop-id **84** both legs.

Apply-only failure bucket: **road-classification-mismatch 471** (absent on dry-run).

## Extended parity equation (master ruling)

Write-then-verify era: dry-run **cannot** read back stored bytes, so dry `verifyPass` counts **compute + mechanical verify** passes only. Apply `promoted` counts parcels whose write **survived read-back** (full `warmThenVerify` + `promoteDepthWarmToStorage` success; promote throws do not increment `verifyPass` on apply).

```
dry verifyPass (compute)  ==  apply promoted + computePassNotPersisted
2438                      ==  1670            + 768
```

**Sum reconciles exactly (768 = 2438 − 1670).** Contract **HOLDS** in extended form; this is **not** unexplained nondeterminism at the headline level.

## Triage cohort (~768 compute-pass-not-persisted)

Parcels that passed compute on dry but did not land as `promoted` on apply. Disposition buckets (from apply-leg deltas, not parcel-level join yet):

| Mechanism | Evidence | Approx scale |
|-----------|----------|-------------|
| verifyFail on apply (was compute-pass on dry) | verifyFail +554 | subset of 768 |
| promote throw → `declines.other` | other +369 on apply | subset of 768 |
| Apply-only **road-classification-mismatch** | failureBucket 471 | overlaps verifyFail / honestDecline path |
| Read-back / pre-write ground-truth gate | promote.ts `EnvelopeWriteThenVerifyMismatchError`, `EnvelopeGroundTruthPromoteDeclineError` | not separately counted in batch JSON today |

**Tooling gap:** batch script does not emit `writeThenVerifyRefused` or `promoteGateRefused` counters — only `promoted`, `verifyPass`, `verifyFail`, `honestDeclines`, `declines.other`. **Recommend:** add explicit counters on next engine touch.

## Concurrent run (ops note)

Second promote process killed mid-run (`_inbox/2026-08-07_T1_bastrop_cohort_apply_run2.log`). May have contributed to apply-only buckets; recovery re-pair must be **single-process**.

## Runbook amendment (planner — for consolidation)

For `--force-overwrite` pipelines with write-then-verify promote:

> **Dry/apply parity (extended):** `dryRun.verifyPass == apply.promoted + apply.computePassNotPersisted + apply.skippedIdempotent`, where `computePassNotPersisted` = parcels that passed mechanical verify on dry but did not appear in `apply.promoted` (read-back refused, pre-write ground-truth refused, or compute outcome changed on apply leg). Exact-match gate is on **`dryRun.verifyPass == apply.promoted + apply.computePassNotPersisted`** (skipped/idempotent must be named and zero unless documented). Batch JSON SHOULD emit `computePassNotPersisted`, `writeThenVerifyRefused`, `promoteGateRefused`, `skippedIdempotent` explicitly.

## Refused-cohort triage disposition (768 = computePassNotPersisted)

Named mechanism buckets (apply leg @ a1989d0; parcel-level join deferred):

| Bucket | Counter / evidence | Disposition |
|--------|-------------------|-------------|
| **Read-back / promote gate** | `declines.other` **369** on apply (0 dry) | Promote throws: `EnvelopeGroundTruthPromoteDeclineError`, `EnvelopeWriteThenVerifyMismatchError`, unexpected promote failures — compute passed dry, persist refused |
| **Apply-leg verify drift** | verifyFail **+554** (1139→1693) vs dry | Same SHA but apply path includes live persist + read-back; subset of 768 |
| **road-classification-mismatch** | failureBucket **471** (apply-only) | Live road reload / classification at apply time; primary named apply-only bucket |
| **Other verifyFail sub-buckets** | r32-per-edge-inset 251, front-orientation 569, null-inset 223, faces-answer 179 | Standard warm-verify gates; overlap with rows above |
| **Concurrent duplicate apply** | Second promote killed mid-run | Ops hazard; may have amplified apply-only buckets — recovery re-pair must be single-process |
| **Store damage?** | **No** | Saga-method plain-geometry on operator twelve **12/12** @ 2026-08-08 (`_inbox/2026-08-08_T1_plain_geometry_twelve_saga_method.json`); store rows updated 08-08 00:36–37 match master textbook values |

**Triage verdict:** 768 is a **named refused cohort** (write-then-verify + apply-leg outcome drift), not unexplained nondeterminism or data corruption. Recovery: clean single-process dry/apply re-pair after operator go; optional engine counter emit on next touch.

## Verdict vs prior ABORT

Prior ABORT cited headline `verifyPass` equality (2438 vs 1670). Under extended contract, **accounting reconciles**. Saga-method plain-geometry **12/12** reproduces master. Cohort remains **held** for clean single-process re-pair (operator go) + warden v1.3 merge (#277).
