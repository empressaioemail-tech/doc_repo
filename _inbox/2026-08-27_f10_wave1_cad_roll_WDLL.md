---
id: 2026-08-27_f10_wave1_cad_roll_WDLL
title: WDLL — F-10 wave 1: the CAD roll for all 254 Texas counties through the conformant writer, county by county, with the manifest cells reading verdicts per node (F-05 completion)
date: 2026-08-27
last_updated: 2026-08-27
status: approved, START GATED (see "Start gate")
applies_to: hauska-factory (loop runner, defect register rows, manifest verdict reader), hauska-engine (adapter plan halves only if a county's roll needs one), legacy-design-tools (none; the manifest publish stays the Factory's one-way copy)
plan_row: F-10, F-05
depends_on: the conformant-writer card close (_inbox/2026-08-27_f16-f18-conformant_close.json) with items 6 to 8 graded, the reaper trigger (that card's amendment i), and its product PR merged on main; F-15 in parallel (substrate)
operator_go: 2026-08-27 ("F-10 wave 1 and the Bastrop publish in parallel, two lanes")
decision: _decisions/2026-08-26_factory_model_law_and_option_a.md; _decisions/2026-08-26_factory_program_and_hold_lifts.md; OPS-16 A-042 (old-shape writes ended), A-043 (fill rows re-homed under F-10)
model_law: 19_the_instrument_contract.md; _blueprint/10_model.md (V1 to V15); _blueprint/20_pipeline.md; _blueprint/40_rule_register.md; 24_instrument_conformance_program.md (T1.1 to T1.7); 51_ingestion_pipeline_reference.md
design: _inbox/2026-08-26_factory_program_design.md (sections 3, 4, 8, 12)
snapshot: doc_repo main 462010f · hauska-factory job factory-conformant gen 8 ace17072 · Bastrop 48021 written on the new shape by run 15c5c397 (jmwdp, 133 s wall, 77,799 landing rows); rate 1,165 atoms/s on 100,000 rows · landing cad_property 8,021,862 rows statewide, matched on the two-count ledger · old-shape rows untouched and serving
owner: property seat, a fresh LANE PLANNER (may spawn sub-agents under AGENT_CONTRACT section 1). Worktrees registered ahead of creation: P:/seat-worktrees/property/hauska-factory-f10 on seat/property-f10 and P:/seat-worktrees/property/hauska-engine-f10 on seat/property-f10, both from origin/main. Never the conform, drain, or writer worktrees.
---

# WDLL: F-10 wave 1, the CAD roll statewide

Date: 2026-08-27  Status: approved, start gated  Operator approval: 2026-08-27

## Lane planner mode

This card is run by a planning agent that may fan work to sub-agents under `90_runbooks/AGENT_CONTRACT.md` section 1. The conditions that make fanning safe: the lane planner supervises every sub-agent to completion (a coordinator that fans and returns abandons its workers); sub-agents produce artifacts and hand them back and never commit or execute a job; the lane planner reads every diff and asks every sub-agent what it violated to establish a claim; adversarial review at CP1 and CP2 by the lane planner, never by the sub-agent that did the work; verification never delegated below the lane planner; one writer at a time on any file in the lane's worktree; every sub-agent prompt begins with the no-nesting clause.

## Start gate

Do not execute a county until all three are true, and say which are not: the conformant-writer card is closed with items 6 to 8 graded (the shape is proven on 48021); the termination reaper has a Cloud Scheduler trigger verified by violation (a 254-county loop without it repeats the 5j4mc timeout sit 254 times); the conformant lane's product PR is merged on `main` so this lane builds on it rather than beside it. Building the loop runner, the defect rows, and the verdict reader before the gate is allowed; executing is not.

## What exists

The conformant writer (`factory-conformant`, gen 8, digest-pinned) takes a county through stages A to E from landing into `hauska_mcp` on the new shape beside the old rows, as a recorded run with per-leg clocks, replay proven, counts read from the store, lease v2 per `(entity_type, county_fips)`, the `assertZeroRateProbe` detector, and the reaper. The landing table `cad_property` holds 8,021,862 rows across counties with `vintage` and `adapter_version` unknown on some (declared, not fabricated). The county manifest today is the old ledger (`county_facet_coverage`, `readManifestGrid`), 667 of 3,556 cells on a GET that has not moved since 2026-08-25T23:47Z, and it does not read verdicts per node.

## Done looks like

Every county's CAD roll has been through the writer as its own recorded run, or carries a defect row saying why not (source missing, vintage unknown, keyKind, sentinel situs) with a disposition and an owner; the Factory county manifest reads layer verdicts per node for the `cad` rail so a cell is satisfied when every node in scope is `populated` or `not-applicable`, honest absence is `absent-verified` with its scope, and `lookup-failed` and `quarantined` stay visible; `hasWriter` and `atomFamilyState` are derived from the store and vary across cells; the one-way copy to `neondb` carries `published_at` and the served ledger reads it (F-05 item 20); the old-shape rows are untouched and still serve; no publish (F-06) and no consumer repoint happen on this card.

## Acceptance items

1. **Worktrees, salvage, and the start gate recorded.** The two `-f10` worktrees from `origin/main`. CP1 states the three gate conditions with evidence (close artifact path and grades; scheduler job name and the by-violation record; merged PR and SHA). | check: CP1 | grade: [ ]

2. **Loop runner, one county per run.** `src/jobs/f10-cad-loop.mjs` (or the repo's convention) plans the 254-county work list from landing (`county_fips` present, row count, vintage and adapter_version known or declared unknown), refuses a county whose landing is absent or whose provenance is undeclared (defect row instead), executes `factory-conformant` per county with `--county=<fips> --apply --replay` through the Cloud Run Admin API with a run row first, waits, reads the termination, and moves on; concurrency is bounded by the heavy-scan scope rule (one heavy-scan scope per database) and by the lease table; a failed county is a defect row and the loop continues; the loop itself is a run with a work-list snapshot. Verified by violation: a county with an undeclared vintage produces a defect row and no execution; a second loop started while one runs refuses on the loop's own lease. | check: work-list snapshot; refusal fixtures; two-loop refusal recorded | grade: [ ]

3. **Per-county evidence, not a percentage.** For each county: run id, landing count, aliases, nodes, atoms, edges, replay identical or not, per-leg clocks, rate, and the V1 to V15 `rule_grades` with UNMEASURED where only presence checks ran. A county whose replay is not identical terminates `failed` and gets a defect row. | check: ledger rows per county; a non-identical replay fixture fails | grade: [ ]

4. **Named defect classes become rows, not code paths.** Ector keyKind, situs sentinels (`", ,"` and `", TX 78660"` shapes), Dallas and Tarrant vintages (P-25 KEEP, no DELETE), Hays landuse hold, unknown `vintage` or `adapter_version`, the Travis join P-80: each is a defect row with a disposition (re-run, re-acquire, quarantine, lane) and an owner in the Factory `defects` table before wave 1 starts; the loop consults the register and does not "handle" a class silently. | check: rows present; a county in a quarantined class is skipped with the row cited in its run | grade: [ ]

5. **Manifest reads verdicts per node (F-05).** The Factory county manifest for the `cad` rail derives each cell from the layer verdicts on the nodes in scope (bounded per-cell materialise), with `hasWriter` and `atomFamilyState` derived from the store; the vocabulary is `populated`, `not-applicable`, `absent-verified` with scope, `lookup-failed`, `quarantined`; the city manifest uses the same vocabulary from the roster. Verified by violation: a typed absence without the verified-absence pair refuses; a cell whose indicators are uniform across all cells is reported as dead (V5). | check: cells vary; refusal fixture; the 48021 cell moves within 30 minutes of its verified run | grade: [ ]

6. **The one-way copy carries `published_at` and the served ledger reads it (F-05 item 20).** The Factory publishes the county manifest to `neondb.county_ledger_snapshot` with `published_at`; the LDT `GET /api/county-ledger` returns `published_at` (option A: the field named as the snapshot's stamp beside the live grid; option B: serve the snapshot). This is an LDT change in its own worktree and PR. | check: live GET carries `published_at` equal to the last publish run's stamp | grade: [ ]

7. **Wave 1 execution and the honest count.** The loop runs to the end of the work list. Report counties written, counties with defect rows by class, total atoms, wall time, and the rate distribution (not the mean alone); the old-shape row counts per county before and after, unchanged. No county is re-run "to improve the number". | check: loop run row; per-county ledger; old-shape counts equal | grade: [ ]

8. **Checkpoints, close, leave-behind.** CP1 at the start gate, CP2 after the first ten counties (rate distribution, defect rows, any quirk that needs an amendment), close at `_inbox/2026-08-27_f10-wave1_close.json` with grades by item, the defect register export, and `leave_behind`. | check: artifacts | grade: [ ]

9. **Out of this card.** Any source other than the CAD roll (flood, footprints, districts, wells, roads, easements are later waves under F-10); publish, staging, walk (the Bastrop publish card); any consumer repoint; any `--apply` through the old writer; changes to the atom contract (substrate); the console proxy (F-04). | check: pathspec and `notStarted` | grade: [ ]

## Do not

- Start a county before the start gate is met and stated.
- Handle a defect class in code instead of a register row.
- Report a mean rate without the distribution, or a percentage for a manifest cell.
- Touch old-shape rows, serving views, or `neondb` beyond the one-way manifest copy.
- Run two loops, or a loop and a manual execute, on the same store.
- Let a sub-agent execute a job or commit.

## Amendments

- None yet.

## Finish card (graded at close)

(not yet)
