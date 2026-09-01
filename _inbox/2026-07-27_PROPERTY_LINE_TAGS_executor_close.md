---
id: 2026-07-27_PROPERTY_LINE_TAGS_executor_close
title: Executor close — Computed property-line-tags on Bastrop boundary edges
status: check-in
date: 2026-07-27
executor: cursor agent (PROPERTY-LINE-TAGS)
dispatch: _dispatches/2026-07-27_PROPERTY_LINE_TAGS_bastrop.md
governs_wdll: _inbox/2026-07-27_PROPERTY_LINE_TAGS_bastrop_WDLL.md
acceptance: [1, 2, 3, 4, 5, 6]
---

# PROPERTY-LINE-TAGS executor close

Planner verifies LIVE and owns M0 promotion. Executor does **not** claim WDLL done. CTX HELD. No depth-warm promote. No Hays.

## WDLL grades (self-proposed — planner verifies)

| # | Self-proposed | Evidence |
|---|---------------|----------|
| 1 Compute + attach | **PROPOSE MET** | `computeBoundaryEdgeAtoms` emits `propertyLineTags` from `interior.edgeEndpoints` via shared helper. Live substrate tally **26454/26454** Bastrop edges with tags + honesty. |
| 2 Anti-fabrication | **PROPOSE MET** | Vitest RED without GIS-approx negation; atom honesty = `GIS-approximate — not a survey`; PDF keeps `PROPERTY_LINE_TAGS_HONESTY`. |
| 3 Geometry sanity (gold) | **PROPOSE MET** | 28286 opposite sides ~180° reciprocal; lengths ~60′ / ~137′. Paste below. Spot-check 33512/34785 tags computed in backfill sample. |
| 4 CC surface | **PROPOSE PARTIAL** | AtomInspector already reads `propertyLineTags` + GIS-approx pill (CC-A). Field now populated on live atoms. **Planner owes live CC walk** (no map PR; no UI invent). |
| 5 PDF surface | **PROPOSE MET** | PDF re-exports same shared `formatGisBearing` / honesty; layout tests still green. |
| 6 Bounded / depth untouched | **PROPOSE MET** | Backfill patches tags only (no depth-warm / no CTX). Script: `backfill-property-line-tags-bastrop.mjs`. |

## Pasted tags (gold parcel — all edges)

### 48021:28286 (live substrate after backfill)

| edge | bearing | distanceFeet | honesty |
|------|---------|--------------|---------|
| 0 | N 89°59' W | 59.9495 | GIS-approximate — not a survey |
| 1 | S 0°01' W | 137.0424 | GIS-approximate — not a survey |
| 2 | S 89°59' E | 59.9489 | GIS-approximate — not a survey |
| 3 | N 0°01' E | 137.0424 | GIS-approximate — not a survey |

Opposite sides reciprocal (0↔2, 1↔3 ≈ 180°). Near-rect ~60×137′ matches ring.

### Spot-check (backfill sample, not full paste)

**33512:** e0 S 88°46' W 153.7′; e1 S 0°12' E 79.8′; e2 S 0°26' E 25.7′; e3 S 0°26' E 62.2′; e4 N 89°14' E 152.7′; e5 N 0°01' E 168.9′.

**34785:** e0 S 89°13' W 98.0′; e1 S 1°21' E 163.5′; e2 S 89°58' E 98.3′; e3 N 1°26' W 164.9′.

## PRs + SHAs

| Item | Value |
|------|-------|
| Engine PR | https://github.com/empressaioemail-tech/hauska-engine/pull/150 |
| Branch | `feat/property-line-tags-bastrop` |
| SHA | `d366473f8f61080edbc01ed2836437b8a3579908` (feat `864f7cd` + pin fix) |
| CI | **green** (`typecheck + test` SUCCESS on run 30278042400) |
| hauska-map | **no PR** (inspector already wires `propertyLineTags`) |

## Local / live evidence

```
pnpm --filter @hauska-engine/engine-core test -- src/boundary-primitive src/site-plan/pdf/__tests__/layout.test.ts
Test Files  4 passed
Tests  30 passed | 2 skipped
```

Live tally (substrate SELECT after backfill):

```
total=26454  with_tags=26454  honest=26454
```

Backfill: gold 14 edges then county-missing 21754 (prior gold already tagged). Wall ~556s batched.

## Design notes

- Shared module: `packages/engine-core/src/geometry/gis-property-line-tags.ts`
- PDF `annotation-placement.ts` re-exports shared helpers (no second formula).
- `interior.edgeEndpoints` are **local-ENU metres** (centroid `projectRing`), not lng/lat — tags compute dx/dy directly.
- Atom honesty string: `GIS-approximate — not a survey` (machine-checkable). PDF honesty remains the longer Track B line; both pass the GIS-approx guard.

## Scratch LESSON / DEAD-END / GROUND-TRUTH / OPEN

```
LESSON (PROPERTY-LINE-TAGS 2026-07-27): boundary interior.edgeEndpoints are
  local-ENU metres from depth-warm projectRing (centroid), NOT WGS84 lng/lat.
  Compute tags from dx/dy directly; do not re-project as lng/lat.
LESSON: lift formatGisBearing to geometry/gis-property-line-tags — PDF and
  atoms must import the same module or they will drift.
DEAD-END: presenting GIS tags as survey-grade (FAIL). Survey = courthouse/plat = v2.
DEAD-END: row-by-row UPDATE of 26k edges (~7+ min hung); use Promise.all batches.
GROUND-TRUTH (2026-07-27T15:00Z approx): engine PR #150 SHA 864f7cd;
  live Bastrop boundary_edges with_tags=26454/26454 honesty present;
  gold 28286 tags pasted in executor close. CTX HELD. No depth-warm.
OPEN: planner live-verify WDLL 1–6 + CC inspector walk on gold edge;
  merge gate on CI green. Builder does not claim done.
```

## Negative done-line check

- Not claimed survey-grade.
- Depth write-path not rewritten.
- CTX / Hays not opened.
- Do not merge. Do not claim done.
