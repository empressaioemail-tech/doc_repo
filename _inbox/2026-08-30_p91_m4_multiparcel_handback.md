---
id: 2026-08-30_p91_m4_multiparcel_handback
title: P-91 v3 M-4 handback, more than one parcel on one canvas
date: 2026-08-30
status: returned
plan_row: P-91 v3 M-4
---

## Snapshot

Repository `legacy-design-tools`, worktree `P:/tmp/legacy-design-tools-p91-stone`, branch `feat/p91-v3-multi`, base commit `121bc2d0ab5f6e12ea37b23bf2bec4a3d62beca2` (`feat(p91): v3 map ground, p560`). Working tree, not committed: subagents do not commit. Test suite 373 passing across 17 files, up from the 323 across 16 the branch stood at.

## What was built

Two halves, as the card scoped them.

**Half one, anchors for a batch.** `src/parcel-anchor.ts` gained `ANCHOR_BATCH_READ_CAP`, `readParcelAnchorsForBatch` and `attachBatchAnchorsToResponseText`, and lost `ANCHOR_READ_CAP` and `skippedAnchorForBatch`, which the change made into lies rather than into dead code. A node-depth array now issues one facets read per parcel for the first N ids, concurrently, each still bounded by the existing two second timeout. Every row of the response body carries its own `anchorRead`, including the rows past the cap, which carry an explicit skip naming the cap; the batch's own `anchorBatch` declaration sits at the top level with `cap`, `received`, `attempted` and `notAttempted`, plus a reason whenever the last of those is above zero. `attempted` counts reads ISSUED, never reads that returned a coordinate, so the object cannot be read as coverage. A single failed read inside a batch is that parcel's declared absence and cannot fail its neighbours or the panel, because `readParcelAnchor` still turns every upstream failure into a declared outcome.

`src/tools.ts` routes on arity and depth: a single id at node depth reads one anchor as before, a node ARRAY takes the batch path, and anything at stub depth still declares that a stub row carries no draw and reads nothing. Both reads are issued alongside the brief, so the panel waits max(brief, anchors) and the twelve run concurrently.

**Half two, the canvas.** `src/mcp-app.ts` gained a `parcels` panel kind, the `PanelParcel` and `PanelAnchorBatch` wire readings, `parcelsFromBatch`, `multiParcelPlan`, `multiCanvasSvg`, `multiDrawnHtml`, `multiUndrawnHtml`, `multiGroundNoteHtml`, `anchorBatchNoteHtml` and `renderParcelSet`, all thirteen registered in `INLINE_SHARED` so the served panel runs this code rather than a hand copy, and all of their constants emitted into the served scope beside the existing ground constants.

The composition reuses rather than reimplements. Each drawable parcel is offset from the FIRST drawable parcel's anchor through Web Mercator world pixels, its own feet converted to reference feet by the ratio of the two Mercator scales, and the whole set is then handed to `ringFit`, `ringPixel` and `groundPlan`, the same three functions that place a single parcel. The multi ground is literally `groundPlan(composedRing, referenceAnchor, {status: "ok"})`. That is why the imagery registers with the rings: one arithmetic, not two kept in step. No new projection, no second fit, no new tile code.

Nobody invents a shared origin. The frame origin is a read coordinate, not a mean of the anchors and not a bounding box centre. Labels sit at each parcel's own anchor, which the frame contract already defines as that parcel's centroid.

The parser reads the set branch BEFORE the existing single-parcel branch, because that branch takes `parcels[0]` and paints it alone. Painting one of three was the silent omission the card exists to end.

Files: `src/mcp-app.ts` +562, `src/parcel-anchor.ts` +150, `src/tools.ts` +50, `tests/mcp-app-multi.test.ts` new (34 tests), `tests/mcp-app-served.test.ts` +142 (8 tests), `tests/parcel-anchor.test.ts` +227, `tests/tools.test.ts` +43. Nothing outside `artifacts/smartsite-mcp`. The tool catalog is unchanged at 13.

## The cap I chose, and why

`ANCHOR_BATCH_READ_CAP = 12`.

Two bounds, and twelve is where the tighter one sits. The canvas is a 320 by 220 viewBox with 28 units of pad, so 264 units of width carry the whole set; past about a dozen rings the labels cannot be placed without collision, and a thirteenth anchor would buy a declaration rather than a drawing. Separately, the published node array cap is 25, so twelve holds one tool call's side reads under half that ceiling. The reads are concurrent and each carries the existing timeout, so the count bounds the burst, not the latency: the anchor phase is bounded by the timeout regardless of N.

