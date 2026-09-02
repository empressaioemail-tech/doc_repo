CANON-PREAMBLE v6f9d139b
- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HOLD LIFTED 2026-08-26 for the Factory program (`_decisions/2026-08-26_factory_program_and_hold_lifts.md`); the Bastrop QA condition is cosmetic and does not gate the data path. NO PRIVILEGED DATA and the Hauska spine rule stand.
- THE FACTORY (OPS-19, `F-` rows) — one machine built to the MODEL LAW (`19_the_instrument_contract.md`, `_blueprint/10_model.md`, `_blueprint/20_pipeline.md`, `_blueprint/40_rule_register.md`, `51_ingestion_pipeline_reference.md`, `24_instrument_conformance_program.md`; package `dist/*.d.ts` is the tiebreaker; `25_atom_architecture_reference.md` is superseded for the model): four layers, five canonicalisation stages, each stage the executor of its `BP-` rules; own repo `hauska-factory`, own Neon store, console Smart Site Factory in `hauska-map/apps/factory`; staging Smart Site under the Factory base URL and every publish lands on staging before the identical job runs on production; nothing reaches a serving store except through publish; laptop ingest is FROZEN (`_decisions/2026-08-26_ingest_freeze_and_cloud_loader.md`). **OPTION A ruled** (`_decisions/2026-08-26_factory_model_law_and_option_a.md`): P-82-lite plus BP-WRITE-01 land on the existing writer as a bug fix; Bexar 48029 cad finishes on the current shape (660,000 of 703,257 done); NO new county is written on the old shape; Harris, Dallas and the Texas remainder wait for the conformant stage E writer (F-15, F-16, F-18). STATUS 2026-08-27: Phase A closed; F-02 runner `factory-atoms-cad` (us-east4, digest-pinned, run row first) is the only writer job; OLD-SHAPE WRITES ENDED permanently (no `--apply` through the old writer for any county; Bexar 703,257 = roll, complete); the store is still the old shape and still serves; next card is the conformant writer (F-16 resolution, F-17 reconcile, F-20 stage-and-merge write, F-18 intensional demotion) on one Texas source, F-15 types from the substrate seat by request, then F-10 drains Texas, then F-06 publishes. Every lane has its own registered worktree; never build in another lane's checkout.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- SMARTCITY PRODUCT LINE THEN UI THEN ONE FEED — template Dashboards UI first, then one adapter/source onto `template-city`. Live Bastrop is an island, not the next card. Three identities: `template-city` demo, live `tenant_id=2` Bastrop, next onboarded city. Do not rewrite `tenant_id=2` in place. CitizenConnect is the citizen lens, not a SKU. Feeds are adapters that write records. Destination still `_decisions/2026-08-17_smartcity_product_line_then_bastrop_onboarding.md`. Next-card sequence `_decisions/2026-08-17_dashboards_ui_then_one_feed.md`. Gap map `_inbox/2026-08-17_dashboards_missing_pieces.md`.
- FEED ADAPTER CONTRACT (G-63 CLOSED) — kinds are a catalog; grants are per city pack. Write spine or files with provenance. Never a Dashboards vendor table. Never Pipedrive as a city feed. Samsara fleet copies are not G-24. Decision `_decisions/2026-08-17_g63_feed_adapter_contract.md`.
- G-11 CITY-PACK TENANCY (CLOSED 2026-08-17 as sequencing) — a city pack is the tenant. Identified caller is a Hauska product key whose `jurisdiction_tenant` equals `cityKey`. `DASHBOARDS_API_KEY` is not a tenant. Fixture pack `fixture-city`. Not sprint-54 done. Not live ingest. WDLL `_inbox/2026-08-17_g11_tenancy_WDLL.md`. Decision `_decisions/2026-08-17_g11_city_pack_tenancy.md`. Close `_inbox/2026-08-17_g11_close.json`.
- G-45 SMARTSITE STAFF MAP (CLOSED 2026-08-17) — Dashboards staff map is the SmartSite embed of gold `48021:34137`. GET `/` auto-loads it. Do not cut live Leaflet. Do not clone PE. WDLL `_inbox/2026-08-17_g45_smartsite_staff_map_WDLL.md`. Decision `_decisions/2026-08-17_g45_smartsite_staff_map.md`. Close `_inbox/2026-08-17_g45_close.json`.
- G-64 LANE C STAFF PATH (CLOSED 2026-08-17) — Dashboards development-services mounts plan-review-app. GET `/?lens=development-services` auto-loads it. GET `/` stays G-45 SmartSite. Do not cut live PermitFlow. Do not start G-52. WDLL `_inbox/2026-08-17_g64_lane_c_staff_path_WDLL.md`. Decision `_decisions/2026-08-17_g64_lane_c_staff_path.md`. Close `_inbox/2026-08-17_g64_close.json`. Serving Dashboards `00007-8sc`.
- G-65 PERMITFLOW KILL (CLOSED 2026-08-17) — PermitFlow dead as a Dashboards product. Live `/permitflow/*` uncut until a named island replacement. WDLL `_inbox/2026-08-17_g65_permitflow_kill_WDLL.md`. Decision `_decisions/2026-08-17_g65_permitflow_kill.md`. Close `_inbox/2026-08-17_g65_close.json`.
- COMPASS IS SHARED-ELEMENT SHEET CHROME — G-66 item. Top-bar source control, not a page, not a rail-only assistant. Answer engine is out of this wave. Old Compass is not the atom-render reference; SmartSite is. Decision `_decisions/2026-08-17_ux_implementation_sequence.md`.
- UX IMPLEMENTATION SEQUENCE (G-67 first) — kit copy, then G-66 / G-68 / G-69 in parallel. Those three CLOSED 2026-08-17. G-24 stays zero. Live Bastrop no-touch.
- FILES COMPOSE THEN ONE FEED (G-70 G-71 G-72 CLOSED 2026-08-17) — Work → Files mounts smart-files-app. G-71 wrote Bastrop municode meetings onto `template-city` files. That host is a HOLD (identity collapse), not a feed win. Decision `_decisions/2026-08-17_files_compose_then_one_feed.md`.
- SHELL BEFORE FEEDS (G-73 CLOSED 2026-08-17) — Every G-18 / live-Bastrop staff function has a named home on the Dashboards shell. Connections is 67 of 67 Homes-table rows. Assets honest-empty. Feeds still pause. Register `_inbox/2026-08-17_g18_shell_homes.md`. Decision `_decisions/2026-08-17_shell_before_feeds.md`. WDLL `_inbox/2026-08-17_g73_shell_homes_WDLL.md`. Close `_inbox/2026-08-17_b_g73_close.json`.
- TEMPLATE-CITY IDENTITY (G-74 CLOSED 2026-08-17) — municode grant pulled off template-city. Compose meetings empty with basis `no municode calendar grant on template-city`. Citizen has no Chestnut. Connections HTML has zero Bastrop. No clerk retarget. Decision `_decisions/2026-08-17_template_city_identity.md`. WDLL `_inbox/2026-08-17_g74_identity_leak_WDLL.md`. Close `_inbox/2026-08-17_b_g74_close.json`.
- DEMO-CITY CHROME (G-75 CLOSED 2026-08-17) — mounts fill the frame, one SmartSite iframe, Compass-class map motion from current rails, 30c screens honest-empty. Serving `00013-vkl`. Plan Review `embed=1` is Dashboards-side; host already had detection. Interruptibility partial. Register 67 of 67 plus 3 addenda. Note `_inbox/2026-08-17_g75_shell_mounts_motion.md`. WDLL `_inbox/2026-08-17_g75_shell_mounts_motion_WDLL.md`. Close `_inbox/2026-08-17_b_g75_close.json`. Handoff `_inbox/2026-08-17_demo_city_template_handoff.md`.
- SMARTCITY PRODUCT-LINE DESIGN SYSTEM — one Empressa kit governs Dashboards, Smart Files, Plan Review, and future Asset Management. Not a Dashboards-only theme. Not Hauska chrome. Decision `_decisions/2026-08-17_smartcity_product_line_design_system.md`.
- SMARTCITY VISUAL LAW (session 1, operator loved 2026-08-17) — quiet surfaces, loud exceptions, honest absence. Register not card deck. Sidebar. Inverted applicability (Pass quiet, Unchecked hatch). Inter + Plex Mono, 12px floor. Environment badge. Not-built nav. Provenance chip; no bare confidence. Code citation has no ICC body slot. Light `--sc-atom` `#177F78`, dark `#4CC9C0`. Kit extract `_inbox/2026-08-17_sc_kit.css`. Decisions `_decisions/2026-08-17_smartcity_visual_law.md` and `_decisions/2026-08-17_atom_accent_light_hex.md`.
- SMARTCITY DASHBOARDS HOUSING — one product repo `empressaioemail-tech/smartcity-dashboards`, cities as tenant packs. Live Bastrop stays `smartcity-os` until a named island replacement. Decision `_decisions/2026-08-17_smartcity_dashboards_housing.md`.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

