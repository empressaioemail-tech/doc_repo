---
id: 2026-07-26_guard_vs_interior_and_boundary_primitive
title: Finding — GUARD bug on 28286 (PATCH-THEN-BUILD) + boundary primitive buildable
status: finding
date: 2026-07-26
planner: depth-engine planning agent
read_only: true
parent: _inbox/2026-07-26_geom_empty_832_ceiling_verdict.md
---

# GUARD vs INTERIOR + boundary-primitive buildability

## Question A — verdict: **A1 GUARD BUG** → recommend **PATCH-THEN-BUILD**

On live `48021:28286`, for front-only 15′ on the bad edge (edge **2**), `insetRingMeters` produces a **non-empty, correct-area interior** (~7316 sqft, same as the good edge). The public path empties only because `isInsetDegenerate` returns true on **`ringHasSelfTouch`**. Inward normals on all four edges point toward the centroid (`probeInInsideParcel=true`). This is not an interior/orientation inversion.

Boundary primitive remains the durable model (next); the 461 recovery is unblocked by a **contained guard/cleanup patch**, not by waiting on the primitive.

### Live evidence — parcel frame

```
parcelSignedAreaM2 = 763.252  (CCW = true)
centroid inside     = true
```

| Edge | Role in prior warm | nrm toward centroid? | probeIn inside? |
|------|--------------------|----------------------|-----------------|
| 0 | good front-only | yes (+20.9) | true |
| 1 | side | yes | true |
| 2 | **bad front (warm)** | yes (+20.9) | true |
| 3 | side_corner | yes | true |

Inward direction is **not** flipped on edge 2.

### Edge 0 (good) — intermediate inset ring (metres, open)

`insetRingMeters` → area **679.71 m² ≈ 7316 sqft**; `isInsetDegenerate=false`.

```
(-9.140, -20.883)
( 9.132, -20.887)
( 9.140,  16.311)   ← north boundary pulled south by 15'
(-9.133,  16.315)
```

Clean 4-vertex rectangle. `perEdgeOffsetPlausible=true`, `selfTouch=false`.

### Edge 2 (bad) — intermediate inset ring (metres, open)

`insetRingMeters` → area **679.711 m² ≈ 7316 sqft** (same interior); `isInsetDegenerate=true`.

```
(-9.140, -20.883)
(-9.139, -16.311)   ← inset line
( 9.133, -16.315)
( 9.132, -20.887)   ← original south edge retained → zero-width spike
( 9.140,  20.883)
(-9.132,  20.887)
```

Guard breakdown (edge 2):

| Predicate | Result |
|-----------|--------|
| insetNull | **false** |
| insetAreaSqFt | **7316.3** |
| signedAreaPositive | true |
| areaTooSmall | false |
| selfIntersects | false |
| **selfTouch** | **true** ← rejecting predicate |
| anyVertexOutside | false |
| perEdgeOffsetPlausible | **true** |
| isInsetDegenerate | **true** |

Public `insetPerEdge` emptyReason: `"setbacks exceed the lot — no buildable area remains"` (from `depth-warm/geometry.ts` after `isInsetDegenerate`).

### Exact guard citation

```278:292:packages/engine-core/src/geometry/polygon-inset.ts
export function isInsetDegenerate(
  orig: PlanarPoint[],
  inset: PlanarPoint[],
  insetMetersPerEdge: number[],
): boolean {
  const insetArea = signedArea(inset);
  if (insetArea <= 0) return true;
  if (insetAreaTooSmall(orig, inset)) return true;
  if (ringSelfIntersects(inset)) return true;
  if (ringHasSelfTouch(inset)) return true;  // ← edge 2 fails here
  // ...
  if (!perEdgeOffsetPlausible(orig, inset, insetMetersPerEdge)) return true;
  return false;
}
```

`ringHasSelfTouch` is defined at `polygon-inset.ts` ~217. `perEdgeOffsetPlausible` is **not** the failing predicate here.

### Candidate naming

**A1 — GUARD BUG.** Offset interior is fine; clip result is topologically dirty (self-touch spike retaining the original edge); guard treats that as “setbacks exceed the lot.”

