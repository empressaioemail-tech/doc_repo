---
id: 2026-08-05_T3_bastrop_pilot_plan
title: T3 Workstream 5 — Bastrop city cohort pilot plan (footprints + easements)
date: 2026-08-05
status: operator-ready
owner: nick
workstream: T3 catch-up program 2026-08-05
track: T3
accepts: [T3-WS5-1, T3-WS5-2, T3-WS5-3, T3-WS5-4, T3-WS5-5]
related: [2026-08-05_T3_footprint_source_recon, 2026-08-05_T3_easement_source_recon, 2026-08-05_T3_ingest_spec_footprints_easements, adr_029_building_footprint_and_utility_easement_rails, CATCHUP_program_2026-08-05, T1_data_accuracy_track, 90_operations/HEALTH_CHECK_2026-08-05_verdict, 75o_site_plan_export_spec]
method: spec + read-only dry-run; NO prod ingest without master-planner slot grant
---

# T3 Workstream 5 — Bastrop city cohort pilot plan

Operator authorization: catch-up program greenlit 2026-08-05. This plan covers the **Bastrop (48021) city cohort** footprints + easements pilot only. Contract registration (`@empressaio/atom-contract` bump) remains **blocked** until ADR-029 is accepted — no npm publish, no prod atom writes, from this doc alone.

**Evidence base:** `_inbox/2026-08-05_T3_footprint_source_recon.md`, `_inbox/2026-08-05_T3_easement_source_recon.md`, `80_adrs/adr_029_building_footprint_and_utility_easement_rails.md` (PROPOSED), `_inbox/2026-08-05_T3_ingest_spec_footprints_easements.md`.

**Dry-run artifact:** `_scratch/bastrop_footprint_spatial_join_dryrun.json` (2026-08-05; join mechanics on 48021:31362; no prod DB write).

---

## WANT

Prove the two new site-layer rails on the Bastrop city cohort before Phase 2 fan-out:

1. **Footprints** — Microsoft Global ML Building Footprints (Texas partition) spatial-joined to parcel nodes with `sourceTier=ml-derived` and honest provenance.
2. **Easements** — county honest-absence for utility easements + City of Bastrop municipal easements layer for city-limits cohort only.
3. **Serve** — map overlay + site-plan export show footprint/envelope/easement geometry with provenance chips (spec identifies touch files; implementation waits on ADR-029 sign-off).
4. **Cert** — Jones/Higgins block area-sweep pairs with T1 envelope re-warm; footprint + envelope coherence on one sheet is the acceptance win.

---

## DONE-LINE

| # | Observable end state |
|---|---|
| 1 | Registry row `bastrop-city-tx` (and shared 48021 county row) carries frozen footprint/easement routing per section 2 |
| 2 | Dry-run ingest for FIPS 48021 matches apply counts; artifact in `_inbox/` |
| 3 | Prod apply complete (slot-granted) with block13 7/7 regression held |
| 4 | Live PE map shows footprint overlay + provenance chip on Jones/Higgins cert parcels |
| 5 | Site-plan PDF/DXF includes BUILDING_FOOTPRINT layer + provenance row when ADR-029 implementation lands |
| 6 | Jones/Higgins cert artifact filed; T1 envelope re-warm coherence verified on same block |
| 7 | County unincorporated parcels carry easement `sourceTier=absent` sentinel; no city easement polygons outside city limits |

---

## 1. Footprints rail (48021 city cohort)

### 1.1 Source routing (frozen for pilot)

