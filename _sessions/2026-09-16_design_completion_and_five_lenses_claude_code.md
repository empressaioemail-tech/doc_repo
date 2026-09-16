---
id: 2026-09-16_design_completion_and_five_lenses_claude_code
title: "Session — carding the reconciliation, making design completion the first card, and drawing the five undesigned lenses"
date: 2026-09-16
kind: session
agent: claude_code
owner: nick
seat: integration
programs: [OPS-17]
related:
  - 90_operations/OPS-17_govtech_stack_plan_of_record.md
  - _inbox/2026-09-15_roadmap_reconciliation.md
  - _inbox/2026-09-15_design_addendum.md
  - _inbox/2026-09-15_bastrop_zoning_layer_findings.md
  - _decisions/2026-09-15_plan_review_reasoner_is_the_shown_design.md
  - _decisions/2026-09-15_police_and_fleet_lenses_in_scope.md
  - _design/INDEX.md
---

# Session: design completion and the five lenses

Ran 2026-09-15 into 2026-09-16 from the `integration` seat, `P:/doc_repo` on `main`. Picked up the
SmartCity design and delivery thread from the roadmap reconciliation and the design addendum.

## What shipped

Twelve plan rows carded (G-137 through G-148), four amendments (A-136 through A-139), two decision
records, five lens designs, and three instruments. Four commits: `124378fa`, `11a1b4e9`,
`38b5650d`, with `2e9cc214`, `f26d6e21` and `edda26e3` landing from other seats in between.

**All nine lenses in the shipped nav now have a design.** Measured, not asserted: fifteen nav
surfaces, ten designed, two excluded by ruling, three uncovered. The three that remain are Citizen
(G-142), Records search (G-147) and People and access (G-143), and none of them is a lens.

## The zoning finding, which was the largest thing in the session

The Jaime call reported that a property's zoning district had changed and the map did not reflect
it. Carding it meant reading the source, and the mechanism is bigger than one property.

`BASTROP_ZONING_URL` in `smartcity-os` points at a City of Bastrop ArcGIS layer **last edited
2023-04-28**, 565 features, while the city publishes three newer zoning layers: `Zoning_Place_Type`
(2025-06-02, 574), `Zone_Types` (2026-07-09, 595, described by the city as the new districts that
replace the B3 PlaceType code) and `Zoned_Parcels` (2026-07-23, 7,125).

**No failure mode the product can detect is present.** The query succeeds, the layer is healthy,
every requested field is there, and the answer is three years and four months old. This is the
silent half of G-136: that one was loud, a dropped field rejecting the whole query, and the city
told us within days. Its fix would not catch a layer that is merely superseded.

The cache explanation was rejected by reading the write path, where all three zoning routes fetch
upstream per request and hold nothing. The "city edits through a view whose edit date does not
advance" explanation was rejected on the feature counts, which are four populations rather than one
seen four ways.

Not carded, and worth more than the fix: `Zoned_Parcels_Revisions_Clip` carries per-parcel
`ZoneType`, `MinimumLotSize` and four setback fields. That is a live, city-published setback and
envelope source for Bastrop that no product reads.

## Design completion became the first card

The reconciliation ordered the work before anyone had counted design by surface. Counted, it was
five of fifteen. Eleven folders and forty-eight boards hide that completely, which is why G-146's
gate counts surfaces and not boards.

G-148 came out of building that gate. The rule that no design ships without an adversarial read was
earned on 2026-09-15 and **was never applied backwards**: five designs were past DRAFT with no
instrument, and two of them were already dispatched to build. It is held at operator direction, and
the plan-review ruling later in the session rested on one of the five.

## Execution moved to planner-owned subagents

Three lanes, one hand-carried dispatch compiled for each, executed by subagents rather than by the
operator carrying them out. The subagents did not touch git; the planner read every diff and
committed. Fanning that way adds no writers, which is what makes it safe.

Each lane was handed its source state rather than left to re-derive it, and each produced a design
argument that came out of that source:

