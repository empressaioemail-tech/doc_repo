---
id: 2026-08-01_retrieval_api_search_down_incident
title: INCIDENT — retrieval-api /search is DOWN (has been since ~07-28); it is the true wall behind PE chat citations
date: 2026-08-01
status: open incident (planner diagnosed to code layer; engineering fix needed in hauska-engine retrieval-api search path)
owner: nick
related: [2026-08-01_pe_chat_citations_retrieval_empty_diagnosis, 2026-07-29_pe_ai_chat_atom_citations_spec]
purpose: While verifying PE-citation fix #370 (which routes chat retrieval to retrieval-api substrate), found the substrate itself is DOWN. retrieval-api /search returns 503/OOM on every revision. #370 is correct+safe but INERT until /search is restored. This records the full live diagnosis so the engineering fix is targeted, not trial-and-error.
---

# retrieval-api /search DOWN — incident record

## HEADLINE
PE chat citations have failed 4 passes. Root cause is NOT rendering, NOT the jurisdiction key, NOT #370. It is: **retrieval-api `/search` (the code-atom substrate the chat cites from) is returning 503/OOM and has served no successful `/search` 200 since ~2026-07-28.** With no substrate, the chat receives zero code-atom sources and honestly emits no citations (anti-fabrication working as designed).

## SERVICE
- `hauska-retrieval-api`, project `hauska-prod-497015`, region us-central1. Base URL https://hauska-retrieval-api-h7gvu7rgcq-uc.a.run.app.
- `/health` = 200 (liveness only). `/search` = 503. Auth: `Authorization: Bearer <HAUSKA_ENGINE_API_KEY>` (resolver chain BRIEF_RETRIEVAL_API_KEY→RETRIEVAL_API_KEY→HAUSKA_ENGINE_API_KEY→SERVICE_API_KEY). Contract: `GET /search?q=<question>&jurisdiction=<slug>&limit=<n>`.

## LIVE EVIDENCE (raw)
- Serving rev cycled during the incident; auto-settled to `00008-ber` (07-05, 1Gi), /health 200, /search non-serving.
- `00030-x7r` (07-31, 1Gi, was serving): SIGABRT on BOOT — `FATAL ERROR: ... JavaScript heap out of memory` → `Uncaught signal: 6`. STARTUP TCP probe fails; container never starts.
- `00045-yek` (tag `bdc`, 1Gi): boots (probe succeeds ~18:01) but SIGABRT OOM at QUERY time on first /search (18:02: `Reached heap limit ... heap out of memory`).
- Planner deployed `00051-jab` (memfix): image = 00030's, bumped to **4Gi/2CPU + NODE_OPTIONS=--max-old-space-size=3584 + MEMORY_LIMIT_MIB=3584** (via `--update-env-vars`, additive, preserved RETRIEVAL_API_KEY/CORPUS_SNAPSHOT_PATH). Result: boots, logs `corpus.snapshot_skipped` → `corpus.loaded` → `server.started`, probe OK — but /search STILL 503/SIGABRT.

## THE REAL ARCHITECTURE (from source — why memory-bump did not fix it)
- `services/retrieval-api/src/boot-storage.ts`: when `SUBSTRATE_DATABASE_URL`/`DATABASE_URL` is set, the service serves search from the SUBSTRATE DB (Neon/pgvector); the in-memory snapshot is SKIPPED (snapshot-only is a local/dev fallback). BOTH 00008 and 00051 HAVE DATABASE_URL set → both are in substrate-mode → the `corpus.snapshot_skipped` log is EXPECTED, not the bug.
- `services/retrieval-api/src/resource-headroom.ts`: G2 gate. `SNAPSHOT_HEAP_INFLATION=8`, `HEADROOM_FRACTION=0.7`, `resolveMemoryLimitMib` default 1024. Snapshot is only **72.8 MB on disk** — projected ~584MB. A 73MB file should NOT need >4Gi; the real heap blows far past the 8x projection. The 1Gi boot/query OOMs are the SNAPSHOT path OOMing; but substrate-mode is supposed to skip that.
- CONCLUSION: the fault is in the **substrate-mode `/search` path** (DB is wired but the query 503s), and/or the headroom gate mis-routes so it still tries the snapshot and OOMs. This is a CODE defect in retrieval-api, not a resource-sizing knob. A 73MB corpus consuming >3.5GB heap = a pathological allocation in the load/index/search path, not a size problem. More memory only delays it.

