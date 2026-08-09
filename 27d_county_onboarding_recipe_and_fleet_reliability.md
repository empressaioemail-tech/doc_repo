---
id: 27d_county_onboarding_recipe_and_fleet_reliability
title: The county-onboarding recipe + fleet-reliability machine — what makes "start county X" honest
last_updated: 2026-08-09
status: superseded
owner: nick
sub_wdll_of: 27_MASTER_WDLL_spine_completion_and_depth_engine
extends: 27a_jurisdiction_factory_engine_spec (the anti-zombie line + golden-descriptor test are the backbone here)
related: [27_MASTER_WDLL_spine_completion_and_depth_engine, 27a_jurisdiction_factory_engine_spec, 27c_road_node_engine_and_warm_digital_twin_spec, 90_runbooks/fleet_memory_practice, 2026-07-26_base_layer_connecting_tissue_thesis_and_tracks, 2026-07-26_depth_engine_roadmap_and_action_items]
---

# The county-onboarding recipe + fleet-reliability machine

> **2026-08-09: superseded as plan of record** by `90_runbooks/factory_onboarding_runbook.md` (the two lanes) and the `90_operations/OPS-*` band (the 8-gate recipe by OPS-8 plus OPS-2 stages), per `_decisions/2026-08-09_factory_spec_precedence_ruling.md`. Never operator-approved. The three road-source recon gates survive in `28_THE_BASTROP_MOLD_engine_build_spec.md` Part 3; the thin-console ruling survives in OPS-6.

Operator framing 2026-07-26: what we are building is a series of engines the operator runs from the Command Center that take a brand-new county completely online — verified, scrubbed, accurate, market-ready (the v2 base-layer target) — in waves like the process we are going through now, but WITHOUT the decision-making. The operator says "start county X" and the mechanics, agent rules, and memory execute it reliably, on multiple counties at a time.

The core insight (why this is NOT a UI build): the intelligence is not in a dashboard. It is in the ENGINES and the AGENT-STRUCTURE-PLUS-MEMORY that executes them. "Start county X" is reliable if and only if every per-county DECISION has been converted into a mechanical GATE that fails closed. Bastrop is where the decisions get baked; the button is reliable to the exact degree that baking is complete. A rich control cockpit is what you build when the human is in the loop for every county — and the whole design goal is to take the human OUT of the per-county loop. So the console stays THIN (launch + watch), the machine is DEEP (gated + memory-warm), and the UI thinness is a consequence of the machine being reliable, not a compromise.

This doc scopes the reliability machine (the real work) and defers the thin launch surface (the cap) until the recipe is proven on counties #2-3. Effort goes to the engine gates + M0 reach + customer-facing UI, NOT to an operator-cockpit rabbit hole.

## The sequencing ruling (the button is LAST, not first)

"Start county X and it just works" is a lie until a county is a fixed recipe rather than a re-figuring-out. Bastrop is county #1 — it is ALL figuring-out. The proof that the machine is real is counties #2-3: do they run on the baked gates, or do they surface new decision-points (new zoning vocab, new road-data quirk, an overlay type Bastrop did not have)?

Order:
1. Finish baking Bastrop's decisions into gates (in flight — FIX 2.1 front-labeling gate is the current one).
2. Harden M0's cc-agent-reach (below) — the actual enabler of unattended onboarding.
3. Prove the recipe on counties #2-3 via the golden-descriptor path (27a line 85). If they run clean, the recipe is fixed. If each re-opens figuring-out, the machine needs more baking before any button means anything.
4. ONLY THEN build the thin launch+watch surface in CC. A launch button over a machine that still needs per-county decisions is a lie; building it before the recipe is proven is the rabbit hole we are avoiding.

## The county-onboarding RECIPE (the fixed dispatch, so agents never re-learn)

The thing that removes "bringing agents up to speed every time" is NOT a CC feature — it is M0 (durable memory) plus a STANDING county-onboarding dispatch template. The agent starts warm because the memory is durable and the dispatch is a fixed recipe, not a fresh conversation. The recipe is jurisdiction-agnostic: a descriptor goes in, a market-ready county comes out. Every step is a gate that fails closed (the decisions from Bastrop, baked).

