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

## OPEN DEFECT 1 — PE serves baked-snapshot, NOT the retrieval atom-chain (the real blocker)
Live: BOTH 34137 (warmed, should be atom-chain) AND 141364 (superseded) serve `source: baked-snapshot, adapterKey: node-facets:tier1, declineReason: atom_path_pending` on the PE facets path. The PE serverless adapter is NOT reading the (healthy, correct) retrieval atom-chain — it falls back to the cortex node-facets snapshot for EVERY parcel. So the PE serve-fix (mapWarmVerifyDeclineEnvelope) never fires, and 141364 does NOT show the superseded decline; ALL parcels lose their certified atom-chain data on serve.
- This PREDATES the combined deploy: the 4h-ago branding-only prod deploy (98s9esonv) ALSO snapshot-serves 34137. So it is NOT a combined-branch regression — the PE->retrieval read has been falling back to snapshot since some point today. Earlier this session 34137 served `source: atom-chain` (F25/S5/R25), so the atom-chain read worked earlier and stopped.
- Retrieval is NOT the cause (verified healthy + correct via direct curl). Env is present + correct (HAUSKA_RETRIEVAL_API_URL -> the right live host, PROPERTY_ATOM_PATH set, HAUSKA_RETRIEVAL_API_KEY set).
- ROOT CAUSE UNKNOWN from outside — it's inside the PE serverless function runtime: the retrieval call is likely erroring and being caught -> snapshot fallback. Needs Vercel function LOGS or a local run of the api/_lib/atom-chain path against prod retrieval. Candidate causes: an auth/header mismatch on the server-side retrieval call, a response-shape change, a thrown error swallowed to fallback, or a serverless env/timeout. OWNER: the Phase D planner (owns atom-chain-to-facets + can read function logs).

## OPEN DEFECT 2 — slate honest-absence token (#7C8BA0) NOT in the bundle
The design-system recolor moved honest-absence to `--semantic-absence #7C8BA0` (verified in pe-tokens.css + the 3 recolored files on the branch), but the built prod bundle has 0 hits for 7C8BA0. So the honest-absence recolor is not reaching the built CSS. Likely: the recolors use `var(--semantic-absence)` (a CSS var, not the literal hex), so grepping the JS bundle for the hex won't find it — the hex lives in the imported pe-tokens.css, which may be a separate CSS asset, not index-*.js. THIS MAY BE A FALSE ALARM (grep looked in the wrong asset). Verify by grepping the built CSS asset (not just index.js) for 7C8BA0 / --semantic-absence, OR visually confirm honest-absence renders slate on prod. Low-risk; likely-fine.

## WHAT IS NOT BROKEN (do not thrash)
Retrieval (correct+healthy), the R27 fix (verified), the combined branch code (typecheck+tests green), prod stability (200). The blocker is ONLY the PE->retrieval runtime read (Defect 1). Defect 2 is likely a grep-in-wrong-asset false alarm.

## NEXT (hand-off)
Phase D planner: diagnose Defect 1 from the PE function's runtime (logs / local run) — why does the server-side retrieval atom-chain call fall back to snapshot for all parcels when retrieval is healthy? That is the last mile of the 141364 R6 gate AND it restores certified atom-chain serving for ALL warmed parcels. Do NOT merge PR #213 until PE serves the atom-chain again (the gate). Planner (doc_repo) holds the deploy; retrieval is done.
