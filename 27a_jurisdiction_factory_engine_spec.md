---
id: 27a_jurisdiction_factory_engine_spec
title: Command Center completion + the jurisdiction factory — spec grounded in the failures we hit
status: spec
last_updated: 2026-07-25
supersedes_annex: 2026-07-23_engine_family_WDLL (that annex was written before the failure modes were known; this is the grounded version)
applies_to: hauska-map/apps/command-center (the spine operator console), hauska-map/apps/property-explorer (a CC preset), hauska-engine (spine), hauska-atom-contract, hauska-mcp-server (gate), hauska-sdk
owner: nick
related: [27_engine_evolution_plan, 2026-07-23_MASTER_WDLL_property_reasoning_substrate, 2026-07-23_property_node_atom_fabric_and_engine_diagram, 61a_central_tx_coverage_program, _architecture_homes/01_homes_and_topology, 09_post_saas_substrate_thesis]
reference_organism: "trading cockpit node-graph — https://empressa-cockpit-admin.vercel.app/#panel=node-graph (the same organism, financial domain; property CC is the physical-world instance)"
---

# Command Center completion + the jurisdiction factory

Operator reframe 2026-07-25: this is not a greenfield build. Empressa Command Center (`hauska-map/apps/command-center`) is ALREADY the spine-wide operator console — it predates the property-explorer ramp, was built as the view of the whole spine, and drifted while all the energy went into the PE parcel leg. The console already has the shape: a Cortex-Workspace / Substrate / Engines / Governance nav where every panel carries a LIVE/STUB badge (an honest per-panel self-report of what is wired), a State Legend that is the atom contract rendered as operator vocabulary (confidence basis, resolution status, autonomy tier, provenance, access-policy), and panels like Parcel Trace / Atoms / MCP Tools / GIS Layers already LIVE. The node-graph ledger already exists as the `Node & Graph` STUB, scaffolded and declaring its own wiring target (`retrieval-api /atoms/trace/:did`).

So the program is: COMPLETE THE COMMAND CENTER. Wire its stubs, reconcile the drift between the console and what the PE leg built, formalize its honest-badge discipline into mechanical fail-closed truth, and make property-explorer a PRESET inside CC (not a separate app). PE is ONE part of the completion. THEN build the supply engines that flesh out the ledger, THEN national. This is still the Apple-factory move — but the factory floor is half-built and drifted, and the first job is to finish and true it up.

CRITICAL — TWO PRODUCTS, ONE SUBSTRATE (do NOT confuse "preset" with "collapse PE into CC"): Command Center is INTERNAL, operator-facing controls — the full spine cockpit (engines, governance, raw node-graph, STUB/LIVE badges, operator tooling). property-explorer is the CUSTOMER-facing app — the public product. "PE is a preset" means PE is a CURATED, CUSTOMER-SAFE surface of the SAME substrate + the SAME component library (one map, one inspect, one ledger, one read path), NOT a workspace inside the internal console. An agent that reads "preset" as "delete the PE app / make it a CC layout" would ship internal operator controls (engines, governance) to customers — a bad outcome. What CC and PE SHARE is the spine substrate + the component library + the node model; what they DO NOT share is the surface — CC shows the operator the whole machine, PE shows a customer the parcel + the buildable answer. They live in the SAME repo (`hauska-map/apps/*`) so the sharing is direct (no cross-repo publish), but they remain TWO products with TWO audiences. The drift cannot fork because there is one substrate and one component library — NOT because there is one app.

The organizing principle: EVERY mechanical guardrail traces to a SPECIFIC failure we hit during the Central-TX hand-build (2026-07-22 to 07-25). The three painful days ARE the requirements document. This spec is the acceptance criteria; NO build until it is approved.

Approval: RATIFIED 2026-07-25 (operator). F1 program in `27b`; Phase 0 live at Gate A.

## Why now (the timing is earned, not a retreat)

The master WDLL sequenced the engine (Phase 2) AFTER finishing Central-TX by hand, explicitly so we would learn what the engine must prevent. We have now learned it — the hard way. The recon of 2026-07-25 found not one bug but a STACK of drift failures, none hard, all caused by the same root: a pipeline with no ground truth of its own, held together by a sequence of agents each trusting the last one's green checkmark. The factory replaces agent judgment at every seam with a gate that fails closed. That is the whole point.

## THE LEDGER IS THE PRODUCT (operator re-centering, 2026-07-25) — build this FIRST

Terminology fix: "ledger" here does NOT mean a log of what agents did. THE LEDGER IS THE DATABASE ITSELF — the balance sheet of the physical world. It is the table of property NODES, the ATOMS hanging off each node, and the REFERENCE / RELIANCE GRAPH connecting them, tallyable like a balance sheet: how many nodes, how many atoms of each kind, what's present, what's honestly absent, how the pieces connect. This is the heart of the whole thing — the database of information and the network/reliance graph. Everything else in the engine exists to flesh out THIS ledger with accurate, complete data (even where the honest answer is "zoning is not present here").

