---
id: 2026-07-24_BREADTH_COVERAGE_MILESTONE_central_tx
title: COVERAGE MILESTONE — Central-TX property-atom breadth (hand back)
status: active
date: 2026-07-24
applies_to: doc_repo planner + operator review
related: [2026-07-23_BREADTH_WDLL_central_tx_coverage, 2026-07-23_MASTER_WDLL_property_reasoning_substrate, 2026-07-23_PHASE1_FINISH_checkin_property_reasoning_substrate]
owner: nick
---

# COVERAGE MILESTONE — Central-TX property-atom breadth

**From:** breadth execution seat  
**Stop:** coverage milestone. **Phase 2 (engine WDLL) NOT opened.**  
**Ask:** operator + planner grade against live Neon, not bake summary alone.

## 1. Geometry ceiling (item 1)

**Decision: INCLUDE all 10 counties** (neither declare-gap nor unify-first).

Kickoff assumed Guadalupe / Bell / McLennan had no parcel geometry. Live Neon `txgio_parcel` (2026-07-23/24) showed geometry for all three:

| County | FIPS | `txgio_parcel` with geometry |
|---|---:|---:|
| Bell | 48027 | 184,470 |
| Guadalupe | 48187 | 106,508 |
| McLennan | 48309 | 130,650 |

Tier-1 snapshots also present for all three. Unify-first not required. Declaring a gap would have been an over-claim of absence.

## 2. Bake scope (item 2) — no silent truncation

Full Tier-1 denominator bake for all 10 counties. `bounds.explicitCap=false`, `ofTier1Denominator=1.0` on every county ledger. Metro wall ~3.86h. Engine code: hauska-engine **#104** (merged).

Live spot-audit of `hauska_mcp.atoms` (2026-07-24, post-bake) vs ledger parcelsSeen:

| County | FIPS | Tier1 denom / ledger parcels | Live zoning-fact rows | Over-claim? |
|---|---:|---:|---:|---|
| Bastrop | 48021 | 62,257 | 62,257 | no |
| Bell | 48027 | 165,574 | 165,574 | no |
| Bexar | 48029 | 703,258 | 703,258 | no |
| Caldwell | 48055 | 24,989 | 24,989 | no |
| Comal | 48091 | 103,207 | 103,207 | no |
| Guadalupe | 48187 | 93,728 | 93,728 | no |
| Hays | 48209 | 116,421 | 116,421 | no |
| McLennan | 48309 | 114,255 | 114,255 | no |
| Travis | 48453 | 380,918 | 380,918 | no |
| Williamson | 48491 | 282,570 | 282,570 | no |

**Random cell check (Bexar):** ledger claimed 703,258 parcels / 704,886 atoms; live zoning-fact=703,258, setback=814, envelope=814. PASS.

## 3. Per-county baked-% per facet + honest-absence rate (item 3)

Percents are of parcelsSeen (= full Tier-1). Absence rate = zoningAbsence / parcelsSeen.

| County | Zoning present % | Zoning absence % | Setback % | Envelope % | Spike flags | Notes |
|---|---:|---:|---:|---:|---:|---|
| Caldwell | 25.97 | 74.03 | 22.03 | 22.03 | 0 | |
| Bastrop | 9.27 | 90.73 | 9.20 | 9.20 | 0 | |
| Comal | 25.85 | 74.15 | 24.60 | 24.60 | 0 | |
| Hays | 41.86 | 58.14 | 29.59 | 29.59 | many | geographic clustering (place_key order); final rate matches Tier1 with_zoning, not a mid-bake 404 |
| Guadalupe | 0 | 100 | 0 | 0 | 0 | honest all-absence (no zoning stamp in Tier1) |
| McLennan | 0 | 100 | 0 | 0 | 0 | honest all-absence |
| Bell | 0 | 100 | 0 | 0 | 0 | honest all-absence |
| Williamson | 44.11 | 55.89 | 44.06 | 44.06 | some | same clustering pattern as Hays |
| Travis | 5.78 | 94.22 | 5.78 | 5.78 | 0 | |
| Bexar | 0.37 | 99.63 | 0.12 | 0.12 | 0 | Bexar rule at scale: null zoning → `no-zoning-stamp`, not invent |

Hays/Williamson spike monitor fired on rolling windows vs first-500 baseline. **Interpreted as geographic zoning density change along sorted place_key, not source outage** — final county absence rates align with pre-bake Tier1 `with_zoning` fractions. No bake aborted. No fabricated fill.

## 4. Owner-match spot audits (item 4) — verbatim

