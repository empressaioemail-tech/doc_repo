---
id: 2026-08-22_parcel_public_facts_gap_matrix
title: Parcel public-facts gap matrix — statewide scope (CAD + all other sources)
date: 2026-08-22
status: analysis
owner: planner
operator_request: 2026-08-22 — real gap analysis; not limited to 15-county cad_property load
related:
  - _inbox/2026-08-10_cad_structured_data_gap.md
  - _inbox/2026-08-10_HARVEST_field_inventory_report.md
  - _catalog/source_field_inventory.json
  - _inbox/2026-08-22_atom_full_surface_gap_backlog.json
  - 90_operations/OPS-1_texas_source_registry.md
  - _inbox/2026-08-08_STATEWIDE_layer_inventory.md
---

# Parcel public-facts gap matrix

**Why "15 counties" is the wrong denominator.** `cad_property` (the appraisal-roll table in cortex-prod) holds **4.6M rows across 15 counties** — the launch-footprint metros plus Central TX corridor. That is **one store**, not Texas. Separate scopes:

| Scope | Count | What it means |
| --- | ---: | --- |
| Texas counties | **254** | Full state |
| StratMap parcel geometry **loaded** (`txgio_parcel`) | **196** | Factory 1.5 bulk geometry spine |
| `parcel-node` atoms written | **196** counties / **~11.6M** nodes | Statewide sweep close 2026-08-11 |
| CAD REST **probed** with endpoint | **253** | T6 registry (`_inbox/t6_cad_probe_*.json`) |
| CAD REST **field inventory** captured | **176** | ~47 fields/county avg; 1,089+ distinct names |
| CAD REST honestly absent / partial | **78** | StratMap or bulk fallback only |
| **`cad_property` roll loaded** | **15** | Identity + value stack for launch footprint only |
| Address points loaded (`txgio_address`) | **6** | Bexar, Travis, Williamson, Hays, Bastrop, Caldwell |

This matrix uses **254** as the planning horizon, **196** where geometry exists, **176** where CAD REST fields were inventoried, and **15** only where the roll table is actually loaded today.

---

## Master matrix — fact category × pipeline stage

Legend: **Avail** = public source exists (probe/registry). **Store** = durable row in our DB. **Atom** = `hauska_mcp.atoms` entity. **Inspect** = SmartSite/cortex facet on live GET. **Map** = map layer reads atom or honest GIS. **CC** = County Manifest rail scored.

