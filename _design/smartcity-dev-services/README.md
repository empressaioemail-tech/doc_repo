# SmartCity Development services lens

**Artifact:** https://claude.ai/artifact/4ohGzSBeNYkNZm1h1NfYeq
(same canvas as the older `code/artifact/1ed0733e-e10c-4ec6-948e-66d2b24e562e` spelling; this is the canonical URL)
**Decision:** pending operator ratification
**Status:** IN REVIEW. Extended and corrected 2026-09-15; the lens is now complete at six artboards.
**Source:** v1 capture `SmartCity OS Screenshots (1).pdf`, 18 pages, read frame by frame (2026-09-14).
Extended 2026-09-15 from `smartcity-dashboards` at `origin/main` `f776b4bf` read directly:
`web/index.html`, `src/adapters.mjs`, `src/fixture-seam.mjs`, and the three domain modules
`src/domains/inspections.mjs`, `code-violations.mjs`, `business-licenses.mjs`.

This is the DENSEST lens, so it is where the lens pattern gets fixed. Fourteen of fifteen v2
destinations inherit it. It is also the lens the first cohort opens daily: the cutover WDLL
names Development Services staff as the people who go first.

## Regenerate and check

    node gen.mjs
    node check.mjs

`check.mjs` is the adversarial read written as a file. It self-tests in both directions before
it reads an artboard, and it exits non-zero on a violation. Four defects reached this folder and
survived a review pass, and not one was catchable by re-reading the canvas.

`fixture-rows.json` is the rows and counts on the three demo-pack artboards. It is **the output
of the product's own generators**, not a transcription of them: produced by running the five
domain modules from `smartcity-dashboards` `origin/main` `f776b4bf` against `bastrop_tx` at seed
0. Do not hand-edit it. Re-dump it if the fixture plans change, and re-run `gen.mjs` after.

## The moves

- **Three tiers, not two walls.** v1 stacks six lens tiles plus five tab metrics before content.
  Tier 1 attention row (entry points, primary), tier 2 tab strip with inline counts, tier 3
  compact tab metric strip (secondary, no cards).
- **One table treatment.** v1's Code enforcement table is the most scannable view in the app;
  everything else is stacked rich rows. The table wins and every tab inherits it.
- **The free-text description is not a list column.** See PII below.
- **One load pattern.** Inspector / Manager / Officer load are one component, not three panels.
- **Service performance is a view mode** (List / Map / Performance), not a stray button.
- **Plan review is a named tab and a separate scope** (operator ruling 2026-09-14).

### Added 2026-09-15: the second axis takes its shape from the data

Every operational tab carries a queue and a second dimension beside it, and the three second
dimensions are not the same kind of thing. The domain source says so in its own words, and the
rendering follows rather than flattening all three into one component.

| Tab | Second axis | Drawn as | Because |
|---|---|---|---|
| Inspections | Result | four peer classes | defined for every record, meaningful for a subset |
| Code enforcement | Escalation | an ordered ladder | rung 3 is further along than rung 2 |
| Licenses | Expiry | derived bands, boundaries printed | an integer every record carries |

A template that drew all three as tiles would be asserting they are the same shape. They are
not, and the difference is the thing a member of staff reads.

### The three new tabs render the demo pack, deliberately

Pipeline and Work orders show a granted MyGov read. Inspections, Code enforcement and Licenses
show the same lens **before** a source is granted, which is what Bastrop staff see on day one.
It is also the only mode in which every value on the screen is checkable against the domain
source rather than asserted.

It is the honest answer to *is any of this real*: the fixture place vocabulary is
`Template Commons`, `Fixture Ridge`, `Example Crossing`, `Sample Bend`, `Placeholder Heights`,
`Specimen Yard`. **The demo data announces itself as demo data, in the data.**

Three of the six attention tiles decline with a reason rather than showing a zero, because the
fixture carries no dimension to measure them against. Inventing a zero for those three would be
three false claims in the most prominent row on the page.

## Four defects fixed 2026-09-15

Every one was found by comparing the canvas against a second, independently derived source, and
not one was catchable by re-reading the canvas. That is the whole argument for the rule.

**The strip carried a Place tab the product never had.** Eight tabs were drawn; `DS_TABS` and
`TAB_LABELS` in `web/index.html` both carry seven and neither carries `place`. The map became a
persistent dock rail instead (`_design/smartcity-map-dock`, approved, dispatched G-128), and
`_design/smartcity-place-tab` is kept as the record of the option not taken. A design going to a
city for approval may not show a tab we ruled against building.

**The Manager load strip named five people.** `R. McBain` (flagged over capacity), `A. Jordan`,
`C. Kennedy`, `W. Mannon`, `G. Recoil`. Those strings appear nowhere in doc_repo outside
`gen.mjs` and nowhere in `smartcity-dashboards` at `origin/main`, so they were either invented
or transcribed from the capture PDF, which is not in this repo. Either reading is disqualifying:
invented staff on a workload ranking is fabrication, and real staff on one is not ours to publish
to their employer. The product had already ruled it, in `src/domains/inspections.mjs`:

> The inspector load table is then still buildable, which is the point: the dimension survives,
> the person does not.

Opaque references now, and the load table still works.

**The licence rows were in the wrong order.** The rows were hand-written first, and checking
them against the real generators found it: within a status band the sort is by expiry offset, a
seeded random draw, not by record id. Ids, references, statuses, rungs and types were all
correct, which is exactly why this one would never have been noticed by looking at the canvas.
The fix is structural rather than a correction: the rows now come from `fixture-rows.json`,
which is the generators' own output, and `check.mjs` refuses an artboard whose rendered ids
drift from it.

**Three residents were named on the Pipeline artboard.** `D. Moore` at `908 PINE ST`,
`R. Garner` at `77 FARM ST`, `M. Leavis` at `11 DEPOT ST`. Two of the three are the same people
this README quotes below from the v1 capture as PII the design must not render, initialised and
placed beside their addresses, on a canvas that goes to their own city. **The design contradicted
the rule stated in its own README.** Individual applicants are opaque references now and the
basis says so on the artboard. Business applicants stay named: a business on a permit is a
commercial entity and a public record, so naming one names no person. `check.mjs` refuses a
person-shaped string in any table cell and allows a business.

## PII — read this before implementing

v1 work-order and licence free-text fields carry **citizen names and personal phone numbers**,
verbatim from the capture: `DEBORAH MOORE, PH#737-762-6252`, `CONTACT LISA BOE - CONTACT#:
504-401-1765`, `REBECCA GARNER-LOZOYA - CONTACT#: 916-620-8091`. Code-enforcement rows carry
officer names and complaint addresses.

The design answers this by not rendering the description in a scannable list at all. That is
a design decision and **not a control**. The field still needs a real gate before any surface
renders it, and none of it may reach a public parcel rail.

Code enforcement is the highest-PII surface on the lens, because a complaint names a neighbour.
The complainant is not a field on the record at all, which is the right answer and is upstream
of the design.

## Carved out, deliberately

Plan review (its own three folders). The Place tab's map (superseded by the map dock).
Applicant-facing views. The live-read mode of the three new tabs, which needs a granted MyGov
feed to draw honestly.

## Naming inconsistency, raised not settled

The product ships the tab as **Licenses** and writes **licence** and **Licence roll** in the body
copy of that same tab. The strip here matches what ships. Texas statute says *license*, so the
recommendation is American spelling throughout and a copy sweep in the product; that is a
product-line call, not something a design folder settles.
