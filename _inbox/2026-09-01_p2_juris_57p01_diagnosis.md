---
id: 2026-09-01_p2_juris_57p01_diagnosis
title: factory-p2-juris Williamson deaths, 57P01 diagnosis. The factory CONTROL store suspends under an idle control client; the image delta is exonerated on connection handling
date: 2026-09-01
status: diagnosis delivered, read-only card, nothing executed or changed
card: read-and-diagnose (no third execute, no store write, no compute change, no rebuild)
snapshot:
  doc_repo: P:/doc_repo main eb7025302c1cdb31487b00b10aaa6c1efc9374b (planner seat, primary checkout)
  factory_base: 5f9acc3c53c04efa88f59715271f3d6a12f78e99 (= origin/main, fetched this session)
  image_delta_source: P:/tmp/hauska-factory-a6-totals uncommitted diff on 5f9acc3 (Cloud Build 741c5334 built sha256:70e3f714 from this tree; loadReplayFromLanding is committed on no ref, verified git log -S across --all)
  job_live: factory-p2-juris gen 6, image sha256:70e3f714, task-timeout 21600, max-retries 0, read by gcloud describe as JSON by field name
instruments:
  - git show/grep against 5f9acc3 and the a6 worktree diff (code reading)
  - gcloud run jobs describe / executions list / logging read (estate reads, exit-bounded)
  - gcloud secrets access piped through sed, HOSTNAME ONLY extracted, credentials never echoed
---

# The one-line answer

The connection that died was the FACTORY CONTROL client (runs, leases, run_events), not the landing writer. It sits on a DIFFERENT Neon endpoint from the landing store, that endpoint's compute suspended 300 seconds after the last activity on it, and suspend delivers SIGTERM to every backend, which Postgres surfaces as FATAL 57P01 `terminating connection due to administrator command`. The pg Client had no error listener, so the idle client's `error` event was unhandled and the container exited 1 mid-chunk. The image delta is innocent on connection handling; its only causal role is that the replay feed opened the gate that had previously stopped Williamson before it could reach a long chunk.

# The measured signature (this is the finding)

Two stores, two endpoints, verified from Secret Manager by hostname only:

| Secret | Endpoint | Holds |
|---|---|---|
| `FACTORY_DATABASE_URL` | `ep-round-base-au0jofwp.c-10.us-east-1.aws.neon.tech` | runs, leases, run_events (control) |
| `PRODUCTION_NEONDB_URL` | `ep-lucky-truth-apodo8hr.c-7.us-east-1.aws.neon.tech` | txgio_parcel, tx_city_boundary, landing (fancy-fire) |

The card's "NEON DID NOTHING" evidence is the fancy-fire operations log. It is true and it covers ONLY `ep-lucky-truth`. The factory control store lives on `ep-round-base`, a different project, whose operations log nobody has read. The platform ruling has a hole exactly one endpoint wide.

The F-03 reaper runs on Cloud Scheduler `*/10` (`factory-conformant-reap`, verified in `scripts/create-conformant-reaper-scheduler.mjs`, SCHEDULE `*/10 * * * *`) and every tick connects to the factory control store, works, and disconnects. Executions listed live:

```
factory-conformant-kkbqd  create 2026-08-31T22:40:04  done 22:40:31.221
factory-conformant-7rtlm  create 2026-09-01T00:20:04  done 00:20:31.514
```

Death lines read from Cloud Logging (FATAL 57P01, severity FATAL, routine `ProcessInterrupts`, postgres.c:3357, emitted as an unhandled `error` event on a pg Client):

```
rrn5h  error at 2026-08-31T22:45:31.508   = kkbqd close 22:40:31.221 + 300.3s
8qn9d  error at 2026-09-01T00:25:31.357   = 7rtlm close 00:20:31.514 + 299.8s
```

Both deaths land exactly 300 seconds, the Neon default suspend_timeout, after the last connection close on the factory control compute. The 8qn9d value was PRE-REGISTERED before the log read: predicted ~00:25:31 from the rrn5h delta, observed 00:25:31.357. During those five minutes the p2-juris process was deep inside Williamson chunk 2 on the OTHER endpoint (page 1 landed by 22:32:52 / 00:14:59; chunk 2 of a 282,570-parcel county runs longer than ten minutes), so the factory client's backend was completely idle, its last statements being the page-1 `writeChunkEvent` plus the chunk-2 `heartbeatLease`. An idle open connection does not hold a Neon compute awake; when it suspended, the backend got SIGTERM.

