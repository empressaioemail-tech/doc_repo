---
id: 2026-08-08_BLUEPRINT_doc_inventory
title: Blueprint doc inventory — what already exists per target domain, its currency, and where it contradicts itself
date: 2026-08-08
status: inventory (read-only audit; no build plan, no recommendations)
owner: nick
related: [90_operations/OPS-INDEX_operator_manual, 90_runbooks/factory_onboarding_runbook, 90_operations/OPS-5_cert_standard, _decisions/2026-08-07_envelope_saga_close_and_geometry_law, 90_operations/QUEUE_parked_work_index]
---

# Blueprint doc inventory

Read-only inventory of existing documentation mapped against the twelve target blueprint domains. Classification legend: AUTHORITATIVE (current, reusable as-is) / STALE (real content, out of date, needs refresh) / FRAGMENT (partial, must be folded in) / CONTRADICTORY (conflicts with another named doc) / ABSENT (nothing exists).

Every classification below rests on a doc read in this session via the Read or Grep tool. Where a claim about currency could not be traced, it is named in the WHAT I COULD NOT DETERMINE section rather than guessed.

## Repo-wide counts

Total markdown files in the repo (excluding `.git`): **1,689**.

| Directory | .md count |
|---|---|
| `_inbox/` | 560 |
| `_dispatches/` | 312 |
| `_sessions/` | 216 |
| (repo root) | 158 |
| `_decisions/` | 89 |
| `hauska-mcp-server/` (vendored repo tree) | 49 |
| `90_operations/` | 39 |
| `_smartcity_masters/` | 30 |
| `90_runbooks/` | 29 |
| `_scratch/` | 28 |
| `_research/` | 25 |
| `80_adrs/` | 25 |
| `_verticals/` | 16 |
| `_calibrated_spine_roadmap/` | 13 |
| `Master Collateral Folder/` | 11 |
| `_prospects/` | 10 |
| `_smartsite_masters/` | 9 |
| `_architecture_homes/` | 8 |
| `.claude/` | 8 |
| `65_sensors/` | 7 |
| `_sales/` | 6 |
| `91_postmortems/` | 6 |
| `64_recursive_loop/` | 6 |
| `tmpbrief-l3-spine-consume/` | 5 |
| `_projects/` | 5 |
| `_land_records/` | 5 |
| `_catalog/` | 4 |
| `19_hardware_sovereignty/` | 4 |
| `24_adaptive_ui/` | 3 |
| `_thoughtbank/` | 2 |
| `_hauska_brief_extension/` | 1 |

The load-bearing operational corpus is concentrated in 39 `90_operations/` docs plus 29 `90_runbooks/` docs plus 25 ADRs. The 560-file `_inbox/` and 312-file `_dispatches/` are raw run artifacts and dispatch text, not curated documentation; many domain facts live only there.

## Domain 1 — Factory build blueprint (pipeline end to end)

| Doc path | last_updated | Classification | Note |
|---|---|---|---|
| `P:\doc_repo\90_runbooks\factory_onboarding_runbook.md` | 2026-08-04 (frontmatter); body amended through 2026-08-08 | AUTHORITATIVE with a stale frontmatter date | The single most complete end-to-end pipeline doc. 455 lines. Covers both lanes (unzoned county C1-C7, zoned city Z1-Z11), the footprint/easement rails section 1C, the shared gate, fallbacks/traps, ledger, Warden, regression protection, ten OPEN items with authoritative planner corrections, the Wave-1 addendum, and cascade keyspace sharding. Body carries a "2026-08-08 amendment" (dry/apply parity) while frontmatter still reads `date: 2026-08-04`. |
| `P:\doc_repo\90_operations\OPS-2_county_onboarding_runbook.md` | 2026-08-02 | STALE | The original six-stage line (Stage 0 registry authoring → 1 acquire → 2 currency/join → 3 warm → 4 inset → 5 promote → 6 cert). Conceptually the cleanest stage articulation in the repo, but predates the gate model (OPS-8), the Elgin/county lanes, the rails (1C), and the Geometry Law. Also carries the BCAD-ring line flagged under Domain 8. |
| `P:\doc_repo\90_operations\OPS-INDEX_operator_manual.md` | 2026-08-03 | AUTHORITATIVE (as an index) | The front door: five non-negotiables, read order for OPS-WDLL→recipe→OPS-3→OPS-1→OPS-2→OPS-5→OPS-4→OPS-6→OPS-7→OPS-0, the eight-step run loop, the deploy traps, the standing-decisions paste block, and an honest "this manual is prose and that is a crutch" section. Does not yet point at `factory_onboarding_runbook.md`, which is now the more complete pipeline doc. |
| `P:\doc_repo\90_operations\OPS-WDLL_the_factory.md` | 2026-08-03 | AUTHORITATIVE | Definition of the factory, what DONE looks like at jurisdiction grain (9 items) and machine grain (A-E), what BROKEN looks like, and kill criteria. |
| `P:\doc_repo\90_operations\OPS-8_blocker_free_onboarding_model.md` | 2026-08-03 | AUTHORITATIVE (design), STALE (foundation-gap section) | The pre-flight-gate inversion + eight checks + dual defect ledger + build order. Its "FOUNDATION GAP" paragraph describes a single-row `jurisdiction-registry.ts` with only BASTROP_REGISTRY_ROW — superseded by the multi-row registry now in production (county + Elgin + Guadalupe + Caldwell + McLennan rows all live per the defect backlog and OPS-1 T6 section), but the paragraph is not marked as closed. |
| `P:\doc_repo\90_operations\OPS-0_MASTER_game_plan.md` | 2026-08-02 | STALE | Build/run charter; predates the gate, the county lane, and the catch-up program. |
| `P:\doc_repo\90_operations\PHASE_C_mechanism_vs_prose_SPEC.md` | 2026-08-02 | FRAGMENT | The `onboard(county_fips)` mechanism-vs-prose mapping (which steps are mechanism vs prose an agent must interpret). Load-bearing for "why it was built that way" but scoped to Phase C. |
| `P:\doc_repo\90_operations\PHASE_C_*` (8 files) | 2026-08-02/03 | SUPERSEDED, NOT MARKED | Eight PHASE_C_* handoff/resume docs (`CORRECTED_operate_block13_path`, `FINISH_bastrop_city_remaining_blocks`, `HANDOFF_bastrop_warm`, `RESUME_R33_warm_cert_alignment`, `RESUME_full_sweep_then_blocks`, `RESUME_merge_then_rewarm`, `RESUME_recompute_divergence`, `RESUME_sf1_unblock`). All are executed-and-closed dispatch text carrying no status flip. Several carry facts that survive (the DB env split correction in `RESUME_sf1_unblock`), which is why they cannot simply be ignored. |
| `P:\doc_repo\27a_jurisdiction_factory_engine_spec.md` | 2026-07-25 | STALE / competing | Pre-OPS-band factory engine spec. |
| `P:\doc_repo\27d_county_onboarding_recipe_and_fleet_reliability.md` | 2026-07-27 | STALE / competing | `status: spec (draft, awaiting operator approval)` — never approved; superseded by the OPS band and the runbook. |
| `P:\doc_repo\28_THE_BASTROP_MOLD_engine_build_spec.md` | 2026-07-30 | STALE / competing | `status: living spec` but not updated since 2026-07-30, i.e. before the entire OPS band, the gate, the county lane, and the Geometry Law. |
| `P:\doc_repo\29_scale_warm_architecture.md` | 2026-07-29 | STALE / competing | `status: spec (draft — sketch for refinement)`. |
| `P:\doc_repo\27_MASTER_WDLL_spine_completion_and_depth_engine.md` | 2026-07-25 | STALE | Master WDLL predating the OPS band. |
| `P:\doc_repo\90_operations\CATCHUP_program_2026-08-05.md` | no frontmatter date | AUTHORITATIVE (program state) | T1-T6 track structure, heavy-scan slot rule, coordination rules, and the PERMANENCE RULE ("nothing closes as a one-off... a master-planner consolidation pass confirming the runbook/OPS docs fully describe the upgraded factory"). |

