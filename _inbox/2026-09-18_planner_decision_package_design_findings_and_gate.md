---
id: 2026-09-18_planner_decision_package_design_findings_and_gate
title: Decision package - an owner for the 11 design findings, and what the design gate's exit code should mean
date: 2026-09-18
last_updated: 2026-09-18
status: proposed (awaiting operator sign-off; nothing here is filed in the plan of record yet)
kind: decision-package
owner: nick
seat: integration
programs: [OPS-17]
related:
  - _inbox/2026-09-18d_HANDOFF_smartcity_planner.md
  - 90_operations/OPS-17_govtech_stack_plan_of_record.md
  - _inbox/2026-09-18_g148-design-instruments_close.json
  - _scratch/ops17_smartcity_planner.md
sources:
  - node scripts/govtech/design-completion-gate.mjs, run 2026-09-18T20:56:15.915Z, exit 0, verdict FINISHED
  - node scripts/govtech/design-instrument-exits.mjs, run 2026-09-18T20:56:16.938Z, 18 run, 4 failing
  - node scripts/govtech/smartcity-tracker.mjs, run 2026-09-18T20:56Z, PASS, exit 0, 26/26 self-tests
  - _inbox/2026-09-18_g148-design-instruments_close.json, missionEvidence.perDesign[].findingsOnTheShippedBoards (the lane's own per-instrument text)
  - OPS-17 amendments A-152, A-155, A-156, A-157, A-158
snapshot: doc_repo main a86f2f39, integration seat
---

# Decision package: the 11 findings and the gate

Two rulings are owed, and they are coupled. This is the proposal for both, with the evidence
re-derived at `a86f2f39` rather than carried from a lane's report.

## What I verified at `a86f2f39`

The tracker passes, exit 0, all tracked rows agreeing with their closes. The design gate exits 0 and
prints `verdict: FINISHED` at 20:56:15.915Z, reading 20 design folders, 18 carrying an instrument, 15
nav surfaces, 13 designed, 2 excluded, **0 uncovered**. At the same disk state the exits instrument
reads **18 run, 4 failing**. Both numbers are true at once, and that is the finding rather than a
contradiction.

The four failing instruments are exactly the four `g148` delivered: `plan-review-departments`,
`smartcity-flood-study`, `smartcity-map-dock`, `smartcity-overview-lens`. The 11 findings are named
verbatim below, taken from each instrument's own report text in the `g148` close (4 + 1 + 4 + 2).

I did not run `design-instrument-exits.mjs --violate` to re-derive ownership. It refuses a dirty
`_design`, and `_design` holds two uncommitted `check.mjs` files that belong to `g153`, which holds no
claim and filed no close. Ownership was already derived by `A-157` and reproduced by the lane's own
violate proofs.

## The 11 findings, by design

**`plan-review-departments` (4).** `Department.dc.html` draws finding 13 as "Fire apparatus access"
where the product's finding 13 is "Parking spaces required". `Letter.dc.html` renders 3 classes
counting 1 + 2 + 10 = 13 where the product partitions 13 as 1 corrections + 1 escalations + 10
notEvaluated + 1 heldBack, and no heading carries the product's heldBack class ("Held back -- cannot
enter this letter"), so it has been folded into another. `Letter.dc.html` prints held-back finding 6
("Driveway width") under "Escalated inside the city, no action from you - 2", which asks nothing of
the applicant, where the product holds that finding out of the letter as its own class. And the design
states the product has "no department model at all", in the README and the canvas annotation, where
`P:/plan-review` origin/main `99c156ba` declares `DEPARTMENT_ROLES` at `src/staff-identity.mjs:283`,
so the claim is stale and the roster the design proposes is the roster the product now carries.

**`smartcity-flood-study` (1).** The design states that naming a depth by return period is unavailable
because it "would need a local rainfall atlas nobody has cited yet", where the engine carries
`rainfallSource: noaa-atlas14 / parameter / default`, cites NOAA Atlas 14 seven times, pairs return
period to depth in `rainfallCurve`, and renders the default through `returnPeriodYearsForDepthInches`
as "100-yr (NOAA Atlas 14)".

**`smartcity-map-dock` (4).** `Main.dc.html` and `Expand.dc.html` each render "Licences", which is not
a product tab, and each drop "Licenses", which is. Two boards, each carrying the wrong label and the
absent correct one.

**`smartcity-overview-lens` (2).** `Main.dc.html` states "4 of 6 reading" over the six lanes where 3
of them render a fact read from a source. `Sparse.dc.html` is granted 1 of 10 sources and still
promotes Connections above the decision queue, where the shipped function demotes it (keyed on
`granted > 0`).

No row owns any of them. The highest id in OPS-17 is `G-163`.

## Ruling 1: one row, `G-164`, owns all 11

Recommended. They are one class of defect (a claim checked against source that has gone stale or
wrong, mostly a stale negative), each instrument that proves one is already written, and splitting
them across four rows would put four rows on one unit of work. Proposed cells, to be pasted as one
7-cell row matching the table's existing column order (`id | band | scope | accept | done-when |
blockedBy | status`):

- **id** `G-164`
- **band** `5`
- **scope** `Lane B: REPAIR THE 11 FINDINGS G-148 DISCLOSED. No row owns them. Plan-review-departments: finding 13 drawn as "Fire apparatus access" where the product's 13 is "Parking spaces required"; the heldBack class folded away so the notice counts 3 classes over 13 findings; held-back finding 6 printed under the escalations heading; and the stale "no department model at all" claim against DEPARTMENT_ROLES at plan-review src/staff-identity.mjs:283. Flood study: the stale claim that a return period cannot be named without an uncited rainfall atlas, where the engine cites NOAA Atlas 14 and renders "100-yr (NOAA Atlas 14)". Map dock: "Licences" rendered and "Licenses" dropped on Main and Expand. Overview lens: Main's "4 of 6 reading" roll-up over 3 lanes that read a fact, and Sparse promoting Connections while granted 1 of 10 sources.`
- **accept** `B`
- **done-when** `node _design/<folder>/check.mjs exits 0 in each of the four folders with a non-zero matched-input count, each violate.mjs still catches every plant, and design-completion-gate.mjs exits 0 with the instruments RUN rather than counted (couples to Ruling 2).`
- **blockedBy** `G-125 for the flood-study finding only (see below); the rest are unblocked.`
- **status** `OPEN`

**Four adjudications, not typos, named so the row does not read as copy-editing:**

1. `plan-review-departments` "no department model at all" is a factual claim already answered in the
   affirmative by `A-145`; the repair cites `src/staff-identity.mjs:283`.
2. `smartcity-map-dock` "Licences" is a navigation question: is the product tab "Licenses" or is the
   board right? Read at source, the board is wrong.
3. `smartcity-overview-lens` needs a rule for which roll-up number is correct before it can be
   repaired, and Sparse must be made to agree with the shipped demotion function.
4. `smartcity-flood-study` is the one that must not be fixed alone. The design's stated reason is
   wrong, and its conclusion may still be right: `G-125`'s unowned leave-behind is that NOAA's Atlas
   14 HDSC endpoint changed payload shape, `parsePfdsDepthTable` never matches, and every
   no-parameter study in every county silently uses Bastrop's 9.5in default. A design-only correction
   would make the page agree with a value the parser invents. This finding and G-125 are one
   reconciliation, so either `G-164` carries G-125's parser half or it waits on G-125. That is the
   only real blocker in the row.

## Ruling 2: what the gate's `exit 0` should mean

The gate's R3 rule asks whether a folder past DRAFT has a `check.mjs` and answers by testing
`hasCheck` at `scripts/govtech/design-completion-gate.mjs:157-163`. It never runs it and never reads
its exit code. Its own wording is honest ("carries an instrument"), so this is not a false statement,
it is that `exit 0` from an artifact titled `design-completion-gate` will be read as "the designs are
clean" and four of them are not.

**Option A (recommended): make R3 require the instrument to PASS.** R3 runs each required
instrument and exits non-zero on a failing one, so the gate's `exit 0` means "instrumented and
passing". This is the fail-closed reading and it makes the repair and its proof one unit. One enabler
is required first: a plain `check.mjs` run currently rewrites its own `instrument-report.json` with a
fresh `generatedAt`, so a gate that runs 18 instruments would churn tracked canon on every
invocation. The enabler is to make `check.mjs` read-only by default and write its report only under
an explicit flag, after which running instruments is safe from any consumer. Consequence, and it is
the honest one: the gate goes red until `G-164` lands, so `G-146` stays open, which is what `A-152`
already ruled it must.

**Option B: keep the gate read-only and change what it claims.** Stop at coverage, rename the verdict
so `exit 0` reads as "coverage complete" rather than "clean", have the gate print that it does not run
the instruments it counts, and make `design-instrument-exits.mjs` a required companion in the close
schema the way the tracker is. Cheaper, and it leaves the two numbers beside each other by
construction.

**A third state this forces, either way.** `smartcity-map-dock`'s Full layers panel renders 3 of the
product's 7 categories and 0 of its 4 active layers while its own header says "4 active". `g148`
reported it as a PARTIAL, deliberately neither failed nor passed in silence, because no rule says a
static panel must reconcile to its own header number. Option A makes that PARTIAL a hard failure, so
the row must either adopt that rule and repair the panel or the operator must exempt it by ruling.
This is not an argument against Option A; it is the one disposition Option A requires that Option B
does not.

If Option A is chosen, the mechanical change is small and testable: the IO layer in `main()` adds a
`checkExit` per folder beside the existing `hasCheck`, and the pure `evaluate()` gains one branch in
R3 (absent, exit 2 abort-shaped, and exit non-zero each reported distinctly). `design-completion-gate.test.mjs`
already exercises both directions, so the new branch can be proven by planting a failing instrument.

## Not part of either ruling, but owed on sign-off

These are planner-owned doc acts, listed so they are not lost, and none of them needs a new ruling:

- Apply the four `_design/INDEX.md` replacement lines the `g148` close supplies (`indexReplacements`),
  so each repaired design's index line names its instrument.
- Amend `G-149` and `G-157` to INHERIT their instruments, paste-ready text in the close
  (`missionEvidence.inheritance`). A second `smartcity-flood-study` or `smartcity-overview-lens`
  `check.mjs` written by a later lane would give two predicates over one board, which is worse than
  one instrument.
- Commit the regenerated `_design/SMARTCITY_TRACKER.md` (it now reads `a86f2f39`; the committed copy
  reads the stale `81627cff`).

## One thing that is not this seat's to resolve

`_design/smartcity-fleet-lens/check.mjs` (+85) and `_design/smartcity-police-lens/check.mjs` (+44) are
uncommitted, holding a real fix to the `\bOPR-` extractor trap `G-153`'s row already names. They were
written by `g153`, which holds no registry claim and has filed no close, and there is no dedicated
`g153` worktree. They are not this seat's to commit or revert (`A-154`). They are also the only thing
blocking `design-instrument-exits.mjs --violate`. Either the `g153` lane lands them with a close, or
the operator directs a disposition.
