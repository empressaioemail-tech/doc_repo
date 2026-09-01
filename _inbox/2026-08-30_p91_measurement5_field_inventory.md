---
id: 2026-08-30_p91_measurement5_field_inventory
title: "P-91 measurement 5: per-parcel field inventory from write paths"
date: 2026-08-30
status: measured
plan_row: P-91 v3 scoping measurement 5
---

# Measurement 5: what the twin serves per parcel, from write paths

Snapshot: repository `P:/tmp/legacy-design-tools-p91-stone` (registered clone of legacy-design-tools), branch `feat/p91-probe`, commit `8d94ddad`. The checked-out branch differs from origin/main only inside `artifacts/smartsite-mcp`; every path read below is under `artifacts/api-server/src` and is identical to main. All findings are from reading code, not output. No file outside the close artifact was written.

Raw snapshot output:

```
$ git log --oneline -1
8d94ddad feat(p91): p559 probe cut — boot strip measures net, gl, and the resources bridge for the map-ground decision
$ git branch --show-current
feat/p91-probe
```

## Serving topology (context for the table)

Three P-91 serialization surfaces, one loader:

1. `POST /property-explorer/v1/research/brief` depth `node` serves `assembleNodeBriefBody` (routes/propertyExplorer.ts): wrapper + `brief.sections` (`buildR1Brief`, lib/r1BriefCompose.ts) + optional `draw` (`tryAssembleParcelDrawFromReads` into `assembleParcelDraw`, lib/parcelDrawFromReads.ts + lib/parcelDrawStub.ts).
2. Depth `stub` (and the `stub` field on saved-properties rows and screen rows) serves `assembleStubBody` into `composeSmartSiteStub` (lib/smartSiteStub.ts).
3. Both depths read the bake through `loadBakedNodeFacetSnapshot` (routes/brokerageNodeFacets.ts), which SELECTs `place_layer_snapshots` under `adapter_key IN (node-facets:tier1, node-facets:tier2)` at `place_key = node:{parcelNodeId}`, then (a) strips the Tier-1 envelope to null (`stripZombieEnvelopeFromFacets`), (b) owner-strips (`sanitizeNodeFacetPayload`), (c) reduces the Tier-2 row to `{flood: null, floodDisposition, envelope: null, bakedAt, snapshotAt}` (`extractTier2Overlay` / `disposeTier2Flood`, every variant a typed refusal), and (d) derives `envelopeBriefRefusal` from the RAW payload before the strip (`extractEnvelopeBriefRefusal`, lib/envelopeBriefRefusal.ts).

Live atom reads on the node path (all against the atoms store, `ATOMS_DATABASE_URL`, table `atoms`, except structural and city limits): flood-hazard-fact, property-boundary-edge, rrc-pipeline-fact, well-fact, special-district-fact, plus structural (deployment store `cad_property` via `makeCadPropertyLookup(db)`, lib/structuralFactRead.ts). The stub path performs only the flood atom read; drainage is passed `{attempted: false}`.

## Field inventory

Column key. Where: brief wrapper / section id / draw / stub / route. States: what the write path can actually emit today (type-allowed states that no path produces are in the second list at the end).

### Brief wrapper (assembleNodeBriefBody, routes/propertyExplorer.ts)

| Field | Where | Write path | Possible states | Upstream |
|---|---|---|---|---|
| runId | brief wrapper | `buildR1RunId` (propertyExplorer.ts) | always present | derived: base64url(parcelNodeId) + base64url(bakedAt or "undated") |
| reportFamily | brief wrapper | `assembleNodeBriefBody` | constant "R1" | none |
| mode | brief wrapper | `assembleNodeBriefBody` | constant "baked-facet-intel-v1" | none |
| parcelNodeId | brief wrapper, stub, draw.node | echo of request | always present | caller |
| brief.sections[] | brief wrapper | `buildR1Brief` (r1BriefCompose.ts) | always 5 sections | see per-section rows |
| brief.disclosure[] | brief wrapper | `verbatimValues` over {facets, tier2}, keys districtNote / disclosure / emptyReason | present or empty array | any such key in served facets/tier2. Post-strip the Tier-1 envelope (the one bake facet carrying `disclosure`) is null and the Tier-2 overlay carries none of these keys, so the sweep finds strings only if a legacy row carries them elsewhere |
| citations | brief wrapper | union of section citations | present or empty | section citations (below) |
| bakedAt | brief wrapper | facets.bakedAt else snapshot.snapshotAt | string or null | Tier-1 bake `bakedAt` / `place_layer_snapshots.snapshot_at` |
| source | brief wrapper | `assembleNodeBriefBody` | constant "baked-snapshot" | none |
| draw | brief wrapper | `tryAssembleParcelDrawFromReads` | present or OMITTED (any `assertDrawStub` throw is caught and the key is dropped, fail closed) | see draw rows |

