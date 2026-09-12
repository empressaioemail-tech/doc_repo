---
id: 2026-09-12_ops23_wave2_verify_panel_and_findbox
date: 2026-09-12
rows: [P-152, P-172]
kind: read-only verification
snapshot:
  hauska-map: origin/main 8b44f68 (8b44f68db96d11624ed08631e01baa3d7b6b9814, 2026-09-11 17:32 -0500)
  legacy-design-tools: origin/main 6b579020 (6b57902035d3bcd583ff01e6a6f06eb6aa738895, 2026-09-11 19:00 -0500)
  doc_repo: OPS-16 read from the working tree at HEAD 7da933b9
method: git fetch + git show/grep against origin/main only; no checkout, build, npm, or DB read
---

# OPS-23 wave 2 fact check: panel read path (P-152) and Find box (P-172)

## Part A, the panel's read path

### A1. `apps/property-explorer/api/_lib/pe-property-atoms.ts` (714 lines)

Two upstreams. Retrieval: line 348 `${baseUrl}/property-nodes/${encodeURIComponent(parcelNodeId)}/atom-chain`, base from `HAUSKA_RETRIEVAL_API_URL` or `RETRIEVAL_API_URL` (81-82), default 52-53 `https://hauska-retrieval-api-h7gvu7rgcq-uc.a.run.app`. Cortex: 139-141 `${baseUrl}/api/brokerage/v1/place/node/${parcelNodeId}/facets`, base `CORTEX_API_URL` (default 54). The `/record` route: NOT FOUND (grep `/record` across the file and all of `api/` matched nothing).

Flow at 604-636: atom-chain fetched, `adaptAtomChainToBakedFacets` (614), cortex facets merged by `mergeBakedBaseFacts` (629), `X-PE-Read-Path` set (636). The cortex call forwards the `pe_session` cookie as Bearer when present, else the service key (104-117, 551-553).

### A2. `apps/property-explorer/api/_lib/atom-chain-to-facets.ts`

2038 lines, 62 exports. Load-bearing: `adaptAtomChainToBakedFacets` (1762), `mergeBakedBaseFacts` (1539), `attachBuildablePctFromKnownLotArea` (1671), plus one `*FactFromCortexRoot` copier per family (909-1419).

`PeBakedFacetsResponse` (682-770) top-level keys: `parcelNodeId, adapterKey, source, snapshotAt, facets, readPath, baseFactsMerged, floodHazardFact, landUseFact, specialDistrictFact, pipelineFact, wellFact, buildingFootprintFact, boundaryEdgeFact, ownerFact, cityLimitsFact, structuralFact, schoolDistrictFact, utilityServiceFact, overlayDistrictsFact, agValuationFact, maxImperviousCoverPctFact`.

`facets` (`PeBakedFacetPayload`, 225-343): `parcelNodeId, countyFips, countyName, baseFacts{apn, situsAddress, situsCity, situsState, landUse, acreage, cadRoll{marketValue, assessedValue, landValue, improvementValue}}, zoning, envelope, facetCoverage, livingAreaSqft, yearBuilt, yearBuiltSource, provenance, bakedAt`.

What the atom chain alone emits (1996-2036):

```
baseFacts: apn ? { apn, landUse: null, acreage: null, situsAddress: null } : undefined,
zoning: district ? { district, ...jurisdictionKey } : null,
envelope: ...,
facetCoverage: { baseFacts: !!apn, landUse: false, acreage: false, zoning: !!district, envelope: envelopeCovered },
provenance: { parcelSource: "property-atom-chain", ... },
```

Everything else in `baseFacts` and every `*Fact` sibling is copied from cortex inside `mergeBakedBaseFacts`. `readPath` values: `"atom-chain" | "atom-chain-warm"` (688, 1998); the BFF header adds `cortex`, `cortex-fallback`, `atom-pending` (pe-property-atoms.ts 73-77, 560, 648).

### A3. The tax-assessed value row

Reader: `apps/property-explorer/src/lib/fact-sheet-resolver.ts:597` `taxValuationFromCadRoll`, line 608 `const cadRoll = facets.baseFacts?.cadRoll;`, labels 619-624 (`Market`, `Land`, `Improvement`, `Assessed`), invoked at 2598. Basis line: `src/lib/valuation-basis.ts:244` `return \`From ${county}'s own appraisal-roll export.\`;`. The only facets fetch feeding the sheet is resolver 2432 `fetchBakedNodeFacets(parcelNodeId, this.facetsBase)` with `facetsBase = PE_FACETS_PROXY_BASE = "/api/spine/property-atoms"` (2350; `src/lib/config.ts:22`). `taxAssessed`, `valueHistory`: NOT FOUND in `src` or `api`.

