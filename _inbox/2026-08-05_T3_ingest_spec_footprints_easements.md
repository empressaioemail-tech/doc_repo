---
id: 2026-08-05_T3_ingest_spec_footprints_easements
title: T3 Workstream 4 — building footprint + utility easement ingest spec
date: 2026-08-05
status: spec-ready
owner: nick
workstream: T3 catch-up program 2026-08-05
related: [2026-08-05_T3_footprint_source_recon, 2026-08-05_T3_easement_source_recon, adr_029_building_footprint_and_utility_easement_rails, 90_runbooks/factory_onboarding_runbook, 90_operations/OPS-1_texas_source_registry, 90_operations/T3_rails_track, CATCHUP_program_2026-08-05]
accepts: [T3-WS4-1, T3-WS4-2, T3-WS4-3]
---

# T3 Workstream 4 — footprint + easement ingest spec

Operator-facing ingest specification for the two new site-layer rails (`building-footprint`, `utility-easement` per ADR-029). This doc is the executor contract for registry authoring, preflight probes, adapter routing, spatial joins, atom minting, dry-run/apply discipline, regression gates, ledger POST, and heavy-scan coordination. Contract registration remains blocked on master-planner sign-off of ADR-029; this spec assumes the proposed shapes and may be amended when the ADR closes.

**Evidence base:** `_inbox/2026-08-05_T3_footprint_source_recon.md` (11 onboarded counties + DFW spot check), `_inbox/2026-08-05_T3_easement_source_recon.md` (breadth cohort easement recon).

---

## 1. Scope and placement

| Item | Rule |
|---|---|
| **Atom types** | `building-footprint`, `utility-easement` (ADR-029) |
| **Producer** | `hauska-engine/packages/adapters` — county GIS / CAD / national ML fallback |
| **Registry** | Frozen jurisdiction row fields (section 8); engine reads at ingest time |
| **When in pipeline** | After Rail C parcel spine is wired and frozen; before or in parallel with depth warm (footprints/easements do not block setback resolution but cert checks expect them present or honestly absent) |
| **Lanes** | Applies to **both** unzoned county (1A) and zoned city (1B) — section 1C of the factory runbook |
| **Permanence** | Every future county inherits this recipe line by default; no Texas-wide re-comb after Phase 2 backfill |

---

## 2. Preflight probes (four-point, per rail, per county)

Run **read-only** live GET probes before freezing any registry row. Record verbatim curl output or scripted JSON in `_inbox/<date>_footprint_easement_probe_<fips>.json`.

### 2.1 Four-point probe sequence (mandatory for each candidate source URL)

| Probe | Action | Pass criterion |
|---|---|---|
| **P1 — Layer list** | `GET {serviceRoot}?f=json` (FeatureServer/MapServer root or bulk-dataset HEAD) | Layer names enumerated; candidate footprint/easement layer identified by name OR honest-absence declared |
| **P2 — Fields + casing** | `GET {layerUrl}?f=json` → read `fields[]` | Join key field name + casing recorded (`prop_id` vs `Prop_ID` vs `PropertyID`); easement type/doc fields if present |
| **P3 — Roster parcel query** | `query?where={joinKey}={rosterPropId}&outFields=*&f=json` using one gold roster parcel | ≥1 feature returned OR documented zero (honest absence for that parcel class) |
| **P4 — Feature count** | `query?where=1=1&returnCountOnly=true&f=json` OR bulk manifest row count | Count recorded; sanity vs county parcel count (footprints typically >> parcels; easements often << parcels) |

**Roster parcel:** use the jurisdiction's cert roster prop_id when available; otherwise a planner-verified gold parcel from the county's existing cert artifact.

### 2.2 Footprint-specific probes

For each county, probe in order until a routing decision is frozen:

1. **CAD REST** — county CAD FeatureServer layer list for `building`, `footprint`, `sketch`, `improvement`, `structure` (exclude point layers named "Fire Station Building" etc.).
2. **County GIS mirror** — county-hosted parcel/GIS REST if distinct from CAD org.
3. **Bulk export portal** — note URL + disclaimer gate (e.g. `bastropcad.org/data-downloads`); inventory layer names in run artifact; do not claim Tier A without a fetched inventory.
4. **National ML fallback** — if P1–P3 fail on CAD/county REST, declare `footprintSourceTier: ml-derived` and pin `footprintSourceUrl` to the Texas partition (see section 3).

