---
id: 27_MASTER_WDLL_spine_completion_and_depth_engine
title: MASTER WDLL — complete the spine, build the depth engine, and give the fleet durable memory
status: master spec (draft, awaiting operator approval)
last_updated: 2026-07-25
owner: nick
supersedes_note: does NOT supersede 27a/27b/27c — it is the umbrella they become sub-WDLLs of
sub_wdlls:
  - M0_fleet_memory (new — sprint zero, built FIRST, installed as usable tooling)
  - 27b_f1_command_center_completion_program (DONE — the console)
  - 27a_jurisdiction_factory_engine_spec (the ratified supply-engine + guardrail spec)
  - 27c_road_node_engine_and_warm_digital_twin_spec (the depth engine + road nodes + warm digital-twin foundation)
related: [27a_jurisdiction_factory_engine_spec, 27b_f1_command_center_completion_program, 27c_road_node_engine_and_warm_digital_twin_spec, 61a_central_tx_coverage_program, 2026-07-24_BREADTH_COVERAGE_MILESTONE_central_tx, 2026-07-23_ai_memory_substrate_thread_PLACEHOLDER, 2026-07-25_setback_geometry_and_calibration_handoff, 09_post_saas_substrate_thesis, 04a_arrow_two_calibration_capture]
pilot: bastrop_city_and_county
---

# MASTER WDLL — complete the spine, build the depth engine, and give the fleet durable memory

One program, one master done-line, four sub-WDLLs. This umbrella exists because 27a (the supply engines + guardrails), 27b (the completed console), 27c (the depth engine + road nodes), the breadth program (61a, done-wide), and the dev-fleet memory are not separate efforts. They are ONE spine being built to completion, plus the meta-layer that keeps the build itself from drifting. Scoping them as one master with sub-WDLLs is the correct structure: the fleet memory is not a side tool, it is how this program avoids becoming the next scan-fix loop.

Approval gate: NO build until this master and its active sub-WDLLs are approved. On approval, M0 is built and INSTALLED first (before any engine sprint), then R0-R4 execute under it. Discipline inherited from 27a/27b: fewer agents, tighter contracts, harder gates; verification never delegated; every grade a live query or live probe, pasted verbatim, never a report.

## The nested master done-line

OUTER (the product outcome that proves it): an operator (in Command Center) and a customer (in property-explorer) open any Central-TX parcel and get a provably-correct buildable envelope — a valid inset drawn from classified, first-class road nodes using a road-type-aware setback resolved from the descriptor — warm-computed ahead of demand, mechanically verified before promotion, honest where data is approximate or absent, and READ from the ledger, never re-derived. Depth is driven to full in Bastrop first, with the engine ready to run Central-TX by descriptor.

INNER (the required means that guarantees it stays proven): the spine is complete and self-truing — the console is true (27b, done), the ledger is deep not just wide (27c consuming 61a), road nodes are built as a digital-twin foundation, every mechanical guardrail (G1-G8 + the geometry gate) fails closed — AND the dev fleet builds against durable memory (M0) so build lessons do not die at context roll and drift cannot silently accumulate one level up.

The outer done-line PROVES the program works. The inner done-line GUARANTEES it stays proven. Neither alone is done.

## The through-line the master exists to hold: breadth is done, depth is ~0.1%, memory is the meta

Three facts set the whole shape, each traced to a live artifact:

Breadth is essentially DONE and was cheap. Per the 2026-07-24 coverage milestone (live-Neon audited), 10 Central-TX counties carry a full Tier-1 zoning-fact chain — ~2.15M parcels, no over-claim, ~$5.12 total metro compute, every county under commitment #3. The "expand the footprint / consume more parcels" effort already succeeded at BREADTH. Bastrop alone: 62,257 parcels with a zoning-fact.

