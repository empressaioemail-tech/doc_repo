# Mission — R1B: apply the crosswalk, re-run CAD ingest

Gated on PARCEL-R1-CROSSWALK. Implement the proven crosswalk in the fill job's CAD
ingest (factory PR, CI green, image rebuild digest-pinned, ENGINE_SHA unchanged unless
R1 requires an engine change — then engine PR first). Re-run `parcel-record-fill` CAD
ingest for 48491 (and 48021 only if R1's design says any landing parcel gains cells).
Idempotent; Cloud Run only; run rows. Verify absolute: Williamson improvement/living
value-cell counts equal R1's predicted match counts, residue stays honestly unaccounted,
zero fabricated joins (spot-check 20 crosswalked parcels situs-vs-geometry). Never a
laptop apply. Close with before/after cell-state counts per rail.
