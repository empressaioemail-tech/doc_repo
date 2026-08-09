---
id: PHASE_C_HANDOFF_bastrop_warm
title: PHASE C HANDOFF — run Bastrop city through the factory (the warm), for a fresh planner + sub-fleet
date: 2026-08-02
status: handoff (Phase A + B done + deployed; Phase C = the production warm; STOP at operator R6)
owner: nick
related: [OPS-0_MASTER_game_plan, OPS-2_county_onboarding_runbook, OPS-5_cert_standard, OPS-6_command_center_engine_console, 2026-08-02_bastrop_recipe_ACCEPTED, 2026-08-02_bastrop_city_and_fan_MASTER_WDLL, _scratch/autonomous-run-bastrop-factory]
---

# PHASE C HANDOFF — the Bastrop warm

You are the fresh PLANNER picking up Phase C: run the whole City of Bastrop (minus the quarantined Block-13) through the certified factory line, so it is mechanically warmed + area-swept + served on prod + visible in Command Center, then STOP for the operator's R6 visual QA. This is the first real proof of the County Onboarding Runbook (OPS-2). It is the highest-risk phase: it writes ~4,877 REAL atoms to the prod substrate. Read this whole doc before dispatching anything.

## THE BIGGER PURPOSE (why Phase C matters beyond Bastrop — read this first)
Phase C is THE LAST TIME THE RECIPE SHOULD NEED CAREFUL HUMAN RELAY. Today the recipe is frozen as PROSE (this doc + the accepted recipe) that an agent must read and interpret correctly — that is a crutch and the source of ambiguity. The operator's goal: a true factory an agent can "turn on" with NO recipe knowledge. So Phase C has a DUAL deliverable: (1) Bastrop city warmed + swept + ready for R6 (the immediate goal), AND (2) the EXTRACTED shape of a GENERIC, SELF-GUARDING `onboard(county_fips)` command — see §11. As you run Bastrop by hand, NOTE every step that is currently "prose an agent must interpret" vs "mechanism that self-enforces"; those notes become the spec for the generic command (Phase D). Run Bastrop as if you are writing the operator's manual for a machine that will later run itself.

