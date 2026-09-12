---
id: 2026-09-12_ops23_wave3_verify_p152_lane3
date: 2026-09-12
row: P-152
kind: read-only verification (precedes the P-152 lane-3 mission)
snapshot:
  hauska-engine: 99f9146 (origin/main, 2026-09-12 10:44 -0500)
  hauska-map: 4350ab9 (origin/main, 2026-09-12 10:29 -0500; PR #390 merge 153e7be is an ancestor)
  hauska-factory: 7a94ae5 (origin/main, 2026-09-12 11:18 -0500)
  legacy-design-tools: 78ad8a51 (origin/main)
  hauska-mcp-server: 3b5626b (origin/main; carries no feasibility-export.ts)
method: git fetch + git show/grep on origin/main only; no working tree touched
---

# P-152 lane-3 fact check: where the feasibility PDF and the PE panel get their facts

## Part A: the feasibility report composer (hauska-engine 99f9146)

### A1. Fact source on the report path

`services/engine-api/src/routes/parcel-terrain.ts` refresh handler is `app.post("/:parcelNodeId/feasibility-export/refresh")` at line 754; composition runs detached in `runFeasibilityJob` (line 683). Facts enter at lines 713-715:

```
        factResolvers: LIVE_PARCEL_REPORT_FACT_RESOLVERS,
        resolver,
        setback,
        storage,
```

`storage` is the engine's own substrate Postgres, `storageFromEnv` line 284: `resolveSubstrateDatabaseUrl(env.SUBSTRATE_DATABASE_URL ?? env.DATABASE_URL)` (line 291). `LIVE_PARCEL_REPORT_FACT_RESOLVERS` (`packages/engine-core/src/site-plan/live-fact-resolvers.ts:25-30`) is four live reads: FEMA NFHL floodplain, USDA SSURGO soil, HIFLD electric, gas (declared absent).

The only outbound HTTP config on this route is `narrativeSectionFromEnv` (lines 271-277: `BROKERAGE_API_BASE_URL` + `SERVICE_API_KEY`), narrative text not facts, and per `feasibility-author.ts:156-160` it "was never configured"; generation is now in-process via `XAI_API_KEY`.

Searched the three named files, then `packages/engine-core/src/site-plan/**` and `services/engine-api/src/routes/**`, for `facets`, `CORTEX`, `node/`, `brokerage/v1`, `property-nodes/`, `/record`, `atom-chain`, `RETRIEVAL`. Hits: `narrative-section-client.ts:7,36` (the LDT narrative route) and `map-layers.ts:4,76,82` (a different route). **Report-path call to `/property-nodes/:id/record`: NOT FOUND**, as expected. Cortex facets read on the report path: NOT FOUND.

### A2. Per-fact sources in `report-model.ts` (`composeParcelReportFacts`, line 428)

Line 434: `atoms = await options.storage.listPropertyAtomsByParcelNodeId(parcelNodeId)`; every row below filters that array by `entityType`.

| Fact | Source | Lines |
|---|---|---|
| market, assessed, land, improvement value, year built, living area | engine atoms store, `cad-parcel-roll` atom | 442, 456-461 |
| owner name / mailing | engine atoms store, `owner-fact` atom | 443, 462-463 |
| special districts | engine atoms store, `special-district-fact` atoms (all rows, `!a.absence`) | 501-503, 524 |
| flood | engine atoms store, `flood-hazard-fact` | 476 |
| city limits / ETJ | hard-coded, no source at all | 794-795 |
| utilities (who serves) | live HIFLD electric only; water named in `residual` | 589-601; `who-serves-electric-only.ts:18-19,27-28` |
| school district | NOT FOUND (searched `schoolDistrict\|school-district\|school_district` in `packages/engine-core/src/site-plan/**`) | none |

Verbatim, lines 791-796:

```
  const jurisdiction: JurisdictionFacts = {
    countyFips: geometry.status === "present" ? geometry.model.summary.countyFips : null,
    countyName: ...,
    cityLimitsStatus: "unresolved",
    etjStatus: "unresolved",
  };
```

The PDF sentence in the P-152 report is a literal in `pdf/feasibility.ts:194-197`: `factOrChip("City limits and ETJ", undefined, { absentReason: "No city-limits or ETJ boundary source is wired for this county yet, ..." })`. It is emitted for every parcel in every county regardless of what any store holds.

Lines 445-449: when neither `cad-parcel-roll` nor `owner-fact` exists, the section is `absent("blocked-at-source", "The county appraisal roll carries no record for this parcel.")`. That is the "UNAVAILABLE" the FS-48453-474034 PDF printed: the engine substrate store has no cad-parcel-roll atom for that parcel; the values PE shows come from a different store (see B5).

Nothing on this path reads cortex node-facets. Zero facts come from a cortex read.

### A3. Entitlement crossing into the engine

**PE BFF** `apps/property-explorer/api/_lib/pe-feasibility-export-handler.ts` (hauska-map 4350ab9): `requireStudioSession` lines 86-118 reads the cookie (`readPeSessionCookie(req.headers.cookie)`, line 91) and calls `fetchPeEntitlementDetail(token, parcelNodeId)` (line 93). That gate runs in the BFF only. The engine call at lines 166-172:

```
    const upstream = await fetch(target, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${gateToken}`,
        'Content-Type': 'application/json',
        ...buildFeasibilityEngineGateHeaders(),
      },