The cap is real and it is declared. A 25 id array reads twelve, names the other thirteen individually with `skipped / anchor_read_batch_cap`, and states the count once in `anchorBatch`.

## The extent threshold I chose, and why

`MULTI_GROUND_MAX_EXTENT_FT = 5280`, one mile, measured as the larger of the set's two bounding sides in feet.

Legibility is the binding reason. The drawing area is 264 viewBox units wide, so at a one mile extent a 120 foot frontage is six units. Below that a ring is a dot and imagery under dots is decoration rather than information. The imagery reason agrees and is looser: at the zoom floor and Texas latitude the ground resolution is about 8.3 m per map pixel and a one mile extent mosaics in a handful of tiles, well inside `GROUND_MAX_TILES`. The tile cap therefore stays armed and still fails closed, but it is not what a user meets first, and the refusal a user does meet is stated in feet, which they can act on.

Above the threshold the rings are drawn and the ground is refused with `multi_ground_extent`, the note stating the number from the constant rather than from prose. A test asserts the imagery is absent from the html entirely, not hidden.

## Fixtures

Composition: three same-block parcels one lot apart in west to east order on one line, with the separation read back in feet; adjacent lots abut rather than overlap; two RECORDED coordinates fixing both axes with no arithmetic at all (a lower latitude lands lower on screen, a lower longitude lands left); a second north-south check on different recorded ids; a ring's own north vertex above its own south vertex; a ring drawn at its own latitude's Mercator scale; the ground and the rings placing the same anchor at the same point through two different call paths; one polygon, one hit area and one label per drawn parcel; the click drafting the ordinary Open turn and fetching nothing.

Honesty: an anchor with no ring; a ring with no anchor; a row with neither, named for BOTH absences; a row with no `anchorRead` at all; a mixed batch where three anchors failed three different ways, each named with its own reason while the two that read are still drawn; an id the lookup did not return; and a partition check asserting that the drawn list and the named list together cover every parcel exactly once.

Arity: one drawable parcel makes no plan; a batch with one anchored parcel falls back to today's single parcel panel byte for byte; a single id result is untouched and still carries its own ground.

Truncation: at the cap nothing is declared because there is nothing to declare; over the cap the page names how many were read, how many were not and why, and the parcels past the cap are ALSO named one by one; a malformed `anchorBatch` is no declaration rather than a made up one. At the module level: exactly the first twelve ids are read in request order; one parcel's timeout is that parcel's declared error and its neighbours still return coordinates; every row past the cap carries its own skip; an upstream `anchor` on a row is dropped before ours is written.

Extent: two recorded parcels about 6,200 ft apart draw with no ground and state the threshold; a set inside the threshold keeps its imagery; the extent threshold binds before the tile cap; the ground toggle is off the page entirely when there is no ground.

Served: the iframe paints one canvas with two rings at different x over the aerial ground; an undrawn parcel is named on the page with its reason; the truncation is stated; a canvas click reads its node id off the painted html and drafts the Open turn; the ground toggle works on a set and removes every tile rather than hiding it, and resets on the next accepted result; a one-drawable batch paints today's single parcel panel.

Real data. `48021:34137` at 30.11021, -97.31631 is the live read the card supplied. `48021:31254`, `48021:49295` and `48021:82112` carry the coordinates the M-1 lane recorded from deployed cortex the same day. The two same-block neighbour anchors, `48021:34169` west and `48021:34161` east, are SYNTHETIC and labelled so in the file: they are constructed one recorded lot width off 34137 using that parcel's own recorded ring, so the fixture is internally consistent with the geometry it is drawn from. No assertion claims any number is true of Bastrop; what is asserted is that a parcel placed N feet east lands N feet east. The composition is checked against a second expression of Web Mercator written in the test in degrees (PI times R over 180), where the module goes through tile pixels (2 PI R over 256). Those two share a sphere and nothing else.

## Mutation table

Each mutation was applied to the source, the whole suite run, the failures recorded, and the source restored. Two passes: the first found one vacuous check and two thin ones, fixtures were added, and the second pass is below.

