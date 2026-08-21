# P2-3 RRC staging tables — scratch

## GROUND-TRUTH (2026-08-11T21:05Z)
- tx_rrc_well: 1,396,049 rows (exact match live RRC layer 1 count)
- tx_rrc_pipeline: 491,178 rows (843 skipped = invalid county/geometry, not paging)
- Four-corner on TABLE: Permian 507, Panhandle 10, East TX 184, South TX 212 — all non-zero
- county_fips assigned: 499,924 / 1,396,049 via tx_county_bbox
- defaultProducingSymnum: 0
- PR #311 CI: success

## LESSON
- Row-by-row INSERT of 492K pipeline segments (~2.5KB geom each) = ~10 min/page; multi-row INSERT per 1000-feature page completes full ingest in ~16 min pipelines + ~35 min wells.
- County join via JOIN txgio_parcel on 5000-well batches hung indefinitely; materialized tx_county_bbox (245 rows) + batched UPDATE finished in ~4 min but only covers ~36% of wells.

## OPEN
- 896K wells without county_fips — Phase 3 writer should query tx_rrc_well by lng/lat bbox, not rely on county_fips partition alone.
- County join accuracy: tx_county_bbox min/max from parcels is NOT full point-in-county; PIP against parcels or Census county boundaries needed for higher coverage.
