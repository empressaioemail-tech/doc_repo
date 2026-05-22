---
id: 2026-05-21_cc-agent-C_ldt_cleanup_batch
title: Dispatch — cc-agent-C legacy-design-tools cleanup batch (QA-15, QA-26, flaky lib/codes CI)
date: 2026-05-21
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [43_cortex_qa_backlog, 00_current_state, 20_agent_operating_rules]
---

# cc-agent-C dispatch — legacy-design-tools cleanup batch

> **COMPLETE 2026-05-21.** Delivered as PR #68, merged. QA-15 (`headerNotifications` at all 14 plan-review `DashboardLayout` call sites), QA-26 (root `.gitattributes`), and the flaky `lib/codes` CI timeout (30s `testTimeout` on the three slow files) all shipped. Next: [`2026-05-21_cc-agent-C_codex_phase2_reviewer_surfaces.md`](2026-05-21_cc-agent-C_codex_phase2_reviewer_surfaces.md).

You are cc-agent-C. This dispatch clears three small, ungated hygiene items in `legacy-design-tools`. All are logged, all in one repo, one PR. It runs before the Codex Phase 2 reviewer-surfaces dispatch.

## Activation gate

Fires now. PR #66 (codex-reviewer-qa scaffold) merged to `main` on 2026-05-21, merge commit `1236b3f`. Re-orient your clone onto `main` and pull before branching.

## Scope — three items, one PR

1. **QA-15 — plan-review header bell.** WSB.5 made the shared `Header` component's notifications prop-driven; `plan-review` never opted in, so its header bell stopped rendering. Wire `plan-review` to pass `headerNotifications` (or whatever the shared `Header` now expects) so the bell renders again. Match how `design-tools` already opts in rather than inventing a new pattern.
2. **QA-26 — root `.gitattributes`.** `legacy-design-tools` has `core.autocrlf=true` and no root `.gitattributes`, producing recurring phantom CRLF diffs and empty stashes that have bitten multiple cc-agent sessions. Add a root `.gitattributes` that normalizes line endings (`* text=auto eol=lf`, with binary-file carve-outs as needed). A full repo-wide `git add --renormalize` is out of scope here: it is pure churn that would make this PR unreviewable. If a renormalize is warranted, flag it in your report as a separate standalone PR.
3. **Flaky `lib/codes` CI timeouts.** The `lib/codes` `queue` / `orchestrator` / `bootstrap` test files run ~15-23s against a 10s per-test `testTimeout`, so they tip over under CI-runner load and intermittently fail unrelated PRs (most recently PR #66's first run, clean on re-run). Raise the `testTimeout` for those test files, or speed the tests up if the slowness is obviously fixable. The goal is a CI run that does not flake on these three files.

## Out of scope

- QA-24 (stale `api-server` Cloud Run service) and QA-25 (orphaned `EMPRESSA_DATABASE_URL` secret): operator infra decommissions, not repo code. Leave them.
- A full repo-wide line-ending renormalize, per item 2 above.

## Verification

typecheck green; CI green. CI (Linux) is authoritative for the test suite: the Windows workstation cannot run the vitest/esbuild toolchain. Verify on the CI run ID. For the flaky-CI item specifically, confirm the `lib/codes` `queue` / `orchestrator` / `bootstrap` files pass on CI.

## Run posture

Operator-supervised. Open one PR for review. Do not self-deploy.

## Workspace ownership

cc-agent-C's `legacy-design-tools` clone. Branch under `cleanup/*`. cc-agent-AC is concurrently running the `@workspace/empressa-atom` retirement in its own clone `P:\ldt-ac-qa17`; the root `.gitattributes` here does not overlap cc-agent-AC's package files, and whichever of the two PRs merges second simply rebases. If you enter a working directory and see another agent's uncommitted changes, stop and surface to the planner.

## Reporting

At every session break-point, write your session summary to `P:\doc_repo\_inbox\` as `<date>_legacy-design-tools_cc-agent-C_<topic>.md` per HR-11 in [`20_agent_operating_rules.md`](../20_agent_operating_rules.md). Do not commit to the doc repo. Keep the durable record in your own repo.

## Next

On merge, proceed to [`2026-05-21_cc-agent-C_codex_phase2_reviewer_surfaces.md`](2026-05-21_cc-agent-C_codex_phase2_reviewer_surfaces.md).
