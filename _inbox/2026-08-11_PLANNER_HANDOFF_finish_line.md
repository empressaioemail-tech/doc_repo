---
title: Planner handoff — the finish-line push
date: 2026-08-11
status: active-handoff
from: doc_repo planner session 2026-08-11
---

# Planner handoff — push to the finish line

The operator's framing for you: **"a push to the finish line."** The statewide parcel fabric is DONE. What remains is turning built machinery into measured coverage, and closing a small number of honesty debts before anything external happens.

## READ IN ORDER

1. `_STATE.md` — the **QUEUED WORK** table (Q1–Q14) is your pickup list. Read its warning header first.
2. `_sessions/2026-08-11_sweep_complete_and_verify_fix_claude_code.md` (this session)
3. `_sessions/2026-08-10_write_path_rails_and_harvest_claude_code.md`
4. `_sessions/2026-08-10_five_rails_and_write_throughput_claude_code.md` — the 08-10 pair is NOT superseded; the rulings and the harvest work live there
5. `_decisions/2026-08-10_harvest_completeness_ruling.md`, `90_operations/OPS-15_owner_and_rrc_rail_gap_analysis.md`

CANON-PREAMBLE v0f465c77 regenerates via `node scripts/dispatch-preamble.mjs`.

## STANDING RULES

Verify at source (`gh` / SQL / live endpoint) before acting on ANY state claim **including this file**. Counts live behind queries, never prose. One bulk-writer slot per database, handoff recorded in `_STATE.md`. Every dispatch: CANON-PREAMBLE, no-nesting first line, exit-bounded verification, machine-checkable close artifact, in-process adversarial review with two checkpoints. Merge only on the CI conclusion string SUCCESS. Deploys are planner-owned; new revision != serving. Report what IS, never tune to the expected number.

**Rules earned across this arc — these cost real time to learn:**

1. **A status is a CLAIM.** The operator caught Q6/Q7 marked "DISPATCHED" when no agent had ever been handed them. Writing a brief is not dispatching it. Check for a branch, a PR, or a close artifact.
2. **When a fix produces no gain, that is DATA, not a setup error.** It found the real cause twice this arc.
3. **A performance conclusion measured on the PRODUCTION table has a shelf life.** An index that lost at 10.7M rows won at 16.2M. The cache cliff moved underneath the conclusion inside one session.
4. **A phase-level timing attributes cost to the phase's NAME, not to what it does.** "apply" hid a full-table read.
5. **Verify a merge with `tsc` AND a test-FILE count**, never a green pass total. A file that fails to transform contributes zero tests and the suite still reports everything else passing.
6. **Prescribe the INVARIANT, never the RECONSTRUCTION.** My brief told an agent to rebuild a did from parts; the parts were not uniform and it would have matched zero rows. Use the value storage persists.
7. **Look for two numbers that should agree and don't.** That is the skeleton-hunting method — nearly every finding in this arc came from it, none from a bug report.
8. **`mergeable` is not evidence two open PRs are compatible.** GitHub compares each against main, never against each other.
9. **Normalise identifiers before counting them.** Case-splitting understated a field by 67 counties.

## WHERE THE PROGRAM ACTUALLY IS

**Done:** statewide parcel geometry — 11,603,489 `parcel-node` atoms across 195 counties, 18,556,547 atoms total, PMTiles live and browsable. That was the largest blocker on the board.

**The gap:** the ledger reads **0.7689%** (14 rails / 3,556 cells / 89 satisfied). Five rails are BUILT with ZERO coverage. **We have been building faster than we can apply, and the applies are now unblocked for the first time.**

**The single highest-value sequence in front of you:**

1. **Geometry scorer** (Q2) — RUNNING NOW, dispatched by the operator to a Cursor agent. Verify its numbers at source when it reports; do not accept the close report. Expect a LARGE move: it last ran against 119 counties and the sweep landed 132 including every metro.
2. **OWN apply** (Q1) — operator-ruled pre-launch-gate. 15 CAD counties. **Watch the first apply for `verifyFailures`** (see the residual risk below).
3. **The other four rail applies** — but see the ordering note; they are not equal-value.

## THE FIRST APPLY IS A TEST, NOT A ROUTINE RUN

