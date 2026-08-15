---
id: 2026-07-26_S2U2_boundary_primitive
title: Dispatch — Stage 2 Unit 2 — temporal adjacency-aware boundary primitive
status: active
date: 2026-07-26
applies_to: [hauska-engine, hauska-atom-contract]
owner: nick
planner: depth-engine planning agent (doc_repo)
governs_wdll: [27f_bastrop_through_v2_program]
cites:
  - 27f WDLL 4 (property lines as first-class temporal adjacency nodes)
  - 27f WDLL 5 (adjacency from live parcel+road data, verified named parcels)
  - 2026-07-26_temporal_boundary_primitive_and_living_layer
  - PRE-2 adjacency method (AMENDMENT 1 CLEARED)
  - M0.2 / M0.3
related:
  - _inbox/2026-07-26_PRE2_adjacency_at_scale_checkin.md
  - _inbox/2026-07-26_guard_vs_interior_and_boundary_primitive.md
  - _scratch/depth-engine-27c.md
---

# S2-U2 — The boundary primitive (first-class property-line nodes)

You are the EXECUTOR for Stage 2 Unit 2 — the KEYSTONE. Build in `P:\hauska-engine` (contract bump in `hauska-atom-contract` only if a new entity type / body shape requires it — prefer extending existing atom patterns). Open PRs on green CI. Return a close with evidence + scratch block (M0). Do NOT self-grade as done. The planner verifies LIVE. Do NOT promote lessons yourself.

## FLEET MEMORY (M0) — paste-enforced

As you work, capture build knowledge in a scratch block you return in your close, using four entry kinds — LESSON / DEAD-END / GROUND-TRUTH (with timestamp) / OPEN. Read scratch context FIRST. Do NOT promote to durable memory yourself. Flush before context roll.

## Scratch context (start warm — DO NOT RE-DERIVE)

```
PRE-2 ADJACENCY METHOD (LOCKED — use this; do not invent PostGIS; do not per-edge Neon scan):
GROUND-TRUTH (2026-07-26 PRE-2): full Bastrop txgio_parcel geom **74729** parcels / **713390** edges;
  method = one Neon jsonb+bbox load + ~1km cell grid + 3m outward probe + pointInOrOnPolygon;
  wallMsTotal=27306, adjWallMs=15181, failures=0.
  Spot MET: 28286 e1→32341 e2→35671; 34785 e0/1→34801/34769 e2 unmapped; 33512 e0/5 unmapped.
LESSON (PRE-2 / PROMOTE TARGET): spatial adjacency at county+ scale = one-load + cell-grid + PIP,
  NOT per-edge bbox scan (O(n²) — ~55h on Bexar). PostGIS available 3.5.0 but NOT required.
Repro: hauska-engine/packages/engine-core/_diag_adjacency_scale.ts
Artifact: _inbox/2026-07-26_PRE2_adjacency_scale_raw.clean.json

NAMED-PARCEL ADJACENCY (must match when persisted):
28286: edge0 UNMAPPED; edge1 PARCEL→32341; edge2 MIXED road+35671; edge3 side_corner / road or unmapped parcel
34785: edge0→34801; edge1→34769; edge2 UNMAPPED; edge3→34777 (+ front road possible)
33512: neighbors on 1/2(+); edges 0/5 UNMAPPED; alley/residential road roles via road-nodes

INTERIOR (B4 — compute once, STORE):
signedArea > 0 after CCW ensure; centroid pointInOrOnPolygon; inwardNormal = left-of-CCW-edge.
Do NOT re-derive on every inset read — Unit 3 will consume what you store.

GEOMETRY HISTORY (do not reopen; gates stay green):
LESSON (GUARD): 28286 edge2 — insetRingMeters yields correct ~7316 sqft; ringHasSelfTouch rejected dirty clip.
  PATCH-A cleaned geometry; guard NOT weakened. Genuine-self-touch negative fixture stays.
LESSON (M0): geometry gate needs POSITIVE-SPACE fixtures (every edge index on good near-rects).
LESSON (OSM proxy): road class from OSM highway/surface is PROXY — Unit 1 retires it; you may still
  attach facing road from current road-nodes. Prefer county-surveyed provenance when present.
  Unmapped = first-class; NEVER fabricate a setback on unmapped.

TEMPORAL (wire NOW — populate one version):
Atom contract already has effectiveDate / retiredAt / supersedesEntityId / status active|retired /
  supersedes link (ADR-011). Use them. One version per line in v1; supersede-ready ids.

CENTRAL-TX: HELD. No fan-out.
```

