---
id: 2026-08-30_smartsite_mcp_app_v2_WDLL
title: WDLL — Smart Site MCP App v2. The finished companion: board, drawing you can read, facts with citations, reports, honest gaps
date: 2026-08-30
status: EXECUTING (operator go 2026-08-30 "commit then spawn sub agents to execute and manage this build through deploy"). Forks taken on the planner's recommendation and reversible by amendment: 3.1 narrow report view yes; 3.2 hover yes; 3.3 zoning on the drawing yes; 3.4 flood-study forms defined, graded when the data lane lands. Not taken: 3.5 Free tier (pricing law; gate unchanged, upgrade sentence painted) and 3.6 exports (needs the substrate seat's Hauska MCP export endpoint and key, not a config toggle; R2 deferred by name). H2 measured 2026-08-30: largest node body 5,549 chars, average 4,711; a 50-id node batch would be about 235,000 chars against Claude's roughly 150,000 threshold, so node-depth arrays cap at 25 (stub stays 50). BUILT AND SERVING 2026-08-30 on smartsite-mcp p558 (00065-siv) and cortex-api p543 (00668-cos); items built and not built are named in the Amendments section; grades fill at the W1 walk.
applies_to: legacy-design-tools (artifacts/smartsite-mcp, cortex-api), hauska-map (assets only)
plan_row: P-91 (carry), P-92 (opens), new rows named in section 6
supersedes: _inbox/2026-08-28_smartsite_mcp_app_WDLL.md items 12, 13, 14, 16, 21, 22, 25, 26 (v1 stays the record of what shipped; v2 defines finished)
fixtures: _inbox/2026-08-30_p91_fixture_set_bastrop.md
serving_at_draft: smartsite-mcp p557 (00063-rej), cortex-api p542 (00666-cuf)
serving_built: smartsite-mcp p558 (smartsite-mcp-00065-siv, digest sha256:1d119501...) and cortex-api p543 (cortex-api-00668-cos, digest sha256:679683fd...), both at 100% by field name 2026-08-30; records _inbox/2026-08-30_p91_p558_deploy.md and _inbox/2026-08-30_p91_p543_deploy.md
decisions_carried: _decisions/2026-08-29_p91_open_stays_a_turn.md; _decisions/2026-08-28_smartsite_mcp_app_screen_save_decouple.md; _decisions/2026-08-28_p91_o1_envelope_xray_must_refuse.md; _decisions/2026-08-30_honesty_contract_is_silence_legible.md
owner: property seat (product code and cortex); planner owns this card, the walks, and deploys
---

# WDLL: Smart Site MCP App v2

Date: 2026-08-30  Status: draft  Operator approval: pending

v1 shipped a board and a parcel panel and proved the host model. This card says what finished means for the companion, with the data lane in flight: every behaviour a user can reach is either finished, or paints an honest gap that names what is coming, and nothing in between.

## Done looks like

A Studio user pastes any number of addresses into Claude. A board opens with a real rail state on every resolved row. They open a parcel and see the lot drawn from record: property lines they can read by hovering (length, bearing, what is on the other side), the zoning district printed on the drawing with its citation one click away, flood shown on the drawing as a tint with its zone named, the structure of record and its footprint where measured, and the envelope where ruled, with every fact carrying a source and an as-of date. They can save it with a status, add a neighbor by pointing at a shared line, reopen yesterday's screen, run the report and read it in the panel with its citations, export the instruments their tier allows, and ask Claude anything about it in the transcript, because every opened parcel is already in Claude's context. Where the record has nothing, the panel says exactly that, in the same five-state language as everything else. Nothing the panel shows is absent from the tool result Claude received.

## Invariants (carried, plus two)

I1 to I6 from v1 stand. I7: every number on the drawing (a length, a bearing, a zone label) is read from the tool result; the panel never measures, computes, or interpolates. I8: an interaction that only reads what is already on screen (hover, sort, filter, toggle a layer) is local; anything that fetches, writes, or asks Claude is a turn or an app-initiated call of a catalog tool. The catalog stays 13 unless a named connector amendment adds a tool.

## 1. Behaviour inventory, graded on p557 / p542 (2026-08-30)

