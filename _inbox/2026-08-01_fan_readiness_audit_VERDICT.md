---
id: 2026-08-01_fan_readiness_audit_VERDICT
title: PRE-FAN GATE VERDICT — read-only fan-readiness audit (source-correctness + honest-degradation + cold-county generalization)
date: 2026-08-01
status: verdict
owner: coordinator (read-only audit)
related: [2026-08-01_fan_readiness_audit_dispatch, 2026-07-13_cotality_swap_public_record_migration, 28_THE_BASTROP_MOLD_engine_build_spec]
purpose: Go/no-go gate before fanning the certified mold across ~254 TX counties. READ-ONLY probes only; adversarially gated.
---

# Fan-readiness audit — GO/NO-GO verdict

**Date:** 2026-08-01  
**Coordinator:** single owner, three lanes fanned and blocked until return, adversarial gate run on every finding  
**Constraint honored:** READ-ONLY throughout — no code, deploys, ingests, or writes

---

## THE VERDICT: **NO-GO**

Do **not** fan the certified mold across ~254 TX counties until the ranked defects below are fixed. The mold **fails closed honestly** on true cold counties (no Williamson-style fabrication observed live), and the **customer parcel path is source-correct** for the ~10 Central-TX breadth counties. But **generalization to cold counties fails on the live customer path**: Harris and Fayette have authoritative public GIS/CAD data that our live stack does not reach. Fanning today would stamp honest-empty (`atom_path_pending` / `no-coverage`) across ~244 counties — not confidently-wrong data, but **not a property-intelligence product either**.

**What breaks first at scale:** county parcel provider registration (map pin → polygon) before atom breadth, CAD join, or zoning can mean anything.

---

## Live infra at probe time (coordinator-verified)

| Service | Serving revision | Notes |
|---------|------------------|-------|
| engine-api | `hauska-engine-api-00159-suv` @100% | `_STATE.md` cited `00152-nuz` — stale |
| retrieval-api | `hauska-retrieval-api-00052-suj` @100% | spine/run POST works |
| cortex-api | `cortex-api-00454-wud` @100% | |
| PE | `property-explorer-xi.vercel.app` | atom-path facets proxy live |

---

## Q1 — Source correctness matrix

Measured against SOURCE RULINGS (`_decisions/2026-07-13_cotality_swap_public_record_migration.md` + dispatch).

| Layer | Verdict | Live path / evidence | Adversarial gate |
|-------|---------|----------------------|------------------|
| **Parcels (PE/cortex customer path)** | **authoritative** | `brokerageGisLayers.ts:641` → `txParcelProviderMode()=county-gis` → county ArcGIS or TxGIO store; Cotality decommission throw at `:683-692` | **CONFIRMED** — Harris probe returns explicit decommission message, not Cotality |
| **Parcels (engine map-layers/assemble)** | **stale-risk** | `layerSpecs.ts:20,60` → `cotality:parcels` / `cotality:zoning` only | **CONFIRMED** — safe today only because creds unmounted (`no-coverage`, zero network); fan-dangerous if creds return |
| **Parcels (engine geometry resolver)** | **authoritative** | `TxgioDatabaseParcelGeometryResolver` + optional ArcGIS env; no Cotality | **CONFIRMED** (code) |
| **Join key** | **authoritative** | `{fips}:{normalizeCadPropId}`; brief CLIP → apn:/geo: | **CONFIRMED** |
| **CAD / land-use** | **authoritative** (where baked) | `cad_property` PACS/Orion ingest; assessed labeled assessed | **CONFIRMED** on Guadalupe/Bastrop live |
| **Zoning / setback** | **authoritative** (routing) | City AGOL stamp → Tier-1 bake → atoms; Bastrop spine fires `zoning-agol:bastrop-city-tx` | **CONFIRMED** — county `bastrop-tx:zoning` dead-expected |
| **Flood** | **authoritative** | FEMA NFHL adapter + Bastrop county republish layer | **CONFIRMED** — spine + live FEMA probe |
| **Terrain** | **authoritative** | USGS 3DEP EPQS | **CONFIRMED** (lane Q1); anonymous PE topography path not probeable |
| **Soils** | **authoritative** | SSURGO via USDA SDA POST | **CONFIRMED** — live bbox query 11 features |
| **Fabrication firewall** | **authoritative** (code + live flag) | `joinIntegrityGate` → `county_facet_coverage` → `landUseGateBlocked` on facets | **CONFIRMED** — Williamson R-prefix shows `landUseGateBlocked:true` |
| **Cotality branch** | **authoritative** (gated dormant) | `readCotalityAppCredentials` → `no-coverage`, zero network | **CONFIRMED** — no live Cotality hit on default path |
| **Regrid** | **authoritative** (dead/removed) | Removed from registry | **CONFIRMED** |

