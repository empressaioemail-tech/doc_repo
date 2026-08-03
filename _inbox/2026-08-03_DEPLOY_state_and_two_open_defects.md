---
id: 2026-08-03_DEPLOY_state_and_two_open_defects
title: DEPLOY STATE — retrieval R27 fix LIVE + verified; PE combined deployed but 2 open defects (PE snapshot-fallback, missing slate token)
date: 2026-08-03
status: partial — retrieval done+verified; PE deployed stable but atom-chain read + one token unresolved (hand-off)
owner: nick
related: [PHASE_D_layer23_cohort_full_coverage, REBRAND_IMPL_design_system_wiring, FINDING_2026-08-03_factory_product_setback_disconnect]
---

# DEPLOY STATE + two open defects

## DONE + VERIFIED
- retrieval-api R27 fix DEPLOYED to prod (hauska-retrieval-api rev 00054-wex, 100% traffic, from hauska-engine@4cdf607). VERIFIED live: 141364 atom-chain serves buildableEnvelope with warmVerifyDeclineCode=superseded-prop-id, setbackRule=null, extractedAt 2026-08-03T15:11:03. 34137 serves active envelope + setbackRule. Retrieval is healthy (/health 200) and CORRECT for both parcels.
- PE combined branch `rebrand/combined-deploy` (design-system + Button + map-chrome + citations/PDF + PE serve-fix) merged clean, typecheck green, 133 touched-suite tests pass, DEPLOYED to PE prod (property-explorer-91pv6d2hf, aliased to property-explorer-xi). Prod is STABLE (HTTP 200). No rollback needed.
- Bundle branding PARTIAL: teal atom #4CC9C0 present, SMART SITE present, old purple #c4b5fd gone.

## OPEN DEFECT 1 — RESOLVED (2026-08-03 ~11:52 CT)

**Root cause:** `atomPathReason: atom-chain HTTP 401` — Vercel `HAUSKA_RETRIEVAL_API_KEY` (set 11d ago) did **not** match retrieval-api rev `00054-wex` `RETRIEVAL_API_KEY`. PE caught 401 as definitive failure → `stripCortexEnvelopeProductTruth` → baked-snapshot + `atom_path_pending` for **every** parcel.

**Not:** response-shape mismatch, timeout, or combined-branch regression. Retrieval direct curl with Cloud Run key = 200.

**Fix applied:**
1. Synced Vercel Production `HAUSKA_RETRIEVAL_API_KEY` to match Cloud Run `RETRIEVAL_API_KEY`.
2. Redeployed PE prod (same combined commit + new env).
3. Pushed `feat/phase-d-pe-serve-fix` @ `acd85f0` — fail-closed on 401 (503 `retrieval_auth_failed`, no snapshot lie) + `mapWarmVerifyDeclineEnvelope`.

**Live verify post-fix:**
- `48021:34137`: `X-PE-Read-Path: atom-chain-warm`, F25/S5/R25, geojson ok
- `48021:141364`: `declineReason: superseded-prop-id`, `snapshotAt: 2026-08-03T15:11:03.320Z`

**R6 gate:** PE serves atom-chain again; 141364 shows named superseded decline. Ready for operator merge #213 decision.

## OPEN DEFECT 2 — slate honest-absence token (#7C8BA0) NOT in the bundle
The design-system recolor moved honest-absence to `--semantic-absence #7C8BA0` (verified in pe-tokens.css + the 3 recolored files on the branch), but the built prod bundle has 0 hits for 7C8BA0. So the honest-absence recolor is not reaching the built CSS. Likely: the recolors use `var(--semantic-absence)` (a CSS var, not the literal hex), so grepping the JS bundle for the hex won't find it — the hex lives in the imported pe-tokens.css, which may be a separate CSS asset, not index-*.js. THIS MAY BE A FALSE ALARM (grep looked in the wrong asset). Verify by grepping the built CSS asset (not just index.js) for 7C8BA0 / --semantic-absence, OR visually confirm honest-absence renders slate on prod. Low-risk; likely-fine.

## WHAT IS NOT BROKEN (do not thrash)
Retrieval (correct+healthy), the R27 fix (verified), the combined branch code (typecheck+tests green), prod stability (200). The blocker is ONLY the PE->retrieval runtime read (Defect 1). Defect 2 is likely a grep-in-wrong-asset false alarm.

## NEXT (hand-off)
Phase D planner: diagnose Defect 1 from the PE function's runtime (logs / local run) — why does the server-side retrieval atom-chain call fall back to snapshot for all parcels when retrieval is healthy? That is the last mile of the 141364 R6 gate AND it restores certified atom-chain serving for ALL warmed parcels. Do NOT merge PR #213 until PE serves the atom-chain again (the gate). Planner (doc_repo) holds the deploy; retrieval is done.

## RESOLVED 2026-08-03 (correcting the diagnosis above)
Defect 1 root cause was NOT "pre-existing/unknown-runtime" — it was an API-KEY DESYNC caused BY the retrieval redeploy. The `gcloud run deploy --source` of retrieval-api (rev 00054-wex) rotated `RETRIEVAL_API_KEY`; Vercel's PE held the 11-day-old key -> PE->retrieval 401 -> PROPERTY_ATOM_PATH=1 fell through to cortex snapshot + atom_path_pending for every parcel. The "4h-ago build also broken" observation was because my FIRST retrieval touch had already desynced the key. Direct curl with the OPERATOR key returned 200, masking the app's 401. Smoking gun: PE runtime exposed atomPathReason: "atom-chain HTTP 401".
FIX: synced Vercel Production HAUSKA_RETRIEVAL_API_KEY to the Cloud Run key + redeployed PE. VERIFIED live: 34137 atom-chain ok F25/S5/R25; 141364 atom-chain declined superseded-prop-id; GC/MU/RR spot-checks all atom-chain ok. THE R6 GATE IS MET. Guardrail (503-on-401, no silent snapshot fallback) on hauska-map feat/phase-d-pe-serve-fix @ acd85f0 (optional prod deploy). Lesson captured: memory cloud-run-source-deploy-rotates-api-key.
