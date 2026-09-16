---
title: P-244a ruling — the "compose timeout" is a mislabeled DXF-worker kill, and it is standalone-only by construction
date: 2026-09-16
status: closed-partial
type: ruling
lane: p244a-siteplan-compose-timeout
owner: lane planner (cente-p244a)
---

# P-244a ruling: not a compose defect, not P-231 -- a post-compose DXF-emission step that only the standalone route runs, killed by its own 60s ceiling under Cloud Run's default CPU throttling

**Verdict: the compose is innocent (again); the descriptor split (P-231) is innocent; the actual throw
is `runDxfWorker`'s internal timeout, in a code path the composed feasibility export never touches at
all.** This is a genuine, evidenced root cause with file+function citations and live production
evidence (Cloud Run logs, Neon DB reads, Cloud Run service config), not a plausible story. It also
overturns this dispatch's own dismissal of CPU throttling, on new evidence that dismissal did not have.

Repo: hauska-engine. Snapshot: `fix/p244a-siteplan-compose-timeout`, branched from `origin/main` at
`2d85fee` (fix(P-222): report asks the facet, PR #454).

## Falsifier 1 — name the thing that throws "timeout", with file and function

`runDxfWorker`, `packages/engine-core/src/parcel-terrain/emitters.ts:42-73`. It spawns
`python3 <dxf-worker>/run.py` as a child process and races it against a `setTimeout`:

```
const timeout = setTimeout(() => {
  child.kill();
  resolve({ status: "error", message: "dxf worker timed out" });
}, Number(process.env.DXF_WORKER_TIMEOUT_MS ?? 60_000));
```

That result is consumed by `emitDxfSitePlan`, `packages/engine-core/src/site-plan/emitters.ts:151-159`,
which throws `Error("DXF site-plan emission failed: dxf worker timed out")` on any non-`ok` status.
`emitDxfSitePlan` is called at `packages/engine-core/src/site-plan/author.ts:679`, inside
`authorParcelSitePlanExport` (lines 657-683) -- the standalone route's own wrapper around
`composeSitePlanModelForParcel`. The route (`services/engine-api/src/routes/parcel-terrain.ts:430-478`,
`runSitePlanExportJob`) catches this, and `classifySitePlanExportJobError` (lines 399-405, pre-fix)
matched it against the generic `/timed out|timeout/i` rule -- after the IFC-specific check, which does
not match a DXF message -- landing on `compose_timeout`.

**Confirmed against the live production record, not just the code:** `gcloud logging read` against
`hauska-engine-api` (project `hauska-prod-497015`) for 2026-09-16T00:48-00:52Z returns the job's own
structured log line verbatim:

```
2026-09-16T00:51:06.906609Z  event=site_plan_export.job_failed;jobRef=5593f6a9-62bd-4405-9e4f-0108262b49b5;
  level=error;message=DXF site-plan emission failed: dxf worker timed out;parcelNodeId=48021:34049;
  service=engine-api;ts=2026-09-16T00:51:06.907Z
```

`site_plan_export_jobs` (queried directly against the engine's own `DATABASE_URL`, resolved live via
`gcloud secrets versions access`, not guessed) carries the identical row: `state=failed`,
`error_class=compose_timeout`, `error_message='DXF site-plan emission failed: dxf worker timed out'`.

## Falsifier 2 — explain the composed-vs-standalone divergence; an explanation that would also break the composed path is wrong

**Structural, not timing-dependent.** `composeParcelReport` (`packages/engine-core/src/site-plan/report-model.ts:1317`)
calls only `composeSitePlanModelForParcel` -- the shared, genuinely symmetric geometry/model step P-227
already verified -- and stops. It never calls `authorParcelSitePlanExport`, `emitDxfSitePlan`, or
`emitIfcSitePlan`. Grepping the whole `packages/engine-core/src/site-plan` tree confirms the only call
sites for those two emit functions are inside `author.ts`, and `authorParcelSitePlanExport` is called
from exactly one place: the standalone route. **The composed feasibility path cannot hit "dxf worker
timed out" because it never runs the code that could throw it** -- this holds regardless of CPU
throttling, parcel data, or luck, so falsifier 2 is satisfied by construction, not by a coincidence of
timing on one sample.

## Falsifier 3 — rule P-231's descriptor in or out explicitly

**RULED OUT.** `resolveSitusAddressForExport` (`packages/engine-core/src/site-plan/resolve-situs-for-export.ts`)
is the one place `options.descriptor?.address` (P-231's subject) enters this code path. It supplies a
situs string used only for `prepareBoundaryEdgesForExport`'s front/side/rear ROLE labeling, and it
**never throws** -- its own postgres query is wrapped in a `try { ... } catch { return null; }`, so a
missing or unreachable `TXGIO_DATABASE_URL` degrades silently to a null situs, never an error. It has no
control-flow effect on whether, when, or for how long the DXF child process runs. P-231's descriptor gap
is real and still owed to whichever caller builds the standalone request body (per P-231's own row text,
out of hauska-engine's scope), but it is **not** the mechanism behind this timeout.

## Falsifier 4 — do not fix by raising the timeout; if genuinely slow, say so with a measurement

**Not genuinely slow.** The parcel's own terrain-model atom
(`did:hauska:parcel-terrain-model:48021:34049`, read directly from the engine's Neon DB) carries
`coverage.totalCells=2912`, `coverage.contourSource.polylineCount=4`, `touchesNodata=false` --
trivially small by this route's own standards. That SAME atom already carries a working
`dxf-site-plan` artifact (66,240 bytes, no degenerate/absence flags) with `fetchedAt=2026-09-15T11:42:47.487Z`
-- produced successfully, on this exact data, roughly 13 hours before the failure this dispatch
measured.

**The timing is the tell.** `gcloud run revisions list` shows `hauska-engine-api-00234-jez`
(tag `p240async`, P-240's async-job port) was created **2026-09-16T00:38:53Z**. The failed job started
at **00:49:10.848Z** -- eleven minutes later, the FIRST attempt at this route through the new detached
job pattern for this parcel. Before that deploy, this same tiny dataset succeeded synchronously, inside
a live HTTP request, with Cloud Run's request-time CPU guarantee. After it, the identical work runs
detached (`void runSitePlanExportJob(...)`, fired after the 202 response already returned), with no such
guarantee.

**`gcloud run services describe hauska-engine-api` confirms the service carries no
`run.googleapis.com/cpu-throttling` annotation** (only `startup-cpu-boost=true` and autoscaling
metadata) -- meaning Cloud Run's *default* applies: CPU is allocated only while a request is actively
being served. Background work continuing after the response returns can be throttled to a small
fraction of a vCPU. A `python3` spawn + `ezdxf` render that completes in well under a minute with full
CPU can plausibly take multiple minutes throttled -- long enough to blow through the DXF worker's own
60-second kill switch, on data that is not itself heavy.

**This reopens, on new evidence, a hypothesis this dispatch's own known-traps section says was already
refuted:** *"Do not assume Cloud Run CPU starvation... it was hypothesised by the planner and REFUTED:
the job ran a full 116 s and failed with a classified error, so it had CPU throughout."* That inference
does not hold: elapsed wall-clock time passing is not evidence that CPU was allocated throughout it --
throttled CPU still lets time pass, it just makes CPU-bound work inside that window take dramatically
longer. The earlier reasoning did not have (a) this parcel's own prior successful synchronous run on
identical data, or (b) the exact ~11-minute gap between the async-port deploy and the first async-path
failure. Both are new. **Do not re-dismiss this a second time without addressing these two specific
points.**

**What should change, and what was NOT done here:** `DXF_WORKER_TIMEOUT_MS`/`IFC_WORKER_TIMEOUT_MS` were
**not** raised -- a throttled subprocess given more patience is still throttled; more ceiling does not
supply more CPU. The change this finding actually calls for is a Cloud Run service configuration
change -- `run.googleapis.com/cpu-throttling: "false"` (equivalently,
`gcloud run services update hauska-engine-api --no-cpu-throttling --region=us-central1 --project=hauska-prod-497015`)
-- on `hauska-engine-api`, so detached background jobs (this route's, and any other async job pattern
this service now hosts per P-155/P-240) get real CPU. This creates a new Cloud Run revision, which is a
deploy; this dispatch's own stop-point ("Do not deploy or merge. Open the PR green and hand it back")
forbids me from applying it, so it is named here as `leave_behind`, not executed. **It is also
unverified whether this fully resolves the failure or only reduces its frequency** -- named honestly as
a recommendation backed by strong circumstantial evidence, not a proven fix.

## Falsifier 5 — verify on the authoritative record: the job row reaching `ready`, plus the artifact downloading

**Not achieved in this lane, and said so plainly.** The standalone route still fails today, on the
current deployed revision (`hauska-engine-api-00236-few`), because the root cause (CPU-throttled
background execution) has not been remediated -- and remediating it requires the deploy this dispatch
forbids me from making. This lane's own MCP account is tier `solo`; `export_instrument kind=siteplan`
against `48021:34049` returns `upgrade_required` before it would even reach the engine, so a live
re-trigger through the real customer-facing connector was not attempted (forging or bypassing that
entitlement gate to test a paid feature was judged out of scope for this lane, not merely inconvenient).
The evidence in falsifiers 1-4 above is drawn entirely from the authoritative record already available
without a new trigger: the live job row, the live Cloud Run request log, the live atom/coverage history,
and the live service configuration.

## Falsifier 6 — if the timeout originates outside hauska-engine, say so

It does not originate outside hauska-engine's code (the throw site, `runDxfWorker`, is squarely inside
this repo) -- but its *cause* is Cloud Run service configuration, not application code. An honest
attribution is a result: the fix this finding calls for is an infrastructure setting, not a line of
TypeScript.

## What this lane actually changed

`classifySitePlanExportJobError` (`services/engine-api/src/routes/parcel-terrain.ts`) previously matched
"DXF site-plan emission failed: dxf worker timed out" against its generic `/timed out|timeout/i` branch
and recorded `compose_timeout` -- misnaming a post-compose, standalone-only DXF-emission failure as a
defect in the shared, composed-path-symmetric compose step. This lane adds a `dxf_emission_failed`
class, mirroring the existing `ifc_emission_failed` handling, with a comment explaining why the
distinction matters. Two tests added to `site-plan-setback-gate.test.ts` prove the new classification
(DXF timeout -> `dxf_emission_failed`) and that the existing IFC-timeout classification is unchanged.
PR: hauska-engine#455, branch `fix/p244a-siteplan-compose-timeout`, green (typecheck + test passing;
the one full-suite failure, `envelope-contract.test.ts`'s rainfall-forcing case, reproduces on
`origin/main` under parallel-suite timing and is unrelated). **Not merged, per dispatch instruction.**

This is a real, in-scope improvement (operators are no longer misdirected toward the compose step when
triaging this error class) but it does not, by itself, make the standalone export succeed -- the
underlying CPU-throttling cause is untouched, deliberately, because fixing it crosses this dispatch's
own deploy stop-point.

## Falsifier outcomes (pre-registered in the dispatch, answered honestly)

1. **Name the throw site with file+function.** Done: `runDxfWorker`,
   `packages/engine-core/src/parcel-terrain/emitters.ts:50-53`, surfaced via `emitDxfSitePlan`,
   `packages/engine-core/src/site-plan/emitters.ts:151-159`.
2. **Explain composed-vs-standalone; an explanation that breaks composed too is wrong.** Structural:
   composed never calls the DXF-emitting code at all. Confirmed true, not assumed.
3. **Rule P-231 in or out.** Ruled OUT, with the specific mechanism (`resolveSitusAddressForExport`
   never throws and only affects label text) named.
4. **Do not fix by raising the timeout.** Not done. The genuinely slow/legitimate framing does not
   apply here (data is trivially small); the real cause (CPU throttling on detached work) and its real
   fix (a Cloud Run annotation, not a ceiling) are named as `leave_behind`.
5. **Verify success on the job row + artifact download.** Not achieved -- said so plainly, with the
   reason (fix crosses the deploy stop-point) rather than a fabricated pass.
6. **If the cause is outside hauska-engine, say so.** The throw site is inside hauska-engine; its root
   cause is Cloud Run service configuration outside the application code. Said so.
