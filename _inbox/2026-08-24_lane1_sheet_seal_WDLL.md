---
id: 2026-08-24_lane1_sheet_seal_WDLL
title: Lane 1 — seal honest-declined sheets; Find replaces leftover subject
status: approved
date: 2026-08-24
plan_row: P-60
operator_go: verbal 2026-08-24 (go, spawn subagents)
---

# WDLL: Sheet seal + leftover Find

Wainee `48021:35772` facets are 200 declined `no-zoning-stamp`. Envelope is 200 declined with matching node and `placeKey`. The card still goes `Reading…` then red `Could not load`. InspectCard paints `unplaceable` as that same red copy. Find of Simsbrook leaves the previous card on screen until the full sheet seals.

## Done looks like

Click or Find of Wainee 35772 shows the honest no-setback-table card, not the red load box. Find of the Photon Simsbrook string replaces the inspect card with 280239 without a leftover Wainee/51536 red box. Gold still seals.

## Acceptance items

1. **Declined envelope seals.** Facets 200 + envelope `declined` + matching `parcel_node_id` + `placeKey` produces a sheet (or a card projection), not a throw. Wainee copy is honest absence, not a load error. | check: unit fixture both directions; live after deploy | grade: [met] live 2026-08-24T17:54Z `?parcelNodeId=48021:35772` — APN 35772, "no setback table", honest-absence, no `facets-load-error`. Merge `1eed1a49` / `dpl_GUCpKro6LyCK9JdryBsikqmQrrMJ`.

2. **Red only on a failed hop.** `unplaceable` is not the red `facets-load-error` copy. Transient/throw after a timed hop is. | check: InspectCard unit or render test | grade: [met] `showsFacetsLoadError` false for unplaceable / true for failed (57 InspectCard tests). Live Wainee no red box.

3. **Find swaps subject as soon as the node id is known.** `runParcelLookup` does not wait for the full sheet seal to change the inspect `parcelNodeId`. In-flight resolve of the previous id is cancelled. | check: unit on lookup orchestration | grade: [met] leftover Wainee → Find situs Simsbrook → card **280239**, URL cleared of 35772. Unit: inspect before seal (4/4). First Find while typeahead open can still 422 `geocode_miss` (Photon address-only); same string via raw Find then pinned.

4. **Gold still docks.** `48021:34137` still seals. | check: existing gold path not inverted | grade: [met] live `?parcelNodeId=48021:34137` seals 908 PINE / SF-1 / no red. Card scalars still atom-chain 25/5/25 (parked F4, not this cut).

## Do not

- Hover paint, lot-line suppress, A2 pricing, LDT envelope schema
- Take situs `hits[0]`
- Unbounded GIS wait as a precondition to show identity
- Work in `P:/seat-worktrees/property/hauska-map` (A2 tree)
