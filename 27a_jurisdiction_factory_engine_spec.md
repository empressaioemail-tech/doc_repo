---
id: 27a_jurisdiction_factory_engine_spec
title: The jurisdiction factory — engine spec grounded in the failures we hit
status: spec
last_updated: 2026-07-25
supersedes_annex: 2026-07-23_engine_family_WDLL (that annex was written before the failure modes were known; this is the grounded version)
applies_to: hauska-engine (spine), hauska-atom-contract, hauska-mcp-server (gate), hauska-map (ONE shared surface), property-explorer, empressa-command-center
owner: nick
related: [27_engine_evolution_plan, 2026-07-23_MASTER_WDLL_property_reasoning_substrate, 2026-07-23_property_node_atom_fabric_and_engine_diagram, 61a_central_tx_coverage_program, _architecture_homes/01_homes_and_topology, 09_post_saas_substrate_thesis]
reference_organism: "trading cockpit node-graph — https://empressa-cockpit-admin.vercel.app/#panel=node-graph (the same organism, financial domain; property CC is the physical-world instance)"
---

# The jurisdiction factory — engine spec grounded in the failures we hit

Operator decision 2026-07-25: stop hand-dispatching agents at a hand-built pipeline to fill coverage. Build the ENGINES — jurisdiction-agnostic, MECHANICALLY GATED (checks that fail closed, not agent judgment), so coverage scales by running a descriptor, not by dispatching an agent. Unify the front end: ONE shared map + inspect surface consumed by BOTH property-explorer and Empressa Command Center (the same thing, not a clone). This is the Apple-factory move — build the factory, then mass-produce; national is running the descriptor, not rebuilding.

The organizing principle of this spec: EVERY mechanical guardrail traces to a SPECIFIC failure we hit during the Central-TX hand-build (2026-07-22 to 07-25). The three painful days ARE the requirements document. This spec is the acceptance criteria; NO build until it is approved.

Approval: PENDING. NO code until operator ratifies.

## Why now (the timing is earned, not a retreat)

The master WDLL sequenced the engine (Phase 2) AFTER finishing Central-TX by hand, explicitly so we would learn what the engine must prevent. We have now learned it — the hard way. The recon of 2026-07-25 found not one bug but a STACK of drift failures, none hard, all caused by the same root: a pipeline with no ground truth of its own, held together by a sequence of agents each trusting the last one's green checkmark. The factory replaces agent judgment at every seam with a gate that fails closed. That is the whole point.

## THE LEDGER IS THE PRODUCT (operator re-centering, 2026-07-25) — build this FIRST

Terminology fix: "ledger" here does NOT mean a log of what agents did. THE LEDGER IS THE DATABASE ITSELF — the balance sheet of the physical world. It is the table of property NODES, the ATOMS hanging off each node, and the REFERENCE / RELIANCE GRAPH connecting them, tallyable like a balance sheet: how many nodes, how many atoms of each kind, what's present, what's honestly absent, how the pieces connect. This is the heart of the whole thing — the database of information and the network/reliance graph. Everything else in the engine exists to flesh out THIS ledger with accurate, complete data (even where the honest answer is "zoning is not present here").

The reference organism is the trading cockpit's node-graph, which does exactly this for the financial markets: `https://empressa-cockpit-admin.vercel.app/#panel=node-graph`. The property command center gets the SAME organism for the physical world — one node-graph, two data domains (one financial, one physical). Build model (operator-decided 2026-07-25): SAME SHAPE, property-native build — it works identically to the cockpit node-graph (node list + graph + inspect + click-to-lock) but is its own implementation reading the property spine; the cockpit is the reference spec, not a code dependency.

### F1 — THE FIRST DELIVERABLE (ledger + map, ONE program, built and launched before any scraping/collection engine)

Nothing else matters until these two bound halves exist, because you cannot build, verify, or trust coverage you cannot SEE. F1 is the node-graph ledger IN Command Center AND the map, bound to the same node:

