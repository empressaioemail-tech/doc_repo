---
id: 2026-08-08_ATOM_families_ten_rail_spec
title: Atom-family specification — ten manifest rails without atom families
date: 2026-08-08
status: design spec (read-only session; single deliverable)
owner: nick
method: live read of P:\hauska-atom-contract v1.12.0, P:\hauska-engine, P:\hauska-mcp-server, P:\legacy-design-tools, doc set cited inline
related: [_decisions/2026-08-08_county_shape_thirteen_rails_and_geometry_first, _inbox/2026-08-08_CONTRACT_coherence_audit, _inbox/2026-08-08_DATA_MODEL_adversarial_review, 80_adrs/adr_029_building_footprint_and_utility_easement_rails, 80_adrs/adr_017_atom_access_control, _inbox/2026-08-08_lightbox_gap_closure_spec]
---

# Atom-family specification — ten manifest rails

## Executive summary

The Command Center manifest shows **2,540 of 3,302 cells** as `no-atom` because **ten rails × 254 counties** have no atom family the manifest can query (`_inbox/2026-08-08_CONTRACT_coherence_audit.md:15`). Of the thirteen county-shape rails, three already hold findings in the atom layer (zoning/setback, roads, buildable envelope). **Building footprint** and **utility easement** are excluded here — contract v1.12.0 shapes exist and a separate lane is publishing them (`80_adrs/adr_029_building_footprint_and_utility_easement_rails.md:42-53`).

**Derived vs atom verdict on the ten rows:** **one rail is manifest-only (join quality).** The other nine need new or extended atom families (RRC wells reuse existing O&G types plus graph edges; they do not need a thirteenth well atom). Do not re-propose ring geometry atoms (adversarial review REJECT) or a new relationship layer (`atom_links` already ships — `_inbox/2026-08-08_DATA_MODEL_adversarial_review.md:24-105`).

**Single family that unblocks the most manifest cells:** **`parcel-node`** — Rail 1 (parcel geometry) is geometry-first statewide (`_decisions/2026-08-08_county_shape_thirteen_rails_and_geometry_first.md:56-60`), every other rail keys on `parcelNodeId` (`P:\hauska-atom-contract\src\property\common.ts:31-32`), and MCP already advertises the type with zero engine writers (`P:\hauska-mcp-server\src\property-atom-chain.ts:24`, `P:\hauska-mcp-server\src\tool-copy.ts:40`; `grep '"parcel-node"' P:\hauska-engine` → no output per adversarial review `:449`).

---

## Contract inventory (v1.12.0 working tree)

### accessPolicy union (five values — type and runtime agree)

`P:\hauska-atom-contract\src\registration.ts:56-61`:

```typescript
export type AccessPolicy =
  | "public-free"
  | "public-paid"
  | "platform-internal"
  | "tenant-private"
  | "tenant-shared";
```

Runtime: `P:\hauska-atom-contract\src\conformance\common.ts:52-58` (`ACCESS_POLICY_SCHEMA` z.enum of the same five). ADR-017 documents all five at `80_adrs/adr_017_atom_access_control.md:36-40`.

### Registered entity_type values in contract (30 data families)

| Domain | entity_type |
|---|---|
| Property | `zoning-fact`, `setback-rule`, `buildable-envelope`, `parcel-terrain-model`, `road-node`, `building-footprint`, `utility-easement` |
| O&G (ADR-025) | `well`, `wellbore`, `completion`, `zone`, `pad`, `rrc-lease`, `production-timeseries`, `equipment-state`, `mineral-lease`, `ownership-interest`, `revenue-allocation-unit`, `tract` |
| Encumbrances (ADR-020/021) | `recorded-instrument`, `restriction-clause`, `restriction-corpus`, `administrative-rule`, `constraint-resolution` |
| Workspace | `property-workspace`, `brief-run`, `workspace-attachment`, `workspace-share-edge` |
| Core | `actor-record`, `obligation` |

