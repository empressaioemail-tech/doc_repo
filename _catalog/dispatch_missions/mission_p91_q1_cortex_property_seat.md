# Mission: the two cortex routes Q1 needs, one ruling, and a silent-degradation defect on the records path

Four items, three of them small. They are batched because they share a seat and a file tree, not because they are one piece of work. Item 4 is unrelated to Q1 and can be done first; it is the only one with a live customer consequence.

## Item 1. A radius search. This is the whole of `near`

Q1 wants `find_parcel` to gain `near: {query, radiusFt}`. Measurement established that the centre point is NOT the gap and is already solved three separate ways: `situs-search` address-point hits carry latitude and longitude, `POST /place/resolve` geocodes any address, and the node facets route serves `cityLimitsFact.queryPoint` per parcel (live-verified at `{-97.31654, 30.10981}` for `48021:34137`).

What does not exist anywhere in the place surface is the set search: given a point and a radius, return the parcels. `neighboring-context.atom.ts` is the one purpose-built abstraction and it is registration-only with zero route callers, so it is a dormant mechanism rather than an available one. Whether that atom is the right home or a new route is cleaner is your call, not the planner's.

Two constraints from the consuming side, so it gets built once:

A truncated result must DECLARE its truncation rather than resemble a complete answer. The MCP already runs this rule everywhere (`anchorBatch` names cap, received, attempted and notAttempted for exactly this reason). A radius that silently returns the first N is the defect class this program keeps finding, and it is invisible from outside.

The cap wants to be a stated number rather than an implicit one, because the MCP publishes caps in its tool descriptions the way the 25 and 50 caps are published today.

## Item 2. Bare street-name search

The smaller half of `street`. A house-number-prefixed query already works through the existing wrapper with no change. A bare street name, the "everyone on Pine St" case Q1 exists for, does not, because the prefix match is anchored on the full house-number-first address string. This may fall out of item 1; if it does, say so rather than building it twice.

## Item 3. Subdivision. A RULING is owed before any code

Do not widen the regex. This is a source question wearing a parsing question's clothes.

The evidence: no `txgio` column holds subdivision or legal text at all, and the source shapefile's `LEGAL_DESC` field is documented as deliberately not captured. The shipped parser was run against all six real `legalDescription` fixtures in the repo's own suite and extracted a subdivision on ZERO of six, including two that plainly name one.

So the ruling is: do we ACQUIRE a subdivision field, or does the parameter REFUSE with a stated reason. Per the v3 card's own rule, if it cannot parse reliably it refuses. A wider regex is the wrong answer and would produce confident wrong groupings, which is worse than the refusal because a bad grouping looks like an answer.

Return the ruling with its reasoning. If the answer is acquire, name the source and the cost per jurisdiction, because the cost rule applies.

## Item 4. The `BLOCK` defect. Unrelated to Q1, and the only one with a live consequence

`artifacts/api-server/src/lib/recordsSearchQueryPlan.ts:16` reads:

    /\bBLK(?:OCK)?\.?\s+(\d+[A-Z]?)\b/i

That alternation expands to `BLK` or `BLKOCK`. It can never match the literal word `BLOCK`. Verified by violation rather than by reading:

    NOMATCH  "BLOCK 3"
    MATCH    "BLK 3"  -> block=3
    MATCH    "BLK. 3"  -> block=3
    NOMATCH  "BLOCK 12A"
    NOMATCH  "PECAN GROVE BLOCK 3 LOT 5"

Intended pattern is `BL(?:OC)?K`, or plainly `BLK|BLOCK`.

This matters more than its size because it degrades SILENTLY. A legal description carrying `BLOCK 3` yields no block term, so the records search query plan runs one term short and returns a wider result set that still looks like a complete answer. Nothing fails, nothing logs, and the caller cannot tell.

Two things beyond the one-line fix. Add a fixture that fails on the old pattern, so the repair is proven by violation rather than by reading. And check whether any already-issued records request was planned without a block term it should have carried; re-running those is cheap, and a wrong result there is indistinguishable from a right one from the outside.

## Optional item 5, same seat, cut it if you want a tighter card

Found in the 2026-08-31 W2 walk and confirmed at the paint layer: the flood facet's `zoneSubtype` never reaches the served row. All parcels read `present`, but some sit in the 0.2 percent annual chance band and others are minimal flood hazard, and the panel cannot tell them apart because the subtype is not on the wire. Two materially different findings rendering identically is a serve gap, not a data gap; the value is held.

## Boundaries and law

`artifacts/api-server/` is yours. `artifacts/smartsite-mcp/` is NOT: the integration seat owns it and any consuming change there is a separate card. Do not edit it, and do not add a vocabulary row for anything you introduce here. If a new refusal code or provenance string ships on a route the MCP reads, name it in your close and the planner will map it; a prose sentence is not a token and mapping one would be a starved row.

Work in your own registered worktree on your own branch. Subagents produce diffs and hand them back; you commit. Merge to main is self service on green CI read by conclusion string, not by exit code, and re-check that the base has not moved before merging.

## Fail closed

Every one of these has a refusal that is a correct outcome. A radius that cannot bound its result set should not ship. A subdivision that cannot parse should refuse with its reason. If item 1 turns out to need a store change you do not want to make yet, say so and stop; a declared block is worth more than a partial route.

State your snapshot in your first output: repo, branch, commit. Declare a leave-behind at close even if it is none.