So the dollars are cortex `baseFacts.cadRoll` merged at atom-chain-to-facets.ts 1580-1600. Mechanism for "probe sees `cadRoll: null`, card prints dollars": cortex gates the four rails Studio, Team, or Property Unlock and emits `{state: "refused", code: "studio-gated"}` per field to everyone else (LDT `lib/cadRollValue.ts:452-460`; `routes/brokerageNodeFacets.ts:220-236`, 895-905). The BFF guard `isCadRollValueWire` (215-222) admits only `present | zero | absent`, so a refused wire collapses to `null` at 1583-1596. An anonymous probe reads `null`; a browser carrying `pe_session` gets `present` wires. Second mechanism considered: a direct client fetch of cortex facets. Rejected: `CORTEX_PROXY_BASE` is used by the resolver only for live envelope (2558), buildable-envelope (2777) and gis-layer (2848). Not verified live: that the probe was anonymous. Side finding: the BFF turns a typed refusal into `null`, so the client renders "no CAD tax-assessed valuation on the county roll" (613-617) instead of the studio-gated upgrade cue it already handles (632-640).

### A4. Cortex routes still called for facts

| route | file:line |
|---|---|
| `GET /api/brokerage/v1/place/node/:id/facets` | `api/_lib/pe-property-atoms.ts:139`; `api/_lib/pe-share-view-compose.ts:77`; `src/lib/baked-facets.ts:1052` (only when the base is not `/property-atoms`) |
| `GET /api/brokerage/v1/place/situs-search` | `api/_lib/pe-situs-search-core.ts:61`; `api/pe-situs-search.ts:6` |
| `POST /brokerage/v1/place/buildable-envelope` | `src/lib/buildable-envelope.js:208` via `/api/spine/cortex/api` (`config.ts:15`); resolver 2777; `parcel-lookup.ts:230` |
| `/brokerage/v1/map-data/gis-layer` | `src/lib/fact-sheet-resolver.ts:2848` |
| `/api/brokerage/v1/gtm/*` | `api/pe-gtm.ts:153` |
| `/api/spine/cortex/api/pe-help/chat` | `src/lib/help-widget-client.ts:21` |

`propertyExplorer` appears in PE src and api only in comments (`pe-share-brief.ts:10`, `brief-view-model.ts:10`, `portalClient.ts:17`, `pe-terms-cancellation.ts:28`).

### A5. LDT `artifacts/api-server/src/routes/propertyExplorer.ts` (2693 lines)

Registers 43 routes, all `/property-explorer/v1/*` (mounted `routes/index.ts:82`): entitlement (540), saved-properties (575, 636, 685, 934, 969), screens (813-899), claim-session and claim-local-state (1020, 1066), research brief, hydrology, subsurface, layer-manifest (1244-1383), billing and entitlement checkout (1540, 1885-1887), share-grants and share-dossier (1195, 1998-2057), records-request family (2117-2430), ai-connections, team, unlocks, activation-events (2477-2671). It assembles no parcel facts. The facts route is `routes/brokerageNodeFacets.ts` (`GET /api/brokerage/v1/place/node/:parcelNodeId/facets`, 1009 lines), response object 885-935:

```
parcelNodeId, adapterKey: TIER1_ADAPTER_KEY, source: "baked-snapshot", snapshotAt,
facets: gateCadRollValuationOnFacets(attachCadRollOverlaysToFacets(attachVerdictLayersToFacets(
  snapshot.facets, structuralFact, zoningVerdict, cadRollOverlay.livingAreaSqft, parcelRecordZoningFact), cadRollOverlay), grantsOwnerFact),
tier2, floodHazardFact, landUseFact, specialDistrictFact, pipelineFact, wellFact, buildingFootprintFact, ...
```

Split today: zoning and envelope come from the retrieval atom chain; apn, situs, landUse, acreage, cadRoll, yearBuilt, livingArea and every `*Fact` sibling come from cortex.

## Part B, the Find box

### B6. Component and submit

`apps/property-explorer/src/browse/SearchBar.tsx:536` (placeholder). Typeahead `fetchMergedSearchSuggestions` (`src/lib/geocodeClient.ts:56-87`) fires in parallel `GET /api/pe-situs-search?q&limit=7` (`situs-search-client.ts:29`) and `GET /api/pe-geocode?q&limit&lat&lon&zoom` (`geocodeClient.ts:33-42`; extra `q Street`, `q Drive` calls for a bare house-plus-street query, 69-71), merging situs first (86). Enter or Find with no highlighted row calls `onSubmitRaw(q)` (502, 578), which is `runParcelLookup` (`ExplorerMap.tsx:2208`, 1002), which calls `resolveLookupToParcelNodeId` (1024; `src/lib/parcel-lookup.ts:141`). Order there:

1. parcel-node-id form, returned directly (156-162);
2. bare place query refused, "Pick a row from the list" (164-169);
3. bare house-plus-street refused as ambiguous (170-172);
4. address form: `fetchUniqueSitusPin` against `/api/pe-situs-search` with `situsQueryVariants` (174-190, 269-300; variants at `search-kinds.ts:274-310` strip a trailing state and a trailing non-suffix token, so the split form also tries `414 SPILLER LN, WEST LAKE HILLS` and `414 SPILLER LN`);
5. current-subject situs match (192-204);
6. `POST /brokerage/v1/place/buildable-envelope { address }` through cortex (206-236);
7. honest miss (247-250).

