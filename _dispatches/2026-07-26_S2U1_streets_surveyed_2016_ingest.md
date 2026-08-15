---
id: 2026-07-26_S2U1_streets_surveyed_2016_ingest
title: Dispatch — Stage 2 Unit 1 — StreetsSurveyed2016 ingest (retire OSM surface/class proxy)
status: active
date: 2026-07-26
applies_to: [hauska-engine]
owner: nick
planner: depth-engine planning agent (doc_repo)
governs_wdll: [27f_bastrop_through_v2_program]
cites:
  - 27f STAGE 2 AMENDMENT (StreetsSurveyed2016 pull-forward)
  - 27f WDLL 5 (adjacency/labeling from live data — county road truth leg)
  - M0.2 / M0.3 (fleet scratch + mechanical guards)
related:
  - _inbox/2026-07-26_v2_sourcing_recon_bastrop.md
  - _inbox/2026-07-26_PRE2_adjacency_at_scale_checkin.md
  - _scratch/depth-engine-27c.md
  - 2026-07-26_temporal_boundary_primitive_and_living_layer
---

# S2-U1 — Ingest StreetsSurveyed2016 (authoritative road surface+class)

You are the EXECUTOR for Stage 2 Unit 1. Build in `P:\hauska-engine`. Open a PR on green CI. Return a close with evidence + scratch block (M0). Do NOT self-grade as done. The planner verifies against LIVE state. Do NOT promote lessons to MEMORY.md yourself.

## FLEET MEMORY (M0) — paste-enforced

As you work, capture build knowledge in a scratch block you return in your close, using four entry kinds — LESSON (a hard-won fact worth a test/note), DEAD-END (a tried-and-failed path + reason, so it is not retried), GROUND-TRUTH (a live-verified state WITH its timestamp), OPEN (a live thread the next context must pick up). Read any scratch context passed to you FIRST before re-deriving. Do NOT promote anything to durable memory yourself — return lessons in your close; the planner gates promotion. Nearing your limit, flush open threads + live ground-truths into your close so the next instance starts warm.

## Scratch context (start warm — DO NOT RE-DERIVE)

```
BAKED — OSM PROXY BUG CLASS (the whole reason this unit exists):
LESSON (FIX2): batch load-filters isFrontEligibleRoad → collectors steal front when footways no longer shadow them. Live 34785: filtered → secondary front → empty; unfiltered → unclassified front → verifyPass.
LESSON (FIX2.1): front-eligible OSM denylist + residential-first front tie-break. FRONT-LABELING FIXTURE GATE is promoted (M0). Do not weaken it.
LESSON (R4.1): footway OSM ways winning front + 15′ on small lots; collector priority over residential; alley rear + front collapsing inset — fixed by denylist + residential-first + honest partial inset. No not_specified fabrication.
LESSON (R4.2): verify must pass OSM surface=* into classifyOsmHighwayTag (service+unpaved→gravel).
LESSON (R4.3): gravel/unclassified front → B3 6.5.003 Place Type build-to-line; explicit descriptor rows + shared resolveInsetFeetForEdge.
DEAD-END: treating OSM highway=*/surface=* as ground truth for Bastrop labeling — it is a PROXY. County StreetsSurveyed2016 is the authoritative replacement (recon 2026-07-26).

PRE-2 / ADJACENCY (do not reinvent; Unit 2 owns persist — you own ROAD truth):
GROUND-TRUTH (PRE-2): full-county parcel adjacency HOLDS via one-load + cell-grid + PIP (74729 parcels / 27s). PostGIS NOT required. Naive per-edge bbox scan is O(n²) (Bexar ~55h) — FORBIDDEN.

GEOMETRY GATES (must stay green — you do not touch polygon-inset):
LESSON (PATCH-A): ringHasSelfTouch false-rejected dirty-but-correct clip rings; fix cleaned geometry, did NOT weaken the guard. Genuine self-touch negative fixture stays.
LESSON (M0): geometry gate must include POSITIVE-SPACE (good near-rects pass on every edge index).

CENTRAL-TX: HELD. Do not greenlight. Do not fan Central-TX.
```

## Source (LOCKED)

Live ArcGIS FeatureServer (public record, same intake shape as existing adapters):

`https://maps.co.bastrop.tx.us/server/rest/services/RoadAndBridgeMap/StreetsSurveyed2016/FeatureServer`

Decisive fields (recon-verified): `surface_wi`, `row_notes`, `surface`, `road_paved`, `road_grave`, `road_hotmi`, `road_seale`, `class`, `rdcls_typ`, `st_name`, `full_name`, polyline geometry.

Do NOT use TxDOT roadways for this unit (commercial-use restriction unresolved). County layer only.

## What to build

1. **Adapter** under `packages/engine-core/src/road-intake/` (mirror `fetch-overpass-bbox.ts` / `emit-road-node.ts` shape): fetch StreetsSurveyed2016 features → emit/upsert `road-node` atoms (or enrich existing) with:
   - classification derived from county `class` / `rdcls_typ` / surface flags (map into the existing roadClass vocabulary used by descriptors: residential/collector/arterial/highway/alley/gravel/… — document the mapping table in code + test).
   - surface / gravel flags from county fields (authoritative).
   - `row.provenance.kind` = `county-surveyed-2016` (or equivalent clear enum) when county wins.
   - Keep OSM atoms as fallback: where county has no coverage for a segment, OSM remains with `provenance.kind=approximate-assumed-per-class` (or existing osm provenance). **County wins where it disagrees with OSM.**
2. **Labeling path**: `labelEdgesFromRoads` / warm road load MUST prefer county-surveyed classification+surface over OSM when both attach to an edge. Honest per-road provenance on every labeled edge (county-surveyed vs osm-fallback).
3. **Ingest Bastrop** (city bbox minimum; county if cheap/tiled): write road-nodes to substrate. Paste count before/after.
4. **Mechanical guards (M0 promotion targets — land as tests)**:
   - Fixture: county gravel/surface flag → classification `gravel` (not OSM highway=service alone).
   - Fixture: when county says residential and OSM says footway/collector, county wins for front eligibility / class.
   - Existing front-labeling + geometry gates stay GREEN.

## Acceptance (cite in PR + close)

| # | Gate | Observable |
|---|------|------------|
| U1.1 | County adapter ingests live Features → road-nodes | Live substrate count delta; sample atom body shows county fields + provenance `county-surveyed-2016` |
| U1.2 | County wins over OSM on disagreement | Unit test + live before/after on a known gravel or collector-steal case |
| U1.3 | OSM remains fallback for uncovered | Provenance `osm-fallback` (or existing osm kind) on at least one labeled edge without county hit |
| U1.4 | FIX 2.1 / R4.3 cases re-checked | Paste before/after labeling for gravel/footway/collector specimens (planner will re-verify live) |
| U1.5 | Front-labeling + geometry vitest gates green | CI paste |

## Out of scope

- Boundary primitive atom shape (Unit 2).
- Offset consume-primitive rewire (Unit 3).
- PostGIS.
- Central-TX fan-out.
- Weakening `ringHasSelfTouch` / geometry gate / front-labeling gate.
- TxDOT ingest.

## Close format

1. PR URL + merge SHA (or ready-to-merge head).
2. Live evidence: road-node count before/after; 2–3 sample atom bodies (county provenance).
3. Before/after labeling on gravel/footway/collector cases (named parcels or road ids).
4. Vitest / CI paste.
5. Scratch block (LESSON / DEAD-END / GROUND-TRUTH / OPEN).

Planner verifies; you do not mark Stage 2 done.
