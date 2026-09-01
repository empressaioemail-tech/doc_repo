---
id: 2026-07-26_geom_empty_832_ceiling_verdict
title: Finding — 832 geometry-empty residual is NOT an honest ceiling (FIX-FIRST)
status: finding
date: 2026-07-26
planner: depth-engine planning agent
read_only: true
governs: Central-TX greenlight gate after FIX 2.1
---

# Verdict: FIX-FIRST — do not greenlight Central-TX

**74.16% is not the honest ceiling.** The 832 “geometry-empty” bucket hides a large **SHOULD-DRAW** class: near-rectangular lots where asymmetric front-only inset collapses while uniform inset succeeds. Same bug family that previously hid under “geometry-empty” for 1009 Chestnut (then on site-plan); this time it is on the **depth-warm** `insetPerEdge` path after FIX 2.1 labeling is correct.

Central-TX stays **HELD**.

---

## Live baseline (verbatim)

```
depth_warm_promoted = 2712
zoning_place_type   = 3657
ratio               = 74.16%
roadsLoaded         = 4894   (FIX 2.1 batch path)
cityUnwarmed        = 942
```

Read-only re-pass of city place-type unwarmed (no promote):

```
processed        942
no-road          110
geometry-empty   832
would-promote      0
no-geometry        0
```

Matches FIX 2.1 residual. Classifier: FIX 2.1 `labelEdgesFromRoads` + `computeWarmCandidate` on live txgio rings.

---

## Classification of all 832 (not a thin sample)

Every geometry-empty parcel was scored (wall ~105s). Metrics in local equirectangular metres via `projectRing`: rectangularity = area/bbox, convexity = area/convex-hull, vertex count, min edge ft, min bbox dimension ft. Capability probe: front-only 15′ on the labeled front edge via `insetPerEdge`.

| Bucket | Count | % of 832 |
|--------|------:|---------:|
| **(a) HONEST-IRREGULAR** | **371** | **44.6%** |
| **(b) SHOULD-DRAW** | **461** | **55.4%** |

**SHOULD-DRAW rule (mechanical):** `nVerts ≤ 6` AND rectangularity ≥ 0.82 AND convexity ≥ 0.95 AND minEdge ≥ 8′ AND minDim > 2× max applied inset (floor 15′) AND warm empty — including cases where front-only 15′ also empties (geometry/offset leak) or front-only succeeds while multi-edge warm fails (setback-resolution class; none dominated this pass).

**HONEST-IRREGULAR:** not near-rect (high vertex count / low rectangularity / survey sliver minEdge) OR genuinely narrow vs applied setback (`minDim ≤ 2× maxInset`).

### Stratified sample (≥30, P-1..P-5) — pasted metrics

| id | PT | bucket | n | rect | conv | minDim′ | minEdge′ | area | maxInset | front | frontOnly15 |
|----|----|--------|--:|-----:|-----:|--------:|---------:|-----:|---------:|-------|-------------|
| 48021:47759 | P-1 | HONEST | 97 | 0.894 | 0.938 | 2406 | 0.06 | huge | 25 | res@64 | empty |
| 48021:34682 | P-2 | **SHOULD** | 4 | 0.971 | 1.000 | 171.6 | 167.3 | 37028 | 25 | res@2 | empty |
| 48021:8733377 | P-2 | HONEST | 4 | 0.971 | 1.000 | 46.4 | 45.2 | 5844 | 25 | res@1 | empty (narrow) |
| 48021:8733287 | P-2 | HONEST | 4 | 0.944 | 1.000 | 47.3 | 45.0 | 5716 | 25 | res@2 | empty (narrow) |
| 48021:23168 | P-2 | HONEST | 10 | 0.857 | 0.937 | 402 | 0.01 | 269970 | 25 | maj@3 | empty |
| 48021:28286 | P-3 | **SHOULD** | 4 | **0.999** | 1.000 | 60.0 | 60.0 | 8216 | 15 | res@2 | **empty** |
| 48021:85056 | P-3 | **SHOULD** | 4 | 0.973 | 1.000 | 66.7 | 65.3 | 7826 | 15 | res@3 | empty |
| 48021:81867 | P-3 | **SHOULD** | 4 | 0.971 | 1.000 | 63.1 | 61.6 | 7696 | 15 | min@3 | empty |
| 48021:34961 | P-3 | **SHOULD** | 5 | 0.954 | 1.000 | 82.3 | 77.0 | 16791 | 15 | min@2 | empty |
| 48021:28903 | P-3 | **SHOULD** | 5 | 0.938 | 1.000 | 120.5 | 94.9 | 28912 | 15 | min@0 | empty |
| 48021:33526 | P-4 | **SHOULD** | 5 | 0.991 | 1.000 | 65.5 | 10.7 | 6551 | 15 | res@1 | empty |
| 48021:33993 | P-4 | **SHOULD** | 4 | 0.976 | 1.000 | 83.2 | 81.0 | 13822 | 15 | unc@3 | empty |
| 48021:48774 | P-4 | **SHOULD** | 4 | 0.942 | 1.000 | 68.3 | 65.1 | 7842 | 15 | res@0 | empty |
| 48021:28015 | P-4 | **SHOULD** | 4 | 0.926 | 1.000 | 58.3 | 53.4 | 7466 | 15 | min@2 | empty |
| 48021:34153 | P-5 | **SHOULD** | 4 | 0.973 | 1.000 | 96.7 | 95.1 | 9539 | 15 | res@3 | empty |
| 48021:112368 | P-5 | **SHOULD** | 6 | 0.964 | 0.993 | 201.8 | 10.0 | 54190 | 15 | maj@4 | empty |
| 48021:47626 | P-5 | **SHOULD** | 4 | 0.955 | 1.000 | 52.8 | 50.3 | 4264 | 15 | maj@1 | empty |
| 48021:66291 | P-5 | **SHOULD** | 4 | 0.934 | 1.000 | 53.5 | 50.1 | 8362 | 15 | maj@0 | empty |
| 48021:33904 | P-5 | HONEST | 10 | 0.992 | 0.999 | 87.1 | 11.6 | 14703 | 15 | res@1 | empty |
| 48021:32588 | P-5 | HONEST | 7 | 0.730 | 0.998 | 166.5 | 1.32 | 33556 | 15 | res@3 | empty |

