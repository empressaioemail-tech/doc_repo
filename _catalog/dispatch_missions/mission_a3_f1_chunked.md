# Mission A3 — F1 timed out for the reason containment did; chunk it

## Why this card exists

F1's pre-registered falsifier was that adding `side`, `rear` and `sourceCodeAtomRef`
to the provenance instrument must not move **188,103** or **158,573**. **F1 never
scored them.** Travis and Williamson returned UNMEASURED at the 15s
`statement_timeout`, and the lane correctly refused to invent zeros.

So both quarantine premises are unverified, and the setback bake sits behind that
quarantine. **This is the real gate on P4's setback half.**

**And it is the same failure that stopped containment.** A single-shot scan against
the two largest counties hit a statement timeout. Containment proved that chunk plus
ledger plus resume clears exactly this on exactly this store at this scale: Hays went
from six failed interactive scans to fifteen chunks in 14m16s with the timeout
**unraised**. Apply that shape here.

## What to build

Re-cut the F1 provenance measurement as a **chunked job**, borrowing the containment
pattern rather than inventing one:

1. Derive bounds per county cheaply, the way the containment scout did (it returned
   Hays bounds in 2,147 ms).
2. Chunk by a **range predicate**, never `IN (SELECT ... LIMIT)` — that subquery is
   opaque to the planner, estimated 1,841 against an actual 30,000, and flipped it to
   Nested Loop.
3. **One `run_event` per chunk** naming range, row count and wall time. A count is not
   a record.
4. **Resume from the ledger.** A failed chunk resumes; it does not restart the county.
5. Record per-chunk wall time as **data, not a law**. Do not fit a curve, do not derive
   a chunk size.

**Do not raise `statement_timeout`.** The fix is chunking, not patience. That
constraint is what made the containment result trustworthy.

## What the repaired instrument already does, keep it

`measure-setback-provenance.mjs` now reads `sourceCodeAtomRef` plus `fieldProvenance`
front **and** side **and** rear, and emits an `atom_did` PK prefix rather than claiming
McLennan from an `entity_id` FIPS range alone. `--self-test` fails on side-only and
rear-only fixtures. Do not narrow it back to make a number match.

## The falsifier, restated and still pre-registered

**Adding the side, rear and `sourceCodeAtomRef` axes must not move 188,103 or
158,573.** If either moves, **the published figures were wrong**, and that is the
finding. Report it plainly; do not reconcile it by narrowing the instrument.

Known-good anchors that must hold: Bastrop non-placeholder **7,534**; Bastrop
placeholder **1,969** = 9,503 − 7,534, which is not a third class.

**A chunk that times out is UNMEASURED for that range, never a zero.** Report the
ranges that did not measure and their count. A partial sweep reported as a total is
the defect this whole program exists to prevent.

## What this does and does not settle

Settles: whether the two premises survive the repaired instrument, and therefore
whether the quarantine scope is right.

Does not settle: F4's McLennan verdict (65,814 envelopes, 0 cited DIDs, 0 PK resolves,
`no-resolve`) which is **not** a claim that no rule exists under a key those envelopes
do not name. Does not lift `SETBACK_APPLY_HELD`. Does not start the setback bake.

## Do not

- Do not raise `statement_timeout`.
- Do not mutate or delete atoms. This is a measurement.
- Do not report a zero for a range that did not measure.
- Do not narrow the instrument to reach a number.
- Do not run concurrently with lane A1's containment sweep. **Confirm whether
  `neondb` and `hauska_mcp` share compute before assuming they do not contend.**
- Do not read `neondb` for atom counts; the atoms store is `hauska_mcp`.
- Do not touch any repository other than the registered worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare
snapshot in the first output. State the falsifier before running. Report scored and
unscored ranges separately. `leave_behind` named. Subagents do not commit.