### Raw probes — warm county (Bastrop) source path

Spine `/health/spine/run` (retrieval-api, POST):

```json
{"probeId":"bastrop-tx:parcels","status":"firing","signal":{"url":"https://maps.co.bastrop.tx.us/server/rest/services/Cadastral_BP/Bastrop_County_Parcels/FeatureServer/0","featureCount":1}}
{"probeId":"zoning-agol:bastrop-city-tx","status":"firing","signal":{"field":"PlaceTypeClass","count":574}}
{"probeId":"bastrop-tx:zoning","status":"dead-expected","error":"County LandUse/Zoning retired; replacement is zoning-agol:bastrop-city-tx"}
```

Warm parcel facets (`48021:28286`):

```json
{"landUse":{"code":"A1","source":"cad-roll","vintage":"data-export-01.14.2026"},"zoning":{"district":"SF-1","jurisdictionKey":"bastrop-city-tx"},"landUseGateBlocked":false}
```

---

## Q2 — Honest degradation matrix

| Layer | Verdict | Evidence | Adversarial gate |
|-------|---------|----------|------------------|
| **Parcel geometry** | **honest-absence** (Harris/Fayette); **populated** (Guadalupe) | Harris/Fayette: `no-coverage` on gis-layer | **CONFIRMED** |
| **Join key** | **honest-absence** (cold); **resolves** (Guadalupe) | Cold: `atomPathReason:"atom-chain empty"` | **CONFIRMED** |
| **CAD / land-use** | **honest-absence** | Comal NULL: `landUse:null`, `facetCoverage.landUse:false` | **CONFIRMED** — not silent-neutral |
| **Zoning / setback** | **honest-absence** | `declineReason:"no-zoning-stamp"` with disclosure string | **CONFIRMED** |
| **Flood** | **honest-absence** (cold); **authoritative** (Guad baked) | Guad tier2: `source:"fema-nfhl"` | **CONFIRMED** |
| **Terrain** | **PLAUSIBLE honest-unavailable** | PE anonymous path blocks `site-topography` (403) | Not live-proven on cold county |
| **Soils** | **authoritative** | Live SSURGO bbox 200 + 11 features | **CONFIRMED** |
| **Owner-match gate** | **honest-absence / blocks collision class** | Williamson R-prefix: `landUseGateBlocked:true`, source `cad-roll-address-join` | **CONFIRMED** |

### Fabrication firewall stress — Williamson R-prefix control (live)

```json
GET property-explorer-xi.vercel.app/api/spine/property-atoms/48491%3AR062578/facets

{"baseFacts":{"apn":"R062578","landUse":{"code":"A1","source":"cad-roll-address-join"}},"provenance":{"landUseSource":"cad-roll-address-join","landUseGateBlocked":true}}
```

Prop_id collision class is flagged; value promoted only via address-join recovery, not blind R-strip. **Williamson R-prefix fabrication class does not recur on cold counties** because cold counties emit no land-use at all.

### NULL use-code (Hays/Comal class)

Comal `48091:50000`: `landUse:null`, `facetCoverage.landUse:false` — **not** silent-neutral at API layer.

---

## Q3 — Cold-county generalization

### Summary

