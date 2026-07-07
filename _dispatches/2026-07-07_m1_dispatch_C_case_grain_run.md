# CURSOR_TASK — M1-C: K2 edition-correct retrodiction (Austin+SA) + M1 Measurement A/B at CASE grain

> Planner note (2026-07-07): dispatch AFTER engine dispatch E (`feat/m1-wave4-edition-ingest`) MERGES — this run consumes the post-ingest corpus snapshot. Survey preconditions verified 2026-07-07: Wave-4 edition-bundle fuel in GCS (three cities + tables + summary), backtest fuel in GCS (Austin permits 2.36M-row CSV + variance/BOA; SA variance + permits CSVs; Bastrop scrape ~2 rows), zero code-amendment atoms pre-E, F1 atom-grain attribution ABSENT, F2 consequence metadata ABSENT in ldt. Paste this file as CURSOR_TASK.md into a FRESH legacy-design-tools clone.

You are in a FRESH clone of legacy-design-tools (empressaioemail-tech/legacy-design-tools) on
main. Read AGENTS.md first — it binds you (worktree discipline, no self-merges, gh CLI is NOT
available in this repo; the PR is opened from the URL `git push -u` prints).

## Conventions (non-negotiable)
- Branch: `feat/m1-case-grain-run`. Push to origin IMMEDIATELY after the first commit and after
  every subsequent commit. Never commit this CURSOR_TASK.md; if it slips in, remove it
  (`chore: remove CURSOR_TASK.md`) before idling.
- PR title: `feat(m1): edition-correct K2 retrodiction + case-grain Measurement A/B run`.
  Do NOT merge. CI (.github/workflows/pr-checks.yml) is authoritative.
- EXIT-BOUNDED verification only. No dev servers, no vitest watch mode. The FULL ldt test suite
  needs DATABASE_URL (CI provisions its own Postgres) — do NOT attempt it locally. Run only the
  targeted package suites named below; they are pure units and need no DB.
- Blocked on dispatch E: this run consumes the hauska-engine corpus snapshot AFTER the Wave-4
  edition/amendment ingest merges there. The snapshot path is provided at run time (env var);
  if the snapshot you are given has zero code-amendment atoms, STOP and report — do not proceed
  with a stale snapshot.

## The case-grain rule (VERBATIM from P:\doc_repo\_decisions\2026-06-22_m1_grain_case_recalibration.md — binding)
"M1 returned a rework signal. Committed direction: recalibrate the earning loop to earn at the
case/prediction grain (where outcomes land), attribute the earned signal to atoms via citation
lineage, and read confidence at a grain-adaptive grain (per-atom where dense,
section-family/citation-graph/class-within-jurisdiction where sparse, hierarchical partial
pooling). The earn bar (W_target) is decision-relative, not a uniform 0.2. Then re-run M1
against this model."
Conditions, also verbatim:
"A. Calibration provenance distinguishes pooled-applied from own-earned, so pooling never
presents an unearned atom as earned (commitment 2).
B. Family pooling draws only anonymous and public-tier signal; tenant-private adjudications
calibrate within their partition only (ADR-005/017, I5)."
Scope, verbatim: "Structural and citation-graph pooling is buildable now; consequence-class
pooling waits on the held ICC ingest. Re-run scoped to structural/citation-graph pooling first."

## Context you cannot discover
- The FIRST M1 run (scripts/src/runM1K2Harness.ts) used the WRONG grain: per-atom independent
  Beta, closureSize hard-coded 1, and FABRICATED sparse query weights (buildSparseQueryWeights —
  also duplicated at lib/calibration-engines/src/m1/corpusLoader.ts:125-132). Its Step-2
  matchRate produced the 0.898 Austin / 0.723 SA numbers. It is evidence of where the code
  lives, NOT a spec to copy.
