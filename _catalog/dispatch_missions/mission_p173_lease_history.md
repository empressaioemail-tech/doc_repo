## Mission — P-173 LEASE HISTORY: a writer's lease survives its release

You are the deepest worker in OPS-23 wave 3. You do not spawn sub-agents. The dispatch
planner supervises you, reviews your design at CP1 and your first pilot at CP2.

Exit-bounded verification: every command you run must terminate on its own; wrap anything
that could hang in `timeout`; never leave a watch, a tail or a dev server running.

### Where you work

`empressaioemail-tech/hauska-engine`, worktree `P:/seat-worktrees/property/hauska-engine-p173-lease-history`,
branch `feat/p173-atoms-writer-lease-history`, from `origin/main`. Declare the start commit
before you write anything. `P:/hauska-engine` is someone else's checkout.

### The finding you are closing

`_inbox/2026-09-12_p171-provenance_close.json` (contradicted; leave_behind LOGGING GAP #1):
`atoms_writer_lease_v2` and `atoms_bulk_writer_lease` are delete-on-release live mutexes
(`releaseScopedLease` in `packages/storage/src/atoms-writer-lease.ts` issues a hard DELETE;
the primary key `(scope_type, scope_id)` makes the table a mutex, not a log). Live read
2026-09-12: 0 rows in both. An unattributed production write of 1,031,394 atoms could not be
traced to its lease after the fact. OPS-16 P-173 (A-133).

### The change

1. **An append-only history.** A table `atoms_writer_lease_history` with `scope_type`,
   `scope_id`, `holder_token`, `holder_label`, `run_id`, `taken_at`, `released_at`,
   `released_by`, and `release_reason` (normal, expired, killed), INSERT-only by construction
   (a trigger or a role grant that refuses UPDATE and DELETE; say which and prove it by
   violation). `takeScopedLease` inserts the row when the lease is taken; `releaseScopedLease`
   updates only `released_at`, `released_by` and `release_reason` on that row through the one
   permitted path, or inserts a release row if you choose a two-row design; the mutex tables
   keep working exactly as today.
2. **The audit reads it.** `scripts/audit/p171-footprint-write-provenance.sh` (on the
   P-171 branch; merge or copy its query set as the audit reference) gains a query by
   `run_id` and by scope-and-window against the history table, and its README says that a
   write before this table's creation has no history row by construction.
3. **Migration through the deploy path.** The migration runs on staging, then production,
   through the engine's own migration path (never applied by hand from a laptop; the
   2026-09-06 unmerged-migrations-against-prod pattern is the incident this program remembers).
   Every writer that takes a lease (the five in `atoms-writer-allowlist.mjs`) gets the row
   without changing its own code, because the lease functions write it.
4. **Non-vacuity.** Tests: a take followed by a release leaves exactly one history row with
   both timestamps; a take followed by an expiry leaves a row marked expired; a DELETE against
   the history table is refused; a run id round-trips through the audit query.

### Verification, and the falsifier you pre-register

Write down at CP1: *if a staging run of `hauska-engine-atoms-writer` (a dry county, or the
smallest real county) leaves no `atoms_writer_lease_history` row that survives the release,
or the audit script cannot return it by run id, the row is not done.*

The planner runs `node scripts/surface-probe.mjs --rows P-173 --observations <file>`; the
P-173 predicate is observed: `leaseHistoryRowSurvivesRelease` (true only with the run id and
the row pasted), `auditReturnsByRunId` (true only with the query output pasted), each with
`observedBy` and `observedAt`.

### Close

`_inbox/<date>_p173-lease-history_close.json` per AGENT_CONTRACT §6 plus the OPS-23 four
fields. `leave_behind`: the migration id on staging and production, the role or trigger that
refuses deletes, and any writer that takes a lease outside the two functions (there should be
none; say you looked).
