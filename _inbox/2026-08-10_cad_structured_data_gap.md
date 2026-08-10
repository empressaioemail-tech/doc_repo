---
id: 2026-08-10_cad_structured_data_gap
title: CAD structured data is NOT in the factory path — the registry knows about bulk exports, the ingest does not use them
date: 2026-08-10
status: finding — RULED 2026-08-10, see the harvest-completeness ruling
owner: planner
memory_graded: pending
related:
  [
    90_runbooks/factory_onboarding_runbook,
    _catalog/tx_cad_source_registry.json,
    _decisions/2026-08-10_market_layer_thesis_parked,
    90_operations/OPS-15_owner_and_rrc_rail_gap_analysis,
  ]
---

# CAD structured data is not in the factory path

Operator direction 2026-08-10: *"make sure the cad export is still part of the original factory process. we want all the structured data."*

Checked. **It is not.** The registry knows where the bulk exports are; the ingest path does not consume them.

## What the store actually holds

`cad_property`, 4,599,477 rows / 15 counties, live 2026-08-10:

| Field | Populated | Share |
|---|---:|---:|
| `owner_name` | 4,525,073 | 98.4% |
| `market_value` | ~4.5M | ~98% |
| `situs_address` | 4,550,294 | 98.9% |
| **`living_area_sqft`** | **483,912** | **10.5%** |
| **`year_built`** | **467,141** | **10.2%** |
| **`land_acres`** | **766,214** | **16.7%** |

The identity and value fields are near-complete. **The structural fields are nearly empty**, and it is all-or-nothing per county, not thin everywhere:

| County | rows | sqft % |
|---|---:|---:|
| Williamson 48491 | 319,480 | 76.9% |
| Hays 48209 | 265,852 | 69.3% |
| Bastrop 48021 | 77,073 | 52.7% |
| Caldwell 48055 | 48,382 | 27.9% |
| Bexar 48029 | 703,258 | **0.0%** |
| Dallas 48113 | 693,556 | **0.0%** |
| Tarrant 48439 | 689,838 | **0.0%** |
| Travis 48453 | 492,848 | **0.0%** |
| Collin 48085 | 387,334 | **0.0%** |
| Denton 48121 | 351,798 | **0.0%** |
| + 5 more | | **0.0%** |

## Root cause — a source tier, not a defect

Traced by `source_file` on the rows themselves:

| County | source_file | rows | sqft | market_value | owner |
|---|---|---:|---:|---:|---:|
| Bastrop 48021 | `DATA-EXPORT-01.14.2026.zip` | 77,073 | **40,602** | 77,073 | 77,073 |
| Williamson 48491 | `property.csv` | 319,466 | **245,591** | 319,466 | 319,466 |
| Bexar 48029 | `stratmap25-landparcels_48029_bexar` | 703,258 | **0** | 695,443 | 697,088 |
| Dallas 48113 | `stratmap25-landparcels_48113_lp.zip` | 693,556 | **0** | 638,430 | 642,249 |

**Counties with structural data came from a DIRECT CAD EXPORT. Counties without came from TxGIO StratMap**, which carries parcel geometry, owner and market value — but no building characteristics. Bexar shows 703,258 rows, 697,088 owners, and zero square footage. The StratMap roll simply does not contain the field.

## The registry already knows this, and the ingest ignores it

`_catalog/tx_cad_source_registry.json`, 35 rows:

- `format`: **30 `arcgis_rest`**, 4 `honest_absent`, **1 `bulk_export`**
- `bulk_primary: true` on exactly **2** rows — Dallas 48113 (`dcad-bulk-only`) and Tarrant 48439 (`county-run`)

**Dallas and Tarrant are flagged `bulk_primary: true` and BOTH have 0.0% sqft in the store.** The registry identified the bulk export as the primary source and the ingest still loaded StratMap. Conversely, the four counties that DO carry structural data are not flagged bulk at all — they were loaded from direct exports acquired outside the registry-driven path.

