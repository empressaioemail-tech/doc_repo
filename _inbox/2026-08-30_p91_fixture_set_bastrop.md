---
id: 2026-08-30_p91_fixture_set_bastrop
title: Bastrop fixture set for the Smart Site MCP App. Twenty-eight parcels measured by what the product serves
date: 2026-08-30
status: ready
plan_row: P-91, P-92
serving_measured: smartsite-mcp p557 (00063-rej) / cortex-api p542 (00666-cuf), read 2026-08-30 through the planner's own connector
instrument: _inbox/2026-08-30_p91_served_completeness_probe.mjs over two get_smart_site depth-node batches (9 ids, 19 ids)
data_lane_note: footprint geometry, envelope, land use, drainage and flood citations are absent or refused on every parcel here; that is the data lane's remainder, not a selection defect. Everything is re-warmed when that lane lands.
---

# What "most complete" means today

Measured, not assumed: for every parcel, `get_smart_site depth node` was read and scored on ring vertices, edge count, edges with a named neighbor, edges with a road node, adjacency kinds, zoning district, flood zone and SFHA, structure year, footprint geometry, envelope state, and land-use disposition. Two things hold across all twenty-eight: zoning is present with a live citation and flood is present with `citationsDegraded: true`; footprint is `geom: none`, envelope is refused (`atom_path_pending`), land use is absent. So "complete" is decided by geometry and by variety, and the twenty-six with rings are the warm cohort (downtown Bastrop and the Higgins St block); the five subdivision parcels from the operator's walk have no ring and stay in the set as the honest-absence case.

# The set