| # | Fact category | Primary public source(s) | Avail (254) | Store today | Atom today | Inspect (gold) | Map | CC rail | Gap class |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | **Parcel geometry** | TxGIO StratMap + county GIS | 253 zips / 196 loaded | `txgio_parcel` 196 co | `parcel-node` 196 co | via bake | PMTiles 196 | geometry | **58 counties** no geometry load |
| 2 | **prop_id identity** | CAD + StratMap | statewide where geometry | 196 + 15 roll | parcel-node | yes | yes | cad | crosswalk 8 counties |
| 3 | **geo_id / alt key** | CAD REST + StratMap | **158** REST counties | `txgio_parcel` only | partial | join only | — | — | **not on cad_property** |
| 4 | **Plat identity** (MAP_ID, BLOCK, TRACT, ABS_SUBDV) | CAD REST | **142–151** / 176 | no | no | no | no | — | **harvest Q3 Class A** |
| 5 | **Owner name** | CAD / StratMap | 196 geom / 15 roll | `cad_property` 98.4% in 15 | `owner-fact` gold only | identified only | excluded tiles | owner | **239 counties** no roll; atom not statewide |
| 6 | **Owner mailing** | CAD CAMA/REST | 147–148 structured / 176 | concat line 15 co | owner-fact | identified | no | owner | structured ADDR_* not persisted |
| 7 | **Situs address** | CAD + StratMap + address pts | 196 situs line; **6** addr pts | both stores | bake | yes (weak `", ,"`) | labels | — | **248 counties** no addr pts; structured situs gap |
| 8 | **Legal description** | CAD + StratMap (discarded) | ~159 REST / zip | 15 roll ~98% | cad-parcel-roll | bake only | no | cad | StratMap LEGAL_DESC discarded at ingest |
| 9 | **Exemption codes** | CAD | roll + REST sparse | 15 roll | cad-parcel-roll | partial | no | — | detail in CAMA only |
| 10 | **Land / improvement / market / assessed value** | CAD + StratMap | 196 geom values / 15 roll | ~98% in 15 | cad-parcel-roll | partial | no | cad | **239 counties** no roll atom |
| 11 | **Land use code** | CAD (`property_use_code`) | 15 roll (Comal 0%) | yes | `land-use-fact` | gold SERVE | no | landuse | not statewide |
| 12 | **Land acres** | CAD CAMA / StratMap | export-dependent | 16.7% statewide in 15 | cad-parcel-roll | shoelace bake | no | cad | metros 0% on StratMap tier |
| 13 | **Living area sqft** | **CAMA bulk** (not REST) | 9/176 on REST; export elsewhere | **10.5%**; metros **0%** | cad-parcel-roll / footprint | atom-miss gold | no | footprint | **Q5 bulk_primary** Dallas/Tarrant |
| 14 | **Year built** | **CAMA bulk** | 9/176 REST | **10.2%**; metros **0%** | cad-parcel-roll | hidden | no | — | same CAMA gap |
| 15 | **Deed / transfer date** | CAD REST | **148** / 176 | no | no | no | no | — | **top harvest gap** |
| 16 | **Deed instrument pointer** (seq/vol/page) | CAD REST | **147–150** / 176 | no | no | no | no | — | harvest backlog |
| 17 | **School district** | CAD REST | **147** / 176 | no | no | no | no | mud | pairs with special-district |
| 18 | **Hood / comp cohort** (`HOOD_CD`) | CAD REST | **147** / 176 | no | no | no | no | — | market reasoning gap |
| 19 | **Next appraisal date** | CAD REST | **142** / 176 | no | no | no | no | — | freshness signal |
| 20 | **Zoning district** | City GIS / code | 104 cities staged / 466 probed | staging table | `zoning-fact` | jurisdiction | map partial | zoning | city-by-city not statewide atoms |
| 21 | **Setback rules** | Ordinance text | per city code | atoms where warmed | `setback-rule` | gold | no | — | jurisdiction factory |
| 22 | **Buildable envelope** | Derived | per parcel warm | atoms | `buildable-envelope` | inspect-only | layer off | — | SERVE not map |
| 23 | **Property boundary / front edge** | Derived + situs | Bastrop-class warm | atoms | `property-boundary-edge` | gold partial | no | — | situs-token normalization |
| 24 | **Flood zone** | FEMA NFHL | statewide | **198k** zone polys | `flood-hazard-fact` | gold SERVE | GIS layer not atom | flood | writers sparse; BFE depth fields not stored |
| 25 | **Soils** | USDA SSURGO | nationwide API | 0 bulk | none | on-demand | no | — | adapter only |
| 26 | **Terrain / DEM** | USGS 3DEP | nationwide | per-parcel atoms | `parcel-terrain-model` 72 | paid export | no | — | not statewide DTM |
| 27 | **Hydrology / drainage** | NHD / NOAA | federal | 0 bulk table | none | site-plan path | no | — | code-heavy, no store |
| 28 | **Roads** | OSM Overpass | statewide source | **2 counties** ingested | `road-node` Bastrop+Caldwell | no | no | roads | **252 counties** not ingested |
| 29 | **Rail corridor** | NTAD | nationwide | atoms statewide | `rail-corridor-fact` | no | no | rail-corridor | body fields truncated |
| 30 | **Oil/gas wells** | RRC GIS | statewide mirror | atoms many counties | `well-fact` | atom-miss gold | layer off | rrc-wells | gold parcel empty; Harris 0 wells |
| 31 | **Pipelines** | RRC GIS | statewide | atoms | `rrc-pipeline-fact` | gold SERVE | layer off | rrc-pipelines | diameter/commodity not in body |
| 32 | **Special districts (MUD, etc.)** | TCEQ + CAD | TCEQ 2796 polys | partial | `special-district-fact` | gold MUD | mud-pid off | mud | acres/dates not in body |
| 33 | **Building footprint** | ML / CAMA / ortho | vendor-dependent | 0 on gold | `building-footprint` | atom-miss | no | footprint | store gap |
| 34 | **Utility easement** | CAD layers / imagery | McLennan + Bastrop city | **0 rows** | type ships | no | no | easement | writer dormant |
| 35 | **City limits / ETJ** | TxGIO City_Boundaries | 1225 cities source | **0** | none | R17 decline | no | — | no adapter |
| 36 | **County boundaries** | Census TIGER | nationwide | partial use | none | — | — | — | not a parcel fact store |
| 37 | **Soil survey fact** | SSURGO | specify-only | no | not published | no | no | — | contract only |
| 38 | **Sales / MLS** | Private | N/A | **excluded** | no | no | no | — | out of scope (not public record) |

