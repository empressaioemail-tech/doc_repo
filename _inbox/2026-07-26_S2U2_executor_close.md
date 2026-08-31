---
id: 2026-07-26_S2U2_executor_close
title: Executor close — Stage 2 Unit 2 boundary primitive (S2-U2)
status: check-in
date: 2026-07-26
executor: cursor agent (S2-U2)
dispatch: _dispatches/2026-07-26_S2U2_boundary_primitive.md
acceptance: [U2.1, U2.2, U2.3, U2.4, U2.5]
---

# S2-U2 executor close — boundary primitive

Planner verify only; executor does not self-grade Stage 2 done.

## 1. PR + SHA

| Item | Value |
|------|-------|
| PR | https://github.com/empressaioemail-tech/hauska-engine/pull/138 |
| Branch | `feat/s2u2-boundary-primitive` |
| SHA | `ed7b8bc` (head; feat commit `8b07b73`) |

No `hauska-atom-contract` bump — `property-boundary-edge` vendored in `@hauska-engine/atoms` (same pattern as road-node pre-publish).

## 2. Design choice

**One atom per edge** (`entityType: property-boundary-edge`, id `{fips}:{propId}:boundary:{edgeIndex}`). Unit 3 reads ordered edges via `readBoundaryEdgesForParcel(storage, parcelNodeId)` — fail-closed, no silent re-derive.

## 3. Code pointer — cell-grid + PIP persist path

| Step | Path |
|------|------|
| One Neon load | `packages/engine-core/src/boundary-primitive/load-parcel-index.ts` |
| Cell grid + 3m probe + PIP | `packages/engine-core/src/boundary-primitive/adjacency-grid.ts` |
| Compose + emit atoms | `packages/engine-core/src/boundary-primitive/compute.ts` |
| Batch persist | `packages/engine-core/scripts/boundary-primitive-bastrop.mjs` |

## 4. Vitest / CI

```
pnpm --filter @hauska-engine/engine-core test
Test Files  54 passed (54)
Tests  313 passed | 2 skipped (315)
```

Live PRE-2 + gold atom tests (require `TXGIO_DATABASE_URL` + `BOUNDARY_LIVE_TEST=1`):

```
pnpm test src/boundary-primitive
7 passed (7) — U2.2 PRE-2 spot-check + U2.1 live atom fields
```

## 5. Live atom bodies (gold set — substrate query 2026-07-27)

### 48021:28286 (4 edges)

**edge0** — role=rear, adjacencyKind=unmapped, parcelNeighbor=null, setback=`unmapped-adjacency`, interior ringCcw=true, effectiveDate=2026-07-27, status=active, supersedesEntityId=null

**edge1** — role=side, adjacencyKind=neighbor-parcel, parcelNeighbor=32341, setback feet=0, interior inwardNormal≈(1,0)

**edge2** — role=front, adjacencyKind=ROW, parcelNeighbor=35671, facingRoad=48021:road:123456789 residential, setback feet=15

**edge3** — role=side_corner, adjacencyKind=ROW, parcelNeighbor=null, facingRoad=48021:road:123456789, setback feet=0

### 48021:34785 (4 edges)

**edge0** — neighbor-parcel 34801 | **edge1** — neighbor-parcel 34769 | **edge2** — unmapped (null neighbor, unmapped-adjacency setback) | **edge3** — neighbor-parcel 34777

All carry status=active, effectiveDate=2026-07-27, supersedesEntityId=null, interior ringCcw=true, centroidInside=true.

### 48021:33512 (6 edges)

**edge0/5** — unmapped, unmapped-adjacency (no setback feet). **edge1** →48754, **edge2** →33596, **edge3** alley+33603 (5ft rear), **edge4** ROW front+33617 (15ft). PRE-2 neighbors match.

## 6. Acceptance mapping (executor claim — planner verifies live)

| # | Claim |
|---|-------|
| U2.1 | Live gold atoms carry role + adjacency + setback + interior + temporal |
| U2.2 | parcelNeighborPropId matches PRE-2 table on 28286/34785/33512 |
| U2.3 | Unmapped edges: setback kind unmapped-adjacency, no feet |
| U2.4 | adjacency-grid.ts one-load + cell grid + PIP (no per-edge Neon scan) |
| U2.5 | vitest 313+ pass; boundary fixtures green; geometry/front-labeling gates untouched |

## 7. M0 scratch block (return to planner)

```
LESSON: property-boundary-edge = one atom per ring edge; adjacencyKind ROW/alley wins over neighbor-parcel when road labels present (28286 e2 ROW + neighbor 35671).
LESSON: PRE-2 lazy grid (degree cells) finishes gold adjacency in ~3s; eager full-county precompute hung >5min — do not precompute all edges at index build.
LESSON: live vitest needs BOUNDARY_LIVE_TEST=1 gate so CI/default suite skips Neon when TXGIO URL leaked in shell.
GROUND-TRUTH (2026-07-27T03:32Z): PR #138 SHA 8b07b73; substrate property-boundary-edge atoms: 28286×4, 34785×4, 33512×6 persisted.
GROUND-TRUTH (2026-07-27 live): PRE-2 spot-check MET on full county load (74729 geom rows in txgio; 62257 in zoning-fact-linked index entries).
OPEN: Unit 3 insetPerEdge consume — read API ready at readBoundaryEdgesForParcel.
OPEN: atom-contract publish property-boundary-edge (vendored in engine for now).
```