**Not in contract but load-bearing:** `parcel-node` (MCP property chain only), `property-boundary-edge` (engine-only, `P:\hauska-engine\packages\atoms\src\boundary-instances.ts:78`). **Phantom:** `parcel-record` — cited in ADR-029 (`80_adrs/adr_029_building_footprint_and_utility_easement_rails.md:31`, `:94`) but **zero contract or engine entityType hits** (coherence audit `:43-52`).

### Temporal substrate (already built — do not re-invent)

`P:\hauska-atom-contract\src\temporal\common.ts:78-97` registers `parcel_`, `road_`, `jurisdiction_` node prefixes alongside O&G prefixes. `P:\hauska-atom-contract\src\temporal\node-id.ts:1-13` documents ADR-011 hashed derivation for entities without global public keys. Relationship layer: `LinkType` 15-member union + `atom_links` table (`P:\hauska-engine\packages\atoms\src\atom-link.ts:40-55`, `P:\hauska-engine\packages\storage\src\schema.ts:76-94`) — property adapters do not write rows yet (adversarial review `:102-105`).

### Engine property registration gap

`P:\hauska-engine\packages\atoms\src\property-instances.ts:53-64` registers only four property types: `zoning-fact`, `setback-rule`, `buildable-envelope`, `parcel-terrain-model`. No `parcel-node`, `building-footprint`, or `utility-easement`.

---

## Ten-row decision table

Scope: the ten rails whose manifest cells render `no-atom` (254 counties each). Excludes rails 9–10 (footprint/easement — publishing lane). Split Rail D and Rail 12 where only half has atom coverage.

| Rail (county shape) | atom-or-derived | entity_type | accessPolicy | effort | blocked-by |
|---|---|---|---|---|---|
| 1 — Parcel geometry | **atom** | `parcel-node` | `public-free` | Medium — contract + registry + county ingest writer | TxGIO bulk load (19/254 counties in store per `_decisions/2026-08-08_county_shape_thirteen_rails_and_geometry_first.md:76-77`) |
| 2 — CAD attributes | **atom** | `cad-parcel-roll` | `public-free` | Medium — shape over `cad_property` once loaded | CAD bulk ingest (15 rows statewide per `90_operations/OPS-1_texas_source_registry.md:74`) |
| 3 — Join quality | **derived** | *(manifest-only)* | n/a | Trivial — roster already holds metrics | None — do not atomize |
| 4 — Flood hazard (FEMA NFHL) | **atom** | `flood-hazard-fact` | `public-free` | Medium — mint from existing adapter payload | Adapter→atom writer; optional county batch cache |
| 5 — Soils / subsurface (SSURGO) | **atom** | `soil-survey-fact` | `public-free` | Medium — mint from `usda-ssurgo` adapter | Same; 3DEP stays reference-field (see §5) |
| 6 — Land use (CAD roll code) | **atom** | `land-use-fact` | `public-free` | Low — field exists on `cad_property.property_use_code` | CAD ingest + Cotality decommission cleanup |
| 7 — Owner facet | **atom** | `parcel-owner-facet` | `public-paid` | Medium — BFF facet → atom + paywall gate | `keyKind` + crosswalk HOLD honesty (`OPS-1:39`) |
| 8 — RRC wells (parcel join) | **atom + edge** | existing `well` + `atom_links` | `public-free` (per `og/common.ts:304-305`) | High — spatial join + link writes, not new well shape | RRC ingest + `LinkType` extension |
| 9 — RRC pipelines | **atom** | `pipeline-segment` | `public-free` | High — new family + RRC GIS acquisition | Source spec + ingest (no engine references today) |
| 10 — MUD / special districts | **atom** | `special-district-membership` | `public-free` | High — Comptroller registry ingest + parcel join | Acquisition HELD (W4); shape can land first |

---

## Per-rail specification

### Rail 1 — Parcel geometry

#### 1. Atom or derived?

