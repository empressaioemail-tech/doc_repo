# Mission — REFRESH-APPLY: containment and fills on the fresh fabric

Gated on PARCEL-TXGIO-REACQ (fresh data landed) and PARCEL-B-SLATE1 (its Caldwell
gate-REFUSE capture must exist BEFORE the backfill changes Caldwell's truth). This is
steps 3-4 of the original refresh card, on the corrected acquisition.

1. Execute the Caldwell geom backfill per the spec already written in the
   caldwell-geom close CP2.
2. Re-run containment for the six counties on the fresh fabric (Cloud Run, run rows,
   chunked), then the idempotent record fills and ingests so new parcels instantiate
   at 65 rails and get their cells.
3. THE RETIRED-PARCEL REPORT: parcels in old landing but absent from new — count,
   list, disposition as a class for the operator; never delete records.
4. Verify: new containment totals per county stated PROMINENTLY (they supersede
   981,405 program-wide); the B3 subdivisions contained; Caldwell parcels now
   geom-covered and its previously-blocked rails (flood/wells/districts) filled by
   re-running their owning jobs; no cell regressions on pre-existing parcels
   (spot-check N byte-stable); gate verdicts re-evaluated where counts moved.

Close: _inbox/2026-09-03_parcel-refresh-apply_close.json.