## What each property-line node MUST carry

| Field | Requirement |
|-------|-------------|
| identity | Addressable, supersede-capable id (e.g. `{fips}:{propId}:boundary:{edgeIndex}` or equivalent stable scheme) |
| role | front / side / rear / side_corner (from adjacency+road fact, not proximity-only proxy when both available) |
| adjacency | `ROW` \| `neighbor-parcel:{propId}` \| `alley` \| `unmapped` — **persisted** from PRE-2 cell-grid+PIP (+ road-node attach). Do not recompute on every read. |
| facing road | road-node id + classification when ROW/alley frontage |
| resolved setback | distance feet + provenance/citation when a descriptor row exists; **honest absence** when unmapped / no-setback-row |
| interior/inward | stored once per ring (CCW + inward normals / interior flag) — not re-derived at offset time |
| temporal | `effectiveDate`, `status`, `supersedesEntityId` (null for v1 genesis), ready for supersede |
| confidence + provenance | like every atom |

Unmapped stays first-class. Never invent setback feet for unmapped edges.

## What to build

1. **Entity / atom shape** for boundary (or property-boundary / parcel-boundary-edge — pick one name, document it). Prefer `@empressaio/atom-contract` extension only if required; otherwise engine body + entity_type that already conforms.
2. **Compute + persist pipeline** for Bastrop place-type cohort minimum (or named gold set + batch path):
   - Load parcels once (PRE-2 pattern).
   - Cell-grid + PIP parcel-parcel adjacency.
   - Attach road-nodes for ROW/alley (existing `labelEdgesFromRoads` / county roads if Unit 1 merged — tolerate OSM-only if U1 not merged yet; provenance must say which).
   - Compute interior once; emit one atom (or one atom with edges[]) per parcel lines — prefer **one node per edge** if that matches “property line as node”; a single parcel-boundary atom with edges[] is acceptable IF each edge is addressable/supersede-capable and Unit 3 can read per-line rule+inward. Document the choice in the close.
3. **Read API** used by Unit 3: given `parcelNodeId`, return ordered edges with adjacency/role/setback/inward/temporal. Fail closed if missing (no silent re-derive).
4. **Mechanical guards**:
   - Fixture: 28286 / 34785 / 33512 adjacency matches PRE-2 spot table (or checked-in expected JSON).
   - Fixture: unmapped edge has no fabricated setback feet.
   - Fixture: temporal fields present on genesis atoms (`status=active`, `effectiveDate` set, `supersedesEntityId` null).
   - Geometry + front-labeling gates stay GREEN.

## Acceptance (cite in PR + close)

| # | WDLL / gate | Observable |
|---|-------------|------------|
| U2.1 | 27f WDLL 4 | Live atoms for 28286/34785/33512 carry role + adjacency + rule + provenance + stored interior/inward + temporal fields |
| U2.2 | 27f WDLL 5 | Adjacency matches PRE-2 spot-check on those three parcels (paste atom bodies) |
| U2.3 | Honesty | Unmapped edges: no setback feet invented |
| U2.4 | Scale method | Persist path uses one-load + cell-grid + PIP (code citation); no per-edge Neon spatial scan |
| U2.5 | Gates | Vitest geometry + front-labeling + new boundary fixtures green |

## Out of scope

- Rewiring `insetPerEdge` to consume the primitive (Unit 3 — but design the read API so U3 is mechanical).
- StreetsSurveyed2016 adapter (Unit 1) — consume county roads if present.
- Weakening geometry guards.
- Central-TX.
- Living-layer sensing engines (design attach-points only; do not build zoning-change/annexation sensors).

## Close format

1. PR URL(s) + SHAs.
2. Pasted live atom bodies (or retrieval JSON) for 28286 / 34785 / 33512 — adjacency + role + temporal + interior.
3. Code pointer to cell-grid+PIP persist path.
4. Vitest / CI paste.
5. Scratch block.

Planner verifies live; you do not mark Stage 2 done.