Depth is a rounding error. The same audit: Bexar has 703,258 zoning-facts but only 814 setbacks and 814 envelopes. That is not a coverage gap — it is the shape of the real problem. The engine puts a zoning-fact on two million parcels for five dollars; the buildable ANSWER (setback + valid envelope) exists on ~0.1% of them, and the few that exist are the ones drawing jagged polygons. 27c is the DEPTH engine for the breadth footprint that already exists. It consumes the populated ledger (61a) and fills it deep; it does not re-bake it.

The geometry bug is the depth blocker, not a display nuisance. Depth is ~0.1% partly because the envelope derive produces garbage (naive per-edge miter self-intersects on real rings — 27c diagnosis), so there was never any point running it at scale. You cannot warm-verify two million envelopes through a gate when the derive self-intersects. R0 (geometry truth) is the UNLOCK for depth at scale, not just a one-parcel fix.

And the meta: the geometry bug's root cause was a poor-memory-architecture failure — an agent knew enough to reject one naive path, not enough to reject the second, and left no durable memory of the missing lesson. The fleet re-derives from archaeology every time. M0 exists so the fleet stops doing that, starting with this program.

## The four altitudes are one architecture

A mechanical gate separating cheap-and-can-be-wrong from promoted-and-provably-right, plus a durable store where verified facts accumulate instead of dying:

- Geometry calibration (27c sense A): the gate for ONE answer type — an envelope is not "correct" until it clears a mechanical inset check.
- The warm ledger (27c + 61a): the gate for PARCEL knowledge — a warm result promotes to durable memory only past the verify gate; the customer reads it, never re-derives.
- Fleet memory (M0): the gate for BUILD knowledge — a build lesson is not durable until promoted, and its strongest durable form is a mechanical guard (a failing test), not prose.
- Confidence calibration (27c sense B, 04a): the ledger gaining temporal depth over time — the substrate doing the one thing it was built for.

One idea, four faces. The warm ledger IS the product memory; M0's store IS the fleet memory; the descriptor tables and the geometry tests ARE promoted durable facts; the verify agents ARE the promotion gates.

## THE SUB-WDLLs

### M0 — FLEET MEMORY (sprint zero — built and INSTALLED FIRST, before R0)

Operator directive 2026-07-25: the fleet-memory process must be created properly FIRST and installed as a usable process (Cursor rule / skill / convention) that the fleet starts using now and that survives every build after it. Not a doc section, not a late sprint, not an abstract discipline — real, installed tooling landed before R0, so R0 is the first sprint that dogfoods it.

The two-tier model, dogfood-first (our fleet, not a product):
- Tier 2 (scratch, cheap, lossy, can be wrong): a structured file per active workstream, micro-schema, four entry kinds — LESSON (a hard-won fact that should become a test or a durable note), DEAD-END (a tried-and-failed path the next agent must not retry), GROUND-TRUTH (a live-verified state that goes stale and MUST carry its timestamp), OPEN (a live thread a fresh context must pick up). A build agent writes entries as it works; nearing its context ceiling it flushes to the file and the next instance reads it back. The file is continuity; the agent is disposable.
- Tier 1 (durable, promoted): a scratch LESSON earns promotion only when verified, and the STRONGEST promotions become mechanical guards (a failing test on a concave fixture beats a note that says "use a real offset library" — prose rots, a test cannot be silently violated) or a MEMORY.md / doc entry where prose is the only form. Promotion is PLANNER-GATED, never autonomous — the scratchpad captures aggressively at Tier 2 (fine to be wrong, it is disposable) but does not write durable memory by itself. This is the drift firewall: the exact nested-agent-fan / scan-fix risk shape is contained at the disposable tier because promotion to durable is gated.

Install surface (the "survives every build" requirement, honest about the split fleet):
- Planner half (doc_repo, Claude Code + Cursor): a `.cursor/rules/*.mdc` rule (sibling of the existing `wdll-practice.mdc`, `alwaysApply: true`, all-agents, terse, citing a fuller `90_runbooks/` runbook) + optionally a `.claude/skills/` skill + the `_scratch/<workstream>.md` file convention in doc_repo.
- cc-agent half (product repos ldt/engine/map — which today have NO `.cursor/rules/`): a copy-paste-ready global rule block + the convention EMBEDDED in every dispatch prompt (matches the operator-owed global-rule-paste and the copy-paste-ready-handoff discipline). M0 must install in BOTH forms, not pretend one install reaches everyone.