| County | FIPS | Parcel geometry | Join key | CAD/land-use | Zoning | Owner-match gate | Verdict |
|--------|------|-----------------|----------|--------------|--------|------------------|---------|
| **Harris** | 48201 | **NO** (`no-coverage`) | syntactic only | null (`atom_path_pending`) | null | N/A (nothing emitted) | **FAIL** |
| **Fayette** | 48149 | **NO** (`no-coverage`) | syntactic only | null (`atom_path_pending`) | null | N/A | **FAIL** |
| **Guadalupe** | 48187 | **YES** (TxGIO) | live `48187:prop_id` | populated (`cad-roll`) | honest absent or **R-1** verified | holds (`gateBlocked:false`) | **PARTIAL** |

**Guadalupe caveat:** breadth-baked 2026-07-24 (~93k parcels, owner-match 98.5% sample). Not a zero-data county; valid middle case adjacent to warm cluster.

### Harris 48201 — parcel spot-checks (coordinator-verified)

**Map parcel layer** (pin bbox Houston):

```json
{"error":"no-coverage","message":"No supported county parcel service covers this point (Cotality decommissioned; no public-record parcel provider for this location).","layer":"parcels"}
```

**Facets** `48201:1144740190749` (7906 WOODSMAN — HCAD ground truth attempted; SSL/cert blocked direct HCAD curl from probe host; subagent lane verified via alternate HCAD endpoint):

```json
{"parcelNodeId":"48201:1144740190749","facets":{"baseFacts":{"apn":"1144740190749","landUse":null,"acreage":null,"situsAddress":null},"envelope":{"declineReason":"atom_path_pending","disclosure":"No property atom chain for this parcel yet — honest decline (not invented)."}},"atomPathReason":"atom-chain empty"}
```

HCAD has owner `HILL GERALD B`, land_use `1001`, appraised value — **our live path emits nothing**.

Additional Harris parcels (`48201:1100330000006`, `48201:0460790000030`): identical `atom_path_pending`, empty atom chain.

### Fayette 48149 — parcel spot-checks

**Map:** `no-coverage` (La Grange center bbox).

**Facets** `48149:104171` (852 WORMLEY LN — StratMap: MUSE, KELVIN SR, 32.7 ac):

```json
{"parcelNodeId":"48149:104171","facets":{"baseFacts":{"apn":"104171","landUse":null},"envelope":{"declineReason":"atom_path_pending"}},"atomPathReason":"atom-chain empty"}
```

Additional: `48149:104172`, `48149:114101` — same honest-empty pattern.

**Fayette zoning honest-absence post-onboard:** **PLAUSIBLE** — cannot verify live until provider + bake exist.

### Guadalupe 48187 — parcel spot-checks (ground-truth compared)

**Unzoned rural** `48187:15213`:

```json
{"zoning":null,"envelope.declineReason":"no-zoning-stamp","landUse":"F1","landUseGateBlocked":false}
```

**Seguin zoned** `48187:27438` (720 ELLEY — coordinator-verified):

```json
{"baseFacts":{"landUse":{"code":"A1","source":"cad-roll"},"acreage":{"value":0.1079}},"zoning":{"district":"R-1"},"envelope":{"declineReason":"setback-rule-pending"},"landUseGateBlocked":false,"bakedAt":"2026-07-24T19:29:45.013Z"}
```

Seguin city GIS at parcel centroid returns `zone:"R-1"` — **CONFIRMED** match (subagent probe; not re-run independently this pass).

County GIS vs our live: situs, acreage (~0.1 ac), land use A1, zoning R-1 — **align**. Envelope/setback chain incomplete (`setback-rule-pending`).

---

## Ranked mold defects (most fan-dangerous first)

