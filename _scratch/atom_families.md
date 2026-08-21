# atom_families workstream scratch — 2026-08-08/09

## GROUND-TRUTH
- Live county-ledger (2026-08-09 ~02:00Z): totalRails=12, totalCells=3048, satisfiedCells=1, texasCompletenessPct≈0.0395. displayState: no-atom=1524, no-writer=1016, not-yet=489, satisfied-present=19.
- no-atom rails (254 each): cad, flood, landuse, mud, owner, rrc.
- no-writer rails (254 each): easement, footprint, geometry, roads.
- cad_property LIVE SELECT via CORTEX_DATABASE_URL (hauska-prod-497015): **n=4,599,477 rows, 15 counties**. Operator brief "~1.07M" and OPS-1/ten-rail "15 rows" are BOTH stale. Top: 48029 703258, 48113 693556, 48439 689838, 48453 492848, … 48021 77073, 48055 48382. Comal 48091 has 103207 rows with **0** property_use_code.
- tx_fema_nfhl_flood_zone: `to_regclass` **NULL** — ldt #398 MERGED (code+migration file) but migration NOT applied; zero bulk NFHL rows in store. Source zip still real (PR probe: 198,240 S_FLD_HAZ_AR features). Flood family still BUILD (operator call) on live ArcGIS adapter + ready ingest CLI.
- Contract published baseline: @empressaio/atom-contract@1.13.0 (parcel-node). Engine PROPERTY_ENTITY_TYPES length 7 post-#282. Engine #285 merged C1/C3 FATAL closes.

## LESSON
- "Data is landing" after a MERGE of ingest code ≠ table rows. Always `to_regclass` + COUNT before asserting arrival.
- CAD counts in this chain have swung 15 → 1.07M → 4.6M without live re-probe; treat any figure without a timestamped SELECT as invalid.

## OPEN
- Contract worker shipping 1.14.0 (flood-hazard-fact, cad-parcel-roll, land-use-fact).
- Engine registration PR must follow publish (pin ^1.14.0, PROPERTY_ENTITY_TYPES += 3 → length 10).
- Specify-only (no merge): parcel-owner-facet (public-paid), special-district-membership, pipeline-segment + RRC well link writes, soil-survey-fact.
- Following lane: atom writers + countyRailDimension refresh (atomFamilyState) + nfhl migration apply + nfhl-ingest run.
