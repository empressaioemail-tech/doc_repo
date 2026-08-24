# Setback serve wave — 2026-08-23

## GROUND-TRUTH (2026-08-24T22:49Z) — completeness on the Simsbrook block is THREE defects

Operator walk closed hover (WDLL item 6 met). Next thread is data completeness. Live facets same minute:

- **Join miss (lot-to-lot):** 280238 has no `cad_property` row at vintage 2026/cad-export (`landUse` coverage false). 9/10 neighbors have the row. HTTP 200 on all ten. Travis registry `prop_id_bad_rate` 0.5147; StratMap 834k vs REST 386k.
- **Structural zero (county-wide):** joined Travis rows are absent-verified / structural fields null. Gold 34137 living area 2800. Travis store 0.0% sqft (2026-08-10). Well / footprint / boundary atom-miss is family-wide (gold too for well+footprint). Dashed orange on the house is the envelope, not the footprint atom.
- **Situs sentinel:** Dashwood 280210/280211 print a street. Simsbrook prints `, TX`. Find address is a different path.

Diagnosis `_inbox/2026-08-24_travis_block_completeness_diagnosis.md`. Real fix = identity join, then Travis CAMA improvement file, then rich-tier situs. Do not hide atom-miss or invent sqft.

## LESSON (2026-08-24, promotion candidate) — never draw queryRenderedFeatures geometry as a lot highlight

`hits[0].geometry` from a vector tile is a fragment clipped at the tile seam. Drawing it as a hover/inspect overlay produces a missing strip on every seam-crossing lot, and the cut lines up across neighbors because it is the tile grid. Feature-state on the promote id paints every fragment. Mechanical guard already shipped: `packages/map-renderer/src/hover-feature-state.test.js` (6/6 FAIL on the old path, then PASS). Durable rule: `_decisions/2026-08-24_hover_never_draws_tile_fragment.md`. Do not promote as "the lot line was wrong" or "rebake the tiles."

## GROUND-TRUTH (2026-08-24T22:40Z) — hover-fs SHIPPED + LIVE-VERIFIED; operator walk owed

