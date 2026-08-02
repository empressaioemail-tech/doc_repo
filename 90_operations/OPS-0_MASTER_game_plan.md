---
id: OPS-0_MASTER_game_plan
title: OPS-0 — MASTER Game Plan (build the foundation → run Bastrop through the factory; the autonomous-run charter)
date: 2026-08-02
status: master plan (the build sequence + the autonomous-run charter + the human-gate line)
owner: nick
related: [OPS-1_texas_source_registry, OPS-2_county_onboarding_runbook, OPS-3_engine_contract_determinism_register, OPS-4_rewarm_protocol, OPS-5_cert_standard, OPS-6_command_center_engine_console, OPS-7_coverage_and_honesty_doctrine, 2026-08-02_foundation_ground_truth_ACCEPTED, 2026-08-02_bastrop_recipe_ACCEPTED]
---

# OPS-0 — MASTER Game Plan

## THE GOAL
Build the foundation (close the 4+ load-bearing gaps the E2E found), then run Bastrop city through the factory as the first proof of the production line — stopping at "mechanically swept + served + visible in CC, awaiting operator R6." The operator returns to do visual R6 QA in CC when Bastrop finishes.

## THE MASTER PLANNER MODEL (how this runs)
The planning/coordination agent (this seat) is the MASTER planner: plans, coordinates, VERIFIES (verification never delegated), and holds merge/deploy/traffic authority. It dispatches MECHANICAL execution to cost-effective models (Sonnet/Haiku for build lanes; the planner reviews every hand-back against live state). This is the factory-operator model applied to the build itself: the planner operates; the executors do the deterministic work; the planner freezes nothing until it's verified.

## THE BUILD SEQUENCE (dependency-ordered; each phase gates the next)