1. THE NODE-GRAPH LEDGER, searchable in Command Center — the table of nodes + atoms + the reference/reliance graph, tallyable like a balance sheet (counts per node, per atom kind, present vs honest-absent, the connections). Works like the trading cockpit's node-graph panel, for property.
2. THE MAP, bound to it (the shared surface, see below). Click a node in the ledger → it LOCKS to that property_id on the map. Inspect every datapoint we hold about that parcel, from EITHER direction (ledger→map, map→ledger). The ledger tells you what exists; the map shows you where; they are two views of one node.
3. THE SHARED SURFACE: the SAME map + inspect component in Command Center AND property-explorer (the same thing, not a clone — see the surface section). This forces the owed CC map update and does it correctly.

Built together as ONE program (operator-decided): the binding IS the point; ship them bound, not sequentially. Fed by the phase-0 ground-truth data (restore the read path + one honest live count) so the ledger shows the TRUE current state on day one — including honest gaps.

THE REST OF THE ENGINE (scraping, collection, parsing, the seven engines below) is the SUPPLY that fills this ledger with accurate/complete data, and is built AFTER F1 ships. The engines serve the ledger; the ledger+map is the thing. Without those two, nothing else matters.

## THE GUARDRAIL LEDGER (G1-G8) → the mechanical check each failure demands

Every mechanical guardrail traces to a SPECIFIC failure hit during the Central-TX hand-build. (These are the CHECKS that keep the node-graph ledger above accurate; they are not the ledger itself.)

| # | Failure we hit (2026-07-22..25) | Root | Mechanical guardrail the factory MUST enforce |
|---|---|---|---|
| G1 | A coverage number ("Travis 61.2%") was reported in a milestone doc that the committed ledger (5.8%) contradicts; the number lived in prose, not in a verifiable source | agent report != committed reality | COVERAGE IS A LIVE TALLY OF THE NODE-GRAPH LEDGER, never a bake summary. The number is a `SELECT count(*)` against the actual nodes/atoms in the serving DB, shown in Command Center; a number that isn't in the ledger does not exist. The ledger (the DB) is the ONLY source of truth. |
| G2 | retrieval-api OOM-crash-looped: it JSON.parses the whole corpus snapshot into a 1GiB heap; breadth bakes grew it past the limit → SIGABRT → read backend DOWN → every parcel "not verified" | unbounded in-memory growth; serving off a heap-loaded snapshot | The serving path reads from POSTGRES (LayeredStorage StoragePort, already built Phase 1a), NEVER hydrates the full corpus into memory. The in-memory-snapshot boot path is RETIRED. A resource-headroom check fails the deploy if projected memory > limit. |
| G3 | The map never showed stamped zoning: it colors by land-use not zoning, AND served a 5-day-stale tile | map layer wired to the wrong field + no tile-freshness gate | The map is bound to the SAME node source the ledger + inspect card read (F1 shared surface). Tiles carry a freshness stamp; a tile older than the last data change fails a freshness gate. No layer silently reads a different field than what it claims to show. |
| G4 | "Which counties got stamped" diverged between agents (milestone claimed McLennan/Bell/Guadalupe; AFTER doc recorded only Travis+Bexar) | parallel agents, no single mechanical record | The node-graph ledger IS the single record of what exists — machine-written, tallyable. Two agents cannot disagree about a committed count of actual nodes/atoms. |
| G5 | Nothing ever tested "click a known parcel in the live APP and see setbacks"; three availability failures accumulated invisibly behind green build checks | no end-to-end live-availability test | An END-TO-END LIVE SMOKE TEST runs after every data change AND every deploy: click N known nodes through the LIVE ledger AND map, assert their atoms render. FAILS LOUDLY and blocks. "Is the data true and available in the app" is the benchmark — mechanized. |
| G6 | Confusion from APN-vs-normalized-prop_id shown side by side; a MCP gate id-regex rejects alpha ids the app/retrieval accept | id-shape not enforced by one contract | ONE canonical parcel-node-id contract, enforced identically at every layer (gate regex == retrieval regex == app regex == contract pattern). A CI test asserts the regexes are the same. The node-id is the ledger's primary key AND the map lock key — it must be one thing. |
| G7 | Deploy env drift (PROPERTY_ATOM_PATH flag, retrieval URL/key, which Neon) determined whether the app worked, invisibly | load-bearing state in manual env, not code | Load-bearing config lives in code/workflow, not hand-set env (the Overpass-revert lesson, institutionalized). A deploy asserts its required env is present and correct, or fails. |
| G8 | The whole thing required a human (planner + operator) to keep re-establishing ground truth over 3 days | no self-checking ground truth | Every stage GATE fails closed and writes its verdict; a background run is trustable because the gates catch drift automatically, not because a human watched. The ledger being live-tallyable is what makes ground truth continuous, not re-established by hand. |