| Field | Value |
|---|---|
| **Adapter** | `ml-global-building-footprints` |
| **Dataset** | [Microsoft Global ML Building Footprints](https://github.com/microsoft/GlobalMLBuildingFootprints) — Texas partition |
| **Legacy bulk path** | `https://minedbuildings.z5.web.core.windows.net/legacy/usbuildings-v2/Texas.geojson.zip` (~10.7M buildings statewide) |
| **Release citation** | GlobalMLBuildingFootprints GitHub release + `dataset-links.csv` quadkey partition id recorded on atom `sourceCitation` |
| **License** | ODC-By |
| **Tier** | `sourceTier=ml-derived` |
| **CAD REST** | **Not used** — BCAD exposes no building/sketch polygon layer (recon 2026-08-05) |
| **Parcel join spine** | `BastropCADWebService/FeatureServer/0` — `prop_id` → `{fips}:{prop_id}` |

### 1.2 Spatial join (per ingest spec §4.1)

| Rule | Value |
|---|---|
| CRS | WGS84 at adapter boundary; local UTM/equal-area for overlap ratio |
| Primary attach | `ST_Intersects` AND intersection area ≥ **50%** of footprint area |
| Straddle flag | Overlap 10–50% → emit with `structureRole: unknown`, cert review |
| Reject | Overlap < 10% (orphan ML noise) |
| Cardinality | 0..N per parcel; `footprintId=primary` = largest intersection |
| Honest absence | No qualifying intersection → sentinel atom `sourceTier=absent`, no geometry |

### 1.3 Dry-run result (2026-08-05, local)

Script: `_scratch/bastrop_footprint_spatial_join_dryrun.py`

| Metric | Value |
|---|---|
| Parcel | `48021:31362` (109 Higgins St) |
| Stand-in features | 11 building polygons (Overpass bbox — join mechanics only) |
| Joined | 2 (`primary` + `accessory-1`, overlap 1.0) |
| Rejected orphans | 9 |
| Prod DB write | **false** |
| Production source pinned | Global ML Texas partition (not Overpass) |

Full prod dry-run (county bbox filter + Texas partition) requires **heavy-scan slot** — see section 6.

---

## 2. Easements rail (48021)

### 2.1 County cohort — honest absence

| Probe | Result |
|---|---|
| County REST | `https://maps.co.bastrop.tx.us/server/rest/services` — **no** easement/utility-easement/ROW layer |
| BCAD Web Service | Parcels only — **no** easement layer |
| **Routing** | `easementAdapterKind: honest-absence` |
| **Per parcel** | One `utility-easement` sentinel with `sourceTier=absent`, `evaluated: true`, `provenanceScope[]` listing probed sources |

**provenanceScope (county):**

- `maps.co.bastrop.tx.us/server/rest/services — no county easement layer`
- `BastropCADWebService — no easement layer`
- `document-parse track — county clerk plats (deferred v1 bulk ingest)`

**Do not mint easement atoms from:**

- PipelinePlus (`RoadAndBridgeMap/PipelinePlus/FeatureServer/0`, 10,085 polylines) — utility-adjacent
- PUCT CCN / MUD boundaries — franchise areas, not parcel easements

### 2.2 City of Bastrop municipal overlay (city-limits cohort only)

| Field | Value |
|---|---|
| **URL** | `https://services7.arcgis.com/qOeXJdBtGknaCJC4/arcgis/rest/services/Easements_/FeatureServer/43` |
| **Count** | **148** polygon features (live probe 2026-08-05) |
| **Scope** | City limits / ETJ only — **not** county fan-out |
| **Tier** | `sourceTier=county-gis` (municipal GIS authoritative within scope) |
| **Fields** | `Status` (DRAINAGE, SIDEWALK/PUE, ACCESS/PUE, …), `Dedication` (With Plat), `StName` |
| **Classification map** | DRAINAGE → `drainage`; UTILITY/UE → `utility`; SIDEWALK/PUE, ACCESS/PUE → `ingress-egress`; else `unknown` |

**Join rule:** Restrict easement feature pool to parcels inside city limits (spatial filter against `BastropCADWebService/4` City Limits or registry city-cohort flag). Unincorporated county parcels get county honest-absence only — never attach city easement polygons.

**Phase 2b (optional, non-blocking):** Municipal easement ingest can follow county footprint slot; does not block county HA declaration.

---

## 3. Serve surface (spec only — ADR-029 sign-off required)

Implementation is **NOT authorized** until ADR-029 moves from PROPOSED to accepted and contract types register. Below identifies the file touch set for the implementing dispatch.

### 3.1 Map overlay (Property Explorer)

| File | Change |
|---|---|
| `hauska-map/apps/property-explorer/src/browse/footprint-overlay.ts` | **NEW** — mirror `envelope-overlay.ts` pattern; amber/gray footprint fill inside parcel; `sourceTier` drives chip text |
| `hauska-map/apps/property-explorer/src/browse/easement-overlay.ts` | **NEW** — dashed outline for intersecting easements; honest-absence = no layer |
| `hauska-map/apps/property-explorer/src/browse/ExplorerMap.tsx` (or equivalent handler) | Wire footprint + easement facets into overlay apply/clear lifecycle |
| `hauska-map/apps/property-explorer/src/lib/baked-facets.ts` | Extend `BakedFacetPayload` with `footprint?` and `easements?` slots |
| `hauska-map/apps/property-explorer/src/browse/InspectCard.tsx` | Provenance chips for `building-footprint` / `utility-easement` atom DIDs (parallel to envelope chips) |
| `hauska-map/packages/map-renderer/src/map/layer-role-taxonomy.js` | Reserve SUBJECT-adjacent role for improvement footprint (must not collide with envelope amber or flood palette) |

**Facet serve path (BFF):**

| File | Change |
|---|---|
| `legacy-design-tools/artifacts/api-server/src/routes/brokeragePlaceNodeFacets.ts` (or facets route) | Include footprint + easement atoms in baked facet assembly |
| `legacy-design-tools/artifacts/api-server/src/lib/buildableEnvelope/` | No setback logic change; footprint is independent rail |

### 3.2 Site-plan export

| File | Change |
|---|---|
| `hauska-engine/packages/engine-core/src/site-plan/site-model.ts` | Add `footprints[]`, `easements[]` inputs + citation fields |
| `hauska-engine/packages/engine-core/src/site-plan/author.ts` | Resolve footprint/easement atoms from parcel node at compose time |
| `hauska-engine/packages/engine-core/src/site-plan/emitters.ts` | DXF layer `BUILDING_FOOTPRINT`; optional `UTILITY_EASEMENT` corridor polygons |
| `hauska-engine/packages/engine-core/src/site-plan/pdf/provenance.ts` | Rows: "Building footprint — ML-derived (Global ML …)" and "Utility easement — absent / municipal GIS …" |
| `hauska-engine/packages/engine-core/src/site-plan/pdf/render.ts` | Draw footprint outline + easement hatch; legend entries |
| `75o_site_plan_export_spec.md` | Add BUILDING_FOOTPRINT + UTILITY_EASEMENT to in-scope layer list (doc amendment on implement) |

**MCP / gate:**

| File | Change |
|---|---|
| `hauska-mcp-server/src/site-plan-export-contract.js` | Pass footprint/easement refs in export refresh payload |
| `hauska-mcp-server/tests/site-plan-export-catalog.test.ts` | Golden-file provenance panel includes new layers |

**PE export UI:**

| File | Change |
|---|---|
| `hauska-map/apps/property-explorer/src/browse/SitePlanExportSection.tsx` | Provenance chip for footprint tier (`data-testid` pattern matches existing site-plan citation) |

---

## 4. Cert — Jones/Higgins block (pairs with T1)

### 4.1 Context

T1 workstream 1 re-warms the Bastrop city cohort to fix envelope geometry variance (lead exhibit: twelve SF-1 parcels on Jones/Higgins St with identical setback rules but inconsistent envelopes — `HEALTH_CHECK_2026-08-05_verdict.md`). T3 pilot cert runs on the **same block** so acceptance proves **footprint + envelope on one sheet**.

### 4.2 Cert geography

| Item | Definition |
|---|---|
| **Primary block** | Jones/Higgins downtown SF-1 cohort — T1's twelve-parcel lead exhibit + contiguous same-block neighbors |
| **Roster seed bbox** | WGS84 envelope `[-97.328, 30.1055, -97.325, 30.108]` → **44** BCAD `prop_id`s (spatial query 2026-08-05) |
| **Anchor parcel** | `48021:31362` (109 Higgins St) — export fix verified live 2026-08-05 |
| **Regression control** | Block-13 quarantine set (7 parcels) — must stay 7/7 through all T3 applies |
| **Roster source at cert time** | `block13-cert-grade.mjs --roster-from=file` with Jones/Higgins roster JSON filed by T1 area-sweep |

**Roster seed prop_ids (44):** 31209, 31218, 31227, 31236, 31254, 31272, 31281, 31290, 31299, 31308, 31317, 31326, 31335, 31344, 31353, 31362, 31371, 31380, 31389, 31398, 31407, 31416, 31425, 31434, 31443, 31452, 31461, 31470, 31479, 31488, 31524, 31533, 31542, 31551, 31560, 31963, 44113, 45589, 47227, 48006, 56598, 66319, 70963, 71278

T1 narrows to rendered SF-1 subset; T3 cert grades **every rendered parcel** in the Jones/Higgins block (area-sweep, not sample).

### 4.3 Acceptance items (numbered — adversarial grade)

| ID | Check | Pass observation |
|---|---|---|
| **J1** | Block-13 regression | `block13-cert-grade.mjs` → 7/7 CERT-RESTORE ELIGIBLE before and after 48021 site-layer apply |
| **J2** | Footprint present or absent | Every Jones/Higgins roster parcel has ≥1 `building-footprint` atom OR exactly one `sourceTier=absent` sentinel with `evaluated: true` |
| **J3** | ML tier honesty | Footprints from Global ML carry `sourceTier=ml-derived`, `verificationStatus=unsurveyed` or `machine`; PE chip text ≠ "CAD" / survey-grade |
| **J4** | Global ML citation | Atom `sourceCitation.sourceUrl` cites GlobalMLBuildingFootprints release; `sourceVintage` populated |
| **J5** | Geometry sanity | Primary footprint intersects parcel ≥50% (or documented straddle flag); no footprints on invalid/null parcel nodes |
| **J6** | County easement absence | Unincorporated roster parcels (if any in sweep): `utility-easement` sentinel only — no fabricated polygon |
| **J7** | City easement scope | City-limits parcels inside municipal easement overlay: intersecting features produce easement atoms; parcels outside city limits do **not** carry city easement geometry |
| **J8** | Envelope coherence (T1) | After T1 re-warm: Jones/Higgins block envelopes uniform correct geometry (area-sweep mechanical pass + operator R6 on lead twelve) |
| **J9** | Map serve | Live PE on `48021:31362`: footprint overlay visible; InspectCard chip opens atom with tier label |
| **J10** | Site-plan coherence | PDF/DXF export on anchor parcel shows envelope + footprint layers with distinct provenance rows (post ADR-029 implement) |
| **J11** | Warden | Post-cert `warden-sweep --fips=48021 --cert-artifact=…`; no `FOOTPRINT-TIER-OVERCLAIM` or easement-outside-scope findings |
| **J12** | Dry-run/apply parity | `_inbox/*_site_layer_ingest_48021_dry.json` counts match apply artifact exactly |

**Cert artifact path:** `_inbox/<date>_site_layer_cert_48021_jones_higgins.json`

**Mechanical harness extension:** Add rail checks from ingest spec §7.2 to cert roster grading (footprint/easement presence, tier honesty).

---

## 5. Registry row (pilot freeze proposal)

Append to `bastrop-city-tx` row (do not edit OPS-1 until master planner merges):

```json
{
  "rowId": "bastrop-city-tx",
  "fips": "48021",
  "footprintSourceUrl": "https://github.com/microsoft/GlobalMLBuildingFootprints",
  "footprintSourceTier": "ml-derived",
  "footprintAdapterKind": "ml-global-building-footprints",
  "footprintMlPartition": "Texas",
  "footprintJoinField": null,
  "easementSourceUrl": null,
  "easementSourceTier": "absent",
  "easementAdapterKind": "honest-absence",
  "easementProvenanceScope": [
    "maps.co.bastrop.tx.us — no county easement layer",
    "BastropCADWebService — no easement layer"
  ],
  "municipalEasementOverlay": {
    "url": "https://services7.arcgis.com/qOeXJdBtGknaCJC4/arcgis/rest/services/Easements_/FeatureServer/43",
    "layerId": 43,
    "scope": "city-limits",
    "featureCount": 148
  },
  "utilityAdjacentUrls": [
    "https://maps.co.bastrop.tx.us/server/rest/services/RoadAndBridgeMap/PipelinePlus/FeatureServer/0"
  ],
  "siteLayerRecipeVersion": "2026-08-05-T3-WS5"
}
```

Shared FIPS 48021 county unincorporated row uses same ML footprint routing; easement HA without municipal overlay.

---

## 6. Heavy-scan slot reservation

| Item | Status |
|---|---|
| **Slot owner** | T1 (atoms Neon heavy-scan) |
| **T3 reservation** | **BLOCKED — pending master-planner grant** |
| **Requested slot** | Slot 1 / FIPS 48021 (Bastrop city + county uninc. + Elgin + Smithville bundle per Phase 2 plan) |
| **Prerequisite** | T1 envelope re-warm schedule agreed; dry-run county bbox apply scripted |
| **Serial rule** | One heavy scan on atoms DB at a time (`CATCHUP_program_2026-08-05.md` rule 1) |
| **Claim log entry (when granted)** | `{date} T3 WS5 48021 footprint apply reserved {start}-{end} — master planner` |

**Exempt (already done):** read-only four-point probes, local `_scratch` spatial join dry-run, cert re-runs, Warden sweeps.

**Blocked until grant:** prod `--dry-run` on full Texas partition county filter, prod `--apply`, any Neon atom writes for footprints/easements.

---

## 7. Execution sequence (post slot grant)

1. ADR-029 accepted + contract types registered (cc-agent-AC).
2. Engine adapter: `ml-global-building-footprints` + honest-absence easement + optional municipal easement adapter.
3. Registry row freeze (section 5).
4. **Dry-run** full 48021 county bbox → artifact `_inbox/<date>_site_layer_ingest_48021_dry.json`.
5. **block13 7/7** regression gate.
6. **Apply** (slot active) → `_inbox/<date>_site_layer_ingest_48021_apply.json`; counts must match dry-run.
7. T1 envelope re-warm on Jones/Higgins block (coordinate — may precede step 6 if slot shared sequentially).
8. Serve surface implementation (section 3) — PE deploy + engine site-plan deploy.
9. Cert J1–J12 area-sweep → artifact + ledger POST.
10. Master planner live verification → Phase 2 slot 2+ unblocked.

---

## 8. Constraints (binding)

- **NO** bulk prod ingest without master-planner sign-off and slot grant.
- **NO** contract publishes — ADR-029 is PROPOSED only.
- **NO** city/utility relationship asks — public record only.
- **NO** PipelinePlus / CCN / MUD → `utility-easement` atoms.
- **NO** present ML footprints as CAD-authoritative.
- Deploys planner-owned; block13 quarantine never re-warmed as part of city cohort.

---

## 9. Acceptance mapping (T3 WS5)

| Item | Evidence |
|---|---|
| T3-WS5-1 | Footprint routing + spatial join spec (section 1) |
| T3-WS5-2 | Easement county HA + municipal overlay spec (section 2) |
| T3-WS5-3 | Serve surface file list (section 3) |
| T3-WS5-4 | Jones/Higgins cert items J1–J12 (section 4) |
| T3-WS5-5 | This doc + dry-run artifact + slot reservation status (section 6) |

---

## Revision history

- **2026-08-05 (T3 WS5 executor):** Initial Bastrop pilot plan. Local spatial join dry-run on 48021:31362 succeeded. Heavy-scan slot BLOCKED on T1 until master grants.
