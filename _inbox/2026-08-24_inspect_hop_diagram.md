---
id: 2026-08-24_inspect_hop_diagram
title: Inspect hop diagram — structural live vs situs baked vs Wave 1 root facts
status: filed
date: 2026-08-24
plan_row: P-75
related:
  - _inbox/2026-08-24_write_path_what_we_missed.md
  - _inbox/2026-08-24_p75_CP1.md
  - _inbox/2026-08-24_p76_CP1.md
snapshot:
  read_date: 2026-08-24
  ldt: origin/main @ 244567a50ae62334984b3f990d776872e1c206ea
  hauska_map: origin/main @ ec36da5c73554773986dc671a4cc423397a52621
  isolated_wave1: P:/tmp/ldt-lane3-wave1 (HEAD = origin/main; whoServesRead.ts uncommitted)
  isolated_p76: P:/tmp/ldt-lane3-p76 (HEAD = origin/main; cityLimitsFactRead.ts uncommitted)
---

# Inspect hop diagram

A `cad_property` write is not an inspect-title write. This page exists so the next agent does not treat a CAMA upsert as a card-title fix.

Code-read 2026-08-24 against LDT `origin/main` @ `244567a5` and hauska-map `origin/main` @ `ec36da5`. Wave 1 readers named below sit as uncommitted files on isolated trees pinned to that LDT SHA. They are not on `origin/main`. Local property-seat LDT (`feat/s1-instrument-hardening`) and local hauska-map (`fix/p35-vercel-token-preflight`) were not used.

Gold control: `48021:34137` living area **2800** is the structural live path. Title `908 PINE` is the baked situs path.

PE never queries `cad_property`.

## Three hops

| Hop | Store | Reader | Cortex route | PE BFF | Card widget |
| --- | --- | --- | --- | --- | --- |
| **Structural (living area)** live | Deployment `cad_property` (`living_area_sqft`, `year_built`). Vintage via `tryResolveDeclaredCadVintage` + `makeCadPropertyLookup`. | `loadStructuralFactAtom` → `resolveStructuralFactRead`. Wire: `structuralFactToLivingAreaWire` / `attachVerdictLayersToFacets` writes `facets.livingAreaSqft`. Root sibling `structuralFact` stays on the JSON. | `GET /api/brokerage/v1/place/node/:parcelNodeId/facets` (`brokerageNodeFacets.ts`). `Promise.all` loads baked snapshot **and** `loadStructuralFactAtom`. Route still **404 not_baked** if no tier-1 snapshot. Living-area **value** is live; the GET still needs a bake row to return 200. | `handlePropertyAtomsFacets` → `fetchCortexFacets`. `mergeBakedBaseFacts` → `withRootFacts` → `withVerdictLayerFields` copies `structuralFact` and sets `facets.livingAreaSqft`. PE does not SELECT CAD. | `livingAreaLayerToCardFacet` → InspectCard row `Living area` (`testid=inspect-living-area`). Gold present: `2,800 sqft`. `yearBuilt` is on the structural wire and is **not rendered**. |
| **Situs / title** baked | `txgio_parcel.situs_address` (and city/state) at **bake** time. Persist: `place_layer_snapshots` `adapter_key=node-facets:tier1`, `place_key=node:{fips}:{propId}`. | Bake writer `nodeFacetBakeTier1Cli.ts` copies `situs_address` into `facets.baseFacts.situsAddress`. Serve reader `loadBakedNodeFacetSnapshot`. No live `cad_property` situs read. | Same facets GET. `baseFacts.situsAddress` is the snapshot payload, not a live CAD column. | `mergeBakedBaseFacts` adopts baked `situsAddress` / `situsCity` / `situsState` (plus land-use and acreage). Never zoning or envelope from cortex. | `deriveBakedCardModel.situsAddress` → `resolveCardHeading(situs, apn)`. Title is the situs string when it has a letter or digit; else `Parcel {apn}`; else `Selected parcel`. `data-testid=inspect-title`. Map-click label uses the same baked situs, not CAD. |
| **New Wave 1 facts** (who-serves, city limits) | Who-serves: `tx_utility_territory_staging` (0076) **10,196 rows** (water 8515, sewer 1455, electric 139, water-district 87). City limits: `tx_city_boundary` (0070) **1,222 / 1,222 geo_id**. County 254. Measured 2026-08-25T01:58:19Z via gcloud `DEPLOYMENT_DATABASE_URL`. Matches L22 / ss-w15 exactly (possibly unchanged store; timestamp is the new fact). Evidence `_inbox/2026-08-24_wave1_live_store_counts.json`. | **Not on origin/main.** Isolated P-75: `whoServesRead.ts` `serveWhoServesAtPoint` (PIP + residual; empty store = `unmeasured`). Isolated P-76: `loadCityLimitsFact` → `resolveCityContainmentAtPoint` (empty table = `unmeasured`; `etjStatus=unresolved` always in v1). Origin/main `resolveCityContainment` still reports empty index as **unincorporated**. Live table is not empty; the lie is a code-path risk if the table is later truncated. | P-75 intended: `GET /api/who-serves?lat=&lng=` (`whoServes.ts`). Not a facets sibling. P-76 intended: root sibling `cityLimitsFact` on the same facets GET. Neither route is on serving `origin/main`. | origin/main `withRootFacts` does **not** copy `cityLimitsFact` or a who-serves section. A cortex-only ship still dies at the BFF until PE grows a merge + row. | **None.** Both WDLLs leave PE chips as leave_behind. Assembler utilities consume is a later card. |

