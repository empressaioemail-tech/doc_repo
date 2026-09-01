---
id: 2026-08-31_p1-ldt-leftover_supervisor_review
title: Supervisor grade — P1-LDT DrawEdge leftovers
date: 2026-08-31
last_updated: 2026-08-31
status: active
lane: P1-LDT-leftover
plan_row: P-92
agent: ee3e087e-b8c5-4201-b16a-3b6eef040c7b
snapshot: integration P:/doc_repo; LDT tree P:/seat-worktrees/property/legacy-design-tools-p1-leftover seat/property-ctx-p1-leftover HEAD 8f11e81ba950a79416873b3c14185dd1527f1748; 5 files uncommitted
---

# Supervisor grade — P1-LDT leftovers

Seat: integration on `P:/doc_repo`. Reviewed the write path, not the handback. Re-ran the three card files: 69 pass / 69. Did not commit. Did not write the dirty p1-edges tree. Did not deploy.

## Verdict

Accepted. Main already had the writer. The leftover is one assemble line plus additive tests. Do not merge `seat/property-ctx-p1-ldt`.

| Item | Grade | Evidence |
|---|---|---|
| Did not copy dirty files | MET | Product diff is one line in `assembleParcelDraw`. `#560` setback refuse test still present. `frame.anchor` and yearBuilt source untouched. |
| `sourceAdapter ?? null` | MET | `DrawEdge.sourceAdapter` is `string \| null`. Undefined would omit on JSON. Mixed-adapter test asserts per-edge values. |
| Retired filter tests | MET | Interpret mix drops `:99`. All-retired is `malformed-atom` / empty-after-filtering. Assemble retired-only ships no ring. fromReads keeps `depth-warm-v1`. |
| Default present compile probe | MET | `drawEdgeDefaultPresent.probe.ts` is under `src/` so `tsconfig` include covers it. Bare `{ state: "present" }` is `@ts-expect-error`. Restoring a default present unused-errors that directive. |
| No adjacencyKind invariant | MET | `disposeDrawEdgeNeighbor` still has no adjacencyKind branch. Gold front (ROW + 34121) stays unknown, not refused. |

## leave_behind

- Planner commits the five leftover paths by pathspec after the other lanes land or on operator go.
- Dirty `legacy-design-tools-p1-edges` stays unmerged.
- X1 still unbuilt. Live neighbour ids stay `unknown` until a claim is fed.
- Junctioned `node_modules` are local-run only.