**Atom — but never the ring bytes.** The adversarial review REJECTED Proposal 1 (ring atom): ten engine files read `txgio_parcel` directly (`_inbox/2026-08-08_DATA_MODEL_adversarial_review.md:217-259`); duplicating geometry re-opens Geometry Law rule 3’s master defect class (`_decisions/2026-08-07_envelope_saga_close_and_geometry_law` cited at adversarial review `:255-257`).

#### 2. Reconcile `parcel-record` vs `parcel-node`

| Name | Status | Action |
|---|---|---|
| `parcel-record` | **Does not exist** — ADR-029 footnote graph is wrong (`80_adrs/adr_029_building_footprint_and_utility_easement_rails.md:31`, `:94`) | **Retire from ADR-029**; replace graph edge with `parcel-node ← improvement-on — building-footprint` |
| `parcel-node` | **Advertised, unwritten** — MCP chain slot (`P:\hauska-mcp-server\src\property-atom-chain.ts:24`, `:100`; `tool-copy.ts:40`) | **Register and write** per spec below |

#### 3. Proposed family: `parcel-node`

Anchor atom: **geometry provenance by reference**, one row per parcel (or county-coverage sentinel during statewide rollout).

| Field | Required | Notes |
|---|---|---|
| `entityType` | yes | `"parcel-node"` |
| `parcelNodeId` | yes | `{county_fips}:{prop_id}` per `common.ts:31-32` |
| `keyKind` | yes | `"prop_id"` \| `"geo_id_crosswalk"` — records join key kind for 8 crosswalk counties (`OPS-1:39`; adversarial review `:203-205`) |
| `geometryStoreRef` | yes | `{ store: "txgio_parcel", countyFips, propId }` — pointer only, **no GeoJSON body** |
| `geometrySourceTier` | yes | `"txgio-stratmap"` \| `"county-arcgis-override"` |
| `sourceVintage` | yes | From row or roster (`parcel-geometry-resolver.ts:13` `sourceVintage`) |
| `geometryLoaded` | yes | boolean — false when county not in store |
| `divergenceObservationCount` | optional | Count of `PARCEL-RING-SOURCE-DIVERGENCE` observations (BCAD vs TxGIO reporting only) |
| `sourceCitation`, `extractedAt`, `asOf` | yes | `PROPERTY_QUALITY_GATE_FIELDS` (`common.ts:43-48`) |
| `accessPolicy` | yes | `public-free` |
| `reasoningChain` | yes | `{ reasoningKind: "observed" }` |

**entityId / atomDid:** `entityId = parcelNodeId`; `atomDid = did:hauska:parcel-node:{parcelNodeId}` (existing MCP convention, `property-atom-chain.ts:89-95`).

#### 4. Typed absence

| Variant | Shape | When |
|---|---|---|
| County not loaded | `geometryLoaded: false` + `verifiedAbsence: { evaluated: true, provenanceScope: ["txgio-stratmap-bulk", "county-arcgis-override"] }` on `{fips}:_county_coverage` anchor (`common.ts:164-171`) | Rail satisfied-absent at county level only after documented probe |
| Parcel in loaded county, no row | `absence: { kind: "no-parcel-geometry", reason }` | Fail-closed; distinct from not-yet |
| MultiPolygon truncation | `absence: { kind: "geometry-incomplete", reason }` when `coordinates.length > 1` on first polygon — **do not silently truncate** (adversarial review M1, `:475-500`) |

Do **not** carry geometry in the atom. Do **not** use engine-only `warmVerifyDecline` pattern (`buildable-envelope` gap, `QUEUE:129`).

#### 5. Where data lives today

| Store | Role | Evidence |
|---|---|---|
| `txgio_parcel` | **Single geometry truth** — serving + warm pin | `parcel-geometry-resolver.ts:129-131`, `:174`; `depth-warm-bastrop-batch.mjs:612-625` (cited adversarial review `:242-253`) |
| StratMap bulk / county ArcGIS | Source | `OPS-1:32-41` |
| Atoms | **Nothing** for Rail 1 | Coherence audit S2 |

#### 6. Effort / ordering

