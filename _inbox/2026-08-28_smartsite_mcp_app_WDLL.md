---
id: 2026-08-28_smartsite_mcp_app_WDLL
title: WDLL — Smart Site MCP App v1 (screen board + parcel) and v2 (overlays + later intake)
date: 2026-08-28
last_updated: 2026-08-28T20:58Z
status: amended
applies_to: hauska-map, legacy-design-tools
plan_row: P-91, P-92
operator_go: 2026-08-28 (operator: ship the screening board; file v1 and v2 so v2 rolls after v1)
decision: _decisions/2026-08-28_smartsite_mcp_app_screen_save_decouple.md
prototype: _inbox/2026-08-28_smartsite_mcp_app_prototype.html
source_scope: P:/tmp/files (12)/2026-08-28_smartsite_mcp_app_v1_scope.md
related: [_inbox/2026-08-26_smartsite_ai_connector_WDLL.md, _inbox/2026-08-28_p88_item21_directory_blockers.md]
owner: property seat (product code). Planner owns this card and deploys.
---

# WDLL: Smart Site MCP App

Date: 2026-08-28  Status: amended  Operator approval: 2026-08-28; amendment 2026-08-28 (screen/save decouple, I5, I6)

## Done looks like

A Studio user pastes addresses into Claude. Claude calls `create_screen`. The MCP App panel shows that screen as a board: rows are screen rows (resolved, ambiguous, or unresolved with the original query kept), columns are rails, each cell is one of five states. No column totals. A parcel opens from a bare node id; saving is a separate turn and does not write the screen. They walk a named neighbor and may add it to the screen with source `walk`. Find listing history is a button in the panel; the answer lives in the transcript and never enters the board, the panel, or a stored record. Atoms answer what is on record. Claude answers what is being said. Those two stay visibly separate.

## Invariants (not preferences)

I1. The app never calls anything the conversation could not. No UI-only endpoint.
I2. No number appears that cannot be defended at the parcel where it appears. No coverage percentages. No confidence floats while n is zero. No setback figures until O2 is settled.
I3. Absence is the primary visual language. Unknown, refused, and unread never share a glyph.
I4. Anything durable round-trips to Smart Site. The sandbox stores nothing.
I5. Web-sourced content never enters the panel. Search results have no disposition, no asOf, no producer, and no citation in our vocabulary. The button lives in the panel. The answer lives in the transcript.
I6. Rendering requires no persistence. Any parcel node id can be drawn without being saved. Saving is a separate, explicit act.

## Acceptance items

Order: P-91 eight-tool honesty stays in flight (items 1-11, 15, O1, O7). Screen and save tools (items 17-20, A12-A14) start after the connector WDLL names them; they do not wait for item 16, because item 16 cannot be met while the board has no legal data source. The iframe (items 12, 13, 16, 25, 26) waits for the X-ray refuse required by O1 ruling B plus those tools plus I5 and I6. Drainage, codeRefs, Chrome/Gmail/file intake, and reciprocity stay parked. A ninth tool that is not on the named list still fails the card.

### P-91 v1 — honesty, I5/I6, then the iframe

1. **Tool annotations.** Every one of the eight tools declares `annotations` with at least `readOnlyHint`. Read tools do not prompt on every call. | check: `tools/list` JSON on the serving revision contains `annotations.readOnlyHint` for each tool; a unit test fails if any tool omits it | grade: [partial] code on `00020-ced`; Connect `tools/list` unprobed

2. **Situs compose.** `list_my_properties` never returns a label of only separators. `48021:25420` today is `", ,"`. Fallback is the node id plus `situs: "unknown"`. | check: fixture of empty situs components; live list no longer contains `", ,"` | grade: [partial] live stub `25420` label=node, `situs: unknown`; saved-list leftover unprobed

3. **Batched `get_smart_site`.** `parcelNodeId` is a string or an array, cap 50. Arrays never fail on one bad id. Return per-parcel rows plus `notFound`. | check: A1 thirteen-id stub under one call; A2 twelve rows plus one `notFound`; single-id path unchanged | grade: [met] live HTTP 200 `parcels`+`notFound` on `00635-qux` 2026-08-28T16:25Z

4. **Depth `stub` and `node`.** `stub` is label, node id, canonical url, five-state value per rail (`situs`, `zoning`, `landUse`, `flood`, `drainage`, `envelope`). Target about 40 tokens per parcel. `node` returns today's `draw` byte-identical for one id. `hop1` and `subgraph` refuse with a named not-implemented, they are not silent no-ops. | check: A3 gold `draw` identical; stub rails only the five states | grade: [met] gold ring+label locked vs item 27; hop1 400 `not_implemented`

