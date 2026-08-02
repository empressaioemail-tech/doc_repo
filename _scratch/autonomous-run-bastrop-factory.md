# Autonomous run — Bastrop factory (planner scratchpad)

Plan: OPS-0 MASTER game plan. Run Phases A+B+C autonomously, STOP at operator R6 (Phase D). Notify at phase gates.

## GROUND-TRUTH (live state, timestamped)
- GROUND-TRUTH (2026-08-02): A1 DONE — fleet-memory.mdc merged into all 5 product repos (hauska-engine #202, hauska-map #143, ldt #373, hauska-mcp #56, smartcity-os #33). Verified each PR contained the file + CI green before merge. cc-agent-reach gap #1 CLOSED.
- GROUND-TRUTH (2026-08-02): Phase A engine lane (A2-A6) DISPATCHED to background agent a47386e55953aca88 (Sonnet). One PR expected: feat(engine): Phase A foundation. Covers cert-to-main, recipe-version, registry loader, R7-at-bake, determinism-hash.
- GROUND-TRUTH (2026-08-02): Phase A7 ledger lane DISPATCHED to background agent a89cbbe3bd5aae8e8 (Sonnet). One PR expected in ldt: performance fields on county_facet_coverage.

## OPEN
- OPEN: await engine-lane + ledger-lane PRs → verify each against live (not on agent word) → merge on green → GATE A.
- OPEN: A2 must be verified as the FULL 4-gate cert (not the partial r31-regrade) before it counts as "cert reproducible."
- OPEN: A6 — confirm timestamps actually excluded from content-hash (agent may find they already are).

## DEAD-END / TRAPS to watch (from memory)
- DEAD-END: merging on local-test-green ≠ CI green (ldt A7 has the hardcoded-list schema trap — CI authoritative).
- TRAP: :latest image-race on deploys (Phase B/C) — SHA-pin. Cloud Run traffic-trap — verify serving revision. describe-cache-lag — trust base-URL behavior.
- TRAP: shared-clone concurrent-commit — stage explicit paths; other agents commit in the shared clone.

## GUARDRAILS (planner enforces)
Merge only on green CI + head-SHA verify. Deploy SHA-pinned + serving-verified. Every warm block area-swept before next. Anti-fabrication + honest-absence. Failing gate STOPS the lane → fix root cause, never force. Block-13 QUARANTINED. Stop at R6.

## DEAD-END (2026-08-02): background general-purpose agents defer instead of executing heavy builds
Dispatched A3-A6 (engine) + A7 (ledger) to background Sonnet general-purpose agents. ALL returned "running in the background, I'll report back" with ZERO work done — no branches pushed, no PRs. 3/3 orphaned. This is the nested-agent-fan orphan trap: a coordinator-shaped agent that fans/defers and returns.
LESSON: for heavy multi-step BUILD work (schema+code+tests), background general-purpose dispatch is UNRELIABLE — the agent treats it as "set up a job" not "do it." Do heavy builds DIRECTLY (planner executes) or with a stricter "deliverable = pushed branch+PR, do it NOW, do not defer" contract. Mechanical single-step work (install a file, merge a verified branch) dispatches fine.
APPLIED: A1 (dispatch, worked — single-step file install) + A2 (direct, worked). A3-A6+A7 → build DIRECTLY.

## PHASE A CHECKPOINT (2026-08-02) — 6/7 lanes DONE + merged, A6 deferred
- GROUND-TRUTH (2026-08-02): A1 MERGED (fleet-memory ×5 repos). A2 MERGED (#203 cert script on main). A3 MERGED (#204 recipe_version, CI caught a type bug → fixed at root). A4 MERGED (#205 registry loader + Bastrop frozen row + TxGIO matrix in _land_records). A5 MERGED (#206 R7 at primitive bake, updated existing unmapped-adjacency test to R7 invariant). A7 MERGED (#374 ldt performance ledger fields, migration 0064; agent hand-back had a fixture-drift paren mismatch → I fixed + re-verified green).
- LESSON: verify-against-live-CI caught 2 real defects the local/agent checks missed: A3 envAtom intersection-type (needed recipeVersion? in the cast); A7 CHECK-constraint canonical-paren fixture drift (Postgres emits triple-paren). Both fixed at root, never forced.
- A6 DEFERRED (determinism content-hash): the 3 emitters hash sha256(JSON.stringify(instance)) INCLUDING extractedAt timestamps woven through readContract/consequence → two rewarms of same content hash differently. Real but LATENT (only bites at rewarm-compare, Phase C+). Delicate (touches atom identity/dedup semantics across 3 emitters + shared helper). Scoped as a CAREFUL follow-up, not rushed into a 7-lane session (operator: slow down / be a stickler). Design: a provenance-excluding canonical hash (strip extractedAt/warmAt/assembledAt/assertedAt/promotedAt), preserve different-content→different-hash. NEXT session or dedicated.
- GATE A: 6/7 foundation gaps closed. A6 is the one remaining determinism invariant (OPS-3 I2). Phase B (CC factory floor) + Phase C (Bastrop warm) still ahead. Checkpoint handed to operator.

## PHASE A COMPLETE (2026-08-02) — 7/7 lanes merged
- GROUND-TRUTH (2026-08-02): A6 MERGED (#209). contentHashExcludingProvenance on main — the 3 emitters (setback-rule/buildable-envelope/boundary-edge) now hash content-only (strip extractedAt/assembledAt/versionStamp/etc). Full CI suite green = no ripple into existing atom tests. Rewarm-determinism invariant (OPS-3 I2) closed.
- ALL 7 FOUNDATION GAPS CLOSED: A1 memory-reach, A2 cert-reproducible, A3 recipe-version, A4 registry-loader, A5 R7-at-bake, A6 determinism-hash, A7 performance-ledger. Foundation is done.
- PAUSED per operator: Phase B (CC factory floor — multi-panel frontend) + Phase C (Bastrop ~4877-parcel warm + deploys) are large separate efforts, next fresh session.
- NEXT SESSION START HERE: Phase B = wire CC engine console (county ledger reads the new county_facet_coverage perf fields; engine-state panel; freeze-state; cert/R6 view). Phase C = OPS-2 line on Bastrop city district-blocks. Recipe accepted, frame R-FND-1..7 settled, ops docs OPS-0..7 committed, TxGIO registry in _land_records. Stop at operator R6.

## CORRECTION (2026-08-02): the engine agent did NOT orphan — it was slow-but-working
The earlier DEAD-END ("background agents defer instead of executing") was HALF-WRONG. The A7 agent AND the A2-A6 engine agent BOTH actually completed — their first "running in background" notifications were premature status, not orphans. They kept working (~40 min) and delivered correct, full-suite-green builds. I concluded orphan too early (checked once, no branch yet) and rebuilt A2-A6 myself in parallel → my PRs won the merge races, theirs superseded+closed. Outcome correct (no dup code on main, they closed their own PRs) but ~335k tokens duplicate effort. LESSON promoted to durable memory: premature-background-notification-not-orphan. Distinguish orphan-vs-slow by checking over TIME, not once; never run 2 dispatches of the same task list on one main.

## PHASE B COMPLETE (2026-08-02) — factory floor live
- GROUND-TRUTH (2026-08-02): B1 MERGED (ldt #375 county-ledger endpoint GET /api/county-ledger). B2 MERGED (hauska-map #144 CC County Ledger panel, Engines group). B3 DEPLOYED: cortex-api endpoint live on prod (HTTP 200, returns 10 CAPCOG ledger rows, 0 onboarded — correct, no factory run yet); CC deployed to Vercel (command-center-jade-sigma.vercel.app HTTP 200, panel in bundle).
- TRAPS HIT + HANDLED (verify-before-shift earned its keep): (1) :latest-image-race — first cortex canary served SPA HTML for /api/county-ledger (pre-endpoint image raced the push-build); fixed by SHA-pinning deploy to 2fce729b. (2) migration-not-applied — SHA-pinned canary then 500'd (Failed query: county_facet_coverage missing the A7 columns on cortex Neon); fixed by dispatching the SEPARATE run-migrations action (deploy does NOT migrate; migrate is its own workflow_dispatch). THEN 200. Both caught by curling the actual endpoint before shifting traffic, never on deploy-success.
- CC config note: the panel fetches {cortexApiBase}/api/county-ledger; endpoint verified live. Operator can now open CC → Engines → County Ledger and see the (empty) factory floor, ready for Bastrop.
- PHASE B DONE. STOP per operator scope (Phase B this session, Phase C next fresh session).

## PHASE C — IN PROGRESS (2026-08-02 planner pickup)

### C1 DONE — live re-verify + 150-parcel cost dry-run
- GROUND-TRUTH (2026-08-02): engine main @ b90383c4 confirmed; block13-cert-grade.mjs + depth-warm-bastrop-batch.mjs on main.
- GROUND-TRUTH (2026-08-02): GET cortex-api /api/county-ledger HTTP 200, onboardedCount=0 (10 CAPCOG rows).
- GROUND-TRUTH (2026-08-02): retrieval-api /health/search HTTP 200 (functional probe ok).
- GROUND-TRUTH (2026-08-02): CC County Ledger panel in cmdcenter-blush.vercel.app bundle (grep hit).
- LESSON: handoff "both DATABASE_URL+TXGIO on prod-cortex-neon" is WRONG for live infra. Correct split: DATABASE_URL=hauska-prod substrate (atoms, 3.67M rows); TXGIO_DATABASE_URL=hauska CORTEX_DATABASE_URL overlay (txgio_parcel 74,729 for 48021; county_facet_coverage 30 rows).
- LESSON: Windows Node v24 needs NODE_OPTIONS=--use-system-ca for BCAD ArcGIS fetch (UNABLE_TO_VERIFY_LEAF_SIGNATURE without it).
- C1 cost re-measure (150 city-bbox cohort, --force-repromote): extrapolatedJurisdictionUsd=0.0267 vs $200 gate — CLEAR. msPerParcel=626. Failure map: verifyPass 16, verifyFail 4, no-setback-row 127 (PDD/conditional), superseded 2, front-orientation-unresolved 1.
- OPEN: city cohort script uses BASTROP_CITY_BBOX (17,217 txgio rows) NOT layer-23 CITY='BASTROP' (~6,972) — prose gap for onboard(fips).
- OPEN: substrate zoning-fact district mix differs from Phase 1 layer-23 analysis (SF-1 2290 vs 2469).

### C3 SF-1 cert — BLOCK FAIL (STOP)
- GROUND-TRUTH (2026-08-02): bastrop-district-cert-grade.mjs area-sweep on SF-1 rosterSize=2286, exit code 1 (~54 min wall).
- Diagnosis: mix of fresh 1444 promotes (this run) + ~842 prior depth-warm promotes with STALE setback numbers (e.g. 48021:31009 served F30/S10 vs layer-23 F25/S5). Cert correctly fail-closed.
- STOP per recipe: do NOT advance to GC/MU/RR until SF-1 block re-warmed to single recipe_version 1.0.0 cohort + full re-sweep PASS.
- OPEN: warm batch does not upsert county_facet_coverage → CC ledger still envelope 0% for 48021.
- OPEN: engine script patches (--district-prefix, quarantine, bastrop-district-cert-grade.mjs) local only — PR to main owed before production factory claim.



## PHASE C — STOP at SF-1 cert (2026-08-02) — GOOD stop, real defect caught
- GROUND-TRUTH (2026-08-02): SF-1 warm ran 27min: processed 2285, promoted 1444 recipe-1.0.0, 783 verify-fail (34%), declines no-setback-row 26 + superseded-prop-id 32. Cost gate CLEARS ($0.0267/juris). Mechanical cert FAILED (exit 1): SF-1 roster is MIXED-VINTAGE — 2288 SF-1 promoted envelopes but only 1444 carry recipeVersion=1.0.0; ~844 are stale depth-warm-promoted-v1 from pre-Phase-C warms serving OLD setbacks (F30/S10/R30 layer-83) vs layer-23 authority (F25/S5/R25). This is R10 persisted!=recompute at scale — --force-repromote only overwrote verify-passers, left stale residue.
- HANDOFF ERRORS I MADE (corrected by planner, now captured): (1) DB env — I said "both URLs on cortex Neon"; LIVE = substrate atoms on hauska-prod DATABASE_URL, txgio_parcel + county_facet_coverage on CORTEX_DATABASE_URL. (2) City boundary — the batch uses BASTROP_CITY_BBOX (17,217 txgio rows) NOT layer-23 CITY='BASTROP' (~6,972) — the cohort was over-broad. (3) Windows BCAD ArcGIS TLS needs NODE_OPTIONS=--use-system-ca.
- LEDGER-WRITE-PATH MISSING (my Phase B gap): warm promotes atoms to substrate but NEVER upserts county_facet_coverage on cortex Neon → CC County Ledger stays 0%/not-onboarded even after 1444 promotes. I built the console to READ a ledger the warm doesn't WRITE. Phase D mechanism.
- DELIVERABLE 2 DONE: 90_operations/PHASE_C_mechanism_vs_prose_SPEC.md — 9 self-enforcing mechanisms + 10 prose-interpreted gaps + 2 refactors. This IS the Phase D input.
- DECISIONS (operator 2026-08-02): (a) SF-1 unblock = force-overwrite ALL SF-1 regardless of prior marker → single vintage → re-sweep; 783 verify-fails → honest-decline. (b) Fix SF-1 + wire the ledger-write-path (county_facet_coverage upsert per block) NOW; defer full onboard(fips) generalization to Phase D. (c) ADDED: diagnose the 783 fail-class distribution FIRST (34% is high — if systematic bug, overwrite just re-fails).
