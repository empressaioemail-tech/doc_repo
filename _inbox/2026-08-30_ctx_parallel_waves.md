---
id: 2026-08-30_ctx_parallel_waves
title: CTX complete — carry order after ae89dc3
date: 2026-08-30
status: amended
plan_row: F-01, F-05, F-06, F-08, F-10, F-11, F-18, P-09, P-11, P-17, P-85, P-92
depends_on: _inbox/2026-08-30_ctx_consolidated_execution_plan.md, _decisions/2026-08-30_unincorporated_is_the_disposition.md, _inbox/2026-08-30_ctx_execute_waves_WDLL.md
canvas: C:\Users\cente\.cursor\projects\p-doc-repo\canvases\factory-and-texas-complete.canvas.tsx
operator_go: 2026-08-30 (five dispatches ae89dc3; separate trees; no Wave R)
snapshot: integration P:/doc_repo; Q1–Q5 ruled; Gate 8 step 2 unlocks P4; 0005b ships
---

# Carry order

Operating schedule: `_inbox/2026-08-30_ctx_consolidated_execution_plan.md`. Chew sheet: `_inbox/2026-08-30_ctx_chew_next.md`.

Subagents do not commit. One bulk-writer per `(store, entity_type, county_fips)`. One heavy-scan per database. Writers read `neondb`. Do not re-run `landing-import`. Do not apply 0005 as drafted. Do not give a CDP a `place_fips`.

## Order

```
NOW in parallel, separate trees:
  P1-FACTORY (Factory A) · Gate 8 steps 1–2 (Factory B) · P2-JURIS read (planner RO)
  P1-LDT (LDT A) · P2b-serve (LDT B)
THEN: P2 job template · P2-JURIS persist · P3 · P4 (gated by Gate 8 step 2 on served body)
THEN: P5 · P6 · P7 (gated by Gate 8 browser walk)
```

| Phase | Parallel with | Do | Refuse |
|---|---|---|---|
| P0 | — | Canon. Three-state split. 72 cities. OPS-1 A12. | County-wide setback owe. 826,569 as one state. |
| P1-FACTORY | P1-LDT | Walk four-state. Readable gate. Refuse missing county. 0005 split. | Trust a walk that cannot fail. Apply 0005 as drafted. |
| P1-LDT | P1-FACTORY | `DrawEdge.state` union. Retired-edge filter. `sourceAdapter`. | Mint atoms from this card. |
| Gate 8 | now, Factory tree B | Steps 1–2 now (unlock P4). County-scoped job waits on P1-FACTORY. Browser walk unlocks P7. | Same checkout as P1-FACTORY. Assert against the store. Pin Node 20. |
| P2-JURIS | read now; write after P2 job | Containment. Reconcile 357,269 / 624,141. Planner RO URI for the read. | Laptop `psql`. `breadth_*` as jurisdiction. CDP `place_fips`. Adopt a new total. |
| P2 job | after P1-FACTORY refuse | Writer allowlist. Unlocks P2-JURIS persist. F-11 writer. Easement no live REST. | Second landing-import. Hardcoded CAD-only job. |
| P2b-serve | now, LDT tree B | X2 + item 4 together. Five MCP one-liners. New dispatch only. | The PE wiring card. Treat #310 as done. Same checkout as P1-LDT. |
| P3 | after containment | Three states. Four county easement absences. | `not-applicable` on the 465,568. |
| P4 | serialize heavy scans | Wells + footprint on five. Flood shape. Four setback artifacts. Edges ~154k. | 0005 seeds. Six-county well/footprint apply. |
| P5–P8 | — | Scrub both directions. Pin. Wave R serial. Prove. | Publish before P5. |

## What is already done (do not schedule)

- Card H six walked on `sha256:7bef3ce7`.
- C-count / `import_ledger` nine two-counts (2026-08-26/27).
- Caldwell wells 53,841 and footprint 35,269.
- Flood atoms on all six (981,620). Shape conversion only.
- McLennan stamps 48,441.
- Every FIPS has wells. Zero-FIPS branch is dead.
- W0b landUse MET. Situs-extend off.
- Alias seed draft exists (`_catalog/2026-08-30_breadth_place_alias_seed.json`). It is reconcile-input, not a jurisdiction source.
- Five dispatches compiled at ae89dc3.

## Do not parallelize

- Two heavy scans on one Neon.
- Two writers on the same `(store, entity_type, county_fips)`.
- Wave R with any rail unmeasured.
- P-80, scllr, F-09, F-10 254, Harris PBF.
- Laptop `--apply`.
- 0005 as drafted.
- A second `landing-import`.
- Subagent commits.
- The PE wiring card as a P2b brief.
- Two F-08 lanes or two P-92 lanes in one checkout.
- Gate 8 county-scoped job form before P1-FACTORY refuse lands.
- Drop 0005b (CAD↔TxGIO identity; not the jurisdiction alias).
---