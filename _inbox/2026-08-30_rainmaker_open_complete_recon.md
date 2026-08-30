---
id: 2026-08-30_rainmaker_open_complete_recon
title: Rainmaker vs "Open option Bastrop was 100% complete"
date: 2026-08-30
status: filed
plan_row: F-06
related:
  - _inbox/2026-08-24_county_manifest_dump.json
  - _inbox/2026-08-28_p91_o5_draw_five_parcels.md
  - _inbox/2026-08-29_p91_wave_i_connect_grade.md
  - _inbox/2026-08-30_p91_five_parcel_comparison.md
  - _inbox/2026-08-25_p78_bastrop_48021_gold_34137_probe.json
  - 28_THE_BASTROP_MOLD_engine_build_spec.md
snapshot:
  seat: integration
  repo: P:/doc_repo
  branch: main
  head: 59ffa02
  measuredAt: 2026-08-30T14:02:24Z
---

# What "100% complete" measured

The operator's pushback is that Bastrop was 100% complete at Open, so
Rainmaker's atom-miss lines after card H look like a wiring regression.

Two denominators match that memory. Neither is "this parcel had every rail."

## Denominator 1 — county ledger cad + geometry

Watch dump `_inbox/2026-08-24_county_manifest_dump.json` for 48021, dated
before card H:

| rail | displayState | honestCoveragePct |
| --- | --- | --- |
| cad | satisfied-present | 100 |
| geometry | satisfied-present | 100 |
| zoning | satisfied-present | 99.77 |
| flood / landuse / owner / mud / rrc-pipelines / rail-corridor | satisfied-present | 98.26 |
| envelope | not-yet | 99.77 |
| footprint | not-yet | null |
| rrc-wells | not-yet | null |
| roads | not-yet | null |
| easement | not-yet | null |

Cad and geometry were 100. Footprint, wells, roads, and easement were
already `not-yet`. Envelope was `not-yet` even with a 99.77 figure. That
watch is the county completeness board, not a per-parcel 14-rail fill.

The operator screenshots still show the geometry rail: blue TxGIO lot
lines and a yellow highlight on 111 Rainmaker Cv. Card H did not remove
that outline. The brief line `property-boundary-edge atom-miss` is a
different store.

## Denominator 2 — Connect Open on gold Bastrop

P-91 `score_open` / Use in your AI Open was graded on gold Pine
`48021:34137`, not on Rainmaker. Wave I (2026-08-29T15:04Z, serving
`smartsite-mcp-00047-vos` / p549): `score_draw` = `ring_and_edges`.
Leftover in that same grade, before treating Rainmaker as a bake
casualty: "Rainmaker has no ring and no edges. Do not invent one."

Wave I Open on gold was not setbacks-complete either. Envelope human:
"Buildable envelope not computed / reason Withheld, setbacks unruled."
A complete Open on Bastrop meant the gold ring painted. It did not mean
Rainmaker, footprint, wells, or a setback table for PDD.

# Live pair, same card H run

Anonymous GET 2026-08-30T14:02:24Z,
`https://smartsite.cloud/api/spine/cortex/api/brokerage/v1/place/node/<id>/facets`.
Both rows `publishRunId` `e2c5c6d7…`, schema `node-facets-tier1-conformant-v1`.

| Field | Rainmaker `48021:8720522` | Pine gold `48021:34137` |
| --- | --- | --- |
| parcelJoin | joined, TxGIO feature_index 57429 | joined |
| zoning | PDD | SF-1 |
| bake `baseFacts.landUse` | null, coverage false | null, coverage false |
| land-use **atom** | present A1, entity `48021:8720522:2025`, evaluated 2026-08-12 | present A1, same vintage |
| acreage | 0.1467 shoelace | 0.3827 shoelace |
| envelope | null (anti-zombie) | null (anti-zombie) |
| structural yearBuilt | 2021 | 1910 |
| structural livingAreaSqft | null | null |
| flood | Zone X | Zone X |
| special district | absent, TCEQ outside | absent, TCEQ outside |
| well | atom-miss | atom-miss |
| footprint | atom-miss | atom-miss |
| boundary edges | atom-miss | present, 4 edges, `descriptor-fixture`, extracted 2026-07-29 |

Cortex-prod `cad_property` 2026-08-30, leftover year 2025:

| prop_id | year_built | land_acres | living_area_sqft | property_use_code |
| --- | --- | --- | --- | --- |
| 8720522 | 2021 | 0.1462 | null | A1 |
| 34137 | 1910 | 0.3815 | null | A1 |

Living area was not on the leftover CAD row for Rainmaker. The 2,427 sqft
on the listing comparison is MLS, not CAD. P-78 already HOLDed gold living
area restore (34137 was 2800 on an older path, then null). Card H did not
wipe a CAD living-area that this leftover never held.

