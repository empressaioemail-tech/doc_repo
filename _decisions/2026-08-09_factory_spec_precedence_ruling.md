---
id: 2026-08-09_factory_spec_precedence_ruling
title: Precedence ruling for the competing factory and pipeline specs (27-band, 28, 29, 30) against the runbook plus OPS band
date: 2026-08-09
status: decided
owner: nick
decided_by: planner (blueprint consolidation lane), operator-ratifiable
related: [90_runbooks/factory_onboarding_runbook, 90_operations/OPS-INDEX_operator_manual, 90_operations/OPS-WDLL_the_factory, 90_operations/OPS-0_MASTER_game_plan, 90_operations/OPS-2_county_onboarding_runbook, 90_operations/OPS-4_rewarm_protocol, 90_operations/OPS-5_cert_standard, 90_operations/T5_factory_throughput_track, 27_MASTER_WDLL_spine_completion_and_depth_engine, 27a_jurisdiction_factory_engine_spec, 27c_road_node_engine_and_warm_digital_twin_spec, 27d_county_onboarding_recipe_and_fleet_reliability, 27e_multitrack_program_structure_and_wave_plan, 27f_bastrop_through_v2_program, 28_THE_BASTROP_MOLD_engine_build_spec, 29_scale_warm_architecture, 30_block_cert_harness_spec, _inbox/2026-08-08_BLUEPRINT_doc_inventory]
---

# Precedence ruling for the competing factory specs

## Context

Nine root-band documents describe some version of the jurisdiction factory across three generations of thinking, and none of them carries a cross-supersession note. The 27-band was written 2026-07-25 through 2026-07-27 as a program architecture (master WDLL plus sub-WDLLs). 28 was written 2026-07-30 as the living mold. 29 and 30 were written 2026-07-29 and 2026-07-30 as scale and cert sketches. Meanwhile the operational reality moved into a different band entirely: the `90_operations/OPS-*` pack (OPS-0 through OPS-10, plus OPS-WDLL and OPS-INDEX) written 2026-08-02 through 2026-08-08, and `90_runbooks/factory_onboarding_runbook.md`, promoted from executor draft to active on 2026-08-04 and amended through 2026-08-08.

A fresh agent reading the root band today cannot tell which doc governs. Worse, the 27-band actively misdirects: 27a routes the reader to a program that shipped and closed (F1 / 27b), 27d and 27e and 27f each declare themselves "awaiting operator approval" for a sequencing that history overtook (the county fan-out ran; Bastrop went through cert; Guadalupe, Caldwell, McLennan, Elgin, Smithville and the county lane all landed), and 29 proposes an isolated-regenerate-then-swap architecture that was never built while the actually-shipped throughput mechanism is keyspace sharding under T5.

This ruling establishes precedence, names the surviving unique content in each doc so nothing is retired into oblivion, and applies status flips.

## The ruling

**`90_runbooks/factory_onboarding_runbook.md` GOVERNS the pipeline.** It is the end-to-end procedure of record for onboarding a Texas jurisdiction: both lanes (unzoned county, zoned city), the footprint and easement rails, the shared pre-flight gate, the ledger contract, the Warden, the regression gate, the fallbacks and traps, and the keyspace-sharding procedure. Every command in it is captured verbatim from a real run.

**The `90_operations/OPS-*` band GOVERNS doctrine and definitions.** OPS-INDEX is the front door, OPS-WDLL is the factory done-state definition, OPS-0 is the master game plan, OPS-2 is the mechanical line, OPS-3 the determinism register, OPS-4 the rewarm protocol, OPS-5 the cert standard, OPS-7 the honesty doctrine, OPS-8 the gate model, OPS-9 the scale-ops pack. The T-tracks (T1 through T6) carry live execution state.

**`28_THE_BASTROP_MOLD_engine_build_spec.md` STAYS ACTIVE** as the living baked-decision register. It is the only doc in the candidate set with a capture protocol, it is named in `_STATE.md` as one of three docs the engine-build agent reads first, and its Part 3 trap list (aerial LOD floor, hydrology-must-scale-with-DEM, Vercel 12-function cap, timeout-must-not-classify-as-auth, stranded-data, surface-shows-fixture, sheet overflow, cloudbuild config trap) is content that exists nowhere else. It is subordinate to the runbook and OPS band on procedure, and it must not restate them; it is authoritative on baked gotchas.

**The 27-band is superseded as plan of record**, with two carve-outs named below. The program architecture the 27-band designed either shipped (27b F1, the geometry gate, the road node, the warm-then-verify loop) or was overtaken by the OPS band's re-expression of the same ideas in mechanical form. The 8-gate recipe in 27d is the direct ancestor of the OPS-8 pre-flight gate and OPS-2 stages; the wave plan in 27e is the ancestor of the T-track structure; the Bastrop-through-v2 stack in 27f is the ancestor of the OPS-5 cert standard and the Phase C/D program.

