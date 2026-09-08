---
date: 2026-09-08
agent: planner
repo: docs
session_type: execute
memory_graded: none
rolled_up: false
---

# Reports content revision: five lanes, and R-04 part 1

Continues `_sessions/2026-09-07_reports_outage_and_p120_recut_claude_code.md`.
That session fixed the outage and re-cut the program; this one reviewed what
the reports actually SAY and started rebuilding it.

## The content review

The operator reviewed all four report PDFs and the diagnosis was sharper than
anything in the card: the documents are written from the system's point of
view, not the buyer's. Almost every sentence answers what the pipeline did
rather than what it means for the reader. That is a copy problem more than an
architecture problem, and cheaper to fix than any of the data work.

Defects confirmed against `origin/main` with locations, so nobody re-finds
them: `pdf/feasibility.ts:319` prints raw model keys (`specialDistricts`,
`hoa`) as customer-facing labels; `:471,478` puts a fact count on the cover;
`:499` promises "a citation for each sentence" on a branch that emits none.
Plus a verdict with no noun, a raw jurisdiction slug, and dangling sheet
references.

The dangling sheet reference and the missing aerial turned out to be ONE bug.
Feasibility appends the site plan with `sheets: "drawing-only"`, so sheet 1
comes across and sheet 2 does not, and sheet 2 holds the segment table the
drawing's fine print points at. Rendering the sections the manifest already
declares fixes both.

**The manifest over-declares.** `FEASIBILITY_MANIFEST` names ten sections; the
renderer honours four. Six declared sections do not render, including the
flood study and the aerial. The manifest was built as the control and it is
currently a presence-shaped artifact, which is the class the re-cut existed to
delete.

**The absence taxonomy is the biggest lever and it is mostly copywriting.**
The fail-closed system is genuinely differentiated, but the copy makes honesty
look like breakage. Nine gray UNAVAILABLE chips flatten five different
situations: checked-and-clear, not-applicable, out-of-scope, blocked-at-source,
and failed-this-run.

## What was decided

Twenty-nine revisions, all buildable on data already carried, cut into five
lanes R-04 to R-08. Split by FILE ownership rather than by theme: nearly every
revision touches `pdf/feasibility.ts` or `report-model.ts`, so a theme split
would have put three lanes inside each.

Excluded with reasons, recorded so nobody re-proposes them: comparables and
recent approvals (no permit data, no acquisition path, and the highest-value
item on the list); units/GSF yield (needs height, FAR, coverage, parking; the
setback corpus carries setbacks only); utility capacity (published nowhere we
carry); city limits and ETJ (no adapter); wetlands and thoroughfare (scoped,
unbuilt); dollar estimates (uncitable).

## R-04 part 1, shipped

hauska-engine PR #407, three commits, MERGED as `e16142ee` (CI green, base
verified unmoved at 661f620 before the merge).

**The absence taxonomy as a TYPE.** `FeasibilityFactState` went from two states
to five kinds, required and first, so the compiler asks every producer which
kind of nothing it found. All 17 call sites surfaced by the type system rather
than by grep.

The discovery that made `clear` real: `special-district-fact`, `well-fact`,
`rrc-pipeline-fact` and `building-footprint` ALREADY persist an explicit
"checked, found nothing" row, and the composer filtered them out with
`&& !a.absence`. So "the source ran and found nothing" and "nothing ever
looked" fell into one branch and rendered identically. The absent/zero/
unmeasured collapse, in the composer, with the data to separate them already
on file. Third system this week with the same shape.

**The three PR #404 fact families reach a report.** Floodplain acreage with a
real FIRM panel from NFHL layer 3, SSURGO soil, HIFLD electric territory:
merged 2026-09-07, fully tested, and nothing outside each module's own
directory imported any of them. Five families added rather than three, because
acreage and the FIRM panel can genuinely disagree on present/absent.

Armed rather than dormant: resolvers injected (they are live network reads, and
defaulting them would make every unit test reach the internet), with the
forgetting-to-pass failure closed on both sides -- an omitted resolver reports
`out-of-scope` naming that it was not requested, and the live wiring is armed
at the engine-api route.

## The finding that outgrew the lane

Six instances in one window, across two programs, of the same class: work that
is merged, correct, tested, and reaching nobody.

Mine: PR #404's three fact families. doc-repo-79's four: the `buildingFootprint`
reconciliation merged and never run; the `setbackFrontFt` refused state ruled
and never implemented; the boundary-edge writer that could not execute at all
since the v2 lease law; and A-027's setback tables landing and reaching no
customer because nobody scoped the bake.

**"Merged" is being treated as a terminal state and it is not one. The terminal
state is "reached a consumer", and nothing measures the gap.**

This lands on the existing standing decision that text search cannot answer
structural questions. What made the #404 case visible was asking who imports
this FROM OUTSIDE THE MODULE; a grep for the module name inside its own
directory returns plenty and tells you nothing. Two independent routes to the
same rule.

doc-repo-79 is carrying it as an OPS-16 row: an import-graph instrument that,
per merged module, answers whether anything outside its own subtree reaches it,
and fails when the answer is nothing. The predicate MUST exclude the module's
own subtree or it reports health on exactly the cases it exists to catch, and
it needs a falsifier: run it against a known-reached module and against one of
the six, and confirm it distinguishes them.

## Coordination

Five lanes registered in ONE write to `seat_register.json`, each carrying both
`path` and `worktree` -- the field whose omission would have had the
seat-worktree-gate refuse eight of nine lanes the night before. Caught before
delivery that the five compiled dispatches named no worktree and none were
registered, so every lane would have been refused on its first shell and read
as misconfigured from the inside.

A routing collision: the operator told cente-30 to take R-04 at almost the same
moment they told this session to execute it. cente-30 acted on neither and went
to the operator, which is correct. Resolved in favour of this session. The
underlying cause is that lane assignment happens both by cross-session message
and by typing into a window, and neither path can see the other.

doc-repo-a0 was caught about to wire content into a Settings tab that is
deliberately silent: `NextActionContext` excludes `"affiliate"` by type, with
the reasoning written down and a P-98 acceptance test asserting the rail stays
quiet. Their diagnosis was better than mine on the evidence they had; the code
said one of their two tabs was silent on purpose.

## Open

- R-04 remainder: binding constraint, pad yield, what-would-change, open-items
  work plan, utilities into open items.
- R-05 through R-08: worktrees created and registered, not started.
- engine-api deploy, still held. **New:** once R-04 lands, the feasibility route
  makes three live outbound reads (NFHL, SSURGO, HIFLD) on a customer-facing
  synchronous path that it did not before. doc-repo-79 holds the interlock and
  will carry it as its own deploy line rather than folding it into a summary.
  Smoke it against a parcel confirmed to return all three PRESENT, not against
  48021:52726/52727 by default -- those compose a full feasibility but were
  never checked for exercising all three.
- The ffi/ToUnicode instrument finding, and the fabricated-zero guard finding,
  both from 2026-09-07, unchanged.