Every section carries the envelope fields id, title, data, citations[], asOf, disposition, plus optional refusal, reason, citationsDegraded, zoneExposureSummary (flood only), agentGuidance (setbacks-envelope only). `citationsDegraded: true` is set whenever disposition is present and no http citation URL was found (`withCitationPosture`). `urlsFrom` harvests only keys named sourceCitation / citationUrl / sourceUrl or matching citation-or-source-plus-url, with http(s) values.

### Section: zoning

| Field | Where | Write path | Possible states | Upstream |
|---|---|---|---|---|
| data (verbatim facets.zoning) | section zoning | `buildR1Brief`; disposition `zoningDisposition` | present (record with non-empty district / zone / code / zoningCode, or a bare string) or absent (null data still serialized). refused and unread cannot occur on this section | Tier-1 bake `assembleTier1Payload` (nodeFacetTier1Assemble.ts): `txgio_parcel` (or `txgio_parcel_staging`) columns `zoning_district` / `zoning_jurisdiction` joined by (county_fips, prop_id) (nodeFacetTier1ParcelJoin.ts), jurisdiction via `resolveZoningJurisdiction`, provenance via ZONING_LAYERS (`zoningProvenanceFromLayer`) |
| data.district | inside zoning data | bake, verbatim | non-empty string when present | `txgio_parcel.zoning_district` |
| data.jurisdictionKey | inside zoning data | bake | string or null | PIP stamp `zoning_jurisdiction`, situs-city fallback, or sole wired layer |
| data.provenance (incl. sourceUrl) | inside zoning data | bake | present only with district and a resolved layer | ZONING_LAYERS layer record; sourceUrl doubles as the section citation |
| citations | section zoning | `urlsFrom(root.zoning)` | urls or empty (then citationsDegraded on present) | zoning.provenance.sourceUrl |
| asOf | section zoning | `asOfFrom(zoning)` else bakedAt | string or null | provenance vintage keys, else bake timestamp |

Note: on this PE path the zoning verdict layer (`zoningVerdictFromCityLimits`) is NOT attached; that enrichment runs only on the brokerage facets route. The brief serves the bake's zoning verbatim.

### Section: setbacks-envelope

| Field | Where | Write path | Possible states | Upstream |
|---|---|---|---|---|
| data | section setbacks-envelope | `composeSetbacksEnvelopeBriefSection` | On this path always null: `loadBakedNodeFacetSnapshot` nulls the envelope before compose, and `extractEnvelopeBriefRefusal` (total, always `state: "refused"`) supplies the refusal, so disposition is always refused today. The present branch (envelope with geojson or status ok / no-buildable-area) is unreachable via PE | raw Tier-1 payload envelope (always `status: "declined"` from `computeTier1Envelope`) |
| refusal | section setbacks-envelope | `extractEnvelopeBriefRefusal` (envelopeBriefRefusal.ts) | `{state: "refused", code: not-in-bake / declined-in-bake / baked-envelope-not-served, producer: "baked-envelope-facet", supersededBy: "buildable-envelope", reason, declineReason?, bakeStatus?}` | raw Tier-1 payload envelope + facetCoverage.envelope |
| agentGuidance | section setbacks-envelope | `envelopeAgentGuidance` | one of three fixed strings keyed by refusal code | derived |
| asOf | section setbacks-envelope | bakedAt | string or null | bake timestamp |

### Section: flood