The reference organism is the trading cockpit's node-graph, which does exactly this for the financial markets: `https://empressa-cockpit-admin.vercel.app/#panel=node-graph`. The property command center gets the SAME organism for the physical world — one node-graph, two data domains (one financial, one physical). Build model (operator-decided 2026-07-25): SAME SHAPE, property-native build — it works identically to the cockpit node-graph (node list + graph + inspect + click-to-lock) but is its own implementation reading the property spine; the cockpit is the reference spec, not a code dependency.

### F1 — COMPLETE THE COMMAND CENTER (the first program; PE is a preset within it; before any supply engine)

Nothing downstream matters until the operator can SEE, in one console, what data actually exists and click into any parcel from either the ledger or the map. F1 completes the existing CC console. It has four moves, in order:

F1a — CONSOLE AUDIT + RECONCILE (thorough, first, shapes everything after — operator-directed to get full attention). READ-ONLY. Establish the TRUE state of the existing Command Center, do not trust the badges:
- For every panel, verify its LIVE/STUB badge against LIVE state — a panel marked LIVE that silently broke (the OOM-class failure) is the exact drift we are hunting. The badge is a starting hypothesis, not ground truth, until F1c makes it mechanical.
- Map what drifted between the CC console (built before the PE ramp) and what the PE parcel leg actually built — where do they duplicate, disagree, or where did PE build a thing CC already had a slot for.
- Produce the wiring map: what each STUB needs to go LIVE, what merges into what, what PE-leg work folds back into the console. This document shapes F1b/c. No wiring until this lands.

F1b — WIRE THE LEDGER + THE PE PRESET + THE BINDING:
- Wire the `Node & Graph` STUB to the live node/atom/reference graph (its declared target `retrieval-api /atoms/trace/:did`) — the balance-sheet-of-the-physical-world ledger: nodes + atoms per kind + the reference/reliance graph, tallyable, present vs honest-absent. Same shape as the trading cockpit node-graph, property-native.
- THE PE SURFACE (customer-facing, stays its own product): property-explorer gets the Map | Ledger side-by-side arrangement (the Site-Analysis layout with the DataroomTile slot swapped for the ledger component, parcel-focused) built from the SAME shared components CC uses — but PE remains the CUSTOMER-facing app, curated and customer-safe (no engine/governance/operator panels). "Preset" = same substrate + same component library, customer-safe surface; NOT collapsed into the internal console.
- THE BINDING (the point): click a parcel on the map → highlight its node in the ledger; click a node in the ledger → highlight/lock it on the map. Bidirectional, on the ONE canonical node-id (G6). Inspect every datapoint on that node from either direction.

F1c — FORMALIZE THE MECHANICAL-TRUTH PRIMITIVE (the honest badge, made fail-closed):
- The LIVE/STUB badge (and the State Legend vocabulary) already exist as a primitive honest self-report. Harden it: a panel's badge is COMPUTED from whether it can actually serve its data live, not hand-set. A STUB that claims LIVE, or a LIVE panel whose backend is down, flips mechanically and fails a check. This is the G1/G8 discipline applied to the console itself.

Fed by phase-0 (restore the read path — which also fixes the current live outage — + establish true ground truth) so the ledger opens on the TRUE current state, honest gaps included. The operator SEES exactly what exists on day one.

THE SUPPLY ENGINES (scraping, collection, parsing — the seven below) are the SUPPLY that fills this ledger with accurate/complete data, built AFTER F1 completes the console. The engines serve the ledger; the completed console IS the thing. Without it, nothing else matters.

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

## ONE SHARED SURFACE / ONE SUBSTRATE (PE is a PRESET of CC, not a second app) — part of F1

Operator directive 2026-07-25: "it should be exactly like the one we are dealing with in this app, it should be the same thing not a clone of it" + "PE is a preset" + "it should all feed into one shared substrate." This is the spine honored on the front end: ONE substrate, ONE console, many views.

- ONE map + ONE inspect + ONE ledger component set in `hauska-map`, reading ONE node/atom read path off the ONE spine substrate — the SAME source the ledger, the map, and every product surface read.
- Command Center IS the INTERNAL operator console (the whole machine). property-explorer IS the CUSTOMER-facing app — a curated, customer-safe surface (Map | Ledger, parcel-focused) built from the SAME shared components + substrate, exposing NO engine/governance/operator panels. TWO products, TWO audiences, ONE substrate + ONE component library. The drift cannot fork because there is one substrate and one component set — not because there is one app.
- This completes the CC map (owed) and folds the PE-leg map/inspect work into the SHARED component library both consume (F1a decides what merges).
- The binding: click a parcel on the map → highlight its node in the ledger; click a node in the ledger → lock the map to that node-id (the ONE canonical id, G6) → inspect every atom on that node. Bidirectional.
- Guardrail: any component that reads nodes from a different source than the one spine substrate is the drift we are eliminating. One substrate, one component set, presets as views. A test asserts there is a single node/atom read path and both the ledger and the map use it.