Why the reap tick is the metronome: the only regular traffic on `ep-round-base` is the reaper every ten minutes. Whenever a p2-juris chunk spans a tick-plus-five-minutes window with no factory-side write of its own, the compute goes quiet for 300s measured from the reap connection close, suspends, and kills the job's idle control backend.

Residual honestly stated: in rrn5h the factory client was already idle from 22:32:53, so a naive last-query-plus-300s model predicts a suspend near 22:37:53 that did not happen; the 22:40 tick then reset the clock and the observed suspend followed it by exactly 300s. Both observed suspends are exact to within half a second of last-activity-plus-300; the unobserved earlier one says Neon's idleness evaluator has coarser granularity than its timeout, which is Neon's internals and does not change the mechanism.

# Why "IT IS THE IMAGE" was a confound

The four-execution separation is real but image and county are perfectly confounded: no county ever ran chunks on both images. On dd7c2a94 Williamson could not reach a chunk at all (COUNTY_HELD fired first, hcx7x), so the only counties that ever chunked on dd7c2a94 were ones whose per-chunk wall time stays minutes short (McLennan averaged ~2 min/page for 30 min, so its factory client wrote an event every couple of minutes and the control compute never saw 300 quiet seconds). 70e3f714 is simply the first image that let Williamson run, and Williamson is the first county with a single chunk long enough to expose a defect that predates the delta. Duration of the RUN was correctly ruled out; duration of one CHUNK was never ruled out, and that is the variable that separates.

# The card's five questions, each answered by reading

1. The gate feed opens NO connection. `loadReplayFromLanding(client)` (a6 delta, `src/jobs/p2-juris-store.mjs` +246..250) runs one GROUP BY on the caller-supplied client; the call site (`src/jobs/p2-juris.mjs` delta at ~line 185) passes the EXISTING `neon` client, already open for `requireCities`/`loadCountyPropIds`. Nothing new is opened, nothing is left unclosed. The prime suspect is clean.
2. Two connections alive during a run, unchanged by the delta, both owned by `runP2Juris`: `factory` (opened at `src/jobs/p2-juris.mjs:112` via `connectFactory`, to `ep-round-base`) and `neon` (opened at `p2-juris.mjs:145` via `openNeonClient`, to `ep-lucky-truth`). Both are ended in the same `finally` (lines 223-224). No pool anywhere in this path; bare `pg.Client` both times.
3. No transaction is held across chunks. Zero `BEGIN`/`COMMIT`/`ROLLBACK` in the three p2-juris files (grep exit 1); every statement autocommits; each chunk is one INSERT..ON CONFLICT statement on the neon client.
4. The pg `error` event is handled NOWHERE. The only `on("error")` in `src/` at 5f9acc3 is a child-process handler in `cloudrun-jobs.mjs:84`. Neither construction site attaches a listener: `src/db/connect.mjs:86-91` (`connectFactory`) and `src/jobs/p2-juris-store.mjs:248-257` (`openNeonClient`). Any server-side kill of an IDLE client is therefore an uncaught exception and exit 1, skipping the catch block that would have written the failure termination, which is why both run rows were left `status='started'` for the next reap tick to mop up as crashed. This is its own defect independent of root cause, exactly as the card suspected.
5. No pooled host anywhere in this path. `refusePoolerHost` gates both URLs at construct time (`connect.mjs:31-48`, `p2-juris-store.mjs` neonUrlFromEnv), and the live secret hostnames read back non-pooler. The runs wrote pages, so both connects passed the refusal.

# Mechanism believed, and the second mechanism rejected

**Believed:** Neon autosuspend on the factory control store's compute (`ep-round-base`, the project the ops-log evidence never covered) fires 300s after the reap tick's connection close while the p2-juris control client sits idle through a long Williamson chunk; suspend SIGTERMs the idle backend; 57P01 arrives on a listener-less client; unhandled `error`; exit 1.

