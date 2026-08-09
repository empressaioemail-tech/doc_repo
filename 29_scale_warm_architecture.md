---
id: 29_scale_warm_architecture
title: The scale-warm architecture — parallel, re-warm-safe county processing for the national fan-out
last_updated: 2026-08-09
status: superseded
owner: nick
related: [28_THE_BASTROP_MOLD_engine_build_spec, 27d_county_onboarding_recipe_and_fleet_reliability, 27a_jurisdiction_factory_engine_spec, _STATE.md, 2026-07-26_base_layer_connecting_tissue_thesis_and_tracks]
purpose: The fan-out is not primarily an "onboard new counties" engine — it is a "process counties in PARALLEL at SCALE, safely, repeatedly" engine. This spec is the compute + data architecture that makes national feasible in weeks not years, and makes RE-WARM (regenerating everything after an engine improvement) a first-class, live-data-safe operation.
---

# The scale-warm architecture

> **2026-08-09: superseded as plan of record** by the CASCADE KEYSPACE SHARDING section of `90_runbooks/factory_onboarding_runbook.md`, `90_operations/T5_factory_throughput_track.md`, and `90_operations/OPS-4_rewarm_protocol.md`, per `_decisions/2026-08-09_factory_spec_precedence_ruling.md`. The shipped throughput mechanism is keyspace sharding writing direct to serving, not the isolated-regenerate-then-swap model below; that model remains the unbuilt alternative to re-open if re-warm-against-live ever proves unsafe.

## The problem, diagnosed from current code

The warm pipeline is SERIAL at two levels and writes to ONE shared DB — the three things that make it "take forever":
1. WITHIN a county: `bake-property-atom-county.mjs` runs on ONE machine (Cloud Build `E2_HIGHCPU_8`, 2h timeout), batching parcels 200 at a time. Bexar (~700k parcels) on one 8-CPU box is the acute pain.
2. ACROSS counties: `bake-property-atom-metro.mjs` is EXPLICITLY SEQUENTIAL — its own header says "Sequential metro bake driver... for (const fips of COUNTIES) { await runCounty(fips) }". 10 counties one-after-another; 254 would be untenable.
3. WRITE TARGET: every county writes to ONE serving Neon (`hauska_mcp`) — so even parallel compute would serialize on write contention (connections, locks, throughput).