| County | Join | Verbatim |
|---|---|---|
| Bastrop 48021 | prop_id | `owner-match rate 96.0% (192/200) sample=200 verdict=pass` |
| Bell 48027 | prop_id | `owner-match rate 100.0% (200/200) sample=200 verdict=pass` |
| Bexar 48029 | prop_id | `owner-match rate 100.0% (200/200) sample=200 verdict=pass` |
| Caldwell 48055 | prop_id | `owner-match rate 92.5% (185/200) sample=200 verdict=pass` |
| Comal 48091 | prop_id | `owner-match rate 100.0% (200/200) sample=200 verdict=pass` |
| Guadalupe 48187 | prop_id | `owner-match rate 98.5% (197/200) sample=200 verdict=pass` |
| Hays 48209 | prop_id | `owner-match rate 0.0% (0/200) sample=200 verdict=block` |
| Hays 48209 | address | `owner-match(address) rate 67.5% (135/200) sample=200 verdict=pass` |
| McLennan 48309 | prop_id | `owner-match rate 100.0% (200/200) sample=200 verdict=pass` |
| Travis 48453 | prop_id | `owner-match rate 94.0% (188/200) sample=200 verdict=pass` |
| Williamson 48491 | prop_id | `owner-match rate 0.0% (0/0) sample=0 verdict=insufficient-sample` |
| Williamson 48491 | address | `owner-match(address) rate 74.5% (149/200) sample=200 verdict=pass` |

Hays/Williamson prop_id join is the known collision class; address-join recovery passes (same integrity gate as LDT land-use recovery). Atom bake inputs are Tier1 snapshots already gated at facet promotion — spot audit confirms join integrity still holds on the recovery path.

## 5. Permit feeds (item 5 / WDLL 3.10)

| Feed | Jurisdiction | Status this pass | Ledger write |
|---|---|---|---|
| austin-soda | City of Austin (not all Travis) | **Live bulk** | wrote; overlay backtest on Hays gold `n=119` |
| san-marcos-arcgis | City of San Marcos / Hays | **Live bulk** | wrote (31–40 rows sample) |
| san-antonio-csv | City of San Antonio / Bexar | **Live bulk** | wrote |
| cedar-park-arcgis | Cedar Park / Williamson | **Live bulk** | wrote |
| new-braunfels-arcgis | New Braunfels / Comal | **Live bulk** | wrote |
| bastrop-mygov | Bastrop | **PARTIAL** (no public bulk; 401 without secrets) | asserted-only |
| grand-county-ut | Grand County UT | **PARTIAL** (no bulk) | out of Central-TX metro |

**Asserted-only for earning loop (no municipal bulk found this pass):** Caldwell countywide, Bell, Guadalupe, McLennan, Travis outside Austin, Bexar outside San Antonio, Williamson outside Cedar Park, Comal outside New Braunfels, Hays outside San Marcos, Bastrop.

Municipal feeds are **not** relabeled as county-wide.

## 6. Report identity 3.13c (item 6)

**Deferred this pass.** Map + MCP share StoragePort atom ids on the property-atom path; a reporting-package compose from the same DIDs was not re-proven in this wave. Carry as PARTIAL.

## 7. Cost per county (item 7 / commitment #3)

Heuristic Neon CU estimate (not a GCP invoice). Gate $200/county.

| County | Approx USD | Wall min | Over gate? |
|---|---:|---:|---|
| Caldwell | 0.07 | 2.1 | no |
| Bastrop | 0.15 | 4.4 | no |
| Comal | 0.31 | 8.9 | no |
| Hays | 0.38 | ~10 | no |
| Guadalupe | 0.19 | ~5 | no |
| McLennan | 0.23 | ~6 | no |
| Bell | 0.34 | ~8 | no |
| Williamson | 1.09 | ~35 | no |
| Travis | 0.87 | ~25 | no |
| Bexar | 1.48 | ~100 | no |
| **Metro total** | **~$5.12** | **~231** | **clear** |

## 8. Code / deploy

| Item | Value |
|---|---|
| Engine PR | https://github.com/empressaioemail-tech/hauska-engine/pull/104 (merged, CI green) |
| Bake entrypoints | `bake-property-atom-county`, `bake-property-atom-metro`, `cloudbuild.property-atom-bake.yaml` |
| Contract / retrieval | unchanged tip; atoms written to live `hauska_mcp` StoragePort |
| Phase 2 | **not opened** |
| Circle / ICC rates | still operator-action; not blocked |

## 9. Breadth WDLL finish card

1. Geometry ceiling — **met** (include-all-10; live counts)
2. Full geometry-having metro baked — **met** (10/10, denom=1.0, live spot-audit)
3. Honest-absence monitor — **met** (rates on ledger; Hays/Williamson spikes documented as clustering)
4. Owner-match spot — **met** (verbatim above; Hays/Williamson via address join)
5. Permit feeds broadened — **partial/met** (5 live municipal feeds; named asserted-only remainder)
6. 3.13c report identity — **dropped/deferred**
7. Cost recorded under gate — **met**
8. Milestone report — **met** (this doc)

## Hand back

Operator review: accept metro coverage, keep Phase 2 closed, decide whether to chase remaining municipal permit portals or clear 3.13c next. Breadth mechanisms + full Central-TX Tier1 atom emission are live.
