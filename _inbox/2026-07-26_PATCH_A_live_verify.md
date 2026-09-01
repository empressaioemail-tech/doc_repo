---
id: 2026-07-26_PATCH_A_live_verify
title: PATCH-A live verify (pre-promote) — 28286 four cases
status: evidence
date: 2026-07-26
pr: https://github.com/empressaioemail-tech/hauska-engine/pull/136
merge: 12ab8a1ebf6cad1cfc6f5663dde5f2db233aaa0c
---

# PATCH-A live verify (code merged; promote in flight)

## Implementation

`cleanClipRingArtifacts` in `polygon-inset.ts`: removes U-turn spikes and non-adjacent edge-touch vertices when area is preserved (≥99%). Called from `insetRingMeters` before return. `ringHasSelfTouch` unchanged (still fail-closed).

PR [#136](https://github.com/empressaioemail-tech/hauska-engine/pull/136) merged `12ab8a1e`. vitest **303/303**. CI green.

## Four cases (live)

| Case | BEFORE | AFTER |
|------|--------|-------|
| 28286 front@edge2 15′ | empty (`setbacks exceed the lot`) | **7316** sqft |
| 28286 uniform 15′ | 3206 | **3206** |
| Honest-irregular `48021:47759` uniform 15′ | empty | **still empty** |
| Genuine self-touch ring → `isInsetDegenerate` | reject | **still reject** |

28286 all edges front-only 15′: 7316 / 6160 / 7316 / 6160 (none empty).

## Promote

Place-type re-promote running (baseline **2712/3657=74.16%**). Check-in with new ceiling when complete.