**Rejected: the F-03 reaper terminated it.** The reaper would produce the same observable (a job dying mid-run at a tick-aligned moment). Rejected on four independent reads: (a) `terminate()` in `src/control/reaper.mjs` writes a termination_records row and deletes leases, full stop; no backend kill exists; `pg_terminate_backend` appears NOWHERE in hauska-factory, hauska-engine, or legacy-design-tools (greps with real exit codes after my first piped grep proved vacuous); (b) `reapStartedRuns` leaves any run matched to a LIVE execution alone (`if (exec && !executionDone(exec)) continue`), and both runs were name-matched and live, since `listFactoryJobs` returns every `factory-*` job including factory-p2-juris; (c) even the age-orphan path could not fire at 15 minutes against the 3600s default; (d) an orphan write could not emit 57P01 on a TCP connection anyway. The reaper's only role is rhythmic: its tick is the last activity the suspend clock counts from, which is what quantizes both deaths to tick close plus 300s.

**Also rejected: someone killed the LANDING writer's backend on fancy-fire.** A busy client's killed backend rejects the in-flight query promise, which the `try/catch` in `runP2Juris` catches, writing a `failed` termination and exiting through the throw; the observed crash is instead the unhandled `error` emission path of an IDLE client (`_handleErrorEvent`), and the landing page count (stuck at 8000) shows the chunk died by client disconnect, not by server kill mid-statement. Nothing in the estate calls pg_terminate_backend, and fancy-fire's platform log was already read clean by the prior session.

# The defect, by file and line (base 5f9acc3, unchanged by the delta)

1. `src/db/connect.mjs:86-96` and `src/jobs/p2-juris-store.mjs:248-257`: pg Clients constructed with no `error` listener. Any idle-time server disconnect is process death. This converts a survivable infrastructure event into a failed run and skips the job's own failure bookkeeping.
2. `src/jobs/p2-juris.mjs:169` (`heartbeatLease` only at chunk START): the factory control connection generates zero traffic for the entire duration of a chunk. A chunk longer than the control endpoint's suspend_timeout guarantees the kill. Adjacent latent defect, same line: the lease TTL is 15 minutes (`src/control/leases.mjs:7`) refreshed only at chunk start, so any chunk over 15 minutes lets the writer's own lease expire and become stealable mid-write. Williamson chunk 2 exceeds both bounds.
3. Reaper visibility answer the card asked for: `p2JurisRunScope` (`p2-juris.mjs:74-81`) writes NO `max_duration_s` into scope; the declared `MAX_DURATION_S = 21600` reaches only the close-time termination record. The reaper therefore prices every p2-juris row at the 3600s default. Not causal here (live name-match wins), but a p2-juris run past one hour whose execution listing ever fails partially would be falsely orphaned. One-line fix: put `max_duration_s: MAX_DURATION_S` into `p2JurisRunScope`.

# What a fix would be (not executed; this card is read-only)

Attach an `error` handler to both clients at construction (record, mark degraded, fail loud through the job's own catch path rather than process death). Convert the lease heartbeat to an interval timer, roughly every 60s, running for the life of the run: that keeps the lease honest through long chunks AND puts periodic traffic on the control compute so no 300s quiet window exists while a run is live. Add `max_duration_s` to the run scope. Optionally, and as an operator decision on a Neon setting rather than a code fix, set the factory store endpoint's suspend_timeout to 0 the way production already is; the code fix is preferable because it also cures the lease expiry and works on any endpoint.

# UNMEASURED, and the one settling instrument

The suspend_timeout of the `ep-round-base` endpoint and its two suspend events are inferred from the 300.3s/299.8s deltas, not read. The single instrument that settles it: the operations log (or endpoint settings) of the Neon project owning `ep-round-base-au0jofwp`, which should show `suspend_compute` at ~2026-08-31T22:45:31Z and ~2026-09-01T00:25:31Z and `start_compute` at the 22:50/00:30 reap ticks. Not run, per the card. Also UNMEASURED and out of card scope: why Williamson chunk 2 is more than 10x chunk 1 (its wallMs never landed; plausibly the Round Rock/Georgetown polygon mass in that prop_id range).
