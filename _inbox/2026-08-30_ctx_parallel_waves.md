---
id: 2026-08-30_ctx_parallel_waves
title: CTX complete — execute waves P0 to P8 (A-028)
date: 2026-08-30
status: amended
plan_row: F-05, F-06, F-08, F-10, F-11, F-18, P-09, P-11, P-17, P-85
depends_on: _decisions/2026-08-30_ctx_complete_or_absent.md, _inbox/2026-08-30_ctx_execute_waves_WDLL.md, _inbox/2026-08-30_ctx_w3_collect_amendments.md, _inbox/2026-08-30_ctx_road_to_prod_accurate.md
canvas: C:\Users\cente\.cursor\projects\p-doc-repo\canvases\factory-and-texas-complete.canvas.tsx
operator_go: 2026-08-30 (tee up; P0 now; no 0005, no landing-import, no F-18)
snapshot: integration P:/doc_repo; collect-as-written refused; measured owe; Wave R paused
---

# Execute waves

Operating card: `_inbox/2026-08-30_ctx_execute_waves_WDLL.md`. This file is the short map. Band C / Band 1 language is retired as a schedule.

Subagents do not commit. One bulk-writer per `(store, entity_type, county_fips)`. One heavy-scan per database. Writers read `neondb`. Do not re-run `landing-import`. Do not apply 0005 as drafted.

## Order

```
P0 truth  ->  P1 controls  ->  P2 alias (long pole) + job template
          ->  P3 absence   ->  P4 rails  ->  P5 scrub  ->  P6 pin  ->  P7 Wave R
P2b PE wiring rides beside P2 and never blocks Wave R
```

| Phase | Parallel with | Do | Refuse |
|---|---|---|---|
| P0 | — | Canon. Measured owe. 72 cities. OPS-1 boundary correction. | County-wide setback owe. |
| P1 | P2b start | Walk four-state. Routing-pin holds. Missing-county refuse. Recount repair. | Trust a walk that cannot fail. |
| P2 | P2b, start alias now | Writer allowlist. One job template. F-11 writer. Easement no live REST. Store split: count `neondb`, do not copy. | Second landing-import. Hardcoded CAD-only job as the rail executor. |
| P2b | P2 | PE copy, grey-box scope, Zone, A1, yearBuilt + source, bundle marker. | Treat #310 as done. |
| P3 | after alias seed starts | `not-applicable` on unincorporated setback/edge/envelope. Four county easement absences. | Fabricated absence. |
| P4 | serialize heavy scans | Wells + footprint on five. Flood shape conversion. Land four setback artifacts. Edges ~154k. Quarantine placeholders. | Apply 0005 seeds. Six-county well/footprint apply. |
| P5 | — | S1–S13, 100% SQL, area sweep HTTP. | Publish. |
| P6 | PE deploy may ride | Pin, determinism, six staging. | Promote a failed walk. |
| P7 | — | Six production serial. GRADE LOG. | Second snapshot write. |
| P8 | — | Recount, live briefs, schedule scrub. | Call a merged PR customer-done. |

## What is already done (do not schedule)

- Card H six walked on `sha256:7bef3ce7`.
- C-count / `import_ledger` nine two-counts (2026-08-26/27).
- Caldwell wells 53,841 and footprint 35,269.
- Flood atoms on all six (981,620). Shape conversion only.
- McLennan stamps 48,441.
- Every FIPS has wells. Zero-FIPS branch is dead.
- W0b landUse MET. Situs-extend off.
- LDT #554 and Factory #37 are PRs, not an image.

## Chew next (max parallel after P0)

Three lanes, one go:

1. P1 controls (Factory walk + F-18 refuse + routing pin).
2. P2 alias table seed (property; long pole; start immediately).
3. P2b PE wiring (hauska-map; does not block Wave R).

Then P2 job template + writer allowlist (one lane). Then P3 (cheap, converts 826,569). Then P4.

## Do not parallelize

- Two heavy scans on one Neon.
- Two writers on the same `(store, entity_type, county_fips)`.
- Wave R with any rail unmeasured.
- P-80, scllr, F-09, F-10 254, Harris PBF.
- Laptop `--apply`.
- 0005 as drafted.
- A second `landing-import`.
- Subagent commits.
---