Recipe stages (each a gate; each a stage of the 27a supply engines, hardened by the Bastrop failures):
1. DESCRIPTOR IN — the county descriptor (FIPS, zoning->setback table indexed by road-class+edge-role, assumed-ROW-width table, source adapters, accessPolicy). Authoring the descriptor is the ONLY per-county human-ish input; everything downstream is mechanical. GATE: descriptor validates against the contract; golden-descriptor test shape.
2. INTAKE — parcels (geometry), zoning-facts, roads (centerline + classification + assumed ROW) ingested onto the one substrate. GATE: source-verified + provenance-stamped; a 404 is honest-absent, never a silent zero.
3. ROAD + FRONT LABELING — roads as first-class nodes; front/side/rear labeled correct-by-RULE (footway ineligible; local-street-preferred-over-collector; not correct-by-accident). GATE: the front-labeling fixture gate (FIX 2.1) — the class-guard, green.
   - **AUTHORITATIVE ROAD SOURCE RECON (fan-out gate, promoted 2026-07-27 S2-F):** Authoritative road/parcel sources are SPLIT by jurisdiction level — a county may publish separate county-road vs comprehensive-roadway vs city-street layers. A county-lane agent must find ALL jurisdiction-level authoritative sources (county + comprehensive + each incorporated city), not assume one covers everything; ingesting one silently under-retires the OSM proxy where another jurisdiction's source is needed.
   - **SCHEMA ≠ DATA (same gate):** Authoritative layers may be SCHEMA-COMPLETE but DATA-SPARSE — a roadway layer can carry `owner`/`l_muni`/`surface` FIELDS while barely POPULATING city-street rows or leaving `surface`/`class` = Undefined. The agent must check DATA POPULATION (query actual city-street rows + non-null **defined** surface/class), not just that the layer/fields EXIST. Only promote provenance to authoritative when surface/class is defined; if Undefined/empty, KEEP OSM as best-available (`osm-best-available` / osm-fallback). Never fabricate an authoritative label from Undefined — that is worse than the honest proxy. Bastrop proof: `owner=City` 2371 rows but City+BASTROP-muni with defined surface = **67** / Undefined = **994** (`_inbox/2026-07-27_S2F_city_street_population_audit.json`).
   - **UNREACHABLE-CITY-GIS (fan-out gate, promoted 2026-07-27 RECIPE-PROOF Caldwell; mechanical 2026-07-27):** When a jurisdiction-level city GIS endpoint fails DNS or hard-fails HTTP (host does not resolve / connection refused / persistent 5xx with no alternate), treat it as an **absent source**, not an empty-authoritative layer. Record the recon miss in the county road-source recon JSON; KEEP OSM as best-available for that city's street grid; never invent `county-roadway-authoritative` (or city-authoritative) from a missing endpoint. Caldwell proof: `gis.lockhart-tx.org` / `maps.lockhart-tx.org` DNS NXDOMAIN; CAD Road_Centerlines county-rich / city-street-sparse (cityish STREET non-county ≈55); OSM Lockhart bbox recovered the city grid. **Mechanical guard:** `packages/engine-core/src/road-intake/unreachable-city-gis.ts` + `__tests__/unreachable-city-gis.test.ts` (fixture contract on `caldwell-road-source-recon.json`; goes RED if unreachable/OSM/`newDecision` drift). Engine PR #148.
4. RULE — road-type-aware setback resolved from the descriptor. GATE: citation resolves to a real code atom; verification-state recorded.
5. REASONING — buildable envelope via the real polygon-offset. GATE: geometry-correctness gate (contained, non-self-intersecting, correct offset) — declines honestly, never draws a confident wrong shape.
6. WARM -> VERIFY -> PROMOTE — a warm agent computes; a SECOND agent verifies MECHANICALLY (not re-asserting agreement); only passing results promote to durable ledger. GATE: the mechanical verify gate.
7. TALLY + COST — live SELECT of the depth ratio (place-type + all-zoning, reported separately) and measured cost per parcel. GATE: cost under commitment #3 or flagged; coverage is a live tally only (G1).
8. SMOKE — end-to-end live availability (click known nodes through ledger + map, atoms render). GATE: fails loudly, blocks.

The recipe is DONE for a county when every gate is green and the ledger tallies the county market-ready with honest gaps named. No human decision inside the recipe — only descriptor authoring at the top and the operator greenlight at the batch level.