---

## CAD-only field deficit list (already probed, not persisted)

From `_catalog/source_field_inventory.json` + `_inbox/2026-08-10_HARVEST_field_inventory_report.md`. **~1,088 CAD REST field variants** inventoried; **21 columns** on `cad_property`.

### Persisted today (`cad_property` / `txgio_parcel`)

`prop_id`, `owner_name`, `owner_mailing_address` (one line), `situs_*`, `legal_description`, `exemption_codes`, `land_value`, `improvement_value`, `market_value`, `assessed_value`, `year_built`, `living_area_sqft`, `land_acres`, `property_use_code`, `geo_id` (txgio only), geometry (txgio only), provenance columns.

### High-value CAD fields **available but not ingested** (ranked)

| Rank | Field group | REST coverage (of 176) | accessPolicy | Lands on |
| ---: | --- | ---: | --- | --- |
| 1 | `GEO_ID` on roll | 158 | public-free | cad-parcel-roll / join |
| 2 | `MAP_ID`, `BLOCK`, `TRACT_OR_LOT`, `ABS_SUBDV_CD` | 142–151 | public-free | cad-parcel-roll |
| 3 | `DEED_DATE` | 148 | public-free | cad-parcel-roll / tenure fact |
| 4 | `SCHOOL` | 147 | public-free | cad-parcel-roll + mud |
| 5 | `HOOD_CD` | 147 | public-free | cad-parcel-roll |
| 6 | Structured situs (`SITUS_NUM`, street, prefix, suffix) | 143–157 | public-free | address-to-parcel Q4 |
| 7 | `DEED_SEQ`, `VOLUME`, `PAGE` | 147–150 | public-free | cad-parcel-roll |
| 8 | `NEXT_APPRAISAL_DT` | 142 | public-free | cad-parcel-roll |
| 9 | Structured mailing `ADDR_LINE1–3`, city, state, zip | 147–148 | **public-paid** | owner-fact |
| 10 | `CREATED_DATE` / `LAST_EDITED_DATE` | 135 | public-free | provenance |

### CAD fields that need **CAMA bulk**, not REST harvest

| Field | REST presence | Bulk export |
| --- | --- | --- |
| `living_area_sqft` | 2/176 counties | TAD/DCAD/BCAD exports (L9 pilot 97.9% on sample) |
| `year_built` | 9/176 | same |
| Exemption detail | ~1 county REST | CAMA tables |
| Beds/baths/rooms | rare REST | CAMA |

### StratMap zip fields **thrown away** at parse (available on 196 loaded counties)

Per harvest report: `LEGAL_DESC`, `LAND_VALUE`, `IMP_VALUE`, `MKT_VALUE`, `STAT_LAND_`, `YEAR_BUILT`, `GIS_AREA`, structured situs, all `MAIL_*`, `DATE_ACQ`, `TAX_YEAR`, `NAME_CARE` — duplicate of CAD roll targets; today discarded by `txgio/parse.ts` subset.

