---
id: 2026-08-30_p91_qa_walk_five_parcels
title: Smart Site MCP QA Walk, Bastrop Five Parcel Set, 2026-08-30
date: 2026-08-30
status: filed-verbatim
plan_row: P-91
source: operator paste of a Claude session capture (Opus, claude.ai), filed by the integration seat 2026-08-30 without edits to the body
original_id: session_2026_08_30_smart_site_mcp_qa_walk
serving_at_capture: smartsite-mcp p556 (00061-zik) / cortex-api p542 (00666-cuf), per the integration seat's traffic read the same night
triage: _inbox/2026-08-30_p91_qa_triage.md
---

Filing note (integration seat). The body below is the other agent's capture, unedited. One line in its Dependencies section is stale as of filing: the `duplicate_resolved_node` and node-id existence fixes are not parked in the stone tree; they merged (#550 `42d56c32`) and serve on cortex p542. The findings D1 through D8 are triaged and routed in the companion triage document. Body claims about panel behaviour are unmeasured by the author's own statement; the operator's screenshots from the same session are graded separately.

---

# Smart Site MCP QA Walk, Bastrop Five Parcel Set

## Purpose

Records an unscripted QA pass against the Smart Site MCP connector at
https://mcp.smartsite.cloud run on 2026-08-30. The session began as an ordinary
operator task, pulling parcel facts for five Bastrop listing addresses, and is
being filed as QA because the tool responses surfaced eight defect candidates
worth routing to engineering.

This is a chat-side walk. Claude reported tool JSON facts only. No painted
widget facts were reported by the operator, so all panel-side behavior in this
session is unmeasured rather than passed or failed.

## Scope

In scope: observed behavior of `find_parcel` and `get_smart_site` at depth
`stub` and depth `node`, across five Bastrop County parcels, plus one permitted
listing-history web step held to the transcript.

Out of scope, and deliberately not exercised this session:

- `create_screen`. The known `duplicate_resolved_node` defect was not retested.
- `save_property`, `add_to_screen`, `set_property_status`, `list_my_properties`,
  `list_screens`, `run_report`, `export_instrument`, `check_request`,
  `request_records`, `ask_the_map`.
- All panel and board rendering. Nothing was written to a screen or a parcel
  panel at any point.

Coverage was 2 of the 13 catalog tools.

## Session transcript summary

1. Operator supplied five Bastrop addresses from a screenshot of a third party
   assistant's output and asked for Smart Site facts.
2. `find_parcel` called five times, once per address. All five resolved.
3. `get_smart_site` called once with a five element array at depth `stub`.
4. `get_smart_site` called once at depth `node` for `48021:8720522`
   (111 Rainmaker Cv), operator directed, with explicit instructions not to call
   `save_property` and not to search the web.
5. Listing history web step for 111 Rainmaker Cv, operator directed, with
   explicit instructions to keep the answer in the transcript, not to call
   `ask_the_map`, not to start Smart Site research, and not to write into the
   board or parcel panel. All four constraints held.
6. `get_smart_site` called once at depth `node` for `48021:8705357`
   (129 Trailstone Dr), same constraints.

## Resolved fixture set

These five nodes are now a usable Bastrop fixture set for future walks. All
resolved cleanly from a plain street address query.

| Query | Parcel node id | CAD situs |
|---|---|---|
| 111 Rainmaker Cv, Bastrop, TX | 48021:8720522 | 111 RAINMAKER CV, BASTROP, TX 78602 |
| 228 Baron Creek Trl, Bastrop, TX | 48021:8718296 | 228 BARON CREEK TRL, BASTROP, TX 78602 |
| 309 Rimrock Ct, Bastrop, TX | 48021:8704645 | 309 RIMROCK CT, BASTROP, TX 78602 |
| 129 Trailstone Dr, Bastrop, TX | 48021:8705357 | 129 TRAILSTONE DR, BASTROP, TX 78602 |
| 237 Driftwood Ln, Bastrop, TX | 48021:8715051 | 237 DRIFTWOOD LN, BASTROP, TX 78602 |

Caution for anyone building an intake list off this set. 111 Rainmaker Cv is the
same node as the "111 Rainmaker Cove" long form, which is one half of the known
`duplicate_resolved_node` collision pair. Listing sources render the Cove form,
so any listing-derived paste will reintroduce that collision.

## Findings

