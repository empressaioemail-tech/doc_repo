---
id: 75j_property_explorer_destination_ledger
title: Property Explorer — destination ledger (what "done" looks like, tracked vs current)
status: active
last_updated: 2026-07-23
applies_to: hauska-map (property-explorer), legacy-design-tools (node-facet bake, cortex-api), the map-first product line
related: [2026-07-20_map_first_program_launch, 2026-07-20_what_separates_us_service_elevation, 2026-07-21_architecture_gaps_node_facets_atomization_and_gated_functions, 2026-07-21_overpass_road_data_spec, 2026-07-20_provable_county_data_pipeline_design, 76h_property_explorer_gtm, 09_post_saas_substrate_thesis, 08_tiered_access_model]
owner: nick
---

# Property Explorer — destination ledger

The living definition of what "done" looks like for the map-first Property Explorer, with a current-state read per dimension. This is a DESTINATION-vs-CURRENT ledger: update the "current" column + the % each session so the gap to the destination is always visible. The destination is v1 = Central Texas complete + trustworthy (national is the horizon, not the v1 bar); operator-ratified 2026-07-21.

## The one-line destination

Click any parcel in the region and get a TRUE, CITED, CONFIDENCE-CALIBRATED buildable answer (what/where/why you can build, drawn on the map), honest where data does not exist — sold as a human web app AND as agent-consumable atoms, across every surface, with the commercialization layer (auth/paywall/CRM/GTM) that makes it a business.

The wedge is constraints-and-buildability, cited and calibrated — NOT valuation (the deliberate, honest out-of-scope). Rows 2/7/8 are the moat (a provably-honest, calibrated, cited buildable answer competitors cannot copy); rows 9-15 make it a business; row 16 keeps it coherent at scale.

## The ledger

| # | Dimension | "Done" state (destination, v1 = Central-TX complete) | Current (2026-07-21) | % |
|---|---|---|---|---|
| 1 | Geographic coverage | Every parcel in the ~10-county Central-TX metro fully baked, all facets gate-verified, honest where data doesn't exist. National = horizon (per-state provider abstraction ready), not v1 bar. | ~2.05M parcels baked; 9/10 counties land-use; zoning across 16 cities; Comal + gaps honest. | 70 |
| 2 | Core answer (the wedge) | Click a parcel -> drawn buildable envelope + setbacks + zoning + flood, cited + confidence-scored, "ADU fits here up to X sqft" — what/where/why you can build. | Envelope draws where setback tables exist; cited + honest-absence live. | 60 |
| 3 | Code & permit depth | Authoritative building-code answers (ICC I-Codes ingested) + the permit path — "what the code requires to build this." Kills the "check with the city" hedge. | ICC creds in Secret Manager; consumer surface shows hold — no fake citations (WDLL 31). | 25 |
| 4 | Feasibility read (investor) | "Does this pencil / what's the play here" — development-feasibility for the investor persona (edges toward, stays honest about, valuation). | Not built; deliberately deferred (the honest weak spot). | 10 |
| 5 | Three personas, one engine | Homeowner verdict / investor envelope / architect citation off the SAME facts. "Three registers, one truth." | Persona toggle + register headline on inspect card (Wave 5). Report-path flex waits Wave 3. | 55 |
| 6 | Reports + visualizations (paywalled) | Generate a cited property report with MAP-level and REPORT-level visualizations of the answer (envelope drawn, constraints mapped, flood/topo rendered) — a shareable deliverable, behind the paywall. | Paywall gate + checkout seam wired; spine R1–R10 still Wave 3. | 25 |
| 7 | Data trustworthiness (the moat) | Every value gate-verified + carries source/vintage/confidence/citation; honest "not verified here" where absent; confidence CALIBRATES against outcomes (the earning loop). No fabrication, provably, at scale. | Owner-match gate + coverage ledger live; fabrication killed + prevented; calibration loop exists but sparse. | 65 |
| 8 | Genuine calibration (precision) | Setbacks TRUE (all tables transcribed + verified per jurisdiction); Overpass road-based envelope DONE (authoritative front edge, not inferred); satellite <-> parcel lines aligned as tight as sources allow. Authoritative, not just honest-approximate. | Setbacks deepened (hard-hold declines remain); Overpass remounted durable on tip `cortex-api-00428-fax` (LDT #350/`ab34b330`; WDLL 8/9 re-met 2026-07-23 on live `48055:11386` edgeSignal:road). Absent-zoning invent (Bexar I-2) honesty-fixed. Full precision / aerial alignment / atom confidence still open on the spine atomization track. | 40 |
| 9 | Surface — consumer web app | Web-app-first: free anonymous browse, paywalled deep (research/save/AI/reports). The front door. | Deployed + live; browse works; GTM/CRM/billing seams + paywall gate in Wave 4–5 PRs. | 60 |
| 10 | Surface — agent/MCP (Hauska thesis) | The parcel facets ARE atoms sold to agent operators via the MCP/atom catalog — jurisdictional intelligence as purchasable substrate, not just a human app. | Facets atom-SHAPED but not on the atom contract (arch gap 1); not served via MCP. | 20 |
| 11 | Surface — desktop extension | Optional Chrome add-on layered on the web-app account — listing-site capture, hands the property to the web app. | Extension exists; handoff smoke BLOCKED until auth + substrate migration. | 40 |
| 12 | Surface — mobile / on-site (PWA) | Installable phone surface for standing-on-the-parcel: full-bleed map, GPS, the answer in hand at the site. | PWA manifest + mobile meta + GPS; operator install/Lighthouse QA pending. | 45 |
| 13 | Auth + paywall + tenancy | Web OAuth front door; user-aware entitlement (not install-keyed); tenant-isolated storage; accessPolicy on atomized facets = the paywall mechanism (free-public vs paid vs tenant-private). | Anonymous-only; auth/tenant = sprint-54, held; checkout seam test-mode ready. | 20 |
| 14 | CRM integration | Pipeline/CRM hooked up — leads, saved properties, user journeys flow into the CRM (as the trading app does). | PE funnel → Pipedrive via cortex routes (simulated/live per token). | 35 |
| 15 | GTM system (model = trading app) | A captured AND built GTM system; the trading app is the reference (it's a GTM machine): market footprint per vertical, funnel, the motion to own the MCP market. | `76h_property_explorer_gtm.md` + PE funnel routes + digest extension (not trading clone). | 50 |
| 16 | Architecture reconciled | Node facets atomized onto the contract; substrate/shell layers clean (Hauska substrate, Empressa surfaces); one-substrate-many-surfaces holding; no parallel implementations of the atom model. | Gaps recorded (atomize facets, paywall-via-accessPolicy); substrate shared but facets parallel. | 35 |

Rough overall: ~38% of the v1 "done" line. The foundation (map, substrate, integrity, honest data, a deployed surface) is real and the hardest architectural risk (fabrication) is SOLVED; the distance left is breadth (calibration at scale, code/permit depth, feasibility) + the commercialization layer (auth/paywall/atoms/CRM/GTM) that turns a working map into a sellable product.

## How to use this ledger

Each session that touches the Property Explorer product line, update the "Current" column + the % for any row that moved, bump last_updated, and note in that session's summary which rows advanced. The % values are directional (a shared honest read), not precise metrics — the point is a always-visible destination-vs-current gap so no dimension silently stalls or gets over-claimed. When a row hits ~100, it moves to a "held at done — watch for regression" note rather than being deleted.

The moat rows (2, 7, 8) get the tightest honesty: a coverage or calibration number here only advances after it is gate-verified against live state, never on a build summary or an agent's word — the discipline that this whole program was built on.