Coverage verdict: strong but **duplicated across two generations** (the 27/28/29/30 root-band specs versus the 90_operations OPS band versus the runbook), with the newest truth split between `factory_onboarding_runbook.md` and OPS-2/OPS-5.

## Domain 2 — County manifest / county shape (what a complete county is)

| Doc path | last_updated | Classification | Note |
|---|---|---|---|
| `P:\doc_repo\90_operations\OPS-1_texas_source_registry.md` | 2026-08-05 | AUTHORITATIVE for sources; FRAGMENT for acceptance criteria | Names Rails A/B/C/D, the TxGIO StratMap Rail-C spine (253/254 counties, Donley absent, 249 stale, eight high-bad-prop_id counties), the registry row schema, the frozen adapter routing, and the T6 statewide checkpoint (254/254 in roster, 253/254 CAD probed, 173 verified / 22 partial / 59 absent). Its own STATUS section still says "the engine reads NONE of this today — it uses hardcoded per-county adapters," which conflicts with the live multi-row registry the runbook and defect backlog describe. |
| `P:\doc_repo\_land_records\source_rail_registry.md` | not read in full | FRAGMENT | Named by OPS-1 as the rail definition source. |
| `P:\doc_repo\_land_records\ingest_architecture.md`, `strategy.md`, `risk_register.md`, `README.md` | not read | FRAGMENT | Land-records band; relationship to the current rails model not established here. |
| `P:\doc_repo\_catalog\texas_roster_v1.json` / `.csv` | machine artifact | AUTHORITATIVE (data) | The machine-readable roster. |
| `P:\doc_repo\_catalog\t6_vendor_pattern_library.json`, `tx_jurisdiction_source_registry.json`, `tx_registry_shards/` | machine artifacts | AUTHORITATIVE (data) | |
| `P:\doc_repo\90_operations\T3_rails_track.md` | none | FRAGMENT | Adds footprints + easements as permanent rails; Phase 2 backfill across onboarded jurisdictions still OPEN. |
| `P:\doc_repo\80_adrs\adr_029_building_footprint_and_utility_easement_rails.md` | not read in full | AUTHORITATIVE (contract shape) | Named by the runbook §1C as the contract for `building-footprint` and `utility-easement`. |
| `P:\doc_repo\90_runbooks\factory_onboarding_runbook.md` §1C | 2026-08-05 addition | AUTHORITATIVE | The registry-row field freeze table for footprint/easement, FE1-FE7 steps, current-cohort defaults (0/11 counties have CAD footprint REST; ML fallback default). |
| `P:\doc_repo\90_operations\T6_texas_roster_recon_track.md` | none | FRAGMENT | Roster recon track. |
| **A single "complete county manifest"** — the enumerated rail list (parcels, setbacks, zoning, roads, flood, footprints, easements, RRC, MUD, owner, land use) with source and acceptance criterion per rail, in one table | — | **ABSENT** | No doc enumerates all eleven named rails together. Parcels/zoning/setbacks/footprints/easements live in OPS-1 + runbook §1C + ADR-029. Roads live in `27c_road_node_engine_and_warm_digital_twin_spec.md` (2026-07-26). Flood/terrain are described as "per-parcel serve-time rails, city-agnostic" in runbook step C1 but have no acceptance-criteria doc. RRC and MUD appear ONLY in `75m_map_data_visual_benchmark.md` (see Domain 3 contradiction) and in the parked LightBox W3/W4 rows. Owner and land use appear as Rail B in OPS-1 with no acceptance criterion. |

## Domain 3 — Smart Site application (customer product surface)

| Doc path | last_updated | Classification | Note |
|---|---|---|---|
| `P:\doc_repo\_smartsite_masters\00_README.md` through `08_..._glossary_and_quick_reference.md` (9 docs) | all 2026-08-04 | AUTHORITATIVE (positioning/marketing/technical narrative) | The most complete Smart Site set. `04_smart_site_technical_white_paper.md` carries a five-invariant design section (provenance intrinsic, correctness verified not asserted, fails honestly, currency verified not trusted, one truth two doors) that is the closest thing in the repo to a written invariant register outside OPS-3. These are outward-facing narrative, not an operational serve-path spec. |
| `P:\doc_repo\75j_property_explorer_destination_ledger.md` | 2026-07-23 | STALE (real content) | The destination-vs-current ledger, 16 dimensions with % complete. Its "Current" column is dated 2026-07-21 — before the paywall ship, the Smart Site rebrand, three county certs, and the envelope saga. |
| `P:\doc_repo\76j_smartsite_launch_readiness_program.md` | 2026-08-05 | AUTHORITATIVE | Workstreams A (paywall/entitlement, SHIPPED), B (domain/branding), C (rate limit, capacity), D (affiliate). Carries live deploy identifiers. |
| `P:\doc_repo\76h_property_explorer_gtm.md` | not read | FRAGMENT | |
| `P:\doc_repo\40j_hauska_map_tile_build_pipeline.md` | 2026-08-05 | AUTHORITATIVE (tiles only) | Tile build pipeline; a serve-path leg, not the whole app. |
| `P:\doc_repo\75o_site_plan_export_spec.md` | 2026-07-25 (`status: in_progress`) | FRAGMENT | Site-plan export surface. |
| `P:\doc_repo\75m_map_data_visual_benchmark.md` | 2026-06-19 | **CONTRADICTORY + STALE** | See the verbatim contradiction below. Enumerates every map layer with status legend LIVE/FIX/GATE/BRIEF/FREE-UNWIRED/NEW. Entire framing is organized around "The Cotality split," and Cotality is extinguished per standing decision. |
| `P:\doc_repo\75k_max_map_quality_direction.md` | 2026-06-18 | STALE | Same Cotality-era framing, `status: active`. |
| `P:\doc_repo\75l_cotality_data_stack_catalog.md` | 2026-07-13 | correctly marked `superseded-as-plan-of-record` | The only Cotality doc that flipped status. |
| `P:\doc_repo\77b_cotality_integration_strategy.md` | 2026-06-06 | SUPERSEDED, NOT MARKED | Still `status: active` while Cotality is extinguished. |
| `P:\doc_repo\90_runbooks\cotality_mcp_setup.md` | 2026-06-06 | SUPERSEDED, NOT MARKED | A connection-setup runbook for a dead vendor; standing memory says never rotate its credential. |
| **A doc naming the Smart Site serve paths end to end** (PE app → BFF → cortex-api → retrieval-api → engine-api → atoms; which surface reads which store; PMTiles vs live query; free vs paid facet resolution) | — | **ABSENT** | Facts exist scattered across `76j`, `40j`, `_STATE.md` LIVE INFRA, and MEMORY items. No single serve-path doc. |

