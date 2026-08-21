---
id: blueprint_00_readme
title: Master blueprint — the mesh
status: draft
last_updated: 2026-08-21
compiled_at_commit: 4b174d1b129fa9eee54464967fe7da2b03828a72
applies_to: portfolio
owner: nick
related: [_blueprint/00_WDLL, 90_operations/OPS-18_canon_reconciliation_plan_of_record]
---

# Master blueprint — the mesh

Compiled at doc_repo `4b174d1b129fa9eee54464967fe7da2b03828a72` (integration worktree `P:/doc_repo`, branch `main`, 2026-08-21). Dispatch snapshot cited `54970f3`; tree had moved before this session started.

This file classifies every document in the canon set for the reconciliation program. Status counts are reconcilable against the tables below.

## Status counts

| Status | Count |
| --- | ---: |
| AUTHORITATIVE | 14 |
| SUBORDINATE | 22 |
| SUPERSEDED | 6 |
| QUARANTINE | 0 |
| REFERENCE | 18 |
| **Total classified** | **60** |

Contract npm surface counted separately (AUTHORITATIVE, not markdown).

## Contract vs ADR precedence

Where `@empressaio/atom-contract@1.22.0` (npm, fetched 2026-08-21) and an ADR disagree:

1. **Types and field shapes** — contract wins. It is the only artifact that refuses to compile.
2. **Architectural intent and reversal criteria** — ADR wins when accepted and not superseded.
3. **ADR marked `proposed`** — contract wins for shipped fields; ADR wins for intent pending acceptance. ADR-028 is `proposed` but fields from 1.9.0–1.22.0 are live on npm; treat contract as authoritative for shape, ADR-028 as SUBORDINATE intent until accepted.
4. **Production store vs contract** — store audit (`_inbox/2026-08-20_store_audit_atom_graph.md`, 2026-08-20T23:03Z) wins for *what is populated*; contract wins for *what ought to be populated*.
5. **Versions 1.9.0–1.22.0** — no ADR documents these releases. `./property`, `./reasoning`, `./testing` subpaths are undocumented in ADR band; contract export map is AUTHORITATIVE.

## AUTHORITATIVE (14)

| Document | Governs (blueprint section) |
| --- | --- |
| `@empressaio/atom-contract@1.22.0` (npm) | `10_model`, `20_pipeline`, `40_rule_register` — types, conformance, `./property` families, `derive*NodeId` (OG/mineral only; no parcel mint), `verifiedAbsence`, `externalKeys`, `keyKind` |
| `51_ingestion_pipeline_reference.md` | `20_pipeline`, `30_lifecycle`, `40_rule_register` — four-layer spine, adapter contract, resolution tiers, meaning-shaped checks |
| `ENFORCEMENT.md` | `40_rule_register`, `50_grading` — fail-closed doctrine (consumer: prose in agent context = UNENFORCED) |
| `61_enforcement_doctrine.md` | `40_rule_register` — source for ENFORCEMENT; three-question gate |
| `80_adrs/adr_001_atom_architecture.md` | `10_model` — atom four-layer registration pattern |
| `80_adrs/adr_010_atom_graph_traversal.md` | `10_model`, `20_pipeline` — Postgres index + IPFS bodies; `atom_links` edge layer (production: DID-native, not `target_cid`) |
| `80_adrs/adr_011_atom_identity_across_versions.md` | `10_model` — DID + supersession; column `atom_did` formula |
| `80_adrs/adr_017_atom_access_control.md` | `10_model`, `40_rule_register` — `accessPolicy` five-value union |
| `80_adrs/adr_018_atom_contract_substrate_layer.md` | `10_model` — Hauska substrate placement |
| `80_adrs/adr_020_recorded_instruments_and_restriction_clauses.md` | `10_model` — private encumbrance types; `appliesTo` in body for instruments |
| `80_adrs/adr_021_constraint_resolution_and_precedence.md` | `10_model` — precedence among constraints |
| `_blueprint/00_WDLL.md` | `50_grading` — done criteria D1–D7, violation set V1–V15 |
| `_inbox/2026-08-20_store_audit_atom_graph.md` | `10_model`, `40_rule_register` — production ground truth 2026-08-20T23:03Z |
| `90_operations/OPS-18_canon_reconciliation_plan_of_record.md` | Program scope — rows R-00 through R-09 |

## SUBORDINATE (22)

