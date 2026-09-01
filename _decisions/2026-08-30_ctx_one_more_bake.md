---
decision_id: 2026-08-30_ctx_one_more_bake
date: 2026-08-30
owner: Nick (operator), recorded by integration seat
status: active
related_canonical:
  - 90_operations/OPS-19_factory_plan_of_record.md
  - _inbox/2026-08-30_ctx_facts_complete_WDLL.md
  - _inbox/2026-08-30_ctx_w1_bake_WDLL.md
  - _inbox/2026-08-30_ctx_pe_wiring_WDLL.md
  - _inbox/2026-08-30_ctx_walk_scrub_WDLL.md
  - _inbox/2026-08-30_ctx_w0b_prebake_review_WDLL.md
  - _inbox/2026-08-30_ctx_remainder_deep_review.md
  - _decisions/2026-08-30_ctx_facts_complete_waves.md
---

## Decision

One more data pass and one production bake of the Central Texas six. Central Texas is complete for this umbrella when that bake is walked and the PE card is customer-done. Every defect that would force a second facet bake rides this pass. Expand the card set under the umbrella rather than park work for a later publish. After Wave R there is no second bake of the six.

## Context

The 2026-08-30 waves decision batched bake-input changes and left rails and PE copy for later. The 2026-08-30 remainder review showed that Wave R as written would republish `landUse: null` (A-025), leave ~58,461 gate-blocked parcels serving a wrong-parcel centroid, and pass a walk that cannot fail. The operator then ruled: one more thorough review, one more bake, Central Texas complete, expand the workload under that umbrella, do not rebake again.

## Structural commitment check

Sell reasoning, not data: a recovered point or land-use names the source and the join state; a refused facet names the refusal.
Confidence is earned: owner gate stays the second derivation on blocked FIPS; owner-agree is sampled on the three leftover counties before situs-extend is coded.
No privileged data: public CAD and TxGIO only.
Fail closed: seed stays; a gate-blocked write does not keep a prior non-zero point; the walk fails on null presented as present.

## Reasoning

Facets live in `place_layer_snapshots`. Anything that changes that body after Wave R is a second bake. The review named the bake-input set that was missing: landUse projection, upsert fail-closed on inherited centroids, a walk predicate that can fail, a schema version that moves with the leaf set, and a PE card that is a missing change not a deploy lag. Those ride this pass. Atom rails were left out of the first cut so the snapshot bake would not stall. Operator 2026-08-30 reversed that: complete is a finished dataset or a named honest absence, work volume is not a reason to omit a rail, RRC must surface this pass. See `_decisions/2026-08-30_ctx_complete_or_absent.md`. Wave R waits on W3 verify. PDD still has no invented feet.

## Reversal criteria

Reverse the single-bake rule if a bake-input defect is found after the W0b review that cannot land in the W1 pin (a fabricating join on the wire, or a walk grade that requires a different write path). In that case stop Wave R and cut R2. Reverse the rails-out line if the operator names a rail as customer-blocking for this bake. Reverse situs-extend to 48021 / 48055 / 48453 if the W0b owner-agree sample falls below the gate the 2026-08-29 decision already published.

## Dependencies

Supersedes `_decisions/2026-08-30_ctx_facts_complete_waves.md` on sequencing (facts-then-rails, PE after Wave R, centroid card later). Keeps that decision's seed-stays and P-80-parked rules. Depends on card H production closes, A-021, A-025, A-026. Unlocks W1 / PE / Factory walk only after W0b. Does not unlock F-09, F-10 254, F-11, or P-80.

## Counterparties

Internal: operator, property seat, integration.