### Confirmed contradiction 3.1 — 75m marks MUD and RRC "LIVE" via the dead Cotality-era path

`P:\doc_repo\75m_map_data_visual_benchmark.md` line 61 and line 63, verbatim:

> `| TX Comptroller MUD/PID | State | Special-district encumbrance | free | LIVE on map (2026-06-19) |`

> `| Texas RRC | State (TX) | O&G wells, pipelines (public) | free | LIVE on map (2026-06-19) |`

and line 159 and line 192, verbatim:

> `| MUD/PID districts | Special-district overlay | LIVE | none (2026-06-19) | keep |`

> `| O&G / minerals | Wells + lease overlay | LIVE | none (TX RRC, 2026-06-19) | keep |`

Against `P:\doc_repo\90_operations\QUEUE_parked_work_index.md` line 47, verbatim:

> `| W4 MUD layer | HELD same ruling. WARNING: 75m marks MUD+RRC "LIVE" — that is the dead Cotality/extension path, NOT Smart Site; treat as greenfield | same as W3 |`

and line 46, verbatim:

> `| W3 RRC layer (due-diligence-retention rationale; PR #90 stays parked; T3 rule stands — RRC pipelines NEVER mint utility-easement atoms) | HELD by 2026-08-01 scale-before-new-layers ruling — completeness arguments are what it resists; NO competitive-gap exception granted now | revisit at holistic process review or explicit operator override |`

The contradiction is live and only one side carries the correction. 75m is `status: active` with no supersession marker; the correction exists only inside a QUEUE table cell.

## Domain 4 — Command Center (internal operator console)

| Doc path | last_updated | Classification | Note |
|---|---|---|---|
| `P:\doc_repo\90_operations\OPS-6_command_center_engine_console.md` | 2026-08-02 | STALE (real content) | Names the five factory-floor panels (County Ledger, Engine State, Freeze/Memory State, Rewarm Control, Cert View) and honestly states what is stub: `{ id: 'resolver', ... stub: true }`, `{ id: 'engine-console', label: 'Autonomous Engines', ... stub: true }`, rendering "Not yet wired — Phase 2+ backlog." Predates the OPS-9 S1 County Ledger v2 rebuild, which shipped (per the runbook §3: "cmdcenter LIVE with the v2 County Ledger (bundle index-DE1wozNI...)"). So the doc's stub inventory is now partly wrong and partly still right, with no way to tell which from the doc. |
| `P:\doc_repo\90_operations\OPS-9_scale_ops_specs_pack.md` §S1 | 2026-08-04 | AUTHORITATIVE (spec) | The County Ledger v2 spec: registry-rows-not-counties row model, the eight-check gate verdict column, cert column, per-rail coverage with a correct denominator, open defect classes, the FOCUSED-FIX LEDGER (named as "the missing OPS-8 CC half"), source vintages. Also records the operator-observed defects it fixes (9801.0% coverage, UNCERTED-while-certs-exist, fips-only rows, Node & Graph DEGRADED). |
| `P:\doc_repo\27b_f1_command_center_completion_program.md` | 2026-07-25 | STALE / competing | An earlier full CC completion program with its own phase/gate structure (Phase 0 retrieval restore, Gate A, Gate B). Predates OPS-6 and OPS-9 S1 and describes an outage that has since been resolved. |
| `P:\doc_repo\90_runbooks\factory_onboarding_runbook.md` §3 "Where it renders" | 2026-08-04 | AUTHORITATIVE (deploy + row model) | Records that CC deploys to Vercel project `cmdcenter` (blush) NOT `command-center` (jade), the row model, and that the v2 ledger shipped verified live. |
| **A current panel-by-panel CC inventory** (what exists on the deployed console today, what each panel reads, what is still stub) | — | **ABSENT** | OPS-6's stub list is 2026-08-02; OPS-9 S1 is a spec of intent; neither is a post-ship inventory. QUEUE carries "Warden findings-to-CC surfacing polish" as open. |

## Domain 5 — MCP servers (architecture, gates, tools, auth, code paths)

