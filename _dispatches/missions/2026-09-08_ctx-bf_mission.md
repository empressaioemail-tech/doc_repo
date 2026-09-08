## Mission — buildingFootprint reconciliation: the merged job that has never run

You own `hauska-factory`. Cut your own worktree, register it in
`_catalog/seat_register.json` with `path` equal to your worktree (the tmp-lane
convention — binding `path` to `P:/hauska-factory` makes the seat gate refuse you),
and declare your snapshot before any work.

### The state, and what is actually missing

`src/jobs/parcel-building-footprint-reconcile.mjs` is MERGED (factory PR #99, CTX-G)
and has NEVER RUN. There is no Cloud Build config for it and no Cloud Run job
definition, and `parcel_gate_verdict` has zero rows for the `buildingFootprint` rail
anywhere. So the ledger is not the serving ledger for that rail, and the coverage
report CTX-G also merged has nothing to report on.

This is a RUN plus the wiring it needs. It is not a rewrite. Read the merged job
before you touch anything and report anything in it that contradicts this card.

### The trap that is already set for you

`buildingFootprint` is deliberately NOT in `DEFAULT_SCHED_RAIL_KEYS`. CTX-F left it
out on purpose: adding it before a real `gate-sched --apply` evaluation exists would
make the pre-bake readiness gate refuse EVERY county permanently, because a rail with
no verdict row refuses `RAIL_UNACCOUNTED` by design.

So the order is fixed and is not yours to reorder: wire the job, run it per county,
confirm `parcel_gate_verdict` carries real rows for the rail, verify with CTX-G's
`county-rail-coverage-report.mjs`, and only then propose adding the rail to a slate
constant in `publish-gate-sched.mjs`. Do not add it to the slate in the same change
that first runs the job. If you add it early you will block the Central Texas bake,
which is in flight on the same repo.

### The six counties

48021 Bastrop, 48055 Caldwell, 48209 Hays, 48309 McLennan, 48453 Travis, 48491
Williamson. One county at a time. Read counts back from the store, never from the
writer's own summary line.

### Wiring

Mirror `cloudbuild.publish.yaml`'s `factory-staging-reset` case as the template — it
is the closest existing shape, and A-019 says that file is the only place a job's
command, args, env and secrets live. Jobs deploy to region **us-east4**, project
`hauska-prod-497015`. Not us-central1; that mistake returns an empty job list that
reads like an absence.

### What you must not do

Do not deploy any production SERVICE (cortex-api, engine-api, smartsite-mcp,
hauska-mcp-server, Vercel). Factory Cloud Run JOBS are in scope; serving services are
not, and hauska-engine main being ahead of its serving revision is deliberate.

Do not touch `src/lib/publish-readiness-gate.mjs`, `src/lib/publish-gate-clients.mjs`,
`src/lib/publish-cadroll-postcondition.mjs`, or `src/jobs/bastrop-publish.mjs`. The
integration seat is actively landing the Wave 2 bake path in those files.

Do not run any bake, staging or production.

### Absence discipline, which this rail is unusually exposed to

A footprint rail will legitimately have parcels with no building. `absent-verified` is
a claim that something looked; writing it where nothing looked is a lie that passes
every check. If the reconciliation cannot distinguish "no building here" from "no
source consulted", say so and leave the cells `unaccounted` rather than clearing a
gate. Watch for an unaccounted count falling without a matching acquisition landing —
that is relabelling, not progress.

### Report

CP1 after you have read the merged job and the coverage report and can state what the
job actually does versus what this card claims. CP2 after the first county. Close with
per-county store-read counts, the coverage report output, a `leave_behind` block, and
an explicit statement of whether the rail is ready to enter a gate slate — including
the case where the honest answer is "not yet, and here is what is missing".
