---
lane: integration
item: "countAtoms() live recurrence tonight — attribution abandoned, hardening greenlit"
checkpoint: "Investigation done, attribution not found. Operator greenlit hardening regardless of caller. Dispatched to Engine (cente-67)."
date: 2026-09-06
---

## What happened

Hours after the original `countAtoms()` health-check fix (PRs #383/#384, deployed
and verified live earlier tonight), Factory and Engine independently caught the
identical live pile-up recurring: continuous new connections running
`SELECT COUNT(*)::text AS count FROM atoms`, growing (15+ concurrent observed),
new connections opening independent of any single connection's fate (ruled out
a simple retry loop via a kill-and-observe test — killing one PID did not stop
the pattern).

## What was ruled out, and how

- Both of `hauska-retrieval-api`'s original call sites (`/healthz`, boot-log):
  confirmed fixed, source-level and live-behavior (hit the real production URL
  directly, fast, using `hasAtoms()`/`estimateAtomCount()`).
- `hauska-mcp-server`: read its actual `/healthz` source directly (not just
  grep) — structurally never touches the atoms database; its dependency probe
  to retrieval-api hits a confirmed-fast URL.
- `hauska-engine-api`: `/health` is a static JSON handler, no DB touch at all,
  on any branch.
- `factory-control`: connects to a completely different Neon project/database,
  structurally cannot be the source.
- A full search of `hauska-engine`'s tracked source found no remaining caller
  of `.countAtoms()` anywhere outside tests — the function is only reachable
  through `LayeredStorage.countAtoms()`, which nothing in tracked `main` calls.
- Checked local node processes on the integration seat's own machine for a
  stray diagnostic script — nothing found (does not rule out a process on a
  machine this seat can't see).
- Did not find the actual caller. This is consistent with, but not proven to
  be, the same "code run against production from an unmerged branch" pattern
  confirmed twice elsewhere tonight (`tx_building_footprint`, `tx_rrc_well`).

## Decision

Operator greenlit hardening `PgStorage.countAtoms()` itself rather than
continuing to chase attribution: the function has zero legitimate callers left
in tracked `main`, so making it safe regardless of caller protects shared
production whether the mystery caller is a stray script, an orphaned branch,
or something that reappears later. Dispatched to Engine (cente-67), who
already used the same pattern (`n_live_tup`-based approximate count) for
`estimateAtomCount()` earlier tonight and is already in the file. Same
discipline as every other change tonight: real PR, canary-then-shift, verify
against the live production URL, no production regression.

## Not done

Attribution of the actual caller. If it resurfaces after hardening lands (i.e.
if the caller adapts or the hardening doesn't fully close the risk), that's a
signal worth escalating differently — a real, willful bypass rather than an
orphaned/forgotten process.

## Update: hardening deployed, pile-up did not stop — attribution abandoned,
## database-level containment approved

`PgStorage.countAtoms()` hardening merged and deployed (PR #388, `4fd50563`).
Confirmed independently the pile-up continued after deploy: live
`pg_stat_activity` check showed 12 concurrent instances of the exact query
post-deploy. Factory independently confirmed via backend_start timing that
these are genuinely new connections opening after the deploy, not stale ones
draining. This ruled out "just needs time" and confirmed the real caller
never picked up the fix.

Follow-up attribution effort, exhaustive: Engine found and Factory
confirmed-and-ruled-out a real, promising lead (`factory-publish-gate-sched`,
a Cloud Run JOB — a resource type neither of us had checked, only Cloud Run
services) was momentarily suspected as stuck, but Factory verified via source
(no reference to the atoms database anywhere in that job's code) and live
activity (the job was actively, correctly progressing on unrelated work, not
stuck — a real, separate finding: an earlier rail-set expansion means this
job's hourly runtime is now ~90+ minutes against a sub-10-second historical
baseline, a real overlap risk for its own scheduler, tracked separately).
Factory then swept all 32 of hauska-factory's own jobs plus factory-control's
services against the literal query pattern — clean. Combined with retrieval-
api, mcp-server, engine-api, and factory-control already cleared, and Cloud
Functions/Compute Engine both confirmed disabled at the project level
(structurally cannot be running anything), the caller is proven external to
every service and job in `hauska-prod-497015` that any of us can reach.

**Operator ruling (2026-09-06): approved database-level containment, scoped
narrowly.** Apply `statement_timeout` at the `hauska_mcp` DATABASE level
specifically (`ALTER DATABASE hauska_mcp SET statement_timeout = ...`), not
at the role level — the same Neon project also serves the `cortex`/`neondb`
database on the same shared compute endpoint, and a role-level setting would
change that database's behavior too as an unintended side effect. Dispatched
to Engine to pick the actual timeout value: generous enough that real
long-running diagnostic/backfill work already run tonight (some legitimately
took 8-15 minutes) isn't broken, tight enough that this specific pattern
(new connections every 15-90s, individually running minutes, piling up
faster than they finish) is meaningfully contained rather than just
eventually capped. Reversible in one command if it causes an unexpected
problem. Does not require ever identifying the caller — it protects the
shared compute regardless of who or what is still calling
`countAtoms()`-shaped queries from outside anything this operation
controls.

## Update 2026-09-07: attribution found, very likely resolved — a resource
## type nobody checked

While closing an unrelated `retrieval-api` stale-deploy crash-loop tonight,
Engine found 8 old, stale-tagged Cloud Run revisions on `hauska-retrieval-api`
still receiving traffic and crash-looping independent of the serving
revision's 100%/0% split: `canary2`, `pooling-fix`, `mcp-p0-auth`, `mcp1`,
`mcp1b`, `p60-canary`, `healthfix-canary`, `bootlog-fix-canary`. Each carried
its own `autoscaling.knative.dev/minScale: 1` annotation, which Cloud Run
applies per-revision to any revision with a live tag URL regardless of
traffic percent — confirmed empirically, they were starting and crashing
with zero external traffic. All 8 predate the countAtoms fixes (#358/#384/
#388); two (`healthfix-canary`, `bootlog-fix-canary`) were created on
2026-09-06 itself, the exact day of this investigation. Each running
independently on its own crash-restart cycle matches this doc's own
description of the mystery pattern exactly: "new connections opening
independent of any single connection's fate." This is very likely why
attribution failed originally — nobody checked old tagged revisions as a
resource type, the same blind spot this doc already names for Cloud Run
Jobs.

**Action taken:** removed all 8 tags via `gcloud run services update-traffic
--remove-tags` (revisions themselves not deleted — fully reversible, can be
re-tagged to the same revision ID if ever needed). The database-level
`statement_timeout` containment above was left in place untouched — it
remains a legitimate general safety net regardless of source.

**Verified, not assumed:** watched logs for a full 6 minutes post-untag.
Five straggler crashes landed in the first ~2 minutes (instances already
mid-boot when the untag propagated), then zero errors of any kind from
15:39:11Z onward — 8+ minutes clean at time of writing, well past the
15-90s recurrence cadence this doc describes.

**Honest limit on this claim:** this cannot prove these 8 tags account for
100% of every historical instance of the pattern back to whenever it first
started — only that they are a strong, mechanism-and-timing-consistent
match, and removing them measurably stopped what was actively happening
tonight. Treat as very likely resolved, not proven closed.
