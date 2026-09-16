---
id: smartcity_package
title: "SmartCity OS — the package: links, state, and what is next"
status: active
last_updated: 2026-09-16
applies_to: smartcity
owner: nick
programs: [OPS-17]
purpose: The one file to open when picking SmartCity back up. Carries the three live links, the measured state of design and build, what is owed by whom, and what to do next. Everything here is traceable to an instrument or a named source; nothing is remembered.
related:
  - _design/INDEX.md
  - 90_operations/OPS-17_govtech_stack_plan_of_record.md
  - _smartcity_masters/31_smartcity_dashboards.md
  - _inbox/2026-09-15_roadmap_reconciliation.md
  - _inbox/2026-09-15_design_addendum.md
---

# SmartCity OS — the package

Parked 2026-09-16. Open this first, then `_design/INDEX.md` for the designs themselves.

## The three links

**The live product**, v2 staff dashboards on the real Bastrop pack. Verified 2026-09-16, HTTP 200,
serving the v2 shell with the nine-lens nav.

    https://smartcity-dashboards-52ecsl5mvq-ue.a.run.app/?cityKey=bastrop_tx

**The design gallery**, fourteen boards across the five department lenses designed in the G-145
pass, both themes, live HTML rather than screenshots. Private until shared.

    https://claude.ai/artifact/WUWQsrBSWLMouTRy7C4BTP

**The SmartCity Design Canvas**, the editable canvas. Shared with anyone holding the link.

    https://claude.ai/artifact/FBWcVY3f1gRa3HswLoeQaY

The gallery is derived from the folders in this directory, which are the source. If a design
changes, the folder changes first and the gallery is republished from it, never the reverse.

## Where the design stands, measured

Run `node scripts/govtech/design-completion-gate.mjs` from the repo root. It refuses rather than
reports: it exits 1 while design is unfinished and 0 only when every shipped nav surface is either
designed or excluded by a dated ruling. As of 2026-09-16 it reads:

    nav surfaces:        15
    designed:            10
    excluded by ruling:   2
    uncovered:            3
    design folders:      16, with an instrument: 8
    verdict: UNFINISHED

**All nine lenses are designed.** The three uncovered surfaces are Citizen (G-142), Records search
(G-147) and People and access (G-143). Assets and Connections are excluded by standing ruling and
are not work.

Do not substitute a board count for this. **Sixteen folders and sixty-two boards** read as far more
coverage than ten of fifteen surfaces, which is exactly why the gate counts surfaces and not boards.
That gap is the whole reason the gate exists: counted by boards this looks close to finished, and
counted by surfaces a third of the product is still undrawn.

## The five lenses drawn in this pass, and why each is different

Each was drawn from the product's own source, and the design argument in each case came out of that
source rather than from a template.

**Public works** carries two regions of different units, so they switch rather than stack. Its
matrix has eight of twenty cells that **cannot occur** by the product's own rule, rendered hatched
beside four measured zeros, which is a fourth state next to absent, zero and unmeasured.

**Fire and EMS** became small multiples per station, because its domain module says a rollup cannot
tell you which station is carrying the shortfall.

**Parks** is drawn as a surface that **does not exist**. It has no vendor and no registered domain,
and absence from `DOMAIN_REGISTRY` is the only surviving meaning of "not built". No tiles, no empty
table, none of the built-surface vocabulary.

**Police** is the only lens whose two regions disagree about their source, and it disagrees in
opposite directions on the two shipped packs: on the demo, Verkada is granted and Spireon withheld;
on Bastrop, Spireon is granted live and Verkada is not granted at all. The demo's emptiest region is
the city's most connected one.

**Fleet** is the first lens whose vendor actually answers, so its second board asks what the page
still says once it has filled. Two of the three things that change at the cutover are defects.

## Integration reality, and this is the part most likely to be misremembered

Live-verified 2026-09-03, recorded in `smartcity-dashboards` `src/vendor-live.mjs` header. Re-read
it before quoting; these are readings with a date, not current state.

| Vendor | Lens | State |
|---|---|---|
| Samsara | Fleet | returns real data |
| Spireon | Police | returns real data, and is deliberately withheld from the demo pack |
| Power BI | Public works | returns real data |
| FirstDue | Fire and EMS | 403, the credential lacks the apparatus and assets scope |
| GoTo | Public works | `goto_not_authorized`, nobody completed the OAuth consent |
| Verkada | Police | not wired at all, and no credential in any of three GCP projects (G-139) |
| none | Parks | no vendor exists for it |

