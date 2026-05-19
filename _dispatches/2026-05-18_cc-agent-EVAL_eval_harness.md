---
id: 2026-05-18_cc-agent-EVAL_eval_harness
title: Dispatch — cc-agent-EVAL eval harness for the plan-review engine
date: 2026-05-18
agent: cc-agent-EVAL
repo: legacy-design-tools
kind: dispatch
related: [42_design_accelerator_program_plan, 49_code_ingestion_pipeline, 40_design_accelerator, 40a_customer_zero_observations_arena_roja_2026_05_06, 27_engine_evolution_plan, 10_ground_truth, 80_adrs/adr_001_atom_architecture, _sessions/2026-05-18_plan_review_engine_inventory_cc-agent-PR]
---

# Eval harness for the plan-review engine

You are cc-agent-EVAL. You operate in `P:\legacy-design-tools` and are authorized to read `P:\doc_repo` for canonical specs. **This dispatch ships code** — unlike the two read-only recons (cc-agent-UI, cc-agent-PR) that preceded it, you build a real workspace package, schema migrations, fixture files, a CLI, and CI wiring.

## Why this exists

The 2026-05-18 plan-review engine recon at `P:\doc_repo\_sessions\2026-05-18_plan_review_engine_inventory_cc-agent-PR.md` found that the engine is **real but shallow**: ingestion works end-to-end, atoms get persisted, the finding-engine produces output — but there is no eval, no regression coverage, and `finding_runs.invalidCitationCount` is the only quality signal that gets recorded today, and nothing consumes it. The five active test projects (Musgrave, Seguin, Arena Roja R1, Alexander 404, Balsley, Dart Frog) have **zero captured eval coverage**.

[`42_design_accelerator_program_plan.md`](P:\doc_repo\42_design_accelerator_program_plan.md) §Phase 2 defines QA-readiness as Nick being able to run a real Moab project end-to-end and structurally evaluate every output. That gating is impossible without an eval harness. The recon flagged this dispatch as **the single highest-leverage Phase 2 unlock**.

**Strategic frame.** The legacy engine will eventually be factored out to `hauska-engine` per [ADR-008](P:\doc_repo\80_adrs\adr_008_engine_factor_out.md). The eval harness's runner plumbing will move with it; the **rubric design and the test-project fixture canon are durable assets that should outlive the legacy engine**. Build them once, port them later. Do not optimize for the legacy engine's quirks at the expense of portability.

## Read first

In order:

