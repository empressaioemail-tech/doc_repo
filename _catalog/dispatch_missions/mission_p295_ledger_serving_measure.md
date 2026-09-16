## Mission — P-295, phase 1 only: measure what a ledger-served surface would have to read

You launch no sub-agents (FAN-DEPTH 0). This lane MEASURES and PROPOSES. It writes no store,
builds no reader, and deploys nothing. The design review happens on your output before anyone
builds (A-190: "measure the atoms question first").

### Where you work

`hauska-engine`, fresh clone from `origin/main` under `P:/tmp/` into a NEW directory, branch
`measure/p295-ledger-serving`. Declare the start commit (engine main was `d88cf65` at compile).
Register it under the property seat and remove the entry at close. Your instrument lives in this
repo, beside the reader that will one day use it (`services/retrieval-api/`), and ships as a PR
that adds the instrument and its self-tests only. The P-293 remainder lane may be open in
`services/retrieval-api/src/parcel-record-db.ts`; you do not touch that file.

### Why this is first

P-230 found that nothing re-runs the bake, so a correct ledger write never reaches a customer.
A-190 ruled both fixes: P-294 (republish on change, the stopgap) and P-295 (the surfaces read the
ledger). The 2026-09-11 ruling (`_decisions/2026-09-11_ledger_as_serving_path_seven_steps.md`)
says a cell is ACCOUNTING (state, atom reference, provenance, cached rendering keyed to atom and
vocabulary version), never a copied value, and that one reader in retrieval-api dereferences
atoms. The integration seat read one parcel on 2026-09-16 (factory store, read-only):
`48209:100226` holds `maxHeightFt`, `maxLotCoveragePct` and `setbackFrontFt` as `kind: "value"`
cells with the number copied in and no atom reference. P-230's attempt to check whether matching
atoms exist timed out after about 120 s on a per-parcel `entity_id` lookup.

### What to measure (each answer names its SHA, store, snapshot time and SQL)

1. **Cell shape, per rail.** For every one of the 65 rails, across the six counties: how many
   `value` cells carry an atom reference of any kind, how many carry only a copied value, and
   which writer wrote them (the `source` field). The factory store is
   `FACTORY_DATABASE_URL_RO`; use the primary key `(place_key, rail_key)` and the `rail_key`
   index with county `place_key` ranges, never a bare scan.
2. **Atoms for the ledger-written rails.** For the setback and envelope rails (and any other rail
   whose cells come from a factory writer rather than an atom), do atoms exist in the atoms store
   (`hauska_mcp` database; the wrong database answers with a false absence) for those parcels and
   values? First enumerate the atoms table's indexes from the catalog, then choose an indexed
   access path, then sample at least 50 parcels per county stratified by city. Report hit rate
   with its denominator and the path used. If no indexed path exists, say so and stop; do not run
   an unindexed scan on a 190 GB table.
3. **What each surface reads today for those rails.** `get_smart_site`, the map facets and the
   PDF: file and line for where each gets `maxHeightFt` and the setbacks, and whether that source
   is the bake, the ledger, or a live call.
4. **The cost of a direct read.** Time the retrieval-api `/record` route for 20 parcels (it
   already walks the 65 rails), cold and warm, and report p50 and p95.

### What to propose (in the close, not in code)

Which rails can serve from `parcel_record_cell` through retrieval-api's reader now, which need
atoms minted first, how a cached rendering keys to the cell version, and the retirement order
for the bake on cut-over rails (repoint consumers first, then retire, with a divergence test in
the overlap). Name every place the proposal conflicts with the 2026-09-11 ruling and say which
you recommend the operator rule on.

### Falsifiers, pre-register your answers first

1. Your instrument, run against a fixture where a cell carries an atom reference and one where it
   does not, reports each correctly (shown in both directions).
2. The atoms query plan (`EXPLAIN`, not `ANALYZE`) uses an index; paste it.
3. The `/record` timing covers at least three counties.

### Do not

- Write any store, mint any atom, or change any reader or writer.
- Run a heavy scan without a `statement_timeout` and without `default_transaction_read_only=on`.
- Deploy, or launch sub-agents.

### Close

Snapshot; the four measurements with SQL, plans and times; the proposal; the PR (instrument and
self-tests only) with every CI check's literal conclusion string. `status`: `closed-partial`
(phase 1 of 2). `probe`: `{"notApplicable": "read-only measurement lane; the build phase is
graded by the P-230 predicate"}`. `subAgents`. `leave_behind`.
