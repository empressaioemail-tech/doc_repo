---
id: 2026-08-24_parcel_facts_write_path_game_plan
title: Parcel public-facts write-path game plan
date: 2026-08-24
last_updated: 2026-08-25
status: active
owner: planner
plan_row: P-73
operator_approval: verbal 2026-08-24 Wave 1 (P-75, P-76) via A-027; CAMA/footprint held
snapshot: doc_repo main @ ee9b17d; LDT origin/main @ 244567a (P-25 code); local LDT checkouts stale for CAMA parsers
related:
  - _inbox/2026-08-24_parcel_facts_write_path_WDLL.md
  - C:\Users\cente\.cursor\projects\p-doc-repo\canvases\parcel-public-facts-deficit.canvas.tsx
  - C:\Users\cente\.cursor\projects\p-doc-repo\canvases\county-manifest.canvas.tsx
  - C:\Users\cente\.cursor\projects\p-doc-repo\canvases\parcel-facts-write-path.canvas.tsx
  - C:\Users\cente\.cursor\projects\p-doc-repo\canvases\recalibration-and-design-systems.canvas.tsx
  - C:\Users\cente\.cursor\projects\p-doc-repo\canvases\factory-health.canvas.tsx
  - _inbox/2026-08-25_factory_operating_instructions.md
  - _inbox/2026-08-24_factory_routing_pin.json
  - _inbox/2026-08-24_county_manifest_dump.json
  - _inbox/2026-08-24_two_track_handoff.md
  - _decisions/2026-08-24_write_path_data_capture_order.md
  - 90_operations/OPS-16_texas_market_plan_of_record.md
  - _inbox/2026-08-23_phase2_data_ingest_program.md
  - _inbox/2026-08-24_feasibility_v1_plan_DRAFT.md
---

# Parcel public-facts write-path game plan

This is the execution instrument. Phase 2, feasibility §6, and the deficit canvas roadmap-fit no longer sequence ingest. This file does.

Order is write-path dependency: nothing that would write a wrong fact onto a missing join, and nothing that invents a third source without an authority rule. Independent bind cards and already-staged read paths go first. Heavy slot, announce-serialized loads, and missing writers go last.

**A3 still gates ingest.** Wave 0 is that map. Waves 1 and 2 are bind and honesty. They do not harvest. Wave 3 and later write stores.

## Corrections that changed the old stack

Verified 2026-08-24 by code read. The deficit register and the 2026-08-24 effort-tier list were wrong on three points. The register stays; these notes bind the plan.

1. **Two StratMap paths, not one discard.** `txgio/parse.ts` writes identity + situs + geometry to `txgio_parcel` and drops the rest by design. `stratmap-landuse` (`landuse.ts`) already upserts legal, values, STAT_LAND_, and `MAIL_ADDR` into `cad_property`. Still forced null on that path: `year_built`, `living_area_sqft`, `land_acres`. Extending `parse.ts` for values is the wrong card. Extending `landuse.ts` plus a county re-run is the card. Harvest report lines that say those value fields are unpersisted are stale.

2. **L20 291,475 / 86 cities is zoning staging, not footprints.** Real footprint staging is `tx_building_footprint` at ~10.67M rows / 254 counties. Drain takes the atoms slot and a per-county PostGIS join. Not a Wave 1 item. Stays P-09.

3. **City limits is not ETJ.** Boundary CLI and `tx_city_boundary` schema exist. Containment today is incorporated vs unincorporated. No statewide ETJ layer. Wave 1 ships city-limits PIP and leaves ETJ as unresolved. Full ETJ is a later derivation card.

4. **REST harvest has no writer.** Inventory only. Plat / deed / school / GEO_ID-on-roll is a build (P-79), not a CAMA rider.

5. **CAMA last-upsert-wins.** `upsertCadProperties` has no StratMap-vs-CAMA field merge. A CAMA load on the same `(county_fips, prop_id, tax_year)` clobbers the StratMap row. The authority rule (P-78) lands before any CAMA full load.

6. **Travis join is prop_id only.** Registry `join_key: geo_id_or_address_crosswalk` is not implemented. `geo_id` lives on `txgio_parcel` only. CAMA keys on CAD account. Running Travis CAMA first does not bind `48453:280238`.

## Hard constraints (do not absorb)