1. `P:\doc_repo\CLAUDE.md` — operating instructions; structural commitments (especially #1 reasoning chain + source citation + confidence + timestamp; #3 cost-per-jurisdiction).
2. `P:\doc_repo\42_design_accelerator_program_plan.md` §QA readiness milestone — the 8-point definition. Items 1, 2, 3 are engine-driven and evaluable now. Items 4-7 are L1-L6 gated. Item 8 ("find bugs") IS the eval.
3. `P:\doc_repo\_sessions\2026-05-18_plan_review_engine_inventory_cc-agent-PR.md` — the full engine recon. Especially:
   - §35 (finding-engine production stage) and the surrounding finding-emission stages
   - §Recommended dispatch shape → Dispatch C
   - §Side-intel for cc-agent-E (so your durable assets map onto what cc-agent-E will port)
   - §47 Anthropic API call sites, §48 Output parsing, §49 LLM error handling — all of these need cost + latency capture as a side-effect of this work
4. `P:\doc_repo\40_design_accelerator.md` §Active test projects + §Atom graph + the just-updated §External services + §Hauska Engine (mode-aspirational note matters — your eval scores against ONE code path serving both modes today).
5. `P:\doc_repo\40a_customer_zero_observations_arena_roja_2026_05_06.md` — **the load-bearing ground-truth source for Arena Roja R1.** The 11 outstanding SCA review comments documented here are known-good findings the engine should surface from the same input. This is your most concrete ground-truth set.
6. `P:\doc_repo\49_code_ingestion_pipeline.md` §B.4 retrieval index plus eval — the canonical eval semantics already designed for `hauska-engine`. Quality bar targets: 90% top-3 retrieval, 100% section-number lookup, 95% cross-reference resolution, recalibrate-after-10. **Your rubric should be a subset of these, scoped to what the legacy engine can answer today, with placeholder slots for the rest.**
7. `P:\doc_repo\27_engine_evolution_plan.md` — atom registry context. Note Bump 1 status (gated on cc-agent-AC); your rubric should NOT depend on Bump 1 atoms (no `sheet-content-extraction`, `attached-document`, `detail-callout-spec`, `product-spec-reference`, `response-task`, `deliverable-letter` scoring yet).
8. `P:\doc_repo\80_adrs\adr_001_atom_architecture.md` — four atom layers; every finding the engine emits must honor identity + context + composition + history. Your citation-validity rubric grounds in this.
9. `P:\doc_repo\10_ground_truth.md` — current state. HEAD, schema state on helium dev (note `snapshot_ifc_files` missing locally per [10_ground_truth.md:330](P:\doc_repo\10_ground_truth.md#L330) — relevant if your eval touches IFC-bearing projects).

Then survey this repo:

10. `lib/finding-engine/src/types.ts:195-223` — `invalidCitationCount` and `discardedFindings` are already emitted; the aggregator on top of them is one of your deliverables.
11. `lib/finding-engine/src/index.ts` and `prompt.ts` — entry point + prompt structure.
12. `lib/briefing-engine/src/` — briefing-engine entry + types; you also score briefing quality.
13. `lib/codes/src/retrieval.ts` and `embeddings.ts` — retrieval entry; you score retrieval directly (top-3, section-number, cross-reference per 49 §B.4).
14. `lib/db/src/schema/findingRuns.ts:54-124` — existing `finding_runs` table.
15. `lib/db/src/seed.ts` — confirm which test projects are seeded.
16. `lib/integrations-anthropic-ai/` — Anthropic SDK wrapper; you'll add per-request `usage` and `duration_ms` capture here.
17. Root `package.json` + `pnpm-workspace.yaml` — workspace shape.
18. Existing CI workflows under `.github/workflows/` — your eval CI integrates with the existing ones, not duplicates them.
19. `git log --oneline -50` — recent engine velocity; coordinate with PLR-* and V1-* sprint vocabulary in commit messages.

## Scope

Build an MVP eval harness — code, schema, CLI, CI, and baseline scorecards. Five deliverables:

### Deliverable 1: New workspace package `lib/eval/`

Standard pnpm workspace package shape. README at root explaining what it does and how to run it. TypeScript-only.

Suggested module layout (adapt to existing conventions):

- `src/rubric.ts` — Rubric definitions + scoring functions. Pure functions. No DB or LLM dependencies. **This is the most durable asset; design for portability to `hauska-engine`.**
- `src/fixtures/` — One file per test project: `musgrave.ts`, `seguin.ts`, `arenaRojaR1.ts`. Each fixture captures: engagement ID (or stable lookup key), expected findings (from ground-truth source), expected briefing structure, expected retrieval results for canonical queries. Ground-truth is sourced from `40a_customer_zero_observations_arena_roja_2026_05_06.md` (Arena Roja) and `seed.ts` + memory (Musgrave, Seguin — light-weight; primary signal comes from Arena Roja).
- `src/runners/findingEngine.ts` — Wraps `generateFindings()` in prod-mode, captures result + usage + latency, scores against rubric.
- `src/runners/briefingEngine.ts` — Same shape for `generateBriefing()`.
- `src/runners/retrieval.ts` — Wraps `retrieveAtomsForQ()` with a canonical query set per jurisdiction.
- `src/aggregator.ts` — Reads from `finding_runs` + new `eval_runs` table; produces summary view (top-3 score, citation validity, latency P50/P95/P99, cost per run).
- `src/cli.ts` — Operator CLI entry point.
- `src/db.ts` — Schema + queries (or imported from `@workspace/db`).
- `__tests__/` — Unit tests for rubric scoring functions (the durable asset must be test-covered).

### Deliverable 2: Schema migrations

Three new tables in `lib/db/src/schema/`:

- `eval_runs` — One row per eval run. Columns: `id`, `engagementId`, `fixtureKey`, `engineVersion` (commit hash), `startedAt`, `completedAt`, `status` (`running` | `completed` | `failed`), `totalCostUsd`, `totalDurationMs`, `triggerSource` (`manual` | `ci` | `scheduled`).
- `eval_scores` — Per-rubric-component score per run. Columns: `id`, `evalRunId`, `componentKey` (`citation-validity`, `finding-precision`, `finding-recall`, `retrieval-top3`, `retrieval-section-number`, `retrieval-cross-ref`, `latency-p99-finding`, `cost-per-finding`, ...), `score` (numeric 0-1 or absolute depending on component), `scoreUnit` (`fraction` | `ms` | `usd` | `count`), `passedThreshold` (boolean), `details` (JSON for component-specific evidence).
- `eval_baselines` — Snapshot baselines for regression detection. Columns: `id`, `fixtureKey`, `componentKey`, `baselineScore`, `regressionThreshold` (e.g., 0.05 = 5% score drop is regression), `lastUpdated`, `commitHash` (engine commit when baseline was captured).

Drizzle migration in `lib/db/drizzle/`. Add to `lib/db/src/schema/index.ts` exports. Update `check-fixture-drift.sh` template if it covers schema parity.

### Deliverable 3: Test-project fixture canon

Three fixtures for v1:

1. **Musgrave Residence** — primary canonical. Confirmed in `seed.ts`. Grand County IRC. Use real engagement + snapshot IDs from `seed.ts`. Ground-truth findings: light-weight — focus on retrieval correctness (does the engine pull the right code sections when prompted with a parcel briefing?) + citation validity (every emitted citation resolves to a real code-section atom in the corpus).

2. **Seguin Residence** — secondary. Confirmed in `seed.ts`. Same shape as Musgrave but independent jurisdiction-shared run to surface non-determinism across two projects in the same code corpus.

3. **Arena Roja R1** — **load-bearing ground-truth project**. NOT confirmed in `seed.ts` per [40_design_accelerator.md:51](P:\doc_repo\40_design_accelerator.md#L51) — seed it as part of this dispatch (DA-1 stream item in 42 was scoping this; you can complete it here). The 11 outstanding SCA review comments from `40a_customer_zero_observations_arena_roja_2026_05_06.md` are your **finding-recall ground-truth**: each comment is a known-good finding the engine should surface. Score recall = (engine-surfaced findings ∩ ground-truth findings) / |ground-truth findings|.

Defer Alexander 404, Balsley, Dart Frog — needs `SELECT` against deployment Neon to verify presence (DA-1 stream); separate dispatch if needed.

### Deliverable 4: Rubric components (v1 scope)

Implement these scoring components. Each is a pure function in `rubric.ts` that takes engine output + fixture ground-truth and returns a score 0-1 (or absolute value with unit).

| Component | Type | Sources |
|---|---|---|
| `citation-validity` | fraction | Already partly captured via `finding_runs.invalidCitationCount` per [recon §35](P:\doc_repo\_sessions\2026-05-18_plan_review_engine_inventory_cc-agent-PR.md). Score = `1 - (invalidCitations / totalCitations)`. |
| `citation-accuracy` | fraction | Harder. LLM-graded for v1 (Claude Sonnet 4.5 judges: "does this citation actually support the finding's claim?"). Mark in fixtures as `requiresHumanReview: true` for high-stakes findings. |
| `finding-recall` | fraction | (engine-surfaced findings ∩ ground-truth findings) / |ground-truth findings|. Per fixture. Most concrete on Arena Roja R1. |
| `finding-precision` | fraction | Inverse — track engine-surfaced findings NOT in ground-truth set as candidate-false-positives. For v1, surface count + sample for human review; do not auto-score (no human-zero reviewer cycle in CI). |
| `retrieval-top3` | fraction | Per [49 §B.4](P:\doc_repo\49_code_ingestion_pipeline.md): query → retrieval → check top-3 contains expected atom. Run against a canonical query set per jurisdiction. |
| `retrieval-section-number` | fraction | Per 49 §B.4: section-number lookup. 100% target. |
| `retrieval-cross-ref` | fraction | Per 49 §B.4: cross-reference resolution. 95% target. **Note:** the recon found the legacy engine has no graph traversal of `code-cross-reference` edges — this component is expected to score low; it surfaces the gap for the design-fresh work in `hauska-engine`. |
| `latency-finding-p50/p95/p99` | ms | Per-finding-run wall-clock latency. Captured from runner. |
| `latency-briefing-p50/p95/p99` | ms | Same shape for briefing-engine. |
| `latency-retrieval-p50/p95/p99` | ms | Same for retrieval. |
| `cost-per-finding-run` | usd | Sum of Anthropic `usage.input_tokens * input_price + usage.output_tokens * output_price` per run. **Capture via a wrapper in `lib/integrations-anthropic-ai/`** (small intervention; if you scope it, document the diff).|
| `cost-per-jurisdiction` | usd | Aggregation over all eval runs scoped to a jurisdiction. Surfaces structural-commitment-#3 enforcement signal. |

Deferred components (out of scope for v1, slot reserved in schema):

- `mode-budget-conformance` — depends on mode separation being real (design-fresh in `hauska-engine`).
- `geometric-reasoning-accuracy` — depends on rules layer + BIM geometry being built (design-fresh).
- `sheet-content-extraction-fidelity` — depends on structured-extraction atom being shipped (Bump 1 gated).
- `bim-model-symmetry` — depends on bim-model fix landing (Bump 1).

### Deliverable 5: CI wiring + baseline capture

GitHub Actions workflow at `.github/workflows/eval.yml`:

- Triggered on PR touching `lib/finding-engine/**`, `lib/briefing-engine/**`, `lib/codes/**`, `lib/eval/**`, or any DB schema files.
- Runs `pnpm eval run --all --ci` against all three fixtures.
- For v1: **warn-only mode**. Posts PR comment with scorecard. Does NOT gate merge. (Gate when baselines are stable and signal is trusted; that's a follow-on.)
- Stores per-run summary as a GitHub Actions artifact for the PR.

Baseline capture:

- `pnpm eval baseline --all` command captures current scores as `eval_baselines` rows.
- Run once at end of this dispatch to establish initial baselines. Commit the seed migration that loads them.

## Architecture sketch


                ┌─────────────────────────────────────────────┐
                │  CLI: pnpm eval ...                          │
                │  - run <fixture>                             │
                │  - run --all                                 │
                │  - baseline <fixture>                        │
                │  - report <evalRunId>                        │
                │  - regression <evalRunId>                    │
                └────────────────────┬────────────────────────┘
                                     ▼
        ┌────────────────────────────────────────────────────┐
        │  src/runners/                                       │
        │   ├─ findingEngine.ts ─► lib/finding-engine         │
        │   ├─ briefingEngine.ts ─► lib/briefing-engine       │
        │   └─ retrieval.ts ─► lib/codes/retrieval            │
        └────────────────────┬───────────────────────────────┘
                             ▼
        ┌────────────────────────────────────────────────────┐
        │  src/rubric.ts (pure functions; no IO)              │
        │   - citationValidity(findings, corpus)              │
        │   - findingRecall(findings, ground-truth)           │
        │   - retrievalTop3(query, expected, actual)          │
        │   - ...                                             │
        └────────────────────┬───────────────────────────────┘
                             ▼
        ┌────────────────────────────────────────────────────┐
        │  Postgres: eval_runs + eval_scores + eval_baselines │
        │             + (read) finding_runs for invalidCitn   │
        └────────────────────┬───────────────────────────────┘
                             ▼
        ┌────────────────────────────────────────────────────┐
        │  src/aggregator.ts ─► CLI report                    │
        │                       CI scorecard                  │
        └────────────────────────────────────────────────────┘


## Coordination — parallel-safety

- **cc-agent-AC** (`hauska-atom-contract` repo): no overlap. Eval harness consumes existing 19-atom registry. Do not edit `lib/empressa-atom/` or `artifacts/api-server/src/atoms/registry.ts`.
- **cc-agent-E** (`hauska-engine` repo): no repo overlap. Your rubric.ts and fixtures.ts are durable assets that cc-agent-E will port (or you/a follow-on dispatch will port). Comment liberally on why each rubric component exists so context survives the port. Avoid coupling rubric scoring to legacy-engine-specific quirks where possible.
- **cc-agent-M** (`hauska-mcp-server` repo): no repo overlap.
- **cc-agent-UI** dispatch shapes (UI-1 through UI-4): no overlap. Eval is engine-side; UI dispatches are frontend.
- **Active engine velocity in legacy-design-tools**: the recon §58 found high commit velocity in `artifacts/api-server/src/` + `lib/finding-engine/` + adjacent packages (~30 commits in last 2 months). Rebase frequently against main. If a hot patch lands during your dispatch, prioritize a clean merge over a fast ship.

## Out of scope

- Bump-1-atom-dependent eval (sheet-content-extraction, attached-document, response-task, deliverable-letter, detail-callout-spec, product-spec-reference). Gated on cc-agent-AC.
- BIM geometry accuracy. Engine has no geometric reasoning yet per the recon — nothing to evaluate. Logged for design-fresh in `hauska-engine`.
- Mode budget conformance (incremental <5s vs full-pass 30-120s). Per [40](P:\doc_repo\40_design_accelerator.md) mode distinction is gated — one code path serves both. Slot reserved in schema; do not implement.
- Rule-engine eval. There is no rule engine to evaluate per recon §29-33. Logged for design-fresh.
- L4 (Revit content push) and L5 (ICC-ES verification) eval — gated atoms.
- Bim-model atom symmetry fix per [42](P:\doc_repo\42_design_accelerator_program_plan.md) DA-BIM-Symmetry — that's a separate Bump-1-window fix; eval can score against it once it lands but should not implement it.
- Eval against deployment Neon. Run against helium dev DB (or whichever local-development DB your repo conventions point at). Production eval is a follow-on dispatch.
- Documentation rewrites of 40/42/47 — those landed in commit `61048d0`. Don't re-touch.

## Done criteria

- `lib/eval/` workspace package exists, lints, typechecks, tests pass.
- Three fixture files: Musgrave, Seguin, Arena Roja R1. Arena Roja R1 also seeded in `seed.ts`.
- Three schema tables: `eval_runs`, `eval_scores`, `eval_baselines`. Drizzle migration applied to helium dev. `check-fixture-drift.sh` template updated if relevant.
- v1 rubric components from the table above implemented; deferred components have schema slots but no scoring code.
- CLI commands work: `pnpm eval run <fixture>`, `pnpm eval run --all`, `pnpm eval baseline <fixture>`, `pnpm eval report <evalRunId>`.
- Anthropic SDK wrapper captures `usage.input_tokens`, `usage.output_tokens`, `duration_ms` per call. Cost components computable from these.
- GitHub Actions workflow runs eval on PRs in warn-only mode; posts scorecard as PR comment.
- Baselines captured for all three fixtures at end of dispatch. `eval_baselines` rows committed.
- Three sample scorecards in `lib/eval/baselines/` showing the v1 state (this is the deliverable Nick can read to understand current engine quality).
- Session summary at `P:\doc_repo\_sessions\2026-05-18_eval_harness_cc-agent-EVAL.md` includes: top-line scorecard, list of components that scored badly + why, list of components that scored well + why, recommended next dispatches (e.g., "retrieval-cross-ref scored 0/N — Engine-B from the recon dispatch shape unblocks this").

## Method discipline

- **Code changes scoped to listed surfaces.** Do not refactor `lib/finding-engine` or `lib/briefing-engine` internals. Wrap, don't modify. The Anthropic SDK wrapper change is the only "real" code change; everything else is additive (new package, new schema, new CLI).
- **Pure functions in `rubric.ts`.** No IO. No DB. No LLM calls. Pure deterministic scoring. This is what makes rubric.ts portable to `hauska-engine`.
- **Mock-aware.** Per recon: every analytical surface defaults to mock. Your eval must force prod-mode via env. Document this in the README.
- **Cost-honest.** Every run records actual Anthropic spend. The `cost-per-jurisdiction` aggregator is the structural-commitment-#3 enforcement signal — get it right.
- **Portable, not maximally-optimized.** Where there's a choice between elegance-for-legacy and portability-to-hauska-engine, choose portability.

## Session protocol

Per `P:\doc_repo\CLAUDE.md`. Session close lands `_sessions/2026-05-18_eval_harness_cc-agent-EVAL.md` in doc_repo plus commits to `legacy-design-tools`. Two commits expected:

1. `legacy-design-tools`: the eval harness, schema, fixtures, CLI, CI workflow, baselines.
2. `doc_repo`: session summary + 00 bump.

Tag your `legacy-design-tools` commits per repo convention (looks like Task #XXX / PLR-N / V1-N from recent log; pick a series or coordinate with Nick). Push gated on Nick's explicit go per session protocol.

If you hit a blocker (env var missing, schema conflict, test project not seedable, etc.), stop and report. Do not improvise around it — the eval harness's value is correctness, not speed.