**Current cohort finding (2026-08-05):** 0/11 onboarded counties expose CAD-authoritative footprint polygons on public REST. Default routing = **Microsoft Global ML Building Footprints** (`ml-derived`).

### 2.3 Easement-specific probes

For each county, probe in order:

1. **County CAD/GIS REST** — search service catalog for `easement`, `utility`, `ROW`, `plat easement`, `easement line`, `easement text`.
2. **Municipal GIS** (onboarded cities only) — city FeatureServer easement polygons; record as **separate municipal row** or `easementScope: municipal-etj` on city registry row; never treat city coverage as county fan-out.
3. **Utility-adjacent layers** — PipelinePlus, RRC pipelines, PUCT CCN, MUD boundaries: probe and record URL but set `easementAdapterKind: utility-adjacent-skip` — **do not mint `utility-easement` atoms** from these (recon doc rail definitions).
4. **Honest absence** — if no queryable property-easement layer after catalog walk, freeze `easementSourceTier: absent` with `provenanceScope[]` listing sources checked.

**Current cohort finding (2026-08-05):** McLennan (48309) = CAD-derived plat easement linework (layers 9–10); City of Bastrop municipal easements (148 polys, ETJ only); all other breadth counties = county-level honest-absence + document-parse track (out of scope for bulk GIS ingest v1).

---

## 3. Adapter routing

### 3.1 Footprint adapter kinds (`footprintAdapterKind`)

| Kind | When | `footprintSourceTier` | Source URL pattern |
|---|---|---|---|
| `cad-footprint-rest` | CAD/county REST exposes building/sketch polygon layer with joinable key | `cad-authoritative` | FeatureServer layer URL + `footprintLayerId` |
| `cad-footprint-bulk` | Bulk shapefile/FGDB export contains sketch layer (REST absent) | `cad-authoritative` | Download portal URL + layer name in registry |
| `city-gis-footprint-rest` | City planning footprint layer (city cohort only) | `city-gis-authoritative` | City FeatureServer layer URL |
| `ml-global-building-footprints` | No Tier A/B source after probe | `ml-derived` | `https://github.com/microsoft/GlobalMLBuildingFootprints` + county quadkey partition or `Texas.geojson.zip` legacy path |
| `ml-overture-buildings` | Gap-fill secondary / cross-check only | `ml-derived` | Overture buildings theme release path |
| `honest-absence` | County-wide no source after good-faith probe (+ optional bulk inventory) | `absent` | `provenanceScope[]` only; no geometry URL |

**Routing precedence:** `cad-footprint-rest` > `cad-footprint-bulk` > `city-gis-footprint-rest` > `ml-global-building-footprints` > `ml-overture-buildings`. Never route USA Structures points to footprint polygons.

**ML ingest notes:**

- Filter ML features to county bounding box before join (reduce scan cost).
- Store dataset vintage + release tag on every atom (`sourceVintage`, `sourceCitation.fetchedAt`).
- `accessPolicy`: `public-paid` per ADR-029 open decision #3 until license block confirmed; registry row may override when ADR closes.

### 3.2 Easement adapter kinds (`easementAdapterKind`)

| Kind | When | `easementSourceTier` | Notes |
|---|---|---|---|
| `cad-easement-rest` | CAD easement line/polygon layers (McLennan pattern) | `plat-gis-authoritative` | Linework + text layers; partial DOC_NUM coverage is expected — grade in cert |
| `county-gis-easement-rest` | County-published easement FeatureServer (non-CAD) | `county-gis` | Four-point probe required |
| `municipal-easement-rest` | City easement polygons (Bastrop city, Round Rock, Cedar Park) | `county-gis` or city-scoped tier | Scope = city limits/ETJ; registry row must name `easementScope` |
| `record-extracted` | OCR/plat-parse pipeline (future) | `record-extracted` | Not v1 bulk ingest; document-parse track |
| `utility-adjacent-skip` | Pipeline/CCN/MUD layers | n/a | Record URL for context; **zero easement atoms** |
| `honest-absence` | No queryable property easement layer | `absent` | Sentinel atoms per ADR-029 |

**Do not conflate:** RRC pipeline centerlines, PUCT CCN franchise areas, and MUD boundaries are utility-adjacent context only.

### 3.3 Per-county routing snapshot (2026-08-05 recon)