So the registry's own routing signal is present and unused.

## Why the factory produces this

An ArcGIS REST parcel layer is a *cadastral* service: geometry, parcel id, owner, and usually appraised value. Building characteristics (`living_area_sqft`, `year_built`, improvement detail) live in the appraisal district's **CAMA tabular export**, which is a separate artifact — typically a zip of pipe-delimited or CSV files published annually.

The factory's CAD step routes to REST because REST is queryable and uniform. The bulk export is a different acquisition motion: download, unzip, parse a vendor-specific schema (`bis-consultants`, `true-automation`, `harris-govern`, `county-run` all differ), join on prop_id. That work was scoped in the F1 registry lane and never wired into the onboarding path.

This is the same shape as the T3 footprint finding — *"BCAD operator-visible footprints are EagleView ortho + CAMA tabular sqft, not public vector REST."* We recorded then that the structural data lives in CAMA tabular. We did not then go get it.

## Why it matters beyond the market layer

The operator raised this from the market-layer discussion (a listing's claimed sq ft vs the record), but the gap is broader:

1. **Improvement value vs land value** is the core teardown/redevelopment signal — a parcel where improvements are worth little relative to land is the redevelopment candidate. We hold `land_value` and `improvement_value` at ~98%, so this one works. Good.
2. **`year_built` and `living_area_sqft`** drive comparables, replacement cost, and "is this structure worth keeping" — all 10% covered.
3. **Any residential product** an agent or investor uses assumes beds/baths/sqft/year exist. They do not, in the metros.
4. **The R1 `cad` rail** currently reads satisfied on identity fields alone. That is honest for what the rail declares, but the rail's DECLARED SOURCE should say which tier it was satisfied from — StratMap-derived and CAD-export-derived are not the same fact set, and today the manifest cannot tell them apart.

## What the fix costs

Not a new capability — a routing change plus a per-vendor parser:

1. **Registry routing precedence:** when `bulk_primary: true` (or a bulk export exists), the CAD step MUST take the bulk export and MUST NOT silently fall back to StratMap for the roll. Falling back is fine; falling back SILENTLY is the defect.
2. **Per-vendor CAMA parsers.** The registry already records `adapter_kind` / `vendor_pattern` (`bis-consultants`, `county-run`, `dcad-bulk-only`, ...). Each vendor family is one parser, and the same parser serves every county on that vendor.
3. **Tier honesty in the manifest.** `cad` rail cells should record whether the county was satisfied from `cad-export` or `stratmap-roll`, so 0% sqft is visible as a tier gap rather than invisible behind a satisfied cell.
4. **Backfill order:** the metros, because that is where both the gap and the demand are — Bexar, Dallas, Tarrant, Travis, Collin, Denton = ~3.3M parcels with zero structural data.

## RULED 2026-08-10 — superseded by the harvest-completeness principle

The operator ruled before this question was asked, and more broadly than it was scoped:

> *"while we are doing this heavy backfill effort let's make sure to grab all the data from all the sources we are already touching. If that means more cells on the manifest so be it."* — and, explicitly, *"that goes for every source."*

So CAD structural data is IN SCOPE, and the question generalizes past CAD. See `_decisions/2026-08-10_harvest_completeness_ruling.md`. The analysis below stands as the CAD-specific instance of the general rule.

## Original framing (kept for the reasoning)

Is CAD-export structural data **in scope for the Texas launch**, or a post-launch backfill?

Arguments for in-scope: it is the difference between "we have owner and value" and "we have the property record," it unblocks the reconciliation capability, and the registry work is already done. Arguments for post-launch: it is a per-vendor parser program across 6+ vendor families, and the launch gate is already drifting.

Planner recommendation: **wire the routing precedence and the tier-honesty field NOW** (small, and it stops the manifest from hiding the gap), and **run the parser backfill as its own lane after the sweep closes** — starting with whichever vendor family covers the most metro parcels. Do not let a satisfied `cad` cell keep implying structural data we do not have.