**P0.** Contract minor bump → engine registry → writer on TxGIO county load (can emit county-coverage rows before per-parcel backfill). **Blocked by** statewide geometry acquisition (235 counties not loaded, decision correction `:76-77`).

---

### Rail 2 — CAD attributes

#### 1. Atom or derived?

**Atom.** CAD roll fields are public-record **claims** with provenance (owner, values, situs, legal, exemptions), not a pipeline self-measurement.

#### 2. Proposed family: `cad-parcel-roll`

| Field | Required | Notes |
|---|---|---|
| `parcelNodeId`, `taxYear` | yes | Composite identity `{parcelNodeId}:{taxYear}` |
| `propId`, `countyFips` | yes | Denormalized for validation |
| `ownerName`, `ownerMailingAddress`, `situsAddress`, `situsCity`, `situsZip` | optional | From CAD row when join passes gate |
| `legalDescription`, `exemptionCodes` | optional | |
| `landValue`, `improvementValue`, `marketValue`, `assessedValue` | optional | Whole dollars |
| `yearBuilt`, `livingAreaSqft`, `landAcres` | optional | |
| `propertyUseCode` | optional | **Also feeds Rail 6** — cite same atom or split read |
| `joinPassedOwnerMatchGate` | yes | boolean — false → must not emit owner-bearing fields |
| `sourceFile`, `sourceVintage` | yes | Mirror `cad_property` |
| `sourceCitation`, `extractedAt`, `asOf`, `accessPolicy` | yes | `public-free` |
| `reasoningChain` | yes | `observed` |

#### 3. Typed absence

| Variant | When |
|---|---|
| `absence: { kind: "no-cad-row", reason }` | County has CAD endpoint but no row for parcel/year |
| `verifiedAbsence` on county anchor | County honestly absent (59 no-REST counties, `OPS-1:77`) |
| `absence: { kind: "join-hold", reason }` | Owner-match gate failed — **no attribute promotion** |

#### 4. Where data lives today

`cad_property` table — `P:\legacy-design-tools\lib\db\src\schema\cadProperty.ts:38-81` (15 rows statewide per `OPS-1:74`). Joined at bake/facet time in `nodeFacetBakeTier1Cli.ts:328-376`. **Not atomized.**

#### 5. Effort / ordering

**P1** after `parcel-node`. Shape is trivial once CAD bulk load runs; writer is SELECT from `cad_property` + join gate. **Blocked by** CAD acquisition.

---

### Rail 3 — Join quality / owner match

#### 1. Atom or derived?

**Derived manifest metric only.** Confirmed adversarial review Q3 (`_inbox/2026-08-08_DATA_MODEL_adversarial_review.md:624-632`): join quality measures **our pipeline**, not a jurisdictional fact. Operator moved denominator 13→12 by ruling join quality out of the rail shape (`_decisions/2026-08-08_county_shape_thirteen_rails_and_geometry_first` correction context; adversarial review `:624-632`).

#### 2. Manifest shape (not contract)

Use existing roster block per county (`_catalog/texas_roster_v1.json` `join_quality.*`; `OPS-1:39`, `:56`): `prop_id_bad_rate`, `join_key`, `owner_match_gate_required`, `verification`, `evidence`.

#### 3. Related atom field (not Rail 3)

`keyKind` on `parcel-node` and `cad-parcel-roll` records **which key** the second token uses — this is identity metadata, not the join-quality rate (adversarial review `:632-633`).

#### 4. Effort

**Trivial** — manifest reads roster; no contract bump.

---

### Rail 4 — Flood hazard (FEMA NFHL)

#### 1. Atom or derived?

**Atom.** FEMA zone at a parcel is a citable public-record claim. `parcel-terrain-model` is **export mesh**, not flood coverage (`parcel-terrain-model.ts:1-7`, `:122-123` — DEM is reference-field only).

#### 2. Proposed family: `flood-hazard-fact`

