---
id: 2026-07-26_S2U3_offset_consumes_primitive
title: Dispatch — Stage 2 Unit 3 — offset consumes boundary primitive
status: active
date: 2026-07-26
applies_to: [hauska-engine]
owner: nick
planner: depth-engine planning agent (doc_repo)
governs_wdll: [27f_bastrop_through_v2_program]
cites:
  - 27f WDLL 6 (offset consumes primitive; 28286-class cannot recur; labeling = adjacency-FACT)
  - 27f WDLL 4/5 (depends on Unit 2)
  - M0.2 / M0.3 (new fixtures are the promotion)
depends_on:
  - 2026-07-26_S2U2_boundary_primitive (merged + planner-verified)
  - 2026-07-26_S2U1_streets_surveyed_2016_ingest (preferred for re-promote; tolerate OSM-fallback if blocked)
related:
  - _scratch/depth-engine-27c.md
  - _inbox/2026-07-26_PATCH_A_checkin.md
---

# S2-U3 — Offset consumes the primitive (orientation-invariant by construction)

You are the EXECUTOR for Stage 2 Unit 3. **Do not start until Unit 2 is merged and the planner has pasted live verify on 28286/34785/33512.** Build in `P:\hauska-engine`. PR on green CI. Close with evidence + scratch. Planner verifies LIVE. Do NOT self-promote memory.

## FLEET MEMORY (M0) — paste-enforced

Capture LESSON / DEAD-END / GROUND-TRUTH (timestamped) / OPEN in your close. Read scratch FIRST. Do not promote yourself. Flush before roll.

## Scratch context (start warm — DO NOT RE-DERIVE)

```
WHY THIS UNIT EXISTS:
The system re-derived inside/inward + role per edge from road-proximity PROXY → recurring class
(714 Spring miter, 1009 Chestnut, 28286 edge-index degeneracy, FIX 2.1 wrong-front).
Decision: offset CONSUMES stored interior + per-line rule from the boundary primitive.

28286-CLASS (must become impossible):
GROUND-TRUTH (GUARD): insetRingMeters on edge2 produced correct ~7316 sqft; ringHasSelfTouch
  false-rejected. PATCH-A fixed clip cleanup. Primitive makes orientation irrelevant:
  shrink stored interior by each line's stored setback — no per-edge inward guess.
LESSON: do NOT weaken ringHasSelfTouch genuine-self-touch negative fixture.

LABELING = ADJACENCY FACT:
Role/setback come from persisted boundary adjacency (ROW / neighbor / alley / unmapped),
not from re-running proximity proxy as the source of truth. Proxy may still HELP attach
roads during Unit 2 ingest; at OFFSET time the primitive is authoritative.
Unmapped → honest decline / zero setback for that edge — NEVER fabricate feet.

PROMOTE BASELINE (before/after owed):
GROUND-TRUTH (PATCH-A): depth_warm **3538**/3657 = **96.75%**; residual 110 no-road / 6 geom-empty.
Authoritative roads (Unit 1) may recover some of the 110 — paste before/after.
Central-TX HELD regardless of ratio.

PRE-2: adjacency persist uses one-load + cell-grid + PIP. Do not recompute adjacency on every
offset read — READ the stored edges.
```

## What to build

1. **Rewire depth-warm path** (`warm-compute` / `insetPerEdge` call sites / edge labeling consumers):
   - When boundary atoms exist for a parcel: build `insetFeet[]` + orientation from **stored** per-line setbacks + stored interior/inward.
   - Do **not** re-derive inward normals from scratch when the primitive is present.
   - If primitive missing: fail closed or explicit legacy fallback flagged in provenance — prefer fail-closed for place-type warm once cohort is baked; document choice.
2. **Labeling**: warm edge roles for promote/verify read adjacency-FACT from primitive (ROW/neighbor/alley/unmapped), not proximity-proxy as authority.
3. **Mechanical guards (MUST land — these are M0 promotions)**:
   - **NEW**: fixture asserting offset READS the primitive (spy/inject stored interior+rules; assert code path does not call the old per-edge inward re-derive when primitive present).
   - **NEW**: fixture asserting unmapped edge declines honestly (no fabricated feet; empty or zero on that edge per product rule — match descriptor honesty).
   - **KEEP**: genuine-self-touch negative fixture (still rejects).
   - **KEEP**: geometry positive-space + front-labeling gates GREEN.
4. **Re-promote** place-type cohort (`--place-type-cohort --city-cohort --promote` or full place-type pass). Paste tally before/after. Expect ≥96.75% or honest improvement (no-road may drop if Unit 1 county roads landed).

## Acceptance (cite in PR + close)

| # | WDLL / gate | Observable |
|---|-------------|------------|
| U3.1 | 27f WDLL 6 | Live warm on 28286 front@edge2 (or primitive-driven equivalent) produces ~7316 sqft / non-empty; orientation-invariant proof in test |
| U3.2 | Fixture | Test proves offset reads primitive (does not re-derive interior/inward when present) |
| U3.3 | Fixture | Unmapped edge honest decline |
| U3.4 | Fixture | Genuine-self-touch still rejected |
| U3.5 | Re-promote | Place-type depth_warm before/after pasted; ≥96.75% or improved with reason |
| U3.6 | Gates | geometry + front-labeling CI green |

## Out of scope

- Rebuilding Unit 2 atom shape.
- Central-TX greenlight.
- Weakening guards to chase ratio.
- Stage 3 market-ready / road render UI.

## Close format

1. PR URL + SHA.
2. Live 28286 / 34785 / 33512 warm evidence (areas, insetFeet, provenance showing primitive-consumed).
3. Vitest paste including the three fixture classes above.
4. Re-promote before/after tally (verbatim).
5. Scratch block.

Planner verifies live; you do not mark Stage 2 or Central-TX done.
