# All designs on one canvas

**Artifact:** https://claude.ai/artifact/FBWcVY3f1gRa3HswLoeQaY
**Rebuild:** `node build.mjs`, then `node seed-canvas.mjs` (writes the page to publish)
**Status:** derived view, last republished 2026-09-17 (version 11). Ratify designs in their own folders, never here.

72 artboards across 17 surfaces, one row per surface. The applicant precheck is the first
row because it is the newest and the one under discussion. After it, the rows read top to
bottom as shipped, then designed-and-never-built, then the drafts, then the one kept as a
record.

| Row | Surface | Boards | Status |
|---|---|---|---|
| 1 | Applicant precheck | 10 | DRAFT 2026-09-17, not ratified; added first so it is found first |
| 2 | Overview | 3 | RATIFIED, shipped G-120 |
| 3 | Development services | 6 | shipped G-123; completed and corrected 2026-09-15 |
| 4 | Map dock | 3 | APPROVED, shipped G-128 |
| 5 | Plan review | 3 | SUPERSEDED by the reasoner path, kept as a record |
| 6 | Flood study | 5 | RATIFIED 2026-09-15 |
| 7 | Plan review, the reasoner path | 5 | RATIFIED 2026-09-15; the design a city is shown |
| 8 | Plan review, parallel departments | 5 | DRAFT. May be shown, cannot be built: gate amendment DEFERRED with a trigger |
| 9 | Finance lens | 5 | DRAFT 2026-09-15, not ratified |
| 10 | Finance, Localgov filings | 5 | AMEND, not ratified |
| 11 | Smart Files | 5 | DRAFT 2026-09-15, not ratified |
| 12 | Public works lens | 4 | DRAFT 2026-09-15, not ratified (G-145) |
| 13 | Parks lens | 2 | DRAFT 2026-09-15, not ratified (G-145) |
| 14 | Police lens | 4 | DRAFT 2026-09-16, not ratified (G-145) |
| 15 | Fire and EMS lens | 2 | DRAFT 2026-09-15, not ratified (G-145) |
| 16 | Fleet lens | 2 | DRAFT 2026-09-16, not ratified (G-145) |
| 17 | Place tab | 3 | SUPERSEDED, kept on purpose |

Rows 1 and 12 to 16 were added 2026-09-17. The five lens folders had been drawn on
2026-09-15 and 2026-09-16 and never reached this canvas, so a reviewer here could not see
them; they now sit with the rest.

## Publishing

The published page is one file: the canvas editor plus a JSON block (`appifact-doc`)
holding every artboard and `canvas.json`. `seed-canvas.mjs` takes the editor from an
earlier seeded page and replaces only that block. It refuses if anything outside the block
changes, or if any artboard fails a round trip. The earlier seeding script was never
committed, so it was rebuilt on 2026-09-17. If `all-smartcity-designs.html` is gone,
download the live page to disk (Artifact read, path `index.html`) and pass it as `--shell`.
The artifact tool refuses a republish until the live version has been viewed in the same
session, so read the URL first.

Link viewers see a pinned earlier version rather than the live one, per the artifact's
sharing state on 2026-09-17. The owner sees the live version.

The Development services row grew from three boards to six on 2026-09-15: Inspections, Code enforcement and
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
