---
id: 2026-08-24_stacked_paint_diagnosis
title: Stacked paint after #209 — Round-2: per-tile fragment highlight; bake still exonerated
status: active
date: 2026-08-24
from: planner (integration, P:/doc_repo, second agent per 2026-08-24 handoff)
plan_row: P-60
snapshot: doc_repo main bbcf029; peel tree P:/tmp/hauska-map-paint-peel 80c9ad4; live bundle index-BOWGIz6n.js verified = 80c9ad4 (peelParcelMesh x1, countyRing x17); archive parcels.b692c6534d26.pmtiles gen 1786341204674220
---

# ROUND 2 (2026-08-24T22:10Z) — operator falsified the round-1 referent; the macro issue is per-tile fragment highlight geometry

The operator re-graded with screenshots (parcel boundary OFF, hovering 280236): the pattern is in the HIGHLIGHT itself and traces across properties. Measured live (`probe_fragment_geometry.mjs`, smartsite.cloud 22:02Z):

The hover/highlight overlay draws `hits[0].geometry` (`map-renderer.js:384`) — the per-tile clipped FRAGMENT of the parcel, not the parcel. The Simsbrook block sits on a z16 tile-grid cross: vertical seam lng -97.6354980 (parallel to Simsbrook, 7 m west of the 17005 rooftop, through the front yards), horizontal seam lat 30.4581444 (through the south lots). Fragment census in one viewport: ~134 duplicates; 280233/280234 split in FOUR (both seams), 280236/280239/280237 in TWO; off-seam control 280209 whole. Hover at lot center draws 280236 as 30 m of its real 38 m. Cut lines are constant (seam ± ~10 m tippecanoe buffer: ≈ -97.63560 / ≈ -97.63539), identical across every lot the seam crosses — the traceable straight pattern. The cursor's side of the seam selects which fragment draws (the "different shapes depending on entry edge" observation). The pale patch in the operator frames is feature-state fill (renders across ALL fragments = full lot); the blue box is the single fragment — hence the offset double box.

#204's hit-test identity remains correct (the id is right); what regressed is that the DRAWN geometry became tile-fragment-shaped and grid-locked when the pick moved from the live mesh to PMTiles. #209 removed the mesh, so no pre-seal path draws a true ring. Sealed lots look right because P-60d's county-exact ring takes over post-seal.

Round-1 conclusions that STAND: bake exonerated (fragments are query-time clipping — the archive has each lot whole, one feature per tile, county-true to <=1.5 m; never overwritten since 08-10; REBAKE WOULD NOT FIX THIS); red card and wrong-APN mechanics (section 6); near-bbox 504s and toggle non-persistence (section 7). Round-1 conclusion SUPERSEDED: section 1's attribution of the operator's "line across the front yards" to the platted front lot boundary — the platted line exists and is painted by the tile line layer, but the operator's referent was the highlight fragment cut, which at this block runs parallel to the street.

**Fix (now item one of the fix card):** feature-state `hover` branch on the existing tile fill/line paint expressions, set/clear on mousemove; delete the hover overlay geometry write; never draw `picked.feature.geometry` anywhere pre-seal. Feature-state renders across all fragments of the id, so the highlight is always the full lot and the seam pattern disappears map-wide. Violation test: a fixture parcel spanning a mocked tile boundary must render one full-lot highlight; the fragment-overlay path must fail it.

---

# ROUND 1 (21:05Z) — mark-by-mark; section 1's referent superseded above

Each mechanism below names the rejected alternate per ENFORCEMENT reporting rules. Instruments live in the session scratchpad and are file-based with self-tests in both directions; four subagents ran read-only code audits of the peel tree; nothing was written to any product repo.

## 1. The line across the front yards is real data, correctly painted, by exactly one layer

