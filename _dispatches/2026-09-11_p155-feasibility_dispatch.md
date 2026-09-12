CANON-PREAMBLE v9e22f2c4
- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HOLD LIFTED 2026-08-26 for the Factory program (`_decisions/2026-08-26_factory_program_and_hold_lifts.md`); the Bastrop QA condition is cosmetic and does not gate the data path. NO PRIVILEGED DATA and the Hauska spine rule stand.
- THE FACTORY IS THE ONLY WRITER PATH (OPS-19) — one machine built to the MODEL LAW (`19_the_instrument_contract.md`, `_blueprint/10_model.md`, `_blueprint/20_pipeline.md`, `_blueprint/40_rule_register.md`, `51_ingestion_pipeline_reference.md`, `24_instrument_conformance_program.md`; package `dist/*.d.ts` is the tiebreaker); own repo `hauska-factory`, own Neon store; every publish lands on staging before the identical job runs on production; nothing reaches a serving store except through publish; laptop ingest is FROZEN (`_decisions/2026-08-26_ingest_freeze_and_cloud_loader.md`); OPTION A ruled (`_decisions/2026-08-26_factory_model_law_and_option_a.md`): no new county is written on the old shape and old-shape writes ended permanently 2026-08-27. Every lane has its own registered worktree; never build in another lane's checkout. Row-level status lives in `_catalog/program_preambles/OPS-19.md` and `_state/property/STATE.md`, never here.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- MOST-CURRENT SOURCE WINS (operator 2026-09-11) — for setbacks and every dimensional rule, in every city and county, the source with the most recent effective date supplies the value; tier breaks ties only on equal or unreadable dates; dates are read at source (ordinance effective date, ArcGIS `editingInfo.lastEditDate`), never assumed from source kind; an unreadable date produces a conflict row with both values, never a silent pick. Supersedes tier-first ranking in LDT `authoritativeSetbackSource.ts` and layer-23-first in hauska-map. `_decisions/2026-09-11_setback_source_most_current_wins.md`.
- ENVELOPE DRAWN, FIGURE REFUSED (operator 2026-09-11) — Ruling B reversed for the polygon only: map and MCP draw block draw the modelled buildable envelope from the same `place/buildable-envelope` call with its disclosure wherever a district and setback table exist; buildable area and percent stay refused until an envelope atom backs them. Entitlement gate unchanged. `_decisions/2026-09-11_ruling_b_reversed_polygon_only.md`.
- THE LEDGER IS THE SERVING PATH, ATOMS ARE CANONICAL (operator 2026-09-11) — node = identity, atom = one claim from one authority at one time, edge = an atom whose value is a node; a cell is accounting (state, atom reference, provenance, cached rendering keyed to atom version and vocabulary version), never a copied value; one reader in `hauska-engine/services/retrieval-api` walks gated cells and dereferences atoms and every surface and the Hauska MCP catalog consume it; unslated rails refuse, never fall to legacy; one writer mints atom + pointer + rendering in one transaction; one vocabulary module in the atom-contract package. Never add a read path, a vocabulary copy, or a value-holding cell. `_decisions/2026-09-11_ledger_as_serving_path_seven_steps.md`, ADR-031 amendment 2026-09-11, OPS-23 §0.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

AGENT-CONTRACT v1890f0bb — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
interruption recovery, slot law + lease, heavy-scan serialization, verification rules, close schema).
Read it before any work; where this dispatch and the contract disagree, STOP and report.

DEV-PROCESS vbb19bd34 — you are bound by 90_runbooks/DEV_PROCESS.md in full. It governs how work
is SHAPED and how a result is JUDGED: coverage figures travel with their denominator, classes are
measured never subtracted, an instrument's exclusion set is part of its contract, gating indicators are
proven able to fire, paired controls need a divergence test, guardrails that do not survive a clone are
not guardrails. Every rule in it is traced to an incident. Read it before any work.

FLEET-MEMORY v2a98086b — you are bound by 90_runbooks/fleet_memory_practice.md (M0).
The verbatim install block follows. Product-repo agents do not carry .cursor/rules; this is the install.

FLEET MEMORY (M0): As you work, capture build knowledge in a scratch block you return in your close, using four entry kinds — LESSON (a hard-won fact worth a test/note), DEAD-END (a tried-and-failed path + reason, so it is not retried), GROUND-TRUTH (a live-verified state WITH its timestamp), OPEN (a live thread the next context must pick up). Read any scratch context passed to you FIRST before re-deriving. Do NOT promote anything to durable memory yourself — return lessons in your close; the planner gates promotion. Nearing your limit, flush open threads + live ground-truths into your close so the next instance starts warm.

PLAN-ROW: P-155 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-engine

# PROGRAM CONTEXT — OPS-23 surface completion

You are working a lane of OPS-23. Everything below is program law for this lane. If it
conflicts with the general canon preamble, this section is narrower and wins on scope; if it
conflicts with the AGENT CONTRACT or ENFORCEMENT, those win. The plan is
`90_operations/OPS-23_surface_completion_program.md`; read sections 2, 3 and 7 before any work.

## The one goal

The Property Explorer panel, the map, the exported PDFs, and the Smart Site MCP connector show
the same facts for the same parcel, from one reader, with honest absences that name the city or
source that is missing. Six Central Texas counties first. **The customer surface is the
predicate.** A merged PR, a cortex read, a ledger count, or an MCP read alone does not close a
lane in this program.

## The five rulings (operator, 2026-09-11) — do not relitigate

