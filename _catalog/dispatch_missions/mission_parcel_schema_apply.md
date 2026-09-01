# Mission — apply the parcel-record schema to the Factory store

## Why

Operator ruling `_decisions/2026-09-01_parcel_record_is_the_gate_to_everything.md`: every
parcel in six counties carries a full record before anything else moves. The schema is
merged on `hauska-engine` main at `bfa9642`
(`packages/engine-core/src/parcel-record/schema.sql`) and has never been applied to any
store. Verified live 2026-09-01T17:20Z: the Factory store (`FACTORY_DATABASE_URL`,
project `withered-surf-26870298`) `pg_tables` holds no `parcel_record%` table. The 52
rails, cell-state types, companion tables and publish gate are code with no table under
them. This card puts the table under them. That ruling is the operator go for this card;
no further authorization gate applies.

## Deliverables

1. `migrations/0007_parcel_record.sql` in `hauska-factory`: a VERBATIM copy of
   `packages/engine-core/src/parcel-record/schema.sql` at engine main `bfa9642`, with a
   provenance comment header naming the source repo, path and SHA. Do not edit the DDL.
   If another migration has already taken 0007, take the next free number; never renumber
   an existing migration.
2. A drift guard: a check that FAILS when the migration text and the engine `schema.sql`
   at the image-pinned engine SHA diverge. The Factory image build already pins an engine
   SHA, so a build-time or CI comparison is reachable. If it is genuinely not reachable in
   this card, name it in `leave_behind` with an owner — do not skip it silently.
3. Branch `feat/parcel-record-schema` from `origin/main`, PR, merge on green CI
   (conclusion STRING, re-greened against the current base). Commit and push YOUR OWN
   branch before closing; the planner cannot commit for you (SEAT-01).
4. Apply through the sanctioned migrate path. Read `src/db/migrate.mjs` and
   `90_runbooks/factory_cloud_job_execute.md` first. NEVER apply from a laptop; the run
   leaves a run row and a termination record per BP-FACTORY-01.
5. Verify by violation, live, after apply:
   - INSERT a `parcel_record_cell` with `cell_state->>'kind' = 'bogus'` → constraint must
     refuse.
   - INSERT a `parcel_record` row whose `place_key` does not equal
     `county_fips || ':' || prop_id` → constraint must refuse.
   - Then show zero residue from the violation tests (they are events indistinguishable
     from real ones; note and exclude them explicitly).
   - Enumerate the three tables and their indexes from `pg_catalog` and paste the verbatim
     output with your snapshot (store, database, commit, timestamp).

## Landmines

- Never echo a secret; pipe it to the consumer. Prove access with `wc -c`.
- The Tuesday 05:00-06:00 UTC Neon maintenance window is refused by queue arithmetic;
  do not start the apply inside it.
- The schema is `IF NOT EXISTS` throughout — keep it idempotent; a re-run must be a no-op.
- Do not rebuild the store token. Do not add locking. Counties do not conflict.

## Close

`_inbox/2026-09-01_parcel-schema-apply_close.json` with the mandatory
`whatContradictedTheCard` field, `leave_behind`, and the FLEET MEMORY scratch block.
