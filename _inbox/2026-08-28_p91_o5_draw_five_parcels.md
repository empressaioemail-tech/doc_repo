---
id: 2026-08-28_p91_o5_draw_five_parcels
title: P-91 item 6 (O5) — draw is not gold-only
date: 2026-08-28
last_updated: 2026-08-28
status: active
plan_row: P-91
wdll: _inbox/2026-08-28_smartsite_mcp_app_WDLL.md
wdll_item: 6
owner: property seat (execute only)
---

# P-91 O5 — draw is not gold-only

Date: 2026-08-28T15:47Z  Status: graded  Plan row: P-91  WDLL item: 6

## Snapshot

doc_repo `main` `843b3437f8f00272cae4dda1d740ab46ca60177e` (2026-08-28T01:29:46-05:00).

LDT write path read from `P:/seat-worktrees/property/legacy-design-tools-p91-wire` branch `fix/p91-batch-stub` at `f4710c6933a9de2ba278ebcb1b334a12739e8f27` (merge of #522, tracking `origin/main`). Files: `artifacts/api-server/src/lib/parcelDrawFromReads.ts`, `parcelDrawStub.ts`, `boundaryEdgeFactRead.ts`, `routes/propertyExplorer.ts` (R1 brief POST `/api/property-explorer/v1/research/brief`).

Writer seam read from `P:/seat-worktrees/property/hauska-engine` `00fa893f319ed4eecba74b7cfb60f9d148d23e34` `packages/engine-core/src/depth-warm/emit-boundary-edges-from-warm.ts` and `packages/atoms/src/boundary-instances.ts`.

Store: Neon `fancy-fire-06136146` (cortex-prod) `hauska_mcp.atoms` prefix-range on `entity_type='property-boundary-edge'`, same instrument as `_inbox/2026-08-28_gold_34137_draw_dump.json`. Bake check: same project `neondb.place_layer_snapshots` exact `(adapter_key, place_key)` for `node-facets:tier1`. Not a heap scan.

hauska-cortex MCP failed discovery this session. No live authenticated `get_smart_site` / R1 HTTP was called. R1 requires PE auth. One already-filed live dump covers `48021:34169` (`_inbox/2026-08-28_smartsite_mcp_app_prototype.html` DRAW block, sourced as live `get_smart_site`).

## Write path (code reading)

`get_smart_site` POSTs cortex R1. R1 loads `loadBoundaryEdgeFactAtom` from `hauska_mcp.atoms` on both parcel-prefix grammars (`{fips}:{prop}:boundary:` and padded). It does not read bake, CAD, GIS, or `txgio_parcel` for the ring. `tryAssembleParcelDrawFromReads` maps a present edge set into `assembleParcelDraw`. A ring is emitted only when every sorted edge has two finite Local-ENU metre endpoints. Miss or unparseable endpoints omit `draw.ring` and emit overlay `boundary` / `unknown` / "Parcel boundary unmeasured". The serializer never invents a ring.

`depth-warm-verify-promote` writes those endpoints from `candidate.parcelRing` via `computeParcelInteriorFacts`. `descriptor-fixture` is a different adapter on the same atom type. Gold `48021:34137` remains `descriptor-fixture` (four edges). That does not by itself make draw gold-only.

R1 still 404s without a tier1 bake. All five probe parcels have a `node-facets:tier1` row dated 2026-08-28T15:08Z to 15:10Z, so bake-miss is not the miss path here.

## Five parcels (not `48021:34137`)

Preferred saved-set ids. Vertex count is edge count after the assembler drops the repeated close. Projected feet use `metresToSurveyFeet` from `parcelDrawStub.ts` (`3937/1200`, hundredths). Those feet are store-derived, not a live HTTP body, except 34169 where they match the filed live dump.

| node id | draw.ring | vertices | sourceAdapter | fixture vs live | miss reason |
| --- | --- | --- | --- | --- | --- |
| 48021:34169 | yes | 5 | descriptor-fixture | fixture (same adapter as gold). Live `get_smart_site` ring already filed. Store projection equals that dump. | none |
| 48021:35073 | yes | 4 | depth-warm-verify-promote | live county ring via warm writer. Provenance source `county parcel ring / txgio`. | none |
| 48021:33223 | yes | 4 | depth-warm-verify-promote | live county ring via warm writer. Same provenance source. | none |
| 48021:27943 | yes | 5 | depth-warm-verify-promote | live county ring via warm writer. Same provenance source. | none |
| 48021:32243 | yes | 4 | depth-warm-verify-promote | live county ring via warm writer. Same provenance source. | none |

Every listed edge has `interior.edgeEndpoints` as an array of length 2 with finite numbers, and the last endpoint of the last edge equals the first endpoint of edge 0 (closed). Structured rows: `_inbox/2026-08-28_p91_o5_draw_five_parcels.json`.

Extra saved-set prefix-ranges (not one of the five): `48021:49295` has 11 `descriptor-fixture` edges with parseable endpoints. `48021:34121`, `48021:35105`, `48021:35425`, `48021:36105` also have fixture edges. `48021:82112` and `48021:36249` returned zero edge rows (typed `atom-miss` if R1 is called). Those two are not required for this item.

## Two mechanisms

Observation: five non-gold Bastrop parcels have rings.

Mechanism 1 (accepted): the serve path reads any `property-boundary-edge` generation. Depth-warm promote wrote county-ring endpoints onto 35073, 33223, 27943, and 32243. Fixture write also landed rings on gold neighbors (34169) and other saved parcels. Assembler projects those endpoints. Draw is not bound to `48021:34137`.

Mechanism 2 (rejected): only gold is drawable and the other ids are fixture-misses or empty. Rejected because the prefix-range SELECT returned edges with parseable endpoints on all five, four of them on `depth-warm-verify-promote`, not `descriptor-fixture`. A second derivation on 34169 (filed live `get_smart_site` ring) agrees with the store projection to the hundredth of a foot.

## Falsifier (pre-registered)

This item fails if the five non-gold prefix-ranges return no edges, or edges without parseable endpoints, while gold stays `descriptor-fixture`. That is the gold-only / fixture-miss case. It was not observed.

It also fails if the four warm adapters were actually `descriptor-fixture` mislabelled. The store returned `depth-warm-verify-promote` on every edge of those four. The writer that emits that adapter is `emitBoundaryEdgesFromWarmCandidate`.

## Ruling

O5 is not a ship gate. Five Bastrop parcels that are not `48021:34137` have rings. Four of those five are county geometry from `depth-warm-verify-promote`. Gold edges staying `descriptor-fixture` does not confine draw to gold. The parcel panel is not blocked by this item.

What this does not prove: a live authenticated `get_smart_site` HTTP body for the four warm parcels. The assembler plus the store plus the 34169 live agreement is the evidence. Code reading outranks an unrun HTTP call. The HTTP bodies remain unmeasured.

## leave_behind

```
leave_behind:
- item: live authenticated get_smart_site / R1 HTTP body for 48021:35073, 48021:33223, 48021:27943, 48021:32243 (hauska-cortex MCP down this session; PE auth required)
  owner: planner
  plan_row: P-91
```