| Doc path | last_updated | Classification | Note |
|---|---|---|---|
| `P:\doc_repo\50_hauska_mcp_server.md` | 2026-07-05 | AUTHORITATIVE-ish but layered with superseding notes | The frontmatter `last_updated` field is a paragraph of stacked revision history rather than a date, recording successive tool-count corrections (40 → 46 → 62 → four-gate). Hard to read as current state. |
| `P:\doc_repo\44_mcp_cortex_architecture_map.md` | 2026-05-22 | STALE, self-declared | Carries three stacked "partly superseded" banners including an explicit "A full refresh of this map against the post-deploy topology is owed" and "full rewrite owed in the doc scrub." Its six facts include ones now false: fact 2 says forty tools; fact 5 says the retrieval API is not deployed and the MCP server runs only on the operator's workstation. |
| `P:\doc_repo\_architecture_homes\03_mcp_gate_and_agent_surface.md` | 2026-06-21 | STALE | The gate rework standard; predates the deployed four-gate 63-tool state recorded in CLAUDE.md. |
| `P:\doc_repo\29_mcp_surface_tier_model.md` | 2026-05-16 | STALE | |
| `P:\doc_repo\28_mcp_first_product_design.md` | 2026-05-19 | AUTHORITATIVE (principle only) | The MCP-first design principle; not an architecture doc. |
| `P:\doc_repo\51_substrate_v1_sprint.md` | 2026-05-21 | STALE | Sprint doc, not architecture. |
| `P:\doc_repo\hauska-mcp-server\` (49 .md, plus `src/`, `migrations/`, `deploy/`, `tests/`, `docs/`, `observability/`) | — | AUTHORITATIVE (code) | A vendored copy of the MCP server repo tree lives inside doc_repo. This is the actual code path for audit, and it is not referenced by any of the architecture docs above. |
| `P:\doc_repo\CLAUDE.md` ground-truth paragraph | 2026-07-15 introspection | AUTHORITATIVE (counts) | "63 tools across four gates (public/codex/reporting/map) on deployed main as of 2026-07-15 (live introspection: public 6 / codex 5 / reporting 46 / map 6)" with the instruction to verify live before quoting. This is currently the most accurate MCP statement in the repo and it lives in CLAUDE.md, not in a domain doc. |
| Auth mechanics (`X-Hauska-Key` header, not Bearer; malformed keys 401; no-header anonymous → public) | — | FRAGMENT | Documented in MEMORY.md items and CLAUDE.md, not in `50_hauska_mcp_server.md` as read. |

Coverage verdict: **the domain doc set is materially behind the code, and every doc knows it.** The most current facts are in CLAUDE.md and memory, not in the 50/44/29/03 chain.

## Domain 6 — Data contract layer (atom shapes, accessPolicy, provenance, honest-absence)

| Doc path | last_updated | Classification | Note |
|---|---|---|---|
| `P:\doc_repo\80_adrs\adr_018_atom_contract_substrate_layer.md` | 2026-05-18 (accepted) | AUTHORITATIVE (placement ruling) | Atom contract as Hauska commercial substrate. |
| `P:\doc_repo\80_adrs\adr_017_atom_access_control.md` | 2026-05-16 (accepted) | STALE on the enum | Ratified the accessPolicy union as four values. Per CLAUDE.md's 2026-06-06 recon, the live contract has a five-value union (`public-free`, `public-paid`, `platform-internal`, `tenant-private`, `tenant-shared`, the fifth added in 1.2.0). The ADR is not amended. |
| `P:\doc_repo\80_adrs\adr_001_atom_architecture.md`, `adr_007`, `adr_010`, `adr_011`, `adr_012`, `adr_013`, `adr_015` | 2026-05 era | AUTHORITATIVE (each ruling) / STALE (aggregate picture) | ADR-001 carries a v1.3 ownership note that CLAUDE.md explicitly declares superseded. |
| `P:\doc_repo\80_adrs\adr_020_recorded_instruments_and_restriction_clauses.md`, `adr_021_constraint_resolution_and_precedence.md`, `adr_025_og_atom_ontology.md`, `adr_026_sensor_stream_atoms.md`, `adr_028_contract_cross_vertical_adoption.md`, `adr_029_building_footprint_and_utility_easement_rails.md` | various | AUTHORITATIVE (each family) | The atom families beyond data/skill/execution/actor/intent. |
| `P:\doc_repo\25_atom_architecture_reference.md` | 2026-05-18 | STALE | Pre-dates the encumbrance, workspace, footprint, and easement families and the five-value enum. |
| `P:\doc_repo\01a_atom_conventions.md` | 2026-05-27 | STALE | Atom-first context rules. |
| `P:\doc_repo\_catalog\atoms_index.md` | 2026-05-28 | STALE | The portfolio atom index, three months behind the families that have shipped since. |
| Honest-absence semantics | — | AUTHORITATIVE, but split across two docs | `P:\doc_repo\90_operations\OPS-7_coverage_and_honesty_doctrine.md` (2026-08-02) is the doctrine: fail-closed, never fabricate, never silent-degrade; the three kinds of absence (NOT-ONBOARDED, GENUINELY-ABSENT, CONFLICTING); the first-hit rule; the coverage-headline rule. `P:\doc_repo\_smartsite_masters\04_smart_site_technical_white_paper.md` §1 states the same as design invariants. |
| The contract-shape STOP ruling (no fabricated `setback-rule` absence; envelope-decline-only via R27, code `unzoned-no-district-basis`) | runbook step C2 | AUTHORITATIVE but buried | A load-bearing contract ruling documented only inside a runbook step and the defect backlog. QUEUE carries "Atom-contract first-class absence variants ADR" as a queued ADR slot, i.e. the ruling has no ADR. |
| Provenance/confidence rules as an enforced contract | — | FRAGMENT | CLAUDE.md commitment #1 and #2 state the rule; OPS-WDLL item 2 states it; the technical white paper §1 states it; no doc enumerates the enforcing check per field. |

## Domain 7 — Store topology (databases, authority, propagation legs)

| Doc path | last_updated | Classification | Note |
|---|---|---|---|
| **A store-topology doc** | — | **ABSENT** | This is the single worst-covered domain. No doc in the repo describes the store topology as its subject. |
| `P:\doc_repo\90_operations\QUEUE_parked_work_index.md` line 27 | 2026-08-05 | evidence the gap is known | The HOLISTIC PROCESS REVIEW agenda row names "data-store topology (three-store split, propagation legs)" as a candidate thread for a session that has not happened. |
| `P:\doc_repo\90_runbooks\factory_onboarding_runbook.md` §0.5, §3 "Backing store", §4 "Env contract", and PLANNER CORRECTION 6 | 2026-08-04 | FRAGMENT (the best fragment) | Gives the authoritative env→store mapping: `DATABASE_URL` = atoms Neon (project `hauska-prod-497015`); `TXGIO_DATABASE_URL` = legacy-design-tools-prod `DEPLOYMENT_DATABASE_URL` secret, where `txgio_parcel` lives; `CORTEX_DATABASE_URL` only for cert grading paths reading per-parcel setback records; ledger store = the cortex Neon holding `onboarding_ledger_event`, `jurisdiction_registry_row_mirror`, `county_gate_cert_state`. |
| `P:\doc_repo\90_operations\PHASE_C_RESUME_sf1_unblock.md` line 15 | 2026-08-02 | FRAGMENT | Verbatim: `DB ENV: substrate atoms on hauska-prod DATABASE_URL; txgio_parcel + county_facet_coverage on CORTEX_DATABASE_URL. (NOT "both on cortex Neon".)` — a correction of an earlier handoff, preserved only in a superseded dispatch doc. |
| `P:\doc_repo\90_operations\PHASE_C_mechanism_vs_prose_SPEC.md` line 32 | 2026-08-02 | FRAGMENT | Records the same correction as a mechanism-gap row. |
| `P:\doc_repo\44_mcp_cortex_architecture_map.md` fact 4 | 2026-05-22 | STALE | "Two databases on one Neon cluster, plus a separate substrate Neon" — the cortex-prod cluster holds `neondb` + `hauska_mcp`; substrate corpus on a separate Neon. Predates txgio. |
| `P:\doc_repo\_architecture_homes\01_homes_and_topology.md` | 2026-06-21 | STALE | Repo topology, not store topology. |
| Propagation legs (atoms → Tier-1 snapshot → txgio stamp → served facet → PMTiles) | — | **ABSENT** | The legs are exercised in the runbook steps Z6/Z7/Z8 and in `40j`, but no doc states which store is authoritative for which fact and in which direction data propagates. The defect backlog's `crossStoreConsistency` Warden check ("txgio_parcel stamp vs Tier-1 snapshot vs zoning-fact atom agree", OPS-9 §S5) is the only place the three-way relationship is named. |

## Domain 8 — Verification and instrument inventory

| Doc path | last_updated | Classification | Note |
|---|---|---|---|
| `P:\doc_repo\90_operations\OPS-5_cert_standard.md` | 2026-08-06 | **CONTRADICTORY** (see 8.1) + otherwise AUTHORITATIVE | The two gates (mechanical area-sweep + operator R6), cert scope/anti-sampling, the four per-parcel mechanical gates, warm-time geometry gates, area-sweep cert, Warden v1.2 `envelopeSanity`, Warden v1.3 `serveTruthEdgeLabels`, serve-truth write path, cert units table, honest-absence at cert, the cert ledger. |
| `P:\doc_repo\_decisions\2026-08-07_envelope_saga_close_and_geometry_law.md` | 2026-08-07 | AUTHORITATIVE (the newest law) | The eight-point Geometry Law, the ten-PR fix chain (#266-#275), the four-judge unanimous close, and the explicit instruction that the law is to be folded verbatim into OPS-5 and the runbook at consolidation. That fold has not happened. |
| `P:\doc_repo\90_runbooks\factory_onboarding_runbook.md` §4 THE WARDEN, §5 REGRESSION PROTECTION | 2026-08-04/08 | AUTHORITATIVE | Warden env contract, the six checks (four shipped: `neighborConsistency`, `servePathTruth`, `crossStoreConsistency`, `certFreshness`; `envelopeSanity` v1.2 and `serveTruthEdgeLabels` v1.3 added; `edition drift` and `provenance integrity` deferred by ruling per planner correction 5), the files-never-fixes constraint with its structural import-guard test (engine PR #229), the block13 7/7 standing gate, drift-pin tests, cert-freshness sweeps. |
| `P:\doc_repo\90_operations\OPS-8_blocker_free_onboarding_model.md` | 2026-08-03 | AUTHORITATIVE | The eight pre-flight checks with defectClass per failing check, plus the explicit pre-flightability caveat naming what the gate CANNOT prove ("Geometry R28/R33 parity on ~5 samples bounds risk but does not prove the cohort... The gate reduces mid-run stalls; it does not certify the run in advance."). |
| `P:\doc_repo\90_operations\OPS-3_engine_contract_determinism_register.md` | 2026-08-02 | AUTHORITATIVE (register) + STALE (leak status) | The determinism register table (eight engines, kind, home, frozen inputs, output atom, verified state) and the three named nondeterminism leaks. Row 7 says cert is "ON BRANCH (gap #2)"; OPS-5 says gap #2 CLOSED 2026-07-31. |
| `P:\doc_repo\30_block_cert_harness_spec.md` | 2026-07-30 | STALE / competing | The block-cert harness spec predating the generalized cert lane, area-sweep, and the Geometry Law. |
| `P:\doc_repo\90_runbooks\product_surface_smoke_suite.md` | 2026-08-05 | AUTHORITATIVE | Live GET probes for PE/engine/retrieval health, card-vs-sheet setback consistency on three Bastrop parcels, envelope sanity, `/search`. 16/16 live pass recorded. |
| **An instrument inventory** (every gate/check in one table, with what it checks, what it CANNOT see, and what frame it grades against) | — | **ABSENT** | The instruments are OPS-8 preflight (8 checks), the cert harness (`block13-cert-grade.mjs` with grade-modes default and unzoned), the ground-truth predicate module (#266/#272/#274), the live-ring conformance harness (#268/#271), Warden v1.1-v1.3 (6 checks, 4-6 shipped), the product-surface smoke suite, the drift-pin tests, and the plain-geometry independent sweep (`plain-geometry-twelve-sweep.mjs`). No doc lists them together, and only OPS-8 and the Geometry Law state negative capability (what an instrument cannot see). |

### Confirmed contradiction 8.1 — OPS-5's R28 grades against the BCAD ring; the Geometry Law rules txgio is THE truth frame

`P:\doc_repo\90_operations\OPS-5_cert_standard.md` line 34, verbatim:

> `- **R28** — recompute boundary primitive when stored normals disagree with the working BCAD ring (winding swap at equal vertex count).`

`P:\doc_repo\_decisions\2026-08-07_envelope_saga_close_and_geometry_law.md` line 21 (Geometry Law point 1), verbatim:

> `1. ONE RING PER PARCEL: the geometry the product displays (txgio serving ring) is the geometry envelopes are constructed FROM, verified AGAINST, and served ON. Alternative sources (live CAD) are currency instruments that FLAG divergence; they never silently substitute.`

and line 17, verbatim (the PR that ruled it):

> `#273 Serve-Consistency (txgio is THE truth frame; BCAD demoted to divergence reporting; PARCEL-RING-SOURCE-DIVERGENCE observation class); #274 construction pinned to txgio + predicate escape valves closed (predicate must equal plain geometry within 0.5 ft).`

