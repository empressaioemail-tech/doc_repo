---
id: 2026-07-24_zoning_capture_diagnosis_austin_sa_pilot
title: Zoning-capture diagnosis — Austin + San Antonio match verdict (Phase 1 read-only)
status: active
date: 2026-07-24
applies_to: legacy-design-tools (cad-ingest zoning stamp), hauska-engine property atoms
related: [2026-07-24_BREADTH_COVERAGE_MILESTONE_central_tx, zoning-stamp-roll-mechanics]
owner: nick
---

# Zoning-capture diagnosis — Phase 1 (read-only)

**Stop:** Phase 1 only. No stamp, no re-bake. Phase 2 (Austin + San Antonio pilot stamp) waits on operator go after this match verdict.

## 0. Load-bearing correction to the kickoff framing

| City | Kickoff claim | Live code / Neon truth |
|---|---|---|
| **Austin** | Not wired | **Confirmed.** Absent from `ZONING_LAYERS`. Travis zoning in DB ≈ Pflugerville only (~26.4k / 894.7k parcels = **2.95%**). |
| **San Antonio** | Not wired | **Partially wrong.** `san-antonio-tx` **is already in** `ZONING_LAYERS` (`COSA_Zoning/FeatureServer/12`, `codeField: Base`). But the stamp barely ran: Bexar `zoning_district` non-null = **2,742 / 747,206 (0.37%)**, and **1,547 of those are `OCL`** (Outside City Limits) — not a setback district. |

So Travis low coverage is an **unwired-city gap**. Bexar low coverage is an **incomplete stamp + OCL pollution** gap on an already-wired layer — not a missing registry row.

Atoms remain honest: they report `no-zoning-stamp` because Tier1 never got a real district for those parcels.

Source registry: `legacy-design-tools/lib/cad-ingest/src/txgio/zoning-layers.ts` (16 cities today).

## 1. Match contract (what “clean” means)

Stamp writes the GIS code **raw** (optional one-capture `codeExtractRegex` only). Envelope `mapDistrict()` takes the **leading whitespace token** of each setback `district_name`, normalizes (upper + strip non-alphanumeric), and exact/prefix-matches the stamped code under the same normalize. Georgetown `ZONE=RS` ↔ `"RS Residential…"` is the reference.

Do **not** invent districts. Unincorporated / no polygon → leave `zoning_district` NULL.

## 2. Austin — layer + match verdict

### Layer (verified live 2026-07-24)

| Item | Value |
|---|---|
| Service | City of Austin AGOL org `0L95CJ0VTaxqcmED` |
| Layer URL | `https://services.arcgis.com/0L95CJ0VTaxqcmED/arcgis/rest/services/Publish_Zoning_AGOL/FeatureServer/0` (“Base Zoning”) |
| Geometry | polygon |
| Feature count | **21,954** zoning polygons |
| Recommended `codeField` | **`BASE_ZONE`** (also mirrored on `ZONING_ZTYPE` in samples) |
| Description field | `BASE_ZONE_CATEGORY` |
| Stamp fetch | existing path already requests `outSR=4326` — no CRS quirk observed on field sample |

### Distinct `BASE_ZONE` values (44)

`AG, AV, CBD, CH, CR, CS, CS-1, DMU, DR, ERC, GO, GR, IP, L, LA, LI, LO, LR, MF-1…MF-6, MH, MI, NBG, NO, P, PUD, R&D, RR, SF-1…SF-6 (incl. SF-4A/SF-4B), TND, TOD, Unclassified, UNZ, W/LO`

Sample rows show clean tokens (`SF-2`, `LA`, `PUD`) — not “Single Family (SF-2)” prose that would need `codeExtractRegex`.

### Setback table

`lib/adapters/src/local/setbacks/austin-tx.json` exists with **SF-1, SF-2, SF-3, MF-1…MF-6** (leading tokens match GIS exactly after normalize).  
`index.ts` still carries a stale “no safe alignment / empty table” comment — **ignore that comment**; the JSON is populated.

**Zoning-present / setback-pending** for GIS codes outside that nine-row table (SF-4A/B/5/6, CS, PUD, CBD, UNZ, …) is still a coverage win: zoning-fact stamps; setback/envelope stay honest-absent until table deepen.

### Austin match verdict: **CLEAN**

No field-format quirk like Hutto’s parenthetical extract. No California-mispoint class failure (San Marcos history). Leading-token contract holds for the setback-covered SF/MF codes. Pilot may stamp `BASE_ZONE` verbatim; expect setback unlock primarily on SF-1/2/3 + MF-1…6 (SF* polygons alone ≈ 10.4k of 22k layer features).

## 3. San Antonio — layer + match verdict

### Layer (already registered)

| Item | Value |
|---|---|
| Registry key | `san-antonio-tx` |
| Layer URL | `https://services.arcgis.com/g1fRTDLeMgspWrYp/arcgis/rest/services/COSA_Zoning/FeatureServer/12` |
| `codeField` | **`Base`** (composite `Zoning` mixes overlays — do not use) |
| Feature count | **764,663** |
| `Base = OCL` | **271,244** |
| Non-OCL / non-UZROW (approx) | **~459,124** |

### Setback table

`san-antonio-tx.json` has RE, R-20/R-6/R-5/R-4/R-3, RM-6/5/4, MF-18/25/33/40/50/65, C-1/C-2/C-3, O-2, I-1, I-2 — leading tokens align with live `Base` samples (`R-4`, `R-5`, `RM-4`, `C-2`, `I-1`, …).