| Field | Required | Notes |
|---|---|---|
| `parcelNodeId` | yes | |
| `floodZone` | optional | e.g. `AE`, `X`; null when outside mapped zones |
| `inSpecialFloodHazardArea` | yes | Normalized from `SFHA_TF` (`fema-nfhl.ts:115-116`) |
| `zoneSubtype`, `baseFloodElevation` | optional | From adapter attrs (`fema-nfhl.ts:104-108`) |
| `sourceTier` | yes | `"fema-nfhl"` |
| `sourceVintage` | yes | Panel / `DFIRM_ID` edition |
| `sourceCitation`, `extractedAt`, `asOf`, `accessPolicy` | yes | `public-free` |
| `reasoningChain` | yes | `observed` |

#### 3. Typed absence

| Variant | When |
|---|---|
| `absence: { kind: "no-flood-coverage", reason }` | Point outside US / no geocode |
| `verifiedAbsence` + `sourceTier: "absent"` | County-level NFHL unavailable (unlikely nationwide) |
| Present with `inSpecialFloodHazardArea: false` | Valid **satisfied-present** — "Zone X by omission" (`fema-nfhl.ts:82-85`) |

#### 4. Where data lives today

Adapter `fema:nfhl-flood-zone` returns `AdapterResult.payload` only — **no atom write** (`fema-nfhl.ts:64-134`). Zero-row adapter cache per coherence audit correction (`_decisions/2026-08-08_county_shape_thirteen_rails_and_geometry_first.md:81`).

#### 5. Effort / ordering

**P2** — mint atom from existing adapter output; batch county job acceptable. **Not blocked** on geometry statewide (point-in-polygon), but manifest should require geocoded parcel centroid from Rail 1.

---

### Rail 5 — Soils / subsurface (SSURGO)

#### 1. Atom or derived?

**Atom** for SSURGO map-unit claims. **3DEP elevation is not a separate atom** — contract already treats USGS 3DEP as `reference-field` input to `parcel-terrain-model` (`parcel-terrain-model.ts:122-123`, `:169-182`). County-shape "terrain" completeness for manifest = SSURGO fact + optional terrain-export atom counts separately.

#### 2. Proposed family: `soil-survey-fact`

| Field | Required | Notes |
|---|---|---|
| `parcelNodeId` | yes | |
| `mapunitSymbol`, `mapunitName` | optional | From SDA response |
| `drainageClass`, `hydricRating`, `depthToRestrictiveLayer` | optional | When SDA returns them |
| `sourceTier` | yes | `"usda-ssurgo-sda"` |
| `sourceVintage` | yes | SSURGO version string |
| `sourceCitation`, `extractedAt`, `asOf`, `accessPolicy` | yes | `public-free` |

#### 3. Typed absence

`absence: { kind: "no-soil-mapping", reason }` for off-US / SDA no-coverage (`usda-ssurgo.ts:16-17` deterministic no-coverage).

#### 4. Where data lives today

`usdaSsurgoSoilsAdapter` in adapter registry (`P:\hauska-engine\packages\adapters\src\registry.ts:107`) — **adapter payload only, no atom**.

#### 5. Effort / ordering

**P2** alongside flood. Independent of geometry bulk load.

---

### Rail 6 — Land use

#### 1. Atom or derived?

**Atom.** CAD `property_use_code` is an observed roll classification, not a derived metric.

#### 2. Proposed family: `land-use-fact`

| Field | Required | Notes |
|---|---|---|
| `parcelNodeId`, `taxYear` | yes | |
| `landUseCode` | optional | e.g. `A1`, `F1` |
| `landUseLabel` | optional | County lookup table when available |
| `sourceTier` | yes | `"cad-authoritative"` |
| `sourceCitation`, `extractedAt`, `asOf`, `accessPolicy` | yes | `public-free` |

**Alternative (DRY):** embed `propertyUseCode` only on `cad-parcel-roll` and treat Rail 6 manifest as a **projection** of that atom. Recommendation: **separate `land-use-fact`** so manifest thresholds (0–98% coverage, decision `:50-52`) can diverge from full CAD promote without forcing full CAD atom for land-use-only partial counties.

