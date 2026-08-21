# Class B root-cause diagnosis (2026-08-03)

## Parcels: 48021:28855, 48021:30857

| Parcel | TXGIO ring verts | BCAD ring verts | Stored primitive edges |
|---|---|---|---|
| 48021:28855 | 7 | 8 | 7 |
| 48021:30857 | 6 | 8 | 6 |

## Root cause

Cert uses **BCAD ring** (correct for R10 live truth). Stored boundary primitive was built against **TXGIO ring** (fewer vertices). When `storedEdges.length < openRing(bcad).length`, cert **drops the primitive** (`boundaryEdges = null`) and only attempted `computeWarmCandidateFromBoundary` — yielding **empty candidate** → setback/orientation engine gates fail despite valid stored envelope (R32 passes on persisted inset).

**Warm batch** (`depth-warm-bastrop-batch.mjs`) hits the same edge-count mismatch but **falls through** to `computeWarmCandidate` with fresh `labelEdgesFromRoads` edge labels (road-label inset path, no stored primitive). That path produced the valid promoted candidate.

This is NOT "trust stored over recompute." Fix: cert must use the **same candidate derivation ladder as warm** — R28 recompute when counts match but normals disagree; **road-label `computeWarmCandidate` fallback** when primitive edge count ≠ BCAD ring.

## Fix (merged PR)

1. **Class A (8741972/73/74):** R35 extended — null situs → orientation honest-decline, cert PASS.
2. **Class B (28855/30857):** block13-cert-grade adds R28 + `computeWarmCandidate` fallback matching warm batch.

## Live probe (5-parcel roster post-fix)

```
blockPass: true (28855, 30857, 8741972, 8741973, 8741974 all pass)
```

Log: `_scratch/phase-c-class-b-diagnosis.log`, five-fail probe in terminal 691228.