```

`buildFeasibilityEngineGateHeaders()` is called with no opts; `pe-feasibility-export-core.ts:53-75` then sends static values: `'x-hauska-tenant-id': opts?.tenantId?.trim() || 'public-catalog'`, `'x-hauska-access-tier': 'public-paid'`, `'x-hauska-gate-credential-id': ... || 'property-explorer-feasibility-bff'`, product `cortex`, package `feasibility-export`. **What travels: a shared service Bearer plus constant gate-front headers. The `pe_session` cookie, user id, tier, and `studioGranted` do not.** `x-hauska-subject-id` is optional engine-side (`gate-front-context.ts:68,97`) and never sent.

**smartsite-mcp** lives in legacy-design-tools `artifacts/smartsite-mcp/src/feasibility-export.ts` (78ad8a51). Lines 325-328: `Authorization: Bearer ${config.gateToken}` + `buildEngineGateHeaders({ packageId: FEASIBILITY_PACKAGE_ID })`; `engine-client.ts:56-69` hard-codes `"x-hauska-tenant-id": "public-catalog"`, `"x-hauska-access-tier": "public-paid"`, credential `smartsite-mcp-feasibility`. `executeFeasibilityExport(args)` (line 313) takes only `parcelNodeId`; there is no entitlement check in the file (searched `entitlement|tier|studio|cookie|pe_session|userId`: NOT FOUND).

**Engine side** `services/engine-api/src/server.ts:43-67` checks only `auth !== \`Bearer ${config.gateServiceToken}\`` (line 49) and `parseGateFrontHeaders` presence (line 54); the refresh route (parcel-terrain.ts:754-802) has no per-user or per-tier logic. Entitlement is enforced once, in the PE BFF, and is invisible to the engine.

### A4. Special-district source and one-of-many selection

Writer: `packages/engine-core/src/special-district-fact/` (index.ts:2 "TCEQ water-district membership"), method `postgis-zone-major-st-intersects-true-geom` (`membership-method.ts:9-10`), joining `tx_special_district` (line 89) to `txgio_parcel` (line 99) via `ST_Intersects(d.geom, p.geom)` (line 129). One row per (parcel, district) pair (line 142 `ORDER BY ..., p.parcel_ctid, h.district_id`); `assemblePlanFromRows` keeps every hit (lines 173-186 push each into `acc.present`).

**There is no one-district selection.** `report-model.ts:524` renders `districts.map(...)` and `pdf/feasibility.ts:328` prints one row per district. A PDF showing only "West Travis County MUD 3" means the substrate store holds exactly one non-absence `special-district-fact` atom for that parcel from the TCEQ layer; PE's "Lake Pointe MUD" comes from the Factory `parcel_record` `specialDistricts` cell (B5). Two stores, no reconciliation. Second mechanism considered, the PDF picking the first of several; rejected because line 328 is an unfiltered `map`.

## Part B: the panel rails (hauska-map 4350ab9, after PR #390)

PR #390 ("fix(P-152/PANEL): flood is a companion rail; restore full agValuation field set", merged 2026-09-12T15:18Z, commit 153e7be) touched only `pe-record-to-facets.ts` and its test.

### B5. What the composer maps; zoning and envelope stay on the atom chain

`apps/property-explorer/api/_lib/pe-record-to-facets.ts:89-104`:

```
export const COMPOSED_RECORD_RAIL_KEYS = [
  "cityLimits", "flood", "specialDistricts", "wells", "schoolDistrict",
  "utilityService", "overlayDistricts", "agValuation", "maxImperviousCoverPct",
  "acreageAcres", "acreageSqft", "acreageMethod", "livingAreaSqft", "yearBuilt",
] as const;
```

Module doc lines 8-16: only rails "genuinely independent of the atom-chain's own zoning/envelope product truth (untouched — P-153/P-154/R-2 territory)"; "cadRoll's four dollar rails and the owner fact stay cortex-sourced unchanged". On the card: values are cortex; year built, living area, special district, city limits are the record; zoning and envelope are the atom chain.