- The case-grain machinery already exists post-decision; you are extending it, not rebuilding:
  - lib/calibration-engines/src/m1/caseGrain.ts (caseSignalsFromDeposits:56,
    buildLineageBuckets:87, observedCaseAdjudicationRate:114, caseMatchRate:122)
  - lib/calibration-engines/src/m1/pooledRead.ts (readAllAtomsAtSupportedGrain:275 — the
    grain-adaptive read; provenance carries readGrain + signalSource)
  - lib/calibration-engines/src/m1/measurementAv2.ts (runMeasurementAv2:91; accepts baseLambda
    at :100-104 but HARD-CODES lambdaSource:"cold-start-prior" at :47 and :193 — this is the
    seam you extend)
  - lib/calibration-engines/src/m1/measurementAReframe.ts (runThreeMetricM1:124 — the
    adjudication-weighted-slice metric; Measurement-B deferred slot at :273-282)
  - lib/calibration-engines/src/m1/invalidation.ts (effectiveLambda:63,
    computeSectionDependentsClosure:27), constants.ts (W_TARGET_RANKING=0.35,
    MEASUREMENT_A_TARGET=0.7, MIN_DENSE_SIGNAL=3, PUBLIC_PARTITION)
  - lib/calibration-engines/src/k2/ (retrodiction.ts: K2BacktestDepositRow:22 with
    payload.calibrationProvenance:"backtest" and outcomeDisposition; runRetrodictionCase:228;
    editionResolve.ts / localEditionResolve.ts; normalizeOutcome.ts; permitPartition.ts)
  - Prior harnesses: scripts/src/runM1K2Harness.ts, runK2V3Harness.ts, runM1v3Harness.ts,
    runM1ThreeMetricHarness.ts (run scripts measure:* in scripts/package.json)
- HARD-CODED PATHS TRAP: the prior harnesses hard-code
  P:/hauska-engine/services/retrieval-api/corpus/snapshot.json, P:/legacy-design-tools/_inbox,
  and C:\Users\cente\google-cloud-sdk\bin\gcloud.cmd. Your clone is NOT at those paths.
  Parameterize: CORPUS_SNAPSHOT_PATH, CALIBRATION_OUT_DIR (default ./artifacts/calibration-runs),
  GCLOUD_BIN (workstation register in AGENTS.md). Keep defaults backward-compatible.
- GCS fuel (all verified live 2026-07-07):
  - Edition tables: gs://hauska-calibration-raw/edition-bundle/{austin_tx,san_antonio_tx}/edition-effective-date-table.json
  - Austin BOA/variance: gs://hauska-calibration-raw/backtest/austin_tx/variance/open_data/acquired=2026-06-21/data/board_of_adjustment_cases.csv
  - SA BOA/variance: gs://hauska-calibration-raw/backtest/san_antonio_tx/variance/open_data/acquired=2026-06-21/data/board_of_adjustment_cases.csv
  - Austin permits (2.36M rows, stream — see runK2V3Harness.ts streamAustinPermits):
    gs://hauska-calibration-raw/backtest/austin_tx/permit/open_data/acquired=2026-06-21/data/issued_construction_permits.csv
  - SA permits: gs://hauska-calibration-raw/backtest/san_antonio_tx/permit/open_data/acquired=2026-06-21/data/permits_issued_{2020_2024,current}.csv
  - Bastrop: edition map exists but ~2 outcome rows — EXCLUDED from this run's earning; say so in the output.

## Honest-input rules (binding; a run that violates these is a failed run)
1. NEVER fabricate a missing input. Specifically:
   - q (query frequency per atom): F1 atom-grain read attribution DOES NOT EXIST yet (verified).
     Run uniform q and label it `solved-for (F1 atom-grain attribution unavailable; only
     tool/finding-grain telemetry exists)`. Delete or hard-disable the fabricated
     buildSparseQueryWeights path in corpusLoader.ts (make "available" mode throw unless real
     weights are passed in). The 05 spec explicitly requires this flag.
   - lambda: consume dispatch E's amendment atoms from the snapshot. Compute jurisdiction x
     code-family edition-bump hazard from the code-amendment atoms (10 expected across the three
     cities) and pass it as baseLambda; extend the result types so lambdaSource honestly reports
     `amendment-history (jurisdiction-family grain, edition-bump events)` vs
     `cold-start-prior` — per-SECTION lambda remains cold-start (no ordinance-to-section mapping
     in the fuel) and must be labeled so. Fix the hard-coded literal at measurementAv2.ts:47/:193.
   - a (adjudication-and-outcome rate): observed from K2 deposits where they exist; solve-for-a
     elsewhere (the v1 solve-for machinery in m1/measurementA.ts is the reference for solve-for
     mode). Label each per-granularity row `observed` or `solved-for`.
2. Every deposit row carries payload.calibrationProvenance:"backtest" and the K3-grade
   outcomeDisposition (issued-clean / with-condition / denied / withdrawn / unknown) — never
   collapse to binary.
