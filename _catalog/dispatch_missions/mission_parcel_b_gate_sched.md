# Mission — B-GATE-SCHED: the publish gate goes live

Decision `_decisions/2026-09-02_step7_consumer_c_then_b.md`; review finding #3 (the
gate is dormant) is the defect this card kills. The cell-ledger close built and
live-verified the DB loader — consume it, do not rebuild it.

1. Engine half: a CLI entrypoint (the decision's default wiring) that evaluates
   evaluatePublishGate per county RAIL-SCOPED, streaming/batched per rail — the
   cell-ledger close measured 101.5s to materialize the SMALLEST county whole; a
   full-county single-shot on Travis (~25min) is a named dead-end.
2. Factory half: a scheduled Cloud Run job (the existing harness; run rows;
   termination records) that shells out to the CLI per county post-write-wave, writes
   per-(county, rail) verdicts to a verdict store the B-READER allowlist consumes,
   and ALWAYS publishes the excludedDeclaredAhead list with every evaluation — the
   exclusion set is part of the instrument's contract.
3. Verify by violation: a county-rail with unaccounted cells on a live rail must
   produce REFUSE and the allowlist must stay legacy; a passing rail flips only on a
   real verdict; kill the scheduler and confirm the allowlist FAILS CLOSED to legacy.
4. Coordinate the verdict-store shape with PARCEL-B-READER via closes; if the two
   cards disagree on the contract, stop and report rather than shipping two shapes.

Close: _inbox/2026-09-02_parcel-b-gate-sched_close.json.