## What a SQL UPDATE changes on the next inspect (no bake, no deploy)

Assumes the **serving** cortex revision already has the structural live-read (P-63 closed; gold 2800 is the proof) and the parcel already has a tier-1 bake row.

| SQL write | Next inspect without bake or deploy | Still stale |
| --- | --- | --- |
| `cad_property.living_area_sqft` (declared vintage row) | Cortex `structuralFact` + `facets.livingAreaSqft` and the Inspect **Living area** row. Gold path: `48021:34137` → 2800 today. | Title, land-use chip, acreage, map-click label, County Manifest / atom surfaces. |
| `cad_property.year_built` | Wire only (`structuralFact.yearBuilt`). | Card. Nothing renders year built. |
| `cad_property` situs / owner / acreage / land-use columns | Nothing on inspect. PE never reads this table. | Title and every baked base fact. |
| `txgio_parcel.situs_address` | Nothing. Serve reads the snapshot, not the parcel table. | Title until rebake or P-74 serve-time fallback. |
| `place_layer_snapshots` tier-1 `baseFacts.situsAddress` (manual snapshot edit) | Title on next facets GET. Not a supported writer. | Do not do this. Rebake is the writer. |
| `tx_utility_territory_staging` geometry / holders | Nothing on serving origin/main (no reader). After P-75 cortex deploy: next `GET /api/who-serves`. | Inspect card until a PE chip ships. |
| `tx_city_boundary` (CLI replace) | Nothing on serving origin/main (no facets attach). After P-76 cortex deploy: next facets `cityLimitsFact`. | Inspect card until a PE chip ships. Empty-index honesty is isolated-tree only. |

A 404 `not_baked` node never shows the live living-area value. The loader runs; the handler discards it.

## What still needs a deploy or rebake

| Change | Cortex deploy | PE deploy | Rebake / other |
| --- | --- | --- | --- |
| CAMA fill of `cad_property.living_area_sqft` on an already-baked node | No (reader is live) | No (card already maps `livingAreaSqft`) | No for inspect sqft. Atom apply (`cad-parcel-roll` / County Manifest) is a second motion. |
| First structural reader on a new revision (if someone ships a regression) | Yes | Only if the merge/`livingArea` row is missing on that PE SHA | No |
| Card title / land-use chip / acreage / map-click label | No | P-74 is the serve-time situs fallback (isolated PE tree, not A2) | Tier-1 rebake from `txgio_parcel`, or P-74 |
| Who-serves on a live GET | Yes. Merge isolated `whoServesRead` + mount. Measure staging rows first. | Yes if the card should show it. WDLL leave_behind. | No bake. No `--apply`. Staging load is a Neon write, not a slot. |
| City limits on inspect JSON | Yes. Merge isolated `loadCityLimitsFact` + `cityLimitsFact` sibling. Re-measure `tx_city_boundary` before wiring (empty index currently lies on origin/main). | Yes. `withRootFacts` must forward `cityLimitsFact`; card row does not exist. | CLI apply is planner-owned. No atom family. |
| Year built on the card | No (already on the wire) | Yes (new row) | No |

## Do not confuse these

P-27 address-to-parcel resolver and P-74 card-title sentinel bind the same situs string on different hops. P-27 stays parked.

Land-use on the card is baked `baseFacts.landUse` (retiredStore). `landUseFact` is a live atom sibling. Neither is `cad_property`.

Special-district is `special-district-fact` atoms, not who-serves. TCEQ `water-district` staging rows stay complementary who-governs (P-75 item 6).

Owner / mailing must not ride the new public-free wires.

## Gold 48021:34137

| Surface | Value | Hop |
| --- | --- | --- |
| Living area | 2800 (BFF `populated`) | Structural live: `cad_property` → `loadStructuralFactAtom` → facets GET → PE merge → Inspect Living area |
| Title | 908 PINE | Baked situs: `txgio_parcel` at bake → `place_layer_snapshots` → `resolveCardHeading` |
| Who-serves | Unwired on origin/main | P-75 leftover: live gold probe after cortex deploy |
| City limits | Unwired on origin/main | P-76 leftover: incorporated / Bastrop after cortex deploy + populated table |

Canvas: [inspect-fact-hops](C:/Users/cente/.cursor/projects/p-doc-repo/canvases/inspect-fact-hops.canvas.tsx).
