---
id: 2026-07-23_atoms_first_central_tx_execution_plan
title: Execution plan — atoms-first Central-TX, authored toward the spine (handoff to the receiving planner)
status: draft
date: 2026-07-23
applies_to: hauska-engine (spine), hauska-atom-contract, hauska-mcp-server, hauska-sdk, legacy-design-tools (cortex-api reporting + current bake), property-explorer, hauska-map
related: [2026-07-23_MASTER_WDLL_property_reasoning_substrate, 2026-07-23_atom_family_WDLL, 2026-07-23_engine_family_WDLL, 2026-07-23_reasoning_chain_atom_shape_design, 2026-07-23_property_node_atom_fabric_and_engine_diagram, 75j_property_explorer_destination_ledger, 56_engine_extraction_sprint, 80_adrs/adr_008_engine_factor_out, 80_adrs/adr_018_atom_contract_substrate_layer, _architecture_homes/01_homes_and_topology, 2026-07-23_pe_map_truth_setbacks_handoff]
owner: nick
---

# Execution plan — atoms-first Central-TX (authored toward the spine)

This is the handoff plan the operator takes to the receiving agent. It encodes two operator decisions made 2026-07-23:
- ATOM HOME: author the atom family toward the SPINE (hauska-engine / hauska-atom-contract); do the sprint-56 reasoning-lift AS the atom refactor (do it once in the right home, not build-in-cortex-then-migrate).
- BUILD MODEL: planner-led fleet — the receiving agent is a PLANNER that dispatches sub-agents, adversarially reviews every deliverable, can spawn sub-planning agents for sub-domains, and NEVER delegates verification.

