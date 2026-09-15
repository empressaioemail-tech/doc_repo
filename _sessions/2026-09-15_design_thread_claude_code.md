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

---

# Continued: exports, the demo, and the Jaime call

## The demo was built, shipped broken, rebuilt, and then set aside

The operator asked for a clickable prototype for the city. It was built, deployed to Vercel, and
**it was not good enough**. The planner had said plainly that it had not been rendered, and
shipped it anyway. That was the wrong call: naming a risk is not the same as clearing it.

The rebuild was architectural. The first attempt treated every artboard as an interchangeable
full-app screen; three different product shells are in play, so screens lost their chrome and the
navigation went dead. The second generates the shell once in code and injects each artboard's
content region, with mounted products keeping their own inner nav exactly as the real product
does.

**Two defects were found only by rendering the page and reading it.**

The exclusion filter removed the wrong element. It searched backwards from a label and found the
innermost `div` -- the label -- so the marker string vanished, **the guard passed, and the box
body stayed on the page**. A check reporting success while the thing it protects against survives.

And stripping boxes was never enough: the excluded framing survived in prose. Measured at **31
internal-vocabulary hits**, fixed with sentence-level rewrites rather than a scrub, because a
scrub would have corrupted the Smart Files version column where `v1` legitimately means version
one of a document.

The planner's own guard then had to be **narrowed**: it flagged "a phrase that appeared in v1 and
was removed in v2", which is a true sentence about versioning. A control wider than its claim is
its own defect.

The operator set the prototype aside in favour of screenshots and a document. The demo build
survives at `_design/demo/` and the site is live, but it is not the deliverable.

## What the operator actually needed

**96 images at `_design/exports/`** -- 48 screens in dark and light, 3200 x 2080, numbered in
reading order. 37 cleared to show a city, 11 held back with a stated reason each.

**22 carry a placeholder strip** in both themes, worded for what is drawn: map, drainage model, or
plan sheet. The list was derived by grepping the artboards for their actual render content, not
from memory. A table of sample rows reads as sample; a picture of a map does not, which is why the
strip exists at all.

**Two customer documents.** A first pass framed around data integrity was rejected by the operator
-- *"accurate data is expected"* -- and rewritten around what staff can do. A second, focused
document covers the three capabilities the customer conversation actually turned on.

## The Jaime call changed the roadmap

The operator supplied a transcript of a call with Bastrop's IT director. It confirmed several
design decisions and moved the sequencing. Full reconciliation at
`_inbox/2026-09-15_roadmap_reconciliation.md`. The headlines:

**v1 is being retired**, stated to the customer. That makes six undesigned lenses a migration
obligation rather than a backlog.

**Role-based access and MFA are now a verbal commitment.** Neither is built. This is the largest
gap between what has been said and what exists.

**Hotel occupancy tax is the customer's priority** and separately billable, which puts the Finance
filings design -- currently under an AMEND ruling for an untraceable ordinance rate -- on the
critical path rather than parked.

**And one gap worth catching before it is demonstrated:** Smart Files "drop any link, Google Drive
or OneDrive, into one database" was described as a capability. The Bring files page is fixture
chrome and says so on itself. Nothing improper was said, but it is the item most likely to be
clicked in a demo.

Two live defects surfaced and neither is carded: the camera API connection is broken, and GIS
zoning gaps mean a changed zoning district is not showing on the map.