and line 36, verbatim (the decision naming this exact reconciliation as unfinished):

> `The cert lane's historical BCAD grading frame is a NAMED OPEN ITEM: reconcile cert frame with the serve-consistency law before the next county cert wave.`

Confirmed. OPS-5 (`last_updated: 2026-08-06`) predates the decision (2026-08-07) by one day and still names BCAD as the working ring for R28. The decision itself names the reconciliation as open, so this is a known-but-unclosed contradiction, not an undiscovered one.

Related, same species, one level up: `P:\doc_repo\90_operations\OPS-2_county_onboarding_runbook.md` line 33, verbatim:

> `BCAD rings trusted, no scrub (A5); recompute primitive on ring-swap + winding invariant (R28); edge-role re-derive to frontage (R30); inset per-edge (R0); conditional convexity gate (R29); invalidate stale envelope on source-repeal (R27). OUTPUT: buildable-envelope atom (+ recipe-version).`

"BCAD rings trusted" is the same superseded frame, in the Stage 4 INSET definition, in a doc nobody has flagged.

## Domain 9 — Failure taxonomy (defect classes, detection instrument, disposition)

| Doc path | last_updated | Classification | Note |
|---|---|---|---|
| `P:\doc_repo\90_operations\onboarding_defect_class_backlog.md` | 2026-08-05 frontmatter; rows through 2026-08-08 | AUTHORITATIVE | The class register table: `PROBE-UNWIRED`, `MEASURE-EMPTY-COHORT`, `ADAPTER-NEEDED`, `PARCEL-LAYER-UNWIRED`, `SUPERSEDED-GT3PCT`, `GEOMETRY-DIVERGE`, `SERVE-PATH-UNHEALTHY`, `COST-GATE`, `MIXED-VINTAGE`, `REASON-OVERSTATES`, `ELGIN-CERT-RESIDUAL`, `CERT-VS-SERVE-EDGE-MISMATCH`, `DRY-APPLY-PARITY-DRIFT`, `PLAIN-GEOM-INSTRUMENT`, `WARDEN-SITUS-ADDR`, `ELGIN-FORCE-OVERWRITE-MISSING`, plus `PROPID-GEOMETRY-NONUNIQUE` and `CAD-COHORT-VINTAGE-DRIFT` and `WARDEN-MIXED-CITY-BLIND-SPOT` and `ENVELOPE-SHAPE-ANOMALY` named elsewhere in the file and in the runbook. Each row carries members, the fix that clears the class, and status. Frontmatter date lags the newest rows by three days. |
| `P:\doc_repo\90_operations\OPS-8_blocker_free_onboarding_model.md` | 2026-08-03 | AUTHORITATIVE (the model) | Defines the dual ledger: CC per-jurisdiction gaps column plus the class-grouped backlog, both off one event source. |
| `P:\doc_repo\90_runbooks\factory_onboarding_runbook.md` §2 FALLBACKS & TRAPS | 2026-08-04 | AUTHORITATIVE (process-failure taxonomy) | A second, distinct taxonomy of PROCESS failures: CI conclusion-string gating, flake triage, image-race, merged-not-applied migrations, key-desync, Cloud Run traffic pinning, executor dispatch boilerplate, tmp-clone push-early, STOP-on-false-premise, dry-run-must-predict-apply, identical engine SHA, operate-not-rebuild. |
| `P:\doc_repo\_decisions\2026-08-07_envelope_saga_close_and_geometry_law.md` point 3 | 2026-08-07 | AUTHORITATIVE (names the master class) | Verbatim: `WRITE-THEN-VERIFY: ... Gate-one-representation-serve-another is the master defect class (five instances this saga: cert-vs-serve, stale generations, scrubbed-ring frame, BCAD-vs-txgio, dump frames) and is now structurally unrepresentable.` |
| `P:\doc_repo\91_postmortems\` (6 docs) | not read | FRAGMENT | Post-mortem band; not folded into the class register as read. |
| `P:\doc_repo\90_operations\FINDING_2026-08-03_factory_product_setback_disconnect.md` | 2026-08-03 | correctly marked RETRACTED | A retracted finding kept as provenance. Good practice; a model for how supersession should be marked. |
| Disposition (who fixes, in what order, how a class closes) | — | AUTHORITATIVE but split | OPS-8 (fix by class, off the critical path), the backlog's Status column, and the Warden's files-never-fixes constraint together define disposition. No single statement. |
| **A unified taxonomy joining data-defect classes to detection instrument to disposition** | — | FRAGMENT | The backlog gives class + fix + status but not, per row, which instrument detects it. That mapping exists implicitly (preflight → the eight defectClasses; Warden → `MIXED-VINTAGE-NEIGHBOR`, `ENVELOPE-SHAPE-ANOMALY`, `CERT-VS-SERVE-EDGE-MISMATCH`; cert → `ELGIN-CERT-RESIDUAL`) but is never written as a mapping. |

## Domain 10 — Environments and deploy topology

| Doc path | last_updated | Classification | Note |
|---|---|---|---|
| `P:\doc_repo\_STATE.md` LIVE INFRA section | 2026-08-08 | AUTHORITATIVE (point-in-time) | Serving revisions per service with tags and projects, self-labelled "verify before quoting; they churn." |
| `P:\doc_repo\90_operations\HEALTH_CHECK_2026-08-05_verdict.md` "Serving truth" table | 2026-08-05 | AUTHORITATIVE (point-in-time) | Six services with serving revision, health, and note; plus a "Repo truth" mains table. |
| `P:\doc_repo\90_runbooks\cloud_run_canary_deploy.md` | 2026-05-22 | AUTHORITATIVE (procedure) | The tag → no-traffic → smoke → shift sequence. |
| `P:\doc_repo\90_runbooks\property_brief_cortex_deploy.md` / `brokerage_cortex_deploy_checklist.md` | 2026-05-28 | STALE | Pre-date the current cortex-api canary form. |
| `P:\doc_repo\90_runbooks\buildout_deploy_wiring_checklist.md` | 2026-06-08 | STALE | |
| `P:\doc_repo\90_runbooks\legacy_design_tools_replit_to_cloud_run_cutover.md`, `replit_deploy.md`, `replit_neon_migration.md`, `cutover_env_var_bind_procedure.md`, `smartcity_cloud_run_env_audit_2026-05-11.md` | 2026-05 era | SUPERSEDED, NOT MARKED | Replit-era cutover runbooks, all `status`-less or active, for a migration that completed. |
| `P:\doc_repo\90_runbooks\neon_schema_migration_via_cloud_shell.md` | 2026-06-06 | AUTHORITATIVE (procedure) | |
| `P:\doc_repo\90_runbooks\factory_onboarding_runbook.md` §2 (image-race, migrations, key-desync, traffic pinning) + Wave-1 addendum item 4 (concrete `gcloud` invocations for `LEDGER_INGEST_URL`/`LEDGER_INGEST_KEY`) | 2026-08-04 | AUTHORITATIVE | The most current deploy-hazard set in a doc. |
| **A deploy-topology doc** (every service → its GCP project or Vercel project → its deploy method → its secrets) | — | **ABSENT** | The facts exist and are individually reliable, but they live across `_STATE.md`, the health check, six runbooks, and roughly a dozen MEMORY.md entries (engine-api = Cloud Build with `services/engine-api/Dockerfile`, project `hauska-prod-497015`; cortex-api = workflow_dispatch canary; smartcity-api = tag + `--no-traffic` + smoke + shift; CC = Vercel project `cmdcenter` not `command-center`; hauska-map does NOT auto-deploy on merge; PE root directory `apps/property-explorer`). Memory is planner-only and does not travel; the standing decision is that it must be pasted into every dispatch. |

## Domain 11 — Economics (cost per jurisdiction, per rail, vs the sub-$200 commitment)

| Doc path | last_updated | Classification | Note |
|---|---|---|---|
| `P:\doc_repo\CLAUDE.md` commitment #3 + Cost per jurisdiction rule | current | AUTHORITATIVE (the commitment) | "Under 200 dollars compute plus one hour human review per new jurisdiction. Hard kill at three counties if not achievable." |
| `P:\doc_repo\90_operations\OPS-WDLL_the_factory.md` | 2026-08-03 | AUTHORITATIVE (the kill criterion) | Names cost-gate clearance as DONE item 8 and cost breach as a hard kill. |
| `P:\doc_repo\90_operations\OPS-8_blocker_free_onboarding_model.md` | 2026-08-03 | AUTHORITATIVE (the gate) | `costGate` as one of the eight pre-flight checks with `defectClass: COST-GATE`. |
| `P:\doc_repo\90_operations\onboarding_defect_class_backlog.md` | 2026-08-05 | AUTHORITATIVE (the measurements) | Records actual gate outputs: "cost $14.11 est < $200", "cost $14.10-14.13 < $200". |
| `P:\doc_repo\90_runbooks\factory_onboarding_runbook.md` planner correction 10 and OPEN item 10 | 2026-08-04 | AUTHORITATIVE (the caveat) | Verbatim: `Cost figures are gate-methodology ESTIMATES (named constants, estimate-flagged in output) — directional for differently-sized jurisdictions, never quote as measured.` Also records the Elgin bake's live `compute` block: `{"units":70093,"wallMs":229685,"approxUsd":0.1421,"costGateUsd":200,"flaggedOverCost":false}`. |
| `P:\doc_repo\14_pricing_framework.md` | 2026-06-09 | STALE, and about pricing not COGS | Customer pricing, not per-jurisdiction cost. |
| `P:\doc_repo\90_operations\HEALTH_CHECK_2026-08-05_verdict.md` | 2026-08-05 | FRAGMENT | Names "cost-model error" as one of four latent program-level defects the instruments caught. The nature of that error was not established in this audit. |
| **A per-rail economics doc** (cost attributable to acquisition vs stamp vs warm vs cert vs each rail, with measured-vs-estimated marked) | — | **ABSENT** | Cost is measured only as a single per-jurisdiction gate estimate. No rail-level breakdown exists. Human-review hours (the second half of commitment #3) are not tracked in any doc read. |
| **A running per-jurisdiction cost ledger** across the certified roster | — | **ABSENT** | Individual figures appear in the defect backlog and session records; no doc aggregates them across the nine certified jurisdictions. |

## Domain 12 — Invariants (things that must be true forever + the enforcing check)

| Doc path | last_updated | Classification | Note |
|---|---|---|---|
| `P:\doc_repo\_decisions\2026-08-07_envelope_saga_close_and_geometry_law.md` | 2026-08-07 | AUTHORITATIVE — the prototype | Eight numbered laws (one ring per parcel; truth is the raw ring; write-then-verify; predicate == plain geometry; instrument independence; conformance not templates; coordinate-keyed references; store-truth sizing). The only invariant set in the repo that pairs each law with the concrete defect it prevents and the PR that enforced it. |
| `P:\doc_repo\90_operations\OPS-3_engine_contract_determinism_register.md` §THE INVARIANTS | 2026-08-02 | AUTHORITATIVE (statement), FRAGMENT (enforcement) | I1-I7: no LLM in warm/inset/verify/serve (with a named CI grep-gate); atom content-hash excludes timestamps; warm reads a staged vintaged snapshot; every promoted atom carries recipe-version; agents produce only frozen artifacts; fleet-memory installed in every product repo; unfrozen sticky-part decision = rewarm-unsafe. Named "enforced, not aspirational," but the same doc's THREE NONDETERMINISM LEAKS section states I2 and I3 are open (timestamp nondeterminism at `promote.ts:75` / `warm-compute.ts:116`; live-GIS-fetch at warm time), so at least two of the seven are stated-not-enforced. |
| `P:\doc_repo\_smartsite_masters\04_smart_site_technical_white_paper.md` §1 Design invariants | 2026-08-04 | AUTHORITATIVE (outward-facing statement) | Five invariants: provenance intrinsic; correctness verified not asserted; the system fails honestly; currency verified not trusted; one truth two doors. Explicitly says "These are not aspirations. Section 4 describes the gates and checks that enforce them." A parallel, differently-numbered invariant set from OPS-3's. |
| `P:\doc_repo\CLAUDE.md` four structural commitments | current | AUTHORITATIVE | Sell reasoning not data; confidence is earned not asserted; cost per jurisdiction; dual interface. A third invariant framing. |
| `P:\doc_repo\03_structural_constitution_and_drift_guard.md` | 2026-06-06 | STALE | The original constitution + drift guard, predating all three sets above. Referenced by `04_roadmap_alignment_audit.md`. |
| `P:\doc_repo\90_operations\OPS-INDEX_operator_manual.md` §THE FIVE THINGS THAT ARE ALWAYS TRUE | 2026-08-03 | AUTHORITATIVE (operator framing) | Operate-don't-rebuild; verify live never on a report; persisted == recompute; never fabricate; area-sweep never sample. A fourth framing. |
| **One invariant register** joining all of these with the enforcing check per line | — | **ABSENT** | Four separate invariant sets exist (Geometry Law 8, OPS-3 I1-I7, technical white paper 5, OPS-INDEX 5, plus CLAUDE.md 4 commitments), using different numbering and overlapping partially. Only the Geometry Law consistently names the enforcing mechanism per line. |

## (a) Docs clearly SUPERSEDED but not marked

| Doc path | Why superseded | Current status field |
|---|---|---|
| `P:\doc_repo\77b_cotality_integration_strategy.md` | Cotality extinguished (standing decision) | `status: active` |
| `P:\doc_repo\90_runbooks\cotality_mcp_setup.md` | Same | no status field |
| `P:\doc_repo\75k_max_map_quality_direction.md` | Cotality-era map direction | `status: active` |
| `P:\doc_repo\75m_map_data_visual_benchmark.md` | Cotality-split framing + MUD/RRC LIVE claim contradicted in QUEUE | `status: active` |
| `P:\doc_repo\44_mcp_cortex_architecture_map.md` | Self-declares "full rewrite owed"; facts 2 and 5 false | `status: active` |
| `P:\doc_repo\90_operations\PHASE_C_*` (8 files) | Executed dispatch text, program moved to catch-up tracks | operations-doc statuses, no closure flip |
| `P:\doc_repo\90_runbooks\replit_deploy.md`, `replit_neon_migration.md`, `legacy_design_tools_replit_to_cloud_run_cutover.md`, `cutover_env_var_bind_procedure.md`, `smartcity_cloud_run_env_audit_2026-05-11.md` | Replit era over | no supersession markers |
| `P:\doc_repo\27a`, `27d`, `28_THE_BASTROP_MOLD`, `29_scale_warm_architecture`, `30_block_cert_harness_spec`, `27_MASTER_WDLL` | Superseded by the OPS band + the runbook | `spec` / `living spec` / `draft awaiting approval` |
| `P:\doc_repo\27b_f1_command_center_completion_program.md` | Superseded by OPS-6 + OPS-9 S1 | `status: program` |
| `P:\doc_repo\80_adrs\adr_017_atom_access_control.md` | Four-value enum superseded by five-value live contract | accepted, unamended |
| `P:\doc_repo\90_operations\OPS-6_command_center_engine_console.md` stub inventory | County Ledger v2 shipped | `status: operations doc` |
| `P:\doc_repo\90_operations\OPS-3` row 7 ("Cert ... ON BRANCH (gap #2)") | OPS-5 records gap #2 CLOSED 2026-07-31 | unamended |
| `P:\doc_repo\90_operations\OPS-8` FOUNDATION GAP paragraph | Multi-row registry now live | unamended |
| `P:\doc_repo\90_operations\OPS-1` STATUS section ("the engine reads NONE of this today") | Registry rows are live engine inputs | unamended |

Only 20 docs repo-wide carry `status: superseded|retired|archived`, and most of those are `_decisions/`, `_dispatches/`, `_sessions/`, or `_inbox/` files rather than canonical band docs. Two docs model the practice well: `75l_cotality_data_stack_catalog.md` (`superseded-as-plan-of-record`) and `90_operations/FINDING_2026-08-03_...` (titled "RETRACTED FINDING").

## (b) Duplicate / competing docs covering the same domain

| Domain | Competing docs |
|---|---|
| Factory pipeline | `90_runbooks/factory_onboarding_runbook.md` vs `90_operations/OPS-2_county_onboarding_runbook.md` vs `27a_jurisdiction_factory_engine_spec.md` vs `27d_county_onboarding_recipe_and_fleet_reliability.md` vs `28_THE_BASTROP_MOLD_engine_build_spec.md` vs `29_scale_warm_architecture.md` — six docs, three generations, no cross-supersession notes |
| Cert / verification | `90_operations/OPS-5_cert_standard.md` vs `30_block_cert_harness_spec.md` vs `_decisions/2026-08-07_..._geometry_law.md` |
| Command Center | `90_operations/OPS-6_command_center_engine_console.md` vs `90_operations/OPS-9_scale_ops_specs_pack.md` §S1 vs `27b_f1_command_center_completion_program.md` |
| MCP architecture | `50_hauska_mcp_server.md` vs `44_mcp_cortex_architecture_map.md` vs `_architecture_homes/03_mcp_gate_and_agent_surface.md` vs `29_mcp_surface_tier_model.md` vs the CLAUDE.md ground-truth paragraph |
| Invariants | Geometry Law vs OPS-3 I1-I7 vs `_smartsite_masters/04` §1 vs OPS-INDEX five things vs CLAUDE.md four commitments vs `03_structural_constitution_and_drift_guard.md` |
| Map/data layer status | `75m_map_data_visual_benchmark.md` vs `75k_max_map_quality_direction.md` vs `90_operations/T3_rails_track.md` vs `90_operations/QUEUE_parked_work_index.md` LightBox table |
| Smart Site product definition | `_smartsite_masters/` (9 docs) vs `75j_property_explorer_destination_ledger.md` vs `76j_smartsite_launch_readiness_program.md` vs `76h_property_explorer_gtm.md` |
| Atom architecture | `25_atom_architecture_reference.md` vs `01a_atom_conventions.md` vs `_catalog/atoms_index.md` vs the ADR series |
| Onboarding state / queue | `_STATE.md` vs `00_current_state.md` (frontmatter `last_updated: 2026-08-04`, newest body entry 2026-08-08) vs `90_operations/QUEUE_parked_work_index.md` vs `90_operations/CATCHUP_program_2026-08-05.md` — four rolling-state docs |

## (c) Domains with the WORST coverage

Ranked worst first, by whether a subject-matter doc exists at all:

1. **Domain 7, Store topology — ABSENT.** No doc has this as its subject. Facts exist only as env-var mappings inside a runbook section and a correction preserved in a superseded PHASE_C dispatch. The gap is self-identified in QUEUE as an unscheduled agenda item.
2. **Domain 11, Economics — ABSENT below the headline.** The commitment, the gate, and single-run estimates exist; per-rail attribution, a cross-jurisdiction cost ledger, and human-review-hour tracking do not.
3. **Domain 2, County manifest — ABSENT as a manifest.** Sources are well documented per rail family, but no doc enumerates all eleven rails with acceptance criteria. RRC and MUD have no factory-side documentation at all (only the contradicted 75m and the parked LightBox rows). Flood and terrain have no acceptance doc.
4. **Domain 8, Instrument inventory — FRAGMENT.** Every instrument is documented individually; none of them are listed together, and negative capability ("what this cannot see") is stated in only two places.
5. **Domain 5, MCP — STALE across the board.** Every architecture doc self-declares out of date; the most accurate facts live in CLAUDE.md and MEMORY.md rather than in a domain doc, and a vendored copy of the server repo sits in `hauska-mcp-server/` unreferenced by any of them.
6. **Domain 10, Deploy topology — FRAGMENT.** Reliable individual facts, no consolidated map, and a large share carried in planner-only memory that does not travel to executors.
7. **Domain 4, Command Center — STALE.** Spec of intent (OPS-9 S1) and a pre-ship stub inventory (OPS-6), with no post-ship panel inventory.

Best-covered: Domain 1 (factory pipeline), Domain 9 (failure taxonomy), Domain 12 (invariants, as statements). Domain 6 (data contract) is well covered at the ADR grain and poorly covered at the aggregate grain.

## WHAT I COULD NOT DETERMINE

1. **Whether OPS-5's BCAD line is a live serving defect or only a doc lag.** The decision names the cert-frame reconciliation as an open item; I did not read engine code and cannot say whether the cert harness on main still grades against BCAD.
2. **The full content of docs I sampled by head or grep rather than reading end to end**: `90_operations/OPS-9_scale_ops_specs_pack.md` beyond S1-S3, `90_operations/OPS-4_rewarm_protocol.md` beyond the staleness-selector section, `90_operations/T1/T2/T4/T5/T6` track docs, `_land_records/*`, `80_adrs/adr_029` and most of the ADR series, `_smartcity_masters/*`, `91_postmortems/*`, `_verticals/*`, `_calibrated_spine_roadmap/*`, `64_recursive_loop/*`, `65_sensors/*`. Classifications for those rest on frontmatter, title, and cross-references, and are marked FRAGMENT or "not read" accordingly.
3. **The 560 `_inbox/` and 312 `_dispatches/` files were not enumerated individually.** Many domain facts (probe artifacts, cert JSONs, WDLL reports, the LightBox gap-closure spec at `_inbox/2026-08-08_lightbox_gap_closure_spec.md`, `_inbox/2026-08-05_T3_ingest_spec_footprints_easements.md`) live only there. A complete inventory of that corpus was out of scope for this pass; the ones named in this document are the ones that surfaced through cross-references in the docs I read.
4. **Whether `00_current_state.md` or `_STATE.md` is the intended primary rolling snapshot.** CLAUDE.md names `00_current_state.md`; `_STATE.md` opens with "read this FIRST, every session" and is more current (its header says 2026-08-08; `00_current_state.md` frontmatter says `last_updated: 2026-08-04` while carrying a 2026-08-08 body entry). Both are maintained. I did not find a ruling establishing precedence.
5. **The nature of the "cost-model error" named in the 2026-08-05 health check** as one of four latent program-level defects. The health check names it; I did not locate the doc that explains it.
6. **Whether `_smartsite_masters/04_smart_site_technical_white_paper.md` §4 (the gates and checks that enforce the five invariants) actually enumerates them,** and whether that enumeration agrees with OPS-3 I1-I7 and the Geometry Law. I read §0-§2 only.
7. **Live tool counts, live serving revisions, live schema.** Everything reported here about live state is quoted from a doc, not verified against `gh`/`gcloud`/`npm`/`psql`. Per CLAUDE.md's own ground-truth discipline, those numbers must be re-verified live before being quoted externally.
8. **Whether `_architecture_homes/05_scrub_tracker.md`** (last_updated 2026-07-20, and currently showing as modified in git status) already tracks some of the supersession items listed in section (a). I read only its frontmatter.
