---
id: 27a_jurisdiction_factory_engine_spec
title: The jurisdiction factory — engine spec grounded in the failures we hit
status: spec
last_updated: 2026-07-25
supersedes_annex: 2026-07-23_engine_family_WDLL (that annex was written before the failure modes were known; this is the grounded version)
applies_to: hauska-engine (spine), hauska-atom-contract, hauska-mcp-server (gate), hauska-map (ONE shared surface), property-explorer, empressa-command-center
owner: nick
related: [27_engine_evolution_plan, 2026-07-23_MASTER_WDLL_property_reasoning_substrate, 2026-07-23_property_node_atom_fabric_and_engine_diagram, 61a_central_tx_coverage_program, _architecture_homes/01_homes_and_topology, 09_post_saas_substrate_thesis]
---

# The jurisdiction factory — engine spec grounded in the failures we hit

Operator decision 2026-07-25: stop hand-dispatching agents at a hand-built pipeline to fill coverage. Build the ENGINES — jurisdiction-agnostic, MECHANICALLY GATED (checks that fail closed, not agent judgment), so coverage scales by running a descriptor, not by dispatching an agent. Unify the front end: ONE shared map + inspect surface consumed by BOTH property-explorer and Empressa Command Center (the same thing, not a clone). This is the Apple-factory move — build the factory, then mass-produce; national is running the descriptor, not rebuilding.

The organizing principle of this spec: EVERY mechanical guardrail traces to a SPECIFIC failure we hit during the Central-TX hand-build (2026-07-22 to 07-25). The three painful days ARE the requirements document. This spec is the acceptance criteria; NO build until it is approved.

Approval: PENDING. NO code until operator ratifies.

## Why now (the timing is earned, not a retreat)

The master WDLL sequenced the engine (Phase 2) AFTER finishing Central-TX by hand, explicitly so we would learn what the engine must prevent. We have now learned it — the hard way. The recon of 2026-07-25 found not one bug but a STACK of drift failures, none hard, all caused by the same root: a pipeline with no ground truth of its own, held together by a sequence of agents each trusting the last one's green checkmark. The factory replaces agent judgment at every seam with a gate that fails closed. That is the whole point.

## THE FAILURE LEDGER → the mechanical guardrail each one demands

This is the heart of the spec. Each row is a real failure we hit; the guardrail is what the factory must do so it CANNOT happen again.

| # | Failure we hit (2026-07-22..25) | Root | Mechanical guardrail the factory MUST enforce |
|---|---|---|---|
| F1 | A coverage number ("Travis 61.2%") was reported in a milestone doc that the committed ledger (5.8%) contradicts; the number lived in prose, not in a verifiable source | agent report != committed reality | COVERAGE IS A COMMITTED LIVE COUNT, never a bake summary. The factory writes the count from a live `SELECT count(*)` against the serving DB into a committed ledger; a number that isn't in the ledger does not exist. The ledger is the ONLY source of truth for coverage. |
| F2 | retrieval-api OOM-crash-looped: it JSON.parses the whole corpus snapshot into a 1GiB heap; breadth bakes grew it past the limit → SIGABRT → read backend DOWN → every parcel "not verified" | unbounded in-memory growth; serving off a heap-loaded snapshot | The serving path reads from POSTGRES (LayeredStorage StoragePort, already built Phase 1a), NEVER hydrates the full corpus into memory. The in-memory-snapshot boot path is RETIRED. A resource-headroom check fails the deploy if projected memory > limit. |
| F3 | The map never showed stamped zoning: it colors by land-use not zoning, AND served a 5-day-stale tile | map layer wired to the wrong field + no tile-freshness gate | ONE surface reads atoms/zoning from the same source the inspect card does (see surface unification). Tiles carry a freshness stamp; a tile older than the last stamp fails a freshness gate. No layer silently reads a different field than what it claims to show. |
| F4 | "Which counties got stamped" diverged between agents (milestone claimed McLennan/Bell/Guadalupe; AFTER doc recorded only Travis+Bexar) | parallel agents, no single mechanical record | The COVERAGE LEDGER is the single record of what ran, when, with what result — machine-written per run, not narrated. Two agents cannot disagree about a committed count. |
| F5 | Nothing ever tested "click a known parcel in the live APP and see setbacks"; three availability failures accumulated invisibly behind green build checks | no end-to-end live-availability test | An END-TO-END LIVE SMOKE TEST runs after every bake AND every deploy: click N known-good parcels through the LIVE app surface, assert zoning+setback+envelope render. It FAILS LOUDLY and blocks. "Is the data true and available in the app" is the benchmark — mechanized. |
| F6 | Confusion from APN-vs-normalized-prop_id shown side by side; a MCP gate id-regex rejects alpha ids the app/retrieval accept | id-shape not enforced by one contract | ONE canonical parcel-node-id contract, enforced identically at every layer (gate regex == retrieval regex == app regex == contract pattern). A CI test asserts the four regexes are the same. |
| F7 | Deploy env drift (PROPERTY_ATOM_PATH flag, retrieval URL/key, which Neon) determined whether the app worked, invisibly | load-bearing state in manual env, not code | Load-bearing config lives in code/workflow, not hand-set env (the Overpass-revert lesson, institutionalized). A deploy asserts its required env is present and correct, or fails. |
| F8 | The whole thing required a human (planner + operator) to keep re-establishing ground truth over 3 days | no self-checking ground truth | Every stage GATE fails closed and writes its verdict to the ledger; a background run is trustable because the gates catch drift automatically, not because a human watched. |

