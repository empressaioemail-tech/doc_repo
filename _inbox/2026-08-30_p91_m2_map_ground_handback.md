---
id: 2026-08-30_p91_m2_map_ground_handback
title: P-91 v3 M-2 handback, aerial ground under the parcel drawing
date: 2026-08-30
status: returned
plan_row: P-91 v3 M-2
---

# P-91 v3 M-2 handback

Snapshot: repository `legacy-design-tools` worktree `P:/tmp/legacy-design-tools-p91-stone`, branch `feat/p91-v3-map`, commit `28969a36cc55b32247aeb3d362ae4f2d3054bf49`. No commit, no push, no deploy. Working tree carries the change for the planner to read.

## What was built

An aerial underlay beneath the existing SVG parcel drawing. No map library, no dependency added, no pan, no zoom, no camera controls, and nothing in the UI promising any. Web Mercator is computed in the module and the mosaic is a handful of `<img>` tiles placed behind the drawing.

`src/mcp-app.ts` is the only source file touched.

`ringFit` and `ringPixel` were extracted from `ringSvg`, which now calls them. This is the whole registration mechanism. The ring's origin is the parcel centroid and the anchor names that same point, so `ringPixel(fit, 0, 0)` is both the ring origin pixel and the anchor pixel: one call to one function, not two derivations kept in step. `ringSvg` output is byte identical after the extraction, which the existing hardened suite confirms.

The ground block adds the tile template (the single source of both the fetched url and the declared CSP origin), the projection pair `groundWorldPixel` and `groundLatLon`, `groundMetresPerPixel` and `groundPixelsPerFoot` carrying the cosine and the 1200/3937 survey foot, `groundZoomFor`, `groundPlan`, and the three html producers `groundLayerHtml`, `groundNoteHtml`, `groundWrapHtml`.

`PanelModel` gained `anchor` and `anchorRead`. `parseToolResult` reads both off the top level of the body, where the M-1 lane attaches them. `anchorRead` is parsed as an object with a four value status; a bare string, an unknown status, or a coordinate arriving under a non ok status are each read as nothing.

`renderParcelDraw` gained an optional second parameter for the toggle state and now composes `groundWrapHtml(svg, plan, on)` in place of the bare svg. The served `render()` calls the same two functions. Neither hand copies logic: every helper is in `INLINE_SHARED`, so the served script runs the tested code by source.

The panel gained a local `groundOn` flag on the Report toggle's exact pattern: reset to on with every accepted result, read from nowhere else, and off removes every tile from the html rather than hiding it, so a switched off ground issues no tile request.

`htmlContractViolations` gained two rules, `ground_unbound` and `ground_tile_axis_transposed`. The `direct_network` predicate was read and is neither tripped nor widened: tile `<img>` elements are not `fetch`, `XMLHttpRequest` or `WebSocket`, and the predicate has no removed line in the diff.

`RESOURCE_CSP_DOMAINS` is derived from the tile template's origin and unioned with the p559 probe domains. Today it equals `PROBE_CSP_DOMAINS`, so the existing probe registration test still passes unchanged; it stops equalling it the moment the template moves, which is the point of deriving it.

`PANEL_ANCHOR_ACCEPTS_WIRE` is a compile time link asserting the producer's `ParcelAnchor` is readable as the panel's `PanelAnchor`. Verified by violation on scratch copies: renaming `lat` in the producer's type makes `tsc` fail at that line with TS2322.

## Zoom selection rule and why

`groundZoomFor` walks levels from 14 upward and returns the first whose ground resolution carries at least two image pixels per viewBox unit, clamped to 19.

Two image pixels per viewBox unit because the 320 unit viewBox paints at roughly twice its unit width on a retina panel, so one image pixel per unit would visibly soften.

The cap is 19 because Esri publishes World Imagery to level 19 broadly and past 19 only in selected areas, where an over zoomed request answers with a placeholder rather than imagery. A placeholder tile is exactly the grey box standing in for imagery that the brief forbids, so a small parcel is honestly upscaled instead. In practice a residential parcel lands at 19 and a large rural tract steps down; a 25,000 foot ring takes a coarser level than a 100 foot ring, and the test asserts both that the chosen level clears the target and that the level below it does not.

Above the mosaic cap of 36 tiles there is no ground and a declared `ground_tile_cap` reason, not a partial paint.

## Fixture list

`tests/mcp-app-ground.test.ts` is new, 49 tests. `tests/mcp-app-served.test.ts` gained 7.

Constants derived not asserted: zoom 0 resolution against the sphere's circumference over one tile; the foot against 1200/3937 with an explicit assertion it is not 0.3048; the cosine term present in the ratio between Bastrop and the equator.

