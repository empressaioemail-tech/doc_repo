---
registered: 2026-08-09T20:30:00Z
reviewer: independent (F5 roads-unblock lane)
subject: two-county diagonal boundary — both-sides assertion (PRE-REGISTERED before run)
---

# Pre-registered expectation: county-line-running ways land in BOTH counties

This file is filed **before** the H2 test run per F5 handoff. The reviewer must not edit it after the run.

## Geometry

Shared TIGER-style diagonal county boundary from **(-97.40, 30.00)** to **(-97.20, 30.20)** (realistic Central Texas WGS84, not unit squares).

| County | FIPS | Side of diagonal |
|--------|------|------------------|
| West (Bastrop proxy) | 48021 | west / below line |
| East (Caldwell proxy) | 48055 | east / above line |

## Test ways

200 short ways running **along** the shared diagonal with **±3×10⁻⁵° jitter** (~3 m survey disagreement).

## Pass criteria (ALL required)

1. **≥99%** of jittered along-line ways resolve to **exactly two counties** (48021 AND 48055).
2. **0%** resolve to exactly one county only (coin-flip failure mode from adversarial review).
3. **0%** resolve to neither county.
4. Basis may be `segment-crosses-boundary` or `vertex-inside` / `midpoint-inside`; the invariant is **both FIPS present**, not the basis label.

## Fail criteria

- Any run where single-county share exceeds 1% on the jittered sweep.
- Any use of axis-aligned unit-square fixtures as the sole boundary proof.