(Full 36-row stratified dump was produced in the live run; table above is the load-bearing spread. Population counts 371 / 461 are from **all 832**, not extrapolated from 36.)

**Extrapolation caveat:** none required for the split — **100% of the 832 were classified**. Est. recoverable ≈ **461**.

---

## Root-cause specimen: `48021:28286` (P-3)

### Shape

Near-perfect rectangle: n=4, rectangularity **0.999**, convexity **1.0**, ~60′ × 137′, area 8216 sqft. minDim 60′ > 2×15′.

### Edge labeling (FIX 2.1 path — correct)

```
edge 0 rear
edge 1 side
edge 2 front  residential / residential
edge 3 side_corner residential
insetFeetPerEdge = [0, 0, 15, 0]
emptyReason = "setbacks exceed the lot — no buildable area remains"
```

Not a front-labeling miss. Not a collector/local fight. Front is residential; silent axes honest 0.

### Geometry probes (live txgio ring)

| Inset | Result |
|-------|--------|
| Warm path `[0,0,15,0]` (front edge 2) | **empty** (setbacks exceed lot) |
| Front-only 15′ on edge **0** | OK area **7316** |
| Front-only 15′ on edge **1** | OK area **6160** |
| Front-only 15′ on edge **2** | **empty** |
| Front-only 15′ on edge **3** | **empty** |
| Uniform `[15,15,15,15]` | OK area **3206** |
| Zero inset | OK area 8216 |

So the lot **can** take a 15′ front setback on the south/west edges, and can take **uniform** 15′, but the same 15′ on the north/east edges (including the labeled front) is rejected as degenerate.

### Code path

1. `computeWarmCandidate` → `insetPerEdge` — `packages/engine-core/src/depth-warm/geometry.ts`
2. `insetProjected` → `insetRingMeters` (polygon-clipping strip→union→difference) — `geometry/polygon-inset.ts`
3. Non-null inset then fails `isInsetDegenerate` → emptyReason **"setbacks exceed the lot — no buildable area remains"** (`geometry.ts` ~280–287), which includes `perEdgeOffsetPlausible` (`polygon-inset.ts` ~236–267).

**Class:** asymmetric inset / degeneracy-guard false failure on specific edge indices of near-rects — **polygon-clipping / plausibility geometry**, not edge-labeling, not inset-feet resolution, not txgio ring quality (uniform + alternate-edge fronts prove the ring is fine).

Same customer-visible shape as the old 34785 site-plan failure mode (asymmetric OK on some frames, empty on others); FIX 1.1 fixed site-plan projection parity; this residual is still inside **depth-warm** `insetPerEdge` for many near-rects when the front lands on the “bad” edge indices.

---

## Recommendation

| Question | Answer |
|----------|--------|
| Is 74.16% the honest ceiling? | **No** |
| Greenlight Central-TX? | **No — FIX-FIRST** |
| Class name | Asymmetric front-only inset degeneracy on near-rects (edge-index / orientation sensitive) |
| Fix surface | `insetPerEdge` / `insetRingMeters` / `isInsetDegenerate`+`perEdgeOffsetPlausible` in `polygon-inset.ts` + depth-warm geometry; add R0-class fixture **48021:28286** (and peers) to geometry gate — front@edge2 must yield ~7316-class buildable, not empty, while uniform remains OK |
| Est. recovery | **~461** of 832 → depth ≈ **(2712+461)/3657 = 86.8%** place-type if all SHOULD-DRAW clear (honest 371 + 110 no-road remain) |
| Front-labeling gate | Necessary; **not sufficient** for fan-out — do not treat FIX 2.1 as scaling clearance |

PDD remains a separate wave. No-road 110 remains honest until roads widen.

---

## Side note — HTTP site-plan smoke on 34785

**Still owed / un-run.** `ENGINE_API_GATE_TOKEN` secret not found in `hauska-prod-497015` from planner shell (`gcloud secrets versions access` → NOT_FOUND). Engine-api **`00088-sub` @ 100%** (`fix21-siteplan`) is live with FIX 1.1+2.1 code; HTTP refresh of site-plan for 34785 was not probed. Flag remains OPEN (does not change this geometry-empty verdict).

---

## What this is not

- Not a re-open of FIX 2.1 front competition (specimen labels are correct).
- Not “accept 832 as irregular” — 55% are near-rects that should draw.
- Not a promote/re-run ask — diagnostic only.
