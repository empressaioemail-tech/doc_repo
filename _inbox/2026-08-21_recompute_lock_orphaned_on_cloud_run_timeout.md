---
id: 2026-08-21_recompute_lock_orphaned_on_cloud_run_timeout
title: The county-ledger recompute cannot finish inside Cloud Run's timeout, and failing leaves the cluster lock held
status: active
last_updated: 2026-08-21
applies_to: legacy-design-tools, cortex-api
owner: nick
related: [90_operations/OPS-18_canon_reconciliation_plan_of_record, _decisions/2026-08-11_texas_flush_launch_gate_amendment]
---

# POST /api/county-ledger/recompute is unusable on Cloud Run, and one failure blocks the fleet

Found 2026-08-21 by the planner while trying to satisfy R-09's open item.

## Evidence, from cortex-api request logs, project legacy-design-tools-prod

    12:37:21   401                            unauthenticated probe
    12:38:04   401                            unauthenticated probe
    12:39:05   504   latency 300.000552909s   authenticated POST, cut by Cloud Run
    12:41:32   409   recompute_in_progress
    12:44:20   409   recompute_in_progress

Cloud Run `timeoutSeconds` on cortex-api is **300**. The route declares
`RECOMPUTE_STATEMENT_TIMEOUT_MS = 240_000`.

## What happened

The authenticated POST acquired `COUNTY_LEDGER_RECOMPUTE_LOCK`, ran for the full 300 seconds,
and was terminated at the edge with a 504. The Postgres advisory lock was never released.
Every recompute attempt since returns 409, for every caller, not only this one.

## Second mechanism, and why it was rejected

The lock could have been held by an unrelated run before the planner arrived. Rejected: the
12:39:05 request ran 300 seconds rather than returning 409 immediately, which means it
ACQUIRED the lock. Every request after it 409s. A request that could not take the lock would
have failed fast, exactly as the two later ones did.

## Two defects, not one

**The route cannot complete on its own infrastructure.** The statement timeout is 240s and the
request ceiling is 300s, but the handler did not return after the statement timeout — it was
still open when Cloud Run cut it. Whatever the scan is doing, it does not fit in the request,
so an in-request recompute is the wrong shape. This is not a tuning problem to solve by raising
the timeout; a heavy full-grid scan belongs in a job, with the route returning an accepted
handle.

**Failure poisons the guard.** The advisory lock is correct in intent, "at most one heavy scan
at a time," and on an abnormal exit it holds forever. A control whose failure mode is to
permanently block the operation it guards is worse than the contention it prevents, because
contention is visible and self-clearing while this is neither. It needs a lease with an
expiry, or a release on connection teardown, or a documented break-glass release.

## Consequence for the launch gate

R-09's open item was "deploy plus POST recompute before a live GET reflects the repair." That
item **cannot be satisfied through this route as built**. The served ledger is still the
2026-08-14 snapshot: 3,556 cells, `hasWriter` true on all, `atomFamilyState` present on all,
`isPartial` false on all, response byte-identical at 2,121,656 bytes.

So the R-09 code is merged (`4a52dee1`) and deployed (revision `cortex-api-00524-pit`, 100
percent of traffic, confirmed), and **the repair remains unproven on the served surface.** The
merge and the deploy are real. The firing is not.

## What is needed, in order

1. Release the orphaned advisory lock. Store operation, operator-ruled, not taken unilaterally.
2. Establish why the scan exceeds 300s, by reading the query rather than by raising a timeout.
3. Move the recompute off the request path, or bound it so it fits, and give the lock an expiry.
4. Only then re-attempt the live GET and the cell id.

## Planner note

The planner caused the orphaned lock by issuing the POST, and it would have happened to any
caller: the route cannot finish inside its own request ceiling. The first attempt was also
abandoned client-side at a two-minute tool limit, which is separately worth noting as a reason
never to fire a heavy scan from a foreground call.

leave_behind:
  - item: orphaned COUNTY_LEDGER_RECOMPUTE_LOCK blocking all recomputes fleet-wide
    owner: operator then property
    plan_row: R-09
  - item: recompute route cannot complete within Cloud Run timeoutSeconds=300
    owner: property
    plan_row: R-09

---

## AMENDMENT 2026-08-21 — the mechanism above is wrong in two ways, corrected here

**The lock is NOT held forever.** The body says the advisory lock "was never released" and
that recomputes are blocked fleet-wide. A later probe found `pg_locks WHERE
locktype='advisory'` returning **zero rows** on `neondb`, and a subsequent POST no longer
returned 409 — it acquired the lock and began scanning. The lock is released when the pooled
connection is reaped. The window is minutes, not forever. "Orphaned permanently" was an
overstatement built on two 409s taken minutes apart.

**And the real defect is better than the one filed.** `SET LOCAL statement_timeout = 240000`
bounds **one statement**, not a transaction. The recompute runs MANY: `computeCountyLedgerPayload`
executes a capability probe per rail, each inside its own SAVEPOINT, plus the snapshot read
and write. A transaction of N statements each individually under 240s runs unbounded past
Cloud Run's 300s ceiling.

The route's own comment states the intended reasoning: the database is "given less than
that and fails LOUDLY inside the request rather than the client seeing a 504." That reasoning
is sound and its premise is false. It holds only if the work is a single statement. It is not,
and the 504 at exactly 300.000552909s is the proof.

So this is not a slow query to tune. It is a guard that cannot bound what it was written to
bound. Raising `statement_timeout` would not help; lowering it would not either. The fix is a
transaction-level or request-level deadline, or moving the scan off the request path.

## A planner error, recorded

While probing the lock the planner sent `{"dryRun":true}` in the request BODY. `dryRun` is read
by `firstQueryValue(req, "dryRun")` — a QUERY parameter. The body was ignored and a full real
recompute was started unintentionally. Read the parameter source before assuming a flag is
honoured; a silently-ignored flag turns a probe into a write.

## What still stands from the body above

The served ledger is unchanged, the R-09 repair remains unproven on the served surface, and
the recompute cannot complete through this route as built. Those are unaffected by the
correction. Only the mechanism and the permanence were wrong.
