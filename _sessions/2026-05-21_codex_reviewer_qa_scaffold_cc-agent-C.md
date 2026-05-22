---
date: 2026-05-21
agent: cc-agent-C
repo: legacy-design-tools
session_type: execute
rolled_up: true
rolled_up_into: [48_codex_program_plan, 11_roadmap, 00_current_state]
---

> Filed by the doc_repo planner from the cc-agent-C `_inbox/` courier
> drop per HR-11. PR #66 verified **OPEN** via `gh pr view 66`
> (`state: OPEN`, `mergeable: MERGEABLE`, `mergeStateStatus: CLEAN`,
> commit `ba2a121`). CI run `26264777599` (`PR Checks`) `conclusion:
> success`, `headSha` matches `ba2a121`. **Awaiting operator merge.**
> The flaky `lib/codes` CI-timeout finding (section below) is rolled
> into `00_current_state.md` §6 as a watch item.

# CDX-Phase1-1 — codex-reviewer-qa artifact scaffold

## Outcome

The `codex-reviewer-qa` artifact scaffold is built and open as **PR #66**
(`codex-reviewer-qa/scaffold` → `main`, commit `ba2a121`, 17 files
+524/−2). CI is green; PR is `MERGEABLE` / `mergeStateStatus: CLEAN` —
**awaiting operator review/merge**. Operator-supervised: nothing
self-deployed. This resolves the build half of CDX-Phase1-1 and
advances M-CodexQA.

## What was built

A new sixth artifact, `artifacts/codex-reviewer-qa/`, per the decision
record `2026-05-21_codex_reviewer_qa_surface_location.md` — a dedicated
reviewer-side QA surface, separate from `plan-review` (architect-side
window) and `qa` (test harness).

- Vite + React + Tailwind SPA mirroring `plan-review`'s build
  conventions: `vite.config.ts` / `vitest.config.ts` / `tsconfig.json`,
  `dist/public` output, base path `/codex-reviewer-qa/`, and the
  `.replit-artifact/artifact.toml` every artifact carries
  (localPort 19592, distinct from the existing five).
- App shell (`App.tsx`) with the `QueryClientProvider` + wouter router
  wired up front, so the Phase 2 reviewer surfaces register as
  `<Route>`s with no re-plumbing.
- A routable placeholder page (`ReviewerQaHome`), a 404, a vitest
  smoke test, and the jest-dom test setup.
- Minimal dependency set — only what the scaffold uses (16 devDeps; no
  shadcn `ui/` tree). Phase 2 adds deps as its pages need them.

## Wiring into build + serving

- **Dockerfile** — the new SPA builds alongside `design-tools` /
  `plan-review` / `qa`.
- **api-server `mountSpaStatic`** — added to `SUBPATH_SPAS`, served at
  `/codex-reviewer-qa`.
- `pnpm-workspace.yaml`'s `artifacts/*` glob auto-registers the
  package; `pnpm install` added the `pnpm-lock.yaml` importer entry
  (lockfile diff +54/−0 — pure additions, no other package's
  resolution moved). Root `tsconfig.json` references only `lib/*`, so
  no root-config change was needed.

## Decision-relevant findings

**1. L-surface client deferred to Phase 2 — deliberate scope call.**
The dispatch notes the artifact will consume cortex-api's in-process
L-surface (not the MCP server). That path is confirmed available — the
L-routes exist on api-server and `@workspace/api-client-react` is the
generated client `plan-review`/`design-tools` already use. The
scaffold's placeholder page is static, so `@workspace/api-client-react`
is NOT a dependency yet — the Phase 2 dispatch adds it with the first
data-bound page. The `QueryClientProvider` foundation it needs is
already in the shell. Recording so it is not read as an omission.

**2. Flaky `lib/codes` CI timeouts — pre-existing, not from this PR.**
PR #66's first Test run failed 3 `lib/codes` tests
(`bootstrap`/`orchestrator`/`queue`), all `Test timed out in 10000ms`,
with `socket hang up` / `ECONNRESET` noise elsewhere in the run. This
PR does not touch `lib/codes` (lockfile diff +54/−0; `lib/codes` was
125/125 on PR #63's CI). Re-running the failed job passed `lib/codes`
125/125. Confirmed flaky. The underlying fragility is real, though:
`lib/codes`'s `queue`/`orchestrator`/`bootstrap` test FILES run
~15–23s against a 10s per-test `testTimeout`, so they tip over under
CI-runner load. Worth a planner ticket to raise those tests'
`testTimeout` or speed them up — it will keep flaking unrelated PRs.

## Verification

- `pnpm run typecheck` — green locally (all 32 workspace projects,
  including the new artifact; the api-server `spaStatic.ts` change
  compiles).
- Build + vitest could not run on the Windows workstation (missing
  win32 native binaries + SSL proxy blocks fetching them — same
  documented limitation as the 2026-05-21 QA-18/QA-22 sessions).
- **CI (Linux) is authoritative** — run `26264777599`: Typecheck pass;
  Test pass on re-run, `artifacts/codex-reviewer-qa` **2/2** (1 file),
  `lib/codes` 125/125, zero failures workspace-wide.

## State / handoff

- PR #66 `MERGEABLE` / `CLEAN` — awaiting operator merge.
- Out of scope and untouched: the reviewer surface functionality —
  CDX-3 (one-click review), CDX-4 (accept/edit/reject loop), CDX-5
  (jurisdiction switcher), CDX-9 (comment-letter draft) — Phase 2 of
  `48_codex_program_plan.md` and a later dispatch.
- This was the last dispatch in cc-agent-C's teed-up queue: the Cortex
  QA close-out (PRs #59-62), QA-22 Part 1 (#63), and this scaffold
  (#66) are all complete.