Grades: MET (observed live), PARTIAL (built, half observed), GAP (honest absence painted, data or build owed), MISSING (not built), OPEN (needs a ruling).

### Board

| Behaviour | Today | v2 item |
| --- | --- | --- |
| Paste N addresses, board paints with rails | MET (rails at first paint, p556) | carry |
| Batch stub result paints as a board | MET (p556 flat rails) | carry |
| Unresolved row keeps the typed string, no Open | MET | carry |
| Ambiguous row offers candidates | MISSING (candidates in JSON, not painted) | B1 |
| Duplicate resolved node refuses the whole screen | MET but wrong shape (listing pastes hit Cv/Cove) | B2 |
| Reopen a screen from a bare `list_screens` | MISSING (paints "No screen yet") | B3 |
| Sort by column | MET (local) | carry |
| Click Open: board says Sent to chat, then a new panel under the tool row | MET (O2 observed) | carry |
| Dead Open (no reply) says Open did not reach me | MET | carry |
| Miss Open paints Not on file in {county} under the tool row | PARTIAL (wire verified; panel sentence not yet observed live) | A1 |
| Free user Open paints the upgrade sentence | PARTIAL (built; tier ruling open) | OPEN, section 3.5 |

### Drawing

| Behaviour | Today | v2 item |
| --- | --- | --- |
| Ring from `draw.ring`, edges as a list with ft and bearing | MET | carry |
| Hover a property line: length, bearing, adjacency, neighbor or road | MISSING (promised before the app existed) | D1 |
| Click a property line with a neighbor: that neighbor's Open | MISSING | D2 |
| Zoning district printed on the drawing, citation one click away | MISSING (district is in `attrs.zoning`; panel prints it as a row, not on the drawing) | D3 |
| Flood as a tint on the ring with the zone named | PARTIAL (overlay row says `tint-ring`; the SVG does not tint) | D4 |
| Footprint hatch where measured | GAP (`geom: none` on every parcel) | data lane; D5 paints when present |
| Envelope where ruled | GAP (refused `atom_path_pending`) | data lane after O2; D6 paints when present |
| Parcel with no ring | MET (Parcel boundary unmeasured) | carry |
| North arrow, scale bar, units | MISSING (frame says ft, true north; nothing drawn) | D7 |
| Drawing never invents a segment, a label, or a number | MET (I1 held on gold and on 26 parcels) | carry, instrument |

### Facts

| Behaviour | Today | v2 item |
| --- | --- | --- |
| Zoning district, jurisdiction, citation link | PARTIAL (row; citation URL not linked) | F1 |
| Flood zone, subtype, SFHA, citation | PARTIAL (row; `citationsDegraded`, no URL; prose summary with an em dash upstream) | F2 plus data lane (D5 in the triage) |
| Land use | GAP (absent everywhere) | data lane; F3 paints when present |
| Structure of record (year) | MET (label) | carry; F4 the Driftwood year conflict is a data check |
| Pipeline, special district, well | MET as rows | F5 the `absent-verified` provenance rule (triage D6) |
| Every fact carries as-of and source | PARTIAL (as-of on sections; source on some) | F6 |
| Drainage | GAP (rail `unread`, no section) | data lane; F7 the section exists at node depth with `unread` |
| Flood studies (LOMR, city drainage, H and H) | MISSING (no facet, no intake) | data lane; F8 defines the panel form |

### Actions

| Behaviour | Today | v2 item |
| --- | --- | --- |
| Save property | MET (turn) | carry |
| Save with a status from the panel | MISSING | C1 |
| Add a neighbor to the screen from the panel | MISSING (tool works; no control) | C2 (pairs with D2) |
| Find listing history (transcript only) | MET | carry, I5 |
| Run the report and read it in the panel | OPEN (v1 said no R1 in the frame; operator now wants reporting through the app) | section 3.1 |
| Export an instrument (site plan, terrain, dossier) | GAP (`not_ready`: Hauska MCP proxy not configured in prod) | R2 |
| Ask Claude about this parcel | dropped by operator (Claude already holds it) | none |
| Request records / check request | blocked on P-85 item 4 | carry |

### Identity and honesty

