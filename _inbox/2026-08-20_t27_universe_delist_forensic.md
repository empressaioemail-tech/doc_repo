---
id: inbox_2026_08_20_t27_universe_delist_forensic
title: The universe mass-delist never fired — established, not assumed
status: active
last_updated: 2026-08-20
applies_to: empressa-trading
owner: nick
related: [session_2026_08_20_t26_markets_substrate, 61_enforcement_doctrine]
purpose: Answers the operator question of 2026-08-20, whether the universe delisting fail-open had already fired in production and whether any symbol carries a closed alias era needing repair. Read-only forensic against the live database, with the second mechanism stated and rejected.
---

# The universe mass-delist never fired

## Question

`app/universe/sync.py` could be driven by a fabricated empty vendor list into
delisting every active symbol and closing its alias era, while returning
`available: True`. The fail-open was fixed and merged in `506fdf76`. The open
question was whether it had ALREADY fired, and whether any symbol carries a
closed alias era from an unauthorised delisting.

## Answer: no, and no repair is owed

Read-only, against the live Cloud SQL Postgres database `cockpit` on
2026-08-20, executed inside the running `empressa-cockpit-api` container so the
credential never left the host. No writes, no restart.

    universe_symbols                49,412 rows, ALL is_active = true
    rows with delisted_at non-null  0
    rows with is_active=false       0
    identity.symbol alias atoms     9,987
    closed alias eras (valid_to)    0

The sweep has never run destructively. Not once.

## The second mechanism, and why it is rejected

The obvious competing explanation is that the sweep DID fire and a later
successful sync reactivated everything, setting `delisted_at = None` and erasing
the evidence from `universe_symbols`.

That is rejected on the alias store, and the rejection is the load-bearing part
of this finding. Reactivation in `sync_universe` sets `is_active = True` and
`delisted_at = None` and DOES NOT reopen the alias era. Alias atoms are
append-only, so a closed era cannot be tidied away by any later run. If a
mass-delist had ever fired, closed-era atoms would remain, sharing one
`valid_to`. There are ZERO closed eras out of 9,987.

Two independently derived stores, written by two different components, agree.
One of them cannot be rewritten. That is a meaning-shaped check rather than a
presence-shaped one.

## Why it never fired, which is more specific than luck

`universe_symbols` carries exactly ONE `synced_at` value across all 49,412 rows:
2026-06-29 16:25 UTC. `sync_universe` has written that table exactly once, and
there is no `job_runs` kind for it at all, so it is invoked by hand or by a
route rather than on a schedule.

    fmp_stock       39,632
    fmp_etf          9,759
    databento_root      19
    macro_root           2

The destructive sweep only runs on a SECOND run, against an existing active
population. There has never been a second run. The fail-open was a loaded gun
that was never pulled, and the fix landed first.

`equity_universe_daily_seed` is a DIFFERENT job, healthy, 42 runs, last
succeeded 2026-08-20 00:12 UTC. Do not confuse the two.

## What this leaves open, stated so it is not a surprise later

THE NEXT RUN WILL DELIST IN BULK, AND CORRECTLY. The universe is roughly seven
weeks stale. Whenever `sync_universe` next runs against a successful vendor
fetch, everything genuinely gone since 2026-06-29 is delisted in one burst and
its alias eras close. Post-fix that is right behaviour, not a defect, but it
will look alarming and the count will be large. Knowing this in advance is the
difference between a correct sweep and a second incident.

NO DURABLE RECORD EXISTS ON THE DESTRUCTIVE PATH. The sweep returns a `delisted`
integer in an HTTP response and writes nothing that survives the request. A
count is not a record. That absence is the whole reason this question needed a
three-witness database forensic instead of a log read.

CLOSED 2026-08-20 as `98059077` (PR #369). The sweep now writes a `job_runs` row
of kind `universe_delist_sweep` NAMING the symbols, committed BEFORE the first
`is_active` flip, and a record that cannot be written aborts the sweep rather
than letting it proceed unrecorded. All three refusal paths record too.

THE ALIAS CLOSE WAS SWALLOWED. The close was wrapped in a bare `except
Exception` logging at `logger.debug`, below the production log level, so a
symbol could be marked delisted while its alias era silently stayed open. CLOSED
in the same commit: a failed alias close now rolls back that row's delist, so the
two stores cannot disagree, names the symbol in the durable record, and logs at
error. Per-row rather than fatal, so one unresolvable ticker cannot strand the
sweep.

## Method note

The credential was never printed or copied. `COCKPIT_DATABASE_URL` lives in
`/opt/empressa/apps/cockpit/backend/.env` on the `empressa-bot` VM and resolves
to Cloud SQL Postgres through a `cloud-sql-proxy` sidecar. The queries ran inside
the already-running API container via `docker exec`, which starts nothing and
restarts nothing. A restart would have been deploy-shaped and would have killed
in-flight jobs and A and B arms; none was performed.
