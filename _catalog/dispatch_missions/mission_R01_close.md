## Mission — incoming planner: close R-01, then unblock R-02b and R-04b

You are taking over as planner. Read `_sessions/2026-08-21_ops18_lanes_and_instrument_rules_claude_code.md`
first; it is the handover and it is honest about what the previous planner got wrong.

Do not start by chasing a defect. Start by closing the thing four rows depend on.

---

## The situation in one paragraph

OPS-18 is a ten-row plan of record about one problem: **the artifact exists and nothing feeds
it or reads it.** Five lanes ran in parallel. Four returned and are landed. The blueprint they
were all supposed to grade against **fails two of its own criteria**, and both remaining halves
of the programme gate on it.

## Row state, verified, do not re-derive

    R-00  CLOSED    c6399e8. WDLL, 15 violations, 7 criteria.
    R-01  RAN, FAILS ITS OWN WDLL. D1 FAIL, D2 MET, D3 PARTIAL, D4 MET,
                    D5 FAIL, D6 MET, D7 PARTIAL.
    R-02  census done (1,998 files). QUARANTINE HALF OPEN, gated on R-01.
    R-03  DONE. 99 parts; 14 ZOMBIE; 10 with no termination condition, plus 3
                    the detector missed because it does not match "superseded".
    R-04  register half done (57 doc_repo controls, 43 product, 55/57 with a
                    non-empty bypass). BLUEPRINT-MAPPING HALF OPEN, gated on R-01.
    R-05  CLOSED.
    R-06  9 controls live, 5 BLOCKING, all five violation-verified.
    R-07  partially pre-empted: the store audit produced the 9-family key grammar.
    R-08  not started.
    R-09  FIRED. Canary cortex-api-00525-bev at 0%. Traffic is operator-owned.

## Your first job: close R-01

**D1 fails because the WDLL never bounded "the canon set."** The mesh classifies 60 documents,
which is a curated subset of an estate the census puts at 1,998 markdown files. Nobody can say
a subset of what. Fix the CRITERION as well as the mesh: state what the canon set is, by rule,
so the mesh is checkable rather than a judgement call. Amend `_blueprint/00_WDLL.md` if D1 is
what is wrong; a criterion that cannot be met is a defect in the standard.

**D5 fails because the diagram and the prose disagree.** The mermaid puts Candidate then
Provisional; the ASCII puts Provisional under Resolved. D5 exists precisely to catch a diagram
asserting something the text does not define, and it caught one inside the blueprint. Make them
agree, and say which was right.

D3 and D7 are PARTIAL and are cheaper: D3 wants every rule naming a consumer, D7 wants every
figure citing the log it came from (one special-district figure cites the wrong one).

Then R-02b and R-04b unblock and can run in parallel again.

## Do NOT start with hasWriter, and here is why it is tempting

`deriveHasWriter` returns `indeterminate` on cortex-api because the engine script is not on
that container. That is honest — it does not fake a `false` — but a permanent "cannot tell" is
not a measurement.

**The fix is already half-built and is one wire.** `RAIL_ENGINE_BINDINGS` is a committed table
shipping inside cortex-api. `railEngineBindingCoverage.test.ts` already verifies CI-fail-closed
that every declared writer script exists in a real hauska-engine checkout. So the declaration
is in production and the verification is in CI, and production probes a filesystem anyway. The
change is: trust the committed binding, because CI already proves it true.

That is a genuine defect and it is exactly the governing line in product code. **It is also one
row in the map R-04b is supposed to produce.** File it, do not chase it. The previous planner
spent most of a session on the R-09 chain and produced one wire and ten wrong statements.

## Read this before you verify anything

`ENFORCEMENT.md` gained four rules on 2026-08-21 after the previous planner made ten wrong
load-bearing claims in one session. Every one was an ad hoc shell instrument that returned a
plausible answer. Not one was caught by re-reading a conclusion; each was caught by a lane, a
seat, or a control.

    A load-bearing claim needs a file-based instrument that has been shown to fail.
    Never read multi-field CLI output through a positional formatter.
    Read the authoritative record, never a proxy for it.
    Pre-register the falsifier for your own checks, not only for other agents' work.

The shape was constant: **the check returned the expected answer, so it was not interrogated.**
Assume yours will too.

## Standing facts that will save you a session

The doc_repo tree moves under you; it moved four times in one hour. `git log -1` and `git fetch`
before staging, explicit pathspecs only, and read `git diff --cached --stat` before committing.
A `git add _scratch/` once staged 528 files and 208,108 lines of scraped HTML.

SEAT-01 is armed now and refuses writes from unregistered worktrees. Register before writing;
registering afterwards does not cure a write already made.

CI is a ratchet. Known debt is pinned; new debt fails. **Never raise a `baselineExit` to turn a
red build green.** `cited-untracked` is marked `environmentStarved` because it cannot fire in a
clean checkout, and that exemption is only honoured when the entry carries both its evidence
and its way out.

The memory promotion gate fires when the untriaged Tier 2 backlog grows past its pin. Triage is
a decision; declining is valid and is the honest outcome for most lessons.

## Open operator decisions, not yours

The canary traffic shift for R-09. ADR-010 and doc 77 need superseded-in-detail amendments;
ADR-028 needs a real ruling because it is proposed, partly shipped, and its bitemporality
argument rests on a table with zero rows. And DC-4/DC-5 count `no-atom`/`no-writer` while
R-09's compute stamps `derivation-indeterminate`, which those criteria do not count.

## Close

Update `90_operations/OPS-18_canon_reconciliation_plan_of_record.md` row statuses as you go.
File decisions in `_decisions/`. Tier 2 scratch to `_scratch/`, and leave promotion to the gate.

End with a `leave_behind:` block. `none` is valid and cheap; the declaration is required.
