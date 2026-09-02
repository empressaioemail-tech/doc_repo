# Mission — RO-ROLE: a SELECT-only role for record readers

B-READER's leave_behind, adopted: both production consumers of parcel_record (the
C-report reader and the B-reader) claim structurally-read-only with mechanisms weaker
than a database role. Create a SELECT-only role on the Factory Neon store scoped to
parcel_record, parcel_record_cell, parcel_record_companion_row (and the verdict table
once B-GATE-SCHED lands its migration); mint FACTORY_DATABASE_URL_RO in Secret Manager;
swap BOTH readers' secret binding to it (two small PRs or one per repo-half, green CI,
canary + digest discipline for the cortex deploy). Verify by violation: an INSERT/UPDATE
through the RO connection must FAIL at the database, not at a code check — paste the
refusal verbatim. Neon role creation is a store change: do it through a migration or the
documented admin path, never ad hoc, and record the invocation.
Close: _inbox/2026-09-02_parcel-ro-role_close.json.
