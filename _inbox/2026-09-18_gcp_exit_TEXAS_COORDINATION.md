---
id: 2026-09-18_gcp_exit_TEXAS_COORDINATION
title: GCP exit, what it needs from the Texas scale-up (coordination brief for its planner)
date: 2026-09-18
last_updated: 2026-09-18
status: open (for the Texas scale-up planner; operator hand-carries)
kind: coordination brief
owner: nick
maintained_by: integration seat
programs: [OPS-25, OPS-16, OPS-24]
related:
  - _inbox/2026-09-18_gcp_full_exit_PLAN.md (the plan; its §8 proposes the windows below)
  - _inbox/2026-09-18_gcp_estate_EVIDENCE.md (F-n references)
  - _decisions/2026-09-18_gcp_full_exit_rulings.md
  - _inbox/2026-09-16_texas_scaleup_ROADMAP.md
snapshot: GCP read 2026-09-18 10:45Z to 11:59Z; doc_repo main e9a9064a
---

# GCP exit: what it needs from the Texas scale-up

The operator has ruled a full exit from GCP to DigitalOcean (OPS-25). It waits for a clean pause
in the Texas scale-up, and it is coordinated with you before anything that touches your repos or
services moves. This brief says what the exit needs, what it hands you now, and what only you can
answer. The plan is `_inbox/2026-09-18_gcp_full_exit_PLAN.md`.

## What we are asking for

**1. Four kinds of window, not one long pause.** Only W3 is a real stop.

| Window | What it asks of you | Rows |
|---|---|---|
| **W1** | Ordinary lanes on your repos, queued like any other lane. | D-19, D-21, D-25, D-27 |
| **W2** | For each service cutover, no deploys to that one service from its DNS flip through its bake. | D-3 (`hauska-retrieval-api`), D-4 (`hauska-engine-api`), D-6 (`cortex-api`), D-30 (`smartsite-mcp`), D-7 (`hauska-mcp-server`) |
| **W3** | For each job-plane batch switch (D-31): no factory run in flight, the gate trigger paused, no heavy-scan lease held. | D-31 |
| **W4** | For each bucket's copy and switch, no writes to that bucket. | D-34 |

**Please name the W3 slot.** We propose a phase boundary: after the Phase 0 exit and before the
Burnet run, or after Phase 1.

**2. Decide which rows you would rather own as OPS-16 rows.** Each of these changes your code:

- **D-19, the canary-tag fix.** It extends P-279.
- **D-23 and D-31, the factory job plane.** `cloudrun-jobs.mjs` gets a Kubernetes adapter, and `runs.mjs` and `heavy-lease.mjs` get a new execution identity.
- **D-27, no synchronous request over 90 seconds.** It covers the engine refresh endpoints and `cortex-api` street-search and gis-layer.
- **The caller repoints in D-25.** LDT, the engine, `hauska-map` and the `hauska-mcp-server` templates.

If you own a row, the exit waits on your row. If you do not, our lane runs in your W1 queue.

## What we hand you now, whatever the timing

**The canary-tag leak is costing about $2,400 a month, and it is in your services.** On every
service with minimum instances, each tagged revision keeps a warm instance for as long as the tag
exists. About 96 percent of Cloud Run service spend is revisions that serve 0 percent of traffic
(F-1).

- `smartsite-mcp` has 33 tags and averaged 30.5 warm instances while serving about 256 requests a day.
- `cortex-api` idle revisions cost about $1,040 in 30 days, and `hauska-engine-api` idle revisions about $870.

Your own P-251 tag removal on 2026-09-16 at about 16:53Z confirms the mechanism: billing on those
revisions stopped at that minute.

The fix has three parts, carded as D-19:
1. Remove the stale tags.
2. Have each canary procedure remove its tag after the traffic shift.
3. Extend P-279's post-deploy step to refuse a 0%-traffic tagged revision that holds a minimum instance.

We recommend it ahead of any pause. It changes no serving revision.

**D-3's dispatch lists one caller of `hauska-retrieval-api`, and there are at least seven** (F-5):

- `hauska-engine-api` `RETRIEVAL_API_URL`
- the dashboards, on GCP and on DigitalOcean
- `cortex-api`'s `BRIEF_RETRIEVAL_API_URL` secret
- four hardcoded LDT api-server files
- three hardcoded `hauska-map` files

D-3 is recompiled before it fires.

**Requests that will not survive DigitalOcean's 100-second edge** (F-9, last 7 days):

| Service | Route | Duration |
|---|---|---|
| `hauska-engine-api` | flood-drainage refresh | up to 191s |
| `hauska-engine-api` | feasibility-export refresh | up to 154s |
| `hauska-engine-api` | site-plan-export refresh | up to 116s |
| `cortex-api` | street-search | up to 300s (504s) |
| `cortex-api` | gis-layer | 502s |
| `hauska-retrieval-api` | `/stats` | 120s |

**The factory is built on the Cloud Run Jobs API** (F-10). Its execution identity and leases key
on `CLOUD_RUN_JOB` and `CLOUD_RUN_EXECUTION`. Staging secret rotation writes to Secret Manager. On
DigitalOcean it moves to DOKS, where a Job gives on-demand launch, a per-execution identity,
timeouts and CronJobs. App Platform cannot launch a job on demand. D-23 proves parity on staging
first, with no production writes, and it needs no window.

**Other items that touch you:**
- `hauska-engine-api` was measured following LATEST at 11:45Z today (your roadmap correction).
- A 43rd factory job, `factory-retired-share-watch`, appeared during our read.
- Nine factory jobs billed in the last 30 days no longer exist. Nothing is wrong with that; it is recorded so nobody chases it.

## What only you can answer

1. The W3 slot, and how long one batch switch can hold the gate trigger paused.
2. Which of D-19, D-23, D-27 and D-31 you own.
3. Whether any Texas lane depends on a `*.run.app` URL in a script or runbook we have not seen. The scan covered repository mains (F-11), not lane worktrees or local scripts.
4. Whether any acquisition source is known to block cloud IPs. D-17 P9 tests reachability from DigitalOcean, but your list of sources is better than ours.