| FIPS | Footprint routing | Easement routing |
|---|---|---|
| 48021 Bastrop | `ml-global-building-footprints` | `honest-absence` (county) + `municipal-easement-rest` for City of Bastrop row |
| 48055 Caldwell | `ml-global-building-footprints` | `honest-absence` |
| 48027 Bell | `ml-global-building-footprints` | `honest-absence` |
| 48091 Comal | `ml-global-building-footprints` | `honest-absence` |
| 48187 Guadalupe | `ml-global-building-footprints` | `honest-absence` |
| 48209 Hays | `ml-global-building-footprints` | `honest-absence` |
| 48309 McLennan | `ml-global-building-footprints` | `cad-easement-rest` (layers 9–10) |
| 48491 Williamson | `ml-global-building-footprints` | `honest-absence` (county); municipal layers in Round Rock/Cedar Park — separate city rows if onboarded |

---

## 4. Spatial join rules

### 4.1 Footprint → parcel

**Goal:** attach 0..N `building-footprint` atoms per parcel node `{fips}:{prop_id}`.

| Step | Rule |
|---|---|
| **Input A** | Parcel polygons from frozen Rail C row (`cadastralQueryUrl` / cohort geometry) |
| **Input B** | Footprint polygons from adapter (ML tile, CAD layer, or city GIS) |
| **CRS** | Normalize to WGS84 (EPSG:4326) at adapter boundary; use equal-area or local UTM for intersection metrics when computing overlap ratio |
| **Primary join** | `ST_Intersects(footprint, parcel)` AND `ST_Area(ST_Intersection(footprint, parcel)) / ST_Area(footprint) >= 0.50` — footprint majority inside parcel |
| **Secondary join** | If primary yields 0 but `ST_Intersects` true with overlap ∈ (0.10, 0.50), emit with `structureRole: unknown` + lower confidence + flag for cert review (straddle/adjacent structure) |
| **Reject** | Overlap < 10% — do not attach to parcel (orphan ML noise); log count in bake summary |
| **Cardinality** | Multiple footprints per parcel allowed; `footprintId` = `primary` (largest intersection area) or `accessory-{n}` / `{sourceHash}` |
| **Tier A join** | Prefer attribute join when source carries `prop_id` (or registry `footprintJoinField`) matching parcel key; spatial join is fallback |
| **Honest absence** | When `footprintAdapterKind: honest-absence`, emit one sentinel atom per parcel (or county-coverage atom per ADR-029 open decision #1) with `sourceTier: absent`, no geometry |

### 4.2 Easement → parcel

| Step | Rule |
|---|---|
| **Input A** | Parcel polygons (Rail C) |
| **Input B** | Easement geometry (polygon, polyline corridor, or centerline + width) |
| **Polygon easements** | `ST_Intersects(easement, parcel)` → attach; store intersection geometry or full easement polygon per adapter config (`storeFullGeometry: true` default for v1) |
| **Centerline easements** | Buffer centerline by `corridorWidthFt` (from source `WIDTH` field or registry default, e.g. 10 ft utility) then intersect with parcel; set `corridorWidthFt` on atom |
| **Classification map** | Source `TYPE` / `EasementType` / `LABEL_DESC` → `easementClass`: `UTILITY`/`UE` → `utility`; `DRAINAGE` → `drainage`; `SIDEWALK/PUE` → `ingress-egress`; unknown → `unknown` |
| **Recording ref** | Populate `recordingRef` when `DOC_NUM` / `Recordation_Num` present; null is honest |
| **Honest absence** | `easementAdapterKind: honest-absence` → sentinel atom with `sourceTier: absent`, `evaluated: true`, `provenanceScope[]` |

### 4.3 Municipal / city-scoped easements

Restrict join pool to parcels whose place node is inside city limits (city cohort flag or spatial filter against city limits layer). County-wide easement ingest MUST NOT attach city easement features to unincorporated parcels.

---

## 5. Atom minting rules (ADR-029)

### 5.1 `building-footprint`

**Mint when:** spatial join (section 4.1) produces a qualifying intersection OR sentinel absence rule fires.

**Required fields (every atom):**

```
parcelNodeId          // e.g. 48021:27303
footprintId           // primary | accessory-n | {hash}
footprintGeometry     // GeoJSON Polygon/MultiPolygon (omit when absent)
sourceTier            // cad-authoritative | ml-derived | absent
sourceVintage         // ISO date or edition string from registry
sourceCitation        // { adapterId, sourceUrl, layerName?, featureId?, fetchedAt }
confidence            // ML tier MUST NOT present as survey-grade
verificationStatus    // machine (default ingest) | human | unsurveyed
accessPolicy          // public-free (CAD) | public-paid (ML until ADR ruling)
evaluatedAt
sourceAdapter         // registry footprintAdapterKind
```

**Optional:** `structureRole`, `derivedHeightM`, `inputAtoms`, `license` (ML).

**Entity ID:** `{parcelNodeId}:footprint:{footprintId}`

**Graph edge:** place node ← `improvement-on` — `building-footprint`

**Provenance chip (serve):** MUST display tier label (`CAD`, `ML-derived`, `No published footprint source`) — never present ML as CAD.

### 5.2 `utility-easement`

**Mint when:** easement feature intersects parcel per section 4.2 OR sentinel absence.

**Required fields:**

```
parcelNodeId
easementId            // {sourceLayer}:{featureId} or content hash
easementGeometry      // Polygon | MultiPolygon | LineString
easementClass         // utility | drainage | ingress-egress | combined | unknown
sourceTier            // plat-gis-authoritative | county-gis | record-extracted | absent
sourceVintage
sourceCitation
confidence
verificationStatus
evaluatedAt
sourceAdapter
accessPolicy          // public-free (uniform public-record rail)
```

**Optional:** `holderLabel`, `recordingRef`, `corridorWidthFt`, `linkedInstrumentDid` (when ADR-020 instrument also exists).

**Entity ID:** `{parcelNodeId}:easement:{easementId}`

**Graph edge:** place node ← `subject-to` — `utility-easement`

### 5.3 Idempotency and refresh

- Re-ingest with same `(parcelNodeId, footprintId)` or `(parcelNodeId, easementId)` replaces atom when `sourceVintage` is newer or geometry hash differs.
- Stale atoms from superseded source URL: adapter emits `supersededBy` ledger event; Warden `provenance integrity` (deferred check) will eventually flag drift — until then, manual cert spot-check on source URL change.

### 5.4 Volume and batching

- ML footprint ingest for a full county is a **heavy scan** (millions of features filtered to county bbox). Batch by spatial index or pre-clipped county extract.
- Easement linework counties (McLennan ~44k segments) are moderate heavy scans.
- Honest-absence counties: sentinel mint per parcel can ride the existing property-atom county bake (no external geometry fetch).

---

## 6. Dry-run / apply discipline

Follow factory runbook dry-run-must-predict-apply (section 2).

### 6.1 Script surface (expected; locate in engine repo before run)

```
pnpm --filter @hauska-engine/engine-core run ingest-site-layers \
  -- --county=<fips> [--row-id=<registryRowId>] \
  --rails=footprint,easement \
  [--dry-run]
```

OPEN: exact script name may differ until adapter lands — grep engine for `site-layer`, `building-footprint`, or T3 dispatch branch. The **event shape** below is the acceptance contract regardless of script name.

### 6.2 Dry-run output (required fields)

```json
{
  "event": "site-layer-ingest.done",
  "county": "48021",
  "rowId": "bastrop_county",
  "mode": "dry-run",
  "footprint": {
    "adapterKind": "ml-global-building-footprints",
    "sourceTier": "ml-derived",
    "featuresRead": 1250000,
    "footprintsJoined": 48200,
    "parcelsWithFootprint": 42100,
    "parcelsAbsentSentinel": 20100,
    "orphanRejected": 890000,
    "atomsWouldWrite": 90300
  },
  "easement": {
    "adapterKind": "honest-absence",
    "sourceTier": "absent",
    "parcelsAbsentSentinel": 62220,
    "atomsWouldWrite": 62220
  },
  "totals": { "atomsWouldWrite": 152520, "emitErrors": 0 },
  "compute": { "wallMs": 0, "approxUsd": 0, "costGateUsd": 200, "flaggedOverCost": false }
}
```

### 6.3 Apply rules

| Rule | Action |
|---|---|
| Dry-run/apply totals | MUST match exactly (`atomsWouldWrite` == `atomsWritten`, per-rail counts identical) |
| `emitErrors > 0` | ABORT apply; diagnose before prod write |
| Cost gate | Sample cohort cost < $200 gate constant; flag `flaggedOverCost: true` blocks apply without planner ruling |
| Regression | Re-run Bastrop block-13 7/7 BEFORE and AFTER apply if shared adapter code touched |
| Artifacts | Raw JSON + probe JSON → `_inbox/<date>_site_layer_ingest_<fips>_{dry,apply}.json` |

### 6.4 Ledger POST

Same close discipline as zoning-fact bake (factory runbook section 3):

- `sourceKind`: use ingest wrapper value (verify live schema — `site-layer-ingest` or extend `preflight` report wrapper).
- Env pair: `LEDGER_INGEST_URL` + `LEDGER_INGEST_KEY` (planner corrections, factory runbook).
- POST in same session as artifact file — neither substitutes for the other.

---

## 7. Regression gate + cert check

### 7.1 Standing regression (mandatory)

After any shared ingest/adapter code change OR after Bastrop pilot apply:

1. **Bastrop block-13** — `block13-cert-grade.mjs` → 7/7 CERT-RESTORE ELIGIBLE (factory runbook section 5).
2. **Product surface smoke** — `scripts/product-surface-smoke.mjs` when serve path touched.

Footprint/easement ingest must not regress envelope/setback cert — block-13 proves the cert instrument still works.

### 7.2 Rail-specific cert extensions (Bastrop pilot + Phase 2)

Add to cert roster or block cert for pilot parcels (Jones/Higgins block, T3 track):

| Check | Pass criterion |
|---|---|
| **Footprint present or absent** | Every roster parcel has ≥1 `building-footprint` atom OR exactly one `sourceTier: absent` sentinel with `evaluated: true` |
| **Tier honesty** | ML-derived footprints carry `verificationStatus: unsurveyed` or `machine`; chip text ≠ CAD |
| **Geometry sanity** | Footprint intersects parcel ≥50% (or named straddle flag); no footprints on NULL parcel nodes |
| **Easement present or absent** | Same pattern for `utility-easement` |
| **McLennan easement spot** | When certifying 48309: ≥1 parcel with easement atom sourced from layer 9/10; `recordingRef` null rate documented, not hidden |

Cert artifact: file to `_inbox/<date>_site_layer_cert_<fips>.json`; POST via `cert-grade-and-report --with-quarantine`.

### 7.3 Warden check (post-cert)

Run Warden sweep with `--cert-artifact` (factory runbook section 4):

```
pnpm run warden-sweep -- --fips=<fips> --cert-artifact=_inbox/<cert>.json
```

**Expected v1 behavior:** existing four checks (`neighborConsistency`, `servePathTruth`, `crossStoreConsistency`, `certFreshness`). Site-layer-specific Warden checks (footprint tier drift, easement source URL stale) are **queued** — until shipped, manual review of `sourceVintage` in cert artifact satisfies the gate.

**Warden files, never fixes** — findings route to defect-class backlog.

---

## 8. Heavy-scan slot reservation

Per `CATCHUP_program_2026-08-05.md` coordination rule #1:

| Rule | Detail |
|---|---|
| **Owner** | T1 holds the atoms Neon heavy-scan slot |
| **Reservation** | T3 bulk ingest (ML footprint county apply, McLennan easement apply) MUST reserve slot through **master planner** before `--dry-run` apply mode on prod |
| **Serial** | One heavy scan/bake at a time on atoms DB |
| **Exempt** | Read-only probes, honest-absence sentinel-only ingests piggybacking on light bakes, cert re-runs, Warden sweeps |
| **Log** | Record reservation in program doc claim notes: `{date} T3 WS4/WS5 {fips} footprint apply reserved {start}-{end}` |

**Bastrop pilot sequencing:** coordinate with T1 envelope re-warm (Jones/Higgins block) — footprint ingest may run after re-warm cert or in parallel if slot available; coherence win = footprint + envelope on one sheet (T3 track acceptance).

---

## 9. Registry row extensions (proposal for OPS-1)

Append-only proposal — **do not edit OPS-1 until master planner merges**; fields land on frozen jurisdiction rows the engine loader reads.

### 9.1 Required fields (both rails)

| Field | Type | Description |
|---|---|---|
| `footprintSourceUrl` | string | REST layer URL, bulk download URL, or ML dataset pointer (GitHub repo + partition id) |
| `footprintSourceTier` | enum | `cad-authoritative` \| `city-gis-authoritative` \| `ml-derived` \| `absent` |
| `footprintAdapterKind` | enum | See section 3.1 |
| `easementSourceUrl` | string \| null | FeatureServer layer URL; null when absent |
| `easementSourceTier` | enum | `plat-gis-authoritative` \| `county-gis` \| `record-extracted` \| `absent` |
| `easementAdapterKind` | enum | See section 3.2 |

### 9.2 Recommended optional fields

| Field | Type | Description |
|---|---|---|
| `footprintLayerId` | integer \| null | FeatureServer layer index when REST |
| `footprintJoinField` | string \| null | Attribute join key (`prop_id`, `Prop_ID`, …) when Tier A |
| `footprintMlPartition` | string \| null | Global ML quadkey or `Texas` legacy zip path |
| `footprintBulkLayerName` | string \| null | Shapefile/FGDB layer name when bulk Tier A |
| `easementLayerIds` | integer[] \| null | e.g. `[9, 10]` McLennan lines + text |
| `easementJoinField` | string \| null | Usually spatial-only for linework |
| `easementScope` | enum | `county` \| `municipal-etj` \| `city-limits` |
| `easementCorridorDefaultWidthFt` | number \| null | Centerline buffer default when WIDTH null |
| `footprintProvenanceScope` | string[] | Sources checked when tier = absent |
| `easementProvenanceScope` | string[] | Sources checked when tier = absent |
| `utilityAdjacentUrls` | string[] | Pipeline/CCN/MUD context URLs (no atom mint) |
| `siteLayerRecipeVersion` | string | e.g. `2026-08-05-T3-WS4` for cert-freshness / Warden |
| `footprintEasementFrozenAt` | ISO8601 | Freeze timestamp (may equal row `frozen_at`) |

### 9.3 Preflight gate extension (future)

When onboard-preflight gains site-layer checks, expect:

| checkId | PASS | DECLINE |
|---|---|---|
| `footprintSourceReachableOrAbsent` | Probe OK or honest-absence frozen | `defectClass: ADAPTER-NEEDED` |
| `easementSourceReachableOrAbsent` | Probe OK or honest-absence frozen | `defectClass: ADAPTER-NEEDED` |

Not required for T3 WS4 close — document as follow-on dispatch.

### 9.4 Example frozen row snippet (Bastrop County unincorporated)

```json
{
  "fips": "48021",
  "rowId": "bastrop_county",
  "footprintSourceUrl": "https://minedbuildings.z5.web.core.windows.net/legacy/usbuildings-v2/Texas.geojson.zip",
  "footprintSourceTier": "ml-derived",
  "footprintAdapterKind": "ml-global-building-footprints",
  "footprintMlPartition": "Texas",
  "footprintJoinField": null,
  "easementSourceUrl": null,
  "easementSourceTier": "absent",
  "easementAdapterKind": "honest-absence",
  "easementProvenanceScope": [
    "maps.co.bastrop.tx.us/server/rest/services — no county easement layer",
    "BastropCADWebService — no easement layer",
    "document-parse track — county clerk plats"
  ],
  "utilityAdjacentUrls": [
    "https://maps.co.bastrop.tx.us/server/rest/services/RoadAndBridgeMap/PipelinePlus/FeatureServer/0"
  ],
  "siteLayerRecipeVersion": "2026-08-05-T3-WS4"
}
```

### 9.5 Example frozen row snippet (McLennan County)

```json
{
  "fips": "48309",
  "rowId": "mclennan_county",
  "footprintSourceUrl": "https://github.com/microsoft/GlobalMLBuildingFootprints",
  "footprintSourceTier": "ml-derived",
  "footprintAdapterKind": "ml-global-building-footprints",
  "easementSourceUrl": "https://services8.arcgis.com/5e4b1SY8bogTc3pH/arcgis/rest/services/McLennanCADWebService/FeatureServer",
  "easementSourceTier": "plat-gis-authoritative",
  "easementAdapterKind": "cad-easement-rest",
  "easementLayerIds": [9, 10],
  "easementCorridorDefaultWidthFt": 10,
  "siteLayerRecipeVersion": "2026-08-05-T3-WS4"
}
```

---

## 10. Acceptance mapping (T3 Workstream 4)

| Item | Evidence |
|---|---|
| T3-WS4-1 | This spec committed; four-point probe doctrine for both rails |
| T3-WS4-2 | Adapter routing table + spatial join rules + ADR-029 minting rules |
| T3-WS4-3 | Factory runbook section 1C merged; registry extension proposal section 9 |
| T3-WS4-4 | Dry-run/apply + regression + ledger + heavy-scan sections 6–8 |

---

## Revision history

- **2026-08-05 (T3 WS4):** Initial ingest spec from footprint + easement recon and ADR-029 proposed shapes.