| Behaviour | Today | v2 item |
| --- | --- | --- |
| Connector card shows the Smart Site mark on the ink tile | MET on the site; reconnect refreshes the card | carry |
| Descriptions never promise a map, listings, owner data | MET (p556 rewrite) | carry |
| `ask_the_map` | blocked (`not_ready`) until its path is wired | R3 |
| Result not readable / degraded bodies | PARTIAL (`unreadable` state exists; `status: degraded` bodies still paint the empty copy) | H1 |
| Boot strip on every panel | MET (instrument) | carry |

## 2. Acceptance items

Each item names its check and what would fail it. Grades fill at the walk.

A1. **Miss sentence observed.** On the fixture miss (`48021:900099`), after Send the panel under the tool row reads `Not on file in Bastrop` with the id; the board above reads `Sent to chat`. | check: Connect walk step; served-script fixture already green | grade: [ ]

B1. **Ambiguous rows offer candidates.** A row with `candidates` paints each candidate with situs and county and a "Use this" control that drafts an `add_to_screen` turn; nothing auto-picks; the original row stays as typed. | check: fixture paste that yields an ambiguous row; the draft names the chosen id; the row is unchanged after | grade: [ ]

B2. **Duplicate is a row outcome, not a screen refuse.** Two queries that resolve to one parcel produce one resolved row and one row marked `duplicate` naming the sibling; nothing else is lost. | check: `111 Rainmaker Cv` plus `111 Rainmaker Cove` create a two-row screen; cortex route test | grade: [ ]

B3. **Reopen picker.** A bare `list_screens` paints the screens with name, row count, updated time, and one Open per screen that drafts `list_screens(screenId)`. | check: served fixture on `{ screens: [...] }`; Connect reopen in two turns | grade: [ ]

D1. **Hover reads a property line.** Hovering an edge of the ring highlights it and shows its length in feet, its bearing, its adjacency (front, side, rear, alley, ROW, neighbor), and the neighbor's node id or the road's node id, all read from `draw.edges[i]`. Touch gets the same on tap. No value is computed in the panel. | check: served-script test that hovers each edge of gold and reads the tooltip against the edge object; a fixture with an edge missing `ft` shows no length, never a computed one | grade: [ ]

D2. **A shared line is a door.** An edge with `neighbor` set shows that neighbor's label on hover and an Open control that drafts the neighbor's Open turn; an edge on a ROW does not (O3 stays until `48021:34121` is ruled). | check: gold edge 1 opens 34169; gold edge 2 (ROW, neighbor 34121) shows no control | grade: [ ]

D3. **Zoning on the drawing.** The district from `attrs.zoning.v` is printed inside the ring with the jurisdiction beneath it; clicking it opens the zoning citation in a new tab (`ui/open-link`, the host capability observed on the boot strip). Districts tint the ring stroke by family (residential, commercial, mixed, public) using Stone tokens only; the tint never encodes a number. | check: gold prints SF-1 / bastrop_city_tx; 34121 prints GC; a parcel with `zoning.state` not present prints nothing and tints nothing | grade: [ ]

D4. **Flood on the drawing.** The flood overlay with `draw: tint-ring` tints the ring interior; SFHA parcels get the heavier tint and the zone is printed (A, AE floodway); non-SFHA shaded X gets the light tint; `AREA OF MINIMAL` gets none and says so in the row. | check: 32243 (A) heavy, 49295 (AE floodway) heavy with the word floodway, 34137 light, 33223 none | grade: [ ]

D5. **Footprint paints when measured.** When `overlays[footprint].geom` carries a polygon, it hatches inside the ring; until then the row reads unmeasured with the year. | check: served fixture with a synthetic footprint polygon paints the hatch; live parcels paint none | grade: [ ] (data lane)

D6. **Envelope paints when ruled.** When the envelope overlay is `present` with geometry, it draws as an inner polygon; until then `Buildable envelope not computed`, reason in human words. Setback distances never print (O2). | check: fixture; live refused | grade: [ ] (data lane, O2)

D7. **Frame cues.** A north arrow, a scale bar in feet derived from `frame.units` and the ring extent, and `gis-approximate` printed as a quality note. | check: gold drawing shows all three; a frame without `units` shows no scale bar | grade: [ ]

