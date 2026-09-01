---
id: 2026-08-24_write_path_serve_audit
title: Write-path serve audit — inspect card, envelope POST, viewport layers
status: filed
date: 2026-08-24
plan_row: P-58
related:
  - P-58 code-read matrix (2026-08-22 close)
  - Lane 3 field-mapping / feasibility A3 (parcel facts deficit mapped before ingest)
  - _inbox/2026-08-24_write_path_serve_audit_brief.md
  - _inbox/2026-08-24_lane1_setbacks_everywhere_and_hover.md
  - _inbox/2026-08-22_parcel_public_facts_gap_matrix.md
  - _scratch/setback-serve-wave.md
  - _scratch/_probe_write_path_serve.mjs
owner: audit agent (read-only); planner commits
---

# Write-path serve audit

Serve half of the P-58 code-read matrix and Lane 3 / feasibility A3 field-mapping pass. Not a store-presence pass. The 2026-08-22 gap matrix is store-side picture only; it is not restated here as serve truth.

## Snapshot

Declared by the dispatch and confirmed in this session unless marked otherwise.

| Surface | Claim | This session |
| --- | --- | --- |
| doc_repo | `P:/doc_repo` `main` @ `476cca2` | `476cca2ce42692bf17e808d49527e4dd033d458f` |
| PE live | `https://smartsite.cloud` hauska-map `5dda5cb` (PR #203) | Property hauska-map worktree HEAD `5dda5cb` (`fix(pe): fail-open lot lines; cap retry pile-up; skip MapLibre sky`) |
| Cortex | `cortex-api-00569-maw` @100% (LDT `1fd6233d`) | LDT `origin/main` `1fd6233d` (`#470`). Property LDT worktree `869459f5` is the same change, one parent of that merge. **Traffic split on `cortex-api` was not re-read as JSON this session.** Serving revision is therefore **declared, not re-verified**. |
| Property STATE | last written `2026-08-23T18:35Z` | **STALE** vs later P-60 deploys. Not used as current. |
| Seat / checkout | integration `P:/doc_repo` on `main` | Read-only audit. No product commits. No ingest. |

Live probe timestamp: **2026-08-24T15:23:00.244Z**. Follow-up jurisdiction POSTs immediately after. Instrument: `_scratch/_probe_write_path_serve.mjs` (self-test both directions before any network call). Raw rows: `_scratch/_probe_write_path_serve.json`.

Code-read trees: hauska-map `5dda5cb`, LDT `869459f5` / `1fd6233d` (POST schema identical).

## Method

Read first, then probe. Code reading outranks a 200.

**Write paths read**

1. `apps/property-explorer/src/lib/buildable-envelope.js` `envelopeRequestBody` — what the browser POSTs.
2. `apps/property-explorer/api/_lib/pe-property-atoms.ts` — facets BFF (atom-chain product truth; cortex envelope stripped).
3. `api/_lib/atom-chain-to-facets.ts` + `baked-facets.ts` `deriveBakedCardModel` — what the card binds.
4. `src/lib/live-envelope-augment.ts` — live derive patches geometry, not setback scalars.
5. `src/browse/envelope-overlay.ts` — what the map paints from a live result.
6. `packages/map-renderer/src/live-gis.ts` + `map-renderer.js` hover — viewport overlays and `hits[0]`.
7. LDT `brokeragePlaceBuildableEnvelope.ts` `POST_BODY` (`.strict()`) + `resolveAuthoritativeSetbacks` + `cityStateFromSitus`.

**Probed**

- GET `https://smartsite.cloud/api/spine/property-atoms/:id/facets` (anonymous).
- POST `https://smartsite.cloud/api/spine/cortex/api/brokerage/v1/place/buildable-envelope` (anonymous proxy).
- Gold POST with extra `parcel_node_id` to confirm schema reject.
- City-complete address retries on Dashwood and the Simsbrook neighbor.

**Not probed**

- Retrieval atom-chain GET (no retrieval key used).
- SQL / `cad_property` / `hauska_mcp.atoms` (store hop **unmeasured**).
- Browser paint (hover, PMTiles fill, post-seal rings). Map column is write-path prediction plus operator visual `2026-08-24T15:16Z`, not a pixel probe.
- Cortex Cloud Run traffic JSON (revision claimed, not re-verified).

**What would falsify each load-bearing claim**

| Claim | Falsifier |
| --- | --- |
| `parcel_node_id` is still rejected | POST with that key returns 200 and derives |
| Card scalars come from atom-chain, not live POST | Facets setbacks change when only the envelope POST body changes |
| Live derive overwrites card setbacks | `applyLiveDeriveToFacets` writes `setbacks` (it does not) |
| Dashwood wedge miss is `no-district` / null `jurisdictionKey` | Same situs returns `ok` + ring, or status is `no-parcel` with null id |
| Gold card 25/5/25 vs derive 30/10/30 is a formatter bug | Raw `facets.envelope.setbacks.front_ft` equals live `setbacks.front_ft` |
| Wainee is honest stamp absence | Facets carry a district or setbacks object |
| Hover paints live-mesh `hits[0]` | `mousemove` queries only PMTiles fill |

Instrument self-test (no network): present-and-served fixture grades PASS; store-present/card-absent grades FAIL; atom-present/envelope-404 grades FAIL wedge and PASS card when scalars match the table; `POST_BODY` fixture rejects `parcel_node_id`. A check observed only passing has not been observed working.

## Write-path (one paragraph each)

**Card scalars.** `PROPERTY_ATOM_PATH` on: BFF fetches retrieval atom-chain, adapts via `adaptAtomChainToBakedFacets`, merges cortex **base facts only**, strips cortex envelope. `deriveBakedCardModel` prints setbacks when `facetCoverage.envelope === true` and `envelope.status !== "declined"`. Live POST is not on this path.

**Wedge.** `facetsNeedLiveEnvelopeDerive` is true only when facets already have `status === "ok"` and numeric setbacks. `envelopeRequestBody` sends address and/or lat/lng. It **omits** `parcel_node_id` (comment: LDT 400). Travis drop is only `, TX` or `TX` + 1–4 digit ZIP with fewer than three comma parts. Cortex `POST_BODY` is `.strict()` `{ address, lat, lng, skipRoad }`. After the parcel resolves, `jurisdictionKey` is synthesized from geocode city or `cityStateFromSitus` (needs **three** comma parts). `resolveAuthoritativeSetbacks` returns null if `jurisdictionKey` is null → HTTP 404 `no-district`. `applyLiveDeriveToFacets` copies geometry and area; it does not replace facet setbacks.

**Viewport.** Click queries PMTiles fill first. Hover queries every interactive overlay fill and paints `hits[0]` onto `hauska-ovl-hover-highlight`. Live county mesh is `interactive: true` with `fill-opacity: 0`. `shouldSuppressTileParcelLines` is unconditionally `false` (P-60e fail-open). Post-seal highlight is `sheet.geometry.rings` (not re-probed here). Envelope overlay draws live inset amber, or a dashed consume outline, or nothing.

## Matrix

Legend: **U** = unmeasured. **atom\*** = inferred from BFF `source=atom-chain` (retrieval body not read). Store is U on every row. Card = BFF bind through `deriveBakedCardModel` / sheet projection, not a screenshot. Map = write-path prediction unless noted.

### `48021:34137` gold Bastrop — 908 PINE

Facets `200` `atom-chain-warm` 1248 ms. Envelope POST `200` `ok` `labelEdges+derive` ringPts=5. Schema POST with `parcel_node_id` → **400 `invalid_body` unrecognized_keys**.

| Field | Store | Atom | BFF | Live derive | Card bind | Map paint |
| --- | --- | --- | --- | --- | --- | --- |
| APN | U | atom\* | `34137` | `48021:34137` | present | PMTiles / mesh id |
| Situs | U | atom\* | `908 PINE , BASTROP, TX 78602` | used as POST address | present | not a layer |
| County | U | atom\* | Bastrop | — | present | — |
| Land use | U | atom\* `landUseFact=present` A1 | A1 + bake A1 | — | present | live-parcels fill is opacity 0; zoning overlay is GIS |
| Zoning | U | atom\* | SF-1 `bastrop-city-tx` | SF-1 (BDC path) | present SF-1 | GIS stamp overlay, not atom |
| Acreage | U | atom\* | 0.3827 ac | — | present | — |
| Living area | U | atom\* | populated 2800 | — | present | no layer |
| Setbacks | U | atom\* **25/5/25** | **F 25 / S 5 / R 25** | **F 30 / S 10 / R 30** | **25/5/25** | wedge inset uses **30/10/30** |
| Buildable % | U | atom\* no pct, no geojson | `buildableAreaPct` null, `facetGeo` false | ok, ring 5 | pending until live augment | amber inset if derive ok |
| Flood | U | atom\* present | present | — | present | NFHL GIS, not atom |
| Special district | U | atom\* absent | absent | — | honest absent | mud-pid dormant |
| Pipeline | U | atom\* present | present | — | present | texas-rrc dormant |
| Well | U | atom\* refused | refused | — | honest refuse | none |
| Footprint | U | atom\* refused | refused | — | honest refuse | none |
| Boundary | U | atom\* present | present | — | present | no PE atom layer |
| Owner | U | atom\* refused (anon) | refused | — | hidden / refuse | policy: no owner on map |
| Envelope wedge | U | rings not on facets | no geojson | ok 5 pts | n/a | **paints** (write-path) |
| Hover / highlight | — | — | — | — | — | hover = `hits[0]`; click = PMTiles; post-seal = sheet rings. **Paint U** |

**Grade:** wedge PASS. Card setbacks FAIL against the live BDC table (30/10/30) that the wedge uses. Store-present/card-absent does not apply; this is **two tables on one parcel**.

### `48021:34073` 1006 Jefferson

Facets `200` `atom-chain-warm`. Envelope `200` `ok` ringPts=6.

Same split as gold: BFF **F 25 / S 5 / R 25**, live derive **F 30 / S 10 / R 30**. Zoning SF-1. Living area 2095. Boundary present. Owner/well/footprint refused. Facet geo false.

**Grade:** wedge PASS (recovered envelope still live). Card setbacks FAIL against derive table, same class as gold.

### `48021:35772` 195 Wainee Dr

Facets `200` `atom-chain`. Envelope POST `200` `declined` (no district). Parcel id returned `48021:35772`.

| Field | BFF | Live derive | Card | Map |
| --- | --- | --- | --- | --- |
| Zoning | null, coverage false | declined, no stamp | honest absent | GIS may still paint a zoom fabric |
| Setbacks | null, `declineReason=no-zoning-stamp` | declined, no scalars | **"no setback table covers this parcel's district"** | no wedge |
| Buildable | envelope coverage false | declined | honest not-stamped | nothing amber |
| Land use / living area / flood | present / 1756 / present | — | present | — |
| Special district | present | — | present | dormant |
| Boundary | refused | — | honest refuse | — |

**Grade:** card scalars PASS (honest). Wedge none is honest, not a 404-while-scalars-print fail. Lane 3 coverage, not Lane 1.

### `48453:280239` 17005 Simsbrook

Facets `200` `atom-chain`. CAD situs on facets is **`, TX`**. Envelope POST used city-complete `17005 Simsbrook, Pflugerville TX` → `200` `ok` ringPts=16, setbacks **25/7.5/20** matching BFF.

| Field | BFF | Live derive (city-complete) | Card | Map |
| --- | --- | --- | --- | --- |
| Situs | `, TX` (sentinel) | city-complete address in this probe | present as sentinel if bound | — |
| Zoning | SF-S | SF-S | present | GIS |
| Setbacks | F 25 / S 7.5 / R 20 | F 25 / S 7.5 / R 20 | present, matches table | wedge **paints** on this address |
| Buildable | pct null, no geo | ok 16 pts | pending → live % after augment | amber / dashed |
| Living area | absent-verified (CAD row, structural null) | — | honest absent | none |
| Boundary | refused | — | refuse | click/address still resolve via point |

**Grade:** card PASS. Wedge PASS **on the city-complete address**. Click path would drop `, TX` and send the point (`isTravisUnusableSitus`). That hop was not POSTed as coords-only in this probe (unmeasured).

### `48453:280210` 17006 Dashwood Creek

Facets `200` `atom-chain`. Situs now `17006 DASHWOOD CREEK DR , TX 78660` (five-digit ZIP, **no city**). BFF setbacks **F 25 / S 7.5 / R 20**, zoning SF-S, disclosure `Codified setback table (unknown); depth-warm geometry withheld`.

Envelope POST with that situs: **404 `no-district`**, `jurisdictionKey: null`, **`parcel_node_id: 48453:280210`**, reason "No authoritative setback source covers this district". Retry `17006 Dashwood Creek, Pflugerville TX` → **200 ok**, ringPts=10, 25/7.5/20.

`isTravisUnusableSitus` does **not** drop a 5-digit ZIP line. PE still POSTs the city-less situs. Parcel resolves. Setback table does not.

**Grade:** card scalars PASS (match Pflugerville SF-S table). Wedge FAIL on the body PE actually sends. Recoverable when the address carries a city. Envelope 404 while scalars print is a FAIL for the wedge and a PASS for the card.

### `48453:280230` 16911 Simsbrook Dr (Pflugerville neighbor)

Chosen as the named neighbor: same street fabric as 280239, documented earlier as facets-ok. Facets `200` `atom-chain`. Situs `16911 SIMSBROOK DR , TX`. BFF **F 25 / S 7.5 / R 20**, SF-S.

Envelope POST with that situs: **404 `no-district`**, `jurisdictionKey: null`, parcel id `48453:280230`. Retry `16911 Simsbrook, Pflugerville TX` → **200 ok**, 25/7.5/20.

**Grade:** same class as Dashwood. Card PASS. Wedge FAIL on CAD situs. "Setbacks everywhere we have a table" fails here: table is on the card, wedge is not, until a city token appears.

## Findings

Each finding states the mechanism believed, a second mechanism that would look the same, and why the second was rejected.

### F1. Cortex still rejects `parcel_node_id` (Lane 1 leftover, confirmed live)

**Mechanism:** `POST_BODY` is zod `.strict()` with only `address`, `lat`, `lng`, `skipRoad`. Extra key → 400 `invalid_body`. PE `envelopeRequestBody` omits the id on purpose. Live gold POST with the key: HTTP 400, `issues[0].keys = ["parcel_node_id"]` at 2026-08-24T15:23Z.

**Second mechanism:** proxy strips the key and the 400 is something else. **Rejected:** the JSON names `unrecognized_keys` / `parcel_node_id`. The LDT source at `1fd6233d` still has `.strict()` without that field.

### F2. Pflugerville wedge miss is `no-district` from a null `jurisdictionKey`, not a missing table and not (on these two bodies) `no-parcel`

**Mechanism:** After the parcel resolves, `cityStateFromSitus` requires three comma parts. Travis CAD situs is two parts (`STREET , TX` or `STREET , TX 78660`) so city is null. `keyFromEngagementOrSynthesize` then yields null. `resolveAuthoritativeSetbacks` returns null if `jurisdictionKey` is null. Card scalars never take this hop; they come from atom-chain / PE table. Same parcel, city-complete address, derive succeeds.

**Second mechanism:** geocode-low / `no-parcel` (scratch 2026-08-24T14:40Z). **Rejected:** these POSTs returned `parcel_node_id` equal to the clicked id and status `no-district`. A geocode miss would be `no-parcel` with a null id.

### F3. `#203` Travis drop does not catch the current Dashwood situs

**Mechanism:** `isTravisUnusableSitus` matches `, TX` or `TX` + **1–4** digit ZIP. Live Dashwood situs is `…DR , TX 78660` (five digits). PE still sends it. That is why scalars print and the wedge 404s on a map click that uses CAD situs.

**Second mechanism:** PE is still sending the old truncated `TX 7866` line. **Rejected:** facets BFF returned the five-digit line; the probe POSTed that exact string and got `no-district`.

### F4. Gold and Jefferson card scalars do not match the live derive table

**Mechanism:** BFF serves atom-chain setback-rule **25/5/25** (disclosure: "Atom-chain setback scalars; geometry from live derive"). PE `resolveCodifiedSetbacksForStamp("bastrop-city-tx", "SF-1")` is explicitly null (per-parcel-only). Cortex live derive uses the BDC / ordinance path and returns **30/10/30**. `applyLiveDeriveToFacets` does not overwrite scalars. The card and the wedge can disagree on the same inspect.

**Second mechanism:** `formatSetbackDisplay` is misreading side/front. **Rejected:** raw JSON is `front_ft: 25` vs live `front_ft: 30`. Not a display formatter.

This is a P-58 / A3 mapping defect: two independently derived numbers for one field, no agreement check on the card.

### F5. Hover is a second composer (code-read; paint unmeasured)

**Mechanism:** `map-renderer.js` `mousemove` queries all interactive overlay fills and paints `hits[0]`. `live-gis.ts` marks `live-parcels` interactive with fill-opacity 0, so the mesh is still hit-testable. Click uses PMTiles fill. Post-seal uses sheet rings. Three geometries, same class as P-60e.

**Second mechanism:** contours or a second fabric. **Rejected:** prior lot-shape work measured one Bastrop fabric; hover code does not read contours.

### F6. Wainee is honest stamp absence (Lane 3, not Lane 1)

**Mechanism:** atom-chain zoning absence `no-zoning-stamp` → BFF envelope declined, card "no setback table covers this parcel's district". Live POST 200 declined, no scalars. Not a geocode miss.

**Second mechanism:** Travis-class situs fail. **Rejected:** situs is a full Bastrop line; parcel id returned; decline reason is the stamp, not `no-parcel`.

## What is unmeasured

- Store rows (`cad_property`, `hauska_mcp.atoms`, setback-rule bodies). Atom column is BFF-inferred.
- Retrieval atom-chain JSON (stale-rule DID / layer-23 vs B3 on gold).
- Cortex serving revision traffic JSON (declared `00569-maw`, not re-read).
- Browser paint: hover swap, post-seal rings, amber fill pixels, search/inspect desync.
- Coords-only envelope POST for Simsbrook (`, TX` drop + click point).
- Owner identified-session path (anonymous refuse only).
- Whether gold 25/5/25 is a live layer-23 record or a stale B3 rule that `isStaleBastropCitySetbackRule` failed to drop. Code allows both; retrieval body was not read.
- Pflugerville parcels beyond 280239 / 280210 / 280230.

Absent, zero, and unmeasured are not collapsed. `buildableAreaPct` null on facets is **unmeasured pending live augment**, not zero. Wainee setbacks are **absent**. Gold living area 2800 is **present**. Travis living area is **absent-verified** (CAD row, structural fields null).

## leave_behind

```
leave_behind:
  - item: LDT POST_BODY still .strict() without parcel_node_id; PE omits it
    owner: property
    plan_row: P-60 / Lane 1 leftover
  - item: jurisdictionKey synthesized from city-less Travis situs → 404 no-district while card has SF-S table
    owner: property
    plan_row: P-58 serve / Lane 1
  - item: Bastrop card 25/5/25 vs live derive 30/10/30 on 34137 and 34073
    owner: property
    plan_row: P-58 / feasibility A3
  - item: hover hits[0] vs click PMTiles vs post-seal rings
    owner: property
    plan_row: P-60 Lane 1
  - item: search/inspect desync (scratch OPEN; not absorbed)
    owner: property
    plan_row: P-60
```

No product code written. No ingest started. Instrument and this file are uncommitted for the planner.