### Live Bexar stamp pollution

Of 2,742 stamped rows: **OCL 1,547**, then R-4/R-5/MF-*/C-*/… Real district codes match the table; **OCL/UZROW do not** and must not be stamped as districts (leave NULL / exclude from layer index).

### SA match verdict: **CLEAN (with OCL/UZROW null-rule)**

Same Georgetown-style leading-token contract. Pilot Phase 2 for SA is **re-stamp with dry-run match-rate + exclude OCL/UZROW**, not a first-time wire. Registry comment “SETBACK TABLE OWED” is stale.

## 4. Wired today vs major-city gaps (10-county metro)

### Wired in `ZONING_LAYERS` (16)

Williamson: Georgetown, Round Rock, Leander, Hutto, Cedar Park, Taylor, Liberty Hill  
Hays: Dripping Springs, Buda, Kyle, San Marcos  
Travis: **Pflugerville only**  
Comal: New Braunfels  
Bastrop: Bastrop city (form-based Place Types — setback table misaligned by design)  
Bexar: **San Antonio (wired, under-stamped)**  
Caldwell: Lockhart  

### High-leverage MISSING or under-captured (ranked)

Parcel weights from live `txgio_parcel` situs where available. Travis/Williamson situs is blank at scale — for those, use county size + known city dominance.

| Rank | City | County | Approx parcel leverage | Registry | Setback table | Pilot? |
|---:|---|---|---|---|---|---|
| 1 | **Austin** | Travis 48453 | Dominates ~895k-parcel county; only ~26k zoned today (Pflugerville) | **MISSING** | Yes (SF/MF subset) | **YES — Phase 2** |
| 2 | **San Antonio** | Bexar 48029 | ~592k situs “SAN ANTONIO” / 747k county; only ~2.7k stamped | Wired, **under-stamped** | Yes | **YES — Phase 2 re-stamp** |
| 3 | Waco | McLennan 48309 | ~65k | Missing | No | Later |
| 4 | Killeen | Bell 48027 | ~59k | Missing | No | Later |
| 5 | Temple | Bell 48027 | ~51k | Missing | No | Later |
| 6 | New Braunfels | Comal 48091 | ~49k | Wired | Yes | Done (coverage still partial outside polygons) |
| 7 | Converse / Helotes / … | Bexar | 10–24k each | Missing | No | Later (after SA pilot) |
| 8 | Kyle / San Marcos / Buda | Hays | 20–33k | Wired | Yes | Done |
| 9 | Elgin / Smithville | Bastrop | 6–10k | Missing | Partial | Later |
| 10 | Seguin / Schertz / Cibolo | Guadalupe | mostly blank situs; Schertz ~13k | Missing | No | Later |
| — | Cedar Park / Round Rock / Georgetown / Leander / Pflugerville | Williamson/Travis | Wired | Yes (varies) | Already on roll |

**Not the target:** 100% county zoning. Unincorporated / ETJ / OCL = legitimate `no-zoning-stamp`.

## 5. Reachable-coverage estimate (honest ceiling)

| County | Today zoning_district % | After Austin+SA pilot (order-of-magnitude) | Ceiling note |
|---|---:|---|---|
| **Travis** | **~3%** | **Likely mid-tens to majority of city-limit parcels**; county % still far below 100% because ETJ/unincorporated + non-Austin cities | Austin layer has 22k polygons covering city fabric; PIP against ~895k parcels will leave large honest null outside city |
| **Bexar** | **~0.37%** | **Could move toward ~50–75%+ of county** if non-OCL Base stamps onto SA city parcels (~592k situs SA); suburbs without layers stay null | Must exclude OCL/UZROW; dry-run match-rate before commit |
| Metro headline | Breadth bake Travis 5.8% / Bexar 0.4% atom zoning-present | Pilot should move **those two counties’ atom zoning-%** in proportion to Tier1 refresh after stamp | Re-bake Travis+Bexar only in Phase 2 |

“Every parcel inside a zoning jurisdiction, captured” ≠ “every parcel in the county.”

## 6. Phase 2 pilot plan (ready, not started)

1. Add `austin-tx` to `ZONING_LAYERS` (`Publish_Zoning_AGOL/0`, `BASE_ZONE` / `BASE_ZONE_CATEGORY`).
2. Keep `san-antonio-tx`; add stamp discipline to **skip Base in {OCL, UZROW}** (treat as null).
3. `zoning-stamp --city=austin-tx --dry-run --limit=N` and same for SA: report **parcelsMatched / parcelsRead** and district histogram **before** write.
4. On acceptable match-rate, stamp same Neon DB; Tier1 refresh + property-atom re-bake for **48453 + 48029 only**.
5. Live BEFORE/AFTER zoning % + cost-to-ledger; **STOP** — no full city sweep.

## 7. Phase 1 acceptance (this doc)

| Item | Result |
|---|---|
| Wired vs missing major cities, leverage-ranked | §4 |
| Austin match verdict | **CLEAN** (`BASE_ZONE` ↔ SF/MF setback tokens) |
| SA match verdict | **CLEAN** (`Base` ↔ R/RM/MF/C/I/O tokens) **with OCL/UZROW null-rule** |
| Setback tables | Both cities **have** tables; Austin SF-4+/commercial = zoning-only until deepen |
| Reachable coverage estimate | §5 — not 100% |
| Stamp | **Not run** |

**Hand back.** Operator go required to open Phase 2 pilot stamp.