Round trip: lat/lon to world pixel and back within 1e-6 degrees at three zooms and three latitudes; tile index plus pixel offset reconstructing the coordinate; a transposed world pixel pair failing to round trip, so the round trip is not vacuous.

Tile path order: the tile id against the slippy map formula written in its asinh form, plus a pinned literal so a change to both derivations still fails; the url's last three segments read back as z, row, column; swapping the last two naming a different tile; and the url a plan emits decoded back through the inverse projection onto the anchor.

Registration: the anchor projected through Mercator landing on the ring's own origin within 1e-9 viewBox units, and that origin sitting inside the drawing rather than at a degenerate corner.

Scale: a one foot ground displacement north and east spanning the same viewBox distance as one foot of the ring, at Bastrop and again at 59.9 degrees where the cosine is materially different. The expected side comes from the drawing's foot frame and knows nothing about Mercator. One foot rather than a hundred because the projection's own second order term at one foot is near 3e-8 relative, two orders below the 2e-6 the international foot introduces, which lets the tolerance separate them. Plus one tile spanning the ground width its resolution predicts.

Fail closed: absent, error and skipped each rendering byte identical to a model with no anchor at all; the same for a good coordinate arriving under each of those statuses; a status of ok carrying no coordinate; zero, non finite and off world coordinates; no ring; and a missing read. Every one asserts no `<img>`, no `arcgisonline`, no `gwrap`.

Painted ground: one img per planned tile at the planned place, the source named, the vintage stated as unstated with an assertion that no four digit year appears anywhere, the toggle carrying its own state, off removing every tile while keeping the way back, and the svg on top byte identical to the svg with no ground.

Existing drawing behavior with ground on and off: both edge hover ids, the neighbor dash, the zoning family and district text, the flood tint, the north arrow, the scale bar and unit reference, the tip and the frame note; plus the ROW rule asserted where it lives, that the neighbor across a right of way is named and gets no door while an adjoining neighbor does.

Served panel: tiles painted under the drawing with the svg byte identical to the no ground case; every non ok read painting the void; a forged coordinate under a non ok read dropped; the toggle repainting and sending nothing with an unchanged panel fingerprint; the toggle resetting to on with every accepted result; edge hover and the report control undisturbed; and no ground toggle on a board.

## Mutation table

Each mutation was applied to the source, the whole suite run, and the source restored. Every one is caught, and after two additions no mutation is caught by fewer than two fixtures.

| Mutation | Fixtures that fail |
| --- | --- |
| tile path built as z/x/y | the url puts the row before the column; the tile url a plan emits decodes back onto the anchor |
| cos(latitude) dropped from ground resolution | ground resolution carries cos(latitude); one foot displacement at Bastrop; and at 59.9 degrees |
| 0.3048 instead of 1200/3937 | the foot is the US survey foot; one foot displacement at Bastrop; and at 59.9 degrees; one tile spans the ground width predicted; pixelsPerFoot is metres per foot over metres per pixel |
| y sign inverted in groundVbFromWorld | one foot displacement at Bastrop; and at 59.9 degrees; every tile covers the viewBox |
| non ok anchor allowed to paint | a perfectly good coordinate under a non ok read paints nothing; absent, error and skipped each paint the void ground |
| anchor placed at the viewBox centre rather than the ring origin | projecting the anchor lands on the ring's own origin; one foot displacement at Bastrop; and at 59.9 degrees |

The first pass found two weak spots and both were closed rather than reported as adequate. The transposed path was caught by a single assertion phrased against the url builder's own output, which any assertion of that shape would accept if the builder and the fixture were changed together; the decode fixture inverts the projection instead. The non ok anchor was caught only by a reason string, and only because the parse layer already drops a coordinate under a non ok read, so the guard in `groundPlan` was reachable only through another guard; the added fixture calls `groundPlan` directly with a good coordinate and a bad read and asserts on the painted html.

The `ground_unbound` and `ground_tile_axis_transposed` contract rules were also verified by violation, on four separately mutilated copies of the served page.

## Contradicting the brief

One deviation, deliberate, and it is the only place the drawing's rendering changes.

The ring polygon fills with `var(--ss-void)` at 55 percent opacity. Over nothing that is correct. Over aerial imagery it is a scrim that hides the roof the ground exists to show, which would make the feature look broken while every test passed. One CSS line, `.gwrap[data-ground="on"] .ring-fill{fill-opacity:.16}`, drops that to 16 percent, scoped to ground on, so with the ground off or absent the drawing renders exactly as it does today. No markup changed and the svg string is byte identical either way, which the tests assert. If the operator reads "drawing on top, unchanged" as covering rendered opacity, delete that one line and nothing else moves.

