---
id: 2026-09-08_envelope-decline-flattened-to-null-on-serve_finding
title: cortex-api flattens an honest envelope decline into a bare null, and the customer is told something false
date: 2026-09-08
status: open
applies_to: legacy-design-tools
plan_rows: [P-124]
seat: integration (doc-repo-79)
severity: customer-facing
related:
  - _inbox/2026-09-07_ctx-d_close.json
  - 90_operations/OPS-16_texas_market_plan_of_record
---

# The envelope decline is flattened to null on the way out

## The chain, verified end to end

The database records an honest declared absence for buildable envelope. `cortex-api` drops it
and serves a bare `null`. Property Explorer has a branch built to render the decline reason,
which can therefore never fire, so it falls through to a different branch whose text is
**factually wrong**.

    place_layer_snapshots        {"status":"declined","declineReason":"atom_path_pending",
    (tier1, Caldwell 48055:20478) "approximate":true,"provisional":true,
                                  "disclosure":"Tier-1 bake no longer authors product envelope
                                   confidence (anti-zombie). Read buildable-envelope from the
                                   property atom chain, or honest-decline."}
                                  facetCoverage.envelope = false

    cortex-api serve             envelope: null
                                  facetCoverage.envelope = false

    PE brief-view-model.ts:320   "Setbacks and buildable envelope not verified here
    (the branch actually taken)   -- no envelope was derived for this parcel's snapshot."

    PE brief-view-model.ts:338   "Setbacks and buildable envelope not verified here
    (the branch that can never    -- atom path pending."
     fire)

## Why this is worse than a generic message

The line-320 text is not merely less specific. It is **false**. It says no envelope was
derived. An envelope determination WAS made, recorded, and given a reason and a disclosure.
The system knows why it withheld the answer and tells the customer it never tried.

A customer reading "no envelope was derived for this parcel's snapshot" would reasonably
conclude the data is missing. The truth is that the tier-1 bake deliberately stopped
authoring envelope confidence (the anti-zombie change) and routed the answer to the property
atom chain, which is pending. Those are different facts with different implications for
whether waiting will help.

## Where the defect is, and where it is not

**Not the bake.** For these parcels the bake writes the correct declared absence with a
reason. This is a serving-layer defect.

**Not Property Explorer.** PE's decline-reason branch is correct and already exists. It is
STARVED: correct logic, real trigger, input never supplied. Fixing the serve makes that
branch start firing with no PE change at all.

**cortex-api's serve path**, in legacy-design-tools. That is where the object becomes null.

## A second, separate defect in the same rail

Distinct from the above and NOT fixed by the same change. The bake writes a bare `null`
envelope for parcels with no source geometry, rather than a declared absence:

    county        envelope = object (declined etc.)   envelope = bare null
    Bastrop                62,257                        15,542
    Caldwell               24,989                        23,660
    Hays                  131,431                        41,619
    McLennan              114,255                             0
    Travis                380,918                       119,389
    Williamson            511,029                        91,021

Travis's 119,389 matches CTX-D's independently measured source-absence count exactly (A4
condo 45 percent, blank 33 percent, M1 mobile-home 10 percent -- CAD account types that carry
no independent platted-lot polygon in the StratMap fabric). So those parcels genuinely have
no envelope to compute, and the correct state is a declared absence naming that reason, not a
bare null.

Caldwell's `envelope.status` distribution shows both states coexisting today: `declined`
24,980, `no-buildable-area` 7, `ok` 2, and 23,660 rows where the whole object is null.

## Consequence for P-124

This is why the verify walk fails `BP-CONTENT-01` on every parcel of every county. That grade
requires each required leaf to be one of value / absent-verified / not-applicable / refused,
and states plainly that a present key holding null is none of those. The walk is correct and
the served payload is wrong. **The bake is blocked on this, and correctly so.**

## Exposure

Engine report path is NOT exposed: `resolveEnvelopeOutcome` in `site-plan/author.ts` reads
`buildable-envelope` atoms directly from storage, and the only cortex references in engine-api
are the gate-front product enum and map-layers, neither on the report path. Feasibility and
Site Plan are clear (established by doc-repo-31).

X-Ray IS exposed, because it renders hauska-map's caller-supplied brief verbatim and PE reads
through cortex-api. P-120's R-06 removes X-Ray's exposure by cutting it onto the composition
root, but that does not help PE's own brief panel, which keeps the defect regardless. The
serve fix is the one that matters; R-06 only removes one downstream reader.

## The pattern

A disclosed decline flattened into an undifferentiated absence, with the distinguishing data
available upstream and discarded in transit. Same class as the absence taxonomy landed in
engine PR #407, in a different system.

It is also the A-120 shape (`merged` is not `reached a consumer`) seen from the consumer end:
PE's renderer is built, correct, tested, and unreachable because nothing supplies its input.
A reachability instrument that only asks "does anything import this" would score that branch
as healthy.

## Open

The serve fix in legacy-design-tools. Not scoped, not dispatched. Must NOT be folded into the
P-125 deploy, which is unrelated -- one variable at a time.

The bake fix for the bare-null source-absent parcels. Separate change, separate risk.

Whether any other rail is flattened the same way on the serve. Flood uses the identical
decline-reason rendering pattern at `brief-view-model.ts:505`, so it is the first place to
look, and nobody has looked.
