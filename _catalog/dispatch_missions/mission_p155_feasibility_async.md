## Mission — P-155 FEASIBILITY: the refresh becomes asynchronous, and the clients poll

You are the deepest worker in OPS-23 wave 1. You do not spawn sub-agents. The dispatch
planner supervises you, reviews your design at CP1 and your first pilot at CP2, and runs the
surface probe itself after your deploy; your own probe run is evidence, not the close.

Exit-bounded verification: every command you run must terminate on its own (build, test, a
bounded curl); wrap anything that could hang in `timeout`; never leave a watch, a tail or a
dev server running.

### Where you work

Three repos, all property seat, all registered in `_catalog/seat_register.json`. Create each
from `origin/main` and declare its start commit before you write anything:

- `empressaioemail-tech/hauska-engine`, worktree `P:/seat-worktrees/property/hauska-engine-p155-feasibility-async`, branch `feat/p155-feasibility-async`.
- `empressaioemail-tech/hauska-map`, worktree `P:/seat-worktrees/property/hauska-map-p155-feasibility-poll`, branch `feat/p155-feasibility-poll`.
- `empressaioemail-tech/legacy-design-tools`, worktree `P:/seat-worktrees/property/legacy-design-tools-p155-feasibility-poll`, branch `feat/p155-mcp-feasibility-poll`.

`P:/hauska-engine`, `P:/hauska-map` and `P:/legacy-design-tools` are other people's checkouts.
Never build there. Other OPS-23 lanes are live in hauska-map and legacy-design-tools (P-153
DRAW, P-152 READER, later P-167); you touch none of their files. Rebase on `origin/main` before
your PR and re-green CI on the current base.

### The finding you are fixing (OPS-23 §2 F7)

The feasibility engine finishes Travis refreshes in 85 to 154 s and returns 201; the two
clients give up at 55 s and tell the customer the engine "timed out, probably a cold start".
It is not a cold start. The download endpoint serves the finished PDF 0.2 s after the engine
is done. The customer sees a failure for a report that succeeded.

### What is true today, verified 2026-09-11 at hauska-engine `79fa573`, hauska-map `6ab6914`, LDT `3950ce9b`

Record: `_inbox/2026-09-11_ops23_wave1_verify_p155.md`. Re-verify each line at your start
commit; anything that has moved goes in `contradicted`.

Engine (`services/engine-api/src/routes/parcel-terrain.ts`, mounted at `/v1/property-nodes` by
`server.ts:183,186`):

- `POST /:parcelNodeId/feasibility-export/refresh` (line 601) authors the whole report inside
  the request and returns 201 at line 696, or 422 `feasibility_export_failed` on any throw
  (697-701). The chain is synchronous end to end: `parcel-terrain.ts:611
  authorParcelFeasibilityExport` → `packages/engine-core/src/site-plan/feasibility-author.ts:139
  composeParcelReport` → `:222 emitPdfFeasibility` → `:234 artifactStore.put(...)` → 201.
- `GET /:parcelNodeId/feasibility-export` (704) reads the record; `GET .../download` (710)
  returns 404 `artifact_unavailable` when the artifact is missing or `deferred` (714-719) and
  410 `artifact_evicted` on a store miss (721-726).
- The only persisted state is the `parcel-terrain-model` atom's `artifacts["pdf-feasibility"]`
  record (`ref`, `deferred`, `deferredReason`), written only after the PDF is stored. There is
  no in-progress state anywhere: a poller cannot distinguish "running" from "never requested"
  from "failed".
- No async primitive exists in the repo: no 202, no job id, no queue, no Cloud Tasks, no
  Pub/Sub, no run table (searched `services/**`, `packages/**`, migrations, all `package.json`).
- The artifact store is GCS when `TERRAIN_ARTIFACT_BUCKET` is set, else disk, else memory
  (`parcel-terrain.ts:246-255`); the 410 wording "no longer on this instance" is literally
  true only for the memory store.