| Rank | Defect | Fix class | Gate status |
|------|--------|-----------|-------------|
| **1** | **Parcel provider registry stops at Central-TX breadth ~10 counties** — Harris/Fayette and ~244 others return `no-coverage` on live `gis-layer` | Register HCAD + Fayette CAD (+ per-county catalog entries) in county-GIS/TxGIO provider table; same pattern as `txgio:parcels:48187` | **CONFIRMED** |
| **2** | **Atom breadth not extended beyond breadth-bake counties** — `atom_path_pending` everywhere outside Guadalupe-style counties | Run Tier-1 + atom breadth bake per new county with owner-match gate | **CONFIRMED** |
| **3** | **HCAD join-key / ingest shape unproven** — 13-digit `HCAD_NUM` vs Central-TX integer `prop_id`; different appraisal system (HCAD not PACS/Orion) | HCAD-native ingest + owner-match sample n=200 before promoting land-use | **PLAUSIBLE** — not live-tested |
| **4** | **`map-layers/assemble` layerSpecs Cotality-primary** (`parcel-polygon`, `zoning`) | Repoint layerSpecs to county-GIS adapters; remove Cotality as primary before any cred remount | **CONFIRMED** (code line) |
| **5** | **Depth-warm incomplete on breadth counties** — Guadalupe has zoning-fact (Seguin R-1) but `setback-rule-pending` | Schedule depth-warm for city-zoned cohorts before selling envelope product | **CONFIRMED** on `48187:27438` |
| **6** | **Address geocode → parcel weak for metro** — Houston address failed buildable-envelope despite HCAD having parcel | Address resolution path for HCAD-scale counties | **PLAUSIBLE** (subagent lane) |
| **7** | **Spine health pack Bastrop-scoped only** — no live cold-county coverage ledger probe | Extend spine monitors or coverage ledger API for fan counties | **PLAUSIBLE** |
| **8** | **Terrain not observable on anonymous PE path** | Not a fan-blocker for parcel/CAD/zoning; verify on signed/gated path before terrain report fan | **PLAUSIBLE** |

---

## Adversarial gate summary (coordinator-owned)

| Finding | Refuter attempt | Survives? |
|---------|-----------------|-----------|
| Customer parcel path is county-GIS/TxGIO, not Cotality | "Maybe cache hits Cotality" | **CONFIRMED** — explicit decommission throw; spine fires county URLs |
| Cold counties fail honestly, no fabrication | "`atom_path_pending` is just empty product" | **CONFIRMED** — honest, but **NO-GO for fan** (empty ≠ intelligence) |
| Guadalupe generalizes base layer | "It was breadth-baked, not cold" | **CONFIRMED with caveat** — valid middle case |
| Guadalupe R-1 on 27438 | "Stale/wrong zoning" | **CONFIRMED** — Seguin GIS R-1 at centroid |
| Owner-match holds on cold county | "Only tested on baked Guadalupe" | **PLAUSIBLE** — Harris/Fayette untested (nothing to gate) |
| Fan-safe today because honest-empty | "Honest empty scales fine" | **REFUTED for fan purpose** — 254 counties of `atom_path_pending` is not the product promise |
| layerSpecs Cotality risk | "Creds unmounted so irrelevant" | **CONFIRMED stale-risk** — latent wrong-routing on cred remount |

Default when uncertain: **refuted**. Findings above marked CONFIRMED only where coordinator or lane pasted independent live raw output.

---

## Conditions for GO (re-grade gate)

Re-run this audit READ-ONLY after:

1. Harris + Fayette (minimum) registered on live parcel provider path — map pin returns polygon from county GIS, not `no-coverage`.
2. Breadth bake + owner-match gate pass recorded in `county_facet_coverage` for each new county before fan stamp.
3. HCAD join validated (HCAD_NUM key, owner agreement sample) — **mandatory before Harris land-use promotion**.
4. `layerSpecs.ts` Cotality-primary slots remediated or endpoint deprecated for fan consumers.
5. Spot-check matrix repeated: ≥3 parcels per county with independent county GIS/CAD ground truth, raw output pasted.

Until then: **NO-GO**.

---

## Lane handbacks

- Q1 source correctness: coordinator-verified; stale-risk on `map-layers/assemble` confirmed via local `layerSpecs.ts` read
- Q2 honest degradation: coordinator-verified Williamson R-prefix + Comal NULL + cold county declines
- Q3 cold generalization: coordinator independently reproduced Harris/Fayette/Guadalupe facet payloads; HCAD direct curl blocked (SSL 404 from probe host — subagent ground truth retained as PLAUSIBLE for Harris owner/land_use fields)

**In-flight fleets not touched:** spine-ledger PRs, OZ, FD5 canary — out of scope per dispatch.
