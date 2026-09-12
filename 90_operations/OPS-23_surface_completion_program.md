---
id: OPS-23_surface_completion_program
title: OPS-23 — The ledger as the serving path (surface completion; what the customer sees is the predicate)
date: 2026-09-11
last_updated: 2026-09-11
status: active — plan of record; rows P-151..P-160 (A-128) and P-161..P-167 (A-129) in OPS-16
owner: nick
applies_to: portfolio
related:
  - 90_operations/OPS-21_serve_completion_program
  - 90_operations/OPS-22_spine_architecture_map
  - 90_operations/OPS-16_texas_market_plan_of_record
  - 80_adrs/adr_031_parcel_record_ledger_over_atoms
  - _decisions/2026-09-11_setback_source_most_current_wins
  - _decisions/2026-09-11_ruling_b_reversed_polygon_only
  - _decisions/2026-09-11_overseer_dispatch_planner_lane_topology
  - _catalog/program_preambles/OPS-23.md
  - _inbox/2026-09-11_ops23_ledger_serving_path_WDLL.md
snapshot: >
  Authored 2026-09-11 by the integration seat against origin/main of hauska-map fb41c05,
  legacy-design-tools 489f428c, hauska-engine 79fa573, hauska-factory 217b7dd, doc_repo
  7da933b9. Every finding below names the live probe or the file:line that produced it.
  Production serving at authoring time: cortex-api-00768-cus, hauska-engine-api-00198-cir,
  smartsite.cloud (Vercel). Re-run the probes before trusting any finding; code and stores move.
---

# OPS-23 — Surface completion program

## Read this first if you are a fresh planner

This document is the whole state of the program. It is written so that a planner with no
conversation history can pick it up cold. Nothing that matters lives only in a chat.

1. Identify your role in section 6. There are three: overseer, dispatch planner, lane.
2. Run the instruments in section 8 before believing anything in sections 2 or 4.
   Then read the durable card, `_inbox/2026-09-11_ops23_ledger_serving_path_WDLL.md`: it is the
   statement of done for every row, ruling and owed item in this program, and it and section 4
   carry the same eighteen rows by construction.
3. Read the latest checkpoint in `_inbox/` matching `*_ops23_checkpoint_*.md`, if one exists.
   It supersedes the lane board here.
4. Do not relitigate section 3. Those are operator rulings with reversal criteria on file.
5. Every lane in this program closes on a live probe of a customer surface, never on a merge,
   a cortex read, a ledger count, or an MCP read alone. That is rule R-4 and it is the reason
   this program exists.

## 0. The shape (ruled 2026-09-11, `_decisions/2026-09-11_ledger_as_serving_path_seven_steps.md`)

The whole system runs on atoms, in Doc 19's sense: a **node** is identity and carries no
facts; an **atom** is one claim from one authority at one time about a node's subject; an
**edge** is an atom whose value is a node. The **ledger** is the accounting over the nodes: for
every node and rail, one cell that holds the state, the atom reference, provenance, and a
cached rendering keyed to the atom version and the vocabulary version. A cell never holds a
value as canon. **One reader**, in the Hauska retrieval service, walks gated cells,
dereferences atoms, and serves them: the machine face is the atom, the human face is the same
atom through **one vocabulary** module. **One writer** mints the atom, sets the pointer and
writes the rendering in one transaction. Reports, Smart Site MCP, the web app and the Hauska
MCP catalog all consume the reader.

The seven steps, in dependency order:

| Step | Row | What | Depends on |
|---|---|---|---|
| 1 Nodes | P-161 | the three identity rulings in OPS-22 §1; the `place_key` to `entity_id` crosswalk as a contract type; one key per city, district, road | none |
| 2 Rail-to-atom map | P-162 | an instrument naming the atom family for each of the 65 rails, and the families that do not exist | none |
| 3 One writer | P-163 | the conformant writer mints atom, pointer and rendering in one transaction; runner reaches every writer; factory cell jobs route through it; setbacks (P-154) are the first family | P-161, P-167 |
| 4 Backfill | P-164 | mint atoms from every gated cell that holds a value, repoint, values unchanged; the boundary/envelope atom program's backfill folds in | P-161, P-163 |
| 5 One reader | P-152 | retrieval-api gains a read-only factory role, walks gated cells, dereferences, serves the rendering on key match, refuses unslated rails; PE, cortex, smartsite-mcp, engine reports and the Hauska MCP tools consume it; the 70 legacy paths retire in the same cards | P-161, P-167 |
| 6 Edges | P-165 | parcel-in-city, parcel-in-district, edge-fronts-road, parcel-adjoins-parcel, supersededBy as atoms whose value is a node, written from the joins that already run; `hop1` and `subgraph` become real | P-161 |
| 7 Succession | P-166 | a node's replat, renumber or reload marks its atoms and cells stale together, visibly to the gate | P-163 |
| Vocabulary | P-167 | one display-vocabulary module as a subpath of the atom-contract package, imported by writer, reader, PE and engine; the parity lock retired | none |

The surface rows from the same day (section 4) are the read-side proof of the shape: P-151 and
P-153 draw what the reader serves and survive unchanged; P-155 to P-159 are acquisition and
rendering and run beside the seven steps.

## 1. The operator's goal, stated once