## THE PHASE-0 GROUND-TRUTH GATE (feeds F1 — the ledger must open on TRUE data)

Before F1 launches, its first mechanical act establishes truth — because we do NOT currently know the real Central-TX coverage (committed ~5.8% Travis vs an uncorroborated 61% milestone claim), and the ledger must open showing what is ACTUALLY there, honest gaps included, not an inherited unverified number.

- Restore the read path (G2 fix: serve from Postgres, retire the snapshot-heap load). This also un-breaks the current live outage.
- Run ONE honest live count/tally of the node-graph ledger per Central-TX county: nodes, zoning-present vs honest-absence, setback, envelope, references — from a live `SELECT` against the serving DB.
- OUTPUT: the true Central-TX baseline, which is what the F1 ledger displays on day one. This settles whether Central-TX is a done seed, or whether the coverage work overstated. F1 opens on a KNOWN, verifiable state — the operator can SEE exactly what exists.
- This is NOT another scan-fix session. It is F1's foundation: "the ledger shows the truth, mechanically established."

## THE THROUGH-LINE: this is all COMPLETING THE SPINE (one shared substrate)

The organizing truth under everything here: this is completing the SPINE — the ONE shared substrate — and every piece is a view of it, not a separate product.
- The Command Center IS the spine's operator console (not a separate app).
- The ledger IS the spine's node/atom/reference graph, made visible (not a CC feature).
- The map IS a spatial view of the same nodes (not a separate dataset).
- property-explorer IS a preset consuming the spine through the console (not its own app).
- The supply engines flesh out the ONE substrate everything reads (not "a database").
- Every product surface (Plan Review, Investor, Architect, reporting) already tests against the SAME parcel/node in CC — because they all consume the one spine.
"Same thing not a clone" is the rule at every layer because there is one substrate and every surface is a view of it. Anything that forks a second copy of the map, the ledger, the read path, or the node model is drift — the exact thing this program eliminates.

## SEQUENCE (the whole program, corrected)

1. PHASE 0 — restore the read path (fixes the live outage) + establish true ground truth in the spine (feeds F1).
2. F1 — COMPLETE THE COMMAND CENTER: audit/reconcile the console (F1a), wire the ledger + the PE preset + the parcel↔node binding (F1b), formalize the mechanical honest-badge (F1c). NOTHING downstream until this ships. This is where the operator SEES what the spine holds and can click a node → lock the map → inspect every datapoint.
3. THE GUARDRAILS (G1-G8) — built EARLY, dogfooded, so the supply engines are checked by them as they land.
4. THE SUPPLY ENGINES — scraping / collection / parsing that flesh out the ONE substrate with accurate, complete data. Built AFTER F1, checked BY the guardrails.
5. NATIONAL — running the descriptor, only after the non-TX golden-descriptor test passes on the real baseline.

## BUILD DISCIPLINE (the meta-guardrail: don't rebuild the drift one level up)

The failure mode of a big program is the same drift, one level up. So the factory itself is built with the discipline it enforces:
- FEWER agents, TIGHTER contracts, HARDER gates — not more agents (the operator identified agent-count as the source of the drift). Every dispatch cites the guardrail (G1-G8) or the F1 deliverable it satisfies.
- Planner-led fleet, verification NEVER delegated, verified against LIVE state (G1/G8) — every grade is a live query or a live probe, pasted, never a report.
- Gated at irreversible seams; autonomous within a phase.
- The ledger tally and the smoke test are built EARLY, so the rest of the build is checked by them as it lands (dogfood the guardrails).

## What this spec deliberately does NOT do

- Does not run another agent-driven scan-fix pass on Central-TX (the operator is rightly wary; that loop is the symptom).
- Does not build anything downstream of F1 before F1 completes the console — the ledger + map + PE preset is the thing; without it, nothing else matters.
- Does not accept any coverage number that isn't a live tally of the actual node-graph ledger (the spine).
- Does not build a NEW/parallel map, ledger, node model, or read path — there is ONE spine substrate; every surface is a preset/view of it. A second copy of anything is the drift.
- Does not treat PE as a separate app — PE is a preset of the Command Center console.
- Does not wire anything in F1b/c before F1a's console audit lands (build on known state, not the drifted-badge hypothesis).
- Does not go national before the Phase-0 ground-truth gate + the non-TX golden-descriptor test both pass on the real baseline.

## WDLL — WHAT DONE LOOKS LIKE (F1: complete the Command Center)