Acceptance items (M0):
M0.1 THE PROCESS EXISTS + IS INSTALLED. The scratch micro-schema + promotion gate are documented in a `90_runbooks/` runbook; the `.cursor/rules/*.mdc` rule is live in doc_repo; a copy-paste-ready cc-agent rule block exists; the `_scratch/` convention is live. | grade: [ ]
M0.2 THE FLEET USES IT (dogfood, measured LIVE during R0-R4). R0's geometry lessons are captured as scratch entries; a subsequent sprint agent starts warm by reading the scratch file rather than re-deriving; demonstrate one concrete case where a scratch DEAD-END or LESSON prevented a repeat of a known failure. | grade: [ ]
M0.3 PROMOTION IS GATED + PRODUCES A MECHANICAL GUARD. At least one R0 geometry LESSON promotes to a durable form, and the strongest promotion is a mechanical guard (a test), not prose; promotion went through planner review, not autonomous write. | grade: [ ]
M0.4 IT SURVIVES A CONTEXT ROLL. Demonstrate the flush-and-reload: an agent near its ceiling flushes scratch state; a fresh instance picks up the workstream cold from the file with no lost open threads. | grade: [ ]

M0 negative done-line: the scratchpad writes durable memory (MEMORY.md / tests) autonomously without planner review (drift engine); the process is a doc nobody reads rather than an installed rule the fleet actually writes to; it installs only for the planner and never reaches the cc-agents; a promoted lesson is prose where a mechanical guard was possible.

### 27b — F1, COMPLETE THE COMMAND CENTER (DONE — the console)

Ratified and graded MET 2026-07-25 across all 9 acceptance items (27b / 27a WDLL). The console is whole, the ledger is live and tallyable, the parcel-node binding is bidirectional, the mechanical honest-badge and end-to-end smoke test are green, coverage is a live tally only. This sub-WDLL is CLOSED; it is the foundation the rest builds on. Do NOT re-open. Its role in the master: it is the surface where the depth engine's output becomes visible and verifiable (the ledger shows the depth ratio; the smoke test gains the geometry gate).

### 27a — THE SUPPLY ENGINES + GUARDRAILS (the ratified factory spec)

Ratified 2026-07-25. Seven jurisdiction-agnostic engines (INTAKE, RULE, REASONING, ATOM-EMITTER, TALLY+MONITOR, DEPLOY/ENV, SMOKE-TEST) that flesh out the one ledger, checked by guardrails G1-G8, each traced to a specific Central-TX hand-build failure. Its role in the master: it is the ENGINE CONTRACT that 27c deepens — 27c grows INTAKE (roads as nodes), RULE (road-class-indexed setbacks), and REASONING (real polygon-offset), and adds the geometry-correctness gate to the G1-G8 family. 27a's anti-zombie line (reasoning in engines, jurisdiction only in descriptor + adapter + provenance; County #500 is a descriptor a background agent runs) is load-bearing for the warm-up policy.

### 27c — THE DEPTH ENGINE + ROAD NODES + WARM DIGITAL-TWIN (the active build)

The active sub-WDLL. Road-as-first-class-node (keystone), road-type-aware setbacks in the descriptor, real polygon-offset geometry with a mechanical correctness gate, the warm-then-verify loop, Bastrop pilot with a MEASURED depth-cost gate, and the digital-twin design constraint (build the road node with reference/attach points; no non-road infra in scope). Reframed by this master as the DEPTH engine over 61a's breadth: it consumes the ~2.15M-parcel populated ledger and fills it deep; the warm-up is depth-over-existing-breadth, not cold warming; the ledger metric is the DEPTH RATIO (verified-envelope / zoning-fact), currently ~0.1%, driven toward full in Bastrop. Full acceptance items (1-9) and sprint shape (R0-R4) in 27c; this master governs their sequence and the cost gate's framing (measure DEPTH cost per parcel — breadth cost is already known-cheap at ~$5/metro).

