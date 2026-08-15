---
date: 2026-08-06
track: T1-WS1
engine_repo: empressaioemail-tech/hauska-engine
depends_on: _dispatches/2026-08-06_T1_promote_persist_boundary_edges.md
acceptance_items: [WS1-W1, WS1-W2, WS1-W3]
---

# Dispatch — Warden v1.3 serveTruthEdgeLabels

## WDLL items

| ID | Acceptance |
|----|------------|
| WS1-W1 | New Warden checkId `serveTruthEdgeLabels` in `warden-sweep.mjs` default set for zoned-city sweeps |
| WS1-W2 | Per sampled parcel (or `--cert-artifact` roster): run cert-equivalent edge labeling; run `prepareBoundaryEdgesForExport` on stored atoms; flag when any cert-graded edgeIndex role != served role |
| WS1-W3 | defectClass `CERT-VS-SERVE-EDGE-MISMATCH`; files never fixes; included in post-cert sweeps alongside `envelopeSanity` |

## Behavior

Mirrors the interim probe in `operator-twelve-serve-truth.mjs` but as a standing Warden check:

1. Fresh `labelEdgesFromRoads` (cert path) → edge labels by index.
2. Export serve path → `prepareBoundaryEdgesForExport` → served roles by index.
3. Compare at each cert edge index; also compare front edge index.
4. Pass when zero mismatches on promoted parcels; honest warm-verify declines skip.

## WS1 close contract

Operator twelve must pass this check **12/12** after scoped re-persist. WS1 does not close on one-off probe JSON alone.

Smoke-suite equivalent: acceptable if `product-surface-smoke.mjs` gains the same comparison on operator twelve + block13 roster and runs on shared-code deploy.

## References

- v1.2 precedent: `envelopeSanity` (#256), factory runbook §4
- OPS-5 Warden v1.3 section
