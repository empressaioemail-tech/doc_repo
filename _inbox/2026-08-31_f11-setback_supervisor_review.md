---
id: 2026-08-31_f11-setback_supervisor_review
title: Supervisor grade — F-11 setback retirement
date: 2026-08-31
last_updated: 2026-08-31
status: active
lane: F-11-SETBACK
plan_row: F-11
agent: d81a57ce-024d-43ee-af05-db628864c80a
snapshot: integration P:/doc_repo; engine P:/seat-worktrees/property/hauska-engine-f11-setback 2c90b99 uncommitted
---

# Supervisor grade — F-11

Reviewed write paths, not the handback. Re-ran four suites: 18/18. Ran `retire-road-class-setback-table.mjs` on this tree: clean. Removed a starved `if (provenance === ROAD_CLASS_SETBACK_PROVENANCE)` after `provenance` was assigned `"district-setback-table"` in `compute.ts`. That branch could not fail.

## Verdict

Engine consumer refuse accepted. C7 not this tree. Store unmeasured. Atoms not deleted.

| Item | Grade | Evidence |
|---|---|---|
| Enumerate consumers | MET | Engine consume / compute / emit / export / author / retrieval / facets. LDT and PE named leave_behind. |
| Road-class → refused | MET | Classifier + consume throw + empty warm candidate. No feet from that provenance. |
| Placeholder → unknown | MET | Not refused, not absent-verified. Facet decline `setback-provenance-unknown`. |
| Dimensional → value | MET | layer-23 / Lockhart / Austin-shaped fixtures stay value. |
| CI reintroduction | MET | Poison temp tree fails scan. Clean tree 0 hits. Wired in `.github/workflows/ci.yml`. |
| McLennan envelope | MET as fixture | Refused; named DID when present. Live 65,814 unmeasured. |
| C7 | NOT THIS TREE | LDT `boundaryEdgeFactRead` still copies edge provenance. C3/C4 not touched. |
| Store mark | NOT THIS CARD | Measure script exists. No `ATOMS_DATABASE_URL`. After equals before because nothing was written. |

## Holes

1. Writer-side dead CHECK removed. The live retirement is consumer refuse plus the write-grep.
2. `citesRoadClass` is exact-string. A new alias of the same derivation would pass the classifier and fail the write-grep only if it used that literal assignment.
3. Layer-23 overlay skips the stored-edge refuse and uses the descriptor. That is the dimensional record, not a road-class substitute. Gold 34137 C7 still needs LDT.
