---
id: quarantine_index
title: Quarantine index — documents moved because they contradict the blueprint or share a live id
status: active
last_updated: 2026-08-21
applies_to: portfolio
owner: integration
related: [_blueprint/00_WDLL, _blueprint/40_rule_register, 90_operations/OPS-18_canon_reconciliation_plan_of_record]
---

# Quarantine

Moved, never deleted. R-02 second half. Each moved file names the blueprint rule or duplicate-id class that made it move.

This is not a dump of every unclassified document. The mesh still has 60 rows against an unbounded canon set (R-01 D1 FAIL). Full classification remains R-02 remainder.

## Moved this pass (2026-08-21)

| File | From | Rule or class | Why |
| --- | --- | --- | --- |
| `2026-07-05_draft_adr_025_og_atom_ontology.md` | `_inbox/` | duplicate id `adr_025_og_atom_ontology` (two_bodies, diverged) | Live body is `80_adrs/adr_025_og_atom_ontology.md`. The inbox draft still carries the same `id` and an older body. That is the 51-incident class. |
| `2026-08-08_L2_WAVE3_report_a2.md` | `_inbox/` | duplicate id `2026-08-08_L2_WAVE3_report` (two_bodies, diverged) | Keep `_inbox/2026-08-08_L2_WAVE3_report.md`. The a2 file is a shorter second body on the same id. |
| `2026-08-08_M2_historical_replay.md` | `_inbox/` | duplicate id `canon_divergence` (two_bodies, diverged) | Live report is `_catalog/canon_divergence.md`. The replay is a historical ALARM body on the same id. |

## Held, not moved (operator)

Accepted ADRs and the place-graph strategy contradict the compiled blueprint in present-tense sentences. OPS-18 standing constraint: no decision is reversed by an agent. Quarantining them would hide the decision record. They stay. The contradicted rule is named so R-02 remainder or the operator can move or rewrite.

| File | Rule contradicted | Sentence class |
| --- | --- | --- |
| `80_adrs/adr_028_contract_cross_vertical_adoption.md` | BP-BITEMP-01 | Section 3 cites `knowledge_atoms` as proving the bitemporal shape in production. Store audit Q10: table exists, 0 rows. |
| `77_place_graph_strategy.md` | BP-EDGE-01 | Purpose sentence still says every fact is a typed edge on the place node. `10_model.md` supersedes that for storage. Also still lists Regrid `ll_uuid` as parcel identity. |
| `80_adrs/adr_010_atom_graph_traversal.md` | Atoms/Edges layer table in `10_model.md` | Present-tense `target_cid` index and "bodies live in IPFS." Production is DID pairs on `atom_links` and JSONB bodies. Mesh SUPERSEDED the column name as a fake document rather than this file. |

## Identical copies not moved

Four SmartSite white papers exist as byte-identical pairs (`Master Collateral Folder/` untracked, `_inbox/` tracked) plus `_scratch/removed_*` shadows. Those are not the 51-incident class. Changing their `id` or collapsing the copy is R-02 remainder, not a contradiction move.

Pointer stubs under `OPS/` (`61`, `62`, `90_enforcement_build_order`, `91_branch_protection_runbook`) stay. They are the benign pair.
