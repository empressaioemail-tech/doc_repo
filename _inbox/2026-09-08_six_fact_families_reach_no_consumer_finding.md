---
id: 2026-09-08_six_fact_families_reach_no_consumer_finding
title: Six fact families reach no consumer on the feasibility route, and report depth varies by county
date: 2026-09-08
last_updated: 2026-09-08
status: open
applies_to: hauska-engine
plan_rows: [P-120, P-126]
seat: integration (doc-repo-79)
severity: customer-facing
snapshot:
  engine_api_serving: hauska-engine-api-00193-xex
  digest: sha256:25446d8e5dea1ced8fe2443a6801147276c195b629c0c7ca1bb2c659fa17e91e
  measured_at: 2026-09-08T23:15Z
related:
  - _inbox/2026-09-08_narrative_degradation_is_declared_but_uncounted_finding.md
---

# Two findings from one instrument, and only one of them needed a third county

The r05 lane's new `absentFields` instrument classifies, per parcel, every fact family the
feasibility report could not fill and why. It is the first thing in this program that makes the
A-120 class MEASURABLE rather than inferable, and it immediately produced two results of
different strength.

## Finding 1: six families reach no consumer, route-wide

Invariant across Bastrop, Caldwell, Williamson and Hays — four counties, measured on the serving
revision by two seats independently:

    utilities           failed-this-run
    dischargePoint      out-of-scope
    floodplainAcreage   failed-this-run
    firmPanel           failed-this-run
    soil                out-of-scope
    electricProvider    out-of-scope

    (gasProvider is also invariant at blocked-at-source, but was RULED unacquirable on
     2026-09-03, so it is an honest declared absence and not part of this finding.)

`floodplainAcreage`, `firmPanel` and `soil` are three of the five fact families merged as engine
PR #404 on 2026-09-07 — built, tested, and reaching nobody. `out-of-scope` means the resolver is
not reaching the route at all despite being described as armed; `failed-this-run` means it is
reached and failing.

**Those are different defects with different fixes and must not be counted as one number.**
`out-of-scope` is the A-120 shape exactly: merged, correct, unreached. `failed-this-run` is a
live failure — NFHL reads are failing right now, which is a working mechanism with a broken
input.

This is the second confirmed A-120 instance today. The first was
`parcel-building-footprint-reconcile`, merged as factory PR #99 with no CLI command, no build
config and no Cloud Run job, whose own header named a Cloud Run job that had never existed.

## Finding 2: the report is not the same product in every county

Same revision, two parcels, run back to back:

    section              Caldwell 48055      Williamson 48491
    flood                PRESENT             blocked-at-source
    footprint            PRESENT             blocked-at-source
    wellsPipelines       PRESENT             blocked-at-source
    specialDistricts     clear               blocked-at-source
    terrain              PRESENT             failed-this-run
    drainage             PRESENT             unclassified

    Caldwell     8 absences   10 cited sections   12 pages
    Williamson  13 absences    9 cited sections    8 pages
    Hays        13 absences    6 cited sections    8 pages

A Williamson report is a third shorter than a Caldwell one and resolves five fewer families.
**This is not a regression from the 2026-09-08 deploy** — it is what the data reaches — but it
would read as one to anyone who had only seen a Bastrop report.

Bastrop is the operator's report parcel.

## How the second one was nearly missed, which is the transferable part

The lane first reported the absent families as "the same on Bastrop and Caldwell, so it is not
jurisdiction-varying — it is the route." Two counties agreeing is not evidence of invariance.

The lane's own correction, recorded because it is more useful than the finding:

> "I ran Williamson myself, on the main build, before shifting traffic. It came back 7 pages
> against Caldwell's 12 and Bastrop's 12 ... it was sitting in my own smoke output while I wrote
> 'it is not jurisdiction-varying'. I did not have too little data. I had the disproof in hand
> and did not compare it, because I was looking at the four families I already believed were
> route-level and not at the shape of the whole return."

**Not a sampling failure. A comparison failure.** The disproof was already collected. This is the
same correlated-sample error the seat had warned about three hours earlier, made against evidence
already in hand rather than for want of evidence — which is a harder failure to design against,
because more sampling would not have fixed it.

## The boundary, which both findings depend on and which is easy to blur

Those six families being invariant across four counties is **evidence about the route**, and it
got stronger with each county rather than weaker.

The absence profile AS A WHOLE is **not** invariant, and no number of counties would have made it
so.

Both statements come from the same instrument on the same runs. Only the second needed a third
county to see. Quoting one as though it licensed the other is exactly the error above.

## Counting, so the two numbers in circulation do not get conflated

For Caldwell the same return yields **8 total absences** and **6 actionable** — actionable being
the `failed-this-run` and `out-of-scope` subset. Both are correct against different denominators.
Anyone quoting either must say which, or the next reader will find a discrepancy that is not one.

## Open

The six families. `out-of-scope` (soil, electricProvider, dischargePoint) needs the resolver
wired to the route; `failed-this-run` (utilities, floodplainAcreage, firmPanel) needs the live
read fixed. Different work, and neither is the integration seat's repo.

Whether the county-varying depth is acceptable, or whether a report that resolves five fewer
families should say so on its face rather than only in `absentFields`.

`gasProvider` is correctly excluded here, but it is worth confirming nobody has counted it in an
A-120 tally elsewhere, since it looks identical from the instrument and is a ruled absence.