5. **Fifth state `unread`.** Returned only where the read has not been attempted. `atom-miss` maps to `unknown`, never to `absent-verified`. `absent-verified` requires a positive typed result (pipeline present-outside, `:sd:outside`). | check: A4 unread vs unknown fixtures; a board cell cannot collapse the two | grade: [partial] unit falsifier shipped; no live unread cell yet

6. **O5 draw is not gold-only.** `get_smart_site` `draw` on at least five Bastrop parcels that are not `48021:34137` returns a ring or an honest miss. If gold edges stay `descriptor-fixture` and other parcels return no ring, the parcel panel does not ship. | check: probe artifact naming five node ids, rings or typed misses | grade: [ ]

7. **O1 42 percent settled.** File a ruling: either the X-ray 42 percent on `48021:33223` has a producer MCP will serve with the same provenance, or the X-ray must refuse the same way `get_smart_site` refuses envelope. The board does not ship while the two surfaces disagree on the same customer tomorrow. | check: decision record plus paired probe on one parcel | grade: [partial] ruling B stands; probe `_inbox/2026-08-28_p91_o1_paired_probe.md` on serving `00635-qux` / `00020-ced`: MCP R1 refuse (`atom_path_pending`, setbacks-envelope data null); composed X-ray (`kind` / `areaPctOfLot` / verdict) unmeasured (`unmeasured_xray`); do not invent 42% from facet 1397/3294; hauska-map #283 not live

8. **Setbacks stay off the drawing.** O2 `side_corner` 0 ft on gold remains omitted. No road-class table numbers on `draw` until the corner-lot case is settled. | check: gold `draw` has no setback distances; existing P-87 item 24 still holds | grade: [ ]