### PHASE A — FOUNDATION GAP-CLOSURE (build; the 4 top gaps + enablers)
Ordered by dependency (each is a dispatched build lane, planner-verified on green + live probe):
A1. MEMORY REACH (gap #1, R-FND-7) — install `.cursor/rules/fleet-memory.mdc` in every product repo (hauska-engine, hauska-map, legacy-design-tools, smartcity-os, hauska-mcp-server); make the dispatch template embed standing-decisions + scratch by default. THE factory's capture-freeze organ; do FIRST so all downstream lanes inherit durable memory. (OPS-3 gap #1.)
A2. CERT REPRODUCIBLE (gap #2) — merge `chore/block13-cert-grade-script` → main (verify it grades Block-13 7/7 from main first). (OPS-5 gap #2.)
A3. RECIPE-VERSION FIELD (gap #3, R-FND-5) — add `recipe_version` to the promote path + atom schema + served facets. The rewarm trigger. (OPS-4 gap #3.)
A4. REGISTRY-AS-ENGINE-INPUT (gap #4, R-FND-2) — commit the TxGIO 254-county matrix + adapter registry into `_land_records/` as the frozen registry artifact; build the engine-core loader that reads a jurisdiction's frozen registry row (starting Rail C + Bastrop's row). (OPS-1 gap #4.)
A5. R7 AT BAKE (gap #6) — close R7 district-default-for-role at `boundary-primitive/compute.ts:104` OR mandate the R28/R30 re-warm path for every onboarding warm (OPS-2 stage 3 already mandates the latter as the interim). (OPS-2/3.)
A6. DETERMINISM LEAKS (OPS-3 I2/I3) — exclude timestamps from atom content-hash (I2); confirm warm reads the staged vintaged snapshot not a live fetch (I3). Enables true rewarm-determinism.
A7. PERFORMANCE LEDGER (gap #7, R-FND-6) — extend county_facet_coverage with recipe_version, cert_state, staleness, rewarm_unsafe, cost, last_rewarm/refresh, done-flag. (OPS-4 gap #7.)
GATE A: all lanes merged + planner-verified live. Determinism invariants (OPS-3 I1-I7) hold. THEN Phase B.

### PHASE B — CC FACTORY FLOOR (build; the operator's surface, gap #5)
B1. Wire the CC county-ledger panel (reads the extended performance ledger) + engine-state panel (Resolver/Autonomous Engines, from the OPS-3 register + spine-health probe) + freeze/memory-state + the CERT/R6 VIEW (where the operator does R6). (OPS-6 gap #5.)
GATE B: CC shows per-county engine + cert + freeze + recipe state live; the cert/R6 view renders a swept area. THEN Bastrop can run AND be watched.

### PHASE C — BASTROP CITY THROUGH THE FACTORY (run the line; OPS-2)
C1. Freeze Bastrop's registry row (TxGIO 48021 staged + layer-23 + BDC currency). Block-13 stays QUARANTINED (not re-run).
C2. Re-measure warm cost on a 150-parcel Bastrop city cohort (--city-cohort, --force-repromote, layer-23 fetch) vs the $200 gate.
C3. Run the OPS-2 line district-block by district-block (SF-1 → GC → MU → RR → PI → IND): acquire (staged) → currency+owner-match → warm → inset → promote → mechanical area-sweep cert (R32 + convergence + R9/R10/R13). PDD (28%) + null → graceful honest-decline (S-10).
C4. Each block: mechanical sweep PASS → surfaced in the CC cert/R6 view. FAIL → planner fixes root cause, re-sweeps the whole block (never sample).
GATE C (THE STOP LINE — where autonomous ends): Bastrop city is MECHANICALLY SWEPT + SERVED on prod PE + VISIBLE in CC's cert/R6 view, per district block, with PDD honest-declines and coverage-honest banners (OPS-7). The county ledger shows Bastrop city's state.

### PHASE D — OPERATOR R6 (human gate; NOT autonomous)
The operator returns and does visual R6 QA in the CC cert view, block by block. "Bastrop city CERTIFIED" is claimed only after operator R6 passes (OPS-5 gate 2). This is the human gate the autonomous run stops before.

## THE AUTONOMOUS-RUN CHARTER (what runs without the operator; the honest boundary)
RUNS AUTONOMOUSLY (planner-coordinated, mechanical, every step gated): Phases A, B, C — foundation build, CC factory floor, Bastrop city mechanical warm + sweep + serve + CC-surface.
The planner WILL, autonomously: dispatch build lanes to cost-effective models; verify every hand-back against live state (never on the executor's word); merge PRs on green CI (verify head SHA); deploy (Cloud Run canary / Vercel / cloud-build, SHA-pinned, traffic-trap-aware); write ~4,877 real atoms to prod substrate via the mechanical warm line; run the mechanical cert sweep.
STOPS AT (the human gate): operator R6 visual QA (Phase D). The autonomous run does NOT claim "certified" — it stops at "mechanically swept + served + visible, awaiting your R6." That is the correct stopping line given R6 is a required, human, non-automatable cert gate.
GUARDRAILS (the planner enforces): every merge on green CI + head-SHA verify; every deploy SHA-pinned + serving-revision-verified (no :latest race, no traffic-trap); every warm block area-swept (never sampled) before the next; anti-fabrication + honest-absence (OPS-7) throughout; a failing gate STOPS that lane and the planner fixes root cause, never forces past; Block-13 QUARANTINED (never re-run); deploys planner-owned; if a lane hits a wall the recipe can't clear, the planner STOPS and reports (the rebuild trigger), does not improvise past it.
IS THIS REASONABLE TO RUN FROM ONE CHAT? Yes, with the stop-line at R6 — because every step is either mechanical or has a hard mechanical gate, verification stays on the planner, and the irreversible/outward-facing actions (prod writes, deploys) are bounded by CI-green + live-verify + honest-absence and stop before the human cert claim. The one thing it CANNOT do is the R6 human judgment — which is exactly what the operator returns for.

## SEQUENCING NOTES
- Phase A1 (memory reach) FIRST so every downstream executor has durable memory (or the fan-out lessons drift — the exact failure this program exists to kill).
- Phases A lanes are largely parallel EXCEPT A2 (cert) and A5 (R7) touch the engine and should serialize against A4 (registry loader) to avoid engine-repo collision; the planner sequences.
- Phase B (CC) can start once A3 (recipe-version) + A7 (ledger) land (it reads them).
- Phase C (Bastrop) requires ALL of A + B (it uses the registry, the cert script, recipe-version, the re-warm path, and the CC surface).

## WHAT THE OPERATOR OWNS (nothing else blocks the autonomous run if these are settled)
Confirmed settled this session: the recipe (accepted), the frame (R-FND-1..7), the mechanical/agent boundary, TxGIO as Rail C, the stop-at-R6 line. Operator returns for: R6 visual QA on Bastrop (Phase D); then the go for the fan (per-county replication of the OPS-2 line). The doc-reconciliation pass (HELD) is a parallel planner task, not a blocker for the Bastrop run.
