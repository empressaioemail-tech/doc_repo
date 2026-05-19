---
id: 2026-05-18_eval_harness_cc-agent-EVAL
title: Session — eval harness scaffold + durable assets (cc-agent-EVAL)
date: 2026-05-18
agent: cc-agent-EVAL
repo: legacy-design-tools
session_type: dispatch_execution
related: [2026-05-18_cc-agent-EVAL_eval_harness, 2026-05-18_plan_review_engine_inventory_cc-agent-PR, 42_design_accelerator_program_plan, 49_code_ingestion_pipeline, 40a_customer_zero_observations_arena_roja_2026_05_06]
---

# Eval harness scaffold + durable assets

Executed [dispatch 2026-05-18_cc-agent-EVAL](../_dispatches/2026-05-18_cc-agent-EVAL_eval_harness.md) in `legacy-design-tools`. Branched off `docs/empressa-atom-rename-hauska-atom-contract` (kept that branch's 12 unrelated modified test files unstaged); work landed on new branch `feat/eval-harness`. No push — gated on Nick's go per session protocol.

## Scope landed (per Nick's "ship durable assets only" decision)

After surveying the codebase + reading the priority docs, surfaced three blockers that gated the full dispatch from completing (see Blockers section). Nick directed: ship durable assets only. The following landed on `feat/eval-harness`:

**Schema** (file-only — no DB push, no fixture drift refresh):

- [lib/db/src/schema/evalRuns.ts](../../legacy-design-tools/lib/db/src/schema/evalRuns.ts) — one row per `pnpm eval run`. Mirrors `finding_runs` shape (engagement-scoped, state machine, error column) plus cost + duration aggregates.
- [lib/db/src/schema/evalScores.ts](../../legacy-design-tools/lib/db/src/schema/evalScores.ts) — per-component score, free-text `componentKey` so new rubric components land via code change + baseline-recapture rather than migration.
- [lib/db/src/schema/evalBaselines.ts](../../legacy-design-tools/lib/db/src/schema/evalBaselines.ts) — unique-per-(fixture, component) baselines for regression detection.
- Re-exported via [lib/db/src/schema/index.ts](../../legacy-design-tools/lib/db/src/schema/index.ts).

**lib/eval package** (new workspace package, `@workspace/eval`):

- [src/rubric.ts](../../legacy-design-tools/lib/eval/src/rubric.ts) — **the durable asset.** Pure scoring functions for the v1 rubric: `citation-validity`, `citation-accuracy` (LLM-graded), `finding-recall`, `finding-precision` (sample-for-review, no auto-score), `retrieval-top3/section-number/cross-ref`, `latency-*-p50/p95/p99` for each engine, `cost-per-finding-run`, `cost-per-jurisdiction`. Plus `RUBRIC_CATALOG` mapping each key to label + orientation + default regression threshold.
- [src/types.ts](../../legacy-design-tools/lib/eval/src/types.ts) — `RubricComponentKey`, `FixtureGroundTruth`, `RunnerSample`, `AnthropicCallRecord`, etc.
- [src/fixtures/](../../legacy-design-tools/lib/eval/src/fixtures/) — Musgrave + Seguin (matching seeded engagement/submission ids); Arena Roja R1 as a placeholder with `placeholder: { blocker }` so the runner halts rather than scoring against an empty ground-truth array.
- [src/runners/](../../legacy-design-tools/lib/eval/src/runners/) — `findingEngine.ts`, `briefingEngine.ts`, `retrieval.ts`. Build engine inputs from DB, force `mode: "anthropic"`, capture per-call latency + Anthropic spend via the instrumented client.
- [src/instrumentedClient.ts](../../legacy-design-tools/lib/eval/src/instrumentedClient.ts) — **wraps an Anthropic SDK client** (does NOT modify `@workspace/integrations-anthropic-ai`). Intercepts `messages.create`, captures `usage.input_tokens / output_tokens / model / duration_ms`, computes `costUsd` from a per-model price table.
- [src/db.ts](../../legacy-design-tools/lib/eval/src/db.ts) — eval-table CRUD with baseline upsert + regression-threshold logic.
- [src/aggregator.ts](../../legacy-design-tools/lib/eval/src/aggregator.ts) — pure transform from runner samples → per-component scores → `FixtureRunResult`.
- [src/cli.ts](../../legacy-design-tools/lib/eval/src/cli.ts) — `pnpm eval run | baseline | report` with lazy-import so `--help` and `report` work without Anthropic env vars.
- [src/__tests__/rubric.test.ts](../../legacy-design-tools/lib/eval/src/__tests__/rubric.test.ts) — 21 unit tests pinning every scorer + percentile arithmetic + catalog coverage.
- [README.md](../../legacy-design-tools/lib/eval/README.md) — operator setup, rubric component table, portability notes for hauska-engine.

**CI**:

- [.github/workflows/eval.yml](../../legacy-design-tools/.github/workflows/eval.yml) — runs eval-package typecheck + rubric unit tests on every PR touching engine code, eval code, or schema. The full `eval run --all` job is scaffolded (commented) at the bottom; uncomment once the prerequisites land.

**Root tsconfig**: added `{ path: "./lib/eval" }` so the project-references graph picks up the new package.

## What I did not do (and why)

Per Nick's decision and the dispatch's "stop and report on blockers" rule, the following were deferred:

- **`pnpm --filter @workspace/db run push`** — `DATABASE_URL` not set in this environment. The three eval tables don't exist in any DB yet.
- **`pnpm --filter @workspace/db run test:fixture:schema`** — same blocker. Schema fixture template at [lib/db/src/__tests__/__fixtures__/schema.sql.template](../../legacy-design-tools/lib/db/src/__tests__/__fixtures__/schema.sql.template) will fail `test:fixture:drift` once the push lands until it's regenerated.
- **Arena Roja R1 seed.ts entry** — fixture is a placeholder until SCA comments land + a `seed.ts` engagement entry is approved (see Blockers).
- **Baseline capture run** — needs DB tables + Anthropic env vars + a successful `pnpm eval run --all`. Would burn real Anthropic spend on first call; Nick should authorize that explicitly.
- **PR-comment scorecard step** — depends on baselines existing.

## Blockers

**B1 — Arena Roja R1 ground-truth comments missing from doc_repo.** [40a_customer_zero_observations_arena_roja_2026_05_06.md](../40a_customer_zero_observations_arena_roja_2026_05_06.md) documents Claude.ai's *limitations* observed while working through the 11 SCA comments, but does not contain the verbatim comment text. The 2026-05-06 planner session ([_sessions/2026-05-06_doc_repo_planner.md](2026-05-06_doc_repo_planner.md)) is about handoff prep, not Arena Roja — grep for `setback|egress|stair|guard|R30|R31` returns zero matches. The fixture is wired with a `placeholder` block so the runner halts cleanly instead of scoring against an empty array.

**B2 — Workstation env unprovisioned.** `DATABASE_URL`, `AI_INTEGRATIONS_ANTHROPIC_API_KEY`, `AI_INTEGRATIONS_ANTHROPIC_BASE_URL`, `OPENAI_API_KEY` all unset. Consequences: no DB push, no baseline capture, no engine call. The CLI's `run` subcommand checks for these explicitly and fails fast with a clear message.

**B3 — Local vitest broken pre-existing on Windows.** [pnpm-workspace.yaml:111-135](../../legacy-design-tools/pnpm-workspace.yaml) excludes the `@rollup/rollup-win32-x64-msvc` binary via the overrides block, so vitest cannot start on this workstation. Sanity-checked `pnpm --filter @workspace/finding-engine run test` and it fails with the same `Cannot find module @rollup/rollup-win32-x64-msvc` error — confirming the issue is pre-existing and environmental, not introduced by this work. **Eval typecheck (`pnpm --filter @workspace/eval run typecheck`) passes cleanly.** Tests will run in CI's Linux runner.

## What scored well / badly

No scores captured — see B2. The rubric is implemented and unit-tested; it has not yet been pointed at the real engine.

**Predicted from the dispatch + recon §35:**

- `citation-validity` should score high — the engine already emits `invalidCitations` and discards malformed findings per Phase 1A's discard rule ([engine.ts:104-117](../../legacy-design-tools/lib/finding-engine/src/engine.ts#L104-L117)). The signal is already healthy; the rubric just exposes it.
- `retrieval-cross-ref` will score near zero — the legacy engine has no `code-cross-reference` graph traversal per the recon. **This is by design**: the rubric component exists to quantify the gap so design-fresh work in `hauska-engine` has a target.
- `retrieval-section-number` will likely miss `1010` on the Seguin fixture (IBC) since the loaded corpus is IRC-focused. Surfaces the corpus-depth gap from `27_engine_evolution_plan.md` Stream D / DA-DA-3.
- `cost-per-finding-run` is unknowable without running, but the instrumented client + Sonnet 4.5 price table mean the number will be honest the first time the eval runs.

## Recommended next dispatches

- **EVAL-2 — DB-side bring-up** (smallest, do this first). Once Nick can set `DATABASE_URL`: run `pnpm --filter @workspace/db run push` to create the three eval tables, `test:fixture:schema` to refresh the drift template, commit the fixture refresh. ~15 min when the env is up.
- **EVAL-3 — Arena Roja R1 ground-truth landing**. Nick provides (or points at) the 11 SCA comments from SCA Job #20260205-0052. Convert to 11 `ExpectedFinding` entries in `arenaRojaR1.ts`; remove the `placeholder` block; extend `seed.ts` with the engagement + a placeholder submission. ~1-2 hours depending on whether category/severity classification is obvious from the comment text or needs Nick's call.
- **EVAL-4 — Baseline capture + CI activation**. Provision Anthropic + DB env vars. Run `pnpm eval run --all`, inspect, `pnpm eval baseline --all`. Commit baselines. Uncomment the `eval-baseline-comparison` job in `.github/workflows/eval.yml`. First scorecard PR comment goes live. Burns real Anthropic spend — get explicit go.
- **EVAL-5 — LLM-graded citation accuracy**. `citation-accuracy` scorer takes a pre-computed accuracy array; the runner doesn't yet call Claude to grade citations. Add an `accuracyJudge.ts` that posts each (finding, citation) pair to Claude Sonnet 4.5 with a yes/no rubric. Bumps per-fixture cost meaningfully — keep behind a `--with-accuracy-judge` flag.
- **Forward to cc-agent-E**: when `hauska-engine` is ready to absorb the durable assets, [rubric.ts](../../legacy-design-tools/lib/eval/src/rubric.ts), [types.ts](../../legacy-design-tools/lib/eval/src/types.ts), and [fixtures/](../../legacy-design-tools/lib/eval/src/fixtures/) port directly. Runners + DB + CLI stay behind (legacy-engine-specific).

## Coordination notes

- **cc-agent-AC, cc-agent-E, cc-agent-M**: no overlap. Eval consumed existing 19-atom registry surfaces; touched zero atom-contract or engine-internal code.
- **cc-agent-UI dispatches**: no overlap (eval is engine-side).
- **Active high-velocity files** ([recon §58](2026-05-18_plan_review_engine_inventory_cc-agent-PR.md)): touched **zero** of them. The instrumented client wrapper is additive in `lib/eval/`, not a modification of `lib/integrations-anthropic-ai/src/client.ts`. The engines accept the wrapped client via their existing `anthropicClient` option.

## Commits

One commit on `feat/eval-harness`:

- `feat(eval): scaffold @workspace/eval harness + schema (durable assets only)` — adds `lib/eval/` package, three schema files + index export, root tsconfig reference, CI workflow (warn-only scaffold), pnpm-lock.yaml refresh. Touches 14 files. Push gated on Nick's go.

No commit to `doc_repo` — this session summary lands as part of the same review pass.

## Open verification

- Eval-package typecheck: passes (verified locally: `pnpm --filter @workspace/eval run typecheck`).
- Rubric unit tests: not verified locally (B3 — Windows vitest blocked); will run in CI on first PR.
- Schema syntax: verified by drizzle's own TS types (typecheck catches column-name typos, FK refs, index shape).
- Runners: typecheck only — first real invocation gated on B2 + DB tables.
