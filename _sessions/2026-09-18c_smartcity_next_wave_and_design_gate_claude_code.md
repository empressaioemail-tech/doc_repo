---
id: 2026-09-18c_smartcity_next_wave_and_design_gate_claude_code
title: "Session: the SmartCity next wave compiled, the design gate caught mid-flight, and a control that counts rather than checks"
date: 2026-09-18
last_updated: 2026-09-18
kind: session
session_type: planning
status: closed (session close written; handoff at _inbox/2026-09-18d_HANDOFF_smartcity_planner.md)
agent: claude_code
repo: doc_repo
owner: nick
seat: integration
programs: [OPS-17, OPS-25]
related:
  - _inbox/2026-09-18_HANDOFF_smartcity_planner.md (consumed)
  - _inbox/2026-09-18d_HANDOFF_smartcity_planner.md (written)
  - _inbox/2026-09-15_roadmap_reconciliation.md (updated)
  - 90_operations/OPS-17_govtech_stack_plan_of_record.md (A-154, A-155; G-152 and G-163 status cells)
  - _catalog/dispatch_missions/mission_g152_public_works_fire_ems.md (new)
  - _catalog/dispatch_missions/mission_g163_opaque_platform_routes.md (new)
  - _scratch/ops17_smartcity_planner.md (updated)
snapshot: doc_repo main ed457a78 at open; smartcity-dashboards origin/main 7487d7c0 and smartcity-os origin/main 1f0262f1 read at source; design gate re-run 2026-09-18T20:19:39.877Z; tracker re-run at 20:4xZ
---

# Session: the next wave, and the design gate caught mid-flight

## Seat and snapshot, declared before the work

Repository `doc_repo`, branch `main`, head `ed457a78` at session open. The harness reports this as
**seat `integration`**, and `_catalog/seat_register.json` says what that means: the primary checkout and
merge target, explicitly **"Not a planner seat"**, on branch `main`, which **"does not write seat
namespaces"**. `scripts/enforcement/seat-worktree-gate.mjs:156-162` enforces exactly that, returning
`namespace_from_integration` for any `_state/<ns>/` path from here.

**So this session wrote no `_state/` file, and `_state/govtech/STATE.md` was NOT updated.** The OPS-17
work below is govtech-seat work and this session ran it from the integration worktree, which is the same
arrangement the previous SmartCity sessions used. The consequence is recorded rather than worked around:
the govtech STATE update belongs to `P:/seat-worktrees/govtech/doc_repo` on `seat/govtech`, and this
close cannot do it. `_STATE.md` was regenerated from the same worktree, because that file is at the repo
root and is not a seat namespace.

## What the session did

**Read state at source before touching anything, and three lanes were still moving.** `g153-fleet-police-lens`
and `g148-design-instruments` live and claiming; `g162-v1-finance-honesty` running **unclaimed**;
`g160-served-commit-parity` stopped on a false "already done" with parcel 2 re-dispatched.

**Compiled the next wave, which turned out to be two dispatches rather than four (OPS-17 A-154).**
`g152-public-works-fire-ems` and `g163-opaque-platform-routes`, both canonical (`CANON-PREAMBLE
v49001500`, `AGENT-CONTRACT v378cd643`, `DEV-PROCESS vbb19bd34`, `FLEET-MEMORY v2a98086b`, verified
against source), both FAN-DEPTH 0. Each mission names the lane it must wait behind and carries two
anti-collision instructions: do not write until the sibling lane's close is filed, and if you find an
uncommitted tree that is not yours, STOP rather than cleaning, stashing or committing it.

**Reconciled the design gate mid-flight, and it went GREEN while the session was running (OPS-17 A-155, A-156).** At session
start the gate read 14 of 20 design folders instrumented with four R3 lines. Re-run at
`2026-09-18T20:19:39.877Z` it read **17 of 20 and one R3 line**, because `g148` delivered three of its four
instruments during the session. By `2026-09-18T20:32:13Z` the fourth had landed and it read **18 of 20, zero
findings, `verdict: FINISHED`, `exit 0`**. The two instrument-less folders are `plan-review` and
`smartcity-place-tab`, both SUPERSEDED by dated rulings, so neither requires one.

**Carded nothing new, deliberately.** Two findings were placed on existing rows rather than given rows of
their own, and the reason is in each case that no lane owns them.

## Findings that changed the plan