**`29_scale_warm_architecture.md` is superseded as plan of record** but carries one design fork that must be recorded rather than lost, because the shipped mechanism resolved it differently than the doc proposed.

**`30_block_cert_harness_spec.md` is superseded** because it was fully consumed: the block-13 harness it specified was built, run, and became the standing regression gate; its three-way convergence principle is R20 in OPS-5; its geometry-measurement gate is R32 in OPS-5.

## Per-doc disposition

| Doc | Verdict | Unique content that must survive | Inbound refs |
|---|---|---|---|
| `90_runbooks/factory_onboarding_runbook.md` | GOVERNS | n/a (the governing doc) | 33 |
| `90_operations/OPS-*` band | GOVERNS (doctrine) | n/a (the governing band) | n/a |
| `28_THE_BASTROP_MOLD_engine_build_spec.md` | KEEP-ACTIVE (living) | Part 3 trap register in full; Part 1b source-to-atom provenance table; the honest-ceiling framing (zoning coverage equals incorporated-land ratio); Part 4 not-in-the-mold list; the capture protocol itself | 23 |
| `27_MASTER_WDLL_spine_completion_and_depth_engine.md` | RETIRED | Nothing unsurviving. Its M0 fleet-memory sub-WDLL shipped to `90_runbooks/fleet_memory_practice.md` plus `.cursor/rules/fleet-memory.mdc`; the R0-R4 sequence ran; the four-altitudes framing is restated in 27c and in `09_post_saas_substrate_thesis.md` | 22 |
| `27a_jurisdiction_factory_engine_spec.md` | RETIRED | Nothing unsurviving. The G1-G8 guardrail ledger is superseded by the OPS-8 eight-check gate plus OPS-3 determinism invariants; the seven supply engines map onto the OPS-2 mechanical stages; the anti-zombie line survives verbatim in 28 Part 2 and OPS-3; the two-products CC-versus-PE ruling survives in MEMORY.md (`command-center-is-the-spine-console`) and `_catalog/repo_intents.md` | 25 |
| `27c_road_node_engine_and_warm_digital_twin_spec.md` | FOLD-THEN-RETIRE | The ONLY doc covering roads-as-first-class-nodes: the digital-twin design constraint (build the road node with stable identity, centerline, edges, ROW, classification, provenance, and reference/attach points so infrastructure atoms attach later without a rebuild), the v1 assumed-ROW-width-per-class posture with provenance marking it approximate, the aerial-calibrates-to-the-road-skeleton consequence, and the no-non-road-infra-in-scope boundary. The OPS band references the road node only as a built mechanism (OPS-3 register row, OPS-5 R30/R31 front orientation) and never states its design contract. Fold target: a road-node section in 28 Part 1b, or a dedicated OPS row. Note: the road-class-to-setback-VALUE indexing in this doc is already RETIRED by `_decisions/2026-07-29_setback_authoritative_source_and_road_decouple.md` and must NOT be folded forward | 24 |
| `27d_county_onboarding_recipe_and_fleet_reliability.md` | RETIRED | Nothing unsurviving. The 8-gate recipe is superseded by the OPS-8 gate plus OPS-2 stages plus the runbook lanes; the three road-source recon gates (authoritative-sources-are-split-by-jurisdiction-level, schema-is-not-data, unreachable-city-GIS) all survive verbatim in 28 Part 3 and one is mechanical in engine-core; the M0 cc-agent-reach hardening shipped and is a MEMORY.md standing decision (`standing-decisions-must-travel-in-dispatches`); the thin-console ruling survives in OPS-6. Never approved by the operator | 12 |
| `27e_multitrack_program_structure_and_wave_plan.md` | RETIRED | Nothing unsurviving. The four-track structure is superseded by the live T1-T6 tracks in `90_operations/`; the one-owner-per-shared-substrate rule survives in OPS-3 and MEMORY.md; the wave plan's counties are onboarded; FIX-A landed. Never approved | 7 |
| `27f_bastrop_through_v2_program.md` | RETIRED | Nothing unsurviving in the plan. Stages 1-3 executed (PATCH-A, boundary primitive, market-ready); Stage 4 v2 fidelity is now the T3 rails track plus ADR-029. FLAGGED RISK A (customer-facing honesty UX for non-drawing parcels) survives as OPS-7 honest-absence doctrine plus the `honest-absence` PE surface. FLAGGED RISK B (v2 may be mostly patches, making the mold a v1.5 mold) is a live strategic fork and is preserved by this ruling's text rather than by the doc. Never approved | 23 |
| `29_scale_warm_architecture.md` | RETIRED | ONE item preserved by this ruling: the isolated-regenerate-then-swap write model (each county warms into an isolated store, verifies, then atomically swaps into a FIPS-partitioned serving DB) was NOT built. The shipped throughput mechanism is keyspace sharding with `--parcel-min`/`--parcel-max` writing direct to serving, proven union-equals-solo on McLennan (runbook section CASCADE KEYSPACE SHARDING, T5 workstream 1). The isolated-swap design remains an unbuilt alternative for re-warm safety at national scale; if re-warm-against-live ever proves unsafe, this doc is the design to re-open. Its Lever 4 (verify-before-swap) is already satisfied differently by the OPS-8 pre-flight gate plus OPS-5 cert | 7 |
| `30_block_cert_harness_spec.md` | RETIRED | Nothing unsurviving. Fully consumed: the harness was built (`block13-cert-grade.mjs`), block 13 is the standing 7/7 regression gate (runbook section 5), three-way convergence is R20 in OPS-5, per-edge measured-geometry grading is R32 in OPS-5, area-sweep-not-sampling is R3/R11/R14/R17 in OPS-5, and the ground-truth answer key table is superseded by the live cert roster. The build-and-fire-code-deferral rule (R22) survives in OPS-5 and the mold | 10 |

