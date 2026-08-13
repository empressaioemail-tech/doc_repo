---
decision_id: 2026-08-13_p27_address_to_parcel_post_gate
title: Address-to-parcel resolver ruled OUT of the launch gate; first post-gate build
date: 2026-08-13
status: active
owner: nick
related_canonical: [90_operations/OPS-16_texas_market_plan_of_record, _inbox/2026-08-10_address_to_parcel_resolution_scope.md, _decisions/2026-08-10_market_layer_thesis_parked.md]
---

# P-27 address-to-parcel: out of gate, first post-gate build

## Decision

The address-to-parcel resolver (OPS-16 P-27) is OUT of the Texas flush launch gate and ruled the FIRST
post-gate build. Operator ruling 2026-08-13, with the explicit condition that the planning be captured
here so no future agent has to rehash it.

## Why deferring is safe (the question the operator asked)

The concern was whether deferring bites when market data is implemented. It does not, for three
sequencing reasons:

1. Nothing in DC-1 through DC-13 reads on address lookup. The gate closes without it.
2. The market layer is itself PARKED until after Texas launches (2026-08-10 ruling), and the resolver
   is a market-layer PREREQUISITE, not a co-requisite of anything pre-launch. The natural sequence is
   launch, then P-27, then market adapters. The resolver still lands before the first market source
   needs it.
3. The resolver is purely ADDITIVE. It is a normalization-and-index build over data we already hold
   (`txgio_parcel.situs_address`, 99.3% populated, all loaded counties). Nothing being built for the
   gate would be built differently if the resolver existed today, so deferral creates zero rework.

## The captured plan (do not re-derive)

Scope doc of record: `_inbox/2026-08-10_address_to_parcel_resolution_scope.md`. Its load-bearing design
decisions, restated so this record stands alone:

- A WRONG match is worse than none: fail closed, return candidates, verdicts
  `exact | ambiguous | not-found | out-of-coverage`.
- Normalize with the IDENTICAL function at write time and read time (the 2026-07-29 comma-tail defect
  is the cautionary case: normalization asymmetry silently defeated a restamp on ALL parcels).
- Do NOT build a geocoder. Photon keeps the coordinate path; this resolver answers address→parcel as a
  service, which is what lists, API callers, and agents need.
- Benchmark the 500-address BATCH shape explicitly; it is the shape that seq-scanned 10.7M rows in the
  sweep era.
- Secondary payoff to check at build time: the resolver may repair the CROSSWALK_HOLD /
  LANDUSE_JOIN_HOLD counties by providing a second join key.

## What it unlocks when built

MCP/API address lookup, paste-a-list, canonical addresses in briefs, and the join key the market layer
(MLS listings are address-keyed) requires.

## Reversal criteria

Pull it forward pre-gate only if a launch-blocking surface turns out to require address lookup (none
does today), or if the market layer is un-parked before the gate closes.