| Group | Parcel | Label | Ring | Edges (neighbors / roads) | Zoning | Flood | Year | Use in the walk |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Gold | 48021:34137 | 908 Pine | 4 | 4 (1 / 3) | SF-1 | X shaded | 1910 | Everything; corner lot, alley, front on Pine |
| Gold neighbor | 48021:34169 | 906 Pine St | 5 | 5 (4 / 2) | SF-1 | X shaded | 1917 | Walk from gold; neighbor of 34137, 34177, 34161, 34121 |
| Complex corner | 48021:34121 | 907 Chestnut St | 8 | 8 (5 / 4) | GC | X shaded | 1960 | Most edges; alley plus two roads plus an unmapped side; ROW neighbor case (O3) |
| Downtown MU | 48021:34177 | 901 Pecan St | 5 | 5 (0 / 2) | MU | X shaded | 1860 | Oldest structure; MU district; minor collector frontage |
| Downtown MU | 48021:34161 | 905 Pecan St | 6 | 6 (5 / 2) | MU | X shaded | 1981 | Five named neighbors; alley rear |
| Downtown MU | 48021:35073 | 1102 Pine St | 4 | 4 (0 / 3) | MU | X shaded | 1980 | Clean four-edge, three roads |
| Narrow GC | 48021:33223 | 927 Main St | 4 | 4 (0 / 3) | GC | X minimal | 1865 | 28 ft frontage; the O1 42 percent parcel; two flood subtypes in one block |
| GC | 48021:34153 | 909 Chestnut St | 4 | 4 (2 / 4) | GC | X shaded | 1940 | Every edge has a road node |
| GC | 48021:34145 | 909 Pecan St | 4 | 4 (2 / 2) | GC | X shaded | 1873 | |
| GC seven-edge | 48021:35105 | 1101 Chestnut St | 7 | 7 (5 / 3) | GC | X shaded | 1995 | Second-richest adjacency |
| MU | 48021:35425 | 1206 Walnut St | 4 | 4 (2 / 2) | MU | X shaded | 2004 | Newest structure with a ring |
| SF-1 | 48021:36105 | 711 MLK Jr Dr | 6 | 6 (5 / 1) | SF-1 | X minimal | 1925 | Already on the operator's saved list (A19) |
| SF-1 | 48021:27943 | 703 Cypress St | 5 | 5 (0 / 1) | SF-1 | X minimal | 1920 | Four unmapped edges; tests the unmapped caption |
| SFHA Zone A | 48021:32243 | 1207 Fayette St | 4 | 4 (0 / 1) | SF-1 | A, SFHA | 1935 | Flood inside the SFHA with a ring; the flood tint case |
| Floodway | 48021:49295 | 145 Hasler Shores Dr | 11 | 11 (4 / 1) | SF-1 | AE, SFHA, floodway | 1975 | Richest shape; eleven vertices; the strongest flood case on record |
| Higgins block | 48021:31254 | 102 Higgins St | 5 | 5 (3 / 4) | SF-1 | X shaded | 1968 | Start of the contiguous block |
| Higgins block | 48021:31272 | 108 Higgins St | 7 | 7 (6 / 5) | SF-1 | X shaded | 1968 | Six named neighbors; the walk-add stress case |
| Higgins block | 48021:31281 | 106 1/2 Higgins St | 6 | 6 (2 / 5) | SF-1 | X shaded | 1981 | Fractional address; abbreviation and situs tests |
| Higgins block | 48021:31290 | 106 Higgins St | 6 | 6 (4 / 4) | SF-1 | X shaded | 1971 | |
| Higgins block | 48021:31353 | 111 Higgins St | 4 | 4 (0 / 2) | SF-1 | X shaded | 1976 | Ring with no named neighbor |
| Higgins block | 48021:31362 | 109 Higgins St | 6 | 6 (1 / 1) | SF-1 | X shaded | 1973 | |
| Higgins block | 48021:31371 | 107 Higgins St | 7 | 7 (2 / 2) | SF-1 | X shaded | 1970 | |
| Higgins block | 48021:31380 | 105 Higgins St | 7 | 7 (2 / 1) | SF-1 | X shaded | 1960 | |
| Higgins block | 48021:31389 | 103 Higgins St | 6 | 6 (1 / 1) | SF-1 | X shaded | 1960 | |
| Higgins block | 48021:31398 | 101 Higgins St | 5 | 5 (0 / 3) | SF-1 | X shaded | 1960 | |
| Higgins block | 48021:71278 | 110 Higgins St | 6 | 6 (0 / 5) | SF-1 | X shaded | 1992 | Alley plus four roads, no neighbor named |
| No ring, SFHA | 48021:36249 | 1408 Chestnut St | 0 | 0 | PI | A, SFHA | 1880 | Flood present with no geometry; honest boundary line with a flood fact |
| No ring, no year | 48021:82112 | 709 Laurel St | 0 | 0 | P/OS | X minimal | none | Public open space; the sparsest honest record |

Ordinary subdivision parcels (no ring, no named edges; from the operator's 2026-08-30 walk): 48021:8720522 (111 Rainmaker Cv), 48021:8718296 (228 Baron Creek Trl), 48021:8704645 (309 Rimrock Ct), 48021:8705357 (129 Trailstone Dr), 48021:8715051 (237 Driftwood Ln). All PDD, all X shaded, years 2018 to 2023. They exercise the batch board, the rails, and the honest-absence panel.

Miss and edge cases: `48021:900099` (parcel_not_found, `parcelExists: false`); `48021:900001` (unresolved on a screen, no Open); `zzzz-not-a-situs-99999` (situs unresolved); `111 Rainmaker Cv` versus `111 Rainmaker Cove` (one node, the create_screen duplicate refuse); `111 Rainmaker Ln` (a different parcel; must not merge).

# What the set cannot exercise until the data lane lands

Footprint hatch with real geometry; envelope (setbacks) once O2 is ruled and the atom path exists; land use present; drainage; a flood citation URL; flood studies (LOMR, city drainage, H and H) as facets; a measured boundary for the five subdivision parcels (warm cohort). Each has an honest-absence line in the panel today and a named item in the v2 card.