# Store counts that close the wipe hypothesis

Production `hauska_mcp.atoms` this session (read-only):

- `building-footprint` with prefix 48021: **0**
- `well-fact` with prefix 48021: **0**
- `property-boundary-edge` county-wide: 26,846 atoms on **3,732** distinct
  prop_ids (of 77,799 CAD rows). Most Bastrop parcels have no edge atoms.
- Rainmaker `48021:8720522`: **0** edge atoms
- Pine `48021:34137`: **4** edge atoms

P-51 (2026-08-22): Bastrop has zero building-footprint; gold well is
atom-miss by design. P-53: PE Boundary reads `property-boundary-edge`
only. Do not copy `txgio_parcel` / bake ring / GIS outline onto that
field. P-91 O5 (2026-08-28): R1 `loadBoundaryEdgeFactAtom` does not read
bake, CAD, or GIS for the ring. Depth-warm wrote edges on some Bastrop
parcels (35073, 33223, 27943, 32243). Rainmaker was not one of them.
O5 extras already included other Bastrop atom-miss parcels (`82112`,
`36249`) a day before card H.

Mold `28_THE_BASTROP_MOLD_engine_build_spec.md` §1e: a complete county is
not 100%, and PDD / overlay districts honestly decline. Rainmaker is PDD.
"No setback table covers this parcel's district" is that decline. The
grey box that says the **area** is unstamped is the PE lie, because zoning
PDD is present.

# Two mechanisms for the screenshot

Observation: map shows a yellow GIS lot; brief says well / footprint /
boundary atom-miss; grey box says not stamped; living area undeclared;
header Zone A1 over Zoning PDD.

**Mechanism 1 (accepted).** Three stores, one screen. The map paints the
geometry rail (TxGIO tiles + highlight). The brief Boundary / well /
footprint lines read atoms only, by P-53 / P-50 / P-51, since 2026-08-22.
Rainmaker never received edge atoms. Header "Zone A1" is the land-use
atom (present since 2026-08-12). "Zoning PDD" is the bake. Grey box is
the SS-W2 envelope-absence copy, which names zoning and setbacks together
when envelope is null. Living area undeclared matches leftover CAD null.
Card H rebake is on the footer because that is the current snapshot, not
because it deleted those atoms.

**Mechanism 2 (rejected).** Card H unbound or deleted Rainmaker's edges,
footprint, well, living area, and setbacks, and a wiring pass will put
them back. Rejected because: county footprint and well counts are zero
and were already `not-yet` on 2026-08-24; Rainmaker edges were already
called out as missing on 2026-08-28 / 2026-08-29; Pine on the same publish
still has its July 29 fixture edges; leftover CAD living area is still
null; join state is `joined` on feature 57429, not `no-row`; the map
outline is still there.

A third mechanism, that Open Option measured Rainmaker itself as
14-rail complete, is also rejected. The Open grade used Pine. The five
Connect node reads on 2026-08-30 (`_inbox/2026-08-30_p91_five_parcel_comparison.md`)
show the same envelope refuse, land-use bake miss, boundary unmeasured,
and footprint unmeasured on all five PDD parcels. Only `yearBuilt`
varies.

# What is actually wiring

These are PE / bake copy defects. They do not mint footprint, well, or a
Rainmaker ring.

1. Grey box "Not stamped in this area yet / zoning and setbacks" while
   `zoning.district` is PDD (and SF-1 on Pine). Envelope null is
   anti-zombie, not an unstamped city.
2. Header treats land-use atom A1 as "Zone" above the real zoning district.
3. `structuralFact.yearBuilt` is 2021 on the wire and PE does not say it.
   Same miss on gold (1910), noted in the P-78 gold probe: card rendered
   living area and did not render yearBuilt.
4. Bake `baseFacts.landUse` is null on both parcels while the land-use
   atom is present. Fold the bake miss into W1. Do not treat the atom as
   missing.

# What a wiring pass will not mint

Footprint, well, and Rainmaker `property-boundary-edge`. Those need
writers (W3 rails), not a PE label change. P-91 already forbade inventing
a Rainmaker ring. Depth-warm can write edges from the TxGIO ring that
already produces the yellow highlight and the shoelace acreage. That is a
landing card, then one Wave R, not a second bake-only wiring pass.

# Sequence (unchanged)

PE copy (grey box, Zone vs zoning, yearBuilt) in parallel with W1
(situs-extend leftover no-row, max-year tax-year, landUse into
`baseFacts`). No publish until Wave R. Do not start P-80 or `scllr`.
Do not rebake to "restore" Rainmaker completeness.

leave_behind: none