**Not A2:** `insetRingMeters` does not return null, inverted area, or wrong-side geometry for edge 2.

### Fix shape (recommendation)

**PATCH-THEN-BUILD**

1. **Now (patch):** After `insetRingMeters`, simplify/clean clip artifacts (drop zero-width spikes / collinear self-touches) **or** do not fail-closed solely on `ringHasSelfTouch` when area, containment, and `perEdgeOffsetPlausible` pass; add R0 fixture `48021:28286` front@edge2 → ~7316 sqft. Expected recovery toward the 461 SHOULD-DRAW class.
2. **Next (build):** Adjacency-aware boundary primitive (stored per-line kind + authoritative inward) so setbacks are not road-proximity-only. Do not block the patch on the primitive.

Central-TX remains **HELD** until the patch lands and residual is reclassified.

---

## Question B — boundary primitive **buildable now** from live data (with one infra gap)

### B4 — authoritative interior (once from ring)

Live on 28286 / 34785 / 33512:

```
signedArea > 0 (CCW)
centroid pointInOrOnPolygon = true
inwardNormal = (-dy, dx) / len   // left of directed CCW edge
```

Computable once per ring; **not currently stored** as a boundary atom (re-derived every inset). No gap in math — gap is persistence/productization.

### B1 — parcel-to-parcel adjacency

`txgio_parcel.geometry` is **jsonb GeoJSON**, not a PostGIS geometry column. Neon has **no** `ST_GeomFromGeoJSON` in this database (`function st_geomfromgeojson(text) does not exist`). Spatial adjacency is still buildable:

- App-level: outward probe (~3 m) + bbox filter on `west_lng/east_lng/south_lat/north_lat` + neighbor ring PIP / distance (used live below), **or**
- Future: enable PostGIS + typed geometry column for indexed `ST_DWithin`.

Live bbox-adjacency on **48021:28286**:

| Edge | Kind | Neighbor |
|------|------|----------|
| 0 | UNMAPPED (rear label, no neighbor hit) | — |
| 1 | **PARCEL-TO-PARCEL** | `32341` |
| 2 | MIXED road front + parcel | `35671` + residential front |
| 3 | PARCEL-TO-ROAD side_corner | residential (no parcel neighbor) |

**34785:** edges 0,1 parcel neighbors (`34801`, `34769`); edge 3 front unclassified + neighbor `34777`; edge 2 UNMAPPED.

**33512 (714 Spring):** parcel neighbors on 1,2; alley rear + residential front with mixed neighbors; edges 0,5 UNMAPPED.

B1 **resolves for real parcels** without PostGIS.

### B2 — parcel-to-road

Already live via road-node atoms + `labelEdgesFromRoads` (FIX 2.1 path, 4894 roads). Frontage + class available per edge (shown above).

### B3 — unmapped

Observed (e.g. 28286 edge 0, 34785 edge 2, 33512 edges 0/5): neither neighbor parcel nor road class → honest **UNMAPPED** (rural frontage / data gap / alley-not-matched). Primitive must keep this as a first-class state, not invent a setback.

### B buildability summary

| Piece | Buildable now? | Gap |
|-------|----------------|-----|
| Interior + per-edge inward | **Yes** (ring winding + PIP) | Not stored as atom yet |
| Parcel-parcel adjacency | **Yes** (jsonb rings + bbox) | No PostGIS index; app-side for now |
| Parcel-road adjacency | **Yes** (road-nodes) | — |
| Unmapped | **Yes** (residual state) | — |

**Primitive is buildable from live parcel+road data.** Gap is engineering (persist boundary edges; optional PostGIS), not missing source data.

---

## Recommendation (binary)

| Item | Call |
|------|------|
| A | **GUARD** — patch `ringHasSelfTouch` / clip cleanup; fixture 28286 |
| Sequence | **PATCH-THEN-BUILD** (recover ~461, then boundary primitive) |
| B | Primitive **buildable now**; jsonb adjacency sufficient; PostGIS optional later |
| Central-TX | **HELD** until patch + reclassify |

No code fix in this diagnostic. No promote. No CTX fan-out.
