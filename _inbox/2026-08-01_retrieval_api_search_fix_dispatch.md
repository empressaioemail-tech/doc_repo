---
id: 2026-08-01_retrieval_api_search_fix_dispatch
title: DISPATCH — fix retrieval-api /search (down since ~07-28, OOM in substrate-mode) + add a search health-probe/alert
date: 2026-08-01
status: dispatch (diagnose+fix engine code; verification never delegated)
owner: nick
related: [2026-08-01_retrieval_api_search_down_incident, 2026-08-01_pe_chat_citations_retrieval_empty_diagnosis]
purpose: retrieval-api /search is the true blocker behind PE chat citations. Planner diagnosed it live to the code layer (below). Fix the substrate-mode search path so /search serves BDC atoms, add a health-probe that exercises search (this was silently down ~4 days because /health only checks liveness), redeploy. Then planner merges the already-open ldt #370 + verifies live.
---

# Fix retrieval-api /search

## THE PROBLEM (planner diagnosed live — start from the root, do not re-discover)
`hauska-retrieval-api` (project hauska-prod-497015, us-central1) `/search` returns 503/OOM on every revision; no successful /search 200 since ~2026-07-28. It is the substrate PE chat cites code atoms from — while it's down, chat gets zero sources and honestly shows no citations. `/health`=200 (liveness only) so nothing alerted.

Live evidence (raw in the incident doc 2026-08-01_retrieval_api_search_down_incident.md):
- 00030-x7r (07-31, 1Gi, was serving): SIGABRT on BOOT, `JavaScript heap out of memory`.
- 00045-yek (tag bdc, 1Gi): boots, OOMs at QUERY time on first /search.
- 00051-jab (planner memfix: 4Gi/2CPU, NODE_OPTIONS=--max-old-space-size=3584, MEMORY_LIMIT_MIB=3584): boots, logs `corpus.snapshot_skipped`→`corpus.loaded`→`server.started`, but /search STILL 503/SIGABRT.

## THE ARCHITECTURE (from source — why a memory bump did NOT fix it)
- `services/retrieval-api/src/boot-storage.ts`: when SUBSTRATE_DATABASE_URL/DATABASE_URL is set, search serves from the SUBSTRATE DB (Neon/pgvector); the in-memory snapshot is a local/dev fallback that is SKIPPED. Both 00008 and 00051 HAVE DATABASE_URL set → substrate-mode → `corpus.snapshot_skipped` is EXPECTED.
- `services/retrieval-api/src/resource-headroom.ts`: G2 gate. SNAPSHOT_HEAP_INFLATION=8, HEADROOM_FRACTION=0.7, default limit 1024. Snapshot is only 72.8MB on disk — a 73MB file needing >4Gi is a PATHOLOGICAL allocation, not a size problem.
- INFERENCE (confirm or refute with the code): the fault is in the substrate-mode `/search` path (DB wired but the query 503s), and/or the headroom/boot gate mis-routes so it still tries to load+index the snapshot in substrate-mode and OOMs. More memory only delays it. This is a CODE defect.

## YOUR TASK
1. DIAGNOSE the substrate-mode `/search`. Read `services/retrieval-api/src/` — the /search handler, boot-storage, resource-headroom, and the substrate query path. Answer with evidence:
   - Does substrate-mode ACTUALLY skip the snapshot, or does /search still touch an in-memory index that OOMs?
   - Is DATABASE_URL/SUBSTRATE_DATABASE_URL pointing at a substrate DB that HAS the BDC code atoms + a working pgvector index? (verify live — SELECT the atom / check the index). Migration-merged != applied-to-live-DB.
   - What is the 73MB→>3.5GB allocation (JSON.parse of the whole corpus? building an in-memory index the substrate path shouldn't build? a loop)? Name the line.
2. FIX so `/search` serves. Likely one of: (a) substrate-mode truly bypasses the snapshot load/index and queries pgvector; (b) if snapshot-mode is the intended prod path, fix the pathological allocation and right-size heap honestly. Do NOT just raise memory and hope — fix the cause.
3. ADD A SEARCH HEALTH PROBE + ALERT (operator ruling — this was silently down ~4 days): a health endpoint that runs a real bounded /search-equivalent query and returns non-200 when search fails (extend /health/spine or add /health/search), so a dead search path can't stay silent. Wire it so it can back an alert.
4. PROVE ON LIVE: `GET /search?jurisdiction=bastrop_tx&q=GC General Commercial permitted uses dimensional standards&limit=8` (Authorization: Bearer <HAUSKA_ENGINE_API_KEY>) returns real BDC atoms incl. `bastrop_tx-bdc-2026-adopted/14-02-003`. Paste raw BEFORE (503) and AFTER (200 + atoms).
5. REDEPLOY per services/retrieval-api/DEPLOY.md (Cloud Build `--source .`, canary `--no-traffic --tag` → probe /search → shift-traffic). Deploy is PLANNER-OWNED — you may deploy a --no-traffic canary + report the tag URL + raw probe; planner shifts traffic after verifying. (If you cannot deploy, hand back the built image/branch + the exact deploy cmd.)

## DELIVER
Root-cause (which of a/b/c, proven), the code fix (PR base main, CI green on HEAD SHA, in hauska-engine), the search health-probe, and raw BEFORE/AFTER live /search output. Name every file touched.

## DISCIPLINE / STANDING DECISIONS (travel in this dispatch)
Isolated worktree off origin/main. Stage explicit paths. Build+tests+CI green on HEAD SHA. This is a SHARED SPINE service — do NOT shift production traffic without planner (canary --no-traffic only); planner re-runs the /search probe + a live PRO-mode Bastrop chat to verify [n] chips before declaring fixed (verification never delegated). No-special-data-access (substrate serves via uniform corpus). Cloud Run traffic-trap: a deploy makes a new revision but prod serves OLD until explicit shift — never assume latestReady == serving. --set-env-vars is authoritative-replace (use --update-env-vars additive, or include all vars). Migration-merged != applied-to-live-Neon: verify BDC atoms are actually in the DB the live service reads. No timeframe estimates. Paste raw command/probe output, never summarize.

## AFTER THIS LANDS (planner)
Merge+deploy ldt #370 (routes cortex-api chat retrieval to the now-healthy /search; already open, CI green, safe). Then live-verify: /search probe returns BDC + a PRO-mode chat on a Bastrop parcel shows [n] atom-chip citations. Only then is the citations thread closed.