F1. **Citations are links.** Every section citation is rendered as a link that opens via `ui/open-link`; a section with `citationsDegraded` shows the degraded note instead of a link. | check: gold zoning link opens the ArcGIS layer; flood shows degraded until the FEMA citation is restored | grade: [ ]

F2. **Flood facts honest.** Zone, subtype, SFHA, base flood elevation (or `none on record`), source vintage, and evaluated-at; the prose summary is not shown while `citationsDegraded` is true. | check: 49295 shows AE, floodway, SFHA, vintage NFHL_48_20260101; no prose while degraded | grade: [ ]

F3. **Land use when present.** Section paints with disposition and citation; absent paints absent. | check: fixture | grade: [ ] (data lane)

F4. **Structure year is a record with a source.** Year prints with `CAD roll` as source and the roll vintage when the wire carries it; the Driftwood conflict (2021 versus 2022) is resolved by the data lane before year is presented as record-grade. | check: fixture; triage | grade: [ ] (data lane)

F5. **Verified means verified.** `absent-verified` paints only with known provenance and vintage; otherwise the row paints `unknown` and says why. Pipeline radius prints in feet. | check: pipeline row on gold paints unknown until cortex carries provenance; 500 ft | grade: [ ] (cortex, triage D6)

F6. **As-of and source on every fact.** Each row shows its as-of and source adapter; a fact without both cannot paint as present. | check: served fixture with a present fact lacking as-of fails closed to unknown | grade: [ ]

F7. **Drainage is a section.** Node depth carries a drainage section with `unread` and a reason until the facet exists; the rail and the section agree. | check: stub and node agree per field on one bake (triage D2 and D3) | grade: [ ] (cortex)

F8. **Flood studies as facets.** A LOMR, a city drainage study, or an H and H study attached to a parcel paints as a flood-study row with document type, date, issuing body, and a link, bound to the parcel or to a polygon; never as free text. | check: defined here; graded when the data lane lands the facet | grade: [ ] (data lane; form defined now)

C1. **Save with a status.** The Save control offers New, Watching, Chasing, Passed and drafts one `save_property(id, status)` turn; no saved-state is read (I6). | check: draft names the status; a second click is a plain upsert | grade: [ ]

C2. **Add neighbor from the panel.** Pairs with D2; the control drafts `add_to_screen(screenId, neighbor, walk)`; `screenId` travels through Open. | check: from the A13 board, open gold, add 34169 by its shared line | grade: [ ]

R1. **Report in the panel.** See fork 3.1. If ruled in: the report view lists every section with disposition, as-of, source and citation link, in the same five-state language, and never a number the section does not carry. | check: fixture; gold and 49295 | grade: [ ]

R2. **Exports through the app.** `export_instrument` returns a real artifact or a labelled degraded; the panel offers the kinds the tier allows and shows the returned link. | check: Hauska MCP proxy configured in prod; gold site plan export returns a link | grade: [ ] (config plus P-87 item 17)

R3. **`ask_the_map` wired.** Subject built from the bake, `.strict()` schema, PE meter on the service path; until then `not_ready`. | check: legal call returns 200 with citations | grade: [ ]

H1. **Every body has a sentence.** `status: degraded` and `status: refused` tool bodies paint a declared line, never the empty copy. | check: served fixture per body | grade: [ ]

P1. **Point at an absence and get the why.** Clicking an overlay or a rail that is `unknown` or `refused` drafts a turn that carries the parcel id, the field, the state, the producer, and the decline code, so Claude answers "why don't you know this" from the record (scope section 11: "a place to ask why don't you know this and get an answer that holds up"). No panel text is invented; the draft quotes the refusal object. | check: gold envelope click drafts a turn naming `baked-envelope-facet` and `atom_path_pending`; a `present` cell has no such control | grade: [ ]

B4. **Cross-county grouping.** A screen that spans counties groups rows by county with the county named; the miss sentence and the rail states stay per parcel. | check: a Bastrop plus Hays paste; two groups; no aggregate | grade: [ ]