#### 3. Typed absence

Same join-hold and no-row patterns as Rail 2. `absence: { kind: "no-land-use-code", reason }` when CAD row exists but code null.

#### 4. Where data lives today

**Only live carrier was Cotality** — EXTINGUISHED (`cotality.ts:143-144`; `_STATE.md:11`; coherence audit `:361`). **`cad_property.property_use_code`** is the successor field (`cadProperty.ts:68-69`). Facet bake reads it (`nodeFacetBakeTier1Cli.ts:375`).

#### 5. Effort / ordering

**P1** with CAD ingest. **Blocked by** CAD load + Cotality registry removal (`adapters/src/registry.ts` still references Cotality per coherence audit `:361`).

---

### Rail 7 — Owner facet

#### 1. Atom or derived?

**Atom** with **`public-paid`** accessPolicy (`_inbox/2026-08-08_lightbox_gap_closure_spec.md:57-59`; ADR-017 five-value union `registration.ts:56-61`).

#### 2. Proposed family: `parcel-owner-facet`

| Field | Required | Notes |
|---|---|---|
| `parcelNodeId`, `taxYear` | yes | |
| `ownerName` | optional | Never when join-hold |
| `ownerMailingAddress` | optional | |
| `ownerOccupancyFlag` | optional | `"owner-occupied"` \| `"absentee"` \| `"unknown"` — derived from situs vs mailing |
| `deedDate` / `lastSaleDate` | optional | When CAD carries |
| `accessPolicy` | yes | **`public-paid`** — must gate MCP + BFF, not UI-only (`lightbox spec:57-59`) |
| `sourceCitation`, `extractedAt`, `asOf` | yes | |
| `reasoningChain` | yes | `observed` |

#### 3. Typed absence (crosswalk-HOLD counties)

For 8 counties on `geo_id_or_address_crosswalk` with high `prop_id_bad_rate` — **Travis 0.51, Robertson 1.00** (`OPS-1:39`):

| Rule | Implementation |
|---|---|
| Never emit guessed owner | `absence: { kind: "owner-join-hold", reason: "owner_match_gate_required; join_key=crosswalk" }` |
| Wrong owner worse than missing | Explicit spec requirement (`lightbox spec:75-76`) |
| Read coverage from manifest | `county_facet_coverage.owner_match_rate` (`lightbox spec:77`; `OPS-4:51`) |

#### 4. Where data lives today

`cad_property.owner_name` / `owner_mailing_address` (`cadProperty.ts:47-49`). Selected for **gate only** in tier-1 bake (`nodeFacetBakeTier1Cli.ts:492-493`, `:354-390`). **Excluded from public tile bake** (`40j` / `nodeFacetBakeTier1.test.ts:6-7`). **No owner atom.**

#### 5. Effort / ordering

**P2** after `cad-parcel-roll` + paywall path. Requires `keyKind` + join-hold logic.

---

### Rail 8 — RRC wells (parcel join)

#### 1. Atom or derived?

**Existing atom families + graph edges** — do **not** add a duplicate well type. Twelve O&G types exist (`coherence audit :36`; `og/common.ts:304-317`).

#### 2. Manifest mechanism

| Piece | Action |
|---|---|
| Well facts | Keep `well`, `wellbore`, etc. keyed on API-14 (`well.ts:21`) |
| Parcel attachment | Add `LinkType` member `"parcel-intersects-well"` (or reuse `"applies-to"`) and **write `atom_links` rows** from spatial join (adversarial review `:105`, `:619-620`) |
| County manifest | Satisfied when ≥threshold wells linked per county OR verified-absence |

#### 3. Typed absence

County with zero linked wells after ingest: county-coverage `verifiedAbsence` with `provenanceScope: ["rrc-public-gis-wells"]`.

#### 4. Where data lives today

O&G adapters under `packages/og-sources` — **no pipeline atom** (`grep pipeline og-sources` → no matches). **No property graph edges** (coherence audit S9).