> "I need the real atomized setup to serve in prod. It has gone past my assumption of timing by
> about five weeks and every time I start a new thread it never actually goes through to
> completion." And: "It should not be this difficult."

Concretely: the Property Explorer panel, the map, the exported PDFs, and the Smart Site MCP
connector show the same facts for the same parcel, drawn from one reader, with honest
absences that name the city or source that is missing. For the six Central Texas counties
first, measured on a fixed parcel set (section 7).

OPS-21 met its own goal: the ledger is fully graded and setbacks serve from `parcel_record`
through cortex. OPS-21 never repointed the browser. This program is the half OPS-21 could not
see because its predicate was measured at cortex.

## 2. What was found on 2026-09-11, with the instrument that found it

Every row was verified live or at `origin/main` on the date above. Re-run before quoting.

| # | Finding | Instrument |
|---|---|---|
| F1 | The map does not draw setbacks because the sheet refuses any envelope whose geometry came from live derive and carries no envelope atom DID. The endpoint the map calls returns a real polygon for `48021:34049` (setbacks 30/10/30/20, 16,386 sq ft). The refusal is `sheetEnvelopeIsAtomPathPending` in hauska-map `apps/property-explorer/src/lib/fact-sheet-resolver.ts:216-241`, landed as commit `cca2964` (2026-08-28) under Ruling B. A refused envelope projects to `declined`, `normalizeEnvelope` returns `none`, `ExplorerMap.handleEnvelope` clears the overlay, and the Buildable row falls to the default label "Not stamped here" (`InspectCard.tsx:495`). | `POST /api/spine/cortex/api/brokerage/v1/place/buildable-envelope {"address":"1109 PECAN ST, BASTROP, TX 78602"}` returned `status:"ok"` with a 6-vertex Polygon. |
| F2 | A second gate sits behind F1: `handleEnvelope` draws only when `isEntitled(snapshot)` (Pro, unlocked, or dev role). Comment: "Free states the envelope as a number. Drawing is the X-ray." A free viewer sees no polygon even after Ruling B is lifted. | `ExplorerMap.tsx:1583-1596`, `entitlementClient.ts:97`. |
| F3 | Five producers answer "what are the setbacks" for `48021:34049` and disagree as `present`: panel 25/5/25/15 (atom chain, Bastrop layer 23, bakedAt 2026-08-05); feasibility PDF 25/5/25 (engine per-parcel adapter); envelope endpoint 30/10/30/20 (LDT ranks codified ordinance above the GIS record); MCP `get_smart_site` 30/10/30/20 (`parcel_record`, `bastrop-development-code`, note cites CORRECTION A); boundary-edge atoms 30/10/30/20 per edge. No surface shows the conflict the 2026-08-31 ruling required. | PE facets endpoint, envelope endpoint, `get_smart_site` depth node, PDF FS-48021-34049 sheets 1/5/9. |
| F4 | Buildable area for the same parcel: ledger refuses (OPS-21 ruling), panel "Not stamped here", endpoint 16,386, panel facets 19,052 (atom outcome), PDF 19,052 on sheets 1 and 8 and 20,349 on sheets 4 and 5, and sheet 1 prints "19,052 sq ft, 68% of the lot" where 19,052 is 63.5 percent. Mechanism: `buildablePdfLabel` uses the warm atom area while the percent uses the engine's own offset ring, `site-model.ts:547-598`. | PDF read; `site-model.ts`, `pdf/feasibility.ts:685-710`. |
| F5 | Travis parcel `48453:113408` (414 Spiller Ln, West Lake Hills) rendered APN, county, and its land-use description under a label reading "Zone", with "No street address on the county record". Production holds fourteen present facts for it. The card is the `unplaceable` fallback: the resolver composes the derive address from `baseFacts.situsAddress` only ("414 SPILLER LN"; Travis stores the city in a separate field), cortex geocodes that to a 422 `geocode_miss`, the OSM geocode returns nothing, the map click passes `geometry: null` and no point, so the ring probe never runs and `buildParcelGeometry` returns null. The record already carries its own point (`cityLimitsFact.queryPoint` 30.29002, -97.81149) and the live parcel layer returns the ring for a bbox around it. Appending the city does NOT fix it: cortex still returns `geocode_miss` for "414 SPILLER LN, WEST LAKE HILLS, TX". The point route `POST buildable-envelope {lat,lng}` returned 504 after 10 s. | Five live probes; `fact-sheet-resolver.ts:340-370, 2520-2660`; `ExplorerMap.tsx:947-960`; `InspectCard.tsx:150-173, 1336-1345`. |
| F6 | The panel reads facets through hauska-map's own adapter (`readPath: atom-chain-warm`, bakedAt 2026-08-05 for Bastrop, 2026-07-24 for Travis) and only merges cortex base facts when the atom chain is empty. OPS-21's record-served setbacks reach `get_smart_site` and never the panel for atom-carrying parcels. ADR-031 Decision 5(b) prohibits exactly this fork and no plan row ever carried it. | PE facets endpoint `readPath`/`bakedAt` fields on three parcels; `api/_lib/pe-property-atoms.ts:4-7, 139, 348`. |
| F7 | The Feasibility Study does not "time out on a cold start". The engine completes every Travis refresh and returns 201 in 85 to 154 seconds (`hauska-engine-api-00198-cir`, warm, 100 percent traffic). Both clients abort at 55 seconds: PE `FEASIBILITY_ENGINE_TIMEOUT_MS = 55_000` (`pe-feasibility-export-handler.ts:61`) under a Vercel `maxDuration: 60`, and smartsite-mcp `REFRESH_TIMEOUT_MS = 55_000` (`feasibility-export.ts:16`). Bastrop refreshes ran 38 to 85 seconds, so Bastrop sometimes fits and Travis never does. The download endpoint serves the finished PDF in 0.2 seconds afterwards. The user-facing string blames a cold start that did not happen. | `gcloud logging read` on `hauska-engine-api`, nine requests 2026-09-11T16:13Z to 16:42Z; `export_instrument feasibility 48453:474034` returned `upstream_non_json / This operation was aborted`. |
| F8 | Footprints: the map layer reads building-footprint atoms via `retrieval/building-footprints/near-bbox`, which returned `count: 0` around a visible 1906 house with a pool; atoms exist only for a Bastrop pilot subset; the layer toggle is off by default. The fact row reads a different source (staged ML footprints) and declines with `staged-geometry-true-join-below-10pct-overlap-threshold` on both probed parcels, each with an obvious house in the imagery. Whether the 10 percent is measured against parcel area (which fails ordinary houses by construction) or footprint area is not established. | near-bbox probe; `building-footprint-overlay.ts`; `consumer-layers.ts:82-90`; facets `buildingFootprintFact`. |
| F9 | City zoning coverage in Travis is better than the roster says and worse than the panel shows. `_catalog/texas_roster_v1.json` marks 4 of 24 Travis-touching cities LAYER-FOUND. hauska-factory `src/config/zoning-layer-completeness.mjs` declares 22 cities complete against measured live layers, including Austin, Lakeway, Pflugerville, Cedar Park, Leander and Round Rock, which the roster marks NOT-FOUND. The roster is stale as an instrument. Seventeen Travis cities have no staged layer, West Lake Hills and Bee Cave among them. `2601 Sterling Panorama Ct` (`48453:474034`) is unincorporated Travis in Lake Pointe MUD: zoning legitimately does not apply there and the panel says "this area is not zoned or not stamped", a disjunction that hides which. | Roster parse; factory file at `217b7dd`; facets `cityLimitsFact`. |
| F10 | Two confidently wrong strings on customer surfaces: `get_smart_site` prints "Withheld, setbacks unruled" in the draw block beside a `present` setbacks section for the same parcel; the feasibility PDF narrative (sheet 2) says "No mapped structures appear on the parcel, so any new construction can proceed without demolition" beside sheets 3 and 11 that say treat the site as improved. | `get_smart_site 48021:34049`; PDF FS-48021-34049. |
| F11 | Three cortex reads on Travis hung in one hour: the PE facets endpoint for `48453:474034` hung 60 s then answered in 1.9 s; the envelope point route returned 504 at 10.2 s; PE's own situs search returned 502 "cortex timed out after 5000ms" for "414 SPILLER LN" in 48453. Intermittent, unmeasured, and the same class as the radius-search hang (2026-08-31) and the read-under-writer-load findings already on file. P-151's LDT half owns the point route; the class is deferred with a trigger in section 11. | `curl -m 60/90` twice; `POST buildable-envelope {lat,lng}`; `GET /api/pe-situs-search`. |
| F13 | The envelope endpoint's address form can answer for another parcel. Asked with the gold parcel's composed situs, it returned `status: ok` and a polygon for `48491:R419407`, a Williamson parcel, when the record was `48021:33223`. The panel's resolver compares node ids and discards it; any consumer that does not will serve another lot. The reader in step 5 resolves by node id only; an address never enters it. | `scripts/surface-probe.mjs` live run 18:02Z, finding WRONG-PARCEL; artifact `_inbox/2026-09-11_180241_surface_probe.json`. |
| F14 | The point-route hang is intermittent, not a state. The same `POST buildable-envelope {lat,lng}` for `48453:113408` returned 504 at 16:39Z and 200 `declined` in 1.9 s at 17:59Z and 18:02Z. F5 and F11 are corrected to say so; the probe records it on every run so it becomes a rate. | two live probe artifacts. |
| F15 | Cortex's cached copy of the Bastrop County parcel layer has holes at both Bastrop probe parcels. `map-data/gis-layer` (provider "Bastrop County GIS parcels", features stamped `retrievedAt 2026-08-17`) returned 44 features around 1109 Pecan St's record point and none contains it (nearest 911 Farm St at 64 m), and 42 around the gold parcel 927 Main St with none containing it (nearest 925 Main St at 24 m). The county's own service, queried directly at the same point, returns `prop_id 34049, 1109 PECAN ST, 0.686 ac`; the point also lies inside the parcel's envelope polygon, so the point is right. The same layer answers correctly for Travis (TxGIO/StratMap, matched by id). Mechanism believed: the cached county-gis fetch missed or dropped this parcel; alternative considered, a county geometry edit after 2026-08-17, is weaker because the county returns the same prop_id and acreage the record carries. Consequence: the resolver's ring probe cannot find a county-exact ring for this parcel, so the sheet's geometry is centroid-only and the panel's lot figure is CAD acreage. First recorded as an id-scheme mismatch; corrected the same hour by the authoritative read. Owner: P-152's reader must read parcel rings from the ledger's `parcelGeometry` rail (TxGIO), not from a cached county-gis fetch. | probe live run 18:02Z and 18:05Z; direct `FeatureServer/0/query` at the point; fixture `envelope-address_48021-34049.json` containment check. |
| F16 | The Find box on smartsite.cloud does not resolve `414 SPILLER LN` after the P-151 deploy (operator, 2026-09-11 21:05Z: "I cannot search the address on Spiller"). Address search is a geocoder path separate from the sheet resolver P-151 re-seeded from the record point; cortex returns `geocode_miss` for this address with or without the city (F5). P-27 ruled the situs index over any geocoder, so a Find box that geocodes is the same class as F12: geocoding demoted and still reached. The same session reached the parcel card by other means on 2026-09-11 (the original screenshot carried APN 113408), so the card exists and the entry path is what fails. Mechanism believed: the Find box calls the geocoder before the situs index; alternative, the situs index lacks split-situs Travis rows, is testable by searching the parcel id and is not ruled out here. Consequence: a Travis customer typing a split-situs address gets nothing. Owner: the P-151 close states whether the lane touched the Find path; if not, a row is proposed at the next OPS-16 amendment (Find box reads the situs index; the geocoder is the declared fallback, labelled). | operator observation 2026-09-11 21:05Z; `_inbox/2026-09-11_p151_observations.json`; probe artifact `_inbox/2026-09-11_212909_surface_probe.json` (113408 UNMEASURED pending the click test, 474034 PASS). |
| F17 | The feasibility PDF and the panel disagree on the special district for `48453:474034`: the card prints "MUD: Lake Pointe MUD" (the record's specialDistrict rail through the reader) and FS-48453-474034 sheet 10 prints "MUD West Travis County MUD 3" (the engine's special-district-fact atom through the report composer). Two producers, one parcel, one district each; overlapping districts are plausible and a rail that carries one when two apply is the defect either way. CORRECTED 2026-09-12 by the report-path verification (`_inbox/2026-09-12_ops23_wave3_verify_p152_lane3.md`): the report composer reads the ENGINE SUBSTRATE ATOMS STORE (`report-model.ts:434 listPropertyAtomsByParcelNodeId`), where special districts are every TCEQ-membership `special-district-fact` atom with no one-district picker; the card reads the record's `specialDistricts` cell; two stores, never reconciled. The earlier "reads cortex facets with the service key" was the overseer's transposition of the PANEL's cadRoll mechanism onto the PDF, named from one read. Owner: P-152 lane 3 (the report composes from the reader) and P-165. | operator's PDF and card, 2026-09-12; `_inbox/2026-09-12_p152-panel_close.json` (composer rails). |
| F18 | The feasibility PDF cannot see session-gated values and so calls an improved parcel unimproved. FS-48453-474034 sheet 9 prints market value, assessed value, year built and living area UNAVAILABLE while the card prints Market $969,365, Improvement $857,737 for the same parcel; sheet 12 then says "the site reads as unimproved, so redevelopment is unlikely to require demolition" and sheet 2's narrative repeats it, under an aerial that shows a house. Mechanism, CORRECTED 2026-09-12: the report composer reads the engine substrate atoms store and the store holds no `cad-parcel-roll` atom for this parcel, so the section is `absent("blocked-at-source")` (`report-model.ts:445-449`); session gating plays no part (no entitlement reaches the engine at all: the BFF and the MCP send static `x-hauska-access-tier: public-paid`). P-159's `footprintContradictsAppraisal` guard is starved because the roll side is absent in that store; the footprint side is `absent` for the P-158 reason. The earlier session-gating mechanism was named from one read. A guard that cannot see one of its two inputs is vacuous on exactly the parcels it exists for. Owner: P-152 lane 3 (the report composer reads the reader with the requester's entitlement carried from the app) and P-158 phase 3. | the PDF sheets 2, 9, 12; `_inbox/2026-09-12_ops23_wave2_verify_panel_and_findbox.md` A3. |
| F19 | The feasibility PDF says "no city-limits or ETJ boundary source is wired for this county yet, so annexation status is unverified" (sheet 9) while the card prints "Unincorporated · ETJ unresolved" from the record's cityLimits rail, which P-151 made the panel's truth and which is `record` on the reader for all five probe parcels. The report path does not read the record: city limits and ETJ are CONSTANTS (`report-model.ts:791-796` sets both `unresolved` for every parcel; `pdf/feasibility.ts:194-197` prints the literal sentence on every PDF in every county); school district is not on the report path at all; and the PDF prints raw tokens (`no-zoning-stamp`; `pending — build-to-line governs (scalar setback silent)`) where the card prints the human strings. School district and water service, present on the card, are absent from the PDF. Owner: P-152 lane 3 for the source; P-167 for the vocabulary. | the PDF sheets 1, 9, 12 against the card. |
| F12 | Geocoding was already demoted by ruling and the panel still ends on it. Invariant I5 (`fact-sheet-resolver.ts:2512`): "geometry is the navigation authority; the situs address is only a way to ask for a coordinate when nothing geometric is on hand." P-27 (`_decisions/2026-08-13_p27_address_to_parcel_post_gate.md`): "Do NOT build a geocoder." The cortex envelope route orders resolution correctly (explicit point, then situs-to-parcel, then geocode last) and still lands on Nominatim when the situs pre-pass misses; the panel is the caller that reaches it because it ignores the record's own point. Operator's read: "I thought we had done away with geocoding; maybe that cortex function is not caught up." Caught up in order, not in outcome. | Code read of both files; the four probes in F5. |

## 3. Standing rulings for this program (operator, 2026-09-11)

These travel into every dispatch through `_catalog/program_preambles/OPS-23.md`.

**R-1. Most-current source wins.** For setbacks and every dimensional rule, in every city and
county: the source with the most recent effective date is the value. Authority tier breaks ties
only when dates are equal or unreadable. Dates are read from the source itself (an ordinance's
effective date; an ArcGIS layer's `editingInfo.lastEditDate`), never assumed from the source
kind. When a date cannot be read, the row shows both values and both sources, never a silent
pick. This supersedes the tier-first ranking in LDT `authoritativeSetbackSource.ts` and the
layer-23-first rule in hauska-map `atom-chain-to-facets.ts`, and it closes the 2026-08-31
"unresolved" hold on Bastrop corner lots by naming the instrument that resolves it. Record:
`_decisions/2026-09-11_setback_source_most_current_wins.md`.

**R-2. Ruling B is reversed for the polygon only.** The map and the MCP draw block both draw
the modelled buildable envelope, with the disclosure the endpoint already carries, wherever
zoning and a setback table exist. The buildable number stays refused until an envelope atom
backs it. Both surfaces draw the same polygon from the same call. Record:
`_decisions/2026-09-11_ruling_b_reversed_polygon_only.md`.

**R-3. The city is the unit of zoning and setback work.** Travis is not a card; West Lake Hills
is. Each city closes on its own predicate (section 5, P-156). Until a city is done, every
surface names the city in its absence string.

**R-4. The customer surface is the completion predicate.** No lane in this program closes
without a `surface-probe` artifact (P-160) run after deploy, against the fixed parcel set,
showing the change on the surface the lane claims to have changed. A merged PR, a cortex read,
a ledger count, or an MCP read alone does not close a lane here.

**R-5. Three roles: overseer, dispatch planner, lane.** Section 6. Record:
`_decisions/2026-09-11_overseer_dispatch_planner_lane_topology.md` (proposed; active on the
operator's go).

## 4. Lanes

Rows are declared in OPS-16 amendment A-128. Order is the operator's, ruled 2026-09-11.
Dispatches compile with `node scripts/dispatch.mjs --lane <ID> --plan-row <P-xx> --mission-file
_catalog/dispatch_missions/<file> --program-preamble _catalog/program_preambles/OPS-23.md`.

| Order | Row | Lane | Repo(s) | Scope | Live predicate (all on the section 7 parcel set) | Depends on |
|---|---|---|---|---|---|---|
| 1 | P-151 | SEAM | hauska-map, legacy-design-tools | Placement never depends on geocoding. Seed the sheet resolver from the record's own point (`cityLimitsFact.queryPoint`, or the parcel centroid) and from the click, then run the ring probe. Compose any address the resolver still sends from situs plus city plus state. Fallback card row relabelled from "Zone" to "Land use". Unincorporated parcels say "unincorporated <county>: no municipal zoning" instead of "not zoned or not stamped". Cortex: the `{lat,lng}` envelope route must answer or refuse inside 10 s, never 504. | `48453:113408` seals: flood, lot, land use, special district, school, utility, values render; header shows 414 SPILLER LN. `48453:474034` zoning row names unincorporated Travis. Envelope point route returns a status for both in under 10 s. | none |
| 2 | P-160 | PROBE | doc_repo | `scripts/surface-probe.mjs`: the fixed parcel set through PE facets, envelope by address and by point, gis-layer bbox, cortex node facets (refuses without `CORTEX_SERVICE_API_KEY`), feasibility export status. Self-tests in both directions with a known-bad fixture. `scripts/ops23-lane-status.mjs` cloned from the OPS-21 monitor with this row set. Canon-gate: a P-151..P-159 close must cite a probe artifact or the close is refused. | The instrument fails on the 2026-09-11 state of `48453:113408` and passes after P-151 deploys. Three-question gate answered in the file header. | none (runs in parallel with 1) |
| 3 | P-153 | DRAW | hauska-map, legacy-design-tools | R-2. `sheetEnvelopeIsAtomPathPending` stops refusing geometry; the number path still refuses. `assembleParcelDraw` / `parcelDrawFromReads.ts` carries the same polygon in the MCP draw block with `geom` set. The eleven files that carry `atom_path_pending` (section 9) are the enumerated blast radius; each is read before change. Entitlement gate F2 is left as is and the operator is told which account tier sees the drawing. | `48021:34049` envelope overlay visible on smartsite.cloud for an entitled viewer; `get_smart_site` draw block envelope `geom` present with the same vertex count; `48453:474034` still refuses with the unincorporated reason. | P-151 (shared files) |
| 4 | P-152 | ONE-READER | hauska-engine (retrieval-api), legacy-design-tools, hauska-map | Step 5 of section 0. `services/retrieval-api` gains a read-only factory role, walks gated cells, dereferences atoms, serves the cached rendering on key match and re-renders otherwise, and refuses unslated rails with the cell state. Consumers repoint in order: cortex node-facets, then the panel (`atom-chain-to-facets.ts` stops owning facts), then smartsite-mcp, then the engine reports as renderers of the reader's payload. Each cutover deletes the path it replaces (L1's list of 70), proven by 404 or decline. `bakedAt` on the panel becomes the reader's snapshot. | PE facets endpoint, `get_smart_site`, and the PDF's fact inputs identical on value, source and vintage for every parcel in the set; disagreement count zero; every retired route answers 404 or a declared decline. | P-151, P-161, P-167 |
| 5 | P-154 | MOST-CURRENT | legacy-design-tools, hauska-engine, hauska-factory | R-1 in one resolver, and the first rail family through the one writer (P-163). `authoritativeSetbackSource.ts` becomes date-first with tier as tiebreaker; the engine per-parcel adapter and the factory S1 writer call the same resolver or the same published corpus with the same rule; Bastrop layers 23 and 83 and Ordinance 2026-06 get their dates read at source and recorded in the decision record as evidence; the ledger's Bastrop setback cells are re-run under the rule. A conflict row carries both values and dates. | All four surfaces print the same setbacks for `48021:34049` with the same effective date; if the sources still tie, all four show the conflict row. | P-152 |
| 6 | P-155 | FEASIBILITY | hauska-engine, hauska-map, legacy-design-tools | F7. Refresh becomes asynchronous: 202 with a job reference, download polls, and the two clients poll the download endpoint instead of holding a 55 s socket. The "cold start" string is retired. Profile why Travis takes twice Bastrop's time and record it, but do not gate the card on speeding it up. | `export_instrument feasibility 48453:474034` returns a PDF; the app produces the same PDF for the same parcel without a manual retry. | none |
| 7 | P-156 | CITIES | hauska-engine, hauska-factory, legacy-design-tools | R-3. A ranked queue of the seventeen unstaged Travis cities by in-city parcel count from `landing_parcel_jurisdiction`, West Lake Hills and Bee Cave first. Per city: run `zoning-discovery`; stage the layer or record that none exists; measure cellPct and arealPct and either add the city to `DECLARED_COMPLETE` or to `EXPLICITLY_HELD` with numbers; add a setback table from ordinance text or a per-parcel record, or record that none is published; re-run `parcel-r5-zoning` and the setback writer for that city. The roster's `zoning_layer` field is corrected from the factory declaration, or retired as an instrument. | Per city: `get_smart_site` for a parcel inside it shows zoning present and setbacks present or absent-verified naming the city; the panel shows the same. `48453:113408` is the first parcel. | P-152 |
| 8 | P-157 | STRUCTURAL | hauska-factory | TCAD improvement detail (living area, year built) ingested for Travis from the file the roll export omits. | `structuralFact` present for `48453:113408` and `48453:474034`; county-wide null rate on improved parcels reported before and after. | none |
| 9 | P-158 | FOOTPRINT | hauska-factory, legacy-design-tools, hauska-map | F8. First read the join and state which denominator the 10 percent uses. If parcel area, fix the predicate. If the staged layer has no polygon, that is acquisition and is said so. The map layer reads the staged footprints through the same retrieval route instead of the atom table. | `buildingFootprintFact` present for `48021:34049` and `48453:113408`; near-bbox returns at least one footprint around each. | none |
| 10 | P-159 | PDF | hauska-engine | F4 and F10. One buildable figure per document or none; percent computed from the figure printed; the narrative's footprint sentence generated from the footprint fact state and never contradicting the data-quality note. | Feasibility PDF for `48021:34049` prints one buildable figure on every sheet that prints one, and sheet 2 does not claim an empty lot. | P-155 for the Travis proof; Bastrop proof needs nothing |
| 11 | P-169 | INFRA | legacy-design-tools, hauska-engine | Cloud Run jobs for the CAD loader and the footprint writer (neither has any cloud execution path, live-verified 2026-09-11), factory job pattern, run record with input hashes, code-level laptop refusal, TCAD file-name shape as a per-county source declaration. Ruled 2026-09-12: no break-glass. | `gcloud run jobs list` shows both jobs; staging dry runs leave records; a laptop `--apply` is refused by code. | none; unblocks P-157, P-158 |
| 12 | P-170 | TRAFFIC LEASE | doc_repo | One traffic shift at a time per service: AGENT_CONTRACT §3 clause, `_catalog/leases/`, hook `traffic-lease-gate` verified by violation through the harness; bypass named (lanes outside a doc_repo session). | The hook refuses a shift without a lease, through the harness. | none |
| 13 | P-171 | PROVENANCE | hauska-engine | Name the writer of the 2026-09-07 building-footprint atoms (no execution log): Cloud Logging both projects, `atoms_writer_lease_v2`, factory `runs`; break-glass row after the fact if it was a laptop. | The close carries a run record or a named writer plus the lease rows for the scope. | none |
| 14 | P-172 | FIND BOX | hauska-map, legacy-design-tools | F16, P-27: the address form resolves from the situs index (split-situs rows composed), the id form directly, the geocoder only as a labelled fallback. | Find box resolves `414 SPILLER LN` to `48453:113408` (observed); the search route returns the id (machine). | none |
| 15 | P-173 | LEASE HISTORY | hauska-engine | The atoms writer leases are delete-on-release mutexes with no history (P-171 could not read the 2026-09-07 run's lease); an append-only history table written by the same take and release functions, read by the audit script. | A staging writer run through `hauska-engine-atoms-writer` leaves a history row that survives release; the audit script returns it by run id. | none |

Lane detail that a mission must carry, per row, is in `_catalog/dispatch_missions/mission_p15x_*.md`
as each is written. A mission not yet written is not a dispatchable row.

## 5. What this program does not do

- It does not run the boundary/envelope atom program as a separate program any more. Its
  unstarted items (succession, Travis join key, preflight, rebake trigger, backfill) fold into
  steps 4, 6 and 7 of section 0; its finished items (shared reader reconciliation, Lockhart
  join) stand.
- It does not decide who may see the drawing. F2 is a product ruling the operator owes if free
  users should see the polygon. Until ruled, the gate stays.
- It does not fix ETJ. Both Travis parcels carry `etjStatus: unresolved`. Trigger: P-156 reaches
  a city that publishes an ETJ layer.
- It does not fix the Travis situs join county-wide. Trigger: P-151 finds more than one county
  with the split situs shape.

## 6. Roles and the swap protocol

The operator's ruling 2026-09-11, recorded in the topology decision and ACTIVE from the
operator's go the same evening (first dispatch-planner dispatch: OPS-23 wave 1, rows P-155,
P-157, P-158, P-159, P-167). The dispatch-planner seat is `dispatch-planner` in
`_catalog/seat_register.json`.

**Overseer** (the integration seat, `P:/doc_repo`, branch `main`). Owns this document, the
rulings, the probe instrument, and every commit to doc_repo. Reads only three things: lane
close artifacts, probe output, and checkpoints. Never reads a product working tree to verify a
claim; runs the instrument instead. Rules when a lane asks. Writes the checkpoint if the
dispatch planner cannot.

**Dispatch planner** (a lane-planner-class seat, registered in `_catalog/seat_register.json`
before it starts). Compiles dispatches from missions, hand-carries them, reads closes, runs
CP1/CP2 adversarial checkpoints on lane output per AGENT_CONTRACT section 1, and writes a
checkpoint file every three closes or when it catches itself making a claim about a repo it has
not opened. It holds no state the plan and the missions do not hold. It does not commit to
doc_repo; it hands artifacts to the overseer.

**Lanes** (one-off executors, one per row, fan at most one level deep). Do the work from the
compiled dispatch. Close with the AGENT_CONTRACT section 6 artifact plus the probe artifact R-4
requires. Never commit to doc_repo.

**Swap protocol.** A dispatch planner is replaced, not extended. The checkpoint is the handoff:

```
_inbox/<YYYY-MM-DD>_ops23_checkpoint_<n>.md
  snapshot:        doc_repo HEAD, and origin/main of every repo touched since the last checkpoint
  lane board:      output of node scripts/ops23-lane-status.mjs, pasted verbatim
  probe:           output of node scripts/surface-probe.mjs, pasted verbatim, with its run id
  rulings taken:   since the last checkpoint, each with its decision-record path
  errors:          every planner claim a lane or the probe contradicted, in the section 10 shape
  next three:      the next three concrete actions, each naming a row and a file
```

The successor's first three commands are: read this document, run both instruments, read the
latest checkpoint. It does not read the predecessor's conversation. If the checkpoint and the
instruments disagree, the instruments win and the disagreement is the first entry in the new
planner's error log.

**Why the middle layer is worth its joint.** Every expensive error since August was a claim
verified on one side of a seam and stated generally, and the error rate rose with context depth
(ENFORCEMENT.md, "the instrument that produced a claim is part of the claim"). A stateless
dispatch planner that can be swapped at a checkpoint keeps the executor layer, which has been
the healthy part, and bounds the degrading part. The condition is that the plan, the missions,
and the checkpoint carry everything; a dispatch planner that accumulates knowledge the files do
not hold is the old planner with a new name.

## 7. The probe set

Fixed parcels. A lane may add one; it may not remove one.

| Parcel | Why it is here |
|---|---|
| `48021:34049` | 1109 Pecan St, Bastrop. Corner lot, improved 1906, five-way setback disagreement, PDF double figure. |
| `48021:33223` | P-91 gold parcel; MCP refuse baseline from Ruling B. |
| `48453:113408` | 414 Spiller Ln, West Lake Hills. Split situs, unplaceable card, unstaged city. |
| `48453:474034` | 2601 Sterling Panorama Ct. Unincorporated, Lake Pointe MUD, feasibility 154 s. |
| `48453:367134` | 5833 Taylor Draper Cv, Austin SF-2. Declared-complete city, warm-verify decline. |
| one each: 48055, 48209, 48309, 48491 | Chosen by P-160 from `parcel_record` with different dispositions on `zoningDistrict` and `setbackFrontFt`; recorded in the instrument, not here. |

Calls, per parcel: `GET /api/spine/property-atoms/<id>/facets`; `POST
.../place/buildable-envelope` by composed address and by point; `POST .../map-data/gis-layer`
parcels bbox around the record point; cortex `GET /api/brokerage/v1/place/node/<id>` with the
service key; `export_instrument feasibility` status. `get_smart_site` stays an operator-run
check until the instrument can authenticate to the connector; the operator pastes its output
into the close.

## 8. Instruments

```
node scripts/surface-probe.mjs                    the predicate (P-160; refuses with exit 2 without creds for the cortex leg)
node scripts/surface-probe.mjs --self-test        both directions, known-bad fixture, not-vacuous check
node scripts/ops23-lane-status.mjs                lane board: worktree, registered, branch, ahead, artifacts
node scripts/dispatch.mjs --lane <ID> --plan-row <P-15x|P-16x> --mission-file <f>
```

**Preambles, since 2026-09-11 (P-168, A-131).** The compiler attaches
`_catalog/program_preambles/OPS-23.md` to any row 151 to 167 by itself (registry `programs`); no
flag. It refuses to compile an OPS-23 row if that file is missing. The shared CANON-PREAMBLE is
ten fleet-wide bullets; Dashboards law lives in `OPS-17.md`, Factory status in `OPS-19.md`, and
`generate-combined.mjs` refuses to regenerate `_STATE.md` while a shared bullet names a plan row
(`scripts/enforcement/standing-decisions-scope.mjs`). A lane reading a dispatch with G-rows in its
preamble is reading a stale compile; recompile.

The close gate: `.claude/hooks/probe-close-gate.mjs` (rules and self-test in
`scripts/enforcement/probe-close-gate.mjs`) refuses a doc_repo commit whose staged set carries an
OPS-23 close with no passing probe citation. **Registered 2026-09-11 mid-session; it did not fire
on its first live trigger (commit `1e174bcc` went through) because the harness snapshots hooks at
session start. Verified by direct invocation only. The first OPS-23 close commit of the next
session is its live verification: remove the probe field, expect refusal; restore it, expect
acceptance. Until that is observed, do not call this control live.**

Probe artifacts to date: `_inbox/2026-09-11_175938_surface_probe.json`,
`_inbox/2026-09-11_180241_surface_probe.json`, `_inbox/2026-09-11_180559_surface_probe.json`
(the 2026-09-11 baseline: PASS 0, FAIL 0, UNMEASURED 9; the observed legs for that day are in
the fixture manifest, and with them folded in the fixture evaluation reads FAIL 3).

## 9. Blast radius of Ruling B, enumerated at origin/main

Files carrying `atom_path_pending` or `sheetEnvelopeIsAtomPathPending`, non-test:

```
hauska-map     apps/property-explorer/api/_lib/pe-property-atoms.ts
               apps/property-explorer/src/lib/baked-facets.ts
               apps/property-explorer/src/lib/buildable-display-vocab.ts
               apps/property-explorer/src/lib/fact-sheet-resolver.ts
               apps/property-explorer/src/lib/live-envelope-augment.ts
LDT            artifacts/api-server/src/lib/buildableEnvelope/derive.ts
               artifacts/api-server/src/lib/nodeFacetBakeTier1.ts
               artifacts/api-server/src/lib/nodeFacetBakeTier2.ts
               artifacts/api-server/src/lib/nodeFacetTier1Assemble.ts
               artifacts/api-server/src/lib/parcelDrawFromReads.ts
               artifacts/api-server/src/lib/parcelDrawStub.ts
               artifacts/api-server/src/nodeFacetBakeTier1Cli.ts
               artifacts/api-server/src/routes/brokeragePlaceBuildableEnvelope.ts
               artifacts/smartsite-mcp/src/mcp-app.ts
               artifacts/smartsite-mcp/src/tool-honesty.ts
               artifacts/smartsite-mcp/src/vocabulary.ts
```

Plus the engine's `buildable-display-vocab.ts` parity lock, which fails if the hauska-map copy
changes shape. P-153's mission carries this list; the lane reads each before changing any.

## 10. Planner error log

Seeded from OPS-21's eleven, all of one shape: a claim verified on one side of a seam and
stated generally. Entries added here by whoever catches them, including the overseer's own.

| # | Date | Claim | Who caught it | Shape |
|---|---|---|---|---|
| 1 | 2026-09-11 | OPS-21 close: "setbacks serving in production, five counties. Go open the app." True at cortex and MCP; false on smartsite.cloud for every atom-carrying parcel. | integration seat, live probe | seam: cortex vs browser |
| 2 | 2026-09-11 | 2026-09-10 diagnosis: "23 of 69 cities carry a zoning endpoint", read from the roster. The factory declaration lists cities the roster marks NOT-FOUND. | integration seat, file read | stale instrument quoted as current |
| 3 | 2026-09-11 | App copy: "engine timed out, usually a cold start". Engine warm, completes in 85 to 154 s, client aborts at 55 s. | integration seat, Cloud Run logs | wrong mechanism named as fact |

## 11. Deferred, each with a trigger

| Item | Trigger |
|---|---|
| L4 divergence tripwire | owed until P-164 reports zero gated cells with a value and no atom; then retired as unnecessary |
| Verified-absence atoms under absent-verified cells | ruling owed before P-164 touches absence cells (ADR-031 open decision) |
| Free-tier drawing ruling (F2) | operator |
| ETJ rail | P-156 reaches a city with an ETJ layer |
| Situs per-county JOIN | P-151 finds a second split-situs county |
| Facets endpoint intermittent hang (F11) | P-160 measures it on three consecutive runs |
| Elgin layer re-acquisition (held in factory declaration) | P-156 queue reaches Elgin's Travis sliver |