B5. **Default sort by completeness ascending.** The board opens with the least-known rows first (count of `present` per row), local, with the sort control visible; nothing is aggregated. | check: fixture with mixed rails; first row has the fewest present | grade: [ ]

N1. **Coverage seam across neighbors.** Opening a neighbor through a shared line paints its panel beneath the first; any rail or overlay whose state differs from the parcel it was opened from is marked as a seam in the neighbor's panel (a glyph, no number). | check: 34137 to 34169: identical rails, no seam; 34169 to 34177: zoning SF-1 to MU shows a seam on zoning | grade: [ ]

D8. **Drainage overlay on the drawing (scope 3.5, A8).** When `draw.overlays[drainage].geom` carries catchment boundary, flow lines, and ponding polygons in the ring's frame, they draw in the same frame; empty arrays render as "no concentrated flow path traced", never as blank; a raster gradient loads only from a declared `connectDomains` origin, never inline; `provenance: degraded` (regional rainfall default) prints as a note. No tool runs drainage from the panel; the producer wire is the data lane's and a run tool would be a 14th tool. | check: served fixture with synthetic geometry; live paints the unread section (F7) | grade: [ ] (data lane wire)

F9. **Zoning codeRefs (scope 3.7, A10).** The zoning attr carries `codeRefs` with `refBasis: body-denorm` until the DIDs land in `atom_links`, then `atom-link` with no schema change. Clicking the district on the drawing shows the establishing code section id labelled as a denormalized reference, never as a traversed edge. Hop-1 neighbors keep `basis: parcel-bind`, `edge: null`, until walked. | check: gold shows `14-02-003` labelled denormalized; no `:sd:` suffix presented as district membership | grade: [ ] (cortex serialization plus panel)

H2. **Payload ceiling measured (scope O6).** One measurement of the largest single `get_smart_site depth node` body and of a fifty-id stub batch, against Anthropic's documented threshold (roughly 150,000 characters, past which Claude writes the result to a file and the widget receives a pointer). The number gates D8 rasters and any future GLB. | check: the two sizes recorded in the walk record with the serving revision | grade: [ ]

X1. **Reciprocity sweep (scope 10, v1 item 23).** Every shared boundary edge is two assertions that must agree: same length, reciprocal bearing, neighbor pointing back. Run as a county sweep from the store, producing a defect map; no new ingest. An instrument, not a panel feature; the panel consumes it only as a seam mark (N1) once it exists. | check: one county artifact; gold edge 1 versus 34169 edge 4 agree | grade: [ ] (data lane instrument)

X2. **Edge metadata carries a disposition.** The no-invention contract covers sections today and does not cover `draw.edges[]`. Neighbor ids and adjacency cannot serialize as flat fact with an implicit present. Each edge (or each of neighbor and adjacency on the edge) carries an explicit disposition from the same five-state vocabulary. A reciprocity miss (X1), an unverified ray-hit (O3), or an unconfirmed label maps to unknown or refused with `agentGuidance`, never to implicit present. The panel hover and the Claude transcript read the same field. This item gates marketing the honesty differentiator (`_decisions/2026-08-30_honesty_contract_is_silence_legible.md`). | check: a fixture whose neighbor fails X1 or O3 cannot emit that neighbor as implicit present; gold shared-boundary edges that pass X1 may stay present; a Connect walk on a known-wrong label shows the model hedging or refusing the way it already refuses setbacks | grade: [ ] (cortex serialize plus data lane; P-92)

W1. **The walk.** The fixture set in `_inbox/2026-08-30_p91_fixture_set_bastrop.md` walked end to end on Connect: paste the Higgins block, open 108 Higgins, hover every edge, open a neighbor through a shared line, open 145 Hasler Shores and read the floodway tint, open 1408 Chestnut and read the no-ring flood case, save one with Watching, reopen the screen next chat, run the report on gold. | check: every item above observed; screenshots filed; boot strip recorded | grade: [ ]

## 3. Forks for the operator (short)