Zoning/envelope from the retrieval atom chain: `pe-property-atoms.ts:350` builds `${baseUrl}/property-nodes/${parcelNodeId}/atom-chain`; line 681 "atom-chain is the envelope product path. No cortex envelope fallback."; line 706 "Merge baked base facts (never zoning/envelope — those stay atom-owned)". `atom-chain-to-facets.ts:1808` `const zf = c.zoningFact ?? null;` and 1813 `let rule = c.setbackRule ?? null;`; line 1661 "zoning + envelope stay ATOM-OWNED — never adopted from cortex." `applyRecordPatch` (pe-property-atoms.ts:486-519) never touches `facets.zoning` or `facets.envelope`.

### B6. Reader rail keys for setbacks and zoning, and the 48021 slate

Reader registry `services/retrieval-api/src/parcel-record-rail-registry.ts` is a vendored copy pinned to factory SHA `217b7dd7...` (line 16-17). Lines 56-75 (zoning-envelope group): `zoningDistrict`, `zoningJurisdictionKey`, `zoningProvenance`, `envelopeStatus`, `setbackFrontFt`, `setbackSideFt`, `setbackRearFt`, `setbackCornerFt`, `parcelAreaSqFt`, `buildableAreaSqFt`, `buildableAreaPct`, `maxLotCoveragePct`, `maxHeightFt`, `maxFootprintSqFt`, `citationUrl`, `envelopeDisclosure`, `edgeSignal`, `maxImperviousCoverPct`, `treeProtection`; line 75 `{ key: "setbackRules", grain: "companion", group: "companion" }`. Factory `src/lib/parcel-record-engine/rail-keys.js:39-59` at 7a94ae5 carries the same keys; the pin is an ancestor and `git diff 217b7dd..origin/main -- rail-keys.js` is empty.

Slate: `services/retrieval-api/src/parcel-record-slate.json`, vendored from LDT `parcelRecordAllowlist.ts` at 3950ce9b (line 4); that LDT file is unchanged at 78ad8a51. 48021 has 21 entries (lines 8-30): wells, specialDistricts, cityLimits, flood, marketValue, assessedValue, landValue, improvementValue, livingAreaSqft, yearBuilt, utilityService, overlayDistricts, schoolDistrict, valueHistory, **zoningDistrict** (line 24), **setbackFrontFt** (25), parcelAreaSqFt (26), **setbackRules** (27), maxHeightFt (28), maxLotCoveragePct (29), maxFootprintSqFt (30). Not slated for 48021: setbackSideFt, setbackRearFt, setbackCornerFt, zoningJurisdictionKey, zoningProvenance, envelopeStatus, buildableAreaSqFt/Pct, citationUrl, envelopeDisclosure, edgeSignal, maxImperviousCoverPct, treeProtection, agValuation. Per `parcel-record-reader.ts:92-110`: unslated serves `legacy-transitional`; slated serves `record` on a `pass` verdict, else `refused`; slated-without-verdict falls to `legacy-transitional`.

### B7. `readPath: "record"` and the 503 case

`pe-property-atoms.ts:486-495`:

```
export async function applyRecordPatch(payload, parcelNodeId) {
  const result = await fetchParcelRecordOnce(parcelNodeId);
  if (!result.ok) return payload;
  const { patch, railStates } = composeRecordPatch(result.record);
  ...
  return { ...payload, readPath: "record", recordRailStates: railStates,
```

`fetchParcelRecordOnce` lines 464-466: `if (!upstream.ok) { return { ok: false, reason: \`record HTTP ${upstream.status}\` }; }`. A reader 503 (`server.ts:398-408` store-not-configured, 421-429 read-failed) therefore leaves the payload untouched; the response is still 200 with `readPath` `atom-chain` or `atom-chain-warm` (lines 731-735). The two 503s in this file (lines 750, 767) are atom-chain failures, not `/record`. A `/record` outage is silent on the wire except by the absence of `readPath: "record"` and `recordRailStates`.

## Implications for lane 3 (stated, not decided)

PDF and card disagree because they read three stores: engine substrate atoms (PDF), Factory `parcel_record` via the one reader (card, 14 rails), cortex (card, dollar values and owner). marketValue/assessedValue are slated for 48453 (slate lines 12-13) but the PE composer leaves them on cortex; lane 3 needs a ruling on whether the report may compose them from the reader when the card does not. Entitlement never reaches the engine, so a reader-backed report cannot gate by tier there without a new header.

## Fleet memory

GROUND-TRUTH (2026-09-12, 99f9146): report path reads only `SUBSTRATE_DATABASE_URL` atoms plus four live layers; city limits/ETJ is a constant.
GROUND-TRUTH (2026-09-12, 4350ab9): `/record` composes 14 rails; zoning/envelope untouched; reader 503 degrades silently to atom-chain, HTTP 200.
LESSON: PDF-vs-card special-district disagreement is a store split; no one-district picker exists.
OPEN: may lane 3 compose dollar rails from the reader for 48453 while the card keeps them on cortex.

leave_behind: none