## THE ENGINES (jurisdiction-agnostic; a descriptor goes in, gated committed coverage comes out)

Per the fabric+factory diagram (2026-07-23), hardened by the failure ledger:

1. INTAKE ENGINE — source discovery + ingest (geometry, land-use, zoning layers) from the descriptor. GATE: source-verified + provenance-stamped; a source that 404s is honest-absent, never a silent zero (F1/F4 discipline).
2. RULE ENGINE — zoning → setback rule cited to code. GATE: citation resolves to a real code atom (not a bare string); verification-state recorded.
3. REASONING ENGINE — atoms → derived envelope. GATE: owner-match / no-fabrication; confidence composed via contract (never labeling×district).
4. ATOM-EMITTER — conformant atoms on the contract, accessPolicy-tagged, written to the SERVING Postgres (F2: the same DB the read path serves from, verified). GATE: /conformance validated.
5. COVERAGE-LEDGER + MONITOR — THE CONTROL ROOM, and now the SINGLE SOURCE OF TRUTH for coverage (F1/F4). Writes per-county live counts (zoning-present / honest-absence / setback / envelope) from a live query, machine-written, committed. A background agent reads THIS to know what to run next; a human reads THIS to know the true coverage. No coverage number exists outside it.
6. DEPLOY/ENV ENGINE — workflow-mounted, asserts required env, resource-headroom check (F2/F7). No load-bearing manual state.
7. SMOKE-TEST GATE (new, from F5) — the end-to-end live-app availability test. Runs post-bake and post-deploy; clicks known parcels through the live surface; fails loudly. This is the benchmark made mechanical.

Anti-zombie line (unchanged, load-bearing): reasoning lives in the engines (jurisdiction-agnostic); jurisdiction lives ONLY in the descriptor + adapters + provenance. Enforced by an EXECUTABLE non-TX golden-descriptor CI test, not human review (F8). County #500 is a descriptor a background agent runs, not a fork.

## ONE SHARED SURFACE (property-explorer AND command-center mount the SAME thing)

Operator directive 2026-07-25: "it should be exactly like the one we are dealing with in this app, it should be the same thing not a clone of it." This is the atom-substrate thesis honored on the front end — and it is how surface drift (F3) stops forking.

- ONE map renderer + ONE inspect-card component, owned by hauska-map (the decoupled renderer already lives there), reading ONE atom-read path.
- property-explorer mounts it. Command Center mounts it. A coverage fix or a render fix shows up in BOTH automatically, because there is one component, not two.
- This FORCES the Command Center map update that was already owed, and does it correctly: not "make CC look like PE," but "CC and PE are two mounts of one surface." Command Center already has a shape of atom inspection — this replaces its bespoke map/inspect with the shared one.
- Guardrail: a component that reads atoms in one app and a different source in the other is the drift we are eliminating. One source, one component, two mounts. A test asserts both apps import the SAME renderer package version.

## THE PHASE-0 GROUND-TRUTH GATE (the engine's first act)

Before the factory generalizes ANYTHING, its first mechanical act establishes truth — because we do NOT currently know the real Central-TX coverage (committed ~5.8% Travis vs an uncorroborated 61% milestone claim), and the factory must not inherit an unverified number as its baseline.

- Restore the read path (F2 fix: serve from Postgres, retire the snapshot-heap load).
- Run ONE honest live count per Central-TX county: zoning-present vs honest-absence vs setback vs envelope, from a live `SELECT` against the serving DB, written to the coverage ledger (F1).
- OUTPUT: the true Central-TX baseline, committed. This settles whether Central-TX is a done seed to generalize from, or whether the coverage work overstated and is not done. The engine build proceeds from a KNOWN number, not a reported one.
- This is NOT another scan-fix session. It is the engine's first gate: "establish ground truth mechanically," which is the whole philosophy in one act.

## BUILD DISCIPLINE (the meta-guardrail: don't rebuild the drift one level up)

The failure mode of a big program is the same drift, one level up. So the factory itself is built with the discipline it enforces:
- FEWER agents, TIGHTER contracts, HARDER gates — not more agents. Every dispatch cites the failure-ledger guardrail it satisfies.
- Planner-led fleet, verification NEVER delegated, verified against LIVE state (F1/F8) — every grade is a live query or a live probe, pasted, never a report.
- Gated at irreversible seams; autonomous within a phase.
- The coverage ledger and the smoke test are built EARLY, so the rest of the build is checked by them as it lands (dogfood the guardrails).

## What this spec deliberately does NOT do

- Does not run another agent-driven scan-fix pass on Central-TX (the operator is rightly wary; that loop is the symptom).
- Does not accept any coverage number that isn't a committed live count.
- Does not build CC a new/parallel map (that is the drift; it mounts the shared surface).
- Does not go national before the Phase-0 ground-truth gate + the non-TX golden-descriptor test both pass on the real baseline.

## Next step

On operator approval of this spec: I write the build program (phases, the phase-0 ground-truth gate, the stop-gates at irreversible seams, the fleet orchestration) with every phase item traced to a failure-ledger guardrail. No code until that program is also reviewed. The recon of 2026-07-25 is the input; this spec is the contract; the program is the sequence.