AGENT-CONTRACT v1890f0bb — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
interruption recovery, slot law + lease, heavy-scan serialization, verification rules, close schema).
Read it before any work; where this dispatch and the contract disagree, STOP and report.

DEV-PROCESS vbb19bd34 — you are bound by 90_runbooks/DEV_PROCESS.md in full. It governs how work
is SHAPED and how a result is JUDGED: coverage figures travel with their denominator, classes are
measured never subtracted, an instrument's exclusion set is part of its contract, gating indicators are
proven able to fire, paired controls need a divergence test, guardrails that do not survive a clone are
not guardrails. Every rule in it is traced to an incident. Read it before any work.

FLEET-MEMORY v2a98086b — you are bound by 90_runbooks/fleet_memory_practice.md (M0).
The verbatim install block follows. Product-repo agents do not carry .cursor/rules; this is the install.

FLEET MEMORY (M0): As you work, capture build knowledge in a scratch block you return in your close, using four entry kinds — LESSON (a hard-won fact worth a test/note), DEAD-END (a tried-and-failed path + reason, so it is not retried), GROUND-TRUTH (a live-verified state WITH its timestamp), OPEN (a live thread the next context must pick up). Read any scratch context passed to you FIRST before re-deriving. Do NOT promote anything to durable memory yourself — return lessons in your close; the planner gates promotion. Nearing your limit, flush open threads + live ground-truths into your close so the next instance starts warm.

PLAN-ROW: P-106 (90_operations/OPS-16_texas_market_plan_of_record.md)

# P-106: constraint search, and the three-set result that makes it honest

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

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-02_p106-constraint-search_cp1.json
  CP2: _inbox/2026-09-02_p106-constraint-search_cp2.json
  CLOSE: _inbox/2026-09-02_p106-constraint-search_close.json