## THE SUPPLY ENGINES (built AFTER F1 — jurisdiction-agnostic; a descriptor goes in, nodes+atoms flow into the ledger)

These FLESH OUT the F1 ledger with accurate, complete data. They are the supply; the ledger+map is the product. Built after F1 ships.

Per the fabric+factory diagram (2026-07-23), hardened by the failure ledger:

1. INTAKE ENGINE — source discovery + ingest (geometry, land-use, zoning layers) from the descriptor. GATE: source-verified + provenance-stamped; a source that 404s is honest-absent, never a silent zero (G1/G4 discipline).
2. RULE ENGINE — zoning → setback rule cited to code. GATE: citation resolves to a real code atom (not a bare string); verification-state recorded.
3. REASONING ENGINE — atoms → derived envelope. GATE: owner-match / no-fabrication; confidence composed via contract (never labeling×district).
4. ATOM-EMITTER — conformant atoms on the contract, accessPolicy-tagged, written to the SERVING Postgres — the same DB the F1 ledger + read path serve from, verified (G2). Every write lands a node/atom/reference row the F1 ledger can immediately tally. GATE: /conformance validated.
5. TALLY + MONITOR — writes the live count OF the node-graph ledger (nodes / atoms per kind / present vs honest-absent / references) from a live query into the Command Center view. It does NOT own the truth — the ledger (the DB) does; this reads and surfaces it (G1/G4). A background agent reads the tally to know what to run next.
6. DEPLOY/ENV ENGINE — workflow-mounted, asserts required env, resource-headroom check (G2/G7). No load-bearing manual state.
7. SMOKE-TEST GATE (from G5) — the end-to-end live availability test. Runs post-data-change and post-deploy; clicks known nodes through the live ledger AND map; fails loudly. The benchmark made mechanical.

Anti-zombie line (unchanged, load-bearing): reasoning lives in the engines (jurisdiction-agnostic); jurisdiction lives ONLY in the descriptor + adapters + provenance. Enforced by an EXECUTABLE non-TX golden-descriptor CI test, not human review (G8). County #500 is a descriptor a background agent runs, not a fork.

## ONE SHARED SURFACE (property-explorer AND command-center mount the SAME thing) — part of F1

Operator directive 2026-07-25: "it should be exactly like the one we are dealing with in this app, it should be the same thing not a clone of it." This is the atom-substrate thesis honored on the front end, it is how surface drift (G3) stops forking, and it is half of the F1 map deliverable.

- ONE map + ONE inspect component, owned by hauska-map (the decoupled renderer already lives there), reading ONE node/atom read path — the SAME one the F1 ledger reads.
- property-explorer mounts it. Command Center mounts it. A data fix or a render fix shows up in BOTH automatically, because there is one component, not two.
- This FORCES the Command Center map update that was already owed, and does it correctly: not "make CC look like PE," but "CC and PE are two mounts of one surface." Command Center already has a shape of atom inspection — the F1 build replaces its bespoke map/inspect with the shared one AND adds the node-graph ledger beside it.
- The map lock: click a node in the ledger → the map locks to that node-id (the ONE canonical id, G6) → inspect every atom on that node. Bidirectional.
- Guardrail: a component that reads nodes in one app and a different source in the other is the drift we are eliminating. One source, one component, two mounts. A test asserts both apps import the SAME renderer package version.

