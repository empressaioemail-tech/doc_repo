---
id: 2026-08-24_lane1_photon_pick_WDLL
title: Lane 1 — dropdown Photon address pick docks the situs parcel
status: approved
date: 2026-08-24
plan_row: P-60
operator_go: verbal 2026-08-24 (go)
---

# WDLL: Photon address pick

Operator graded raw Find of `17005 Simsbrook, Pflugerville TX` PASS (card 280239). Picking the dropdown address row left the neighborhood, no card, then Find of the Photon label yellowed `Could not geocode the provided address`.

## Done looks like

Picking the dropdown address row for Simsbrook docks parcel `48453:280239` the same way the short pasted Find does. The Photon label is not written into the box and is not POSTed address-only to envelope. Gold pick/Find still docks. Street and place rows still fly the camera only.

## Acceptance items

1. **Pick docks identity.** Selecting the typeahead address row for 17005 Simsbrook runs lookup on the situs/compact identity query, not `…Drive, Pflugerville, Texas, 78660`. Card is 280239. | check: unit on merge + identity query + landing; live after deploy | grade: [met] live 2026-08-24T18:19Z pick writes situs string; envelope 200 `48453:280239`; card SF-S F 25 / S 7.5 / R 20. Merge `37d8550` / `dpl_FgxxuUi3EfVq4dNvJsmif88snJh5`.

2. **Photon label is not the Find leftover.** After pick, the input does not carry the Photon `Texas, ZIP` label. A following Find does not 422 geocode_miss on that label. | check: `suggestionLookupTarget` / compact query unit | grade: [met] input after pick is `17005 SIMSBROOK DR, Pflugerville, TX, 78660`. Photon address-only still 422; compact/situs is not that label.

3. **Photon address row is not shown when the situs pin exists.** Merge drops the Photon address duplicate when an address-point or parcel row shares the same house number. | check: mergeSearchSuggestions unit both directions | grade: [met] live dropdown after Photon string showed one row: `17005 SIMSBROOK DR`. Unit both directions.

4. **Gold still docks.** `908 Pine, Bastrop TX` / `48021:34137` still seals. Many-hit `908 Pine` still does not take hits[0]. | check: existing gold lookup tests stay green | grade: [met] parcel-lookup many-hit test still green in the 44.

## Do not

- A2 pricing, hover paint, LDT envelope schema
- Take situs `hits[0]`
- Pass Photon lat/lng to envelope
- Work in `P:/seat-worktrees/property/hauska-map`