### D1. `find_parcel` returns an undocumented null-id hit shape

Severity: medium. Confidence: high, observed on 5 of 5 queries.

Every query returned exactly two hits. The first carries `parcelNodeId` and
`source: "parcel-situs"`. The second carries `parcelNodeId: null`,
`source: "address-point"`, and latitude and longitude.

The tool description states that hits come back "each with situs and county" and
does not mention a null-id row or a coordinate-bearing row. An agent that takes
`hits[0]` is fine. An agent that iterates, or that picks the hit with the
closest situs string match, can hand a null into `get_smart_site` or
`add_to_screen`.

Recommendation: either document the address-point row in the tool description
and state that it is never resolvable, or suppress it when a parcel-situs hit
exists for the same query.

### D2. Stub and node depths disagree on land use disposition

Severity: high. Confidence: high, observed on both node reads against the same
bake.

At depth `stub`, `landUse` came back `unknown` for all five parcels. At depth
`node`, for two of those same parcels, the `land-use` section came back with
`data: null` and `disposition: "absent"`.

These are different claims. The tool description enumerates the rail vocabulary
as present / absent-verified / unknown / refused / unread. The node read returns
`absent`, which is a fourth string not in that enumeration and distinct from
`absent-verified`.

So there are three vocabularies in play for one field: the documented rail
enum, the stub response, and the node response. Same parcel, same snapshot,
different answer by depth.

Recommendation: pick one vocabulary, make stub a strict projection of node, and
add a test that asserts stub and node agree per field for a given bake.

### D3. `drainage` rail has no corresponding section at node depth

Severity: medium. Confidence: high.

The stub read returns a `drainage` rail, `unread` on all five parcels. The node
read returns a brief with exactly four sections: zoning, setbacks-envelope,
flood, land-use. There is no drainage section at any depth.

A rail advertised at stub depth that cannot be opened at node depth will read as
a dead end to anyone drilling in.

Recommendation: either emit a drainage section at node depth carrying the same
`unread` disposition, or drop the rail from stub until the facet exists.

### D4. Bake timestamps do not track call time and are not monotonic

Severity: high, because it affects QA correlation. Confidence: high.

Session date was 2026-08-30. Both node reads returned `bakedAt`, `asOf`, and
`stampedAt` values dated 2026-08-29.

More importantly, the Trailstone read was issued later in wall clock order than
the Rainmaker read, but carries the earlier stamp:

- `48021:8720522`, issued first, stamped `2026-08-29T20:07:42.056Z`
- `48021:8705357`, issued second, stamped `2026-08-29T20:06:37.384Z`

The second call is stamped 65 seconds before the first.

`runId` is base64 of the node id and that same timestamp. For example
`pe-r1-NDgwMjE6ODcyMDUyMg.MjAyNi0wOC0yOVQyMDowNzo0Mi4wNTZa` decodes to
`48021:8720522` and `2026-08-29T20:07:42.056Z`.

Consequence: `runId` identifies a bake, not an invocation. Two calls against one
node return the same `runId`. Any QA harness that keys on `runId` for dedup,
ordering, or grading will silently collapse distinct invocations and will
misorder a run.

Recommendation: add a distinct per-invocation id alongside `runId`, and make it
explicit in the tool contract that `bakedAt` is snapshot time rather than call
time.

### D5. Flood facet ships a human-readable summary with no citation

Severity: high. Confidence: high, observed on all parcels touched.

All five stubs report flood `present`. Both node reads return an identical flood
payload: Zone X, subtype `0.2 PCT ANNUAL CHANCE FLOOD HAZARD`,
`inSpecialFloodHazardArea: false`, `baseFloodElevation: null`, adapter
`fema-nfhl-bulk-v1`, vintage `NFHL_48_20260101`.

Two problems.

First, `citations` is an empty array and `citationsDegraded` is `true`, yet the
section still emits a `zoneExposureSummary` written in confident prose asserting
that the parcel carries flood exposure. A degraded section should not be
producing the most quotable sentence in the whole response.

Second, `evaluatedAt` is `2026-08-11T23:13:43.774Z`, identical to the
millisecond on both parcels. That confirms the facet is a single bulk NFHL load
stamped once, not a per parcel evaluation. That is defensible, but the response
does not distinguish "this parcel was evaluated" from "this parcel fell inside a
bulk-loaded polygon," and the rest of the payload reads as the former.

