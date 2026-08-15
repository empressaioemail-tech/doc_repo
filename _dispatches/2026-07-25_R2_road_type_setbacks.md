---
id: 2026-07-25_R2_road_type_setbacks
title: Dispatch — R2 road-type-aware setbacks
status: active
date: 2026-07-25
applies_to: [hauska-engine, legacy-design-tools]
planner: depth-engine planning agent
cites:
  - 27c WDLL 4 (ROAD-TYPE-AWARE SETBACKS)
depends_on: R1 closed (WDLL 3 MET — road nodes live)
---

# R2 — Road-type-aware setbacks

## Context

R1 closed: Spring Street `48021:road:123456789` tallies and inspects live. Descriptors still carry a FLAT setbackTable. RULE engine must resolve setback from (road-class, edge-role). v1 assumed-ROW-width table drives edge origin with approximate provenance.

## FLEET MEMORY (M0)

Capture LESSON / DEAD-END / GROUND-TRUTH (timestamped) / OPEN in close. Read `_scratch/depth-engine-27c.md` FIRST. Do not self-promote.

## Scratch (start warm)

```
GROUND-TRUTH (2026-07-25): WDLL 3 MET; retrieval 00029-jaj; road 48021:road:123456789 Spring Street residential.
LESSON: descriptors today flat setbackTable — need (road-class, edge-role) index.
LESSON: v1 ROW assumed-per-class; provenance approximate-assumed-per-class.
```

## Acceptance (27c WDLL 4)

Descriptor setback table indexed by (road-class, edge-role); RULE engine resolves jurisdiction-agnostic. Verified on Bastrop parcels where street-frontage and alley/rear produce DIFFERENT, correctly-cited setbacks. Assumed-ROW-width table drives edge origin with approximate provenance.

## Scope

1. Extend Bastrop (and fixture) descriptor: setback table by (road-class, edge-role) + assumed-ROW-width table.
2. RULE / derive path: resolve setback from classified road node + edge role (not untyped default).
3. Wire ldt edgeLabeling / derive to consume road-node classification when present (fallback honest).
4. Test: street vs alley divergence on Bastrop fixture/live parcel.

## Out of scope

R3 warm loop, R4 cost, non-road infra, reopening R0/R1 geometry.

## Done when

PR(s) green CI; planner verifies live street-vs-alley setback divergence (or fixture + live probe). Do not merge until planner says go.