Frozen at operator approval. Every item is graded PASS / PARTIAL(criteria) / FAIL against LIVE state, evidence pasted verbatim (never a report — this is the discipline whose absence caused the whole 3-day loop). A fleet cannot rationalize its way to "done"; the negative-done-line names the disqualifiers.

The one done-line: an operator opens Command Center and SEES the true state of the spine — a live node/atom/reference ledger tallied from the actual DB (honest gaps included), every panel's LIVE/STUB badge mechanically true, and can click a node → lock the map → inspect every datapoint on that parcel from either direction; and a customer opens property-explorer and gets the same parcel data through a curated customer-safe surface built from the SAME components — all reading ONE spine substrate.

Acceptance items:
1. PHASE-0 — read path restored + true ground truth. | check: retrieval-api serves from Postgres (not a heap-loaded snapshot), `/health` 200, a known parcel returns its full atom chain LIVE; a per-county live tally of the actual node-graph (nodes / atoms per kind / present vs honest-absent) is committed. The TRUE Central-TX coverage number is known and recorded from a live SELECT, settling the 5.8%-vs-61% question. | grade: [MET — 2026-07-25 Gate A: retrieval `00016-ttp` postgres-serve; PE `X-PE-Read-Path: atom-chain`; Travis zoning_present 61.23% live SELECT; check-in `_inbox/2026-07-25_GATE_A_checkin_f1_phase0_retrieval_restore.md`]
2. F1a CONSOLE AUDIT committed. | check: a doc states, per CC panel, its badge-vs-live-reality (every LIVE claim verified against live state, not trusted), what drifted between the console and the PE leg, and the wiring map for the stubs. No F1b/c code merged before this lands. | grade: [ ]
3. NODE-GRAPH LEDGER live in Command Center. | check: the `Node & Graph` panel is wired (not STUB) to the live node/atom/reference graph; it tallies like a balance sheet (counts, present vs honest-absent, references); a named node shows its real atoms; an empty node shows honest-0, not an error. | grade: [ ]
4. THE BINDING, bidirectional, live. | check: click a parcel on the map → its node highlights in the ledger; click a node in the ledger → the map locks to that node-id and its atoms inspect. Proven on named parcels, both directions, on the ONE canonical node-id. | grade: [ ]
5. PE CUSTOMER SURFACE from shared components. | check: property-explorer shows the Map | Ledger parcel-focused layout built from the SAME shared component library + substrate as CC; it exposes NO internal engine/governance/operator panels (customer-safe); a named parcel renders its full chain. PE is still its own customer-facing product, NOT collapsed into CC. | grade: [ ]
6. ONE SUBSTRATE, no fork. | check: grep/trace confirms a SINGLE node/atom read path; the ledger, the map, and the PE surface all use it; there is no second map component, no second node model, no second read path. A test asserts it. | grade: [ ]
7. MECHANICAL HONEST-BADGE (F1c). | check: a panel's LIVE/STUB badge is COMPUTED from whether it can actually serve its data, not hand-set; kill a panel's backend and its badge flips to STUB/degraded automatically; a STUB that claims LIVE fails a check. | grade: [ ]
8. END-TO-END LIVE SMOKE TEST exists + is green. | check: a test clicks N known nodes through the LIVE ledger AND map and asserts their atoms render; it runs post-data-change and post-deploy and FAILS LOUDLY; demonstrate it going red when a parcel's data is unavailable. (G5 — the benchmark made mechanical.) | grade: [ ]
9. COVERAGE = a live tally only. | check: every coverage number shown or reported is a live SELECT against the node-graph, surfaced in CC; no number exists in prose that the ledger contradicts (G1). | grade: [ ]

Negative done-line (NOT done if ANY is true):
- PE ships internal engine/governance/operator panels to customers (preset misread as collapse-into-CC);
- a second map / ledger / node-model / read-path exists (substrate forked);
- a LIVE badge is hand-set rather than computed, or a LIVE panel whose backend is down still reads LIVE;
- a coverage number lives in prose that the live ledger contradicts;
- the ledger fakes data where the honest answer is absence, or masks a broken source as "no answer";
- the operator cannot click node→map or map→node and inspect a parcel end to end on live state.

## Next step

On operator approval of this spec: I write the F1 build program FIRST — phase-0 (restore read path + true ground truth) → F1a console audit (thorough, shapes the rest) → F1b wire the ledger + PE preset + binding → F1c mechanical honest-badge, with the guardrails dogfooded alongside. Every item traces to an F1 deliverable or a G1-G8 guardrail, and to the ONE spine substrate it reads. The supply engines are a SEPARATE, later program, written only after F1 completes the console and it is verified live. No code until the F1 program is also reviewed. The recon of 2026-07-25 is the input; this spec is the contract; completing the Command Center (the spine's console) is the first sequence.
