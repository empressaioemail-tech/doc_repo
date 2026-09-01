---
id: 2026-08-30_p1-ldt_supervisor_review
title: Supervisor grade — P1-LDT edge honesty
date: 2026-08-30
last_updated: 2026-08-30
status: active
lane: P1-LDT
plan_row: P-92
agent: 05af47d3-b928-480d-9767-92ebe9186502
snapshot: integration P:/doc_repo; LDT tree P:/seat-worktrees/property/legacy-design-tools-p1-edges seat/property-ctx-p1-ldt HEAD 28969a36; uncommitted; p2b-serve not opened
---

# Supervisor grade — P1-LDT

Seat: integration on `P:/doc_repo`. Reviewed the serve-path write path, not the handback. Did not commit. Did not open the P2b tree. Did not re-run vitest (junctioned `node_modules` from `P:/legacy-design-tools`).

## Verdict

Items 1–3 accepted on the write path. Live serve stays `unknown` until X1 feeds a claim. Planner commits.

| Item | Grade | Evidence |
|---|---|---|
| `DrawEdge.state` union | MET | `DrawEdgeState = present \| unknown \| refused`. Discriminated union. `chooseDrawEdgeState` has no default `present`. Fall-through is `unknown`. A `present` claim without an id becomes `unknown`. |
| Refuted cannot emit `present` | MET | `claim.state === "refused"` returns refused with reason and `agentGuidance`. Test names the old writer would have emitted present. |
| Gold reciprocal may stay `present` | MET | `claim.state === "present"` plus a neighbour id returns present. Gold 34169 is a fixture claim, not a live store field. |
| Retired filter | MET | `interpretBoundaryEdgeFactRows` drops `body.status === "retired"`. All-retired calls `presentFromItems([])` and refuses `malformed-atom` / empty-after-filtering. `assembleParcelDraw` filters `isRetiredEdgeStatus` again before the ring. |
| `sourceAdapter` on every served edge | MET | `DrawEdgeBase.sourceAdapter: string \| null`. Assemble always sets `edge.sourceAdapter ?? null`. fromReads passes `status` and `sourceAdapter` through. |
| No ROW/alley ⇒ neighbour NULL | MET | Gold edge 2 (ROW + 34121) stays `unknown` with the id kept. |

## Holes

1. **Live fromReads invents no `neighborClaim`.** A live neighbour id therefore serializes `unknown` (`neighbour not cross-checked`) until X1 or another independently derived claim. Shipping this without X1 is honest, not a gold `present` on production.

2. **`presentFromItems` still copies `sourceAdapter` from the lead edge body onto the fact read.** Per-edge `sourceAdapter` is the card. The fact-level field is the old shape. Do not treat it as the wire contract.

3. **Full-project `tsc` exit 2 was blamed on junctioned stale `node_modules`.** Card-file filter empty after the singleton probe was deleted. I did not re-run the TS2322 probe. The type on disk is the union; a default `present` would re-create the defect.

## What I did not do

Commit. Deploy. Mint atoms. Open `legacy-design-tools-p2b-serve`. Rewrite MCP panel types. Add the refused adjacency invariant.

## Next

Planner commits by explicit pathspec. Do not commit the `node_modules` junctions. P2b-serve still owns X2 item 4 (`sourceVintage` on absent reads) on the other tree. Do not merge this as customer-done; customer-done is a live brief plus a deployed bundle marker.