| Field | Where | Write path | Possible states | Upstream |
|---|---|---|---|---|
| data (FloodHazardFactPresent) | section flood | `composeFloodBriefSection` over `loadFloodHazardFactAtom` (floodHazardFactRead.ts) | present / absent / refused (unread impossible: the read is always attempted). Fields on present: state, source, boundAs, tried[2], entityId, inSpecialFloodHazardArea, floodZone, zoneSubtype, baseFloodElevation, sourceAdapter, sourceVintage, sourceCitation, evaluatedAt. Typed absence: absence{kind, reason} or null, verifiedAbsence, sourceTier, sourceAdapter | atoms store (hauska_mcp, `ATOMS_DATABASE_URL`), entity_type `flood-hazard-fact`, dual-grammar entity_id `{fips}:{prop}` and `{fips}:{prop}.00000000` |
| refusal | section flood | refused reads (atom-miss / bind-conflict / atoms-store-not-configured / malformed-atom); on atom-miss falls back to `tier2.floodDisposition` when a Tier-2 row exists | the fact refusal, or the baked Tier2FloodDisposition (retired-instrument / unrecognised-producer / no-flood-facet; all-refusal type) | atom read; `place_layer_snapshots` node-facets:tier2 row producer |
| zoneExposureSummary | section flood | `summarizeFloodZoneExposure`; withheld (null) while citationsDegraded (F2) | string or null; only with disposition present | derived from floodZone / zoneSubtype / inSpecialFloodHazardArea / baseFloodElevation |
| citations | section flood | `urlsFrom(floodHazardFact)` | urls (sourceCitation when http) or empty | atom body sourceCitation |
| asOf | section flood | evaluatedAt (present) / asOfFrom (absent) / null (refused) | string or null | atom body |

### Section: land-use

| Field | Where | Write path | Possible states | Upstream |
|---|---|---|---|---|
| data (verbatim baseFacts.landUse) | section land-use | `buildR1Brief`; disposition `landUseDisposition` | present (non-empty code / landUseCode) or absent; refused / unread cannot occur | Tier-1 bake: conformant path maps the cad-parcel-roll claim's `propertyUseCode` + `ptadLandUseDescription` + taxYear-as-vintage (source "cad-roll"), or the owner-gated situs-address recovery join (source "cad-roll-address-join"); legacy path the CAD roll prop_id join. Fields written: code, description, source, vintage |
| citations | section land-use | `urlsFrom(baseFacts.landUse)` | Always empty on today's bake shape (no citation-keyed urls in the landUse facet), so citationsDegraded: true whenever present | none in bake |
| asOf | section land-use | `asOfFrom(landUse)` (vintage key qualifies) else bakedAt | string or null | landUse.vintage (tax year string) |

### Section: drainage

| Field | Where | Write path | Possible states | Upstream |
|---|---|---|---|---|
| data / reason | section drainage | `composeDrainageBriefSection` over `drainageDisposition(facets.drainage)` | Today always unread with reason "drainage facet not produced for this parcel" (F7): no bake writes a drainage facet (grep over both Tier-1 bakes, Tier-2 bake, assemble, parcel join and both CLIs matches nothing). Code allows present / absent / refused when a producer lands | none exists |

### Draw (ParcelDrawStub; attached to node-depth brief as `draw`)

