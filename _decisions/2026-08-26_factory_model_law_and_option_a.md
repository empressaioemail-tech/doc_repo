---
decision_id: 2026-08-26_factory_model_law_and_option_a
date: 2026-08-26
owner: Nick (operator), recorded by integration seat
status: active
related_canonical:
  - _decisions/2026-08-26_factory_program_and_hold_lifts.md
  - _inbox/2026-08-26_factory_program_design.md
  - 90_operations/OPS-19_factory_plan_of_record.md
  - 19_the_instrument_contract.md
  - _blueprint/10_model.md
  - _blueprint/20_pipeline.md
  - _blueprint/40_rule_register.md
  - 51_ingestion_pipeline_reference.md
  - 24_instrument_conformance_program.md
  - _decisions/2026-08-22_atom_layering_target_state.md
  - 80_adrs/adr_030_declared_is_not_armed_contract_surface_governance.md
---

# Decision

Two rulings, 2026-08-26, later session than the program-opening decision.

**1. The Factory is built to the instrument contract and the blueprint, not to the store as written today.** Its model law is `19_the_instrument_contract.md`, `_blueprint/10_model.md`, `_blueprint/20_pipeline.md`, `_blueprint/40_rule_register.md`, `_blueprint/50_grading.md`, `51_ingestion_pipeline_reference.md` (adopted in full as the write-path law), `24_instrument_conformance_program.md`, and the adopted layering target state, with the published package `dist/*.d.ts` as the tiebreaker where documents disagree. The Factory's stations are the four layers and the five canonicalisation stages of that law, and each stage is the named executor of the `BP-` rules it runs. The first design draft, which named stations after the three factories and drained borrowed keys into per-parcel rows, is superseded by `_inbox/2026-08-26_factory_program_design.md` as rewritten today.

**2. Option A for the existing write path.** P-82-lite (multi-row `atom_links`, per-leg timing, the write-time binding refusal BP-WRITE-01 on the existing `writePropertyAtomsBatch`) lands as a bug fix. Bexar 48029 cad finishes its resume on the current shape, because those rows are already in the store, their keys are already canonical grammar, and the fix is idempotent. After that, **no new county is written on the old shape**: the Texas remainder, Harris 48201 and Dallas 48113 included, waits for the conformant writer (stage E under the Track 2 types). Texas takes longer; nothing new is written that P-69 would later have to declare unrecoverable.

## Context

The operator asked what information the planner was using for the shape of nodes, atoms and edges. The answer was the store's current shape (P-55 key grammar, `applies-to` edge, 17 entity types), not the model ratified 2026-08-22, whose armed-state table marks identity, subject expressions, and confidence and provenance on the property store as NOT ARMED. The blueprint's rule register lists twenty-two `BP-` rules of which twenty have no executor. A second agent's research located the four documents where the model lives and the split between them. Building the Factory to the current shape would have industrialised V1 through V15 at national scale.

## Structural commitment check

- Sell reasoning, not data: every atom carries class-required provenance and a confidence basis; edges carry their own provenance; verdicts replace empty chains.
- Confidence is earned: resolution decisions are atoms; adjudication feeds calibration; `verifiedLevel` needs a second derivation.
- Cost per jurisdiction: unchanged as a measurement; the intensional demotion removes the write amplification that inflated it.
- Dual interface: the instrument is assembled under a lens for agent or human; content is audience-blind.
- Tenant sovereignty and no privileged data: unchanged; access becomes two fields when the contract carries them.

## Reasoning

51 §remediation gives a dependency order, and step 1 (write-time binding validation, the cheapest item and the one that stops the orphan population growing) is exactly the shape of P-82-lite plus BP-WRITE-01. Step 6 (backfill from landing after steps 1 to 5) is where new fills belong. Option A is that order applied to the live situation: fix the leak, finish the one county already mid-rewrite, then fill only through the new path. Option B (fill Texas on the current shape now, upgrade later) was rejected because every cell it moved would become T1.4, T1.6 and T1.7 work at the same write amplification the blueprint measured, and because the target state's rule is overlay, never merge in place.

## Reversal criteria

- The Track 2 types cannot be published on a horizon the operator accepts. Then a declared pre-contract writer may fill named counties with every row marked pre-contract at write (T1.7 applied prospectively), recorded as an amendment naming the counties, never silently.
- The resolution stage's tier 2 produces a provisional queue that only grows on Texas. Then the tier is narrowed to tier 1 plus adjudication until the matcher is calibrated, and the console shows the queue.
- The operator names a return to per-parcel enumeration for a specific family for serving performance. That is a materialisation decision under 19's selector rules (Derivation with `derivesFrom`), not a reversal of the model.

## Dependencies

Depends on: substrate seat delivering the Track 2 types in the contract (OPS-19 F-15); property seat splitting writers into adapters and stage E callers; the Factory store (F-01) and landing (F-19); the run ledger (F-03).

Unblocks: OPS-19 baseline v1 as re-frozen today; the drain card as re-scoped; Texas cleanup as T1.1 to T1.7 plus V1 to V15 on the new path.

Does not unblock: any per-parcel fill of an intensional family; any new county on the existing writer; `smartcity-os` writes; the two open P-66 types until the operator rules them.
