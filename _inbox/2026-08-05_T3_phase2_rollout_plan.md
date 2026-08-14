---
id: 2026-08-05_T3_phase2_rollout_plan
title: T3 Workstream 6 — Phase 2 full catch-up rollout plan (footprints + easements)
date: 2026-08-05
status: proposed
owner: nick
workstream: T3 catch-up program 2026-08-05
related: [T3_rails_track, HEALTH_CHECK_2026-08-05_verdict, 2026-08-05_T3_footprint_source_recon, 2026-08-05_T3_easement_source_recon, adr_029_building_footprint_and_utility_easement_rails, CATCHUP_program_2026-08-05, 90_runbooks/factory_onboarding_runbook, _catalog/t3_rails_registry_rows_proposed.json]
method: planning + registry row authoring spec only — NO prod ingests
---

# T3 Workstream 6 — Phase 2 full catch-up rollout plan

Operator authorization: catch-up program greenlit 2026-08-05 (`CATCHUP_program_2026-08-05.md`). This document is the Phase 2 parity path: backfill **building footprints** and **public-utility easements** across every already-onboarded jurisdiction after the Bastrop pilot (T3 WS5) passes acceptance. **Planning and registry authoring only** — no production bulk ingests in this pass.

## Scope

### In Phase 2 (this plan)

