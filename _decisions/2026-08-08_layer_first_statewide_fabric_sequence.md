---
id: 2026-08-08_layer_first_statewide_fabric_sequence
title: Layer-first statewide sequence — build the fabric, then backfill jurisdictions
date: 2026-08-08
status: active
owner: nick
related: [_decisions/2026-08-08_county_shape_thirteen_rails_and_geometry_first, _inbox/2026-08-08_STATEWIDE_layer_inventory, _inbox/2026-08-08_FABRIC_statewide_parcel_analysis, _inbox/2026-08-08_FABRIC_parcel_counts.json, _decisions/2026-08-08_multipolygon_fail_closed_and_the_real_fix, 90_operations/OPS-1_texas_source_registry]
---

# Layer-first — the sequence that finishes Texas

Operator framing, 2026-08-08: lay the statewide-uniform layers across the whole state first, reconcile the tile seams, and let the resulting cadastral fabric BE the node list. Then road twins. Then backfill jurisdiction-specific data into a framework that already exists.

This replaces jurisdiction-first as the program's operating sequence. It does not replace the county shape (thirteen rails) or the completeness ruling; it changes the ORDER in which those rails get filled.

## Why the pivot, in one paragraph

Jurisdiction-first onboards a county through the entire stack, certifies it, and moves on. Nine jurisdictions were completed that way and 245 were not. The statewide layer inventory (2026-08-08, live store queried directly) found the reason: NOTHING is statewide-complete, and every layer we hold is either per-parcel on-demand or per-city hand-scripted. Parcel geometry is loaded for 19 of 254 counties. Topography is 60 per-parcel DEM crops. FEMA and SSURGO are live point-query adapters with a zero-row cache. Roads exist as seven hand-authored per-city scripts. City boundary polygons do not exist at all. The machine was built to enrich one parcel at a time, which is why blanketing a state has never happened.

The layers that make the map complete are exactly the ones that need NO jurisdictional knowledge: parcels, roads, topo, flood, soils, boundaries — all statewide-uniform public sources, acquired once. The work that genuinely requires per-jurisdiction effort is zoning, setbacks and code text, which is also the moat. Layer-first therefore gets statewide shape fast AND concentrates expensive effort on the differentiated part.

## Ground truth this plan stands on (live-queried 2026-08-08, SQL recorded)

| Fact | Value |
|---|---|
| Counties with parcel geometry loaded | **19 of 254** (235 absent, Harris included) |
| True distinct parcels in those 19 | **4,617,181** (not the 5,535,897 rows; 16.6 percent are tile duplicates) |
| Tile-seam reconciliation | **Mechanical and safe** — 0 of 334,638 tile-spanning features carry more than one geometry hash |
| Statewide-complete layers today | **None** |
| Multi-part parcels (de-duplicated) | 0.3714 percent by count, 12.529 percent by bbox acreage |

Sources: `_inbox/2026-08-08_FABRIC_statewide_parcel_analysis.md`, `_inbox/2026-08-08_FABRIC_parcel_counts.json`, `_inbox/2026-08-08_STATEWIDE_layer_inventory.md`.

## The sequence

### L0 — Seam reconciliation (do first; it is nearly free)

`SELECT DISTINCT ON (county_fips, feature_index) ... ORDER BY county_fips, feature_index, tile_key`. No geometry is ever cut at a tile boundary; a feature touching N tiles is written N times byte-identical. This is a de-duplication, not a re-assembly.

Two identity traps that naive dedup walks into, both must be handled explicitly:

- **Geometry-keyed dedup discards accounts.** Tarrant `A 36-1` is 133 leasehold accounts on ONE DFW Airport polygon with a single geometry hash. Dedup on geometry alone silently drops 132 real records.
- **Sentinel prop_ids.** Travis carries 454,349 rows at `prop_id='0'` collapsing to 590 distinct geometries — business-personal-property and utility accounts stamped on real-property polygons.

Rule: the fabric keeps ACCOUNT identity separate from GEOMETRY identity. One geometry may carry many accounts. Record the ambiguity classes; do not silently pick a winner.

### L1 — City and county boundaries (cheapest complete-in-one-pass win)

One small adapter against the TxGIO City_Boundaries endpoint already documented in OPS-1: 1,225 polygons, zero dollars, queryable. Currently absent entirely, and the engine's own comment at `cascade-unzoned-envelope-decline.ts:62` confirms it: no city_limits, incorporated_place, or TIGER source anywhere.

This unblocks real work immediately. In-city determination is today inferred from address strings and explicitly hedged as "likely, not proof." With boundary polygons it becomes a real spatial join, which is a prerequisite for honest city-scoped rail state in the manifest.

### L2 — Parcel geometry, the remaining 235 counties

The spine. Bulk StratMap acquisition, not per-county ceremony. Every county lands seam-reconciled per L0 and enters the manifest as a real row with real geometry.

Completing L2 is what makes "the map has all shape" true. It is also the single largest lever on the Texas completeness number, because parcel geometry is Rail 1 and every other rail joins to it.

### L3 — Road twins, statewide

Currently seven hand-authored per-city ingest scripts. Needs a statewide pass (OSM Overpass bulk, plus TxDOT and county roadway layers where they add value). Roads are load-bearing for frontage, which is load-bearing for setbacks, which is the product's headline answer.

### L4 — Uniform federal and state layers

FEMA NFHL, USDA SSURGO, USGS 3DEP, hydrology. Adapters exist for the first three but run as live per-parcel point queries against federal services with nothing persisted. Converting them from point-query enrichment to bulk statewide layers is a retrofit, not a greenfield build.

### L5 — Jurisdiction backfill

Zoning, setbacks, code text, per jurisdiction, into a framework that already has shape. This is where the per-jurisdiction cost lives and where the moat is. It is also where the existing proven machinery (the county recipe, the cert lane, the corpus pipeline) applies unchanged.

## What this changes about the manifest

The manifest's denominator is unaffected: twelve rails (join quality moved to a derived metric by operator ruling 2026-08-08) across 254 counties. What changes is the expected FILL PATTERN. Under jurisdiction-first, counties complete one at a time and the grid fills in columns of thirteen. Under layer-first, the grid fills ROW-WISE across all 254 counties one rail at a time, so Rail 1 reaches 100 percent before Rail 5 reaches 10 percent.

That is a visibly different and more honest progress picture, and it is what the Command Center per-rail statewide progress columns are for.

## What this does not change

The county shape and its three states. The completeness ruling (honest absence counts as satisfied; threshold not binary). The Geometry Law. The heavy-scan slot discipline, which remains an open contradiction against any parallel acquisition plan and needs its own ruling. The sub-200-dollar cost commitment, still unverified against the full rail set.

## Open items

- **Acquisition throughput.** L2 is 235 counties of bulk ingest. Nothing in the current pipeline does bulk acquisition at that scale; the depth-warm path is per-parcel. The throughput work (bulk-load out of the loop, parallelism) applies to L2 as much as to warm.
- **The heavy-scan slot** serializes exactly the work L2 needs parallel. Unresolved.
- **Cost.** 235 counties against a sub-200-dollar-per-jurisdiction commitment that is unverified, with one measured actual (Bastrop, 284.40 dollars across six warm passes) already over it. Re-warms do not count against the commitment per operator ruling, but lifetime cost must still be tracked.
- **Storage.** 4.6M parcels across 19 counties implies roughly 60M statewide at the same density. Store sizing for L2 is unexamined.