| # | Mutation | Fixtures that fail |
|---|---|---|
| M1 | Drop the per-parcel anchor offset, so every ring stacks on one point | 8 |
| M2 | Omit an undrawable parcel from the named list | 10 |
| M2b | Keep the list but drop it from the rendered page | 3 |
| M3 | Let a one-drawable result still paint a canvas (`MULTI_MIN_DRAWN` 2 to 1) | 4 |
| M4 | Remove the truncation declaration from the page | 2 |
| M5 | Drop the north inversion in the anchor offset, mirroring the set | 2 |
| M6 | Remove the extent threshold and stretch imagery over any set | 2 |
| M7 | Ignore the batch cap and read every id | 3 |
| M8 | Drop the per-parcel Mercator scale correction | 1 |

Two findings the table produced, both fixed rather than reported and left.

M8 passed on the first run: dropping the per-parcel scale correction failed nothing, because at a block's separation the correction is one part in ten million and no tolerance could see it. That check was vacuous. It now has a fixture at a synthetic latitude 60 anchor, clearly labelled non-Texas and present only to make the correction measurable, asserting the ring is drawn cos(30.11)/cos(60) times wider there, with the expected ratio computed from cosines and nowhere near the module's path.

M5 and M7 each had exactly one catcher on the first run. One catcher is one edit away from none, so a redundant north-south fixture on different recorded ids and three module-level cap fixtures were added. Both now have two or more.

## Contract check

`htmlContractViolations(buildAppHtml())` returns the empty array, asserted as a fixture. `direct_network` was neither tripped nor widened: the diff touches no line of that rule and the canvas adds no `fetch`, `XMLHttpRequest` or `WebSocket`; the only network the set view causes is the same tile `<img>` elements the M-2 ground already emits. A new check, `multi_canvas_unbound`, was added beside the ground checks and requires the canvas, both named lists and the truncation note to be present in the served script by source. It was verified by violation: removing the undrawn list's title from the page makes it fire, asserted as a fixture.

## Anything contradicting the brief

Nothing in the build. Two things to know.

**The seat gate fired and I did not edit around it deliberately.** `_catalog/seat_register.json` registers `P:/tmp/legacy-design-tools-p91-stone` on branch `feat/p91-v3-map`, while the dispatch instructed the checkout of `feat/p91-v3-multi`. `scripts/enforcement/seat-worktree-gate.mjs` blocked one Write into the worktree on that mismatch. The register entry is stale relative to the dispatch, and I did not touch it: doc_repo is out of scope for this lane bar the close artifact. The gate is worth a second look for a scope reason rather than this one: it refused the Write tool and does not refuse a file written by a shell command, which is the method the harness directs for edits and the method every other edit in this lane used. That is a control narrower than its claim, and the narrow half is silent.

**Pre-existing dirt in the worktree, not mine.** `cloudbuild.p559.yaml` is modified (a `p559` to `p560` image tag bump) and `cloudbuild.p547.yaml` through `cloudbuild.p554.yaml` are untracked. All nine were present at checkout, before this lane wrote anything, and are left exactly as found.

## Left undone

**The fallback state names nothing.** Below two drawable parcels the card says fall back to what the panel does today, and today's panel paints `parcels[0]` alone. In that one state the other rows of the array are named nowhere on the page. That is today's behaviour preserved as instructed, not a regression, and it is recorded as a passing fixture so it is a known gap rather than a later discovery. Widening it is its own card.

**The served fingerprint does not distinguish two sets.** `panelFingerprint` and the served `fingerprint()` are already two hand-maintained copies that already differ, and neither reads `parcels`. Two different parcel sets therefore fingerprint identically. Left alone: touching that pair is a separate concern with its own existing tests.

**Test files are typechecked by nothing.** The package tsconfig includes only `src`. `npx tsc -p tsconfig.json --noEmit` passes clean on src after `npx tsc -b lib/db`; the test files are compiled by esbuild at run time and never type checked by any project command. An ad hoc per-file `tsc` over the touched test files returns the same or fewer errors than the same command over the origin/main versions of those same files placed in the same directory, so nothing was introduced, but that instrument is noise from mismatched flags and is not a clean bill of health for anything.

## Leave behind

    leave_behind:
      - item: branch feat/p91-v3-multi in P:/tmp/legacy-design-tools-p91-stone, uncommitted working tree
        owner: planner
        plan_row: P-91 v3 M-4
      - item: seat_register.json entry for legacy-design-tools-p91-stone still names branch feat/p91-v3-map
        owner: planner
        plan_row: P-91 v3 M-4
      - item: seat-worktree-gate refuses the Write tool and not a shell-written file
        owner: planner
        plan_row: backlog