Public works drew a phase-against-status matrix in which eight of twenty cells cannot occur by the
product's own rule. Parks was drawn as a surface that does not exist, because it has no vendor and
absence from the domain registry is the only surviving meaning of not built. Fire and EMS became
small multiples per station, because its own module says a rollup cannot say which station carries
the shortfall. Police turned out to be the only lens whose two regions disagree about their source,
and to disagree in opposite directions on the two shipped packs. Fleet was the first lens whose
vendor actually answers, so its second board asks what the page still says once it has filled.

## Verification, and what it cost to do properly

Every lane's report was treated as a claim. For each: scope checked, kit hashes verified, checks
re-run here, boards re-rendered independently and read, and arithmetic done by hand.

The planner planted its own violations rather than re-running any lane's. **Five of those plants
were mis-aimed**, three at a single occurrence when the checked position was elsewhere, one at
markup that did not exist, one using a phrase the product never emits. All were caught once aimed
correctly. The checks are tightly scoped rather than sloppy, and the planner's aim was the defect
more often than the check was.

One real hole survived that process and it is not universal. **A fixture badge changed to falsely
claim `Live records` passes, while deleting the badge fails.** That is the worse direction: an
absent badge is a visible omission and a false one is a claim. Public works, Fire and EMS and Police
catch it; `smartcity-dev-services` and Fleet do not. dev-services is the oldest check and the
pattern the others copy.

## Corrections made in-session

Three, all recorded rather than quietly fixed.

**G-143 was never blocked.** The row said it waited on G-132 for role vocabulary. The vocabulary
already ships in `staff-identity.mjs`. The planner asserted a dependency without reading the file,
which is the same error class as the Connections dependency asserted the day before.

**The 7.00 percent ordinance rate is real and is now sourced**, to Bastrop Code Sec. 11.04.002,
read from the city's own published article. The figure was right and the citation was absent, which
are different defects, and AMEND was still the correct call because plausibility is exactly what
stops anyone checking.

**A lane corrected itself.** The Fleet lane claimed a sentinel-id defect was local to its mapper,
then ran all five instead of assuming, found the claim false, and corrected its board, README and
close. The corrected finding is worse: every exported mapper invents three sentinels, and two share
a literal, so collisions cross lenses.

## Instruments built

`scripts/govtech/bastrop-zoning-layer-vintage.mjs`, 17 self-tests both directions, derives the read
URL from product source at a named ref and compares against every zoning layer the city publishes
live. Exits 1 today.

`scripts/govtech/design-completion-gate.mjs`, 24 self-tests including a fixture that passes, three
independently derived inputs so a wrong declaration fails against the filesystem and a stale folder
fails against the nav. Exits 1 while design is unfinished, which is the point.

Both refuse rather than report. The first live run of the gate exited 0 with no output, because its
direct-run guard used the naive `file://` form that is wrong on Windows: it reported success having
checked nothing, which is the exact defect class it exists to catch. Its entry point now has its own
regression test.

## Open, and owed

The operator-namespace ruling, raised independently by two lanes and settled by neither: Fleet and
Police declare byte-identical operator formats with no import between them, and nothing says whether
OPR-01 is the same person. Recommendation recorded in A-139 is to namespace by domain.

Ratify, amend or kill is now eight drafts. That is the gate on the Bastrop approval package.

Three product findings this repo cannot fix are owed to the seat that owns `smartcity-dashboards`
and have no row: `assertRecordShape` is never called on the live path while the live record carries
twelve undeclared fields including an inventory field set; the shared `"Unnamed unit"` sentinel;
and `operatorRef` required but absent from every live record.

Three smaller items raised and not acted on: `scripts/dispatch.mjs` stamps filenames in UTC while
every other dated artifact is local, so a dispatch can be filed a day ahead of its session; the
no-em-dash convention in CLAUDE.md is not being held in `_inbox/` working documents; and the
`integration` seat has no `_state/` namespace, so this close wrote no seat state rather than writing
into another seat's file.