The obstacle is a different kind of thing in each case: an entitlement, a consent, an onboarding, a
source that does not exist. **Only some of them are ours to fix**, and each board says which.

## Open defects with rows

**G-140, zoning.** The map serves Bastrop zoning from a city ArcGIS layer **last edited
2023-04-28** while the city publishes three newer ones, including a 2026 draft that replaces the
code edition ours is drawn from. Nothing errors, because the query succeeds and every requested
field is present. Instrument: `node scripts/govtech/bastrop-zoning-layer-vintage.mjs`, exits 1
today. Evidence: `_inbox/2026-09-15_bastrop_zoning_layer_findings.md`. **Blocked on one question of
fact to Bastrop GIS: which layer is authoritative, and has the 2025 draft been adopted.** We do not
pick; rendering a layer named `Draft_11_2025` to staff as their zoning is the same defect in the
other direction.

**G-139, cameras.** Not a bug to debug. The code is built and fails closed correctly; there is no
Verkada credential anywhere. Vendor onboarding.

**G-148, instruments. HELD by operator.** Five designs are past DRAFT with no adversarial read, and
two of them are already dispatched to build (G-120 Overview, G-128 map dock). Also folded in: a
fixture badge changed to falsely claim `Live records` passes in `smartcity-dev-services` and
`smartcity-fleet-lens`, while deleting the badge fails. Public works, Fire and EMS and Police catch
it. dev-services is the oldest check and the pattern the others copy.

## Findings against `smartcity-dashboards` with no row, owed to the owning seat

This repo cannot fix these. They need the seat that owns the product repo.

`assertRecordShape` is called by `composeDomain` and by **nothing** in `vendor-live.mjs`. Run by
hand against the live Samsara record it refuses with three faults, and that record carries **12
undeclared fields including `vin`, `make`, `model`, `odometerMiles`** — an inventory field set
arriving on exactly the cutover that drops the one sentence saying this is not an inventory.

Every exported live mapper invents three sentinel strings on an empty row, and Samsara and Spireon
share the literal `"Unnamed unit"`, so id collisions cross lenses.

`operatorRef` is `required:true` on the Spireon shape and occurs zero times in `vendor-live.mjs`, so
a required field is silently absent on every live record.

## Owed by the operator

| Item | Blocks |
|---|---|
| **Operator-namespace ruling.** Fleet and Police declare byte-identical `OPERATOR_REF_FORMAT` and `OPERATOR_BASIS` in two modules with no import between them, and nothing says whether `OPR-01` is the same person. Recommendation in A-139: namespace by domain | any build on either lens |
| **Ratify, amend or kill — eight drafts.** Finance lens, Smart Files, Development services, and the five department lenses | the Bastrop approval package, which gates build |
| Naming the vendor on a lens panel; the Public works region switcher | build, not review |
| The fund number for the Finance filings AMEND, from the city finance director | G-138 |
| The Bastrop GIS question above | G-140 |
| WorkOS org, client id, API key, MFA, `bastrop_tx` key | G-132, G-134, soft launch |
| The Azavar reply: four questions, four credentials | G-137, the hotel occupancy tax integration |
| The email to Sylvia, and the HOT pricing proposal | the commercial track |

## What to do next when this comes off the shelf

In order, and the first three need nothing from anybody:

1. **G-148**, unheld. All five designs already exist; this is instrumenting what is there, and two of them have builds running against them right now.
2. **G-142 Citizen**, the only `public-free` surface and the only one a resident ever sees. It already ships with real markup and a correctly declared disabled lookup, which the design must not regress.
3. **G-143 People and access**, the same surface as the WorkOS build, so design and build land together. Four things: provisioning, role assignment, offboarding, and the audit trail that answers who looked at that citizen's record.
4. **G-147**, the long tail: Records search, Compass, the applicant-facing plan review view.
5. **G-137 hotel occupancy tax**, the customer's own priority and separately billable, as soon as Azavar answers.

## How the work was done, so the next pass matches it

Designs are drawn by planner-owned subagents against the product at a named ref. **Subagents do not
touch git**; the planner reads every diff and commits. Every folder carries a `check.mjs` that
self-tests in both directions, aborts rather than reporting a verdict it cannot support, reports a
non-zero matched-input count, and is verified by violation against a real artboard. Every board is
rendered and looked at before anything is claimed about it.

The planner verifies rather than accepts: checks re-run, boards re-rendered, arithmetic done by
hand, and its own violations planted rather than the lane's re-run. That last part has earned its
keep — it found a hole three lanes missed, and it repeatedly proved the planner's aim wrong rather
than the check.
