---
id: 2026-09-01_p106_constraint_search_WDLL
title: WDLL — P-106: constraint search, and the three-set result that makes it honest
date: 2026-09-01
last_updated: 2026-09-01
status: open
applies_to: legacy-design-tools (api-server projection + smartsite-mcp tool), serve path only
plan_row: P-106
depends_on: _decisions/2026-09-01_parcel_record_rails_v2_template.md, _smartsite_gtm/07_rails_by_persona_pricing_input.md, _decisions/2026-08-31_smartsite_ladder_recut_studio_works_a_list.md
operator_go: 2026-09-01
snapshot: planner measured the deployment store 2026-09-01 (reltuples estimates, writers active)
owner: property seat (lane planner); planner verifies and commits doc_repo
---

# P-106 constraint search

Date: 2026-09-01  Status: open

## The capability, in one sentence

Today you can look up **a parcel**. You cannot ask a question **across parcels**. This card adds the second thing, using data that is already baked.

`find_parcel` takes an address, a bare street, or a radius. That is lookup. The land buyer's actual job is "Bastrop County, two acres or more, outside the floodplain, not ag-exempt." That is a constraint search, and it is the one query shape nobody else in this market can serve, because MLS search filters attributes of a *listing* and this filters what you can *do with the land*.

It is also what makes Studio real. Screens are the list. This is how you build the list. Studio currently gives a customer somewhere to put parcels and no way to find them.

## This is a projection, not a pipeline

Measured 2026-09-01 against the deployment store, reltuples estimates because full counts time out under the active fill writers:

    txgio_parcel                16,428,786   geometry, zoning_district, zoning_jurisdiction
    cad_property                 7,599,146   acreage, values, land use, year built, situs
    place_layer_snapshots        6,917,372   baked facets in payload_json
    landing_parcel_jurisdiction    981,405   incorporated / unincorporated
    tx_fema_nfhl_flood_zone        198,704   flood polygons

The data exists. **The shape is lookup-only.** `place_layer_snapshots` carries indexes on `(adapter_key, place_key)` and `(adapter_key, lat_rounded, lng_rounded)` and nothing on `payload_json`, so filtering by attribute today is a full scan of 6.9M JSONB rows per query.

So the work is to project what is already baked into a filterable shape. Do not build a new acquisition path, do not re-derive a facet, and do not write a second store for a subject that already has one.

**Bound to the six Central Texas counties for v1.** `landing_parcel_jurisdiction` covers 981K of 7.6M parcels, so incorporation is known for roughly 13 percent statewide. Bastrop is fully dispositioned. A statewide claim is not available and must not be implied.

## The design idea this card exists to get right

A user asks for parcels outside the floodplain. Some are outside it. Some are inside. **And some have never been measured.**

Including the unmeasured ones fabricates a claim. Excluding them silently hides parcels that might qualify while the user believes they saw everything. Both are the defect this operation is named against.

**So a result is three sets, never one:**

    412 match
    89 excluded (inside the floodplain)
    1,203 not evaluated (flood unmeasured on those parcels)

That is the honest shape, it falls directly out of absent / zero / unmeasured being three different states, and no listing search anywhere does it. For a serious professional it is the difference between a list and an instrument, because it says exactly where their own diligence is still owed.

A result that collapses those three into one number fails this card outright.

## Done looks like

A land buyer, an agent or an architect can express a real constraint over a Central Texas county, get parcels back, know how many were excluded and how many could not be evaluated and on which rail, and push the result straight onto a screen.

## Acceptance items

1. **Measure before projecting.** For every rail proposed as searchable, report per county what fraction of parcels carry a real value, distinguishing present, absent-verified, and unmeasured. Sentinels count as unmeasured, not as present: a `situs_address` of `", ,"` is a known live example and a naive non-null test overstates Bastrop situs coverage by roughly 21 points. The searchable set is chosen from this table, not from this card's guess. | check: a dated artifact carrying the per-rail per-county table plus the query | grade: [ ]

2. **The projection table.** One row per parcel per county in scope, columns for the searchable rails, each carrying its value and its disposition. Built from the baked facets, not re-derived from source. It is a cache and must declare its `builtAt`; a stale projection served as current is the defect. | check: row counts reconcile against the bake, and a parcel's projected value matches `get_smart_site` for that parcel | grade: [ ]

3. **`find_parcels`, plural, and distinct from `find_parcel`.** Takes a county or other geographic bound, a filter set, and a cap. The two tools must not be confusable in the tool list; a caller reaching for one and getting the other is a contract defect. | check: both descriptions read side by side without ambiguity, and a test pins that a single-address query is refused here and routed to `find_parcel` | grade: [ ]

4. **The three-set result, with the excluding rail named.** Matched, excluded, and not-evaluated, each with a count, and not-evaluated broken down by which rail could not be evaluated. | check: fail-then-pass on a filter over a rail with known gaps; a response merging any two of the three fails | grade: [ ]

5. **Refusals, declared not errored.** No geographic bound is refused. Over-cap returns the truncation explicitly, the way `near` and `street` already report `truncated`. And a filter on a rail that is unmeasured beyond a stated threshold for that county is refused with that number, because a search evaluating a small fraction of parcels must not present itself as a search. **The threshold is an operator ruling; propose a number with the evidence from item 1 and do not pick one silently.** | check: fail-then-pass per refusal, each carrying a reason token and display text in the existing vocabulary | grade: [ ]

6. **It feeds a screen.** The result can be pushed to `create_screen` without the caller re-fetching or re-typing ids. That closes the Studio loop: search builds the list, the screen holds it, `get_smart_site` opens a row. | check: an end-to-end test from filter to screen | grade: [ ]

7. **Verify by violation, both directions.** Every check above shown failing on a deliberate violation and passing on restore, with verbatim failure text. | check: the close carries both directions per item | grade: [ ]

## Rails in scope for v1

Only rails already baked and cheap to project: acreage, land use, county, city limits, ETJ, zoning district, flood zone and the SFHA flag, special district, market and land and improvement value, year built.

**Deliberately out of v1:** setbacks and buildable envelope, OSSF, utility service, ag valuation and rollback, minerals. Those are declared-absent or refused on most parcels today, so a filter over them would return almost entirely not-evaluated. Honest, and useless. They join as they land, and item 1's table is what says when.

## Explicitly not this card

Do not add an acquisition path or re-derive any facet. Do not write a second store for a subject that already has one. Do not extend `find_parcel`; this is its own tool. Do not serve owner data through it, which is paid-tier and identified-session only. Do not imply statewide coverage. Do not build ranking, scoring, or a recommendation; this returns parcels that satisfy stated constraints and nothing about which is better. Do not touch the tier gates; whatever rung screens sit at, this inherits.

## Leave behind

Declared at close per the contract, `none` being a valid answer.
