---
id: 2026-08-10_five_rails_and_write_throughput_claude_code
title: Session — five rails built, rail split live, and the write-path constraint found
date: 2026-08-10
type: session-summary
owner: planner
memory_graded: pending
related:
  [
    90_operations/OPS-15_owner_and_rrc_rail_gap_analysis,
    90_operations/QA_polish_register,
    90_operations/OPS-13_store_topology,
    90_operations/OPS-14_texas_flush_game_plan,
    _inbox/2026-08-10_W1_atom_write_throughput_PLANNER_NOTE,
  ]
---

# Mid-session capture — 2026-08-10

Written mid-session at the operator's direction because a lot has been decided and discovered that would otherwise evaporate. This is the durable record; `_STATE.md` carries the live state.

## 1. THE HEADLINE FINDING — the scaling constraint was never the database

The operator asked whether the bottleneck was writing to one database, and proposed standing up separate ingestion DBs (an idea from the original factory design, motivated by background re-warm).

**The instinct about the symptom was right. The remedy would not have worked, and measurement is why we know.**

Planner instrumented all 97 landed sweep counties:

| Phase | Wall time | Rate |
|---|---|---|
| Dry-run (reads) | 2.51 h | 1,281,764 features/h |
| **Apply (writes)** | **17.91 h** | **179,463 features/h** |

**87.7% of all sweep wall time is the apply**, running at **47 atoms/sec — 21.14 ms per atom**. That is not a database under contention. That is a database being fed one row at a time.

Root cause in `packages/storage/src/pg-storage.ts` `writePropertyAtomsBatch`: 32 CONCURRENT SINGLE-ROW INSERTs (`Promise.all` over a 32-slice), each its own round trip and its own `ON CONFLICT`.

**Sharding would have given us a second store writing at 47 atoms/sec.** Double the infrastructure, roughly half the wall time, and a 60x inefficiency carried untouched into all fifty states.

### A wrong call the planner made and corrected

The planner initially blamed `await this.ipfs.pin(...)` as a serial network round trip per atom. **That was wrong.** `PgStorage` hardcodes `new InProcessIpfsPin()` (pg-storage.ts:145) whose `pin()` is a `Map.set` — essentially free. The dispatch brief was written to say so explicitly and to tell the executor to verify rather than trust the planner. The pin had a REAL but different defect: an unbounded in-process Map retaining every atom body for the life of the run.

### The fix, and the corrected number

