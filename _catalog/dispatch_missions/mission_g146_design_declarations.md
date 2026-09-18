## Mission - G-146 parcel 2: the declarations the canvas omits, and the vocabulary fixed at source

You launch no sub-agents (FAN-DEPTH 0). **You WRITE in `doc_repo`, under `_design/`, and nowhere else.**
Doc_repo commits are planner-owned, so you leave every edit UNCOMMITTED and list the paths in your
close. `smartcity-dashboards`, `smartcity-os`, `plan-review` and `smart-files` are read-only to you.

### READ THIS FIRST: a sibling lane is in `_design/` right now, and the file sets are DISJOINT
    10|
`g164-design-repairs` is running against `_design/{plan-review-departments,smartcity-map-dock,`
`smartcity-overview-lens,smartcity-flood-study}`. **You must not open a single file in those four
folders.** Your writes are exactly these, and nothing else:

- `_design/all-canvas/build.mjs`
- `_design/plan-review/gen.mjs`
- `_design/INDEX.md`
- `_design/surface_coverage.json`

If your work appears to need a file outside that list, STOP and report rather than widening it. Two
lanes editing one directory tree is safe only while the paths stay disjoint, and the moment they stop
being disjoint the damage is a silently overwritten board, which happened once already this session
when a batch `violate.mjs` sweep stripped a `data-coverage-rule` element from a tracked RATIFIED board.

### Re-derive both residuals before you touch anything, because this row's counts were already wrong once

The row's own history is a warning: it carried counts frozen at A-137 while three later amendments
recorded different ones, and it took a recon instrument to catch that (A-152). **Do not trust the
sentences below as fact. Reproduce them.**

1. **The canvas declaration omits three designs.** The row states that `_design/all-canvas/build.mjs`
   declares 72 boards across 17 surfaces and that three designs which exist on disk are declared
   nowhere on it: `smartcity-citizen-lens`, `smartcity-people-and-access`, `smartcity-records-search`.
   All three were drawn on 2026-09-18 under G-142, G-143 and G-147. The row's reading is that this is a
   stale declaration list rather than a policy against DRAFTs, because the canvas deliberately includes
   DRAFTs. **Verify the count of undeclared folders yourself, by comparing the folders on disk against
   the declaration list, and state the two numbers.** If the set is not those three, say what it is.
2. **The vocabulary defect in `_design/plan-review/gen.mjs` is still translated at build time** by the
   review-artefact build script rather than fixed at source. Find the translation. Name the file and the
   line that compensates for it, and the string it compensates for. A build-time translation of a wrong
   source string is the defect: it makes the wrong string survive, so the next consumer that does not
   run the build script sees the defect.

### The trap that makes a lazy fix look like a pass
    40|
`_design/smartcity-records-search/Main.dc.html` was damaged by a batch sweep and restored by hand. That
board is RATIFIED and tracked. **Run `violate.mjs` per folder, never in a batch**, and after any
instrument run confirm `git status --short _design/` shows nothing you did not intend. If a run modifies
a board, restore it by name and say so in your close. Prefer
`node scripts/govtech/design-instrument-exits.mjs`, which refuses on a dirty `_design` tree, over any
ad-hoc loop you would write.

### Acceptance, verbatim from the row

> `node scripts/govtech/design-completion-gate.mjs` exits 0. It reads THREE independently derived inputs
> the product's own nav constants at a named ref, the `_design/` folder inventory on disk, and the
> declarations in `_design/INDEX.md` and `_design/surface_coverage.json` so a wrong declaration fails
> against the filesystem and a stale folder fails against the nav, and no single party can satisfy every
> half. It is a refusal, not a report: it exits 1 while design is unfinished.

**You will not reach `exit 0`, and you must not pretend to.** This row does not close on G-148 alone: R3
emptying is necessary and not sufficient, and the four R3 findings belong to `g164`, which is running
now. So the honest close for you is: the gate's output before and after your change, the R3 findings
that remain and whose they are, and `CLOSED-PARTIAL` with the residual named. **A close claiming `closed`
here would assert a green gate that a sibling lane owns.**

### Evidence your close must carry

- The undeclared-folder comparison, with both counts and the exact command that produced them.
- `node scripts/govtech/design-completion-gate.mjs` pasted, before and after, with its exit code and
  its findings attributed to the row that owns each.
- The vocabulary fix, with the compensating build-time translation quoted before and gone after.
- `git status --short _design/` after your instrument runs, showing you restored anything a run touched.
- The exact UNCOMMITTED `doc_repo` paths you hand back, so the planner commits them by explicit pathspec.
- Your scratch block (LESSON / DEAD-END / GROUND-TRUTH with a timestamp / OPEN), returned in the close.
