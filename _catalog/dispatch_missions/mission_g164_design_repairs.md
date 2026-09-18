## Mission - G-164: repair the 11 findings four design instruments disclosed

You launch no sub-agents (FAN-DEPTH 0). **This is the rare lane whose deliverable IS `doc_repo`:** you
WRITE in `doc_repo` under `_design/` and nowhere else. You write nothing in `smartcity-dashboards`,
`smartcity-os`, `plan-review`, `smart-files` or any other product repo. Doc_repo commits are
planner-owned, so **you leave every edit UNCOMMITTED and list the paths in your close**, and the
planner commits them. Do not stage, do not commit, do not push.

### The lane you follow, and why this row exists at all
    10|
`g148-design-instruments` instrumented four designs that were past DRAFT with no adversarial read. All
four instruments were delivered and the design gate went green, **and all four instruments exit 1 on
the boards as shipped.** The lane disclosed 11 findings as `leave_behind` rather than fixing them,
because its dispatch was to instrument what exists and not to redraw it. No row owned the 11, so the
operator carded them as ONE row, this one (OPS-17 `A-159`), because the repair and the instrument that
proves it are one unit of work. Its close is `_inbox/2026-09-18_g148-design-instruments_close.json`.

**The gate is RED until you land.** `A-159` also changed the gate's R3 rule: it used to test that a design's `check.mjs` EXISTS, and it now tests that it EXITS 0. That is why the gate read `exit 0` / `FINISHED` at `2026-09-18T20:32:13Z` and reads `exit 1` / `UNFINISHED`
with four R3 findings at `21:15:53Z`, on the same boards, with nothing in the designs changing in
    20|between. You are the row that turns it green, and `G-146` still does not close on it (`A-152`).

### What to repair, by folder, with the exact diagnosis

Read each finding as a CLAIM TO RE-CHECK AGAINST SOURCE, not as a copy fix. Most are stale negatives:
the design asserts something is absent or unavailable and the product or the engine has since made it
true. Ten are unblocked. **One is blocked and you must NOT fix it** (see below).

**`_design/plan-review-departments/` (4).** `Department.dc.html` draws finding 13 as "Fire apparatus
access" where the product's 13 is "Parking spaces required". `Letter.dc.html` renders 3 notice classes
counting 1 + 2 + 10 over the product's 13 findings, and carries no heading for the product's heldBack
    30|class, so that class is silently folded into another. `Letter.dc.html` also prints held-back finding 6
("Driveway width") under the escalations heading, which asks nothing of the applicant. And the design's
"no department model at all" claim, in the README and the canvas, is stale against `DEPARTMENT_ROLES`
at `plan-review` `origin/main` `99c156ba` `src/staff-identity.mjs:283`, a factual question A-145
already answered in the affirmative.

**`_design/smartcity-map-dock/` (4).** `Main.dc.html` and `Expand.dc.html` each render "Licences",
which is not a product tab, and each drop "Licenses", which is. That is four findings from one
one-letter error in two files, and the repair is to make each board's tab set match the shipped surface
rather than to rename it in both directions.

**`_design/smartcity-overview-lens/` (2).** `Main.dc.html` states "4 of 6 reading" over six lanes where
    40|3 render a fact read from a source. `Sparse.dc.html` is granted 1 of 10 sources and still promotes
Connections above the decision queue, where the shipped function demotes it. Note that
`_design/smartcity-overview-lens/check.mjs` is ALSO `G-157`'s inherited instrument, so repairing these
two is what makes G-157's proving instrument pass. It does not unblock G-157 itself, which still waits
on a v1 combined-dashboard capture.

**`_design/smartcity-flood-study/` (1) - BLOCKED, AND YOU MUST NOT REPAIR IT.** The design says naming
a depth by return period "would need a local rainfall atlas nobody has cited yet", while the engine
carries `rainfallSource: noaa-atlas14`, cites NOAA Atlas 14 seven times, pairs return period to depth
in `rainfallCurve`, and renders "100-yr (NOAA Atlas 14)". **A design-only correction here would make
    50|the page agree with a value the parser INVENTS.** G-125's unowned leave-behind is that NOAA's Atlas 14
HDSC endpoint changed payload shape, `parsePfdsDepthTable` never matches, and every no-parameter study
in every county silently uses Bastrop's 9.5in default. Leave the design byte-identical, leave
`check.mjs` byte-identical, and state in your close that this finding is held open on G-125, so that
one folder still exits 1 and the gate reports one finding rather than none.

### Acceptance, verbatim from the row

> `node _design/<folder>/check.mjs` exits 0 in all four folders with a non-zero matched-input count,
> each `violate.mjs` still catches every plant, and `node scripts/govtech/design-completion-gate.mjs`
> exits 0 with the instruments RUN rather than counted (A-159)

    60|Read that carefully: three of the four clauses are about the INSTRUMENTS still working, not about the
boards. Repairing a design until its instrument passes while hollowing out the instrument is the
defect this row exists to catch.

### The line you must not cross

- **You repair the DESIGN. You do not edit `check.mjs` or `violate.mjs` to make a finding go away.**
  Loosening a predicate so it stops firing is the exact defect class this whole program is about: an
  artifact that exists, is correct, and enforces nothing. The instrument is the second derivation; if
  you weaken it, the finding is gone and nothing was fixed.
- **If you conclude an instrument's finding is itself WRONG**, that is legitimate and important: state
  it with evidence, leave the instrument byte-identical, and put it in your close as a disputed finding
  for the planner to adjudicate. Do not delete the check.
- `_design/smartcity-records-search/Main.dc.html` was damaged once already this session by a batch
  `violate.mjs` sweep over every design folder: the sweep stripped a `data-coverage-rule` element from
  a tracked, RATIFIED board and only `git status` found it. **Run `violate.mjs` per folder, never in a
  batch, and after each run confirm the tree is clean.** If a run modifies anything, restore it by name
  and say so rather than silently checking it out. `node scripts/govtech/design-instrument-exits.mjs`
  is the hardened version of that sweep and refuses on a dirty `_design` tree, so prefer it over any
  ad-hoc loop.

### What you must not touch

- **No product repo.** If a finding looks like a product defect rather than a design defect, it is not
  yours; name it in the close.
- **Do not regrade plan rows, do not edit `90_operations/OPS-17_...`, do not edit
  `_catalog/repo_intents.md`, and do not run `smartcity-tracker.mjs`.** Those are planner acts. If a row
  status or an amendment looks wrong to you, say so in your close and leave the file alone.
- **Do not repair the flood-study finding.** It is the one blocked half of this row.

### Evidence your close must carry

- For each of the four folders: `check.mjs` pasted, exit 0, with its matched-input counts NON-ZERO
  (a zero count means the instrument stopped reading the board, which is a new defect, not a pass).
- For each folder you touch: its `violate.mjs` run pasted, every planted violation still caught, and
  `git status` showing `_design/` clean afterwards.
- `node scripts/govtech/design-completion-gate.mjs` pasted, showing `exit 0` with instruments RUN, or
  `exit 1` with exactly ONE finding if the flood-study half is still held - and if it is one finding,
  say which one and why.
- The exact list of uncommitted `doc_repo` paths you are handing back, so the planner can commit them
  by explicit pathspec.
- Your scratch block (LESSON / DEAD-END / GROUND-TRUTH with a timestamp / OPEN), returned in the close.
