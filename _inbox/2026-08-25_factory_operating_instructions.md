---
id: 2026-08-25_factory_operating_instructions
title: Factory operating instructions (this program)
date: 2026-08-25
status: active
plan_row: P-73
operator_approval: verbal 2026-08-24 operate do not rebuild; 2026-08-25 atom/node/edge pointer
related:
  - _inbox/2026-08-24_parcel_facts_write_path_game_plan.md
  - _inbox/2026-08-24_factory_routing_pin.json
  - _inbox/2026-08-24_factory_routing_readiness_WDLL.md
  - _inbox/2026-08-21_ident_close.json
  - _inbox/2026-08-22_atom_full_surface_WDLL.md
  - _decisions/2026-08-22_thesis_planner_parcel_gap_rulings.md
  - 90_runbooks/factory_1_5_acquisition_staging.md
  - 90_runbooks/factory_1_statewide_fabric.md
  - 90_runbooks/factory_2_jurisdiction_depth.md
  - _inbox/2026-08-25_cad_ingest_apply_gate_WDLL.md
---

# Factory operating instructions

This is the card a factory agent reads before any write. The three runbooks stay the operate-do-not-rebuild reference. When a runbook and this file disagree, this file wins until an amendment says otherwise.

Chain is **1.5 then 1 then 2**. Do not rebuild `run_sweep.mjs`. Copy a driver, change the queue.

## What each factory is allowed to write

| Factory | Job | Slot | This program |
| --- | --- | --- | --- |
| 1.5 Acquisition | Persist into `neondb` with vintage | None | P-75 / P-76 serving. Next compile is P-78. Then P-25. Then P-79. |
| 1 Statewide fabric | Drain staged rows to atoms + Manifest cells | One atoms `--apply` | Held. P-09 last. Roads COVER parked (A-017). |
| 2 Jurisdiction depth | Zoning stamp, setbacks, envelope warm | Heavy scan + atoms | Out of write-path map. L20 staging is input, not a win. |

Factory 2 runbook still says Factory 1 produces `txgio_parcel`. Code and the Factory 1.5 runbook say 1.5 writes that table. Believe the write path.

## Atom / node / edge law (revised 2026-08-21 through 2026-08-22)

Do not point a factory write at the 2026-08-08 DATA_MODEL proposal. That file is still a proposal. Do not mint padded StratMap `entity_id`. Do not verify stored bytes with `body->>'parcelNodeId'` or `body->>'atomDid'`. Do not treat inspect wiring as a Manifest cell.

**Node.** One opaque parcel node. Identity string is `{fips}:{integer}`. `txgio` key, CAD `prop_id` / `geo_id`, and atom `entity_id` are aliases with `validFrom` / `validTo`. Ruling: `_decisions/2026-08-22_thesis_planner_parcel_gap_rulings.md` item 2.

**Atom write grammar is P-55.** Engine PR **#356** merge `29ab77c744a3efc21a59dcb6af06ca6ae9e43e28`. Helper `packages/atoms/src/parcel-write-identity.ts`. Shared reject refuses decimal-padded second tokens and `:outside` / `:primary` sentinels. Padded StratMap form lands in `externalKeys` on the same object. SD absence is `{canonical}:sd`. Footprint primary is `{canonical}:footprint` with `structureRole` in body. Close `_inbox/2026-08-21_ident_close.json`. Scratch `_scratch/ident-p55.md`.

**Edge.** `applies-to` is written in the same `writePropertyAtomsBatch` call as the fact. It is the graph edge from fact DID to parcel-node DID. It is not `body.parcelNodeId`. Property `atom_links` was starved at the 2026-08-21 OPS-18 grade. A new Factory 1 apply that skips the helper mints the old shape. That is a fail.

**Verify.** Read stored bytes by `atom_did IN`. Never a jsonb expression. Factory 1 runbook F1-6. Measured 2026-08-11: ~575x.

**Families in scope.** The fifteen from `_inbox/2026-08-22_atom_full_surface_WDLL.md`: parcel-node, flood-hazard-fact, special-district-fact, rail-corridor-fact, rrc-pipeline-fact, well-fact, cad-parcel-roll, zoning-fact, land-use-fact, owner-fact, building-footprint, buildable-envelope, setback-rule, road-node, property-boundary-edge. Who-serves and city-limits are not atom families and not Manifest rails.

**CC is not inspect.** Manifest cells move only when a scorer writes `county_facet_coverage` and the ledger recomputes. Wiring inspect does not green a CC column. Grade Manifest from live GET + `computedAt`. Do not rematerialize inside a canvas refresh.

**Geometry count.** Live Manifest dump 2026-08-25T04:13:26Z has geometry **253 present** + Donley satisfied-absent. The Phase 2 "196 = parcel-node atoms" line is a stale snapshot. Quote the dump.

**Ector / keyKind.** `write-parcel-node-county.mjs` default `keyKind` is `prop_id`. Ector 48135 is `geo_id_crosswalk`. A default apply re-collapses 75891 features onto 3791 keys. Retired prop_id nodes must not enter a geometry numerator.

**Dormant types stay dormant.** `WouldAffectEdge` / `./temporal` / obligation atoms have no writer and no rows (`_inbox/2026-08-22_thread_a_temporal_edge_close.json`). Do not emit them from a factory apply.

## Routing pin

`node scripts/factory-routing-readiness.mjs --check` is the READY signal. Canvas captions are not.

ready:true means already serving on a named hop. It does not mean write-allowed. Geometry, flood, and envelope gold setbacks are already serving. They are not a go to point new factory workload at those rails.

P-25, P-09, and roads COVER stay `ready:false`. No Factory 1 `--apply`. No CAMA zip. No COVER restart.

## Cad-ingest apply gate

No leftover or CAMA apply starts until `node scripts/cad-ingest-apply-gate.mjs --check --packet <path>` PASSes. Missing packet is a refuse. Copy `scripts/fixtures/cad-ingest-apply-gate/packet.template.json`. Census is GROUP BY tax_year with no `tax_year =` filter. Path comes from leftover-year n, not from the prompt. Packet `ldtSha` must equal `46e1a5a1`. Missing or other SHA is a refuse. Caldwell 2025 rows stay as written. Do not flip L17. WDLL `_inbox/2026-08-25_cad_ingest_apply_gate_WDLL.md`.

## Next legal write

P-78 merge is already on serving main (`#477` `72cffc8`). Caldwell leftover 48055 @ tax_year 2025 is already in store (Path B insert). The next leftover county is a later card and must pass the apply gate first.

P-75 LDT #475 and P-76 LDT #476 serve. Do not re-merge them.

## Memory

Compiled dispatches now carry the verbatim FLEET MEMORY (M0) block. Canon-gate M6 refuses a stripped block. Do not raise `.github/memory-backlog-pin.json`. Live gate 2026-08-25T05:03Z: 85 untriaged > pin 64. Triage is a planner decision in `_catalog/memory_promotion_log.jsonl`, then lower the pin in the same commit. Do not self-promote `MEMORY.md` from a sub-agent.

## Do not start

Dallas / Tarrant CAMA. Travis CAMA to fix 280238. P-09 footprint apply (engine main still bbox). Harris PBF / COVER. Factory 2 city warm. Rematerialize for a prettier Manifest. Count L20 rows as footprint or as a satisfied zoning cell. Quote the 2026-08-08 node/edge proposal as shipped law.
