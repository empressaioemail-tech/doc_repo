---
decision_id: 2026-08-24_hover_never_draws_tile_fragment
date: 2026-08-24
owner: operator
status: active
plan_row: P-60
related_canonical:
  - _inbox/2026-08-24_stacked_paint_diagnosis.md
  - _inbox/2026-08-24_hover_feature_state_WDLL.md
  - _inbox/2026-08-24_hover-fs_close.json
  - _scratch/setback-serve-wave.md
---

## Decision

A parcel hover or pre-seal inspect highlight is a feature-state on the promoted `parcel_node_id`. It is never `queryRenderedFeatures` / `hits[0].geometry` drawn into a GeoJSON overlay. That geometry is a tile fragment, not the lot.

## Context

On the Simsbrook block the leftover looked like a straight cut through every front yard, parallel to the street, and the hover box changed shape by entry edge. Round 1 attributed that line to the platted lot boundary, then to sidewalks, then to stacked mesh. The operator falsified those referents (parcel boundary OFF, leftover still there). Round 2 measured the hover overlay drawing the per-tile fragment. The block sits on a z16 seam cross (lng -97.6354980, lat 30.4581444). Feature-state already painted the full lot (pale fill); the blue box was one fragment.

Rejected alternatives: rebake (archive has each lot whole; object unchanged since 2026-08-10), hide tile lines on zoom (#201), revive the live mesh, treat Find identity as still broken (#204 kept the id).

Shipped hauska-map #210 squash `57ca035`, serving `index-iYfCC3y3.js` on smartsite.cloud (verified this session: PR merged 2026-08-24T22:30:13Z; live HTML serves that bundle). Violation suite failed 6/6 on unmodified `80c9ad4` before the overlay was deleted, then passed 6/6. Close `_inbox/2026-08-24_hover-fs_close.json`.

## Structural commitment check

Sell reasoning, not data: not in play. This is a paint-path rule.

Confidence earned, not asserted: aligned. The leftover was measured on live fragments, then the old path was shown to fail the seam fixture.

Cost per jurisdiction: aligned. No rebake.

Dual interface: not in play.

## Reasoning

Vector tiles clip polygons at tile edges. MapLibre's rendered-feature geometry is that clip, plus buffer. A highlight that `setData`s the hit geometry will always be missing a strip on every lot that crosses a seam, and the missing strip will line up across neighboring lots because it is pinned to the tile grid, not to the street. Feature-state keyed on `promoteId` paints every loaded fragment of that id, so the highlight is the whole lot. Post-seal stays on the P-60d county-exact sheet ring (`sheet.geometry.rings`). That path was not this defect and is not this rule.

## Reversal criteria

Reverse only if a later MapLibre or tile pipeline exposes a single unclipped ring from the tile source that is proven equal to the county ring on seam-crossing lots, and a live walk on 280236 / 280233 shows the feature-state highlight disagreeing with that ring. Do not reverse because a leftover line is visible: first prove the painter is still fragment `setData`, not the platted front lot line, not sidewalks, not the envelope.

## Dependencies

Depends on #204 pick identity (query `PARCEL_TILES_FILL_ID` only) and P-60d sealed sheet ring. Consumers: any future hover, inspect, or "draw this lot" overlay in hauska-map. Leave-behind not absorbed: A2 rebase, seal-lifecycle / red-card / search-bar card, retrieval near-bbox 504s.

## Counterparties

Internal. Operator visual (WDLL item 6) is still the customer-done grade: hard refresh, hover 280236 / 280239 / 280233 from both sides.