## M0 cc-agent-reach HARDENING (the actual prerequisite for unattended onboarding)

The biggest known M0 weakness, and the thing that gates the whole fan-out: M0 reaches the PLANNER half cleanly (doc_repo has the .cursor rule + the _scratch file), but reaches the cc-agent half only through dispatch-embedded rule blocks + manual mirroring by the planner. That is fine for one planner + a subagent; it is fragile across parallel county lanes. You cannot safely open a multi-lane fan-out on a memory system that only cleanly reaches the planner half.

Hardening requirements (do BEFORE Stream A fan-out):
- The county-onboarding recipe dispatch template EMBEDS the M0 rule block and the relevant durable scratch context by default, so every county-lane agent starts warm from the same memory without hand-assembly.
- A durable per-county scratch file convention (`_scratch/county-<fips>.md`) seeded from the recipe, so parallel lanes do not collide on one shared scratch and each lane's memory is isolated but promotable.
- The class-guards (front-labeling gate, geometry gate, verify gate) are the DURABLE form of Bastrop's lessons — promoted to tests/gates, not prose. A lane agent inherits the baked decisions as GATES it cannot violate, not as notes it must remember. This is the real "warm" — the decisions are in the code, not in the agent's head.
- Verification is never delegated to the lane executors; the planner (or a dedicated verify lane) grades every promote against live state. Parallelism is on the EXECUTOR/county axis; the single owner of the shared write-path and the single reconciled truth stays one mind (the one-owner-per-substrate ruling).

The test of M0-reach: a fresh county-lane agent, given only the recipe dispatch + the county descriptor, onboards the county with zero operator re-teaching and zero re-derivation of a baked decision. If it re-derives a class Bastrop already solved, M0-reach failed and the guard did not promote.

## The thin launch+watch surface (deferred — the cap, built AFTER counties #2-3)

When the recipe is proven, the CC surface is minimal and specific — NOT a rich cockpit:
- "Start county X" / "start these counties" — fires the fixed recipe dispatch on the county-lane agents. The button is a trigger over a proven machine, not a control panel of decisions.
- Watch: per-county warm-state, depth ratio (live tally), cost-per-county, what is in flight, honest gaps. The fan-out truth-window.
- Greenlight the next batch. The operator's only in-loop decision is batch-level go, not per-county mechanics.
- Wire the existing STUB Engines panels (Resolver, Autonomous Engines) to show engine run-state/health/coverage; fix the DEGRADED panels (Parcel Trace, Revenue Meter); swap the CC map to the shared layered map. (These are the Stream C items, kept thin.)

Explicitly NOT built: per-county knobs, decision controls, autonomy-tuning UI, or anything that implies the human is in the per-county loop. The console is a launch button and a truth-window over an autonomous machine.

## Execution split (operator-decided 2026-07-26)

- The AGENT FLEET executes in Cursor (or Claude subagents) — the county-onboarding recipe, warm from M0, gated. Running the fleet from Cursor is fine as long as the operator does not re-teach agents per county (M0 + the fixed recipe is what removes that).
- The VISUAL DASHBOARD (launch + watch) lives in CC. Trigger + truth in CC; execution in the fleet.
- Reliability lives in the GATES and the MEMORY, not the UI. UI/QA effort goes to CUSTOMER-FACING (Stream B: site plan, road render, customer surface), not the operator console.

## What "done" means for this doc's scope

A- The desired END is identified: a county fully online (verified, scrubbed, accurate, market-ready at v2 base-layer target) with every gate green and the ledger tallying it honestly. This is what Bastrop is establishing now.
B- That END is REPRODUCIBLE at scale: the fixed recipe + M0-warm agents + the class-guards run a new county (then multiple at once) reliably, proven on counties #2-3, without per-county decision-making. "Start county X" becomes honest at exactly that point.

## Next step

While FIX 2.1 runs: this doc + the M0-reach hardening are the prep. On approval, the near-term order is: (1) land FIX 2.1's front-labeling gate; (2) harden M0-reach per above; (3) author descriptors for counties #2-3 and prove the recipe via the golden-descriptor path; (4) then, and only then, the thin CC launch+watch surface. The reliability machine is the work; the button is the cap.