The RE-WARM reality (the operator's acute pain): the pain wasn't initial onboarding — it was RE-WARMING Bastrop after a setback structural change, which took forever. Improving the engine means RE-PROCESSING everything already done. Re-warm is FOREVER — every future engine improvement re-warms the whole footprint. So the architecture must make re-warm a first-class, live-data-safe, parallel operation, not a serial migration that risks the live app.

## The core insight
Counties are EMBARRASSINGLY PARALLEL — each is independent (Bexar's warm doesn't depend on Travis's). So scale is not an algorithm problem; it's an ORCHESTRATION + WRITE-CONTENTION problem. Fan the independent work; solve the shared-write; gate before going live.

## THE ARCHITECTURE — four levers

### Lever 1 — FAN counties as parallel jobs (retire the sequential loop)
The unit of parallelism is the COUNTY (shard the giants — Lever 2). Replace the sequential `for` driver with an ORCHESTRATOR that launches N concurrent jobs (Cloud Run Jobs with parallelism, or a work-queue + Cloud Build triggers) draining a county work-queue, up to a concurrency cap. 254 counties at concurrency 30 = ~9 waves, not 254 serial runs.

### Lever 2 — SHARD the giant counties
Bexar (700k) / Travis (380k) on one machine are the long pole even under parallel-county. The bake ALREADY takes `--offset`/`--limit` — that IS the sharding primitive. A giant county splits into K shards (offset windows), each a concurrent job. "Bexar" becomes "7 Bexar-shards in parallel." Shard size tuned so each shard fits one machine's timeout comfortably.

### Lever 3 — ISOLATED-REGENERATE-THEN-SWAP (the re-warm-safe write model; the operator's "temp databases" instinct, done right)
The write-contention + re-warm-safety solution. Each county/shard writes to its OWN ISOLATED store (a temporary DB, or its own schema/partition) — NOT the live serving DB. Counties never contend. Then:
1. REGENERATE: each county/shard warms into its isolated store, in parallel, never touching live serving data.
2. VERIFY (Lever 4 gate): the isolated result must pass the mechanical gates before it's allowed near serving.
3. SWAP/MERGE: verified county atoms are ATOMICALLY swapped/bulk-merged into the serving DB (partition swap, or bulk upsert of a verified set).
Why this over write-direct-to-serving: (a) zero write contention during warm; (b) RE-WARM NEVER RISKS LIVE DATA — you regenerate a county in isolation, verify, then swap; if a re-warm is wrong, the live data was never touched and nothing swaps; (c) atomic — a county goes live all-at-once (verified) or not at all, never half-warmed-in-serving (the exact partial-state that caused past drift).
The serving DB itself should be PARTITIONED BY FIPS (plural-stores-singular-truth: partition the one truth, don't fragment it) so a swap is a partition-level operation, not a global lock.

### Lever 4 — THE VERIFY GATE BEFORE SWAP (why the phantom gates are a prerequisite)
A regenerated county does NOT swap into serving until it passes mechanical gates:
- SMOKE (recipe gate 8): click N known parcels through the isolated result — atoms render, chain resolves. Fails closed.
- TALLY + COST (recipe gate 7): live SELECT of the depth ratio + honest-absence + measured cost vs commitment #3.
- Plus the existing per-parcel gates (geometry, front-labeling, verify).
THIS IS WHY building phantom gates 7+8 as MECHANICAL is a scale-warm PREREQUISITE, not a separate task — "verify each isolated regeneration before swap" IS those gates. Without a real smoke/tally gate, scale-warm swaps unverified counties into serving = the scan-fix trap at national scale. The gate is the safety valve inside the swap.

## THE ORCHESTRATOR (how it's driven — ties to Command Center)
Above the four levers: an orchestrator holding the county/shard WORK QUEUE, launching up to a concurrency cap, tracking each job (queued/running/verified/swapped/failed + cost), retrying failures, reporting a live tally. Driven from COMMAND CENTER: "re-warm all of TX" / "onboard these counties" → the orchestrator fans isolated jobs → operator watches the tally (which counties warmed, verified, swapped, cost so far) → verified counties swap in as they clear. This is the "start county X" surface at STATE/NATION scale, and it's the CC engine-panel work made real. M0-reach hardening (standing decisions travel in the job dispatch) so lane jobs run correctly unattended.

## RE-WARM as a first-class operation (the durable capability)
Re-warm = fan isolated regenerations of already-done counties → verify each → bulk-swap. Because it's isolated, a re-warm of all-of-TX runs in parallel WITHOUT disrupting the live app; counties swap in as verified. This is the operation the operator will run on EVERY engine improvement (like the setback change forced). Build it once; it pays off on every future change. The alternative (serial re-warm against live serving) is what "took forever" and risks the live data — retired.

## COST / WALL-CLOCK KNOBS (the tradeoffs to tune)
- CONCURRENCY CAP: N parallel jobs. Higher = faster wall-clock, higher peak compute cost + more temp-DB instances. Tune against commitment #3 ($200 compute/jurisdiction) and the wall-clock target. (Recall Bastrop depth cost was ~$0.24-5/county — compute is cheap; the cap is bounded by infra/quota, not $.)
- SHARD SIZE: parcels/shard for the giants — smaller = more parallel jobs, more overhead; larger = fewer jobs risking timeout.
- TEMP-STORE LIFECYCLE: spin up isolated stores per wave, tear down after swap (cost control) vs persistent isolated schemas.

## OPEN DESIGN DECISIONS (to refine)
1. ISOLATED STORE = temp Neon instances (real separate DBs, spin-up/tear-down) vs isolated SCHEMAS/partitions in one big DB vs object-storage staging then bulk-load? (Temp DBs = cleanest isolation, most infra; schemas = cheaper, shared instance limits; staging = cheapest compute, a load step.)
2. SWAP MECHANISM = FIPS partition-swap (needs partitioned serving schema) vs verified bulk-upsert vs blue-green county tables. Atomicity is the requirement.
3. CONCURRENCY CAP + shard size — the cost/wall-clock tune (needs a real per-county cost+time measurement to set; Bastrop/Caldwell give a baseline).
4. ORCHESTRATOR = Cloud Run Jobs (native parallelism, task-index sharding) vs a queue (Pub/Sub) + Cloud Build triggers vs a workflow engine. Cloud Run Jobs is likely the cleanest (built for parallel task fan-out).
5. Does the giant-county SHARD need cross-shard reconciliation (e.g. boundary adjacency across a shard edge)? Adjacency is county-scoped (cell-grid+PIP over the whole county) — sharding the WARM must not break adjacency; likely adjacency computes county-whole first, then parcel-warm shards. VERIFY.

## PREREQUISITES (from the mold + this spec)
- Phantom gates 7 (tally+cost) + 8 (smoke) MECHANICAL — the verify-before-swap gate. HARD prerequisite.
- M0-reach hardened — lane jobs start warm, standing decisions in the dispatch.
- A per-county cost+time baseline (from Bastrop/Caldwell) to set the concurrency/shard knobs.
- (Gated on) Bastrop CERTIFIED clean+done — you only mass-replicate a certified mold.

## THE ONE-LINE
Fan independent counties (shard the giants) as parallel isolated regenerations → verify each mechanically → atomically swap verified counties into a FIPS-partitioned serving DB → orchestrated + watched from Command Center. Re-warm-safe (never touches live), parallel (weeks not years), gated (never swaps an unverified county). Build once; run on every engine improvement forever.
