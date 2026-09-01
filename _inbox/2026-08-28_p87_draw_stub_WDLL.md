---
id: 2026-08-28_p87_draw_stub_WDLL
title: WDLL — get_smart_site draw stub (local ring + honest overlays)
date: 2026-08-28
status: closed
plan_row: P-87
wdll_items: 22-27
operator_go: 2026-08-28 (verbal go on locked draw contract)
parent: _inbox/2026-08-26_smartsite_ai_connector_WDLL.md
gold: 48021:34137
---

# WDLL: P-87 draw stub on get_smart_site

Date: 2026-08-28  Status: closed  Operator approval: 2026-08-28

Amendment to the Smart Site agent-distribution card. Does not add a ninth tool. Does not ship setback scalars. Does not claim a graph walk.

## Done looks like

A Studio `get_smart_site` on gold `48021:34137` returns a `draw` object the model can execute without projection math, plus a deep link. The ring is local feet, origin centroid, y true north, converted from stored ENU metres. Edges carry role, length, bearing, adjacency, and road node. Unknown overlays have an in-region label. Seed confidence never crosses as a float. A parcel with no boundary-edge atoms has no ring and an unknown boundary overlay with a label. Fixture setback zeros are not present.

## Acceptance items

22. **`draw` is on the R1 brief JSON** that `get_smart_site` already returns. Same serialization `get_node` level `node` will reuse. | check: cortex `POST /property-explorer/v1/research/brief` and MCP `get_smart_site` both include `draw` | depends: none

23. **Gold ring matches the dump conversion.** Four vertices in CCW feet, `convertedFrom: local-enu-m`, `factor: us-survey-foot`, `quality: gis-approximate`. Edge 0 rear / 1 side / 2 front / 3 side_corner. Frontage is per-edge (`roadNode` on 0, 2, 3). | check: unit test against `_inbox/2026-08-28_gold_34137_draw_dump.json` endpoints; live gold `draw.ring` equals [[48.60,83.94],[-50.37,83.70],[-49.07,-84.28],[50.84,-83.36]] ±0.01 | depends: 22

24. **Honesty on the wire.** `confidence` is `"seed"` or omitted. No `calibratedConfidence.estimate` float. Unknown + `hatch-interior` without `label` is rejected (not emitted). Footprint is `unknown` with label naming yearBuilt when present and footprint unmeasured. Envelope is `refused` with `atom_path_pending` or the bake declineReason. Pipeline present-outside is `absent-verified` and names `bufferMeters`. Well atom-miss is `unknown`, not `absent-verified`. Setback feet from `descriptor-fixture` / `road-class-setback-table` are omitted. | check: unit tests for each state; gold live probe has no setbacks key and no 0.7 | depends: 22

25. **Deep link.** `draw.url` is `https://smartsite.cloud/p/{parcelNodeId}`. | check: gold body contains that string | depends: 22

26. **Miss path fail-closed.** Prefix range empty: no `ring`, overlay `boundary` state `unknown` draw `hatch-interior` label `Parcel boundary unmeasured`. Never an invented rectangle. | check: unit test with refused/atom-miss boundary fact | depends: 22

27. **Customer-done.** Operator Claude Connect `get_smart_site` on `48021:34137` after cortex-api + smartsite-mcp deploy. Drawing from returned `draw` is unambiguous: corner lot, alley, 1910 structure unmeasured, envelope refused. | check: operator paste of raw `draw` JSON | depends: 23, 24, 25, deploy

## Amendments

None at start.

## Finish card (graded at close)

Snapshot: LDT `13ccde14` / cortex-api `00621-poq` / smartsite-mcp `00018-hop`. Evidence: operator Claude Connect paste 2026-08-28 filed at `_inbox/2026-08-28_p87_item27_draw_probe.json`.

22. met — live `get_smart_site` returned `draw` on gold.
23. met — ring equals locked feet (JSON drops trailing zeros: 48.6 / 83.7). Roles 0 rear / 1 side / 2 front / 3 side_corner. `roadNode` on 0, 2, 3. Neighbor `48021:34169` on 1.
24. met — `confidence: "seed"`. No setbacks key. No 0.7. Footprint unknown + 1910 label. Envelope refused `atom_path_pending`. Pipeline `absent-verified` names 152.4 m. Well `unknown`.
25. met — `https://smartsite.cloud/p/48021:34137`.
26. met — unit test only on this close (gold has edges; miss path not in this paste).
27. met — paste is unambiguous: corner lot, alley, 1910 unmeasured, envelope refused.

leave_behind:
- item: zoning `codeRefs` / `refBasis: body-denorm` not on this bake-shaped wire (attrs.zoning is district + jurisdiction only)
  owner: property
  plan_row: P-87
- item: flood label uses live NFHL subtype `0.2 PCT ANNUAL CHANCE FLOOD HAZARD`, not the dump prose `shaded, 0.2% annual chance`
  owner: property
  plan_row: P-87
