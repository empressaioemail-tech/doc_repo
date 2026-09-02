# Mission — VALUE-HISTORY: prior tax years onto the companion, from data we already hold

The valueHistory rail was headed for the acquisition list until the planner caught that
`cad_property` holds MULTIPLE tax years per parcel (the fills used DISTINCT ON latest).
This is an ingest, not an acquisition — acquiring it would be the exact class of mistake
the ruling names as most expensive.

Extend the fill job (own branch, disjoint module, re-green against current base) with a
value-history entrypoint: for each landing-matched parcel, write one companion row per
tax_year present in `cad_property`, carrying that year's dollar set (market, assessed,
land, improvement), source cad_property, vintage = the tax year; the valueHistory cell
moves to value with rowCount. Current-value scalar rails are NOT touched — the decision
rule is scalar = current only, history = companion, bake selects by explicit vintage.
Williamson uses the R1B crosswalk (image >= sha256:c5289627...) so history lands on the
value-bearing account. Idempotent, chunked, Cloud Run only, run rows.

Verify per county: companion row count equals an independent SQL of landing-joined
(prop_id, tax_year) pairs; distinct years per county reported; zero rows for parcels
outside landing. Close: `_inbox/2026-09-02_parcel-value-history_close.json`.
