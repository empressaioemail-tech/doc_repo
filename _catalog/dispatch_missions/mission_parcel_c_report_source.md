# Mission — C-REPORT-SOURCE: the reports read the record

Decision `_decisions/2026-09-02_step7_consumer_c_then_b.md` (read it first). The two
GTM-LIVE report generators — X-ray and Flood and Drainage, and ONLY those two
(Feasibility/Comparison are not pitched as live and are out of scope) — read
parcel_record directly as their data source. This is the record's first consumer.

1. Find the two generators' actual source composition (LDT api-server / cortex
   reporting path — locate by reading, not assuming) and add a parcel-record source
   adapter: per-parcel reads of the 65 cells + companion rows (a report reads ONE
   parcel — never a county materialization; the cell-ledger close's 101.5s/county
   figure is why).
2. Credentials: FACTORY_DATABASE_URL via Secret Manager, never disk; use a read-only
   role if one exists, else SELECT-only usage — this consumer must be structurally
   unable to write the record.
3. Cell states render in the honest-absence vocabulary the surface already uses:
   value with provenance and vintage; absent-verified with its basis; unaccounted as
   not-verified; not-applicable with its reason. NEVER a bare blank, NEVER a
   fabricated value, and pipeline words never reach the wire
   (_decisions/2026-09-01_serve_path_never_emits_pipeline_state.md governs).
4. Flood in the report carries the record's reconciled zone + floodway flag with the
   point-on-surface provenance; BFE renders only where a real value exists.
5. Verify customer-done: generate both reports live for gold 48021:34137 plus one
   Williamson and one McLennan parcel (the absent-verified showcase) and paste what
   the wire returned. Existing serve paths untouched — zero regression surface.

Close: _inbox/2026-09-02_parcel-c-report_close.json.