- **R-1 MOST-CURRENT SOURCE WINS.** For setbacks and every dimensional rule, everywhere: the
  source with the most recent effective date supplies the value; tier breaks ties only when dates
  are equal or unreadable; dates are read from the source (ordinance effective date, ArcGIS
  `editingInfo.lastEditDate`), never assumed from source kind; unreadable dates produce a conflict
  row with both values, never a silent pick. `_decisions/2026-09-11_setback_source_most_current_wins.md`.
- **R-2 ENVELOPE DRAWN, FIGURE REFUSED.** The map and the MCP draw block draw the modelled
  buildable envelope from the same call with its disclosure wherever a district and a setback
  table exist. The buildable area number and percent stay refused until an envelope atom backs
  them. `_decisions/2026-09-11_ruling_b_reversed_polygon_only.md`.
- **R-3 THE CITY IS THE UNIT.** Zoning and setback work is scoped per city with a per-city
  predicate. Until a city is done, every absence string names the city.
- **R-4 THE SURFACE PROBE IS THE PREDICATE.** Your close cites a `surface-probe` artifact run
  after your deploy (or, until `scripts/surface-probe.mjs` lands, the raw output of the hand
  probes in OPS-23 §2 pasted verbatim) showing your change on the surface you claim to have
  changed.
- **R-5 THREE ROLES.** You are a lane. You do not commit to doc_repo; you hand artifacts back.
  You may fan one level per AGENT_CONTRACT §1 and verification stays with you.
- **R-6 THE LEDGER IS THE SERVING PATH AND ATOMS ARE CANONICAL.** A node is identity; an atom
  is one claim from one authority at one time; an edge is an atom whose value is a node. A cell
  is accounting: state, atom reference, provenance, and a cached rendering keyed to atom
  version and vocabulary version; a cell never holds a value as canon. One reader in
  `hauska-engine/services/retrieval-api` walks gated cells and dereferences atoms; every
  surface and the Hauska MCP catalog consume it; unslated rails refuse, never fall to legacy.
  One writer mints atom, pointer and rendering in one transaction. One vocabulary module in
  the atom-contract package. Never add a seventh read path, a second vocabulary, or a cell
  that copies a value. `_decisions/2026-09-11_ledger_as_serving_path_seven_steps.md`, OPS-23 §0.

## The probe set — every lane measures on these, and may add one, never remove one

`48021:34049` (1109 Pecan St, Bastrop, corner lot, improved 1906) · `48021:33223` (P-91 gold) ·
`48453:113408` (414 Spiller Ln, West Lake Hills, split situs) · `48453:474034` (2601 Sterling
Panorama Ct, unincorporated, Lake Pointe MUD) · `48453:367134` (5833 Taylor Draper Cv, Austin
SF-2). Calls: `GET https://smartsite.cloud/api/spine/property-atoms/<id>/facets`;
`POST https://smartsite.cloud/api/spine/cortex/api/brokerage/v1/place/buildable-envelope`
by address and by `{lat,lng}`; `POST .../brokerage/v1/map-data/gis-layer {"layer":"parcels","bbox":{west,south,east,north}}`.

## Facts a lane must carry (verified 2026-09-11; re-verify at source before relying)

- The panel reads facets through hauska-map's own adapter (`api/_lib/pe-property-atoms.ts`,
  `atom-chain-to-facets.ts`), `readPath: atom-chain`, not through cortex node-facets. The
  record-served setback cutover lives in LDT `nodeFacetTier1Assemble.ts` /
  `setbacksFactServeCutover.ts` and reaches `get_smart_site`, not the panel.
- The map draws an envelope only through `ExplorerMap.handleEnvelope`, fed by `InspectCard`
  from the sealed sheet (`fact-sheet-resolver.ts`); the card issues no lookup of its own
  (invariant I2). `sheetEnvelopeIsAtomPathPending` (`fact-sheet-resolver.ts:216-241`) is Ruling
  B's mechanism. `handleEnvelope` also gates drawing on `isEntitled` (Pro, unlocked, dev role);
  that gate is not yours to change.
- `resolveGeometry` (`fact-sheet-resolver.ts:2520-2660`) already accepts `hint.centroid`;
  `ExplorerMap.adoptSubject` passes only `{ geometry }`. The live parcel layer
  (`map-data/gis-layer`) returns the ring for a bbox around `cityLimitsFact.queryPoint`.
- cortex geocoding cannot find "414 SPILLER LN" with or without ", WEST LAKE HILLS, TX"
  (422 `geocode_miss` both ways). Placement must not depend on it.
- The feasibility engine (`hauska-engine-api-00198-cir`) completes Travis refreshes in 85 to
  154 s with 201; PE and smartsite-mcp abort at 55 s; the download endpoint serves the finished
  PDF in 0.2 s afterwards.
- Cell-state vocabulary is OPS-21's (`_catalog/program_preambles/OPS-21.md`). Six states. Use no other.

## What a lane in this program must not do

- Do not mint or backfill envelope atoms; that program resumes when P-152 closes.
- Do not change the entitlement gate or any pricing surface.
- Do not fix a naming mismatch by renaming; report it.
- Do not widen a check to admit a value it does not satisfy; report it.
- Do not read a working tree to verify a deploy; read the serving revision by field name and probe the surface.
- Do not write to a repository your seat does not own; request it from the owning seat via the close.

## Close requirements, in addition to AGENT_CONTRACT §6

- `probe:` the artifact path or the pasted raw output, per R-4.
- `falsifier:` the result you pre-registered that would have proved your change wrong, and what you observed.
- `contradicted:` what in the dispatch or the plan was wrong when you got there. "Nothing" is acceptable and must be said.
- `leave_behind:` per ENFORCEMENT.md.


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

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-11_p155-feasibility_cp1.json
  CP2: _inbox/2026-09-11_p155-feasibility_cp2.json
  CLOSE: _inbox/2026-09-11_p155-feasibility_close.json
