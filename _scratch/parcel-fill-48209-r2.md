# parcel-fill-48209-r2 scratch

GROUND-TRUTH 2026-09-01T19:19:19Z: factory-parcel-record-fill-bddw7 succeeded 4m32.44s. Args parcel-record-fill --county=48209 --apply --twice. Close line landing=116420 pages=583 records=116420 cells=7567300 drift=zero-drift. Run 2b35c514-89bb-4da6-9db5-e9bd84625647 status=succeeded.

GROUND-TRUTH 2026-09-01T19:21:32Z: Factory parcel_record 48209 is 116420 rows at 65 cells. NA 18 rails x 61585. naOnInCity 0. improvement $0 22547. living>0 53218. leftover-not-65 0. absent-verified 0.

GROUND-TRUTH 2026-09-01T19:14:19Z: landing 54835+61585=116420. CAD latest $0 ∩ landing = 22547. living>0 ∩ landing = 53218. Leftover before fill: 60 rows at 52 cells, all in landing (upserted).

LESSON: CAD headlines must be intersected with landing. Hays $0 36657 → 22547. living 93924 → 53218. Bastrop intersections being zero is not general.

LESSON: Leftover 52-rail rows in landing upsert to 65. Leftover rows not in landing stay orphans. Split by cell count.

DEAD-END: Laptop county --apply. Job refuses unless FACTORY_CLOUD=1.

OPEN: Do not rebuild the job or the store token.