## MASTER SEQUENCE

Dependency-ordered, not time-estimated.

0. M0 — FLEET MEMORY built + installed FIRST. The process is live before any engine sprint so R0 dogfoods it. (M0.1)
1. R0 — GEOMETRY TRUTH. Real polygon-offset replaces the naive miter; geometry-correctness gate + concave/corner/714-Spring fixtures; verify live on four lot shapes. Unlocks depth at scale. First sprint ON TOP of M0 — its lessons are M0's first scratch entries. (27c WDLL 1, 2, 5; M0.2/M0.3)
2. R1 — THE ROAD NODE. Roads promoted to first-class spine nodes (identity, centerline, edges, ROW, classification, provenance, attach points), digital-twin-ready, no non-road infra, tallying in the CC ledger. (27c WDLL 3)
3. R2 — ROAD-TYPE-AWARE SETBACKS. Descriptor setback table indexed by (road-class, edge-role) + assumed-ROW-width table; RULE engine resolves from road class; verify street-vs-alley divergence on Bastrop. Depends on R1. (27c WDLL 4)
4. R3 — THE WARM-THEN-VERIFY LOOP. Background warm agent + mechanical verify agent + promotion gate over R0-R2. The parcel-memory analogue of M0's fleet-memory promotion gate. Depends on R0-R2. (27c WDLL 6, 8)
5. R4 — BASTROP WARM + DEPTH-COST GATE. Run the loop across Bastrop city + county; drive the depth ratio toward full; MEASURE real depth-cost per parcel vs commitment #3; decide eager-Central-TX. Depends on R3. (27c WDLL 7, 9)
6. CENTRAL-TX DEPTH (post-Bastrop, gated on R4's cost decision + the non-TX golden-descriptor test): run the descriptor across the 10-county breadth footprint to fill depth wide. Not opened until R4 clears.

Guardrails (G1-G8 + the geometry gate) are built EARLY and dogfooded, per 27a — so each sprint is checked by them as it lands. M0 is dogfooded the same way, one level up: the build of the depth engine is the first real test of whether the fleet-memory process works.

## WHAT THIS MASTER DELIBERATELY DOES NOT DO

- Does not re-open F1 / 27b (done, graded MET).
- Does not re-bake breadth (61a is done-wide, live-audited; 27c deepens, never re-runs the zoning-fact bake).
- Does not treat fleet memory as a doc or a late sprint — it is installed tooling, sprint zero.
- Does not let the scratchpad write durable memory autonomously (planner-gated promotion is the drift firewall).
- Does not go to Central-TX depth before Bastrop's measured depth-cost clears commitment #3 and the non-TX golden-descriptor test passes.
- Does not build a second map / ledger / node-model / read-path (one spine substrate; roads are new NODES on it, not a fork).
- Does not grant Bastrop any special/relationship-privileged data path (uniform public-record sourcing; the digital-twin layer is jurisdictions PUBLISHING onto a public substrate, not us scraping a relationship).
- Does not put any non-road infrastructure (streetlights, water, traffic) in scope — the road node is built digital-twin-READY; the infra atoms are a later authoring-on-proven-substrate build.

## NEXT STEP

On operator approval of this master: build + install M0 first (the runbook, the doc_repo Cursor rule, the cc-agent rule block, the `_scratch/` convention), then write R0 (geometry truth) as a dispatchable contract citing each 27c/M0 acceptance item it satisfies and dogfooding the M0 scratchpad from its first entry. No code until the R0 sprint contract is also reviewed. 27a/27b remain as their own docs; this master governs the sequence and the nested done-line; 27c is the active build; M0 is the sprint-zero prerequisite.