House style defect in the same field: the `zoneExposureSummary` string contains
an em dash. If that string reaches any rendered surface it violates the no em
dash convention.

Recommendation: suppress or visibly downgrade `zoneExposureSummary` while
`citationsDegraded` is true, restore the FEMA citation, and strip the em dash
from the source string.

### D6. Overlay states are asserted more strongly than their provenance supports

Severity: medium. Confidence: high.

The `pipeline` overlay reports label "No pipeline within 152.4 m" with state
`absent-verified`, while carrying `provenance: "degraded"` and
`vintage: "UNKNOWN"`.

An `absent-verified` claim backed by degraded provenance and an unknown vintage
is not verified. This is the exact failure class the source-required discipline
exists to catch, expressed in data rather than in prose.

The `specialDistrict` overlay reports `absent-verified` with no provenance or
vintage field at all.

The `well` overlay is handled correctly: label says records were not checked,
state is `unknown`.

Secondary: the pipeline label ships `152.4 m`, which is 500 feet unconverted.
The draw frame declares `units: "ft"` and converts everything else to US survey
feet. A user-facing label in raw metres inside a foot-declared frame is an
inconsistency, and 152.4 reads as false precision.

Recommendation: gate `absent-verified` behind known provenance and a known
vintage, drop `pipeline` to `unknown` until then, and render the radius as 500
ft.

### D7. Zero geometry on both ordinary parcels

Severity: needs a product decision before it is graded. Confidence: high.

Both node reads returned a fully formed `draw` frame with no coordinates in it.
`boundary` has `geom: "none"` and state `unknown`. `footprint` has
`geom: "none"` and state `unknown`. `envelope` is refused. The frame block is
complete and correct, declaring feet, centroid origin, true north, converted
from local ENU metres, US survey foot factor, GIS-approximate quality, and then
has nothing to place inside it.

This matters for grading. The gold fixture `48021:34137` (908 Pine) draws a
closed ring with four named edges, and prior walk criteria treat a missing ring
as a fail signal. Two of two ordinary Bastrop parcels return no ring at all.

Inference, not fact: the gold parcel may be the exception rather than the
baseline, and geometry coverage may be limited to hand-prepared fixtures. This
was not verified this session.

Recommendation: establish geometry coverage across the county before any further
walk grades on ring presence. If ordinary parcels legitimately have no ring, the
grading criteria need a separate expected-no-ring case, and the panel needs a
sentence for it that is not one of the two existing Open failure strings.

### D8. Attribute coverage is thin enough to be worth stating plainly

Severity: informational. Confidence: high.

The `attrs` block carries two fields, zoning and yearBuilt. Draw confidence is
`seed` on both parcels. Across the entire node payload, the only value that
differs between two parcels roughly half a mile apart is yearBuilt, 2021 for
Rainmaker and 2023 for Trailstone.

Everything else, zoning district, jurisdiction, flood zone, flood subtype,
envelope refusal, land use disposition, and all seven overlays, is identical.

This is not a bug. It is a statement of where the product currently sits, and it
should inform how the parcel panel is marketed until more facets land.

## Confirmed working

- `find_parcel` resolved 5 of 5 plain street address queries with no
  disambiguation needed.
- `get_smart_site` accepted a five element array at depth `stub` and returned
  five parcels with an empty `notFound`.
- The envelope refusal is correct and well guarded in JSON. Both node reads
  returned `disposition: "refused"`, `code: "declined-in-bake"`,
  `declineReason: "atom_path_pending"`, plus an explicit `agentGuidance` string
  instructing the caller not to invent setback distances or a buildable polygon.
  That guidance was honored in this session.
- Zoning is the one fully clean section. District PDD, jurisdiction
  `bastrop_city_tx`, code field `ZoneTypeClass`, layer `Zoned_Parcels`, live
  source URL, and the citation propagates correctly to both the section
  `citations` array and the top level `citations` array.
- Tool level scope discipline held. `get_smart_site` carried no listing, sales,
  owner, or price data at any depth, as documented.

Minor nit inside the otherwise clean zoning section: `jurisdictionKey` is
`bastrop_city_tx` with underscores and `cityKey` is `bastrop-city-tx` with
hyphens, for the same jurisdiction, in the same object. Worth normalizing before
anything joins on either key.

## Unmeasured

