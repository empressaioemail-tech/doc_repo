---
id: 2026-07-25_depth_engine_planning_agent_handoff
title: HANDOFF — planning agent to execute the depth-engine build (M0 → R0-R4)
status: dispatch
date: 2026-07-25
owner: nick
governs: 27_MASTER_WDLL_spine_completion_and_depth_engine
target: a planning agent (Cursor/Claude) that plans, dispatches executors, and verifies — does NOT execute build code itself
---

# HANDOFF — depth-engine build (M0 → R0-R4)

You are the PLANNING agent for the depth-engine program. Your job is to plan each sprint, dispatch executor agents, and VERIFY their deliverables against LIVE state. You do not write build code yourself and you never delegate verification. Autonomy in this program comes from the GATES failing closed at every seam, not from trusting an executor's report. The fleet memory (M0) makes executors smarter; the gates make the build safe to leave running. Do not confuse the two.

## Read first (in this order)

1. `27_MASTER_WDLL_spine_completion_and_depth_engine.md` — the umbrella, the nested done-line, the sequence, M0 as sprint zero.
2. `27c_road_node_engine_and_warm_digital_twin_spec.md` — the active build: the code diagnosis, road-as-node keystone, road-type setbacks, warm-verify loop, Bastrop cost gate, digital-twin constraint. Acceptance items 1-9 and sprint shape R0-R4.
3. `27a_jurisdiction_factory_engine_spec.md` — the engine contract you are deepening (G1-G8 guardrails, the seven engines, the anti-zombie line).
4. `90_runbooks/fleet_memory_practice.md` — M0. You OPERATE this: you own the planner-gated promotion of scratch lessons to durable memory.
5. `_scratch/depth-engine-27c.md` — the live scratch file, already seeded with this session's geometry lessons, ground-truths, dead-ends, and open threads. READ IT FIRST every time you pick up the workstream. This is the whole point of M0 — you start warm.

## The prime directive: gates make it autonomous, not trust

Every sprint deliverable is graded PASS / PARTIAL(criteria) / FAIL against LIVE state, evidence pasted verbatim — a live query or a live probe, never an executor's summary. The 3-day scan-fix loop happened because a chain of agents each trusted the last one's green checkmark. You break that chain by verifying every seam yourself against live state. A background run is trustable because the gates catch drift automatically, not because anyone watched.

## Sequence (dependency-ordered, no time estimates)

M0 is DONE and installed (this session). Your first act is not to build M0 — it exists. Your first act is to USE it: read the scratch file, then plan R0.

R0 — GEOMETRY TRUTH (start here). Replace the naive per-edge miter (ldt `artifacts/api-server/src/lib/buildableEnvelope/geometry.ts` insetProjected) with a real polygon-offset; build the geometry-correctness gate + concave/corner/714-Spring fixtures; verify live on four lot shapes (714 Spring 48021:33512 + a rectangular + a corner + an irregular Bastrop lot). Satisfies 27c WDLL 1, 2, 5 and dogfoods M0 (M0.2/M0.3 — R0's lessons are the first promotions).
- FIRST OPEN THREAD from scratch: pick the polygon-offset library (jsts bufferOp / martinez / polygon-clipping) against the ldt dependency tree AND the esbuild-conditions constraint (DEAD-END in scratch: conditions must stay ["workspace"] or the container boot-crashes). This choice is R0's first gate.
- The geometry gate must FAIL LOUDLY on a known-bad ring — demonstrate it going red — and wire into the F1c smoke-test family so envelope geometry cannot silently regress.

R1 — THE ROAD NODE. Promote roads to first-class spine nodes (identity, centerline, edges, ROW, classification, provenance, attach points), digital-twin-ready, NO non-road infra, on the ONE spine substrate, tallying in the CC ledger. Satisfies 27c WDLL 3.

R2 — ROAD-TYPE-AWARE SETBACKS. Index the descriptor setback table by (road-class, edge-role) + an assumed-ROW-width table; RULE engine resolves from road class; verify street-vs-alley divergence on Bastrop. Depends on R1. Satisfies 27c WDLL 4.

R3 — THE WARM-THEN-VERIFY LOOP. Background warm agent + mechanical verify agent + promotion gate over R0-R2. The parcel-memory analogue of M0. The verify agent checks MECHANICALLY (geometry gate + classification-vs-source-and-hierarchy + right-edge/right-distance), never re-asserts agreement. Depends on R0-R2. Satisfies 27c WDLL 6, 8.

R4 — BASTROP WARM + DEPTH-COST GATE. Run the loop across Bastrop city + county; drive the depth ratio (verified-envelope / zoning-fact) toward full; MEASURE real depth-cost per parcel vs commitment #3 ($200 + 1hr/jurisdiction); the number decides eager-Central-TX. Cost pasted, not estimated. Depends on R3. Satisfies 27c WDLL 7, 9.

Central-TX depth is AFTER R4, gated on the cost decision + the non-TX golden-descriptor test. Do not open it.

## How to run each sprint (the loop)

1. Read `_scratch/depth-engine-27c.md` — start warm, do not re-derive.
2. Plan the sprint; write it as a dispatchable contract citing the exact 27c/M0 acceptance items it satisfies.
3. Dispatch executor(s) — FEWER agents, TIGHTER contracts. Embed the M0 cc-agent rule block (in the runbook) in every dispatch so executors capture scratch entries and return them in their close. Embed the relevant scratch context so they start warm.
4. VERIFY the deliverable yourself against LIVE state — paste the live query/probe. Grade the cited items. A grade that isn't a live observation is not a grade.
5. Promote: lift verified LESSONs from the returned scratch into durable form — PREFER a mechanical guard (a test) over prose. This is planner-gated; executors do not self-promote.
6. Amend the WDLL if scope changed (one-line reason, never silent).
7. Update `_scratch/depth-engine-27c.md` with new ground-truths, dead-ends, open threads before you hand context on or hit your ceiling. FLUSH before compaction.

## Standing hazards (from fleet memory — do not re-hit)

- Cloud Run traffic-trap: on any cortex/engine redeploy check the SERVING revision; `gcloud run deploy --source=.` from repo root builds the WRONG service (the export-gate agent hit this same day). Rebuild via the service's own cloudbuild yaml, canary, shift.
- ldt esbuild conditions must stay ["workspace"] — adding the polygon-offset dep must not broaden them.
- Merge only on green CI (PR checks, not local runs — envs differ).
- doc_repo is a shared clone — check `git log -1` right before committing, stage explicit paths, commit promptly.
- Bastrop gets NO special data path — uniform public-record sourcing only.
- Anti-fabrication: an envelope or road you cannot compute/classify correctly declines honestly (approximate/pending), never draws a confident wrong shape.

## What you own vs what routes to the operator

You own: planning, dispatching, verifying, grading, scratch capture, planner-gated promotion, WDLL amendments, sprint sequencing within the approved program.
Routes to operator (Nick): the R4 depth-cost decision (eager-Central-TX go/no-go against commitment #3); any hard-kill trigger; opening Central-TX depth; anything that changes the master done-line. Give a recommendation with the number, not a punt.

## Report cadence

Per sprint: a check-in filed to `_inbox/` with the graded acceptance items (live evidence pasted) and the updated scratch state. The operator + planner grade against live Neon / live probes, not the bake summary. You can run R0→R4 autonomously WITHIN the gates; you stop and surface at the operator-routed decisions above.