| # | Jurisdiction | FIPS | Factory state (2026-08-05 health check) |
|---|---|---|---|
| 1 | Bastrop city | 48021 | CERTIFIED block13 7/7 |
| 2 | Bastrop County (uninc.) | 48021 | CERTIFIED 20/20 |
| 3 | Elgin (city) | 48021 | Pipeline complete; cert residuals open |
| 4 | Smithville (corpus) | 48021 | Live on /search (836 @ 1.00 eval) |
| 5 | Caldwell | 48055 | CERTIFIED 20/20 |
| 6 | Guadalupe | 48187 | CERTIFIED 20/20 |
| 7 | McLennan | 48309 | CERTIFIED 20/20 |
| 8 | Comal | 48091 | Cascade APPLIED; cert queued (freeze) |
| 9 | Bell | 48027 | Gate clean; cascade queued |
| 10 | Hays | 48209 | Gate clean; dry-run queued |
| 11 | Williamson | 48491 | Dry-run complete; apply+cert queued (#254) |

**11 jurisdictions** in Phase 2. Four share FIPS 48021 (Bastrop city, Bastrop County uninc., Elgin, Smithville) — one county bulk-ingest slot covers footprint/easement geometry; city rows get municipal overlays where a separate municipal source exists.

### Deferred to Phase 3 (DFW 9-county substrate)

Per operator restart gate and health-check verdict: DFW Phase 3 remains parked until T1 + T5 acceptance and operator program close. Phase 1 substrate (~2.55M zoning-facts, tiles live) does **not** include T3 rails.

| FIPS | County | Phase 3 note |
|---|---|---|
| 48113 | Dallas | Bulk zip primary (DCAD); ML footprint fallback |
| 48439 | Tarrant | TADParcels REST; ML fallback |
| 48085 | Collin | CCAD Socrata; ML fallback |
| 48121 | Denton | Bulk zip; ML fallback |
| 48397 | Rockwall | Portal-only CAD; ML fallback |
| 48139 | Ellis | Registry row on engine #254 |
| 48251 | Johnson | Open-fetch bulk; ML fallback |
| 48257 | Kaufman | Registry row on engine #254; session parked mid-run |
| 48367 | Parker | Manual/none CAD; ML fallback |

Registry rows for DFW 9 are authored in `_catalog/t3_rails_registry_rows_proposed.json` with `phase: "deferred-phase3"` so the recipe is ready when Phase 3 resumes — **no bulk ingest slots allocated until then**.

---

## Recon summary (routing inputs)

Sources: `_inbox/2026-08-05_T3_footprint_source_recon.md`, `_inbox/2026-08-05_T3_easement_source_recon.md`.

### Footprints

- **0 of 11** probed counties expose a CAD-authoritative building-footprint vector layer on public REST.
- **Default routing for all Phase 2 jurisdictions:** Microsoft Global ML Building Footprints (Texas partition), tier `ml-derived`, spatial join to parcel nodes.
- **Follow-on (not blocking Phase 2):** BCAD bulk export recon (`bastropcad.org/data-downloads`) may unlock tier `cad-authoritative` without REST.
- **Do not use:** EagleView WMTS (imagery only), CAMA tabular sqft, USA Structures points.

### Easements

- **1 county** with queryable county-scale easement GIS: **McLennan** (CAD-derived plat easement linework, layers 9–10).
- **10 jurisdictions** at county fan-out: **honest-absence** for recorded easement GIS + document-parse track deferred.
- **Municipal-only easement GIS** (ETJ/city limits — separate rail, not county coverage): City of Bastrop (148 polys), Round Rock (1,254), Cedar Park (8,400).
- **Utility-adjacent** (do not conflate with easement atoms): PipelinePlus/RRC pipelines, PUCT CCN, MUD boundaries.

---

## Per-jurisdiction rollout table

Legend: **FP** = footprint rail. **EA** = utility-easement rail. **HA** = honest-absence sentinel. **ML** = Microsoft Global ML. **MUN** = municipal overlay (city limits only).

| Jurisdiction | rowId (proposed) | FP source routing | EA source routing | Expected honest-absence states | Bulk ingest slot | Cert check | Warden check |
|---|---|---|---|---|---|---|---|
| Bastrop city | `bastrop-city-tx` | ML Texas partition → spatial join via `BastropCADWebService/0` (`prop_id`) | County: **HA** + document-parse deferred. **MUN:** City Easements FS/43 (148 polys, ETJ only) — optional Phase 2b municipal ingest | Parcels outside city limits: county HA. Parcels with no ML intersection: `footprint sourceTier=absent`. No county easement layer: `easement sourceTier=absent` per parcel | **Slot 1** (pilot; pairs T1 envelope re-warm) | Jones/Higgins block area-sweep: footprint polygon visible + provenance chip `ml-derived`; envelope coherence with T1 re-warm | Post-ingest: `servePathTruth` on footprint serve; `provenanceScope` lists ML + sources checked; no fabricated easement polygons outside MUN |
| Bastrop County uninc. | `bastrop-county-uninc-tx` | Same ML + BCAD join as city cohort | **HA** (county REST probed — no easement layer). PipelinePlus = utility-adjacent only (separate rail, not EA) | Unincorporated parcels: easement HA. Unbuilt/no ML hit: footprint HA | **Slot 1** (same 48021 county run as city) | Stratified uninc. roster 20/20: footprint present or named absent; block13 regression 7/7 unchanged | Warden v1.1 sweep; expect ~9 findings post-propagation bake (T1), not T3-induced |
| Elgin | `elgin-tx` | ML + BCAD (same FIPS 48021 bulk) | **HA** (no public REST; TRC GIS vendor maps PDF-only) | Same as Bastrop county for EA; footprint ML or absent | **Slot 1** (48021 bundle) | Elgin stratified cert roster: footprint on promoted sample; honest EA absence on city parcels | Mixed-city county caveat: triage Warden city-stamped parcels vs uninc. cascade expectations |
| Smithville | `smithville-tx` | ML + BCAD (48021) | **HA** (no city easement REST discovered) | Corpus-only jurisdiction: rails follow county; code corpus unchanged | **Slot 1** (48021 bundle) | /search corpus eval holds; spot-check 5 Smithville-zoned parcels for footprint chip | Serve-path on corpus-linked parcels |
| Caldwell | `caldwell-county-uninc-tx` | ML + `Caldwell_County_Parcel_Map/1` (`prop_id`) | **HA**. CCN/MUD layers = utility-adjacent only | County-wide easement HA; CCN not easement atoms | **Slot 2** | 20/20 unzoned cert pattern: footprint ML on sample; EA absence named | Warden v1.1 clean (Caldwell precedent) |
| Guadalupe | `guadalupe-county-uninc-tx` | ML + `GuadalupeCADWebService/0` (`prop_id`) | **HA**. MUD layer (4) = utility-adjacent | Easement HA; MUD not EA | **Slot 3** | 20/20 cert: footprint tier chip; no silent easement fill | Warden 0 flags (health check) |
| McLennan | `mclennan-county-uninc-tx` | ML + `McLennanCADWebService/0` (`prop_id`) | **CAD-derived GIS:** layers 9 Easement Lines (44,197) + 10 Easement Text (16,578). `sourceTier=county-gis`. Partial DOC_NUM → grade coverage % | Parcels with no easement intersection: per-parcel absence within county that HAS a layer (distinct from county-wide HA) | **Slot 4** (first easement-adapter proof) | 20/20 + easement coverage report: ≥1 intersecting parcel shows EA atom; DOC_NUM null rate documented | Warden: no easement/contradiction checks in v1 — manual spot-check 10 parcels with/without easement intersection |
| Comal | `comal-county-uninc-tx` | ML + `Comal_County_Parcels/40` (`PROP_ID`) | **HA** (county GIS hosts 404/unreachable; no easement layer) | County-wide easement HA | **Slot 5** (after T5 Comal cert) | Cert when unblocked: footprint on cascade cohort sample | Warden mixed-city blind-spot: Seguin/Cibolo city stamps — triage before defect filing |
| Bell | `bell-county-uninc-tx` | ML + `BellCADWebService/0` (`prop_id`) | **HA** (11 CAD layers, zero easement) | County-wide easement HA | **Slot 6** | Post-cascade cert: footprint ML; EA HA | Standard county sweep |
| Hays | `hays-county-uninc-tx` | ML + StratMap staged bulk / county cadastral (gate #251) | **HA** (thin county REST) | County-wide easement HA | **Slot 7** | Post dry-run/apply cert | Standard |
| Williamson | `williamson-county-uninc-tx` | ML + `county_wcad_parcels/0` (`PropertyID`) | County: **HA**. **MUN (Phase 2b):** Round Rock Easements (1,254), Cedar Park (8,400) — ETJ only, not county fan-out | County easement HA; municipal easements only inside city limits | **Slot 8** (after engine #254) | Cert blocked on #254; when green: footprint + county EA HA | ROW-bond layers (`WilCo_ROW_Prod`) are NOT easement — Warden triage |

---

## Bulk ingest slot sequencing (one county at a time behind T1)

**Rule:** T1 owns the atoms-DB heavy-scan slot (`CATCHUP_program_2026-08-05.md` coordination rule 1). T3 bulk footprint/easement ingests **reserve the slot through the master planner** and run **one county FIPS per slot**, never parallel with T1 envelope re-warm or T5 cascade on the same FIPS.

| Slot | FIPS | Counties / rows covered | Prerequisite | Rationale |
|---|---|---|---|---|
| 1 | 48021 | Bastrop city, Bastrop County uninc., Elgin, Smithville | T3 WS5 Bastrop pilot acceptance; T1 envelope re-warm schedule agreed | Pilot proof + T1 coherence win (footprint + envelope on Jones/Higgins) |
| 2 | 48055 | Caldwell | Slot 1 complete + cert | Smallest certified county; low risk |
| 3 | 48187 | Guadalupe | Slot 2 complete | Certified; Warden-clean |
| 4 | 48309 | McLennan | Slot 3 complete | **Easement adapter proof** — only county with easement GIS |
| 5 | 48091 | Comal | T5 Comal cert complete | Cascade applied; cert was frozen |
| 6 | 48027 | Bell | T5 Bell cascade+cert | Cost-gate clean ($1.15) |
| 7 | 48209 | Hays | T5 Hays cascade+cert | Gate #251 clean |
| 8 | 48491 | Williamson | Engine #254 merged + cert | PropertyID threading required |

**Between slots:** regression gate (Bastrop block13 7/7), dry-run/apply count match, ledger POST per runbook §3.

**Municipal easement overlays (Phase 2b, non-blocking):** City of Bastrop FS/43, Round Rock, Cedar Park — light ingests after county slot for parent FIPS completes; do not block county HA declaration.

**DFW 9:** no slot until Phase 3 restart gate clears.

---

## Cert checks per county (T3 additions to factory cert)

Add to the standard cert roster after footprint/easement ingest (area-sweep where product-visible, sample elsewhere per OPS-5 doctrine):

| Check | Pass criterion | Fail class |
|---|---|---|
| `footprintProvenancePresent` | Every sampled parcel with ML intersection carries `building-footprint` atom with `sourceTier=ml-derived` (or `cad-authoritative` if bulk export unlocks) + `sourceCitation` | `FOOTPRINT-PROVENANCE-MISSING` |
| `footprintHonestAbsence` | Parcels with no ML intersection carry sentinel or explicit absence, not fabricated polygon | `FOOTPRINT-FABRICATED` |
| `footprintTierHonesty` | ML footprints never served with CAD-authoritative chip | `FOOTPRINT-TIER-OVERCLAIM` |
| `easementHonestAbsence` | Counties without easement layer: every sampled parcel carries `utility-easement` absence or equivalent sentinel with `provenanceScope` listing probed sources | `EASEMENT-SILENT-ABSENCE` |
| `easementGisPresent` | McLennan (and future GIS counties): intersecting parcels carry easement atom with CAD lineage fields; DOC_NUM null rate ≤ documented recon rate | `EASEMENT-GIS-GAP` |
| `easementUtilityAdjacentSeparation` | PipelinePlus/RRC/CCN/MUD layers do NOT populate `utility-easement` atoms | `EASEMENT-UTILITY-CONFLATION` |
| `block13Regression` | Bastrop block13 7/7 after any shared-code or 48021 ingest | existing regression gate |

McLennan easement cert uses a **dedicated stratified roster**: 10 parcels with known easement intersection + 10 without + 5 null-DOC_NUM spot checks.

---

## Warden checks per county

Warden v1 ships four checks (`neighborConsistency`, `servePathTruth`, `crossStoreConsistency`, `certFreshness`). T3 adds **planner-graded manual probes** until Warden v1.2 ships easement/footprint shape checks (health-check item: envelope-within-parcel, area-ratio — extend to footprints):

| County | Warden invocation | T3-specific triage |
|---|---|---|
| 48021 | Post Slot 1; supply `--cert-artifact` | Footprint serve on Jones/Higgins block; confirm no easement atoms outside municipal overlay |
| 48055, 48187 | Post slot cert | Standard; EA absence must not trigger SERVE-PATH false positive |
| 48309 | Post Slot 4 | Manual: easement linework parcels vs absence parcels; DOC_NUM partial coverage is expected, not defect |
| 48091 | Post cert | Mixed-city: apply WARDEN-MIXED-CITY-BLIND-SPOT triage (Seguin/Cibolo) |
| 48491 | Post #254 cert | Ignore ROW-bond layers as easement; municipal RR/CP only inside ETJ |

Post every sweep to ledger (`warden-sweep` sourceKind) per factory runbook §3.

---

## Registry row deliverable

Proposed T3 rail fields for all jurisdictions (Phase 2 + deferred DFW 9): `_catalog/t3_rails_registry_rows_proposed.json`.

Fields per ADR-029 + recon:

- `rails.footprint`: `sourceUrl`, `sourceTier`, `layerId`, `joinField`, `adapterId`, `fallbackUrl`, `honestAbsencePolicy`
- `rails.easement`: same + `municipalOverlays[]` where applicable
- `rails.utilityAdjacent[]`: pipeline/CCN/MUD (informational, not easement ingest)
- `phase2Slot`, `probeEvidence`, `frozen_at: null` (unfrozen until master-planner review)

---

## Counts (operator pickup)

| Metric | Count |
|---|---|
| Phase 2 jurisdictions | **11** |
| Jurisdictions with **county-scale GIS easement** rail | **1** (McLennan — CAD-derived partial) |
| Jurisdictions with **county-scale honest-absence** easement | **10** |
| Municipal easement GIS (optional Phase 2b overlay) | **3** cities (Bastrop, Round Rock, Cedar Park) |
| Counties requiring **ML footprint fallback** | **11** (all Phase 2; 0 CAD-authoritative REST) |
| DFW counties deferred | **9** |
| Bulk ingest slots (Phase 2) | **8** (by FIPS; 48021 bundles 4 rowIds) |

---

## Sequencing recommendation (executive)

1. **Finish T3 WS5 Bastrop pilot** (Slot 1 dry-run only until pilot acceptance).
2. **Coordinate Slot 1 with T1** envelope re-warm on the same 48021 cohort for the site-plan coherence win.
3. **Run Slots 2–3** (Caldwell, Guadalupe) — certified, low complexity, ML-only footprints, easement HA.
4. **Slot 4 McLennan** — prove easement GIS adapter before wider rollout.
5. **Queue Slots 5–8 behind T5** cert lane (Comal → Bell → Hays → Williamson/#254).
6. **Phase 2b municipal easements** (Bastrop city, Round Rock, Cedar Park) after parent county slot certifies.
7. **Hold DFW 9** until Phase 3 restart; registry rows pre-authored for resume.

No production bulk ingests from this planning pass. Next executor action after master-planner sign-off: freeze registry rows → Bastrop pilot ingest (T3 WS5).