Listed explicitly so nothing here is read as a pass.

- Every painted widget fact. The operator did not report panel strings this
  session. That includes whether the envelope printed "Withheld, setbacks
  unruled", whether the machine string `atom_path_pending` reached the screen,
  whether any ring, edge, or label was drawn for either node, and whether either
  Open failure string appeared.
- Board behavior. No screen was created or opened.
- The `duplicate_resolved_node` defect. Not retested.
- Iframe build freshness. No resource URI was checked this session.

## Listing history step, transcript only

Run under the walk rule that permits a listing-history web lookup when the answer
stays in the transcript. Recorded here for completeness because it produced a
data-quality observation relevant to the planned `find_listing_history` host
turn. It is not Smart Site data and must not enter the board or panel.

Price history for 111 Rainmaker Cv, per Redfin, sourced to Unlock MLS and public
records at
https://www.redfin.com/TX/Bastrop/111-Rainmaker-Cv-78602/home/176279115 :

- 2026-01-09 listed at $390,000, MLS 8505559
- 2026-01-19 reduced to $380,000
- 2026-02-06 reduced to $365,000
- 2026-03-28 contingent
- 2026-04-07 pending
- 2026-04-08 sold, price not published
- 2026-08-26 relisted at $350,000, MLS 6985679, Epique Realty

Texas is a non-disclosure state, so the April 2026 sale price is not public.

Two data traps observed on the open web, both directly relevant to any future
listing-history ingestion path:

1. Estately list pages paired this address with $275,000 at 1,635 sqft on one
   page and $169,000 at 1,560 sqft on another. Both are row-offset rendering
   artifacts from adjacent listings, not prices for this property. A scraper
   that reads list pages rather than detail pages will ingest these as facts.
2. A separate 111 Rainmaker Ln exists in Bastrop 78602, 2,000 sqft, 4 bed 2
   bath, built 2022. Distinct property, distinct parcel. Cv and Ln must not
   merge.

Nothing from this step was written to Smart Site.

## Provenance

Per the source-required discipline, every claim above is one of the following.

- Tool JSON observed in this session, on 2026-08-30, against
  https://mcp.smartsite.cloud. Cited by node id and where useful by runId.
- Cited web result with URL, confined to the listing-history section.
- Explicitly labeled inference. There is one, in D7, on whether the gold parcel
  is the exception rather than the baseline.
- Operator direct instruction, for the constraints recorded in the transcript
  summary.

No claim in this document rests on recall or on another agent's paraphrase. The
prior-walk context referenced in D7, specifically the 908 Pine gold parcel
drawing a closed ring with four named edges, comes from session memory rather
than from a canonical doc read, and should be verified against the walk record
before it anchors a grading change.

## Open questions

1. Is geometry coverage limited to hand-prepared fixtures, or is the Bastrop
   parcel geometry load incomplete? Routing: Nick. Blocks any further walk that
   grades on ring presence.
2. Which land use vocabulary is canonical, and should stub become a strict
   projection of node? Routing: Nick. See D2.
3. Should `absent-verified` require known provenance and a known vintage?
   Routing: Nick or catalog agent, since this touches atom contract semantics
   rather than one facet. See D6.
4. Does the QA harness key on `runId`? If so it needs a per-invocation id first.
   Routing: Nick. See D4.
5. Should the flood section suppress `zoneExposureSummary` while
   `citationsDegraded` is true, or ship it with a visible degradation marker?
   Routing: operator decision, product-facing. See D5.
6. Band and slot assignment. This is filed as a dated session archive. If it
   should instead be promoted to a numbered canonical doc, the band and next
   available number need assigning by the doc_repo agent. The `related` field is
   deliberately empty rather than populated with invented doc ids, and needs
   backfilling against the real doc set.

## Dependencies

- The `duplicate_resolved_node` fix and the node-id existence fix are still
  parked in the isolated stone tree and both need a current cortex checkout
  before they can ship. Nothing in this session changes that.
- D7 blocks the next scripted grading walk, since the current pass criteria
  assume a ring that ordinary parcels do not produce.

## Cross references

None populated. See open question 6.

## Revision history

- 2026-08-30, Claude, session capture. Initial draft from an unscripted QA pass
  covering `find_parcel` and `get_smart_site` against five Bastrop parcels.
  Eight defect candidates recorded, five items marked unmeasured.
