## Mission — P-365: the P-263 apply holds its write lease for as long as it writes

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-engine` only and open one PR, branched
from current `origin/main` with the SHA declared (`cff8d882` at compile). You do not merge, deploy,
apply or write any store; the integration seat does all four. Any doc_repo change is handed back as a
diff in your close.

Read `_inbox/2026-09-18_p263_apply_RECORD.md` first. It is the measurement this row rests on: five of
the six counties were applied through `hauska-engine-p263-apply` on 2026-09-18, and Williamson was held
for this row by the operator (A-225).

### What is wrong (read at source, engine `c41a1482`; measured 2026-09-18)

`packages/engine-core/scripts/p263-envelope-outcome-apply.mts`:

- `applyCountyMovement` calls `takeScopedLease` ONCE (line 490) for `(write, buildable-envelope,
  <fips>)` and releases it once (line 610). It never renews it and never checks it again. The TTL is
  `DEFAULT_LEASE_TTL_MS`, 15 minutes (`packages/storage/src/atoms-writer-lease.ts`).
- Measured on the five applies: 7.8 to 8.4 ms per atom (journal `applied_at`, first to last). Hays
  held its lease 458 s. Williamson's 239,491 moves would take about 32 minutes, so the second half of
  that county would write after its lease expired. The file's own claim, "a write without a held lease
  fails closed", is true only for the first batch.
- `reverseMovementRun` takes no lease at all. A reversal UPDATEs `atoms` with no scope held.
- `lockAndHeartbeatLease` already exists in storage: it selects the row by holder token with
  `expires > now` `FOR UPDATE`, throws `LeaseExpiredError` when the row is gone or expired, and extends
  `expires`. Nothing on this path calls it.

### What to build

1. **Every batch holds the lease.** Inside each batch transaction, before the journal insert, assert
   and extend the lease through `lockAndHeartbeatLease` on the same connection or transaction the batch
   writes with. A lease that is no longer held by this token (expired, stolen, deleted) refuses the
   batch, writes nothing for it, and stops the run with a named refusal. The batches already written
   stay journalled and reversible, and the artifact says how many were written before the refusal.
2. **The reversal holds a lease too.** `reverseMovementRun` takes the same `(write,
   buildable-envelope, <fips>)` scope for the county it reverses, heartbeats it per batch the same way,
   and releases it. A reversal without `--county` must either refuse or take one scope per county the
   journal run names; say which you chose and why.
3. **The artifact records the lease.** The apply and reverse artifacts carry the lease's run id,
   holder label, the number of heartbeats and the last expiry, so a record can show the lease was held
   end to end.

### Verify by violation

Pre-register your falsifiers. In the fixture-store suite: a run whose lease is expired between two
batches refuses the second batch and writes nothing for it; a run whose lease is stolen by another
holder between batches refuses the same way; a long run whose batches outlast the TTL completes with
the lease renewed (drive the clock, do not sleep); a reversal fails closed without a lease and
succeeds with one. Show each refusal case passing on the pre-change code where it should not, meaning
the old code writes the second batch without a lease.

### The three-question gate

Answer in your close: what executes the renewal, what triggers it (every batch), what fails when the
lease is lost mid-run, and what bypasses it (a raw UPDATE, a caller of the exported core that passes its
own lease, a reversal run by hand SQL).

### Constraints

- No store writes, no deploys, no merges, no applies. The seat rebuilds the apply image, takes a fresh
  Williamson dry run and applies it capped at its measured share (ruling 11).
- Do not change the census, the classifier, the cap, the digest or the journal shape. Williamson's
  fresh dry run must reproduce `e53c197f…67f` if the store has not moved.
- The journal trigger in migration 018 is unchanged.

### Close

Declare: the start commit and PR, where the heartbeat sits and why that transaction, the reversal's
lease rule, the falsifiers with both directions shown, the three-question gate answers, and
`leave_behind`.
