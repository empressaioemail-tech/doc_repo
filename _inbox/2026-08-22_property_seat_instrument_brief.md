---
id: 2026-08-22_property_seat_instrument_brief
title: Property seat brief — what the instrument contract changes about work in flight
date: 2026-08-22
from: doc_repo integration planner (business / thesis session)
to: property seat / SmartSite in-flight planner
status: brief — new items need plan rows before dispatch
related:
  - 19_the_instrument_contract
  - 24_instrument_conformance_program
  - _inbox/2026-08-22_planner_handoff_business_thesis_agent
  - _decisions/2026-08-22_atom_layering_target_state
  - 80_adrs/adr_030_declared_is_not_armed_contract_surface_governance
---

# Property seat brief

Read this instead of `19` and `24`. They are the governing documents and they are four hundred and six hundred lines; everything below is only what the property seat owns, plus what changes about work already moving.

**Nothing here is dispatchable yet.** Items marked NEW have no plan row. Dispatches compile against a plan of record, so those need an OPS amendment and an operator go before they leave this document.

## Mapping — your rows against the program

| Your row | Program item | Relationship |
|---|---|---|
| Verdict serve (your new P0) | T1.5 | **Same work.** Your draft acceptance items stand. One dependency below. |
| Track A: one logical roll per parcel | T1.1 | **Same problem, different solution.** See the delta. |
| Your 2b: identity aliases | T1.1 + T1.2 | Same. T1.2 is substrate, not yours. |
| P-59 scorers to Command Center | Track B | Unchanged in scope; two semantic conditions below. |
| P-60 map layers | Track B | Unchanged. |
| Track A: CAMA metros, harvest, StratMap parse | T1 data plane | Unchanged and still P0. Not blocked by any of this. |
| Track C: governance, gate contract bump | substrate | **Not yours.** Substrate seat. |
| — | T1.3 classify 21 entity types | **NEW** |
| — | T1.4 demote enumerated families | **NEW** |
| — | T1.6 lineage edges | **NEW**, after T1.1 |
| — | T1.7 declare the unrecoverable | **NEW** |
| — | T2.17, T2.18 Smart Files membership | **NEW** |
| — | T2.19 audience-blind content function | **NEW** |
| — | T2.20 import the accessPolicy enum | **NEW**, already named in the 2026-08-22 layering decision |
| — | T5 measurements | **NEW**, two items |

## Deltas to work already moving

**Verdict serve ships two of three verdicts now.** `absent-verified` and `lookup-failed` need nothing new. `not-applicable` requires knowing the node's shape, and shape does not exist yet in the contract, so either ship it behind a per-family applicability table as an interim and declare that it is one, or hold the third verdict until shape lands. Do not fake it with a boolean; that is the defect the whole exercise exists to stop. Metro structural gaps are `lookup-failed`. Unincorporated land with no zoning authority is `not-applicable` and is the reason the third verdict is worth having.

**Track A should not build tier-stamp reconciliation as the consistency mechanism.** `source_vintage` stays useful as provenance metadata. It is not the fix. Three natural keys for one parcel are reconciled by minting an opaque node and making `txgio`, `prop_id` / `geo_id` and `entity_id` aliases with validity. Reconciling by convention means the next source makes it four, which is how the markets side reached twelve representations of one instrument. Your own 2b already calls identity a Track A prerequisite; this is the same conclusion, stated as the mechanism.

**CAMA loading is not blocked, and has one ordering preference.** Every row landing before the branded id and the write-refusal boundary is another few million rows keyed on a natural key that the migration then absorbs. That boundary is a substrate item, cheap, and wants to be in front of the metro loads rather than behind them. If it cannot be, load anyway; this is a preference and not a gate.

**P-59 scorers carry two semantic conditions.** A scorer reads the verdict as its input, not a boolean, or it gets built twice. And `not-applicable` must never score as a gap, which is what currently makes unincorporated land read as zero percent covered when the correct answer is that the category does not exist there.

## New items you own

**T1.3 Classify the 21 entity types.** Provenance class (Record, Observation, Derivation, Synthesis), subject kind (extensional or intensional), and `chainAnchoring` (contemporaneous or backfill) are properties of the type, not the row. Twenty-one decisions, not a hundred million edits. Once declared, the serve layer renders class-correctly even where historical rows are thin. This is the cheapest fix available for the evidence gap and it needs no ingest.

**T1.4 Demote the enumerated families.** Flood, rail, pipeline and special district sit at 90 to 151 percent of the parcel count because a regional claim was copied onto every parcel it touches. Write one selector atom per panel, corridor and district, point the existing rows at it through `derivesFrom`, mark them Derivation. Roughly fifty million rows stop presenting as measurements about somebody's parcel. **They are not deleted.** Materialisation is required where the predicate cannot be indexed, and the August flood work measured read-time evaluation at 218 to 362 times slower, so the rows keep serving throughout.

**T1.6 Lineage edges** for parcel splits and merges, after node minting, and only where the split records exist.

**T1.7 Declare the unrecoverable.** Rows whose provenance was never captured carry a declared pre-contract marker or are re-derived from source. Nothing invents a fetch record for a row that never had one.

**T2.17 and T2.18, Smart Files.** The membership read signature requires `knowledgeAt`, so a current-state join cannot satisfy it. What was in a room when a counterparty looked is a question that ends up in front of a lawyer. And no cascade on membership: removing a document from one room must not delete it from others, asserted by a schema test.

**T2.19 Audience-blind content.** The content function takes no audience parameter; rendering is a separate downstream function. This makes it structurally impossible for one surface to show what another cannot, which is the class of the live defect where inspect shows flood present and compare shows it absent on the same parcel.

**T2.20 Import the accessPolicy vocabulary rather than copying it.** Smart Files reproduces the five-value union as literal SQL CHECK constraints in two migrations, and the engine's instances list is missing `tenant-shared`. Generate the constraint from the contract with a CI equality test that fails on drift.

## Two measurements — CLOSED 2026-08-23, both by this seat

Delivered before this brief was read, in `a911921`. Both changed the governing document, folded in at `cd966c0`.

**Four-property score.** Property 3.0 / 2.0 / 2.5 / 2.5, mean 2.50, against markets 3.5 / 3.5 / 3.0 / 1.0, mean 2.75. The mirror premise was too neat: markets leads on three axes and property leads on economics alone. **Evidence at 2.0 is the largest single gap in the portfolio** and is the property the entire thesis rests on. Both seats answer the acid test no.

**Enumerated-family provenance: CONFIRMED, and smaller than feared.** All 62,256 Bastrop flood atoms carry one county bulk provenance signature, and the two distinct timestamps are write-batch boundaries rather than per-parcel fetches. The citation text is honest and names the bulk load. The defect is classification: `reasoningKind: observed` on every row, no `inputAtoms`, no `provenanceClass: Derivation`.

**T1.4 is rescoped accordingly** and is now much smaller: set the class to Derivation, populate `inputAtoms` with the regional source, replace `observed` with derived, and stop stamping per-parcel timestamps that imply per-parcel measurement. Per family, not per row. Nothing is re-fetched and no citation is rewritten.

## Not yours

The branded id type, the discriminated provenance classes, the closed vocabularies, the selector algebra, the access decomposition, `canonical(id, knowledgeAt)`, the entitlement result type, the resolver signatures, and the six probes are all substrate seat. There is a separate brief for them. Do not write into `hauska-atom-contract` or `hauska-mcp-server`; request the change.