3.1 **Report in the panel.** v1 item 14 and the original scope (section 7) said no R1 renderer in the frame, with a reason worth keeping in view: Claude writes better prose than any renderer, and rendering the report twice means maintaining it twice. The operator now wants reporting through the app. The narrow version that honours both: a report view in the panel is the brief's sections with disposition, as-of, source and citation link, in the five-state language, and nothing composed; the prose stays Claude's in the transcript. Recommend: yes, that narrow version. Ruling: ______

3.2 **Hover content.** Length in feet, bearing, adjacency, and the neighbor or road id, exactly as the edge object carries them. Recommend: yes, nothing more. Ruling: ______

3.3 **Zoning on the drawing.** District printed in the ring plus a stroke tint by family, citation on click. A tint by district is a category, not a number, so I2 holds. Recommend: yes. Ruling: ______

3.4 **Flood studies.** Panel form defined now (F8); the facet and its intake are the data lane's. Which document types first: LOMR, city drainage, H and H. Recommend: define all three forms now, grade when the lane lands. Ruling: ______

3.5 **Free tier on MCP.** Today nothing opens for Free. Recommend: stub Free, node paid, upgrade sentence painted. Ruling: ______

3.6 **Exports.** Configure the Hauska MCP proxy in prod so `export_instrument` stops returning `not_ready`, or hold exports for a later card. Recommend: configure it in this card; it is config plus one probe. Ruling: ______

## 4. What this card does not do

No map tiles, no basemap, no aerial. No listing feed. No web content in the panel. No 14th tool without an amendment. No setback distances until O2. No invented geometry: a parcel without a ring stays a sentence. No re-warming from the app: the warm cohort is the data lane's.

## 5. Instruments

The served-script suite (`tests/mcp-app-served.test.ts`) grows one fixture per item above; each new sentence and each drawing feature is observed failing before it passes. `_inbox/2026-08-30_p91_served_completeness_probe.mjs` re-measures the fixture set after every cortex cut. The Connect walk W1 is the customer-done gate and is the operator's.

## 6. Plan rows

P-91 carries A1, B3, B5, D1 to D4, D7, F1, F2, F5, F6, C1, C2, P1, H1, H2 (panel and MCP work on the serving pair). P-92 opens with B1, B2, B4, N1, F7, F9, R1, R3, X2 (cortex plus panel; X2 is the serialize half of the honesty contract). Data lane rows own D5, D6, D8, F3, F4, F8, X1 and the warm cohort. R2 is P-87 item 17 config. Later intake (Chrome, Gmail, file) is not carded here.

## 7. Reconciliation with the 2026-08-28 v2 scope

The v2 scope lived in three places: the P-92 section of the v1 card (items 21 to 24 and the later-intake list), `_decisions/2026-08-28_smartsite_mcp_app_v1_v2.md` (superseded, but it names v2 as named screens, status CRM, drainage overlay, hop-1 codeRefs), and the operator's scope file `P:/tmp/files (12)/2026-08-28_smartsite_mcp_app_v1_scope.md`. Every line of those, and where it lands here.