3. Label the match-rate honestly: runRetrodictionCase (k2/retrodiction.ts:266-270) derives
   predictionMatched from the outcome label (any approved/issued/variance outcome counts as
   matched). Until a real substrate-prediction comparison exists, the output MUST caption match
   rate as `outcome-label heuristic — approval-rate proxy, not substrate-prediction comparison`.
   Do not silently "improve" the predictor; that is out of scope this run.
4. Conditions A and B are enforced in code already (pooledRead provenance; PUBLIC_PARTITION
   pooling). Do not weaken them; assert them in tests.

## Work items
1. Path/env parameterization of the harness inputs (see trap above) + a `--fixtures` mode that
   runs the whole pipeline against lib/calibration-engines/src/__fixtures__/
   k2-backtest-outcome-rows.json so the logic is testable with zero GCS/network access.
2. Lambda seam: new m1 util (e.g. m1/lambdaFromAmendments.ts) that reads code-amendment atoms
   out of the snapshot and returns { group, rate, amendmentCount, observationYears, source }
   compatible with hauska-engine's tools/f8-hazard-report.mjs output; thread it through
   runMeasurementAv2 / runThreeMetricM1 with the honest lambdaSource labels (rule 1).
3. q honesty per rule 1 (disable fabricated weights; uniform-q labeled solved-for).
4. New harness scripts/src/runM1CaseGrainHarness.ts (`measure:m1-case-grain` in
   scripts/package.json), composed from the existing k2 + m1 modules:
   a. K2: load edition tables (Wave-4), normalize Austin+SA variance/BOA + stream Austin
      local-evaluable permits (partition per permitPartition.ts; I-Code-dependent rows stay
      pending-icc, never retrodicted), retrodict edition-correct (edition in effect AT the case
      date), write deposits JSON to CALIBRATION_OUT_DIR with provenance=backtest.
   b. Measurement A: runThreeMetricM1 per city — adjudication-weighted slice + corpus-uniform,
      three invalidation granularities (whole-edition / section-scoped /
      section-plus-dependents), observed-a from deposits, solve-for-a where unobserved,
      case-grain earning + pooled read per the decision record.
   c. Measurement B: emit the deferred slot AS the spec output — F2 consequence metadata does
      not exist in this repo (verified); the slot must state highConsequenceAtomCount, the
      W_actuation bar, and that the permanently-asserted tail is currently the WHOLE corpus
      pending F2/ICC. Never invent strata.
   d. Output report (markdown to _inbox/ per prior harness precedent) MUST open with an
      input-provenance table: every input row labeled observed / solved-for / normalized /
      unavailable — lambda (amendment-history at family grain / cold-start at section grain),
      q (unavailable -> uniform solved-for), a (observed backtest for Austin+SA; unavailable
      Bastrop), consequence stratum (unavailable), match-rate caveat (rule 3), Bastrop exclusion,
      SA permit-fuel notes.
5. Tests (pure units in @workspace/calibration-engines, no DB):
   - lambdaFromAmendments: 4 adoption events over a ~12.6y window -> rate ≈ 0.32/yr at family
     grain, source "amendment-history"; zero amendments -> 0.02 cold-start.
   - lambdaSource label propagates into MeasurementAv2Result / ThreeMetric result.
   - "available" queryWeightMode without real weights throws.
   - fixtures-mode harness end-to-end: deposits carry calibrationProvenance=backtest +
     outcomeDisposition; Condition A provenance classes present; Measurement B slot deferred.

## Verification (all exit-bounded; CI authoritative)
- pnpm --filter @workspace/calibration-engines test     (vitest run; pure units, no DATABASE_URL)
- pnpm --filter @workspace/scripts typecheck
- pnpm run typecheck                                    (the exact CI command — AGENTS.md)
- Fixtures-mode harness run: pnpm --filter @workspace/scripts run measure:m1-case-grain -- --fixtures
  (must exit 0 and print the input-provenance table)
- Do NOT run the full repo test suite locally (needs DATABASE_URL; CI provisions Postgres).
- Do NOT run the real GCS-backed harness yourself unless gcloud auth is confirmed in your clone;
  the planner executes the real run and reads the generated artifacts (a committed "report" that
  presents failed-query zeros as data is a known failure mode — the artifact, not the code, is
  the deliverable of the real run).
