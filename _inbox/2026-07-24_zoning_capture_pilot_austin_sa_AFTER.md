---
id: 2026-07-24_zoning_capture_pilot_austin_sa_AFTER
title: Zoning-capture pilot AFTER — Austin + San Antonio (Phase 2 close)
status: active
date: 2026-07-24
applies_to: legacy-design-tools (cad-ingest zoning stamp), hauska-engine property atoms
related: [2026-07-24_zoning_capture_diagnosis_austin_sa_pilot, 2026-07-24_BREADTH_COVERAGE_MILESTONE_central_tx]
owner: nick
---

# Zoning-capture pilot AFTER — Austin + San Antonio

Phase 2 complete. Stop — no city sweep.

## Root causes fixed (not CRS)

1. **ArcGIS paging truncate.** `fetchZoningFeatures` stopped after one full page when hosts omit `exceededTransferLimit`. Austin indexed 2,000 of ~22k; SA prior under-stamp (0.37%) is the same class of bug. Fixed: continue while page is full.
2. **SA OCL/UZROW pollution.** Outside-city / ROW codes are null-rules, not districts. Added `nullDistrictCodes` + `layerWhere` to exclude them from the index; cleared existing OCL/UZROW stamps before re-stamp.
3. **End-of-run flush loss.** First SA full stamp died after PIP (~411k matches in memory) before any DB write. Fixed: progressive flush every 5k matches during PIP.

## Setback tables (config vs disk)

| City | zoning-layers comment | Disk truth |
|---|---|---|
| Austin | n/a (was unwired) | **`austin-tx.json` EXISTS** (SF-1/2/3 + MF-1..MF-6), registered in setbacks `index.ts` |
| San Antonio | said "SETBACK TABLE OWED" | **`san-antonio-tx.json` EXISTS** (RE/R-*/RM-*/MF-*/C-*/O-2/I-*). Config comment was stale |

Operator kickoff said SA table is owed — **false on disk**. Stale registry comment corrected in the pilot patch. Setback **atoms** still did not lift this run (see below).

## Dry-run match rates (before write)

| City | Polygons indexed | Sample | Matched | Rate | Verdict |
|---|---:|---:|---:|---:|---|
| Austin | 21,953 | 5,000 | 3,373 | **67.5%** | CLEAN (SF-3/SF-2/MF-*) |
| San Antonio | 459,124 (non-OCL) | 5,000 | 4,324 | **86.5%** | CLEAN (R-*/RM-*/MF-*/C-*); no OCL |

## Parcel stamp BEFORE → AFTER (`txgio_parcel.zoning_district`)

| County | BEFORE zoned / parcels | BEFORE % | AFTER zoned / parcels | AFTER % |
|---|---:|---:|---:|---:|
| **Travis 48453** | 24,086 / 828,773 | **2.91%** | 276,168 / 828,773 | **33.32%** |
| **Bexar 48029** | 2,607 / 709,541 (1,591 OCL/UZROW) | **0.37%** | 418,604 / 709,541 | **59.00%** |

Austin stamp: 252,085 matched (plus prior Pflugerville stamps retained on non-Austin parcels).  
SA stamp: 418,604 matched, 42 district codes, **zero OCL/UZROW** in histogram. Honest nulls = 290,937 (unincorporated / outside non-OCL polygons).

## Tier-1 facet bake

| County | Zoning facet % | Envelope product |
|---|---:|---|
| Travis | **33.3%** (276,168) | 0% — `atom_path_pending` (anti-zombie) |
| Bexar | **59.0%** (418,604) | 0% — same |

## Property-atom BEFORE → AFTER (hauska_mcp)

Atom bake reads existing Tier-1 snapshot rows (`place_key like node:<fips>:%`). Travis atom denom (380,918) is a subset of the 828,773 Tier-1 rows (place_key / prior-breadth gap — flagged, not expanded this pilot).

| County | Metric | BEFORE | AFTER (this bake ledger) |
|---|---|---:|---:|
| **Travis** | zoning-present | 22,034 (5.8% of 380,918) | **233,247 (61.2% of 380,918)** |
| **Travis** | setback-present | 22,011 | **0 this bake** (see note) |
| **Bexar** | zoning-present | 2,605 (0.37% of 703,258) | **416,454 (59.2% of 703,258)** |
| **Bexar** | setback-present | 814 | **0 this bake** |

### Why setback % did not rise (setback-pending)

1. Tier-1 no longer embeds `envelope.setbacks` dims (anti-zombie / `atom_path_pending`). Property-atom emit only copies snapshot dims — so this bake emits zoning-fact only.
2. Adding Austin made Travis multi-city → `soleZoningJurisdictionKey(48453)` is null; blank Travis `situs_city` cannot pick `austin-tx` vs `pflugerville-tx`.
3. Tables exist on disk for both cities — the gap is **jurisdiction resolution + atom emit path**, not missing transcription. Name both as **zoning-present / setback-pending** until emit looks up setback tables (or stamp records city provenance).

Live `atoms` residual after bake (not regenerated this run): Travis still has 22,011 setback-rule rows and Bexar 814 from prior Pflugerville/partial eras. Bake ledgers for this pilot report `setbackPresent: 0` — treat residual rows as stale until setback emit is reconnected.

## Cost to ledger (approx)

| Work | Wall | Approx USD |
|---|---:|---:|
| Travis atom bake | 1,984 s | ~$0.78 |
| Bexar atom bake | 7,787 s | ~$1.49 |
| Stamps + Tier-1 | ~Austin 454s + SA 6,655s + Tier-1 ~35 min | compute on operator machine / Neon write — under $200 gate |

## Code patch (LDT — not yet on main)

- Wire `austin-tx` into `ZONING_LAYERS`
- SA `nullDistrictCodes` + `layerWhere`
- ArcGIS full-page continue
- Progressive stamp flush
- Tests: Travis sole-jurisdiction → null

## Pilot verdict

Big-city match contract **holds**. Parcel zoning ceiling for these two counties is roughly **Travis ~33% / Bexar ~59%** with unincorporated honest-null remaining. Next leverage is other unwired cities + setback emit path — not another Austin/SA stamp.

**STOP.** No sweep.
