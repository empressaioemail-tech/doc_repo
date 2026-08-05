---
id: T6_texas_roster_recon_track
title: T6 — Texas complete roster + source recon track (pre-factory deep dive)
status: active
owner: nick
related: [CATCHUP_program_2026-08-05, OPS-1_texas_source_registry, 90_runbooks/factory_onboarding_runbook, T3_rails_track, onboarding_defect_class_backlog]
---

# T6 — Every piece of property in Texas, accounted for

Mission (operator directive 2026-08-05): a COMPLETE roster of all 254 Texas counties and every incorporated city, with verified data sources and a factory-ready ingest plan, so that when scaling resumes the factory never stalls on discovery. Not lite, not superficial: this is the deep dive that makes ingestion an execution problem instead of a research problem. READ-ONLY track — public sources and repo docs only; no prod writes, no registry-row merges (deliverables are roster artifacts + specs the factory lanes consume).

## What "accounted for" means, per jurisdiction

Every county row and every incorporated-city row carries, VERIFIED where marked:

1. IDENTITY: FIPS / place code, population, estimated parcel count, containing county/counties (cities span counties — record every county a city touches).
2. GEOMETRY SOURCE (Rail C): StratMap land-parcels zip presence + vintage + feature count (TxGIO catalog is enumerable — verify per county); where absent, the CAD bulk alternative (the Donley pattern).
3. CADASTRAL LIVE SOURCE (per-parcel query path): ArcGIS REST service candidate with the FOUR-POINT PROBE (service root layer list + names; parcel-id field + exact casing + type; one real-feature Polygon query; owner/org + constraints) for every county where one exists; vendor-pattern classification (BIS Consultants, TrueAutomation/Harris Govern, Pritchard & Abbott, county-run AGOL, none) because vendor templates predict field shapes and the factory can exploit that; where none exists, say so with probe evidence (the Rockwall pattern).
4. JOIN QUALITY: prop_id bad-rate from StratMap metadata where published, geo_id/address-crosswalk risk flag (the Travis pattern, bad-rate 0.5147 threshold 0.25), known dup-propid risk.
5. ZONING REGIME: unincorporated county = unzoned (doctrine PASS state); each city classified euclidean-zoned / unzoned (Houston!) / unknown-needs-probe, with the zoning LAYER source where published (the ZONING_LAYERS candidate) and the per-parcel record layer where one exists (the Bastrop Parcels_One_Click pattern).
6. CODE TEXT SOURCE: publisher per city (Municode, eCode360, American Legal, Franklin, General Code, self-hosted PDF, none) — this drives the corpus lane; eCode360 cities inherit the scrape posture (civil UA, 0.5 rps, robots-gate); flag encodeplus/robots-blocked as operator-escalation rows.
7. RAILS AVAILABILITY (feeds T3 Phase 2): building-footprint source tier (CAD-authoritative / county GIS / ML-fallback) and easement layer presence, per the T3 tier doctrine.
8. RISK CLASS + COST: which known defect classes the jurisdiction is likely to hit (crosswalk, no-REST, cased fields, MultiPolygon, eCode360, no-StratMap), and a cost estimate per the calibrated model (engine #250 constants), rolled up per wave.

## Deliverables

1. MACHINE-READABLE ROSTER: `_catalog/texas_roster_v1.json` (+ CSV mirror) — one record per county (254) and per incorporated city, schema designed registry-row-adjacent so factory lanes can consume rows directly. Verified fields marked with probe-evidence pointers; unverified marked honestly.
2. SOURCE REGISTRY EXPANSION: OPS-1_texas_source_registry.md grown from the current onboarded set toward statewide, with per-source probe artifacts in _inbox.
3. INGEST WAVE PLAN: prioritized waves (by metro/population/parcel count/data-readiness), each wave sized with parcel counts, cost estimates, expected defect classes, and explicit blockers; Harris County treated as its own planning object (~1.5M parcels, sharding-required).
4. GAP LEDGER: every jurisdiction with NO viable source for a rail, listed honestly with what was probed — these are named engineering/acquisition problems, not silent absences.
5. VENDOR PATTERN LIBRARY: field-shape templates per CAD vendor so future registry-row authoring is fill-in-the-blank.

## Method requirements

ADVERSARIAL REVIEW IS MANDATORY: every county's recommended source is INDEPENDENTLY re-probed by a second executor before it enters the roster as verified (the Hays lesson: the first recon concluded "no service exists" and was wrong; the EXTERNAL_hcad_parcels lesson: name-plausible layers can be drawing-entity garbage). Findings the reviewer cannot reproduce are downgraded to unverified with both probe logs kept. Batch the state: fan executors by region/county-batch, rate-limit ~2 req/s per source host, checkpoint the roster incrementally (the artifact must survive session death). Factory awareness is the point: read the runbook + backlog first so probes test for the EXACT failure modes the factory has already hit (layer-index misidentification, field casing, prop_id zero/dup, MultiPolygon, maxRecordCount pagination, vintage drift).

## Acceptance (master planner verifies live, by sampling)

Roster covers 254/254 counties and the full incorporated-city list with zero silent blanks (every field either verified-with-evidence, unverified-flagged, or honestly-absent); master planner spot-re-probes a random sample of verified sources and every one reproduces; wave plan sums to statewide parcel coverage with costs; gap ledger complete; vendor library usable; all artifacts committed (UTF-8) and OPS-1 updated.