| Scope line | Status here |
| --- | --- |
| Named screens, status CRM (cut decision) | Shipped under A-046 (v1 items 17 to 20, 28 to 30). Carried. |
| Drainage overlay on `draw` (v1 item 21, scope 3.5, A8) | D8, form defined; wire is the data lane's. |
| Zoning codeRefs (v1 item 22, scope 3.7, A10) | F9, added. D3 (district on the drawing plus citation) is a different thing and stays. |
| County reciprocity sweep (v1 item 23, scope 10) | X1, added as a data-lane instrument feeding N1. X2 (2026-08-30) is the serialize rule X1 feeds: a miss cannot ship as implicit present. |
| Selection language stays out (v1 item 24, scope 7) | Section 4: out until a Project node exists. Unchanged. |
| Later intake: Claude for Chrome, Gmail listing alerts, bulk file upload (v1 P-92 text) | Not in this card. Each needs its own connector and is its own card; paste stays the only intake here. Named so the omission is deliberate. |
| Three levels: board, parcel, neighborhood (scope 4.1) | Board and parcel are sections 1 and 2; neighborhood is D2 plus N1 (added) plus W1's block walk. |
| Board rules (scope 4.2): no aggregates; unresolved rows show the typed string; cross-county grouping; default sort by completeness ascending | I2 and carried; carried; B4 added; B5 added. |
| Parcel panel (scope 4.3): ring assembled client side, no unit conversion or trigonometry; road-facing edges marked per edge; unknown and refused overlays clickable and push a question into the conversation; refusal heavier than flood; unknown overlays carry an in-region label | I7; D1; P1 added (the product's core promise per scope 11); carried from v1 legend and chrome; carried. |
| Bridge usage (scope 4.4): `ui/message`; `ui/update-model-context`; `ui/open-link`; `callServerTool` for parcel reads, walks, drainage runs | `ui/message` is Open, listing, P1, C1, C2; `ui/update-model-context` is reported dropped by Claude on both surfaces and is not relied on; `ui/open-link` is D3 and F1; `callServerTool` for Open is superseded by the 2026-08-29 ruling (Open stays a turn so it lands in Claude's context), remains available for read-only refreshes (B3 style) and is observed on the boot strip (`serverTools`). |
| Turn versus local (scope 6) | I8. Opening a parcel appends a panel below (the host does this); the board stays above. Unchanged. |
| Out of scope for v1 (scope 7): R1 in the frame; 3D, GLB, IFC, terrain inline; records as a workflow; selection language | Fork 3.1 carries the scope's own reason; exports stay downloads (R2); records stay `not_ready` until P-85; selection stays out. |
| Prerequisites (scope 8): org tier; annotations; three dead tools; `ask_the_map` selector; citation hygiene; legal pages; item 21 | Annotations shipped (v1 item 1); `export_instrument` still `not_ready` for want of `HAUSKA_MCP_BASE_URL` (fork 3.6, R2); records pair blocked on P-85; `ask_the_map` blocked with the leak closed (R3); citation hygiene is F1, F2, F5 plus the data lane; legal pages customer-done; item 21 (v1 item 11) still owed on the connector card. |
| Open items (scope 9): O1 42 percent; O2 side_corner; O3 cross-ROW; O4 aborts; O5 fixture geometry; O6 payload ceiling | O1 ruled B; O2 still open and gates D6; O3 gates D2's ROW edges; O4 addressed by the situs budget work; O5 measured in the fixture set (26 of 28 in the warm cohort draw, the five subdivision parcels do not); O6 is H2, added. |
| What v1 is (scope 11): drop a list, get a board of known and unknown; open a parcel drawn with gaps marked; walk to the neighbor and see the coverage seam; point at an absence and get the why with producer and decline code | Board and drawing carried; seam is N1; the why is P1. |

## Amendments

- 2026-08-30 (execution, lanes S6 to S10). Built on `feat/p91-v2-panel` (MCP server and iframe) and `feat/p91-v2-cortex` (cortex, PR #553 merged `d8dfb319`, canary p543): D1, D2, D3, D4, D7, F1, F2, F5, F6, P1, C1, C2, R1 (narrow), B1, B2 (both halves), B3, B4, B5, F7, H1, H2 (cap 25). Not built here, by name: D5, D6, D8, F3, F4, F8, X1 (data lane); F9, N1, R3 (P-92); R2 (substrate seat endpoint); 3.5 Free tier (held). Regression found by S8's fixtures and fixed in p558: since p555, an unresolved screen row (`parcelNodeId: null`, `id: <uuid>`) took its own row id as a node and painted an Open button carrying a uuid; the p554 inline parser never did this, the exported twin did, and no walk after p555 opened a created screen with an unresolved row. Checkpoints `_inbox/2026-08-30_p91_v2_build_cp.md`. Walk prompt `_inbox/2026-08-30_p91_p558_connect_walk_prompt.md`. Grades fill at the walk.
- 2026-08-30 (honesty contract scope). Operator restated the 2026-08-28 QA-battery design argument: the claim is silence made legible, not "it will not degrade." Added X2 (edge metadata disposition) on P-92. Decision `_decisions/2026-08-30_honesty_contract_is_silence_legible.md`. Reason: the no-invention contract covers sections and does not cover neighbor or adjacency; operator observation this walk that five of six labels on verified shared boundaries were wrong, filed as operator-attributed pending X1. Do not market the honesty differentiator until X2 is customer-done.
