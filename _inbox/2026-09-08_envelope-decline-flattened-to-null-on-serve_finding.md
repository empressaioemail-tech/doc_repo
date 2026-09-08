---
id: 2026-09-08_envelope-decline-flattened-to-null-on-serve_finding
title: CORRECTED - the envelope null on the serve is deliberate anti-zombie stripping, not a serve defect; the walk was mis-specified
date: 2026-09-08
last_updated: 2026-09-08
status: corrected
applies_to: legacy-design-tools
plan_rows: [P-124]
seat: integration (doc-repo-79)
severity: customer-facing
related:
  - _inbox/2026-09-07_ctx-d_close.json
  - 90_operations/OPS-16_texas_market_plan_of_record
---

# The envelope decline is flattened to null on the way out

> **READ THE CORRECTION AT THE BOTTOM BEFORE ACTING ON ANYTHING ABOVE IT.** The central
> claim of this finding is WRONG. The serve is behaving exactly as designed and the defect
> was in the instrument that measured it. The second defect in the same rail, and the
> exposure analysis, survive. Retained in full rather than rewritten, because the wrong
> inference is the instructive part.

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

---

## CORRECTION 2026-09-08 — the serve is not defective. The walk was.

Filed by the integration seat after reading `brokerageNodeFacets.ts`, which is the write
path this finding never read. Operator ruled the walk correction on the same day; shipped as
hauska-factory PR #106.

### What is wrong

**The title, and the whole first half.** `facets.envelope = null` on the serve is not a
flattening, a discard, or a loss. It is `stripZombieEnvelopeFromFacets`, applied
unconditionally, and it is the anti-zombie rule WDLL 3.7: buildable envelope comes from the
property atom chain and never from a Tier-1 row. The function's own comment says `setbacksFact`
"does NOT resurrect `facets.envelope` (that stays permanently null by design)."

The decline is not discarded in transit either. `extractEnvelopeBriefRefusal` reads the
declared object out of the tier-1 row and carries it into the Brief compose path with agent
guidance. The truth travels; it just travels somewhere other than the field this finding
watched.

**"The walk is correct and the served payload is wrong. The bake is blocked on this, and
correctly so."** That is the load-bearing sentence and it is exactly inverted. The payload was
right and the walk was wrong. `REQUIRED_TIER1_FACET_PATHS` in `verify-walk.mjs` is an explicit
mirror of the BAKE-side list in LDT's `nodeFacetBakeTier1Conformant.ts`. LDT applies that list
with a PRESENCE predicate to the BAKED payload. The walk borrowed the same list and applied a
FOUR-STATE predicate to the SERVED payload. Same list, different artifact, different
predicate, and for exactly one leaf the two artifacts deliberately disagree.

So `BP-CONTENT-01` demanded a four-state at a field that is permanently and deliberately null,
for every parcel of every county. It could never pass anywhere. That is the real reason no
county has produced a passing walk, and this finding read the symptom as the disease.

### What was actually shipped

PR #106 declares `envelope` in a `SERVE_STRIPPED_LEAVES` map and requires it to be EXACTLY
null on the served payload. That is STRICTER than what it replaced, not looser: a zombie
envelope resurfacing on the serve now FAILS the walk, where the old four-state rule would have
passed it as a `value`. A test pins that asymmetry in both directions. `facetCoverage.envelope`
stays required and stays four-state checked, so the honest served signal is untouched.

Adding a leaf to that map is a ruling, not a convenience: it asserts the serve deliberately
removes the field and names where the truth went instead. It must never be used to silence a
leaf that is null by accident. That is the line between this and tuning a gate to pass work.

### What survives, unchanged

**The second defect, and it is now the only one.** The bake writes a bare `null` envelope for
parcels with no source geometry rather than a declared absence. Counts in the table above
stand. Travis's 119,389 still matches CTX-D's independently measured source-absence count
exactly.

The correction makes that defect MORE consequential, not less. Because the serve strips the
envelope object either way, the bake-side distinction is invisible on `facets.envelope` — but
`extractEnvelopeBriefRefusal` has nothing to extract from a bare null, so those parcels reach
the Brief with no reason at all while the 62,257 Bastrop parcels carrying a real declined
object reach it with one. Reasoned from the read of the extract path, not measured end to end.
Unscoped, unowned, still open.

**The exposure analysis.** Engine report path not exposed (`resolveEnvelopeOutcome` reads
`buildable-envelope` atoms directly); X-Ray exposed through hauska-map. Established by
doc-repo-31, unaffected by this correction.

**The flood question at `brief-view-model.ts:505`.** Still open, still nobody has looked, and
now more interesting: the first thing to establish is whether flood is stripped by design like
envelope or flattened by accident, because this finding proves those two look identical from
the serve.

### What is now open that this finding closed wrongly

Whether PE's line-338 decline-reason branch can fire at all. This finding called it STARVED and
said fixing the serve would make it fire with no PE change. That prescription is void — the
serve is not going to start emitting `facets.envelope`. Whether the branch fires depends on
whether PE reads the refusal from the Brief compose path, which was never checked. Unknown, not
starved.

### The pattern, restated against itself

This finding named its own error in its own text: "State the mechanism you believe explains an
observation, then state a second mechanism that would produce the same observation and why you
rejected it." A deliberate strip and an accidental flatten produce an identical null. Only one
of the two was ever listed. The write path was three files away and was not read, and
`ENFORCEMENT.md` already says code reading outranks output measuring and that when the two
disagree the code reading wins. Both halves of this were measured output.
