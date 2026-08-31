---
id: 2026-08-24_lane3_travis_identity_join_WDLL
title: Lane 3 — Travis map node to cad_property join (280238 class)
status: superseded
date: 2026-08-24
plan_row: P-60
superseded_by: _inbox/2026-08-25_p80_travis_join_WDLL.md
operator_go: needed
depends_on: _inbox/2026-08-24_travis_block_completeness_diagnosis.md
---

# WDLL: Travis identity join

Superseded 2026-08-25 by `_inbox/2026-08-25_p80_travis_join_WDLL.md` (plan_row P-80). Items 1, 3, and 4 (and the neighbor half of item 2) are met by P-77. Do not start a product branch from this draft. The remaining join fix is P-80.

280238 is on the map and returns HTTP 200. It has no `cad_property` row at vintage `2026/cad-export`. Nine neighbors on the same walk do. The card is APN, county, `, TX`. That is a join miss, not an empty neighborhood.

## Done looks like

Every PMTiles `parcel_node_id` on the Simsbrook / Dashwood walk either joins `cad_property` at the declared vintage or the sheet says `lookup-failed` with that vintage named. 280238 is no longer a silent thin card that looks like "this lot has no county data." 280239 stays joined. HTTP 200 is not treated as a successful CAD bind.

## Acceptance items

1. **280238 is classified.** Facets for `48453:280238` either bind a `cad_property` row at the declared vintage or emit `lookup-failed` (or equivalent honest miss) naming that vintage. | check: live facets + store query against `2026/cad-export` | grade: [met 2026-08-25T14:14:55Z] P-77 close `_inbox/2026-08-25_p77_honest_miss_close.json`

2. **Joined neighbors stay joined.** `48453:280239` and at least one Dashwood node (`280210` or `280211`) still have `cad_property` and land-use coverage. | check: same instrument as item 1 | grade: [met 2026-08-25T14:14:55Z] same P-77 close; regression after a P-80 write is P-80 item 8

3. **Miss rate is measured, not guessed.** The card reports join-hit / join-miss / unmeasured on this named block AND on a stated Travis sample. `prop_id_bad_rate` 0.51 is not the grade. | check: file-based instrument with both directions | grade: [met 2026-08-25T02:08:37Z] `scripts/p77-travis-join-measure.mjs` 10/1/0/0

4. **No silent empty card.** A map node without a CAD row does not render as a successful identity-only sheet that omits the miss. | check: inspect card copy on 280238 | grade: [met 2026-08-25T14:14:55Z] lookup-failed + vintage; same P-77 close

5. **Out of this card.** Do not invent sqft. Do not hide `atom-miss`. Do not copy the Find string onto CAD situs. Do not load the Travis CAMA improvement file here. Those are later cards in the diagnosis order.

## Do not

- Start this while `fix/pe-pricing-a2-rebased` is the open PE writer
- Collapse this with situs bind or CAMA load
- Treat StratMap feature count vs REST count as the join proof
