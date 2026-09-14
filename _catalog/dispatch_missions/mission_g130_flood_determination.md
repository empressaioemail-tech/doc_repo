# MISSION — G-130: which flood determination is authoritative

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

## This row RECOMMENDS. It does not build.

There is a ruling owed here that is not yours and not mine: **which of two flood-zone
derivations is authoritative.** Your job is to measure the disagreement, make a recommendation
with reasoning, and STOP. Do not pick one and wire it up.

A determination that ends up cited in a plan-review letter, or relied on by a city to skip an
engineer, is not a thing an agent chooses in passing.

## What is already established

Two findings, both quoted from the source, both already verified:

**The determination is dropped on the wire.** `hauska-engine`
`packages/retrieval/src/serving-sweep/bff-flow.ts` says so in its own comment:

> "the handler returns `mergeBakedBaseFacts(adapted, cortexBody)`, and `mergeBakedBaseFacts`
> builds its result from `{...atomResponse, ...}`. The atom response has no `tier2` key and the
> merge never adds one, so the cortex `tier2.flood` overlay — the only FEMA determination on this
> endpoint — is DROPPED from the wire for every parcel whose atom chain is usable. The sweep does
> not compensate for that. It measures it."

**Two stores derive it by different METHODS, not different vintages.** From
`packages/retrieval/src/duplicate-subject/subject-registry.ts`:

| Store | Method |
|---|---|
| `atoms:flood-hazard-fact` | parcel CENTROID, point-in-polygon against the local NFHL bulk table, bbox-filtered to the county, SFHA winning any tie |
| `pls:node-facets:tier2` | quantises the centroid to a 0.005-degree TILE, issues ONE live FEMA ArcGIS point query at the TILE CENTRE, reuses that answer for every parcel in the tile |

The registry's own words: *"a parcel's tier2 zone can be decided by a point up to ~366 m away.
That is the sampling difference; it is not staleness and it is not a split parcel."* And tier2
records **no edition path**, which forces its vintage undecidable.

## What to establish

**1. How often do they actually disagree?** Measure it, on a real county, with a stated
denominator. "They can disagree" is not a number. Report the rate and the population you measured
it over, and name what you excluded.

**2. Where does each one's answer end up?** Trace both to every consumer. Which surfaces show
which derivation today — PE, the MCP catalog, the record path, the PDF, plan review. The drop
described above means one of them may reach nobody; confirm that, and confirm the other's reach
rather than assuming it.

**3. Is the drop deliberate or incidental?** The comment says the sweep "measures it" rather than
compensating, which reads as a known, accepted state. Establish whether anything downstream
depends on tier2 being absent, before anyone restores it.

**4. Which is right?** Not which is convenient. A centroid point-in-polygon against a bulk table
and a tile-centre query up to 366 m away are not two opinions of equal standing. State the case
for each, including the case against your own recommendation.

**5. What would it take to give the surviving one a vintage?** tier2 has no edition path. If the
recommendation is tier2, that gap has to close; if it is the atom, confirm its `sourceVintage`
actually populates.

## Method

ENUMERATE BEFORE ASSERTING ABSENCE. Say what you searched.

State the mechanism explaining an observation, then a second mechanism that would produce the same
observation and why you rejected it. Both halves of this finding were originally discovered by
reading a write path, not by measuring output — keep reading code, and treat output measurement as
the weaker instrument it is.

Any measurement declares the commit, branch or data snapshot it ran against, in its output.

Never print secret VALUES. Env var names only. Every command exit-bounded (`timeout 120 ...`).

## Out of scope

The Flood and Drainage drainage study (G-125, G-129) — a completely different product that shares
one word. Do not fold them together. Any change to the merge, the stores, or the serving path.

## Close

Write your close to `_inbox/2026-09-14_g130_flood_determination_recommendation.md`.

Lead with the disagreement RATE and its denominator, then the recommendation in one sentence, then
the case against it. End with what an operator needs to decide and what it would cost to implement
each option. Change nothing.
