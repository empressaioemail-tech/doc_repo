---
title: The serve path never emits a pipeline state word
date: 2026-09-01
status: active
decision_type: serve contract
---

# Decision

**A served field never carries a pipeline-internal state token.** Not `unmeasured`, not
`unresolved`, not `pending`, not `unknown`. The serve contract has four states — `value`,
`absent-verified`, `not-applicable`, `refused` — and a field resolves to one of them or the
facet refuses.

Where the bake reached a pipeline state it cannot express in those four, it **converts at
serve** to `absent-verified` carrying the basis it actually had, or it refuses the facet.

**No fifth completeness state is added.** The instances that prompted this are not a missing
state; they are a leak.

## What prompted it

GOLD-PROBE, 2026-09-01, against production:

- `cityLimitsFact.status = unmeasured` served on `48491:76149` and `48453:493738`, basis
  **"no usable parcel query point"**.
- `etjStatus: unresolved` leaking on **all six golds**.

## Why this is a leak and not a missing state

The distinction the seat drew is the load-bearing one, and it is right.

**`unmeasured` means we have not looked. That is not what happened.** The bake looked, tried
to obtain a parcel query point, found none usable, and then wrote its own internal word onto
the wire. Having looked and found nothing is exactly `absent-verified`, and the reason it
found nothing — no usable query point — is exactly a basis. The four-state contract already
expresses this; the bake simply did not translate.

Two nearby cases that are **not** this, and must not be swept in:

- The five `#575` CAD value fields are **silent missing keys**, not served `unmeasured`.
  That is blank-no-state and it is a different defect with a different fix.
- **Travis structural absence is already a correct four-state reading.** `living_area_sqft`
  is zero of 500,307 at source; served as `absent-verified` with a source basis, that is
  right and needs no change.

## Why not a fifth state

Because it would be true. Adding `unmeasured` to the serve contract would let any field
that nobody got around to measuring ship a word that sounds like diligence. The four states
each carry an obligation — a value carries provenance, an absence carries a basis, a
not-applicable carries a reason, a refusal carries a name. `unmeasured` carries nothing and
obliges nothing, and a state with no obligation is where unmeasured work goes to look
measured.

A field the pipeline genuinely has not examined should not be served at all.

## What executes this

The conversion belongs at the serve boundary, not in each consumer, so that a new reader
cannot miss it. Where a type can carry the constraint, the four states should be a
discriminated union the compiler enforces at every consumer, which removes the possibility
of a fifth token existing rather than checking for it.

**Not yet built.** This decision names the rule; the card that implements it must state what
executes it, what triggers it, and what fails when a pipeline word reaches the wire.
`CAD-SERVE-RECONCILE` will report every current instance.

## Reversal criteria

Reverse if a served field is found whose truthful state genuinely is not expressible as
value, absent-verified, not-applicable, or refused — and where refusing the facet is worse
for the reader than saying so. That case has not been produced. `cityLimitsFact` and
`etjStatus` are not it: both have a basis and both fit `absent-verified`.

Also reverse if converting at serve is found to erase a distinction a downstream consumer
depends on. Check before implementing whether anything reads `unmeasured` or `unresolved`
as a control input; if something does, that consumer is the first thing to repoint, and
retirement follows the standing order — repoint consumers, then retire the token, never the
reverse.