**The gate went green at `exit 0`, and all four instruments it counted FAIL. The defect is a count control's exit code, not its statement.**
`design-completion-gate.mjs:157-163` tests `hasCheck` and never reads an exit code, and its own output is
honest about that, printing "carries an instrument". So the gate did not lie; what it did is exit 0 at
`2026-09-18T20:32:13Z` over four designs that are wrong by their own instruments, and `exit 0` from an
artifact named `design-completion-gate` will be read by every downstream consumer as "the designs are
clean". Measured at that same disk state: `smartcity-overview-lens` exit 1 (`Sparse.dc.html` is granted 1 of
10 sources and still promotes Connections above the decision), `smartcity-flood-study` exit 1 (the rainfall
claim), `smartcity-map-dock` exit 1 (the tab nav drops "Licenses"), `plan-review-departments` exit 1 (the
design says the product has no department model where the README's source-state section says otherwise).
**They are the four `g148` delivered.** And they are **design defects rather than instrument defects, which
is proven and not assumed:** each folder's `violate.mjs` exits 0, catching its planted violations on a real
artboard (`plan-review-departments` 17 of 17) and confirming a repaired copy passes with a matched-input
count. **Four designs now carry an open, reproducible finding and no row owns them**, which is the shape
A-152 predicted when it ruled that G-146 does not close on G-148's instruments.

**My own first write of this finding was wrong, and the correction is part of it.** A-156 originally said
the gate's two instrument-less folders were `all-canvas` and another derived view. That was a guess dressed
as a measurement. Read at source, the two are `plan-review` and `smartcity-place-tab`, both SUPERSEDED by
dated rulings, and R3's instrument-required set is exactly `RATIFIED`, `APPROVED` and `IN REVIEW`. The
exemption I had attributed to R1 was R3's status vocabulary, and the guess would have put a false claim
into the plan of record.

**The flood-study finding cannot be fixed on the design side alone.** The design says naming a depth by
return period needs "a local rainfall atlas nobody has cited yet"; the engine already cites NOAA Atlas 14
seven times. But G-149's own row records that the NOAA parser is broken: `parsePfdsDepthTable` never
matches and every no-parameter study in every county silently uses Bastrop's 9.5in. The design's stated
reason is wrong and its conclusion may still be right. A design-only correction would entrench the parser
defect by making the page agree with a value the parser invents, so both facts travel to G-149 together.

**G-152 goes before G-149, on a dependency rather than on row order.** G-149 INHERITS the flood-study
instrument that `g148` is still delivering and still owns, so it waits on `g148` as well as `g153`.
G-152's two designs are touched by no running lane, and both their instruments exit 0 with non-zero
matched-input counts, re-run this session. The recommended order in A-144 would have picked G-149.

**The `smartcity-os` collision was measured, not asserted.** G-162 works in `finance.ts`, `opengov-bnp.ts`
and `services/opengov-bnp.ts`; G-163 works in `firstdue.ts` and `goto.ts`. The primary files do not
overlap, and `ai-assistant.ts` matches both greps. So serializing them is discipline under "one owning
seat per repo", not a hard merge necessity, and both the mission and A-154 say so rather than overstating
it.

## Errors of my own, and what caught them

1. **I overwrote the BLOCKED cell of G-152 and G-163 instead of the STATUS cell.** A markdown table row
   split on unescaped pipes keeps the empty leading element, so the status is `parts[7]`; I had used
   `parts.slice(1,-1)` in the read script, where the same cell is `c[6]`, and carried the index across.
   **The tracker did not catch it,** because it reads the status cell, which I had not touched. Caught by
   re-reading the rows with the read tool. Both cells were restored and the repair script now asserts the
   current value of every cell it writes.
2. **The tracker then REFUSED the row, correctly.** `DISPATCHED` is not in its status vocabulary
   (`CLASSES`, `smartcity-tracker.mjs:40`); `classify()` returns `unknown` and the run exits 2 naming the
   row. The fix was not to widen the vocabulary but to put the routing word after the class word:
   `OPEN, DISPATCHED 2026-09-18 (A-154), ...`. The refusal is the control.
3. **I wrote a guess into the plan of record and had to correct it.** A-156's first draft said the gate's
   two instrument-less folders were `all-canvas` and another derived view, which I had inferred from the
   gate's R1 exemption rather than read. The measured answer is `plan-review` and `smartcity-place-tab`,
   both SUPERSEDED by dated rulings, and they are exempt because R3's instrument-required set is exactly
   `RATIFIED`, `APPROVED` and `IN REVIEW`. Caught by running the folder scan and reading
   `surface_coverage.json` before moving on. The seed of it is worth naming: the guess was plausible, and
   plausibility is exactly what makes this error class survive review.
4. **I then made the same error in the other direction, in this very close.** Correcting that sentence I
   silently renamed `parsePfdsDepthTable` to `parsePfdsTable` in `00_current_state.md`, from memory, while
   writing about memory being untrustworthy. Caught by grepping for both spellings and reading the
   definition in `hauska-engine/packages/adapters/src/hydrology/noaaAtlas14.ts:29`. **The correcting edit is
   as unverified as the original**, which is the part I had not internalised.

The R3 gap itself was found by a different habit, and it is not an error of mine: **I asked what a control's
exit code MEANS rather than reading the control and stopping at its value.** Had I taken `exit 1` as the
whole answer, the session would have reported "one finding left" without noticing that clearing it
certifies nothing, and the four failing instruments would have gone unread.

5. **I damaged a CLOSED, RATIFIED design board and the tool I was running did not say so.** My first
   `--violate` sweep left `_design/smartcity-records-search/Main.dc.html` with its
   `data-coverage-rule="documents"` element removed. `git status` found it; the sweep reported it only as one
   line inside that folder's captured stdout, which read as noise next to 18 rows of exit codes. Restored,
   and the folder's `violate.mjs` is provably re-entrant (3 of 3 clean from a restored tree), so the damage
   was the sweep's shape: 18 mutate-capable instruments in a loop, with nothing checking they put the boards
   back. **I had built a writer over tracked canon and treated it as a read.** The fix is in the instrument
   rather than in my memory: it now refuses a dirty tree, verifies restoration after every `violate` run, and
   names every file it restored. **Two bugs in that guard were then found by violating it, not by reading
   it:** a whole-output `trim()` ate porcelain's leading status column and shifted every path by one
   character, and an absolute Windows pathspec handed to git reads backslashes as escapes and returns an
   empty list — i.e. "clean" for a dirty tree. The self-test covers the second of those now.

All five were caught by an instrument, a refusal or a read-back, not by re-reading a conclusion. The fifth is
also the only one where I was the one who caused the damage, and the thing that found it was the guard I had
just written for a different reason.

## New instruments

**One, and it is committed: `scripts/govtech/design-instrument-exits.mjs` (OPS-17 `A-157`).** It runs every
`_design/*/check.mjs` and prints each exit code **beside** `design-completion-gate.mjs`'s verdict, which is
the number the gate never reads. `--violate` adds each folder's `violate.mjs` and derives ownership: a
failure whose `violate.mjs` exits 0 is the DESIGN's, and one whose `violate.mjs` is missing or failing is
UNPROVEN rather than a defect. Self-test **6 of 6**, planting both directions rather than asserting them.
First real read: 18 instruments, 4 failing, gate `exit 0` `FINISHED`, all four marked DESIGN.

**And it caught this seat before it caught anyone else.** My `--violate` sweep left
`_design/smartcity-records-search/Main.dc.html` — tracked, RATIFIED, G-147 CLOSED — with its
`data-coverage-rule` element removed. `git status` found it; the sweep's own output mentioned it only inside
one folder's captured stdout. Restored, verified, and three repeat runs of that folder's `violate.mjs` from a
clean tree are clean 3 of 3, so the damage was sweep-shaped: I ran 18 mutate-capable instruments in a loop
with nothing verifying they put the boards back. The instrument now refuses a dirty `_design`, verifies
restoration per folder, and **names every file it restored**.

Two temporary scripts are recorded rather than left as folklore: `P:/tmp/rows.mjs` (read named OPS-17 rows by
cell) and `P:/tmp/setstatus.mjs` plus `fixstatus.mjs` / `fixstatus2.mjs` (the bad write and its two repairs).
Also `P:/tmp/violate-reentrancy.mjs` (the 3-run restoration test) and `P:/tmp/dbg-selftest.mjs` (which found
the porcelain-trim bug). The gate and the tracker were re-run rather than quoted. The `g148` lane's
instruments remain **uncommitted** in `_design/`, which is correct: doc_repo edits are the planner's to
commit, and they carry debug debris (`.dbg.mjs`, `.check.log`, `.violate.log` in `smartcity-flood-study`)
that must not reach the commit.

## Commits

One commit this session: the wave, the three amendments, the roadmap, the new instrument, the scratch
block and this close, added by explicit pathspec.

## Refinement notes

Three things worth carrying forward, all about artifacts rather than about intentions.

**A generated artifact's index base is part of its contract.** Two scripts in one session disagreed about
which cell was the status, and the one that wrote was the one that was wrong. The doctrine already says
to verify a check by violating it; the cheaper version for a write is to assert what is there before
overwriting it.

**A control that returns a verdict should say what its verdict required.** The gate's R3 is honest about
its own question and its output invites a stronger reading than it supports. Whether it should RUN the
instruments it counts, or state that existence is all it checked, is an operator call and is on the
handoff's queue.

**A seat constraint that blocks a required step is a finding, not an obstacle to route around.** This
session could not update `_state/govtech/STATE.md`, and the correct response was to say so plainly and
record it in the handoff rather than write a file the gate refuses.
