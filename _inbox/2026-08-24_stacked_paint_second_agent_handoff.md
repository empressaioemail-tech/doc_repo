---
id: 2026-08-24_stacked_paint_second_agent_handoff
title: Fire-ready pickup — stacked paint leftover after #209 peel (sidewalks rejected)
status: active
date: 2026-08-24
from: planner (integration, P:\doc_repo)
to: fresh planner / second agent
plan_row: P-60
---

# Fire this agent

Paste the fenced block into a new chat in `P:\doc_repo`. Do not reopen Find. Do not rebake tiles on a vibe.

````markdown
You are the planner in P:\doc_repo.

## Seat and snapshot (declare these in your first output)

- Seat: integration. Worktree: P:/doc_repo. Branch: main. Run `git rev-parse --short HEAD`.
- Read `_STATE.md`, `MEMORY.md`, `_scratch/setback-serve-wave.md`, this file, `_inbox/2026-08-24_lane1_multi_shape_peel_WDLL.md`, `_inbox/2026-08-24_p60_parcel_ring_composer_inventory.md`, `_inbox/2026-08-24_lane2_parked_after_paint.md`.
- Product work is hauska-map only. Isolated tree. Do not write in `P:/seat-worktrees/property/hauska-map`. Do not open `fix/pe-pricing-a2` or any Reports branch.
- Subagents do not commit. You commit. Cite plan row P-60.
- Code reading outranks output measuring. Read the write path before trusting a live screenshot.

## What the operator is staring at RIGHT NOW (2026-08-24 ~15:14–15:23 local)

Live: smartsite.cloud. Serving hauska-map #209 squash `80c9ad4`, Vercel `dpl_5vS8iCR67beCF4sWzXzZw912rxPu`, HTML asset `index-BOWGIz6n.js` (verified 2026-08-24T19:49Z Last-Modified, peel strings `peelParcelMesh` and `countyRing` are in that bundle).

Search bar: `17005 SIMSBROOK DR, Pflugerville, TX, 78660`. Find identity is PASS when the card is Parcel 280239 / Travis / SF-S F 25 / S 7.5 / R 20.