The goal: finish Central-TX to the atom fabric (the atom WDLL's done-line), which simultaneously IS the sprint-56 reasoning-lift and the seed of the Reasoning Engine (the engine WDLL). One move, three payoffs. National is later (run the engine by configuration); this plan is Central-TX only.

Read before executing: the two WDLLs (atom + engine), the atom-shape design doc, the fabric+factory diagram, the homes topology, and the in-flight agent's map-truth handoff. This plan assumes those; it does not restate them.

## FAN-CORRECTED (2026-07-23)

This plan was hardened by an 8-agent review fan (spine-readiness, contract-shape, cortex-code, plan-adversary, WDLL-adversary, SDK-boundary, gate-serving, improvement-ideas), each auditing LIVE code. The corrections are folded in below and tagged [FAN CORRECTION ...]. The north-star for the program is `2026-07-23_MASTER_WDLL_property_reasoning_substrate.md`; this plan is its build sequence. What the fan CONFIRMED: the spine can host the atoms (small lift; document-ingest is a live durable write path; reasoning has already lifted — engine-api is NOT embryonic); the envelope reasoning is already pure so the lift is clean; the setback tables already live in the engine (the anticipated A05 pipeline). What it CORRECTED: see the tags. Operator ruled FULL-CHAIN (build the StoragePort up front) and COMMIT-once-written.

## THE HARD GATE — phase 0, do this before committing a single line of atom code

A READ-ONLY audit that produces a decision doc and RULES the home. No build code before it. [FAN CORRECTION F6: give the gate an objective threshold + operator-escalation; the earlier self-approve escape was toothless.]

Phase-0 audit (read-only, produces a decision doc, no code):
- 2.1 SPINE-READY THRESHOLD (objective, escalate on fail): hauska-engine has a live atom WRITE path + retrieval READ for at least one existing atom family (the document-ingest lineage — `PgDocumentAtomStore`, migration 004, `POST /v1/document-ingest` — qualifies per the fan), AND the cross-project gate->spine auth is proven with a real call. If ANY is absent, the program is really "build the spine atom substrate THEN atomize" — ESCALATE to the operator, do NOT self-approve. (The fan found the substrate largely present; re-confirm live.)
- 2.2 CONTRACT-SHAPE GATE (not just version): state whether the live contract (1.7.0) expresses a derived-atom reasoning chain (input-atom refs + composed confidence) or whether it is NET-NEW. Fan verdict: net-new (`composition` is a render edge; `consequence` axis is life-safety-shaped) -> this is Phase 0.5.
- 2.3 HOME RULING: rule {spine home confirmed + write path named}; the forbidden outcome "author deep in cortex-api and migrate later" is named and excluded; a branch-(c) staged bake must name the exact repo/file and prove it is NOT `artifacts/api-server`.
- 2.4 LIVE-PE-SPRINT COLLISION RECONCILED [FAN CORRECTION F5]: this program and the in-flight property-explorer v1 sprint both touch `buildableEnvelope/`, the setback tables, and Overpass. Name ONE owner of `buildableEnvelope/`; ONE owner of the Overpass remount (not both plans); do the I-2-honesty fix ONCE (in-place shim OR folded into the atom refactor, never both).

Gate rule: no atom-producing code until phase 0 produces this doc and the home is ruled. Adversarially review the phase-0 doc as hard as any build deliverable — a wrong home costs the most. LINEAGE NOTE [FAN]: derived-fact atoms can start on the existing document-ingest durable path (Lineage B); the full fact->rule->derived LINK-GRAPH needs the deferred Postgres StoragePort (`pg-storage.ts` is a 404 today) — the operator's full-chain ruling pays for that StoragePort up front in Phase 1.

## THE BUILD (after phase 0 confirms the home)

Sequenced so the atom path REPLACES the bespoke path (no PERMANENT fork; a transitional flag-gated dual-serve during the live cutover is allowed and gone by close — F1/live-serving continuity) and every atom-producing line is jurisdiction-agnostic (so finishing Central-TX = building the Reasoning Engine's seed).

### Phase 0.5 — CONTRACT EXTENSION (net-new primitive, before Phase 1) [FAN CORRECTION F2]
The live contract (@empressaio/atom-contract 1.7.0) does NOT express a derived-atom reasoning chain — `composition` is a RENDER parent-child edge, not an input-atom-ref reasoning edge, and the third confidence axis (`consequence`) is hard-wired to ASCE7/IBC life-safety severity (an envelope has no value for it; stuffing it = fabrication). So phase 1 cannot "define kinds against the contract" until the contract is extended.
- Publish the reasoning-chain primitive (input-atom-ref + composed-confidence) as a backward-compatible minor bump, authored on the contract's OWN shipped idiom (`production-timeseries`: `derivesFromDid` + `derivationMethod` + widthed-confidence — ADOPT, don't invent). `/conformance` fixtures added; og/encumbrances/temporal consumers unaffected; tag-push CI.
- Rule the `consequence` axis optional (or map to an honest property-risk stratum) for non-life-safety atoms.
- Decompose the plan's `{source, vintage, verificationState}` onto the REAL fields: `sourceCitation` + `extractedAt`/`asOf` + `WidthedConfidence.provenance` + `modelAttribution` (LLM steps). Choose `AtomTier` (data|app) per kind (signed-history applies only to data-tier).
- If paid atoms route revenue, land the licensing/source-actor metadata the SDK's `RevenueRouter` needs (its `SourceActorReference` is a placeholder today) OR sequence revenue-routing as pending with an honest split degrade.

### Phase 1 — the reasoning, lifted + atomized, FULL CHAIN (the sprint-56 lift, done as the atom refactor)
Operator ruled FULL CHAIN (2026-07-23): build the deferred Postgres StoragePort up front so the derived envelope atomizes in wave 1, not wave 2.
- StoragePort landed FIRST: `pg-storage.ts` + an `atoms`/`atom_links` migration in hauska-engine (the fan found it is a 404 today; the linked fact->rule->derived graph needs it). The derived-fact atoms could start on the existing document-ingest durable path (Lineage B, migration 004, `POST /v1/document-ingest`) — but the full link-graph needs the StoragePort, which the full-chain choice pays for up front.
- The lift is CLEAN (fan-verified): the envelope reasoning is ALREADY pure, DB-free, atom-free (5 small files — `derive.ts`, `districtMapping.ts`, `edgeLabeling.ts`, `geometry.ts`, `roads.ts`); the coupling lives entirely in the 1060-line route, which stays cortex-side. Lifting = a file move + re-point, not an untangle.
Produce the atoms:
- zoning FACT atom (district + provenance; honest-absence where no polygon covers the parcel — a NAMED Bexar null-zoning parcel returns honest-absence, NOT a stamped I-2; fixes the in-flight agent's fallback invent).
- setback RULE atom CONSUMING existing provenance: the setback JSON ALREADY carries `atom_did` + per-field `confidence` + `verification_state` that `derive.ts` discards today (fan gift) — consume it, don't invent new tiers. Citation resolves to a real code section+edition. Match-basis becomes confidence: exact=asserted-high, prefix=asserted-medium-with-cited-prefix, fallback=asserted-low+honest-absence (dissolves the Kyle-R1-T / SA-C-3NA matcher problem by grading not tightening).
- setback rule CITES a code atom as a TYPED atom-reference (not a bare string; a string is a FAIL) — resolves to a real code atom or an honest "code-atom pending" placeholder. Setbacks + ICC unify.
- buildable-envelope DERIVED atom (inputs = refs to the fact + rule atoms + geometry + front-edge; confidence composed via the calibrated+asserted axes, consequence per phase 0.5; honest-absence states first-class). Calibrated axis resolves at READ through the existing calibration overlay (migration 0037), NOT composed-and-frozen [FAN CORRECTION: don't build a second confidence model].
REPLACES across ALL THREE orchestrators [FAN CORRECTION F1/aa6]: `deriveBuildableEnvelope`'s `labeling x district` multiply (derive.ts:150) must be retired from the API route AND the Tier-1 bake (nodeFacetBakeTier1.ts:217) AND the Tier-2 bake — all three re-run the same kernel; swapping only the route forks the PMTiles tiles INVISIBLY. Use TypeScript as the fork-detector: change `derive.ts`'s output type and let the compiler flag every stranded caller. Unify the ABSENCE vocabulary too (the bake `declined`/`confidence:0` sentinels and the route HTTP decline ladder must speak one dialect).
LIVE-SERVING CONTINUITY [FAN CORRECTION F1]: property-explorer serves users off this path across two prod projects. Do NOT delete-in-the-same-PR. Stand up the spine+gate+cortex-reads path behind a flag with the old path still serving; cut the live read to atoms; prove it on real Central-TX parcels; THEN delete the old path in a follow-up. "No fork at program CLOSE," not "delete in the authoring PR."
Anti-zombie [FAN CORRECTION F4]: keep the achievable form — grep confirms zero TX/county/FIPS literals in the reasoning; jurisdiction enters only via descriptor/adapter/provenance; a COMMITTED non-TX descriptor stub runs the same code to conformant-or-declined with zero code change (executed, not a reviewer thought-experiment). The full jurisdiction-agnostic ENGINE proof is Phase 2, not here.

### Phase 1b — referenced fields + the road-anchor honesty (folds into phase 1)
Geometry, topo/hydrology, road anchor are cited-by-reference INPUTS, NOT atomized. Front-edge is asserted-provisional (shape-tier); the schema is inspected to confirm calibrated-road is the SAME field's value (upgrades without a schema change when Overpass lands).
OVERPASS REMOUNT — ONE OWNER [FAN CORRECTION F5/F9]: the remount (workflow/Secret-Manager mount of OVERPASS_URL, NOT manual gcloud which the next deploy reverts) is ALSO claimed by the in-flight PE sprint's pickup list. It has exactly ONE owner — reconcile in phase 0 (2.4), do not let both plans spawn it. Overpass is orthogonal infra (survives the refactor); the I-2-honesty fix is NOT — do it ONCE (in-place shim if PE launch needs it before atoms land, OR folded into the atom refactor's honest-absence, never both).

### Phase 1c — flood as a REFERENCE, kept thin [FAN CORRECTION: off Cotality fabric turf]
Flood is a cited fact atom REFERENCING the FEMA source (provenance = FEMA vintage; honest-absence on outage) — NOT a migration that makes us a national flood-data host. FACT atoms (flood, property-chars) are thin cited pointers = table stakes; the moat is the DERIVED + RULE atoms. Sequence late, keep thin.

### Phase 1d — serve (CATALOG-TOOL path) + restore the SDK money boundary
- Serve via the CATALOG-TOOL path [FAN CORRECTION a1e], NOT the map/cortex package path. The catalog-tool path (`search_atoms`/`get_atom` pattern) enforces the atom's OWN five-value accessPolicy post-fetch at the gate; the package path only forwards a key-derived TIER and never reads the atom's policy. Set accessPolicy EXPLICITLY on the family (a jurisdiction-tagged atom with no explicit policy silently defaults to tenant-private and vanishes for anonymous/paid callers). Don't invent a 5th gate product — attach to `public`/`reporting`. Register in three places (product-gates set + tools.ts handler + tool-copy) and verify via `/admin/introspection/tools`.
- RESTORE the SDK money boundary [FAN CORRECTION aa1 — THE OPERATOR-FLAGGED INVARIANT IS VIOLATED IN LIVE CODE]: the gate meters through STRIPE today (`src/metering.ts` -> api.stripe.com billing meter), NOT the SDK; hauska-mcp-server has zero `@hauska-sdk/*` deps. The SDK ships a purpose-built `@hauska-sdk/metering` `McpMeteringGate` whose header names hauska-mcp-server as its consumer. FIX: swap the existing `read-attribution.ts:57` hook from `recordLayer2Call`->Stripe to `McpMeteringGate.authorizeCall` (authorize-time, not fire-and-forget); route revenue through `RevenueRouter`; retire the Stripe path; add a CI conformance test that FAILS if the `@hauska-sdk/*` dep or import disappears. Free/anonymous reads never load the SDK.
- The map inspect card renders the human cited chain generated FROM the atom fields (not hand-written copy); a report composes from the SAME atom ids. Prove all three consumers read IDENTICAL atom ids.

### Phase 1e — re-bake Central-TX to atoms + gate-verify (the finish line)
Re-bake Central-TX to emit the atom family. Every promoted value passes its gate (owner-match / citation-resolves / conformance). Honest-absence where source absent. Re-run owner-match + a spot audit (named parcels) to prove NO fabrication survived. Record re-bake compute cost per county (commitment #3). Coverage ledger shows atom emission per county above a named threshold. Wire the calibration overlay + a Texas public-record permit-outcome adapter so the earning loop has fuel [FAN IDEA]. Operator-QA surface.

## What this plan deliberately does NOT do
- Does NOT build the six engines as durable apps (that is the engine WDLL, sequenced AFTER this — finishing Central-TX by hand teaches the engine's requirements). But phases 2/3/6 build the engine SEEDS (jurisdiction-agnostic reasoning + gates), so the engine build later is hardening + generalizing, not greenfield.
- Does NOT go national. Central-TX only. National = run the engine by configuration, later.
- Does NOT tighten the mapDistrict matcher (the atom confidence-grading replaces the need — don't invest in a matcher about to be superseded).
- Does NOT deepen conditional-rule districts (Lockhart PDD, SA OCL) — they become rule-atoms-with-conditions later; deepening them now builds a structure about to be replaced (told the in-flight agent to stop).

## THE BUILD ORCHESTRATION MODEL (how the receiving agent runs this)

Operator ruled (2026-07-23): planner-led fleet. The receiving agent operates as PLANNER, not executor.

- PLANNER (the receiving agent) owns: the plan, the dispatch, the adversarial review of every deliverable, the merge decision, and the verification. The planner does NOT hand-write the bulk of the code; it dispatches sub-agents and reviews what comes back.
- SUB-AGENTS execute scoped, well-bounded tasks (one phase-slice each) against the WDLL acceptance items. Every dispatch CITES the specific acceptance item(s) it satisfies so drift is visible.
- SUB-PLANNING AGENTS: the planner CAN spawn sub-planners for a sub-domain that is itself plan-shaped (e.g. "plan the hauska-engine reasoning-lift" or "plan the ICC code-atom reference shape") — the sub-planner returns a plan the top planner reviews, then dispatches under. One level of sub-planning; a sub-planner does not spawn its own sub-planners (the nested-fan orphan trap).
- VERIFICATION IS NEVER DELEGATED. This is the load-bearing rule of this whole program. The planner verifies against LIVE STATE — the deployed revision, the live npm version, the actual gate verdict, the real owner-match — never against a sub-agent's report, a workflow-green, a bake summary, or "deploy succeeded." An executor's "done" is an input to the planner's verification, not a substitute for it. The operator QAs the public surface + spot-audits; the planner QAs everything under it.
- ADVERSARIAL REVIEW replaces the retired premortem scorecard: every plan and every sub-agent deliverable gets adversarially reviewed (try to break it, find the fabrication, find the zombie fork, find the jurisdiction-specific leak) before it merges.
- MERGE ON GREEN CI ONLY: local test runs are not a substitute for PR checks (envs differ). Verify branches by baseline-compare vs main where local suites don't run clean.
- ANTI-ZOMBIE IS A CI GATE, not a one-time review [FAN CORRECTION]: wire these as CI checks so a later PR cannot re-introduce a deleted path — (a) single-path — no PERMANENT fork; the bespoke path (all THREE orchestrators: route + Tier-1 bake + Tier-2 bake) reads atoms by program close, a transitional flag-gated dual-serve is allowed during cutover; (b) jurisdiction-agnostic — an EXECUTABLE non-TX golden-descriptor test (not a human reviewer); (c) SDK boundary — a conformance test that fails if `@hauska-sdk/*` deps/import disappear from the gate or a Stripe/bespoke charge reappears; (d) live-serving continuity — no merge drops property-explorer's live read to a not-yet-serving path. A deliverable that forks-beside, leaks-jurisdiction, bypasses the SDK, or strands the live read is a fail, not a partial.

## Concurrent-commit + shared-clone discipline (this repo + build repos)
Other agents commit in the shared clones. Before any commit: check git log -3 for a rewind/other-agent-commit, stage explicit paths (never `git add -A` in the shared doc clone), commit promptly, push right after the first commit on a build branch (tmp-clone recycle hazard). Restore any touched persistent clone to clean main. Verify the deploy method per repo (cortex-api = workflow_dispatch canary; engine-api = Cloud Build with services/engine-api/Dockerfile, project hauska-prod-497015, repoint the envelope-canary tag after deploy; hauska-mcp auth = X-Hauska-Key header not Bearer).

## Definition of done (this plan)
The MASTER WDLL's Phase-0/0.5/1 acceptance items grade met/partial with reasons on live-verified state, and NONE of the negative-done-line FAIL conditions is true. Central-TX parcels serve the fact/rule/derived atom chain through the gate (catalog-tool path, explicit accessPolicy), monetized through hauska-sdk (Stripe path retired), read identically (same atom ids) by the map / reporting / an external MCP call, with no fabrication, honest-absence where data is absent, calibration wired to the overlay — and the atom-producing code is jurisdiction-agnostic (proven by the committed non-TX golden-descriptor test), so the same code is the Reasoning Engine's seed. Then Phase 2 (the engine WDLL) opens as the next program.
