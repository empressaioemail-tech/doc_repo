---
id: 2026-07-22_pe_gold_parcel_qa_list
title: Property Explorer gold parcel QA list (post-coverage push)
status: draft-for-operator-qa
date: 2026-07-22
applies_to: property-explorer
related: [2026-07-22_pe_coverage_equalization_and_spine_WDLL_amendment, 2026-07-21_property_explorer_v1_sprint_WDLL]
owner: nick
---

# Gold parcel QA list

Use **after** the coverage equalization + roads rebake + R1 spine push. Do not grade the program on this list until STATUS says items 43–49 are probed.

For each row: open PE → click parcel (or deep-link if available) → check zoning, setbacks, envelope draw, flood honesty, Research this (dev-paid).

| # | County | parcelNodeId | Address / note | Expect |
|---|---|---|---|---|
| 1 | Bastrop 48021 | `48021:33512` | 714 SPRING ST, Bastrop — P-5 form-based | P-5 maps to Bastrop place-type setbacks, not Public/Institutional; envelope not forced 0% by wrong district |
| 2 | Bastrop 48021 | (pick SF after bake) | Residential in city | Zoning present; envelope ok or honest |
| 3 | Caldwell 48055 | `48055:11386` | Prior roads proof | `roadSignalUsed:true` / `edgeSignal:road` |
| 4 | Caldwell 48055 | `48055:10068` | Prior Wave 0 probe | landUse present; no owner |
| 5 | Hays 48209 | `48209:140136` | San Marcos envelope prior | SF-6 / san_marcos_tx envelope ok |
| 6 | Hays 48209 | (Kyle or Buda if stamped) | ETJ / city edge | Honest setbacks or populated |
| 7 | Travis 48453 | `48453:907247` | Pflugerville prior | `pflugerville_tx` envelope ok |
| 8 | Travis 48453 | (Austin sample) | Austin zoning | District match or honest fallback note |
| 9 | Williamson 48491 | `48491:R062578` | Prior SF2 | Zoning + envelope honesty |
| 10 | Williamson 48491 | Cedar Park sample | Setbacks table live | Envelope draws |
| 11 | Comal 48091 | any | Bypassed | Honest gap — no fabricated zoning/setbacks |
| 12 | Guadalupe / other corpus | sample | If in corpus | Same bake treatment; document if absent |
| 13 | FEMA check | Caldwell flood parcel | Prior zone X | Flood cited, not invented |
| 14 | FEMA absent | Williamson sample | Prior null flood | Honest null / not-verified |
| 15 | R1 spine | any gold with zoning | Dev-paid Research this | Cited brief OR spine-honest error — not forever `report_not_ready` |
| 16 | Manifest | same as 15 | After R1 | layer-manifest has envelope (± flood) layers |
| 17 | Orange counties | zoomed-out commercial belt | Visual | Flat orange = missing zoning attrs on GIS — note county, not paint bug |

## Pass / fail shorthand

- **Pass:** live facet matches Expect; disclosure cites source; no invented numbers.
- **Fail:** wrong district, silent null where table exists, fabricated Comal, or R1 still scaffold-only for entitled user.