No street or place form exists on submit; those kinds are suggestion rows only (`executeSearchLanding`, `ExplorerMap.tsx:1329`). The fallback is unlabelled: `source: "address"` is returned for both the situs hit (185) and the envelope-derived id (259). Client-side hazard: `fetchUniqueSitusPin` applies `cityHintFromQuery` (285-289, 303-315) and keeps only hits whose `situsAddress` contains the last query token, `hills` for the split form.

### B7. Server branch

`/api/pe-situs-search` (`api/pe-situs-search.ts:1-7`) proxies cortex `GET /api/brokerage/v1/place/situs-search` (`pe-situs-search-core.ts:53-61`). LDT `routes/brokeragePlaceSitusSearch.ts:28-70`: parcel-id regex branch (43-53), then `searchPlaceByPrefix` (55-58). No geocoder in that route or in `lib/txgioAddressResolve.ts` (grep `geocod|photon|nominatim|mapbox`: none). Inside `searchPlaceByPrefix` (1090-1216): out-of-coverage state short-circuit (1133-1139), `searchSitusByStreetKeys` on `txgio_parcel.situs_address` (1141-1155), prefix ILIKE fallback (1156-1179), `txgio_address` address points fill remaining slots (1197-1216). The geocoder lives only in `routes/brokeragePlaceBuildableEnvelope.ts` (`geocodeAddress` import line 45; ladder 207-218: explicit coords, then `txgio_address` rooftop, then fuzzy geocode "LAST resort, tagged with its true rung").

### B8. The situs index

Store `txgio_parcel` (`lib/db/drizzle/0053_txgio_parcel.sql`, `situs_city` line 30) with functional index `txgio_parcel_situs_norm_idx` on `(county_fips, <normalised first-comma segment of situs_address>)` (`0058_txgio_situs_addr_norm_idx.sql:48-50`; expression from `buildNormalizedStreetSql`, `txgioAddressNormalize.ts:649-663`: `upper(split_part(situs_address, ',', 1))`, strip periods, collapse spaces, `LANE` to `LN` and the rest). Schema carries `situs_address` and `situs_city` separately for every county including Travis (`nodeFacetTier1ParcelJoin.ts:157`). The search never reads `situs_city`: the locality filter is `strpos(upper(situs_address), city) > 0` (`txgioAddressResolve.ts:199-203`), so the city must sit inside the `situs_address` string. The bake records that Travis "leaves `situs_city` null on most of its roll" (`nodeFacetBakeTier1Conformant.ts:1742-1744`).

Normalisation of the two forms: `414 SPILLER LN` yields street key `414 SPILLER LN`, no locality. `414 SPILLER LN, WEST LAKE HILLS, TX` yields the same street key (first-comma segment, `normalizeStreetLineCandidates` 516-523) plus `{city: WEST LAKE HILLS, state: TX}` from `parsePlaceSearchLocality` (348-354), which adds the `strpos` predicate. Code-derived consequence, not measured: if the Travis `situs_address` row is the bare street line, the city-qualified form filters the true row out server-side, and `cityHintFromQuery` repeats the cut client-side. Whether `48453:113408` carries a bare or composed `situs_address` was NOT read (no DB access here); it is the first live check P-172 must run.

### B9. P-27 row, `90_operations/OPS-16_texas_market_plan_of_record.md:72`, verbatim

`| P-27 | 4 | Address-to-parcel resolver (situs 99.3% populated; blocks API/paste-a-list/MCP lookup) | market surface | exact/ambiguous/not-found verdicts live | in/out of launch: needs ruling | SCOPED |`

Ruling A-012 (line 107, item 6): "P-27 ruled OUT of gate, FIRST post-gate build — planning captured in `_decisions/2026-08-13_p27_address_to_parcel_post_gate.md`". A-018 (line 114) disputes the 99.3% figure. P-172 (line 288) already cites "P-27 ruled the situs index over any geocoder".

## Searched and not found

`/record` in `pe-property-atoms.ts` and all of `apps/property-explorer/api`. `taxAssessed`, `valueHistory` in PE src and api. Geocoder terms in `brokeragePlaceSitusSearch.ts` and `txgioAddressResolve.ts`. Tables or modules named `situs_index`, `landing_parcel_situs`, `parcel_situs`, `situsIndex` in LDT api-server src and lib; the index is `txgio_parcel_situs_norm_idx` on `txgio_parcel`.

## Fleet memory

GROUND-TRUTH (2026-09-12, 8b44f68 / 6b579020): the PE facets BFF is retrieval atom-chain plus a cortex facets merge; no `/record` consumer exists anywhere in hauska-map.
LESSON: `isCadRollValueWire` drops `refused` wires to `null`; an anonymous BFF probe cannot see what a Studio session sees, and the client's studio-gated branch is unreachable through the BFF.
LESSON: situs locality filtering is substring-on-`situs_address`, never `situs_city`, on both server and client.
OPEN: read `txgio_parcel.situs_address` and `situs_city` for `48453:113408` before shaping P-172.

leave_behind: none