Two smaller notes. The brief says `<img>` tiles; that is what was built, in a wrapper div whose box is the svg's box, rather than SVG `<image>` elements inside `ringSvg`, specifically so `ringSvg` output stays byte identical and the hardened suite keeps its grip on it. And `PROBE_NET_TARGETS` still carries its own literal `.../tile/0/0/0` url; at 0/0/0 the axis order is unobservable, and that constant belongs to the p559 probe lane, so it was left alone rather than rewritten through the template.

## Left undone

`leave_behind`:
- item: the aerial vintage is stated as unknown, and it will stay unknown while the source is Esri World Imagery, which publishes no per tile capture date. If a dated imagery source is ever wanted the label and its source constant are the two places to change.
  owner: planner
  plan_row: P-91 v3 backlog
- item: level 19 is the cap. A dense urban parcel could carry level 20 or better where Esri publishes it, but nothing here detects per area availability, and an over zoomed request returns a placeholder rather than a failure, so raising the cap needs a detector first.
  owner: planner
  plan_row: P-91 v3 backlog
- item: whether the host actually honors the declared `resourceDomains` is still unmeasured. The p559 probe measured `fetch` reachability, not img loading under the host CSP. The first live panel render answers it.
  owner: planner
  plan_row: P-91 v3 M-2 live QA

Nothing else. No branch, no store, no parallel project, no adapter.

## Verification, raw

```
$ cd P:/tmp/legacy-design-tools-p91-stone/artifacts/smartsite-mcp && npx vitest run
 Test Files  16 passed (16)
      Tests  323 passed (323)
   Start at  18:34:24
   Duration  2.45s (transform 1.58s, setup 0ms, collect 9.42s, tests 1.59s, environment 2ms, prepare 2.83s)

$ cd P:/tmp/legacy-design-tools-p91-stone && git status --short -- artifacts/smartsite-mcp
 M artifacts/smartsite-mcp/src/cortex-client.ts
 M artifacts/smartsite-mcp/src/mcp-app.ts
 M artifacts/smartsite-mcp/src/tools.ts
 M artifacts/smartsite-mcp/tests/mcp-app-served.test.ts
 M artifacts/smartsite-mcp/tests/tools.test.ts
?? artifacts/smartsite-mcp/cloudbuild.p547.yaml
?? artifacts/smartsite-mcp/cloudbuild.p548.yaml
?? artifacts/smartsite-mcp/cloudbuild.p549.yaml
?? artifacts/smartsite-mcp/cloudbuild.p550.yaml
?? artifacts/smartsite-mcp/cloudbuild.p551.yaml
?? artifacts/smartsite-mcp/cloudbuild.p552.yaml
?? artifacts/smartsite-mcp/cloudbuild.p553.yaml
?? artifacts/smartsite-mcp/cloudbuild.p554.yaml
?? artifacts/smartsite-mcp/src/parcel-anchor.ts
?? artifacts/smartsite-mcp/tests/cortex-client-timeout.test.ts
?? artifacts/smartsite-mcp/tests/mcp-app-ground.test.ts
?? artifacts/smartsite-mcp/tests/parcel-anchor.test.ts

$ cd P:/tmp/legacy-design-tools-p91-stone && git diff --stat -- artifacts/smartsite-mcp
 artifacts/smartsite-mcp/src/cortex-client.ts       |  12 +-
 artifacts/smartsite-mcp/src/mcp-app.ts             | 526 ++++++++++++++++++++-
 artifacts/smartsite-mcp/src/tools.ts               |  30 +-
 .../smartsite-mcp/tests/mcp-app-served.test.ts     | 124 +++++
 artifacts/smartsite-mcp/tests/tools.test.ts        |  18 +-
 5 files changed, 695 insertions(+), 15 deletions(-)
```

`src/cortex-client.ts`, `src/tools.ts`, `tests/tools.test.ts` and the untracked `src/parcel-anchor.ts`, `tests/parcel-anchor.test.ts`, `tests/cortex-client-timeout.test.ts` and cloudbuild files were already modified or present in the tree at the start of this lane and were not touched. This lane wrote `src/mcp-app.ts`, `tests/mcp-app-ground.test.ts` (new) and an appended block in `tests/mcp-app-served.test.ts`. Nothing outside `artifacts/smartsite-mcp` is modified.

Test count went 267 to 323. The tool catalog is unchanged at 13.