`hauska-parcel-tiles-line` (#8a9aab, 1.4 px) draws the platted front lot boundary. Residential lots legally stop short of the curb; the street right-of-way (pavement plus parkway strip) belongs to no lot, so the true front line runs parallel to the street through what reads as front yard on satellite imagery. That is the "compensating for the road" geometry.

Proof by violation, live: a headless browser on smartsite.cloud at the Simsbrook block, `setLayoutProperty("hauska-parcel-tiles-line","visibility","none")` — every lot line vanishes including the frontage line, and nothing else paints it (screenshots `s2_preclick.png` / `s2_hide_hauska-parcel-tiles-line.png`). A `queryRenderedFeatures` transect from street to rooftop hits only tile layers plus a transparent FEMA minimal fill.

Rejected alternate 1 — sidewalks: in the probe session the sidewalks layer never mounted (its feed 504ed) and the line was present anyway; the operator's toggle-off falsification points the same way.
Rejected alternate 2 — a bake defect: see 2.

## 2. The bake is exonerated by three independent derivations; rebake is dead

- Object store: `parcels.b692c6534d26.pmtiles` Last-Modified 2026-08-10, `x-goog-metageneration: 1` — never overwritten since first write. Nothing in the tile store changed in the operator's 48-hour window.
- Tile content: decoded z16/14994/26941 from the live archive. ONE source-layer (`parcels`), 353 polygons, zero line features, zero point features, no duplicate parcel_node_ids near the subject, no ROW features. Subject 48453:280239 present, one ring, 8 verts, centroid 8 m from the rooftop.
- Fabric agreement: per-parcel nearest-segment deviation, tile ring vs live county mesh (`POST map-data/gis-layer parcels`, the same source the peeled mesh consumed), every shared parcel on the block: max 1.54 m, mean 0.04 m. This is the Travis vertex check the Bastrop "one fabric" proof did not cover. Travis is the same fabric.

The 48-hour clock the operator felt is #201 (tile lines hidden, lots vanished) then #203 (tile lines restored ON TOP of the live mesh — doubled lines everywhere, which trained the eye), then #209 (mesh removed). What remains is the single correct line, now scrutinized.

## 3. Live mesh is gone; the peel is complete and served

Live style dump: no `hauska-ovl-live-parcels-*` layer exists. Code audit: one PE call site (`ExplorerMap.tsx:1416`) through `liveOverlayVisibility` with `PEEL_PARCEL_MESH = true` hardcoded (`parcel-ring-peel.ts:9`); the peel omits line, fill, and hit surface; the reconciler removes shrunk keys (`overlay-render.js:345-368`). The CC call site does not reach the PE bundle. Served bundle verified to be #209.

## 4. The yellow dashed box on the house is the buildable envelope, as designed

`#f2a23c`, dash [3,2], 2.2 px (`envelope-overlay.ts:241-247`). SF-S insets (F 25 / S 7.5 / R 20) put the inset rectangle on the house footprint; the exact 280239 inset ring is a checked-in fixture (`envelope-overlay.test.ts:143-173`). Keys are stable, `setEnvelopeOverlays` holds 0-or-1 spec, the reconciler removes on inspect change — envelopes cannot accumulate. It appears on a neighbor after clicking that neighbor because every click draws that lot's envelope; one at a time. Default toggle ON.

## 5. The stacked/offset thin-blue-vs-white pair is a seal-state lifecycle cluster — the real residual defect

When a seal works, `countyRing` zeroes the tile stroke and one county-exact ring (#cfe8ff 1.8 px) paints. The stacked pair appears when that state is lost or never set:

- **countyRing is not replayed after tile-source rebuild.** `applyParcelTiles` re-asserts only `subject` and `inspected` (`map-renderer.js:574-581`); after satellite/style churn the tile stroke returns under the county ring — two blue-ish rings offset by the measured ~0.75-1.5 m simplification.
- **Swallowed feature-state clears orphan strokes permanently.** `clearParcelFeatureState` failure is caught and the tracker nulls its id in the same breath (`parcel-tiles.js:419-432`, `map-renderer.js:984-1008`), so a dropped clear on a previously clicked lot leaves a `#cfe8ff` inspected stroke no code path will ever clear.
- **Failed seals strand pre-seal strokes.** Reproduced live twice: click 280239, Make subject, `subject:true` armed, then NO seal for 70 s — no ring, no envelope, no red card (honest-absence path) — while direct probes of facets (200/623 ms) and envelope POST (200 ok) succeed. Same session logged repeated 504s on `retrieval/*/near-bbox`. Cold-window collateral, the same class as the red cards.
- **Hover ring has no mouseleave clear** (`map-renderer.js:363-387`): pointer exiting the map into the card leaves a cyan tile-clipped ring on the last-hovered neighbor.

## 6. Red card and wrong-APN cards, mechanized

Only the client facets GET chain can paint red (`InspectCard.tsx:163-168, 683-693`; `baked-facets.ts` retry caps). One cold-start episode — two transients inside ~41 s — converts to red; a single 404/4xx/malformed-200 is red with zero retry; envelope/geocode/ring probes can never paint red. Wrong-APN cards are user clicks committing a neighbor through the tippecanoe-simplified tile fill at the click point, while the search bar keeps its text forever (component-local state, no writer on map click — `SearchBar.tsx:354`): bar says 17005, card says 280238. Two real race holes for the fix card: the subject store is last-resolve-wins with no sequence guard (`subject-store.ts:92-105`), and a late-landing Find snaps card/camera back with no user action (`ExplorerMap.tsx:980-1023`).

## 7. New live defects surfaced by the probes

- `GET /api/spine/retrieval/road-nodes/near-bbox`, `building-footprints/near-bbox`, `special-districts/near-bbox` — repeated 504s live. Those layers go silently empty; the Sidewalks toggle governs nothing while its feed is dead. Undeclared degradation (ENFORCEMENT violation class).
- Toggle state is not persisted (`ExplorerMap.tsx:445-457`): every hard refresh silently re-arms the default-ON set (sidewalks, contours, hydrography, FEMA, opportunity-zone). This is why toggle-based falsifications kept un-falsifying, and contours (thin brown squiggles, default ON) contribute to "odd shapes everywhere."
- Card header renders the situs sentinel `", TX"` as the title.
- Anonymous cold open logs a 401 on `saved-properties` (expected for anon, but noisy).

# WDLL grading (items 2 and 3; operator visual remains the grade)

- **Item 2 (one visible ring per uninspected lot): not met.** The leftover the operator can trace is the hover overlay drawing `hits[0].geometry` (`map-renderer.js:384`). That is one composer, but it paints a tile fragment, so the visible box is not the lot. Off-seam lots look exact; seam-crossing lots lose a strip. Round-1 "single line composer" was true and insufficient.
- **Item 3 (inspected lot = one ring plus at most one envelope): partial.** Sealed lots look right because P-60d's county-exact ring takes over. Pre-seal hover/inspect still draws a fragment (or a fragment overlay against a full-lot feature-state fill). Seal-lifecycle defects in section 5 remain a later card.

# The fix card this earns (one PR, no rebake, no architecture)

**(0) Hover feature-state — this PR.** Replace the hover overlay with a `hover` branch on the existing tile fill/line paint expressions (`parcel-tiles.js`). Set/clear feature-state on mousemove. Delete the fragment-geometry write (`picked.feature.geometry` / `HOVER_SOURCE_ID` setData). Same for any remaining pre-seal consumer of picked fragment geometry. Violation test: a fixture parcel spanning a mocked tile boundary must highlight as one full lot; the old overlay path must fail that test. Post-seal stays on the P-60d county-exact ring. Do not touch it.

Later card (not this PR): (a) replay `countyRing` in `applyParcelTiles`; (b) make feature-state clears retry-or-track instead of swallow-and-null; (c) hover mouseleave is absorbed by (0) if feature-state clear is on leave; (d) clear or rewrite the search bar on map click; (e) sequence-guard the subject store; (f) declare near-bbox degradation in the UI and chase the retrieval 504s; (g) strip the `", TX"` sentinel from the card title. Explicitly out of both cards: rebake, hide-tiles-on-zoom, Photon/Find, new architecture.

# Leave-behind

```
leave_behind:
- item: fix/pe-pricing-a2 (A2 PricingModal + interval wire), uncommitted on P:/seat-worktrees/property/hauska-map, behind origin/main. Rebase onto main after the paint verdict; operator visual before deploy. Pinned in _inbox/2026-08-24_lane2_parked_after_paint.md.
  owner: planner
  plan_row: P-60
- item: seal-lifecycle fix card (defects 5a-5d, 6 races, 7 degradations above) — not yet dispatched
  owner: planner
  plan_row: P-60
- item: retrieval near-bbox 504s (road-nodes / building-footprints / special-districts) — service-side, distinct from the paint card
  owner: planner
  plan_row: P-60
```

# For the operator: 60-second self-verification on smartsite.cloud

1. Layers panel, toggle "GIS Parcel Boundary" OFF. Hover a seam-crossing lot (280236, 280239). The leftover box is still there — it is the hover overlay, not the parcel-line layer. Move the cursor from west to east across the same lot: the box changes shape. That is the fragment, not the lot.
2. Toggle parcel boundary back ON, toggle "Topography" OFF — the thin brown squiggles die (they were on by default; every hard refresh turns them back on).
3. The yellow dashed box is the buildable envelope (its toggle is "Buildable envelope"). It sits on the house because F 25 / S 7.5 / R 20 lands there.
4. After this PR deploys: hover 280236 / 280239 / 280233. The highlight is the full lot from either entry edge. The straight cut through the front yards is gone. Sealed lots still use the county-exact ring.
