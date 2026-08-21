---
id: quarantine_index
title: Quarantine index — documents moved because they contradict the blueprint or share a live id
status: active
last_updated: 2026-08-21
applies_to: portfolio
owner: integration
related: [_blueprint/00_WDLL, _blueprint/00_README, _blueprint/canon_set_listing.json, _blueprint/40_rule_register, 90_operations/OPS-18_canon_reconciliation_plan_of_record, 90_operations/OPS-18a_path_to_smartsite_market]
---

# Quarantine

Moved, never deleted. R-02b quarantine remainder against the bounded canon set (OPS-18a acceptance item 6). Each moved file names the blueprint rule or duplicate-id class that made it move.

The canon set is `_blueprint/canon_set_listing.json`: `countFiles` 237 plus `countNpm` 1, `countTotal` 238. Classification of that listing is `_blueprint/00_README.md`. This index is scored against that listing, not against every markdown file in the tree. R-02 is not fully closed. Census half already landed. This pass is the remainder only.

## Moved this pass (2026-08-21)

Prior R-02 quarantine half, kept. R-02b added zero new moves: every remaining census two_body is held below.

| File | From | Rule or class | Why |
| --- | --- | --- | --- |
| `2026-07-05_draft_adr_025_og_atom_ontology.md` | `_inbox/` | duplicate id `adr_025_og_atom_ontology` (two_bodies, diverged) | Live body is `80_adrs/adr_025_og_atom_ontology.md`. The inbox draft still carries the same `id` and an older body. That is the 51-incident class. |
| `2026-08-08_L2_WAVE3_report_a2.md` | `_inbox/` | duplicate id `2026-08-08_L2_WAVE3_report` (two_bodies, diverged) | Keep `_inbox/2026-08-08_L2_WAVE3_report.md`. The a2 file is a shorter second body on the same id. |
| `2026-08-08_M2_historical_replay.md` | `_inbox/` | duplicate id `canon_divergence` (two_bodies, diverged) | Live report is `_catalog/canon_divergence.md`. The replay is a historical ALARM body on the same id. |

## Held, not moved (operator)

Accepted ADRs and the place-graph strategy contradict the compiled blueprint in present-tense sentences. OPS-18 standing constraint: no decision is reversed by an agent. Quarantining them would hide the decision record. They stay. Rewrite is operator or planner, not a quarantine move.

| File | Rule contradicted | Sentence class |
| --- | --- | --- |
| `80_adrs/adr_028_contract_cross_vertical_adoption.md` | BP-BITEMP-01 | Accepted-partial is in flight (operator 2026-08-21, `_decisions/2026-08-21_adr028_accept_partial.md`). Planner amends the ADR. Quarantine is not owed. Verified-absence pair is real. `knowledge_atoms` is not production bitemporal proof (store audit Q10: table exists, 0 rows). |
| `77_place_graph_strategy.md` | BP-EDGE-01 | Purpose sentence still says every fact is a typed edge on the place node. `10_model.md` supersedes that for storage. Also still lists Regrid `ll_uuid` as parcel identity. |
| `80_adrs/adr_010_atom_graph_traversal.md` | Atoms/Edges layer table in `10_model.md` | Present-tense `target_cid` index and "bodies live in IPFS." Production is DID pairs on `atom_links` and JSONB bodies. Mesh SUPERSEDED the column name as a fake document rather than this file. |

## Remaining census two_bodies named why held (R-02b)

Census snapshot `_inbox/2026-08-21_r02-doc-census_close.json` at commit `8b68e432`. Not re-walked.

Four SmartSite white papers are byte-identical pairs. Inbox copies are tracked. `Master Collateral Folder/` copies are untracked and are not in git. Dispatch: if byte-identical, leave. SHA256 2026-08-21 at `e022436`:

| id | SHA256 | Why held |
| --- | --- | --- |
| `2026-07-31_smart_site_MARKET_white_paper` | `BEC1EDCE974D79FF06FCC47C13F97D0A01EF7B9DFDE785E0F1AF1B0555168116` | identical; Master Collateral untracked |
| `2026-07-31_smart_site_TECHNICAL_white_paper` | `C7BAA602E393B97D980C80826CA1BE7B094BD80B72B2C2BEC31FC5AFD15C5F37` | identical; Master Collateral untracked |
| `2026-07-31_smart_site_smart_city_positioning` | `E47C8BC837671D5732DF4F0822900648452E77D1815EE8C2EE098872A4995E72` | identical; Master Collateral untracked |
| `2026-07-31_smart_site_white_paper` | `08309ECE504425156E10E8020DA7436CE3CEF1F59287BC372C815FDB68513CD0` | identical; Master Collateral untracked |

Six `_smartcity_masters/` ids also have shadows under `_scratch/removed_2026-08-14/shadow_smartcity_masters/`. Nested `_scratch/` is gitignored (`.gitignore` `_scratch/*` with top-level `*.md` exception only). Dispatch: do not move `_scratch/`.

| id | Shadow path | Why held |
| --- | --- | --- |
| `smartcity_masters_readme` | `_scratch/removed_2026-08-14/shadow_smartcity_masters/00_README.md` | gitignored scratch |
| `31_smartcity_dashboards` | `_scratch/removed_2026-08-14/shadow_smartcity_masters/31_smartcity_dashboards.md` | gitignored scratch |
| `32_smartcity_asset_management` | `_scratch/removed_2026-08-14/shadow_smartcity_masters/32_smartcity_asset_management.md` | gitignored scratch |
| `33a_smartcity_plan_review` | `_scratch/removed_2026-08-14/shadow_smartcity_masters/33a_smartcity_plan_review.md` | gitignored scratch |
| `34_smartcity_smart_files_and_foundation` | `_scratch/removed_2026-08-14/shadow_smartcity_masters/34_smartcity_smart_files_and_foundation.md` | gitignored scratch |
| `35_smartcity_positioning_framework` | `_scratch/removed_2026-08-14/shadow_smartcity_masters/35_smartcity_positioning_framework.md` | gitignored scratch |

Pointer stubs under `OPS/` (`62_seat_topology`, `90_enforcement_build_order`, `91_branch_protection_runbook`) stay. They are the benign pointer_pair class. Dispatch: do not move pointer_pair OPS stubs.
