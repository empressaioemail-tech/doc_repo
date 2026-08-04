# Elgin STEP 1 — Tier-1 facet re-bake (48021)

Date: 2026-08-04
ldt main: 9b8b4caa
CLI: pnpm --filter @workspace/api-server node-facet-bake-tier1 -- --county=48021

## Planner ruling
County-wide 48021 accepted (no Elgin-only flag). Bastrop safety = semantic via monotonic shouldPromote; equal-score timestamp refresh allowed. Limit write smoke skipped (not Elgin-scoped).

## Pre-verify
- txgio Elgin stamped: 3798 parcels / 4047 rows
- txgio Bastrop city stamped: 5822
- tier1 Elgin zoning: 0
- tier1 Bastrop city zoning: 5773
- tier1 total 48021: 62257

## Dry-run summary
[node-facet-bake-t1] ---- Tier-1 bake summary ----
[node-facet-bake-t1] county:              48021/Bastrop
[node-facet-bake-t1] mode:                DRY-RUN (no writes)
[node-facet-bake-t1] adapter_key:         node-facets:tier1
[node-facet-bake-t1] parcels seen:        63357
[node-facet-bake-t1]   skipped (no id):   0
[node-facet-bake-t1]   skipped (no geom): 0 (baked id-only, envelope/acreage absent)
[node-facet-bake-t1] bakeable nodes:      63357
[node-facet-bake-t1]   promoted (new):    0
[node-facet-bake-t1]   promoted (upgrade):63232
[node-facet-bake-t1]   kept prior (mono): 125
[node-facet-bake-t1]   fabrication fixed: 0 (gate-blocked land-use stripped from prior snapshot)
[node-facet-bake-t1] facet coverage (of bakeable):
[node-facet-bake-t1]   land-use:          62096 (98.0%)
[node-facet-bake-t1]     via address-join:0 (owner-gated situs-address recovery)
[node-facet-bake-t1]   acreage:           63357 (100.0%)
[node-facet-bake-t1]   zoning:            9620 (15.2%)
[node-facet-bake-t1]   envelope derived:  0 (0.0%)
[node-facet-bake-t1]   envelope ok:       0 (0.0%)
[node-facet-bake-t1] duration:            18.0s
  "envelope": {
    "disclosure": "No zoning stamp on this parcel - honest absence; envelope via atom path when present.",
    "envelope": false
    "tierNote": "Tier 1 (deterministic). Buildable envelope product path retired (anti-zombie / atom_path_pending) ΓÇö read envelope from property atom chain. Tier 2 may still carry flood overlay.",
  "envelope": {
    "disclosure": "Tier-1 bake no longer authors product envelope confidence (anti-zombie). Read buildable-envelope from the property atom chain, or honest-decline.",
    "envelope": false
    "tierNote": "Tier 1 (deterministic). Buildable envelope product path retired (anti-zombie / atom_path_pending) ΓÇö read envelope from property atom chain. Tier 2 may still carry flood overlay.",
  "envelope": {
    "disclosure": "No zoning stamp on this parcel - honest absence; envelope via atom path when present.",
    "envelope": false
    "tierNote": "Tier 1 (deterministic). Buildable envelope product path retired (anti-zombie / atom_path_pending) ΓÇö read envelope from property atom chain. Tier 2 may still carry flood overlay.",

## Apply summary
[node-facet-bake-t1] ---- Tier-1 bake summary ----
[node-facet-bake-t1] county:              48021/Bastrop
[node-facet-bake-t1] mode:                WRITE
[node-facet-bake-t1] adapter_key:         node-facets:tier1
[node-facet-bake-t1] parcels seen:        63357
[node-facet-bake-t1]   skipped (no id):   0
[node-facet-bake-t1]   skipped (no geom): 0 (baked id-only, envelope/acreage absent)
[node-facet-bake-t1] bakeable nodes:      63357
[node-facet-bake-t1]   promoted (new):    0
[node-facet-bake-t1]   promoted (upgrade):63232
[node-facet-bake-t1]   kept prior (mono): 125
[node-facet-bake-t1]   fabrication fixed: 0 (gate-blocked land-use stripped from prior snapshot)
[node-facet-bake-t1] facet coverage (of bakeable):
[node-facet-bake-t1]   land-use:          62096 (98.0%)
[node-facet-bake-t1]     via address-join:0 (owner-gated situs-address recovery)
[node-facet-bake-t1]   acreage:           63357 (100.0%)
[node-facet-bake-t1]   zoning:            9620 (15.2%)
[node-facet-bake-t1]   envelope derived:  0 (0.0%)
[node-facet-bake-t1]   envelope ok:       0 (0.0%)
[node-facet-bake-t1] duration:            82.2s
  "envelope": {
    "disclosure": "No zoning stamp on this parcel - honest absence; envelope via atom path when present.",
    "envelope": false
    "tierNote": "Tier 1 (deterministic). Buildable envelope product path retired (anti-zombie / atom_path_pending) ΓÇö read envelope from property atom chain. Tier 2 may still carry flood overlay.",
  "envelope": {
    "disclosure": "Tier-1 bake no longer authors product envelope confidence (anti-zombie). Read buildable-envelope from the property atom chain, or honest-decline.",
    "envelope": false
    "tierNote": "Tier 1 (deterministic). Buildable envelope product path retired (anti-zombie / atom_path_pending) ΓÇö read envelope from property atom chain. Tier 2 may still carry flood overlay.",
  "envelope": {
    "disclosure": "No zoning stamp on this parcel - honest absence; envelope via atom path when present.",
    "envelope": false
    "tierNote": "Tier 1 (deterministic). Buildable envelope product path retired (anti-zombie / atom_path_pending) ΓÇö read envelope from property atom chain. Tier 2 may still carry flood overlay.",

## Post-verify
- elgin_tier1_zoning_facet: 3762 (all 8 districts; AGOL provenance cityKey=elgin-tx on all 3762)
- bastrop_city_tier1_zoning_facet: 5773 (UNCHANGED)
- Gap 3798→3762 EXPLAINED: 3798 feature_indexes → 3763 unique place_keys (prop_id multi-geometry collisions, surplus 35) + 2 prop_id='0' collide onto node:48021:0 already held by Bastrop SF-1 → 3762
- Bastrop semantic match 5813/5822: residual is pre-existing prop_id=0 collisions + 2 vintage district drifts (29431 MU/P-4, 47600 P-5/GC) — not introduced by this bake

## Verdict
STEP 1 PASS. Proceed to STEP 2 engine zoning-fact bake.