## WHAT #370 DOES (correct, safe, but inert until this is fixed)
ldt PR #370 (fix/pe-bastrop-bdc-substrate-retrieval, HEAD e0d48ab, CI green, MERGEABLE, base main, dep #368 merged): routes cortex-api `retrieveAtomsForQuestion` to `GET /search` first, falls back to Neon on any non-ok (incl. 503) → returns []. So deploying #370 with /search down = graceful degrade to current Neon behavior (honest-empty). SAFE to merge, but citations will NOT appear until /search serves. Do NOT merge-and-declare-fixed; that would be the 4th false-fix.

## STATE LEFT
- Traffic auto-settled to 00008-ber (1Gi, /health 200, service not hard-down). memfix canary 00051 exists at tag `memfix` (0% traffic). No further blind redeploys — handed to engineering.
- Standing decision honored: this is a shared hauska-engine SPINE service; deploys planner-owned but the FIX is a code change in retrieval-api's search path, which needs an engineering read of `services/retrieval-api/src/` (boot-storage, resource-headroom, the /search handler + substrate query).

## MONITORING GAP (address WITH the fix, per operator ruling)
A core spine service served zero successful `/search` 200s for ~4 days (~07-28 → 08-01) with NO alert. `/health` stayed 200 the whole time (it only checks liveness, not the search backend), so nothing fired. The fix MUST include a health signal that actually exercises `/search` (or the substrate query) so a dead search path CANNOT stay silent again — a `/health/search` (or extend `/health/spine`) probe that runs a real bounded query + returns non-200 when search fails, wired to an alert. Fold into the retrieval-api fix; not a separate workstream.

## RESOLVED 2026-08-01 — /search RESTORED, root cause was an unbounded SELECT (not memory)
Root cause (proven by the fix agent, verified live by planner): NOT the snapshot, NOT memory. Substrate-mode correctly skips the snapshot; `PgStorage.search` ran `SELECT body FROM atoms ORDER BY updated_at DESC` with NO WHERE/LIMIT against a live table of 3,676,098 atoms (~7.5GB heap materialization) → OOM/SIGABRT on the first /search. The 4Gi memfix only delayed it; the real fix works at 1Gi.
FIX (hauska-engine PR #201, HEAD 09748542, CI green, MERGED): PgStorage.search does SQL pushdown (jurisdiction/entityType/token-q filters, default code-corpus types, SEARCH_CANDIDATE_CAP=2000) so it never materializes the whole table. Plus GET /health/search (bounded live search, returns non-200 when search fails — closes the silent /health=200 gap that hid this for ~4 days). Plus a data upsert of bastrop_tx snapshot atoms (318) so BDC sections incl. 14-02-003 exist live.
PLANNER-VERIFIED LIVE (own probes, not the agent's word): canary 00052-suj (1Gi) → /health/search {"status":"ok",resultCount:3,latencyMs:236}; /search bastrop_tx GC → HTTP 200, 8 results, has 14-02-003 TRUE, ~236ms, no OOM. Shifted prod traffic 00045→00052 (100%); PROD base URL now /search HTTP 200 + 14-02-003 + /health/search ok (198ms). Incident CLOSED.
DOWNSTREAM (also deployed): ldt #370 (MERGED, cortex-api routes chat retrieval to the now-healthy /search) → cortex-api canary 00454 smoke 200 → traffic shifted 100%. cortex-api prod healthy.
LEFT-TO-OPERATOR: the final hop (live PRO-mode PE chat with a user session → [n] atom-chip citations render) needs a real logged-in chat — operator QA. Everything up to the app boundary is planner-verified: retrieval-api serves the BDC atoms; cortex-api routes to it.
ALERT STILL OWED (planner pickup from the audit): wire an alert on GET /health/search != 200 (and the broader S-tier alert set in the spine-health ledger).

## NEXT (engineering fix, then planner verify)
1. Read retrieval-api `/search` substrate-mode path: why does a DB-backed query 503/OOM? Is DATABASE_URL pointing at a substrate DB that actually has the BDC atoms + pgvector index? Is the headroom gate wrongly loading the snapshot in substrate-mode?
2. Fix the search path (likely: ensure substrate-mode truly skips snapshot AND the pgvector query works; or right-size the snapshot-mode heap if that's the intended path). Prove with `GET /search?jurisdiction=bastrop_tx&q=GC...` returning the BDC atoms (incl. bastrop_tx-bdc-2026-adopted/14-02-003).
3. Redeploy retrieval-api (Cloud Build `--source .` per services/retrieval-api/DEPLOY.md; canary --no-traffic --tag → probe /search → shift).
4. THEN merge+deploy #370 (cortex-api). Planner re-runs the /search probe + a live PRO-mode chat on a Bastrop parcel → confirm [n] chips render. Verification never delegated.