## 0. YOUR ROLE + THE HARD STOP LINE
- You are the MASTER planner: plan, coordinate, VERIFY (never on an agent's word — always against live state), hold merge/deploy/warm authority. Dispatch mechanical execution to cost-effective models; do heavy/risky steps yourself.
- STOP LINE (do NOT cross autonomously): the run ends at "Bastrop city mechanically swept + served on prod PE + visible in CC County Ledger, per district block, awaiting operator R6." Operator R6 (live visual QA in CC) is a REQUIRED, HUMAN, non-automatable cert gate (recipe R6). You do NOT claim "Bastrop CERTIFIED" — the operator does, after R6. Also STOP + report if you hit a wall the recipe can't clear (the rebuild trigger) — never improvise past it.

## 1. WHERE THINGS STAND (live-verified 2026-08-02 — but RE-VERIFY before you act; state drifts)
- PHASE A COMPLETE (all 7 foundation gaps closed, hauska-engine main @ b90383c4): fleet-memory in all 5 repos; block13-cert-grade.mjs ON MAIN (4-gate cert reproducible); recipe_version stamped on promoted atoms (RECIPE_VERSION="1.0.0" in depth-warm/types.ts); jurisdiction registry loader (BASTROP_REGISTRY_ROW in packages/engine-core/src/registry/); R7 closed at primitive bake (compute.ts unmapped-adjacency now resolves district setback); rewarm-deterministic content hash (contentHashExcludingProvenance); performance ledger (county_facet_coverage + the endpoint).
- PHASE B COMPLETE (factory floor live): cortex-api GET /api/county-ledger LIVE on prod (HTTP 200; returns 10 CAPCOG rows, onboardedCount 0 — correct, no factory run yet); CC County Ledger panel deployed to the LIVE console **cmdcenter-blush.vercel.app** (the operator's working console; project `cmdcenter`, Engines group). Migration 0064 (A7 columns) IS applied to cortex Neon.
  - CC DEPLOY NOTE (paid-for lesson): there are TWO Vercel projects — `cmdcenter` → **cmdcenter-blush.vercel.app** (THE LIVE ONE the operator uses; deploy here) and `command-center` → command-center-jade-sigma.vercel.app (a PARALLEL/older project — do NOT deploy CC work here). Both build `apps/command-center` from hauska-map, but only blush is the operator's console. When you deploy any CC change: `vercel link --project cmdcenter` then `vercel deploy --prod`, and VERIFY the panel is in the blush bundle (fetch /assets/index-*.js and grep), not just that it merged.
- retrieval-api /search HEALTHY (200) — needed for citation QA during the warm.
- The Bastrop registry row is frozen in the engine loader AND in doc_repo _land_records/txgio_stratmap_county_matrix_2026-08-02.json (48021: STALE 202503, 63357 features, prop_id bad-rate 0.0022 = clean).
- RE-VERIFY these before acting: `gh api repos/.../commits/main`, curl the county-ledger endpoint, check the serving cortex/engine revisions via BASE URL (the gcloud describe/list API caches stale traffic — trust base-URL behavior, not describe).

## 2. THE RECIPE — the contract every warmed parcel must honor (the settled state)
Full recipe: 2026-08-02_bastrop_recipe_ACCEPTED.md (8 buckets, R1-R32, reversal ledger). The load-bearing rules for the warm:
- SOURCE: setback NUMBERS from the jurisdiction's authoritative per-parcel record (Bastrop = AGOL Parcels_One_Click/FeatureServer/23, "layer 23"), NOT ordinance text, NOT a fixture. District from the live zoning layer / dominant row (split-zone R26). Ordinance = citation only.
- MODEL: interior-side + corner-side as DISTINCT fields (R2). Unmapped-but-known-role edge → district-default-for-role (R7, now closed at bake). GC/MU from the per-parcel record (R8). Fire-code-defer → 5' so the envelope DRAWS (R22). Alley = its own role (R23). Split-zone → dominant-area district governs, disclose the rest (R26). Genuinely-conditional axes → GRACEFUL honest-decline (envelope still draws on resolvable edges).
- EDITION CURRENCY: repealed B3 is UNREACHABLE (R13 fail-closed; the Bastrop string-filter covers the whole city — R16 general gate is a NATIONAL prereq, NOT a Bastrop-city blocker). Never serve repealed code.
- CONFLICT: layer-23 (OnClick) vs layer-83 (Revisions) → DRAW from layer 23, CITE layer 83, DISCLOSE the conflict (R25).
- GEOMETRY: **CORRECTION 2026-08-09** — "BCAD rings trusted" below is SUPERSEDED by the Geometry Law (`_decisions/2026-08-07_envelope_saga_close_and_geometry_law.md`, engine PR #273): txgio is THE truth frame that envelopes are constructed from, verified against, and served on; BCAD is demoted to a currency instrument that FLAGS divergence and never silently substitutes. Read "BCAD rings" below as legacy language. This was the last uncorrected instance of the pre-Geometry-Law frame in the OPS band; the parallel corrections landed in OPS-5 and OPS-2 on 2026-08-08. Whether the cert lane's fetch path actually reads txgio on engine HEAD is UNVERIFIED-IN-SOURCE and is a named open item in `90_operations/OPS-12_instrument_inventory.md`.
- GEOMETRY (original text): BCAD rings trusted, NO scrub (A5). On re-warm, RECOMPUTE the boundary primitive against the ring (winding invariant R28) + RE-DERIVE edge roles to actual frontage (situs-street-match R30). Conditional convexity gate (R29 — convex only if the lot is near-rect). Invalidate stale envelope on source-repeal (R27).
- CURRENCY: parcel-currency — every prop_id must still exist in the current BCAD cadastral (R9); re-plats enumerate ALL successors (R15).
- BLOCK-13 ANSWER KEY (the certified reference, DO NOT re-warm): 7 parcels (34145,34121,34153,34137,34169,34177,34161), blk='BB 13 E W ST'. SF-1 25/5/corner15/25 H35 imp50%; MU 15/5-firecode/15 H40 imp60%; GC 20/5/20 H55 imp65%.

## 3. THE CITY SCOPE (Phase 1 gap analysis — the numbers)
- CERT ROSTER (R17): layer 23 CITY='BASTROP' = ~6,972 parcels (7,125 on layer 83). Use the TxGIO City_Boundaries layer OR layer-23 CITY filter to define "the city" — do NOT use BCAD city columns (they're empty). MINUS quarantined Block-13 (7).
- DISTRICT MIX (layer 23, n=6,972): SF-1 2,469 (35%) · PDD 1,978 (28%) · GC 889 (13%) · RR 645 (9%) · MU 516 (7%) · PI 240 · IND 117 · null 117 · P/OS 1.
- WARMABLE SCALAR ≈ 4,877 (6,972 − 1,978 PDD − 117 null). PDD + null → GRACEFUL HONEST-DECLINE (S-10 accepted), NOT cert failures.
- BLAST RADIUS: ~10k non-city (CITY<>'BASTROP') layer-23 rows are the county/ETJ program, SEPARATE from city cert. ~4,834 city warm-promotes minimum before mechanical cert.

## 4. THE WARM MECHANICS (the OPS-2 line, tools + env)
Batch script: hauska-engine/packages/engine-core/scripts/depth-warm-bastrop-batch.mjs. Real flags (verified): --limit=N --offset=N --parcel=<id> --promote --dry-run --city-cohort --place-type-cohort --force-repromote.
- ENV (required for the promote path): PROPERTY_ATOM_PATH=1 DATABASE_URL=<prod-cortex-neon> TXGIO_DATABASE_URL=<prod-cortex-neon>. Without PROPERTY_ATOM_PATH=1 the script refuses to run the atom path (guard at ~L157).
- COHORT: --city-cohort (geographic city cohort — NOT lexical prop_id head; the R4.1 rural-skew lesson). District blocks are the PARALLEL UNIT.
- RE-WARM: --force-repromote triggers R28 (winding recompute) + R30 (edge-role re-derive) — MANDATORY for every warm (the interim R7 mitigation + the stale-role fix). Do NOT warm without it.
- READ-ONLY FIRST: run --dry-run to get the true failure map before any --promote (recipe R3 discipline; a first read-only run is required per the block-cert method).

## 5. THE COST GATE (commitment #3: <$200 compute + <1hr human review per jurisdiction)
- Historical R4 measure: ~$0.34 compute + ~8.6 wall-hours for 6,972 parcels (single-thread) — CLEARS $200 by orders of magnitude.
- REQUIRED FIRST: re-measure warm cost on a 150-PARCEL Bastrop city cohort with --force-repromote + layer-23 fetch (heavier than the old place-type warm). Confirm it still clears the gate before the full run. The script emits a cost JSON (usdPerParcel, extrapolatedJurisdictionUsd, flaggedOverCostGate).

## 6. THE CERT (per district block — BOTH gates)
- MECHANICAL area-sweep per block (recipe R3/R17/R19-R32): grade EVERY rendered parcel in the block; drawn-envelope geometry measured in FEET by the R32 index-matched inward-normal (block13-cert-grade.mjs, now on main — EXTEND its roster from the 7 Block-13 parcels to the block's parcels); per-edge ORIENTATION (front on the street-frontage edge, R31); district + numbers + full field parity (R24); three-way convergence PE==SmartCity==city-GIS (R20); parcel-currency (R9); persisted==recompute (R10); no repealed/blank/stale served (R13/R14). ONE wrong parcel = block FAILS → fix root cause, RE-SWEEP the whole block (NEVER sample).
- CC SURFACE: each block's result flows into the CC County Ledger (onboarded/coverage/cert-state populate for 48021). The operator watches Bastrop come online HERE.
- OPERATOR R6 (the stop line): after each block's mechanical sweep passes, the operator does live visual QA in CC. Cert is NOT claimed until R6 passes. You STOP the run at "swept + served + CC-visible, awaiting R6."

## 7. EXECUTION ORDER (the loop)
1. C1 — RE-VERIFY live state (§1). Confirm Bastrop registry row frozen. Run --dry-run on a 150-parcel city cohort → cost re-measure + true failure map. Report cost vs gate.
2. C2 — For EACH district block, in order SF-1 → GC → MU → RR → PI → IND (biggest/simplest first): warm all layer-23 parcels in the block with --force-repromote → --promote to prod Neon. PDD + null → graceful honest-decline pass (separate, not a warm failure). Block-13 QUARANTINED (never touched).
3. C3 — After each block promotes: run the mechanical area-sweep cert (extended block13-cert-grade harness) on that block. PASS → surface in CC, report, move to next block. FAIL → STOP, diagnose the root cause (use two-blind-measurer for geometry disputes per A16/A17), fix, re-warm + re-sweep the WHOLE block. Never sample, never force past.
4. GATE C — when all warmable blocks are swept + promoted + CC-visible + PDD-declined-honestly: STOP. Report "Bastrop city ready for operator R6" with the per-block sweep evidence. Hand to operator.

## 8. TRAPS (paid-for lessons — do NOT re-learn; from memory + this session)
- VERIFY AGAINST LIVE, NOT AGENT REPORTS. Every warm/cert claim: check the actual served facet / substrate SELECT, never the executor's word. This caught 3 defects this session.
- :latest IMAGE-RACE on any deploy: pin the SHA; confirm the build-and-push for that SHA COMPLETED first; curl the NEW route to confirm the right image (it bit cortex TWICE this session).
- CLOUD RUN TRAFFIC-TRAP: a deploy makes a new revision but prod serves OLD until explicit shift-traffic; the deploy does NOT migrate (run-migrations is a SEPARATE workflow_dispatch action) and does NOT shift traffic. describe/list API caches stale traffic — trust BASE-URL behavior.
- MIGRATION-MERGED != APPLIED: a merged migration is not on the live Neon until run-migrations. (Bit the county-ledger endpoint this session — 500 until migrated.)
- PERSISTED != RECOMPUTE (R10): a re-warm that promotes correct VALUES but reuses stale ROLES/ring/envelope is the recurring defect — always --force-repromote (R28/R30).
- BACKGROUND-AGENT DISPATCH: a first "running in the background, I'll report back" notification is PREMATURE STATUS, not an orphan — the agent is often still working; do NOT conclude failure + rebuild (burned 335k tokens this session). Distinguish orphan-vs-slow by checking over TIME. NEVER run two dispatches of the same task list on the same repo/main concurrently. For HEAVY multi-step builds, background general-purpose dispatch is unreliable — do them DIRECTLY or with a strict "deliverable = pushed branch+PR, do it NOW" contract.
- SHARED-CLONE HAZARD: product-repo clones have active worktrees; work in ISOLATED fresh clones/worktrees, stage explicit paths, check git log -3 before committing.
- AREA-SWEEP NOT SAMPLE (R3): sampling certified a broken Bastrop before. Grade what RENDERS in the block, fail-closed on any gap.
- CORNER-SIDE "–": for GC/MU the answer-key "–" means the record carries no distinct corner value (sideCorner := interior), NOT a gap; SF-1 corner lots DO carry corner 15 in the SideSetback text — cert must assert it (R2).

## 9. DELIVERABLES
- Cost re-measure (150-cohort) vs the $200 gate.
- Per district block: warm+promote count, mechanical area-sweep result (per-parcel per-gate), the PDD/null honest-decline count, raw evidence.
- The CC County Ledger showing 48021 onboarded/coverage/cert-state populated.
- ONE final report: "Bastrop city ready for operator R6" + per-block sweep evidence + any block that hit a wall (the rebuild trigger). NO "certified" claim — that's the operator's after R6.

## 10. STANDING DECISIONS (travel with every sub-dispatch — paste them)
Verification never delegated (grade live truth, not reports). Deploys/warms planner-owned. Anti-fabrication + honest-absence (OPS-7): never fabricate, never silent-degrade, honest-decline gracefully. No-special-data-access (uniform public record; the path must work for a no-relationship jurisdiction). Cloud Run traffic-trap + :latest-race + migration-not-applied + persisted!=recompute all in play. Area-sweep not sample. Both cert gates (mechanical + operator R6). Block-13 QUARANTINED. No timeframe estimates. Paste raw command/probe output when reporting tool/live state. If a wall the recipe can't clear appears, STOP + report (rebuild trigger), never improvise.

## 11. THE PHASE C → D DELIVERABLE — the generic self-guarding onboard(fips) command
The operator's north star: "turn on the factory and have an agent operate it without carefully relaying the recipe." Today that is NOT possible — the recipe is prose that must be interpreted. Phase C is how we END that. As you run Bastrop by hand, PRODUCE A SPEC (a doc, not a build yet — the build is Phase D) for a generic `onboard(county_fips)` entrypoint that makes the factory self-guarding. Capture, per recipe step, whether it is TODAY:
- MECHANISM (already self-enforces — e.g. R13 fail-closed on repealed edition, R7 district-default at bake, R32 measured cert): these carry over generically as-is.
- PROSE-INTERPRETED (an agent must currently read + apply — e.g. "use --force-repromote", "PDD honest-declines not fails", "cohort by district block not lexical", "extend the cert roster", "corner-side nuance"): these are the AMBIGUITY. Each must become a mechanism or a frozen config the command reads.
The target shape of `onboard(fips)` (the Phase D build): reads the FROZEN registry row (OPS-1) → stages the source (OPS-2 acquire) → runs the deterministic warm line with --force-repromote by default → runs the generic cert (a GENERALIZED block13-cert-grade that takes a roster, not a hardcoded 7) → FAILS CLOSED on any recipe-invariant violation (edition-currency, owner-match, geometry validity, cert per-gate) → writes the performance ledger → surfaces in CC → HALTS for operator R6. An agent then runs `onboard(48091)` with ZERO recipe knowledge; the mechanism enforces the recipe. THAT is the un-ambiguous factory. Deliverable of Phase C = Bastrop warmed + this spec (the extracted mechanism-vs-prose map + the onboard(fips) contract). Two current Bastrop-specificities to generalize explicitly: (a) depth-warm-bastrop-batch.mjs is Bastrop-hardcoded → generic warm keyed on the registry row; (b) block13-cert-grade.mjs is a hardcoded 7-parcel roster → generic cert takes the jurisdiction's rendered roster. Note these as the two concrete refactors Phase D must do.
