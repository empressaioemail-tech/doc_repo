---
id: 2026-08-10_harvest_gap_prework_findings
title: Harvest-gap prework — we already probed 254 counties and never rolled the field lists up
date: 2026-08-10
status: planner prework — informs the inventory dispatch, not a substitute for it
owner: planner
memory_graded: pending
related:
  [
    _decisions/2026-08-10_harvest_completeness_ruling,
    _inbox/2026-08-10_cad_structured_data_gap,
    _catalog/tx_cad_source_registry.json,
  ]
---

# Harvest-gap prework

Operator asked whether to do prework cataloguing what is AVAILABLE versus what we were SET UP to get, then look for advantageous uses. Planner ran the cheap half first. **The catalogue is largely already collected and was never rolled up.**

## The headline

`_inbox/t6_cad_probe_<fips>.json` — **254 probe files**, **176 carrying full ArcGIS field inventories**, averaging **47.3 fields per county**, **1,089 distinct field names** statewide.

`cad_property` persists roughly **15** columns.

We probed the schema of nearly every county in Texas, wrote the field lists to disk, used two fields (`prop_id_field`, feature count) for routing, and left the rest sitting in `_inbox`. **The inventory work is 70% done and unread.**

That reframes the prework: it is not "go probe the sources." It is "roll up what we already probed, then probe only the gaps."

## What is available at ~148-county coverage that we do NOT persist

From the rollup, fields present across ~85% of probed counties and absent from `cad_property`:

| Field | Counties | Why it matters |
|---|---:|---|
| **`DEED_DATE`** | **148** | Last transfer date. This is a MARKET-layer fact sitting inside a durable public source. Ownership tenure, recency of sale, "just changed hands" — with no MLS licence at all. |
| **`DEED_SEQ`** | 147 | Deed book/page reference; the pointer into county records for the actual instrument. |
| **`SCHOOL`** | 147 | School district. Primary residential value driver and a taxing jurisdiction we do not hold. |
| **`HOOD_CD`** | 147 | CAD neighbourhood code — the appraisal district's OWN comparables grouping. The key an appraiser uses. |
| **`ABS_SUBDV_CD`** | 143 | Abstract/subdivision code — platted subdivision identity. |
| **`IMPRV_VAL`** | 147 | Improvement value. **We DO persist this** (98% via `improvement_value`), so it is fine — noted to avoid double-counting the gap. |
| `GEO_ID` | 158 | Alternate parcel identity — a **second join key**, directly relevant to the address-to-parcel lane and the 10 hold counties. |
| `VOLUME` / `PAGE` | 149 / 150 | Deed volume and page — the recorded-instrument pointer. |
| `ADDR_LINE1-3`, `ADDR_CITY`, `ADDR_STATE` | 147-148 | Owner MAILING address as structured components (we hold one concatenated string). |
| `NEXT_APPRAISAL_DT` | 142 | When the district will re-appraise — a freshness signal for our own data. |
| `MAP_ID`, `BLOCK`, `TRACT_OR_LOT` | 147-151 | Plat identity components. |
| `FILE_AS_NAME` | 142 | Owner name in sortable/normalized form — better join key than the display name. |
| `CREATED_DATE` / `LAST_EDITED_DATE` | 135 | Source-side record vintage — lets us date OUR data against the district's own edit time. |

**The single most valuable one is `DEED_DATE` at 148 counties.** It is a market-layer fact — when did this property last transfer — available from a durable public source we already touch, with no licence, no vendor approval, and no MLS. That is the parked market-layer thesis partially unlocked by data we already probed.

## What is NOT available at scale (so the CAD-export motion is still required)

The structural fields are NOT broadly present in the REST layers:

- `YEAR_BUILT` appears in **9** counties. `IMPRVMAINAREA` in **2**. `SQFT`-family: negligible.
- Exemption detail (`EXEMPTCODES`, `EXEMPTHMSTDFLAG`, `AGUSE`, `AGMKT`) appears in **1** county each.

So the earlier finding holds and is sharpened: **living area, year built, and exemption detail live in the CAMA bulk export, not in the REST parcel layer.** No amount of harvesting the REST layer produces them. The bulk-export routing fix is a genuinely separate motion from the field-completeness rollup.

Two distinct jobs, and they should not be conflated:
1. **Rollup + harvest what the REST layers already expose** (deed date, school, hood code, GEO_ID...) — cheap, data already probed.
2. **Route to CAMA bulk exports** for structural data — a per-vendor parser program.

## On monetisation, given the reasoning strategy

The operator asked about advantageous uses. Two observations, offered as framing rather than conclusions:

**The reasoning commitment changes what a field is worth.** A raw field is a commodity; every data vendor has `DEED_DATE`. What nobody has is *deed date joined to buildability, zoning, and flood, with a citation and a confidence on each*. The value is not the field — it is that the field arrives inside a reasoning chain. So the harvest question is not "what can we sell" but "which fields make an existing REASONING better."

By that test, the standouts:

- **`DEED_DATE`** — turns every parcel into a tenure fact. "Owned 22 years, buildable for a second unit, not listed" is a lead. That reasoning needs no MLS.
- **`HOOD_CD`** — the appraisal district's own comparables grouping. Any comparables reasoning we build should use the district's cohort rather than inventing one, because it is defensible and citable: *the district groups these together*.
- **`SCHOOL`** — a value driver we currently cannot cite at all, and a taxing jurisdiction that pairs with the mud rail.
- **`GEO_ID`** — not a product field; an INFRASTRUCTURE field. A second join key, which is exactly what the address-to-parcel lane and the 10 hold counties need.

**The honest caution on monetisation:** we are Layer-1-free / Layer-2-paid per `08_tiered_access_model.md`, and the tier of a harvested field is a real decision, not an afterthought. `DEED_DATE` is public record. Owner mailing address is already ruled `public-paid`. A harvest that quietly changes what is free would be a pricing decision made by an ingest script, which is the wrong place for it. **Every newly harvested field needs an explicit accessPolicy at harvest time**, not at serve time.

## Recommended shape of the prework dispatch

1. **Roll up the 254 existing probes into one machine-readable catalogue** — field name, type, county count, and a persisted/not-persisted flag against the live `cad_property` and `txgio_parcel` schemas. This is a read-only local job over files we already have; it needs no network and no slot.
2. **Extend the same rollup to the OTHER sources** named in the harvest ruling (TCEQ, RRC, NTAD, NFHL, city GIS, 3DEP) — for those, the field inventories may not exist yet and a live probe IS needed.
3. **Classify each unpersisted field**: infrastructure (join keys), reasoning-improving (feeds an existing chain), new-rail candidate, or ignore. The R1 split rule governs the third category.
4. **Assign an accessPolicy per field** before anything is harvested.
5. Output one catalogue plus a ranked take-list, NOT a build.

The 78 probe files without field lists are themselves a finding — worth knowing whether those counties failed the probe or were never probed.