| Field | Where | Write path | Possible states | Upstream |
|---|---|---|---|---|
| node | draw | `assembleParcelDraw` | always | parcelNodeId |
| kind | draw | constant "parcel" | always | none |
| label | draw | `situsLabel` via `firstPresentSitusLabel` (parcelDrawFromReads.ts, situsCompose.ts) | first non-punctuation candidate of facets.situsAddress, facets.address, baseFacts.situsAddress, baseFacts.address; else the node id | bake baseFacts (claim situsAddress / txgio situs_address) |
| url | draw, stub | constant prefix + node id | always `https://smartsite.cloud/p/{id}` | derived |
| asOf | draw | input.bakedAt | string or null | bake timestamp |
| frame (units, origin, yAxis, convertedFrom, factor, quality) | draw | constants in `assembleParcelDraw` | always the fixed record (ft / centroid / true-north / local-enu-m / us-survey-foot / gis-approximate) | none |
| ring, ringOrder | draw | boundary edges' `interior.edgeEndpoints`, metres to US survey feet | present only when boundary read is present, every edge parses; else omitted and a boundary overlay (unknown, hatch-interior) is unshifted | property-boundary-edge atoms (atoms store, entity_id `{fips}:{prop}:boundary:{edgeIndex}`, prefix-range dual grammar) |
| edges[].id | draw | edge entityId | present with ring | boundary atom entity_id |
| edges[].role | draw | edge role else `index-{edgeIndex}` | always on emitted edges | atom body role |
| edges[].seg | draw | index pair | always on emitted edges | derived ordering |
| edges[].ft | draw | propertyLineTags.distanceFeet, else computed from endpoints | number (never null in practice: the fallback always computes) | atom body propertyLineTags / geometry |
| edges[].bearing | draw | propertyLineTags.bearing | string or null | atom body |
| edges[].adjacency | draw | adjacencyKind | string or null | atom body |
| edges[].roadNode | draw | facingRoad.roadNodeId | string or null | atom body |
| edges[].roadClass | draw | facingRoad.classification | present or omitted | atom body |
| edges[].neighbor | draw | `{fips}:{parcelNeighborPropId}` | present or omitted | atom body + node fips |
| edges[].state | draw | constant "present" | always | none |
| attrs.zoning | draw | `zoningAttrs` (parcelDrawStub.ts) | omitted unless a district resolves; then {v, jurisdiction?, matchBasis?, codeRefs?+refBasis?, state: "present"} | bake zoning (district via district / zone / code; jurisdiction via cityKey / jurisdiction / jurisdictionKey) |
| attrs.landUse | draw | `landUseAttrs` | omitted unless a code resolves; then {v, desc?, taxYear?, state, citations or citationsDegraded} | bake baseFacts.landUse (code via landUseCode / code) |
| attrs.yearBuilt | draw | `yearBuiltFromStructural` else `yearBuiltFromBake` | {v, state: "present"} or omitted | structural read: deployment store `cad_property` by (county, prop_id) at the declared CAD vintage (structuralFactRead.ts, cadPropertyLookup); bake fallback reads facets.yearBuilt / baseFacts.yearBuilt, keys the Tier-1 payload never writes |
| overlays[] flood | draw | `floodOverlay` | present (label Zone X..., sfha flag, scope parcel-wide, draw tint-ring, citations or citationsDegraded); absent maps through `verifiedAbsence` but `floodInput` supplies no sourceVintage so the result is always state unknown with reason "provenance unknown; vintage unknown"; refused maps to state unknown "Flood record not checked" | live flood-hazard-fact read |
| overlays[] footprint | draw | fixed block in `assembleParcelDraw` | always state unknown, draw hatch-interior; label carries yearBuilt when known ("Structure of record (YYYY), footprint unmeasured") | yearBuilt only; the building-footprint atom read exists (buildingFootprintFactRead.ts, served on the brokerage facets route) but is not wired into the draw |
| overlays[] envelope | draw | fixed block | always state refused, draw suppress-setback-line, reason = envelope refusal declineReason / code / "atom_path_pending" | envelopeBriefRefusal |
| overlays[] pipeline | draw | pipeline branch | present-outside: verifiedAbsence over sourceVintage, so absent-verified (known vintage) or unknown (degraded / missing), label "No pipeline within N ft" (`feetLabelFromMetres` on bufferMeters); present-near: state present; absent: `pipelineInput` drops vintage so always unknown; refused: unknown "Pipeline records not checked" | rrc-pipeline-fact atoms (bare parcelNodeId keys; write-time buffer intersect) |
| overlays[] specialDistrict | draw | sd branch | present: label districtName else districtId else "special district"; absent: `specialDistrictInput` supplies no sourceVintage so always unknown; refused: unknown "Special districts not checked" | special-district-fact atoms (`:sd:` suffix keys) |
| overlays[] well | draw | well branch | present "Well of record"; absent: no sourceVintage supplied so always unknown; refused: unknown "Well records not checked" | well-fact atoms (entity_id `{parcelNodeId}:{wellKey}`, write-time 152 m attach) |
| overlays[] boundary | draw | miss branch | present only as state unknown "Parcel boundary unmeasured" when the ring cannot be built; absent otherwise | boundary read outcome |
| confidence | draw | constant "seed" | always (assertDrawStub refuses any calibratedConfidence / 0.7 / 0.9 float on the wire) | none |

