# All designs on one canvas

**Artifact:** https://claude.ai/artifact/FBWcVY3f1gRa3HswLoeQaY
**Rebuild:** `node build.mjs`
**Status:** derived view, 2026-09-15. Ratify designs in their own folders, never here.

43 artboards across 10 surfaces, one row per surface, read top to bottom as shipped,
then designed-and-never-built, then drafted this week, then kept as a record.

| Row | Surface | Boards | Status |
|---|---|---|---|
| 1 | Overview | 3 | RATIFIED, shipped G-120 |
| 2 | Development services | 6 | shipped G-123; completed and corrected 2026-09-15 |
| 3 | Map dock | 3 | APPROVED, shipped G-128 |
| 4 | Plan review | 3 | IN REVIEW, never dispatched |
| 5 | Flood study | 5 | RATIFIED 2026-09-15 |
| 6 | Plan review, the reasoner path | 5 | RATIFIED 2026-09-15 |
| 7 | Plan review, parallel departments | 5 | DRAFT. May be shown, cannot be built: gate amendment DEFERRED with a trigger |
| 8 | Finance lens | 5 | DRAFT 2026-09-15, not ratified |
| 9 | Finance, Localgov filings | 5 | AMEND, not ratified |
| 10 | Place tab | 3 | SUPERSEDED, kept on purpose |

Row 2 grew from three boards to six on 2026-09-15: Inspections, Code enforcement and
Licenses ship in the nav and had never been designed, and that lens is what the first
cohort opens daily. The same pass removed a Place tab the product never had.

## This folder authors nothing

Every `.dc.html` here is a copy of a surface folder's own artboard, re-exported under a
unique stem because one canvas cannot hold seven files called `Main`. The copies and the
combined `canvas.json` are **derived and gitignored**; the tracked source is each surface
folder plus `build.mjs`.

To change a design: edit it in its own folder, run that folder's `gen.mjs`, then run
`build.mjs` here and republish. Never edit an artboard in this folder; the next build
overwrites it.

`Main.dc.html` is the Overview populated state, kept under that name because the canvas
needs an entry artboard and Overview is the product's own entry screen.

## What the build checks

Frame sizes are read from each artboard's real root rather than assumed: four boards are
not 1600x1040 (the three map-dock states are 1500x940, the plan-review embed is 1180x900)
and assuming would have clipped them. The build also refuses a duplicate stem and a canvas
with no entry artboard.
