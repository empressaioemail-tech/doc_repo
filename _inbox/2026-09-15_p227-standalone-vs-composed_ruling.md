---
title: P-227 ruling — standalone vs. composed, three symptoms, three mechanisms
date: 2026-09-15
status: closed
type: ruling
lane: p227-standalone-vs-composed
owner: lane planner (cente-p227)
---

# P-227 ruling: the composed report is right and the standalone route is wrong — SEVERAL causes, not one

**Verdict: SEVERAL. Not H1 (one cause). Not "three that rhyme" as a shrug either — two of
the three have a confirmed, distinct, file-and-function mechanism inside hauska-engine; the
third does not have an hauska-engine-side mechanism at all.** Falsifier 3 warned against
concluding "one cause" without file+function for each symptom; the same discipline forbids
concluding "several" without doing the same work, so each leg is argued separately below with
its own evidence, including a live production log read (not an output measurement) for the
flood leg.

Repo: hauska-engine only, as scoped. Snapshot: `audit/p227-standalone-vs-composed` worktree,
branched from `origin/main` at `f77cf56` (fix(setbacks): P-219, PR #449).

## Leg 1 — X-ray / P-221: H1 CONFIRMED. A real composer-resolves/standalone-does-not asymmetry.

**Composed side:** `packages/engine-core/src/site-plan/feasibility-author.ts:145-149`
(`authorParcelFeasibilityExport`) calls `report-model.ts::composeParcelReport` (line 1119),
which calls `composeParcelReportFacts` (line 471). That function resolves **every** fact
family from live atoms/resolvers — including the verdict itself, computed in-process by
`composeVerdict` (`report-model.ts:282`) from the resolved facts. Nothing about verdict or
brief-fact content is caller-supplied on this path.

**Standalone side:** `packages/engine-core/src/site-plan/dossier-author.ts`
(`authorParcelPropertyDossierExport`, the X-ray/dossier route's author) never calls
`composeParcelReportFacts` at all. Its own module doc says so explicitly (lines 15-37):
verdict, cited brief facts, chat summary and owner notes arrive as **request-carried
`content`** (`AuthorParcelPropertyDossierExportOptions.content`, line 31-37: "Rendered
verbatim after server-side sanitization — the engine never fabricates or verifies
user-supplied content"). The function only independently resolves the *site-plan geometry*
leg (via the same `composeSitePlanModelForParcel` site plan uses) — never verdict, never
brief facts. When the caller's `content.verdictLine`/`content.brief` arrive empty,
`authorParcelPropertyDossierExport` correctly records `verdictIncluded: false` /
`briefFactCount: 0`, and the download route (`services/engine-api/src/routes/parcel-terrain.ts:591-597`)
correctly refuses with `pipeline_output_absent` — this is P-221's own observed error, and it
is the CORRECT-form refusal P-221 already named (must not be weakened; nothing here proposes
weakening it).

**Conclusion:** H1's literal claim — "the composer resolves inputs the standalone route does
not" — is TRUE for X-ray. This is a genuine engine-side architectural asymmetry: the dossier
route was built as a pure renderer for verdict/brief content, never a resolver for it, while
feasibility resolves everything itself. This is why P-221 happens and why it will keep
happening for any caller that doesn't independently pre-resolve a verdict before calling
dossier-export.

## Leg 2 — Flood / QA-01, QA-03: H2 CONFIRMED, NOT H1. Same mechanism class as P-155.

**Standalone side:** `services/engine-api/src/routes/flood-drainage.ts:85-129`. The
`POST /:parcelNodeId/flood-drainage/refresh` handler `await`s
`authorParcelFloodDrainageReport(...)` **synchronously**, inside the request/response cycle,
and returns 201 with the full study payload in one shot. No job, no poll, no async seam.

**Composed side:** `services/engine-api/src/routes/parcel-terrain.ts:792-856`. The
`POST /:parcelNodeId/feasibility-export/refresh` handler is **asynchronous**: it writes a
`queued`/`running` job record, fires `runFeasibilityJob(...)` **without awaiting it** (line
847: "Deliberately not awaited"), and returns 202 with a `jobRef` immediately; the client
polls `GET .../feasibility-export` and downloads separately. This is the P-155 async-refresh
pattern (`services/engine-api/src/routes/parcel-terrain.ts` feasibility routes; P-155 closed
2026-09-12, OPS-16 row text: "clients poll download instead of holding a 55 s socket").
`authorParcelFeasibilityExport` (`feasibility-author.ts`) runs the SAME kind of drainage
compute internally when `options.drainage.runWhenStale` is set (`report-model.ts:1149-1165`,
`resolveParcelDrainage` at line 1033) — but because it runs inside the detached async job, its
wall-clock time never has to fit inside one HTTP request/response.

**Falsifier 1, run for real, not skipped:** "Read the engine's request log for a standalone
drainage run BEFORE touching the engine. If the engine returns 2xx after the client has gone,
H2 is live for flood." Read via `gcloud logging read` against Cloud Run's own request log for
`hauska-engine-api` (project `hauska-prod-497015`, not a proxy, not `latestReadyRevisionName`)
for parcel `48453:289990` — the exact parcel QA-01/QA-03 name — on 2026-09-15:

```
15:55:43Z  POST .../48453:289990/flood-drainage/refresh   201   latency 75.187354072s
15:57:31Z  POST .../48453:289990/flood-drainage/refresh   201   latency 69.573613222s
16:01:36Z  POST .../48453:289990/flood-drainage/refresh   201   latency 56.165706981s
```

Three attempts in the same session, all **201 (success)**, at 56–75 seconds — the engine never
failed once on this parcel; it simply took as long as the documented pre-P-155 feasibility
runs did (85–154 s for Travis parcels). QA-03's feasibility PDF for the same parcel is stamped
`FD-48453-289990 | generated 2026-09-15 16:11Z`, chronologically right after these standalone
attempts — consistent with the same session the operator described. A synchronous call taking
56–75 s will be aborted by any client/proxy holding to a budget anywhere near the documented
55 s (`FEASIBILITY_ENGINE_TIMEOUT_MS`)/60 s (Vercel `maxDuration`) precedent already named in
this dispatch for the sibling feasibility path, while the engine keeps running and eventually
succeeds — exactly the "2xx after the client has gone" signature Falsifier 1 named.

**Conclusion:** H1 is WRONG for flood, stated even though H1 is the tidier story, per
Falsifier 1's own instruction. This is a timeout defect (synchronous route, client aborts
before the engine's real success), not an input-resolution defect, and it is the same
mechanism class P-155 already fixed for feasibility — a different code path, same defect
shape.

## Leg 3 — Site plan / P-222 D3: NEITHER H1 NOR H2. The engine's own code is symmetric here.

**Standalone side:** `services/engine-api/src/routes/parcel-terrain.ts:410-422`
(`/site-plan-export/refresh`) builds `descriptor` from `parsed.data.address` /
`parsed.data.countyName` — present only if the caller's JSON body includes them.

**Composed side:** `services/engine-api/src/routes/parcel-terrain.ts:726`
(`runFeasibilityJob`) builds `descriptor: { address: body.address, countyName: body.countyName }`
— the SAME fields, from the SAME kind of request body, on the SAME service.

Both eventually call the SAME function, `packages/engine-core/src/site-plan/author.ts`'s
`composeSitePlanModelForParcel`, whose own doc is explicit (line 246-247): "PDF
summary-block-only descriptors (Wave 2). **Caller-supplied only.**" There is no live
resolver fallback for address/county identity in this function on EITHER call path. The
`CHIP_NO_ADDRESS` / `"No addressed record on file for this parcel."` text
(`pdf/format.ts:75-81,113`) is a deliberate, documented honest-absence chip for "the caller
simply did not include this" — not a bug in the rendering logic. And the composed report's
own printed header does not get a better value from anywhere else: `pdf/feasibility.ts:1267-1268`
shows the header uses `model.geometry.model.summary.address` — literally the same
descriptor-derived field the standalone renderer uses — with `descriptorOverride` only
substituted when geometry composition itself failed outright, not as a general enrichment.

**Falsifier 2, applied exactly as written:** "If the composer and the standalone route call
the SAME resolver with the same vintage, then input resolution is not the cause and H1 needs
a different mechanism or must be abandoned." They do call the same resolver, with the same
(absent) vintage handling, on the same service. **H1 is abandoned for this leg, as instructed.**

**Conclusion:** hauska-engine's own code treats the composed and standalone calls
identically for parcel identity. The observed divergence — composed correctly labeled,
standalone showing a false miss, same session — cannot be explained by anything inside this
repo. It has to come from what the caller (whatever service constructs the POST body for each
of these two hauska-engine endpoints — the Smart Site app backend, PE, or smartsite-mcp,
not determined here) actually sends as `address`/`countyName` on each call. That code is
outside hauska-engine and outside this lane's repo scope. This is reported as an honest
"could not be resolved in this repo," not stretched into a hauska-engine finding it isn't.

## Second mechanism — explicitly ruled OUT for all three legs

The dispatch names a real documented precedent (PE reading hauska-map's own atom chain
instead of cortex) and requires ruling a same-shape vintage/adapter/service divergence in or
out here, not skipping it. `services/engine-api/src/server.ts:174-186` mounts
`buildParcelTerrainRoutes()` (site-plan, feasibility, dossier, terrain) AND
`buildFloodDrainageRoutes()` (flood) on the SAME `v1` Hono sub-app, in the SAME
`hauska-engine-api` service, deployed as ONE revision. There is no second service, no second
adapter, no second vintage in play for any of the three symptoms — composed and standalone
requests for the same parcel in the same session hit the same process. **Ruled OUT for all
three legs**, by reading the route mounting, not by comparing output.

## Disposition: does anything need a new row?

**Nothing new is needed for flood.** The search recorded in
`_inbox/2026-09-15_reports_scope_handoff.md` ("nothing found covers the flood route failing
to produce") is confirmed still true, and it does not need to be filled with a new row: **P-227
itself already names the standalone flood generate-failure as one of its own three symptoms.**
P-227 absorbs it. The named fix (not built here, per the diagnostic-only mandate): port the
`feasibility-export/refresh` async-job pattern (202/jobRef/poll/download) onto
`flood-drainage/refresh`.

**X-ray's fix is P-120's already-ruled direction, and it happens to also retire P-221.**
P-120 (2026-09-07) ruled "redefine X-Ray as a subset view of the Feasibility model rather than
a separately-derived assembler" — not re-decided here, per instruction. Read against this
session's findings: building X-ray as a subset renderer over `composeParcelReport`'s own
output (the same call feasibility already makes) means X-ray would inherit
`composeParcelReportFacts`'s in-process verdict/fact resolution and would stop depending on a
caller to pre-supply `content.verdictLine`/`content.brief` at all — which is precisely what
P-221 is missing today. **P-120's stalled ruling is not a separate concern from P-221; building
it is P-221's fix.**

**Site plan's identity gap needs a lane in a different repo, not hauska-engine.** Whichever
service builds the POST body for `/site-plan-export/refresh` needs to be read to see why it
doesn't forward an address the same session's feasibility call demonstrably has. Not
determined here (out of scope: repo assignment was hauska-engine only, and "you own your fan"
does not extend to chasing a finding into another repo without a new dispatch).

## Proposed sequence for QA-02 (respecting P-221's blocker; P-120 not re-decided)

1. **Build X-ray as a subset renderer over `composeParcelReport`'s model** (P-120's already-
   ruled direction), reusing the SAME resolved `ParcelReportModel` — including its
   already-computed verdict — that feasibility produces. This retires P-221's root cause by
   construction: a subset renderer over an internally-resolved model has no caller-supplied
   content gap to be hollow.
2. Only after step 1, gate the subset's SECTION LIST against P-119's tier definition before
   it ships: X-ray is a Solo deliverable, feasibility (the model it derives from) is Studio,
   so whichever sections/exhibits are Studio-exclusive (site plan CAD/DXF/IFC, terrain export,
   any Studio-only fact family) must be excluded from the X-ray render path, not merely
   omitted from the UI. This is a real, unaddressed constraint on the operator's 3-4-sheet
   target and needs its own explicit allow-list, not an inherited one.
3. Flood's async-job port (Leg 2's fix) is independent of steps 1-2 and can run in parallel or
   first — it shares no code with the X-ray/feasibility model path.
4. Site plan's identity gap (Leg 3) needs its own follow-on lane scoped to whichever repo
   constructs that request body, sequenced whenever, since it does not block QA-02 or the
   flood fix.

## Falsifier outcomes (pre-registered in the dispatch, answered honestly)

1. **"If the engine log shows a standalone drainage run returning 2xx after the client
   aborted, H1 is WRONG for flood and you must say so even though H1 is the tidier story."**
   — Confirmed true. Said so in Leg 2.
2. **"If the composer and the standalone route call the SAME resolver with the same vintage,
   then input resolution is not the cause and H1 needs a different mechanism or must be
   abandoned."** — Confirmed true for site plan. H1 abandoned for that leg in Leg 3.
3. **"If you find yourself concluding 'one cause' without a file and function for each of the
   three symptoms, you have pattern-matched rather than read."** — Not concluded "one cause."
   Each leg above carries its own file(s) and function(s) on both the composed and standalone
   side, argued independently, with two legs (X-ray, flood) landing on DIFFERENT confirmed
   mechanisms from each other, and the third (site plan) landing on no hauska-engine mechanism
   at all rather than being folded in for tidiness.