- The Cloud Run request timeout for `hauska-engine-api` is not declared in the repo
  (`Dockerfile:82-85` names it without a value; `cloudbuild.engine-api.yaml:15 timeout: 3600s`
  is build time). Read it live, by field name, before you design:
  `gcloud run services describe hauska-engine-api --region us-central1 --project hauska-prod-497015 --format json`
  and read `spec.template.spec.timeoutSeconds` and the CPU allocation annotation
  (`run.googleapis.com/cpu-throttling`). Paste both in CP1. Never read them positionally.

Property Explorer (`apps/property-explorer`):

- `api/_lib/pe-feasibility-export-handler.ts:61 FEASIBILITY_ENGINE_TIMEOUT_MS = 55_000`
  (comment 56-59: the Vercel cap is 60 s); POST refresh at 150 with
  `AbortSignal.timeout(FEASIBILITY_ENGINE_TIMEOUT_MS)`; GET download at 213 with a 30 s budget.
  The handler is folded into `api/pe-site-plan-export.ts` (685-686), whose `maxDuration` is 60
  in `vercel.json:8`.
- On timeout: catch 189-192 → `engineFailure` → `classifyEngineFailure`
  (`_lib/pe-site-plan-export-core.ts:286,301`) → `retryableFeasibilityEngineFailureResponse`
  (`_lib/pe-feasibility-export-core.ts:356-375`): HTTP 503 `{ error: "engine_timeout",
  retryable: true, message }`. The two cold-start strings live at
  `pe-feasibility-export-core.ts:342-346`.
- The browser awaits once: `src/workbench/tools/feasibility-export.ts:65-105
  requestFeasibilityExport` does a single POST to `/api/pe-site-plan-export?kind=feasibility`
  (line 70); `src/workbench/tools/ReportsTool.tsx:1367` awaits it and clears `busy`. No poll,
  no retry. The 503 message reaches the customer through `feasibility-export.ts:137`.

Smart Site MCP (`artifacts/smartsite-mcp/src/feasibility-export.ts`):

- `REFRESH_TIMEOUT_MS = 55_000` (16), `DOWNLOAD_TIMEOUT_MS = 30_000` (17); POST refresh
  102-108, GET download 164-168; dispatched from `src/tools.ts:1044-1052` as
  `export_instrument` with `kind: "feasibility"`.
- On timeout the abort is returned as bare text through `engineThrewResult` (61-67) with
  `isError: true` and NO envelope, while the 422 and not-configured paths carry
  `{ tool: "export_instrument", kind: "feasibility" }`. An agent caller cannot classify the
  timeout as retryable. There is no cold-start string on this side.

### The change

The ruling is OPS-16 P-155: refresh returns 202 with a job reference; clients poll the
download instead of holding a 55 s socket; the cold-start string is retired; Travis versus
Bastrop latency is profiled and recorded, not gated on.

