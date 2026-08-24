---
id: 2026-08-24_travis_block_completeness_diagnosis
title: Simsbrook / Dashwood completeness — three defects, not one empty store
status: active
date: 2026-08-24
plan_row: P-60
snapshot: live smartsite.cloud facets 2026-08-24T22:49Z; gold 48021:34137 control; Travis registry row tx-48453
---

# What the operator saw

Ten lots on the Simsbrook / Dashwood block. Some cards look full. Some look empty. Some streets print. Some titles are `, TX`. Sealed sheets show `absent-verified` and `atom-miss`. A dashed orange box sits on the house while Footprint says atom-miss.

Hover leftover is closed (operator walk, WDLL item 6). This card is completeness.

# Three mechanisms (do not collapse)

## 1. CAD join miss — lot-to-lot on this block

Live facets, same minute, same bake vintage `2026-07-23T13:37:44Z`:

| node | landUse | situs | living-area basis |
| --- | --- | --- | --- |
| 48453:280238 | none (`facetCoverage.landUse=false`) | `, TX` | **No cad_property row at declared vintage** |
| 48453:280239 | A1 | `, TX` | CAD row present, structural fields null |
| 48453:280240 | A1 | `, TX 78660` | CAD row present, structural fields null |
| 48453:280209 | A1 | `, TX` | CAD row present, structural fields null |
| 48453:280236 | A1 | `, TX 78660` | CAD row present, structural fields null |
| 48453:280233 | A1 | `, TX` | CAD row present, structural fields null |
| 48453:280234 | A1 | `, TX` | CAD row present, structural fields null |
| 48453:280237 | A1 | `, TX 78660` | CAD row present, structural fields null |
| 48453:280211 | A1 | `17004 DASHWOOD CREEK DR , TX 78660` | CAD row present, structural fields null |
| 48453:280210 | A1 | `17006 DASHWOOD CREEK DR , TX 78660` | CAD row present, structural fields null |

1 of 10 on this walk has **no CAD roll row**. That is 280238, the thin card (APN + county + `, TX`). The store answered HTTP 200. The join missed.

How wide: Travis registry `_catalog/tx_cad_source_registry.json` `tx-48453` records `prop_id_bad_rate` 0.5147, REST live count 386,682 vs StratMap 834,936. Map identity is StratMap / PMTiles. The declared CAD vintage is `2026/cad-export`. A node can exist on the map and not exist on that roll. This is identity, not a missing house.

Rejected alternate: "280238 has no county data." Facets 200, acreage 0.1386, zoning SF-S, envelope ok. The miss is `cad_property` at the declared vintage, not the parcel.

## 2. Travis structural is county-wide zero — not this block

Gold `48021:34137` living area is `populated` 2800 (Bastrop direct CAD export). Every joined Travis row on this walk is `absent-verified` / "CAD row present but structural fields null."

Store measurement 2026-08-10 (`_inbox/2026-08-10_cad_structured_data_gap.md`): Travis 492,848 rows, **living_area_sqft 0.0%**. Same for Bexar, Dallas, Tarrant, Collin, Denton (~3.3M parcels). Williamson 76.9%, Hays 69.3%, Bastrop 52.7%. Source tier: StratMap / thin export has geometry + owner + value, not building characteristics. CAMA tabular was never loaded for Travis. L9 closed routing + Tarrant/Dallas parsers; full Travis load is still on the queue (`_inbox/2026-08-12_L9_cama_routing_close.json`). Registry `adapter_kind` for Travis is still `unknown`. `current_tier` is already `cad-export` and sqft is still zero, so the landed export did not carry the improvement file.

Well / footprint / boundary `atom-miss` is the same on gold for well and footprint. Those families are not served. The dashed orange box on the house is the **setback envelope**, not the building-footprint atom.

## 3. Situs is a sentinel on most of this street

Dashwood lots print a street. Simsbrook lots print `, TX` or `, TX 78660`. Find still has `17005 SIMSBROOK DR` because Photon / situs-address-point is a different path than `cad_property.situs_*`. `txgio_parcel.situs_address` is 99.3% statewide (address-to-parcel scope). The card title is printing the CAD sentinel. That is why 280239 says "No street address on the county record" while the search bar has the street.

Thin-card UX (search bar stuck on 17005, identity-only sheet before seal) is the already-pinned seal-lifecycle leftover. 280238 facets exist. Hiding the miss is not the fix.

# Real fix (do not do the superficial ones)

Out: hide `atom-miss` rows, invent sqft, copy the Find string onto CAD situs, rebake tiles, treat envelope as a footprint.

In, in this order:

1. **Travis identity join.** Every PMTiles `parcel_node_id` either joins `cad_property` at the declared vintage or gets `lookup-failed` with scope. Measure the miss rate on a named block (this one) and on a county sample. Travis `prop_id_bad_rate` 0.51 is the size of the job. This is the lot-to-lot defect.
2. **Travis CAMA improvement file.** Living area and year built for the joined rows. Same L9 queue as Dallas/Tarrant, Travis parser named, then load. This is the county-wide defect (~493k rows).
3. **Situs from the rich tier.** Bind `txgio_parcel.situs_address` (or the TCAD situs components) onto the node. Do not promote `, TX` to a title.
4. **Serve the three atom-miss families** as already queued: footprint drain (L20 staged), well-fact apply (Q1, zero coverage), `property-boundary-edge` ingest. Gold is the control. Do not start those inside a Travis CAMA lane.
5. **Seal / search-bar card** stays the leave-behind from hover-fs. It makes a joined miss look like "this lot has no data."

# Leave-behind

```
leave_behind:
- item: Travis cad_property join for StratMap nodes (280238 class)
  owner: planner
  plan_row: P-60
- item: Travis CAMA improvement load (sqft / year_built), L9 queue after Dallas/Tarrant
  owner: planner
  plan_row: Phase-2 P0
- item: situs rich-tier bind (txgio / TCAD components), do not print , TX as title
  owner: planner
  plan_row: Q4
- item: seal-lifecycle / search-bar leftover (hover-fs leave_behind)
  owner: planner
  plan_row: P-60
```
