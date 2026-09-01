---
id: 2026-08-30_ldt_drawedge_reconcile
title: LDT DrawEdge reconcile — P2b tree is the merge home
date: 2026-08-30
last_updated: 2026-08-30
status: active
plan_row: P-92
snapshot: integration; applied in P:/seat-worktrees/property/legacy-design-tools-p2b-serve; 77 tests pass
---

# LDT DrawEdge reconcile

Two trees cut `parcelDrawStub.ts` from `28969a36`. This is the merge list. Applied on the P2b tree.

Keep from P2b: `reciprocity: "pass"` on present-with-id. `sourceVintage` both arms. landUse `desc` / `taxYear`. `yearBuiltFromBake` gone. manifest honest refuse. `frame.anchor` (0,0 refuses).

Keep from P1: no neighbour id is `unknown` (`no neighbour of record`), not `present`. `unknown` / `refused` carry a reason. Retired dropped in interpret and assemble. All-retired refuses.

Do not merge `seat/property-ctx-p1-ldt` first. That branch still has the claim-shaped writer and no vintage. Commit P2b by pathspec. Cherry or replay retired-only tests from P1 if a second PR is needed; do not land both unions.

Vitest 2026-08-30T17:50: 77 pass across parcelDrawStub, parcelDrawFromReads, p2bServeSourceContract, floodHazardFactRead, boundaryEdgeFactRead.