---

## The 15-county `cad_property` sub-matrix (source tier × structure)

| County FIPS | ~rows | Source tier (typical) | sqft % | year_built % | Notes |
| --- | ---: | --- | ---: | ---: | --- |
| 48029 Bexar | 703k | StratMap | **0.0** | **0.0** | bulk_primary not applied |
| 48113 Dallas | 694k | StratMap | **0.0** | **0.0** | DCAD parser merged; zip not loaded |
| 48439 Tarrant | 690k | StratMap (+5k pilot export) | **0.7** county / **98** pilot | **98** pilot | full load announced not run |
| 48453 Travis | 493k | StratMap | **0.0** | **0.0** | crosswalk county |
| 48085 Collin | 387k | StratMap | **0.0** | **0.0** | |
| 48121 Denton | 352k | StratMap | **0.0** | **0.0** | |
| 48491 Williamson | 319k | **cad-export** (`property.csv`) | **76.9** | high | |
| 48209 Hays | 266k | mixed | **69.3** | high | no public CAD REST |
| 48027 Bell | 166k | REST/export | low | low | |
| 48309 McLennan | 114k | REST | low | low | easement layers in CAD |
| 48091 Comal | 103k | stale GIS repack | **0** use code | | |
| 48187 Guadalupe | 94k | REST | | | |
| 48257 Milam | 93k | REST | | | |
| 48021 Bastrop | 77k | **DATA-EXPORT zip** | **52.7** | | gold regression county |
| 48055 Caldwell | 48k | REST/export | **27.9** | | |

**~3.3M parcels** in the six StratMap-tier metros above have identity + value but **zero** structural CAMA fields until Q5 routing runs.

---

## Non-CAD public facts — body-field deficits (source probed, atom truncated)

| Atom family | Source fields not yet in atom body | Source |
| --- | --- | --- |
| `flood-hazard-fact` | `STUDY_TYP`, `DEPTH`, `VELOCITY`, `SOURCE_CIT` | FEMA NFHL |
| `rrc-pipeline-fact` | `DIAMETER`, `COMMODITY`, `STATUS_CD`, `LENGTH`, … | RRC 27-field layer |
| `well-fact` | full 11-field layer vs 6 used | RRC wells |
| `rail-corridor-fact` | ~30 line + ~45 crossing attrs | NTAD |
| `special-district-fact` | `COGO_ACRES`, `PLAT_ACRES`, `CREATION_DATE` | TCEQ |
| `zoning-fact` | TypicalUses, lot size, height (GIS card) | city zoning — ordinance text wins |

---

## What "done" looks like (planning horizons)

| Horizon | Counties | CAD motion | Other motions |
| --- | --- | --- | --- |
| **H0 today** | 15 roll / 196 geom | StratMap roll for metros; harvest not wired | Atoms partial; CC 254/254 not-yet on 6 rails |
| **H1 launch footprint** | 15 + CAMA metros | Q5 bulk_primary Dallas/Tarrant + BCAD export path | P-59 scorers → CC moves |
| **H2 statewide geometry** | 196 → 254 | Extend `cad_property` per county as geometry lands | OSM roads sweep; NFHL writers |
| **H3 REST harvest** | 176 inventoried | Q3 Class A fields into cad-parcel-roll | Address normalization Q4 |
| **H4 jurisdiction** | city-by-city | CAD does not carry zoning | Factory 2 warm |

---

## References

- Machine catalogue: `_catalog/source_field_inventory.json` (1,434 rows, 11 sources)
- CAD structural tier gap: `_inbox/2026-08-10_cad_structured_data_gap.md`
- Serve/inspect/map audit: `_inbox/2026-08-22_atom_full_surface_gap_backlog.json`
- Registry probes: `_inbox/t6_cad_probe_{fips}.json` (254 files)
