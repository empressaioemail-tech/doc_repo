---
date: 2026-05-21
agent: cc-agent-C
repo: legacy-design-tools
session_type: execute
rolled_up: true
rolled_up_into: [43_cortex_qa_backlog, 00_current_state]
---

> Filed by the doc_repo planner from the cc-agent-C `_inbox/` courier
> drop per HR-11. PR #68 verified **OPEN** via `gh pr view 68`
> (`state: OPEN`, `mergeable: MERGEABLE`, `mergeStateStatus: CLEAN`,
> commit `f78e7b0`). Both CI runs pass — `26265985375` (`PR Checks`)
> and `26265985376` (`Eval`), `conclusion: success`, `headSha` matches
> `f78e7b0`. **Awaiting operator merge; gates cc-agent-C dispatch 2
> (Codex Phase 2).** Not an 11_roadmap item, so only `43` and
> `00_current_state.md` rolled.

# legacy-design-tools cleanup batch — QA-15, QA-26, flaky lib/codes CI

## Outcome

The three-item cleanup batch is built and open as **PR #68**
(`cleanup/ldt-cleanup-batch` → `main`, commit `f78e7b0`, 18 files
+68/−0). CI is green; PR is `MERGEABLE` / `mergeStateStatus: CLEAN` —
**awaiting operator review/merge**. Operator-supervised: nothing
self-deployed.

This is dispatch 1 of a two-dispatch sequence. Dispatch 2 (Codex
Phase 2 reviewer surfaces, CDX-3/4/5) is gated on PR #68 merging and
has **not** been started — see "Next" below.

## What shipped

**QA-15 — plan-review header bell.** WSB.5 made the shared portal-ui
`Header` notification bell prop-driven (`headerNotifications`);
plan-review never opted in, so its bell stopped rendering. Added
`headerNotifications={{ href: "/requests" }}` to every plan-review
`DashboardLayout` call site — **14 of them** (the pages plus the two
`permissions.tsx` access-denied / loading screens). The bell links to
`/requests` (Outstanding Requests, plan-review's reviewer pending-work
surface).

**QA-26 — root `.gitattributes`.** `* text=auto eol=lf` plus binary
carve-outs (images, fonts, pdf, glb, wasm, …). LF is stored in the
repo and checked out everywhere, overriding a clone's `core.autocrlf`
and ending the recurring phantom-CRLF diffs / content-empty stashes.

**Flaky lib/codes CI.** The `queue` / `orchestrator` / `bootstrap`
Postgres integration tests intermittently timed out under CI-runner
load (10s per-test default). Each of the three files now widens its
own budget via `vi.setConfig({ testTimeout: 30_000, hookTimeout:
30_000 })`; the other five lib/codes test files keep the strict 10s.

## Decision-relevant findings

**1. plan-review has no app shell — QA-15 touched 14 sites, not 1.**
design-tools opts into the header bell once, in its `AppShell`.
plan-review has no equivalent — every page renders `DashboardLayout`
directly with `navGroups={useNavGroups()}` + the brand props repeated.
So QA-15 needed the prop at all 14 call sites. Per the dispatch ("use
the existing pattern, don't invent a new one"), I did NOT introduce a
plan-review shell component — but the duplication is real and a
`PlanReviewShell` wrapper would be the right future cleanup. Flagging
for the backlog; out of scope here.

**2. QA-26 renormalize is low-urgency.** No repo-wide `git add
--renormalize .` was run (the dispatch put it out of scope as
unreviewable churn). Observed while committing: the repo's committed
blobs are *already* LF — the 17 touched files diff as pure additions,
no line-ending churn. So `core.autocrlf` was only ever corrupting
working copies, not the stored history; `.gitattributes` alone closes
the gap going forward. A renormalize PR is optional, not needed for
correctness.

**3. `@hauska/atom-contract` — re-`pnpm install` after pulling main.**
First local typecheck failed with `Cannot find module
'@hauska/atom-contract'` across api-server. Root cause: stale
`node_modules`. cc-agent-AC's PRs #65 (atom-contract import migration)
and #67 (`@workspace/empressa-atom` retirement) landed on `main` and
changed dependencies; pulling main without `pnpm install` left
node_modules behind. `pnpm install` synced it (lockfile already
correct, "downloaded 0") and typecheck went green. Not a code defect —
but any agent re-orienting onto post-#65/#67 `main` must `pnpm install`
after the pull.

## Verification

- `pnpm run typecheck` — green locally (all artifacts + libs).
- Build + vitest could not run on the Windows workstation (missing
  win32 native binaries + SSL proxy — same documented limitation as
  the prior 2026-05-21 sessions).
- **CI (Linux) is authoritative** — run `26265985375`/`26265985376`:
  Typecheck pass, Test pass, Rubric unit tests pass. The flaky-CI item
  is confirmed fixed: `lib/codes` **125/125** (8 files), with
  `bootstrap.test.ts` / `orchestrator.test.ts` / `queue.test.ts` all
  green (2.6s / 4.8s / 5.0s this run — the 30s budget is headroom for
  loaded runs).

## Next

Dispatch 2 — Codex Phase 2 reviewer surfaces (CDX-3/4/5) on the #66
`codex-reviewer-qa` scaffold — is gated on PR #68 merging and is
**not started**. It resumes (re-orient onto `main`, pull, branch under
`codex-reviewer-qa/*`) once the operator merges #68.
