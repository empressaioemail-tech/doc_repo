---
id: 2026-09-15_design_thread_claude_code
title: Session — the design thread: three lenses completed, two rulings, seven defects caught by instruments
date: 2026-09-15
kind: session
agent: claude_code
owner: nick
programs: [OPS-17]
related:
  - _inbox/2026-09-15_design_thread_HANDOFF.md
  - _decisions/2026-09-15_design_ratification_pass.md
  - _decisions/2026-09-15_plan_review_role_gate_deferred.md
  - _inbox/2026-09-15_connections_surface_findings.md
  - _design/INDEX.md
---

# Session: the design thread

Continued from `_inbox/2026-09-15_design_pass_HANDOFF.md`. Closed with
`_inbox/2026-09-15_design_thread_HANDOFF.md`, which supersedes it.

## What shipped

**Development services completed.** Inspections, Code enforcement and Licenses ship in `DS_TABS`
on deployed main and had never been designed. Built from the product's own domain modules, with
the rows taken from the generators' actual output rather than transcribed. The lens now covers
all seven tabs and is the surface the first cohort opens daily.

The design argument came out of the source: each tab carries a queue plus a second axis, and the
three second axes are **not the same kind of thing** — inspections paired, code enforcement
ordered, licences continuous — so each is drawn as what it is rather than flattened to a
template.

**Finance lens, new.** Drawn against a 25-page capture of the v1 live Finance tab supplied by
the operator, and against the shipped v2 skeleton. Five artboards.

**Smart Files, new.** Drawn against its own repo, not against the dashboards nav item, which is
a mount point and says so on itself. Five artboards.

**Two rulings logged**, and **Connections stopped** before design on an operator ruling that it
needs engineering thought first.

## The operator correction that changed a design

The planner proposed that v2 Finance is "the same information with the fabrications removed."
The operator:

> That is just what we need to fill in to actually get to version two.

So removing the fabrications is the **gap analysis**, not the product. The lens was then drawn at
**full shape**: every cell it will ever hold exists on the page from the start, each one either
measured or countably unaccounted, and every unaccounted cell carrying a named acquisition path.
A whole artboard became the gap.

That reframing produced the most useful finding on the lens, which was invisible under the
original framing: **one acquisition, the fund ledger, fills four regions that are refused
today**, and it is a request to the city finance director rather than a build.

## Seven defects, and how each was caught

Not one was findable by re-reading the canvas. Each came from comparing a canvas against an
independently derived source.

| Defect | Found by |
|---|---|
| A `Place` tab the product never had | reading `DS_TABS` in the shipped nav |
| Five named people on a published workload ranking | grepping both repos for the strings; they appear in neither |
| Licence rows in the wrong sort order | running the product's own generators against the hand-written rows |
| Three residents named beside their addresses | the folder README quotes those same people as PII the design must not render |
| A 7.00% ordinance rate attributed to Bastrop's own code | searching the repo for any source; there is none |
| A dependency asserted to the operator that does not hold | reading `app.js`: the promotion fires only when `granted === 0`, and Bastrop grants seven |
| A check with zero inputs on every artboard | counting the predicate's matches instead of trusting its self-tests |

The PII one is the one to keep. The Development services README documents `DEBORAH MOORE,
PH#737-762-6252` and `REBECCA GARNER-LOZOYA` as PII the design must never render, and the
Pipeline artboard rendered `D. Moore` at `908 PINE ST` and `R. Garner` at `77 FARM ST`. The same
two residents, initialised, beside their addresses, on a canvas bound for their own city. **The
design contradicted the rule written in its own README**, and nobody reading the canvas would
have seen it.

## The Finance capture is the strongest sales evidence in the portfolio

Every headline number in v1 Finance is checkable and most are wrong. Actual Spent is the Budget
column copied — ten departments, ten identical pairs, 100% burn on every one, with an alarm
derived from the fabricated equality. A collection rate of 157% renders in green with a success
mark. $664.7M collected against a $69.6M total operating budget. The permit counts do not tie and
the two capture pages disagree with each other.

And the one nobody would catch: **budget pace is an identity, not a result.** "94% spent at 94%
of fiscal year, +0% vs expected." Spent equals budget by construction and elapsed drives the
expectation, so the variance is necessarily zero. It cannot come out any other way, and it reads
as the most reassuring number on the page.

Downstream, the Scenario Modeler stamps `HIGH CONFIDENCE` on three-year projections whose
expense baseline is that copied column. That is the screen a city manager takes into a council
meeting.

## Instruments, not habits

Three folders gained a `check.mjs`. Each self-tests in both directions before reading anything,
aborts rather than reporting a worthless verdict, and was verified by violation against a real
artboard.

`smartcity-dev-services` — 21 self-tests. Refuses an undeclared tab, a person-shaped name in a
table cell, and rows that drift from the fixture record.

`smartcity-finance-lens` — 11 self-tests. Refuses any money figure not traceable to the capture
record, unless the artboard declares itself illustrative on the page.

`smart-files` — 12 self-tests. Refuses any value outside the product's closed vocabularies: four
scope types, four source kinds, three not-indexed reasons, five provenance keys.

**One of them was starved and the fix improved the design.** The Smart Files reason predicate
passed every self-test and matched nothing on any artboard, because the canvas rendered display
forms and never the product's actual codes. Rendering the real codes made the check live and
made the design more precise for an operator at the same time.

## Corrections made in-session

Two claims reached the operator before they were checked, both about Connections, and both
wrong. It ships as a 75-row function-homes register, baked and fixed-point tested, so "not
designed" was misleading. And the Overview dependency used to prioritise it does not fire for
Bastrop. Both are recorded in the findings card rather than quietly fixed.

Also corrected: a rebase was the wrong instinct for a concurrent push. This repo uses merge
commits for exactly that, 38 of them in recent history.

## Left open

`_catalog/lane_claims.json` blocked a push mid-thread. Two lanes wrote it concurrently and the
planner did not touch it, because a claim means a seat started a lane. It resolved without
intervention: the other seat committed its claim, the merge went through, and `aaa0864` is on
`origin/main`. Nothing was stranded, and waiting was the correct move rather than adjudicating
another seat live state.

The plan-review role-gate deferral has no mechanism. Recorded in its own decision record rather
than left to read as enforced.

The `_design/plan-review/gen.mjs` vocabulary defect is still translated at build time rather
than fixed at source.
