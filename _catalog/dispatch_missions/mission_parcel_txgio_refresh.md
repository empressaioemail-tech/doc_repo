# Mission — TXGIO-REFRESH: bring the parcel fabric to current vintage, all six counties

Two closes feed this card: B3-GEOMGAP (Bastrop geometry is March 2025 vintage vs a
January 2026 roll; ~938 real new parcels missing from containment, three subdivisions
named as evidence) and CALDWELL-GEOM (read its close FIRST — its mechanism for the
zero-geom county determines whether this card fixes Caldwell too or Caldwell needs its
own path).

1. MEASURE the vintage gap program-wide before refreshing: per county, the txgio load
   vintage vs the CAD roll vintage, and an estimate of the parcel-count delta. B3 only
   proved Bastrop; do the cross-county comparison it deliberately skipped.
2. Re-acquire the current TxGIO statewide fabric for the six counties through the
   EXISTING acquisition pipeline (this is re-ingest of a fresher public source we
   already have machinery for — never a new pipeline).
3. Re-run containment (landing_parcel_jurisdiction) for the six counties, then re-run
   the record fill + the ingest jobs (all idempotent) so new parcels instantiate at 65
   rails and get their CAD/jurisdiction/flood cells. Cloud Run only, run rows, chunked.
4. Verify: per county, new landing count vs old, the B3-named subdivisions now
   contained, record count = new containment exactly, no cell regressions on
   pre-existing parcels (spot-check N parcels byte-stable), and the retired-parcel
   question answered explicitly (parcels in old landing but not new: count, list,
   disposition — do NOT delete records without an operator ruling; report the class).

The containment totals are load-bearing program-wide (981,405 appears in many closes) —
your close must state the NEW totals prominently so downstream readers stop quoting the
stale number. Close: _inbox/2026-09-02_parcel-txgio-refresh_close.json.
