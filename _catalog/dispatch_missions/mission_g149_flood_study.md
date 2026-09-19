## Mission

Build the **flood study lens** on `smartcity-dashboards`: the Development services tab stops being a
placeholder paragraph and becomes the screening screen the RATIFIED design of 2026-09-15 draws.

**The design and its instrument are DELIVERED. Do not rebuild either one.** The design is
`_design/smartcity-flood-study/` (RATIFIED 2026-09-15, `_decisions/2026-09-15_design_ratification_pass.md`,
governed by `_decisions/2026-09-14_flood_determination_authority.md`, the G-130 ruling). The instrument is
already in that folder and it EXITS 0:

- `check.mjs` — 45 self-tests both directions, 10 matched-input counters all non-zero, 5 artboards,
  12 depth presets, 9 legend entries, 7 run rows, 3 drawn ponding shapes
- `violate.mjs` — 30 named violations planted on real artboards, every one caught
- `dump-source-facts.mjs` -> `source-facts.json`, derived from `P:/hauska-map` `origin/main` `163fde32`

Run them. Do not write a second instrument, and do not re-derive the facts by hand. If `check.mjs` fails,
your build disagrees with the design and the design wins.

## Why this row is unblocked now, and why it was not before

Three separate things were holding it, and all three closed on 2026-09-19 before this dispatch was written:

- **G-165 CLOSED** (hauska-engine PR #478). The NOAA Atlas 14 parser never matched and silently served
  Bastrop's default depth to every county. The design's basis line cites a rainfall curve, and until the
  parser actually produced one, the label cited a value the engine invented. It now produces the curve.
- **G-164 / G-146 CLOSED** and the **design-completion-gate reads `FINISHED`, 18 of 18, exit 0**. This row's
  design was the last R3 finding, and it was held open by instruction rather than repaired, because
  repairing the sentence alone would have made the page agree with a depth the parser invented.
- **G-166 CLOSED** and `smartcity-dashboards` `origin/main` is green (`e99e564`), so a build here lands on a
  main that can carry it.

## What you are building, in the design's own four moves

**Move 1: the tab becomes a screen, not a viewer.** It sits beside Pipeline, Inspections and Work orders, so
the question it answers is *which of the permits in flight are on parcels that pond*, not *show me this
parcel*. That is what makes it a Development services tab rather than a map tool that happens to live there.

**Move 2: two determinations, never blended.** The regulatory FEMA zone and the modeled drainage study answer
different questions. Separate cards, separate authority, separate vintage, and the model badged
`NOT A DETERMINATION`. The row the screen exists for is **Zone X that still models ponding**, and it is never
drawn as a contradiction.

**Move 3: depth is a control and it governs the lens.** Changing the design storm re-ranks the whole
screening list rather than one report. The four-inch question was asked by the city; making it one click is
most of the value.

**Move 4: running is a real state.** A study is a DEM fetch plus hydrology, tens of seconds per parcel, with
a real timeout class in the engine core. The run is named, it survives navigation, and a timed-out parcel
stays RETRYABLE.

## Traps this design carries, each from a defect it already had

These are the shapes that were corrected during the adversarial pass of 2026-09-15 and again on 2026-09-19.
They will look like reasonable choices on the day.

1. **There is no duration.** An earlier draft said "design storm, rainfall depth over 24 hours". The contract
   carries a bare depth and has no concept of duration. Do not add one.
2. **The recurrence interval is paired to depth, and the basis line must say WHICH pair a reader sees.** The
   engine renders its own design storm as `100-yr (NOAA Atlas 14)` and a depth passed in the request as
   `≈N-yr equivalent (interpolated)`. Both are correct; silently showing one while the other is meant is not.
   The first correction after 2026-09-15 over-shot this by deleting the interval entirely, which was also wrong.
3. **`study.honestEmpty` is a field to render VERBATIM.** The engine ran, declined, and supplies its own
   reason. An earlier draft had this missing entirely and paired a capability gap against the zero-ponding
   result. Those are three different states, and collapsing them is the defect this row exists to prevent.
4. **An engine that did not answer and a parcel that does not pond are DIFFERENT RESULTS.** Never write a
   timeout down as no ponding.
5. **The G-130 ruling must be a REFUSED AFFORDANCE, not a sentence.** The flood rail is authoritative for
   serving and provisional for citation until a ground-truth sample runs against its own output, so the study
   downloads and citing it in a review letter is refused on the page with that reason. It sits on the ZONE
   card, which is what G-130 governs. The canvas annotation itself says a paragraph is not a control.
6. **The ponding drawing is computed from the stated share against the ring's own area.** An earlier draft drew
   an ellipse covering 65 to 100 percent of the ring while the panel beside it said 34 and 73 percent. Radii
   are derived so the picture cannot drift from the figure again.
7. **No invented outputs.** There is no building-footprint layer in the study, and the zone grade is an ORDINAL
   position in the served feature list, not a measured concentration. Both were removed; do not reintroduce them.
8. **The legend carries the FEMA reference layer**, because the design's whole argument is that the two answers
   are shown side by side. Nine entries in source order, ponding conditional as the source makes it, exits drawn
   as bearing-carrying diamonds.

Five artboards exist: screening, one parcel, depth comparison, running, unavailable. The built surface must
account for all five states.

## Preconditions you must confirm yourself before you write code

1. `node scripts/lane-claim.mjs claim --lane g149-flood-study --seat <your-seat-id> --plan-row G-149 --dispatch <this file>`
   The previous three lanes in this repo left their closes stranded in their worktrees, which is why a close
   now has to be filed to be graded. **Claim, and release at close.**
2. Work in your own registered worktree; never build in another lane's checkout.
3. **One dashboards lane at a time.** Confirm no other dashboards lane holds a live claim before you start.
4. Read `src/platform-base.mjs` before touching anything that reaches the platform. It has ONE env var with NO
   default and NO fallback by design, and a lane that adds a fallback to make something paint has broken the
   product's only guard against a silent environment miss.

## Leave-behind you already know about

`SMARTCITY_V1_PLATFORM_BASE` currently points at the auto-generated DigitalOcean hostname
`https://walrus-app-kzog6.ondigitalocean.app`, which is masked to every external client. It is carded as G-171
and is PLANNER-OWNED. Do not change it on your own initiative, and do not spend the lane debugging
`ECONNRESET` against that host: it is external-only, the app reaches it fine from where it runs, and two lanes
have now lost time to it.