All seven writers were repaired this session (eng #303 + #304). **Four of the seven types have ZERO rows**, so the did-derivation was proven by mechanism plus sibling evidence plus a unit test — NOT by observing a real round-trip.

**On the first `--apply` of each of owner-fact, well-fact, rail-corridor-fact, building-footprint: watch `verifyFailures`.** A systematic "atom not readable back" means the derivation is wrong, not that data is corrupt. Run ONE county first, read the close artifact, then proceed. Do not fan five applies at once.

## DECISIONS OWED BY YOU (not the operator)

- **Q13 — the stranded honesty work.** Six commits on `origin/feat/oz-crossfilter-derivation` (ldt), PR #276 CLOSED-not-merged. **The `0.74` propensity fixture they were written to retire is STILL SERVING on ldt main** (`brokerageGisCompositeLayers.ts:177`, with `propensity: 0.81`). Rebase-and-merge, or close deliberately and document the fixtures as known-synthetic. **Do not leave it ambiguous** — a synthetic number serving as if it were real is the exact class the L1 buildable-header defect belonged to.
- **Q8 — statewide roads GO/NO-GO.** eng #293 is open with CI FAILURE and DO-NOT-MERGE. H6 was never dispatched. A merged PR is not a go.
- **eng #295** (utility-easement writer) has CI SUCCESS but needs a merge-from-main; main has moved repeatedly.

## THE ONE THING THAT COULD EMBARRASS US EXTERNALLY

**Q11 contains a hard gate hiding inside a "batched by design" lane.** G1: the Stripe product reads **"Hauska Pro"**, which is a branding-canon violation (Hauska is substrate-only; the product brand is Smart Site / Empressa). **It must not reach an external tester.** Everything else in Q11 can wait. That one cannot, and it is currently sitting in a batch labelled *do not stop for these*.

## SEQUENCING RECOMMENDATIONS

- **Q3 + Q4 are ONE lane.** The harvest Class A cluster (`GEO_ID` 158, `BLOCK` 151, `MAP_ID` 147, `ABS_SUBDV_CD` 143, `TRACT_OR_LOT` 142) is parcel identity and plat lineage — the same job address-to-parcel resolution needs. Dispatching separately means two lanes on the same tables for the same reason.
- **Q7 (index audit) is worth running BEFORE the five applies, not after.** The atoms table now carries **ELEVEN** indexes on 18.5M rows / 29 GB — nine original plus two I added during the verify fix (`atoms_parcel_node_lookup_idx` 122 MB, `atoms_parcel_node_county_idx` 61 MB). Every index is maintained on every insert, and Q1 is about to write five rails' worth of atoms. **The audit must judge my two new indexes too, not just the original nine.**
- **Q6 and Q7 are NOT dispatched** despite what an earlier `_STATE.md` said. Briefs exist in the 08-10 session log; they need handing to an agent.
- **Q14 (per-state coverage add-on) just came due** — it was parked "revisit after the sweep lands." The sweep landed.
- **The five rails are not equal-value applies.** Owner is 15 CAD counties. Special-district is statewide from TCEQ (~2,439 tax-relevant polygons). Wells returned ZERO present atoms on Dallas and Bexar dry-runs — honest, but it means that rail lights up almost nothing today. Sequence by coverage gained, not by build order.

## OPERATOR CONTEXT

Launch gate may DRIFT by ruling; maximize parallel movement and fill the manifest. **Cost per jurisdiction is SETTLED (well under $200) — do not re-measure.** Market layer (Q12) is PARKED until Texas launches; do not open a lane. QA polish accumulates rather than stopping the build path. The operator wants **"a ton of map to backfill"** worked after the sweep — that is Q3/Q4/Q5.

Do not nag the operator on: R6 map browse, the three billing product calls, Donley CAD reply watch.

## WHAT THE OPERATOR SEES NEXT

When the scorer applies, the Command Center ledger moves off 0.7689% for the first time since the rail split — and it should move MORE than the county count suggests, because Bexar/Dallas/Tarrant/Travis/Collin were holding ~2.9M zoning-facts with no parcel-nodes to pair with. They have them now. **That number moving is the visible proof of the whole sweep.**