| Document | Elaborates | Must not contradict |
| --- | --- | --- |
| `25_atom_architecture_reference.md` | ADR-001 spec detail | ADR-001, atom-contract |
| `80_adrs/adr_007_cross_stakeholder_atom_access.md` | ADR-017 scopes | ADR-017 |
| `80_adrs/adr_012_atom_export_format.md` | Pack export | ADR-010 |
| `80_adrs/adr_028_contract_cross_vertical_adoption.md` | Proposed 1.8.0+ field groups | atom-contract 1.22.0 where shipped |
| `77_place_graph_strategy.md` | Strategic place-node framing | `51_ingestion_pipeline_reference` for storage mechanics |
| `77b_cotality_integration_strategy.md` | Retired vendor posture | Standing decision: Cotality EXTINGUISHED |
| `46_smartcity_parcel_intelligence.md` | Parcel composition consumers | `10_model` |
| `49_code_ingestion_pipeline.md` | Code corpus ingest | `20_pipeline` |
| `49b_encumbrance_ingestion_pipeline.md` | Private instrument ingest | ADR-020 |
| `08_tiered_access_model.md` | Layer 1/2 commercial tiers | ADR-017 |
| `90_runbooks/AGENT_CONTRACT.md` | Lane law | ENFORCEMENT |
| `90_runbooks/DEV_PROCESS.md` | Measurement and judging rules | ENFORCEMENT |
| `90_runbooks/fleet_memory_practice.md` | Tier 2 scratch promotion | OPS-18 R-04 |
| `90_operations/OPS-13_store_topology.md` | Store layout | store audit |
| `90_operations/OPS-16_texas_market_plan_of_record.md` | Texas scoped work | Not blueprint (plan of record) |
| `90_operations/OPS-17_govtech_stack_plan_of_record.md` | Govtech scoped work | Not blueprint |
| `01_doc_conventions.md` | Doc frontmatter | — |
| `01a_atom_conventions.md` | Atom-first fleet rules | ADR-001 |
| `_catalog/repo_intents.md` | Repo ownership | seat_register |
| `_catalog/thesis_parity_ledger.md` | Cross-vertical parity | ADR-028 |
| `65_t25_enforcement_wave.md` (if present as W-17/W-30 source) | Launch-wave findings | store audit |
| `OPS/51_ingestion_pipeline_reference.md` | Pointer only | root `51_ingestion_pipeline_reference.md` |

## SUPERSEDED (6)

| Document | Replaced by | Notes |
| --- | --- | --- |
| `@hauska/atom-contract` (npm, frozen 1.6.1) | `@empressaio/atom-contract` | Rename 2026-07-06 |
| ADR-001 v1.3 Empressa ownership note | ADR-018 | Substrate under Hauska |
| ADR-010 `target_cid` index column name (design seed) | Production `atom_links(from_atom_did,to_atom_did,link_type)` | store audit Q2 |
| Tier2 flood tile-centroid path | Retired path; consumer repoint owed | V9 |
| Partnership-first sourcing ethic | Tenant sovereignty (`_decisions/2026-06-09_retire_partnership_first_amend_constitution.md`) | Standing decisions |
| Regrid / Cotality as join keys | County GIS / public record | Standing decisions |

## QUARANTINE (0)

No documents quarantined in R-01. Contradictions are ruled in `10_model.md` and filed for operator where unresolved (ADR-028 vs empty `knowledge_atoms`).

## REFERENCE (18)

Narrative, strategy, history — governs nothing in the blueprint compile:

`09_post_saas_substrate_thesis.md`, `11_roadmap.md`, `16_commercialization_roadmap.md`, `27_engine_evolution_plan.md`, `41_three_wedge_spine_strategy.md`, `42_stub_thesis_national_twin_substrate.md`, `CLAUDE.md`, `AGENTS.md`, `00_current_state.md`, `_STATE.md`, `71_pipeline.md`, `72_hauska_inc_operations.md`, `18_stakeholder_graph.md`, `30b_smartcity_design_system.md`, `30c_smartcity_platform_ia.md`, `_sessions/*` (except where cited as evidence), `_decisions/*` (decision record, not compiled model), `_dispatches/*`, plan rows OPS-16/OPS-17 amendment history.

## Mesh compile order

When building or grading an artifact:

1. Read npm `@empressaio/atom-contract@1.22.0` export surface.
2. Read `51_ingestion_pipeline_reference.md` for pipeline and check shape.
3. Read ADRs 001, 010, 011, 017, 020, 021 for model disputes.
4. Read store audit for production population and starvation.
5. Read `40_rule_register.md` for executable rules and consumers.
6. Grade with `50_grading.md`.

## Pre-registered self-checks (R-01)

| Check | Result |
| --- | --- |
| **Wrong:** mesh indexes only markdown | **Rejected:** npm contract row is AUTHORITATIVE with section bindings |
| **Wrong:** negative grep for `atom_links` means no edge table | **Rejected:** store audit Q2 — 33,066 rows, four indexes on `hauska_mcp.atom_links` |

Second mechanisms considered for each; unfavorable checks reported above per WDLL hazards.