hauska-map [#210](https://github.com/empressaioemail-tech/hauska-map/pull/210) squash `57ca035` (base `80c9ad4` unmoved at merge; CI 4/4 `completed success` by conclusion string). Vercel `dpl_3W5RKLKaLPmPLJiakeVCvDdeX818` Ready, smartsite.cloud serving `index-iYfCC3y3.js`: `hauska-ovl-hover-highlight` x0, `["feature-state","hover"]` x6, `peelParcelMesh` persists. Hover is now feature-state on the promoted id (whole lot across every tile fragment); map `mouseout` clears (lingering-ring fix); fragment `setData` and the overlay source/layers deleted. Violation-proven: seam-span suite 6/6 FAIL on 80c9ad4 recorded BEFORE deletion, 6/6 PASS after; map-renderer 131/131; PE 1490 pass.

Live headless verify 22:34Z: no hover layer/source on the map; hover on 2-fragment seam lot `48453:280236` -> `{hover:true}` + pointer + ONE full-lot highlight (`verify_hover_seam_lot.png`, no straight cut); canvas leave -> `{hover:false}`. WDLL items 1-5 [met]; **item 6 OWED: operator walk — hover 280236 / 280239 / 280233 both entry edges, no straight cut parallel to Simsbrook, sealed 280239 still sheet-ring, Find still docks.**

Lane occupancy: peel tree registered for the lane at `e60f75f`, entry REMOVED again in the close commit (as its note required). A2 rebase + seal-lifecycle/red-card/search-bar/subject-store card + retrieval near-bbox 504s = leave_behind (`_inbox/2026-08-24_hover-fs_close.json`).

## GROUND-TRUTH (2026-08-24T22:10Z) — OPERATOR FALSIFIED the lot-line reading; the pattern is PER-TILE FRAGMENT HIGHLIGHT GEOMETRY, measured

Operator screenshots (parcel boundary OFF, hover on 280236): blue hover box and pale inspected fill offset/mismatched, pattern traceable across properties. Measured live (instrument `probe_fragment_geometry.mjs`, smartsite.cloud 2026-08-24T22:02Z):

- The hover/highlight overlay draws `hits[0].geometry` (`map-renderer.js:384`) — the PER-TILE CLIPPED FRAGMENT, not the parcel. The Simsbrook block sits on a z16 tile-grid CROSS: vertical seam lng -97.6354980 (7 m west of the 17005 rooftop, parallel to Simsbrook through the front yards), horizontal seam lat 30.4581444 (through the south lots).
- Fragment census this viewport: ~134 duplicate fragments; 280233 and 280234 in FOUR pieces (both seams), 280236/280239/280237 in TWO. Hover at lot center draws 280236 as 30 m of its real 38 m (eastern strip missing); control 280209 (off-seam, 1 fragment) draws exact. Cut lines are constant (seam ± ~10 m tippecanoe buffer: ≈ -97.63560 / -97.63539) — the same line across every lot the seam crosses = the traceable pattern. Cursor side selects which fragment draws ("different shapes depending on entry edge", already observed after #203).
- The pale fill is feature-state (renders across ALL fragments = full lot); the blue box is the single fragment — hence the offset double box in the operator frames.
- #204 kept hit-test identity correct but moved the pick to PMTiles, locking drawn geometry to the fixed z16 grid; #209 removed the mesh so no path draws a true ring pre-seal.
- STILL TRUE from the 21:05Z entry: bake exonerated (fragments are query-time clipping; archive has each lot whole, county-true ≤1.5 m; never overwritten since 08-10) — REBAKE WOULD NOT FIX THIS; red-card + wrong-APN mechanics; near-bbox 504s. SUPERSEDED from that entry: attributing the operator's "line across the front yards" to the platted front lot boundary — the referent was the highlight fragment cut, which at this block happens to parallel the street.
- Fix (one PR): feature-state `hover` branch on the tile fill/line paint expressions; never draw `picked.feature.geometry`. Violation test: mocked seam-spanning parcel must highlight as one full lot.

Diagnosis doc updated in place: `_inbox/2026-08-24_stacked_paint_diagnosis.md`.

## GROUND-TRUTH (2026-08-24T21:05Z) — stacked paint diagnosed round 1; bake exonerated by three instruments; lot-line reading SUPERSEDED at 22:10Z above

Second agent, integration seat, doc_repo main `bbcf029`, peel tree `80c9ad4` = live bundle (verified: `index-BOWGIz6n.js` contains `peelParcelMesh` x1, `countyRing` x17, mounts `parcels.b692c6534d26.pmtiles`). Full evidence: `_inbox/2026-08-24_stacked_paint_diagnosis.md`. Instruments in session scratchpad (`probe_tile_bake.mjs`, `probe_tile_vs_mesh.mjs`, `probe_layers_live*.mjs`, `probe_seal_lifecycle.mjs`), all self-tested both directions.

1. **Rebake is DEAD, measured.** GCS object `parcels.b692c6534d26.pmtiles`: Last-Modified 2026-08-10, `x-goog-metageneration: 1` — never overwritten; nothing changed in the tile store in the 48h window. Tile decode at z16/14994/26941: ONE source-layer (`parcels`), 353 polygons, zero line features, zero duplicate ids near 280239. Tile-vs-live-county-mesh per parcel across the Simsbrook block: max dev **1.54 m**, mean 0.04 m — same fabric. The Travis vertex check P-60d never ran is now run; the Bastrop-only gap is closed.
2. **The "line across the front yards" is `hauska-parcel-tiles-line` painting the correct platted front lot boundary.** Violation-proven in a live headless browser: hiding that ONE layer removes every lot line including the frontage line; nothing else paints it. Lots legally stop short of the curb (street ROW), so the true front line cuts through what reads as yard on imagery — "compensating for the road" is the ROW. Not sidewalks: in the probe session the sidewalks layer never mounted (its feed 504s) and the line was there anyway.
3. **Mesh is gone.** Live style dump: no `hauska-ovl-live-parcels-*` layer exists post-#209. Peel verified complete in code (single PE call site, hardcoded flag) and in the served bundle.
4. **Yellow dashed box on the house = envelope inset rendering as designed** (#f2a23c dash [3,2]; SF-S 25/7.5/20 puts the inset on the footprint; the exact 280239 ring is a checked-in test fixture). One at a time; moves with clicks by design.
5. **The stacked/offset thin-blue-vs-white pair is the seal-state lifecycle cluster** (the real residual defect): countyRing feature-state never replayed after tile-source rebuild (`map-renderer.js:574-581`) so the tile stroke returns under the county-exact ring; swallowed feature-state clears orphan `#cfe8ff` strokes permanently (`parcel-tiles.js:419-432` + tracker nulling); failed seals strand pre-seal strokes; hover ring has no mouseleave clear. Live-reproduced: subject adoption with NO seal for 70s x2 while facets probe 200/623ms.
6. **Red card mechanized**: only the client facets GET chain paints red; one cold-start episode (two transients in ~41s) converts to red; single 404/4xx/malformed-200 is red with zero retry. Wrong-APN cards = neighbor clicks through simplified tile fill + a search bar that never clears on map click. Two unguarded races: subject-store last-resolve-wins (`subject-store.ts:103`), late-landing Find snap-back.
7. **New live defects found**: `retrieval/road-nodes|building-footprints|special-districts/near-bbox` 504 repeatedly (silent empty layers — Sidewalks toggle currently governs nothing when the feed dies, an undeclared degradation); toggles reset to defaults on every hard refresh (`ExplorerMap.tsx:445-457`) so Sidewalks/contours/FEMA/OZ re-arm silently; card title renders situs sentinel `", TX"` raw.

Do-nots honored: no rebake, no hide-on-zoom, no Photon/A2/Reports, nothing committed to product repos. Fix card proposal + WDLL 2/3 grading in the diagnosis doc; operator visual remains the grade.

## OPEN (2026-08-24T20:25Z) — sidewalks rejected; second agent

Operator toggled Sidewalks OFF. Leftover stayed. Not a vibe-rebake. Fire `_inbox/2026-08-24_stacked_paint_second_agent_handoff.md`.

## OPEN (2026-08-24T18:48Z) — stacked paint on Travis lots after successful pick

Operator after #208: Find dropdown worked. Now multiple shapes on the Simsbrook lots, not leftover Bastrop / Tahitian Village.

Visual: yellow dashed rectangle over the house + thin blue subject ring + thin blue neighbor ring. Card is Parcel 280239 / Travis / SF-S F 25 S 7.5 R 20. Search bar `17005 SIMSBROOK DR, Pflugerville, TX, 78660`.

This is not identity. Do not reopen Photon labels or trustedRooftop.

Code-read composers in `ExplorerMap` `mapOverlays` (tree `P:/tmp/hauska-map-rooftop-pick`, live squash `db479df`):

1. PMTiles parcel LINE — `shouldSuppressTileParcelLines` unconditionally false after P-60e fail-open (#203).
2. Live GIS mesh — `toLiveOverlays` / `parcel-polygon` toggle default on.
3. `inspectRingOverlays` — P-60d county-exact sheet rings after seal (#200).
4. `gatedEnvelopeOverlays` — amber dashed inset or consumed full-parcel dashed outline.

#204 peeled hover HIT-TEST only. Paint stack was left behind.

Pickup: `_inbox/2026-08-24_multi_shape_paint_handoff.md`. WDLL approved. Peel LIVE #209 `80c9ad4` / `dpl_5vS8iCR67beCF4sWzXzZw912rxPu`. Operator re-grade after hard refresh.

## GROUND-TRUTH (2026-08-24T20:16Z) — operator visual after #209: not a tile rebake

Operator: red card + odd shapes all over + a line across the front of every yard like it is compensating for the road. Asked if the PMTiles bake broke in the last 48 hours.

Mechanism 1 (frontage line): `pedestrian-ways` (Sidewalks) is ON on cold open (`consumerColdOpenVisible`, not in COLD_OPEN_OFF_BY_DEFAULT). Paints a bright line along the street. Matches "consistent across the front of the lots." Not a parcel ring. Not a new bake.

Mechanism 2 (double lot lines last 48h): #201 hid tile lines, #203 fail-open put them back on top of live mesh. #209 peeled the mesh (`peelParcelMesh` is in live `index-BOWGIz6n.js`). Remaining all-lot line is tiles + sidewalks. Do not rebake until toggling Sidewalks off still leaves a second lot ring.

Mechanism 3 (red card): not missing data. Live 2026-08-24T20:16Z PE proxy: facets `48453:280239` 200 / 623ms baked-snapshot; envelope POST 200 / 1726ms `ok` node 280239; facets `280238` 200. Red box is `source=live` + `env.status=error` (resolve throw). Search bar stayed 17005 while cards showed 280238 / 280235.

Yellow dashed on the house is the envelope wedge (default ON), one inspected lot. Footprints stay default OFF.

Rejected: fresh Travis tile bake. No bake shipped in this wave. P-60d already measured tiles vs county mesh as one CAD fabric on Bastrop. Rebake is the last cut, not the first.

## GROUND-TRUTH (2026-08-24T19:49Z) — peel LIVE, operator re-grade owed

hauska-map [#209](https://github.com/empressaioemail-tech/hauska-map/pull/209) squash `80c9ad4`. Vercel `dpl_5vS8iCR67beCF4sWzXzZw912rxPu` aliased smartsite.cloud. Isolated `P:/tmp/hauska-map-paint-peel`. Linked `property-explorer` (prj_vcZGXbqdffk5C20WzaplEpzFynK3). Build log `property-explorer@0.1.0 build`.

Operator 2026-08-24 ~14:45 local screenshot was still #208: Find PASS 280239, stacked blue rings on subject + south neighbor, yellow dashed envelope on the house. That was pre-deploy. Hard refresh owed.

A2 not in this tree. Leave-behind rebase after this merge.

## OPEN (2026-08-24T19:35Z) — Lane 2 parked until peel merges

A2 is not in the peel tree. Verified still uncommitted on `P:/seat-worktrees/property/hauska-map` `fix/pe-pricing-a2`, behind origin/main by 4 (dirty PricingModal + checkout + tests). This seat does not open that branch.

Loop-in: peel visual then deploy/merge, rebase A2 onto that main, A2 visual then deploy, then a new tree for Reports Option D. Pin `_inbox/2026-08-24_lane2_parked_after_paint.md`. If A2 stays dirty, a checkout wipes it. Close must name the rebase as leave_behind.

## GROUND-TRUTH (2026-08-24T18:48Z) — operator visual after #208

Find PASS. Stacked paint FAIL. Same parcel the last three cuts were about (`48453:280239`). Isolated leftover is paint, not lookup.

## GROUND-TRUTH (2026-08-24T18:40Z) — situs rooftop pick LIVE

hauska-map [#208](https://github.com/empressaioemail-tech/hauska-map/pull/208) squash `db479df`. Vercel `dpl_J2HQz9W86CezviRRYWJPZopwKUDk`. Isolated `P:/tmp/hauska-map-rooftop-pick`. Restores #191 for situs address-point only. Photon pick is camera-only.

Live 2026-08-24T18:40Z pick of `17005 SIMSBROOK DR` (no Find click): envelope POST included rooftop `30.459005,-97.635421`, 200 `48453:280239`. Card SF-S F 25 / S 7.5 / R 20. No yellow geocode.

#207 string compact did not fix operator pick. This is the mechanism that worked Aug 23.

## GROUND-TRUTH (2026-08-24T18:19Z) — Photon pick LIVE

hauska-map [#207](https://github.com/empressaioemail-tech/hauska-map/pull/207) squash `37d8550`. Vercel `dpl_FgxxuUi3EfVq4dNvJsmif88snJh5` aliased smartsite.cloud. Isolated tree `P:/tmp/hauska-map-photon-pick`. 44 tests. CI conclusions success.

Operator: dropdown Photon row was the miss; pasted `17005 Simsbrook, Pflugerville TX` PASS.

Live 2026-08-24T18:17Z: type Photon string → dropdown shows **one** address row (`17005 SIMSBROOK DR`, situs pin). Photon `Drive / Texas / ZIP` row dropped. Pick writes the situs string, not the Photon label. Envelope with rooftop → `48453:280239`. Card SF-S F 25 / S 7.5 / R 20.

Photon address-only POST still 422. Compact `17005 Simsbrook, Pflugerville TX` still 200 / 280239.

## GROUND-TRUTH (2026-08-24T18:00Z) — sheet seal LIVE

hauska-map [#206](https://github.com/empressaioemail-tech/hauska-map/pull/206) squash `1eed1a49`. Vercel `dpl_GUCpKro6LyCK9JdryBsikqmQrrMJ` aliased smartsite.cloud. Isolated tree `P:/tmp/hauska-map-sheet-seal` `fix/pe-sheet-seal`. 192 planner tests. CI check-run conclusions all success.

Live browser 2026-08-24T17:54–18:00Z:

- Wainee `?parcelNodeId=48021:35772` seals honest decline: APN 35772, "no setback table covers this parcel's district", `data-testid=honest-absence`, no `facets-load-error`.
- Find leftover: after Wainee, raw Find `17005 SIMSBROOK DR, Pflugerville, TX, 78660` → situs pin + rooftop envelope → facets `48453:280239` → card **Parcel 280239** / SF-S / F 25 S 7.5 R 20. URL dropped the Wainee query.
- Gold `?parcelNodeId=48021:34137` still seals 908 PINE.

OPEN: first Find click while typeahead is expanded can 422 `geocode_miss` (Photon address-only). Same query succeeds on raw Find. CAD situs for 280239 is still `, TX` so the card header says no street address.

leave_behind: none on the WDLL items. Typeahead-vs-raw Find miss is a prior #205 shape, not a new store.

## GROUND-TRUTH (2026-08-24T17:32Z) — operator after #205

Shapes: PASS (one ring per lot in the subdivision). Camera dock faster: PASS. Red card: FAIL.

Search bar still `17005 Simsbrook Drive, Pflugerville, Texas, 78660`. Card is **Wainee `48021:35772`** — first `Reading this parcel…` (`source=loading`), then red `facets-load-error`. Map is Tahitian Village, not Simsbrook.

Live 2026-08-24T17:32Z: Wainee facets 200 / 610ms / `declined` `no-zoning-stamp` / situs present / no envelope geojson. Envelope POST 200 declined in 3660ms, `parcel_node_id=48021:35772`, `placeKey=coord:30.08477:-97.29651`. Data is there. The red box is resolve throw or unplaceable painted as a load error. InspectCard maps `unplaceable` onto the same red copy.

Find leftover: subject was not replaced. #205 hops still pin 280239; the card they are staring at is the previous parcel's sheet resolve.

Next cut (one): seal an honest-declined sheet; red only when a hop actually fails; Find cancels the leftover resolve so the bar and the card are one subject.

## GROUND-TRUTH (2026-08-24T16:36Z) — Find identity LIVE

hauska-map [#205](https://github.com/empressaioemail-tech/hauska-map/pull/205) squash `0998faa`. Vercel `dpl_ExCgJHQgjosXw11smSeaR5nFNK8z` aliased smartsite.cloud.

Live hops 2026-08-24T16:36Z: Photon `17005 Simsbrook Drive, Pflugerville, Texas, 78660` → unique situs address-point + envelope rooftop → **48453:280239**. `908 Pine, Bastrop TX` many-hit situs (5) → address-only envelope → **48021:34137**. Operator visual owed: Find that string, card must not stay on 51536.

## GROUND-TRUTH (2026-08-24T16:28Z) — operator three-in-one after #204

smartsite.cloud `dpl_3xeC4Tf2ZDkLDQ7BT9VQsspZxw7H`. Search bar `17005 Simsbrook Drive, Pflugerville, Texas, 78660`. Card Parcel 51536 Bastrop exempt, red facets-load-error. Map later in the Pflugerville neighborhood, card still 51536.

Live probe 2026-08-24T16:27Z PE proxy:

- `17005 Simsbrook Drive, Pflugerville, Texas, 78660` envelope **422 geocode_miss** (291ms). Same with `…Drive, Pflugerville, TX`.
- `17005 Simsbrook, Pflugerville TX` envelope **200** node `48453:280239`.
- `17005 Simsbark Drive…` (typo) **404 no-parcel**.
- Gold `908 Pine, Bastrop TX` and `908 PINE, Bastrop, Texas, 78602` **200** `48021:34137`.
- Facets `48021:51536` 200 / 765ms / envelope declined. Gold and Simsbrook facets 200.

Mechanism 1 (Find/dock): type-ahead writes Photon `lookupQuery` = house+street+city+`Texas`+ZIP into the box (`search-kinds.ts` `featureToSuggestion`). Find `onSubmitRaw` sends that string to envelope with no coords. Cortex honors address-only geocode and 422s. Card stays on the previous parcel (51536). Street/place landing flies the camera and does not change the subject. Address landing also forwards Photon lat/lng; LDT honors those coords verbatim over the address.

Mechanism 2 (red card): InspectCard `source=live` + `env.status=error` is `factSheetResolver.resolve` throw, not a missing stamp. 51536 facets succeed now. Likely transient during the Find storm, or a click/hover that never sealed.

Mechanism 3 (multiple shapes): #204 peeled hover HIT-TEST only. Paint still stacks PMTiles lines (P-60e fail-open) + live mesh + inspect ring / tile feature-state. 51536 is a large exempt tract; a white lot line through the blue fill is the neighbor line, not a second hover composer.

Gold 34137 is not missing on the envelope path. "Not found" in that frame is Find miss + leftover subject 51536.

## GROUND-TRUTH (2026-08-24T16:19Z) — Lane 1 envelope + hover LIVE

Operator go 2026-08-24. A2 pricing not shipped.

- Cortex `cortex-api-00571-fay` @100% (traffic JSON field `revisionName`/`percent`). LDT [#471](https://github.com/empressaioemail-tech/legacy-design-tools/pull/471) merge `244567a50ae62334984b3f990d776872e1c206ea`. Image digest `sha256:4f6627505a7648dc95065e6965a45a5e34128b0184fa3954646919072d43edad` matched Artifact Registry tag of that SHA before shift. Canary smoke then prod after shift: Dashwood CAD situs `17006 DASHWOOD CREEK DR , TX 78660` → 200 / F 25 / S 7.5 / R 20 / ringPts 10. Neighbor `16911 SIMSBROOK DR , TX` → 200 / same scalars / ringPts 5. Gold `908 PINE , BASTROP, TX 78602` → 200 / F 30 / S 10 / R 30 / ringPts 5. Wainee declined. Extra POST key still 400. `parcel_node_id` no longer 400. Pre-shift falsifier: prod `00569-maw` still 404 `no-district` on the same Dashwood body.
- PE `smartsite.cloud` hauska-map [#204](https://github.com/empressaioemail-tech/hauska-map/pull/204) squash `8cedc9de43d3b4c6f5bd4b3e15d992047202b604`, Vercel `dpl_3xeC4Tf2ZDkLDQ7BT9VQsspZxw7H`. Hover queries `PARCEL_TILES_FILL_ID` only. Operator visual owed: walk one lot; highlight must not swap.

Card leftover F4 (atom-chain 25/5/25 vs BDC 30/10/30) not in this cut. PE send of `parcel_node_id` still leftover for GIS-unstamped clicks. Post-seal sheet rings still a third composer.

## GROUND-TRUTH (2026-08-24T15:50Z) — Lane 1 LDT node jurisdiction (uncommitted)

Isolated tree `P:/tmp/ldt-envelope-nodeid` branch `fix/envelope-parcel-node-id` from `origin/main` `@ 1fd6233d`. No commit. No cortex deploy. No PE change.

- `POST_BODY` now optional `parcel_node_id`; extra keys still `unrecognized_keys`.
- City-less situs keeps `cityStateFromSitus` three-part (Dashwood two-part → null city).
- Fallback `jurisdictionKeyFromParcelNode`: FIPS from node + unique wired-city table match on the already-resolved district. `48453:280210` + `SF-S` → `pflugerville-tx` + 25/7.5/20. Zero or many hits stay null.
- Wainee-class blank district still null / declined. `isTravisUnusableSitus` not in this tree.
- Unit file `envelopeJurisdiction.test.ts` 9/9 plus `authoritativeSetbackSource` 3/3. HTTP route suite not run here (`TEST_DATABASE_URL` unset).

## LESSON (2026-08-24, Lane 1)

Do not widen `cityStateFromSitus` to two-part CAD lines. The second derivation is the parcel node's county FIPS plus a unique district hit among that county's wired setback tables.

## GROUND-TRUTH (2026-08-24T15:23Z) — write-path serve audit

Instrument `_scratch/_probe_write_path_serve.mjs` (self-test both directions, then live). Audit `_inbox/2026-08-24_write_path_serve_audit.md`. PE `smartsite.cloud` / hauska-map `5dda5cb`. Cortex revision declared `00569-maw`, not re-read as traffic JSON.

- `parcel_node_id` still 400 `invalid_body` unrecognized_keys.
- Gold `48021:34137` and Jefferson `34073`: card/BFF `F 25 / S 5 / R 25`; live derive `F 30 / S 10 / R 30` + ring. Two tables.
- Dashwood `280210` and neighbor `280230` (16911 Simsbrook): card `F 25 / S 7.5 / R 20`; CAD-situs POST 404 `no-district` `jurisdictionKey=null` with the correct `parcel_node_id`. City-complete address recovers 200 + ring.
- `#203` Travis drop misses five-digit `TX 78660` city-less lines.
- Wainee `35772`: honest `no-zoning-stamp`. Simsbrook `280239`: city-complete address 200 ringPts=16.

## GROUND-TRUTH (2026-08-24T15:23Z) — write-path serve audit

Filed `_inbox/2026-08-24_write_path_serve_audit.md`. Instrument `_scratch/_probe_write_path_serve.mjs` self-tested both directions then probed live.

Pflugerville wedge is **no-district**, not no-parcel. Dashwood `17006 DASHWOOD CREEK DR , TX 78660` resolves 280210 then `jurisdictionKey` null. City-complete address recovers. `#203` drop misses five-digit city-less lines. `parcel_node_id` still 400 unrecognized_keys.

Gold/Jefferson: card 25/5/25 vs derive 30/10/30. Live augment does not overwrite scalars.

Wainee honest no-zoning-stamp. Store hop and browser paint unmeasured. Cortex revision declared, not re-read as traffic JSON.

## GROUND-TRUTH (2026-08-24T15:16Z) — operator visual after #203

Load better. Parcel lines stay on zoom-in. Pflugerville setbacks still missing as a painted wedge. Hover paints different shapes depending on entry edge.

- Dashwood 280210: card scalars `F 25 / S 7.5 / R 20`; Buildable "Not stamped here"; nested highlight fills. Scalars ≠ wedge.
- Wainee 35772: honest "no setback table covers this parcel's district." Stamp absence, not the Travis geocode miss.
- Search bar can still show Simsbrook while the card is another parcel.

## LESSON (2026-08-24, hover pile-up)

Hover is a second composer. Click = PMTiles fill. Hover = live-mesh `hits[0]` (interactive fill at opacity 0 is still hit-testable). Post-seal = sheet rings. Three geometries for one lot. Same class as P-60e.

## GROUND-TRUTH (2026-08-24T15:49Z) — LDT envelope node-id code-done

`P:/tmp/ldt-envelope-nodeid` `fix/envelope-parcel-node-id`. POST_BODY accepts `parcel_node_id`. City-less situs stays city-null. `48453` + `SF-S` → `pflugerville-tx` 25/7.5/20. Uses GIS-resolved node, so Dashwood may recover on cortex deploy without a PE send. Unique-among-wired-tables fails closed on 0 or many hits. Not deployed.

## OPEN (Lane 1, after 2026-08-24T16:19Z live)

- **PE send `parcel_node_id`** for GIS-unstamped clicks. Dashwood/280230 recovered from GIS-stamped node without a PE send.
- **Card bind BDC (F4):** gold/Jefferson card 25/5/25 vs live derive 30/10/30.
- Search/inspect desync. Do not absorb.
- Post-seal sheet rings still a third composer. Out of this card.

## GROUND-TRUTH (2026-08-24T15:06Z) — P-60e fail-open + retry cap LIVE

hauska-map [#203](https://github.com/empressaioemail-tech/hauska-map/pull/203) squash `5dda5cb`, Vercel prod `dpl_EHNGYvtXMaiQbJksabakCHEjN2C1` aliased smartsite.cloud. Operator visual owed on zoom-in lots, card load, Dashwood/Tahitian setbacks.

## GROUND-TRUTH (2026-08-24T14:40Z) — operator Lane 1 visual after hard refresh

Three write paths, not one slow map. Screenshots on smartsite.cloud (PE #202 `8c8d268`, cortex `00569-maw`).

1. **Lots vanish on zoom-in** = P-60e. `shouldSuppressTileParcelLines` hid every PMTiles LINE when live mesh was ok + >=1 feature + not truncated. At parcel zoom the bbox is small, the cap does not fire, tiles go to opacity 0, mesh overlay does not replace them. Fail-open restored (always false). Residual: double lines may return.
2. **90s "Reading this parcel…" / red card** = retry pile-up. Client 4 x 30s facets + BFF atom-chain 5 x 10s. Generic `api/spine.ts` fetch had no timeout, so near-bbox 504s waited out Cloud Run. Caps: client 2, atom-chain 2, spine hop 10s → 504.
3. **Setbacks only on Simsbrook 280239** = envelope POST 404 is cortex `no-parcel` / geocode-low, not a missing route. Dashwood `17006 DASHWOOD CREEK DR, TX 7866` and `, TX` sentinels geocode-miss. Drop unusable situs; send click point. `parcel_node_id` still not on POST schema.
4. **Console sky / hillshade-opacity** = Mapbox `sky` + `hillshade-opacity` on MapLibre. Skip sky; omit the paint prop; terrain infra cannot abort `map.on("load")`.

Parcels in the visual: Dashwood 280210 (setback text, no wedge, 404), Simsbrook 280239 (45% + dashed orange), APN 280167 (red card), Tahitian 30862 (stuck Reading…, no setbacks, contours on).

## GROUND-TRUTH (2026-08-24T11:43Z) — P-60c stripes + loading hardening LIVE

Two fixes shipped on top of P-60b, both verified live:

- **Cortex spike cleanup** LDT [#469](https://github.com/empressaioemail-tech/legacy-design-tools/pull/469) (merge `44ddffb3`) → `cortex-api-00564-kal` @100% (traffic verified by JSON field read; canary digest matched the merge-SHA artifact tag before shift). The strip-union difference emitted zero-width out-and-back excursions (7.62 m, one per frontage chord junction) that PE drew as perpendicular ladder strokes. `stripReversalSpikes` now cleans the clip output at the source (>160° reversal, mouth <0.5 m; zero area so the conservation gate is untouched). A/B probe (`_scratch/_probe_p60c_spikes.mjs`, self-testing detector): old rev Simsbrook 21 pts with 5 spikes → new rev 16 pts CLEAN; Bastrop 34073/34137 byte-identical.
- **PE stripes + loading** hauska-map [#199](https://github.com/empressaioemail-tech/hauska-map/pull/199) (merge on main, deploy `dpl_76QN3ebQvmR3xhRDoWwC5Gf3r9ao` = smartsite.cloud). Draw-time spike sanitizer (belt-and-suspenders for cached rings) + the loading fix: 30s per-attempt client timeout, 10s BFF upstream timeouts, 500 retryable, `maxDuration: 60` for `api/spine.ts`. Root cause of "Reading this parcel…"/red card: zero timeouts anywhere in the facets chain against cold-startable Cloud Run.

## LESSON (2026-08-24, P-60c)

- The conservation gate cannot see zero-width spikes (they enclose no area and are not proper crossings). Geometry validity checks that reason about AREA are blind to DEGENERACY; a ring cleaner is a separate concern from a conservation gate.
- `gh pr merge --delete-branch` and `git checkout` in a shared-main worktree layout: restoring a violated file with `git checkout --` wipes uncommitted fixes too. Stage-or-stash the fix before running verify-by-violation.

## GROUND-TRUTH (2026-08-24T12:25Z) — cortex warm instance LIVE; loading + highlight-miss root cause

Operator retest showed loading still slow AND highlight still offset on a SEALED card. Both were one defect: `cortex-api` (8Gi/2CPU) had NO min-instances — `hauska-retrieval-api` already ran minScale=1, so the earlier "min-instances on retrieval" recommendation pointed at the wrong service. Cold cortex (a) stalls the facets cortex leg + the resolver's gis-layer ring probe ("Reading this parcel…"), and (b) the ring probe timeout means the sheet seals WITHOUT rings, so the P-60d county-exact overlay honestly declines and the offset tile fill persists. Fix: `cortex-api-00565-min1` (same digest `2d1cb9fe`, minScale=1) serving 100% (verified by revision-annotation read — NOTE: `gcloud run services update --min-instances` on a name-pinned-traffic service updates only the TEMPLATE; the serving revision keeps minScale empty until a new revision is created AND traffic is shifted; verify the revision annotation, not the command output). Live browser verify: Simsbrook highlight now county-aligned post-seal; spike probe still ALL CLEAN. Cost ~$20-30/mo idle, justified by operator's failed softened-blow trial.

## LESSON (2026-08-24, P-60e)

- **Residual "multiple shapes":** the PMTiles line layer (maxzoom 16, overzoomed past z16) and the live county mesh co-draw the same fabric at two fidelities — visible double lines at parcel zooms. Fix in flight (suppress tile lines when live mesh has viewport features, fail-open when it does not).
- **Travis lookup gap:** deep-link/parcelNodeId lookup for 48453:280239 returns honest "no boundary or coordinate on file" (boundary-edge atom-miss, facets carry no rings). Click/address paths work only because they carry a point for the bbox probe. Ingest item for the parcel-facts-deficit mapping pass. Also: cortex geocode misses "17005 Simsbrook DRIVE" (full suffix) while "17005 Simsbrook" hits — fold into the same card.

## GROUND-TRUTH (2026-08-24T12:04Z) — P-60d county-exact highlight LIVE

hauska-map [#200](https://github.com/empressaioemail-tech/hauska-map/pull/200) (merge `3c6be50`) deployed smartsite.cloud `dpl_EgCpMfHMXkZxEr5AjFteYoX8arWW`. After sheet seal the inspect highlight draws from `sheet.geometry.rings` (county-exact) via new `inspect-highlight.ts`; tile feature-state demoted to pre-seal instant feedback. PMTiles clicks no longer stash tile-clipped geometry; consumed-lot outline prefers sheet ring with a parcel-identity guard (fail closed on unproven identity). 1423 tests pass; violation-verified (old precedence fails 5/11 new tests). Follow-up NOT absorbed: click re-resolution against county geometry near boundaries (wrong-neighbor clicks at low zoom), then tile rebake only if residue remains.

## GROUND-TRUTH (2026-08-24T11:45Z) — offset lot shapes DIAGNOSED, no fabric offset

Read-only diagnosis (48021:35772, 195 Wainee Dr): PMTiles bake and county GIS mesh are the SAME Bastrop CAD fabric — corner vertices agree to 1-8 cm live. The visible offsets are (a) tippecanoe simplification of the feature-state highlight vs the exact county mesh (0.75 m z16 → ~5 m corner cuts z12-14) and (b) a tile-partial feature-state paint (highlight cut at a z20-family Mercator tile boundary, matched to 0.1% against the screenshot). Real code defect found: `ExplorerMap.tsx` ~1160-1166 comment says PMTiles click path passes null (tile-clipped geometry), code passes `geom`; the #198 consumed-lot fallback prefers that tile-clipped click ref over the sheet's county-exact `parcelRing` and has no parcel-identity guard. Fix in flight (P-60d): sheet-ring overlay after seal + precedence/identity fix. Probe scripts `P:/tmp/lot_shape_probe/`.

## DEAD-END (2026-08-24, P-60d)

- Do NOT chase a StratMap-vs-BCAD dual-fabric theory for Bastrop lot-shape complaints — measured dead: one fabric, centimeter agreement. Also dead: terrain/pitch reprojection (terrain only engages with 3D toggle + pitch >= 15°) and stale-highlight-across-failed-load (feature-state is keyed to click id and cleared on next inspect).

## OPEN (post P-60c)

- **min-instances 1 on `hauska-retrieval-api`** (and consider `cortex-api`): every mitigation shipped only bounds cold-start pain; this removes it. Ongoing-cost call → operator.
- Vercel fluid-compute setting unreadable with current CLI token; whoever owns the Vercel project should confirm.
- Cold-start half of the loading mechanism not reproduced live (probe traffic kept services warm); rests on code reading. One off-hours probe after >30 min idle would close it.

## GROUND-TRUTH (2026-08-24T03:45Z) — P-60b inset gate fix LIVE

**The two "PASS (honest-empty)" grades below were FALSE NEGATIVES.** Forensics (P:/tmp/simsbrook_forensics/, P:/tmp/inset_audit/) proved the boolean clip computed valid envelopes that the `insetIsDegenerate` heuristics (8cm self-touch proximity + per-edge midpoint probe) then rejected, with the rejection reported as consume-lot. Fixed in LDT [#468](https://github.com/empressaioemail-tech/legacy-design-tools/pull/468) (merge `5299bb9d`), deployed `cortex-api-00562-siv` @100% (traffic verified by JSON field read, 2026-08-24T03:34Z).

| Parcel | Pre-fix | Post-fix live (cortex + PE proxy) | Grade |
|--------|---------|-----------------------------------|-------|
| `48021:34137` | ok ringPts=5 | ok, 30/10/30, ringPts=5 (unchanged) | PASS no regression |
| `48021:34073` (1006 Jefferson) | no-buildable-area | **ok, 3,511 sqft / 38.9%, ringPts=6** | RECOVERED |
| `48453:280239` (Simsbrook) | no-buildable-area | **ok, 3,074 sqft / 45.4%, ringPts=21** | RECOVERED — matches truth ring to 0.1 sqft |

Wire change: `no-buildable-area` now claimed only when the clip itself is empty (`emptyKind: consumed`); gate declines return `geometry-validation-failed`. PE treats the unknown status as an honest decline (verified `buildable-envelope.js` L206), never seals it as consumed.

## LESSON (2026-08-24, P-60b)

- **The probe instrument codified the defect.** `_probe_setback_unify.mjs` pre-registered `no-buildable-area` as the EXPECTED result for 34073/280239 and graded matches as PASS. A consume-lot claim on a lot with a house should have been arithmetic-checked: at 6,767 sqft, zero requires W≤22.5ft or D≤45ft — pathological. Grade consume-lot claims against lot dims before accepting.
- **A validity heuristic that can false-fire on legitimate input is worse than no heuristic** when its failure masquerades as a measurement. The replacement is a conservation check from the clip outputs (two derivations), verified by violation.
- **When a trust bound is found too loose, grep every consumer of the same primitive**: the 45m road blanket sat in three gating positions (front trust, corner resolver, road-class attach); only the first was legitimate.
- 2026-07-30 STEP3 close already recorded "TxGIO micro-vertices corrupt inward normals → null inset" on 34073 — the defect was OBSERVED and worked around (BCAD ring scrub) instead of root-caused, then the honest-empty grade buried it.

## DEAD-END (2026-08-24)

- Setback TABLES were never the problem on 280239/34073 — scalars and ordinance citations verified correct (Pflugerville SF-S 25/7.5/20/15 vs Table 4.2.4A). Do not re-audit tables for wedge-shape complaints; read the geometry gate first.

## OPEN (post P-60b)

- Baked-facets envelope: `status=ok` with `areaSqFt` but `ringVerts=0` fails `scripts/product-surface-smoke.mjs` envelope.sanity on 34073/34785/34017 — PRE-EXISTING (facets BFF never bakes rings; ring comes from live derive; instrument expectation vs baked-chain shape mismatch). Decide: bake rings, or teach the instrument the split.
- Card zoning render check owed: if operator's card literally shows digit "SF-5" for 280239, chase stale atom vs live GIS divergence (no code path transforms SF-S→SF-5; chain verified verbatim end-to-end).
- Operator visual QA on Simsbrook + 1006 Jefferson wedges (map paint).
- `_probe_setback_unify.mjs` deploy-snapshot line reads stale cortex_sha (8c6d304f while 5299bb9d serves) — fix the snapshot read.

## GROUND-TRUTH (2026-08-24T00:35Z, superseded above)

Option C unification **CLOSED**. Map wedge = cortex `labelEdges+derive` only. Facets carry scalars, no depth-warm geojson.

Deploys:
- Cortex `8c6d304f` → revision `cortex-api-00560-rih` @ 100%
- PE `b74cca1` ([#197](https://github.com/empressaioemail-tech/hauska-map/pull/197)) → smartsite.cloud `dpl_4JRGkvaTVdhBeNmEQYdfekbSHqrg`

## LIVE PROBES (instrument: `_scratch/_probe_setback_unify.mjs`)

| Parcel | Facet geo | Derive | Setbacks (derive) | Status | Grade |
|--------|-----------|--------|-------------------|--------|-------|
| `48021:34137` | false | labelEdges+derive | 30/10/30 BDC | ok, ringPts=5 | PASS |
| `48021:34073` | false | labelEdges+derive | 30/10/30 BDC | no-buildable-area | PASS (honest-empty) |
| `48453:280239` | false | labelEdges+derive | 25/7.5/20 Pflugerville | no-buildable-area | PASS (honest-empty) |

Simsbrook probe address: `17005 Simsbrook, Pflugerville TX` (full "Drive" suffix geocode_miss on cortex).

## SHIPPED

| Item | PR | Repo |
|------|-----|------|
| Unified derive + authoritative setbacks | #467 | legacy-design-tools |
| Live derive for map; strip facet geo; nav address | #196 | hauska-map |

Close: `_inbox/2026-08-23_setback_geometry_unification_close.json`

## SHIPPED 2026-08-24 (P-60 perf/viz + commercial polish)

- PE **#198** merged `69d801e` — single derive per inspect, consumed-lot dashed outline, pricing ladder UI, share free, unlock hardening
- WDLL: `_inbox/2026-08-24_p60_setback_perf_viz_WDLL.md`, `_inbox/2026-08-24_smartsite_commercial_polish_WDLL.md`
- Live verify pending post-deploy: 48021:34137, 48453:280239, share mint, unlock Stripe path

## GROUND-TRUTH (2026-08-24 ~13:45 UTC — P-60e parcel-line dedup SHIPPED)

- PE **#201** merged `41bd963`, Vercel production deployed and Ready. PMTiles base parcel LINE fades to 0 opacity only when the live county mesh fetch resolved ok, untruncated, ≥1 feature; every other state fails open (tile lines stay). Truncated (~200-feature bbox cap) deliberately does NOT suppress — mesh covers only part of the viewport. Paint-only on `line-opacity` (boundary toggle owns `visibility`, zoning owns `line-color`); renderer state survives layer re-adds; subject/inspected strokes never dim. Both instruments verified by violation. Fixes the "two shapes on one lot" doubling past z16 (tile maxzoom 16 overzoom + tippecanoe simplification vs exact mesh).
- Operator visual re-check pending on smartsite.cloud.

## OPEN (leave_behind)

- **P0 viz follow-up:** per-edge setback lines (optional; dashed outline shipped)
- Cortex POST: accept `parcel_node_id` (PE re-enable send after schema)
- Geocoder miss on full Simsbrook street address
- Engine BDC hash lock mirror vs LDT `18b9bca9…` (optional)
- doc_repo: commit close JSON deploy-id amend (`main` ahead 1)

Handoff: `_inbox/2026-08-24_setback_wedge_handoff.md`

## LESSON (2026-08-24)

PE #196 started sending `parcel_node_id` on buildable-envelope POST; cortex schema does not accept it → **400 invalid_body** → live derive never patches geojson → card can show stale buildable % from warm scalars but **map draws no amber wedge**. Fix: `fix/setback-wedge-derive-post-body` omits `parcel_node_id` until LDT accepts it; ExplorerMap defaults buildable-envelope overlay visible before layer seed lands.

## PRIOR WAVE (superseded by Option C)

- #194 map=export geo parity (depth-warm geo on facets — retired)
- #466 Bastrop BDC router
- #195 Travis table-backed PE port
