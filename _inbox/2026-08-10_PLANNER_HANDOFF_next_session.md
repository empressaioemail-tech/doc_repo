---
title: Planner handoff — next doc_repo planning session
date: 2026-08-10
status: active-handoff
from: doc_repo planner session 2026-08-10
---

# Planner handoff (also pasted in chat for hand-carry)

You are the doc_repo planner (strategic plus execution, `P:\doc_repo`). **Read in order:** `_STATE.md` (the QUEUED WORK table is your pickup list, Q1–Q13), `_sessions/2026-08-10_write_path_rails_and_harvest_claude_code.md`, and `_sessions/2026-08-10_five_rails_and_write_throughput_claude_code.md` — the mid-session capture is NOT superseded, read both. Then `_decisions/2026-08-10_harvest_completeness_ruling.md` and `90_operations/OPS-15_owner_and_rrc_rail_gap_analysis.md`. CANON-PREAMBLE v0f465c77 regenerates via `node scripts/dispatch-preamble.mjs`.

## Standing rules (all measured in anger, several this session)

Verify at source (`gh` / SQL / live endpoint) before acting on ANY state claim **including this file**. Counts live behind queries, never prose. One bulk-writer slot per database, handoff recorded in `_STATE.md`. Every dispatch: CANON-PREAMBLE, no-nesting first line, exit-bounded verification, machine-checkable close artifact, in-process adversarial review with two checkpoints. Merge only on the CI conclusion string SUCCESS. Deploys are planner-owned; new revision != serving. Report what IS, never tune to the expected number.

**New rules earned this session — these are the expensive ones:**

1. **A phase-level timing attributes cost to the phase's NAME, not to what it does.** "Apply" hid a full-table read. Profile the STEPS inside a phase before optimizing the one it is named after.
2. **When a fix produces no gain, that is DATA, not a setup error.** Measuring 22 atoms/sec after a "63x" fix is what found the real cause.
3. **A benchmark on an empty table measures the CODE; on the production table it measures the SYSTEM.** State the environment or the extrapolation factor.
4. **Verify a merge with `tsc` AND a test-FILE count, never a green total.** Three times this session a file failed to transform, never loaded, and the suite reported everything else passing.
5. **`mergeable` is not evidence two open PRs are compatible** — GitHub compares each against main, never against each other. Assign contract versions UP FRONT in the dispatch or serialize the merges.
6. **Normalise identifiers before counting them.** Case-splitting understated `BLOCK` by 67 counties. Third instance of this family (situs comma tail, CAD prop_id padding).
7. **Look for two numbers that should agree and don't.** That is the whole skeleton-hunting method — four finds this session, none from a bug report.

## THE ONE THING YOU OWN RIGHT NOW

**The sweep.** `P:/tmp/parcel_node_sweep_20260809/run_sweep.mjs`, running in background, 123 landed / 9 remaining / 4,841,548 features / no halts. Queue is ALL metros: 48215 48121 48157 48085 48141 48113 48029 48439 48453. ~8 h at recent rate.

- **The sweep tree is `P:/hauska-engine` on branch `sweep/fast-write`. DO NOT EDIT THAT TREE while it runs** — an edit there is a live deploy to a running lane, and it broke the sweep once already this session. Use a worktree.
- It halts cleanly at county boundaries and re-runs are idempotent on `atom_did`. Cleared halts are recorded in `progress.json.haltCleared[]` with reasoning; add to that array, do not overwrite.
- `progress.json` may carry a **UTF-8 BOM** — strip `^\uFEFF` on read.
- **When it closes:** re-run the geometry scorer, THEN the slot is free.

## What happens the moment the slot frees (highest value on the board)

Five rails are merged with **zero coverage**. The manifest reads 0.7689% no matter how many PRs land. In order:

1. **Geometry scorer re-run** (Q2) — the metro tail should move it disproportionately, because zoning and geometry are county-INVERTED: only FIVE counties currently have both, and Bexar/Dallas/Tarrant/Travis/Collin already hold ~2.9M zoning-facts waiting for parcel-nodes to pair with.
2. **OWN apply** (Q1) — operator-ruled pre-launch-gate. 15 CAD counties.
3. The other four rail applies.

## Decisions owed by YOU (not the operator)

- **Q13 — stranded honesty work.** `origin/feat/oz-crossfilter-derivation` (ldt), 6 commits, PR #276 CLOSED-not-merged. **The `0.74` propensity fixture it was written to retire is STILL ON MAIN** at `brokerageGisCompositeLayers.ts:177`. Rebase-and-merge, or close deliberately and document the fixtures as known-synthetic. Do not leave it ambiguous.
- **Q8 — statewide roads GO/NO-GO.** eng #293 is open with CI FAILURE and DO-NOT-MERGE. H6 was never dispatched. A merged PR is not a go.
- **eng #295** (utility-easement writer) has CI SUCCESS but needs a merge-from-main; main moved five times today.

## Dispatched, awaiting return

**B2** footprint metro join (the Dallas join is O(fp × parcels): 482 B ops / ~6.7 h, Harris 2,285 B ops / ~32 h; a grid index drops both to seconds — requires a differential test proving indexed == nested exactly). **IDX** atoms index audit (nine indexes / 2,550 MB on a 10.9M-row table; `code-section` is 0.26% of the store yet `atoms_section_number_idx` is maintained on every insert).

Both are read-only and slot-safe. **Verify their numbers at source when they land** — this session corrected a "63x" to 16x and a field count by 67 counties, both from close reports that looked clean.

## Recommendation on the next dispatch

**Q3 and Q4 should be ONE lane, not two.** The harvest take-list's Class A cluster (`GEO_ID` 158, `BLOCK` 151, `MAP_ID` 147, `ABS_SUBDV_CD` 143, `TRACT_OR_LOT` 142) is parcel identity and plat lineage — the same job address-to-parcel resolution needs. `txgio_parcel.situs_address` is 99.3% populated across 196 counties and no resolver exists; we cannot answer "give me the parcel for this address" as a service today. Q5 (CAMA bulk parsers) is genuinely separate — do not conflate.

## Operator context

Launch gate may DRIFT by ruling; maximize parallel movement and fill the manifest. Cost per jurisdiction is settled (well under $200) — do not re-measure. Market layer is PARKED until Texas launches; do not open a lane. QA polish accumulates in `90_operations/QA_polish_register.md` rather than stopping the build path.

Operator open items (do not nag): R6 map browse, the three billing product calls, Donley CAD reply watch.

## What the operator sees next

When the metro tail lands and the scorer re-runs, the Command Center ledger moves off 0.7689% for the first time since the rail split — and it should move more than the county count suggests, because the zoning half of those five metros is already sitting in the store.