#### 5. Effort / ordering

**P3** — HELD sequencing (`_decisions/2026-08-01_scale_before_new_layers`). Shape is edge writes, not contract family explosion.

---

### Rail 9 — RRC pipelines

#### 1. Atom or derived?

**New atom family required.** No `pipeline*` entity_type in contract (`grep` across `hauska-atom-contract` / `hauska-engine` → none).

#### 2. Proposed family: `pipeline-segment`

| Field | Required | Notes |
|---|---|---|
| `segmentId` | yes | RRC GIS feature id |
| `pipelineOperator`, `pipelineStatus`, `commodity` | optional | From RRC attributes |
| `segmentGeometry` | optional | GeoJSON `LineString` — **store once, link to parcels** |
| `sourceCitation`, `extractedAt`, `asOf`, `accessPolicy` | yes | `public-free` |
| Parcel association | via `atom_links` | Same pattern as wells |

#### 3. Typed absence

`verifiedAbsence` when RRC layer empty for county (document probe).

#### 4. Where data lives today

**Nowhere** — PB-304 backlog noted in lightbox spec `:31`. No adapter.

#### 5. Effort / ordering

**P4** — acquisition + family + ingest. Most uncertain row in this spec.

---

### Rail 10 — MUD / special districts

#### 1. Atom or derived?

**Atom** — district membership is a public-record claim (Comptroller special-district registry, decision `:30`).

#### 2. Proposed family: `special-district-membership`

| Field | Required | Notes |
|---|---|---|
| `parcelNodeId` | yes | |
| `districtId`, `districtName`, `districtType` | yes | e.g. MUD, WCID, PID |
| `membershipBasis` | yes | `"point-in-polygon"` \| `"cad-exemption"` \| `"recorded-plat"` |
| `sourceCitation`, `extractedAt`, `asOf`, `accessPolicy` | yes | `public-free` |

#### 3. Typed absence

`absence: { kind: "no-special-district", reason }` when parcel outside all districts (common in unincorporated Texas — **satisfied-present**, not gap).

#### 4. Where data lives today

**No table, no atom.** Lightbox spec flags prior Cotality path dead (`lightbox spec:30-31`). OPS-1 city-boundaries note: MUD layer confusion risk (`OPS-1:48` Caldwell layer-0 trap).

#### 5. Effort / ordering

**P4** — W4 HELD. Contract shape can ship before ingest.

---

## Cross-cutting requirements

### Absence discipline (do not repeat buildable-envelope mistake)

Contract-native absence exists for: `zoning-fact`, `setback-rule`, `building-footprint`, `utility-easement` (`coherence audit :207-214`). **`buildable-envelope` has NO absence field** — engine bolts `warmVerifyDecline` off-contract (`honest-decline-promote.ts:30-35`; audit `:231-241`). Every new family above includes contract `absence` and/or `verifiedAbsence` + mandatory `provenanceScope` when `sourceTier: "absent"` (pattern `building-footprint.ts:110-117`).

### Manifest vs atom store (Proposal 5 salvage)

- Atom store authoritative for **satisfied-present** and **satisfied-absent** (claims with provenance).
- Manifest authoritative for **not-yet only**, defined as complement: no present claim and no verified-absence above threshold (adversarial review `:431-437`).
- Manifest is a **materialized view**, not a hand-maintained parallel ledger.

### MCP surface

New families extend property chain types in `property-atom-chain.ts:24` and tool copy (`tool-copy.ts:40`). **`parcel_node_id` parameter shape unchanged** — adversarial review REJECTED re-keying (`:171-181`).

### ADR-029 graph fix

Replace all `parcel-record` references with `parcel-node` (`80_adrs/adr_029_building_footprint_and_utility_easement_rails.md:31`, `:94`). Footprint graph: `parcel-node ← improvement-on — building-footprint`.

### Enforcement gap

Import contract Zod schemas at engine write boundary (audit S3). O&G already validates (`rrc-w1/normalize.ts:10`).

