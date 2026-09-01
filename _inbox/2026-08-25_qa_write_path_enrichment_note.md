---
id: 2026-08-25_qa_write_path_enrichment_note
title: QA note — public-facts catalog (what reporting can use)
date: 2026-08-25
status: filed
audience: app QA
authority: parcel-public-facts-deficit canvas (39 master + harvest + CAMA + StratMap + atom-body ≈ 70 fields)
---

# Public facts we are capturing (for QA)

This is the original deficit list: seventy-plus fields we are holding or mapping that the old card never treated as a catalog. The write-path finishing now is the first bind of that catalog onto inspect and the store. Texas fill then widens how many counties each field covers.

You will not see all of these as chips this week. That is the point of the list. Look for the ones that already paint. Notice empties that should stay honest. Treat the rest as “this will show up in a report or a later county,” not as a broken gold walk.

Surface: https://smartsite.cloud

## Already on a click (use these as the live catalog)

These are captured and served on gold / joined parcels today.

- **Identity.** Parcel node `{county}:{prop_id}`. A miss names lookup-failed and the CAD vintage (2026/cad-export), not a silent blank.
- **Situs.** Street when the geometry store has one. `, TX` is a fail. `Parcel {n}` means we have no street yet (280239).
- **City limits.** Incorporated + city name, or unincorporated. ETJ is unresolved on purpose (no invented ring).
- **Who serves this lot.** Utility / CCN holders, or empty holders plus the residual “service letter required.”
- **Land use.** PTAD state category (A1, F1, …) on joined lots.
- **Legal / values.** Legal description, land / improvement / market / assessed, exemptions: in the roll store on the ~15 loaded counties; gold inspect is still thin on some of these.
- **Living area.** Live from the appraisal table when a CAD row exists (Dallas / Tarrant / Bastrop-class). Empty on a miss is honest.
- **Flood.** Zone on gold. Depth / velocity still truncated in the atom body.
- **MUD / special district.** Gold MUD inspect. Acres and creation date not in the body yet.
- **Pipelines.** Served on gold. Diameter / commodity still thin.
- **Setbacks / envelope.** Gold Bastrop and some Travis table-backed lots. Many Bastrop clicks still decline. Dashed orange is the envelope, not a building footprint.
- **Owner name / mailing.** Captured on the roll. Paid / identified only. Must not appear on an anonymous card.

## In the store now (report food; card may lag)

These are the fields we started capturing from StratMap and CAMA that we used to drop or never persist. A report can cite them before every chip exists.

- **Year built.** CAMA on Dallas / Tarrant / other roll counties. StratMap YEAR_BUILT now parses lists (`1962,2011,2023` → 1962). Caldwell leftover just landed year on ~17k of ~25k 2025 rows. The Inspect card often does not paint year yet. If you see it on a facet or in a future report and not on the card, that is a render leftover.
- **Land acres.** StratMap GIS_AREA when the unit is acres (or a known convert). Caldwell leftover filled acres on those same ~25k rows. Card acres are still often shoelace from the polygon, a second number.
- **StratMap legal, values, STAT_LAND_ use code.** Already upserted via landuse (not discarded at parse). That is the roll behind choropleth and later cad-parcel-roll atoms.
- **Owner mailing as one line.** Structured ADDR_LINE1–3 is not split yet.

Dallas 806,563 and Tarrant 975,885 2026 CAMA rows are in the store (Tarrant KEEP). Only map ids that match an account will light living area on inspect. The rest still enrich a county report.

## Bound this write-path, not yet a statewide report

- Honest CAD miss + vintage (Travis 280238 class).
- Who-serves + city-limits chips.
- Merge rule so a later CAMA load cannot wipe a StratMap legal with a null.
- Year / acres writer (Caldwell first county). Next counties copy that writer; they are the Texas fill.

## Still captured at source, not in our roll (harvest / P-79)

CAD REST already lists these in ~140–160 of 176 field inventories. We have not built the writer. When Texas fill + P-79 land, reports gain:

- **GEO_ID** on the roll (alt key; today only on the geometry table).
- **Plat:** MAP_ID, BLOCK, TRACT, ABS_SUBDV.
- **Deed date,** deed volume / page / sequence.
- **School district** (CAD SCHOOL, not inferred from a MUD).
- **Neighborhood / comps code** (HOOD_CD).
- **Next appraisal date.**
- **Structured situs** (number, street, prefix, suffix) instead of one concatenated line.
- **Layer edit / create dates** (source vintage).

Beds / baths / rooms and exemption detail tables live in some CAMA zips only. Rare on REST. Do not expect them on a click.

## Already in atoms or staging, thin on inspect / map

These enrich a later report or a GIS layer more than today’s card.

- **Building footprint.** ~10.67M staged statewide. Almost no gold atoms. Orange dash is not this.
- **Roads.** Two counties. 252 not ingested. Front-edge setback labels need this.
- **Wells.** Atoms exist; gold inspect often atom-miss. RRC map toggle is off (ticking would draw nothing).
- **Rail corridor.** Statewide atoms, body truncated (~4 of many NTAD attrs).
- **Zoning district.** 104 cities staged. Not 254.
- **Flood / pipeline / well / MUD extra columns.** Truncated atom bodies (depth, diameter, commodity, TCEQ acres/dates).
- **Soils, terrain, drainage.** On-demand or tiny. Not a bulk parcel fact.
- **Easement.** Type exists, writer dormant.
- **MLS / sales.** Out of scope.

## Counties (how wide the catalog is)

Geometry on the map: most of Texas (253 zips, ~196 loaded in the old count; ledger geometry is 253 present). CAD / owner / land-use **atoms** on the ledger: **13 of 254**. Flood 162. MUD 134. Roads / footprint / envelope / wells / easement: 0 on the ledger.

Metros with roll in `cad_property` and still 0% living area until CAMA or leftover: Bexar, Collin, Denton, and much of Travis. Williamson and Hays already have stronger sqft. Bastrop is the gold walk, not the statewide shape.

## What to do with this while you click

Do not try to tick 70 chips. Do this instead:

1. On 908 Pine, notice how many of the “already on a click” fields actually appear. That is today’s report surface.
2. On a Dallas or Tarrant lot that matches, look for living area. That is CAMA, newly in the catalog.
3. On 280238, confirm we admit the miss instead of inventing sqft, year, or a street.
4. On 280239, `Parcel 280239` is a situs-catalog hole, not a missing chip.
5. If a future report shows year, acres, legal, values, or use code for Caldwell / StratMap counties, that is the catalog working even when Inspect is quiet.
6. Plat, deed, school, GEO_ID, beds/baths: not a bug if absent. Writer not built.
7. Footprint, roads, RRC toggle, ETJ ring: not this week.

The register lives on the parcel-public-facts deficit canvas if you want the row ids (M01–M39, H01–H10, C01–C04, S01–S08, B01–B06).
