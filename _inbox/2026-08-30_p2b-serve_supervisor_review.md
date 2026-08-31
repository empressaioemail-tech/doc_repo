---
id: 2026-08-30_p2b-serve_supervisor_review
title: Supervisor grade — P2b-serve X2 + vintage
date: 2026-08-30
last_updated: 2026-08-30
status: active
lane: P2b-serve
plan_row: P-92
agent: 2af86a8a-eaed-4f3c-b97d-c7ec261cbdc5
snapshot: integration P:/doc_repo; LDT tree P:/seat-worktrees/property/legacy-design-tools-p2b-serve seat/property-ctx-p2b-serve HEAD 28969a36; uncommitted; P1-LDT tree not opened
---

# Supervisor grade — P2b-serve

Seat: integration on `P:/doc_repo`. Reviewed the serve-path write path, not the handback. Did not commit. Did not apply PE patches. Not customer-done.

## Verdict

X2-with-id, item 4 vintage, the four one-liners, `sourceAdapter`, and `frame.anchor` are accepted. `present` with a null neighbour is not. Reconcile with P1-LDT before either branch merges.

| Item | Grade | Evidence |
|---|---|---|
| X2 union (present-with-id) | MET | `present` + string neighbour requires `reciprocity: "pass"`. Old `{ state: "present", neighbor: string }` is not assignable. Contradicted and self-neighbour refuse. Unchecked id is `unknown`. |
| X2 + item 4 together | MET | Absent flood/well/sd/pipeline carry `sourceVintage` through `interpret*Rows`. Known vintage → `absent-verified`. Missing or `UNKNOWN` → `unknown`. `assertDrawStub` refuses an `absent-verified` overlay that lost provenance or vintage. |
| landUse keys | MET | `landUseAttrs` reads bake `description` / `vintage` and emits reader `desc` / `taxYear`. |
| `yearBuiltFromBake` gone | MET | Function deleted. Only structural `cad_property` present populates `yearBuilt`, with `source` on the wire. Bake 2022 plus structural absent leaves `attrs.yearBuilt` undefined. |
| `manifestLayers` | MET as honest refuse | Reads `envelopeBriefRefusal`, not stripped `facets.envelope.geojson`. `layers` stays `[]`, `degraded` stays true, with a named reason. Empty by construction is now labelled. |
| `sourceAdapter` + anchor | MET | Per-edge `sourceAdapter` on `DrawEdge`. `frame.anchor` from `queryPoint`; `0,0` and non-finite refuse to null. |
| PE copy | NOT THIS CARD | Exact patches under `_leave_behind/pe_patches`. Map checkout not opened. |
| Customer-done | DROPPED | No deploy, no live brief, no `dataset.hauskaBuild`. Gate 8 owns the marker. |

## Holes

1. **No-neighbour still ships `present`.** `disposeDrawEdgeNeighbor` returns `{ state: "present", neighbor: null }` when there is no id. The suite asserts that (`null neighbour stays present without a reciprocity witness`). That is the one-inhabitant literal on the other arm. The tsc probe only kills present-with-id. P1-LDT sends the same case to `unknown` (`no neighbour of record`). P1 is right. Do not merge P2b's null-neighbour present.

2. **Two DrawEdge writers on the same files.** P1-LDT has `chooseDrawEdgeState` (claim-shaped, reasons required, retired filter). P2b has `disposeDrawEdgeNeighbor` (check-shaped, `reciprocity: "pass"`, no retired filter). Both trees cut from `28969a36`. Reconcile before commit:

   - Keep P2b `reciprocity: "pass"` on present-with-id.
   - Keep P1: no id → `unknown`, not `present`.
   - Keep P1: `unknown` / `refused` carry a reason; retired dropped in interpret and assemble.
   - Keep P2b: `sourceVintage`, landUse keys, yearBuilt source, manifest refuse, `frame.anchor`.

   Merge order without that list re-creates one hole or the other.

3. **`manifestLayers` still cannot report a missing layer.** Honest refuse is what the card allowed. It is not a working manifest.

4. **Live `neighborCheck` is not wired in fromReads.** Same as P1: live ids stay `unknown` until X1. Do not invent `reciprocal` on the live path.

## What I did not do

Commit. Merge onto P1-LDT. Apply PE patches. Deploy. Treat 56/56 as re-run here.

## Next

Reconcile the two LDT trees, then commit by pathspec on operator word. PE patches and the Gate 8 marker stay leave_behind. Customer-done is a live brief plus `dataset.hauskaBuild` equal to the serving sha.
