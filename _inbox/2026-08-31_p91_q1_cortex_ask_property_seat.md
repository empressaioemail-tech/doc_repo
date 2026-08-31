---
id: 2026-08-31_p91_q1_cortex_ask_property_seat
title: Handoff to the property seat. Two cortex routes Q1 needs, and one silent-degradation defect on the records path
date: 2026-08-31
status: open, routed
plan_row: P-91 (v3 Q1, blocked) and P-85 (records path defect)
from: integration planner (doc_repo main)
to: property seat (owns api-server and the records-request path)
evidence: _inbox/2026-08-31_p91_q1_feasibility_measurement.md
---

# Why this is a handoff and not a card

The v3 MCP wave shipped everything it could reach without touching api-server. Q1, the selector front door on `find_parcel`, cannot be reached that way. It needs cortex routes that do not exist, and api-server belongs to the property seat, which holds live worktrees there. So this names the ask precisely rather than reaching across.

Nothing here is urgent. Q1 is queued behind the seat's current work; the point of writing it now is that the measurement is fresh and the ask is exact, so it does not have to be re-derived later.

# Ask 1: a radius search. This is the whole of `near`

The centre point is already solved three separate ways and is NOT the gap: `situs-search` address-point hits carry latitude and longitude, `POST /place/resolve` geocodes any address, and node-facets serves `cityLimitsFact.queryPoint` per parcel, live-verified at `{-97.31654, 30.10981}` for `48021:34137`.

What does not exist anywhere is the set search: given a point and a radius, return the parcels. `neighboring-context.atom.ts` is the one purpose-built abstraction and it is registration only with zero route callers, so it is a dormant mechanism rather than an available one. Whether that atom is the right home or a new route is cleaner is the seat's call, not the planner's.

Two constraints from the MCP side, so the route is built once. A truncated result must declare its truncation rather than resemble a complete answer, which is the honesty rule the whole panel already runs on. And the cap wants to be a stated number rather than an implicit one, because the MCP will publish it in the tool description the way the 25 and 50 caps are published today.

# Ask 2: subdivision, which is a source question before it is a route question

`subdivision` should NOT ship as a fuzzy match. Per the v3 card's own rule, if it cannot parse reliably it refuses with that reason.

No `txgio` column holds subdivision or legal text at all. The source shapefile's `LEGAL_DESC` field is documented as deliberately not captured, so this is an acquisition decision and not a parsing bug. The existing parser was run against all six real `legalDescription` fixtures in the repo's own suite and extracted a subdivision on zero of six, including two that plainly name one.

So the ask is a ruling first: is subdivision a field we acquire, or is the parameter refused with a stated reason. A wider regex is the wrong answer to this and would produce confident wrong groupings.

# Ask 3: bare street-name search

A house-number-prefixed query already works through the existing wrapper with no change. A bare street name, the "everyone on Pine St" case Q1 exists for, does not, because the prefix match is anchored on the full house-number-first address string. This is the smallest of the three asks and may fall out of the radius work.

# Defect, and it is not Q1

`artifacts/api-server/src/lib/recordsSearchQueryPlan.ts:16` reads:

    /\bBLK(?:OCK)?\.?\s+(\d+[A-Z]?)\b/i

That alternation expands to `BLK` or `BLKOCK`. It can never match the literal word `BLOCK`. Verified by violation rather than by reading:

    NOMATCH  "BLOCK 3"
    MATCH    "BLK 3"  -> block=3
    MATCH    "BLK. 3"  -> block=3
    NOMATCH  "BLOCK 12A"
    NOMATCH  "PECAN GROVE BLOCK 3 LOT 5"

The intended pattern is `BL(?:OC)?K`, or plainly `BLK|BLOCK`.

This matters more than its size because it degrades silently. A legal description carrying `BLOCK 3` yields no block term, so the records search query plan runs one term short and returns a wider result set that still looks like a complete answer. Nothing fails, nothing logs, and the caller cannot tell. It sits on the P-85 records-request path, not the MCP tree.

Worth checking when it is fixed: whether any already-issued records request was planned without a block term it should have carried, since re-running those is cheap and the wrong result is indistinguishable from the right one from the outside.

# One thing the seat should know that is not an ask

The node batch cap of 25 rests on a figure, "4,711 average and 5,549 largest characters per node body", that appears three times in the MCP tree and is a prose comment in all three places, citing a session rather than an instrument. Nothing in the tree recomputes it. The cap may well be correct. It is simply not currently evidenced, and the v3 vocabulary block just added 3,832 characters to every tool result, which eats headroom against the same unevidenced ceiling. Re-deriving it in-tree is small and worth doing before any cap is widened.