### Stub (SmartSiteStub; depth stub, saved-properties `stub`, screen row `stub`)

| Field | Where | Write path | Possible states | Upstream |
|---|---|---|---|---|
| parcelNodeId, label, url | stub | `composeSmartSiteStub` + `composeSitusLabel` | label from facets.situsAddress else baseFacts situs parts joined; node id + situs "unknown" when punctuation-only or empty | bake baseFacts situs fields |
| situs | stub | `composeSitusLabel` | present or unknown only | same |
| zoning | stub | `zoningDisposition` mapped by `railStateFromSectionDisposition` | present or unknown (absent maps to unknown; refused / unread unreachable) | bake zoning |
| landUse | stub | `landUseDisposition` mapped | present or unknown | bake baseFacts.landUse |
| flood | stub | `railStateFromRead` over the live read (always attempted on both PE callers) | present, unknown (typed absence or atom-miss), refused. unread only if a caller ever skips the read | flood-hazard-fact atoms |
| drainage | stub | not attempted, falls to `drainageDisposition(facets.drainage)` | always unread today (no producer) | none exists |
| envelope | stub | `envelopeDisposition(stripped null, refusal)` mapped | always refused today | envelopeBriefRefusal |

Saved-properties list rows additionally default every rail to "unread" when `assembleStubBody` returns null (no baked snapshot). Screen rows carry `stubRead: ok / error / skipped` beside the rails (error and skipped paint all six rails unread).

### PE route per-parcel fields not in the three composers (routes/propertyExplorer.ts)

