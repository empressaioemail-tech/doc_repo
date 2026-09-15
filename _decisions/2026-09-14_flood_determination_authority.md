---
decision_id: 2026-09-14_flood_determination_authority
date: 2026-09-14
owner: nick
status: active
related_canonical:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _inbox/2026-09-14_g130_flood_determination_recommendation.md,
    _inbox/2026-08-20_c10_flood_store_adjudication.md,
    _decisions/2026-09-11_ledger_as_serving_path_seven_steps.md,
  ]
---

# Decision

**The parcel-record `flood` rail is the authoritative flood-zone determination.**
`atoms:flood-hazard-fact` is its sanctioned legacy fallback for counties outside the
parcel-record program. **`pls:node-facets:tier2` is retired** and is not to be restored to the
wire.

**Deferred, deliberately:** fixing store A's W-3/W-4/W-5 defects. It is the only open item whose
blast radius is unmeasured, and it gets measured before it gets funded.

**Owed before ratification is complete:** a ground-truth sample of parcel-record's own output
against live FEMA NFHL. See "the gap the investigation named on itself."

## Context

G-130 was dispatched to adjudicate between two stores and to **recommend, not build**, because a
determination a city acts on is not an agent's call. It came back having corrected the dispatch's
own premise twice.

**There are three derivations, not two.** The one that actually serves is `hauska-factory`'s
parcel-record `flood` rail, landed 2026-09-02 — a store neither the dispatch nor the planner
named.

**The evidence the dispatch quoted was stale.** `hauska-engine`'s `mergeBakedBaseFacts` comment,
which the planner cited verbatim as proof the FEMA determination is dropped on the wire, is a
**stale offline reproduction**: its vendor pin is `hauska-map`'s `pe-property-atoms.ts` at roughly
2026-08-18, and current `origin/main` has moved past it. The comment is accurate about that
function at that pin. It is not accurate about what serves today.

## The disagreement, with its denominator

Measured 2026-08-19 across two counties (`artifacts/ss-w11/flood-48021.json`, `flood-48453.json`,
resolver `ss-w11/1.0.0`, source `NFHL_48_20260101`):

| County | Comparable population | Disagree | Rate |
|---|---|---|---|
| Bastrop 48021 | 62,249 of 62,257 | 5,424 | **8.71%** |
| Travis 48453 | 4,145 of 380,918 | 332 | **8.01%** of comparable, 0.09% of roster |

Tier2 covers only 27,584 Travis parcels — it is outside its ten-county bake for most of that
county, and has no opinion on 92.8% of it.

**The counting rule matters and is recorded here because it will be re-derived otherwise:** only
entities where *both* stores name a value can arithmetically disagree, so that is the population
to rate against. A rate quoted over the full roster **silently rewards the sparser store for its
own gaps.**

## Why tier2 loses

Two independent investigations re-derived ground truth by re-querying **live FEMA NFHL** — the
agency service, not either store — and reached the same conclusion without citing each other's
numbers.

`_inbox/2026-08-20_c10_flood_store_adjudication.md`, n=9 hand-adjudicated Bastrop parcels spanning
all four disagreement classes, put it exactly: *"The atom store is right about the parcel. The bake
store is right about a different point (the tile centre), and wrong about the parcel."*

It rejected three competing explanations with evidence before accepting that one — the atom's own
SFHA-flag defect, its centroid defects, and FEMA edition drift — all checked against live and bulk
NFHL at the parcel point and ruled out for that sample.

The mechanism is not staleness and not split parcels. Tier2 quantises the centroid to a 0.005°
tile, issues **one** live query at the tile centre, and reuses that answer for every parcel in the
tile — so **a parcel's zone can be decided by a point up to ~366 m away.** It also records no
edition path, which forces its vintage undecidable.

## The gap the investigation named on itself

Parcel-record's flood rail is a **third** independent implementation of "which NFHL polygon
contains this parcel" — `flood-ingest.mjs`, landed two weeks after the atom writer it neither
reuses nor defers to. That is the same failure shape found on 2026-09-09 in the two non-syncing
zoning pipelines, same repo pair.

And the agent stated plainly that it did **not** re-adjudicate parcel-record's own served answers
against a fresh live NFHL query the way C10 did for the other two. Its confidence rests on reading
the SQL and the writer's stated reasoning, not on a ground-truth sample of its output. Its own
words: *"That is a real, named gap in this recommendation's evidence, not a hedge."*

**So ratification carries a condition.** Before any flood determination from this rail is cited in
a plan-review letter or relied on by a city to skip an engineer, run the C10-shaped sample against
parcel-record's own output. It is cheap, and it turns this from reasoned-from-source into
adjudicated. Until then the rail is authoritative for serving and provisional for citation.

## Why the deferral

Store A remains the live fallback for every Texas county outside the six-county parcel-record
program, and its W-3/W-4/W-5 defects have **unmeasured** blast radius outside Bastrop, where C10's
n=9 found zero multi-part parcels. Fixing it means porting the `ST_PointOnSurface` plus
fragment-union approach `flood-ingest.mjs` already proved — or accelerating parcel-record's county
slate instead, which may make the question moot.

Measure the blast radius first. Funding a port before knowing whether it matters is the wrong
order.

## Explicitly not doing

**Restoring tier2 to the wire.** No consumer or requirement surfaced. Doing so reverses an
already-adjudicated, deliberate exclusion with nothing offsetting it.

## Reversal criteria

Reverse the authority ruling if the owed ground-truth sample shows parcel-record's rail losing to
the atom store on real parcels.

Revisit the tier2 retirement only if a consumer is found that reads it — in which case the finding
is that the enumeration missed something, and that is the thing to fix.

## Structural commitment check

**Confidence is earned, not asserted.** This is the ruling's whole shape: a determination is
authoritative because two independent re-derivations from the agency source agreed, and it stays
provisional for citation until the third derivation gets the same treatment.

**Sell reasoning, not data.** The surviving determination must carry a vintage. Tier2 structurally
could not, which is part of why it loses.

**Cost per jurisdiction.** Parcel-record covers six counties; the atom fallback covers the rest,
which is what keeps a county outside the program from having no answer at all.