## THE PHASE-0 GROUND-TRUTH GATE (feeds F1 — the ledger must open on TRUE data)

Before F1 launches, its first mechanical act establishes truth — because we do NOT currently know the real Central-TX coverage (committed ~5.8% Travis vs an uncorroborated 61% milestone claim), and the ledger must open showing what is ACTUALLY there, honest gaps included, not an inherited unverified number.

- Restore the read path (G2 fix: serve from Postgres, retire the snapshot-heap load). This also un-breaks the current live outage.
- Run ONE honest live count/tally of the node-graph ledger per Central-TX county: nodes, zoning-present vs honest-absence, setback, envelope, references — from a live `SELECT` against the serving DB.
- OUTPUT: the true Central-TX baseline, which is what the F1 ledger displays on day one. This settles whether Central-TX is a done seed, or whether the coverage work overstated. F1 opens on a KNOWN, verifiable state — the operator can SEE exactly what exists.
- This is NOT another scan-fix session. It is F1's foundation: "the ledger shows the truth, mechanically established."

## SEQUENCE (the whole program, corrected)

1. PHASE 0 — restore the read path + establish true ground truth (feeds F1).
2. F1 — the node-graph ledger IN Command Center + the map bound to it (shared surface), built together, launched. NOTHING else until this ships. This is where the operator SEES what data exists and can click a node → lock the map → inspect every datapoint.
3. THE GUARDRAILS (G1-G8) — built EARLY, dogfooded, so the supply engines are checked by them as they land.
4. THE SUPPLY ENGINES — scraping / collection / parsing that flesh out the ledger with accurate, complete data. Built AFTER F1, checked BY the guardrails.
5. NATIONAL — running the descriptor, only after the non-TX golden-descriptor test passes on the real baseline.

## BUILD DISCIPLINE (the meta-guardrail: don't rebuild the drift one level up)

The failure mode of a big program is the same drift, one level up. So the factory itself is built with the discipline it enforces:
- FEWER agents, TIGHTER contracts, HARDER gates — not more agents (the operator identified agent-count as the source of the drift). Every dispatch cites the guardrail (G1-G8) or the F1 deliverable it satisfies.
- Planner-led fleet, verification NEVER delegated, verified against LIVE state (G1/G8) — every grade is a live query or a live probe, pasted, never a report.
- Gated at irreversible seams; autonomous within a phase.
- The ledger tally and the smoke test are built EARLY, so the rest of the build is checked by them as it lands (dogfood the guardrails).

## What this spec deliberately does NOT do

- Does not run another agent-driven scan-fix pass on Central-TX (the operator is rightly wary; that loop is the symptom).
- Does not build anything downstream of F1 before F1 ships — the ledger + map is the thing; without those two, nothing else matters.
- Does not accept any coverage number that isn't a live tally of the actual node-graph ledger.
- Does not build CC a new/parallel map (that is the drift; it mounts the shared surface).
- Does not go national before the Phase-0 ground-truth gate + the non-TX golden-descriptor test both pass on the real baseline.

## Next step

On operator approval of this spec: I write the F1 build program FIRST (phase-0 ground truth → the node-graph ledger in Command Center + the map bound to it, the shared surface, the guardrails built alongside), with every item traced to an F1 deliverable or a G1-G8 guardrail. The supply engines are a SEPARATE, later program, written only after F1 ships and is verified live. No code until the F1 program is also reviewed. The recon of 2026-07-25 is the input; this spec is the contract; F1 is the first sequence.