| Field | Where | Write path | Possible states | Upstream |
|---|---|---|---|---|
| property {parcelNodeId, unlocked, freeMessagesUsed, freeMessagesLimit} | GET /entitlement?parcelNodeId= | `isPePropertyEntitled`, `getPeFreeChatMessagesUsed` | present only authenticated + valid id | pe_property_unlocks / chat usage rows |
| id, parcelNodeId, label, snapshot, crmStatus, status, note, updatedAt, situs | GET /saved-properties rows | drizzle select + `projectSavedPropertyLabel` | label composed (never punctuation-only); status echoes crmStatus; snapshot is the client-written blob stored verbatim at PUT | `pe_saved_properties` (peSavedProperties) |
| ok, parcelNodeId | PUT / DELETE saved-properties | upsert / delete | ok or typed errors | same table |
| screen {id, name, createdAt, updatedAt, rows[], degraded?, stubsDegraded?}; row {id, ordinal, parcelNodeId, query, resolution, source, candidates?, resolveTimedOut?, stub?, stubRead?} | screens create / get / rows | `createScreen` / `listScreens` / `addToScreen` + `attachScreenStubs` (peScreenSave.ts) | per ScreenRow type; stub never stored, painted at response time under SCREEN_STUB_BUDGET_MS | screen store + `assembleStubBody` |
| parcelNodeId, status, note | POST save / status (MCP writes) | `saveProperty`, `setPropertyStatus` | ok or typed errors | pe_saved_properties |
| parcelNodeId, label, updatedAt, snapshot | GET /internal/share-dossier (service token) | drizzle select | 404 when no row | pe_saved_properties (sharer's row) |
| runId, contract, parcelNodeId, layers[], degraded, reason?, source | GET /research/layer-manifest/:runId | `manifestLayers` | layers[] can only carry {id: "buildable-envelope", kind: "geojson", feature, source}; on this path the loader nulls facets.envelope first, so layers is always empty and degraded always true, reason naming the Tier-2 flood refusal or no-row | stripped bake |
| error bodies parcel_not_found / baked_snapshot_not_found / lookup_unavailable | brief miss | `sendBriefMiss` + `cortexNodeLookup` existence probe | 404 / 404 / 503 | parcel store probe |
| records-request bodies (jobId, engagementId, parcelNodeId, jobs, inbox, artifacts) | /records-request routes | recordsRequestService et al. | per-flow | records-request tables; out of the twin field scope, listed for completeness |
| hydrology / subsurface | POST research routes | static 503 | always `{error: "spine_degraded", reportFamily R7 / R10, degraded: true}` | none (declared degrade) |

## In the bake but not serialized to any P-91 section, draw, or stub

From the Tier-1 payload (`Tier1FacetPayload` / `ConformantTier1Payload`, written to `place_layer_snapshots` under node-facets:tier1; upstream per facet: cad-parcel-roll atoms on hauska_mcp for the conformant claim fields, `txgio_parcel` / `txgio_parcel_staging` for ring, zoning stamp and situs_state, PTAD description table for land-use description):

- `baseFacts.apn` (read only as a label fallback never reached; not serialized as a field)
- `baseFacts.acreage` {value, sqft, method}
- `countyFips`, `countyName`, `tier`, `facetSchemaVersion`
- `facetCoverage` (all five flags; read only inside `extractEnvelopeBriefRefusal`)
- the whole `provenance` block: parcelSource, parcelVintage, landUseSource, landUseAddressRecovered, roadsPending, tierNote, landUseGateBlocked, zoningSource, and (conformant) parcelJoin
- conformant wrapper keys: shapeSource, baked, source, access, accessNormalizedFrom, publishRunId, `facets.base`
- the stored Tier-1 envelope facet content (status, declineReason, disclosure, jurisdictionKey): nulled at serve; only its projection into the refusal codes survives
- the bake coord index (lat_rounded / lng_rounded, served on the snapshot as `queryPoint`): consumed by the brokerage facets route's city-limits read, unused by brief / draw / stub

From the Tier-2 payload (node-facets:tier2): the stored FEMA flood facet (status, floodZone, inSpecialFloodHazardArea, zoneSubtype, baseFloodElevation, provenance) and the Tier-2 envelope are never served anywhere on these paths; only the derived `floodDisposition` refusal, `bakedAt`, `snapshotAt` cross the wire (SS-W16).

Caveat outside this task's serve scope: the anonymous brokerage facets route (`GET /node/:parcelNodeId/facets`) serves the whole sanitized facets object, so several of the above do reach THAT surface; the list here is scoped to the P-91 brief / draw / stub surfaces as instructed.

## Named in code but never populated (write path can only produce null or absent today)

1. Drainage, everywhere: section always unread with the F7 reason; stub rail always unread. No producer writes `facets.drainage` (verified by grep over both Tier-1 bake modules, the Tier-2 bake, the assembly, the parcel join and both CLIs: zero matches).
2. Setbacks-envelope present: `loadBakedNodeFacetSnapshot` nulls the envelope before compose and `extractEnvelopeBriefRefusal` is total, so the section is always refused via PE; the present branch of `composeSetbacksEnvelopeBriefSection` and the stub envelope rail's present state are unreachable on this path.
3. Layer manifest `buildable-envelope` layer: `manifestLayers` reads `facets.envelope.geojson` from the same stripped snapshot, so layers is always empty, degraded always true.
4. Draw `attrs.zoning.matchBasis`, `codeRefs`, `refBasis`: `zoningAttrs` reads `matchBasis`, `sourceCodeAtomRef.atomDid`, `codeSectionRefs.*.atomDid`; the Tier-1 assembly writes none of those keys.
5. Draw `attrs.landUse.desc`: reader keys are `landUseDescription` or `desc`; the bake writes `description`. Key mismatch, cannot populate from the facet it reads.
6. Draw `attrs.landUse.taxYear`: reader keys `taxYear`; the bake writes `vintage`. Cannot populate from the bake (the comment in landUseAttrs anticipates the land-use-fact atom shape, which this path does not read).
7. Draw `attrs.landUse` citations: no citation-URL key exists in the baked landUse facet, so a present landUse always ships `citationsDegraded: true`.
8. Draw yearBuilt bake fallback: `yearBuiltFromBake` reads `facets.yearBuilt` / `baseFacts.yearBuilt`, keys no Tier-1 bake writes; only the structural `cad_property` read can populate `attrs.yearBuilt`.
9. Draw absent-verified for flood, well, and specialDistrict, and for pipeline plain-absent: the input types carry `sourceVintage` but `parcelDrawFromReads` maps every absent read as bare `{state: "absent"}` (and the typed absences themselves carry no sourceVintage field), so `verifiedAbsence` always returns `state: "unknown"` with "provenance unknown; vintage unknown". The only absent-verified the draw can emit today is pipeline present-outside (nearPipeline false with a known sourceVintage).
10. Stub absent-verified: `railStateFromRead` supports it for kind pipeline and kind sd, but `composeSmartSiteStub` accepts only flood and drainage read inputs and no stub rail exists for pipeline or special district, so no caller can produce an absent-verified rail.
11. Draw footprint overlay present state: no footprint read is wired into the draw input (the building-footprint atom read exists and is served on the brokerage facets route only), so the overlay is always state unknown.
12. `Tier2Overlay.flood` and `.envelope`: typed as literal null; `Tier2FloodDisposition` is an all-refusal union, so no non-refusal flood value can cross this wire by type.
13. Brief zoning and land-use sections refused / unread: their disposition predicates return only present or absent.

## Verification (exit-bounded, raw output)

Section ids. The one-line grep undercounts because the setbacks-envelope call is multi-line; the union type is the authoritative enumeration and the call count includes the function definition line:

```
$ grep -A6 'export type R1BriefSectionId' lib/r1BriefCompose.ts
export type R1BriefSectionId =
  | "zoning"
  | "setbacks-envelope"
  | "flood"
  | "land-use"
  | "drainage";

$ grep -c 'sectionFromParts(' lib/r1BriefCompose.ts
6
$ grep -oE 'sectionFromParts\("[a-z-]+"' lib/r1BriefCompose.ts
sectionFromParts("zoning"
sectionFromParts("flood"
sectionFromParts("land-use"
sectionFromParts("drainage"
```

(5 union members; 6 `sectionFromParts(` occurrences = 1 definition + 5 calls, of which 4 carry the id inline and the setbacks-envelope call spans lines 500-504.)

Overlay ids in parcelDrawStub.ts (multiple occurrences are branch arms of the same overlay):

```
$ grep -oE 'id: "[a-zA-Z]+"' lib/parcelDrawStub.ts | sort | uniq -c
      2 id: "boundary"
      1 id: "envelope"
      3 id: "flood"
      1 id: "footprint"
      4 id: "pipeline"
      3 id: "specialDistrict"
      3 id: "well"
```

(7 distinct overlay ids: boundary, envelope, flood, footprint, pipeline, specialDistrict, well.)

Drainage producer check:

```
$ grep -rn 'drainage' lib/nodeFacetBakeTier1.ts lib/nodeFacetBakeTier1Conformant.ts lib/nodeFacetBakeTier2.ts lib/nodeFacetTier1Assemble.ts lib/nodeFacetTier1ParcelJoin.ts nodeFacetBakeTier1Cli.ts nodeFacetBakeTier2Cli.ts
exit=1
```

Files read in full or in the cited ranges: lib/r1BriefCompose.ts, lib/parcelDrawStub.ts, lib/smartSiteStub.ts, lib/parcelDrawFromReads.ts, lib/floodHazardFactRead.ts, lib/envelopeBriefRefusal.ts, lib/situsCompose.ts, lib/smartSiteBriefRequest.ts, lib/structuralFactRead.ts, lib/structuralFactResolve.ts (head), lib/nodeFacetTier1Assemble.ts, lib/nodeFacetBakeTier1.ts, lib/nodeFacetBakeTier1Conformant.ts, lib/nodeFacetBakeTier2.ts, lib/nodeFacetTier1ParcelJoin.ts, lib/nodeFacetTier1Constants.ts, lib/nodeFacetTier2Constants.ts, lib/peScreenSave.ts (type surface, lines 1-200), routes/propertyExplorer.ts (all 1995 lines), routes/brokerageNodeFacets.ts (lines 1-743), plus type bodies of boundaryEdgeFactRead.ts, pipelineFactRead.ts, wellFactRead.ts, specialDistrictFactRead.ts. Not read: the Tier-1/Tier-2 bake CLIs in full (payload key surface confirmed by grep and by the shared assembly module they import).