---

## Dependency ordering (recommended)

```
1. parcel-node (+ keyKind + PARCEL_NODE_ID_PATTERN enforce)
2. cad-parcel-roll + land-use-fact (same ingest wave)
3. parcel-owner-facet (public-paid)
4. flood-hazard-fact + soil-survey-fact (parallel)
5. buildable-envelope.absence (contract — queued QUEUE:129)
6. atom_links extensions + well/pipeline/district writers
7. special-district-membership + pipeline-segment ingest (when un-HELD)
```

Publish **contract v1.13.0** (additive) before engine registration. v1.12.0 footprint/easement publish remains parallel.

---

## WHAT BREAKS THIS

1. **County-coverage vs per-parcel cardinality for `parcel-node`.** One `{fips}:_county_coverage` row satisfies manifest Rail 1 before per-parcel backfill, but product parcel cards expect per-parcel anchors. Two consumers, one type — threshold math must not round partial county load to green (decision ruling 3, `:50-52`).

2. **`cad-parcel-roll` vs `land-use-fact` duplication.** Split families improve manifest honesty but double write volume and can drift if land-use code updates without full roll refresh.

3. **`parcel-owner-facet` + crosswalk counties.** Eight counties with bad `prop_id` (`OPS-1:39`) may force permanent absence on owner while CAD attributes on other fields tempt best-guess joins elsewhere.

4. **RRC spatial join at scale.** Wells keyed API-14; parcel join is pure geometry. Travis/Harris condo and multi-parcel defects (adversarial review M2, `:502-510`) will duplicate or mis-link without unit-level model.

5. **`pipeline-segment` volume and licensing.** RRC pipeline linework statewide is large; atom index pressure mirrors ADR-029 reversal (c) on footprints (`80_adrs/adr_029_building_footprint_and_utility_easement_rails.md:190`).

6. **Tenant edge leak if `atom_links` expand before accessPolicy on links.** ADR-010 links ungated (`schema.ts:76-94` no accessPolicy column; adversarial review M6, `:535-540`).

7. **Temporal validity unset.** Property atoms lack `valid_from`/`valid_to` (M5, `:529-533`) — annexation and roll vintage will stale silently.

8. **Manifest/roster drift on join quality.** Rail 3 derived from roster while atoms carry `keyKind` — two writers can disagree if roster not recomputed on ingest rule changes.

---

## WHAT I COULD NOT DETERMINE

- **Live production atom counts** per county per rail — no DB SELECT (read-only mandate). All store claims trace to `_decisions/2026-08-08_county_shape_thirteen_rails_and_geometry_first.md:72-77` and `OPS-1:74`.
- **Exact RRC pipeline GIS layer** field schema and feature count — no adapter exists; lightbox spec `:31` cites backlog only.
- **Comptroller special-district registry** join geometry vs tabular-only — source not read this session.
- **Whether manifest schema file exists** outside engine — coherence audit `:369` and adversarial review `:409-417` found no implementation; Command Center mockup not traced to production schema.
- **MultiPolygon incidence** in loaded `txgio_parcel` — truncation defect confirmed in code (`parcel-geometry-resolver.ts:66-88`, adversarial review M1) but live rate unmeasured.
- **Deployed engine revision vs local clone** — same limitation as audits (`coherence audit :365`).
- **Threshold numbers** for SATISFIED vs PARTIAL (decision `:54-55` deliberately unset).

---

## Appendix — rails excluded from this spec

| Rail | Status | Note |
|---|---|---|
| 4 — Zoning + setback | Atoms exist | `zoning-fact`, `setback-rule` |
| 5 — Roads | Atom exists | `road-node`; `property-boundary-edge` engine-only for frontage |
| 7 — Buildable envelope | Atom exists | Add contract `absence` (separate queue item) |
| 9 — Building footprint | Contract v1.12.0 | Publishing lane — exclude |
| 10 — Utility easement | Contract v1.12.0 | Publishing lane — exclude |
