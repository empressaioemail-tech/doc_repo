---
id: 2026-08-24_write_path_what_we_missed
title: Write-path plan — what we missed (pre-flight)
date: 2026-08-24
status: filed
plan_row: P-73
related:
  - _inbox/2026-08-24_parcel_facts_write_path_game_plan.md
  - _inbox/2026-08-24_p73_ingest_bound_field_map.md
---

# What we missed

Phase 1 is still wrapping. Do not start Waves 3-6. These are the surprises a later lane will hit if nobody names them now. P-75 / P-76 already have approved WDLLs and CP1s; this file does not restate those cards.

## Already caught (do not relitigate)

Two StratMap paths. L20 291k is zoning. City limits is not ETJ. REST harvest has no writer. Travis join is prop_id only. `upsertCadProperties` last-wins. 0076 is on `origin/main` (PR #427), not seat-worktree-only. `tx_city_boundary` live 1222 / 1222 geo_id and staging 10196 match ss-w15 / L22 exactly (2026-08-25T01:58:19Z). Empty-index lie is a code-path risk, not an empty table.

## Misses that will surprise

### 1. A `cad_property` write is not an inspect-title write

Cortex live-reads `cad_property` for **structural** fields only (`loadStructuralFactAtom` → living area). Situs, land use, and acreage on the card come from **baked** `place_layer_snapshots` (tier-1 from `txgio_parcel`). PE never queries `cad_property`.

Consequence: P-25 CAMA will light living area on the next cortex GET after deploy. It will not change the card title, land-use chip, or map-click label. Those need bake/rebake or a serve-time fallback (P-74). Year built is already on the structural wire and **not rendered on InspectCard**.

### 2. "No atoms slot" hid two deploys

Wave 1 still needs a **cortex-api deploy** (new root facts) and a **PE deploy** (P-74, and the card rows for P-75/P-76). Boundary CLI apply is a Neon write, not a slot take. Treat deploys as first-class in every Wave 1 close.

### 3. Empty city index currently lies

`resolveCityContainment` on an empty index returns **unincorporated**, not unmeasured. P-76 WDLL already names this. Live `tx_city_boundary` is 1222 rows (2026-08-25T01:58:19Z), so the index is not empty today. If the table is later truncated, origin/main still lies. Isolated P-76 reader marks empty as unmeasured.

### 4. GIS_AREA units are undesigned

StratMap ships `GIS_AREA` and `GIS_AREA_U`. `landuse.ts` reads neither for acres (hard-null). Caldwell 202503 is 100 percent `Acres` (26,155 rows). That does not prove the unit statewide. P-78 spec + F5: identity AC/ACRE/ACRES, convert SF/HA, else refuse `land_acres`.

### 5. StratMap YEAR_BUILT is probably a no-op on the metros that matter

Caldwell 48055 vintage 202503: 65.62 percent non-blank. Field is `C(60)`. 34.14 percent are comma-joined lists (`1962,2011,2023`). `Number()` drops those. P-78 F8 takes the first valid YYYY in [1800, 2027] and skips junk (`209`). Metros remain unmeasured; the hard-null in `landuse.ts` is still why `cad_property` year_built is 0 percent there. P-78 is not theater for this county.

### 6. P-78 is a rewrite, not a flag

`upsertCadProperties` sets every attribute from `excluded.*` on `(county_fips, prop_id, tax_year)`. Spec is now `_inbox/2026-08-24_p78_cad_property_merge_SPEC.md` plus `scripts/fixtures/p78-cad-merge/` F1–F8. Selftest `node scripts/p78-merge-fixtures-selftest.mjs` must keep passing. Product rewrite is still Wave 3. Do not start Dallas CAMA until the SET clause is in cad-ingest and last-wins fails F1/F3 there.

### 7. After CAMA, atoms and bake are still a second motion

Inspect sqft can move without atom apply. `cad-parcel-roll`, owner-fact, land-use-fact, and County Manifest cells will not. A "Dallas CAMA closed" that only upserted `cad_property` will look empty on every atom-shaped surface. Name the atom-apply follow-on in the P-25 close, do not absorb it.

### 8. City PIP is one point

Containment uses a representative point (largest-ring centroid, else first vertex). A parcel that straddles a city line gets one city. Boundary-ray hits are implementation-defined. Disclose that, or the first ETJ-adjacent lot becomes a support ticket.

### 9. Who-serves vs special-district double subject

L22 deleted 13 TCEQ aliases against `tx_special_district`. The serve path can still print a TCEQ staging row and a special-district-fact as two utilities. P-75 WDLL item 6 names this; the reader still has to implement the exclusion, not hope.

### 10. Anonymous inspect and accessPolicy

Who-serves and city limits on the free card are public-record. Owner mailing is not. A new facet that accidentally attaches owner or mailing from `cad_property` while wiring utilities is a standing-decision miss. Pin the new wire to public-free fields only.

### 11. Local trees are the wrong snapshot

Wave 1 CP1s correctly pin `origin/main @ 244567a5`. Local `feat/s1-instrument-hardening` and the property seat LDT/PE trees are behind or dirty. A grader who probes gold on deploy and codes on those trees will lie about what a SQL write buys.

### 12. Travis measure instrument does not exist yet

Instrument exists: `scripts/p77-travis-join-measure.mjs`. Live 2026-08-25T02:08:37Z: 10 hit / 1 miss / 0 vintage-gap / 0 unmeasured on N=11. Miss is `48453:280238` with `leading_zero_orphan=false`. Serve / honest-miss half still held (A-027). `prop_id_bad_rate` 0.51 is not this grade.

### 13. Neon contention with live cortex

CAMA full zips and `stratmap-landuse` re-runs hit the same `cad_property` cortex live-reads for structural facts. No announce protocol beyond "announce the zip." A Tarrant upsert mid-inspect can tear a gold walk. Write the announce + reader-isolation note before Wave 4.

### 14. P-27 vs P-74

P-27 is the address-to-parcel resolver (post-gate). P-74 is card-title sentinel bind. Same situs string, different hop. If both open, they will "fix address" twice. Keep P-27 parked. Say so in P-74.

### 15. County Manifest health is the ledger GET, not a screenshot

CC `#panel=county-manifest` is one renderer of `GET /api/county-ledger`. The operator instrument is `_inbox/2026-08-24_county_manifest_dump.json` plus the Manifest canvas. Refresh is `--live` then replace DATA. Who-serves and city-limits will never appear as rails. Retire the canvas after a CC push. Read with the deficit register: `C:\Users\cente\.cursor\projects\p-doc-repo\canvases\parcel-public-facts-deficit.canvas.tsx`.

## Cheap work that can run while Phase 1 wraps

No product kickoff. No `--apply`. Isolated trees only if someone is already on them.

| # | Work | Why it removes surprise | Slot |
| --- | --- | --- | --- |
| A | Re-measure `tx_city_boundary` and `tx_utility_territory_staging` live counts | DONE 1222 / 10196 @ 2026-08-25T01:58:19Z (match L22/ss-w15) | No |
| B | One StratMap zip: count non-null `YEAR_BUILT` and `GIS_AREA` + distinct `GIS_AREA_U` | DONE Caldwell 48055: 65.62% year, 100% GIS acres | No |
| C | Draft P-78 merge spec: per-field COALESCE vs new tax_year, plus violation fixtures | DONE F1–F8 + selftest. Product rewrite still Wave 3 | No |
| D | File P-77 measure instrument (SQL, both directions, Simsbrook block + Travis sample) | DONE live 10/1/0/0. Serve half held | No |
| E | One-page hop diagram: structural live vs situs baked vs new root facts | DONE; counts patched after live measure | No |
| F | P-25 close contract: store % + cortex living-area probe + **named** atom-apply leave_behind | Still open. Do not start CAMA | No |

Do not do now: Dallas/Tarrant zip load, footprint drain, Travis join fix, REST harvest writer, PE work on the A2 tree, P-27.

## Rejected as "more planning"

A second 66-row remapping. Factory 2 setback program. HOA scoping. RRC toggle. Those are other boards. Adding them here is how this plan gets fat again.
