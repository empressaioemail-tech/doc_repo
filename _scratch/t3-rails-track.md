# T3 rails track scratch (2026-08-05)

## GROUND-TRUTH (planner-verified 2026-08-05)

- BCAD FeatureServer layers 0-8: Parcels through Texas Counties — **no building footprint layer** (curl verified)
- BCAD parcel count: 65,285 (layer 0)
- City of Bastrop Easements FeatureServer/43: **148** polygons (curl verified)
- McLennan Easement Text layer 10: **16,578** features (curl verified)
- 0/11 onboarded counties have CAD footprint REST; all route ML fallback
- ADR-029 ACCEPTED; contract 1.12.0 on branch feat/adr-029-site-layer-atoms (216 tests pass planner re-run)
- ingest-site-layers dry-run CLI on engine branch; --apply fail-closed T3_SLOT_RELEASED=1
- PE footprint/easement overlays: 13 tests pass; gray footprint vs amber envelope

## LESSON

Operator-visible "footprints" on BCAD eSearch = EagleView ortho imagery + CAMA sqft tables, not queryable vectors. Probe REST before assuming CAD-authoritative tier.

## OPEN

- Merge PRs + npm publish @empressaio/atom-contract@1.12.0
- Implement ingest --apply body + BFF facet assembly (ldt)
- Slot 1/48021 GRANTED but NOT RELEASED — wait for master after T1 WS1
- Full-county dry-run with live BCAD (not fixture fallback)
- bastropcad.org bulk export recon for sketch shapefiles
- Deploy + live cert Jones/Higgins after slot release

## DEAD-END

- USA Structures USGS MapServer for footprints — points only, wrong geometry type
- County PipelinePlus / RRC / CCN as utility-easement atom sources — utility-adjacent, not parcel easement rail
