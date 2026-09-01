# Mission — fix the 57P01 kill: three code defects, one operator setting

## The root cause, measured and not to be re-derived

Factory jobs hold **two** clients. `FACTORY_DATABASE_URL` reaches the control store
(`ep-round-base-au0jofwp`, project `withered-surf-26870298`: runs, leases,
`run_events`). `PRODUCTION_NEONDB_URL` reaches the data store (`ep-lucky-truth`,
project `fancy-fire-06136146`: landing).

When one chunk runs long against the **data** store, the **control** client sits idle.
Neon's suspend timer counts **idle time, not connection presence**, so it suspends
~300s after that endpoint's last activity and SIGTERMs the idle backend. Postgres
emits `terminating connection due to administrator command` (57P01).

Confirmed on the operations log for `withered-surf-26870298`:

```
2026-08-31T22:30:42Z start_compute     ep-round-base-au0jofwp
2026-08-31T22:45:31Z suspend_compute   rrn5h died 22:45:31.5   (+300.3s from the 22:40 tick)
2026-09-01T00:10:32Z start_compute
2026-09-01T00:25:31Z suspend_compute   8qn9d died 00:25:31.4   (+299.8s from the 00:20 tick)
```

That endpoint normally cycles on the F-03 reaper's `*/10` tick. On both failure runs
it stayed up an unusual fifteen minutes because the job was connected, then suspended
anyway.

**Do not re-investigate.** It is not the image, not the data store, not the reaper,
not resource pressure, and not `dd7c2a94` versus `70e3f714`. The image separation was
a confound: no county ran chunks on both digests.

## Fix 1 — attach an error listener to both clients

Neither client has one. `connect.mjs:86-96` and `p2-juris-store.mjs:248-257` attach no
`error` handler, so an unhandled `'error'` event kills the process before the catch
block runs. That is why both runs were left `started` with no failed termination
written, and why the reaper had to mop them up.

Clients are `p2-juris.mjs:112` (factory) and `p2-juris.mjs:145` (neon), both owned by
`runP2Juris` and both ended in its `finally`.

**This is a defect on its own merits, independent of the suspend.** An unlistened pg
Client converts any recoverable disconnect into an uncaught exit that skips the job's
own error handling. Fix it even though fix 2 removes this particular trigger.

Route the error into the existing catch path so a **failed termination is written**
with the cause named. A job that dies without a termination record is the state the
control store exists to prevent.

## Fix 2 — heartbeat the lease on a timer, not on chunk start

The lease is renewed at chunk start only, so a chunk longer than the lease window
leaves the writer holding an expired lease mid-write. That is a live latent defect
independent of the suspend, and Williamson's chunk 2 exceeds ten minutes.

**Make the heartbeat a lease renewal on a ~60s interval timer, not a keepalive ping.**

That ordering matters. A `SELECT 1` keepalive would stop the suspend and leave the
lease expiring. A lease renewal does real work, renews the lease, **and** keeps the
control endpoint warm as a side effect. One mechanism, two defects, and the meaningful
one is primary.

The timer must be cleared in the same `finally` that ends the clients, or a failed run
leaves a live interval behind.

## Fix 3 — put `max_duration_s` into the run scope

`p2-juris` declares `MAX_DURATION_S=21600` but `scope` carries no `max_duration_s`, so
the reaper prices these runs at the 3600 default. Latent false-orphan risk. Not causal
here and cheap to close while you are in the file.

## Falsifiers, in this order

**F1, unit.** Simulate a client `'error'` event and assert the process does **not**
exit uncaught, and that a failed termination row is written naming the cause. Watch it
fail first: without the listener the test should kill the runner.

**F2, unit.** Assert the heartbeat fires on the timer, that it renews the lease rather
than pinging, and that the interval is cleared on both the success and failure paths.
Assert a simulated fifteen-minute chunk leaves the lease live.

**F3, integration, and only after F1 and F2 pass.** Run Williamson 48491. It is the
only county whose chunks are long enough to reproduce the original failure, so it is
both the fix and the test. F1 stated first: `unincorporated + in_city + unresolved ===
total`, `total === 282570`, `unresolved === 0`. F2: succeeded and unaided.

**If Williamson dies again at ~300s past a reaper tick, the fix did not work** and the
suspend is reaching the connection through some path the heartbeat does not cover.
Report that; do not attempt a fourth run.

## The operator setting, which is not yours

Setting `ep-round-base`'s `suspend_timeout` to 0 would also stop this, and it is a
one-line Neon change. **It is the operator's call and this card does not make it.**

Note for the record: the project-level `default_endpoint_settings` reports
`suspend_timeout_seconds: 0` on every project including this one, while
`ep-round-base` plainly suspends at 300s. A project default is not an endpoint
setting. Do not read one for the other.

Both are wanted. The setting stops the bleeding immediately; the heartbeat is the
correctness fix and survives a future endpoint whose timeout nobody remembered to set.

## Do not

- Do not re-investigate the root cause; it is measured.
- Do not change any Neon setting, endpoint, branch or project.
- Do not add a bare keepalive ping in place of a lease renewal.
- Do not run Williamson before F1 and F2 pass.
- Do not attempt a fourth run if F3 fails.
- Do not touch the data-store client's behaviour; it was never the problem.
- Do not touch any repository other than the registered Factory worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare
snapshot including image digest in the first output. State each falsifier before
running it and report both arms. If F3 runs, report the run id and whether the process
exited unaided. `leave_behind` named. Subagents do not commit.