W1 (eng #302, MERGED): one multi-row `INSERT ... ON CONFLICT DO UPDATE` per chunk (5,000 rows), pin leak removed, legacy path retained as a differential oracle, in-batch dedupe added for duplicate `atom_did`.

The executor reported **63x (47 → 2,961 atoms/sec)**. **The real figure is ~16x.** See section 2.

## 2. THE METHOD — how to find skeletons on purpose

The operator asked whether finding defects like this is systematic or "just comes from building and using." It is systematic, and the technique is one sentence:

> **Look for two numbers that should agree and don't.**

Four instances surfaced today, none from a bug report:

| Discrepancy | What it exposed |
|---|---|
| Legacy oracle **182/sec** vs planner-measured **47/sec**, same code | The benchmark ran on a throwaway schema; the live `atoms` table is 10,656,683 rows / 20 GB with **NINE indexes** (2,550 MB). Index maintenance IS the 3.9x gap. |
| `satisfiedCells` 89 vs `satisfiedPresentCells` 107 | NOT a bug — different definitions (rollup-eligible vs raw), delta is exactly `satisfiedPresentPartialCells` 18. A naming trap, not a defect. |
| CP1 band 28k–55k vs measured 100,187 Bastrop footprints | ML footprint density does not track land area; Dallas carries 6.5x Bastrop's per sq mi. Reviewer refuted its OWN pre-registration rather than bending the estimate. |
| Site-plan legend "no setback rule on file" vs header "BUILDABLE 1,722,104 SF" | The sheet contradicted itself. Zero inset produced an offset ring identical to the parcel ring. |

**Reconciliation finds skeletons; usage finds symptoms.** The corollary worth installing in every dispatch: *when two of your own numbers disagree, that is a free finding — do not round it off.* The W1 executor had 47 and 182 in the same table and moved past them.

### The corrected W1 headline (planner note: `_inbox/2026-08-10_W1_atom_write_throughput_PLANNER_NOTE.md`)

Applying the measured 47/182 environment penalty to the new path's 2,961:

**~765 atoms/sec realistic in production — 16x, not 63x.**

| Workload | today (47/s) | corrected (765/s) |
|---|---|---|
| TX remainder, 8.4M features | 49.6 h | **3.1 h** |
| 150M US parcels | **~1.2 months** | **~2.3 days** |

16x is an excellent result and it changes the national picture completely. The correction matters because we would otherwise have planned fifty states against 63x.

**MOLDED RULE:** *A write benchmark on an empty table measures the CODE. A write benchmark on the production table measures the SYSTEM.* Index maintenance, page splits and autovacuum pressure scale with rows and index count and do not exist at 8,000 rows. Every future throughput claim states its environment or its extrapolation factor.

### Where the separate-ingest-DB idea IS still right

For **background re-warm** — the operator's original motivation. Writing into the serving store means every re-warm competes with customer reads. A staging store you bulk-load then promote is the correct shape for that, and it is how the NFHL and CAD loads already behave. But it is a **quality-of-service** fix, not a throughput fix. Order matters: fix the write path first, or you provision infrastructure to work around code that is 60x slow and carry that cost into every state.

## 3. FIVE RAILS BUILT — and none of them have coverage

| Rail | Contract | Engine PR | State |
|---|---|---|---|
| `owner-fact` | 1.16.0 | #296 / #297 | registered, **apply owed** |
| `rail-corridor-fact` | 1.17.0 | #299 | registered, apply owed |
| `well-fact` | 1.18.0 | #300 | registered, apply owed |
| `building-footprint` (HOLD-1 closed) | — | #294 | registered, apply owed |
| `special-district-fact` | 1.19.0 | #301 | registered, apply owed |

`PROPERTY_ENTITY_TYPES` is now **14**. Every one of these is queued behind the atoms bulk-writer slot, which the parcel-node sweep holds. **The manifest reads 0.7689% regardless of how many PRs merge.** We are building faster than we can apply — the correct problem to have, and the reason W1 mattered.

## 4. R1 RAIL SPLIT IS LIVE IN PRODUCTION

12 rails → 14. `rrc` split into `rrc-wells` (point) + `rrc-pipelines` (line); `rail-corridor` added. `countyRailRefreshCli --apply` run, cortex-api canary `00497-cep` deployed → smoked at 0% → shifted to 100%.

**Live: `totalRails: 14`, `totalCells: 3556`, `texasCompletenessPct: 0.7689%`** (was 12 / 3,048 / 0.897%). The number went DOWN because the denominator grew — same 89 satisfied cells against an honest grid.

Per-rail display states now distinguish **built-but-unapplied from not-built**: `owner` reads `not-yet` x254 while the four unbuilt rails read `no-atom` x254. That distinction did not exist this morning.

**THE SPLIT RULE, now in the declaration header:** split where SOURCE and GEOMETRY differ; subcategorize via atom body fields where only the ATTRIBUTE differs.

## 5. OPERATOR RULINGS THIS SESSION

- **R1** — make it three rails (`rrc-wells`, `rrc-pipelines`, `rail-corridor`), rail-corridor now. DONE, live.
- **R2** — RESOLVED FROM LIVE CODE, not a guess: `lib/adapters/src/federal/texas-rrc.ts` already fetches two distinct ArcGIS endpoints and tags every feature `rrcAsset: 'well' | 'pipeline'`. The data already arrives split. PHMSA NPMS not needed for v1.
- **R3** — **OWN is pre-launch-gate scope.** Constraint recorded: the 15 CAD counties are a SUBSET of the 196 geometry counties, so OWN can never reach 100% of 254. The gate must read OWN as "done where CAD exists" or it can never close.
- **R4** — owner privacy posture ratified and **enforced in three layers**, not documented: contract schema pins `public-paid` and rejects anything else; the writer fail-closes before any write; `verifyStoredOwnerFactAtom` re-checks the STORED bytes.
- **Launch gate may DRIFT.** Maximize parallel movement and fill the manifest instead.
- **QA polish register** started — small defects accumulate rather than stopping the build path.

## 6. THE PARALLEL-LANE VERSION COLLISION — twice in one day

Lanes A and C were built simultaneously and **both claimed contract 1.17.0**, touching the same four files. **GitHub reported BOTH `MERGEABLE`** because it compares each PR against main independently and cannot see that two open PRs collide with each other. Resolved: C → 1.17.0, A → 1.18.0.

Then D2 repeated it, worse: the close report SAID 1.18.0 but `package.json` DECLARED 1.17.0 — and both were already published. Worse still, its engine PR pinned **exact `"1.18.0"`**, which is a DIFFERENT rail's contract. An exact pin on a taken version installs a package that does not contain the type the branch registers, and fails somewhere confusing rather than loudly. Corrected to 1.19.0 / `^1.19.0`.

**RULE:** when fanning parallel lanes that touch a shared package, **assign versions UP FRONT in the dispatch, or serialize the contract merges.** `mergeable` is not evidence that two open PRs are compatible.

## 7. MERGE-RESOLUTION DEFECTS — a whole class, caught only by tsc

Naive keep-both-sides conflict resolution produced **syntactically plausible garbage** repeatedly today:

- `| "rail-corridor-fact";` followed by `| "well-fact";` — a semicolon mid-union (twice)
- A type alias whose body became the next declaration's doc comment
- `fact-writer-ids.ts` cut mid-array-literal **three separate times**, truncating a function into the next
- A hand-edit to `engine-core/package.json` that inserted a premature `"dependencies": {`, splitting the block and **silently dropping 2 of 17 dependencies** including the atom contract itself

**The critical pattern: none of these were caught by test counts.** Three times a file failed to TRANSFORM and simply did not load, and the suite cheerfully reported everything else passing — once as "168 passed" while two files never ran.

**RULE:** verify a merge with `tsc` AND a test-FILE count, never a green test total alone. A passing count with a shrinking file count is a silent failure.

## 8. THE PE OUTAGE — the P0 auth seam bit a second surface

Operator's R6 browse found EVERY parcel showing "Parcel facts temporarily unreachable", including gold Bastrop 34137. Traced by probing the real BFF path: **`retrieval_auth_failed`, HTTP 503 wrapping an upstream 401.** PE's `HAUSKA_RETRIEVAL_API_KEY` was set 7 days ago, predating the P0 key rotation.

**The store was never sick** — the same parcel with the live secret returned a full chain (SF-1, 25/5/25, 9,350 sq ft envelope, Pine + Jefferson roads). This is the durability debt recorded that morning under the L lane ("the fix lives only in Cloud Run env") landing on PE instead of MCP.

Two traps hit while fixing it, both worth knowing:
1. **`hauska-map` was linked to the `cmdcenter` Vercel project, not `property-explorer`.** The first `vercel env add` landed on the WRONG project and a deploy would have pushed PE's build to the Command Center. ALWAYS `vercel link --project property-explorer` and re-read `.vercel/project.json` first.
2. The two projects use DIFFERENT var names — PE reads `HAUSKA_RETRIEVAL_API_KEY`, cmdcenter had `RETRIEVAL_API_KEY`.

**STANDING FIX STILL OWED:** this key is hand-synced in two places and has now drifted twice, breaking MCP once and PE once. It needs to live in the deploy workflow or a shared secret reference.

## 9. K LANE — statewide tiles live, with a buried defect

`parcels.b692c6534d26.pmtiles` — 13,710,413 features / 196 counties / 2.96 GiB. Planner verified independently: GCS HEAD 200 at the exact byte count, **range request 206**, immutable caching, and — the check the agent report did NOT make — **CORS from the PE origin exposing `Content-Range`**, the header MapLibre actually needs and which curl alone would never catch.

**The defect the report buried:** the K5 code changes were UNCOMMITTED, on an already-merged branch. Vercel serves the built bundle so prod was correct, but the source of truth did not carry the change — any redeploy from a clean checkout would have silently reverted PE to the 19-county tileset with no PR trail. Fixed and merged as hauska-map #157.

## 10. L1 — a paid report asserting a false fact (RESOLVED)

Site-plan sheet 1 printed `LOT 1,722,104 SF / BUILDABLE 1,722,104 SF` on a parcel with no setback atom — claiming 100% of a 39.5-acre Dallas parcel is buildable with zero setback, while **its own legend said "no setback rule on file."**

Operator diagnosed the mechanism; planner confirmed at `site-model.ts:533` and `render.ts:543`. Fixed UPSTREAM (eng #298) so every consumer inherits the correction. Planner audited the `1e-9` tolerance rather than assuming it: a **1-inch** setback on a 39.5-acre parcel yields a 2.54e-4 relative delta — five orders of magnitude above the threshold — while float noise sits at 1.09e-15. Safe at both ends.

The reported residual was a MISREAD: `depth-warm/consume.ts` does not exist; the alarming line lives in `warm-compute.ts` inside `injectBadWarmCandidate`, a deliberate fixture that fabricates this defect so the verify gate can be proven to catch it.

## 11. HOOKS BUILT (OPS-14 preconditions, finally)

- `dispatch-template-gate.ps1` — rejects briefs missing the preamble, the no-nesting FIRST line, exit-bounded verification, or a close artifact. Tested on 5 payload shapes.
- `dirty-tree-close-gate.ps1` — blocks a doc_repo push that would strand uncommitted `_STATE.md` edits. Staged-but-clean passes; worktree-dirty blocks.

**The dirty-tree gate caught the planner** on an unrelated engine push and was over-broad; scope fixed same session to fall back to the shell CWD. Fixed rather than overridden.

## 12. WHAT IS OPEN

**Running:** parcel-node sweep — 98 landed, 34 remaining, 8,330,218 features, 3,124,932 atoms written, no halts.

**Dispatched, awaiting return:** B2 (footprint metro join — the Dallas join is O(footprints x parcels), sized at 482 B ops / ~6.7 h, Harris at 2,285 B ops / ~32 h; a grid index drops both to seconds) and IDX (atoms index audit).

**Owed by planner:** apply all five rails once the sweep frees the slot; geometry scorer re-run; the standing retrieval-key fix (section 8).

**Next reconciliation targets, ranked:** (1) the index audit — dispatched; (2) READ-path cost at 10.66M atoms, never measured; (3) what the other 7.6M atoms are, given the sweep produced 3.05M parcel-nodes — storage nothing reads is either a missing product or dead weight; (4) **cost per jurisdiction**, a founding commitment (under $200 compute per county) never measured against the current factory.
