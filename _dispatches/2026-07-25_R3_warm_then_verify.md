---
id: 2026-07-25_R3_warm_then_verify
title: Dispatch — R3 warm-then-verify loop
status: closed
date: 2026-07-25
applies_to: [hauska-engine, hauska-map]
planner: depth-engine planning agent
cites:
  - 27c WDLL 6 (THE WARM-THEN-VERIFY LOOP)
  - 27c WDLL 8 (READ-PATH IS WARM)
depends_on: R0–R2 code on serving (geometry, road nodes, road-class setbacks)
---

# R3 — Warm-then-verify loop

## Context

R0–R2 are on serving paths (cortex geometry + spine zoning; retrieval road nodes; road-class setback tables). R3 makes the warm/verify/promote loop mechanical: background warm writes candidates; second agent verifies mechanically (geometry gate + classification-vs-source + right-edge/right-distance); only passing results promote to durable ledger. Customer read must not cold-rederive a warm parcel.

## FLEET MEMORY (M0)

Capture LESSON / DEAD-END / GROUND-TRUTH / OPEN in close. Read `_scratch/depth-engine-27c.md` FIRST. Do not self-promote.

## Scratch

```
GROUND-TRUTH: R0 cortex 00440-fav; R1 retrieval 00029-jaj; WDLL 3 MET; WDLL 4 PARTIAL (fixture alley ok, live alley OPEN).
LESSON: verify must be mechanical gates, never second-agent re-assertion (scan-fix lesson).
```

## Acceptance

**WDLL 6:** Background warm agent computes roads + road-type setbacks + envelope (+ site plan if already wired) ahead of demand; second agent verifies MECHANICALLY; only pass promotes. Demonstrate gate rejecting a bad warm result.

**WDLL 8:** Customer opening a warmed Bastrop parcel gets envelope/roads/setbacks from promoted ledger, NOT live re-compute. Prove no cold derive on a warm parcel.

## Scope

1. Warm writer (batch/script/job) over Bastrop parcels with zoning-facts — depth-over-breadth, not parcel discovery.
2. Mechanical verify agent: geometryCorrectnessGate + road class vs OSM/source + setback edge/distance checks; fail closed.
3. Promotion write to durable atoms / facets path the PE read uses.
4. Read-path: PE/cortex prefer promoted warm result when present; skip cold derive (or prove it does not fire).
5. Demo: inject/known-bad warm → verify rejects; good warm → promote → read.

## Out of scope

R4 full Bastrop cost gate; Central-TX depth; inventing alley values; non-road infra.

## Done when

PR(s) green; planner live-proves reject-bad + warm-read on a named Bastrop parcel. Do not merge until planner says go.
