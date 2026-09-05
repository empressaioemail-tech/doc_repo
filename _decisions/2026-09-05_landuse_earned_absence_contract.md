---
decision_id: 2026-09-05_landuse_earned_absence_contract
date: 2026-09-05
owner: operator
status: active
related_canonical:
  - 80_adrs/adr_031_parcel_record_ledger_over_atoms
  - 90_operations/OPS-19b_ctx_pipeline_wrapup_sprint
  - _inbox/2026-08-30_ctx_w0b_landuse_source
  - _inbox/2026-08-30_ctx_remainder_deep_review
---

## Decision

LandUse's earned-absence contract is main's sibling `provenance.landUseAbsence` field
plus the `assertLandUseAbsenceEarned` fail-closed guard, not PR #554's embedded
`AbsentVerifiedLeaf` value-slot shape. #554's real contribution — correct
`land-use-fact`/`cad_property` source precedence — gets re-ported onto main's absence
shape rather than landing as-is.

## Context

This was OPS-19b sprint item 15/#554, held out of the CTX pipeline wrap-up sprint on
2026-09-04 after the LDT lane found #554 and main's `7f522893` had independently built
structurally incompatible mechanisms for the same landUse present-as-absent defect,
having evolved with no awareness of each other. The operator ruled 2026-09-05 to
investigate properly rather than pick a side blind, since the choice gates Wave R's own
scope and start.

## Structural commitment check

Confidence is earned, not asserted (commitment 2): main's guard enforces the
distinction between absent-verified (authority actually consulted) and lookup-failed
(couldn't look) — exactly the calibration/provenance discipline this commitment
requires. #554's shape does not.

## Reasoning

LDT lane investigation, independently re-verified by the integration seat via direct
grep across the PR #554 branch, found: (1) neither shape has any production consumer
today — both live entirely inside the old Wave R conformant-bake file family
(`nodeFacetBakeTier1Conformant.ts` + its own CLI and tests); `brokerageNodeFacets.ts`,
today's live serve route, imports neither. This is a green-field choice, nothing
orphaned either way. (2) main's `assertLandUseAbsenceEarned` is wired in as an actual
fail-closed guard in both the builder and CLI. #554's `landUseBakeLegal` predicate is
called only from test files — confirmed independently: all 6 references on the #554
branch are in `nodeFacetBakeTier1Conformant.test.ts`, none in the production `.ts` or
CLI files. It is a checkable predicate, not an enforced invariant. (3) main
distinguishes absent-verified from lookup-failed; #554's `absentVerifiedLandUse()`
unconditionally returns absent-verified in every branch including the gate-blocked
case, collapsing a distinction this sprint's own founding principle depends on
(`ENFORCEMENT.md`: "Absent, zero, and unmeasured are three different states... never
collapse them"). (4) #554 embeds the absence object in the same `baseFacts.landUse`
slot a real value occupies, via a `code?: never` type-narrowing hack; a plain truthy
consumer check can misread genuine absence as present unless it remembers
`isAbsentVerifiedLeaf` — a live risk of reintroducing a sibling of the exact
present-as-absent defect this sprint exists to kill. #554's actual contribution, the
`land-use-fact`/`cad_property` source precedence over `claim.propertyUseCode`, was
already separately ruled correct against the 2026-08-30 W0b decision record
(`_inbox/2026-08-30_ctx_w0b_landuse_source.json`) and is unaffected by this contract
choice.

## Reversal criteria

If Wave R implementation finds main's sibling-field shape cannot cleanly compose with
the re-ported source-precedence fix (a real integration blocker, not a style
preference), revisit. If a consumer is found depending on #554's embedded-leaf shape
specifically before Wave R lands, revisit before proceeding.

## Dependencies

Gates Wave R (OPS-19b item 19) alongside item 20 (landUse fill for the remaining 4
counties) per the operator's 2026-09-05 ruling to close both before Wave R planning
starts. Depends on the 2026-08-30 W0b source-precedence ruling, which this decision
does not reopen.

## Counterparties

Internal: LDT lane (investigation), integration seat (independent verification),
operator (ruling).