- One atoms bulk-writer slot. Only atom `--apply` takes it. `cad_property` and boundary ingest are slot-free.
- One heavy PostGIS / full-table scan at a time. Announce CAMA full zips and footprint county applies.
- A-017 stands: CAMA full loads are post-launch backfill, not a QA gate.
- A-022 stands: COVER `--apply` stays parked.
- PE product writes do not open the A2 pricing tree (`fix/pe-pricing-a2`). Fresh hauska-map worktree from `origin/main`.
- Local LDT `feat/s1-instrument-hardening` is behind `origin/main` on CAMA parsers and vintage. Dispatch CAMA from main.
- Pin Wave 1/3 LDT work to `origin/main` (CP1s used `244567a5`). Do not use the property seat LDT/PE trees. `0076` is on main (PR #427). Staged footprint join is still seat-engine-only. Local `feat/s1-instrument-hardening` is behind on CAMA and vintage.
- A `cad_property` write is live for structural inspect (sqft) only. Situs, land use, and acreage on the card are baked. Cortex deploy and PE deploy are still required for new Wave 1 facts. See `_inbox/2026-08-24_write_path_what_we_missed.md`.
- No privileged data. Public record only.
- MLS stays out (gap matrix row 38).
- Atom writes use P-55 (`parcel-write-identity.ts`, engine PR #356 `29ab77c`). Node is `{fips}:{integer}`. Edge is `applies-to` in the same batch. Verify by `atom_did IN`. The 2026-08-08 DATA_MODEL proposal is not executable law. Who-serves and city-limits are not atom families. See `_inbox/2026-08-25_factory_operating_instructions.md`.

## Wave table

| Wave | Plan rows | Write? | Slot | Can start when |
| --- | --- | --- | --- | --- |
| 0 Map | P-73 | Doc only | No | Now |
| 0 Manifest | P-47 | Dump + canvas | No | Now. GET only. No rematerialize on refresh |
| 1 Bind | P-74 P-75 P-76 | Serve / Neon boundary | No | After P-73 items that name dest/bind; PE cards after A2 clears or on an isolated tree |
| 2 Honesty | P-77 | Serve / instrument | No | After P-73; measure is SQL and can overlap Wave 1 |
| 3 Authority | P-78 | `cad_property` via `stratmap-landuse` | No | After P-73 |
| 4 CAMA | P-25 | `cad_property` then optional atom apply | Ingest no; atoms yes | After P-73 + P-78. Dallas/Tarrant independent of P-77. Travis CAMA after P-77 measure |
| 5 Harvest build | P-79 | New writer + schema | No until apply | After P-73 names dest columns |
| 6 Heavy | P-80 P-09 P-17 remainder | Atoms / rebake / parsers | Yes | After Waves 0-3; parked items stay parked until operator go |

Waves 1 through 3 are parallel after Wave 0 names the dest and bind for each card. Wave 4 Dallas/Tarrant may parallel Wave 5 and Wave 2. Wave 6 does not jump the queue.

## Wave 0 — P-73 field map (A3)

Observable: every ingest-bound canvas ID below has one row naming source field(s), dest `table.column` or atom body field, join key, vintage, authority on conflict, and empty vs sentinel vs unmeasured. Folklore from the corrections section is written onto the deficit canvas.

**Deliverable (not a stub):** `_inbox/2026-08-24_p73_ingest_bound_field_map.md`. Six columns on every ingest-bound canvas: source, dest, join, vintage, authority, empty/sentinel/unmeasured. WDLL item 1 fails if any of those cells is empty.

Out of that map: HOA, MLS, Factory 2, roads COVER, 58-county geometry, RRC toggle (M39), SB12 Factory 2 remainder.

## Wave 1 — bind existing stores

### P-74 Situs sentinel bind (M07)

PE / bake: a trimmed `, TX` or comma-tail is absent, not present. Fall through to `txgio_parcel.situs_address`. Do not copy Find / Photon onto the county record. No ingest. Isolated hauska-map worktree.

Check: Simsbrook `48453:280239` title is not `, TX` when `txgio_parcel` has a street; gold `48021:34137` still prints `908 PINE`.

### P-75 Who-serves read path

Serve-time PIP against `tx_utility_territory_staging`. Territory holders plus SERVICE-LETTER-REQUIRED. No atom family. No `--apply`. Pin 0076 on the deploy branch.

Check: gold parcel returns a typed section (holders or residual). A fixture outside all polygons returns the residual sentence, never empty.

### P-76 City-limits ingest + PIP (M35, not ETJ)

Run existing boundary CLI into `tx_city_boundary`. Inspect / report: incorporated or unincorporated from `resolveCityContainment`. ETJ = unresolved. No new atom family required for v1.

Check: a Bastrop city gold parcel reads incorporated; a known unincorporated control reads unincorporated; ETJ is the unresolved chip, not a fabricated buffer.

## Wave 2 — P-77 Travis identity honesty (M02)

Two halves. Do not collapse.

1. **Measure.** File-based instrument: join-hit / join-miss / unmeasured on the Simsbrook-Dashwood block and a stated Travis sample, at declared vintage `2026/cad-export`. `prop_id_bad_rate` 0.51 is not the grade. **Live 2026-08-25T02:08:37Z: 10 hit / 1 miss / 0 vintage-gap / 0 unmeasured. Miss is 48453:280238 with leading_zero_orphan=false.** Instrument: `scripts/p77-travis-join-measure.mjs`.
2. **Honest miss.** Still held (A-027). When PE is free: `48453:280238` is `lookup-failed` (or equivalent) naming that vintage. Not a silent thin card. Neighbors stay joined.

No atoms slot. No CAMA. No geo_id join invent. Fixing the ~51% bind is P-80. This named miss is a gap, not a padded-key join.

## Wave 3 — P-78 authority + leftover StratMap fields

1. **Authority rule in code**, not prose: CAMA bulk does not silently clobber StratMap fields it does not populate, or the load uses a new tax year / vintage so readers pick declared vintage (L17) rather than last upsert. Verified by violation: a fixture StratMap row with legal+values plus a CAMA row missing legal does not wipe legal.
2. **`landuse.ts`:** stop forcing `year_built` and `land_acres` null when the DBF has `YEAR_BUILT` / `GIS_AREA`. Read `YEAR_BUILT` as first-valid-YYYY (F8; `Number()` drops comma lists). Read `GIS_AREA_U` or refuse acres (F5). Dry-run one county. Then re-run `stratmap-landuse` only where the map says the dest is empty and CAMA is not the authority. Spec: `_inbox/2026-08-24_p78_cad_property_merge_SPEC.md`.
3. Do not add value columns to `txgio_parcel`.

## Wave 4 — P-25 CAMA (existing row)

Dallas (48113) and Tarrant (48439) first. Parsers on LDT `origin/main` (PR #421). Announce the zips. Flip L17 declared vintage only after the load completes. Atom apply (`cad-parcel-roll` / land-use / owner) is a separate slotted step, not this card's close.

Travis CAMA (PACS parser exists, `adapter_kind` still unknown) starts only after P-77 measure is filed. It will not bind 280238-class nodes.

Bexar / Collin / Denton have no bulk parser. They are Wave 6, not this card.

## Wave 5 — P-79 REST harvest writer

Build the missing writer. Destinations from the P-73 map: `GEO_ID` column on `cad_property`, plat identity, `DEED_DATE`, `SCHOOL`. Not structural sqft. Not a CAMA rider.

## Wave 6 — heavy, parked until the front is moving

| Row | Job | Why last |
| --- | --- | --- |
| P-80 | Travis join fix: crosswalk and/or TCAD gap-fill + facet rebake | Needs P-77 numbers; ~51% cohort |
| P-09 | Footprint atom drain from 10.67M staging | Slot + per-county PostGIS. Serve already P-51. |
| P-25 remainder | Bexar / Collin / Denton parsers + loads | Parsers absent |
| P-25 atom apply | Statewide cad-parcel-roll after store enrich | Slot |
| (new later) | ETJ derivation | No statewide layer |
| P-17 | Roads COVER remainder | A-022 parked |
| P-55 | IDENT writers | Phase 2, NodeId |
| HOA | Scoping card only | Decision 5 |

SB12 click-setbacks and M39 RRC toggle stay on the serve board (P-60 leftovers / P-49 P-50). They are not this program.

## First wave (tee)

1. **P-73** is the map file above. Folklore corrections on the deficit canvas. No product PR. Grades WDLL item 1 before any other card starts.
2. **County Manifest instrument (WDLL item 13 / P-47).** `node scripts/county-manifest-canvas-dump.mjs --live` then replace DATA on the Manifest canvas. Equal to Wave 1 for freshness and gap ID. No rematerialize on refresh.
3. **Parallel, not PE-blocked:** P-75 who-serves · P-76 city-limits · P-77 measure. Compile after item 1 is met.
4. **P-74** when an isolated hauska-map worktree exists from `origin/main`. Do not wait to start 3 on this tree. Do not open the A2 pricing branch.

P-76 is the **city-limits** half of gap row 35. It does not close the ETJ adapter ruling. ETJ stays unresolved until a later derivation card.

## What this plan refuses

- Starting CAMA or harvest before P-73 and P-78.
- Bundling deed/school into the CAMA card.
- Calling L20 zoning counts a footprint win.
- Shipping a fabricated ETJ buffer as city limits.
- Opening a second PE writer on the A2 tree.
- Treating typed absence as Phase 2 exit for every canvas P0.

## leave_behind

```
leave_behind:
  - item: P-75 / P-76 customer-done (cortex + PE). Handoff _inbox/2026-08-24_write_path_planner_handoff.md
    owner: planner
    plan_row: P-75
  - item: A2 PE writer still holds property hauska-map; P-74 needs isolated origin/main tree
    owner: property
    plan_row: P-74
  - item: P-78 product rewrite; spec + F1-F8 exist; do not start P-25 until SET is in cad-ingest
    owner: planner
    plan_row: P-78
  - item: P-77 honest-miss serve half held (measure already live)
    owner: planner
    plan_row: P-77
```
