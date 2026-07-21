---
id: 2026-07-20_provable_county_data_pipeline_design
title: Provable, repeatable county-data pipeline — design (Central-TX -> TX-wide -> national)
status: active
date: 2026-07-20
applies_to: legacy-design-tools (cad-ingest, api-server bake, a new integrity+ledger layer)
related: [2026-07-20_landuse_join_integrity_and_data_acquisition_backlog, 2026-07-20_map_first_program_launch, zoning-stamp-roll-mechanics]
owner: nick
---

# Provable county-data pipeline — design

Direction (operator 2026-07-20): the data-collection process must become PROVABLE, REPEATABLE, and SCALABLE from 10 Central-TX counties to all 254 Texas counties, then national. The Hays/Williamson land-use fabrication (a numeric-collision join that stamped ~167k parcels with wrong land-use and passed every existing step) proved the gap: we have ingest steps but no CORRECTNESS gate. This design makes coverage trustworthy by construction — a county's coverage number is recorded only after an integrity gate proves the data is real.

Operator decisions locked: (1) a GATED pipeline plus a per-county coverage LEDGER, built incrementally; a county is not "done" until its gates pass and its ledger row is written. (2) AUTOMATE source discovery and gate quality; where auto-discovery fails or a source does not exist, the county shows honest-absence rather than blocking or fabricating.

## What already exists (real, composable — verified against origin/main)

- Parcel geometry ingest: `txgio-ingest` CLI + `TXGIO_COUNTIES` registry. One statewide StratMap URL template; adding a county's geometry is one registry line. Automated (self-downloads the zip).
- Land-use ingest: `stratmap-landuse` CLI reading the same StratMap DBF `STAT_LAND_` -> `cad_property.property_use_code`. Automated. Comal blank = source ships an empty field (honest gap, key is correct).
- Zoning stamp: `zoning-cli` + `ZONING_LAYERS` registry (per-city ArcGIS layer + codeField + optional codeExtractRegex), point-in-polygon onto `txgio_parcel.zoning_district`. Stamp execution is one command; the per-city layer-URL/codeField discovery is the bespoke part.
- The join + normalizer (`normalizeForJoin`) joining land-use onto geometry by `(county_fips, normalized prop_id)`.
- Tier-1 node-facet bake (`nodeFacetBakeTier1Cli`) writing facets to `place_layer_snapshots` WITH a monotonic high-water-mark guard (`shouldPromote`) and owner-exclusion. Batched I/O (~630 nodes/sec).
- Provenance columns (`source_file`, `source_vintage`, `ingested_at`) on both stores; content-hash on snapshots and the PMTiles output.
- `runSetbackGate` — the existing integrity-gate PATTERN (pass/flag/block per rule, citation-grounded) to model the new join gate on.

## What is missing (the greenfield this design adds)

1. Owner-match integrity gate — the automated version of the check that caught the fabrication. Post-join, pre-promote: sample joined parcels, compare `txgio_parcel.owner_name` vs `cad_property.owner_name` for the joined key; if the match rate falls below threshold the join is FABRICATED -> block promotion, store honest-absence, flag the county. This is the single highest-leverage new component.
2. A per-county coverage + correctness LEDGER. Nothing scores or stores per-county data quality today (the audit was ad-hoc). One row per (county, facet): honest coverage %, integrity verdict, owner-match rate, source, vintage, classification, checked-at.
3. A UNIFIED onboarding config. Today there are 4-5 scattered registries (TXGIO_COUNTIES, CAD_COUNTIES, CAD_BULK_SOURCES, ZONING_LAYERS, SETBACK_TABLES). A national pipeline needs one per-jurisdiction descriptor that composes them.
4. A per-STATE source-provider abstraction. StratMap URL, PTAD land-use vocabulary, and PACS/Orion CAD formats are Texas-locked at the source layer. National requires the source adapters behind a provider interface; the substrate (grid-tile geometry math, point-in-polygon, ArcGIS fetch, PMTiles bake, parcelNodeId identity, provenance, the gate pattern) already generalizes.

## The pipeline (per county, each stage emits a verifiable artifact)

Stage 0 — REGISTER: one jurisdiction descriptor (state provider + FIPS + optional city zoning endpoints + setback tables). For TX geometry+land-use this is one line.

Stage 1 — INGEST: geometry (txgio-ingest) + land-use (stratmap-landuse) + zoning stamp where a layer is registered. Each writes provenance. Automated for the geometry+land-use rail; zoning/setbacks are the bespoke long pole (auto-discover where possible).

Stage 2 — INTEGRITY GATES (new, the crux): for each facet/join, an automated correctness check with a stored verdict.
- Owner-match gate on the land-use join (block + honest-absence below threshold).
- Coverage-floor / anomaly check per facet (flag suspiciously-perfect or suspiciously-zero; a 100% or a collision both warrant a look).
- Provenance completeness (every promoted value carries source + vintage + join key).
A facet that fails its gate is stored as honest-absent, never promoted as fabricated.

Stage 3 — BAKE: the facet bake promotes ONLY gate-passed data (owner-excluded, monotonic). Already built; add "gate-passed" as a promotion precondition.

Stage 4 — LEDGER: write the per-county-per-facet coverage+correctness row. "County done" = gates passed + ledger row written. The ledger is the provable, queryable record — the antidote to "91.6% that was actually collisions."

## Scale posture

- TX-wide: the geometry+land-use rail is one-registry-line-per-county on the uniform StratMap template. The bespoke cost is zoning (per-city layer hunt) + setback tables (per-jurisdiction transcription) -> automate discovery, gate quality, honest-absence where auto fails.
- National: introduce the per-state provider interface (parcel program, land-use vocabulary, CAD format). Each new state implements the provider; the gates, ledger, bake, and identity scheme are reused unchanged.
- Graceful degradation is the scaling principle: a jurisdiction never blocks the pipeline and never fabricates; it contributes whatever facets pass their gates and honestly reports the rest.

## First moves (build order)

1. Build the owner-match gate as a reusable primitive (model on runSetbackGate); wire it into the land-use join in the bake. Its first job is to correctly gate off Hays+Williamson (closing the fabrication properly and monotonic-safely — the fabricated snapshots must be cleared, since the monotonic guard would otherwise keep them).
2. Build the coverage+correctness ledger table + a per-county scorer that runs the gates and writes the row.
3. Retrofit the 10 Central-TX counties through the gate+ledger -> an honest, stored coverage baseline (re-validates everything baked so far).
4. Unify the onboarding config; then the per-state provider abstraction when the second state is on the horizon.

The lesson that seeds this: the owner-match test is the integrity oracle for any parcel<->attribute join. A numeric-id join across two systems that both use short integers WILL false-positive; validate with an independent field (owner, situs) before trusting a coverage number. Every number in the ledger earns its place by passing that gate.
