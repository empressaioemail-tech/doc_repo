# Mission — FLOOD-FRAGMENTS: the multi-fragment undercount, fixed where it lives

R4's close measured it: ~15% of Bastrop parcels span multiple txgio_parcel tile
fragments, and the single-fragment-pick pattern (DISTINCT ON prop_id) undercounts
spatial matches ~1%. R4 fixed it for wells/districts by unioning all fragments per
prop_id; flood-ingest.mjs shares the exposure unfixed.

1. Apply the fragment-union pattern to flood-ingest.mjs (factory PR, own branch, tests
   incl. a multi-fragment fixture whose falsifier is the single-fragment answer).
2. Re-run flood ingest for the five geometry-covered counties (idempotent, Cloud Run,
   run rows). Report the delta per county: newly matched parcels, changed zones,
   swept->matched transitions. Expect ~1% magnitude; a much larger delta is a finding.
3. MEASURE (read-only, fix nothing): does p2-juris-store.mjs's same pattern affect
   containment dispositions? A multi-fragment parcel straddling a city boundary could
   be misclassified in-city/unincorporated, which would ripple into the NA stamps.
   Count the exposed class per county and report; a containment fix is its own card.

Close: _inbox/2026-09-02_parcel-flood-fragments_close.json with the deltas verbatim.
