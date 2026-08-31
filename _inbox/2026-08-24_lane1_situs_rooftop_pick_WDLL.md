---
id: 2026-08-24_lane1_situs_rooftop_pick_WDLL
title: Lane 1 — situs rooftop on address-point pick (restore #191, Photon camera-only)
status: approved
date: 2026-08-24
plan_row: P-60
operator_go: verbal 2026-08-24 (keep going, lynchpin)
---

# WDLL: Situs rooftop pick

#205 stripped pick coords because Photon/viewport points override the address. Dropdown then string-only 422s. #207 compacted labels. Operator still gets neighborhood + yellow geocode. The mechanism that worked is [#191](https://github.com/empressaioemail-tech/hauska-map/pull/191): send the **situs address-point rooftop** with the query.

## Done looks like

Picking the dropdown `17005 SIMSBROOK DR` row docks parcel `48453:280239` and opens the inspect card. Photon rows do not POST a Photon label or Photon coords to envelope. Gold still docks. Many-hit `908 Pine` still does not take hits[0].

## Acceptance items

1. **Situs pick sends the rooftop.** Address-point suggestion (`source=situs-address-point`) calls lookup with that row's lat/lng as `trustedRooftop`. Envelope POST includes those coords. | check: landing + lookup unit | grade: [met] live pick POST `lat:30.459005,lng:-97.635421` → 200 `48453:280239`. Merge `db479df` / `dpl_J2HQz9W86CezviRRYWJPZopwKUDk`.

2. **Photon is camera-only.** `source=photon` does not call `runParcelLookup`. No Photon label, no Photon lat/lng on envelope. Map may fly. No yellow geocode from that pick. | check: landing unit | grade: [met] unit: lookup not called.

3. **Generic lat/lng stay ignored.** Viewport / Photon coords on raw Find still do not ride onto envelope. | check: existing parcel-lookup WDLL 2 stays green | grade: [met] 24 tests including WDLL 2.

4. **Live Simsbrook pick docks 280239.** Hard-refresh, type the long string, pick the SIMSBROOK DR row, card is 280239 with no geocode_miss. | check: browser after deploy | grade: [met] 2026-08-24T18:40Z pick only (no Find). Card 280239, lot highlighted, lookupErr null.

## Do not

- Another Photon-label compact pass
- Take situs hits[0]
- A2, hover, LDT
- Work in `P:/seat-worktrees/property/hauska-map`
