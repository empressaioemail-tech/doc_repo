---
decision_id: 2026-08-29_ctx_open_situs_join_not_prop_id
date: 2026-08-29
owner: Nick (operator), recorded by integration seat
status: active
related_canonical:
  - 90_operations/OPS-19_factory_plan_of_record.md
  - _inbox/2026-08-29_ctx_quality_WDLL.md
  - _inbox/2026-08-28_ctx-f_close.json
  - _STATE.md
---

## Decision

Open the Hays and Williamson join on the conformant bake by wiring the owner-gated situs-address recovery path. Do not lift `LANDUSE_JOIN_DISABLED_FIPS_SEED` and do not join those two counties on `prop_id`.

## Context

Operator 2026-08-29: open the join, take care of the Central Texas six, run work in waves where it can. The planner's first recommendation ("lift the seed, the ledger already passes") was wrong. The seed exists because a `prop_id` join on 48209 and 48491 fabricates: Williamson R-account TxGIO ids collide with a six-digit CAD roll (~0.005% owner agree); Hays uses two bare-numeric systems that collide (~0.013% owner agree). The old bake already recovers those counties on situs address plus `ownersAgree` (Williamson ~89% owner agree, Hays ~86%). The conformant bake refuses the offered `txgio_parcel` row when the county is gate-blocked and never runs the recovery, so Hays and Williamson serve `unmeasured` on the stamp, the ring, and the query point.

## Structural commitment check

Sell reasoning, not data: a recovered land-use must carry `source: cad-roll-address-join` and a join state that names situs, never a silent prop_id match.
Confidence is earned: the owner gate is the second derivation; an address match whose owners disagree is honest null.
No privileged data: recovery uses the same public CAD and TxGIO fields the old bake already uses.
Fail closed: lifting the seed would emit fabricated land use and zoning stamps.

## Reasoning

The operator asked to open the join so Kyle and Taylor stop serving empty. The legal open is the recovery the old bake already proved. The illegal open is deleting the seed. The ledger-versus-seed disagreement that card F left as an F-05 ruling is resolved this way: the seed stays as the bootstrap for a never-scored database; the ledger's `block` verdicts stay authoritative for `prop_id`; the conformant bake gains the inverted recovery (`addressJoinKey` fires only for blocked FIPS) and a situs-keyed `txgio_parcel` fetch so a recovered parcel also gets a ring and a query point. That is one bake write path. PE labels and the Travis written-versus-rows recon do not touch it.

## Reversal criteria

Reverse if a live owner-agree sample on the situs path for 48209 or 48491 falls below the gate threshold the old bake already published, or if a recovered gold (48209:135570, 48491:76149) shows a CAD owner that does not agree with the TxGIO owner. In that case keep the prop_id seed, keep recovery off, and put `parcelJoin.state = gate-blocked` on the verdict basis.

## Dependencies

Depends on card F (containment verdicts, flat-body claim reader) and the old bake's `resolveAddressLandUse` / `ownersAgree`. Unlocks the next CTX publish wave under A-021. Does not unlock F-09, wave 1 remainder, or F-11.

## Counterparties

Internal: operator, property seat, integration planner.
