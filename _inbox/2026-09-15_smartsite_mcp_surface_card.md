---
id: 2026-09-15_smartsite_mcp_surface_card
title: Smart Site MCP connector — the durable card
date: 2026-09-15
last_updated: 2026-09-15
status: durable card — measured state of the connector and the reporting surface behind it
kind: WDLL
owner: nick
programs: [OPS-24]
plan_rows: [P-219, P-220, P-221, P-222, P-214, P-216, P-217, P-218]
related:
  - 90_operations/OPS-16_texas_market_plan_of_record.md
  - _inbox/2026-09-14_county_to_serving_WDLL.md
---

# Smart Site MCP — the durable card

> One picture of what the connector does, what it gets wrong, and what has never been
> measured. Written so nobody re-walks it to find out. Every number here is from tool output
> or from a live read named inline; nothing is inferred from the web app.

**Surface** `https://mcp.smartsite.cloud`, exercised from Claude chat 2026-09-15.
**Test parcel** `48021:34049`, 1109 PECAN ST, BASTROP, TX 78602. A CORNER LOT, which is why
it found what it found.
**Bake under test** `runId pe-r1-NDgwMjE6MzQwNDk...`, `bakedAt 2026-09-10T18:45:23Z`.

## The one sentence

**On the only parcel walked end to end, the two headline numbers a buyer reads — the setbacks
and the buildable area — are both wrong, and one report instructs the buyer to go verify
something we had already verified as clear.**

## Coverage: eight of sixteen tools were exercised

Nine tools were never called. **They are UNMEASURED, not working.** Anyone reporting on this
surface says so rather than implying a clean bill.

```
WORKS              find_parcel (query) · get_smart_site (depth node, with defects)
                   run_report (redundant: same R1 payload and runId as get_smart_site
                   depth node, minus the anchor block)
                   export_instrument: feasibility (13 pages, flood embedded)
                                      siteplan (3 sheets, with defects)
                                      terrain (GLB, 102,968 bytes, 2,912 vertices)
BROKEN             export_instrument kind=dossier -> pipeline_output_absent, upstream 422
REFUSES BY DESIGN  export_instrument kind=brief -> kind_not_available, documented
NOT WIRED          ask_the_map -> not_ready (P-91 item 34)
NOT LIVE           request_records (until Records Request ships; not called, to avoid
                   starting a job)
UNMEASURED (9)     find_parcels · create_screen · list_screens · add_to_screen
                   save_property · set_property_status · list_purchased_records
                   read_purchased_record · check_request
```

So: three of four export kinds produce a file, one is dead, parcel Q&A is unwired, and the
CRM/screen/search/purchased-records half of the product was not stressed at all.

## The defects, and where each one lives now

| ID | What | Row |
|---|---|---|
| D1 | Engine draws every setback line from Ordinance 2019-51, repealed 2026-04-14 | **P-219** |
| D2 | Buildable area printed where policy denies it, and wrong from D1's setbacks | **P-219** (PDF half); P-216 fixed the facets half |
| D3 | Standalone siteplan asserts "No addressed record on file" for an addressed parcel | **P-222** |
| D4 | Owner data crosses the MCP wire on a tool whose contract says it never does | **P-220** |
| D5 | One UNAVAILABLE chip doing three epistemic jobs | **P-222** |
| D6 | assessedValue and livingAreaSqft: facet absent, report prints values | **P-217** (coherence) |
| D7 | Utilities: facet has CCNs, report says no acquisition path | **P-222** |
| D8 | Old Town overlay never reaches any report | **P-222** |
| D9 | Drainage: brief says unread, report carries a full study | **P-222** |
| D10 | X-ray dossier cannot be generated | **P-221** |
| D11 | Lot area two values, edge-4 setback, pipeline label, citations, envelope shapes, calibratedConfidence, 1.55 MB inline base64 | **P-222** |

## The two claims this seat re-verified before carding any of it

**D1 HOLDS.** Live read of `/api/spine/property-atoms/48021%3A34049/facets` returns
`front_ft 30, side_ft 10, rear_ft 30, side_interior_ft 5, side_corner_ft 20` — current
Ordinance 2026-06 values, and the facet DOES carry a corner-side concept. The engine prints
25/5/25 with no corner value, sourced `bastrop-per-parcel/34049/front`, cited to 2019-51.
**The facet is right and the engine is wrong.**

**D4 HOLDS and is narrower than reported.** Owner does NOT cross the PE facets wire —
`ownerName`, `ownerMailingAddress`, `exemptionFlags` all absent, read live. But this seat's own
MCP read of `48021:8723767` on 2026-09-14 returned `ownerName "CALLIHAM, SAM & MARILYN"` with
the mailing address. **The strip is not missing. It runs on one serve path and not the other.**

## The loop D1 closed

`P-214`'s customer-visible string — `edge 1: R32 35.02831192164916ft != expected 5ft for role
side` — **that "expected 5ft" IS the repealed 2019-51 side setback.**

So F24 (the city's layers disagreeing), P-154 (the conflict row), P-214 (the raw string) and
D2 (the wrong cover figure) are **one root, not four bugs**. P-219 is that root. Fix it and say
which of the four it retires.

## Honest refusals — NOT defects, do not "fix" these

These limit what the product can answer for Bastrop today and they are reported correctly.

```
ETJ                   cityLimitsFact etjStatus "unresolved" — no ETJ source wired
agValuation           refused, not-cut-over — Williamson and Travis only
maxImperviousCoverPct refused, not-cut-over — Travis/Austin only
maxLotCoveragePct     absent-verified, ENVELOPE_ROUTER_FIELD_NOT_SPECIFIED for this
                      district; cascades to maxFootprintSqFt (area x coverage)
Gas retail territory  ruled PERMANENTLY UNACQUIRABLE in Texas, 2026-09-03
Downstream discharge  unavailable because the model traced zero flow exits — explained
buildingFootprint     ml-derived, verificationStatus unsurveyed, labelled
                      "Structure of record (1906), footprint unmeasured"
```

## What is good and must not be touched

**The refusal vocabulary.** `present / absent / absent-verified / unknown / unread / refused`,
with `out_of_coverage` kept distinct from a no-hit, is the best thing in this product. Shipping
the vocabulary resource on every call is right.

**The feasibility study meets its four asks:** the real flood study is triggered and embedded
as sheets 6 and 7 with its own FD stamp, the site plan aerial carries, there is a cover page,
and the narrative is a real narrative (`narrativeIsDeterministicSkeleton false`) rather than
facts on a page.

**Per-value provenance and vintage on nearly every field.**

**Sheet 13, "How to read this report."** The semantics it promises are correct. Three of the
defects above are the report failing to honour its own sheet 13.

**The dossier refusal, in form.** Declining to emit a hollow report is correct behaviour. The
bug is that it has to.

## Fix order, adopted unchanged from the QA walk

1. **P-219** — setback provenance. Everything drawn is wrong until this lands, and it is the
   root of four symptoms.
2. **P-219's D2 half** — decide the buildable-area policy once, across all three surfaces.
3. **P-221** — the dossier. One of four report products does not exist.
4. **P-220** — owner. Reconcile serve behaviour with the contract before anyone audits it.
5. **P-222's D3** — siteplan identity. Cheap, and visible on every standalone site plan sold.
6. **P-222's remainder** — chip semantics and the false open item, then D6 to D9.

## Method note worth keeping

The QA walk listed untested tools as untested rather than passing, separated honest refusals
from defects, and named what was good and said not to touch it. **That is the standard for this
kind of walk.** A surface report that does not say what it failed to measure is a coverage
claim wearing a status report's clothes.
