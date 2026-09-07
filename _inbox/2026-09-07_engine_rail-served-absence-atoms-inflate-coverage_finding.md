---
lane: hauska-engine (cente-67)
item: "rail-served coverage sweep counts absence-shaped atoms as coverage, inflating on-wire stats for 9 of 14 tracked rails at 13M-parcel scale"
checkpoint: "Root cause traced to the actual executable code, not the spec docs. Not fixed. Not queued to a plan-row yet."
date: 2026-09-07
---

## What happened

While answering a narrower question (does `rail-served.ts`'s executable logic
match its own spec-level docs, part of the absence-vs-presence atom-family
audit that PR #398 partially fixed), Engine found the real bug is bigger and
more consequential than the four-atom-type finding that prompted the check.

## The mechanism, traced to real code

`packages/retrieval/scripts/three-layer-sweep.mjs:451` builds
`chainTypes = new Set(deduped.map(a => a.entityType))` — collecting entity
type strings with no check for whether the atom is an absence marker.
`deduped` traces to `dedupeParcelAtoms()`
(`packages/retrieval/src/serving-sweep/chain-assembly.ts:80-105`), which
filters only on `status === "active"` and parcel-node match, keeping one atom
per `entityType` — it never reads `.absence`. An absence-shaped atom's
`status` field is genuinely `"active"` (confirmed earlier tonight against a
real well-fact absence row pulled from production), so it survives dedup
intact and its `entityType` lands in `chainTypes`. `railServedState()` then
reports the rail as served (or "on-wire-not-served," contributing to
coverage stats either way) for a rail where the honest, correct answer was
"checked, found nothing." The sweep cannot currently tell "we have this
fact" apart from "we correctly determined this fact doesn't exist."

## Scope, checked directly rather than assumed

Not limited to the four atom types PR #398 already fixed in Feasibility
PDFs. Engine checked the real atom-contract types for every entity in
`RAIL_WIRE_ENTITY_TYPES` (the 14-rail list this sweep tracks): 9 of 10
checked carry a real `absence` field —
`cad-parcel-roll`, `zoning-fact`, `setback-rule`, `flood-hazard-fact`,
`buildable-envelope`, `land-use-fact`, `utility-easement`, `owner-fact`,
`rail-corridor-fact`. Only `road-node` does not. This sweep runs at
13-million-parcel scale (the statewide/three-layer audit), so this
potentially inflates on-wire coverage statistics across most of the
fourteen tracked rails, not just the four already remediated.

## The knowledge to fix this correctly already exists in the same package

`rail-scoring-spec/specs.ts` already documents the correct absence
discriminant for `well-fact` (a `":none"` suffix convention). The gap is
that this knowledge was never wired into the actual dedup/tally code path
(`dedupeParcelAtoms()`/`three-layer-sweep.mjs`) — a documented, correct
pattern sitting unused next to the code that needed it.

## Why this matters beyond one sweep script

This is a measurement-instrument integrity defect, the same class of concern
as tonight's separate finding that setback-rule atoms mislabel verification
tier (`_inbox/2026-09-07_integration_setback-verification-tier-never-reaches-atom_flag.md`)
— both are cases where a real, correct piece of provenance/absence data
exists on the atom but the code that reports on the atom's population
doesn't read it, producing a falsely confident number. Any coverage
percentage this operation has quoted that traces back through
`three-layer-sweep.mjs`/`railServedState()` should be treated as
unverified until this is fixed, not assumed correct because a percentage
was reported.

## Part of a pattern, not an isolated instance — identified by doc-repo-6f,
## 2026-09-07, cross-checking against this session's own record

This is the **third independent mechanism** found inflating the same class
of number, each found separately, by reading a write or read path directly
rather than by measuring output — matching this operation's own standing
doctrine ("code reading outranks output measuring") exactly. All three bias
in the same direction: up.

1. The situs rail reported 99.3% populated while actually counting
   sentinel values; real street coverage was 89.90%.
2. The geometry scorer counted accounts against a feature-count denominator
   rather than the correct one.
3. This finding: the statewide coverage sweep counts honest absence
   determinations as coverage across 9 of 14 tracked rails.

**The directional consistency is itself the finding.** A measurement system
with three independent upward biases and zero downward ones found so far is
not noisy — it is structurally optimistic. Every coverage figure this
portfolio currently holds should be treated as an upper bound pending
re-measurement, not a point estimate.

**Priority framing, from doc-repo-6f**: this defect does not break the
product — customer-facing surfaces (`find_parcel`, report generation) read
atoms directly and the absence discriminant is honored where it's honored
today. It breaks this operation's own knowledge of the product. Not a
launch blocker in the customer-facing sense; an absolute blocker on any
externally-quoted coverage figure until fixed and re-measured — which
matters specifically because the operator is actively preparing a
Central Texas market launch.

**When this is carded** (explicitly not tonight): the card should cover the
class, not just this one function — a single absence-aware discriminant
applied at every tally site referencing `rail-scoring-spec/specs.ts`'s
already-correct `well-fact` pattern as the reference implementation, plus a
re-measurement of headline coverage figures afterward so the actual size of
the error becomes known rather than being quietly corrected without ever
being named.

## Not done

Not fixed. Not sized in detail beyond "real code change to
`dedupeParcelAtoms()` plus whatever consumes `chainTypes`/`railServedState()`
downstream." Not queued to a plan-row. Explicitly not attempted tonight —
Engine flagged the full scope rather than fix on top of everything else
already landed this session, which is the right call this late in a long
session rather than pushing through on unverified confidence.
