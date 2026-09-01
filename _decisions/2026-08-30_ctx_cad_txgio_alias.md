---
decision_id: 2026-08-30_ctx_cad_txgio_alias
date: 2026-08-30
owner: Nick (operator), recorded by integration seat
status: active
related_canonical:
  - _decisions/2026-08-29_ctx_open_situs_join_not_prop_id.md
  - 19_the_instrument_contract.md
  - 24_instrument_conformance_program.md
  - 90_operations/OPS-19_factory_plan_of_record.md
  - _inbox/2026-08-30_ctx_w1_alias_WDLL.md
  - _inbox/2026-08-30_ctx_w0_point_source.md
---

## Decision

Persist every successful CAD to TxGIO situs bind as a durable alias. Next bake reads the alias first. W1 still runs owner-gated recovery for unbound rows. The alias table is the reconciliation product. This is F-10 T1.1 / F-16, not a seed lift.

## Context

Card H recovered Hays and Williamson on situs plus `ownersAgree` (130,663 and 511,029 `joined-situs` on the 2026-08-30T13:48:33Z recount). That bind lives only in the snapshot payload. A later bake that cannot see it re-derives from hope. Operator 2026-08-30: yes to persist each successful bind as CAD node to TxGIO node, with `ownersAgree` and `asOf`. Alternatives rejected: lift `LANDUSE_JOIN_DISABLED_FIPS_SEED` (fabricates on `prop_id`); invent a Travis `geo_id` join (P-80 forbade it); treat `gate-blocked` as a miss to force.

## Structural commitment check

Sell reasoning, not data: the alias carries authority, method `cad-roll-address-join`, and clocks. A silent `prop_id` match is not an alias.
Confidence is earned: `ownersAgree` is the second derivation. Address-only is not enough.
No privileged data: public CAD and TxGIO fields only.
Fail closed: no alias on owner refuse, missing TxGIO id, or a blocked-FIPS `prop_id` hit.

## Reasoning

Doc 19: an alias is an atom (`identity.alias`), not a field. A natural key is never identity. T1.1 exists so a migration does not rewrite a hundred million rows: mint the node, persist every natural key as an alias with authority and valid time. F-16 already writes CAD-identifier aliases on 48021. This card adds the TxGIO key on the same CAD node after the owner gate. Wave R then resolves tier 1 on the alias and only re-runs situs for rows with no valid alias at `knowledgeAt`. Cannot-bind remainder stays T1.5 `lookup-failed`, not an invented key.

## Reversal criteria

Reverse the persist if a live owner-agree sample on a written alias falls below the published Hays / Williamson gate, or if a gold (48209:135570, 48491:76149) shows CAD owner disagreeing with the aliased TxGIO owner. Then close those eras (`validTo`), keep the seed, and serve `gate-blocked`. Reverse the bake-read-first rule if the landing count and the alias-atom count disagree on a FIPS.

## Dependencies

Depends on A-026 (situs recovery, seed stays) and on F-16 alias shape already shipped. Unlocks Wave R to read a map. Does not unlock P-80, seed lift, or F-10 254.

## Counterparties

Internal: operator, property seat, integration planner.
---