## Reasoning

Three tests decided each verdict.

First, does the doc describe a plan or a mechanism? The runbook and the OPS band describe mechanisms that ran, with verbatim commands and live artifact paths. The 27-band describes plans with acceptance checkboxes, most of them ungraded. When a plan and the record of its execution both exist, the record governs. This is the same discipline as the repo's grade-live-state rule applied to documentation.

Second, was the doc ever approved? 27d, 27e, and 27f all carry `status: spec (draft, awaiting operator approval)` and were never approved. They sat in draft while the work they described was executed under a different structure. A never-approved draft describing completed work cannot govern anything; leaving it in draft status is the misdirection this ruling exists to remove.

Third, does the doc carry content that exists nowhere else? Only two do. 27c is the sole statement of the road-node design contract and the digital-twin attach-point constraint, which is why it gets FOLD-THEN-RETIRE rather than RETIRED. 28 carries the entire baked-trap register and has a capture protocol instructing agents to keep it current, which is why it stays active. Everything else was either restated in the OPS band in mechanical form or was superseded by a later ruling.

The high inbound-reference counts on the retired docs (22 to 25 each) are almost entirely July-era session records, dispatches, and cross-references within the 27-band itself. Filtering to August-era and operational referrers, 27c is cited only by `00_current_state.md` and the blueprint inventory; 27a is cited by `90_operations/QUEUE_parked_work_index.md` and `T3_rails_track.md`; 27e and 27f have zero August-era or operational referrers. Historical session records citing a retired doc are correct as history and are not a reason to keep a doc governing. The status flip plus banner preserves the historical trail while making the precedence unambiguous for a fresh reader.

The FOLD-THEN-RETIRE verdict on 27c is deliberately not executed here. Folding the road-node design contract into 28 or into a new OPS row is a content change that should be reviewed on its merits, not slipped in under a precedence ruling. 27c keeps its status and gains only a precedence note. Retiring it before the fold would lose the only statement of the road-node contract.

## Reversal criteria

Reverse or amend this ruling if any of the following:

The runbook and the OPS band diverge from each other on a procedure, and no third doc resolves it. Then a new precedence ruling is needed between them, and this ruling's assumption that they are one coherent body is wrong.

A retired 27-band doc turns out to carry a design decision that the OPS band does not restate and that a live build re-derives wrong. That is evidence the fold-check in this ruling was incomplete; unretire the doc, fold the content, retire again.

The re-warm-against-live posture proves unsafe at national scale (a re-warm corrupts or degrades live serving data for a county). Then reopen `29_scale_warm_architecture.md` as the design for isolated-regenerate-then-swap, since keyspace sharding solves throughput but not re-warm isolation.

The road-node fold from 27c does not happen before the next fan-out wave that touches road ingest. Then 27c must be un-noted and re-promoted to active, because a fresh agent needs the design contract and a precedence note pointing at docs that do not carry it is worse than no note.

`28_THE_BASTROP_MOLD_engine_build_spec.md` stops being maintained (its capture protocol is not honored for two consecutive onboarding waves). Then it should be retired into the OPS band rather than left as a stale living doc, which is the failure mode this ruling is correcting elsewhere.