1. **A durable job state before anything else (engine).** A feasibility export has exactly
   these states, representable by type, never by sentinel: `never-requested`, `queued`,
   `running` (with `startedAt`), `ready` (with the artifact `ref` and `completedAt`), `failed`
   (with `errorClass` and `failedAt`). Persist it where the artifact record already lives (the
   `parcel-terrain-model` atom's `artifacts["pdf-feasibility"]` record) or in a small job row
   beside it; choose at CP1 and say why. `GET /:parcelNodeId/feasibility-export` returns the
   state and timestamps. `GET .../download` returns 404 with the current state in the body
   while `queued` or `running` (a declared wait, not an absence), 200 with the PDF when
   `ready`, 410 when evicted, and 422 with `errorClass` when `failed`. `never-requested` is
   its own answer; it is not `deferred`.
2. **Refresh returns 202 (engine).** `POST .../refresh` records `queued`, starts the
   authoring, and returns 202 `{ state: "queued", jobRef, pollAfterMs, statusUrl, downloadUrl }`
   without waiting. A refresh while a job is `running` returns 202 with the running job's
   reference, never a second run. Where the authoring runs is your CP1 decision, and it must
   survive the client disconnecting: if you run it in the same instance after responding, the
   service needs CPU allocated outside requests (read the annotation live; if it is throttled,
   say so and either change the service setting through the deploy or hold the job inside a
   request the worker itself opens); if you use Cloud Tasks or Pub/Sub, that is new
   infrastructure and needs a credential, so STOP and report before creating it. Whichever you
   choose, the pre-registered falsifier is: *start a job, disconnect immediately, poll three
   minutes later; if the state is not `ready` or `failed`, the design is wrong.*
3. **The clients poll (hauska-map and smartsite-mcp).** The Property Explorer handler POSTs
   refresh with a short budget, returns 202 to the browser with the poll target, and the
   browser polls the download (through the BFF) on `pollAfterMs` until `ready`, `failed`, or a
   client-side cap you state, showing a running state in `ReportsTool`, never a failure, while
   the job runs. `FEASIBILITY_ENGINE_TIMEOUT_MS` and the two cold-start strings are deleted;
   the retry message is retired, since a timeout is no longer the failure it names. The MCP
   `export_instrument` tool does the same inside its own budget: if the PDF is `ready` within
   the budget it returns it; otherwise it returns a DECLARED in-progress result carrying the
   `{ tool, kind, state, jobRef, pollAfterMs }` envelope with `isError: false`, and a second
   call with the same parcel returns the PDF once ready. Every error path on the MCP side
   carries the same envelope; the bare abort text goes away.
4. **Profile, do not gate.** Record, in the close, refresh wall time for `48021:34049` and
   `48453:474034` from the engine log lines (by request id, not by revision name), before and
   after, and state the mechanism you believe explains the Travis to Bastrop gap and a second
   mechanism that would produce the same numbers. Do not make the row wait on speeding it up.
5. **Non-vacuity and refusal.** Tests: a job that throws lands in `failed` with an
   `errorClass`, never in `ready` and never silently `deferred`; download while `running`
   returns the declared wait, not 404-as-absence; a second refresh during `running` does not
   start a second job; the MCP in-progress result carries the envelope; the browser path shows
   no failure state for a job that later completes. CI conclusion strings pasted, not summarised.

### Verification, and the falsifier you pre-register

Write down at CP1 before any code: *if `export_instrument feasibility 48453:474034` still
returns no PDF after the deploy, or the app needs a manual retry for the same parcel, the row
is not done, whatever the engine logs say.* And the disconnect falsifier from step 2.

Deploy: engine-api through its Cloud Build path (`cloudbuild.engine-api.yaml`, project
`hauska-prod-497015`, region `us-central1`), then read the serving revision and its traffic
percent by field name from the service JSON; Property Explorer through the Vercel CLI, then
confirm the live bundle carries the poll path and no longer carries the cold-start strings;
smartsite-mcp through its workflow, then read the serving revision by field name and confirm
`/health/dependencies` still reports `hauska_mcp: ok`. Deploys are yours; fix your own failed
deploy and say "failed on X, fixing X".

Then the probe. The planner runs `node scripts/surface-probe.mjs --rows P-155 --observations <file>`.
Its P-155 predicate reads these observation keys for `48453:474034` and `48021:34049`, each
with `observedBy` and `observedAt`: `feasibilityRefreshHttp` (the HTTP status the BFF returned
on the first call after your deploy; 202 expected), `feasibilityMcpPdf` (true only if
`export_instrument` returned a PDF, on the first or a declared follow-up call), and
`feasibilityAppPdfWithoutRetry` (true only if one click in Reports produced the PDF with no
manual retry). Paste the raw BFF and engine responses that back each value in the close.

### Close

`_inbox/<date>_p155-feasibility_close.json` per AGENT_CONTRACT §6 plus the OPS-23 four fields.
`leave_behind` must name the Cloud Run request timeout and CPU allocation you read, the state
store you chose, and the profile numbers with their request ids. If the Cloud Run setting had
to change, name the exact field you changed and the revision that carries it.
