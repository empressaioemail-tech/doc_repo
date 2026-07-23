---
id: 2026-07-23_engine_family_WDLL
title: WDLL — the six durable engines (the jurisdiction factory that produces the atom fabric)
status: draft
date: 2026-07-23
applies_to: hauska-engine (spine), hauska-atom-contract, hauska-mcp-server, hauska-sdk, legacy-design-tools (cortex-api reporting + current bake home), coverage-ledger
related: [2026-07-23_atom_family_WDLL, 2026-07-23_property_node_atom_fabric_and_engine_diagram, 2026-07-23_reasoning_chain_atom_shape_design, 2026-07-20_provable_county_data_pipeline_design, 56_engine_extraction_sprint, 80_adrs/adr_008_engine_factor_out, _architecture_homes/01_homes_and_topology]
owner: nick
---

# WDLL — the six durable engines (the jurisdiction factory)

NOTE (2026-07-23): this is now the Phase-2 ANNEX of `2026-07-23_MASTER_WDLL_property_reasoning_substrate.md` — sequenced AFTER Phase 1 (the atom fabric) finishes. The master owns the cross-cutting invariants (I-A..I-J); grade each item below against them. The review fan added required items: FAILURE/ROLLBACK + idempotency (a mid-run crash leaves no half-baked county passing as complete; re-bake is idempotent; a bad bake rolls back), the COST-PER-JURISDICTION gate (I-H, commitment #3 hard-kill), a VERSIONED DESCRIPTOR SCHEMA (an invalid descriptor is rejected, not silently defaulted), LEDGER-HONESTY (a "100% baked" cell spot-audits true), and the anti-zombie gate as an EXECUTABLE non-TX golden-descriptor CI test (not human review). Where this annex and the master differ, THE MASTER WINS.

Operator approval: PENDING. Frozen at approval; scope changes recorded as amendments below.

Vision anchor (do not lose): "Apple had to build computer factories before they could mass produce computers." Central-TX is the FIRST jurisdiction the factory runs on, done by hand to discover the requirements. The DELIVERABLE is the jurisdiction-agnostic factory; national is running it by configuration, not rebuilding. This WDLL captures the factory so the engine vision is not lost while atoms-first Central-TX ships. It is SEQUENCED AFTER the atom family (finishing Central-TX teaches the engine's real requirements); this doc exists now so the requirements Central-TX surfaces are captured against a named destination, not rediscovered.

## Done looks like

A new US county comes online as a DESCRIPTOR (config: FIPS, state parcel provider, source URLs, code edition), not a code fork. A descriptor flows through six durable, gated, jurisdiction-agnostic engines — Intake, Rule, Reasoning, Atom-Emitter (each with an automatic QA gate that blocks fabrication), plus the Coverage-Ledger control room and the Deploy/Env engine — and comes out as gate-verified atoms on the fabric, served through the gate/MCP with accessPolicy, monetized through hauska-sdk. The reasoning lives in the engines (jurisdiction-agnostic); the jurisdiction-specificity lives ONLY in the descriptor + source adapters + provenance — never in the reasoning code (the anti-zombie line). A background-agent fleet can run the factory unattended because the gates catch fabrication automatically and the ledger tells the fleet what to run/fix next. Proven when a county the team never hand-touched comes up correct-or-honestly-declined from a descriptor alone.

## The six engines (each a durable application, not a script)

1. INTAKE ENGINE — source discovery + ingest (geometry, land-use, zoning) from the descriptor's sources. GATE: source-verified + provenance-stamped (no atom without a resolvable source + vintage).
2. RULE ENGINE — zoning -> setback rule, cited to code edition. GATE: citation-resolves + verification-state recorded (the setback acceptance gate; asserted-transcribed vs human-verified).
3. REASONING ENGINE — atoms -> derived envelope / compliance findings, composed confidence, honest-absence. GATE: owner-match / no-fabrication (the integrity gate already built this program — it becomes the engine's gate).
4. ATOM-EMITTER — emits conformant atoms on hauska-atom-contract, accessPolicy-tagged, MCP-served. GATE: /conformance validated. This is where accessPolicy is stamped and where the hauska-sdk monetization hook is bound for paid atoms.
5. COVERAGE-LEDGER + MONITOR — the control room: per-county baked %, gate verdicts, honest gaps, classification. A background agent READS this to self-direct (what to run, what to fix, what is honestly absent vs failed).
6. DEPLOY / ENV ENGINE — workflow-mounted, no manual load-bearing state (the Overpass-revert lesson institutionalized: anything load-bearing lives in code/config/workflow, never a manual gcloud set that the next deploy reverts).

## Acceptance items

1. **Each engine is a durable, independently-runnable application** (not an inline script in a request path). | check: each of the four producing engines can be invoked headless on a descriptor + county and run to completion emitting a gate verdict; a background agent can trigger it without a human in the loop. | grade: [ ]
2. **Every engine has an automatic gate that BLOCKS on fail.** | check: feed each engine a deliberately-bad input (unresolvable source / uncited rule / owner-mismatch / non-conformant atom) and confirm the gate DECLINES + records the reason, does not emit, does not fabricate. The gate is the property that lets it run unattended. | grade: [ ]
3. **Reasoning is jurisdiction-agnostic; jurisdiction lives only in descriptor/adapter/provenance.** | check: grep + reviewer confirm zero county/state-specific branching in the reasoning code of engines 2-4; a second descriptor (a non-TX county stub) runs the same code path and either produces atoms or declines honestly, without a code change. THE ANTI-ZOMBIE GATE. | grade: [ ]
4. **A descriptor is the unit of onboarding.** | check: adding a county = writing a descriptor (FIPS, provider, source URLs, code edition) + running the factory; no new reasoning code is written to onboard it. Demonstrated on at least one county brought up from a descriptor alone. | grade: [ ]
5. **Coverage-ledger is the control room + is machine-readable.** | check: the ledger reports per-county baked %, per-gate verdicts, and honest-gap vs failure classification in a shape a background agent can read and act on; a dispatched agent uses it to pick the next run without a human telling it what to do. | grade: [ ]
6. **Deploy/env engine holds all load-bearing state in code/config/workflow.** | check: no engine depends on a manually-set env/secret that a deploy reverts (the Overpass trap); a re-deploy of any engine does NOT drop load-bearing config; verified by re-deploying and confirming the config survives. | grade: [ ]
7. **The factory writes to the fabric through the atom contract, monetizes through the SDK.** | check: engine-4 output is conformant atoms on hauska-atom-contract with accessPolicy; a paid atom's read routes metering + revenue through hauska-sdk (Circle/USDC + settlement + VDA per ADR-018), not a bespoke charge; free atoms don't load the SDK. The factory produces the SAME fabric the atom WDLL defines (no second atom model). | grade: [ ]
8. **Homed on the spine, not the monolith.** | check: the engines live in hauska-engine (spine) per the homes topology; the reasoning-lift out of cortex-api (sprint 56) is done or explicitly in-progress with the engine as its target; cortex-api CONSUMES the engine output to report, does not own the reasoning. | grade: [ ]
9. **Proven on a never-hand-touched county.** | check: a county no human on the team hand-curated comes up from a descriptor and lands correct-or-honestly-declined through all gates; the ledger shows it; a spot audit finds no fabrication. This is the factory working. | grade: [ ]
10. **Runnable by a background-agent fleet, safely.** | check: the factory can be driven by dispatched agents against the gates + ledger without a human verifying each atom (the gates + owner-match + conformance are the verification); operator QAs the public surface + spot-audits, not every atom. Matches the operator's "run with background agents with accuracy" requirement. | grade: [ ]

## Amendments

(none yet)

## Notes for the executing planner

- This WDLL is SECOND in sequence. Do atoms-first Central-TX (the atom WDLL) FIRST; the engines are the generalization of what finishing Central-TX by hand teaches. Building the factory before running one jurisdiction by hand = building on unproven requirements. Operator ruled atom-first explicitly ("we probably have much to learn still from finishing it that will help with the engine build").
- Engines 2/3/4 already EXIST in embryo inside the Central-TX work: the setback acceptance gate (engine 2's gate), the owner-match/no-fabrication integrity gate (engine 3's gate), the coverage ledger (engine 5). The engine build is HARDENING + GENERALIZING + HOMING these onto the spine, not greenfield. Name what already exists so the plan lifts it rather than rebuilds it.
- The anti-zombie gate (item 3) is the whole point: if county-specific logic leaks into the reasoning, the factory degrades into 500 forks — exactly the zombie-code outcome the operator named. Guard it in every adversarial review.
- SDK boundary (item 7): same as the atom WDLL — the spine consumes hauska-sdk for the money layer (payment rails, Circle/USDC, blockchain settlement, VDA wrapping, revenue routing per ADR-018); the atom-emitter binds the monetization hook for paid atoms; free atoms don't touch the SDK.
