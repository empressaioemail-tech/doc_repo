---
id: 2026-07-27_COMPLETE_BASTROP_A1_live_partial_verify
title: COMPLETE-BASTROP A1 live partial verify (while executor finishes PRs)
date: 2026-07-27
status: planner-live-partial
owner: adversarial-audit planner
---

# A1 live partial verify (resume)

Executor still finishing PRs/close. Planner SELECTs against prod Neon (not builder word).

## Pasted

```
-- txgio_parcel 48021
zd=6213  zj_city=6213  zj_any=6213

-- place_layer_snapshots tier1 48021
zoning_present=5769  zoning_has_source=5769  top_zoning_source=5769

-- node:48021:33512 zoning
{
  "district": "P-5",
  "jurisdictionKey": "bastrop_city_tx",
  "provenance": {
    "cityKey": "bastrop-city-tx",
    "codeField": "PlaceTypeClass",
    "layerName": "Zoning_Place_Type",
    "sourceUrl": "https://services7.arcgis.com/qOeXJdBtGknaCJC4/arcgis/rest/services/Zoning_Place_Type/FeatureServer/0",
    "stampedAt": "2026-07-23T11:58:59.441Z"
  }
}

-- zoning-fact tally 48021
cites_agol=5769  with_district=5769  cites_tier1_bake=56488 (absences)  total=62257

-- did:hauska:zoning-fact:48021:33512
adapter=txgio-zoning-stamp:bastrop-city-tx
url=…/Zoning_Place_Type/FeatureServer/0
citation=GIS Zoning_Place_Type field PlaceTypeClass cityKey=bastrop-city-tx …
district=P-5
```

## Provisional grades (data plane)

| Item | Grade | Note |
|---|---|---|
| 2 gold GIS citation | **MET** (data) | 33512 (+ 5769 district atoms) cite AGOL |
| 3 tier1 provenance | **MET** (data) | 5769/5769 |
| 4 zoning_jurisdiction | **MET** (data) | zj=zd=6213 |
| 5 M0 bake guard | **PENDING** | needs PR + vitest on main |

Note: `jurisdictionKey` on snapshot is `bastrop_city_tx` (underscore) while cityKey provenance is hyphenated — track as residual under C2/H5, not A1 blocker.
