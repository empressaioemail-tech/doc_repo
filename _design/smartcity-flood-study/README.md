# SmartCity Flood study

**Artifact:** https://claude.ai/artifact/2jGyRNawCuUyCSfffGMSuB
**Decision:** none yet — operator review owed. Governed by
`_decisions/2026-09-14_flood_determination_authority.md` (G-130).
**Plan rows:** OPS-17 G-125 (rainfall control, closed), G-129 (flood mount, closed-partial,
deployed). Implementation row for this design: allocate at dispatch.
**Status:** draft, 2026-09-15. Not ratified, not dispatched.

Five artboards: screening, one parcel, depth comparison, running, unavailable.

## Drawn against the engine, not the screenshot

The study fields, legend wording, depth bound and failure classes come from
`hauska-map/apps/property-explorer`: `api/_lib/pe-flood-drainage-core.ts`,
`src/workbench/tools/FloodTool.tsx`, `src/workbench/tools/flood-viz.ts`. The engine returns
catchment, graded drainage zones, ponding at a chosen depth, flow paths, exits, a briefing and
a Sheet-Standard PDF, and accepts `rainfallDepthInches` in (0, 60].

No figure on any artboard is measured. Fixture throughout.

## What is there today, and what this changes

The live tab is a paragraph explaining what a drainage study would be, a disabled
**Open on the map** button, and two internal basis lines. It is a placeholder.

**Move 1 — the tab becomes a screen, not a viewer.** It sits beside Pipeline, Inspections and
Work orders, so the question it should answer is which of the permits in flight are on parcels
that pond, not show me this parcel. That is what makes it a Development services tab rather
than a map tool that happens to live there.

**Move 2 — two determinations, never blended.** The regulatory FEMA zone and the modeled
drainage study answer different questions. Today one paragraph says so. Here it is structural:
separate cards, separate authority, separate vintage, and the model is badged
`NOT A DETERMINATION`. The row the screen exists for is Zone X that still models ponding, and
it is never drawn as a contradiction.

**Move 3 — depth is a control, and it governs the lens.** Changing the design storm re-ranks
the whole screening list rather than one report. The four-inch question was asked by the city;
making it one click is most of the value.

**Move 4 — running is a real state.** A study is a DEM fetch plus hydrology, tens of seconds
per parcel, with a real timeout class in the engine core. The run is named, survives
navigation, and a timed-out parcel stays retryable rather than being written down as no
ponding. An engine that did not answer and a parcel that does not pond are different results.

## The ruling is enforced in the UI

G-130 makes the flood rail authoritative for **serving** and provisional for **citation**
until a ground-truth sample runs against its own output. So the study downloads, and citing it
in a review letter is refused on the page with that reason. A ruling that lives only in a
decision record is not a control.

## Corrected 2026-09-15 after an adversarial pass against source

An earlier draft asserted several things the engine has no concept of, and put the ruling in
the wrong place. Recorded because each is a shape that will recur.

**Invented parameters.** "Design storm, rainfall depth over 24 hours" and presets labelled
2-year / 10-year / 100-year. The contract carries a bare depth. There is no duration in it and
no depth-to-return-period table anywhere in the source, so both were fabricated. Now the
control is depth only, and the basis line says naming them by return period needs a local
rainfall atlas nobody has cited.

**Invented outputs.** "Structure footprint reached" and "Zone concentration under the
footprint". There is no building-footprint layer in the study, and the zone grade is an
ORDINAL position in the served feature list, not a measured concentration. Both removed.

**The ruling on the wrong artifact.** The citation refusal sat under the drainage study, which
G-130 does not govern, while the regulatory zone card carried no restriction at all. That was
simultaneously an overclaim and an underclaim. It now sits on the zone card, as a refused
affordance rather than a sentence, because the canvas annotation itself said a paragraph is
not a control.

**A legend that dropped its own thesis.** The FEMA reference layer was missing from the legend
even though the design's whole argument is that the two answers are shown side by side, and
the source draws it on the same picture. Restored, with the source's nine entries in source
order, ponding conditional as the source makes it, and exits drawn as bearing-carrying
diamonds rather than plain circles.

**A picture that disagreed with its own numbers.** The ponding ellipse covered about 65 to 100
percent of the parcel ring while the panel beside it said 34 and 73 percent. Radii are now
computed from the stated share against the ring's own area, so the drawing cannot drift from
the figure again.

**One empty missing, one invented.** `study.honestEmpty` — the engine ran, declined, and
supplies a reason to render verbatim — was absent entirely, and the artboard paired a
capability gap against the zero-ponding result. All three now sit on one artboard.

Also fixed: an exits count that disagreed with the parcel study, a parcel reported as both
ponding and not ponding on two artboards, a panel whose title contradicted its rows, an
ungranted pack showing four lenses as LIVE RECORDS, a rail toggle reading Full while rendering
docked, and a four-column legend in a 400px rail that ellipsized six of nine labels and made
the three graded bands indistinguishable.

## Pinned, deliberately not designed here

The regulatory zone's own provenance panel. The ruling requires the surviving determination to
carry a vintage, and the artboards show one, but the full edition-path and fallback-to-atoms
display is its own pass.

Entitlement. 401 sign-in and 402 locked-property are the dominant gate on this report in
Property Explorer and are on no artboard here. Named on the canvas as owed, not drawn.

Incident-time use. The layer catalog already carries live stream gauges, low water crossings
and BEFCO monitoring points, which is an emergency-response surface rather than a development
screening one, and mixing them would make this tab two products.

## Regenerate

    node gen.mjs        # rewrites the five .dc.html artboards + canvas.json