FAIL (operator, after hard refresh, after #209, after turning Sidewalks OFF):

1. Odd multiple shapes on the subject AND the lots next to it AND all over the map.
2. A line that is consistent across the front of the lots, parallel to Simsbrook Drive, cutting through front yards, like it is compensating for the road.
3. Yellow dashed box on house footprints (subject; sometimes neighbors after click-around).
4. Thin blue rings stacked / slightly offset from white lot lines.
5. Intermittent red card: "Could not load this parcel's details. This is a loading problem, not a gap in what we know about the parcel." Cards have also shown APN 280238 and 280235 while the search bar still said 17005.

Operator ruled 2026-08-24 ~15:23 local: **it is not the sidewalks.** They toggled Sidewalks off. The leftover stayed.

Operator belief: this was never a problem until about the last 48 hours (since ~2026-08-22 evening). They asked if the map tile bake broke.

## Your job

Find the composer that still draws the extra lot-front line and the stacked rings AFTER #209 peeled the live GIS mesh and AFTER Sidewalks is off. Prove it by violating it (force that composer on, see two rings; peel it, see one). Operator visual on the Simsbrook block is the grade.

Do not rebake PMTiles unless you have a second derivation that the extra line is IN the tile source (queried feature geometry), not an overlay. Fetch-ok is not paint. Re-hiding lots on zoom-in is a fail (#201 / P-60e).

## What already shipped (do not relitigate)

Chronological. This is the last ~48 hours plus the setback wave that put paint on these lots.

### Before Find (the paint stack was already being built)

| When (UTC) | Cut | PR / rev | What it did | Residue |
| --- | --- | --- | --- | --- |
| 2026-08-23 | Option C unify | LDT #467, PE #197 | Map wedge = cortex `labelEdges+derive` only. Facets carry scalars, no depth-warm geojson. | Simsbrook/Jefferson first graded honest-empty. That grade was later a false negative. |
| 2026-08-24 ~03:34Z | P-60b inset gate | LDT #468 `5299bb9d` cortex `00562-siv` | Clip was valid; `insetIsDegenerate` rejected it as consume-lot. Conservation gate replaced heuristics. 280239 recovered 3,074 sqft / 45.4%. | Operator map-paint visual still owed. TABLES were never the defect. |
| 2026-08-24 ~11:41Z | P-60c stripes | LDT #469, PE #199 | Zero-width 7.62m strip-union spikes cleaned. Timeouts on facets chain. | |
| 2026-08-24 ~12:04Z | P-60d county-exact highlight | PE #200 `3c6be50` | Post-seal inspect ring from `sheet.geometry.rings`. Tile feature-state demoted to pre-seal. Consumed-lot outline prefers sheet ring with identity guard. | Added `inspectRingOverlays` as a third ring composer. Named follow-up: wrong-neighbor clicks at low zoom; tile rebake only if residue. |
| 2026-08-24 diagnosis | lot-shape forensics | read-only | Bastrop PMTiles vs county mesh: SAME CAD fabric, corners 1–8 cm. Visible offsets were tippecanoe simplification + tile-partial feature-state. Dual-fabric / terrain / stale-highlight theories DEAD for Bastrop. | Travis frontage-line is unmeasured. Do not import the Bastrop "one fabric" proof onto Travis without a Travis vertex check. |
| 2026-08-24 ~13:45Z | P-60e tile/mesh dedup | PE #201 `41bd963` | Hide PMTiles LINE when live mesh fetch ok, untruncated, >=1 feature. | **Lots vanished on zoom-in.** At parcel zoom the bbox is small, cap does not fire, tiles go opacity 0, mesh does not replace them. |
| 2026-08-24 ~15:06Z | P-60e fail-open | PE #203 `5dda5cb` | `shouldSuppressTileParcelLines` unconditionally false. Retry caps. Travis unusable-situs drop. | **Tile lines came back on top of live mesh.** This is the best clock for "it started in the last 48 hours / all over the map." Operator after #203: lots stay on zoom-in; hover paints different shapes; Pflugerville wedge missing on some lots. |
| 2026-08-24 ~16:19Z | Hover hit-test | PE #204 | Hover queries `PARCEL_TILES_FILL_ID` only. No `hits[0]` mesh fallback. | Paint stack not retired. Three geometries for one lot: click fill, hover (now tiles), post-seal inspect ring. |

### Find (closed — do not reopen)

| Cut | PR | What it closed |
| --- | --- | --- |
| Identity hops | #205 `0998faa` | Photon long string + rooftop → 280239. Gold 908 Pine → 34137. |
| Operator after #205 | — | Shapes PASS that frame (one ring per lot). Camera faster. Card FAIL: leftover Wainee `48021:35772` red card while bar said Simsbrook. |
| Sheet seal | #206 `1eed1a4` | Unplaceable is honest absence. Find cancels leftover resolve. Wainee seals decline. Simsbrook Find then docked 280239. |
| Photon compact | #207 `37d8550` | String hygiene. Did not fix operator dropdown pick. |
| Situs rooftop | #208 `db479df` `dpl_J2HQz9W86CezviRRYWJPZopwKUDk` | Address-point pick sends `trustedRooftop`. Photon is camera-only. Operator: "that worked finally." Card 280239 SF-S 25/7.5/20. |

Find leftover after #208: stacked paint on those same Travis lots. Not leftover Bastrop / Tahitian Village / Wainee card.

### Peel (shipped, did not clear the visual)

| Cut | PR | What it did |
| --- | --- | --- |
| Multi-shape peel | #209 `80c9ad4` `dpl_5vS8iCR67beCF4sWzXzZw912rxPu` | PE `toLiveOverlays(..., { peelParcelMesh: true })` omits live parcel LINE. `shouldSuppressTileParcelLines` stays false. Sealed inspect sets `countyRing` so that feature's tile stroke/fill/glow demote. Inventory + violation tests. Isolated tree `P:/tmp/hauska-map-paint-peel`. Linked Vercel project `property-explorer` (not cmdcenter). |

Operator visual after #209: leftover remains. Sidewalks toggle OFF does not remove it.

## Live data (do not treat the red card as missing store)

Probed 2026-08-24T20:16Z through `https://smartsite.cloud` (instrument `_probe_red_card.mjs` on the peel tree):

- GET facets `48453:280239` → **200 / 623ms** `source=baked-snapshot`. Zoning `SF-S` / `pflugerville_tx`. Facet `envelope` key is null (rings come from live derive).
- POST envelope `{ address: 17005 SIMSBROOK DR…, lat:30.459005, lng:-97.635421 }` → **200 / 1726ms** `status=ok` `parcel_node_id=48453:280239`.
- GET facets `48453:280238` → **200 / 309ms**.

Red box is `InspectCard` `source=live` + `env.status=error` = `factSheetResolver.resolve` throw / `kind: failed`. Unplaceable must not paint this box (#206). Data is there. A click that throws while the bar still says 17005 is the old search/card desync, not a bake hole.

Cortex serving pin last written: `cortex-api-00571-fay` @100%. Re-read traffic JSON by field name before quoting.

## Composer inventory (file already exists — extend it, do not re-derive from memory)

`_inbox/2026-08-24_p60_parcel_ring_composer_inventory.md` and `apps/property-explorer/src/browse/parcel-ring-peel.ts` on #209:

1. PMTiles LINE `parcel-tiles.js:addParcelTiles` — kept. Fail-open. `parcel-polygon` toggle owns visibility.
2. PMTiles feature-state stroke/fill/glow — pre-seal. `countyRing` should demote the sealed lot.
3. Live GIS mesh `toLiveOverlays` — **omitted on PE** after #209. CC still emits it.
4. Inspect ring `countyExactInspectOverlays` — sealed lot only. `#cfe8ff` 1.8px.
5. Envelope `envelopeInsetOverlay` — amber dashed `[3,2]` `#f2a23c`. At most one. Default ON.
6. Search overlay — transient cyan street box. Fades.

Missed in that inventory (read these write paths; sidewalks is already operator-rejected as the leftover):

- `pedestrian-ways` / `road-overlay.ts` — default ON on cold open. Operator toggled OFF. Still leftover. Do not stop at "it must be sidewalks."
- `road-nodes` ROW band — default OFF.
- `building-footprint` — default OFF. Tan fill, not amber dash.
- `topography-contours` — default ON.
- `hydrography` — default ON.
- Tile GLOW layer (9px subject halo) plus tile LINE — two strokes on the subject if `countyRing` did not fire.
- Overlay leftover layers that persist if `setOverlays` does not drop a prior `live-parcels` key after peel (read `overlay-render.js` reconcile). A peeled composer that never removes its old MapLibre layer will keep painting.

## History the last agent got wrong or left thin

1. First leftover report after #208 treated yellow dashed as envelope (keep one) and thin blues as mesh+tiles. #209 deleted the mesh. Visual still stacked. So either mesh is still painting through another path, or the extra line was never the mesh.
2. Planner then guessed sidewalks (cold-open default, street-front line). Operator falsified it.
3. P-60d "one fabric" is a **Bastrop** measurement. Do not use it as a Travis proof. The frontage line through every yard is the Travis question: is that a second CAD/ROW geometry inside the PMTiles, or an overlay.
4. #201 hide-tiles-when-fetch-ok is the defect that made lots vanish. Do not revive it. Paint-proof means the replacement layer is on the map and covering the viewport, not `status=ok`.
5. Hover is not the leftover. #204 closed hit-test.

## How to prove bake vs overlay (do this before any rebake)

Independently derived, not two fields from one payload:

A. Overlay path: MapLibre `queryRenderedFeatures` at a front-yard point (between house and curb, not on a lot line). Read `layer.id`. If it is `hauska-parcel-tiles-line` / glow / fill, it is tiles. If it is `hauska-ovl-*`, it is an overlay. Name the layerKey.

B. Tile source path: `querySourceFeatures` on `hauska-parcel-tiles` for the same parcel_node_id. Count rings / line parts. If one lot feature already contains a frontage chord that is not the lot outline, the bake carries it.

C. Toggle path: GIS Parcel Boundary off. If the extra frontage line dies, tiles or anything bound to `parcel-polygon` own it (tiles + any overlay keyed to that toggle). If it stays, it is another layer.

D. Inspect-only path: click a neighbor, then click empty. If the extra ring follows inspect, it is inspect/envelope/feature-state leak, not bake.

A bake claim without A+B agreeing is a vibe. Rebake is the last cut.

## Do not

- Reopen Photon labels, `compactEnvelopeAddressQuery`, `trustedRooftop`, #205/#207/#208
- `hits[0]` mesh hover
- `P:/seat-worktrees/property/hauska-map` or `fix/pe-pricing-a2`
- Reports / `feat/pe-workbench-verdict-reports`
- New map architecture
- Hide lots on zoom-in
- Rebake because the line "looks like CAD"
- Claim sidewalks after the operator already turned them off
- Claim hover is the leftover

## Lane 2 (parked, not cancelled)

A2 uncommitted on `P:/seat-worktrees/property/hauska-map` `fix/pe-pricing-a2` (behind origin/main; dirty PricingModal + checkout + tests). A checkout wipes it. After THIS paint leftover is actually gone and #209-class work is settled, rebase A2 onto main, operator visual, then deploy. Reports Option D only after that visual, new isolated tree, frames `_temp/Smart Site rebrand project (5)/handoff/Smart Site Reports Dock - Option D.dc.html`. Close must name that rebase as `leave_behind`. Pin `_inbox/2026-08-24_lane2_parked_after_paint.md`.

## Files

- Scratch (read first): `_scratch/setback-serve-wave.md`
- This handoff
- WDLL: `_inbox/2026-08-24_lane1_multi_shape_peel_WDLL.md` (items 2 and 3 still ungraded)
- Inventory: `_inbox/2026-08-24_p60_parcel_ring_composer_inventory.md` (incomplete; sidewalks/contours/hydro/glow/reconcile missing)
- Prior Find handoff: `_inbox/2026-08-24_multi_shape_paint_handoff.md` (stale on "mesh is the leftover")
- Isolated peel tree already exists: `P:/tmp/hauska-map-paint-peel` on `main` `80c9ad4`. You may use it or cut a fresh clone from `origin/main`. Do not worktree off the rooftop-pick clone — that git dir is shared with the property A2 tree.
- Probe: `P:/tmp/hauska-map-paint-peel/_probe_red_card.mjs`
- Operator frames: this chat, 2026-08-24 ~15:14 local, Simsbrook block, red card + stacked lines

## Close schema

Grade WDLL items 2 and 3 against the operator visual, not against #209 being merged. Leave-behind required (include A2 rebase). Update scratch with a timestamped GROUND-TRUTH. Do not promote MEMORY.md yourself.
````