9. **Citation honesty.** A rail marked `present` does not ship an empty citation array unless `citationsDegraded` is true and the UI treats it as degraded. | check: gold flood and land-use either gain URLs or stay labelled degraded | grade: [partial] merged `b89849c` (#525) on `4a7e789`; serving still `00020-ced`; canary not shifted

10. **`ask_the_map` leak closed.** Validation errors at the MCP boundary do not contain `workspaceDid`, `personaBucket`, `starterPromptId`, `mls_id`, or `presentationMode`. | check: violate the schema; response body has none of those strings | grade: [partial] merged `4a7e789` (#524); serving still `00020-ced`; canary not shifted (main yml `--min-instances=0`); selector translation is leave_behind

11. **Item 21 copy.** B2 follows `llms.txt` (export is live-or-degraded, records pair `not_ready`). B4 coverage is Central Texas zoning plus statewide flood and CAD where the store exists. S1 to S4 applied. Prompt battery re-run. Then file. | check: live `/privacy` and `/terms` already customer-done; directory draft matches `llms.txt`; operator files | grade: [ ]

12. **MCP App v1 panel.** Board plus parcel panel in the Claude MCP App host. The board reads a screen, not `list_my_properties`. I1, I5, and I6 hold. No column aggregates. Unresolved rows keep the original query text. | check: Connect session on a pasted screen; gold parcel panel from live `draw` on a bare node id | grade: [ ] blocked on X-ray refuse (O1 ruling B) plus items 17-20

13. **Turn versus local.** Sort, filter, hover, layer toggle are local. Opening a parcel, walking a named neighbor, saving, adding to a screen, Find listing history, and requesting export are turns. | check: opening three parcels leaves the board intact above | grade: [ ]

14. **Out of v1, enforced.** No R1 report renderer in the frame. No GLB/IFC/terrain inline. No records workflow in the sandbox. No listing feed. No web-sourced content rendered in the panel. No unnamed ninth tool. | check: `tools/list` is the named catalog; app CSP has no private origins; Find listing history leaves the panel byte-identical | grade: [partial] eight tools still live; five persistence tools named, not shipped

15. **O3 cross-ROW neighbors.** Do not enable walk across a ROW until `48021:34121` as neighbor of both 34137 and 34169 is confirmed or labelled unverified. Reciprocity will not catch a ray-hit. | check: written disposition on those two edges before walk ships for ROW neighbors | grade: [ ]

16. **Customer-done v1.** Operator pastes a list, gets a screen board, opens gold from a bare node id, sees envelope refused with `atom_path_pending`, saves one parcel without the screen changing, clicks Find listing history and sees the answer only in the transcript, does not see a 42 percent invent. | check: operator paste plus planner curl of the tool payloads used | grade: [ ]

25. **I6 / A11.** A parcel renders in the panel from a bare node id with no saved record and no screen membership. | check: `get_smart_site` on a node that is neither saved nor on the open screen draws; save is a later turn | grade: [ ]

26. **I5 / A15.** Find listing history is the only ask-Claude button in v1. Clicking it produces a visible transcript turn via `ui/message` and adds nothing to the panel, the board, or any stored record. | check: before/after panel payload identical; transcript has the turn | grade: [ ]

27. **O7 resolver honesty.** After first-call abort is gone, prove whether `find_parcel` handles street-type abbreviations (Cv/Cove, St/Street, Trl/Trail) or only the retry. Pasted listing addresses arrive abbreviated. A screen that drops six rows to abbreviation handling must not look like six addresses that do not exist. | check: paired `111 Rainmaker Cv, Bastrop TX` vs `111 Rainmaker Cove, Bastrop TX 78602` on a warm revision; abbrev miss is `unresolved` with the original query, never a silent omit | grade: [met] both queries 200 under 3s on serving `00643-rib` to the same node `48021:8720522`. `abbreviation_works` fired. Miss-honesty half ungraded because this pair is not a miss. Evidence `_inbox/2026-08-28_p91_o7_rainmaker_reprobe.md`

### P-92 persistence and later overlays

Screens and saved properties are decoupled. A screen holds parcel references, not saved properties. Creating a screen writes nothing to the saved list. Saving is explicit, origin-independent, and a turn. Removing a save does not remove a screen row. Adding a save does not require the parcel to have come from a screen. `list_my_properties` is not the board's data source.

Screen row: `{ parcelNodeId | null, query, resolution: "resolved" | "ambiguous" | "unresolved", source: "pasted" | "chrome" | "gmail" | "file" | "walk" | "saved", candidates? }`.

Tools (named; do not appear in `tools/list` until connector item 12 is amended): `create_screen(name, queries[], source)`, `add_to_screen(screenId, parcelNodeId, source)`, `list_screens(screenId?)`, `save_property(parcelNodeId, status?, note?)`, `set_property_status(parcelNodeId, status)` with statuses New, Watching, Chasing, Passed. `list_screens` with `screenId` is the reopen path (not a sixth tool). `list_my_properties` returns the stub disposition vector, status, and note for saved properties only. It does not take a `screenId` that pretends a screen is a saved set.

Intake: Smart Site never ingests a listing feed. v1 intake is paste (text, screenshot, PDF, CSV); Claude parses and calls `create_screen`. v2 adds Claude for Chrome, Gmail listing alerts against a saved screen, and bulk file upload.

The persistence slice (17-20, 28-30) starts after the connector amendment. Drainage, codeRefs, later intake, and reciprocity stay parked until item 16.

17. **Named-tool amendment filed** naming `create_screen`, `add_to_screen`, `list_screens`, `save_property`, `set_property_status` before any of them appear in `tools/list`. | check: amendment row on the connector WDLL; `tools/list` stays 8 until that amendment is approved and the tools ship | grade: [met] item 12 flipped 2026-08-28; five authorized; serving still 8; LDT persist PR has 13 in code only

18. **`create_screen`.** Pasted queries persist as screen rows. Unresolved and ambiguous keep the original query verbatim. Source is set. Nothing is written to the saved list. Screens persist by default, auto-named, cheap, deletable. | check: A5 plus A14; forty in, six unresolved still show what was typed | grade: [partial] unit A5/A14 green on `feat/p91-screen-save`; not live; migration 0088 not applied

19. **Status persistence on saves only.** `set_property_status` with `New` / `Watching` / `Chasing` / `Passed` survives reload on a saved property. A screen row has no status field. | check: A6 on a saved id; a screen-only id has no status | grade: [partial] screen-only refuse `saved_property_not_found` in unit tests; not live

20. **`list_my_properties` is the saved list.** Returns stub + status + note. Does not return screen rows. A screen of forty with three saves lists three here. | check: schema test plus live list length equals saves, not screen rows | grade: [partial] `screenId` refuse test green; live list ungraded

28. **A12 save/screen isolation.** Saving a parcel from the panel does not alter any screen. Removing a save does not remove any screen row. | check: screen row count and queries unchanged across save and unsave | grade: [partial] four-sentence unit fixture green; HTTP A12 after 0088 + deploy

29. **A13 walk add.** A neighbor reached by walking can be added to the current screen with source `walk`. | check: `add_to_screen` on a `draw.edges[].neighbor`; source is `walk` | grade: [partial] unit walk add green on 34169; live neighbor bind still owed

30. **A14 query verbatim.** A screen created from pasted text preserves each original query, including the ones that did not resolve. | check: unresolved row.query equals the typed string, including Cv vs Cove | grade: [partial] unit Cv/Cove strings preserved; live Rainmaker now resolves on `00643-rib` (`48021:8720522`). Verbatim check still needs an unresolved live row.

21. **Drainage rail on `draw`.** Catchment, flow lines, ponding in the same local frame as `ring`. Empty arrays mean "no concentrated flow path traced." Raster by URL under declared `connectDomains`. `provenance: "degraded"` when rainfall is the regional default. | check: A8 on a parcel that has a drainage sheet | grade: [ ]

22. **Zoning `codeRefs`.** `refBasis: "body-denorm"` until `atom_links` exist, then `atom-link` with no schema change. Hop-1 neighbors as `basis: "parcel-bind"` with `edge: null` until walked. | check: A10 click returns section id labelled denormalized | grade: [ ]

23. **County reciprocity sweep.** Shared-edge length and reciprocal bearing as a store-derived defect map. No new ingest. | check: one county artifact; gold 34137 edge 1 vs 34169 edge 4 still agrees | grade: [ ]

24. **Selection language stays out.** No "find me the smart sites" until a Project node exists. That is later than v2. | check: copy and tool descriptions never promise fit | grade: [ ]

## Out of both cards

Interactive map-in-chat (connector item 18). Hauska catalog tools on this server. Privileged or identified owner data on an anonymous path. Per-call price. Rebuilding Studio inspect inside the iframe. Any listing feed of any kind: no Zillow integration, no third-party wrapper, no scraper, no cached listing content. Web-sourced content in the panel: the Find listing history button is in scope; rendering its answer as panel content is not.

## Amendments

- 2026-08-28 (open). Card opened from `P:/tmp/files (12)` prototype and scope. Planner cut: v1 is board plus parcel on existing tools; screens, status CRM, and drainage overlay are P-92. Legal pages (scope item 6) already customer-done 2026-08-28T15:36Z and are not re-listed as a P-91 blocker.

- 2026-08-28 (O5). Item 6 graded not a ship gate. Artifact `_inbox/2026-08-28_p91_o5_draw_five_parcels.md`. Planner re-read Neon `hauska_mcp.atoms`: 35073/33223/27943/32243 are `depth-warm-verify-promote`; 34169 is `descriptor-fixture` and matches the filed live ring. Live `get_smart_site` HTTP for the four warm parcels remains leave_behind.

- 2026-08-28 (screen/save decouple). Operator amendment. I5 and I6 added. Section 3.3 replaced: a screen holds references, not saves; board reads a screen; `list_my_properties` is no longer the board source. Tools named: `create_screen`, `add_to_screen`, `list_screens`, `save_property`, `set_property_status`. A11-A15 and O7 added. Intake: paste in v1, no listing feed. Find listing history is the only v1 ask-Claude button. In-flight eight-tool work (items 1-5 live) is not cancelled. Persistence tools may start after the connector names them; they do not wait for item 16. Iframe still waits. Decision `_decisions/2026-08-28_smartsite_mcp_app_screen_save_decouple.md`. Reason: a forty-row screen that writes forty saves makes the saved list unusable, and web search in the panel would launder unverified content into the four-state language.

- 2026-08-28 (O1 ruling B). X-ray must refuse envelope like MCP (`atom_path_pending`). Live `deriveBuildableEnvelope` pct is not a producer MCP will serve. Decision `_decisions/2026-08-28_p91_o1_envelope_xray_must_refuse.md`. Reason: different write paths for the same fact class; serving the inset on Studio only is the disagreement that turns the panel into a review fail. Paired probe and the X-ray change remain.

- 2026-08-28 (schema review). Planner accepted `_inbox/2026-08-28_p91_screen_save_schema.md`. Two tables, CRM columns on saves, no `screen_id` on `pe_saved_properties`. `list_screens(screenId?)` is the reopen path. Item 18 "deletable" is `deleted_at` plus a later named tool, not an MCP delete in this catalog. Workbench `researching|offer|passed` stays off this card. Wave B still waits on CP2. Reason: the A12 fixture only passes when save and screen writes hit different tables.

- 2026-08-28 (Wave A CP2). Five returns reviewed. Item 9 PR #525. Item 10 PR #524. O1 ruling B. Schema accepted. O7 is `o4_not_closed` (miss-path bound leftover, not abbreviation expansion). Wave B unblocked. Iframe still waits. CP2 `_inbox/2026-08-28_p91_wave_a_CP2.md`.

- 2026-08-28 (O1 paired probe). `_inbox/2026-08-28_p91_o1_paired_probe.md` on serving `00635-qux` / `00020-ced`. MCP R1 refuse measured. Composed X-ray unmeasured (`unmeasured_xray`). Ruling B not falsified. Do not invent 42% from facet sqft. Wave C still waits on #283 serving plus a composed-sheet grade.

## Finish card (graded at close)

(not yet)
